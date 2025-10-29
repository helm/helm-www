---
title: helm completion
---
Gera scripts de preenchimento automático para um shell específico

### Synopsis

Gera scripts de preenchimento automático do Helm para um shell específico.

### Options

```
  -h, --help   ajuda para o preenchimento automático
```

### Opções gerais

```
      --debug                       exibe uma saída verbosa
  -h, --help                        exibe ajuda para um comando do helm
      --kube-apiserver string       o endereço e porta do Kubernetes API server
      --kube-as-group stringArray   o grupo que representará essa operação, esse argumento pode ser repetido para indicar múltiplos grupos
      --kube-as-user string         o usuário que representará essa operação
      --kube-ca-file string         caminho para o certificado para conexão com o Kubernetes API server
      --kube-context string         nome do contexto do kubeconfig a ser usado
      --kube-token string           bearer token usado para autenticação
      --kubeconfig string           caminho para o arquivo kubeconfig
  -n, --namespace string            namespace para essa requisição
      --registry-config string      caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry.json")
      --repository-cache string     caminho para os índices "cacheados" no repositório (padrão "~/.cache/helm/repository")
      --repository-config string    caminho para o arquivo path to the file containing repository names and URLs (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](/helm/helm.md) - Helm, o gerenciador de pacotes para o Kubernetes.
* [helm completion bash](/helm/helm_completion_bash.md) - gera o script de preenchimento automático para o bash
* [helm completion fish](/helm/helm_completion_fish.md) - gera o script de preenchimento automático para o fish
* [helm completion zsh](/helm/helm_completion_zsh.md) - gera o script de preenchimento automático para o zsh
