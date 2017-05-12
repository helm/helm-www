+++
title = "helm completion"
weight = "2"

tags = ["commands"]
section = "helm-commands"
categories = ["helm-commands"]
type = "page"

slug = "helm-completion"

[menu.main]
  url = "helm-completion"
  parent = "helm-commands"

+++

## helm completion

Generate autocompletions script for the specified shell (bash or zsh)

### Synopsis



Generate autocompletions script for Helm for the specified shell (bash or zsh).

This command can generate shell autocompletions. e.g.

	$ helm completion bash

Can be sourced as such

	$ source <(helm completion bash)


```
helm completion SHELL
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
* [helm](#helm)	 - The Helm package manager for Kubernetes.
