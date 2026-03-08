---
title: APIs Kubernetes dépréciées
description: Explique les APIs Kubernetes dépréciées dans Helm
---

Kubernetes est un système basé sur les APIs, et l'API évolue au fil du temps
pour refléter une meilleure compréhension des problématiques. C'est une pratique
courante pour les systèmes et leurs APIs. Une partie importante de l'évolution
des APIs est d'avoir une bonne politique et un bon processus de dépréciation
pour informer les utilisateurs de la manière dont les changements d'API sont
implémentés. En d'autres termes, les consommateurs de votre API doivent savoir à
l'avance et dans quelle version une API sera supprimée ou modifiée. Cela évite
les surprises et les changements incompatibles pour les consommateurs.

La [politique de dépréciation de
Kubernetes](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
documente comment Kubernetes gère les changements de ses versions d'API. Cette
politique précise la durée pendant laquelle les versions d'API seront supportées
après l'annonce de leur dépréciation. Il est donc important d'être attentif aux
annonces de dépréciation et de savoir quand les versions d'API seront
supprimées, afin de minimiser l'impact.

Voici un exemple d'annonce [concernant la suppression des versions d'API
dépréciées dans Kubernetes
1.16](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/), publiée
quelques mois avant la release. Ces versions d'API auraient également été
annoncées comme dépréciées auparavant. Cela montre qu'une bonne politique est en
place pour informer les consommateurs du support des versions d'API.

Les templates Helm spécifient un [groupe d'API
Kubernetes](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)
lors de la définition d'un objet Kubernetes, de manière similaire à un fichier
manifeste Kubernetes. Ce groupe est spécifié dans le champ `apiVersion` du
template et identifie la version d'API de l'objet Kubernetes. Cela signifie que
les utilisateurs de Helm et les mainteneurs de charts doivent être attentifs aux
versions d'API Kubernetes qui ont été dépréciées et dans quelle version de
Kubernetes elles seront supprimées.

## Mainteneurs de charts

Vous devez auditer vos charts pour vérifier les versions d'API Kubernetes qui
sont dépréciées ou supprimées dans une version de Kubernetes. Les versions d'API
identifiées comme devant être ou étant désormais hors support doivent être mises
à jour vers la version supportée et une nouvelle version du chart doit être
publiée. La version d'API est définie par les champs `kind` et `apiVersion`. Par
exemple, voici une version d'API de l'objet `Deployment` supprimée dans
Kubernetes 1.16 :

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Utilisateurs de Helm

