---
title: "Définition de Ressource Personalisée"
description: "Comment gérer la création et l'utilisation de CRDs."
weight: 7
---

Cette section du Guide des Bonnes Pratiques traite de la création et de l'utilisation d'objets de Définition de Ressource Personnalisée.

Lorsque vous travaillez avec des Définitions de Ressource Personnalisées (_Custom Resource Definitions, CRDs_), il est important de distinguer deux types différents :

- Il existe une déclaration de CRD. Il s'agit d'un fichier YAML qui a le genre `CustomResourceDefinition`
- Ensuite, il y a des ressources qui _utilisent_ le CRD. Supposons qu'une CRD définisse `foo.example.com/v1`. Toutes ressource ayant `ApiVersion : example.com/v1` et `kind: foo` est une ressource qui utilise la CRD.

## Installer une déclaration CRD avant d'utiliser la ressource

Helm est optimisé pour charger le plus de ressources possible dans Kubernetes aussi rapidement que possible. Par conception, Kubernetes peut prendre un ensemble complet de manifests et les mettre tous en ligne (c'est ce qu'on appelle la boucle de reconciliation).

Mais il y a une différence avec les CRDs.

Pour une CRD, la déclaration doit être enregistrée avant que des ressources de ce(s) type(s) puissent être utilisées. Ce processus d'enregistrement prend parfois quelques secondes.

### Méthode 1 : Laisse `Helm` le faire pour toi

Avec l'arrivée de Helm 3, nous avons supprimé les anciens hooks `crd-install` au profit d'une méthodologie plus simple. Il existe maintenant un répertoire spécial appelé `crds` que vous pouvez créer dans votre chart pour y placer vos CRDs. Ces CRDs ne sont pas templatisées, mais seront installées par défaut lors de l'exécution de la commande `helm install` pour le chart. Si la CRD existe déjà, elle sera ignorée avec un avertissement. Si vous souhaitez passer l'étape d'installation des CRDs, vous pouvez utiliser l'option `--skip-crds`.

#### Quelques mises en garde (et explications)

Il n'y a pas de support pour la mise à niveau ou la suppression des CRDs avec Helm pour le moment. Il s'agit d'une décision explicite prise après de nombreuses discussions au sein de la communauté en raison du risque de perte de données non intentionnelle. De plus, il n'y a pas encore de consensus au sein de la communauté sur la manière de gérer les CRDs et leur cycle de vie. À mesure que cela évoluera, Helm ajoutera un support pour ces cas d'utilisation.

L'option `--dry-run` des commandes `helm install` et `helm upgrade` n'est pas actuellement supportée pour les CRDs. L'objectif de l'option "Dry Run" est de valider que le résultat du chart fonctionnera réellement s'il est envoyé au serveur. Mais les CRDs sont une modification du comportement du serveur. Helm ne peut pas installer le CRD lors d'un dry run, donc le client de découverte ne connaîtra pas cette Ressource Personnalisée (CR), et la validation échouera. Vous pouvez alternativement déplacer les CRDs dans leur propre chart ou utiliser `helm template` à la place.

Un autre point important à considérer dans la discussion autour du support des CRDs est la manière dont le rendu des templates est géré. Un des inconvénients majeurs de la méthode `crd-install` utilisée dans Helm 2 était l'incapacité de valider correctement les charts en raison de la disponibilité changeante des API (une CRD ajoute en fait une autre API disponible à votre cluster Kubernetes). Si un chart installait une CRD, `helm` n'avait plus un ensemble valide de versions d'API sur lequel se baser. C'est également la raison pour laquelle le support du templating a été supprimé pour les CRDs. Avec la nouvelle méthode d'installation des CRDs via le répertoire `crds`, nous veillons maintenant à ce que `helm` dispose d'informations complètement valides sur l'état actuel du cluster.

### Méthode 2 : Charts séparés

Une autre façon de procéder est de placer la définition du CRD dans un chart, puis de mettre les ressources qui utilisent cette CRD dans _un autre_ chart.

Avec cette méthode, chaque chart doit être installé séparément. Cependant, ce workflow peut être plus utile pour les opérateurs de cluster qui ont un accès admin à un cluster.
