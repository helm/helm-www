---
title: Installation de Helm
description: Learn how to install and get running with Helm.
sidebar_position: 2
---

Ce guide vous explique comment installer la CLI (Interface de Ligne de Commande) Helm. Helm peut être installé soit à partir des sources, ou à partir des releases binaires pré-construites.

## Depuis le projet Helm

Nous vous proposons deux méthodes pour récupérer et installer Helm. Voici les méthodes officielles pour obtenir les releases de l'application. En plus de cela, la communauté Helm
fournit des méthodes pour installer Helm via différents gestionnaires de packages. L'installation via ces méthodes peut être trouvée ci-dessous.

### À partir des releases binaires

Chaque [releases] (https://github.com/helm/helm/releases) de Helm fournit des binaires pour une variété de systèmes d'exploitation. Ces binaires peuvent être téléchargées manuellement
et installé.

1. Téléchargez la [version adéquate](https://github.com/helm/helm/releases)
2. Décompressez l'archive (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Trouvez le binaire `helm` dans le répertoire décompréssé, et déplacez le dans la destination voulue (`mv linux-amd64/helm /usr/local/bin/helm`)

A ce stade, vous devriez être cappable de lancer le client et [d'ajouter le dépot stable](/intro/quickstart.md#initialize-a-helm-chart-repository): `helm help`.

**Remarque:** Les tests automatisés de Helm sont effectués pour Linux AMD64 uniquement pendant les build et release GitHub Actions. Les tests d'autres systèmes d'exploitation sont sous la responsabilité de la communauté qui demande Helm pour le système d'exploitation en question.

### À partir du script

Helm a maintenant un script d'installation qui récupérera automatiquement la dernière version de Helm et [l'installera localement](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Vous pouvez récupérer ce script, puis l'exécuter localement. Il est bien documenté donc que vous pouvez le lire et comprendre ce qu'il fait avant de l'exécuter.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Oui, vous pouvez également `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` si vous aimez vivre dangereusement.

## Via les gestionnaires de packages

La communauté Helm offre la possibilité d'installer Helm via le gestionnaire de packages de votre système d'exploitation. Ceux-ci ne sont pas pris en charge par le projet Helm et ne sont pas considérés comme des tiers de confiance.

### Depuis Homebrew (macOS)

Les membres de la communauté Helm ont contribué à la création d'une formule Helm pour Homebrew. Ce package est généralement à jour.

```console
brew install helm
```

(Note: il existe un projet différent possédant une formule pour emacs-helm.)

### Depuis Chocolatey (Windows)

Les membres de la communauté Helm ont contribué à la création d'un [package Helm](https://chocolatey.org/packages/kubernetes-helm) build pour [Chocolatey](https://chocolatey.org/). Ce package est généralement à jour.

```console
choco install kubernetes-helm
```

### Depuis Winget (Windows)

Les membres de la communauté Helm ont contribué à la création d'un [package Helm](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) build pour [Winget](https://learn.microsoft.com/en-us/windows/package-manager/). Ce package est généralement à jour.

```console
winget install Helm.Helm
```

### Depuis Apt (Debian/Ubuntu)

Les membres de la communauté Helm ont contribué à la création d'un [package Helm](https://helm.baltorepo.com/stable/debian/) for Apt. Ce package est généralement à jour.

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Depuis Snap

La communauté des [Snapcrafters](https://github.com/snapcrafters) maintiennent la version Snap du [package Helm](https://snapcraft.io/helm) à jour :

```console
sudo snap install helm --classic
```

### Depuis pkg (FreeBSD)

Les membres de la communauté FreeBSD ont contribué à la création d'un [package Helm](https://www.freshports.org/sysutils/helm) build pour la [Collection de Ports FreeBSD](https://man.freebsd.org/ports). Ce package est généralement à jour.

```console
pkg install helm
```

### Builds de developpement

En plus des releases vous pouvez également télécharger et installer les snpashots de developpement de Helm

### Depuis les builds Canary

Les builds "Canary" sont des versions de logiciel Helm qui ont été construits à partir de la dernière version de la branche `main`. Ce ne sont pas des releases offcielles et peuvent ne pas être stable. Ceci étant, elles vous proposent l'opportunité de tester les features les plus récentes.

Les binaires des builds Canary sont disponibles ici : [get.helm.sh](https://get.helm.sh). Voici les liens vers les builds les plus communs :

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### Depuis les Sources (Linux, macOS)

Construire Helm à partir des sources est un peu plus éprouvant, mais c'est le meilleur moyen de tester la dernière version (pré-release) de Helm.

Vous devez disposer d'un environnement fonctionnelle de [Go](https://golang.org/doc/install).

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

Si nécessaire, Helm récupérera les dépendances et les mettra en cache, il poourra ensuite valider la configuration. `helm` sera compilé et le placé dans` bin/helm`.

## Conclusion

Dans la plupart des cas, l'installation est aussi simple que de télécharger un binaire `helm` pré-compilé. Ce document couvre des cas supplémentaires pour ceux qui veulent utiliser Helm dans des cas plus sophistiqués.

Une fois que le client Helm est installé avec succès, vous pouvez passer à l'utilisation de Helm pour gérer des Charts [ajouter le dépot stable](/intro/quickstart.md#initialize-a-helm-chart-repository).
