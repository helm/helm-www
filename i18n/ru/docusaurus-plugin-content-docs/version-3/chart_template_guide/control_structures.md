---
title: Управление потоком выполнения
description: Краткий обзор управляющих структур в шаблонах.
sidebar_position: 7
---

Управляющие структуры (называемые в терминологии шаблонов «действиями») позволяют вам, как автору шаблона, управлять генерацией шаблона. Язык шаблонов Helm предоставляет следующие управляющие структуры:

- `if`/`else` для создания условных блоков
- `with` для указания области видимости
- `range` для организации цикла в стиле «для каждого»

Кроме того, язык предоставляет несколько действий для объявления и использования именованных фрагментов шаблонов:

- `define` объявляет новый именованный шаблон внутри вашего шаблона
- `template` импортирует именованный шаблон
- `block` объявляет особый вид заполняемой области шаблона

В этом разделе мы рассмотрим `if`, `with` и `range`. Остальные описаны в разделе «Именованные шаблоны» далее в этом руководстве.

## If/Else

Первая управляющая структура предназначена для условного включения блоков текста в шаблон. Это блок `if`/`else`.

Базовая структура условия выглядит следующим образом:

```
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

Обратите внимание: речь идёт о _конвейерах_, а не просто о значениях. Это подчёркивает, что управляющие структуры могут выполнять целый конвейер, а не только вычислять одно значение.

Конвейер вычисляется как _false_, если значение:

- булево false
- числовой ноль
- пустая строка
- `nil` (пустое или null)
- пустая коллекция (`map`, `slice`, `tuple`, `dict`, `array`)

Во всех остальных случаях условие истинно.

Добавим простое условие в наш ConfigMap. Мы добавим ещё одну настройку, если напиток установлен как coffee:

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

Поскольку в предыдущем примере мы закомментировали `drink: coffee`, в выводе не будет флага `mug: "true"`. Но если добавить эту строку обратно в файл `values.yaml`, вывод будет выглядеть так:

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

## Управление пробелами

Рассматривая условия, стоит кратко остановиться на управлении пробелами в шаблонах. Возьмём предыдущий пример и отформатируем его для удобства чтения:

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

На первый взгляд всё хорошо. Но если пропустить его через движок шаблонов, получим неожиданный результат:

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

Что произошло? Мы сгенерировали некорректный YAML из-за пробелов.

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

`mug` имеет неправильный отступ. Уберём лишний отступ в этой строке и запустим снова:

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

Теперь YAML корректен, но выглядит несколько странно:

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

В YAML появились пустые строки. Почему? Движок шаблонов _удаляет_ содержимое внутри `{{` и `}}`, но оставляет окружающие пробелы без изменений.

В YAML пробелы имеют значение, поэтому управление ими становится важным. К счастью, в шаблонах Helm есть несколько инструментов для этого.

Во-первых, синтаксис фигурных скобок можно модифицировать специальными символами, чтобы указать движку обрезать пробелы. `{{- ` (с дефисом и пробелом) означает, что пробелы слева должны быть обрезаны, а ` -}}` — что пробелы справа должны быть обрезаны. _Будьте внимательны! Переводы строк тоже считаются пробелами!_

> Убедитесь, что между `-` и остальной частью директивы есть пробел.
> `{{- 3 }}` означает «обрезать пробелы слева и вывести 3», тогда как `{{-3 }}` означает «вывести -3».

Используя этот синтаксис, мы можем изменить наш шаблон, чтобы избавиться от пустых строк:

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

Для наглядности заменим символом `*` каждый пробел, который будет обрезан согласно этому правилу. Символ `*` в конце строки обозначает перевод строки, который будет удалён:

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

Учитывая это, запустим наш шаблон через Helm и посмотрим результат:

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

Будьте осторожны с модификаторами обрезки. Легко случайно сделать что-то вроде этого:

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

Это даст `food: "PIZZA"mug: "true"`, потому что будут обрезаны переводы строк с обеих сторон.

> Подробнее об управлении пробелами в шаблонах см. в [официальной документации Go template](https://godoc.org/text/template).

Наконец, иногда проще указать системе шаблонов, как делать отступы, вместо того чтобы пытаться управлять пробелами вручную. Для этого может быть полезна функция `indent` (`{{ indent 2 "mug:true" }}`).

## Изменение области видимости с помощью `with`

Следующая управляющая структура — действие `with`. Оно управляет областью видимости переменных. Напомним, что `.` — это ссылка на _текущую область видимости_. Таким образом, `.Values` указывает шаблону искать объект `Values` в текущей области видимости.

Синтаксис `with` похож на простой оператор `if`:

```
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

