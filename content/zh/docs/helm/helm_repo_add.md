---
title: "Helm 添加仓库"
---

## helm repo add

添加chart仓库

```shell
helm repo add [NAME] [URL] [flags]
```

### 可选项

```shell
      --allow-deprecated-repos     by default, this command will not allow adding official repos that have been permanently deleted. This disables that behavior
      --ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
      --force-update               replace (overwrite) the repo if it already exists
  -h, --help                       help for add
      --insecure-skip-tls-verify   skip tls certificate checks for the repository
      --key-file string            identify HTTPS client using this SSL key file
      --no-update                  Ignored. Formerly, it would disabled forced updates. It is deprecated by force-update.
      --pass-credentials           pass credentials to all domains
      --password string            chart repository password
      --password-stdin             read chart repository password from stdin
      --username string            chart repository username
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

* [helm repo](helm_repo.md) - 添加、列出、删除、更新和索引chart仓库
