---
title: "Усунення несправностей"
weight: 4
---

## Усунення несправностей {#troubleshooting}

### Я отримую попередження про "Не вдалося отримати оновлення з репозиторію чартів 'stable'" {#i-am-getting-a-warning-about-unable-to-get-an-update-from-the-stable-chart-repository}

Запустіть `helm repo list`. Якщо він показує ваш репозиторій `stable`, який вказує на URL `storage.googleapis.com`, вам потрібно оновити цей репозиторій. 13 листопада 2020 року репозиторій Helm Charts [перестав підтримуватися](https://github.com/helm/charts#deprecation-timeline) після річного періоду відмови від обслуговування. Архів доступний за адресою `https://charts.helm.sh/stable`, але більше не отримуватиме оновлень.

Ви можете виконати наступну команду для виправлення репозиторію:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update
```

Те ж саме стосується репозиторію `incubator`, для якого є архів за адресою https://charts.helm.sh/incubator. Ви можете виконати наступну команду для його відновлення:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update
```

### Я отримую попередження 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.' {#i-am-getting-the-warning-warning-kubernetes-chartsstoragegoogleapiscom-is-deprecated-for-stable-and-will-be-deleted-nov-13-2020}

Старий репозиторій чартів Google було замінено новим репозиторієм Helm чартів.

Запустіть наступну команду для остаточного виправлення цього:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update
```

Якщо ви отримуєте подібну помилку для `incubator`, виконайте цю команду:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update
```

### Коли я додаю репозиторій Helm, я отримую помилку 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available' {#when-i-add-a-helm-repo-i-get-the-error-error-repo-httpskubernetes-chartsstoragegoogleapiscom-is-no-longer-available}

Репозиторії чартів Helm більше не підтримуються після [річного періоду відмови від обслуговування](https://github.com/helm/charts#deprecation-timeline). Архіви цих репозиторіїв доступні за адресами `https://charts.helm.sh/stable` та `https://charts.helm.sh/incubator`, але більше не отримуватимуть оновлень. Команда `helm repo add` не дозволяє додати старі URL-адреси, якщо не вказати `--use-deprecated-repos`.

### На GKE (Google Container Engine) я отримую "No SSH tunnels currently open" {#on-gke-google-container-engine-i-get-no-ssh-tunnels-currently-open}

```none
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Ще одна версія повідомлення про помилку:

```none
Unable to connect to the server: x509: certificate signed by unknown authority
```

Проблема в тому, що ваш локальний файл конфігурації Kubernetes повинен містити правильні облікові дані.

Коли ви створюєте кластер на GKE, він надає вам облікові дані, включаючи SSL сертифікати та центри сертифікації. Їх потрібно зберігати у файлі конфігурації Kubernetes (стандартно: `~/.kube/config`), щоб `kubectl` та `helm` могли їх використовувати.

### Після міграції з Helm 2 команда `helm list` показує лише деякі (або жодного) мої релізи {#after-migration-from-helm-2-helm-list-shows-only-some-or-none-of-my-releases}

Можливо, ви пропустили те, що Helm 3 тепер використовує простори імен кластера для визначення релізів. Це означає, що для всіх команд, що посилаються на реліз, ви повинні або:

* покластися на поточний простір імен в активному контексті kubernetes (як описано командою `kubectl config view --minify`),
* вказати правильний простір імен, використовуючи прапорець `--namespace`/`-n`, або
* для команди `helm list`, вказати прапорець `--all-namespaces`/`-A`.

Це стосується `helm ls`, `helm uninstall` та всіх інших команд `helm`, що посилаються на реліз.

### На macOS звертається до файлу `/etc/.mdns_debug`. Чому? {#on-macos-the-file-etcmdns_debug-is-accessed-why}

Ми знаємо про випадок на macOS, коли Helm намагається звернутися до файлу з назвою `/etc/.mdns_debug`. Якщо файл існує, Helm тримає дескриптор файлу відкритим під час виконання.

Це викликано бібліотекою MDNS macOS. Вона намагається завантажити цей файл для читання налаштувань відладки (якщо увімкнено). Дескриптор файлу, ймовірно, не повинен залишатися відкритим, і ця проблема була передана Apple. Однак це macOS, а не Helm, викликає цю поведінку.

Якщо ви не хочете, щоб Helm завантажував цей файл, ви можете спробувати скомпілювати Helm як статичну бібліотеку, яка не використовує стек мережі хосту. Це збільшить розмір бінарного файлу Helm, але завадить відкриттю файлу.

Цю проблему спочатку було позначено як потенційну проблему безпеки. Але з того часу було визначено, що ця поведінка не має жодних недоліків або вразливостей.

### helm repo add не вдається, хоча раніше працювало {#helm-repo-add-fails-when-it-used-to-work}

У helm 3.3.1 та раніше команда `helm repo add <reponame> <url>` не видає жодного виходу, якщо ви намагаєтеся додати репозиторій, який вже існує. Прапорець `--no-update` викликав помилку, якщо репозиторій вже був зареєстрований.

У helm 3.3.2 та пізніших версіях спроба додати наявний репозиторій викличе помилку:

`Error: repository name (reponame) already exists, please specify a different name`

Тепер стандартна поведінка змінилася. Прапорець `--no-update` тепер ігнорується, а якщо ви хочете замінити (перезаписати) наявний репозиторій, ви можете використовувати `--force-update`.

Це повʼязано з переломною зміною для виправлення проблеми безпеки, як пояснено в [замітках про реліз Helm 3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2).

### Увімкнення ведення логів клієнта Kubernetes {#enabling-kubernetes-client-logging}

Друк повідомлень логу для відладки клієнта Kubernetes можна увімкнути за допомогою прапорців [klog](https://pkg.go.dev/k8s.io/klog). Використання прапорця `-v` для налаштування рівня деталізації буде достатнім для більшості випадків.

Наприклад:

```shell
helm list -v 6
```

### Встановлення Tiller припинило працювати і доступ заборонено {#installing-tiller-stopped-working-and-access-is-denied}

Релізи Helm раніше були доступні за адресою <https://storage.googleapis.com/kubernetes-helm/>. Як пояснюється в ["Announcing get.helm.sh"](https://helm.sh/blog/get-helm-sh/), офіційне місце розташування змінилося у червні 2019 року. [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) робить всі старі образи Tiller доступними.

Якщо ви намагаєтеся завантажити старі версії Helm з кошику зберігання, який ви використовували раніше, ви можете виявити, що вони відсутні:

```none
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

[Місце розташування старих образів Tiller](https://gcr.io/kubernetes-helm/tiller) розпочало видалення образів у серпні 2021 року. Ми зробили ці образи доступними за адресою [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller). Наприклад, щоб завантажити версію v2.17.0, замініть:

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

на:

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Щоб ініціалізувати Helm v2.17.0:

`helm init —upgrade`

Або, якщо потрібна інша версія, використовуйте прапорець `--tiller-image`, щоб перевизначити стандартне місце розташування та встановити конкретну версію Helm v2:

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**Примітка:** Розробники Helm рекомендують міграцію на підтримувану версію Helm. Helm v2.17.0 був останнім випуском Helm v2; Helm v2 більше не підтримується з листопада 2020 року, як детально описано в [Helm 2 та проєкт Charts більше не підтримуються](https://helm.sh/blog/helm-2-becomes-unsupported/). Багато CVE було виявлено в Helm з того часу, і ці експлойти виправлені в Helm v3, але ніколи не будуть виправлені в Helm v2. Перегляньте [актуальний список опублікованих сповіщень Helm](https://github.com/helm/helm/security/advisories?state=published) і складіть план [міграції на Helm v3](https://helm.sh/docs/topics/v2_v3_migration/#helm) сьогодні.
