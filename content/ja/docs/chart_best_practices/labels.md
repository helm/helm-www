---
title: "ラベルとアノテーション"
description: "チャートの中でラベルとアノテーションを使用するためのベストプラクティスを解説します。"
weight: 5
aliases: ["/docs/topics/chart_best_practices/labels/"]
---

ベストプラクティスのこの部分では、チャートの中でラベルとアノテーションを使用する際の
ベストプラクティスについて議論します。

## ラベルかアノテーションか？

メタデータの項目は以下の条件でラベルにすべきです:

- リソースを特定するためにKubernetesによって使用される場合
- システムに問い合わせをする目的でオペレータに公開すると便利な場合

例えば、オペレータが特定のチャートの全てのインスタンスを便利に見つけられるように、
ラベルとして`helm.sh/chart: NAME-VERSION`を使うことを推奨します。

メタデータの項目が問い合わせの目的で使用されない場合、代わりにアノテーションを
使うべきでしょう。

Helmフックは常にアノテーションです。

## 標準的なラベル

次のテーブルはHelmチャートが使う、共通のラベルを定義しています。Helmそれ自体は
特定のラベルが存在することを必要としません。RECとマークされたラベルは使用を推奨され、
グローバルな一貫性のためにチャートに記述される _べき_ です。
OPTとマークされた項目は任意です。これらは慣用句として、あるいは一般的に使用されているもの
ではありますが、業務上頻繁に使用されるものではありません。

名前|ステータス|説明
-----|------|----------
`app.kubernetes.io/name` | REC | これはアプリ全体を反映した名前であるべきです。一般的には`{{ template "name" . }}`がこのために使われるでしょう。これは多くのKubernetesマニフェストで使用されるものであり、Helm特有のものではありません。
`helm.sh/chart` | REC | これはチャート名とバージョンにすべきです: `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`.
`app.kubernetes.io/managed-by` | REC | これは常に`{{ .Release.Service }}`に設定するべきです。Helmで管理されているものを全て見つけるために使用されます。
`app.kubernetes.io/instance` | REC | これは`{{ .Release.Name }}`にすべきです。 これは、同じアプリケーションの異なるインスタンスを区別するのに役立ちます。
`app.kubernetes.io/version` | OPT | アプリのバージョンで、`{{ .Chart.AppVersion }}`に設定できます。
`app.kubernetes.io/component` | OPT | これはアプリケーション内の違った役割示す共通のラベルです。例、 `app.kubernetes.io/component: frontend`
`app.kubernetes.io/part-of` | OPT |　複数のチャートとソフトウェアが一体となって一つのアプリケーションを構成している場合のラベル。例えば、ウェブサイトを生成するデータベースとアプリケーションソフトウェアなど。これは、対応するトップレベルのアプリケーションにも設定することができます。

Kubernetesの`app.kubernetes.io`プレフィックスが付いたラベルについて、
[Kubernetes
documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)でより詳細な情報を見つけることができます。
