---
title: Guide de démarrage rapide
description: Comment installer et débuter avec Helm, y compris les instructions pour les distributions, FAQ et plugins.
sidebar_position: 1
---

Ce guide explique comment commencer rapidement à utiliser Helm.

## Conditions préalables

Les conditions préalables suivantes sont requises pour une utilisation correcte et sécurisée de Helm :

1. Un cluster Kubernetes
2. Décider des configurations de sécurité à appliquer à votre installation, si nécessaire
3. Installation et configuration de Helm

### Installer Kubernetes ou avoir accès à un cluster

- Vous devez avoir Kubernetes installé. Pour la dernière release de Helm, nous recommandons la dernière version stable de Kubernetes, qui est dans la plupart des cas la deuxième release mineure la plus récente.
- Vous devriez également avoir une copie locale configurée de `kubectl`.

Consultez la [Politique de prise en charge des versions de Helm](https://helm.sh/docs/topics/version_skew/) pour connaître le décalage de version maximal pris en charge entre Helm et Kubernetes.

## Installer Helm

Téléchargez le binaire de la release de Helm. Vous pouvez utiliser des outils comme `homebrew`, ou consulter [la page des releases officielles](https://github.com/helm/helm/releases).

Pour plus de détails ou d'autres options, consultez [le guide d'installation](/intro/install.md).

## Initialiser un dépôt de charts Helm

Une fois Helm prêt, vous pouvez ajouter un dépôt de charts. Consultez [Artifact Hub](https://artifacthub.io/packages/search?kind=0) pour voir les dépôts de charts Helm disponibles.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Une fois le dépôt ajouté, vous pourrez lister les charts disponibles :

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## Installer un chart d'exemple

Pour installer un chart, vous pouvez exécuter la commande `helm install`. Helm dispose de plusieurs moyens pour trouver et installer un chart, mais le plus simple est d'utiliser les charts `bitnami`.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

Dans l'exemple ci-dessus, le chart `bitnami/mysql` a été déployé, et le nom de notre nouvelle release est `mysql-1612624192`.

Vous pouvez obtenir un aperçu des fonctionnalités de ce chart MySQL en exécutant `helm show chart bitnami/mysql`. Ou vous pouvez lancer `helm show all bitnami/mysql` pour obtenir toutes les informations sur le chart.

Chaque fois que vous installez un chart, une nouvelle release est créée. Un chart peut donc être installé plusieurs fois sur le même cluster. Et chaque release peut être gérée et mise à jour indépendamment.

La commande `helm install` est très puissante et possède de nombreuses fonctionnalités. Pour en apprendre davantage, consultez le [Guide d'utilisation de Helm](/intro/using_helm.md).

## Découvrir les releases

Pour voir ce qui a été déployé avec Helm :

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

La fonction `helm list` (ou `helm ls`) vous montrera une liste de toutes les releases déployées.

## Désinstaller une release

Pour désinstaller une release, utilisez la commande `helm uninstall` :

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

Cela désinstallera `mysql-1612624192` de Kubernetes, supprimant toutes les ressources associées à la release ainsi que l'historique de la release.

Si l'option `--keep-history` est fournie, l'historique de la release sera conservé. Vous pourrez alors demander des informations sur cette release :

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Étant donné que Helm suit vos releases même après les avoir désinstallées, vous pouvez auditer l'historique d'un cluster, et même restaurer une release (avec `helm rollback`).

## Consulter l'aide

Pour en savoir plus sur les commandes Helm disponibles, utilisez `helm help` ou tapez une commande suivie de l'option `-h` :

```console
$ helm get -h
```
