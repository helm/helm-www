---
title: Использование Helm
description: Объясняет основы работы с Helm.
sidebar_position: 3
---

В этом руководстве объясняются основы использования Helm для управления пакетами на вашем кластере Kubernetes. Руководство предполагает, что вы уже [установили](/intro/install.md) Helm.

Если вас просто интересует выполнение нескольких команд, вы можете начать с [Краткого руководства](/intro/quickstart.md). В этой главе описаны особенности команд Helm и объясняется, как использовать Helm.

## Три основных концепции

*Чарт* — это пакет Helm. Он содержит все определения ресурсов, необходимые для запуска приложения, инструмента или службы внутри кластера Kubernetes. Можно представить его как Kubernetes-эквивалент формулы Homebrew, пакета Apt dpkg или RPM-файла Yum.

*Репозиторий* — это место, где можно собирать чарты и делиться ими. Это похоже на [архив CPAN](https://www.cpan.org) для Perl или [базу пакетов Fedora](https://src.fedoraproject.org/), но для пакетов Kubernetes.

*Релиз* — это экземпляр чарта, работающий в кластере Kubernetes. Один чарт часто может быть установлен многократно в одном и том же кластере. Каждый раз при установке создаётся новый _релиз_. Рассмотрим чарт MySQL. Если вам нужны две базы данных в кластере, вы можете установить этот чарт дважды. Каждая установка будет иметь свой собственный _релиз_ со своим уникальным _именем релиза_.

Зная эти концепции, можно описать работу Helm так:

Helm устанавливает _чарты_ в Kubernetes, создавая новый _релиз_ для каждой установки. Чтобы найти новые чарты, можно воспользоваться поиском в _репозиториях_ чартов Helm.

## 'helm search': Поиск чартов

Helm поставляется с мощной командой поиска. Она может использоваться для поиска в двух различных типах источников:

- `helm search hub` выполняет поиск в [Artifact Hub](https://artifacthub.io), который содержит списки чартов Helm из множества различных репозиториев.
- `helm search repo` выполняет поиск в репозиториях, которые вы добавили в свой локальный клиент Helm (с помощью `helm repo add`). Этот поиск выполняется по локальным данным и не требует подключения к сети.

Вы можете найти общедоступные чарты, выполнив `helm search hub`:

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

Команда выше ищет все чарты `wordpress` в Artifact Hub.

Без фильтра `helm search hub` показывает все доступные чарты.

`helm search hub` показывает URL-адрес на [artifacthub.io](https://artifacthub.io/), но не фактический репозиторий Helm. `helm search hub --list-repo-url` показывает фактический URL репозитория Helm, что удобно, когда вы хотите добавить новый репозиторий: `helm repo add [NAME] [URL]`.

Используя `helm search repo`, вы можете найти названия чартов в уже добавленных вами репозиториях:

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Helm search использует нечёткий поиск (fuzzy string matching), поэтому вы можете вводить части слов или фраз:

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Поиск — это хороший способ найти доступные пакеты. Как только вы нашли пакет, который хотите установить, вы можете использовать `helm install` для его установки.

## 'helm install': Установка пакета

Чтобы установить новый пакет, используйте команду `helm install`. В простейшем случае она принимает два аргумента: имя релиза, которое вы выбираете, и имя чарта, который вы хотите установить.

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Теперь чарт `wordpress` установлен. Обратите внимание, что при установке чарта создаётся новый объект _релиза_. Релиз выше называется `happy-panda`. (Если вы хотите, чтобы Helm сгенерировал имя за вас, не указывайте имя релиза и используйте `--generate-name`.)

Во время установки клиент `helm` выводит полезную информацию о том, какие ресурсы были созданы, каково состояние релиза, а также есть ли дополнительные шаги настройки, которые вы можете или должны выполнить.

Helm устанавливает ресурсы в следующем порядке:

- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- ClusterRoleBinding
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService
- MutatingWebhookConfiguration
- ValidatingWebhookConfiguration

Helm не ждёт, пока все ресурсы будут запущены, прежде чем завершить работу. Многие чарты требуют Docker-образы размером более 600 МБ, и их установка в кластер может занять много времени.

Чтобы отслеживать состояние релиза или повторно прочитать информацию о конфигурации, вы можете использовать `helm status`:

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Выше показано текущее состояние вашего релиза.

### Настройка чарта перед установкой

При установке описанным способом будут использованы только параметры конфигурации по умолчанию для данного чарта. Часто вам потребуется настроить чарт в соответствии с вашими предпочтениями.

Чтобы увидеть, какие параметры можно настроить в чарте, используйте `helm show values`:

```console
$ helm show values bitnami/wordpress
## Global Docker image parameters
## Please, note that this will override the image parameters, including dependencies, configured to use the global value
## Current available global Docker image parameters: imageRegistry and imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass

## Bitnami WordPress image version
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/
##
image:
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

Затем вы можете переопределить любой из этих параметров в файле формата YAML и передать этот файл при установке.

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

Команда выше создаст пользователя MariaDB с именем `user0` и предоставит этому пользователю доступ к вновь созданной базе данных `user0db`, но примет все остальные значения по умолчанию для этого чарта.

Существует два способа передачи конфигурационных данных во время установки:

- `--values` (или `-f`): указывает YAML-файл с переопределениями. Можно указать несколько раз, при этом самый правый файл будет иметь приоритет.
- `--set`: указывает переопределения в командной строке.

Если используются оба параметра, значения `--set` объединяются со значениями `--values` с более высоким приоритетом. Переопределения, указанные с помощью `--set`, сохраняются в Secret. Значения, которые были заданы через `--set`, можно просмотреть для данного релиза с помощью `helm get values <release-name>`. Значения `--set` можно сбросить, выполнив `helm upgrade` с указанием `--reset-values`.

#### Формат и ограничения `--set`

Параметр `--set` принимает ноль или более пар имя/значение. В простейшем случае он используется так: `--set name=value`. Эквивалент в YAML:

```yaml
name: value
```

Несколько значений разделяются символом `,`. Таким образом, `--set a=b,c=d` становится:

```yaml
a: b
c: d
```

Поддерживаются более сложные выражения. Например, `--set outer.inner=value` преобразуется в:

```yaml
outer:
  inner: value
```

Списки можно задать, заключив значения в `{` и `}`. Например, `--set name={a, b, c}` преобразуется в:

```yaml
name:
  - a
  - b
  - c
```

Определённые имена/ключи можно установить в `null` или в пустой массив `[]`. Например, `--set name=[],a=null` преобразует

```yaml
name:
  - a
  - b
  - c
a: b
```

в

```yaml
name: []
a: null
```

Начиная с Helm 2.5.0, доступ к элементам списка возможен с помощью синтаксиса индекса массива. Например, `--set servers[0].port=80` становится:

```yaml
servers:
  - port: 80
```

Таким образом можно задать несколько значений. Строка `--set servers[0].port=80,servers[0].host=example` становится:

```yaml
servers:
  - port: 80
    host: example
```

Иногда вам нужно использовать специальные символы в строках `--set`. Вы можете использовать обратную косую черту для экранирования символов; `--set name=value1\,value2` станет:

```yaml
name: "value1,value2"
```

Аналогично можно экранировать точки, что может пригодиться, когда чарты используют функцию `toYaml` для разбора аннотаций, меток и селекторов узлов. Синтаксис `--set nodeSelector."kubernetes\.io/role"=master` становится:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Глубоко вложенные структуры данных может быть сложно выразить с помощью `--set`. Разработчикам чартов рекомендуется учитывать использование `--set` при проектировании формата файла `values.yaml` (подробнее см. [Файлы Values](/chart_template_guide/values_files.md)).

### Дополнительные методы установки

Команда `helm install` может устанавливать из нескольких источников:

- Репозиторий чартов (как мы видели выше)
- Локальный архив чарта (`helm install foo foo-0.1.1.tgz`)
- Распакованная директория чарта (`helm install foo path/to/foo`)
- Полный URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' и 'helm rollback': Обновление релиза и восстановление после сбоя

Когда выходит новая версия чарта или когда вы хотите изменить конфигурацию своего релиза, вы можете использовать команду `helm upgrade`.

Обновление берёт существующий релиз и обновляет его согласно предоставленной вами информации. Поскольку чарты Kubernetes могут быть большими и сложными, Helm пытается выполнить наименее инвазивное обновление. Он обновит только то, что изменилось с момента последнего релиза.

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

В приведённом выше случае релиз `happy-panda` обновляется тем же чартом, но с новым YAML-файлом:

```yaml
mariadb.auth.username: user1
```

Мы можем использовать `helm get values`, чтобы проверить, применились ли новые настройки.

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

Команда `helm get` — полезный инструмент для просмотра релиза в кластере. Как мы видим выше, она показывает, что наши новые значения из `panda.yaml` были развёрнуты в кластере.

Теперь, если что-то пошло не так во время релиза, легко откатиться к предыдущему релизу с помощью `helm rollback [RELEASE] [REVISION]`.

```console
$ helm rollback happy-panda 1
```

Команда выше откатывает happy-panda к самой первой версии релиза. Версия релиза — это инкрементная ревизия. Каждый раз при установке, обновлении или откате номер ревизии увеличивается на 1. Первый номер ревизии всегда 1. Мы можем использовать `helm history [RELEASE]`, чтобы увидеть номера ревизий для определённого релиза.

## Полезные опции для установки/обновления/отката

Существует несколько других полезных параметров, которые вы можете указать для настройки поведения Helm во время установки/обновления/отката. Обратите внимание, что это не полный список флагов CLI. Чтобы увидеть описание всех флагов, просто выполните `helm <command> --help`.

- `--timeout`: значение [Go duration](https://golang.org/pkg/time/#ParseDuration), определяющее время ожидания завершения команд Kubernetes. По умолчанию `5m0s`.
- `--wait`: ожидает, пока все Pod не перейдут в состояние готовности, PVC не будут привязаны, Deployment не будут иметь минимум (`Desired` минус `maxUnavailable`) Pod в состоянии готовности, а Service не получат IP-адрес (и Ingress при наличии `LoadBalancer`), прежде чем пометить релиз как успешный. Ожидание продолжается в течение времени, указанного в `--timeout`. Если таймаут достигнут, релиз будет помечен как `FAILED`. Примечание: в сценариях, где у Deployment значение `replicas` равно 1, а `maxUnavailable` не установлен в 0 как часть стратегии rolling update, `--wait` вернёт готовность, как только будет удовлетворено условие минимального количества Pod в состоянии готовности.
- `--no-hooks`: пропускает выполнение хуков для команды.
- `--recreate-pods` (доступно только для `upgrade` и `rollback`): этот флаг приведёт к пересозданию всех Pod (за исключением Pod, принадлежащих Deployment). (УСТАРЕЛО в Helm 3)

## 'helm uninstall': Удаление релиза

Когда потребуется удалить релиз из кластера, используйте команду `helm uninstall`:

```console
$ helm uninstall happy-panda
```

Это удалит релиз из кластера. Вы можете просмотреть все ваши текущие развёрнутые релизы с помощью команды `helm list`:

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

Из вывода выше видно, что релиз `happy-panda` был удалён.

В предыдущих версиях Helm при удалении релиза запись о его удалении сохранялась. В Helm 3 удаление также удаляет запись о релизе. Если вы хотите сохранить запись об удалении релиза, используйте `helm uninstall --keep-history`. Команда `helm list --uninstalled` покажет только те релизы, которые были удалены с флагом `--keep-history`.

Флаг `helm list --all` покажет вам все записи о релизах, которые сохранил Helm, включая записи о неудачных или удалённых элементах (если был указан `--keep-history`):

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

Обратите внимание, что поскольку релизы теперь удаляются по умолчанию, откат удалённого ресурса больше невозможен.

## 'helm repo': Работа с репозиториями

Helm 3 больше не поставляется с репозиторием чартов по умолчанию. Группа команд `helm repo` предоставляет команды для добавления, просмотра и удаления репозиториев.

Вы можете посмотреть, какие репозитории настроены, с помощью `helm repo list`:

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

Новые репозитории можно добавить с помощью `helm repo add [NAME] [URL]`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Поскольку репозитории чартов часто меняются, в любой момент вы можете убедиться, что ваш клиент Helm обновлён, выполнив `helm repo update`.

Репозитории можно удалить с помощью `helm repo remove`.

## Создание собственных чартов

[Руководство по разработке чартов](/topics/charts.md) объясняет, как создавать свои собственные чарты. Но вы можете быстро начать работу с помощью команды `helm create`:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Теперь у вас есть чарт в `./deis-workflow`. Вы можете редактировать его и создавать свои собственные шаблоны.

По мере редактирования чарта вы можете проверить его корректность с помощью `helm lint`.

Когда придёт время упаковать чарт для распространения, вы можете выполнить команду `helm package`:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

И этот чарт теперь можно легко установить с помощью `helm install`:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

Упакованные чарты могут быть загружены в репозитории чартов. Подробнее см. документацию по [репозиториям чартов Helm](/topics/chart_repository.md).

## Заключение

В этой главе рассмотрены основные способы использования клиента `helm`, включая поиск, установку, обновление и удаление. Также были рассмотрены полезные служебные команды, такие как `helm status`, `helm get` и `helm repo`.

Для получения дополнительной информации об этих командах обратитесь к встроенной справке Helm: `helm help`.

В [следующей главе](/howto/charts_tips_and_tricks.md) мы рассмотрим процесс разработки чартов.
