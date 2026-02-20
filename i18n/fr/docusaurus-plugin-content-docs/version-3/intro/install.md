---
title: Installation de Helm
description: Apprenez à installer Helm et à le prendre en main.
sidebar_position: 2
---

Ce guide vous explique comment installer la CLI (Interface de Ligne de Commande) Helm. Helm peut être installé soit à partir des sources, soit à partir des releases binaires pré-construites.

## Depuis le projet Helm

Le projet Helm propose deux méthodes pour récupérer et installer Helm. Il s'agit des méthodes officielles pour obtenir les releases de l'application. En plus de cela, la communauté Helm fournit des méthodes pour installer Helm via différents gestionnaires de packages. L'installation via ces méthodes peut être trouvée ci-dessous, après les méthodes officielles.

### À partir des releases binaires

Chaque [release](https://github.com/helm/helm/releases) de Helm fournit des binaires pour une variété de systèmes d'exploitation. Ces binaires peuvent être téléchargés manuellement et installés.

1. Téléchargez la [version souhaitée](https://github.com/helm/helm/releases)
2. Décompressez l'archive (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Trouvez le binaire `helm` dans le répertoire décompressé, et déplacez-le à l'emplacement souhaité (`mv linux-amd64/helm /usr/local/bin/helm`)

À ce stade, vous devriez être capable de lancer le client et [d'ajouter le dépôt stable](/intro/quickstart.md#initialize-a-helm-chart-repository) : `helm help`.

**Remarque :** Les tests automatisés de Helm sont effectués pour Linux AMD64 uniquement pendant les builds et releases GitHub Actions. Les tests d'autres systèmes d'exploitation sont sous la responsabilité de la communauté qui demande Helm pour le système d'exploitation en question.

### À partir du script

Helm dispose maintenant d'un script d'installation qui récupère automatiquement la dernière version de Helm et [l'installe localement](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Vous pouvez récupérer ce script, puis l'exécuter localement. Il est bien documenté, ce qui vous permet de le lire et comprendre ce qu'il fait avant de l'exécuter.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Oui, vous pouvez également exécuter `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` si vous aimez vivre dangereusement.

## Via les gestionnaires de packages

La communauté Helm offre la possibilité d'installer Helm via le gestionnaire de packages de votre système d'exploitation. Ceux-ci ne sont pas pris en charge par le projet Helm et ne sont pas considérés comme des tiers de confiance.

### Depuis Homebrew (macOS)

Les membres de la communauté Helm ont contribué à la création d'une formule Helm pour Homebrew. Cette formule est généralement à jour.

```console
brew install helm
```

(Note : il existe un projet différent possédant une formule pour emacs-helm.)

### Depuis Chocolatey (Windows)

Les membres de la communauté Helm ont contribué à la création d'un [package Helm](https://chocolatey.org/packages/kubernetes-helm) pour [Chocolatey](https://chocolatey.org/). Ce package est généralement à jour.

```console
choco install kubernetes-helm
```

### Depuis Scoop (Windows)

Les membres de la communauté Helm ont contribué à la création d'un [package Helm](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json) pour [Scoop](https://scoop.sh). Ce package est généralement à jour.

```console
scoop install helm
```

### Depuis Winget (Windows)

Les membres de la communauté Helm ont contribué à la création d'un [package Helm](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) pour [Winget](https://learn.microsoft.com/en-us/windows/package-manager/). Ce package est généralement à jour.

```console
winget install Helm.Helm
```

### Depuis Apt (Debian/Ubuntu)

Les membres de la communauté Helm ont contribué à la création d'un package Apt pour Debian/Ubuntu. Ce package est généralement à jour. Merci à [Buildkite](https://buildkite.com/organizations/helm-linux/packages/registries/helm-debian) pour l'hébergement du dépôt.

```console
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Depuis dnf/yum (Fedora)

Depuis Fedora 35, Helm est disponible dans le dépôt officiel. Vous pouvez installer Helm en exécutant :

```console
sudo dnf install helm
```

### Depuis Snap

La communauté des [Snapcrafters](https://github.com/snapcrafters) maintient la version Snap du [package Helm](https://snapcraft.io/helm) :

```console
sudo snap install helm --classic
```

### Depuis pkg (FreeBSD)

Les membres de la communauté FreeBSD ont contribué à la création d'un [package Helm](https://www.freshports.org/sysutils/helm) pour la [Collection de Ports FreeBSD](https://man.freebsd.org/ports). Ce package est généralement à jour.

```console
pkg install helm
```

### Builds de développement

En plus des releases, vous pouvez également télécharger et installer les snapshots de développement de Helm.

### Depuis les builds Canary

Les builds "Canary" sont des versions du logiciel Helm construites à partir de la dernière version de la branche `main`. Ce ne sont pas des releases officielles et peuvent ne pas être stables. Cependant, elles permettent de tester les fonctionnalités les plus récentes.

Les binaires Canary de Helm sont disponibles sur `get.helm.sh`. Voici les liens vers les builds les plus courants :

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### Depuis les sources (Linux, macOS)

Construire Helm à partir des sources demande un peu plus de travail, mais c'est le meilleur moyen de tester la dernière version (pré-release) de Helm.

Vous devez disposer d'un environnement Go fonctionnel.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

Si nécessaire, les dépendances seront récupérées et mises en cache, puis la configuration sera validée. `helm` sera ensuite compilé et placé dans `bin/helm`.

## Conclusion

Dans la plupart des cas, l'installation est aussi simple que de récupérer un binaire `helm` pré-compilé. Ce document couvre des cas supplémentaires pour ceux qui souhaitent utiliser Helm de manière plus avancée.

Une fois que le client Helm est installé avec succès, vous pouvez passer à l'utilisation de Helm pour gérer des charts et [ajouter le dépôt stable](/intro/quickstart.md#initialize-a-helm-chart-repository).
