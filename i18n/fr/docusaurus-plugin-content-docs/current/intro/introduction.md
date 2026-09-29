---
title: Introduction à Helm
description: "Une présentation générale de Helm : ce qu'il est, à quoi il sert, à qui il s'adresse et comment il fonctionne."
sidebar_position: 1
default_lang_commit: ed7a112de557a0b62d515d947aa628d0df2a2205
---

# Introduction à Helm

Helm est le gestionnaire de paquets de Kubernetes.
Il vous aide à définir, installer et mettre à niveau des applications sur un cluster Kubernetes,
d'un simple conteneur jusqu'à une application composée de nombreuses parties interdépendantes.

Déployer une application sur Kubernetes implique d'écrire et de maintenir de nombreux
manifestes : Deployments, Services, ConfigMaps et bien d'autres.
Gérer ces fichiers à la main, d'un environnement et d'une version à l'autre, est répétitif et
source d'erreurs.
Helm regroupe ces manifestes liés en une seule unité appelée _chart_,
que vous pouvez versionner, partager, installer et restaurer comme une seule release.
Vous gérez ainsi une application comme un gestionnaire de paquets système tel que
Homebrew, apt ou yum gère les logiciels d'un système d'exploitation.

## Que peut faire Helm ? {#what-can-helm-do}

Avec Helm, vous pouvez :

- **Installer et gérer des applications.** Déployer des applications prêtes à l'emploi, comme
  des bases de données, des outils de supervision ou des contrôleurs Ingress, à partir d'un chart
  plutôt que d'assembler vous-même les manifestes.
- **Empaqueter et partager vos propres applications.** Regrouper vos ressources Kubernetes
  dans un chart, le versionner et le distribuer à votre équipe ou à l'ensemble de la communauté.
- **Configurer les applications selon l'environnement.** Fournir des valeurs différentes au
  même chart pour déployer en développement, en préproduction et en production sans
  dupliquer les manifestes.
- **Mettre à niveau et revenir en arrière en toute sécurité.** Faire passer une release à une nouvelle version,
  et revenir à une révision précédente si une mise à niveau ne se passe pas comme prévu.
- **Gérer les dépendances.** Déclarer les autres charts dont votre application a besoin, et
  laisser Helm les installer ensemble.

## À qui s'adresse Helm ? {#who-is-helm-for}

Un utilisateur de Helm tient souvent l'un des rôles suivants.
Une même personne peut en occuper plusieurs, et la répartition des rôles entre les
personnes varie d'une organisation à l'autre.
Pour plus d'informations, consultez [Profils d'utilisateurs](/community/user-profiles) dans la documentation de la communauté Helm.

- **Opérateur d'applications.** Vous prenez une application et la faites fonctionner dans un
  cluster Kubernetes, par exemple en exploitant WordPress et sa base de données MySQL.
  Ce rôle est différent de celui d'opérateur de cluster, qui fait fonctionner le cluster lui-même.
- **Distributeur d'applications.** Vous empaquetez une application pour que quelqu'un d'autre
  puisse l'exploiter, comme le font les mainteneurs de charts communautaires.
- **Développeur d'applications.** Vous écrivez le logiciel d'une application et, en général,
  vous ne vous préoccupez pas de l'endroit où il s'exécute.
- **Développeur d'outils complémentaires.** Vous créez des outils qui fonctionnent avec Helm,
  comme un linter ou un plugin Helm.

Helm se concentre sur l'application qui s'exécute dans le cluster plutôt qu'au cluster
lui-même.
Mettre en place et exploiter un cluster Kubernetes, y compris son plan de contrôle et ses
nœuds, relève de l'opérateur de cluster et sort du périmètre de Helm.

## Composants principaux {#key-components}

Trois composants décrivent le fonctionnement de Helm : les charts, les dépôts et les releases.
Helm installe des charts dans Kubernetes en créant une nouvelle release à chaque
installation, et vous trouvez de nouveaux charts en cherchant dans les dépôts de charts Helm.

### Chart {#chart}

Un _chart_ est un paquet Helm.
Il contient toutes les définitions de ressources nécessaires pour exécuter une application, un outil
ou un service dans un cluster Kubernetes.
Voyez-le comme l'équivalent Kubernetes d'une formule Homebrew, d'un paquet `dpkg` pour apt
ou d'un fichier RPM pour yum.
Pour apprendre à en créer un, consultez le [guide des charts](/topics/charts.mdx).

### Dépôt {#repository}

Un _dépôt_ est l'endroit où les charts sont rassemblés et partagés.
Il fonctionne comme l'[archive CPAN](https://www.cpan.org) de Perl ou la
[Fedora Package Database](https://src.fedoraproject.org/), mais pour les paquets
Kubernetes.
Vous trouverez des charts publics sur [Artifact Hub](https://artifacthub.io),
qui référence les charts de nombreux dépôts.
Pour plus d'informations sur l'hébergement de charts, consultez le
[guide des dépôts de charts](/topics/chart_repository.md).

### Release {#release}

Une _release_ est une instance d'un chart qui s'exécute dans un cluster Kubernetes.
Vous pouvez installer un même chart plusieurs fois dans le même cluster, et chaque
installation crée une nouvelle release avec son propre nom de release.
Par exemple, si vous voulez faire fonctionner deux bases de données dans votre cluster, vous pouvez installer
un chart MySQL deux fois, et chaque installation est suivie en tant que release distincte.

Pour créer une release, Helm fusionne un chart empaqueté avec des informations de configuration.
La configuration est un ensemble de valeurs, provenant généralement d'un fichier `values.yaml`.

## Architecture {#architecture}

Helm est un outil en ligne de commande qui s'exécute sur votre machine locale et communique avec le
[serveur d'API Kubernetes](https://kubernetes.io/docs/concepts/overview/kubernetes-api/).

Helm se compose de deux parties distinctes :

- **Le client Helm** est l'outil en ligne de commande destiné aux utilisateurs finaux.
  Il prend en charge le développement local de charts, gère les dépôts et les releases,
  et envoie les charts à la bibliothèque Helm pour qu'ils soient installés, mis à niveau ou
  désinstallés.
- **La bibliothèque Helm** fournit la logique qui exécute les opérations Helm.
  Elle crée les releases, et installe, met à niveau et désinstalle les charts en
  interagissant avec le serveur d'API Kubernetes.
  Comme la bibliothèque est autonome, d'autres clients peuvent réutiliser la même logique.

Le client et la bibliothèque Helm sont écrits dans le langage de programmation [Go](https://go.dev),
et la bibliothèque utilise la bibliothèque client Kubernetes pour communiquer avec
Kubernetes en REST et JSON.
Helm stocke les informations des releases dans des
[Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) Kubernetes au sein du
cluster : il n'a donc pas besoin de sa propre base de données.
Les fichiers de configuration sont écrits en [YAML](https://yaml.org) dans la mesure du possible.

## Étapes suivantes {#next-steps}

- Suivez le [guide de démarrage rapide](/intro/quickstart.md) pour installer Helm et déployer
  votre premier chart.
- Lisez [Utilisation de Helm](/intro/using_helm.mdx) pour découvrir les commandes Helm
  du quotidien.
- Explorez le [guide des templates de chart](/chart_template_guide/index.mdx) pour commencer
  à créer vos propres charts.
