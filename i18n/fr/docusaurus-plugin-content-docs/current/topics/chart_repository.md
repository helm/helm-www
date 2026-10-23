---
title: Guide des dépôts de charts
description: Comment créer et utiliser des dépôts de charts Helm.
sidebar_position: 6
default_lang_commit: 944aeaca4df514e7c5ba091995fcbbc08e505f65
---

Cette section explique comment créer et utiliser des dépôts de charts Helm.
Dans les grandes lignes, un dépôt de charts est un emplacement où l'on peut
stocker et partager des charts empaquetés.

Le dépôt communautaire distribué de charts Helm se trouve sur
[Artifact Hub](https://artifacthub.io/packages/search?kind=0), et toute
participation y est la bienvenue. Mais Helm permet aussi de créer et
d'exploiter votre propre dépôt de charts. Ce guide explique comment faire. Si vous
comptez créer un dépôt de charts, un [registre OCI](/topics/registries.mdx)
peut être une alternative à envisager.

## Prérequis {#prerequisites}

* Suivre le guide de [démarrage rapide](/intro/quickstart.md)
* Lire le document sur les [charts](/topics/charts.mdx)

## Créer un dépôt de charts {#create-a-chart-repository}

Un _dépôt de charts_ est un serveur HTTP qui héberge un fichier `index.yaml` et,
éventuellement, des charts empaquetés. Lorsque vous êtes prêt à partager vos
charts, la méthode recommandée est de les téléverser dans un dépôt de charts.

Depuis Helm 2.2.0, Helm prend en charge l'authentification SSL côté client
auprès d'un dépôt. D'autres protocoles d'authentification peuvent être
disponibles sous forme de plugins.

Comme un dépôt de charts peut être n'importe quel serveur HTTP capable de servir
des fichiers YAML et tar et de répondre aux requêtes GET, vous avez de très
nombreuses possibilités pour héberger votre propre dépôt de charts. Par exemple,
vous pouvez utiliser un bucket Google Cloud Storage (GCS), un bucket Amazon S3,
GitHub Pages, ou même créer votre propre serveur web.

### Structure d'un dépôt de charts {#the-chart-repository-structure}

Un dépôt de charts se compose de charts empaquetés et d'un fichier spécial,
`index.yaml`, qui contient l'index de tous les charts du dépôt. Souvent, les
charts décrits par `index.yaml` sont hébergés sur le même serveur que ce
fichier, tout comme les [fichiers de provenance](/topics/provenance.mdx).

Par exemple, l'arborescence du dépôt `https://example.com/charts` pourrait
ressembler à ceci :

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

Dans ce cas, le fichier d'index contiendrait les informations d'un seul chart,
le chart Alpine, et indiquerait l'URL de téléchargement
`https://example.com/charts/alpine-0.1.2.tgz` pour ce chart.

Il n'est pas obligatoire que le paquet d'un chart se trouve sur le même serveur
que le fichier `index.yaml`. C'est toutefois souvent le plus simple.

### Le fichier d'index {#the-index-file}

Le fichier d'index est un fichier YAML nommé `index.yaml`. Il contient des
métadonnées sur le paquet, dont le contenu du fichier `Chart.yaml` du chart. Un
dépôt de charts valide doit avoir un fichier d'index. Le fichier d'index contient
des informations sur chacun des charts du dépôt. La commande `helm repo index`
génère un fichier d'index à partir d'un répertoire local donné qui contient des
charts empaquetés.

Voici un exemple de fichier d'index :

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

## Héberger un dépôt de charts {#hosting-chart-repositories}

Cette partie présente plusieurs façons de servir un dépôt de charts.

### Google Cloud Storage {#google-cloud-storage}

La première étape consiste à **créer votre bucket GCS**. Nous appellerons le
nôtre `fantastic-charts`.

![Créer un bucket GCS](/img/helm2/create-a-bucket.png)

Ensuite, rendez votre bucket public en **modifiant ses autorisations**.

![Modifier les autorisations](/img/helm2/edit-permissions.png)

Ajoutez cette entrée pour **rendre votre bucket public** :

![Rendre le bucket public](/img/helm2/make-bucket-public.png)

Félicitations, vous avez maintenant un bucket GCS vide, prêt à servir des charts !

Vous pouvez téléverser votre dépôt de charts avec l'outil en ligne de commande
de Google Cloud Storage ou avec l'interface web de GCS. Un bucket GCS public est
accessible directement en HTTPS à cette adresse :
`https://bucket-name.storage.googleapis.com/`.

### Cloudsmith {#cloudsmith}

Vous pouvez aussi mettre en place des dépôts de charts avec Cloudsmith. Pour en
savoir plus sur les dépôts de charts avec Cloudsmith, consultez
[cette page](https://help.cloudsmith.io/docs/helm-chart-repository).

### JFrog Artifactory {#jfrog-artifactory}

De la même façon, vous pouvez mettre en place des dépôts de charts avec JFrog
Artifactory. Pour en savoir plus sur les dépôts de charts avec JFrog Artifactory,
consultez
[cette page](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories).

### Exemple avec GitHub Pages {#github-pages-example}

Sur le même principe, vous pouvez créer un dépôt de charts avec GitHub Pages.

GitHub permet de servir des pages web statiques de deux façons :

- En configurant un projet pour qu'il serve le contenu de son répertoire `docs/`
- En configurant un projet pour qu'il serve une branche donnée

Nous allons utiliser la seconde méthode, mais la première est tout aussi simple.

La première étape consiste à **créer votre branche gh-pages**. Vous pouvez le
faire en local ainsi :

```console
$ git checkout -b gh-pages
```

Ou depuis le navigateur, avec le bouton **Branch** de votre dépôt GitHub :

![Créer une branche GitHub Pages](/img/helm2/create-a-gh-page-button.png)

Ensuite, assurez-vous que votre **branche gh-pages** est bien configurée comme
source de GitHub Pages : cliquez sur **Settings** dans votre dépôt, descendez
jusqu'à la section **GitHub pages** et réglez-la comme ci-dessous :

![Configurer GitHub Pages](/img/helm2/set-a-gh-page.png)

Par défaut, **Source** est généralement réglé sur **gh-pages branch**. Si ce
n'est pas le cas, sélectionnez cette valeur.

Vous pouvez aussi y configurer un **domaine personnalisé** si vous le souhaitez.

Vérifiez aussi que la case **Enforce HTTPS** est cochée, pour que les charts
soient servis en **HTTPS**.

Avec cette configuration, vous pouvez stocker le code de vos charts dans votre
branche par défaut, et utiliser la **branche gh-pages** comme dépôt de charts,
par exemple : `https://USERNAME.github.io/REPONAME`. Le dépôt de démonstration
[TS Charts](https://github.com/technosophos/tscharts) est accessible à l'adresse
`https://technosophos.github.io/tscharts/`.

Si vous avez choisi GitHub Pages pour héberger votre dépôt de charts, consultez
[Chart Releaser Action](/howto/chart_releaser_action.md). Chart Releaser Action
est un workflow GitHub Actions qui transforme un projet GitHub en dépôt de charts
Helm auto-hébergé, à l'aide de l'outil en ligne de commande
[helm/chart-releaser](https://github.com/helm/chart-releaser).

### Serveurs web classiques {#ordinary-web-servers}

Pour servir des charts Helm depuis un serveur web classique, il suffit de :

- Placer votre fichier d'index et vos charts dans un répertoire que le serveur
  peut servir
- Vérifier que le fichier `index.yaml` est accessible sans authentification
- Vérifier que les fichiers `yaml` sont servis avec le bon type de contenu
  (`text/yaml` ou `text/x-yaml`)

Par exemple, si vous voulez servir vos charts depuis `$WEBROOT/charts`,
assurez-vous qu'il existe un répertoire `charts/` à la racine de votre site web,
et placez-y le fichier d'index et les charts.

### Serveur de dépôt ChartMuseum {#chartmuseum-repository-server}

ChartMuseum est un serveur open source de dépôt de charts Helm, écrit en Go
(Golang), qui prend en charge différents backends de stockage cloud, dont
[Google Cloud Storage](https://cloud.google.com/storage/),
[Amazon S3](https://aws.amazon.com/s3/),
[Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/),
[Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss),
[Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/),
[Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage),
[Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html),
[Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos),
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
[Minio](https://min.io/) et [etcd](https://etcd.io/).

Vous pouvez aussi utiliser le serveur
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
pour héberger un dépôt de charts à partir d'un système de fichiers local.

### GitLab Package Registry {#gitlab-package-registry}

Avec GitLab, vous pouvez publier des charts Helm dans le Package Registry de
votre projet. Pour en savoir plus sur la mise en place d'un dépôt de paquets Helm
avec GitLab, consultez
[cette page](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Gérer un dépôt de charts {#managing-chart-repositories}

Maintenant que vous avez un dépôt de charts, la dernière partie de ce guide
explique comment y gérer vos charts.


### Stocker des charts dans votre dépôt de charts {#store-charts-in-your-chart-repository}

Maintenant que vous avez un dépôt de charts, téléversons-y un chart et un fichier
d'index. Les charts d'un dépôt de charts doivent être empaquetés
(`helm package chart-name/`) et correctement versionnés (selon les règles de
[SemVer 2](https://semver.org/)).

Les étapes suivantes donnent un exemple de workflow, mais vous êtes libre
d'utiliser le workflow de votre choix pour stocker et mettre à jour les charts de
votre dépôt.

Une fois votre chart empaqueté, créez un nouveau répertoire et déplacez-y le
paquet.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

La dernière commande prend le chemin du répertoire local que vous venez de créer
et l'URL de votre dépôt de charts distant, puis génère un fichier `index.yaml`
dans ce répertoire.

Vous pouvez maintenant téléverser le chart et le fichier d'index dans votre dépôt
de charts, avec un outil de synchronisation ou à la main. Si vous utilisez Google
Cloud Storage, consultez cet
[exemple de workflow](/howto/chart_repository_sync_example.md) qui utilise le
client gsutil. Pour GitHub, il suffit de placer les charts dans la branche de
destination prévue.

### Ajouter de nouveaux charts à un dépôt existant {#add-new-charts-to-an-existing-repository}

Chaque fois que vous voulez ajouter un nouveau chart à votre dépôt, vous devez
régénérer l'index. La commande `helm repo index` reconstruit entièrement le
fichier `index.yaml`, en n'y incluant que les charts qu'elle trouve en local.

Vous pouvez toutefois utiliser l'option `--merge` pour ajouter de nouveaux charts
au fur et à mesure à un fichier `index.yaml` existant (une très bonne solution
avec un dépôt distant comme GCS). Lancez `helm repo index --help` pour en savoir
plus.

Veillez à téléverser à la fois le fichier `index.yaml` mis à jour et le chart,
ainsi que le fichier de provenance si vous en avez généré un.

### Partager vos charts {#share-your-charts-with-others}

Lorsque vous êtes prêt à partager vos charts, il suffit de communiquer l'URL de
votre dépôt.

Les utilisateurs ajouteront alors le dépôt à leur client Helm avec la commande
`helm repo add [NAME] [URL]`, en lui donnant le nom de leur choix pour y faire
référence.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Si les charts sont protégés par une authentification HTTP Basic, vous pouvez
aussi indiquer ici le nom d'utilisateur et le mot de passe :

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Remarque :** un dépôt n'est pas ajouté s'il ne contient pas de fichier
`index.yaml` valide.

**Remarque :** si votre dépôt Helm utilise par exemple un certificat auto-signé,
vous pouvez utiliser `helm repo add --insecure-skip-tls-verify ...` pour ignorer
la vérification de l'autorité de certification (CA).

Vos utilisateurs pourront ensuite rechercher vos charts. Après une mise à jour de
votre dépôt, ils pourront utiliser la commande `helm repo update` pour obtenir les
dernières informations sur les charts.

*En coulisses, les commandes `helm repo add` et `helm repo update` récupèrent le
fichier index.yaml et le stockent dans le répertoire
`$XDG_CACHE_HOME/helm/repository/cache/`. C'est là que la commande `helm search`
trouve les informations sur les charts.*
