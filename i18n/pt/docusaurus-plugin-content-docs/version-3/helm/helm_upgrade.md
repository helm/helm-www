---
title: helm upgrade
---

Atualiza uma release para uma nova versão de um chart

### Sinopse

Esse comando atualiza uma release para uma nova versão de um chart.

Os argumentos do comando upgrade devem ser uma release e um chart. O argumento
do chart pode ser: uma referência de chart ('example/mariadb'), um caminho para
um diretório de chart, um chart empacotado, ou uma URL completa. Para referências
de chart, a versão mais recente será utilizada a menos que o argumento `--version`
seja especificado.

Para sobrescrever valores em um chart, use o argumento `--values` indicando um
arquivo ou use o argumento `--set` passando a configuração via linha de comando.
Para forçar valores no formato string use `--set-string`. Você pode usar `--set-file`
para configurar valores individuais a partir de um arquivo quando o valor é muito
grande para a linha de comando ou é gerado dinamicamente. Você também pode usar
`--set-json` para configurar valores JSON (escalares/objetos/arrays) via linha
de comando.

Você pode especificar o argumento `--values`/`-f` diversas vezes. A prioridade
será concedida para o último (mais a direita) arquivo especificado. Por exemplo,
se ambos myvalues.yaml e override.yaml contêm uma chave chamada 'Test', o valor
configurado em override.yaml terá precedência:

    $ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

Você pode especificar o argumento `--set` diversas vezes. A prioridade será
concedida para o último (mais a direita) valor especificado. Por exemplo, se
ambos os valores 'bar' e 'newbar' são configurados para uma chave chamada 'foo',
o valor 'newbar' terá precedência:

    $ helm upgrade --set foo=bar --set foo=newbar redis ./redis

Você pode atualizar os valores de uma release existente com esse comando usando
o argumento `--reuse-values`. Os argumentos 'RELEASE' e 'CHART' devem ser definidos
com os parâmetros originais, e os valores existentes serão mesclados com quaisquer
valores configurados via `--values`/`-f` ou argumentos `--set`. A prioridade é
concedida aos novos valores.

    $ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis

O argumento --dry-run exibirá todos os manifestos gerados do chart, incluindo
Secrets que podem conter valores sensíveis. Para ocultar Kubernetes Secrets use
o argumento --hide-secret. Por favor considere cuidadosamente como e quando esses
argumentos são utilizados.


```
helm upgrade [RELEASE] [CHART] [flags]
```

### Opções

