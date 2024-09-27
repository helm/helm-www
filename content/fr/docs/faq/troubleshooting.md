---
title: "Dépannage"
weight: 4
---

## Dépannage

### Je reçois un avertissement concernant "Impossible d'obtenir une mise à jour depuis le dépôt de charts 'stable'"

Exécutez `helm repo list`. S'il indique que votre dépôt `stable` pointe vers une URL `storage.googleapis.com`, vous devrez mettre à jour ce dépôt. Le 13 novembre 2020, le dépôt Helm Charts [est devenu obsolète](https://github.com/helm/charts#deprecation-timeline) après une période de dépréciation d'un an. Un archive est disponible à l'adresse `https://charts.helm.sh/stable`, mais elle ne recevra plus de mises à jour.

Vous pouvez exécutez la commande suivante pour réparer votre dépôt :

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Il en va de même pour le dépôt `incubator`, qui dispose d'une archive disponible à l'adresse [https://charts.helm.sh/incubator](https://charts.helm.sh/incubator). Vous pouvez exécuter la commande suivante pour le réparer :

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Je reçois l'avertissement suivant : 'WARNING: "kubernetes-charts.storage.googleapis.com" est obsolète pour "stable" et sera supprimé le 13 novembre 2020.'

L'ancien dépôt de charts Helm de Google a été remplacé par un nouveau dépôt de charts Helm.

Exécutez la commande suivante pour résoudre ce problème de façon permanente : 

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Si vous avez une erreur similaire pour `incubator`, utilisez cette commande :

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Lorsque j'ajoute un dépôt Helm, j'obtiens l'erreur 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Les dépôts de charts Helm ne sont plus supportés après [une période de dépréciation d'un an](https://github.com/helm/charts#deprecation-timeline). Les archives de ces dépôts sont disponibles à `https://charts.helm.sh/stable` et `https://charts.helm.sh/incubator`, mais elles ne recevront plus de mises à jour. La commande `helm repo add` ne vous permettra pas d'ajouter les anciennes URL à moins que vous ne spécifiiez `--use-deprecated-repos`.

### Sur GKE (Google Kubernetes Engine), je reçois l'erreur "No SSH tunnels currently open"

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Une autre variation de ce message est :


```
Unable to connect to the server: x509: certificate signed by unknown authority
```

Le problème est que votre fichier de configuration Kubernetes local doit contenir les bons identifiants. 

Lorsque vous créez un cluster sur GKE, il vous fournit des identifiants, y compris des certificats SSL et des autorités de certification. Ceux-ci doivent être stockés dans un fichier de configuration Kubernetes (par défaut : `~/.kube/config`) afin que `kubectl` et `helm` puissent y accéder.

### Après la migration vers Helm 3, `helm list` n'affiche que certains (ou aucun) de mes releases

Il est probable que vous ayez omis le fait que Helm 3 utilise désormais les namespaces du cluster pour délimiter les releases. Cela signifie que pour toutes les commandes faisant référence à une release, vous devez soit :

* vous fier au namespace actuel dans le contexte Kubernetes actif (comme décrit par la commande `kubectl config view --minify`),
* spécifier le namespace correct en utilisant l'argument `--namespace`/`-n`, ou
* pour la commande `helm list`, spécifier l'argument `--all-namespaces`/`-A`.

Cela s'applique à `helm ls`, `helm uninstall`, et à toutes les autres commandes `helm` faisant référence à une release.


### Sur macOS, on accède au fichier /etc/.mdns_debug. Pourquoi?

Nous sommes conscients d'un cas sur macOS où Helm essaiera d'accéder à un fichier nommé `/etc/.mdns_debug`. Si le fichier existe, Helm garde le fichier ouvert pendant son exécution.

Cela est causé par la bibliothèque MDNS de macOS. Elle tente de charger ce fichier pour lire les paramètres de débogage (s'ils sont activés). Le fichier ne devrait probablement pas rester ouvert, et ce problème a été signalé à Apple. Cependant, c'est macOS, et non Helm, qui est à l'origine de ce comportement.

Si vous ne souhaitez pas que Helm charge ce fichier, vous pouvez éventuellement compiler Helm en tant que bibliothèque statique qui n'utilise pas la pile réseau de l'hôte. Cela augmentera la taille du binaire de Helm, mais empêchera l'ouverture du fichier.

Ce problème avait initialement été signalé comme un problème de sécurité potentiel. Mais il a depuis été déterminé qu'il n'y a pas de défaut ou de vulnérabilité causé par ce comportement.

### La commande `helm repo add` échoue alors qu'elle fonctionnait auparavant

Dans Helm 3.3.1 et les versions antérieures, la commande `helm repo add <reponame> <url>` ne produisait aucun résultat si vous tentiez d'ajouter un dépôt déjà existant. L'argument `--no-update` générait une erreur si le dépôt était déjà enregistré.

Dans Helm 3.3.2 et les versions ultérieures, une tentative d'ajout d'un dépôt existant générera une erreur :

`Error: repository name (reponame) already exists, please specify a different name`

Le comportement par défaut a maintenant été inversé. Le flag `--no-update` est désormais ignoré, tandis que si vous souhaitez remplacer (écraser) un dépôt existant, vous pouvez utiliser `--force-update`.

Cela est dû à un changement important pour un correctif de sécurité, comme expliqué dans les [notes de version de Helm 3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2).

### Activation de la journalisation du client Kubernetes

L'affichage des messages de journalisation pour le débogage du client Kubernetes peut être activé en utilisant l'argument [klog](https://pkg.go.dev/k8s.io/klog). L'utilisation de l'argument `-v` pour définir le niveau de verbosité sera suffisant dans la plupart des cas.

Par exemple :

```
helm list -v 6
```

### Les installations de Tiller ont cessé de fonctionner et l'accès est refusé

Les releases de Helm étaient auparavant disponibles à partir de <https://storage.googleapis.com/kubernetes-helm/>. Comme expliqué dans ["Annonçant get.helm.sh"](https://helm.sh/blog/get-helm-sh/), l'emplacement officiel a changé en juin 2019. [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) rend toutes les anciennes images de Tiller disponibles.

Si vous essayez de télécharger des versions plus anciennes de Helm depuis le bucket de stockage que vous utilisiez auparavant, vous constaterez peut-être qu'elles sont manquantes :

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

L'[emplacement historique des image de Tiller](https://gcr.io/kubernetes-helm/tiller) a commencé à supprimer les images en août 2021. Nous avons rendu ces images disponibles à l'emplacement [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller). Par exemple, pour télécharger la version v2.17.0, remplacez :

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

avec :

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Pour initialiser avec Helm v2.17.0 :

`helm init —upgrade`

Ou si une version différente est nécessaire, utilisez l'argument `--tiller-image` pour remplacer l'emplacement par défaut et installer une version spécifique de Helm v2 :

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**Note :** Les mainteneurs de Helm recommandent de migrer vers une version actuellement supportée de Helm. Helm v2.17.0 était la dernière version de Helm v2 ; Helm v2 est non supporté depuis novembre 2020, comme détaillé dans [Helm 2 et le projet Charts sont maintenant obsolètes](https://helm.sh/blog/helm-2-becomes-unsupported/). De nombreuses CVE ont été signalées contre Helm depuis lors, et ces vulnérabilités sont corrigées dans Helm v3 mais ne seront jamais corrigées dans Helm v2. Consultez la [liste actuelle des avis de sécurité publiés sur Helm](https://github.com/helm/helm/security/advisories?state=published) et élaborez un plan pour [migrer vers Helm v3]({{< ref "/docs/topics/v2_v3_migration.md" >}}) dès aujourd'hui.
