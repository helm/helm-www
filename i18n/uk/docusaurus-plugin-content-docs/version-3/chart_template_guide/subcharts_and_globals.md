---
title: "Субчарти та глобальні значення"
description: "Взаємодія з значеннями субчартів і глобальними значеннями."
weight: 11
---

До цього моменту ми працювали тільки з одним чартом. Але чарти можуть мати залежності, які називаються _субчартами_, що також мають свої власні значення і шаблони. У цьому розділі ми створимо субчарт і розглянемо різні способи доступу до значень зсередини шаблонів.

Перед тим, як перейти до коду, є кілька важливих деталей, які слід знати про субчарти:

1. Субчарт вважається "автономним", що означає, що субчарт ніколи не може прямо залежати від батьківського чарту.
2. Тому субчарт не може отримувати доступ до значень свого пращура.
3. Батьківський чарт може перевизначати значення для субчартів.
4. Helm має концепцію _глобальних значень_, які можуть бути доступні всім чартам.

> Ці обмеження не завжди застосовуються до [бібліотечних чартів]({{< ref "/docs/topics/library_charts.md" >}}), які розроблені для надання стандартної функціональності.

Під час роботи з прикладами в цьому розділі ці концепції стануть зрозумілішими.

## Створення субчарту {#creating-a-subchart}

Для цих вправ ми почнемо з чарту `mychart/`, який ми створили на початку цього посібника, і додамо новий чарт всередину його.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

Зверніть увагу, що ми видалили всі базові шаблони, щоб почати з нуля. У цьому посібнику ми зосереджені на тому, як працюють шаблони, а не на управлінні залежностями. Але [Посібник з Чартів]({{< ref "../topics/charts.md" >}}) містить більше інформації про те, як працюють субчарти.

## Додавання значень та шаблону до субчарту {#adding-values-and-a-template-to-the-subchart}

Далі створимо простий шаблон і файл значень для чарту `mysubchart`. У `mychart/charts/mysubchart` вже має бути файл `values.yaml`. Налаштуємо його так:

```yaml
dessert: cake
```

Далі створимо новий шаблон ConfigMap у `mychart/charts/mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

Оскільки кожен субчарт є _самостіним чартом_, ми можемо протестувати `mysubchart` окремо:

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

## Перевизначення значень з батьківського чарту {#overriding-values-from-a-parent-chart}

Наш оригінальний чарт, `mychart`, тепер є _батьківським_ чартом для `mysubchart`. Ці стосунки базується виключно на тому, що `mysubchart` знаходиться в `mychart/charts`.

Оскільки `mychart` є батьківським чартом, ми можемо вказати конфігурацію в `mychart` і передати цю конфігурацію в `mysubchart`. Наприклад, ми можемо змінити `mychart/values.yaml` таким чином:

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

Зверніть увагу на останні два рядки. Будь-які директиви всередині секції `mysubchart` будуть передані в чарт `mysubchart`. Отже, якщо ми виконаємо `helm install --generate-name --dry-run --debug mychart`, однією з речей, які ми побачимо, буде ConfigMap `mysubchart`:

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

Значення на верхньому рівні тепер перевизначило значення субчарту.

Важливо помітити, що ми не змінили шаблон `mychart/charts/mysubchart/templates/configmap.yaml`, щоб вказати на `.Values.mysubchart.dessert`. З точки зору цього шаблону, значення все ще розташоване в `.Values.dessert`. Оскільки шаблонний движок передає значення далі, він встановлює область видимості. Отже, для шаблонів `mysubchart` тільки значення, специфічні для `mysubchart`, будуть доступні в `.Values`.

Іноді, проте, ви хочете, щоб певні значення були доступні всім шаблонам. Це досягається за допомогою глобальних значень чарту.

## Глобальні значення чарту {#global-chart-values}

Глобальні значення — це значення, які можуть бути доступні з будь-якого чарту або субчарту під тим самим імʼям. Глобальні значення потребують явного оголошення. Ви не можете використовувати вже наявні неглобальні значення як глобальні.

Тип даних Values має зарезервовану секцію `Values.global`, де можна задати глобальні значення. Визначимо одне в нашому файлі `mychart/values.yaml`.

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

Завдяки способу роботи глобальних значень, як `mychart/templates/configmap.yaml`, так і `mysubchart/templates/configmap.yaml` повинні мати змогу отримати це значення як `{{ .Values.global.salad }}`.

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

Тепер, якщо ми виконаємо установку в режимі dry run, ми побачимо одне й те ж значення в обох виводах:

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

Глобальні значення корисні для передачі такої інформації, хоча це вимагає певного планування, щоб переконатися, що правильні шаблони налаштовані для використання глобальних значень.

## Поширення шаблонів з субчартами {#sharing-templates-with-subcharts}

Батьківські чарти та субчарти можуть ділитися шаблонами. Будь-який визначений блок у будь-якому чарті доступний іншим чартам.

Наприклад, ми можемо визначити простий шаблон таким чином:

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

Згадайте, як мітки на шаблонах є _глобально спільними_. Отже, шаблон `labels` можна включити з будь-якого іншого чарту.

Хоча розробники чартів можуть вибирати між `include` та `template`, однією з переваг використання `include` є те, що `include` може динамічно посилатися на шаблони:

```yaml
{{ include $mytemplate }}
```

Вищезазначене призведе до розʼєднання посилань на `$mytemplate`. Функція `template`, навпаки, приймає тільки рядковий літерал.

## Уникнення використання блоків {#avoid-using-blocks}

Мова шаблонів Go надає ключове слово `block`, яке дозволяє розробникам надати стандартну реалізацію, яка потім перевизначається. У чарті Helm блоки не є найкращим інструментом для перевизначення, оскільки якщо кілька реалізацій одного блоку надаються, вибір однієї з них є непередбачуваним.

Рекомендація — використовувати `include`.
