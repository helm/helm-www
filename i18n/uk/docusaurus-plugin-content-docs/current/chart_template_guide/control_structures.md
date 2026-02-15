---
title: Керування потоком
description: Швидкий огляд структури керування потоком в шаблонах.
sidebar_position: 7
---

Структури керування (називаються "діями" (actions) в термінології шаблонів) надають вам, автору шаблонів, можливість контролювати потік генерації шаблону. Мова шаблонів Helm надає такі структури керування:

- `if`/`else` для створення умовних блоків
- `with` для визначення області видимості
- `range`, який надає цикл "for each"

Окрім цих, є кілька дій для оголошення та використання іменованих сегментів шаблону:

- `define` оголошує новий іменований шаблон всередині вашого шаблону
- `template` імплементує іменований шаблон
- `block` оголошує спеціальний тип заповнювальної області шаблону

У цьому розділі ми розглянемо `if`, `with` та `range`. Інші дії будуть розглянуті в розділі "Іменовані шаблони" пізніше в цьому посібнику.

## If/Else

Перша структура керування, яку ми розглянемо, використовується для умовного включення блоків тексту в шаблоні. Це блоки `if`/`else`.

Основна структура блоку з умовою виглядає так:

```go
{{ if PIPELINE }}
  # Щось зробити
{{ else if OTHER PIPELINE }}
  # Зробити щось інше
{{ else }}
  # Стандартне значення
{{ end }}
```

Зверніть увагу, що зараз ми говоримо про _конвеєри_, а не про значення. Причина цього полягає в тому, щоб чітко показати, що структури управління можуть виконувати весь конвеєр, а не тільки обчислювати значення.

Конвеєр вважається _false_, якщо значення є:

- логічне значення false
- числове значення нуль
- порожній рядок
- значення `nil` (порожнє або null)
- порожня колекція (`map`, `slice`, `tuple`, `dict`, `array`)

У всіх інших умовах умова є істинною.

Додамо просту умовну конструкцію до нашого ConfigMap. Ми додамо ще одне налаштування, якщо напій встановлений на каву:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

Оскільки ми закоментували `drink: coffee` у нашому останньому прикладі, вихідний файл не повинен містити прапорець `mug: "true"`. Але якщо ми додамо цей рядок назад у наш файл `values.yaml`, вихід виглядатиме так:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## Контроль пробілів {#controlling-whitespace}

Під час роботи з умовами варто звернути увагу на те, як контролюється кількість пробілів у шаблонах. Розглянемо попередній приклад і відформатуємо його для зручнішого читання:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

Спочатку це має гарний вигляд. Але якщо ми пропустимо його через рушій шаблонів, отримаємо неприємний результат:

