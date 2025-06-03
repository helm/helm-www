---
title: "Guide des dépôts de charts"
description: "Comment créer et travailler avec des dépôts de charts Helm"
weight: 6
---

Cette section explique comment créer et travailler avec des dépôts de charts Helm. À un niveau élevé, un dépôt de charts est un emplacement où les charts emballés peuvent être stockés et partagés.

Le dépôt de charts Helm communautaire distribué est situé sur [Artifact Hub](https://artifacthub.io/packages/search?kind=0) et accueille la participation. Cependant, Helm permet également de créer et de gérer votre propre dépôt de charts. Ce guide explique comment procéder. Si vous envisagez de créer un dépôt de charts, vous pourriez envisager d'utiliser à la place un [registre OCI]({{< ref "../topics/registries" >}}).

## Prérequis

* Consultez le guide [Quickstart]({{< ref "quickstart.md" >}})
* Lisez le document [Charts]({{< ref "charts.md" >}})

## Créer un dépôt de charts

Un _dépôt de charts_ est un serveur HTTP qui contient un fichier `index.yaml` et éventuellement des charts emballés. Lorsque vous êtes prêt à partager vos charts, la méthode recommandée est de les télécharger sur un dépôt de charts.

Depuis Helm 2.2.0, l'authentification SSL côté client pour un dépôt est prise en charge. D'autres protocoles d'authentification peuvent être disponibles sous forme de plugins.

Parce qu'un dépôt de charts peut être n'importe quel serveur HTTP capable de servir des fichiers YAML et tar et de répondre aux requêtes GET, vous avez de nombreuses options pour héberger votre propre dépôt de charts. Par exemple, vous pouvez utiliser un bucket Google Cloud Storage (GCS), un bucket Amazon S3, GitHub Pages, ou même créer votre propre serveur web.

### La structure du dépôt de charts

Un dépôt de charts se compose de charts emballés et d'un fichier spécial appelé `index.yaml`, qui contient un index de tous les charts dans le dépôt. Souvent, les charts décrits par `index.yaml` sont également hébergés sur le même serveur, tout comme les [fichiers de provenance]({{< ref "provenance.md" >}}).

Par exemple, la structure du dépôt `https://example.com/charts` pourrait ressembler à ceci :

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

Dans ce cas, le fichier index contiendrait des informations sur un chart, le chart Alpine, et fournirait l'URL de téléchargement `https://example.com/charts/alpine-0.1.2.tgz` pour ce chart.

Il n'est pas nécessaire qu'un package de chart soit situé sur le même serveur que le fichier `index.yaml`. Cependant, cela est souvent le plus simple.

### Le fichier index

Le fichier d'index est un fichier YAML appelé `index.yaml`. Il contient des métadonnées sur le package, y compris le contenu du fichier `Chart.yaml` d'un chart. Un dépôt de charts valide doit avoir un fichier d'index. Le fichier d'index contient des informations sur chaque chart dans le dépôt de charts. La commande `helm repo index` générera un fichier d'index basé sur un répertoire local donné contenant des charts emballés.

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

## Hébergement des dépôts de charts

Cette section présente plusieurs façons de servir un dépôt de charts.

### Google Cloud Storage

La première étape est de **créer votre bucket GCS**. Nous l'appellerons `fantastic-charts`.

![Create a GCS Bucket](https://helm.sh/img/create-a-bucket.png)

Ensuite, rendez votre bucket public en **modifiant les autorisations du bucket**.

![Edit Permissions](https://helm.sh/img/edit-permissions.png)

Ajoutez cette ligne pour **rendre votre bucket public** :

![Make Bucket Public](https://helm.sh/img/make-bucket-public.png)

Félicitations, vous avez maintenant un bucket GCS vide prêt à servir des charts !

Vous pouvez télécharger votre dépôt de charts en utilisant l'outil en ligne de commande Google Cloud Storage, ou via l'interface web GCS. Un bucket GCS public peut être accédé via HTTPS à cette adresse : `https://bucket-name.storage.googleapis.com/`.

### Cloudsmith

Vous pouvez également configurer des dépôts de charts en utilisant Cloudsmith. Pour en savoir plus sur les dépôts de charts avec Cloudsmith, consultez [ce lien](https://help.cloudsmith.io/docs/helm-chart-repository).

### JFrog Artifactory

De la même manière, vous pouvez également configurer des dépôts de charts en utilisant JFrog Artifactory. Pour en savoir plus sur les dépôts de charts avec JFrog Artifactory, consultez [ce lien](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories).

### Exemple de GitHub Pages

De manière similaire, vous pouvez créer des dépôts de charts en utilisant GitHub Pages.

GitHub permet de servir des pages web statiques de deux manières différentes :

- En configurant un projet pour servir le contenu de son répertoire `docs/`
- En configurant un projet pour servir une branche particulière

Nous allons adopter la seconde approche, bien que la première soit tout aussi simple.

La première étape sera de **créer votre branche gh-pages**. Vous pouvez le faire localement comme suit :
```console
$ git checkout -b gh-pages
```

Ou via un navigateur web en utilisant le bouton **Branch** sur votre dépôt GitHub :

![Create GitHub Pages branch](https://helm.sh/img/create-a-gh-page-button.png)

Next, you'll want to make sure your **gh-pages branch** is set as GitHub Pages,
click on your repo **Settings** and scroll down to **GitHub pages** section and
set as per below:

![Create GitHub Pages branch](https://helm.sh/img/set-a-gh-page.png)

Par défaut, la **Source** est généralement définie sur **gh-pages branch**. Si ce n'est pas le cas par défaut, sélectionnez-la.

Vous pouvez utiliser un **domaine personnalisé** si vous le souhaitez.

Assurez-vous également que **Enforce HTTPS** est coché, afin que le **HTTPS** soit utilisé lorsque les charts sont servis.

Dans ce type de configuration, vous pouvez utiliser votre branche par défaut pour stocker le code de vos charts, et la **branche gh-pages** comme dépôt de charts, par exemple : `https://USERNAME.github.io/REPONAME`. Le dépôt de démonstration [TS Charts](https://github.com/technosophos/tscharts) est accessible à `https://technosophos.github.io/tscharts/`.

Si vous avez décidé d'utiliser GitHub Pages pour héberger le dépôt de charts, consultez l'[Action Chart Releaser]({{< ref "/docs/howto/chart_releaser_action.md" >}}). L'Action Chart Releaser est un workflow GitHub Action qui transforme un projet GitHub en un dépôt Helm chart auto-hébergé, en utilisant l'outil en ligne de commande [helm/chart-releaser](https://github.com/helm/chart-releaser).

### Serveurs Web ordinaires

Pour configurer un serveur web ordinaire pour servir des charts Helm, vous devez simplement faire ce qui suit :

- Placez votre index et vos charts dans un répertoire que le serveur peut servir
- Assurez-vous que le fichier `index.yaml` est accessible sans exigence d'authentification
- Assurez-vous que les fichiers `yaml` sont servis avec le type de contenu correct (`text/yaml` ou `text/x-yaml`)

Par exemple, si vous souhaitez servir vos charts depuis `$WEBROOT/charts`, assurez-vous qu'il y a un répertoire `charts/` dans votre racine web, et placez le fichier d'index et les charts à l'intérieur de ce dossier.

### Serveur de dépôt ChartMuseum

ChartMuseum est un serveur de dépôt de charts Helm open-source écrit en Go (Golang), avec support pour des backends de stockage en cloud, incluant [Google Cloud Storage](https://cloud.google.com/storage/), [Amazon S3](https://aws.amazon.com/s3/), [Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/), [Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss), [Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/), [Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage), [Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html), [Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/), [Minio](https://min.io/), et [etcd](https://etcd.io/).

Vous pouvez également utiliser le serveur [ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) pour héberger un dépôt de charts à partir d'un système de fichiers local.

### GitLab Package Registry

Avec GitLab, vous pouvez publier des charts Helm dans le registre de packages de votre projet. Pour en savoir plus sur la configuration d'un dépôt de packages Helm avec GitLab, consultez [ce lien](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Gestion des dépôts de charts

Maintenant que vous avez un dépôt de charts, la dernière partie de ce guide explique comment maintenir les charts dans ce dépôt.


### Stocker des charts dans votre dépôt de charts

Maintenant que vous avez un dépôt de charts, téléchargeons un chart et un fichier d'index dans le dépôt. Les charts dans un dépôt de charts doivent être empaquetés (`helm package chart-name/`) et correctement versionnés (en suivant les directives de [SemVer 2](https://semver.org/)).

Ces prochaines étapes composent un exemple de workflow, mais vous êtes libre d'utiliser le workflow de votre choix pour stocker et mettre à jour les charts dans votre dépôt de charts.

Une fois que vous avez un chart empaqueté prêt, créez un nouveau répertoire et déplacez votre chart empaqueté dans ce répertoire.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

La dernière commande prend le chemin du répertoire local que vous venez de créer et l'URL de votre dépôt de charts distant, puis compose un fichier `index.yaml` à l'intérieur du répertoire spécifié.

Vous pouvez maintenant télécharger le chart et le fichier d'index vers votre dépôt de charts en utilisant un outil de synchronisation ou manuellement. Si vous utilisez Google Cloud Storage, consultez cet [exemple de workflow]({{< ref "/docs/howto/chart_repository_sync_example.md" >}}) utilisant le client `gsutil`. Pour GitHub, vous pouvez simplement placer les charts dans la branche de destination appropriée.

### Ajouter de nouveaux charts à un dépôt existant

Chaque fois que vous souhaitez ajouter un nouveau chart à votre dépôt, vous devez régénérer l'index. La commande `helm repo index` reconstruira complètement le fichier `index.yaml` à partir de zéro, en incluant uniquement les charts qu'elle trouve localement.

Cependant, vous pouvez utiliser l'option `--merge` pour ajouter progressivement de nouveaux charts à un fichier `index.yaml` existant (ce qui est une excellente option lorsque vous travaillez avec un dépôt distant comme GCS). Exécutez `helm repo index --help` pour en savoir plus.

Assurez-vous de télécharger à la fois le fichier `index.yaml` révisé et le chart. Et si vous avez généré un fichier de provenance, téléchargez-le également.

### Partager vos charts avec vos amis

Lorsque vous êtes prêt à partager vos charts, informez simplement les autres de l'URL de votre dépôt.

À partir de là, ils ajouteront le dépôt à leur client Helm via la commande `helm repo add [NOM] [URL]` avec le nom de leur choix pour faire référence au dépôt.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Si les charts sont protégés par une authentification HTTP basique, vous pouvez également fournir le nom d'utilisateur et le mot de passe ici :

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Remarque :** Un dépôt ne sera pas ajouté s'il ne contient pas un fichier `index.yaml` valide.

**Remarque :** Si votre dépôt Helm utilise par exemple un certificat auto-signé, vous pouvez utiliser `helm repo add --insecure-skip-tls-verify ...` pour ignorer la vérification de l'autorité de certification (CA).

Après cela, vos utilisateurs pourront rechercher parmi vos charts. Après avoir mis à jour le dépôt, ils pourront utiliser la commande `helm repo update` pour obtenir les dernières informations sur les charts.

*En interne, les commandes `helm repo add` et `helm repo update` récupèrent le fichier `index.yaml` et les stockent dans le répertoire `$XDG_CACHE_HOME/helm/repository/cache/`. C'est là que la fonction `helm search` trouve les informations sur les charts.*
