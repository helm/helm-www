---
title: helm search hub
---

pesquisa por charts no Artifact Hub ou na sua própria instância de hub

### Sinopse

Pesquisa por Helm charts no Artifact Hub ou na sua própria instância de hub.

O Artifact Hub é uma aplicação web que permite encontrar, instalar e
publicar pacotes e configurações para projetos CNCF, incluindo charts Helm
de distribuição pública. É um projeto sandbox da Cloud Native Computing
Foundation. Você pode navegar pelo hub em https://artifacthub.io/

O argumento [KEYWORD] aceita uma palavra-chave ou uma consulta avançada entre aspas.
Para mais detalhes sobre consultas avançadas, consulte
https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

Versões anteriores do Helm utilizavam uma instância do Monocular como 'endpoint'
padrão. Por isso, para manter compatibilidade, o Artifact Hub é compatível com a
API de pesquisa do Monocular. Da mesma forma, ao definir o argumento 'endpoint',
o endpoint especificado também deve implementar uma API de pesquisa compatível
com o Monocular. Note que ao especificar uma instância do Monocular como
'endpoint', consultas avançadas não são suportadas. Para detalhes da API, consulte
https://github.com/helm/monocular


```
helm search hub [KEYWORD] [flags]
```

### Opções

```
      --endpoint string      instância do Hub para consultar charts (padrão "https://hub.helm.sh")
      --fail-on-no-result    a pesquisa falha se nenhum resultado for encontrado
  -h, --help                 exibe ajuda para o comando hub
      --list-repo-url        exibe a URL do repositório dos charts
      --max-col-width uint   largura máxima das colunas na tabela de saída (padrão 50)
  -o, --output format        exibe a saída no formato especificado. Valores permitidos: table, json, yaml (padrão table)
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

* [helm search](./helm_search.md)	 - pesquisa por uma palavra-chave em charts

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
