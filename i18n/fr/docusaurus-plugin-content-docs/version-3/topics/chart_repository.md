---
title: Guide des dépôts de charts
description: Comment créer et travailler avec les dépôts de charts Helm.
sidebar_position: 6
---

Cette section explique comment créer et travailler avec les dépôts de charts Helm.
Un dépôt de charts est un emplacement où les charts empaquetés peuvent être stockés
et partagés.

Le dépôt communautaire distribué de charts Helm se trouve sur
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) et accueille les
contributions. Cependant, Helm permet également de créer et d'héberger votre propre
dépôt de charts. Ce guide explique comment procéder. Si vous envisagez de créer un
dépôt de charts, vous pourriez considérer l'utilisation d'un
[registre OCI](./registries.md) à la place.

## Prérequis

* Parcourir le guide de [Démarrage rapide](../intro/quickstart.md)
* Lire le document sur les [Charts](./charts.md)

## Créer un dépôt de charts

Un _dépôt de charts_ est un serveur HTTP qui héberge un fichier `index.yaml` ainsi
que des charts empaquetés. Lorsque vous êtes prêt à partager vos charts, la méthode
recommandée est de les téléverser vers un dépôt de charts.

Depuis Helm 2.2.0, l'authentification SSL côté client est supportée pour les dépôts.
D'autres protocoles d'authentification peuvent être disponibles via des plugins.

Puisqu'un dépôt de charts peut être n'importe quel serveur HTTP capable de servir
des fichiers YAML et tar et de répondre aux requêtes GET, vous avez de nombreuses
options pour héberger votre propre dépôt de charts. Par exemple, vous pouvez
utiliser un bucket Google Cloud Storage (GCS), un bucket Amazon S3, GitHub Pages,
ou même créer votre propre serveur web.

### Structure du dépôt de charts

Un dépôt de charts se compose de charts empaquetés et d'un fichier spécial appelé
`index.yaml` qui contient un index de tous les charts du dépôt. Souvent, les charts
décrits par `index.yaml` sont également hébergés sur le même serveur, tout comme
les [fichiers de provenance](./provenance.md).

Par exemple, la structure du dépôt `https://example.com/charts` pourrait ressembler
à ceci :

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

Dans ce cas, le fichier index contiendrait des informations sur un seul chart, le
chart Alpine, et fournirait l'URL de téléchargement
`https://example.com/charts/alpine-0.1.2.tgz` pour ce chart.

Il n'est pas obligatoire que le package du chart soit situé sur le même serveur que
le fichier `index.yaml`. Cependant, c'est souvent la solution la plus simple.

### Le fichier index

Le fichier index est un fichier yaml appelé `index.yaml`. Il contient des métadonnées
sur le package, y compris le contenu du fichier `Chart.yaml` du chart. Un dépôt de
charts valide doit avoir un fichier index. Le fichier index contient des informations
sur chaque chart dans le dépôt. La commande `helm repo index` génère un fichier index
à partir d'un répertoire local donné contenant des charts empaquetés.

Voici un exemple de fichier index :

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## Héberger des dépôts de charts

Cette partie présente plusieurs façons de servir un dépôt de charts.

### Google Cloud Storage

La première étape est de **créer votre bucket GCS**. Nous appellerons le nôtre
`fantastic-charts`.

![Créer un bucket GCS](/img/helm2/create-a-bucket.png)

Ensuite, rendez votre bucket public en **modifiant les permissions du bucket**.

![Modifier les permissions](/img/helm2/edit-permissions.png)

Ajoutez cette ligne pour **rendre votre bucket public** :

![Rendre le bucket public](/img/helm2/make-bucket-public.png)

Félicitations, vous avez maintenant un bucket GCS vide prêt à servir des charts !

Vous pouvez téléverser votre dépôt de charts en utilisant l'outil en ligne de
commande Google Cloud Storage ou via l'interface web GCS. Un bucket GCS public
est accessible via HTTPS simple à cette adresse : `https://bucket-name.storage.googleapis.com/`.

### Cloudsmith

