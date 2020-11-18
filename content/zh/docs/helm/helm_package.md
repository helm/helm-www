---
title: "Helm Package"
---

## helm package

将chart目录打包到chart归档中

### 简介

该命令将chart打包成一个chart版本包文件。如果给定路径，就会在该路径中查找chart（必须包含Chart.yaml文件）然后将目录打包。

chart版本包会用于Helm包仓库。

要签名一个chart，使用'--sign'参数，在大多数场景中，也要提供'--keyring path/to/secret/keys'和'--key keyname'。

  $ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg

如果'--keyring'未指定，除非配置了其他方式，不然Helm通常会指定公共秘钥环。

```shell
helm package [CHART_PATH] [...] [flags]
```

### 可选项

```shell
      --app-version string       set the appVersion on the chart to this version
  -u, --dependency-update        update dependencies from "Chart.yaml" to dir "charts/" before packaging
  -d, --destination string       location to write the chart. (default ".")
  -h, --help                     help for package
      --key string               name of the key to use when signing. Used if --sign is true
      --keyring string           location of a public keyring (default "~/.gnupg/pubring.gpg")
      --passphrase-file string   location of a file which contains the passphrase for the signing key. Use "-" in order to read from stdin.
      --sign                     use a PGP private key to sign this package
      --version string           set the version on the chart to this semver version
```

### 从父命令继承的命令

```shell
      --debug                       enable verbose output
      --kube-apiserver string       the address and the port for the Kubernetes API server
      --kube-as-group stringArray   Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string         Username to impersonate for the operation
      --kube-context string         name of the kubeconfig context to use
      --kube-token string           bearer token used for authentication
      --kubeconfig string           path to the kubeconfig file
  -n, --namespace string            namespace scope for this request
      --registry-config string      path to the registry config file (default "~/.config/helm/registry.json")
      --repository-cache string     path to the file containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string    path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 请参阅

* [helm](helm.md) - 针对Kubernetes的Helm包管理器
