---
title: "Бібліотечні чарти"
description: "Описує бібліотечні чарти та приклади їх використання"
weight: 4
---

Бібліотечний чарт — це тип [Helm чарту]({{< ref "/docs/topics/charts.md" >}}), який визначає примітиви або визначення, що можуть бути спільно використані шаблонами Helm в інших чартах. Це дозволяє користувачам ділитися фрагментами коду, які можна повторно використовувати у різних чартах, уникаючи повторень та підтримуючи чарти [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (Don't Repeat Yourself).

Бібліотечний чарт було представлено у Helm 3 для формального визнання загальних або допоміжних чартів, які використовувалися авторами чартів ще з Helm 2. Додавши його як тип чарту, він надає:

- Спосіб чітко розрізняти загальні та чарти застосунків
- Логіку, що запобігає встановленню загального чарту
- Відсутність рендерингу шаблонів у загальному чарті, які можуть містити артефакти релізу
- Дозвіл залежним чартам використовувати контекст імпортера

Автор чарту може визначити загальний чарт як бібліотечний чарт та бути впевненим, що Helm обробить чарт стандартним узгодженим способом. Це також означає, що визначення у прикладному чарті можуть бути спільно використані шляхом зміни типу чарту.

## Створення простого бібліотечного чарту {#creating-a-simple-library-chart}

Як вже згадувалося раніше, бібліотечний чарт — це тип [Helm чарту]({{< ref "/docs/topics/charts.md" >}}). Це означає, що ви можете почати зі створення шаблонного чарту:

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

Перш ніж перейти до створення загального коду, давайте швидко переглянемо деякі відповідні концепції Helm. [іменований шаблон]({{< ref "/docs/chart_template_guide/named_templates.md" >}}) (іноді називають частковим або субшаблоном) — це просто шаблон, визначений у файлі та який має назву. У теці `templates/` будь-який файл, який починається з підкреслення (_), не призначений для виводу маніфесту Kubernetes. Тому зазвичай допоміжні шаблони та часткові шаблони розміщуються у файлах `_*.tpl` або `_*.yaml`.

У цьому прикладі ми створимо загальний ConfigMap, який створює пустий ресурс ConfigMap. Ми визначимо загальний ConfigMap у файлі `mylibchart/templates/_configmap.yaml` наступним чином:

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

Конструкція ConfigMap визначена у шаблоні з назвою `mylibchart.configmap.tpl`. Це простий ConfigMap з пустим ресурсом `data`. У цьому файлі є ще один іменований шаблон назвою, назва якого `mylibchart.configmap`. Цей іменований шаблон включає інший іменований шаблон `mylibchart.util.merge`, який приймає 2 іменовані шаблони як аргументи: шаблон, що викликає `mylibchart.configmap` та `mylibchart.configmap.tpl`.

Допоміжна функція `mylibchart.util.merge` є іменованим шаблоном у `mylibchart/templates/_util.yaml`. Це зручний інструмент з [Загального допоміжного чарту Helm](#the-common-helm-helper-chart), оскільки він обʼєднує 2 шаблони та перевизначає будь-які спільні частини в обох:

```yaml
{{- /*
mylibchart.util.merge зʼєднує два YAML-шаблони та виводить результат.
Він приймає масив із трьох значень:
- контекст верхнього рівня
- ім'я шаблону перевизначення (призначення)
- ім'я шаблону бази (джерело)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

Це важливо, коли чарт хоче використовувати загальний код, який йому потрібно налаштувати за допомогою своєї конфігурації.

Нарешті, змініть тип чарту на `library`. Це вимагає редагування файлу `mylibchart/Chart.yaml` наступним чином:

```yaml
apiVersion: v2
name: mylibchart
description: Helm чарт для Kubernetes

# Чарт може бути або 'application', або 'library'.
#
# Чарти застосунків є колекцією шаблонів, які можуть бути упаковані
# у версійні архіви для розгортання.
#
# Бібліотечні чарти надають корисні утиліти або функції для розробника
# чартів. Вони включаються як залежність прикладних чартів для вбудування
# цих утиліт та функцій у процес рендерингу. Бібліотечні чарти не визначають
# жодних шаблонів і тому не можуть бути розгорнуті.
# type: application
type: library

# Це версія чарту. Це номер версії повинен збільшуватися кожного разу,
# коли ви вносите зміни в чарт і його шаблони, включаючи версію програми.
version: 0.1.0

# Це номер версії програми, що розгортається. Цей номер версії повинен
# збільшуватися кожного разу, коли ви вносите зміни в програму, і
# рекомендується використовувати з лапками.
appVersion: "1.16.0"
```

Тепер бібліотечний чарт готовий до спільного використання, а його визначення ConfigMap — до повторного використання.

Перш ніж продовжити, варто перевірити, чи розпізнає Helm чарт як бібліотечний:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Використання простого бібліотечного чарту {#use-a-simple-library-chart}

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

Ви бачите, що це спрощує нашу роботу, успадковуючи загальне визначення ConfigMap, яке додає стандартні властивості для ConfigMap. У нашому шаблоні ми додаємо конфігурацію, у цьому випадку ключ даних `myvalue` та його значення. Конфігурація перекриває пустий ресурс загального ConfigMap. Це можливо завдяки допоміжній функції `mylibchart.util.merge`, яку ми згадували у попередньому розділі.

Щоб мати можливість використовувати загальний код, нам потрібно додати `mylibchart` як залежність. Додайте наступний код в кінець файлу `mychart/Chart.yaml`:

```yaml
# Мій загальний код у бібліотечному чарті
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Це включає бібліотечний чарт як динамічну залежність із файлової системи, яка знаходиться на тому самому рівні, що і наш прикладний чарт. Оскільки ми включаємо бібліотечний чарт як динамічну залежність, нам потрібно виконати `helm dependency update`. Це скопіює бібліотечний чарт у вашу теку `charts/`.

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

Це виглядає як ConfigMap, який ми хочемо, з перезаписуванням даних `myvalue: Hello World`. Встановімо його:

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

- Об’єкт `.Files` посилається на шляхи файлів у головному чарті, а не на локальний шлях до бібліотечного чарту.
- Об’єкт `.Values` є таким самим, як і в головному чарті, на відміну від [субчартів]({{< ref "/docs/chart_template_guide/subcharts_and_globals.md" >}}) застосунків, які отримують розділ значень, налаштованих під їхнім заголовком у головному чарті.

## Common Helm Helper Chart {#the-common-helm-helper-chart}

```markdown
Примітка: Репозиторій Common Helm Helper Chart на Github більше не підтримується, і репозиторій було визнано застарілим та зархівовано.
```

Цей [чарт](https://github.com/helm/charts/tree/master/incubator/common) був початковим зразком для спільних чартів. Він надає утиліти, які відображають найкращі практики розробки чартів Kubernetes. Найкраще, що ви можете використати його одразу, коли розробляєте свої чарти, щоб отримати корисний загальний код.

Ось короткий спосіб його використання. Для отримання додаткових деталей перегляньте [README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

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

Ці шаблони демонструють, як використання загального коду з helper chart спрощує ваше кодування до налаштування чи конфігурації ресурсів.

Щоб мати можливість використовувати загальний код, нам потрібно додати `common` як залежність. Додайте наступне в кінець файлу `demo/Chart.yaml`:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Примітка: вам потрібно буде додати `incubator` до списку репозиторіїв Helm (`helm repo add`).

Оскільки ми включаємо чарт як динамічну залежність, нам потрібно виконати `helm dependency update`. Це скопіює helper chart у вашу теку `charts/`.

Оскільки helper chart використовує деякі конструкції Helm 2, вам потрібно буде додати наступне до `demo/values.yaml`, щоб дозволити завантаження образу `nginx`, оскільки це було оновлено в шаблонному чарті Helm 3:

```yaml
image:
  tag: 1.16.0
```

Ви можете перевірити, чи правильні шаблони чарту, перед розгортанням, використовуючи команди `helm lint` і `helm template`.

Якщо все добре, розгорніть чарт, використовуючи `helm install`!
