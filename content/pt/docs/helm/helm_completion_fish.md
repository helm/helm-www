---
title: "Helm Completion Fish"
---

## helm completion fish

Gera scripts de preenchimento automático para o fish

### Sinopse

Gera scripts de preenchimento automático do Helm para o fish shell.

Para carregar o script de preenchimento automático na sessão ativa do fish:

```
helm completion fish | source
```

Para carregar o script para cada nova sessão, execute uma vez:

```
helm completion fish > ~/.config/fish/completions/helm.fish
```

Será necessário iniciar um novo shell para que as modificações tenham efeito.

Comando
```
helm completion fish [argumentos]
```

### Opções

```
  -h, --help              ajuda para o preenchimento automático do fish
      --no-descriptions   desabilita descrições do preenchimento automático
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

* [helm completion](helm_completion.md)	 - gera scripts de preenchimento automático para um shell específico
