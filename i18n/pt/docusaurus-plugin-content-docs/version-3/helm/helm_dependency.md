---
title: helm dependency
---

Gerencia as dependências de um chart

### Sinopse


Gerencia as dependências de um chart.

Os charts do Helm armazenam suas dependências em 'charts/'. Para desenvolvedores de charts,
geralmente é mais fácil gerenciar dependências em 'Chart.yaml', que declara todas
as dependências.

Os comandos de dependência operam nesse arquivo, facilitando a sincronização
entre as dependências desejadas e as dependências reais armazenadas no
diretório 'charts/'.

Por exemplo, este Chart.yaml declara duas dependências:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "https://example.com/charts"
    - name: memcached
      version: "3.2.1"
      repository: "https://another.example.com/charts"


O 'name' deve ser o nome de um chart, que deve corresponder ao nome
no arquivo 'Chart.yaml' desse chart.

O campo 'version' deve conter uma versão semântica ou um intervalo de versões.

A URL 'repository' deve apontar para um repositório de charts. O Helm espera que,
ao adicionar '/index.yaml' à URL, seja possível obter o índice do repositório
de charts. Nota: 'repository' pode ser um alias. O alias deve começar
com 'alias:' ou '@'.

A partir da versão 2.2.0, o repository pode ser definido como o caminho para o diretório
dos charts de dependência armazenados localmente. O caminho deve começar com um prefixo
"file://". Por exemplo,

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "file://../dependency_chart/nginx"

Se o chart de dependência for obtido localmente, não é necessário ter o
repositório adicionado ao helm por "helm add repo". A correspondência de versão também
é suportada neste caso.


### Opções

```
  -h, --help   help for dependency
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

* [helm](/helm/helm.md)	 - O gerenciador de pacotes Helm para Kubernetes.
* [helm dependency build](/helm/helm_dependency_build.md)	 - reconstrói o diretório charts/ com base no arquivo Chart.lock
* [helm dependency list](/helm/helm_dependency_list.md)	 - lista as dependências para o chart especificado
* [helm dependency update](/helm/helm_dependency_update.md)	 - atualiza charts/ com base no conteúdo de Chart.yaml

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
