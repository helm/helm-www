---
title: "APIs Kubernetes obsolètes"
description: "Explique les APIs Kubernetes obsolètes dans Helm"
---

Kubernetes est un système piloté par des API, et ces dernières évoluent au fil du temps pour refléter la compréhension en constante évolution du domaine des problèmes. Cette pratique est courante dans les systèmes et leurs API. Un élément important de l'évolution des API est d'avoir une bonne politique et un processus de dépréciation pour informer les utilisateurs des changements apportés aux API. En d'autres termes, les consommateurs de votre API doivent être informés à l'avance de la version dans laquelle une API sera supprimée ou modifiée. Cela élimine l'effet de surprise et les modifications disruptives pour les utilisateurs.

La [politique de dépréciation de Kubernetes](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) documente comment Kubernetes gère les modifications de ses versions d'API. Cette politique précise le délai pendant lequel les versions d'API seront prises en charge après une annonce de dépréciation. Il est donc important de rester attentif aux annonces de dépréciation et de savoir quand les versions d'API seront supprimées, afin de minimiser l'impact.

Voici un exemple d'annonce [pour la suppression des versions d'API obsolètes dans Kubernetes 1.16](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/), qui a été publiée quelques mois avant la sortie. Ces versions d'API avaient déjà été annoncées comme dépréciées auparavant. Cela montre qu'il existe une bonne politique en place pour informer les utilisateurs du support des versions d'API.

