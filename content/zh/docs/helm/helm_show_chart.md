---
title: "Helm Show Chart"
---

## helm show chart

显示chart定义

### 简介

该命令检查chart(目录、文件或URL)并显示Charts.yaml文件的内容

```shell
helm show chart [CHART] [flags]
```

### 可选项

```shell
      --ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
      --devel                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
  -h, --help                       help for chart
      --insecure-skip-tls-verify   skip tls certificate checks for the chart download
      --key-file string            identify HTTPS client using this SSL key file
      --keyring string             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
      --password string            chart repository password where to locate the requested chart
      --repo string                chart repository url where to locate the requested chart
      --username string            chart repository username where to locate the requested chart
      --verify                     verify the package before using it
      --version string             specify the exact chart version to use. If this is not specified, the latest version is used
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

* [helm show](helm_show.md) - 显示chart信息
