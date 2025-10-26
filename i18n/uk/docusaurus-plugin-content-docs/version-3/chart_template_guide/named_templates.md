---
title: Іменовані шаблони
description: Як визначити іменовані шаблони.
sidebar_position: 9
---

Пора перейти від одного шаблону до створення інших. У цьому розділі ми побачимо, як визначити _іменовані шаблони_ в одному файлі, а потім використовувати їх в інших місцях. _Іменований шаблон_ (іноді його називають _частковим_ або _підшаблоном_) — це просто шаблон, визначений у файлі, якому надали імʼя. Ми розглянемо два способи створення таких шаблонів і кілька способів їх використання.

У розділі [Керування потоком](/chart_template_guide/control_structures.md) ми представили три дії для оголошення та управління шаблонами: `define`, `template` і `block`. У цьому розділі ми розглянемо ці три дії, а також введемо спеціальну функцію `include`, яка працює подібно до дії `template`.

Важлива деталь, яку слід памʼятати при іменуванні шаблонів: **імена шаблонів є глобальними**. Якщо ви оголосите два шаблони з однаковим імʼям, використовуватиметься той, який був завантажений останнім. Оскільки шаблони в субчартах компілюються разом з шаблонами верхнього рівня, слід бути обережним при іменуванні шаблонів, використовуючи _імена, специфічні для чарту_.

Популярним способом іменування є префіксування кожного визначеного шаблону іменем чарту: `{{ define "mychart.labels" }}`. Використовуючи конкретне імʼя чарту як префікс, ми можемо уникнути будь-яких конфліктів, які можуть виникнути через два різних чарти, що реалізують шаблони з однаковим іменем.

Ця поведінка також стосується різних версій чарту. Якщо у вас є `mychart` версії `1.0.0`, яка визначає шаблон одним способом, і `mychart` версії `2.0.0`, яка змінює наявний іменований шаблон, буде використовуватися той, який був завантажений останнім. Ви можете обійти цю проблему, додавши версію в імʼя чарту: `{{ define "mychart.v1.labels" }}` та `{{ define "mychart.v2.labels" }}`.

## Часткові та `_` файли {#partials-and-_files}

До цього часу ми використовували один файл, і цей один файл містив один шаблон. Але мова шаблонів Helm дозволяє створювати іменовані вкладені шаблони, до яких можна звертатися за іменем в інших місцях.

Перед тим як перейти до деталей написання цих шаблонів, варто згадати про правила іменування файлів:

* Більшість файлів у `templates/` обробляються як файли з маніфестами Kubernetes
* `NOTES.txt` є винятком
* Але файли, імʼя яких починається з підкреслення (`_`), вважаються такими, що _не мають_ маніфесту всередині. Ці файли не перетворюються на обʼєкти Kubernetes, але доступні в інших шаблонах чартів для використання.

Ці файли використовуються для зберігання часткових шаблонів і допоміжних функцій. Насправді коли ми вперше створили `mychart`, ми бачили файл з назвою `_helpers.tpl`. Цей файл є стандартним місцем для часткових шаблонів.

## Оголошення та використання шаблонів з `define` та `template` {#declaring-and-using-templates-with-define-and-template}

Дія `define` дозволяє створювати іменовані шаблони всередині файлу шаблону. Її синтаксис виглядає так:

```yaml
{{- define "MY.NAME" }}
  # тіло шаблону тут
{{- end }}
```

Наприклад, ми можемо визначити шаблон для інкапсуляції блоку міток Kubernetes:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Тепер ми можемо вбудувати цей шаблон всередині нашого наявного ConfigMap і включити його за допомогою дії `template`:

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

Коли рушій шаблонів читає цей файл, він зберігає посилання на `mychart.labels` до того часу, поки не буде викликано `template "mychart.labels"`. Тоді він рендерить цей шаблон безпосередньо. Результат виглядатиме так:

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

Примітка: `define` не створює виводу, якщо не буде викликано шаблон, як у цьому прикладі.

