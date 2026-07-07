---
title: "Helm 拉取"
---

## helm pull

从仓库下载并（可选）在本地目录解压

### 简介

从包仓库中检索包并下载到本地。

对于要获取检查，修改或重新打包的包很有用，还可以用于在不安装chart的情况下对chart进行加密验证。

下载chart之后有解压的选项，会为chart创建一个目录并解压到这个目录中。

如果指定了--verify参数，请求的chart必须有出处文件，且必须通过验证。任意部分的失败都会导致错误，且chart不会在本地保存。

```shell
helm pull [chart URL | repo/chartname] [...] [flags]
```

### 可选项

```shell
      --ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
  -d, --destination string         location to write the chart. If this and untardir are specified, untardir is appended to this (default ".")
      --devel                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored.
  -h, --help                       help for pull
      --insecure-skip-tls-verify   skip tls certificate checks for the chart download
      --key-file string            identify HTTPS client using this SSL key file
      --keyring string             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
      --pass-credentials           pass credentials to all domains
      --password string            chart repository password where to locate the requested chart
      --prov                       fetch the provenance file, but don't perform verification
      --repo string                chart repository url where to locate the requested chart
      --untar                      if set to true, will untar the chart after downloading it
      --untardir string            if untar is specified, this flag specifies the name of the directory into which the chart is expanded (default ".")
      --username string            chart repository username where to locate the requested chart
      --verify                     verify the package before using it
      --version string             specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used
```

### 从父命令继承的命令

```shell
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
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the file containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 请参阅

* [helm](helm.md) - 针对Kubernetes的Helm包管理器
