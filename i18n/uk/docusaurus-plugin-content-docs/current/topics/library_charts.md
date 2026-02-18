---
title: Бібліотечні чарти
description: Опис бібліотечних чартів та приклади їх використання
sidebar_position: 4
---

Бібліотечний чарт — це тип [Helm чарту](/topics/charts.mdx), який визначає примітиви або визначення, що можуть бути спільно використані шаблонами Helm в інших чартах. Це дозволяє користувачам ділитися фрагментами коду, які можна повторно використовувати у різних чартах, уникаючи повторень та підтримуючи чарти [DRY](https://uk.wikipedia.org/wiki/Don%27t_repeat_yourself) (Don't Repeat Yourself).

Бібліотечні чарти було представлено у Helm 3 для формального визнання загальних або допоміжних чартів, які використовувалися авторами чартів ще з Helm 2. Додавши їх як тип чарту, вони надають:

- Спосіб чітко розрізняти загальні та чарти застосунків
- Логіку, що запобігає встановленню загального чарту
- Відсутність рендерингу шаблонів у загальному чарті, які можуть містити артефакти релізу
- Дозвіл залежним чартам використовувати контекст імпортера

Розробник чарту може визначити загальний чарт як бібліотечний чарт і бути впевненим, що Helm оброблятиме цей чарт стандартним та узгодженим чином. Це також означає, що визначення в чарті застосунку можна спільного використання шляхом зміни типу чарту.

## Створення простого бібліотечного чарту {#creating-a-simple-library-chart}

Як згадувалося раніше, бібліотечний чарт є різновидом [Helm-чарту](/topics/charts.mdx). Це означає, що ви можете почати з створення шаблонного чарту:

```console
$ helm create mylibchart
Creating mylibchart
```

Спочатку видаліть усі файли в теці `templates`, оскільки ми будемо створювати власні визначення шаблонів у цьому прикладі.

```console
$ rm -rf mylibchart/templates/*
```

Файл значень (values.yaml) також не буде потрібен.

```console
$ rm -f mylibchart/values.yaml
```

Перш ніж перейти до створення загального коду, давайте швидко переглянемо деякі відповідні концепції Helm. [Іменований шаблон](/chart_template_guide/named_templates.md) (іноді називають partial або субшаблоном) — це просто шаблон, визначений у файлі та який має назву. У теці `templates/` будь-який файл, який починається з підкреслення (_), не призначений для виводу маніфесту Kubernetes. Тому зазвичай допоміжні шаблони та partials розміщуються у файлах `_*.tpl` або `_*.yaml`.

У цьому прикладі ми створимо загальний ConfigMap, який створює порожній ресурс ConfigMap. Ми визначимо загальний ConfigMap у файлі `mylibchart/templates/_configmap.yaml` наступним чином:

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

Структура ConfigMap визначена в іменованому шаблоні `mylibchart.configmap.tpl`. Це простий ConfigMap з порожнім ресурсом `data`. У цьому файлі є інший іменований шаблон з назвою `mylibchart.configmap`. Цей іменований шаблон включає інший іменований шаблон `mylibchart.util.merge`, який приймає 2 іменованих шаблони як аргументи, шаблон, що викликає `mylibchart.configmap` і `mylibchart.configmap.tpl`.

Допоміжна функція `mylibchart.util.merge` є іменованим шаблоном у `mylibchart/templates/_util.yaml`. Це зручний інструмент з [Загального допоміжного чарту Helm](#the-common-helm-helper-chart), оскільки він обʼєднує 2 шаблони та перевизначає будь-які спільні частини в обох:

```yaml
{{- /*
mylibchart.util.merge обʼєднає два шаблони YAML і виведе результат.
Він приймає масив із трьох значень:
- контекст верхнього рівня
- назву шаблону перевизначення (призначення)
- назву базового шаблону (джерело)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

Це важливо, коли чарт хоче використовувати загальний код, який йому потрібно налаштувати за допомогою своєї конфігурації.

Нарешті, змініть тип чарту на `library`. Це вимагає зміни файлу `mylibchart/Chart.yaml` наступним чином:

```yaml
apiVersion: v2
name: mylibchart
description: Helm чарт для Kubernetes

# Чарт може бути або 'application', або 'library'.
#
# Чарти застосунків — це набори шаблонів, які можна упакувати в архіви
# з версіями для розгортання.
#
# # Чарт може бути чартом  'application' або 'library'.
#
# Чарти застосунків — це набір шаблонів, які можна упакувати в архіви з версіями для розгортання.
#
# Чарти бібліотек надають корисні утиліти або функції для розробника чартів. Вони включаються
# як залежності чартів застосунків, щоб вставити ці утиліти та функції в конвеєр рендерингу.
# Чарти бібліотек не визначають жодних шаблонів, тому їх неможливо розгорнути.
# type: application
type: library

# Це версія чарту. Це номер версії повинен збільшуватися кожного разу,
# коли ви вносите зміни в чарт і його шаблони, включаючи версію програми.
version: 0.1.0

# Це номер версії застосунку, що розгортається. Цей номер версії повинен
# збільшуватися кожного разу, коли ви вносите зміни в застосунок,
# рекомендується використовувати з лапками.
appVersion: "1.16.0"
```

Тепер бібліотечний чарт готовий до спільного використання, а його визначення ConfigMap — до повторного використання.

Перш ніж продовжити, варто перевірити, чи розпізнає Helm чарт як бібліотечний:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Використання простого бібліотечного чарту {#use-the-simple-library-chart}

Настав час використати бібліотечний чарт. Для цього створимо знову шаблонний чарт:

```console
$ helm create mychart
Creating mychart
```

Знову очистимо файли шаблонів, оскільки ми хочемо створити лише ConfigMap:

```console
$ rm -rf mychart/templates/*
```

Якщо ми хочемо створити простий ConfigMap у шаблоні Helm, він може виглядати приблизно так:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

Однак, ми будемо повторно використовувати загальний код, створений у `mylibchart`. ConfigMap можна створити у файлі `mychart/templates/configmap.yaml` наступним чином:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Ви можете побачити, що це спрощує роботу, яку ми маємо виконати, завдяки успадкуванню загального визначення ConfigMap, яке додає стандартні властивості для ConfigMap. У нашому шаблоні ми додаємо конфігурацію, в даному випадку ключ даних `myvalue` та його значення. Конфігурація замінює порожній ресурс загального ConfigMap. Це можливо завдяки допоміжній функції `mylibchart.util.merge`, про яку ми згадували в попередньому розділі.

Щоб мати можливість використовувати загальний код, нам потрібно додати `mylibchart` як залежність. Додайте наступний код в кінець файлу `mychart/Chart.yaml`:

```yaml
# Загальний код у бібліотечному чарті
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Це включає бібліотечний чарт як динамічну залежність у файловій системі, яка знаходиться в тому ж батьківському шляху, що і чарт нашого застосунку. Оскільки ми включаємо бібліотечний чарт як динамічну залежність, нам потрібно запустити `helm dependency update`. Це скопіює бібліотечний чарт у вашу теку `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Тепер ми готові розгорнути наш чарт. Перш ніж встановлювати, варто перевірити спочатку рендеринг шаблону.

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

Це виглядає як ConfigMap, який нам потрібен, з перезаписуванням даних `myvalue: Hello World`. Встановімо його:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Ми можемо отримати реліз і побачити, що фактичний шаблон був завантажений.

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

## Переваги бібліотечних чартів {#library-chart-benefits}

З огляду на те, що бібліотечні чарти не можуть працювати як самостійні чарти, вони можуть використовувати такі функції:

- Об’єкт `.Files` посилається на шляхи файлів у головному чарті, а не на локальний шлях бібліотечного чарту.
- Об’єкт `.Values` є таким самим, як і в головному чарті, на відміну від [субчартів](/chart_template_guide/subcharts_and_globals.md) застосунків, які отримують розділ значень, налаштованих під їхнім заголовком у головному чарті.

## Common Helm Helper Chart {#the-common-helm-helper-chart}

:::info
Репозиторій Common Helm Helper Chart на Github більше не підтримується, і репозиторій було визнано застарілим та зархівовано.
:::

Цей [чарт](https://github.com/helm/charts/tree/master/incubator/common) був початковим зразком для спільних чартів. Він надає утиліти, що відповідають найкращим практикам розробки чартів Kubernetes. Найкраще те, що ви можете відразу ж використовувати його під час створення своїх чартів, щоб отримати зручний код для спільного використання.

Ось короткий опис того, як ним користуватися. Більш детальну інформацію можна знайти в файлі [README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Створіть знову шаблонний чарт:

```console
$ helm create demo
Creating demo
```

Використаймо загальний код з helper chart. Спочатку відредагуйте файл deployment `demo/templates/deployment.yaml` наступним чином:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Вкажіть перевизначення для вашого ресурсу Deployment тут, наприклад
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

І тепер файл сервісу, `demo/templates/service.yaml`, наступним чином:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Вкажіть перевизначення для вашого ресурсу Service тут, наприклад
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

Ці шаблони показують, як успадкування загального коду з helper chart спрощує написання коду до конфігурації або налаштування ресурсів.

Щоб мати можливість використовувати загальний код, нам потрібно додати `common` як залежність. Додайте наступне в кінець файлу `demo/Chart.yaml`:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

:::note
Вам потрібно буде додати `incubator` до списку репозиторіїв Helm (`helm repo add`).
:::

Оскільки ми включаємо чарт як динамічну залежність, нам потрібно виконати `helm dependency update`. Це скопіює helper chart у вашу теку `charts/`.

Оскільки helper chart використовує деякі конструкції Helm 2, вам потрібно буде додати наступне до `demo/values.yaml`, щоб дозволити завантаження образу `nginx`, оскільки це було оновлено в шаблонному чарті Helm 3:

```yaml
image:
  tag: 1.16.0
```

Ви можете перевірити, чи правильні шаблони чарту, перед розгортанням, використовуючи команди `helm lint` і `helm template`.

Якщо все добре, розгорніть чарт, використовуючи `helm install`!
