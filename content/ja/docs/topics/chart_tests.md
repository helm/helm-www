---
title: "チャートのテスト"
description: "チャートを実行およびテストする方法について説明します。"
weight: 3
---

チャートには、連携して動作するいくつかの Kubernetes リソースとコンポーネントが含まれています。
チャートの作成者は、チャートがインストールされたときにチャートが期待どおりに機能することを検証するテストを作成することができます。
これらのテストは、
チャートの利用者がチャートで何をするかを理解するのにも役立ちます。

Helm チャートの **テスト** は、`templates/` ディレクトリの下にあり、
実行する特定のコマンドを含むコンテナーを指定するジョブ定義です。
テストが成功したと見なされるには、コンテナが正常に終了 (exit 0) する必要があります。
ジョブ定義には、helm テストフックアノテーション `helm.sh/hook: test` が含まれている必要があります。

テストの例:

- values.yaml ファイルの構成が適切に挿入されたことを確認する
  - 正しいユーザー名とパスワードが機能することを確認する
  - 正しくないユーザー名とパスワードが機能しないことを確認する
- サービスが稼働しており、正しく負荷分散されていることを確認する
- など

コマンド `helm test <リリース名>` を使用して、リリースの Helm で事前定義されたテストを実行できます。チャートの利用者にとって、これはチャート (またはアプリケーション) のリリースが期待どおりに機能することを正常性チェックする優れた方法です。

## テストの例

以下は、mariadb チャートの例における Helm テストポッド定義の例です。

```
mariadb/
  Chart.yaml
  README.md
  values.yaml
  charts/
  templates/
  templates/tests/test-mariadb-connection.yaml
```

`wordpress/templates/tests/test-mariadb-connection.yaml` の内容

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}-credentials-test"
  annotations:
    "helm.sh/hook": test
spec:
  template:
    spec:
      containers:
      - name: main
        image: {{ .Values.image }}
        env:
        - name: MARIADB_HOST
          value: {{ template "mariadb.fullname" . }}
        - name: MARIADB_PORT
          value: "3306"
        - name: WORDPRESS_DATABASE_NAME
          value: {{ default "" .Values.mariadb.mariadbDatabase | quote }}
        - name: WORDPRESS_DATABASE_USER
          value: {{ default "" .Values.mariadb.mariadbUser | quote }}
        - name: WORDPRESS_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ template "mariadb.fullname" . }}
              key: mariadb-password
        command: ["sh", "-c", "mysql --host=$MARIADB_HOST --port=$MARIADB_PORT --user=$WORDPRESS_DATABASE_USER --password=$WORDPRESS_DATABASE_PASSWORD"]
      restartPolicy: Never
```

## リリースでテストスイートを実行する手順

1. `$ helm install quirky-walrus mariadb --namespace default`
2. `$ helm test quirky-walrus`

```cli
NAME: quirky-walrus
LAST DEPLOYED: Mon Feb 13 13:50:43 2019
NAMESPACE: default
STATUS: deployed
REVISION: 0
TEST SUITE:     quirky-walrus-credentials-test
Last Started:   Mon Feb 13 13:51:07 2019
Last Completed: Mon Feb 13 13:51:18 2019
Phase:          Succeeded
```

## メモ

- 単一の yaml ファイルで必要なだけテストを定義するか、
  `templates/` ディレクトリ内の複数の yaml ファイルに分散することができます
- より分離するために、テストスイートを `<chart-name>/templates/tests/` のような 
  `tests/` ディレクトリの下にネストすることができます
- テストは [Helm フック](/docs/charts_hooks/)であるため、
  `helm.sh/hook-weight` や `helm.sh/hook-delete-policy` などのアノテーションをテストリソースで使用できます
