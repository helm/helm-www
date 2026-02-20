---
title: helm show readme
---

exibe o README do chart

### Sinopse

Este comando inspeciona um chart (diretório, arquivo ou URL) e exibe o conteúdo
do arquivo README


```
helm show readme [CHART] [flags]
```

### Opções

```
      --ca-file string             verifica certificados de servidores HTTPS utilizando este pacote de CA
      --cert-file string           identifica o cliente HTTPS utilizando este arquivo de certificado SSL
      --devel                      utiliza versões de desenvolvimento também. Equivalente a version '>0.0.0-0'. Se --version estiver configurado, este será ignorado
  -h, --help                       exibe ajuda para o comando readme
      --insecure-skip-tls-verify   ignora verificações de certificado TLS no download do chart
      --key-file string            identifica o cliente HTTPS utilizando este arquivo de chave SSL
      --keyring string             localização das chaves públicas usadas para verificação (padrão "~/.gnupg/pubring.gpg")
      --pass-credentials           passa credenciais para todos os domínios
      --password string            senha do repositório de charts onde localizar o chart solicitado
      --plain-http                 utiliza conexões HTTP inseguras para o download do chart
      --repo string                URL do repositório de charts onde localizar o chart solicitado
      --username string            nome de usuário do repositório de charts onde localizar o chart solicitado
      --verify                     verifica o pacote antes de usá-lo
      --version string             especifica uma restrição de versão para a versão do chart a ser usada. Esta restrição pode ser uma tag específica (ex: 1.1.1) ou pode referenciar um intervalo válido (ex: ^2.0.0). Se não for especificado, a versão mais recente é usada
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

* [helm show](./helm_show.md)	 - exibe informações de um chart

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
