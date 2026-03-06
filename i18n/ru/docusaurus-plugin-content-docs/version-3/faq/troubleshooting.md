---
title: Решение проблем
sidebar_position: 4
---

## Решение проблем

### Я получаю предупреждение «Unable to get an update from the "stable" chart repository»

Выполните `helm repo list`. Если вы видите, что ваш репозиторий `stable` указывает на URL `storage.googleapis.com`, вам необходимо обновить этот репозиторий. 13 ноября 2020 года репозиторий Helm Charts [прекратил поддержку](https://github.com/helm/charts#deprecation-timeline) после годового периода устаревания. Архив доступен по адресу `https://charts.helm.sh/stable`, но больше не будет получать обновления.

Вы можете выполнить следующую команду для исправления репозитория:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

То же самое относится к репозиторию `incubator`, архив которого доступен по адресу https://charts.helm.sh/incubator. Вы можете выполнить следующую команду для его исправления:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Я получаю предупреждение 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

Старый репозиторий чартов Google Helm был заменён новым репозиторием чартов Helm.

Выполните следующую команду для окончательного решения этой проблемы:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Если вы получаете аналогичную ошибку для `incubator`, выполните эту команду:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### При добавлении репозитория Helm я получаю ошибку 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Репозитории Helm Charts больше не поддерживаются после [годового периода устаревания](https://github.com/helm/charts#deprecation-timeline). Архивы этих репозиториев доступны по адресам `https://charts.helm.sh/stable` и `https://charts.helm.sh/incubator`, однако они больше не будут получать обновления. Команда `helm repo add` не позволит вам добавить старые URL, если вы не укажете `--use-deprecated-repos`.

### В GKE (Google Container Engine) я получаю ошибку «No SSH tunnels currently open»

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Другой вариант сообщения об ошибке:

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

Проблема в том, что ваш локальный файл конфигурации Kubernetes должен содержать корректные учётные данные.

При создании кластера в GKE вы получаете учётные данные, включая SSL-сертификаты и центры сертификации. Они должны храниться в файле конфигурации Kubernetes (по умолчанию: `~/.kube/config`), чтобы `kubectl` и `helm` могли получить к ним доступ.

### После миграции с Helm 2 команда `helm list` показывает только часть (или ни одного) моих релизов

Скорее всего, вы упустили тот факт, что Helm 3 теперь использует пространства имён кластера для определения области видимости релизов. Это означает, что для всех команд, обращающихся к релизу, вы должны либо:

* полагаться на текущее пространство имён в активном контексте Kubernetes (как показывает команда `kubectl config view --minify`),
* указать корректное пространство имён с помощью флага `--namespace`/`-n`, или
* для команды `helm list` указать флаг `--all-namespaces`/`-A`

Это относится к `helm ls`, `helm uninstall` и всем другим командам `helm`, которые обращаются к релизу.


### В macOS происходит обращение к файлу `/etc/.mdns_debug`. Почему?

Нам известен случай в macOS, когда Helm пытается получить доступ к файлу `/etc/.mdns_debug`. Если файл существует, Helm удерживает дескриптор файла открытым во время выполнения.

Это вызвано библиотекой MDNS в macOS. Она пытается загрузить этот файл для чтения настроек отладки (если они включены). Дескриптор файла, вероятно, не должен удерживаться открытым, и об этой проблеме сообщено в Apple. Однако это поведение вызвано macOS, а не Helm.

Если вы не хотите, чтобы Helm загружал этот файл, вы можете скомпилировать Helm как статическую библиотеку, которая не использует сетевой стек хоста. Это увеличит размер бинарного файла Helm, но предотвратит открытие файла.

Изначально эта проблема была отмечена как потенциальная уязвимость безопасности. Однако позже было установлено, что данное поведение не вызывает никаких уязвимостей или недостатков.

### helm repo add завершается ошибкой, хотя раньше работал

В Helm 3.3.1 и более ранних версиях команда `helm repo add <reponame> <url>` не выдавала никакого вывода при попытке добавить уже существующий репозиторий. Флаг `--no-update` вызывал ошибку, если репозиторий уже был зарегистрирован.

В Helm 3.3.2 и более поздних версиях попытка добавить существующий репозиторий вызовет ошибку:

`Error: repository name (reponame) already exists, please specify a different name`

Поведение по умолчанию теперь изменено на противоположное. Флаг `--no-update` теперь игнорируется, а если вы хотите заменить (перезаписать) существующий репозиторий, используйте `--force-update`.

Это связано с критическим изменением для исправления уязвимости безопасности, как описано в [примечаниях к релизу Helm 3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2).

### Включение логирования клиента Kubernetes

Вывод логов для отладки клиента Kubernetes можно включить с помощью флагов [klog](https://pkg.go.dev/k8s.io/klog). Использование флага `-v` для установки уровня подробности будет достаточно в большинстве случаев.

Например:

```
helm list -v 6
```

### Установка Tiller перестала работать, и доступ запрещён

Релизы Helm раньше были доступны по адресу <https://storage.googleapis.com/kubernetes-helm/>. Как описано в публикации [«Announcing get.helm.sh»](https://helm.sh/blog/get-helm-sh/), официальное расположение изменилось в июне 2019 года. [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) предоставляет все старые образы Tiller.

Если вы пытаетесь загрузить старые версии Helm из бакета хранилища, который использовали ранее, вы можете обнаружить, что они отсутствуют:

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

[Устаревшее расположение образов Tiller](https://gcr.io/kubernetes-helm/tiller) начало удаление образов в августе 2021 года. Мы сделали эти образы доступными в [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller). Например, чтобы загрузить версию v2.17.0, замените:

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

на:

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Для инициализации с Helm v2.17.0:

`helm init —upgrade`

Или, если нужна другая версия, используйте флаг --tiller-image для переопределения расположения по умолчанию и установки определённой версии Helm v2:

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**Примечание:** Мейнтейнеры Helm рекомендуют миграцию на текущую поддерживаемую версию Helm. Helm v2.17.0 был последним релизом Helm v2; Helm v2 не поддерживается с ноября 2020 года, как указано в публикации [Helm 2 and the Charts Project Are Now Unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/). С тех пор было обнаружено множество CVE для Helm, и эти уязвимости исправлены в Helm v3, но никогда не будут исправлены в Helm v2. Ознакомьтесь с [текущим списком опубликованных рекомендаций по безопасности Helm](https://github.com/helm/helm/security/advisories?state=published) и составьте план [миграции на Helm v3](/topics/v2_v3_migration.md) уже сегодня.
