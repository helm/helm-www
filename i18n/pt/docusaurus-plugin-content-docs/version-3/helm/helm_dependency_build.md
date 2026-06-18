---
title: helm dependency build
---

Reconstrói o diretório charts/ com base no arquivo Chart.lock

### Sinopse


Constrói o diretório charts/ a partir do arquivo Chart.lock.

Build é usado para reconstruir as dependências de um chart para o estado especificado
no arquivo de lock. Isso não renegocia as dependências, ao contrário de 'helm dependency update'.

Se nenhum arquivo de lock for encontrado, 'helm dependency build' irá espelhar o comportamento
de 'helm dependency update'.


```
helm dependency build CHART [flags]
```

### Opções

```
      --ca-file string             verifica certificados de servidores habilitados para HTTPS usando este pacote CA
      --cert-file string           identifica cliente HTTPS usando este arquivo de certificado SSL
  -h, --help                       ajuda para build
      --insecure-skip-tls-verify   ignora verificações de certificado tls para o download do chart
      --key-file string            identifica cliente HTTPS usando este arquivo de chave SSL
      --keyring string             keyring contendo chaves públicas (padrão "~/.gnupg/pubring.gpg")
      --password string            senha do repositório de charts onde localizar o chart solicitado
      --plain-http                 usa conexões HTTP inseguras para o download do chart
      --skip-refresh               não atualiza o cache local do repositório
      --username string            nome de usuário do repositório de charts onde localizar o chart solicitado
      --verify                     verifica os pacotes contra assinaturas
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

### Veja também

* [helm dependency](/helm/helm_dependency.md)	 - gerencia as dependências de um chart

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
