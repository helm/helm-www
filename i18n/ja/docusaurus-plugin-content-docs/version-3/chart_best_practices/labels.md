---
title: ラベルとアノテーション
description: chart でラベルとアノテーションを使用するためのベストプラクティスを解説します。
sidebar_position: 5
---

ベストプラクティスガイドのこの部分では、chart でのラベルとアノテーションの使い方を説明します。

## ラベルかアノテーションか？

メタデータの項目は、以下の条件に該当する場合はラベルにしてください:

- Kubernetes がリソースを識別するために使用する
- システムへのクエリ目的でオペレータに公開すると便利である

例えば、オペレータが特定の chart のすべてのインスタンスを簡単に検索できるように、`helm.sh/chart: NAME-VERSION` をラベルとして使用することを推奨します。

メタデータの項目がクエリ目的で使用されない場合は、代わりにアノテーションを使用してください。

Helm hook は常にアノテーションです。

## 標準ラベル

以下の表は、Helm chart が使用する一般的なラベルを定義しています。Helm 自体は特定のラベルの存在を必須としていません。REC とマークされたラベルは推奨であり、一貫性のために chart に含める**べき**です。OPT とマークされたラベルは任意です。これらは慣用的に使用されていますが、運用上必須ではありません。

| 名前 | ステータス | 説明 |
|------|---------|------|
| `app.kubernetes.io/name` | REC | アプリ全体を反映する名前です。通常は `{{ template "name" . }}` を使用します。多くの Kubernetes マニフェストで使用されており、Helm 固有ではありません。 |
| `helm.sh/chart` | REC | chart 名とバージョンを設定します: `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}` |
| `app.kubernetes.io/managed-by` | REC | 常に `{{ .Release.Service }}` に設定します。Helm が管理するリソースの検索に使用されます。 |
| `app.kubernetes.io/instance` | REC | `{{ .Release.Name }}` を設定します。同じアプリケーションの異なるインスタンスを区別するのに役立ちます。 |
| `app.kubernetes.io/version` | OPT | アプリのバージョンです。`{{ .Chart.AppVersion }}` を設定できます。 |
| `app.kubernetes.io/component` | OPT | アプリケーション内の役割を示す一般的なラベルです。例: `app.kubernetes.io/component: frontend` |
| `app.kubernetes.io/part-of` | OPT | 複数の chart やソフトウェアが連携して 1 つのアプリケーションを構成する場合に使用します。例: Web サイトを構成するアプリケーションとデータベース。サポートするトップレベルのアプリケーションを設定できます。 |

`app.kubernetes.io` プレフィックスが付いた Kubernetes ラベルの詳細については、[Kubernetes のドキュメント](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)を参照してください。
