---
title: Субчарты и глобальные значения
description: Работа со значениями субчартов и глобальными значениями.
sidebar_position: 11
---

До сих пор мы работали только с одним чартом. Но чарты могут иметь зависимости, называемые _субчартами_, которые также имеют собственные значения и шаблоны. В этом разделе мы создадим субчарт и рассмотрим различные способы доступа к значениям из шаблонов.

Прежде чем перейти к коду, следует узнать несколько важных деталей о субчартах приложений:

1. Субчарт считается «автономным», то есть субчарт никогда не может явно зависеть от родительского чарта.
2. По этой причине субчарт не может обращаться к значениям родительского чарта.
3. Родительский чарт может переопределять значения субчартов.
4. В Helm существует концепция _глобальных значений_, которые доступны всем чартам.

> Эти ограничения не обязательно применимы к [library-чартам](/topics/library_charts.md), которые предназначены для предоставления стандартизированных вспомогательных функций.

В процессе изучения примеров этого раздела многие концепции станут понятнее.

## Создание субчарта

Для этих упражнений мы начнём с чарта `mychart/`, созданного в начале руководства, и добавим внутрь него новый чарт.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

Обратите внимание: как и ранее, мы удалили все базовые шаблоны, чтобы начать с нуля. В этом руководстве мы сосредоточены на работе шаблонов, а не на управлении зависимостями. Дополнительную информацию о работе субчартов можно найти в [руководстве по чартам](/topics/charts.md).

## Добавление значений и шаблона в субчарт

Далее создадим простой шаблон и файл values для нашего чарта `mysubchart`. В директории `mychart/charts/mysubchart` уже должен быть файл `values.yaml`. Настроим его следующим образом:

```yaml
dessert: cake
```

Затем создадим новый шаблон ConfigMap в `mychart/charts/mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

Поскольку каждый субчарт является _автономным чартом_, мы можем протестировать `mysubchart` отдельно:

```console
$ helm install --generate-name --dry-run --debug mychart/charts/mysubchart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart/charts/mysubchart
NAME:   newbie-elk
TARGET NAMESPACE:   default
CHART:  mysubchart 0.1.0
MANIFEST:
---
# Source: mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: newbie-elk-cfgmap2
data:
  dessert: cake
```

## Переопределение значений из родительского чарта

Наш исходный чарт `mychart` теперь является _родительским чартом_ для `mysubchart`. Эта связь основана исключительно на том, что `mysubchart` находится внутри `mychart/charts`.

Поскольку `mychart` является родительским, мы можем указать конфигурацию в `mychart` и передать её в `mysubchart`. Например, можно изменить `mychart/values.yaml` следующим образом:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

Обратите внимание на последние две строки. Все директивы внутри секции `mysubchart` будут переданы в чарт `mysubchart`. Поэтому, если мы выполним `helm install --generate-name --dry-run --debug mychart`, среди прочего мы увидим ConfigMap субчарта `mysubchart`:

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

Значение верхнего уровня переопределило значение субчарта.

Здесь важно отметить одну деталь. Мы не изменяли шаблон `mychart/charts/mysubchart/templates/configmap.yaml`, чтобы он указывал на `.Values.mysubchart.dessert`. С точки зрения этого шаблона значение по-прежнему находится в `.Values.dessert`. Когда движок шаблонов передаёт значения, он устанавливает область видимости. Поэтому для шаблонов `mysubchart` в `.Values` будут доступны только значения, предназначенные специально для `mysubchart`.

Однако иногда требуется, чтобы определённые значения были доступны всем шаблонам. Это достигается с помощью глобальных значений чарта.

## Глобальные значения чарта

Глобальные значения — это значения, к которым можно обращаться из любого чарта или субчарта по одному и тому же имени. Глобальные значения требуют явного объявления. Нельзя использовать существующее неглобальное значение как глобальное.

Тип данных Values имеет зарезервированную секцию `Values.global`, в которой можно задавать глобальные значения. Давайте добавим её в файл `mychart/values.yaml`.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar
```

Благодаря тому, как работают глобальные значения, и `mychart/templates/configmap.yaml`, и `mysubchart/templates/configmap.yaml` смогут получить доступ к этому значению через `{{ .Values.global.salad }}`.

`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

Теперь, если мы выполним пробную установку, мы увидим одинаковое значение в обоих результатах:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-configmap
data:
  salad: caesar

---
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-cfgmap2
data:
  dessert: ice cream
  salad: caesar
```

Глобальные значения полезны для передачи подобной информации, хотя их использование требует предварительного планирования, чтобы правильно настроить соответствующие шаблоны.

## Совместное использование шаблонов с субчартами

Родительские чарты и субчарты могут совместно использовать шаблоны. Любой определённый блок в любом чарте доступен другим чартам.

Например, можно определить простой шаблон следующим образом:

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

Напомним, что метки в шаблонах являются _глобально разделяемыми_. Поэтому шаблон `labels` может быть включён из любого другого чарта.

Хотя разработчики чартов могут выбирать между `include` и `template`, одно из преимуществ использования `include` заключается в том, что `include` позволяет динамически ссылаться на шаблоны:

```yaml
{{ include $mytemplate }}
```

Приведённый код разыменует переменную `$mytemplate`. Функция `template`, напротив, принимает только строковый литерал.

## Избегайте использования блоков

Язык шаблонов Go предоставляет ключевое слово `block`, которое позволяет разработчикам задавать реализацию по умолчанию, переопределяемую позднее. В чартах Helm блоки — не лучший инструмент для переопределения, поскольку при наличии нескольких реализаций одного и того же блока выбор реализации непредсказуем.

Вместо этого рекомендуется использовать `include`.
