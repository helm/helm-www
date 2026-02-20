---
title: helm install
---

安装 chart

### 简介

该命令用于安装 chart 包。

安装参数必须是 chart 的引用，一个打包后的 chart 路径，未打包的 chart 目录或者是一个 URL。

要重写 chart 中的值，使用 '--values' 参数传递一个文件或者使用 '--set' 参数在命令行传递配置，强制使用字符串要用 '--set-string'。当值本身对于命令行太长或者是动态生成的时候，可以使用 '--set-file' 设置独立的值。也可以在命令行使用 '--set-json' 参数设置 JSON 值（标量/对象/数组）。

    $ helm install -f myvalues.yaml myredis ./redis

或者

    $ helm install --set name=prod myredis ./redis

或者

    $ helm install --set-string long_int=1234567890 myredis ./redis

或者

    $ helm install --set-file my_script=dothings.sh myredis ./redis

或者

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


你可以多次指定 '--values'/'-f' 参数。最右侧指定的文件优先级最高。比如，如果两个文件 myvalues.yaml 和 override.yaml 都包含名为 'Test' 的键，override.yaml 中的值优先：

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

可以多次指定 '--set' 参数，最右边的参数优先级最高。比如，'bar' 和 'newbar' 都设置了一个名为 'foo' 的键，'newbar' 的值优先：

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

类似地，下面的示例中 'foo' 被设置成了 '["four"]'：

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

下面的示例中，'foo' 被设置成了 '{"key1":"value1","key2":"bar"}'：

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

为了检测生成的清单，但并不安装 chart，可以将 '--debug' 和 '--dry-run' 组合使用。

'--dry-run' 参数会输出所有生成的 chart 清单，包括可能包含敏感值的 Secret。如需隐藏 Kubernetes Secret，请使用 '--hide-secret' 参数。请谨慎考虑何时及如何使用这些参数。

如果设置了 '--verify'，chart **必须**有出处文件，且出处文件**必须**通过所有的验证步骤。

有六种不同的方式来标识需要安装的 chart：

1. 通过 chart 引用：helm install mymaria example/mariadb
2. 通过 chart 包路径：helm install mynginx ./nginx-1.2.3.tgz
3. 通过未打包 chart 目录的路径：helm install mynginx ./nginx
4. 通过 URL 绝对路径：helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. 通过 chart 引用和仓库 URL：helm install --repo https://example.com/charts/ mynginx nginx
6. 通过 OCI 注册中心：helm install mynginx --version 1.2.3 oci://example.com/charts/nginx

CHART 引用

chart 引用是在 chart 仓库中引用 chart 的一种方便方式。

当你用仓库前缀（'example/mariadb'）引用 chart 时，Helm 会在本地配置查找名为 'example' 的 chart 仓库，然后会在仓库中查找名为 'mariadb' 的 chart，然后会安装这个 chart 最新的稳定版本，除非指定了 '--devel' 参数且包含了开发版本（alpha、beta 和候选发布版本），或者使用 '--version' 参数提供一个版本号。

要查看仓库列表，使用 'helm repo list'。要在仓库中搜索 chart，使用 'helm search'。


```
helm install [NAME] [CHART] [flags]
```

### 可选项

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

### 从父命令继承的选项

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

### 请参阅

* [helm](./helm.md)	 - Kubernetes 的 Helm 包管理器

###### Auto generated by spf13/cobra on 14-Jan-2026
