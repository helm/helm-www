---
title: helm package
---

empacota um diretório de chart em um arquivo de chart

### Sinopse

Este comando empacota um chart em um arquivo de chart versionado. Se um caminho
for fornecido, ele procurará nesse caminho por um chart (que deve conter um
arquivo Chart.yaml) e então empacotará esse diretório.

Repositórios de pacotes do Helm utilizam arquivos de chart versionados.

Para assinar um chart, utilize a flag '--sign'. Geralmente, você também
deve fornecer '--keyring caminho/para/chaves/secretas' e '--key nome_da_chave'.

  $ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg

Se '--keyring' não for especificado, o Helm normalmente utiliza o chaveiro público
por padrão, a menos que seu ambiente esteja configurado de outra forma.


```
helm package [CHART_PATH] [...] [flags]
```

### Opções

```
      --app-version string         define a appVersion do chart para esta versão
      --ca-file string             verifica certificados de servidores com HTTPS utilizando este pacote CA
      --cert-file string           identifica o cliente HTTPS utilizando este arquivo de certificado SSL
  -u, --dependency-update          atualiza dependências do "Chart.yaml" para o diretório "charts/" antes de empacotar
  -d, --destination string         local para salvar o chart. (padrão ".")
  -h, --help                       exibe ajuda para o comando package
      --insecure-skip-tls-verify   ignora verificações de certificado TLS para o download do chart
      --key string                 nome da chave a ser usada ao assinar. Utilizado se --sign for verdadeiro
      --key-file string            identifica o cliente HTTPS utilizando este arquivo de chave SSL
      --keyring string             local do chaveiro público (padrão "~/.gnupg/pubring.gpg")
      --passphrase-file string     local de um arquivo que contém a frase secreta para a chave de assinatura. Use "-" para ler da entrada padrão.
      --password string            senha do repositório de charts onde localizar o chart solicitado
      --plain-http                 utiliza conexões HTTP inseguras para o download do chart
      --sign                       utiliza uma chave privada PGP para assinar este pacote
      --username string            nome de usuário do repositório de charts onde localizar o chart solicitado
      --version string             define a versão do chart para esta versão semver
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
      --kube-token string               token bearer utilizado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo de namespace para esta solicitação
      --qps float32                     consultas por segundo utilizadas na comunicação com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registro (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo índices de repositórios em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### VEJA TAMBÉM

* [helm](./helm.md)	 - O gerenciador de pacotes Helm para Kubernetes.

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
