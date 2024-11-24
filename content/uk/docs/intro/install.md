---
title: "Встановлення Helm"
description: "Дізнайтеся, як встановити та розпочати роботу з Helm."
weight: 2
---

Цей посібник показує, як встановити Helm CLI. Helm можна встановити або з джерела, або з попередньо зібраних бінарних релізів.

## Від проєкту Helm {#from-the-helm-project}

Проєкт Helm надає два способи отримання та встановлення Helm. Це офіційні методи отримання релізів Helm. Крім того, спільнота Helm пропонує методи встановлення Helm через різні менеджери пакетів. Встановлення через ці методи можна знайти нижче офіційних методів.

### З бінарних релізів {#from-the-binary-releases}

Кожен [реліз](https://github.com/helm/helm/releases) Helm надає бінарні релізи для різних операційних систем. Ці бінарні версії можна завантажити та встановити вручну.

1. Завантажте [бажану версію](https://github.com/helm/helm/releases)
2. Розпакуйте її (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Знайдіть бінарний файл `helm` у розпакованій директорії та перемістіть його в потрібне місце (`mv linux-amd64/helm /usr/local/bin/helm`)

Після цього ви повинні мати можливість запускати клієнт і [додати стабільний репозиторій](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository): `helm help`.

**Примітка:** Автоматизовані тести Helm виконуються лише для Linux AMD64 під час GitHub Actions збірок та релізів. Тестування інших операційних систем є відповідальністю спільноти, якій потрібен Helm для цієї операційної системи.

### Зі сценарію {#from-script}

Тепер Helm має скрипт інсталятора, який автоматично завантажує останню версію Helm і [встановлює її локально](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Ви можете завантажити цей скрипт, а потім виконати його локально. Він добре задокументований, щоб ви могли ознайомитися з ним і зрозуміти, що він робить перед його запуском.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Так, ви можете виконати `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash`, якщо хочете жити на межі.

## Через менеджери пакетів {#through-package-managers}

Спільнота Helm надає можливість встановити Helm через менеджери пакетів операційних систем. Ці методи не підтримуються проєктом Helm і не вважаються надійними третіми сторонами.

### Через Homebrew (macOS) {#from-homebrew-macos}

Члени спільноти Helm додали формулу Helm до Homebrew. Ця формула зазвичай оновлюється.

```console
brew install helm
```

(Примітка: Також існує формула для emacs-helm, яка є іншим проєктом.)

### Через Chocolatey (Windows) {#from-chocolatey-windows}

Члени спільноти Helm додали [пакет Helm](https://chocolatey.org/packages/kubernetes-helm) до [Chocolatey](https://chocolatey.org/). Цей пакет зазвичай оновлюється.

```console
choco install kubernetes-helm
```

### Через Scoop (Windows) {#from-scoop-windows}

Члени спільноти Helm додали [пакет Helm](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json) до [Scoop](https://scoop.sh). Цей пакет зазвичай оновлюється.

```console
scoop install helm
```

### Через Winget (Windows) {#from-winget-windows}

Члени спільноти Helm додали [пакет Helm](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) до [Winget](https://learn.microsoft.com/en-us/windows/package-manager/). Цей пакет зазвичай оновлюється.

```console
winget install Helm.Helm
```

### Через Apt (Debian/Ubuntu) {#from-apt-debian-ubuntu}

Члени спільноти Helm додали [пакет Helm](https://helm.baltorepo.com/stable/debian/) для Apt. Цей пакет зазвичай оновлюється.

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Через dnf/yum (fedora) {#from-dnf-yum-fedora}

Починаючи з Fedora 35, helm доступний в офіційному репозиторії. Ви можете встановити helm, виконавши:

```console
sudo dnf install helm
```

### Через Snap {#from-snap}

Спільнота [Snapcrafters](https://github.com/snapcrafters) підтримує версію Snap пакету [Helm](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

### Через pkg (FreeBSD) {#from-pkg-freebsd}

Члени спільноти FreeBSD додали [пакет Helm](https://www.freshports.org/sysutils/helm) до [Колекції портів FreeBSD](https://man.freebsd.org/ports). Цей пакет зазвичай оновлюється.

```console
pkg install helm
```

### Збірки для розробників {#development-builds}

Окрім релізів, ви можете завантажити або встановити розробницькі версії Helm.

### З Canary збірок {#from-canary-builds}

"Canary" збірки — це версії програмного забезпечення Helm, які створюються з останньої гілки `main`. Вони не є офіційними релізами та можуть бути нестабільними. Однак, вони надають можливість тестувати найновіші функції.

Canary бінарні файли Helm зберігаються на [get.helm.sh](https://get.helm.sh). Ось посилання на основні збірки:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Експериментальний Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### З сирців (Linux, macOS) {#from-source}

Збірка Helm з сирців є дещо більш трудомісткою, але це найкращий спосіб, якщо ви хочете тестувати найновішу (передрелізну) версію Helm.

У вас повинно бути налаштоване середовище Go.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

За необхідності, будуть завантажені залежності та збережені в кеші, а також перевірено конфігурацію. Після цього `helm` буде скомпільований і розміщений у `bin/helm`.

## Підсумки {#conclusion}

У більшості випадків, встановлення настільки просте, як отримання попередньо зібраного бінарного файлу `helm`. Цей документ охоплює додаткові випадки для тих, хто хоче робити складніші речі з Helm.

Після успішного встановлення клієнта Helm, ви можете перейти до використання Helm для керування чартами та [додавання стабільного репозиторію](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository).
