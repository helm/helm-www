---
title: helm
slug: helm
---
O gerenciador de pacotes para o Kubernetes.

### Sinopse

O gerenciador de pacotes para o Kubernetes.

Comandos comuns para o Helm:

- helm search:    busca por Charts
- helm pull:      baixa um Chart em seu diretório local
- helm install:   aplica um Chart no Kubernetes
- helm list:      lista as _releases_ dos Charts

Variáveis de ambiente:

| Nome                               | Descrição                                                                                                  |
|------------------------------------|------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | configura um local alternativo para armazenamento dos arquivos de cache.                                   |
| $HELM_CONFIG_HOME                  | configura um local alternativo para armazenamento para as configurações do Helm.                           |
| $HELM_DATA_HOME                    | configura um local alternativo para armazenamento os dados do Helm.                                        |
| $HELM_DEBUG                        | indica se o Helm rodará ou não em modo debug                                                               |
| $HELM_DRIVER                       | configura o driver de armazenamento backend. Valores usados: configmap, secret, memory, postgres.          |
| $HELM_DRIVER_SQL_CONNECTION_STRING | configura a string de conexão a ser utilizada pelo driver de armazenamento SQL.                            |
| $HELM_MAX_HISTORY                  | configura o número máximo de _releases_ armazenadas no histórico do helm.                                  |
| $HELM_NAMESPACE                    | configura o namespace usado para as operações do helm.                                                     |
| $HELM_NO_PLUGINS                   | desabilita os plugins. Configure HELM_NO_PLUGINS=1 para desabilitar os plugins.                            |
| $HELM_PLUGINS                      | configura o caminho para o diretório dos plugins.                                                          |
| $HELM_REGISTRY_CONFIG              | configura o caminho para o arquivo de configuração do container registry.                                  |
| $HELM_REPOSITORY_CACHE             | configura o caminho para o diretório do repositório de cache.                                              |
| $HELM_REPOSITORY_CONFIG            | configura o caminho para o arquivo de repositórios.                                                        |
| $KUBECONFIG                        | configura um arquivo de configuração alternativo para o Kubernetes (por padrão "~/.kube/config").          |
| $HELM_KUBEAPISERVER                | configura o Endpoint de Autenticação do Kubernetes API Server.                                             |
| $HELM_KUBECAFILE                   | configura o arquivo do certificado de autoridade para o Kubernetes.                                        |
| $HELM_KUBEASGROUPS                 | configura os Grupos que representarão as operações, sendo esta uma lista com itens separados por vírgula.  |
| $HELM_KUBEASUSER                   | configura o Nome de Usuário que representará a operação.                                                   |
| $HELM_KUBECONTEXT                  | configura o nó do contexto do kubeconfig.                                                                  |
| $HELM_KUBETOKEN                    | configura o Bearer KubeToken usado para autenticação.                                                      |

O Helm armazena arquivos de cache, configuração, e dados de acordo com a seguinte ordem:

- Se uma variável de ambiente HELM_*_HOME é configurada, ela será utilizada.
- Se não, os sistemas que suportam a especificação de diretório XDG utilizarão as variáveis XDG.
- Quando nenhum outro local é configurado como padrão, será utilizado um caminho baseado pelo sistema operacional.

Por padrão, os diretórios padrões dependem do Sistema Operacional. Abaixo seguem os caminhos em diferentes SOs:

| Sistema Operacional | Caminho do Cache                | Caminho de Configuração             | Caminho para os Dados               |
|---------------------|---------------------------------|-------------------------------------|-------------------------------------|
| Linux               | $HOME/.cache/helm               | $HOME/.config/helm                  | $HOME/.local/share/helm             |
| macOS               | $HOME/Library/Caches/helm       | $HOME/Library/Preferences/helm      | $HOME/Library/helm                  |
| Windows             | %TEMP%\helm                     | %APPDATA%\helm                      | %APPDATA%\helm                      |


### Opções

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
* [helm completion](/helm/helm_completion.md) - gera os scripts de preenchimento automático (_autocompletion_) para o shell especificado.
* [helm create](/helm/helm_create.md) - cria um novo chart com um nome.
* [helm dependency](/helm/helm_dependency.md) - gerencia as dependências dos Charts.
* [helm env](/helm/helm_env.md) - exibe as informações de variáveis de ambiente do cliente helm.
* [helm get](/helm/helm_get.md) - recupera mais informações de uma dada _release_.
* [helm history](/helm/helm_history.md) - recupera o histórico de uma _release_.
* [helm install](/helm/helm_install.md) - instala um Chart.
* [helm lint](/helm/helm_lint.md) - verifica o Chart por potenciais problemas.
* [helm list](/helm/helm_list.md) - lista as _releases_.
* [helm package](/helm/helm_package.md) - empacota um diretório de um Chart em um Chart Archive.
* [helm plugin](/helm/helm_plugin.md) - instala, lista, ou desinstala plugins do Helm.
* [helm pull](/helm/helm_pull.md) - baixa um Chart de um repositório, e opcionalmente, descompacta-o em um diretório local.
* [helm repo](/helm/helm_repo.md) - adiciona, lista, remove, atualiza, e indexa um repositório de Chart.
* [helm rollback](/helm/helm_rollback.md) - faz a regressão (_roll back_) de uma _release_ para uma versão anterior.
* [helm search](/helm/helm_search.md) - busca por uma palavra-chave entre os Charts.
* [helm show](/helm/helm_show.md) - exibe as informações de um Chart.
* [helm status](/helm/helm_status.md) - exibe o status de uma dada _release_.
* [helm template](/helm/helm_template.md) - renderiza localmente os templates dos manifestos com os valores de configuração.
* [helm test](/helm/helm_test.md) - roda os testes para uma _release_.
* [helm uninstall](/helm/helm_uninstall.md) - desinstala uma _release_.
* [helm upgrade](/helm/helm_upgrade.md) - atualiza uma _release_.
* [helm verify](/helm/helm_verify.md) - verifica se um Chart em um dado caminho foi assinado e está válido.
* [helm version](/helm/helm_version.md) - exibe as informações sobre a versão do cliente helm.