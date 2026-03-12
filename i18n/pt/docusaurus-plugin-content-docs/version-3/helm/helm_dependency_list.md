---
title: helm dependency list
---

Lista as dependências de um chart especificado

### Sinopse


Lista todas as dependências declaradas em um chart.

Este comando aceita pacotes de chart e diretórios de chart como entrada. Ele não
altera o conteúdo de um chart.

Será retornado um erro se o chart não puder ser carregado.


```
helm dependency list CHART [flags]
```

### Opções

```
  -h, --help                 ajuda para list
      --max-col-width uint   largura máxima da coluna para tabela de saída (padrão 80)
```

### Opções herdadas dos comandos superiores

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída detalhada
      --kube-apiserver string           o endereço e a porta do Kubernetes API server
      --kube-as-group stringArray       grupo a representar para a operação, este argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             nome de usuário a representar para a operação
      --kube-ca-file string             o arquivo de autoridade de certificação para a conexão com o Kubernetes API server
      --kube-context string             nome do contexto kubeconfig a usar
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

### VEJA TAMBÉM

* [helm dependency](./helm_dependency.md)	 - gerencia as dependências de um chart

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
