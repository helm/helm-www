---
title: Charts de Biblioteca
description: Explica charts de biblioteca e exemplos de uso
sidebar_position: 4
---

Um chart de biblioteca é um tipo de [chart Helm](/topics/charts.md)
que define primitivas ou definições de charts que podem ser compartilhadas por
templates Helm em outros charts. Isso permite que os usuários compartilhem
trechos de código que podem ser reutilizados em diferentes charts, evitando
repetição e mantendo os charts
[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

O chart de biblioteca foi introduzido no Helm 3 para reconhecer formalmente os
charts comuns ou auxiliares que têm sido usados por mantenedores de charts desde
o Helm 2. Ao incluí-lo como um tipo de chart, ele fornece:
- Um meio de distinguir explicitamente entre charts comuns e de aplicação
- Lógica para impedir a instalação de um chart comum
- Sem renderização de templates em um chart comum que pode conter artefatos de
  release
- Permite que charts dependentes usem o contexto do chart importador

Um mantenedor de chart pode definir um chart comum como um chart de biblioteca e
ter a confiança de que o Helm irá manipular o chart de forma padrão e
consistente. Também significa que definições em um chart de aplicação podem ser
compartilhadas alterando o tipo do chart.

## Criando um Chart de Biblioteca Simples

Como mencionado anteriormente, um chart de biblioteca é um tipo de [chart Helm](/topics/charts.md). Isso significa que você pode começar criando um
chart base:

```console
$ helm create mylibchart
Creating mylibchart
```

Primeiro, você vai remover todos os arquivos no diretório `templates`, pois
criaremos nossas próprias definições de templates neste exemplo.

```console
$ rm -rf mylibchart/templates/*
```

O arquivo values também não será necessário.

```console
$ rm -f mylibchart/values.yaml
```

Antes de começarmos a criar código comum, vamos fazer uma rápida revisão de
alguns conceitos relevantes do Helm. Um [template nomeado](/chart_template_guide/named_templates.md) (às vezes chamado de partial
ou subtemplate) é simplesmente um template definido dentro de um arquivo e que
recebe um nome. No diretório `templates/`, qualquer arquivo que começa com
underscore (_) não é esperado que gere um arquivo de manifesto do Kubernetes.
Então, por convenção, templates auxiliares e partials são colocados em arquivos
`_*.tpl` ou `_*.yaml`.

Neste exemplo, vamos criar um ConfigMap comum que cria um recurso ConfigMap
vazio. Vamos definir o ConfigMap comum no arquivo
`mylibchart/templates/_configmap.yaml` da seguinte forma:

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

A estrutura do ConfigMap é definida no template nomeado
`mylibchart.configmap.tpl`. É um ConfigMap simples com um recurso vazio, `data`.
Dentro deste arquivo, há outro template nomeado chamado `mylibchart.configmap`.
Este template nomeado inclui outro template nomeado `mylibchart.util.merge` que
recebe 2 templates nomeados como argumentos: o template que chama
`mylibchart.configmap` e `mylibchart.configmap.tpl`.

A função auxiliar `mylibchart.util.merge` é um template nomeado em
`mylibchart/templates/_util.yaml`. É um utilitário prático do [Chart Auxiliar
Comum do Helm](#o-chart-auxiliar-comum-do-helm) porque ele mescla os 2 templates
e sobrescreve quaisquer partes comuns em ambos:

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

Isso é importante quando um chart deseja usar código comum que precisa
personalizar com sua configuração.

Finalmente, vamos alterar o tipo do chart para `library`. Isso requer editar
`mylibchart/Chart.yaml` da seguinte forma:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application and it is recommended to use it with quotes.
appVersion: "1.16.0"
```

O chart de biblioteca agora está pronto para ser compartilhado e sua definição
de ConfigMap para ser reutilizada.

Antes de prosseguir, vale verificar se o Helm reconhece o chart como um chart de
biblioteca:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Usando o Chart de Biblioteca Simples

É hora de usar o chart de biblioteca. Isso significa criar um chart base
novamente:

```console
$ helm create mychart
Creating mychart
```

Vamos limpar os arquivos de template novamente, pois queremos criar apenas um
ConfigMap:

```console
$ rm -rf mychart/templates/*
```

Quando queremos criar um ConfigMap simples em um template Helm, ele poderia se
parecer com o seguinte:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

No entanto, vamos reutilizar o código comum já criado em `mylibchart`. O
ConfigMap pode ser criado no arquivo `mychart/templates/configmap.yaml` da
seguinte forma:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Você pode ver que isso simplifica o trabalho que temos que fazer ao herdar a
definição comum do ConfigMap que adiciona propriedades padrão para o ConfigMap.
Em nosso template, adicionamos a configuração, neste caso a chave de dados
`myvalue` e seu valor. A configuração sobrescreve o recurso vazio do ConfigMap
comum. Isso é possível por causa da função auxiliar `mylibchart.util.merge` que
mencionamos na seção anterior.

Para poder usar o código comum, precisamos adicionar `mylibchart` como uma
dependência. Adicione o seguinte ao final do arquivo `mychart/Chart.yaml`:

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Isso inclui o chart de biblioteca como uma dependência dinâmica do sistema de
arquivos que está no mesmo caminho pai do nosso chart de aplicação. Como estamos
incluindo o chart de biblioteca como uma dependência dinâmica, precisamos
executar `helm dependency update`. Ele copiará o chart de biblioteca para o
diretório `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Agora estamos prontos para implantar nosso chart. Antes de instalar, vale
verificar o template renderizado primeiro.

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

Isso parece o ConfigMap que queremos com a sobrescrita de dados de `myvalue:
Hello World`. Vamos instalá-lo:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Podemos recuperar o release e ver que o template real foi carregado.

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## Benefícios do Chart de Biblioteca
Por causa da sua incapacidade de atuar como charts independentes, charts de biblioteca podem aproveitar as seguintes funcionalidades:
- O objeto `.Files` referencia os caminhos de arquivo no chart pai, em vez do caminho local do chart de biblioteca
- O objeto `.Values` é o mesmo do chart pai, em contraste com [subcharts](/chart_template_guide/subcharts_and_globals.md) de aplicação que recebem a seção de valores configurada sob seu cabeçalho no pai.


## O Chart Auxiliar Comum do Helm

```markdown
Nota: O repositório do Chart Auxiliar Comum do Helm no GitHub não é mais mantido ativamente, e o repositório foi descontinuado e arquivado.
```

Este [chart](https://github.com/helm/charts/tree/master/incubator/common) foi o
padrão original para charts comuns. Ele fornece utilitários que refletem as
melhores práticas do desenvolvimento de charts Kubernetes. Melhor ainda, você
pode usá-lo imediatamente ao desenvolver seus charts para obter código
compartilhado útil.

Aqui está uma maneira rápida de usá-lo. Para mais detalhes, consulte o
[README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Crie um chart base novamente:

```console
$ helm create demo
Creating demo
```

Vamos usar o código comum do chart auxiliar. Primeiro, edite o deployment
`demo/templates/deployment.yaml` da seguinte forma:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g.
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}
```

E agora o arquivo de service, `demo/templates/service.yaml` da seguinte forma:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g.
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

Estes templates mostram como herdar o código comum do chart auxiliar simplifica
sua codificação até a configuração ou personalização dos recursos.

Para poder usar o código comum, precisamos adicionar `common` como uma
dependência. Adicione o seguinte ao final do arquivo `demo/Chart.yaml`:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Nota: Você precisará adicionar o repositório `incubator` à lista de repositórios
do Helm (`helm repo add`).

Como estamos incluindo o chart como uma dependência dinâmica, precisamos
executar `helm dependency update`. Ele copiará o chart auxiliar para o diretório
`charts/`.

Como o chart auxiliar usa algumas estruturas do Helm 2, você precisará adicionar
o seguinte ao `demo/values.yaml` para habilitar o carregamento da imagem `nginx`
pois isso foi atualizado no chart base do Helm 3:

```yaml
image:
  tag: 1.16.0
```

Você pode testar se os templates do chart estão corretos antes de implantar usando os comandos `helm lint` e `helm template`.

Se estiver tudo certo, implante usando `helm install`!
