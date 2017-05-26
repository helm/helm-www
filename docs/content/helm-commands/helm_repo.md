+++
title = "helm repo"
weight = "29"

tags = ["commands"]
section = "helm-commands"
categories = ["helm-commands"]
type = "page"

slug = "helm-repo"

[menu.main]
  url = "helm-repo"
  parent = "helm-commands"

+++

## helm repo

add, list, remove, update, and index chart repositories

### Synopsis



This command consists of multiple subcommands to interact with chart repositories.

It can be used to add, remove, list, and index chart repositories.
Example usage:
    $ helm repo add [NAME] [REPO_URL]


### Options inherited from parent commands

```
      --debug                     enable verbose output
      --home string               location of your Helm config. Overrides $HELM_HOME (default "~/.helm")
      --host string               address of tiller. Overrides $HELM_HOST
      --kube-context string       name of the kubeconfig context to use
      --tiller-namespace string   namespace of tiller (default "kube-system")
```

### SEE ALSO
* [helm](#helm)	 - The Helm package manager for Kubernetes.
* [helm repo add](#helm-repo-add)	 - add a chart repository
* [helm repo index](#helm_repo-index)	 - generate an index file given a directory containing packaged charts
* [helm repo list](#helm-repo-list)	 - list chart repositories
* [helm repo remove](#helm-repo-remove)	 - remove a chart repository
* [helm repo update](#helm-repo-update)	 - update information on available charts in the chart repositories