---
title: Dépannage
sidebar_position: 4
---

## Dépannage

### J'obtiens un avertissement « Unable to get an update from the "stable" chart repository »

Exécutez `helm repo list`. Si votre dépôt `stable` pointe vers une URL `storage.googleapis.com`, vous devrez mettre à jour ce dépôt. Le 13 novembre 2020, le dépôt Helm Charts [n'est plus pris en charge](https://github.com/helm/charts#deprecation-timeline) après une période de dépréciation d'un an. Une archive a été mise à disposition à l'adresse `https://charts.helm.sh/stable` mais ne recevra plus de mises à jour.

Vous pouvez exécuter la commande suivante pour corriger votre dépôt :

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Il en va de même pour le dépôt `incubator`, dont une archive est disponible à l'adresse https://charts.helm.sh/incubator. Vous pouvez exécuter la commande suivante pour le réparer :

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### J'obtiens l'avertissement 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

L'ancien dépôt de charts Helm de Google a été remplacé par un nouveau dépôt de charts Helm.

Exécutez la commande suivante pour corriger définitivement ce problème :

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Si vous obtenez une erreur similaire pour `incubator`, exécutez cette commande :

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Quand j'ajoute un dépôt Helm, j'obtiens l'erreur 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Les dépôts Helm Charts ne sont plus pris en charge après [une période de dépréciation d'un an](https://github.com/helm/charts#deprecation-timeline). Des archives de ces dépôts sont disponibles à `https://charts.helm.sh/stable` et `https://charts.helm.sh/incubator`, mais elles ne recevront plus de mises à jour. La commande `helm repo add` ne vous permettra pas d'ajouter les anciennes URLs à moins que vous ne spécifiez `--use-deprecated-repos`.

### Sur GKE (Google Container Engine) j'obtiens « No SSH tunnels currently open »

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Une autre variante de ce message d'erreur est :

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

Le problème vient du fait que votre fichier de configuration Kubernetes local doit contenir les identifiants corrects.

Lorsque vous créez un cluster sur GKE, celui-ci vous fournit des identifiants, y compris des certificats SSL et des autorités de certification. Ceux-ci doivent être stockés dans un fichier de configuration Kubernetes (par défaut : `~/.kube/config`) afin que `kubectl` et `helm` puissent y accéder.

### Après la migration depuis Helm 2, `helm list` n'affiche qu'une partie (ou aucune) de mes releases

Il est probable que vous n'ayez pas remarqué que Helm 3 utilise désormais les namespaces du cluster pour définir la portée des releases. Cela signifie que pour toutes les commandes faisant référence à une release, vous devez soit :

* vous fier au namespace actuel dans le contexte kubernetes actif (comme décrit par la commande `kubectl config view --minify`),
* spécifier le namespace correct en utilisant le flag `--namespace`/`-n`, ou
* pour la commande `helm list`, spécifier le flag `--all-namespaces`/`-A`

Cela s'applique à `helm ls`, `helm uninstall` et toutes les autres commandes `helm` faisant référence à une release.

### Sur macOS, le fichier `/etc/.mdns_debug` est accédé. Pourquoi ?

Nous avons connaissance d'un cas sur macOS où Helm essaie d'accéder à un fichier nommé `/etc/.mdns_debug`. Si le fichier existe, Helm garde le descripteur de fichier ouvert pendant son exécution.

Cela est causé par la bibliothèque MDNS de macOS. Elle tente de charger ce fichier pour lire les paramètres de débogage (si activés). Le descripteur de fichier ne devrait probablement pas rester ouvert, et ce problème a été signalé à Apple. Cependant, c'est macOS, et non Helm, qui cause ce comportement.

Si vous ne souhaitez pas que Helm charge ce fichier, vous pouvez compiler Helm en tant que bibliothèque statique qui n'utilise pas la pile réseau de l'hôte. Cela augmentera la taille du binaire de Helm, mais empêchera l'ouverture du fichier.

Ce problème a été initialement signalé comme un potentiel problème de sécurité. Mais il a depuis été déterminé qu'il n'y a pas de faille ou de vulnérabilité causée par ce comportement.

### helm repo add échoue alors qu'il fonctionnait auparavant

Dans Helm 3.3.1 et versions antérieures, la commande `helm repo add <reponame> <url>` ne produisait aucune sortie si vous tentiez d'ajouter un dépôt qui existait déjà. Le flag `--no-update` levait une erreur si le dépôt était déjà enregistré.

Dans Helm 3.3.2 et versions ultérieures, une tentative d'ajout d'un dépôt existant produit une erreur :

`Error: repository name (reponame) already exists, please specify a different name`

Le comportement par défaut est maintenant inversé. `--no-update` est désormais ignoré, tandis que si vous souhaitez remplacer (écraser) un dépôt existant, vous pouvez utiliser `--force-update`.

Cela est dû à un changement incompatible pour une correction de sécurité, comme expliqué dans les [notes de version de Helm 3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2).

### Activer la journalisation du client Kubernetes

L'affichage des messages de journal pour le débogage du client Kubernetes peut être activé en utilisant les flags [klog](https://pkg.go.dev/k8s.io/klog). L'utilisation du flag `-v` pour définir le niveau de verbosité sera suffisant dans la plupart des cas.

Par exemple :

```
helm list -v 6
```

### Les installations de Tiller ne fonctionnent plus et l'accès est refusé

Les releases Helm étaient auparavant disponibles sur <https://storage.googleapis.com/kubernetes-helm/>. Comme expliqué dans [« Announcing get.helm.sh »](https://helm.sh/blog/get-helm-sh/), l'emplacement officiel a changé en juin 2019. [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) met à disposition toutes les anciennes images Tiller.

Si vous essayez de télécharger des versions plus anciennes de Helm depuis le bucket de stockage que vous utilisiez auparavant, vous pourriez constater qu'elles sont manquantes :

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

L'[ancien emplacement des images Tiller](https://gcr.io/kubernetes-helm/tiller) a commencé la suppression des images en août 2021. Nous avons rendu ces images disponibles sur [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller). Par exemple, pour télécharger la version v2.17.0, remplacez :

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

par :

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Pour initialiser avec Helm v2.17.0 :

`helm init —upgrade`

Ou si une version différente est nécessaire, utilisez le flag --tiller-image pour remplacer l'emplacement par défaut et installer une version spécifique de Helm v2 :

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**Note :** Les mainteneurs de Helm recommandent la migration vers une version actuellement prise en charge de Helm. Helm v2.17.0 était la dernière release de Helm v2 ; Helm v2 n'est plus pris en charge depuis novembre 2020, comme détaillé dans [Helm 2 and the Charts Project Are Now Unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/). De nombreuses CVE ont été signalées contre Helm depuis, et ces failles sont corrigées dans Helm v3 mais ne seront jamais corrigées dans Helm v2. Consultez la [liste actuelle des avis de sécurité Helm publiés](https://github.com/helm/helm/security/advisories?state=published) et planifiez votre [migration vers Helm v3](/topics/v2_v3_migration.md) dès aujourd'hui.
