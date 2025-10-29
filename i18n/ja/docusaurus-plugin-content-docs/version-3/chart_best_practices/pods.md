---
title: PodとPodテンプレート
description: チャートマニフェストの、PodとPodテンプレート部分のフォーマットについて説明します。
sidebar_position: 6
---

ベストプラクティスのこの部分では、チャートマニフェストの、PodとPodテンプレート部分の
フォーマットについて説明します。

以下のリソースのリスト（非網羅的）がPodテンプレートを使用します:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## イメージ

コンテナイメージは固定されたタグ、もしくはイメージのSHAを使用するべきです。イメージは`latest`,
`head`,`canary`タグや、その他"浮いている"タグは使用するべきではありません。


イメージは、簡単に入れ替えられるように、`values.yaml`に定義しても _良い_
でしょう。

```yaml
image: {{ .Values.redisImage | quote }}
```

イメージとタグは、それぞれ別のフィールドとして`values.yaml`に定義しても _良い_ でしょう:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create`はデフォルトで以下のようにして、`deployment.yaml`の
`imagePullPolicy`を`IfNotPresent`に設定します:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

そして、`values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

同様に、Kubernetesは`imagePullPolicy`が定義されていない場合、デフォルトで`IfNotPresent`に
設定します。`IfNotPresent`以外の値が必要な場合、単純に`values.yaml`の値を必要な値に更新
してください。

## Podテンプレートはselectorを宣言するべき

全てのPodテンプレートセクションはselectorを指定するべきです。例えば:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

これはセットとPodの関係を作るため、良い慣習です。

しかし、Deploymentのようなセットでは、これはさらに重要になります。これがないと、
_全ての_ ラベルのセットが一致するPodを選択するために使用され、もし、バージョンやリリース日のように、
変化するラベルを使用していた場合、これが壊れることになります。
