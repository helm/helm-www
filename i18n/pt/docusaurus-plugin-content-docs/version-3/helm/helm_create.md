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
      --registry-config string      caminho para o arquivo de configuração do registry (default "~/.config/helm/registry.json")
      --repository-cache string     caminho para os índices "cacheados" no repositório (default "~/.cache/helm/repository")
      --repository-config string    caminho para o arquivo path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](/helm/helm.md) - Helm, o gerenciador de pacotes para o Kubernetes.