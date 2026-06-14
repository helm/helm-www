---
title: Переменные
description: Использование переменных в шаблонах.
sidebar_position: 8
---

Освоив функции, конвейеры, объекты и управляющие структуры, мы можем перейти к одной из базовых концепций многих языков программирования: переменным. В шаблонах они используются реже. Тем не менее мы рассмотрим, как с их помощью упростить код и более эффективно использовать конструкции `with` и `range`.

В предыдущем примере мы видели, что этот код не работает:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` недоступен внутри области видимости, ограниченной блоком `with`. Один из способов обойти проблемы с областью видимости — присвоить объекты переменным, к которым можно обращаться независимо от текущей области видимости.

В шаблонах Helm переменная — это именованная ссылка на другой объект. Она записывается в формате `$name`. Переменные присваиваются с помощью специального оператора присваивания: `:=`. Перепишем приведённый выше пример, используя переменную для `Release.Name`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

Обратите внимание: перед началом блока `with` мы присваиваем `$relname :=
.Release.Name`. Теперь внутри блока `with` переменная `$relname` по-прежнему указывает на имя релиза.

Выполнение даст следующий результат:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

Переменные особенно полезны в циклах `range`. Их можно использовать с объектами типа списка для получения как индекса, так и значения:

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

Обратите внимание: сначала идёт `range`, затем переменные, оператор присваивания и список. Это присвоит целочисленный индекс (начиная с нуля) переменной `$index`, а значение — переменной `$topping`. Выполнение даст:

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

Для структур данных, содержащих и ключ, и значение, можно использовать `range` для получения обоих. Например, мы можем перебрать `.Values.favorite` следующим образом:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

На первой итерации `$key` будет равен `drink`, а `$val` — `coffee`. На второй итерации `$key` будет равен `food`, а `$val` — `pizza`. Результат выполнения:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Переменные обычно не являются «глобальными». Их область видимости ограничена блоком, в котором они объявлены. Ранее мы присвоили `$relname` на верхнем уровне шаблона. Эта переменная будет доступна во всём шаблоне. Но в последнем примере `$key` и `$val` будут доступны только внутри блока `{{ range... }}{{ end }}`.

Однако существует одна переменная, которая всегда указывает на корневой контекст: `$`. Она позволяет обращаться к данным верхнего уровня (например, `.Release.Name` или `.Chart.Name`) из любого места шаблона, даже внутри цикла `range`.

Пример:

```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # Many helm templates would use `.` below, but that will not work,
    # however `$` will work here
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # I cannot reference .Chart.Name, but I can do $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Value from appVersion in Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

До сих пор мы рассматривали только один шаблон в одном файле. Но язык шаблонов Helm позволяет объявлять несколько шаблонов и использовать их совместно. Об этом пойдёт речь в следующем разделе.