```sh
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

Що сталося? Ми створили некоректний YAML через пробіли, зазначені вище.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

`mug` має невірний відступ. Виправимо це, зменшивши відступ цього рядка, і запустимо знову:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

Коли ми запустимо це, отримаємо валідний YAML, але з кількома порожніми рядками:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

Помітно, що у нас є кілька пустих рядків у YAML. Чому? Коли рушій шаблонів виконує шаблон, він _видаляє_ вміст всередині `{{` і `}}`, але залишає пробіли без змін.

YAML надає значення пробілам, тому управління пробілами стає важливим. На щастя, шаблони Helm мають кілька інструментів у поміч.

По-перше, синтаксис фігурних дужок шаблонів можна модифікувати за допомогою спеціальних символів, щоб вказати рушію шаблонів обрізати пробіли. `{{- ` (з тире і пробілом) вказує, що пробіли зліва повинні бути видалені, тоді як ` -}}` означає, що пробіли справа повинні бути видалені. _Будьте обережні! Нові рядки — це пробіли!_

> Переконайтеся, що є пробіл між `-` і рештою вашої директиви. `{{- 3 }}` означає "вирізати ліві пробіли та вивести 3", тоді як `{{-3 }}` означає "вивести -3".

Використовуючи цей синтаксис, ми можемо змінити наш шаблон, щоб позбутися від тих нових рядків:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

Щоб прояснити це, відзначимо кожен пробіл, який буде видалено відповідно до цього правила. `*` в кінці рядка вказує на символ нового рядка, який буде видалений:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

Зважаючи на це, ми можемо запустити наш шаблон через Helm і побачити результат:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

Будьте обережні з модифікаторами обрізання пробілів. Легко випадково зробити ось так:

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

Це створить `food: "PIZZA"mug: "true"`, оскільки пробіли з обох сторін будуть видалені.

> Для деталей про контроль пробілів у шаблонах дивіться [Офіційну документацію Go шаблонів](https://godoc.org/text/template)

Нарешті, іноді легше сказати системі шаблонів, як вам потрібно робити відступи, замість того, щоб намагатися освоїти розташування пробілів у директивах шаблону. З цієї причини іноді корисно використовувати функцію `indent` (`{{ indent 2 "mug:true" }}`).

## Модифікація області видимості за допомогою `with` {#modifying-scope-using-with}

Наступна структура управління, яку розглянемо, це дія `with`. Вона контролює область видимості змінних. Нагадаємо, що `.` є посиланням на _поточну область видимості_. Отже, `.Values` вказує шаблону знайти обʼєкт `Values` у поточній області видимості.

Синтаксис для `with` схожий на простий оператор `if`:

```go
{{ with PIPELINE }}
  # обмежена область видимості
{{ end }}
```

Області видимості можуть змінюватися. `with` дозволяє вам встановити поточну область видимості (`.`) на певний обʼєкт. Наприклад, ми працювали з `.Values.favorite`. Перепишемо наш ConfigMap, щоб змінити область видимості `.` на `.Values.favorite`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

Зверніть увагу, що ми видалили умову `if` з попереднього прикладу, оскільки вона тепер непотрібна — блок після `with` виконується лише якщо значення `PIPELINE` не є порожнім.

Тепер ми можемо звертатися до `.drink` і `.food` без додаткових уточнень. Це відбувається тому, що оператор `with` встановлює `.` на `.Values.favorite`. `.` скидається до попередньої області видимості після `{{ end }}`.

Але є одне застереження! Усередині обмеженої області видимості ви не зможете отримати доступ до інших обʼєктів з батьківської області видимості за допомогою `.`. Наприклад, це не спрацює:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Це викличе помилку, оскільки `Release.Name` не знаходиться в межах обмеженої області видимості для `.`. Однак, якщо ми поміняємо місцями останні два рядки, все працюватиме як очікувалося, тому що область видимості скидається після `{{ end }}`.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

Або ми можемо використовувати `$` для доступу до обʼєкта `Release.Name` з батьківської області видимості. `$` привʼязується до кореневої області видимості на початку виконання шаблону і не змінюється під час виконання шаблону. Ось таке рішення також спрацює:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

Після розгляду `range` ми перейдемо до змінних шаблону, які пропонують одне рішення для проблеми з областю видимості вище.

## Цикли за допомогою дії `range` {#looping-with-the-range-action}

Багато мов програмування підтримують цикли за допомогою `for` циклів, `foreach` циклів або подібних функціональних механізмів. У мові шаблонів Helm, для перебору колекції використовується оператор `range`.

Спочатку додамо список інгредієнтів для піци до нашого файлу `values.yaml`:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
  - pineapple
```

Тепер у нас є список (в шаблонах він називається `slice`) інгредієнтів для піци. Ми можемо змінити наш шаблон, щоб вивести цей список у наш ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

Ми можемо використовувати `$` для доступу до списку `Values.pizzaToppings` з батьківської області видимості. `$` привʼязується до кореневої області видимості на початку виконання шаблону і не змінюється під час виконання шаблону. Ось таке рішення також спрацює:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

Розглянемо детальніше список `toppings:`. Функція `range` буде "перебирати" список `pizzaToppings`. Але тепер відбувається щось цікаве. Так само як `with` встановлює область видимості для `.`, так і оператор `range` встановлює область видимості. Кожного разу під час циклу `.` встановлюється на поточний інгредієнт для піци. Тобто, під час першої ітерації `.` буде дорівнювати `mushrooms`. Під час другої ітерації він буде дорівнювати `cheese`, і так далі.

Ми можемо безпосередньо передавати значення `.` в конвеєр, тому коли ми використовуємо `{{ . | title | quote }}`, воно передається в `title` (функцію для перетворення на заголовні літери) і потім в `quote`. Якщо ми запустимо цей шаблон, результат буде:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

У цьому прикладі ми зробили дещо хитре. Лінія `toppings: |-` оголошує багаторядковий рядок. Отже, наш список інгредієнтів для піци насправді не є YAML списком. Це великий рядок. Чому ми так робимо? Тому що дані в ConfigMaps `data` складаються з пар ключ/значення, де і ключ, і значення є простими рядками. Щоб зрозуміти, чому це так, ознайомтеся з [документацією Kubernetes ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/). Для нас цей нюанс не так важливий.

> Маркер `|-` в YAML приймає багаторядковий рядок. Це може бути корисною технікою для вбудовування великих блоків даних у ваші маніфести, як показано тут.

Іноді корисно швидко створити список у шаблоні, а потім перебирати цей список. Шаблони Helm мають функцію для спрощення цього завдання: `tuple`. У компʼютерних науках кортеж (tuple) — це список фіксованого розміру, але з довільними типами даних. Це приблизно передає те, як використовується `tuple`.

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

The above will produce this:

```yaml
  sizes: |-
    - small
    - medium
    - large
```

Окрім списків і кортежів, `range` можна використовувати для перебору колекцій, які мають ключ і значення (як `map` або `dict`). Ми розглянемо, як це зробити в наступному розділі, коли введемо змінні шаблону.
