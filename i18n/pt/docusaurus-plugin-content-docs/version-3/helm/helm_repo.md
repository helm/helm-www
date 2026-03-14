---
title: helm repo
---

adiciona, lista, remove, atualiza e indexa repositórios de charts

### Sinopse

Este comando possui vários subcomandos para interagir com repositórios de charts.

Com ele você pode adicionar, remover, listar e indexar repositórios de charts.

### Opções

```
  -h, --help   exibe ajuda para o comando repo
```

### Opções herdadas dos comandos superiores

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída detalhada
      --kube-apiserver string           endereço e porta do servidor da API do Kubernetes
      --kube-as-group stringArray       grupo a ser representado para a operação, este argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             nome de usuário a ser representado para a operação
      --kube-ca-file string             arquivo de autoridade de certificação para a conexão com o servidor da API do Kubernetes
      --kube-context string             nome do contexto kubeconfig a ser utilizado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do servidor da API do Kubernetes não será verificado. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a ser utilizado para validação do certificado do servidor da API do Kubernetes. Se não for fornecido, será utilizado o hostname usado para contatar o servidor
      --kube-token string               bearer token utilizado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo de namespace para esta requisição
      --qps float32                     consultas por segundo utilizadas na comunicação com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo os índices de repositório em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### VEJA TAMBÉM

* [helm](./helm.md)	 - O gerenciador de pacotes Helm para Kubernetes.
* [helm repo add](./helm_repo_add.md)	 - adiciona um repositório de charts
* [helm repo index](./helm_repo_index.md)	 - gera um arquivo de índice dado um diretório contendo charts empacotados
* [helm repo list](./helm_repo_list.md)	 - lista repositórios de charts
* [helm repo remove](./helm_repo_remove.md)	 - remove um ou mais repositórios de charts
* [helm repo update](./helm_repo_update.md)	 - atualiza informações de charts disponíveis localmente a partir dos repositórios de charts

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
