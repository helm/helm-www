---
title: Pod と PodTemplate
description: chart マニフェストにおける Pod と PodTemplate 部分のフォーマットについて説明します。
sidebar_position: 6
---

ベストプラクティスガイドのこの部分では、chart マニフェストにおける Pod と PodTemplate 部分のフォーマットについて説明します。

以下のリソース（網羅的ではありません）が PodTemplate を使用します:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## イメージ

コンテナイメージには固定されたタグ、またはイメージの SHA を使用してください。`latest`、`head`、`canary` など、常に最新を指すフローティングタグは使用しないでください。

イメージを `values.yaml` ファイルに定義しておくと、簡単に差し替えられます。

```yaml
image: {{ .Values.redisImage | quote }}
```

イメージとタグを `values.yaml` で別々のフィールドとして定義することもできます:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` は、`deployment.yaml` で以下のように記述することで、`imagePullPolicy` をデフォルトで `IfNotPresent` に設定します:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

`values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

同様に、Kubernetes も `imagePullPolicy` が定義されていない場合、デフォルトで `IfNotPresent` を使用します。`IfNotPresent` 以外の値が必要な場合は、`values.yaml` の値を希望する値に更新してください。

## PodTemplate には selector を宣言する

すべての PodTemplate セクションで selector を指定してください。例:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

selector を指定することで、ワークロードリソースと Pod の関係が明確になり、推奨されるプラクティスです。

Deployment などのワークロードリソースでは、これは特に重要です。selector を指定しないと、**すべての**ラベルが一致する Pod の選択に使用されます。バージョンやリリース日など変化するラベルを使用している場合、意図しない動作を引き起こす可能性があります。
