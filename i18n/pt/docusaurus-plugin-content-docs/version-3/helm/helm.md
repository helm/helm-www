---
title: helm
slug: helm
---

O gerenciador de pacotes para o Kubernetes.

### Sinopse

O gerenciador de pacotes para o Kubernetes.

Comandos comuns para o Helm:

- helm search:    busca por charts
- helm pull:      baixa um chart em seu diretório local para visualização
- helm install:   aplica um chart no Kubernetes
- helm list:      lista as _releases_ dos charts

Variáveis de ambiente:

| Nome                               | Descrição                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | configura um local alternativo para armazenamento dos arquivos de cache.                                        |
| $HELM_CONFIG_HOME                  | configura um local alternativo para armazenamento das configurações do Helm.                                    |
| $HELM_DATA_HOME                    | configura um local alternativo para armazenamento dos dados do Helm.                                            |
| $HELM_DEBUG                        | indica se o Helm rodará ou não em modo debug.                                                                   |
| $HELM_DRIVER                       | configura o driver de armazenamento backend. Valores: configmap, secret, memory, sql.                           |
| $HELM_DRIVER_SQL_CONNECTION_STRING | configura a string de conexão a ser utilizada pelo driver de armazenamento SQL.                                 |
| $HELM_MAX_HISTORY                  | configura o número máximo de _releases_ armazenadas no histórico do Helm.                                       |
| $HELM_NAMESPACE                    | configura o namespace usado para as operações do Helm.                                                          |
| $HELM_NO_PLUGINS                   | desabilita os plugins. Configure HELM_NO_PLUGINS=1 para desabilitar os plugins.                                 |
| $HELM_PLUGINS                      | configura o caminho para o diretório dos plugins.                                                               |
| $HELM_REGISTRY_CONFIG              | configura o caminho para o arquivo de configuração do registry.                                                 |
| $HELM_REPOSITORY_CACHE             | configura o caminho para o diretório de cache do repositório.                                                   |
| $HELM_REPOSITORY_CONFIG            | configura o caminho para o arquivo de repositórios.                                                             |
| $KUBECONFIG                        | configura um arquivo de configuração alternativo para o Kubernetes (padrão "~/.kube/config").                   |
| $HELM_KUBEAPISERVER                | configura o endpoint do Kubernetes API Server para autenticação.                                                |
| $HELM_KUBECAFILE                   | configura o arquivo de autoridade certificadora do Kubernetes.                                                  |
| $HELM_KUBEASGROUPS                 | configura os grupos para impersonação, sendo esta uma lista separada por vírgula.                               |
| $HELM_KUBEASUSER                   | configura o nome de usuário para impersonação da operação.                                                      |
| $HELM_KUBECONTEXT                  | configura o nome do contexto do kubeconfig.                                                                     |
| $HELM_KUBETOKEN                    | configura o Bearer KubeToken usado para autenticação.                                                           |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | indica se a validação do certificado do Kubernetes API server deve ser ignorada (inseguro).                     |
| $HELM_KUBETLS_SERVER_NAME          | configura o nome do servidor usado para validar o certificado do Kubernetes API server.                         |
| $HELM_BURST_LIMIT                  | configura o limite de burst padrão caso o servidor contenha muitos CRDs (padrão 100, -1 para desabilitar).      |
| $HELM_QPS                          | configura as Queries Por Segundo para casos onde muitas chamadas excedem a opção para valores de burst maiores. |

O Helm armazena arquivos de cache, configuração, e dados de acordo com a seguinte ordem:

- Se uma variável de ambiente HELM_*_HOME é configurada, ela será utilizada.
- Caso contrário, em sistemas que suportam a especificação de diretório XDG, as variáveis XDG serão utilizadas.
- Quando nenhum outro local é configurado, será utilizado um caminho padrão baseado no sistema operacional.

Por padrão, os diretórios dependem do Sistema Operacional. Abaixo seguem os caminhos padrão:

| Sistema Operacional | Caminho do Cache          | Caminho de Configuração        | Caminho para os Dados     |
|---------------------|---------------------------|--------------------------------|---------------------------|
| Linux               | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm   |
| macOS               | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm        |
| Windows             | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm            |


### Opções

```
      --burst-limit int                 limite de throttling padrão no lado do cliente (padrão 100)
      --debug                           habilita saída verbosa
  -h, --help                            exibe ajuda para o helm
      --kube-apiserver string           o endereço e a porta do Kubernetes API server
      --kube-as-group stringArray       grupo para impersonação da operação, esse argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             nome de usuário para impersonação da operação
      --kube-ca-file string             arquivo de autoridade certificadora para conexão com o Kubernetes API server
      --kube-context string             nome do contexto do kubeconfig a ser usado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será validado. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor usado para validação do certificado do Kubernetes API server. Se não fornecido, o hostname usado para contatar o servidor será utilizado
      --kube-token string               bearer token usado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                namespace para essa requisição
      --qps float32                     queries por segundo usadas na comunicação com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo os índices de repositório em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm completion](/helm/helm_completion.md)	 - gera scripts de autocompletar para o shell especificado
* [helm create](/helm/helm_create.md)	 - cria um novo chart com o nome fornecido
* [helm dependency](/helm/helm_dependency.md)	 - gerencia as dependências de um chart
* [helm env](/helm/helm_env.md)	 - informações do ambiente do cliente Helm
* [helm get](/helm/helm_get.md)	 - obtém informações estendidas de uma _release_
* [helm history](/helm/helm_history.md)	 - obtém o histórico de uma _release_
* [helm install](/helm/helm_install.md)	 - instala um chart
* [helm lint](/helm/helm_lint.md)	 - examina um chart em busca de possíveis problemas
* [helm list](/helm/helm_list.md)	 - lista _releases_
* [helm package](/helm/helm_package.md)	 - empacota um diretório de chart em um chart archive
* [helm plugin](/helm/helm_plugin.md)	 - instala, lista ou desinstala plugins do Helm
* [helm pull](/helm/helm_pull.md)	 - baixa um chart de um repositório e (opcionalmente) descompacta em um diretório local
* [helm push](/helm/helm_push.md)	 - envia um chart para um registry remoto
* [helm registry](/helm/helm_registry.md)	 - faz login ou logout de um registry
* [helm repo](/helm/helm_repo.md)	 - adiciona, lista, remove, atualiza e indexa repositórios de charts
* [helm rollback](/helm/helm_rollback.md)	 - reverte uma _release_ para uma revisão anterior
* [helm search](/helm/helm_search.md)	 - busca por uma palavra-chave em charts
* [helm show](/helm/helm_show.md)	 - exibe informações de um chart
* [helm status](/helm/helm_status.md)	 - exibe o status de uma _release_
* [helm template](/helm/helm_template.md)	 - renderiza templates localmente
* [helm test](/helm/helm_test.md)	 - executa os testes de uma _release_
* [helm uninstall](/helm/helm_uninstall.md)	 - desinstala uma _release_
* [helm upgrade](/helm/helm_upgrade.md)	 - atualiza uma _release_
* [helm verify](/helm/helm_verify.md)	 - verifica se um chart em um dado caminho foi assinado e é válido
* [helm version](/helm/helm_version.md)	 - exibe informações sobre a versão do cliente

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
