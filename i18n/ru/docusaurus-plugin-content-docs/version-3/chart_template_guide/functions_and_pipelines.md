---
title: Функции шаблонов и конвейеры
description: Использование функций в шаблонах.
sidebar_position: 5
---

До сих пор мы рассматривали, как размещать информацию в шаблоне. Но эта
информация вставляется в шаблон без изменений. Иногда нам нужно
преобразовать полученные данные, чтобы сделать их более полезными.

Начнём с рекомендации: при вставке строк из объекта `.Values`
в шаблон следует заключать эти строки в кавычки. Для этого можно
вызвать функцию `quote` в директиве шаблона:

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

Функции шаблона имеют синтаксис `functionName arg1 arg2...`. В приведённом выше
примере `quote .Values.favorite.drink` вызывает функцию `quote` и передаёт ей
один аргумент.

В Helm доступно более 60 функций. Некоторые из них определены в самом [языке
шаблонов Go](https://godoc.org/text/template). Большинство остальных являются
частью [библиотеки шаблонов Sprig](https://masterminds.github.io/sprig/).
Мы рассмотрим многие из них по мере изучения примеров.

> Хотя мы говорим о «языке шаблонов Helm» как о чём-то специфичном для Helm, на
> самом деле это комбинация языка шаблонов Go, некоторых дополнительных функций
> и различных обёрток для предоставления определённых объектов шаблонам. Многие
> ресурсы по шаблонам Go могут быть полезны при изучении шаблонизации.

## Конвейеры

Одной из мощных возможностей языка шаблонов является концепция _конвейеров_
(pipelines). Заимствуя идею из UNIX, конвейеры позволяют объединять
несколько команд шаблона в цепочку для компактного выражения серии
преобразований. Другими словами, конвейеры — это эффективный способ
выполнить несколько операций последовательно. Давайте перепишем
приведённый выше пример, используя конвейер.

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

В этом примере вместо вызова `quote ARGUMENT` мы изменили порядок. Мы
«отправили» аргумент в функцию с помощью конвейера (`|`):
`.Values.favorite.drink | quote`. Используя конвейеры, можно объединять
несколько функций в цепочку:

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

> Изменение порядка — распространённая практика в шаблонах. Вы будете чаще
> встречать `.val | quote`, чем `quote .val`. Оба варианта допустимы.

При обработке этот шаблон создаст следующий результат:

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

Обратите внимание, что исходное значение `pizza` теперь преобразовано в `"PIZZA"`.

При передаче аргументов через конвейер результат первого вычисления
(`.Values.favorite.drink`) передаётся как _последний аргумент функции_. Мы
можем модифицировать пример с напитком, чтобы проиллюстрировать это
с помощью функции, принимающей два аргумента: `repeat COUNT STRING`:

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

Функция `repeat` повторяет заданную строку указанное количество раз,
поэтому результат будет следующим:

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

## Использование функции `default`

Одна из часто используемых в шаблонах функций — это `default`: `default
DEFAULT_VALUE GIVEN_VALUE`. Эта функция позволяет указать значение по умолчанию
внутри шаблона на случай, если значение не задано. Давайте используем её для
модификации примера с напитком:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

Если мы запустим это как обычно, получим наш `coffee`:

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

Теперь удалим настройку любимого напитка из `values.yaml`:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

Теперь повторный запуск `helm install --dry-run --debug fair-worm ./mychart` 
создаст следующий YAML:

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

В реальном чарте все статические значения по умолчанию должны находиться в файле
`values.yaml` и не должны дублироваться с помощью команды `default` (иначе они
будут избыточными). Однако функция `default` идеально подходит для вычисляемых
значений, которые нельзя объявить внутри `values.yaml`. Например:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

В некоторых случаях условная проверка с `if` может быть более подходящей, чем
`default`. Мы рассмотрим их в следующем разделе.

Функции шаблонов и конвейеры — это мощный способ преобразования информации
и её вставки в YAML. Но иногда необходимо добавить логику шаблона, которая
немного сложнее, чем просто вставка строки. В следующем разделе мы рассмотрим
управляющие конструкции, предоставляемые языком шаблонов.

## Использование функции `lookup`

Функция `lookup` может использоваться для _поиска_ ресурсов в работающем кластере.
Синтаксис функции lookup: `lookup apiVersion, kind, namespace, name
-> resource or resource list`.

| параметр   | тип    |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

Параметры `name` и `namespace` являются необязательными и могут быть переданы как
пустая строка (`""`). Однако при работе с ресурсом, ограниченным пространством имён,
оба параметра `name` и `namespace` должны быть указаны.

Возможны следующие комбинации параметров:

| Поведение                              | Функция lookup                             |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

Когда `lookup` возвращает объект, он представляет собой словарь (dictionary). Этот
словарь можно использовать для извлечения конкретных значений.

Следующий пример вернёт аннотации объекта `mynamespace`:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

Когда `lookup` возвращает список объектов, доступ к списку можно получить
через поле `items`:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

Если объект не найден, возвращается пустое значение. Это можно использовать для
проверки существования объекта.

Функция `lookup` использует существующую конфигурацию подключения Helm к Kubernetes
для выполнения запросов к Kubernetes. Если при взаимодействии с API-сервером
возвращается ошибка (например, из-за отсутствия прав доступа к ресурсу),
обработка шаблона Helm завершится с ошибкой.

Имейте в виду, что Helm не должен обращаться к API-серверу Kubernetes во время
операций `helm template|install|upgrade|delete|rollback --dry-run`. Чтобы протестировать
`lookup` на работающем кластере, следует использовать
`helm template|install|upgrade|delete|rollback --dry-run=server`,
что позволит установить соединение с кластером.

## Операторы — это функции

Для шаблонов операторы (`eq`, `ne`, `lt`, `gt`, `and`, `or` и т.д.) реализованы
как функции. В конвейерах операции можно группировать с помощью
круглых скобок (`(` и `)`).

Теперь мы можем перейти от функций и конвейеров к управлению потоком выполнения
с помощью условий, циклов и модификаторов области видимости.
