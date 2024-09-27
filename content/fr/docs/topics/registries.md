---
title: "Utiliser des registres basés sur OCI"
description: "Décrit comment utiliser OCI pour la distribution de Charts"
weight: 7
---

À partir de Helm 3, vous pouvez utiliser des registres de conteneurs avec la prise en charge d'[OCI](https://www.opencontainers.org/) pour stocker et partager des packages de charts. À partir de Helm v3.8.0, la prise en charge d'OCI est activée par défaut.


## Prise en charge d'OCI avant la version 3.8.0

La prise en charge d'OCI est passée du statut expérimental à la disponibilité générale avec Helm v3.8.0. Dans les versions antérieures de Helm, le support OCI fonctionnait différemment. Si vous utilisiez le support OCI avant Helm v3.8.0, il est important de comprendre ce qui a changé avec les différentes versions de Helm.

### Activer le support OCI avant la version v3.8.0

Avant Helm v3.8.0, le support OCI est *expérimental* et doit être activé.

Pour activer le support expérimental OCI pour les versions de Helm antérieures à la v3.8.0, définissez `HELM_EXPERIMENTAL_OCI` dans votre environnement. Par exemple :

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Fonctionnalités dépréciés d'OCI et changements de comportement avec la v3.8.0

Avec la sortie de [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0), les fonctionnalités et comportements suivants diffèrent des versions précédentes de Helm :

- Lors de la définition d'un chart dans les dépendances en tant qu'OCI, la version peut être définie sur une plage comme pour les autres dépendances.
- Les tags SemVer incluant des informations de build peuvent être poussés et utilisés. Les registres OCI ne supportent pas `+` comme caractère de tag. Helm traduit le `+` en `_` lorsqu'il est stocké comme tag.
- La commande `helm registry login` suit désormais la même structure que celle de la CLI Docker pour le stockage des identifiants. Le même emplacement pour la configuration du registre peut être utilisé pour Helm et la CLI Docker.

### Fonctionnalités dépréciés d'OCI et changements de comportement avec la v3.7.0

La sortie de [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) a inclus la mise en œuvre de [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) pour le support OCI. En conséquence, les fonctionnalités et comportements suivants diffèrent des versions précédentes de Helm :

- La sous-commande `helm chart` a été supprimée.
- Le cache de chart a été supprimé (plus de `helm chart list`, etc.).
- Les références aux registres OCI sont désormais toujours préfixées par `oci://`.
- Le nom de base de la référence au registre doit *toujours* correspondre au nom du chart.
- Le tag de la référence au registre doit *toujours* correspondre à la version sémantique du chart (c'est-à-dire pas de tags `latest`).
- Le type de média de la couche du chart a été changé de `application/tar+gzip` à `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.


## Utiliser un registre basé sur OCI

### Les dépôts Helm dans les registres basés sur OCI

Un [dépôt Helm]({{< ref "chart_repository.md" >}}) est un moyen de stocker et de distribuer des charts Helm empaquetés. Un registre basé sur OCI peut contenir zéro ou plusieurs dépôts Helm, et chacun de ces dépôts peut contenir zéro ou plusieurs charts Helm empaquetés.

### Utiliser des registres hébergés

Il existe plusieurs registres de conteneurs hébergés avec support d'OCI que vous pouvez utiliser pour vos charts Helm. Par exemple :

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
  

Suivez la documentation du fournisseur de registre de conteneurs hébergés pour créer et configurer un registre avec support d'OCI.

**Remarque :** Vous pouvez exécuter [Docker Registry](https://docs.docker.com/registry/deploying/) ou [`zot`](https://github.com/project-zot/zot), qui sont des registres basés sur OCI, sur votre ordinateur de développement. L'exécution d'un registre basé sur OCI sur votre ordinateur de développement ne doit être utilisée qu'à des fins de test.

### Utiliser sigstore pour signer des charts basés sur OCI

Le plugin [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) permet d'utiliser [Sigstore](https://sigstore.dev/) pour signer des charts Helm avec les mêmes outils utilisés pour signer des images de conteneurs. Cela constitue une alternative à la provenance basée sur [GPG]({{< ref "provenance.md" >}}) supportée par les [dépôts de charts classiques]({{< ref "chart_repository.md" >}}).

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

Télécharger un chart vers un registre basé sur OCI :

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

La sous-commande `push` ne peut être utilisée qu'avec des fichiers `.tgz` créés au préalable avec `helm package`.

Lors de l'utilisation de `helm push` pour télécharger un chart vers un registre OCI, la référence doit être préfixée par `oci://` et ne doit pas contenir le nom de base ni le tag.

Le nom de base de la référence du registre est déduit du nom du chart, et le tag est déduit de la version sémantique du chart. C'est actuellement une exigence stricte.

Certain registries require the repository and/or namespace (if specified)
to be created beforehand. Otherwise, an error will be produced during the
 `helm push` operation.

Si vous avez créé un [fichier de provenance]({{< ref "provenance.md" >}}) (`.prov`) et qu'il est présent à côté du fichier `.tgz` du chart, il sera automatiquement téléchargé vers le registre lors de l'opération `push`. Cela ajoute une couche supplémentaire sur [le manifeste du chart Helm](#helm-chart-manifest).

Les utilisateurs du [plugin helm-push](https://github.com/chartmuseum/helm-push) (pour télécharger des charts vers [ChartMuseum]({{< ref "/docs/topics/chart_repository.md#serveur-de-dépôt-chartmuseum" >}}) peuvent rencontrer des problèmes, car le plugin entre en conflit avec la nouvelle fonction `push` intégrée. Depuis la version v0.10.0, le plugin a été renommé en `cm-push`.

### Autres sous-commandes

Le support du protocole `oci://` est également disponible dans diverses autres sous-commandes. Voici la liste complète :

- `helm pull`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

Le nom de base (nom du chart) de la référence du registre *est* inclus pour tout type d'action impliquant le téléchargement de charts (contrairement à `helm push` où il est omis).

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

## Spécifier des dépendances

Les dépendances d'un chart peuvent être récupérées depuis un registre en utilisant la sous-commande `dependency update`.

Le `repository` pour une entrée donnée dans `Chart.yaml` est spécifié comme la référence du registre sans le nom de base :

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
Cela récupérera `oci://localhost:5000/myrepo/mychart:2.7.0` lorsque `dependency update` est exécuté.

## Manifeste de chart Helm

Exemple de manifeste de chart Helm tel qu'il est représenté dans un registre (remarquez les champs `mediaType`) :
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

L'exemple suivant contient un [fichier de provenance]({{< ref "provenance.md" >}}) (remarquez la couche supplémentaire) :

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

## Migrer depuis les dépôts de charts

La migration depuis les [dépôts de charts classiques]({{< ref "chart_repository.md" >}}) (dépôts basés sur index.yaml) est aussi simple que d'utiliser `helm pull`, puis d'utiliser `helm push` pour télécharger les fichiers `.tgz` résultants vers un registre.
