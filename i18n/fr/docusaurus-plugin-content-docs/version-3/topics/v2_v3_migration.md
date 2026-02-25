---
title: Migration de Helm v2 vers v3
description: Apprenez comment migrer Helm v2 vers v3.
sidebar_position: 13
---

Ce guide explique comment migrer de Helm v2 vers v3. Helm v2 doit être installé
et gérer des releases dans un ou plusieurs clusters.

## Aperçu des changements dans Helm 3

La liste complète des changements entre Helm 2 et 3 est documentée dans la
[section FAQ](/faq/changes_since_helm2.md). Voici un résumé des changements
qu'un utilisateur devrait connaître avant et pendant la migration :

1. Suppression de Tiller :
   - Remplacement de l'architecture client/serveur par une architecture
     client/bibliothèque (binaire `helm` uniquement)
   - La sécurité est désormais gérée par utilisateur (déléguée à la sécurité du
     cluster Kubernetes)
   - Les releases sont maintenant stockées en tant que secrets dans le cluster
     et les métadonnées de l'objet release ont changé
   - Les releases sont persistées par namespace et non plus dans le namespace
     Tiller
2. Mise à jour du dépôt de charts :
   - `helm search` prend désormais en charge les recherches dans les dépôts
     locaux ainsi que les requêtes de recherche sur Artifact Hub
3. Passage de l'apiVersion des charts à "v2" pour les changements de
   spécification suivants :
   - Les dépendances de charts liées dynamiquement ont été déplacées vers
     `Chart.yaml` (`requirements.yaml` supprimé et requirements --> dependencies)
   - Les charts de type bibliothèque (helper/common charts) peuvent maintenant
     être ajoutés comme dépendances de charts liées dynamiquement
   - Les charts ont un champ de métadonnées `type` pour définir le chart comme
     étant de type `application` ou `library`. Par défaut, il est de type
     application, ce qui signifie qu'il est rendu et installable
   - Les charts Helm 2 (apiVersion=v1) sont toujours installables
4. Ajout de la spécification des répertoires XDG :
   - Helm home supprimé et remplacé par la spécification des répertoires XDG
     pour le stockage des fichiers de configuration
   - Plus besoin d'initialiser Helm
   - `helm init` et `helm home` supprimés
5. Changements supplémentaires :
   - L'installation/configuration de Helm est simplifiée :
     - Client Helm (binaire helm) uniquement (pas de Tiller)
     - Fonctionne immédiatement
   - Les dépôts `local` ou `stable` ne sont plus configurés par défaut
   - Le hook `crd-install` est supprimé et remplacé par le répertoire `crds`
     dans le chart où tous les CRDs définis seront installés avant le rendu du
     chart
   - La valeur d'annotation de hook `test-failure` est supprimée, et
     `test-success` est dépréciée. Utilisez `test` à la place
   - Commandes supprimées/remplacées/ajoutées :
       - delete --> uninstall : supprime tout l'historique des releases par
         défaut (auparavant nécessitait `--purge`)
       - fetch --> pull
       - home (supprimé)
       - init (supprimé)
       - install : nécessite un nom de release ou l'argument `--generate-name`
       - inspect --> show
       - reset (supprimé)
       - serve (supprimé)
       - template : l'argument `-x`/`--execute` renommé en `-s`/`--show-only`
       - upgrade : ajout de l'argument `--history-max` qui limite le nombre
         maximum de révisions sauvegardées par release (0 pour aucune limite)
   - La bibliothèque Go de Helm 3 a subi de nombreux changements et est
     incompatible avec la bibliothèque Helm 2
   - Les binaires de release sont maintenant hébergés sur `get.helm.sh`

## Cas d'utilisation de la migration

Les cas d'utilisation de la migration sont les suivants :

1. Helm v2 et v3 gérant le même cluster :
   - Ce cas d'utilisation est recommandé uniquement si vous avez l'intention de
     supprimer progressivement Helm v2 et que vous n'avez pas besoin que v3 gère
     les releases déployées par v2. Toutes les nouvelles releases doivent être
     déployées par v3 et les releases existantes déployées par v2 sont mises à
     jour/supprimées uniquement par v2
   - Helm v2 et v3 peuvent parfaitement gérer le même cluster. Les versions de
     Helm peuvent être installées sur le même système ou sur des systèmes
     séparés
   - Si vous installez Helm v3 sur le même système, vous devez effectuer une
     étape supplémentaire pour vous assurer que les deux versions du client
     peuvent coexister jusqu'à ce que vous soyez prêt à supprimer le client
     Helm v2. Renommez ou placez le binaire Helm v3 dans un dossier différent
     pour éviter tout conflit
   - Sinon, il n'y a pas de conflits entre les deux versions grâce aux
     distinctions suivantes :
     - Le stockage des releases (historique) de v2 et v3 est indépendant. Les
       changements incluent la ressource Kubernetes pour le stockage et les
       métadonnées de l'objet release contenues dans la ressource. Les releases
       seront également sur une base de namespace par utilisateur au lieu
       d'utiliser le namespace Tiller (par exemple, le namespace Tiller par
       défaut de v2 est kube-system). v2 utilise "ConfigMaps" ou "Secrets" sous
       le namespace Tiller et la propriété `TILLER`. v3 utilise "Secrets" dans
       le namespace utilisateur et la propriété `helm`. Les releases sont
       incrémentales dans v2 et v3
     - Le seul problème pourrait survenir si des ressources Kubernetes à portée
       de cluster (par exemple `clusterroles.rbac`) sont définies dans un chart.
       Le déploiement v3 échouerait alors même si le namespace est unique car
       les ressources entreraient en conflit
     - La configuration v3 n'utilise plus `$HELM_HOME` et utilise à la place la
       spécification des répertoires XDG. Elle est également créée à la volée
       selon les besoins. Elle est donc indépendante de la configuration v2.
       Ceci s'applique uniquement lorsque les deux versions sont installées sur
       le même système

2. Migration de Helm v2 vers Helm v3 :
   - Ce cas d'utilisation s'applique lorsque vous souhaitez que Helm v3 gère les
     releases Helm v2 existantes
   - Il faut noter qu'un client Helm v2 :
     - peut gérer 1 à plusieurs clusters Kubernetes
     - peut se connecter à 1 à plusieurs instances Tiller pour un cluster
   - Ceci implique que vous devez en tenir compte lors de la migration car les
     releases sont déployées dans les clusters par Tiller et son namespace. Vous
     devez donc prendre en compte la migration pour chaque cluster et chaque
     instance Tiller gérée par l'instance du client Helm v2
   - Le chemin de migration de données recommandé est le suivant :
     1. Sauvegarder les données v2
     2. Migrer la configuration Helm v2
     3. Migrer les releases Helm v2
     4. Lorsque vous êtes confiant que Helm v3 gère toutes les données Helm v2
        (pour tous les clusters et instances Tiller de l'instance du client
        Helm v2) comme prévu, procédez au nettoyage des données Helm v2
   - Le processus de migration est automatisé par le plugin Helm v3
     [2to3](https://github.com/helm/helm-2to3)

## Références

   - Plugin Helm v3 [2to3](https://github.com/helm/helm-2to3)
   - [Article de blog](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)
     expliquant l'utilisation du plugin `2to3` avec des exemples
