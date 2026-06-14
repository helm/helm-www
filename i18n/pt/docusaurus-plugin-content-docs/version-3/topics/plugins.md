---
title: Guia de Plugins do Helm
description: Apresenta como usar e criar plugins para estender a funcionalidade do Helm.
sidebar_position: 12
---

Um plugin do Helm é uma ferramenta que pode ser acessada através da CLI `helm`,
mas que não faz parte do código-base principal do Helm.

Plugins existentes podem ser encontrados na seção
[relacionados](/community/related#helm-plugins) ou pesquisando no
[GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

Este guia explica como usar e criar plugins.

## Visão Geral

Plugins do Helm são ferramentas complementares que se integram perfeitamente com
o Helm. Eles fornecem uma maneira de estender o conjunto de recursos principais
do Helm, sem exigir que cada novo recurso seja escrito em Go e adicionado à
ferramenta principal.

Plugins do Helm têm as seguintes características:

- Podem ser adicionados e removidos de uma instalação do Helm sem impactar a
  ferramenta principal.
- Podem ser escritos em qualquer linguagem de programação.
- Integram-se com o Helm e aparecem em `helm help` e outros locais.

Plugins do Helm ficam em `$HELM_PLUGINS`. Você pode encontrar o valor atual
desta variável, incluindo o valor padrão quando não definida no ambiente,
usando o comando `helm env`.

O modelo de plugins do Helm é parcialmente baseado no modelo de plugins do Git.
Por isso, você pode às vezes ouvir o `helm` ser referido como a camada
_porcelain_, com os plugins sendo a _plumbing_. Isso significa que o Helm
fornece a interface de alto nível para o usuário, enquanto os plugins realizam o
"trabalho pesado" de executar ações específicas.

## Instalando um Plugin

Plugins são instalados usando o comando `$ helm plugin install <path|url>`. Você
pode passar um caminho para um plugin no seu sistema de arquivos local ou uma
URL de um repositório VCS remoto. O comando `helm plugin install` clona ou copia
o plugin do caminho/URL fornecido para `$HELM_PLUGINS`. Se você estiver
instalando a partir de um VCS, pode especificar a versão com o argumento
`--version`.

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

Se você tiver uma distribuição tar de um plugin, extraia o plugin no diretório
`$HELM_PLUGINS`. Você também pode instalar plugins tarball diretamente de uma
URL usando `helm plugin install https://domain/path/to/plugin.tar.gz`

## Estrutura de Arquivos do Plugin

De muitas formas, um plugin é semelhante a um chart. Cada plugin tem um
diretório de nível superior contendo um arquivo `plugin.yaml`. Arquivos
adicionais podem estar presentes, mas apenas o arquivo `plugin.yaml` é
obrigatório.

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## O Arquivo plugin.yaml

O arquivo plugin.yaml é obrigatório para um plugin. Ele contém os seguintes
campos:

```yaml
name: The name of the plugin (REQUIRED)
version: A SemVer 2 version (REQUIRED)
usage: Single line usage text shown in help
description: Long description shown in places like helm help
ignoreFlags: Ignore flags passed in from Helm
platformCommand: # Configure command to run based on the platform
  - os: OS match, can be empty or omitted to match all OS'
    arch: Architecture match, can be empty or omitted to match all architectures
    command: Plugin command to execute
    args: Plugin command arguments
command: (DEPRECATED) Plugin command, use platformCommand instead
platformHooks: # Configure plugin lifecycle hooks based on the platform
  install: # Install lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin install command to execute
      args: Plugin install command arguments
  update: # Update lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin update command to execute
      args: Plugin update command arguments
  delete: # Delete lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin delete command to execute
      args: Plugin delete command arguments
hooks: # (Deprecated) Plugin lifecycle hooks, use platformHooks instead
  install: Command to install plugin
  update: Command to update plugin
  delete: Command to delete plugin
downloaders: # Configure downloaders capability
  - command: Command to invoke
    protocols:
      - Protocol schema supported
```

### O Campo `name`

O `name` é o nome do plugin. Quando o Helm executa este plugin, este é o nome
que ele usará (por exemplo, `helm NAME` invocará este plugin).

_`name` deve corresponder ao nome do diretório._ No nosso exemplo acima, isso
significa que o plugin com `name: last` deve estar contido em um diretório
chamado `last`.

Restrições em `name`:

- `name` não pode duplicar um dos comandos de nível superior existentes do
  `helm`.
- `name` deve ser restrito aos caracteres ASCII a-z, A-Z, 0-9, `_` e `-`.

### O Campo `version`

O `version` é a versão SemVer 2 do plugin. `usage` e `description` são ambos
usados para gerar o texto de ajuda de um comando.

### O Campo `ignoreFlags`

A opção `ignoreFlags` diz ao Helm para _não_ passar flags para o plugin. Então,
se um plugin for chamado com `helm myplugin --foo` e `ignoreFlags: true`, então
`--foo` é silenciosamente descartado.

### O Campo `platformCommand`

O `platformCommand` configura o comando que o plugin executará quando for
chamado. Você não pode definir tanto `platformCommand` quanto `command`, pois
isso resultará em um erro. As seguintes regras se aplicam na decisão de qual
comando usar:

- Se `platformCommand` estiver presente, ele será usado.
  - Se tanto `os` quanto `arch` corresponderem à plataforma atual, a busca
    parará e o comando será usado.
  - Se `os` corresponder e `arch` estiver vazio, o comando será usado.
  - Se `os` e `arch` estiverem ambos vazios, o comando será usado.
  - Se não houver correspondência, o Helm sairá com um erro.
- Se `platformCommand` não estiver presente e o `command` depreciado estiver
  presente, ele será usado.
  - Se o comando estiver vazio, o Helm sairá com um erro.

### O Campo `platformHooks`

O `platformHooks` configura os comandos que o plugin executará para eventos de
ciclo de vida. Você não pode definir tanto `platformHooks` quanto `hooks`, pois
isso resultará em um erro. As seguintes regras se aplicam na decisão de qual
comando de hook usar:

- Se `platformHooks` estiver presente, ele será usado e os comandos para o
  evento de ciclo de vida serão processados.
  - Se tanto `os` quanto `arch` corresponderem à plataforma atual, a busca
    parará e o comando será usado.
  - Se `os` corresponder e `arch` estiver vazio, o comando será usado.
  - Se `os` e `arch` estiverem ambos vazios, o comando será usado.
  - Se não houver correspondência, o Helm pulará o evento.
- Se `platformHooks` não estiver presente e o `hooks` depreciado estiver
  presente, o comando para o evento de ciclo de vida será usado.
  - Se o comando estiver vazio, o Helm pulará o evento.

## Construindo um Plugin

Aqui está o YAML do plugin para um plugin simples que ajuda a obter o nome do
último release:

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

Plugins podem requerer scripts e executáveis adicionais. Scripts podem ser
incluídos no diretório do plugin e executáveis podem ser baixados via hook. O
seguinte é um exemplo de plugin:

```console
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

Variáveis de ambiente são interpoladas antes do plugin ser executado. O padrão
acima ilustra a maneira preferida de indicar onde o programa do plugin está
localizado.

### Comandos de Plugin

Existem algumas estratégias para trabalhar com comandos de plugin:

- Se um plugin inclui um executável, o executável para um `platformCommand:` ou
  deve ser empacotado no diretório do plugin ou instalado via hook.
- A linha `platformCommand:` ou `command:` terá quaisquer variáveis de ambiente
  expandidas antes da execução. `$HELM_PLUGIN_DIR` apontará para o diretório do
  plugin.
- O comando em si não é executado em um shell. Então você não pode colocar um
  script shell em uma linha.
- O Helm injeta muitas configurações em variáveis de ambiente. Examine o
  ambiente para ver quais informações estão disponíveis.
- O Helm não faz suposições sobre a linguagem do plugin. Você pode escrevê-lo na
  linguagem que preferir.
- Comandos são responsáveis por implementar texto de ajuda específico para `-h`
  e `--help`. O Helm usará `usage` e `description` para `helm help` e
  `helm help myplugin`, mas não tratará `helm myplugin --help`.

### Testando um Plugin Local

Primeiro você precisa encontrar o caminho do seu `HELM_PLUGINS`. Para isso,
execute o seguinte comando:

``` bash
helm env
```

Mude seu diretório atual para o diretório definido em `HELM_PLUGINS`.

Agora você pode adicionar um link simbólico para a saída de build do seu plugin.
Neste exemplo, fizemos isso para o `mapkubeapis`.

``` bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

## Plugins de Download

Por padrão, o Helm pode baixar Charts usando HTTP/S. A partir do Helm 2.4.0,
plugins podem ter uma capacidade especial de baixar Charts de fontes
arbitrárias.

Plugins devem declarar esta capacidade especial no arquivo `plugin.yaml` (nível
superior):

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

Se tal plugin for instalado, o Helm pode interagir com o repositório usando o
esquema de protocolo especificado, invocando o `command`. O repositório especial
deve ser adicionado de forma similar aos regulares:
`helm repo add favorite myprotocol://example.com/`. As regras para repositórios
especiais são as mesmas dos regulares: o Helm deve ser capaz de baixar o arquivo
`index.yaml` para descobrir e armazenar em cache a lista de Charts disponíveis.

O comando definido será invocado com o seguinte esquema:
`command certFile keyFile caFile full-URL`. As credenciais SSL vêm da definição
do repositório, armazenadas em `$HELM_REPOSITORY_CONFIG` (ou seja,
`$HELM_CONFIG_HOME/repositories.yaml`). Um plugin de download deve enviar o
conteúdo bruto para stdout e reportar erros em stderr.

O comando de download também suporta subcomandos ou argumentos, permitindo que
você especifique, por exemplo, `bin/mydownloader subcommand -d` no
`plugin.yaml`. Isso é útil se você quiser usar o mesmo executável para o comando
principal do plugin e o comando de download, mas com um subcomando diferente
para cada um.

## Variáveis de Ambiente

Quando o Helm executa um plugin, ele passa o ambiente externo para o plugin e
também injeta algumas variáveis de ambiente adicionais.

Variáveis como `KUBECONFIG` são definidas para o plugin se estiverem definidas
no ambiente externo.

As seguintes variáveis são garantidas de estar definidas:

- `HELM_PLUGINS`: O caminho para o diretório de plugins.
- `HELM_PLUGIN_NAME`: O nome do plugin, como invocado pelo `helm`. Então
  `helm myplug` terá o nome curto `myplug`.
- `HELM_PLUGIN_DIR`: O diretório que contém o plugin.
- `HELM_BIN`: O caminho para o comando `helm` (como executado pelo usuário).
- `HELM_DEBUG`: Indica se a flag de debug foi definida pelo helm.
- `HELM_REGISTRY_CONFIG`: A localização para a configuração do registro (se
  usado). Note que o uso do Helm com registros é um recurso experimental.
- `HELM_REPOSITORY_CACHE`: O caminho para os arquivos de cache do repositório.
- `HELM_REPOSITORY_CONFIG`: O caminho para o arquivo de configuração do
  repositório.
- `HELM_NAMESPACE`: O namespace dado ao comando `helm` (geralmente usando a flag
  `-n`).
- `HELM_KUBECONTEXT`: O nome do contexto de configuração do Kubernetes dado ao
  comando `helm`.

Além disso, se um arquivo de configuração do Kubernetes foi especificado
explicitamente, ele será definido como a variável `KUBECONFIG`.

## Uma Nota sobre Processamento de Flags

Ao executar um plugin, o Helm processa as flags globais para seu próprio uso.
Nenhuma dessas flags é passada para o plugin.

- `--burst-limit`: Convertido para `$HELM_BURST_LIMIT`
- `--debug`: Se especificado, `$HELM_DEBUG` é definido como `1`
- `--kube-apiserver`: Convertido para `$HELM_KUBEAPISERVER`
- `--kube-as-group`: Convertido para `$HELM_KUBEASGROUPS`
- `--kube-as-user`: Convertido para `$HELM_KUBEASUSER`
- `--kube-ca-file`: Convertido para `$HELM_KUBECAFILE`
- `--kube-context`: Convertido para `$HELM_KUBECONTEXT`
- `--kube-insecure-skip-tls-verify`: Convertido para
  `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY`
- `--kube-tls-server-name`: Convertido para `$HELM_KUBETLS_SERVER_NAME`
- `--kube-token`: Convertido para `$HELM_KUBETOKEN`
- `--kubeconfig`: Convertido para `$KUBECONFIG`
- `--namespace` e `-n`: Convertido para `$HELM_NAMESPACE`
- `--qps`: Convertido para `$HELM_QPS`
- `--registry-config`: Convertido para `$HELM_REGISTRY_CONFIG`
- `--repository-cache`: Convertido para `$HELM_REPOSITORY_CACHE`
- `--repository-config`: Convertido para `$HELM_REPOSITORY_CONFIG`

Plugins _devem_ exibir texto de ajuda e então sair para `-h` e `--help`. Em
todos os outros casos, plugins podem usar flags conforme apropriado.

## Fornecendo Auto-Completação de Shell

A partir do Helm 3.2, um plugin pode opcionalmente fornecer suporte para
auto-completação de shell como parte do mecanismo de auto-completação existente
do Helm.

### Auto-Completação Estática

Se um plugin fornece suas próprias flags e/ou subcomandos, ele pode informar o
Helm sobre eles tendo um arquivo `completion.yaml` localizado no diretório raiz
do plugin. O arquivo `completion.yaml` tem a seguinte forma:

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

Notas:

1. Todas as seções são opcionais, mas devem ser fornecidas se aplicável.
1. Flags não devem incluir o prefixo `-` ou `--`.
1. Tanto flags curtas quanto longas podem e devem ser especificadas. Uma flag
   curta não precisa estar associada à sua forma longa correspondente, mas ambas
   as formas devem ser listadas.
1. Flags não precisam estar ordenadas de nenhuma forma, mas precisam estar
   listadas no ponto correto na hierarquia de subcomandos do arquivo.
1. As flags globais existentes do Helm já são tratadas pelo mecanismo de
   auto-completação do Helm, portanto os plugins não precisam especificar as
   seguintes flags: `--debug`, `--namespace` ou `-n`, `--kube-context` e
   `--kubeconfig`, ou qualquer outra flag global.
1. A lista `validArgs` fornece uma lista estática de possíveis completações para
   o primeiro parâmetro após um subcomando. Nem sempre é possível fornecer tal
   lista antecipadamente (veja a seção [Completação
   Dinâmica](#completação-dinâmica) abaixo), caso em que a seção `validArgs`
   pode ser omitida.

O arquivo `completion.yaml` é totalmente opcional. Se não for fornecido, o Helm
simplesmente não fornecerá auto-completação de shell para o plugin (a menos que
[Completação Dinâmica](#completação-dinâmica) seja suportada pelo plugin). Além
disso, adicionar um arquivo `completion.yaml` é retrocompatível e não impactará
o comportamento do plugin ao usar versões mais antigas do Helm.

Como exemplo, para o [plugin
`fullstatus`](https://github.com/marckhouzam/helm-fullstatus) que não tem
subcomandos mas aceita as mesmas flags que o comando `helm status`, o arquivo
`completion.yaml` é:

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

Um exemplo mais elaborado para o [plugin
`2to3`](https://github.com/helm/helm-2to3), tem um arquivo `completion.yaml` de:

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### Completação Dinâmica

Também a partir do Helm 3.2, plugins podem fornecer sua própria auto-completação
dinâmica de shell. Auto-completação dinâmica de shell é a completação de valores
de parâmetros ou valores de flags que não podem ser definidos antecipadamente.
Por exemplo, completação dos nomes de releases do Helm atualmente disponíveis no
cluster.

Para que o plugin suporte completação dinâmica, ele deve fornecer um arquivo
**executável** chamado `plugin.complete` em seu diretório raiz. Quando o script
de completação do Helm requer completações dinâmicas para o plugin, ele
executará o arquivo `plugin.complete`, passando a linha de comando que precisa
ser completada. O executável `plugin.complete` precisará ter a lógica para
determinar quais são as escolhas de completação adequadas e exibi-las na saída
padrão para serem consumidas pelo script de completação do Helm.

O arquivo `plugin.complete` é totalmente opcional. Se não for fornecido, o Helm
simplesmente não fornecerá auto-completação dinâmica para o plugin. Além disso,
adicionar um arquivo `plugin.complete` é retrocompatível e não impactará o
comportamento do plugin ao usar versões mais antigas do Helm.

A saída do script `plugin.complete` deve ser uma lista separada por novas linhas
como:

```console
rel1
rel2
rel3
```

Quando `plugin.complete` é chamado, o ambiente do plugin é configurado da mesma
forma que quando o script principal do plugin é chamado. Portanto, as variáveis
`$HELM_NAMESPACE`, `$HELM_KUBECONTEXT` e todas as outras variáveis do plugin já
estarão definidas, e suas flags globais correspondentes terão sido removidas.

O arquivo `plugin.complete` pode estar em qualquer forma executável; pode ser um
script shell, um programa Go, ou qualquer outro tipo de programa que o Helm
possa executar. O arquivo `plugin.complete` ***deve*** ter permissões de
execução para o usuário. O arquivo `plugin.complete` ***deve*** sair com um
código de sucesso (valor 0).

Em alguns casos, a completação dinâmica precisará obter informações do cluster
Kubernetes. Por exemplo, o plugin `helm fullstatus` requer um nome de release
como entrada. No plugin `fullstatus`, para que seu script `plugin.complete`
forneça completação para nomes de releases atuais, ele pode simplesmente
executar `helm list -q` e exibir o resultado.

Se for desejado usar o mesmo executável para execução do plugin e para
completação do plugin, o script `plugin.complete` pode ser feito para chamar o
executável principal do plugin com algum parâmetro ou flag especial; quando o
executável principal do plugin detectar o parâmetro ou flag especial, ele saberá
que deve executar a completação. No nosso exemplo, `plugin.complete` poderia ser
implementado assim:

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

O script real do plugin `fullstatus` (`status.sh`) deve então procurar pela flag
`--complete` e, se encontrada, exibir as completações adequadas.

### Dicas e Truques

1. O shell filtrará automaticamente escolhas de completação que não correspondam
   à entrada do usuário. Um plugin pode, portanto, retornar todas as completações
   relevantes sem remover as que não correspondem à entrada do usuário. Por
   exemplo, se a linha de comando for `helm fullstatus ngin<TAB>`, o script
   `plugin.complete` pode exibir *todos* os nomes de releases (do namespace
   `default`), não apenas os que começam com `ngin`; o shell reterá apenas os
   que começam com `ngin`.
1. Para simplificar o suporte à completação dinâmica, especialmente se você
   tiver um plugin complexo, você pode fazer seu script `plugin.complete` chamar
   seu script principal do plugin e solicitar escolhas de completação. Veja a
   seção [Completação Dinâmica](#completação-dinâmica) acima para um exemplo.
1. Para depurar a completação dinâmica e o arquivo `plugin.complete`, você pode
   executar o seguinte para ver os resultados de completação:
    - `helm __complete <pluginName> <arguments to complete>`. Por exemplo:
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`
