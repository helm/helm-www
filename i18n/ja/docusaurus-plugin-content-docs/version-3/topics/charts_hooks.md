---
title: Chart Hook
description: chart hook の使い方を説明します。
sidebar_position: 2
---

Helm は、chart 開発者が release のライフサイクルの特定のポイントに介入できる _hook_ メカニズムを提供します。たとえば、hook を使用して以下のことができます:

- インストール時に他の chart がロードされる前に ConfigMap や Secret をロードする。
- 新しい chart をインストールする前にデータベースをバックアップする Job を実行し、アップグレード後にデータを復元する 2 番目の Job を実行する。
- release を削除する前に Job を実行し、サービスをローテーションから graceful に切り離してから削除する。

hook は通常のテンプレートと同じように機能しますが、Helm が異なる方法で利用するための特別なアノテーションを持っています。このセクションでは、hook の基本的な使用パターンを説明します。

## 利用可能な Hook

以下の hook が定義されています:

| アノテーション値 | 説明                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `pre-install`    | テンプレートがレンダリングされた後、Kubernetes にリソースが作成される前に実行されます             |
| `post-install`   | すべてのリソースが Kubernetes にロードされた後に実行されます                                    |
| `pre-delete`     | 削除リクエスト時、Kubernetes からリソースが削除される前に実行されます                           |
| `post-delete`    | 削除リクエスト時、release のすべてのリソースが削除された後に実行されます                        |
| `pre-upgrade`    | アップグレードリクエスト時、テンプレートがレンダリングされた後、リソースが更新される前に実行されます |
| `post-upgrade`   | アップグレードリクエスト時、すべてのリソースがアップグレードされた後に実行されます              |
| `pre-rollback`   | ロールバックリクエスト時、テンプレートがレンダリングされた後、リソースがロールバックされる前に実行されます |
| `post-rollback`  | ロールバックリクエスト時、すべてのリソースが変更された後に実行されます                          |
| `test`           | Helm test サブコマンドが実行されたときに実行されます（[テストのドキュメント](/topics/chart_tests.md)を参照） |

_注: `crd-install` hook は Helm 3 で `crds/` ディレクトリに置き換えられ、削除されました。_

## Hook と Release ライフサイクル

hook を使用すると、chart 開発者は release ライフサイクルの戦略的なポイントで操作を実行できます。たとえば、`helm install` のライフサイクルを考えてみましょう。デフォルトでは、ライフサイクルは以下のようになります:

1. ユーザーが `helm install foo` を実行します
2. Helm ライブラリの install API が呼び出されます
3. いくつかの検証の後、ライブラリが `foo` テンプレートをレンダリングします
4. ライブラリが結果のリソースを Kubernetes にロードします
5. ライブラリが release オブジェクト（およびその他のデータ）をクライアントに返します
6. クライアントが終了します

Helm は `install` ライフサイクルに対して 2 つの hook を定義しています: `pre-install` と `post-install` です。`foo` chart の開発者が両方の hook を実装した場合、ライフサイクルは以下のように変更されます:

1. ユーザーが `helm install foo` を実行します
2. Helm ライブラリの install API が呼び出されます
3. `crds/` ディレクトリ内の CRD がインストールされます
4. いくつかの検証の後、ライブラリが `foo` テンプレートをレンダリングします
5. ライブラリが `pre-install` hook の実行を準備します（hook リソースを Kubernetes にロード）
6. ライブラリが hook を weight でソートし（デフォルトは weight 0）、次にリソース kind、最後に名前の昇順でソートします
7. ライブラリが最も低い weight の hook から順にロードします（負から正へ）
8. ライブラリが hook が「Ready」になるまで待機します（CRD を除く）
9. ライブラリが結果のリソースを Kubernetes にロードします。`--wait` フラグが設定されている場合、ライブラリはすべてのリソースが ready 状態になるまで待機し、ready になるまで `post-install` hook を実行しません。
10. ライブラリが `post-install` hook を実行します（hook リソースをロード）
11. ライブラリが hook が「Ready」になるまで待機します
12. ライブラリが release オブジェクト（およびその他のデータ）をクライアントに返します
13. クライアントが終了します

