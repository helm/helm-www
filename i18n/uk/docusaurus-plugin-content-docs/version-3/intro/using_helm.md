---
title: Використання Helm
description: Описує основи роботи з Helm.
sidebar_position: 3
---

Цей посібник пояснює основи використання Helm для керування пакетами у вашому кластері Kubernetes. Передбачається, що ви вже [встановили](/intro/install.md) клієнт Helm.

Якщо вас цікавить лише виконання кількох швидких команд, можливо, ви захочете почати з [Посібника зі швидкого старту](/intro/quickstart.md). У цьому розділі розглядаються особливості команд Helm та пояснюється, як використовувати Helm.

## Три головні концепції {#three-big-concepts}

*Chart* — це пакет Helm. Він містить усі необхідні визначення ресурсів для запуску застосунку, інструменту або сервісу всередині кластера Kubernetes. Думайте про це як про еквівалент формули Homebrew, пакету Apt dpkg або файлу Yum RPM для Kubernetes.

*Repository* — це місце, де можна зібрати та поділитися чартами. Це як [архів CPAN](https://www.cpan.org) для Perl або [база пакетів Fedora](https://src.fedoraproject.org/), але для пакетів Kubernetes.

*Release* — це екземпляр чарту, що працює в кластері Kubernetes. Один чарт можна встановити в кластер кілька разів. І кожного разу при встановленні створюється новий *реліз*. Наприклад, чарт MySQL. Якщо ви хочете, щоб у вашому кластері працювали дві бази даних, ви можете встановити цей чарт двічі. Кожен екземпляр матиме свій *реліз*, а також своє *імʼя релізу*.

Маючи ці концепції на увазі, можна пояснити Helm так:

Helm встановлює *чарти* у Kubernetes, створюючи новий *реліз* для кожного встановлення. А щоб знайти нові чарти, ви можете шукати їх у *репозиторіях чартів* Helm.

## 'helm search': Пошук чартів {#helm-search-finding-charts}

Helm постачається з потужною командою пошуку. Її можна використовувати для пошуку двох типів джерел:

- `helm search hub` здійснює пошук у [Artifact Hub](https://artifacthub.io), який містить чарти helm із десятків різних репозиторіїв.
- `helm search repo` здійснює пошук у репозиторіях, які ви додали до свого локального клієнта helm (за допомогою `helm repo add`). Цей пошук здійснюється за локальними даними, і підключення до публічної мережі не потрібно.

Ви можете знайти загальнодоступні чарти, виконавши команду `helm search hub`:

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Платформа для веб-публікацій для створення блогів і ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Чарт Helm для розгортання сайту WordPress на ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      Оператор WordPress для Helm
```

Вищенаведений пошук знаходить усі чарти `wordpress` в Artifact Hub.

Без фільтрації `helm search hub` показує всі доступні чарти.

`helm search hub` показує URL-адресу розташування на [artifacthub.io](https://artifacthub.io/), але не власне репозиторій Helm. `helm search hub --list-repo-url` показує фактичну URL-адресу репозиторію Helm, що може бути корисним, коли ви хочете додати новий репозиторій: `helm repo add [NAME] [URL]`.

За допомогою `helm search repo` ви можете знайти імена чартів у репозиторіях, які ви вже додали:

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

Helm search використовує алгоритм нечіткого порівняння рядків, тому можна вводити частини слів або фраз:

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Пошук — це чудовий спосіб знайти доступні пакети. Коли ви знайшли потрібний пакет, можете використовувати `helm install`, щоб встановити його.

## 'helm install': Встановлення пакета {#helm-install-installing-a-package}

Щоб встановити новий пакет, скористайтеся командою `helm install`. У найпростішому випадку вона приймає два аргументи: Імʼя релізу, яке ви вибираєте, та імʼя чарту, який ви хочете встановити.

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Вт Січ 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Будь ласка, будьте терплячими, поки чарт розгортається **

Ваш сайт WordPress можна відкрити за наступною DNS-адресою зсередини вашого кластера:

    happy-panda-wordpress.default.svc.cluster.local (порт 80)

Щоб отримати доступ до вашого сайту WordPress з-за меж кластера, дотримуйтесь наступних кроків:

1. Отримайте URL WordPress, виконавши наступні команди:

  ПРИМІТКА: Може знадобитися кілька хвилин для отримання IP-адреси LoadBalancer.
        Слідкуйте за статусом за допомогою: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "URL WordPress: http://$SERVICE_IP/"
   echo "Адмінка WordPress: http://$SERVICE_IP/admin"

2. Відкрийте оглядач та отримайте доступ до WordPress, використовуючи отриманий URL.

3. Увійдіть за допомогою наступних облікових даних:

  echo Логін: user
  echo Пароль: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Тепер чарт `wordpress` встановлено. Зверніть увагу, що встановлення чарту створює новий *реліз* обʼєкта. Реліз вище називається `happy-panda`. (Якщо ви хочете, щоб Helm згенерував імʼя для вас, не вказуйте імʼя релізу і використовуйте `--generate-name`.)

Під час встановлення клієнт `helm` надасть корисну інформацію про те, які ресурси були створені, який стан релізу, і чи є додаткові кроки конфігурації, які ви можете або повинні виконати.

Helm встановлює ресурси в наступному порядку:

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

Helm не чекає, поки всі ресурси будуть запущені, перш ніж завершити роботу. Багато чартів потребують Docker-образів розміром понад 600MB, і їхнє встановлення в кластер може тривати певний час.

Щоб відстежувати стан релізу або повторно прочитати конфігураційну інформацію, ви можете використати команду `helm status`:

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Будь ласка, будьте терплячими, поки чарт розгортається **

Ваш сайт WordPress можна відкрити за наступною DNS-адресою в межах вашого кластера:

    happy-panda-wordpress.default.svc.cluster.local (порт 80)

Щоб отримати доступ до вашого сайту WordPress ззовні кластера, виконайте наступні дії:

1. Отримайте URL WordPress, виконавши ці команди:

  ЗАУВАЖЕННЯ: Для появи IP LoadBalancer може знадобитися кілька хвилин.
        Слідкуйте за статусом за допомогою: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Відкрийте оглядач і перейдіть на WordPress, використовуючи отриманий URL.

3. Увійдіть за допомогою наведених нижче облікових даних, щоб побачити ваш блог:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Вищенаведене показує поточний стан вашого релізу.

### Налаштування чарту перед встановленням {#customizing-the-chart-before-installing}

Встановлення у спосіб, який ми розглянули, використовуватиме лише стандартні параметри конфігурації для цього чарту. У багатьох випадках вам захочеться налаштувати чарт для використання ваші налаштування.

Щоб побачити, які параметри можна налаштувати в чарті, використовуйте команду `helm show values`:

```console
$ helm show values bitnami/wordpress
## Параметри глобального Docker-образу
## Зверніть увагу, що це перевизначить параметри образу, включаючи залежності, налаштовані на використання глобального значення
## Наявні глобальні параметри Docker-образу: imageRegistry та imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass

## Версія образу Bitnami WordPress
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/
##
image:
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

Ви можете перевизначити будь-які з цих налаштувань у файлі у форматі YAML, а потім передати цей файл під час встановлення.

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

Вищенаведене створить стандартного користувача MariaDB з імʼям `user0` і надасть цьому користувачеві доступ до новоствореної бази даних `user0db`, але всі інші параметри цього чарту залишаться стандартними.

Існує два способи передати дані конфігурації під час встановлення:

- `--values` (або `-f`): Вказати YAML-файл із перевизначеннями. Їх можна вказувати кілька разів, причому файл, що стоїть праворуч, матиме пріоритет
- `--set`: Вказати перевизначення в командному рядку.

Якщо обидва варіанти використовуються, значення `--set` зливаються з `--values` з вищим пріоритетом. Перевизначення, зазначені за допомогою `--set`, зберігаються у Secret. Значення, що були встановлені через `--set`, можна переглянути для конкретного релізу за допомогою команди `helm get values <release-name>`. Значення, встановлені за допомогою `--set`, можна скинути, виконавши `helm upgrade` з параметром `--reset-values`.

#### Формат і обмеження параметра `--set` {#the-format-and-limitations-of-set}

Опція `--set` приймає нуль або більше пар імʼя/значення. У найпростішому випадку вона використовується так: `--set name=value`. Еквівалент у YAML виглядає так:

```yaml
name: value
```

Кілька значень розділяються символами `,`. Отже, `--set a=b,c=d` стає:

```yaml
a: b
c: d
```

Підтримуються складніші вирази. Наприклад, `--set outer.inner=value` перетворюється на наступне:

```yaml
outer:
  inner: value
```

Списки можна записати, включивши значення в `{` і `}`. Наприклад, `--set name={a, b, c}` перетворюється на:

```yaml
name:
  - a
  - b
  - c
```

Деякі пари імʼя/ключ можна встановити як `null` або як порожній масив `[]`. Наприклад, `--set name=[],a=null` перетворюється на:

```yaml
name: []
a: null
```

Починаючи з Helm 2.5.0, можна отримувати доступ до елементів списку, використовуючи синтаксис індексу масиву. Наприклад, `--set servers[0].port=80` стає:

```yaml
servers:
  - port: 80
```

Кілька значень можна встановити таким чином. Наприклад, рядок `--set servers[0].port=80,servers[0].host=example` перетворюється на:

```yaml
servers:
  - port: 80
    host: example
```

Іноді вам потрібно використовувати спеціальні символи у ваших рядках `--set`. Ви можете використовувати зворотний слеш для екранування символів; `--set name=value1\,value2` перетвориться на:

```yaml
name: "value1,value2"
```

Аналогічно, можна екранувати послідовності крапок, що може знадобитися, коли чарти використовують функцію `toYaml` для аналізу анотацій, міток і вибору вузлів. Синтаксис для `--set nodeSelector."kubernetes\.io/role"=master` виглядає так:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Глибоко вкладені структури даних можуть бути складними для виразу через `--set`. Розробникам чартів рекомендується враховувати використання `--set` при розробці формату файлу `values.yaml` (докладніше про [Файли значень](/chart_template_guide/values_files.md)).

### Інші методи встановлення {#more-installation-methods}

Команда `helm install` може встановлювати чарт із кількох джерел:

- Репозиторій чартів (як ми бачили вище)
- Локальний архів чарту (`helm install foo foo-0.1.1.tgz`)
- Тека із розпакованим чартом (`helm install foo path/to/foo`)
- Повний URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' і 'helm rollback': Оновлення релізу та відновлення у разі невдачі {#helm-upgrade-and-helm-rollback-updating-a-release-and-reverting-on-failure}

Коли виходить нова версія чарту або коли ви хочете змінити конфігурацію вашого релізу, ви можете скористатися командою `helm upgrade`.

Оновлення бере поточний реліз і оновлює його відповідно до інформації, що міститься в чарті. Ви можете оновити чарт, який було встановлено зі сховища, або чарт, який знаходиться на вашому локальному диску.

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

У наведеному випадку реліз `happy-panda` оновлюється з використанням того ж чарту, але з новим YAML файлом:

```yaml
mariadb.auth.username: user1
```

Ми можемо використати команду `helm get values`, щоб переконатися, що нові налаштування набрали чинності.

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

Команда `helm get` є корисним інструментом для перегляду релізу в кластері. І як ми бачили вище, вона показує, що наші нові значення з `panda.yaml` були розгорнуті в кластері.

Тепер, якщо під час релізу щось піде не так, можна легко повернутися до попереднього релізу, використовуючи команду `helm rollback [RELEASE] [REVISION]`.

```console
$ helm rollback happy-panda 1
```

Ця команда повертає наш реліз `happy-panda` до його першої версії. Версія релізу є інкрементним переглядом. Кожного разу, коли відбувається встановлення, оновлення або відкат, номер версії збільшується на 1. Перша версія завжди має номер 1. І ми можемо використовувати команду `helm history [RELEASE]`, щоб побачити номери версій для певного релізу.

## Корисні опції для Install/Upgrade/Rollback {#useful-options-for-install-upgrade-rollback}

Є кілька інших корисних опцій, які можна вказати для налаштування поведінки Helm під час встановлення/оновлення/відкату. Зауважте, що це не повний список CLI-прапорців. Щоб побачити опис усіх прапорців, просто запустіть `helm <command> --help`.

- `--timeout`: Значення [Go duration](https://golang.org/pkg/time/#ParseDuration), яке визначає, скільки чекати на завершення команд Kubernetes. Стандартно `5m0s`.
- `--wait`: Очікує, доки всі Podʼи не перейдуть у стан готовності, PVC не будуть повʼязані, а Deployment не матиме мінімальну кількість Podʼів у стані готовності (`Desired` мінус `maxUnavailable`), а також не отримає IP-адресу (і Ingress, якщо це `LoadBalancer`) перед тим, як визнати реліз успішним. Чекання триватиме стільки часу, скільки вказано в опції `--timeout`. Якщо тайм-аут досягнуто, реліз буде позначено як `FAILED`. Примітка: У ситуаціях, коли Deployment має `replicas` значення 1, а `maxUnavailable` не встановлено в 0 як частина стратегії rolling update, `--wait` поверне готовність, коли задоволено мінімальну кількість Podʼів у готовому стані.
- `--no-hooks`: Пропускає запуск хук для команди.
- `--recreate-pods` (доступно лише для `upgrade` та `rollback`): Цей прапорець викличе повторне створення всіх Podʼів (за винятком Podʼів, що належать до Deployment). (Застаріле в Helm 3)

## `helm uninstall`: Видалення релізу {#helm-uninstall-uninstalling-a-release}

Коли настає час видалити реліз з кластера, використовуйте команду `helm uninstall`:

```console
$ helm uninstall happy-panda
```

Це видалить реліз з кластера. Ви можете переглянути всі ваші поточні розгорнуті релізи за допомогою команди `helm list`:

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

З виводу вище ми можемо побачити, що реліз `happy-panda` було видалено.

У попередніх версіях Helm, коли реліз видалявся, запис про його видалення залишався. У Helm 3 видалення також видаляє запис про реліз. Якщо ви хочете зберегти запис про видалений реліз, використовуйте `helm uninstall --keep-history`. Використання `helm list --uninstalled` покаже лише ті релізи, які були видалені з прапорцем `--keep-history`.

Прапорець `helm list --all` покаже вам всі записи релізів, які зберіг Helm, включаючи записи для невдалих або видалених елементів (якщо було вказано `--keep-history`):

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

Зверніть увагу, що через те, що релізи тепер стандартно видаляються, більше неможливо зробити відкат до видаленого ресурсу.

## `helm repo`: Робота з репозиторіями {#helm-repo-working-with-repositories}

Helm 3 більше не постачається зі стандартним репозиторієм чартів. Група команд `helm repo` надає команди для додавання, перегляду та видалення репозиторіїв.

Ви можете переглянути, які репозиторії налаштовані, використовуючи `helm repo list`:

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

Нові репозиторії можна додати за допомогою `helm repo add [NAME] [URL]`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Оскільки репозиторії чартів часто змінюються, у будь-який момент ви можете переконатися, що ваш клієнт Helm актуальний, запустивши `helm repo update`.

Репозиторії можна видалити за допомогою `helm repo remove`.

## Створення власних чартів {#creating-your-own-charts}

[Посібник з розробки чартів](/topics/charts.md) пояснює, як розробляти власні чарти. Але ви можете швидко розпочати, використовуючи команду `helm create`:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Тепер у вас є чарт в теці `./deis-workflow`. Ви можете редагувати його та створювати власні шаблони.

Коли ви редагуєте свій чарт, ви можете перевірити, чи він добре сформований, запустивши команду `helm lint`.

Коли настане час упакувати чарт для розповсюдження, ви можете скористатися командою `helm package`:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

І цей чарт тепер може бути легко встановлена за допомогою `helm install`:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

Упаковані чарти можуть бути завантажені в репозиторії чартів. Для отримання додаткової інформації дивіться документацію про [репозиторії чартів Helm](/topics/chart_repository.md).

## Висновки {#conclusion}

У цьому розділі було розглянуто основні шаблони використання клієнта `helm`, включаючи пошук, встановлення, оновлення та видалення. Також було розглянуто корисні утиліти, такі як `helm status`, `helm get` і `helm repo`.

Для отримання додаткової інформації про ці команди перегляньте вбудовану довідку Helm: `helm help`.

У [наступному розділі](/howto/charts_tips_and_tricks.md) ми розглянемо процес створення чартів.
