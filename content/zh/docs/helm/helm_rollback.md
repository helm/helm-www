---
title: "Helm 回滚"
---

## helm rollback

回滚发布到上一个版本

### 简介

该命令回滚发布到上一个版本

回滚命令的第一个参数是发布的名称，第二是修订（版本）号，如果省略此参数，会回滚到上一个版本。

要查看修订号，执行'helm history RELEASE'。

```shell
helm rollback <RELEASE> [REVISION] [flags]
```

### 可选项

```shell
      --cleanup-on-fail    allow deletion of new resources created in this rollback when rollback fails
      --dry-run            simulate a rollback
      --force              force resource update through delete/recreate if needed
  -h, --help               help for rollback
      --history-max int    limit the maximum number of revisions saved per release. Use 0 for no limit (default 10)
      --no-hooks           prevent hooks from running during rollback
      --recreate-pods      performs pods restart for the resource if applicable
      --timeout duration   time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --wait               if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
      --wait-for-jobs      if set and --wait enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as --timeout
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