Vous pouvez également configurer des dépôts de charts en utilisant Cloudsmith.
Pour en savoir plus sur les dépôts de charts avec Cloudsmith, consultez
[cette documentation](https://help.cloudsmith.io/docs/helm-chart-repository).

### JFrog Artifactory

De même, vous pouvez configurer des dépôts de charts en utilisant JFrog Artifactory.
Pour en savoir plus sur les dépôts de charts avec JFrog Artifactory, consultez
[cette documentation](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories).

### Exemple avec GitHub Pages

De manière similaire, vous pouvez créer un dépôt de charts en utilisant GitHub Pages.

GitHub vous permet de servir des pages web statiques de deux manières différentes :

- En configurant un projet pour servir le contenu de son répertoire `docs/`
- En configurant un projet pour servir une branche particulière

Nous allons utiliser la seconde approche, bien que la première soit tout aussi simple.

La première étape sera de **créer votre branche gh-pages**. Vous pouvez le faire
localement ainsi :

```console
$ git checkout -b gh-pages
```

Ou via le navigateur web en utilisant le bouton **Branch** dans votre dépôt GitHub :

![Créer une branche GitHub Pages](/img/helm2/create-a-gh-page-button.png)

Ensuite, assurez-vous que votre **branche gh-pages** est définie comme source pour
GitHub Pages. Cliquez sur **Settings** de votre dépôt et descendez jusqu'à la section
**GitHub pages** puis configurez comme suit :

![Configurer GitHub Pages](/img/helm2/set-a-gh-page.png)

Par défaut, **Source** est généralement défini sur **gh-pages branch**. Si ce n'est
pas le cas par défaut, sélectionnez-le.

Vous pouvez utiliser un **domaine personnalisé** si vous le souhaitez.

Et vérifiez que **Enforce HTTPS** est coché, afin que **HTTPS** soit utilisé lors
du service des charts.

Avec cette configuration, vous pouvez utiliser votre branche par défaut pour stocker
le code de vos charts et la **branche gh-pages** comme dépôt de charts, par exemple :
`https://USERNAME.github.io/REPONAME`. Le dépôt de démonstration
[TS Charts](https://github.com/technosophos/tscharts) est accessible à
`https://technosophos.github.io/tscharts/`.

Si vous avez décidé d'utiliser GitHub Pages pour héberger le dépôt de charts,
consultez [Chart Releaser Action](../howto/chart_releaser_action.md).
Chart Releaser Action est un workflow GitHub Action pour transformer un projet
GitHub en dépôt de charts Helm auto-hébergé, en utilisant l'outil CLI
[helm/chart-releaser](https://github.com/helm/chart-releaser).

### Serveurs web ordinaires

Pour configurer un serveur web ordinaire pour servir des charts Helm, vous devez
simplement faire ce qui suit :

- Placer votre fichier index et vos charts dans un répertoire que le serveur peut
  servir
- S'assurer que le fichier `index.yaml` est accessible sans exigence d'authentification
- S'assurer que les fichiers `yaml` sont servis avec le bon type de contenu
  (`text/yaml` ou `text/x-yaml`)

Par exemple, si vous voulez servir vos charts depuis `$WEBROOT/charts`, assurez-vous
qu'il y a un répertoire `charts/` dans votre racine web, et placez le fichier index
et les charts dans ce dossier.

### Serveur de dépôt ChartMuseum

ChartMuseum est un serveur de dépôt de charts Helm open-source écrit en Go (Golang),
avec support pour les backends de stockage cloud, notamment [Google Cloud
Storage](https://cloud.google.com/storage/), [Amazon
S3](https://aws.amazon.com/s3/), [Microsoft Azure Blob
Storage](https://azure.microsoft.com/en-us/services/storage/blobs/), [Alibaba
Cloud OSS Storage](https://www.alibabacloud.com/product/oss), [Openstack Object
Storage](https://developer.openstack.org/api-ref/object-store/), [Oracle Cloud
Infrastructure Object Storage](https://cloud.oracle.com/storage), [Baidu Cloud
BOS Storage](https://cloud.baidu.com/product/bos.html), [Tencent Cloud Object
Storage](https://intl.cloud.tencent.com/product/cos), [DigitalOcean
Spaces](https://www.digitalocean.com/products/spaces/),
[Minio](https://min.io/), et [etcd](https://etcd.io/).

Vous pouvez également utiliser le serveur
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
pour héberger un dépôt de charts depuis un système de fichiers local.

### GitLab Package Registry

Avec GitLab, vous pouvez publier des charts Helm dans le Package Registry de votre
projet. Pour en savoir plus sur la configuration d'un dépôt de packages Helm avec
GitLab, consultez [cette documentation](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Gérer les dépôts de charts

Maintenant que vous avez un dépôt de charts, la dernière partie de ce guide explique
comment maintenir les charts dans ce dépôt.

### Stocker des charts dans votre dépôt de charts

Maintenant que vous avez un dépôt de charts, téléversons un chart et un fichier index
vers le dépôt. Les charts dans un dépôt de charts doivent être empaquetés
(`helm package chart-name/`) et versionnés correctement (en suivant les directives
[SemVer 2](https://semver.org/)).

Les étapes suivantes composent un exemple de workflow, mais vous êtes libre d'utiliser
le workflow de votre choix pour stocker et mettre à jour les charts dans votre dépôt.

Une fois que vous avez un chart empaqueté prêt, créez un nouveau répertoire et
déplacez-y votre chart empaqueté.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

La dernière commande prend le chemin du répertoire local que vous venez de créer et
l'URL de votre dépôt de charts distant pour composer un fichier `index.yaml` dans
le répertoire donné.

Vous pouvez maintenant téléverser le chart et le fichier index vers votre dépôt de
charts en utilisant un outil de synchronisation ou manuellement. Si vous utilisez
Google Cloud Storage, consultez cet
[exemple de workflow](../howto/chart_repository_sync_example.md)
utilisant le client gsutil. Pour GitHub, vous pouvez simplement placer les charts
dans la branche de destination appropriée.

### Ajouter de nouveaux charts à un dépôt existant

Chaque fois que vous souhaitez ajouter un nouveau chart à votre dépôt, vous devez
régénérer l'index. La commande `helm repo index` reconstruira complètement le fichier
`index.yaml` à partir de zéro, en incluant uniquement les charts qu'elle trouve
localement.

Cependant, vous pouvez utiliser le flag `--merge` pour ajouter de nouveaux charts
de manière incrémentale à un fichier `index.yaml` existant (une excellente option
lorsque vous travaillez avec un dépôt distant comme GCS). Exécutez
`helm repo index --help` pour en savoir plus.

Assurez-vous de téléverser à la fois le fichier `index.yaml` révisé et le chart.
Et si vous avez généré un fichier de provenance, téléversez-le également.

### Partager vos charts avec d'autres

Lorsque vous êtes prêt à partager vos charts, communiquez simplement l'URL de
votre dépôt.

À partir de là, ils pourront ajouter le dépôt à leur client Helm via la commande
`helm repo add [NOM] [URL]` avec le nom de leur choix pour référencer le dépôt.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Si les charts sont protégés par une authentification HTTP basique, vous pouvez
également fournir le nom d'utilisateur et le mot de passe ici :

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Note :** Un dépôt ne sera pas ajouté s'il ne contient pas un fichier `index.yaml`
valide.

**Note :** Si votre dépôt Helm utilise par exemple un certificat auto-signé, vous
pouvez utiliser `helm repo add --insecure-skip-tls-verify ...` pour ignorer la
vérification du CA.

Après cela, vos utilisateurs pourront rechercher dans vos charts. Après avoir mis
à jour le dépôt, ils peuvent utiliser la commande `helm repo update` pour obtenir
les dernières informations sur les charts.

*En coulisses, les commandes `helm repo add` et `helm repo update` récupèrent le
fichier index.yaml et le stockent dans le répertoire
`$XDG_CACHE_HOME/helm/repository/cache/`. C'est là que la fonction `helm search`
trouve les informations sur les charts.*
