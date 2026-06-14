---
title: Utiliser des registres basés sur OCI
description: Décrit comment utiliser OCI pour la distribution de charts.
sidebar_position: 7
---

À partir de Helm 3, vous pouvez utiliser des registres de conteneurs compatibles [OCI](https://www.opencontainers.org/) pour stocker et partager des packages de charts. À partir de Helm v3.8.0, le support OCI est activé par défaut.


## Support OCI avant la version v3.8.0

Le support OCI est passé du statut expérimental à la disponibilité générale avec Helm v3.8.0. Dans les versions antérieures de Helm, le support OCI fonctionnait différemment. Si vous utilisiez le support OCI avant Helm v3.8.0, il est important de comprendre ce qui a changé selon les versions de Helm.

### Activer le support OCI avant la version v3.8.0

Avant Helm v3.8.0, le support OCI est *expérimental* et doit être activé manuellement.

Pour activer le support OCI expérimental pour les versions de Helm antérieures à v3.8.0, définissez `HELM_EXPERIMENTAL_OCI` dans votre environnement. Par exemple :

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Dépréciation de fonctionnalités OCI et changements de comportement avec la v3.8.0

Avec la release de [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0), les fonctionnalités et comportements suivants diffèrent des versions précédentes de Helm :

- Lors de la définition d'un chart dans les dépendances en tant qu'OCI, la version peut être définie comme une plage, comme pour les autres dépendances.
- Les tags SemVer incluant des informations de build peuvent être poussés et utilisés. Les registres OCI ne supportent pas le caractère `+` dans les tags. Helm convertit le `+` en `_` lors du stockage en tant que tag.
- La commande `helm registry login` suit désormais la même structure que la CLI Docker pour le stockage des identifiants. Le même emplacement de configuration de registre peut être utilisé à la fois par Helm et par la CLI Docker.

### Dépréciation de fonctionnalités OCI et changements de comportement avec la v3.7.0

Avec la release de [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0), l'implémentation de [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) pour le support OCI a été incluse. En conséquence, les fonctionnalités et comportements suivants diffèrent des versions précédentes de Helm :

- La sous-commande `helm chart` a été supprimée.
- Le cache de charts a été supprimé (plus de `helm chart list`, etc.).
- Les références aux registres OCI sont désormais toujours préfixées par `oci://`.
- Le nom de base de la référence au registre doit *toujours* correspondre au nom du chart.
- Le tag de la référence au registre doit *toujours* correspondre à la version sémantique du chart (c'est-à-dire pas de tags `latest`).
- Le type de média de la couche du chart a été modifié de `application/tar+gzip` à `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.


## Utiliser un registre basé sur OCI

### Dépôts Helm dans des registres basés sur OCI

Un [dépôt Helm](/topics/chart_repository.md) est un moyen d'héberger et de distribuer des charts Helm packagés. Un registre basé sur OCI peut contenir zéro ou plusieurs dépôts Helm, et chacun de ces dépôts peut contenir zéro ou plusieurs charts Helm packagés.

### Utiliser des registres hébergés

Il existe plusieurs registres de conteneurs hébergés avec support OCI que vous pouvez utiliser pour vos charts Helm. Par exemple :

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)
  

Consultez la documentation de votre fournisseur de registre de conteneurs hébergé pour créer et configurer un registre compatible OCI.

**Note :**  Vous pouvez exécuter [Docker Registry](https://docs.docker.com/registry/deploying/) ou [`zot`](https://github.com/project-zot/zot), qui sont des registres basés sur OCI, sur votre poste de développement. L'exécution d'un registre basé sur OCI sur votre poste de développement ne devrait être utilisée qu'à des fins de test.

### Utiliser Sigstore pour signer des charts basés sur OCI

Le plugin [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) permet d'utiliser [Sigstore](https://sigstore.dev/) pour signer des charts Helm avec les mêmes outils utilisés pour signer des images de conteneurs. Cela offre une alternative à la [provenance basée sur GPG](/topics/provenance.md) supportée par les [dépôts de charts](/topics/chart_repository.md) classiques.

Pour plus de détails sur l'utilisation du plugin `helm sigstore`, consultez [la documentation de ce projet](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Commandes pour travailler avec les registres

### La sous-commande `registry`

#### `login`

Se connecter à un registre (avec saisie manuelle du mot de passe)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

Se déconnecter d'un registre

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### La sous-commande `push`

Téléverser un chart vers un registre basé sur OCI :

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

La sous-commande `push` s'utilise uniquement avec des fichiers `.tgz` créés au préalable avec `helm package`.

Lors de l'utilisation de `helm push` pour téléverser un chart vers un registre OCI, la référence doit être préfixée par `oci://` et ne doit pas contenir le nom de base ni le tag.

Le nom de base de la référence au registre est déduit du nom du chart, et le tag est déduit de la version sémantique du chart. Il s'agit actuellement d'une exigence stricte.

Certains registres nécessitent que le dépôt et/ou le namespace (si spécifié) soient créés au préalable. Sinon, une erreur sera produite lors de l'opération `helm push`.

Si vous avez créé un [fichier de provenance](/topics/provenance.md) (`.prov`) et qu'il est présent à côté du fichier `.tgz` du chart, il sera automatiquement téléversé vers le registre lors du `push`. Cela ajoute une couche supplémentaire au [manifeste du chart Helm](#manifeste-du-chart-helm).

Les utilisateurs du [plugin helm-push](https://github.com/chartmuseum/helm-push) (pour téléverser des charts vers [ChartMuseum](/topics/chart_repository.md#chartmuseum-repository-server)) peuvent rencontrer des problèmes, car le plugin entre en conflit avec la nouvelle commande `push` intégrée. À partir de la version v0.10.0, le plugin a été renommé en `cm-push`.

### Autres sous-commandes

Le support du protocole `oci://` est également disponible dans plusieurs autres sous-commandes. Voici la liste complète :

- `helm pull`
- `helm push`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

Le nom de base (nom du chart) de la référence au registre *est* inclus pour tout type d'action impliquant le téléchargement d'un chart (contrairement à `helm push` où il est omis).

Voici quelques exemples d'utilisation des sous-commandes listées ci-dessus avec des charts basés sur OCI :

```
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## Installer des charts avec un digest

Installer un chart avec un digest est plus sécurisé qu'avec un tag car les digests sont immuables. Le digest est spécifié dans l'URI du chart :

```
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...
```

## Spécifier les dépendances

Les dépendances d'un chart peuvent être récupérées depuis un registre en utilisant la sous-commande `dependency update`.

Le `repository` pour une entrée donnée dans `Chart.yaml` est spécifié comme la référence au registre sans le nom de base :

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
Cela récupérera `oci://localhost:5000/myrepo/mychart:2.7.0` lors de l'exécution de `dependency update`.

## Manifeste du chart Helm

Exemple de manifeste de chart Helm tel que représenté dans un registre (remarquez les champs `mediaType`) :
```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

L'exemple suivant contient un [fichier de provenance](/topics/provenance.md) (notez la couche supplémentaire) :

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## Migration depuis des dépôts de charts

La migration depuis des [dépôts de charts](/topics/chart_repository.md) classiques (dépôts basés sur index.yaml) est aussi simple que d'utiliser `helm pull`, puis `helm push` pour téléverser les fichiers `.tgz` résultants vers un registre.
