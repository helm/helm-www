---
title: "Змінні"
description: "Використання змінних у шаблонах."
weight: 8
---

Маючи функції, конвеєри, обʼєкти та структури управління, ми можемо перейти до однієї з основних ідей у багатьох мовах програмування: змінних. У шаблонах вони використовуються рідше. Але ми побачимо, як їх можна використовувати для спрощення коду та для кращого використання `with` і `range`.

У попередньому прикладі ми побачили, що цей код не працює:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` не знаходиться в межах області видимості, обмеженої блоком `with`. Один зі способів обійти проблеми з областю видимості — присвоїти обʼєкти змінним, до яких можна отримати доступ без врахування поточної області видимості.

У шаблонах Helm змінна є іменованим посиланням на інший обʼєкт. Вона має формат `$name`. Змінні присвоюються за допомогою спеціального оператора присвоєння: `:=`. Ми можемо переписати вищезазначене, використовуючи змінну для `Release.Name`.

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

Зверніть увагу, що перед тим як почати блок `with`, ми присвоюємо `$relname := .Release.Name`. Тепер всередині блоку `with` змінна `$relname` все ще вказує на імʼя релізу.

Запуск цього коду дасть наступний результат:

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

Змінні особливо корисні в циклах `range`. Їх можна використовувати для спископодібних обʼєктів, щоб захопити як індекс, так і значення:

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}
```

Зверніть увагу, що `range` йде першим, потім змінні, потім оператор присвоєння, а потім список. Це присвоїть ціле число (починаючи з нуля) змінній `$index` і значення змінній `$topping`. Запуск цього коду дасть:

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

Для структур даних, які мають як ключ, так і значення, ми можемо використовувати `range`, щоб отримати обидва. Наприклад, ми можемо перебрати `.Values.favorite` таким чином:

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

Тепер на першій ітерації `$key` буде `drink`, а `$val` буде `coffee`, а на другій `$key` буде `food`, а `$val` буде `pizza`. Запуск цього коду створить:

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

Змінні зазвичай не є "глобальними". Вони мають область видимості в межах блоку, в якому вони оголошені. Раніше ми присвоїли `$relname` на верхньому рівні шаблону. Ця змінна буде видима для всього шаблону. Але в нашому останньому прикладі змінні `$key` і `$val` будуть видимі лише всередині блоку `{{ range... }}{{ end }}`.

Однак є одна змінна, яка завжди є глобальною — `$`, ця змінна завжди буде вказувати на кореневий контекст. Це може бути дуже корисно, коли ви перебираєте в діапазоні і вам потрібно знати імʼя релізу чарту.

Приклад, що ілюструє це:

```yaml
{{- range .Values.tlsSecrets }}
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # Багато шаблонів Helm використовували б `.` тут, але це не спрацює,
    # однак `$` спрацює тут
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # Я не можу звертатися до .Chart.Name, але можу використовувати $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Значення з appVersion у Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
---
{{- end }}
```

До цього часу ми розглянули лише один шаблон, оголошений в одному файлі. Але одна з потужних можливостей мови шаблонів Helm — це можливість оголошувати кілька шаблонів і використовувати їх разом. Ми перейдемо до цього в наступному розділі.