Зазвичай шаблони Helm розміщують у файлах часткових шаблонів, зазвичай у `_helpers.tpl`. Перенесемо цю функцію туди:

```yaml
{{/* Генерація базових міток */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Згідно з домовленостями, функції `define` повинні мати простий блок документації (`{{/* ... */}}`), що описує їх призначення.

Навіть якщо це визначення знаходиться в `_helpers.tpl`, його все ще можна використовувати в `configmap.yaml`:

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

Як уже згадувалося, **імена шаблонів є глобальними**. В результаті, якщо два шаблони оголошені з однаковим імʼям, буде використано останній варіант. Оскільки шаблони в субчартах компілюються разом з шаблонами верхнього рівня, краще давати шаблонам _специфічні для чарту імена_. Популярний спосіб іменування — це префіксувати кожен визначений шаблон іменем чарту: `{{ define "mychart.labels" }}`.

## Встановлення області видимості шаблону {#setting-the-scope-of-a-template}

У шаблоні, який ми визначили вище, ми не використовували жодних обʼєктів. Ми просто використовували функції. Змінимо наш визначений шаблон, щоб включити назву чарту та версію чарту:

```yaml
{{/* Генерація базових міток */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

Якщо ми його відрендеримо, ми отримаємо помилку, схожу на цю:

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

Щоб побачити, що було відрендерено, повторіть команду з `--disable-openapi-validation`: `helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`. Результат не буде таким, як ми очікували:

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

Що сталося з назвою та версією? Вони не були в області видимості для нашого визначеного шаблону. Коли іменований шаблон (створений за допомогою `define`) рендериться, він отримує область видимості, передану через виклик `template`. У нашому прикладі ми включили шаблон ось так:

```yaml
{{- template "mychart.labels" }}
```

Область видимості не була передана, тому всередині шаблону ми не можемо звертатися до нічого в `.`. Це досить легко виправити. Ми просто передаємо область видимості до шаблону:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

Зверніть увагу, що ми передаємо `.` в кінці виклику `template`. Ми могли б так само легко передати `.Values` або `.Values.favorite`, або будь-яку іншу область видимості, яку хочемо. Але те, що нам потрібно, це область видимості верхнього рівня.

Тепер, коли ми виконаємо цей шаблон з `helm install --dry-run --debug plinking-anaco ./mychart`, ми отримаємо таке:

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

Тепер `{{ .Chart.Name }}` розвʼязується в `mychart`, а `{{ .Chart.Version }}` розвʼязується в `0.1.0`.

## Функція `include` {#the-include-function}

Припустимо, ми визначили простий шаблон, який виглядає ось так:

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

Тепер припустимо, я хочу вставити це як в розділ `labels:`, так і в розділ `data:`:

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

Якщо ми це відрендеримо, ми отримаємо помилку, схожу на цю:

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

Щоб побачити, що було відрендеровано, повторіть команду з `--disable-openapi-validation`: `helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`. Вихідні дані не будуть такими, як ми очікували:

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

Зверніть увагу, що відступ на `app_version` неправильний в обох місцях. Чому? Тому що шаблон, який вставляється, має текст вирівняний по лівому краю. Оскільки `template` є дією, а не функцією, немає способу передати вихідний результат виклику `template` іншим функціям; дані просто вставляються в рядок.

Щоб обійти цю проблему, Helm надає альтернативу `template`, яка імплементує вміст шаблону в поточний конвеєр, де він може бути переданий іншим функціям у конвеєрі.

Ось приклад вище, виправлений з використанням `indent`, щоб правильно відступити шаблон `mychart.app`:

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

Тепер створений YAML має вірний відступ для кожного розділу:

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

> Вважається за краще використовувати `include` замість `template` у шаблонах Helm, щоб краще керувати форматуванням виходу для YAML-документів.

Іноді ми хочемо імплементувати вміст, але не як шаблони. Тобто, ми хочемо імплементувати файли без змін. Ми можемо досягти цього, звертаючись до файлів через обʼєкт `.Files`, описаний у наступному розділі.
