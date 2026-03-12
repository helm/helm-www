---
title: chart のテスト
description: chart のテスト方法について説明します。
sidebar_position: 3
---

chart には、連携して動作する多くの Kubernetes リソースとコンポーネントが含まれています。chart 作成者は、chart がインストールされたときに期待どおりに動作することを検証するテストを作成できます。これらのテストは、chart 利用者が chart の目的を理解するのにも役立ちます。

Helm chart における**テスト**は、`templates/` ディレクトリに配置され、特定のコマンドを実行するコンテナを指定する Job 定義です。テストが成功と判定されるには、コンテナが正常に終了（exit 0）する必要があります。Job 定義には、Helm テスト hook アノテーション `helm.sh/hook: test` を含める必要があります。

Helm v3 より前は、Job 定義に `helm.sh/hook: test-success` または `helm.sh/hook: test-failure` のいずれかの Helm テスト hook アノテーションが必要でした。`helm.sh/hook: test-success` は、`helm.sh/hook: test` の後方互換として引き続き使用できます。

テストの例:

- `values.yaml` ファイルの設定が正しく注入されたことを検証する
  - ユーザー名とパスワードが正しく機能することを確認する
  - 不正なユーザー名とパスワードが機能しないことを確認する
- サービスが稼働しており、正しくロードバランシングされていることを確認する
- など

`helm test <RELEASE_NAME>` コマンドを使用して、release に対して Helm で事前定義されたテストを実行できます。chart 利用者にとって、これは chart（またはアプリケーション）の release が期待どおりに動作することを確認する優れた方法です。

## テストの例

[helm create](/helm/helm_create.md) コマンドは、いくつかのフォルダとファイルを自動的に作成します。Helm テスト機能を試すには、まずデモ用の Helm chart を作成します。

```console
$ helm create demo
```

作成された demo chart の構造は以下のとおりです。

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

`demo/templates/tests/test-connection.yaml` にテストが含まれています。Helm テスト Pod 定義は以下のとおりです:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## release でテストスイートを実行する手順

まず、クラスターに chart をインストールして release を作成します。すべての Pod がアクティブになるまで待つ必要がある場合があります。インストール直後にテストを実行すると、一時的な失敗が発生する可能性があるため、再テストが必要になることがあります。

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## 備考

- 単一の yaml ファイルで複数のテストを定義することも、`templates/` ディレクトリ内の複数の yaml ファイルに分散させることもできます。
- テストスイートをより分離するために、`<chart-name>/templates/tests/` のように `tests/` ディレクトリの下にネストすることもできます。
- テストは [Helm hook](/topics/charts_hooks.md) であるため、`helm.sh/hook-weight` や `helm.sh/hook-delete-policy` などのアノテーションをテストリソースで使用できます。
