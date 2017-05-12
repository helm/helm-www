+++
title = "helm repo remove"
weight = "32"

tags = ["commands"]
section = "helm-commands"
categories = ["helm-commands"]
type = "page"

slug = "helm-repo-remove"

[menu.main]
  url = "helm-repo-remove"
  parent = "helm-commands"

+++

## helm repo remove

remove a chart repository

### Synopsis


remove a chart repository

```
helm repo remove [flags] [NAME]
```

### Options inherited from parent commands

```
      --debug                     enable verbose output
      --home string               location of your Helm config. Overrides $HELM_HOME (default "~/.helm")
      --host string               address of tiller. Overrides $HELM_HOST
      --kube-context string       name of the kubeconfig context to use
      --tiller-namespace string   namespace of tiller (default "kube-system")
```

### SEE ALSO
* [helm repo](#helm-repo)	 - add, list, remove, update, and index chart repositories