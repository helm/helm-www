---
title: Guide de démarrage rapide
description: Comment installer et débuter avec Helm, y compris des instructions pour les distributions, la FAQ et les plugins.
sidebar_position: 2
default_lang_commit: 5b891dc41e2912a6ffed8d478a1bd371e5921d4b
---

Ce guide explique comment commencer rapidement à utiliser Helm.

## Prérequis {#prerequisites}

Les prérequis suivants sont nécessaires pour utiliser Helm correctement et en toute
sécurité.

1. Un cluster Kubernetes
2. Décider des configurations de sécurité à appliquer à votre installation, le cas échéant
3. Installer et configurer Helm.

### Installer Kubernetes ou avoir accès à un cluster {#install-kubernetes-or-have-access-to-a-cluster}

- Kubernetes doit être installé. Pour la dernière release de Helm, nous
  recommandons la dernière version stable de Kubernetes, qui est dans la plupart des cas
  l'avant-dernière version mineure.
- Vous devriez également disposer d'une copie locale configurée de `kubectl`.

Consultez la [Politique de prise en charge des versions de Helm](https://helm.sh/docs/topics/version_skew/) pour connaître le décalage de version maximal pris en charge entre Helm et Kubernetes.

## Installer Helm {#install-helm}

Téléchargez un binaire précompilé du client Helm. Vous pouvez utiliser des outils comme `homebrew`,
ou consulter [la page des releases officielles](https://github.com/helm/helm/releases).

Pour plus de détails ou d'autres options, consultez [le guide d'installation](/intro/install.mdx).

## Trouver des charts à installer {#find-charts-to-install}

[Artifact Hub](https://artifacthub.io/packages/search?kind=0) est le meilleur endroit pour découvrir des charts Helm. Il agrège les charts de centaines de dépôts et fournit une recherche, des métadonnées et des informations de sécurité.

Parmi les sources de charts les plus courantes :

- **Registres OCI** : de nombreuses organisations publient leurs charts dans des registres de conteneurs comme GitHub Container Registry, Docker Hub ou les registres des fournisseurs cloud. Vous pouvez les installer directement avec le préfixe `oci://`.
- **Dépôts de charts** : les dépôts Helm traditionnels peuvent être ajoutés avec `helm repo add` et interrogés avec `helm search repo`.

Pour rechercher dans Artifact Hub depuis la ligne de commande :

```console
$ helm search hub podinfo
URL                                                 CHART VERSION  APP VERSION  DESCRIPTION
https://artifacthub.io/packages/helm/podinfo/po...  6.11.2         6.11.2       Podinfo Helm chart for Kubernetes
```

## Installer un chart depuis un registre OCI {#install-a-chart-from-an-oci-registry}

Helm peut installer des charts directement depuis des registres de conteneurs compatibles OCI. Cette approche ne nécessite pas d'ajouter un dépôt au préalable.

Pour installer un chart depuis un registre OCI, utilisez le préfixe `oci://` :

```console
$ helm install my-podinfo oci://ghcr.io/stefanprodan/charts/podinfo --version 6.11.2
Pulled: ghcr.io/stefanprodan/charts/podinfo:6.11.2
NAME: my-podinfo
LAST DEPLOYED: Sat May  3 12:05:00 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES: ...
```

Pour vérifier que l'installation fonctionne, redirigez le port du service et testez le point de terminaison :

```console
$ kubectl port-forward svc/my-podinfo 9898:9898 &
$ curl http://localhost:9898
{
  "hostname": "podinfo-6f89b4c6b5-xvwtb",
  "version": "6.7.1",
  "message": "greetings from podinfo v6.7.1",
  "goos": "linux",
  "goarch": "amd64",
  ...
}
```

Vous pouvez avoir un aperçu du contenu d'un chart avant de l'installer :

```console
$ helm show chart oci://ghcr.io/stefanprodan/charts/podinfo --version 6.11.2
```

Pour plus de détails sur l'utilisation des registres OCI, consultez [Utiliser des registres basés sur OCI](/docs/topics/registries).

## Découvrir les releases {#learn-about-releases}

Il est facile de voir ce qui a été déployé avec Helm :

```console
$ helm list
NAME       	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART         	APP VERSION
my-podinfo 	default  	1       	2026-05-03 12:05:00.000000 +0000 UTC	deployed	podinfo-6.11.2	6.7.1
```

La commande `helm list` (ou `helm ls`) affiche la liste de toutes les releases déployées.

## Désinstaller une release {#uninstall-a-release}

Pour désinstaller une release, utilisez la commande `helm uninstall` :

```console
$ helm uninstall my-podinfo
release "my-podinfo" uninstalled
```

Cette commande désinstalle `my-podinfo` de Kubernetes, ce qui supprime toutes les
ressources associées à la release ainsi que l'historique de la release.

Si vous passez l'option `--keep-history`, l'historique de la release est conservé. Vous
pourrez alors demander des informations sur cette release :

```console
$ helm status my-podinfo
Status: UNINSTALLED
...
```

Comme Helm conserve la trace de vos releases même après leur désinstallation, vous pouvez
auditer l'historique d'un cluster et même restaurer une release supprimée (avec `helm rollback`).

## Consulter l'aide {#reading-the-help-text}

Pour en savoir plus sur les commandes Helm disponibles, utilisez `helm help` ou tapez une
commande suivie de l'option `-h` :

```console
$ helm get -h
```
