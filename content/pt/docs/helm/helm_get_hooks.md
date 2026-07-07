---
title: "Helm Get Hooks"
---

## helm get hooks

Baixa todos os _hooks_ para uma dada _release_

### Sinopse

Esse comando recupera os _hooks_ para uma dada _release_.

_Hooks_ são formatados em YAML e separados pelo separador YAML '---\n'.


```
helm get hooks NOME_DA_RELEASE [argumentos]
```

### Opções

```
  -h, --help           ajuda para recuperar um manifesto
      --revision int   recupera uma revisão específica de uma release
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
      --repository-cache string     caminho para os índices cacheados no repositório (padrão "~/.cache/helm/repository")
      --repository-config string    caminho para o arquivo path to the file containing repository names and URLs (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm get](helm_get.md) - baixa informações adicionais de uma dada release
