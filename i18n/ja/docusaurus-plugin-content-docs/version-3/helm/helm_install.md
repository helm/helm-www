---
title: helm install
---

chart をインストールします

### 概要

このコマンドは chart アーカイブをインストールします。

install の引数には、chart 参照、パッケージ化された chart へのパス、展開された chart ディレクトリへのパス、または URL を指定する必要があります。

chart の値をオーバーライドするには、`--values` フラグでファイルを指定するか、`--set` フラグでコマンドラインから設定を渡します。文字列値を強制する場合は `--set-string` を使用します。値自体がコマンドラインには長すぎる場合や動的に生成される場合は、`--set-file` を使用して個々の値をファイルから設定できます。また、`--set-json` を使用してコマンドラインから JSON 値（スカラー/オブジェクト/配列）を設定することもできます。

    $ helm install -f myvalues.yaml myredis ./redis

または

    $ helm install --set name=prod myredis ./redis

または

    $ helm install --set-string long_int=1234567890 myredis ./redis

または

    $ helm install --set-file my_script=dothings.sh myredis ./redis

または

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


`--values`/`-f` フラグは複数回指定できます。最後（右端）に指定されたファイルが優先されます。例えば、myvalues.yaml と override.yaml の両方に 'Test' というキーが含まれている場合、override.yaml に設定された値が優先されます。

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

`--set` フラグは複数回指定できます。最後（右端）に指定された値が優先されます。例えば、'foo' というキーに対して 'bar' と 'newbar' の両方が設定されている場合、'newbar' の値が優先されます。

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

同様に、次の例では 'foo' は '["four"]' に設定されます。

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

また、次の例では 'foo' は '{"key1":"value1","key2":"bar"}' に設定されます。

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

chart を実際にインストールせずに release の生成されたマニフェストを確認するには、`--debug` フラグと `--dry-run` フラグを組み合わせて使用できます。

`--dry-run` フラグは、Secret など機密情報を含む可能性があるリソースを含め、生成されたすべての chart マニフェストを出力します。Kubernetes の Secret を非表示にするには `--hide-secret` フラグを使用してください。これらのフラグの使用方法とタイミングには十分注意してください。

`--verify` が設定されている場合、chart には provenance ファイルが必須であり、provenance ファイルはすべての検証ステップを通過する必要があります。

インストールする chart を指定する方法は 6 通りあります。

1. chart 参照: helm install mymaria example/mariadb
2. パッケージ化された chart へのパス: helm install mynginx ./nginx-1.2.3.tgz
3. 展開された chart ディレクトリへのパス: helm install mynginx ./nginx
4. 絶対 URL: helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. chart 参照とリポジトリ URL: helm install --repo https://example.com/charts/ mynginx nginx
6. OCI レジストリ: helm install mynginx --version 1.2.3 oci://example.com/charts/nginx

CHART 参照

chart 参照は、chart リポジトリ内の chart を参照する便利な方法です。

リポジトリ接頭辞を含む chart 参照（`example/mariadb`）を使用すると、Helm はローカル設定で 'example' という名前の chart リポジトリを探し、そのリポジトリ内で 'mariadb' という名前の chart を探します。`--devel` フラグを指定して開発バージョン（alpha、beta、リリース候補）も含めるか、`--version` フラグでバージョン番号を指定しない限り、その chart の最新の安定バージョンがインストールされます。

chart リポジトリの一覧を表示するには `helm repo list` を使用します。リポジトリ内の chart を検索するには `helm search` を使用します。


```
helm install [NAME] [CHART] [flags]
```

### オプション

```
      --atomic                                     if set, the installation process deletes the installation on failure. The --wait flag will be set automatically if --atomic is used
      --ca-file string                             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string                           identify HTTPS client using this SSL certificate file
      --create-namespace                           create the release namespace if not present
      --dependency-update                          update dependencies if they are missing before installing the chart
      --description string                         add a custom description
      --devel                                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
      --disable-openapi-validation                 if set, the installation process will not validate rendered templates against the Kubernetes OpenAPI Schema
      --dry-run string[="client"]                  simulate an install. If --dry-run is set with no option being specified or as '--dry-run=client', it will not attempt cluster connections. Setting '--dry-run=server' allows attempting cluster connections.
      --enable-dns                                 enable DNS lookups when rendering templates
      --force                                      force resource updates through a replacement strategy
  -g, --generate-name                              generate the name (and omit the NAME parameter)
  -h, --help                                       help for install
      --hide-notes                                 if set, do not show notes in install output. Does not affect presence in chart metadata
      --hide-secret                                hide Kubernetes Secrets when also using the --dry-run flag
      --insecure-skip-tls-verify                   skip tls certificate checks for the chart download
      --key-file string                            identify HTTPS client using this SSL key file
      --keyring string                             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Labels that would be added to release metadata. Should be divided by comma. (default [])
      --name-template string                       specify template used to name the release
      --no-hooks                                   prevent hooks from running during install
  -o, --output format                              prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pass-credentials                           pass credentials to all domains
      --password string                            chart repository password where to locate the requested chart
      --plain-http                                 use insecure HTTP connections for the chart download
      --post-renderer postRendererString           the path to an executable to be used for post rendering. If it exists in $PATH, the binary will be used, otherwise it will try to look for the executable at the given path
      --post-renderer-args postRendererArgsSlice   an argument to the post-renderer (can specify multiple) (default [])
      --render-subchart-notes                      if set, render subchart notes along with the parent
      --replace                                    re-use the given name, only if that name is a deleted release which remains in the history. This is unsafe in production
      --repo string                                chart repository url where to locate the requested chart
      --set stringArray                            set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray                       set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-json stringArray                       set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    set a literal STRING value on the command line
      --set-string stringArray                     set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-crds                                  if set, no CRDs will be installed. By default, CRDs are installed if not already present
      --skip-schema-validation                     if set, disables JSON schema validation
      --take-ownership                             if set, install will ignore the check for helm annotations and take ownership of the existing resources
      --timeout duration                           time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --username string                            chart repository username where to locate the requested chart
  -f, --values strings                             specify values in a YAML file or a URL (can specify multiple)
      --verify                                     verify the package before using it
      --version string                             specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used
      --wait                                       if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
      --wait-for-jobs                              if set and --wait enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as --timeout
```

### 親コマンドから継承されたオプション

```
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
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

* [helm](/helm/helm.md)	 - Kubernetes 用パッケージマネージャー Helm

###### Auto generated by spf13/cobra on 14-Jan-2026
