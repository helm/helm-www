---
title: helm install
---
Instala um Chart

### Sinopse

Esse comando instala um [_Chart Archive_](/glossary/index.mdx#chart-archive).

O argumento de instalação deve ser uma referência a um Chart, ou um caminho para
um Chart empacotado, ou um caminho para um Chart descompactado ou uma URL.

Para sobrescrever os valores em um Chart use tanto o argumento `--values` indicando
um arquivo `yaml` para os valores ou o argumento `--set` passando os valores através
da linha de comando. Para forçar um valor passado no formato string use o argumento
`--set-string`. No caso de valores grandes considere utilizar o argumento `--set-file`
ao invés de `--values` ou `--set`, para ler um único grande valor a partir de um
arquivo.

    $ helm install -f myvalues.yaml myredis ./redis

ou

    $ helm install --set name=prod myredis ./redis

ou

    $ helm install --set-string long_int=1234567890 myredis ./redis

ou

    $ helm install --set-file my_script=dothings.sh myredis ./redis

É possível especificar o argumento `--values` / `-f` diversas vezes. A prioridade
será concedida para o último (mais a direita) arquivo passado. Por exemplo. se ambos
`myvalues.yaml` e `override.yaml` contém uma chave `Test`, o valor configurado em
`override.yaml` terá precedência:

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

É possível especificar o argumento `--set` diversas vezes. A prioridade será concedida
para o último (mais a direita) argumento passado. Por exemplo. se ambos os valores
`bar` and `newbar` são configurados para uma chave `foo`, o valor `newbar`
terá precedência:

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

Os argumentos `--debug` e `--dry-run` podem ser combinados com o comando `helm install`
para verificar os manifestos gerados de uma release sem instalar o Chart.

Se o argumento `--verify` for utilizado, o Chart **DEVE** ter um arquivo de [linhagem](/glossary/index.mdx#linhagem-arquivo-de-linhagem),
e este arquivo **DEVE** passar em todas as etapas de verificação.

Há cinco maneiras diferentes de se instalar um Chart:

1. Pela referência do Chart: `helm install mymaria example/mariadb`
2. Pelo caminho para um Chart empacotado: `helm install mynginx ./nginx-1.2.3.tgz`
3. Pelo caminho para um diretório do Chart descompactado: `helm install mynginx ./nginx`
4. Por uma URL absoluta: `helm install mynginx https://example.com/charts/nginx-1.2.3.tgz`
5. Pela referência do Chart e URL do repositório: `helm install --repo https://example.com/charts/ mynginx nginx`

#### Referências do Chart

Uma referência de um Chart é uma forma conveniente de apontar um Chart em um repositório
de Charts.

Quando você utiliza uma referência a um Chart junto com o prefixo do repositório
(`exemplo/mariadb`), o Helm procurará nas configurações locais  pelo repositório
`exemplo`, e dentro dele irá procurar pelo Chart `mariadb`. Assim, o Helm instalará
a última versão estável do Chart, a menos que seja passado o argumento `--devel`
a fim de considerar também versões de desenvolvimento (alfa, beta, e _release candidates_),
ou passando um número da versão de uma _release_ através do argumento `--version`.

Para exibir uma lista de Charts contidos em um repositório use `helm repo list`.
Para pesquisar Charts específicos em um repositório use `helm search`.

```
helm install [NOME_DA_SUA_RELEASE] [CHART] [argumentos]
```

### Opções

```
      --rollback-on-failure          os manifestos já aplicados serão deletados caso haja uma falha durante a instalação. O argumento --wait será configurado nesse caso
      --ca-file string               verifica os certificados dos servidores HTTPS utilizando o pacote CA especificado
      --cert-file string             identifica o cliente HTTPS utilizando o certificado SSL especificado
      --create-namespace             cria um namespace para a release caso ainda não exista
      --dependency-update            executa o comando "helm dependency update" antes da instalação do Chart
      --description string           adiciona uma descrição para a release
      --devel                        também considera versões de desenvolvimento. Equivalente a versão '>0.0.0-0'. É ignorado caso o argumento --version seja passado
      --disable-openapi-validation   o processo de instalação não validará os templates renderizados com os valores contra o Kubernetes OpenAPI Schema
      --dry-run                      simula uma instalação
  -g, --generate-name                gera um novo nome de release (e omite o parâmetro NOME_DA_SUA_RELEASE)
  -h, --help                         exibe ajuda para a instalação da release
      --insecure-skip-tls-verify     ignora a verificação do certificado tls para o download do Chart
      --key-file string              identifica o cliente HTTPS com a chave SSL passada
      --keyring string               caminho das chaves públicas para verificação (padrão "~/.gnupg/pubring.gpg")
      --name-template string         especifica o template usado para nomear a release
      --no-hooks                     evita que hooks sejam executados durante a instalação
  -o, --output format                exibe a saída da release instalada em um formato específico. Valores permitidos: table, json, yaml (padrão table)
      --pass-credentials             passa as credentiais para todos os domínios
      --password string              senha do repositório de Chart necessária para localizar o Chart em questão
      --post-renderer postrenderer   caminho para um executável a ser rodado após as renderização do template. Se o caminho existir em $PATH, o binário será executado, senão ele tentará buscar no caminho especificado (padrão exec)
      --render-subchart-notes        se configurado, renderizará notas de um subchart juntamente com o Chart principal
      --replace                      reaproveita o nome da release, somente se o nome da release deletada ainda estiver no histórico. Essa operação não é segura em produção
      --repo string                  endereço URL do repositório de Charts que contém o Chart a ser instalado
      --set stringArray              configura os valores a serem usados nos templates dos manifestos via linha de comando (pode-se configurar múltiplos valores separados por vírgula: key1=val1,key2=val2)
      --set-file stringArray         configura os valores a partir de arquivos especificados via linha de comando (pode-se configurar múltiplos valores separados por vírgula: key1=path1,key2=path2)
      --set-string stringArray       configura os valores no formato STRING via linha de comando (pode-se configurar múltiplos valores separados por vírgula: key1=val1,key2=val2)
      --skip-crds                    se configurado nenhum CRDs será instalado. Por padrão os CRDs são instalados se já não estiverem presentes no cluster
      --timeout duration             timeout para qualquer operação individual do Kubernetes (como Jobs para hooks) (padrão 5m0s)
      --username string              usuário do repositório de Chart onde localizará o Chart
  -f, --values strings               especifica os valores atráves de um arquivo YAML file ou uma URL (pode especificar vários arquivos YAML)
      --verify                       verifica o pacote antes de utilizá-lo
      --version string               especifica os limites de versão para um Chart utilizar. Pode ser um limite específico (ex: 1.1.1) ou uma referência para um intervalo de versões (ex: ^2.0.0). A versão mais recente será utilizada caso a versão não seja especificada
      --wait                         se configurado, esperará até todos os Pods, PVCs, Services, e um número mínimo dos Pods de um Deployment, StatefulSet, ou ReplicaSet estejam disponíveis e prontos (ready) antes de marcar a release como pronta. Esperará até o --timeout
      --wait-for-jobs                se configurado e o argumento --wait for passado, esperará até todos os Jobs serem completados antes de marcar a release como pronta. Esperará até o --timeout
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
      --registry-config string      caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry.json")
      --repository-cache string     caminho para os índices "cacheados" no repositório (padrão "~/.cache/helm/repository")
      --repository-config string    caminho para o arquivo path to the file containing repository names and URLs (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](/helm/helm.md) - Helm, o gerenciador de pacotes para o Kubernetes.