---
title: "Helm Install"
---

## helm install

安装一个图表（chart）

### 概要

这个命令安装一个图表存档。
This command installs a chart archive.

install 参数必须是图表引用，打包图表的路径，
解压缩图表目录或URL的路径。
The install argument must be a chart reference, a path to a packaged chart,
a path to an unpacked chart directory or a URL.

要覆盖图表中的值（values），请使用 `--values` 标志并传递文件，
或者，使用 `--set` 标志来通过命令行传递配置，使用`--set-string`强制使用字符串值；
如果值很长，您不想直接在命令行中使用 `--values` 或 `--set` ，也可以使用 `--set-file` 从文件中读取一个值。
```
    $ helm install -f myvalues.yaml myredis ./redis
```
或者
```
    $ helm install --set name=prod myredis ./redis
```
或者
```
    $ helm install --set-string long_int=1234567890 myredis ./redis
```
或者
```
    $ helm install --set-file my_script=dothings.sh myredis ./redis
```
您可以多次指定 `--values`/`-f` 标志。优先考虑指定的最后（最右）一个文件。 
例如，如果myvalues.yaml 和 override.yaml 同时包含一个名为 `Test` 的键，
则 override.yaml 中设置的值优先：
```
    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis
```
您可以多次指定`--set`标志。 优先考虑指定的最后（最右）一个组。 
例如，如果 `bar` 和 `newbar` 值均为名为 `foo` 的键设置时，`newbar` 值将优先：
```
    $ helm install --set foo=bar --set foo=newbar  myredis ./redis
```
同时使用 `--debug` 和 `--dry-run` 标志，可在不安装图表的情况下检查生成的发行清单，

如果设置了 `--verify` ，则图表**必须**具有一个出处文件，并且该文件**必须**通过所有验证步骤。

您可以通过五种不同的方式来表达要安装的图表：

1.通过图表参考：`helm install mymaria example/mariadb`
2.通过图表打包文件路径：`helm install mynginx ./nginx-1.2.3.tgz`
3.通过解压后的图表目录路径： `helm install mynginx ./nginx`
4.通过绝对链接：`helm install mynginx https://example.com/charts/nginx-1.2.3.tgz`
5.通过图表参考和仓库链接：`helm install --repo https://example.com/charts/ mynginx nginx`

### 图标引用

图表引用是在图表存储库中引用图表的便捷方法。

当您使用带有回购前缀（`example / mariadb`）的图表引用时，Helm将在本地配置中查找名为`example`的图表存储库，然后在该存储库中查找名称为`mariadb`的图表。

它将安装该图表的最新稳定版本，除非您指定 `--devel` 标志来包括开发版本（alpha，beta和发行候选版本），
或提供带有 `--version` 标志的版本号。

要查看图表存储库列表，请使用 `helm repo list`。要在存储库中搜索图表，请使用 `helm search`。

```
helm install [NAME] [CHART] [flags]
```

### 选项

```
      --atomic                       if set, the installation process deletes the installation on failure. The --wait flag will be set automatically if --atomic is used
      --ca-file string               verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string             identify HTTPS client using this SSL certificate file
      --create-namespace             create the release namespace if not present
      --dependency-update            run helm dependency update before installing the chart
      --description string           add a custom description
      --devel                        use development versions, too. Equivalent to version `>0.0.0-0`. If --version is set, this is ignored
      --disable-openapi-validation   if set, the installation process will not validate rendered templates against the Kubernetes OpenAPI Schema
      --dry-run                      simulate an install
  -g, --generate-name                generate the name (and omit the NAME parameter)
  -h, --help                         help for install
      --key-file string              identify HTTPS client using this SSL key file
      --keyring string               location of public keys used for verification (default "~/.gnupg/pubring.gpg")
      --name-template string         specify template used to name the release
      --no-hooks                     prevent hooks from running during install
  -o, --output format                prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --password string              chart repository password where to locate the requested chart
      --post-renderer postrenderer   the path to an executable to be used for post rendering. If it exists in $PATH, the binary will be used, otherwise it will try to look for the executable at the given path (default exec)
      --render-subchart-notes        if set, render subchart notes along with the parent
      --replace                      re-use the given name, only if that name is a deleted release which remains in the history. This is unsafe in production
      --repo string                  chart repository url where to locate the requested chart
      --set stringArray              set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray         set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-string stringArray       set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-crds                    if set, no CRDs will be installed. By default, CRDs are installed if not already present
      --timeout duration             time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --username string              chart repository username where to locate the requested chart
  -f, --values strings               specify values in a YAML file or a URL (can specify multiple)
      --verify                       verify the package before installing it
      --version string               specify the exact chart version to install. If this is not specified, the latest version is installed
      --wait                         if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
```

### 从父指令继承的选项

```
      --add-dir-header                   If true, adds the file directory to the header
      --alsologtostderr                  log to standard error as well as files
      --debug                            enable verbose output
      --kube-apiserver string            the address and the port for the Kubernetes API server
      --kube-context string              name of the kubeconfig context to use
      --kube-token string                bearer token used for authentication
      --kubeconfig string                path to the kubeconfig file
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --log-file string                  If non-empty, use this log file
      --log-file-max-size uint           Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited. (default 1800)
      --logtostderr                      log to standard error instead of files (default true)
  -n, --namespace string                 namespace scope for this request
      --registry-config string           path to the registry config file (default "~/.config/helm/registry.json")
      --repository-cache string          path to the file containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string         path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
      --skip-headers                     If true, avoid header prefixes in the log messages
      --skip-log-headers                 If true, avoid headers when opening log files
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
  -v, --v Level                          number for the log level verbosity
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```

### 另请参见

* [helm](../helm)	 - Kubernetes 的 Helm 软件包管理器。

