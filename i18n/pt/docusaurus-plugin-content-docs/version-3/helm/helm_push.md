---
title: helm push
---

envia um chart para um registry remoto

### Sinopse

Envia um chart para um registry.

Se o chart possuir um arquivo de procedência associado,
ele também será enviado.


```
helm push [chart] [remote] [flags]
```

### Opções

```
      --ca-file string             verifica certificados de servidores com HTTPS utilizando este pacote CA
      --cert-file string           identifica o cliente do registry utilizando este arquivo de certificado SSL
  -h, --help                       exibe ajuda para o comando push
      --insecure-skip-tls-verify   ignora verificações de certificado TLS para o upload do chart
      --key-file string            identifica o cliente do registry utilizando esta chave SSL
      --password string            senha do repositório de charts
      --plain-http                 utiliza conexões HTTP inseguras para o upload do chart
      --username string            nome de usuário do repositório de charts
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

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
