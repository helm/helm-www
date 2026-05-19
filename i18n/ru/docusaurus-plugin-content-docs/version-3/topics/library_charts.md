---
title: Библиотечные чарты
description: Описывает библиотечные чарты и примеры их использования
sidebar_position: 4
---

Библиотечный чарт — это тип [чарта Helm](/topics/charts.md), который определяет примитивы или конструкции, которые могут использоваться шаблонами Helm в других чартах. Это позволяет разработчикам создавать повторно используемые фрагменты кода, избегая дублирования и соблюдая принцип [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (не повторяйся).

Библиотечные чарты были введены в Helm 3 для формализации общих или вспомогательных чартов, которые использовались разработчиками чартов ещё со времён Helm 2. Выделение их в отдельный тип чарта обеспечивает:
- Возможность явно различать общие и прикладные чарты
- Логику, предотвращающую установку общего чарта
- Отсутствие рендеринга шаблонов в общем чарте, которые могут содержать артефакты релиза
- Возможность зависимым чартам использовать контекст импортирующего чарта

Разработчик чартов может определить общий чарт как библиотечный и быть уверенным, что Helm будет обрабатывать его стандартным, согласованным образом. Это также означает, что определения из прикладного чарта можно переиспользовать, изменив тип чарта.

## Создание простого библиотечного чарта

Как упоминалось ранее, библиотечный чарт — это тип [чарта Helm](/topics/charts.md). Это означает, что вы можете начать с создания заготовки чарта:

```console
$ helm create mylibchart
Creating mylibchart
```

Сначала удалите все файлы в директории `templates`, поскольку в этом примере мы создадим собственные определения шаблонов.

```console
$ rm -rf mylibchart/templates/*
```

Файл values также не потребуется.

```console
$ rm -f mylibchart/values.yaml
```

Прежде чем создавать общий код, рассмотрим несколько важных концепций Helm. [Именованный шаблон](/chart_template_guide/named_templates.md) (иногда называемый partial или subtemplate) — это просто шаблон, определённый внутри файла и имеющий имя. В директории `templates/` любой файл, имя которого начинается с подчёркивания (_), не предполагает вывод манифеста Kubernetes. По соглашению вспомогательные шаблоны и partial размещаются в файлах `_*.tpl` или `_*.yaml`.

В этом примере мы создадим общий ConfigMap, который генерирует пустой ресурс ConfigMap. Определим общий ConfigMap в файле `mylibchart/templates/_configmap.yaml` следующим образом:

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

Конструкция ConfigMap определена в именованном шаблоне `mylibchart.configmap.tpl`. Это простой ConfigMap с пустым ресурсом `data`. В этом же файле есть другой именованный шаблон `mylibchart.configmap`, который вызывает именованный шаблон `mylibchart.util.merge`, принимающий 2 именованных шаблона в качестве аргументов: шаблон, вызывающий `mylibchart.configmap`, и `mylibchart.configmap.tpl`.

Вспомогательная функция `mylibchart.util.merge` — это именованный шаблон в файле `mylibchart/templates/_util.yaml`. Это полезная утилита из [Common Helm Helper Chart](#common-helm-helper-chart), которая объединяет 2 шаблона и переопределяет общие части в обоих:

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

Это важно, когда чарт использует общий код, который нужно настроить под собственную конфигурацию.

Наконец, изменим тип чарта на `library`. Для этого отредактируйте файл `mylibchart/Chart.yaml` следующим образом:

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

Библиотечный чарт готов к использованию, и его определение ConfigMap можно переиспользовать.

Прежде чем продолжить, стоит проверить, распознаёт ли Helm чарт как библиотечный:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Использование простого библиотечного чарта

Теперь используем библиотечный чарт. Для этого снова создадим заготовку чарта:

```console
$ helm create mychart
Creating mychart
```

Снова очистим файлы шаблонов, так как мы хотим создать только ConfigMap:

```console
$ rm -rf mychart/templates/*
```

Если бы мы хотели создать простой ConfigMap в шаблоне Helm, он мог бы выглядеть примерно так:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

Однако мы собираемся переиспользовать общий код, уже созданный в `mylibchart`. ConfigMap можно создать в файле `mychart/templates/configmap.yaml` следующим образом:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Это упрощает работу: мы наследуем общее определение ConfigMap, которое добавляет стандартные свойства. В нашем шаблоне мы добавляем конфигурацию — в данном случае ключ данных `myvalue` и его значение. Конфигурация переопределяет пустой ресурс общего ConfigMap. Это возможно благодаря вспомогательной функции `mylibchart.util.merge`, которую мы упомянули в предыдущем разделе.

Чтобы использовать общий код, нужно добавить `mylibchart` как зависимость. Добавьте следующее в конец файла `mychart/Chart.yaml`:

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Это подключает библиотечный чарт как динамическую зависимость из файловой системы, расположенную на том же родительском уровне, что и наш прикладной чарт. Поскольку мы подключаем библиотечный чарт как динамическую зависимость, нужно выполнить `helm dependency update`. Эта команда скопирует библиотечный чарт в директорию `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Теперь мы готовы развернуть наш чарт. Перед установкой стоит сначала проверить отрендеренный шаблон.

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

Это выглядит как ConfigMap, который нам нужен, с переопределением данных `myvalue: Hello World`. Установим его:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Мы можем получить релиз и убедиться, что фактический шаблон был загружен.

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

## Преимущества библиотечных чартов

Поскольку библиотечные чарты не могут работать как самостоятельные чарты, они могут использовать следующие возможности:
- Объект `.Files` ссылается на пути к файлам в родительском чарте, а не в локальном пути библиотечного чарта
- Объект `.Values` такой же, как у родительского чарта, в отличие от прикладных [субчартов](/chart_template_guide/subcharts_and_globals.md), которые получают раздел значений, настроенный под их именем в родительском чарте


## Common Helm Helper Chart

```markdown
Note: The Common Helm Helper Chart repo on Github is no longer actively maintained, and the repo has been deprecated and archived.
```

Этот [чарт](https://github.com/helm/charts/tree/master/incubator/common) был оригинальным примером общих чартов. Он предоставляет утилиты, отражающие лучшие практики разработки чартов Kubernetes. Его можно сразу использовать при разработке ваших чартов, чтобы получить удобный общий код.

Вот краткое руководство по его использованию. Подробнее читайте в [README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Снова создайте заготовку чарта:

```console
$ helm create demo
Creating demo
```

Используем общий код из вспомогательного чарта. Сначала отредактируйте deployment `demo/templates/deployment.yaml` следующим образом:

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

Теперь файл сервиса `demo/templates/service.yaml`:

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

Эти шаблоны показывают, как наследование общего кода из вспомогательного чарта упрощает написание кода до настройки или кастомизации ресурсов.

Чтобы использовать общий код, нужно добавить `common` как зависимость. Добавьте следующее в конец файла `demo/Chart.yaml`:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Примечание: вам потребуется добавить репозиторий `incubator` в список репозиториев Helm (`helm repo add`).

Поскольку мы подключаем чарт как динамическую зависимость, нужно выполнить `helm dependency update`. Эта команда скопирует вспомогательный чарт в директорию `charts/`.

Так как вспомогательный чарт использует некоторые конструкции Helm 2, вам потребуется добавить следующее в файл `demo/values.yaml`, чтобы образ `nginx` загрузился, поскольку это было обновлено в базовой структуре чарта Helm 3:

```yaml
image:
  tag: 1.16.0
```

Вы можете проверить корректность шаблонов чарта перед развёртыванием с помощью команд `helm lint` и `helm template`.

Если всё в порядке, развёртывайте с помощью `helm install`!
