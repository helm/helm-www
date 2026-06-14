---
title: helm get
---

Baixa informações adicionais de uma dada _release_

### Sinopse

Esse comando consiste em múltiplos subcomandos utilizados para recuperar informações
adicionais sobre uma dada _release_, incluindo:

- Os valores utilizados para gerar a _release_
- O arquivo de manifesto gerado
- As notas advindas do Chart da _release_
- Os _hooks_ associados a uma _release_
- Os metadados da _release_


### Opções

```
  -h, --help   ajuda para o comando get
```

### Opções gerais

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída detalhada
      --kube-apiserver string           o endereço e a porta do Kubernetes API server
      --kube-as-group stringArray       grupo a representar para a operação, este argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             nome de usuário a representar para a operação
      --kube-ca-file string             o arquivo de autoridade de certificação para a conexão com o Kubernetes API server
      --kube-context string             nome do contexto do kubeconfig a ser usado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será verificado quanto à validade. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a usar para validação de certificado do Kubernetes API server. Se não fornecido, o hostname usado para contatar o servidor é usado
      --kube-token string               bearer token usado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo de namespace para esta requisição
      --qps float32                     consultas por segundo usadas ao comunicar com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo índices de repositório em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](./helm.md) - Helm, o gerenciador de pacotes para o Kubernetes.
* [helm get all](./helm_get_all.md) - baixa todas as informações de uma dada _release_
* [helm get hooks](./helm_get_hooks.md) - baixa todos os _hooks_ de uma dada _release_
* [helm get manifest](./helm_get_manifest.md) - baixa o manifesto de uma dada _release_
* [helm get metadata](./helm_get_metadata.md) - busca os metadados de uma dada release
* [helm get notes](./helm_get_notes.md) - baixa as notas de uma dada _release_
* [helm get values](./helm_get_values.md) - baixa o arquivo de valores de uma dada _release_

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
