---
title: helm
slug: helm
---

Kubernetes 用 Helm パッケージマネージャー

### 概要

Kubernetes 用パッケージマネージャー

Helm の一般的な操作:

- helm search:    chart を検索します
- helm pull:      chart をローカルディレクトリにダウンロードして確認します
- helm install:   chart を Kubernetes にアップロードします
- helm list:      chart の release を一覧表示します

環境変数:

| 名前                               | 説明                                                                                                |
|------------------------------------|------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | キャッシュファイルを保存する別の場所を設定します。                                                      |
| $HELM_CONFIG_HOME                  | Helm 設定を保存する別の場所を設定します。                                                |
| $HELM_DATA_HOME                    | Helm データを保存する別の場所を設定します。                                                         |
| $HELM_DEBUG                        | Helm がデバッグモードで実行されているかどうかを示します。                                                      |
| $HELM_DRIVER                       | バックエンドストレージドライバーを設定します。値: configmap, secret, memory, sql。                                |
| $HELM_DRIVER_SQL_CONNECTION_STRING | SQL ストレージドライバーが使用する接続文字列を設定します。                                               |
| $HELM_MAX_HISTORY                  | Helm release 履歴の最大数を設定します。                                                            |
| $HELM_NAMESPACE                    | Helm 操作に使用する namespace を設定します。                                                            |
| $HELM_NO_PLUGINS                   | プラグインを無効にします。プラグインを無効にするには HELM_NO_PLUGINS=1 を設定します。                                                 |
| $HELM_PLUGINS                      | プラグインディレクトリへのパスを設定します。                                                      |
| $HELM_REGISTRY_CONFIG              | レジストリ設定ファイルへのパスを設定します。                                                          |
| $HELM_REPOSITORY_CACHE             | リポジトリキャッシュディレクトリへのパスを設定します。                                             |
| $HELM_REPOSITORY_CONFIG            | リポジトリファイルへのパスを設定します。                                                     |
| $KUBECONFIG                        | 別の Kubernetes 設定ファイルを設定します（デフォルト "~/.kube/config"）。                                |
| $HELM_KUBEAPISERVER                | 認証用の Kubernetes API サーバーエンドポイントを設定します。                                                  |
| $HELM_KUBECAFILE                   | Kubernetes 認証局ファイルを設定します。                                                             |
| $HELM_KUBEASGROUPS                 | 偽装に使用するグループをカンマ区切りのリストで設定します。                                      |
| $HELM_KUBEASUSER                   | 操作時に偽装するユーザー名を設定します。                                                         |
| $HELM_KUBECONTEXT                  | kubeconfig コンテキストの名前を設定します。                                                    |
| $HELM_KUBETOKEN                    | 認証に使用する Bearer KubeToken を設定します。                                                          |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | Kubernetes API サーバーの証明書検証をスキップするかどうかを示します（非セキュア）。                |
| $HELM_KUBETLS_SERVER_NAME          | Kubernetes API サーバー証明書の検証に使用するサーバー名を設定します。                                 |
| $HELM_BURST_LIMIT                  | サーバーに多数の CRD が含まれる場合のデフォルトバースト制限を設定します（デフォルト 100、無効にするには -1）。         |
| $HELM_QPS                          | 高いバースト値を超える多数の呼び出しがある場合の QPS（秒間クエリ数）を設定します。 |

Helm は以下の設定順序に基づいてキャッシュ、設定、データを保存します:

- HELM_*_HOME 環境変数が設定されている場合、その値が使用されます
- それ以外の場合、XDG ベースディレクトリ仕様をサポートするシステムでは XDG 変数が使用されます
- 他の場所が設定されていない場合、オペレーティングシステムに基づいたデフォルトの場所が使用されます

デフォルトディレクトリはオペレーティングシステムによって異なります。デフォルトは以下のとおりです:

| OS | キャッシュパス                | 設定パス             | データパス               |
|------------------|---------------------------|--------------------------------|-------------------------|
| Linux            | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows          | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm          |


### オプション

```
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
  -h, --help                            help for helm
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 関連項目

* [helm completion](/helm/helm_completion.md)	 - 指定したシェル用の自動補完スクリプトを生成します
* [helm create](/helm/helm_create.md)	 - 指定した名前で新しい chart を作成します
* [helm dependency](/helm/helm_dependency.md)	 - chart の依存関係を管理します
* [helm env](/helm/helm_env.md)	 - Helm クライアントの環境情報を表示します
* [helm get](/helm/helm_get.md)	 - 指定した release の詳細情報をダウンロードします
* [helm history](/helm/helm_history.md)	 - release の履歴を取得します
* [helm install](/helm/helm_install.md)	 - chart をインストールします
* [helm lint](/helm/helm_lint.md)	 - chart の問題点を検査します
* [helm list](/helm/helm_list.md)	 - release を一覧表示します
* [helm package](/helm/helm_package.md)	 - chart ディレクトリを chart アーカイブにパッケージ化します
* [helm plugin](/helm/helm_plugin.md)	 - Helm プラグインをインストール、一覧表示、またはアンインストールします
* [helm pull](/helm/helm_pull.md)	 - リポジトリから chart をダウンロードし、（オプションで）ローカルディレクトリに展開します
* [helm push](/helm/helm_push.md)	 - chart をリモートにプッシュします
* [helm registry](/helm/helm_registry.md)	 - レジストリにログインまたはログアウトします
* [helm repo](/helm/helm_repo.md)	 - chart リポジトリの追加、一覧表示、削除、更新、およびインデックス作成を行います
* [helm rollback](/helm/helm_rollback.md)	 - release を以前のリビジョンにロールバックします
* [helm search](/helm/helm_search.md)	 - chart をキーワード検索します
* [helm show](/helm/helm_show.md)	 - chart の情報を表示します
* [helm status](/helm/helm_status.md)	 - 指定した release のステータスを表示します
* [helm template](/helm/helm_template.md)	 - テンプレートをローカルでレンダリングします
* [helm test](/helm/helm_test.md)	 - release のテストを実行します
* [helm uninstall](/helm/helm_uninstall.md)	 - release をアンインストールします
* [helm upgrade](/helm/helm_upgrade.md)	 - release をアップグレードします
* [helm verify](/helm/helm_verify.md)	 - 指定したパスの chart が署名されており有効であることを検証します
* [helm version](/helm/helm_version.md)	 - クライアントのバージョン情報を出力します

###### Auto generated by spf13/cobra on 14-Jan-2026
