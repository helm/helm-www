---
title: Функції шаблонів та конвеєри
description: Використання функцій у шаблонах.
sidebar_position: 5
---

Дотепер ми бачили, як розміщувати інформацію в шаблоні. Але ця інформація розміщується в шаблоні без змін. Іноді ми хочемо перетворити надані дані таким чином, щоб вони були більш корисними для нас.

Почнемо з найкращої практики: коли вставляємо рядки з об’єкта `.Values` у шаблон, ми повинні обов’язково обгорнути ці рядки в лапки. Ми можемо зробити це, викликавши функцію `quote` в директиві шаблону:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

Функції шаблонів дотримуються синтаксису `functionName arg1 arg2...`. У наведеному вище фрагменті `quote .Values.favorite.drink` викликає функцію `quote` і передає їй один аргумент.

Helm має понад 60 доступних функцій. Деякі з них визначені [мовою шаблонів Go](https://godoc.org/text/template). Більшість інших є частиною [бібліотеки шаблонів Sprig](https://masterminds.github.io/sprig/). Ми побачимо багато з них у міру того, як будемо розглядати приклади.

> Хоча ми говоримо про "мову шаблонів Helm", як про щось специфічне для Helm, насправді це комбінація мови шаблонів Go, деяких додаткових функцій і різноманітних обгорток, які дозволяють передавати певні обʼєкти в шаблони. Багато ресурсів про шаблони Go можуть бути корисними, коли ви вивчаєте шаблони.

## Конвеєри {#pipelines}

Однією з потужних функцій мови шаблонів є концепція _конвеєрів_. Запозичивши концепцію з UNIX, конвеєри є інструментом для обʼєднання серії команд шаблонів для компактного вираження низки перетворень. Іншими словами, конвеєри — це ефективний спосіб виконання кількох завдань послідовно. Перепишемо наведений вище приклад, використовуючи конвеєр.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

У цьому прикладі замість виклику `quote ARGUMENT` ми інвертували порядок. Ми "надіслали" аргумент функції за допомогою конвеєра (`|`): `.Values.favorite.drink | quote`. Використовуючи конвеєри, ми можемо обʼєднати кілька функцій:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> Інверсія порядку є поширеною практикою в шаблонах. Ви частіше побачите `.val | quote`, ніж `quote .val`. Обидві практики є правильними.

Під час обробки цей шаблон створить такий результат:

```yaml

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Зверніть увагу, що наша початкова `pizza` тепер перетворилася на `"PIZZA"`.

Коли аргументи передаються за допомогою конвеєра, результат першого обчислення (`.Values.favorite.drink`) надсилається як _останній аргумент функції_. Ми можемо змінити приклад із напоєм вище, щоб продемонструвати функцію, яка приймає два аргументи: `repeat COUNT STRING`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

Функція `repeat` буде повторювати даний рядок задану кількість разів, тому ми отримаємо такий вихідний результат:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## Використання функції `default` {#using-the-default-function}

Однією з функцій, яку часто використовують у шаблонах, є функція `default`: `default DEFAULT_VALUE GIVEN_VALUE`. Ця функція дозволяє вам вказати стандартне значення в шаблоні, у разі якщо значення відсутнє. Використаємо її, щоб змінити приклад з напоєм вище:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

Якщо ми запустимо це як зазвичай, ми отримаємо наш `coffee`:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Тепер ми видалимо параметр улюбленого напою з `values.yaml`:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

Тепер повторний запуск `helm install --dry-run --debug fair-worm ./mychart` створить такий YAML:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

В реальній схемі всі статичні стандартні значення повинні зберігатися у файлі `values.yaml` і не повинні дублюватися за допомогою команди `default` (інакше вони будуть надлишковими). Однак команда `default` ідеально підходить для обчислюваних значень, які не можуть бути оголошені у файлі `values.yaml`. Наприклад:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

У деяких випадках умова `if` може бути кращим рішенням, ніж `default`. Ми побачимо їх у наступному розділі.

Функції та конвеєри шаблонів — це потужний спосіб перетворення інформації та її вставки у ваш YAML. Але іноді необхідно додати деяку логіку шаблонів, яка трохи складніша, ніж просто вставка рядка. У наступному розділі ми розглянемо структури керування, які надає мова шаблонів.

## Використання функції `lookup` {#using-the-lookup-function}

Функцію `lookup` можна використовувати для _пошуку_ ресурсів у працюючому кластері. Синопсис функції lookup — це `lookup apiVersion, kind, namespace, name -> resource or resource list`.

| параметр | тип |
|------------|--------|
| apiVersion | string |
| kind | string |
| namespace | string |
| name | string |

Обидва параметри `name` та `namespace` є необов’язковими та можуть передаватися як порожній рядок (`""`).

Можливі такі комбінації параметрів:

| Поведінка | Функція пошуку |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"` |
| `kubectl get pods -n mynamespace` | `lookup "v1" "Pod" "mynamespace" ""` |
| `kubectl get pods --all-namespaces` | `lookup "v1" "Pod" "" ""` |
| `kubectl get namespace mynamespace` | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces` | `lookup "v1" "Namespace" "" ""` |

Коли `lookup` повертає обʼєкт, він поверне словник. Цей словник може бути додатково досліджений для отримання конкретних значень.

Наступний приклад поверне анотації, присутні для обʼєкта `mynamespace`:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

Коли `lookup` повертає список обʼєктів, можливо отримати доступ до списку обʼєктів через поле `items`:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* робимо щось з кожним сервісом */}}
{{ end }}
```

Коли обʼєкт не знайдено, повертається порожнє значення. Це може бути використано для перевірки наявності обʼєкта.

Функція `lookup` використовує поточну конфігурацію зʼєднання Kubernetes Helm для запиту до Kubernetes. Якщо при взаємодії з викликом сервера API виникає помилка (наприклад, через відсутність дозволу на доступ до ресурсу), обробка шаблонів Helm зазнає невдачі.

Майте на увазі, що Helm не призначений для контакту з Kubernetes API Server під час операцій `helm template|install|upgrade|delete|rollback --dry-run`. Щоб протестувати `lookup` на працюючому кластера, слід використовувати `helm template|install|upgrade|delete|rollback --dry-run=server`, щоб дозволити з’єднання з кластером.

## Оператори як функції {#operators-are-functions}

Для шаблонів оператори (`eq`, `ne`, `lt`, `gt`, `and`, `or` і так далі) реалізовані як функції. У конвеєрах операції можуть бути згруповані дужками (`(` і `)`).

Тепер ми можемо перейти від функцій і конвеєрів до управління потоком з умовами, циклами та модифікаторами області видимості.
