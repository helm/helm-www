---
title: Templates Nomeados
description: Como definir templates nomeados.
sidebar_position: 9
---

É hora de ir além de um único template e começar a criar outros. Nesta seção,
veremos como definir _templates nomeados_ em um arquivo e usá-los em outros
lugares. Um _template nomeado_ (às vezes chamado de _partial_ ou _subtemplate_)
é simplesmente um template definido dentro de um arquivo, que recebe um nome.
Veremos duas formas de criá-los e algumas formas diferentes de usá-los.

Na seção [Estruturas de Controle](/chart_template_guide/control_structures.md) introduzimos três ações
para declarar e gerenciar templates: `define`, `template` e `block`. Nesta
seção, abordaremos essas três ações e também apresentaremos uma função especial
chamada `include`, que funciona de forma semelhante à ação `template`.

Um detalhe importante a ter em mente ao nomear templates: **os nomes de templates
são globais**. Se você declarar dois templates com o mesmo nome, aquele que for
carregado por último será o utilizado. Como templates em subcharts são compilados
junto com templates de nível superior, você deve ter cuidado ao nomear seus
templates com _nomes específicos do chart_.

Uma convenção de nomenclatura popular é prefixar cada template definido com o
nome do chart: `{{ define "mychart.labels" }}`. Usando o nome específico do
chart como prefixo, podemos evitar conflitos que possam surgir devido a dois
charts diferentes que implementam templates com o mesmo nome.

Esse comportamento também se aplica a diferentes versões de um chart. Se você
tiver `mychart` versão `1.0.0` que define um template de uma forma, e `mychart`
versão `2.0.0` que modifica o template nomeado existente, será usado aquele que
foi carregado por último. Você pode contornar esse problema adicionando também
uma versão no nome do chart: `{{ define "mychart.v1.labels" }}` e
`{{ define "mychart.v2.labels" }}`.

## Partials e arquivos `_`

Até agora, usamos um único arquivo, e esse arquivo continha um único template.
Mas a linguagem de templates do Helm permite criar templates incorporados
nomeados, que podem ser acessados pelo nome em outros lugares.

Antes de escrever esses templates, há uma convenção de nomenclatura de arquivos
que vale mencionar:

* A maioria dos arquivos em `templates/` é tratada como se contivesse manifestos
  Kubernetes
* O `NOTES.txt` é uma exceção
* Mas arquivos cujo nome começa com underscore (`_`) assumem-se como _não_ tendo
  um manifesto dentro. Esses arquivos não são renderizados como definições de
  objetos Kubernetes, mas estão disponíveis em todos os outros templates do
  chart para uso.

Esses arquivos são usados para armazenar partials e helpers. Na verdade, quando
criamos `mychart` pela primeira vez, vimos um arquivo chamado `_helpers.tpl`.
Esse arquivo é o local padrão para partials de template.

## Declarando e usando templates com `define` e `template`

A ação `define` permite criar um template nomeado dentro de um arquivo de
template. Sua sintaxe é assim:

```yaml
{{- define "MY.NAME" }}
  # corpo do template aqui
{{- end }}
```

Por exemplo, podemos definir um template para encapsular um bloco de labels
do Kubernetes:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Agora podemos incorporar esse template dentro do nosso ConfigMap existente e
incluí-lo com a ação `template`:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Quando o motor de templates lê este arquivo, ele armazena a referência ao
`mychart.labels` até que `template "mychart.labels"` seja chamado. Então ele
renderiza esse template inline. O resultado será assim:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Nota: um `define` não produz saída a menos que seja chamado com um template,
como neste exemplo.

Convencionalmente, os charts do Helm colocam esses templates dentro de um
arquivo de partials, geralmente `_helpers.tpl`. Vamos mover esta função para lá:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Por convenção, funções `define` devem ter um bloco de documentação simples
(`{{/* ... */}}`) descrevendo o que fazem.

Mesmo que esta definição esteja em `_helpers.tpl`, ela ainda pode ser acessada
em `configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Como mencionado acima, **os nomes de templates são globais**. Como resultado,
se dois templates forem declarados com o mesmo nome, a última ocorrência será
a utilizada. Como templates em subcharts são compilados junto com templates de
nível superior, é melhor nomear seus templates com _nomes específicos do chart_.
Uma convenção de nomenclatura popular é prefixar cada template definido com o
nome do chart: `{{ define "mychart.labels" }}`.

## Definindo o escopo de um template

No template que definimos acima, não usamos nenhum objeto. Apenas usamos
funções. Vamos modificar nosso template definido para incluir o nome e a versão
do chart:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

Se renderizarmos isso, obteremos um erro como este:

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

Para ver o que foi renderizado, execute novamente com `--disable-openapi-validation`:
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`.
O resultado não será o que esperamos:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart:
    version:
```

O que aconteceu com o nome e a versão? Eles não estavam no escopo do nosso
template definido. Quando um template nomeado (criado com `define`) é
renderizado, ele recebe o escopo passado pela chamada `template`. No nosso
exemplo, incluímos o template assim:

```yaml
{{- template "mychart.labels" }}
```

Nenhum escopo foi passado, então dentro do template não podemos acessar nada em
`.`. Isso é fácil de corrigir. Basta passar um escopo para o template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

Note que passamos `.` no final da chamada `template`. Poderíamos facilmente
passar `.Values` ou `.Values.favorite` ou qualquer escopo que quisermos. Mas o
que queremos é o escopo de nível superior. No contexto do template nomeado, `$`
se referirá ao escopo que você passou, e não a algum escopo global.

Agora, quando executamos este template com `helm install --dry-run --debug
plinking-anaco ./mychart`, obtemos isto:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plinking-anaco-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart: mychart
    version: 0.1.0
```

Agora `{{ .Chart.Name }}` resolve para `mychart`, e `{{ .Chart.Version }}`
resolve para `0.1.0`.

## A função `include`

Digamos que definimos um template simples assim:

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

Agora digamos que quero inserir isso tanto na seção `labels:` do meu template,
quanto na seção `data:`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

Se renderizarmos isso, obteremos um erro como este:

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

Para ver o que foi renderizado, execute novamente com `--disable-openapi-validation`:
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`.
A saída não será o que esperamos:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: measly-whippet-configmap
  labels:
    app_name: mychart
app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
app_name: mychart
app_version: "0.1.0"
```

Note que a indentação de `app_version` está errada em ambos os lugares. Por quê?
Porque o template substituído tem o texto alinhado à esquerda. Como `template`
é uma ação, e não uma função, não há como passar a saída de uma chamada
`template` para outras funções; os dados são simplesmente inseridos inline.

Para contornar esse caso, o Helm fornece uma alternativa ao `template` que
importa o conteúdo de um template para o pipeline atual, onde pode ser passado
para outras funções no pipeline.

Aqui está o exemplo acima, corrigido usando `indent` para indentar o template
`mychart.app` corretamente:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

Agora o YAML produzido está corretamente indentado para cada seção:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-mole-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
  app_name: mychart
  app_version: "0.1.0"
```

> É considerado preferível usar `include` em vez de `template` em templates do
> Helm simplesmente para que a formatação de saída possa ser melhor controlada
> para documentos YAML.

Às vezes queremos importar conteúdo, mas não como templates. Ou seja, queremos
importar arquivos literalmente. Podemos fazer isso acessando arquivos através do
objeto `.Files` descrito na próxima seção.
