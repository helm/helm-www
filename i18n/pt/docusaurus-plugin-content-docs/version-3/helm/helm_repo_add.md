---
title: helm repo add
---

adiciona um repositório de charts

```
helm repo add [NAME] [URL] [flags]
```

### Opções

```
      --allow-deprecated-repos     por padrão, este comando não permite adicionar repositórios oficiais que foram permanentemente removidos. Esta opção desabilita esse comportamento
      --ca-file string             verifica certificados de servidores com HTTPS utilizando este pacote CA
      --cert-file string           identifica o cliente HTTPS utilizando este arquivo de certificado SSL
      --force-update               substitui (sobrescreve) o repositório se ele já existir
  -h, --help                       exibe ajuda para o comando add
      --insecure-skip-tls-verify   ignora verificações de certificado TLS para o repositório
      --key-file string            identifica o cliente HTTPS utilizando esta chave SSL
      --no-update                  Ignorado. Anteriormente, desabilitava atualizações forçadas. Está obsoleto em favor de force-update.
      --pass-credentials           passa credenciais para todos os domínios
      --password string            senha do repositório de charts
      --password-stdin             lê a senha do repositório de charts da entrada padrão
      --timeout duration           tempo de espera para o download do arquivo de índice ser concluído (padrão 2m0s)
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

* [helm repo](./helm_repo.md)	 - adiciona, lista, remove, atualiza e indexa repositórios de charts

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
