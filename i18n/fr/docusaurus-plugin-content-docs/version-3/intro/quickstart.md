---
title: Guide de démarrage rapide
description: Comment installer et débuter sur Helm, comprends les instructions pour les distros, FAQs, et plugins.
sidebar_position: 1
---

Ce guide explique comment commencer rapidement à utiliser Helm.

## Conditions préalables

Les conditions préalables suivantes sont requises pour une utilisation correcte et sécurisé de Helm :

1. Posséder un cluster Kubernetes.
2. Décider des configurations de sécurité à appliquer à votre installation, si vous en avez.
3. Installation et configuration de Helm.

### Installer Kubernetes ou avoir accès à un cluster

- Vous devez avoir installé Kubernetes. Pour la dernière release de Helm, nous recommandons la dernière version stable de Kubernetes, qui est dans la plupart des cas la deuxième release mineure la plus récente.
- Vous devriez également avoir une copie locale configurée de `kubectl`.

Lisez la [Politique de prise en charge de la version Helm](https://helm.sh/docs/topics/version_skew/) pour connaitre la différence de version maximal pris en charge entre Helm et Kubernetes.

## Installer Helm

Télécharger le binaire de la dernière release de Helm. Vous pouvez également utiliser un gestionnaire de package tel que `homebrew`, ou regarder sur [la page des releases officielles](https://github.com/helm/helm/releases).

Pour plus de détails, ou d'autre options d'installation rendez vous sur [le guide d'installation](/intro/install.md).

## Initialiser un dépot de charts Helm {#initialize-a-helm-chart-repository}

Une fois que votre Helm est prêt, vous avez la possibilité d'ajouter un dépot de charts. Regardez le [Artifact Hub](https://artifacthub.io/packages/search?kind=0) pour voir les dépots publiques de charts Helm disponibles.

```console
$ helm repo add stable https://charts.helm.sh/stable
```

Une fois que le dépot est configuré, vous aurez la possibilité de lister les charts que vous pouvez installer :

```console
$ helm search repo stable
NAME                                    chart VERSION   APP VERSION                     DESCRIPTION
stable/acs-engine-autoscaler            2.2.2           2.1.1                           DEPRECATED Scales worker nodes within agent pools
stable/aerospike                        0.2.8           v4.5.0.5                        A Helm chart for Aerospike in Kubernetes
stable/airflow                          4.1.0           1.10.4                          Airflow is a platform to programmatically autho...
stable/ambassador                       4.1.0           0.81.0                          A Helm chart for Datawire Ambassador
# ... and many more
```

## Installer un chart d'exemple

Pour installer un chart, vous pouvez exécuter la commande `helm install`. Helm a plusieurs moyens de trouver et d'installer un chart, mais le plus simple reste d'utiliser le dépot officiel de charts «stable».

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install stable/mysql --generate-name
Released smiling-penguin
```

Dans l'exemple ci-dessus, le chart `stable / mysql` a été déployé, et le nom de notre nouvelle release est «smiling-penguin».

Vous pouvez obtenir les informations simples des fonctionnalités de ce chart MySQL en exécutant `helm show chart stable/mysql`. Ou vous pouvez lancer `helm show all stable/mysql` pour obtenir toute les informations disponibles.

Chaque fois que vous installez un chart, une nouvelle release est créée. Un chart peut donc être installé plusieurs fois sur le même cluster. Et chaque release peut être indépendamment gérée et mise à jour.

La commande `helm install` est très puissante et possède beaucoup de fonctionnalités. Pour en apprendre plus sur cette commande lisez le [Guide d'utilisation de Helm](/intro/using_helm.md)

## Apprenez en plus sur le système de release

Il est facile de voir ce qui à été deployé avec Helm :

```console
$ helm list
NAME             VERSION   UPDATED                   STATUS    chart
smiling-penguin  1         Wed Sep 28 12:59:46 2016  DEPLOYED  mysql-0.1.0
```

La fonction `helm list` (ou `helm ls`) vous montrera une liste de toutes les release déployées.

## Désinstaller une release

Pour désinstaller une release utiliser la commande `helm uninstall` :

```console
$ helm uninstall smiling-penguin
Removed smiling-penguin
```

Cela désinstallera la release `smiling-penguin` de Kubernetes, toutes les ressources associées à cette release seront supprimés ainsi que l'historique lié.

Si l'indicateur `--keep-history` est fourni, l'historique des releases sera conservé. Vous serez même en mesure de demander des informations sur cette release :

```console
$ helm status smiling-penguin
Status: UNINSTALLED
...
```

Étant donné que Helm suit vos releases même après les avoir désinstallées, vous pouvez auditer l'historique d'un cluster, et même annuler la suppression d'une release (avec `helm rollback`).

## Lecture du l'aide

Pour en savoir plus sur les commandes Helm disponibles, utilisez `helm help` ou tapez une commande suivie de l'indicateur `-h`:

```console
$ helm get -h
```