hook が ready になるまで待機するとはどういう意味でしょうか？これは hook で宣言されたリソースによって異なります。リソースが `Job` または `Pod` kind の場合、Helm は正常に完了するまで待機します。hook が失敗すると、release は失敗します。これは _ブロッキング操作_ であり、Job の実行中は Helm クライアントが一時停止します。

その他のすべての kind では、Kubernetes がリソースをロード済み（追加または更新）としてマークした時点で、そのリソースは「Ready」と見なされます。hook で多くのリソースが宣言されている場合、リソースは順次実行されます。hook weight がある場合（以下を参照）、weight 順に実行されます。Helm 3.2.0 以降、同じ weight を持つ hook リソースは、通常の非 hook リソースと同じ順序でインストールされます。それ以外の場合、順序は保証されません。（Helm 2.3.0 以降ではアルファベット順にソートされていました。ただし、この動作は拘束力があるとは見なされておらず、将来変更される可能性があります。）hook weight を追加し、weight が重要でない場合は `0` に設定することが推奨されます。

### hook リソースは対応する release で管理されない

hook が作成するリソースは、現在のところ release の一部として追跡または管理されません。Helm が hook が ready 状態に達したことを確認すると、hook リソースはそのまま残されます。対応する release が削除されたときの hook リソースのガベージコレクションは、将来の Helm 3 で追加される可能性があります。そのため、削除されてはならない hook リソースには `helm.sh/resource-policy: keep` アノテーションを付ける必要があります。

実際には、hook でリソースを作成した場合、`helm uninstall` でそのリソースを削除することはできません。このようなリソースを破棄するには、hook テンプレートファイルに[カスタムの `helm.sh/hook-delete-policy` アノテーションを追加する](#hook-削除ポリシー)か、[Job リソースの TTL（Time To Live）フィールドを設定する](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/)必要があります。

## Hook の記述

hook は、`metadata` セクションに特別なアノテーションを持つ Kubernetes マニフェストファイルです。テンプレートファイルであるため、`.Values`、`.Release`、`.Template` の読み取りを含む、すべての通常のテンプレート機能を使用できます。

たとえば、`templates/post-install-job.yaml` に保存されている以下のテンプレートは、`post-install` で実行される Job を宣言しています:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

このテンプレートを hook にしているのは、以下のアノテーションです:

```yaml
annotations:
  "helm.sh/hook": post-install
```

1 つのリソースで複数の hook を実装できます:

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

同様に、特定の hook を実装するリソースの数に制限はありません。たとえば、Secret と ConfigMap の両方を pre-install hook として宣言できます。

subchart が hook を宣言している場合、それらも評価されます。トップレベルの chart が subchart で宣言された hook を無効にする方法はありません。

hook の weight を定義して、決定論的な実行順序を構築できます。weight は以下のアノテーションで定義します:

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

hook weight は正または負の数値ですが、文字列として表現する必要があります。Helm が特定の Kind の hook の実行サイクルを開始するとき、それらの hook を昇順でソートします。

### Hook 削除ポリシー

対応する hook リソースをいつ削除するかを決定するポリシーを定義できます。hook 削除ポリシーは以下のアノテーションで定義します:

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

以下の定義済みアノテーション値から 1 つ以上を選択できます:

| アノテーション値       | 説明                                                          |
| ---------------------- | ------------------------------------------------------------- |
| `before-hook-creation` | 新しい hook が起動される前に以前のリソースを削除します（デフォルト） |
| `hook-succeeded`       | hook が正常に実行された後にリソースを削除します                |
| `hook-failed`          | 実行中に hook が失敗した場合にリソースを削除します              |

hook 削除ポリシーアノテーションが指定されていない場合、デフォルトで `before-hook-creation` の動作が適用されます。
