+++
title = "helm plugin"
weight = "24"

tags = ["commands"]
section = "helm-commands"
categories = ["helm-commands"]
type = "page"

slug = "helm-plugin"

[menu.main]
  url = "helm-plugin"
  parent = "helm-commands"

+++

## helm plugin

add, list, or remove Helm plugins

### Synopsis



Manage client-side Helm plugins.


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
* [helm plugin install](#helm-plugin-install)	 - install one or more Helm plugins
* [helm plugin list](#helm-plugin-list)	 - list installed Helm plugins
* [helm plugin remove](#helm-plugin-remove)	 - remove one or more Helm plugins