Vous devez auditer les charts que vous utilisez (de la même manière que les
[mainteneurs de charts](#mainteneurs-de-charts)) et identifier ceux dont les
versions d'API sont dépréciées ou supprimées dans une version de Kubernetes.
Pour les charts identifiés, vous devez vérifier si une version plus récente du
chart (avec des versions d'API supportées) existe ou mettre à jour le chart
vous-même.

De plus, vous devez également auditer les charts déployés (c'est-à-dire les
releases Helm) en vérifiant à nouveau les versions d'API dépréciées ou
supprimées. Cela peut être fait en obtenant les détails d'une release à l'aide
de la commande `helm get manifest`.

La méthode pour mettre à jour une release Helm vers des APIs supportées dépend
de vos constatations :

1. Si vous ne trouvez que des versions d'API dépréciées :
  - Effectuez un `helm upgrade` avec une version du chart utilisant des versions
    d'API Kubernetes supportées
  - Ajoutez une description lors de la mise à niveau, indiquant de ne pas
    effectuer de rollback vers une version de Helm antérieure à cette version
    actuelle
2. Si vous trouvez des version(s) d'API supprimée(s) dans une version de
   Kubernetes :
  - Si vous utilisez une version de Kubernetes où la ou les version(s) d'API
    sont encore disponibles (par exemple, vous êtes sur Kubernetes 1.15 et vous
    utilisez des APIs qui seront supprimées dans Kubernetes 1.16) :
    - Suivez la procédure de l'étape 1
  - Sinon (par exemple, vous utilisez déjà une version de Kubernetes où
    certaines versions d'API rapportées par `helm get manifest` ne sont plus
    disponibles) :
    - Vous devez modifier le manifeste de release stocké dans le cluster pour
      mettre à jour les versions d'API vers des APIs supportées. Consultez
      [Mise à jour des versions d'API d'un manifeste de
      release](#mise-à-jour-des-versions-dapi-dun-manifeste-de-release) pour
      plus de détails

> Remarque : Dans tous les cas de mise à jour d'une release Helm avec des APIs
supportées, vous ne devez jamais effectuer de rollback de la release vers une
version antérieure à la version de release avec les APIs supportées.

> Recommandation : La bonne pratique consiste à mettre à niveau les releases
utilisant des versions d'API dépréciées vers des versions d'API supportées,
avant de mettre à niveau vers un cluster Kubernetes qui supprime ces versions
d'API.

Si vous ne mettez pas à jour une release comme suggéré précédemment, vous
obtiendrez une erreur similaire à la suivante lors de la tentative de mise à
niveau d'une release dans une version de Kubernetes où sa ou ses version(s)
d'API est/sont supprimée(s) :

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

Helm échoue dans ce scénario car il tente de créer un patch de différences entre
la release actuellement déployée (qui contient les APIs Kubernetes supprimées
dans cette version de Kubernetes) et le chart que vous passez avec les versions
d'API mises à jour/supportées. La raison sous-jacente de l'échec est que lorsque
Kubernetes supprime une version d'API, la bibliothèque client Go de Kubernetes
ne peut plus parser les objets dépréciés, et Helm échoue donc lors de l'appel à
la bibliothèque. Helm ne peut malheureusement pas récupérer de cette situation
et n'est plus en mesure de gérer une telle release. Consultez [Mise à jour des
versions d'API d'un manifeste de release](#mise-à-jour-des-versions-dapi-dun-manifeste-de-release)
pour savoir comment récupérer de ce scénario.

## Mise à jour des versions d'API d'un manifeste de release

Le manifeste est une propriété de l'objet release Helm qui est stockée dans le
champ data d'un Secret (par défaut) ou d'un ConfigMap dans le cluster. Le champ
data contient un objet compressé en gzip et encodé en base 64 (il y a un
encodage base 64 supplémentaire pour un Secret). Il y a un Secret/ConfigMap par
version/révision de release dans le namespace de la release.

Vous pouvez utiliser le plugin Helm
[mapkubeapis](https://github.com/helm/helm-mapkubeapis) pour effectuer la mise à
jour d'une release vers des APIs supportées. Consultez le readme pour plus de
détails.

Alternativement, vous pouvez suivre ces étapes manuelles pour effectuer une mise
à jour des versions d'API d'un manifeste de release. Selon votre configuration,
vous suivrez les étapes pour le backend Secret ou ConfigMap.

- Obtenez le nom du Secret ou ConfigMap associé à la dernière release déployée :
  - Backend Secrets : `kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - Backend ConfigMap : `kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- Obtenez les détails de la dernière release déployée :
  - Backend Secrets : `kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - Backend ConfigMap : `kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- Sauvegardez la release au cas où vous auriez besoin de la restaurer si quelque
  chose tourne mal :
  - `cp release.yaml release.bak`
  - En cas d'urgence, restaurez : `kubectl apply -f release.bak -n
    <release_namespace>`
- Décodez l'objet release :
  - Backend Secrets : `cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - Backend ConfigMap : `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- Modifiez les versions d'API des manifestes. Vous pouvez utiliser n'importe
  quel outil (par exemple, un éditeur) pour effectuer les modifications. Cela se
  trouve dans le champ `manifest` de votre objet release décodé
  (`release.data.decoded`)
- Encodez l'objet release :
  - Backend Secrets : `cat release.data.decoded | gzip | base64 | base64`
  - Backend ConfigMap : `cat release.data.decoded | gzip | base64`
- Remplacez la valeur de la propriété `data.release` dans le fichier de release
  déployée (`release.yaml`) par le nouvel objet release encodé
- Appliquez le fichier au namespace : `kubectl apply -f release.yaml -n
  <release_namespace>`
- Effectuez un `helm upgrade` avec une version du chart utilisant des versions
  d'API Kubernetes supportées
- Ajoutez une description lors de la mise à niveau, indiquant de ne pas
  effectuer de rollback vers une version de Helm antérieure à cette version
  actuelle