Les templates Helm spécifient un [groupe d'API Kubernetes](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups) lors de la définition d'un objet Kubernetes, de manière similaire à un fichier manifeste Kubernetes. Il est indiqué dans le champ `apiVersion` du template et identifie la version de l'API de l'objet Kubernetes. Cela signifie que les utilisateurs de Helm et les mainteneurs de chart doivent être conscients des versions d'API Kubernetes qui ont été dépréciées et de la version de Kubernetes dans laquelle elles seront supprimées.

## Mainteneurs de chart

Vous devez auditer vos charts en vérifiant les versions d'API Kubernetes qui sont dépréciées ou supprimées dans une version de Kubernetes. Les versions d'API qui ne sont plus prises en charge ou qui sont sur le point de l'être doivent être mises à jour vers une version prise en charge, et une nouvelle version du chart doit être publiée. La version de l'API est définie par les champs `kind` et `apiVersion`. Par exemple, voici une version de l'API de l'objet `Deployment` supprimée dans Kubernetes 1.16 :

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Utilisateurs de Helm

Vous devez auditer les charts que vous utilisez (de manière similaire aux [mainteneurs de chart](#mainteneurs-de-chart) et identifier ceux pour lesquels les versions d'API sont dépréciées ou supprimées dans une version de Kubernetes. Pour les charts identifiés, vous devez vérifier la dernière version du chart (qui a des versions d'API prises en charge) ou mettre à jour le chart vous-même.

De plus, vous devez également auditer les charts déployés (c'est-à-dire les releases Helm) en vérifiant à nouveau les versions d'API dépréciées ou supprimées. Cela peut être fait en obtenant les détails d'une release en utilisant la commande `helm get manifest`.

Les moyens de mettre à jour une release Helm vers des APIs prises en charge dépendent de vos constations sont les suivants :

1. Si vous trouvez uniquement des versions d'API dépréciées :
   - Effectuez une `helm upgrade` avec une version du chart contenant des versions d'API Kubernetes prises en charge.
   - Ajoutez une description lors de la mise à niveau, précisant de ne pas effectuer de rollback vers une version Helm antérieure à cette version actuelle.

2. Si vous trouvez une ou plusieurs versions d'API qui sont supprimées dans une version de Kubernetes :
   - Si vous utilisez une version de Kubernetes où les versions d'API sont encore disponibles (par exemple, vous êtes sur Kubernetes 1.15 et vous avez trouvé que vous utilisez des APIs qui seront supprimées dans Kubernetes 1.16) :
     - Suivez la procédure de l'étape 1.
   - Sinon (par exemple, vous utilisez déjà une version de Kubernetes où certaines versions d'API signalées par `helm get manifest` ne sont plus disponibles) :
     - Vous devez éditer le manifeste de la release stocké dans le cluster pour mettre à jour les versions d'API vers des APIs prises en charge. Voir [Mise à jour des versions d'API d'un manifeste de release](#updating-api-versions-of-a-release-manifest) pour plus de détails.

> Remarque : Dans tous les cas de mise à jour d'une release Helm avec des APIs prises en charge, vous ne devez jamais faire de rollback de la release vers une version antérieure à la version de la release avec les APIs prises en charge.

> Recommandation : La meilleure pratique est de mettre à niveau les releases utilisant des versions d'API dépréciées vers des versions d'API prises en charge, avant de mettre à niveau vers un cluster Kubernetes qui supprime ces versions d'API.

Si vous ne mettez pas à jour une release comme suggéré précédemment, vous rencontrerez une erreur similaire à la suivante lorsque vous tenterez de mettre à niveau une release dans une version de Kubernetes où ses versions d'API sont supprimées :

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

Helm échoue dans ce scénario car il tente de créer un patch de différence entre la release actuellement déployée (qui contient les APIs Kubernetes supprimées dans cette version de Kubernetes) et le chart que vous passez avec les versions d'API mises à jour/prises en charge. La raison sous-jacente de l'échec est que lorsque Kubernetes supprime une version d'API, la bibliothèque cliente Go de Kubernetes ne peut plus analyser les objets dépréciés, et Helm échoue donc lorsqu'il appelle la bibliothèque. Malheureusement, Helm ne peut pas récupérer de cette situation et n'est plus en mesure de gérer une telle release. Voir [Mise à jour des versions d'API d'un manifeste de release](#mise-à-jour-des-versions-dapi-dun-manifeste-de-release) pour plus de détails sur la manière de récupérer de ce scénario.

## Mise à jour des versions d'API d'un manifeste de release

Le manifeste est une propriété de l'objet release Helm qui est stockée dans le champ de données d'un Secret (par défaut) ou d'un ConfigMap dans le cluster. Le champ de données contient un objet compressé en gzip qui est encodé en base 64 (il y a un encodage base 64 supplémentaire pour un Secret). Il y a un Secret/ConfigMap par version/révision de release dans l'espace de noms de la release.

Vous pouvez utiliser le plugin Helm [mapkubeapis](https://github.com/helm/helm-mapkubeapis) pour mettre à jour une release vers des APIs prises en charge. Consultez le README pour plus de détails.

Alternativement, vous pouvez suivre ces étapes manuelles pour mettre à jour les versions d'API d'un manifeste de release. En fonction de votre configuration, vous suivrez les étapes pour le backend Secret ou ConfigMap.

- Get the name of the Secret or Configmap associated with the latest deployed
  release:
- Backend Secrets : `kubectl get secret -l owner=helm,status=deployed,name=<release_name> --namespace <release_namespace> | awk '{print $1}' | grep -v NAME`
- Backend ConfigMap : `kubectl get configmap -l owner=helm,status=deployed,name=<release_name> --namespace <release_namespace> | awk '{print $1}' | grep -v NAME`

- Obtenez les détails de la release déployée :
  - Backend Secrets : `kubectl get secret <release_secret_name> -n <release_namespace> -o yaml > release.yaml`
  - Backend ConfigMap : `kubectl get configmap <release_configmap_name> -n <release_namespace> -o yaml > release.yaml`

- Sauvegardez la release au cas où vous auriez besoin de restaurer en cas de problème :
  - `cp release.yaml release.bak`
  - En cas d'urgence, restaurez : `kubectl apply -f release.bak -n <release_namespace>`

- Décodez l'objet release :
  - Backend Secrets : `cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d | base64 -d | gzip -d > release.data.decoded`
  - Backend ConfigMap : `cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d | gzip -d > release.data.decoded`

- Modifiez les versions d'API des manifests. Vous pouvez utiliser n'importe quel outil (par exemple, un éditeur) pour effectuer les modifications. Cela se trouve dans le champ `manifest` de votre objet release décodé (`release.data.decoded`).

- Encodez l'objet release :
  - Backend Secrets : `cat release.data.decoded | gzip | base64 | base64`
  - Backend ConfigMap : `cat release.data.decoded | gzip | base64`

- Remplacez la valeur de la propriété `data.release` dans le fichier de release déployé (`release.yaml`) par le nouvel objet release encodé.

- Appliquez le fichier dans l'espace de noms : `kubectl apply -f release.yaml -n <release_namespace>`

- Effectuez une `helm upgrade` avec une version du chart contenant des versions d'API Kubernetes prises en charge.

- Ajoutez une description lors de la mise à niveau, précisant de ne pas effectuer de rollback vers une version Helm antérieure à cette version actuelle.
