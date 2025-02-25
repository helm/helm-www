---
title: "Файли значень"
description: "Інструкції щодо використання прапорця --values."
weight: 4
---

У попередньому розділі ми розглянули вбудовані обʼєкти, які пропонують шаблони Helm. Один з вбудованих обʼєктів — це `Values`. Цей обʼєкт надає доступ до значень, переданих у шаблон. Його вміст походить з кількох джерел:

- Файл `values.yaml` у шаблоні
- Якщо це субшаблон, файл `values.yaml` батьківського шаблону
- Файл значень передається в `helm install` або `helm upgrade` з прапорцем `-f` (`helm install -f myvals.yaml ./mychart`)
- Окремі параметри передаються з `--set` (наприклад, `helm install --set foo=bar ./mychart`)

Наведений вище список розташований у порядку специфічності: `values.yaml` є стандартним, яке може бути перевизначене файлом `values.yaml` батьківського шаблону, який, своєю чергою, може бути перевизначений файлом значень, наданим користувачем, який, своєю чергою, може бути перевизначений параметрами `--set`.

Файли значень — це прості YAML-файли. Відредагуємо `mychart/values.yaml`, а потім відредагуємо наш шаблон ConfigMap.

Видаливши стандартні значення у `values.yaml`, ми встановимо лише один параметр:

```yaml
favoriteDrink: coffee
```

Тепер ми можемо використовувати його всередині шаблону:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Зверніть увагу, що в останньому рядку ми отримуємо доступ до `favoriteDrink` як до атрибута `Values`: `{{ .Values.favoriteDrink }}`.

Подивімося, як це відобразиться.

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

Оскільки `favoriteDrink` встановлено в стандартне значення у файлі `values.yaml` як `coffee`, це значення відображається в шаблоні. Ми можемо легко перевизначити його, додавши прапорець `--set` у наш виклик `helm install`:

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

Оскільки `--set` має вищий пріоритет, ніж файл `values.yaml`, наш шаблон генерує `drink: slurm`.

Файли значень також можуть містити більш структурований контент. Наприклад, ми могли б створити розділ `favorite` у нашому файлі `values.yaml`, а потім додати туди кілька ключів:

```yaml
favorite:
  drink: coffee
  food: pizza
```

Тепер нам потрібно трохи змінити шаблон:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

Хоча структурування даних таким чином є можливим, рекомендується тримати дерева значень пласкими, надаючи перевагу рівній структурі. Коли ми розглядатимемо призначення значень субшаблонам, ми побачимо, як значення називаються, використовуючи структуру дерева.

## Видалення стандартного ключа {#deleting-a-default-key}

Якщо вам потрібно видалити ключ зі стандартних значень, ви можете перевизначити значення ключа як `null`, у цьому випадку Helm видалить ключ з злиття перевизначених значень.

Наприклад, стабільний шаблон Drupal дозволяє налаштовувати перевірку життєздатності (liveness probe) у випадку, якщо ви налаштовуєте власний образ. Ось стандартні значення:

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

Якщо ви спробуєте перевизначити обробник livenessProbe на `exec` замість `httpGet`, використовуючи `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`, Helm обʼєднає стандартні ключі разом з перевизначеними, що дасть нам наступний YAML:

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

Однак Kubernetes тоді видасть помилку, оскільки не можна оголошувати більше одного обробника livenessProbe. Щоб це обійти, ви можете інструктувати Helm видалити `livenessProbe.httpGet`, встановивши його значення в null:

```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

На цьому етапі ми розглянули кілька вбудованих обʼєктів і використали їх для вставки інформації в шаблон. Тепер ми розглянемо інший аспект шаблонного механізму: функції та конвеєри.