```
      --atomic                                     se configurado, o processo de upgrade reverte as alterações feitas em caso de falha. O argumento --wait será configurado automaticamente se --atomic for usado
      --ca-file string                             verifica os certificados dos servidores HTTPS utilizando o pacote CA especificado
      --cert-file string                           identifica o cliente HTTPS utilizando o certificado SSL especificado
      --cleanup-on-fail                            permite a exclusão de novos recursos criados neste upgrade quando o upgrade falhar
      --create-namespace                           se --install for configurado, cria o namespace da release se não existir
      --dependency-update                          atualiza as dependências se estiverem faltando antes de instalar o chart
      --description string                         adiciona uma descrição personalizada
      --devel                                      também considera versões de desenvolvimento. Equivalente a versão '>0.0.0-0'. Ignorado se --version for configurado
      --disable-openapi-validation                 se configurado, o processo de upgrade não validará os templates renderizados contra o Kubernetes OpenAPI Schema
      --dry-run string[="client"]                  simula uma instalação. Se --dry-run for configurado sem opção especificada ou como '--dry-run=client', não tentará conexões com o cluster. Configurando '--dry-run=server' permite tentar conexões com o cluster.
      --enable-dns                                 habilita consultas DNS ao renderizar templates
      --force                                      força atualizações de recursos através de uma estratégia de substituição
  -h, --help                                       exibe ajuda para o comando upgrade
      --hide-notes                                 se configurado, não exibe as notas na saída do upgrade. Não afeta a presença nos metadados do chart
      --hide-secret                                oculta Kubernetes Secrets quando também usar o argumento --dry-run
      --history-max int                            limita o número máximo de revisões salvas por release. Use 0 para sem limite (padrão 10)
      --insecure-skip-tls-verify                   ignora a verificação do certificado TLS para o download do chart
  -i, --install                                    se uma release com esse nome não existir, executa uma instalação
      --key-file string                            identifica o cliente HTTPS utilizando a chave SSL especificada
      --keyring string                             caminho das chaves públicas para verificação (padrão "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Labels que seriam adicionados aos metadados da release. Devem ser separados por vírgula. Labels originais da release serão mesclados com os labels do upgrade. Você pode remover um label usando null. (padrão [])
      --no-hooks                                   desabilita hooks de pré/pós upgrade
  -o, --output format                              exibe a saída no formato especificado. Valores permitidos: table, json, yaml (padrão table)
      --pass-credentials                           passa as credenciais para todos os domínios
      --password string                            senha do repositório de charts onde localizar o chart solicitado
      --plain-http                                 usa conexões HTTP inseguras para o download do chart
      --post-renderer postRendererString           caminho para um executável a ser usado para pós-renderização. Se existir em $PATH, o binário será usado, senão tentará buscar o executável no caminho especificado
      --post-renderer-args postRendererArgsSlice   um argumento para o post-renderer (pode especificar múltiplos) (padrão [])
      --render-subchart-notes                      se configurado, renderiza notas de subcharts juntamente com o chart principal
      --repo string                                URL do repositório de charts onde localizar o chart solicitado
      --reset-then-reuse-values                    ao atualizar, redefine os valores para os embutidos no chart, aplica os valores da última release e mescla quaisquer sobrescritas da linha de comando via --set e -f. Ignorado se '--reset-values' ou '--reuse-values' for especificado
      --reset-values                               ao atualizar, redefine os valores para os embutidos no chart
      --reuse-values                               ao atualizar, reutiliza os valores da última release e mescla quaisquer sobrescritas da linha de comando via --set e -f. Ignorado se '--reset-values' for especificado
      --set stringArray                            configura valores via linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=val1,key2=val2)
      --set-file stringArray                       configura valores a partir de arquivos especificados via linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=path1,key2=path2)
      --set-json stringArray                       configura valores JSON via linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    configura um valor STRING literal via linha de comando
      --set-string stringArray                     configura valores STRING via linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=val1,key2=val2)
      --skip-crds                                  se configurado, nenhum CRD será instalado quando um upgrade for executado com o argumento install habilitado. Por padrão, CRDs são instalados se ainda não estiverem presentes, quando um upgrade for executado com o argumento install habilitado
      --skip-schema-validation                     se configurado, desabilita a validação do JSON schema
      --take-ownership                             se configurado, o upgrade ignorará a verificação de anotações do helm e assumirá a propriedade dos recursos existentes
      --timeout duration                           tempo de espera para qualquer operação individual do Kubernetes (como Jobs para hooks) (padrão 5m0s)
      --username string                            usuário do repositório de charts onde localizar o chart solicitado
  -f, --values strings                             especifica valores em um arquivo YAML ou uma URL (pode especificar múltiplos)
      --verify                                     verifica o pacote antes de utilizá-lo
      --version string                             especifica uma restrição de versão para a versão do chart a usar. Pode ser uma tag específica (ex: 1.1.1) ou uma referência para um intervalo válido (ex: ^2.0.0). Se não especificado, a versão mais recente é usada
      --wait                                       se configurado, esperará até todos os Pods, PVCs, Services e um número mínimo de Pods de um Deployment, StatefulSet ou ReplicaSet estejam em estado pronto antes de marcar a release como bem-sucedida. Esperará pelo tempo definido em --timeout
      --wait-for-jobs                              se configurado e --wait habilitado, esperará até todos os Jobs serem completados antes de marcar a release como bem-sucedida. Esperará pelo tempo definido em --timeout
```

### Opções gerais

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída verbosa
      --kube-apiserver string           o endereço e porta do Kubernetes API server
      --kube-as-group stringArray       grupo a representar para a operação, esse argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             usuário a representar para a operação
      --kube-ca-file string             arquivo de autoridade de certificado para conexão com o Kubernetes API server
      --kube-context string             nome do contexto do kubeconfig a usar
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será verificado quanto à validade. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a usar para validação do certificado do Kubernetes API server. Se não fornecido, o hostname usado para contatar o servidor é usado
      --kube-token string               bearer token usado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo do namespace para esta requisição
      --qps float32                     consultas por segundo usadas ao comunicar com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo índices de repositórios em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](/helm/helm.md)	 - O gerenciador de pacotes Helm para o Kubernetes.

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