Область видимости можно изменять. `with` позволяет установить текущую область видимости (`.`) на конкретный объект. Например, мы работали с `.Values.favorite`. Перепишем наш ConfigMap, изменив область видимости `.` так, чтобы она указывала на `.Values.favorite`:

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

Обратите внимание: мы убрали условие `if` из предыдущего примера, поскольку оно больше не нужно — блок после `with` выполняется только если значение `PIPELINE` не пустое.

Теперь мы можем ссылаться на `.drink` и `.food` без полного пути. Это возможно потому, что оператор `with` устанавливает `.` так, чтобы она указывала на `.Values.favorite`. После `{{ end }}` область видимости `.` сбрасывается к предыдущему значению.

Но будьте осторожны! Внутри ограниченной области видимости вы не сможете обращаться к другим объектам из родительской области через `.`. Например, следующий код не сработает:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Это вызовет ошибку, потому что `Release.Name` недоступен внутри ограниченной области видимости `.`. Однако если поменять местами две последние строки, всё будет работать корректно, поскольку область видимости сбрасывается после `{{ end }}`:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

Также можно использовать `$` для доступа к объекту `Release.Name` из родительской области видимости. Переменная `$` указывает на корневую область видимости при начале выполнения шаблона и не изменяется в процессе выполнения. Следующий вариант тоже будет работать:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

После рассмотрения `range` мы разберём переменные шаблонов, которые предлагают ещё одно решение описанной выше проблемы с областью видимости.

## Циклы с действием `range`

Многие языки программирования поддерживают циклы с помощью `for`, `foreach` или аналогичных механизмов. В языке шаблонов Helm для итерации по коллекции используется оператор `range`.

Для начала добавим список начинок для пиццы в файл `values.yaml`:

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

Теперь у нас есть список (в терминологии шаблонов называемый `slice`) `pizzaToppings`. Мы можем изменить шаблон, чтобы вывести этот список в ConfigMap:

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

Мы можем использовать `$` для доступа к списку `Values.pizzaToppings` из родительской области видимости. Переменная `$` указывает на корневую область видимости при начале выполнения шаблона и не изменяется в процессе выполнения. Следующий вариант тоже будет работать:

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

Рассмотрим список `toppings:` подробнее. Функция `range` перебирает (итерирует) список `pizzaToppings`. Здесь происходит кое-что интересное: как и `with`, оператор `range` устанавливает область видимости `.`. На каждой итерации `.` устанавливается на текущий элемент списка. То есть на первой итерации `.` равна `mushrooms`, на второй — `cheese`, и так далее.

Мы можем передать значение `.` напрямую в конвейер, поэтому когда мы пишем `{{ . | title | quote }}`, `.` передаётся в `title` (функция преобразования к заглавным буквам), а затем в `quote`. Результат выполнения:

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

В этом примере мы применили один трюк. Строка `toppings: |-` объявляет многострочную строку. Таким образом, наш список начинок на самом деле не является YAML-списком — это одна большая строка. Почему? Потому что данные в ConfigMap `data` состоят из пар ключ/значение, где и ключ, и значение являются простыми строками. Подробнее об этом см. в [документации Kubernetes по ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/). Впрочем, для нас эта деталь не так важна.

> Маркер `|-` в YAML обозначает многострочную строку. Это полезный приём для встраивания больших блоков данных в манифесты, как показано здесь.

Иногда бывает удобно быстро создать список прямо в шаблоне и затем перебрать его. В шаблонах Helm есть функция для этого: `tuple`. В информатике кортеж — это коллекция фиксированного размера, похожая на список, но с произвольными типами данных. Примерно так `tuple` используется и здесь.

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

Результат:

```yaml
  sizes: |-
    - small
    - medium
    - large
```

Помимо списков и кортежей, `range` можно использовать для итерации по коллекциям с ключом и значением (таким как `map` или `dict`). Мы рассмотрим это в следующем разделе, когда познакомимся с переменными шаблонов.
