---
title: "Шаблони"
description: "Ближче ознайомлення з найкращими практиками щодо шаблонів."
weight: 3
---

Ця частина посібника з найкращих практик фокусується на шаблонах.

## Структура `templates/` {#structure-of-templates}

Теку `templates/` слід структурувати наступним чином:

- Файли шаблонів повинні мати розширення `.yaml`, якщо вони генерують YAML-вихід. Розширення `.tpl` можна використовувати для файлів шаблонів, які не генерують форматований контент.
- Імена файлів шаблонів повинні використовувати дефіси (`my-example-configmap.yaml`), а не camelCase.
- Кожне визначення ресурсу повинно бути у власному файлі шаблону.
- Імена файлів шаблонів повинні відображати тип ресурсу в імені. Наприклад, `foo-pod.yaml`, `bar-svc.yaml`.

## Імена визначених шаблонів {#names-of-defined-templates}

Визначені шаблони (шаблони, створені всередині директиви `{{ define }}`) є глобально доступними. Це означає, що чарт і всі його субчарти матимуть доступ до всіх шаблонів, створених з `{{ define }}`.

З цієї причини _усі імена визначених шаблонів повинні бути просторово іменовані_.

Правильно:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

Неправильно:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```

Рекомендується, щоб нові чарти створювалися за допомогою команди `helm create`, оскільки імена шаблонів автоматично визначаються відповідно до цієї найкращої практики.

## Форматування шаблонів {#formatting-templates}

Шаблони повинні мати відступи у _два пробіли_ (ніколи не табуляцією).

Директиви шаблону повинні мати пробіл після відкриваючих дужок і перед закриваючими дужками:

Правильно:

```go
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

Неправильно:

```go
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

Шаблони повинні обрізати пробіли, де це можливо:

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

Блоки (такі як контрольні структури) можуть мати відступи для вказівки потоку коду шаблону.

```go
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

Однак, оскільки YAML є мовою, орієнтованою на пробіли, часто неможливо, щоб відступи коду слідували цій конвенції.

## Пробіли у згенерованих шаблонах {#whitespace-in-generated-templates}

Бажано мінімізувати кількість пробілів у згенерованих шаблонах. Особливо слід уникати численних порожніх рядків, які йдуть один за одним. Але випадкові порожні рядки (особливо між логічними секціями) допустимі.

Це краще:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

Це прийнятно:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

Але це слід уникати:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## Коментарі (Коментарі YAML vs. Коментарі шаблонів) {#comments-yaml-comments-vs-template-comments}

Як YAML, так і шаблони Helm мають маркери коментарів.

Коментарі YAML:

```yaml
# Це коментар
type: sprocket
```

Коментарі шаблонів:

```yaml
{{- /*
Це коментар.
*/}}
type: frobnitz
```

Коментарі шаблонів слід використовувати для документування функцій шаблону, наприклад, пояснюючи визначений шаблон:

```yaml
{{- /*
mychart.shortname надає скорочену версію імені релізу до 6 символів.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

Всередині шаблонів коментарі YAML можуть використовуватися, коли це корисно для користувачів Helm (можливо) бачити коментарі під час налагодження.

```yaml
# Це може спричинити проблеми, якщо значення більше ніж 100Gi
memory: {{ .Values.maxMem | quote }}
```

Вищенаведений коментар видимий, коли користувач виконує `helm install --debug`, тоді як коментарі, вказані в секціях `{{- /* */}}`, не видно.

Остерігайтеся додавання `#` коментарів YAML у секції шаблону, що містять значення Helm, які можуть бути потрібні для деяких функцій шаблону.

Наприклад, якщо функція `required` вводиться у наведеному вище прикладі, і `maxMem` не встановлено, коментар `#` YAML спричинить помилку рендерингу.

Правильно: `helm template` не рендерить цей блок

```yaml
{{- /*
# Це може спричинити проблеми, якщо значення більше ніж 100Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}
```

Неправильно: `helm template` повертає `Error: execution error at (templates/test.yaml:2:13): maxMem must be set`

```yaml
# Це може спричинити проблеми, якщо значення більше ніж 100Gi
# memory: {{ required .Values.maxMem "maxMem must be set" | quote }}
```

Огляньте [Налагодження шаблонів](../chart_template_guide/debugging.md) для іншого прикладу цієї поведінки того, як коментарі YAML залишаються недоторканими.

## Використання JSON у шаблонах і виході шаблонів {#use-of-json-in-templates-and-template-output}

YAML є надмножиною JSON. У деяких випадках використання синтаксису JSON може бути більш читабельним, ніж інші представлення YAML.

Наприклад, цей YAML ближчий до звичайного методу представлення списків у YAML:

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

Але його легше читати, коли його стисло представлено у стилі списку JSON:

```yaml
arguments: ["--dirname", "/foo"]
```

Використання JSON для підвищення читабельності є корисним. Однак синтаксис JSON не слід використовувати для представлення cкладніших конструкцій.

При роботі з чистим JSON, вбудованим всередині YAML (наприклад, конфігурація контейнера ініціалізації), звичайно, доречно використовувати формат JSON.