---
title: "Migration de Helm v2 vers v3"
description: "Apprenez comment migrer Helm v2 vers v3"
weight: 13
---

Ce guide explique comment migrer Helm v2 vers v3. Helm v2 doit être installé et gérer des releases dans un ou plusieurs clusters.

## Aperçu des changements dans Helm 3

La liste complète des changements entre Helm 2 et 3 est documentée dans la [section FAQ](https://v3.helm.sh/docs/faq/#changes-since-helm-2). Voici un résumé de certains de ces changements qu'un utilisateur devrait connaître avant et pendant la migration :

1. Suppression de Tiller :
   - Remplacement de l'architecture client/serveur par une architecture client/bibliothèque (seul le binaire `helm` est utilisé)
   - La sécurité est désormais basée sur chaque utilisateur (déléguée à la sécurité de l'utilisateur du cluster Kubernetes)
   - Les releases sont désormais stockées en tant que secrets dans le cluster, et les métadonnées de l'objet release ont changé
   - Les releases sont conservées dans l'espace de noms de la release, et non plus dans l'espace de noms de Tiller
2. Mise à jour du dépôt de charts :
   - `helm search` prend désormais en charge les recherches locales dans le dépôt et permet d'effectuer des requêtes de recherche sur Artifact Hub
3. Version d'api des charts passée à "v2" avec les changements suivants :
   - Les dépendances de charts liées dynamiquement ont été déplacées vers `Chart.yaml` (suppression de `requirements.yaml` et remplacement de requirements par dependencies)
   - Les charts de bibliothèque (charts d'assistance/communs) peuvent désormais être ajoutés en tant que dépendances de charts liées dynamiquement
   - Les charts ont un champ de métadonnées `type` pour définir s'ils sont de type `application` ou `library`. Par défaut, c'est une application, ce qui signifie qu'il est rendu et installable
   - Les charts Helm 2 (apiVersion=v1) sont toujours installables
4. Ajout de la spécification des répertoires XDG :
   - Le répertoire Helm home est supprimé et remplacé par la spécification des répertoires XDG pour le stockage des fichiers de configuration
   - Il n'est plus nécessaire d'initialiser Helm
   - Les commandes `helm init` et `helm home` sont supprimées
5. Autres changements :
   - L'installation/mise en place de Helm est simplifiée :
     - Client Helm uniquement (binaire helm sans Tiller)
     - Paradigme "run-as-is"
   - Les dépôts `local` ou `stable` ne sont plus configurés par défaut
   - Le hook `crd-install` est supprimé et remplacé par le répertoire `crds` dans le chart où tous les CRD définis y seront installés avant le rendu du chart
   - L'annotation `test-failure` est supprimée, et `test-success` est dépréciée. Utilisez `test` à la place
   - Commandes supprimées/remplacées/ajoutées :
       - delete --> uninstall : supprime tout l'historique de la release par défaut (nécessitait auparavant `--purge`)
       - fetch --> pull
       - home (supprimé)
       - init (supprimé)
       - install : nécessite un nom de release ou l'argument `--generate-name`
       - inspect --> show
       - reset (supprimé)
       - serve (supprimé)
       - template : l'argument `-x`/`--execute` est renommé en `-s`/`--show-only`
       - upgrade : ajout de l'argument `--history-max` qui limite le nombre maximum de révisions sauvegardées par release (0 pour aucune limite)
   - La bibliothèque Go de Helm 3 a subi de nombreuses modifications et est incompatible avec la bibliothèque de Helm 2
   - Les binaires de release sont désormais hébergés sur `get.helm.sh`

## Cas d'utilisation de la migration

Les cas d'utilisation de la migration sont les suivants :

1. Helm v2 et v3 gérant le même cluster :
   - Ce cas d'utilisation est recommandé uniquement si vous envisagez de supprimer progressivement Helm v2 et que vous ne souhaitez pas que v3 gère les releases déployées par v2. Toutes les nouvelles releases doivent être déployées par v3, et les releases existantes déployées par v2 doivent être mises à jour ou supprimées uniquement par v2.
   - Helm v2 et v3 peuvent coexister dans le même cluster. Les deux versions peuvent être installées sur le même système ou sur des systèmes séparés.
   - Si Helm v3 est installé sur le même système que Helm v2, il est nécessaire d'effectuer une étape supplémentaire pour permettre la coexistence des deux versions jusqu'à la suppression de Helm v2. Il faut renommer ou déplacer le binaire de Helm v3 dans un autre dossier pour éviter les conflits.
   - Il n'y a pas d'autres conflits entre les deux versions en raison des distinctions suivantes :
     - Le stockage des releases (historique) de v2 et v3 est indépendant. Les changements incluent les ressources Kubernetes pour le stockage et les métadonnées des objets de release contenus dans la ressource. Les releases sont également basées sur l'espace de noms de l'utilisateur, plutôt que d'utiliser l'espace de noms de Tiller (par exemple, dans v2, l'espace de noms par défaut de Tiller est kube-system). v2 utilise des "ConfigMaps" ou "Secrets" dans l'espace de noms de Tiller avec la propriété `TILLER`. v3 utilise des "Secrets" dans l'espace de noms de l'utilisateur avec la propriété `helm`. Les releases sont incrémentielles dans v2 et v3.
     - Le seul problème pourrait survenir si des ressources à l'échelle du cluster Kubernetes (par exemple, `clusterroles.rbac`) sont définies dans un chart. Le déploiement avec v3 échouerait dans ce cas même si la ressource est unique dans l'espace de noms, car les ressources se chevaucheraient.
     - La configuration de v3 n'utilise plus `$HELM_HOME` et repose désormais sur la spécification des répertoires XDG. Elle est créée à la volée si nécessaire, rendant v3 indépendant de la configuration de v2. Cela ne s'applique que lorsque les deux versions sont installées sur le même système.
2. Migration de Helm v2 vers Helm v3 :
   - Ce cas d'utilisation s'applique lorsque vous souhaitez que Helm v3 gère les releases existantes de Helm v2.
   - Il est important de noter que le client Helm v2 :
     - peut gérer un ou plusieurs clusters Kubernetes
     - peut se connecter à une ou plusieurs instances de Tiller dans un cluster
   - Cela signifie qu'il faut en être conscient lors de la migration, car les releases sont déployées dans les clusters par Tiller et son espace de noms. Il est donc nécessaire de gérer la migration pour chaque cluster et chaque instance de Tiller gérée par l'instance du client Helm v2.
   - Le chemin de migration recommandé pour les données est le suivant :
     1. Sauvegarder les données de v2
     2. Migrer la configuration de Helm v2
     3. Migrer les releases de Helm v2
     4. Une fois que vous êtes sûr que Helm v3 gère toutes les données de Helm v2 (pour tous les clusters et instances de Tiller du client Helm v2) comme prévu, nettoyez les données de Helm v2.
   - Le processus de migration est automatisé par le plugin Helm v3 [2to3](https://github.com/helm/helm-2to3).

## Références

   - Plugin Helm v3 [2to3](https://github.com/helm/helm-2to3)
   - Article de blog [posté ici](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/) expliquant l'utilisation du plugin `2to3` avec des exemples.
