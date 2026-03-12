---
title: helm create
---
Cria um novo Chart com um dado nome

### Sinopse

Esse comando cria um diretório para o Chart, bem como os arquivos comuns
necessários para o Chart.

Por exemplo, `helm create foo` criará uma estrutura de diretório como:

    foo/
    ├── .helmignore   # Descreve os arquivos a serem ignorados durante o empacotamento do Chart.
    ├── Chart.yaml    # Informação sobre o seu Chart
    ├── values.yaml   # Valores padrão para os seus templates
    ├── charts/       # Charts que este Chart depende
    └── templates/    # Arquivos de template: deployment, service e outros manifestos
        └── tests/    # Arquivos de teste

`helm create` cria um diretório a partir do argumento passado. Se o diretório não
existir o helm tentará criá-lo. Se o destino já existir e tiver arquivos dentro
do diretório, os arquivos conflitantes serão sobrescritos e os demais serão mantidos.
```
helm create NOME [argumentos]
```

### Opções

```
  -h, --help             ajuda para criação do Chart
  -p, --starter string   nome ou caminho absoluto para a base inicial do Helm
```

### Opções gerais

```
      --burst-limit int                 limite de requisições do lado do cliente (default 100)
      --debug                       exibe uma saída verbosa
      --kube-apiserver string       o endereço e porta do Kubernetes API server
      --kube-as-group stringArray   o grupo que representará essa operação, esse argumento pode ser repetido para indicar múltiplos grupos
      --kube-as-user string         o usuário que representará essa operação
      --kube-ca-file string         caminho para o certificado para conexão com o Kubernetes API server
      --kube-context string         nome do contexto do kubeconfig a ser usado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será verificado. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor usado para validação do certificado do Kubernetes API server. Se não fornecido, será usado o hostname usado para contactar o servidor
      --kube-token string           bearer token usado para autenticação
      --kubeconfig string           caminho para o arquivo kubeconfig
  -n, --namespace string            namespace para essa requisição
      --qps float32                     consultas por segundo usadas na comunicação com a Kubernetes API, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (default "~/.config/helm/registry/config.json")
      --repository-cache string     caminho para os índices "cacheados" no repositório (default "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs dos repositórios (default "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](/helm/helm.md) - Helm, o gerenciador de pacotes para o Kubernetes.