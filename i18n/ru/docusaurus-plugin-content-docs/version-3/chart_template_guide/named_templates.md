---
title: Именованные шаблоны
description: Как определять именованные шаблоны.
sidebar_position: 9
---

Пришло время выйти за рамки одного шаблона и начать создавать новые. В этом разделе мы рассмотрим, как определять _именованные шаблоны_ в одном файле и использовать их в других местах. _Именованный шаблон_ (иногда называемый _частичным шаблоном_ или _подшаблоном_) — это просто шаблон, определённый внутри файла, которому присвоено имя. Мы рассмотрим два способа их создания и несколько способов использования.

В разделе [Управление потоком выполнения](./control_structures.md) мы познакомились с тремя действиями для объявления и управления шаблонами: `define`, `template` и `block`. В этом разделе мы подробнее рассмотрим эти три действия, а также специальную функцию `include`, которая работает аналогично действию `template`.

Важная деталь, которую следует помнить при именовании шаблонов: **имена шаблонов глобальны**. Если вы объявите два шаблона с одинаковым именем, будет использован тот, который загружен последним. Поскольку шаблоны субчартов компилируются вместе с шаблонами верхнего уровня, следует давать шаблонам _имена, специфичные для чарта_.

Популярное соглашение об именовании — добавлять к каждому определённому шаблону префикс с именем чарта: `{{ define "mychart.labels" }}`. Использование конкретного имени чарта в качестве префикса позволяет избежать конфликтов, которые могут возникнуть из-за двух разных чартов с шаблонами одинакового имени.

Это поведение также применимо к разным версиям одного чарта. Если у вас есть `mychart` версии `1.0.0`, который определяет шаблон одним способом, и `mychart` версии `2.0.0`, который изменяет существующий именованный шаблон, будет использован тот, который загружен последним. Чтобы обойти эту проблему, можно также добавить версию в имя чарта: `{{ define "mychart.v1.labels" }}` и `{{ define "mychart.v2.labels" }}`.

## Частичные шаблоны и файлы с `_`

До сих пор мы использовали один файл с одним шаблоном. Но язык шаблонов Helm позволяет создавать именованные встроенные шаблоны, к которым можно обращаться по имени из других мест.

Прежде чем перейти к деталям написания таких шаблонов, стоит упомянуть соглашение об именовании файлов:

* Большинство файлов в `templates/` обрабатываются как содержащие манифесты Kubernetes
* `NOTES.txt` является исключением
* Однако файлы, имена которых начинаются с подчёркивания (`_`), считаются _не содержащими_ манифестов. Эти файлы не преобразуются в определения объектов Kubernetes, но доступны везде в других шаблонах чарта для использования.

Эти файлы используются для хранения частичных шаблонов и вспомогательных функций. Когда мы впервые создали `mychart`, мы видели файл `_helpers.tpl`. Этот файл является местом по умолчанию для хранения частичных шаблонов.

## Объявление и использование шаблонов с `define` и `template`

Действие `define` позволяет создать именованный шаблон внутри файла шаблона. Его синтаксис выглядит так:

```yaml
{{- define "MY.NAME" }}
  # тело шаблона здесь
{{- end }}
```

Например, мы можем определить шаблон для инкапсуляции блока меток Kubernetes:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Теперь мы можем встроить этот шаблон в наш существующий ConfigMap и включить его с помощью действия `template`:

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

Когда шаблонизатор читает этот файл, он сохраняет ссылку на `mychart.labels` до тех пор, пока не будет вызван `template "mychart.labels"`. Затем он отрисует этот шаблон на месте. Результат будет выглядеть так:

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

Примечание: `define` не производит вывод, пока не будет вызван с помощью `template`, как в этом примере.

По соглашению, в чартах Helm эти шаблоны помещаются в файл частичных шаблонов, обычно `_helpers.tpl`. Давайте переместим эту функцию туда:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

По соглашению, функции `define` должны иметь простой блок документации (`{{/* ... */}}`), описывающий их назначение.

Хотя это определение находится в `_helpers.tpl`, к нему всё равно можно обращаться из `configmap.yaml`:

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

Как упоминалось выше, **имена шаблонов глобальны**. В результате, если два шаблона объявлены с одинаковым именем, будет использован последний. Поскольку шаблоны субчартов компилируются вместе с шаблонами верхнего уровня, лучше давать шаблонам _имена, специфичные для чарта_. Популярное соглашение об именовании — добавлять к каждому определённому шаблону префикс с именем чарта: `{{ define "mychart.labels" }}`.

## Установка области видимости шаблона

В определённом выше шаблоне мы не использовали никаких объектов — только функции. Давайте изменим наш определённый шаблон, чтобы включить имя и версию чарта:

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

Если мы отрисуем это, получим ошибку:

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

Чтобы увидеть результат рендеринга, выполните команду с `--disable-openapi-validation`:
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`.
Результат будет не таким, как ожидалось:

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

Что произошло с именем и версией? Они не были в области видимости нашего определённого шаблона. Когда именованный шаблон (созданный с помощью `define`) отрисовывается, он получает область видимости, переданную при вызове `template`. В нашем примере мы включили шаблон так:

```yaml
{{- template "mychart.labels" }}
```

Область видимости не была передана, поэтому внутри шаблона мы не можем обращаться к чему-либо в `.`. Это легко исправить — просто передайте область видимости в шаблон:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

Обратите внимание, что мы передаём `.` в конце вызова `template`. Мы могли бы также передать `.Values` или `.Values.favorite` или любую другую нужную область видимости. Но нам нужна область видимости верхнего уровня. В контексте именованного шаблона `$` будет ссылаться на переданную область видимости, а не на какую-то глобальную.

Теперь, если мы выполним этот шаблон с `helm install --dry-run --debug plinking-anaco ./mychart`, получим:

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

Теперь `{{ .Chart.Name }}` преобразуется в `mychart`, а `{{ .Chart.Version }}` — в `0.1.0`.

## Функция `include`

Допустим, мы определили простой шаблон, который выглядит так:

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

Теперь допустим, что мы хотим вставить его как в раздел `labels:` нашего шаблона, так и в раздел `data:`:

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

Если мы отрисуем это, получим ошибку:

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

Чтобы увидеть результат рендеринга, выполните команду с `--disable-openapi-validation`:
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`.
Результат будет не таким, как ожидалось:

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

Обратите внимание, что отступы у `app_version` неправильные в обоих местах. Почему? Потому что подставляемый шаблон имеет текст, выровненный по левому краю. Поскольку `template` является действием, а не функцией, невозможно передать вывод вызова `template` другим функциям — данные просто вставляются на место.

Чтобы обойти этот случай, Helm предоставляет альтернативу `template`, которая импортирует содержимое шаблона в текущий конвейер, где его можно передать другим функциям в конвейере.

Вот исправленный пример с использованием `indent` для правильного отступа шаблона `mychart.app`:

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

Теперь сгенерированный YAML правильно отформатирован для каждого раздела:

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

> В шаблонах Helm предпочтительнее использовать `include` вместо `template`, чтобы лучше контролировать форматирование вывода для YAML-документов.

Иногда нам нужно импортировать содержимое, но не как шаблоны — то есть импортировать файлы как есть. Мы можем сделать это, обращаясь к файлам через объект `.Files`, который описан в следующем разделе.
