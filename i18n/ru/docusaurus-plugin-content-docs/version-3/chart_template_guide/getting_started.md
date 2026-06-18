---
title: Начало работы
description: Краткое руководство по шаблонам чартов.
sidebar_position: 2
---

В этом разделе руководства мы создадим чарт и добавим первый шаблон. Созданный здесь чарт будет использоваться на протяжении всего руководства.

Для начала давайте кратко рассмотрим структуру чарта Helm.

## Чарты

Как описано в [Руководстве по чартам](/topics/charts.md), чарты Helm имеют следующую структуру:

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

Директория `templates/` предназначена для файлов шаблонов. Когда Helm обрабатывает чарт, он пропускает все файлы из директории `templates/` через движок шаблонов. Затем собирает результаты обработки шаблонов и отправляет их в Kubernetes.

Файл `values.yaml` также важен для шаблонов. Этот файл содержит _значения по умолчанию_ для чарта. Эти значения могут быть переопределены пользователями при выполнении команд `helm install` или `helm upgrade`.

Файл `Chart.yaml` содержит описание чарта. Вы можете обращаться к нему изнутри шаблона.

Директория `charts/` _может_ содержать другие чарты (которые мы называем _субчартами_). Далее в этом руководстве мы рассмотрим, как они работают при рендеринге шаблонов.

## Создание начального чарта

Для этого руководства мы создадим простой чарт под названием `mychart`, а затем добавим в него несколько шаблонов.

```console
$ helm create mychart
Creating mychart
```

### Краткий обзор `mychart/templates/`

Если вы посмотрите в директорию `mychart/templates/`, то увидите несколько уже существующих файлов:

- `NOTES.txt`: «Текст справки» для вашего чарта. Он будет показан пользователям при выполнении команды `helm install`.
- `deployment.yaml`: Базовый манифест для создания [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) в Kubernetes.
- `service.yaml`: Базовый манифест для создания [Service](https://kubernetes.io/docs/concepts/services-networking/service/) для вашего Deployment.
- `_helpers.tpl`: Место для размещения вспомогательных шаблонов, которые можно повторно использовать в чарте.

И мы собираемся... _удалить их все!_ Таким образом, мы сможем пройти руководство с нуля. На самом деле мы создадим собственные `NOTES.txt` и `_helpers.tpl` по ходу работы.

```console
$ rm -rf mychart/templates/*
```

При написании production-чартов наличие базовых версий этих файлов может быть очень полезным. Поэтому в повседневной работе с чартами вы, скорее всего, не будете их удалять.

## Первый шаблон

Первый шаблон, который мы создадим — это `ConfigMap`. В Kubernetes ConfigMap — это простой объект для хранения конфигурационных данных. Другие объекты, например Pod'ы, могут получать доступ к данным в ConfigMap.

Поскольку ConfigMap — это базовый ресурс, он отлично подходит для начала работы.

Давайте создадим файл `mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**СОВЕТ:** Имена шаблонов не следуют строгим правилам именования. Однако мы рекомендуем использовать расширение `.yaml` для файлов YAML и `.tpl` для вспомогательных шаблонов.

Приведённый выше YAML-файл — это минимальный ConfigMap с необходимыми полями. Поскольку этот файл находится в директории `mychart/templates/`, он будет обработан движком шаблонов.

Совершенно нормально размещать обычные YAML-файлы в директории `mychart/templates/`. Когда Helm прочитает этот шаблон, он просто отправит его в Kubernetes как есть.

С этим простым шаблоном у нас уже есть чарт, готовый к установке. Установить его можно так:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

С помощью Helm мы можем получить релиз и увидеть фактический шаблон, который был загружен.

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

Команда `helm get manifest` принимает имя релиза (`full-coral`) и выводит все ресурсы Kubernetes, которые были загружены на сервер. Каждый файл начинается с `---` для обозначения начала YAML-документа, за которым следует автоматически сгенерированный комментарий, указывающий, какой файл шаблона создал этот YAML-документ.

Далее мы видим, что YAML-данные полностью соответствуют тому, что мы написали в файле `configmap.yaml`.

Теперь мы можем удалить наш релиз: `helm uninstall full-coral`.

### Добавление простого вызова шаблона

Жёстко заданное значение `name:` в ресурсе обычно считается плохой практикой. Имена должны быть уникальными для каждого релиза. Поэтому мы можем сгенерировать поле name, подставив в него имя релиза.

**СОВЕТ:** Поле `name:` ограничено 63 символами из-за ограничений системы DNS. По этой причине имена релизов ограничены 53 символами. Kubernetes 1.3 и более ранние версии ограничивались только 24 символами (то есть 14 символами для имени).

Давайте изменим `configmap.yaml` соответствующим образом.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

Главное изменение — в значении поля `name:`, которое теперь равно `{{ .Release.Name }}-configmap`.

> Директива шаблона заключается в блоки `{{` и `}}`.

Директива шаблона `{{ .Release.Name }}` подставляет имя релиза в шаблон. Значения, передаваемые в шаблон, можно рассматривать как _объекты с пространством имён_, где точка (`.`) разделяет каждый элемент пространства имён.

Начальная точка перед `Release` означает, что мы начинаем с самого верхнего пространства имён для данной области видимости (об областях видимости мы поговорим чуть позже). Таким образом, `.Release.Name` можно прочитать как «начать с верхнего пространства имён, найти объект `Release`, затем найти внутри него объект `Name`».

Объект `Release` — это один из встроенных объектов Helm, и мы рассмотрим его подробнее позже. Пока достаточно сказать, что он отображает имя релиза, которое библиотека присваивает нашему релизу.

Теперь, когда мы установим наш ресурс, мы сразу увидим результат использования этой директивы шаблона:

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Вы можете выполнить `helm get manifest clunky-serval`, чтобы увидеть весь сгенерированный YAML.

Обратите внимание, что имя ConfigMap внутри Kubernetes теперь `clunky-serval-configmap` вместо прежнего `mychart-configmap`.

На данный момент мы рассмотрели шаблоны в их самом базовом виде: YAML-файлы с директивами шаблонов, заключёнными в `{{` и `}}`. В следующей части мы подробнее изучим шаблоны. Но прежде чем двигаться дальше, есть один полезный приём, который может ускорить создание шаблонов: если вы хотите протестировать рендеринг шаблона, но не устанавливать ничего, используйте команду `helm install --debug --dry-run goodly-guppy ./mychart`. Она отрендерит шаблоны, но вместо установки чарта вернёт вам результат рендеринга, чтобы вы могли увидеть вывод:

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
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
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

Использование `--dry-run` упростит тестирование вашего кода, но не гарантирует, что Kubernetes примет сгенерированные шаблоны. Лучше не предполагать, что ваш чарт установится только потому, что `--dry-run` отработал успешно.

В [Руководстве по шаблонам чартов](/chart_template_guide/index.mdx) мы возьмём базовый чарт, созданный здесь, и подробно изучим язык шаблонов Helm. А начнём мы со встроенных объектов.
