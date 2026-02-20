---
title: Установка Helm
description: Узнайте, как установить и начать работать с Helm.
sidebar_position: 2
---

В этом руководстве описывается, как установить CLI Helm. Helm можно установить из
исходного кода или из предварительно собранных бинарных файлов.

## Из проекта Helm

Проект Helm предоставляет два способа получения и установки Helm. Это
официальные методы получения релизов Helm. Помимо этого, сообщество Helm
предоставляет методы установки через различные менеджеры пакетов.
Установка с помощью этих методов описана ниже.

### Из бинарных релизов

Каждый [релиз](https://github.com/helm/helm/releases) Helm предоставляет бинарные
файлы для различных операционных систем. Эти бинарные версии можно загрузить и установить вручную.

1. Скачайте нужную вам [версию](https://github.com/helm/helm/releases)
2. Распакуйте её (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Найдите бинарный файл `helm` в распакованной директории и переместите его в нужное место (`mv linux-amd64/helm /usr/local/bin/helm`)

После этого вы сможете запустить клиент и [добавить репозиторий чартов stable](/intro/quickstart.md#initialize-a-helm-chart-repository):
`helm help`.

**Примечание:** Автоматические тесты Helm выполняются только для Linux AMD64 во время
сборок и релизов в GitHub Actions. Тестирование на других ОС является обязанностью
сообщества, использующего Helm на этих системах.

### Из скрипта

Helm теперь имеет скрипт установки, который автоматически загружает последнюю версию
Helm и [устанавливает её локально](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Вы можете скачать этот скрипт и затем выполнить его локально.
Он хорошо документирован, так что вы можете прочитать его и понять, что он делает, прежде чем запускать.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Да, вы можете выполнить `curl
https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash`, если
хотите рискнуть.

## Через менеджеры пакетов

Сообщество Helm предоставляет возможность установки Helm через
менеджеры пакетов операционной системы.
Они не поддерживаются проектом Helm и не считаются доверенными сторонними источниками.

### Используя Homebrew (macOS)

Участники сообщества Helm добавили формулу Helm в Homebrew.
Эта формула обычно актуальна.

```console
brew install helm
```

(Примечание: Существует также формула для emacs-helm — это другой проект.)

### Используя Chocolatey (Windows)

Участники сообщества Helm добавили [пакет Helm](https://chocolatey.org/packages/kubernetes-helm) в
[Chocolatey](https://chocolatey.org/). Этот пакет обычно актуален.

```console
choco install kubernetes-helm
```

### Используя Scoop (Windows)

Участники сообщества Helm добавили [пакет Helm](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json) в [Scoop](https://scoop.sh). Этот пакет обычно актуален.

```console
scoop install helm
```

### Используя Winget (Windows)

Участники сообщества Helm добавили [пакет Helm](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) в [Winget](https://learn.microsoft.com/en-us/windows/package-manager/). Этот пакет обычно актуален.

```console
winget install Helm.Helm
```

### Используя Apt (Debian/Ubuntu)

Участники сообщества Helm добавили пакет Apt для Debian/Ubuntu. Этот пакет обычно
актуален. Благодарим [Buildkite](https://buildkite.com/organizations/helm-linux/packages/registries/helm-debian) за хостинг репозитория.

```console
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Используя dnf/yum (Fedora)

Начиная с Fedora 35, Helm доступен в официальном репозитории.
Вы можете установить Helm, выполнив:

```console
sudo dnf install helm
```

### Используя Snap

Сообщество [Snapcrafters](https://github.com/snapcrafters) поддерживает Snap-версию
[пакета Helm](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

### Используя pkg (FreeBSD)

Участники сообщества FreeBSD добавили [пакет Helm](https://www.freshports.org/sysutils/helm) в
[FreeBSD Ports Collection](https://man.freebsd.org/ports).
Этот пакет обычно актуален.

```console
pkg install helm
```

### Сборки для разработчиков

Помимо релизов вы можете скачать или установить сборки для разработки Helm.

### Canary-сборки

Canary-сборки — это версии программного обеспечения Helm, собранные из последней
ветки `main`. Они не являются официальными релизами и могут быть нестабильными. Тем не менее,
они позволяют протестировать новейшие функции.

Бинарные файлы Canary Helm хранятся на `get.helm.sh`. Вот
ссылки на распространённые сборки:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### Из исходного кода (Linux, macOS)

Сборка Helm из исходного кода требует немного больше усилий, но это лучший способ, если
вы хотите протестировать последнюю (предрелизную) версию Helm.

У вас должна быть настроена рабочая среда Go.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

При необходимости скрипт загружает зависимости, кэширует их и проверяет
конфигурацию. Затем он скомпилирует `helm` и поместит его в `bin/helm`.

## Заключение

В большинстве случаев установка сводится к получению предварительно собранного бинарного файла `helm`.
В этом документе описаны дополнительные варианты для тех, кто хочет делать
с Helm более сложные вещи.

После успешной установки клиента Helm вы можете перейти к использованию
Helm для управления чартами и [добавить репозиторий чартов stable](/intro/quickstart.md#initialize-a-helm-chart-repository).
