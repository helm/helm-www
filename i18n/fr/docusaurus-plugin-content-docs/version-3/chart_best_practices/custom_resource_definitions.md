---
title: Définitions de ressources personnalisées
description: Comment créer et utiliser des CRDs.
sidebar_position: 7
---

Cette partie du guide des bonnes pratiques traite de la création et de l'utilisation
des objets Custom Resource Definition.

Lorsque vous travaillez avec des Custom Resource Definitions (CRDs), il est important
de distinguer deux éléments différents :

- Il y a une déclaration de CRD. C'est le fichier YAML qui a le kind
  `CustomResourceDefinition`
- Ensuite, il y a les ressources qui _utilisent_ la CRD. Par exemple, si une CRD définit
  `foo.example.com/v1`, toute ressource ayant `apiVersion: example.com/v1` et
  le kind `Foo` est une ressource qui utilise cette CRD.

## Installer une déclaration de CRD avant d'utiliser la ressource

Helm est optimisé pour charger autant de ressources que possible dans Kubernetes le plus rapidement possible.
Par conception, Kubernetes peut prendre un ensemble complet de manifestes et les mettre tous
en ligne (c'est ce qu'on appelle la boucle de réconciliation).

Mais il y a une différence avec les CRDs.

Pour une CRD, la déclaration doit être enregistrée avant que les ressources de ce type
de CRD puissent être utilisées. L'enregistrement peut prendre quelques secondes.

### Méthode 1 : Laissez Helm s'en charger

Avec l'arrivée de Helm 3, nous avons supprimé les anciens hooks `crd-install` au profit d'une
méthodologie plus simple. Il existe maintenant un répertoire spécial appelé `crds` que vous pouvez
créer dans votre chart pour contenir vos CRDs. Ces CRDs ne sont pas traitées comme des templates, mais seront
installées par défaut lors de l'exécution de `helm install` pour le chart. Si la CRD
existe déjà, elle sera ignorée avec un avertissement. Si vous souhaitez ignorer l'étape
d'installation des CRDs, vous pouvez passer le flag `--skip-crds`.

#### Quelques mises en garde (et explications)

Il n'y a actuellement pas de support pour la mise à niveau ou la suppression des CRDs via Helm. Cette
décision a été prise explicitement après de nombreuses discussions avec la communauté en raison du danger
de perte accidentelle de données. De plus, il n'existe actuellement pas de consensus communautaire
sur la manière de gérer les CRDs et leur cycle de vie. À mesure que cela évoluera, Helm ajoutera
un support pour ces cas d'utilisation.

Le flag `--dry-run` de `helm install` et `helm upgrade` n'est actuellement pas
supporté pour les CRDs. L'objectif du "Dry Run" est de valider que la sortie du
chart fonctionnera réellement si elle est envoyée au serveur. Mais les CRDs sont une modification
du comportement du serveur. Helm ne peut pas installer la CRD lors d'un dry run, donc le
client de découverte ne connaîtra pas cette Custom Resource (CR), et la validation
échouera. Vous pouvez alternativement déplacer les CRDs dans leur propre chart ou utiliser `helm
template` à la place.

Un autre point important à considérer dans la discussion sur le support des CRDs est la façon dont
le rendu des templates est géré. L'un des inconvénients distincts de la
méthode `crd-install` utilisée dans Helm 2 était l'impossibilité de valider correctement
les charts en raison du changement de disponibilité des APIs (une CRD ajoute en fait une autre
API disponible à votre cluster Kubernetes). Si un chart installait une CRD, `helm` n'avait
plus un ensemble valide de versions d'API contre lesquelles travailler. C'est aussi la raison
de la suppression du support du templating pour les CRDs. Avec la nouvelle méthode `crds` d'installation
des CRDs, nous nous assurons maintenant que `helm` dispose d'informations complètement valides sur
l'état actuel du cluster.

### Méthode 2 : Charts séparés

Une autre façon de procéder est de mettre la définition de la CRD dans un chart, puis de mettre
toutes les ressources qui utilisent cette CRD dans _un autre_ chart.

Avec cette méthode, chaque chart doit être installé séparément. Cependant, ce workflow
peut être plus utile pour les opérateurs de cluster qui ont un accès administrateur au cluster.
