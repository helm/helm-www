---
title: "Репозиторій чартів"
description: "Як створити та працювати з репозиторіями чартів Helm."
weight: 6
---

Цей розділ пояснює, як створювати та працювати з репозиторіями чартів Helm. На високому рівні, репозиторій чартів — це місце, де можуть зберігатися та розповсюджуватися упаковані чарти.

Розподілений репозиторій спільноти чартів Helm знаходиться на [Artifact Hub](https://artifacthub.io/packages/search?kind=0) та запрошує вас долучитися. Однак Helm також дозволяє вам створювати власні репозиторії чартів. Цей посібник пояснює, як це зробити.

### Передумови {#prerequisites}

- Пройдіть [Керівництво з швидкого старту]({{< ref "quickstart.md" >}})
- Ознайомтеся з документом [Чарти]({{< ref "/docs/topics/charts.md" >}})

### Створення репозиторію чартів {#create-a-chart-repository}

_Репозиторій чартів_ — це HTTP-сервер, який містить файл `index.yaml` і, за бажанням, деякі упаковані чарти. Коли ви готові поділитися своїми чартами, найкращий спосіб зробити це — завантажити їх до репозиторію чартів.

З версії Helm 2.2.0 підтримується SSL-автентифікація клієнта для репозиторіїв. Інші протоколи автентифікації можуть бути доступні як втулки.

Оскільки репозиторій чартів може бути будь-яким HTTP-сервером, який може обслуговувати YAML і tar файли та відповідати на GET-запити, у вас є безліч варіантів для хостингу власного репозиторію чартів. Наприклад, ви можете використовувати Google Cloud Storage (GCS), Amazon S3, GitHub Pages або навіть розгорнути власний вебсервер.

### Структура репозиторію чартів {#the-chart-repository-structure}

Репозиторій чартів складається з упакованих чартів і спеціального файлу з назвою `index.yaml`, який містить індекс усіх чартів у репозиторії. Зазвичай чарти, описані в `index.yaml`, також розміщуються на тому ж сервері, як і [файли походження]({{< ref "provenance.md" >}}).

Наприклад, структура репозиторію `https://example.com/charts` може виглядати так:

```none
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

У цьому випадку файл індексу міститиме інформацію про один чарт, Alpine, і надаватиме URL для завантаження `https://example.com/charts/alpine-0.1.2.tgz` для цього чарту.

Не обовʼязково, щоб пакет чарту розміщувався на тому ж сервері, що й файл `index.yaml`. Однак, це часто є найпростішим варіантом.

### Файл індексу {#the-index-file}

Файл індексу — це YAML-файл з назвою `index.yaml`. Він містить деякі метадані про пакети, включаючи вміст файлу `Chart.yaml` чарту. Дійсний репозиторій чартів повинен мати файл індексу. Файл індексу містить інформацію про кожен чарт у репозиторії чартів. Команда `helm repo index` створить файл індексу на основі заданої локальної теки, яка містить упаковані чарти.

Приклад файлу індексу:

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## Хостинг репозиторіїв чартів {#hosting-chart-repositories}

У цьому розділі показано кілька способів хостингу репозиторію чартів.

### Google Cloud Storage (GCS)

Першим кроком є **створення кошика GCS**. Назвемо його `fantastic-charts`.

![Створення кошика GCS](https://helm.sh/img/create-a-bucket.png)

Далі, зробіть свій кошик публічним, **редагувавши дозволи кошику**.

![Редагування дозволів](https://helm.sh/img/edit-permissions.png)

Додайте цей пункт, щоб **зробити кошик публічним**:

![Зробити кошик публічним](https://helm.sh/img/make-bucket-public.png)

Вітаємо, тепер у вас є порожній кошик GCS, готовий для обслуговування чартів!

Ви можете завантажити свій репозиторій чартів за допомогою командного рядка Google Cloud Storage або через вебінтерфейс GCS. Доступ до публічного кошика GCS можна отримати через простий HTTPS за цією адресою: `https://bucket-name.storage.googleapis.com/`.

### Cloudsmith {#cloudsmith}

Ви також можете налаштувати репозиторії чартів за допомогою Cloudsmith. Дізнайтеся більше про репозиторії чартів з Cloudsmith [тут](https://help.cloudsmith.io/docs/helm-chart-repository).

### JFrog Artifactory {#jfrog-artifactory}

Аналогічно, ви можете налаштувати репозиторії чартів за допомогою JFrog Artifactory. Дізнайтеся більше про репозиторії чартів з JFrog Artifactory [тут](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories).

### Приклад GitHub Pages {#github-pages-example}

Подібним чином ви можете створити репозиторій чартів за допомогою GitHub Pages.

GitHub дозволяє обслуговувати статичні вебсторінки двома різними способами:

- Налаштувавши проєкт на обслуговування вмісту його теки `docs/`
- Налаштувавши проєкт на обслуговування певної гілки

Ми скористаємося другим підходом, хоча перший також простий.

Перший крок — **створити гілку gh-pages**. Ви можете зробити це локально:

```console
$ git checkout -b gh-pages
```

Або через веббраузер, використовуючи кнопку **Branch** у вашому репозиторії GitHub:

![Створення гілки GitHub Pages](https://helm.sh/img/create-a-gh-page-button.png)

Далі потрібно переконатися, що ваша **гілка gh-pages** налаштована як GitHub Pages. Для цього натисніть у вашому репо кнопку **Settings** і прокрутіть до розділу **GitHub pages** і налаштуйте його, як показано нижче:

![Налаштування гілки GitHub Pages](https://helm.sh/img/set-a-gh-page.png)

Стандартно **Source** зазвичай встановлюється на **gh-pages branch**. Якщо це не встановлено, виберіть його.

Ви можете використовувати **власний домен**, якщо бажаєте.

І переконайтеся, що **Enforce HTTPS** відмічено, щоб **HTTPS** використовувався під час обслуговування чартів.

У такому налаштуванні ви можете використовувати основну гілку для зберігання коду чартів, а **гілку gh-pages** як репозиторій чартів, наприклад: `https://USERNAME.github.io/REPONAME`. Демонстраційний репозиторій [TS Charts](https://github.com/technosophos/tscharts) доступний за адресою `https://technosophos.github.io/tscharts/`.

Якщо ви вирішили використовувати GitHub Pages для хостингу репозиторію чартів, ознайомтеся з [Chart Releaser Action]({{< ref "/docs/howto/chart_releaser_action.md" >}}). Chart Releaser Action — це робочий процес GitHub Action, який перетворює проєкт GitHub у репозиторій чартів Helm, використовуючи CLI-інструмент [helm/chart-releaser](https://github.com/helm/chart-releaser).

### Звичайні вебсервери {#ordinary-web-servers}

Щоб налаштувати звичайний вебсервер для обслуговування чартів Helm, вам просто потрібно зробити наступне:

- Помістіть ваш індекс і чарти в теку, яку сервер може обслуговувати
- Переконайтеся, що файл `index.yaml` доступний без необхідності автентифікації
- Переконайтеся, що файли `yaml` обслуговуються з правильним типом вмісту (`text/yaml` або `text/x-yaml`)

Наприклад, якщо ви хочете обслуговувати свої чарти з теки `$WEBROOT/charts`, переконайтеся, що у вашому вебкорені є тека `charts/`, і помістіть туди файл індексу та чарти.

### Сервер репозиторію ChartMuseum {#chartmuseum-repository-server}

ChartMuseum — це сервер репозиторію чартів Helm з відкритим кодом, написаний на Go (Golang), з підтримкою хмарних сховищ, включаючи [Google Cloud Storage](https://cloud.google.com/storage/), [Amazon S3](https://aws.amazon.com/s3/), [Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/), [Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss), [Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/), [Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage), [Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html), [Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/), [Minio](https://min.io/) та [etcd](https://etcd.io/).

Ви також можете використовувати сервер [ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) для хостингу репозиторію чартів з локальної файлової системи.

### Реєстр пакетів GitLab {#gitlab-package-registry}

З GitLab ви можете публікувати чарти Helm у реєстрі пакетів вашого проєкту. Дізнайтеся більше про налаштування репозиторію пакетів Helm за допомогою GitLab [тут](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Управління репозиторіями чартів {#managing-chart-repositories}

Тепер, коли у вас є репозиторій чартів, остання частина цього посібника пояснює, як підтримувати чарти в цьому репозиторії.

### Зберігання чартів у вашому репозиторії чартів {#storing-charts-in-your-chart-repository}

Тепер, коли у вас є репозиторій чартів, завантажимо чарти та файл індексу до репозиторію. Чарти в репозиторії мають бути запаковані (`helm package chart-name/`) та правильно версійовані (відповідно до рекомендацій [SemVer 2](https://semver.org/)).

Наступні кроки складають приклад робочого процесу, але ви можете використовувати будь-який зручний вам процес для зберігання та оновлення чартів у вашому репозиторії.

Як тільки у вас є готовий запакований чарт, створіть нову теку і перемістіть туди ваш запакований чарт.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

Остання команда бере шлях до щойно створеної локальної теки та URL вашого віддаленого репозиторію чартів і створює файл `index.yaml` у вказаній теці.

Тепер ви можете завантажити чарт і файл індексу у ваш репозиторій чартів, використовуючи інструмент синхронізації або вручну. Якщо ви використовуєте Google Cloud Storage, ознайомтеся з цим [прикладом робочого процесу]({{< ref "/docs/howto/chart_repository_sync_example.md" >}}), що використовує клієнт gsutil. Для GitHub ви можете просто помістити чарти у відповідну гілку призначення.

### Додавання нових чартів до наявного репозиторію {#adding-new-charts-to-an-existing-repository}

Щоразу, коли ви хочете додати новий чарт у ваш репозиторій, потрібно перестворити індекс. Команда `helm repo index` повністю перебудовує файл `index.yaml` з нуля, включаючи лише ті чарти, які вона знаходить локально.

Однак, ви можете використовувати прапорець `--merge` для поступового додавання нових чартів до наявного файлу `index.yaml` (чудовий варіант під час роботи з віддаленим репозиторієм, як-от GCS). Виконайте команду `helm repo index --help`, щоб дізнатися більше.

Переконайтеся, що ви завантажили як оновлений файл `index.yaml`, так і чарт. Якщо ви згенерували файл підтвердження цілісності, завантажте і його.

### Поділитися чартами з іншими {#share-your-charts-with-others}

Коли ви готові поділитися чартами, просто повідомте комусь URL вашого репозиторію.

Після цього вони додадуть репозиторій до свого клієнта helm через команду `helm repo add [NAME] [URL]` з будь-яким імʼям, яке вони хочуть використовувати для позначення репозиторію.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Якщо чарти захищені за допомогою базової автентифікації HTTP, ви також можете вказати імʼя користувача та пароль тут:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Примітка:** Репозиторій не буде додано, якщо він не містить дійсний файл `index.yaml`.

**Примітка:** Якщо ваш репозиторій helm, наприклад, використовує самопідписний сертифікат, ви можете використовувати `helm repo add --insecure-skip-tls-verify ...`, щоб пропустити перевірку CA.

Після цього ваші користувачі зможуть шукати серед ваших чартів. Після того, як ви оновите репозиторій, вони можуть використовувати команду `helm repo update`, щоб отримати найновішу інформацію про чарт.

_Під капотом команди `helm repo add` і `helm repo update` завантажують файл index.yaml і зберігають його в теці `$XDG_CACHE_HOME/helm/repository/cache/`. Саме тут функція `helm search` знаходить інформацію про чарти._
