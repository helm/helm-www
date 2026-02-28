---
title: Файлы Values
description: Инструкции по использованию флага --values.
sidebar_position: 4
---

В предыдущем разделе мы рассмотрели встроенные объекты, которые предоставляют шаблоны Helm. Один из встроенных объектов — `Values`. Этот объект обеспечивает доступ к значениям, переданным в чарт. Его содержимое формируется из нескольких источников:

- Файл `values.yaml` в чарте
- Если это субчарт — файл `values.yaml` родительского чарта
- Файл values, переданный в `helm install` или `helm upgrade` с помощью флага `-f` (`helm install -f myvals.yaml ./mychart`)
- Отдельные параметры, переданные с помощью `--set` (например, `helm install --set foo=bar ./mychart`)

Список выше приведён в порядке возрастания приоритета: `values.yaml` используется по умолчанию и может быть переопределён файлом `values.yaml` родительского чарта, который, в свою очередь, может быть переопределён пользовательским файлом values, а тот — параметрами `--set`.

Файлы values — это обычные YAML-файлы. Давайте отредактируем `mychart/values.yaml`, а затем изменим наш шаблон ConfigMap.

Удалим значения по умолчанию из `values.yaml` и установим только один параметр:

```yaml
favoriteDrink: coffee
```

Теперь мы можем использовать это значение в шаблоне:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Обратите внимание: в последней строке мы обращаемся к `favoriteDrink` как к атрибуту `Values`: `{{ .Values.favoriteDrink }}`.

Посмотрим на результат.

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

Поскольку `favoriteDrink` в файле `values.yaml` по умолчанию установлен как `coffee`, именно это значение отображается в шаблоне. Мы можем легко переопределить его, добавив флаг `--set` при вызове `helm install`:

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

Поскольку `--set` имеет более высокий приоритет, чем файл `values.yaml` по умолчанию, наш шаблон генерирует `drink: slurm`.

Файлы values также могут содержать более структурированное содержимое. Например, мы можем создать раздел `favorite` в нашем файле `values.yaml` и добавить туда несколько ключей:

```yaml
favorite:
  drink: coffee
  food: pizza
```

Теперь нам нужно немного изменить шаблон:

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

Хотя такая структуризация данных возможна, рекомендуется сохранять деревья значений неглубокими, отдавая предпочтение плоской структуре. Когда мы рассмотрим присвоение значений субчартам, вы увидите, как значения именуются с использованием древовидной структуры.

## Удаление ключа по умолчанию

Если вам нужно удалить ключ из значений по умолчанию, вы можете переопределить его значение как `null` — тогда Helm удалит этот ключ при слиянии переопределённых значений.

Например, стабильный чарт Drupal позволяет настраивать проверку работоспособности (liveness probe), если вы используете собственный образ. Вот значения по умолчанию:

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

Если вы попытаетесь переопределить обработчик livenessProbe на `exec` вместо `httpGet` с помощью `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`, Helm объединит ключи по умолчанию и переопределённые, что приведёт к следующему YAML:

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

Однако Kubernetes выдаст ошибку, поскольку нельзя объявлять более одного обработчика livenessProbe. Чтобы решить эту проблему, вы можете указать Helm удалить `livenessProbe.httpGet`, установив его в null:

```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

На данный момент мы рассмотрели несколько встроенных объектов и использовали их для внедрения информации в шаблон. Теперь перейдём к другому аспекту движка шаблонов: функциям и конвейерам.
