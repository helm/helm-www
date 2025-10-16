---
title: "Helm Get"
---

## helm get

Baixa informações adicionais de uma dada _release_

### Sinopse

Esse comando consiste em múltiplos subcomandos utilizados para recuperar informações
adicionais sobre uma dada _release_, incluindo:

- Os valores utilizados para gerar a _release_
- O arquivo de manifesto gerado
- As notas advindas do Chart da _release_
- Os _hooks_ associados a uma _release_


### Opções

```
  -h, --help   ajuda para o comando get
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

* [helm](helm.md) - Helm, o gerenciador de pacotes para o Kubernetes.
* [helm get all](helm_get_all.md)	 - baixa todas as informações de uma dada _release_
* [helm get hooks](helm_get_hooks.md)	 - baixa todos os _hooks_ de uma dada _release_
* [helm get manifest](helm_get_manifest.md)	 - baixa o manifesto de uma dada _release_
* [helm get notes](helm_get_notes.md)	 - baixa as notas de uma dada _release_
* [helm get values](helm_get_values.md)	 - baixa o arquivo de valores de uma dada _release_
