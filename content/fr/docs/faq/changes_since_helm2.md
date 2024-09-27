---
title: "Changements depuis Helm 2"
weight: 1
---

## Changements depuis Helm 2

Voici la liste exhaustive de tous les principaux changements introduits dans Helm 3.

### Suppression de Tiller

Pendant le cycle de développement de Helm 2, nous avons introduit Tiller. Tiller jouait un rôle important pour les équipes travaillant sur un cluster partagé - il permettait à plusieurs opérateurs différents d'interagir avec le même ensemble de releases.

Avec le contrôle d'accès basé sur les rôles (RBAC) activé par défaut dans Kubernetes 1.6, la sécurisation de Tiller pour une utilisation en production est devenue plus difficile à gérer. En raison du grand nombre de politiques de sécurité possibles, notre position était de fournir une configuration par défaut permissive. Cela permettait aux utilisateurs novices de commencer à expérimenter avec Helm et Kubernetes sans avoir à plonger immédiatement dans les contrôles de sécurité. Malheureusement, cette configuration permissive pouvait accorder à un utilisateur un large éventail de permissions qu'il n'était pas censé avoir. Les équipes DevOps et SRE devaient apprendre des étapes opérationnelles supplémentaires lors de l'installation de Tiller dans un cluster multi-tenant.

Après avoir entendu comment les membres de la communauté utilisaient Helm dans certains scénarios, nous avons constaté que le système de gestion des releases de Tiller n'avait pas besoin de s'appuyer sur un opérateur interne au cluster pour maintenir l'état ou agir comme un centre central pour les informations sur les releases de Helm. Au lieu de cela, nous pouvions simplement récupérer les informations depuis l'API serveur Kubernetes, rendre les Charts côté client et stocker un enregistrement de l'installation dans Kubernetes.

L'objectif principal de Tiller pouvait être accompli sans Tiller, donc l'une des premières décisions que nous avons prises concernant Helm 3 a été de supprimer complètement Tiller.

Avec la disparition de Tiller, le modèle de sécurité de Helm est radicalement simplifié. Helm 3 prend désormais en charge toutes les fonctionnalités modernes de sécurité, d'identité et d'autorisation de Kubernetes. Les permissions de Helm sont évaluées à l'aide de votre [fichier kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). Les administrateurs de cluster peuvent restreindre les permissions des utilisateurs avec la granularité qu'ils jugent appropriée. Les releases sont toujours enregistrées dans le cluster, et le reste des fonctionnalités de Helm demeure.

### Amélioration de la stratégie de mise à niveau : 3 voies pour la stratégie de fusion

Helm 2 utilisait un patch de fusion stratégique à deux voies. Lors d'une mise à niveau, il comparait le manifeste du chart le plus récent avec celui du chart proposé (celui fourni lors de `helm upgrade`). Il comparait les différences entre ces deux charts pour déterminer les modifications à appliquer aux ressources dans Kubernetes. Si des modifications étaient apportées au cluster en dehors de Helm (comme lors d'un `kubectl edit`), ces changements n'étaient pas pris en compte. Cela entraînait des difficultés pour revenir à un état antérieur : puisque Helm considérait uniquement le manifeste du dernier chart appliqué comme l'état actuel, si l'état du chart n'avait pas changé, l'état en direct restait inchangé.

Dans Helm 3, nous utilisons désormais un patch de fusion stratégique à trois voies. Helm prend en compte l'ancien manifeste, son état en direct, et le nouveau manifeste lors de la génération d'un patch.

#### Exemples

Voyons quelques exemples courants de l'impact de ce changement.

##### Revenir en arrière lorsque l'état en direct a changé

Votre équipe vient de déployer son application en production sur Kubernetes en utilisant Helm. Le chart contient un objet Deployment où le nombre de réplicas est défini sur trois :

```console
$ helm install myapp ./myapp
```

Un nouveau développeur rejoint l'équipe. Le premier jour, en observant le cluster de production, un horrible accident de café renversé sur le clavier se produit et il utilise la commande `kubectl scale` pour réduire le déploiement de production de trois réplicas à zéro.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

Un autre développeur de votre équipe remarque que le site de production est hors service et décide de revenir à l'état précédent de la release :

```console
$ helm rollback myapp
```

Que se passe-t-il ?

Dans Helm 2, cela générerait un patch en comparant le manifeste ancien avec le nouveau manifeste. Étant donné qu'il s'agit d'un rollback, le manifeste est le même. Helm déterminerait qu'il n'y a rien à changer puisque le manifeste ancien et le nouveau sont identiques. Le nombre de réplicas resterait donc à zéro. La panique s'ensuit.

Dans Helm 3, le patch est généré en utilisant le manifeste ancien, l'état actuel et le nouveau manifeste. Helm reconnaît que l'état ancien était à trois, l'état actuel est à zéro, et le nouveau manifeste souhaite le ramener à trois. Ainsi, Helm génère un patch pour rétablir l'état à trois.

##### Mise à jour où l'état actuel a changé

De nombreux maillages de services et autres applications basées sur des contrôleurs injectent des données dans les objets Kubernetes. Cela peut être quelque chose comme un sidecar, des labels ou d'autres informations. Auparavant, si vous aviez le manifeste donné rendu à partir d'un Chart :

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

Et que son état actuel à été modifié par une autre application pour :

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

Maintenant, vous souhaitez mettre à jour le tag de l'image `nginx` à `2.1.0`. Vous procédez donc à une mise à jour avec un chart contenant le manifeste suivant :

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

Que se passe-t-il ?

Dans Helm 2, Helm génère un patch de l'objet `containers` entre le manifeste ancien et le nouveau manifeste. L'état actuel du cluster n'est pas pris en compte lors de la génération du patch.

L'état actuel du cluster est modifié pour ressembler à ce qui suit :

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

Le sidecar du pod a été supprimé de l'état actuel. Encore plus de panique s'ensuit.

Dans Helm 3, Helm génère un patch de l'objet `containers` en utilisant le manifeste ancien, l'état actuel et le nouveau manifeste. Il remarque que le nouveau manifeste change le tag de l'image à `2.1.0`, mais que l'état actuel contient un conteneur sidecar.

L'état actuel du cluster est modifié pour ressembler à ce qui suit :

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### Les noms de release sont désormais limités à l'espace de noms (Namespace)

Avec la suppression de Tiller, les informations sur chaque release devaient être stockées ailleurs. Dans Helm 2, cela était conservé dans le même espace de noms que Tiller. En pratique, cela signifiait qu'une fois qu'un nom était utilisé par une release, aucune autre release ne pouvait utiliser ce même nom, même si elle était déployée dans un espace de noms différent.

Dans Helm 3, les informations sur une release particulière sont désormais stockées dans le même espace de noms que la release elle-même. Cela signifie que les utilisateurs peuvent maintenant `helm install wordpress stable/wordpress` dans deux espaces de noms distincts, et chacune peut être consultée avec `helm list` en changeant le contexte de l'espace de noms actuel (par exemple, `helm list --namespace foo`).

Avec ce meilleur alignement aux espaces de noms natifs du cluster, la commande `helm list` ne liste plus toutes les releases par défaut. Au lieu de cela, elle ne liste que les releases dans l'espace de noms de votre contexte Kubernetes actuel (c'est-à-dire l'espace de noms affiché lorsque vous exécutez `kubectl config view --minify`). Cela signifie également que vous devez fournir l'option `--all-namespaces` à `helm list` pour obtenir un comportement similaire à celui de Helm 2.

### Secret comme pilote de stockage par défaut

Dans Helm 3, les Secrets sont désormais utilisés comme [pilote de stockage par défaut]({{< ref "/docs/topics/advanced.md#stockage-des-backends" >}}). Helm 2 utilisait des ConfigMaps par défaut pour stocker les informations de release. Dans Helm 2.7.0, un nouveau backend de stockage utilisant des Secrets pour conserver les informations de release a été implémenté, et il est désormais le pilote de stockage par défaut à partir de Helm 3.

Le passage aux Secrets par défaut dans Helm 3 permet une sécurité accrue pour protéger les charts en conjonction avec la fonctionnalité de chiffrement des Secrets dans Kubernetes.

[Le chiffrement des secrets at-rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) est devenu disponible en tant que fonctionnalité alpha dans Kubernetes 1.7 et est devenu stable à partir de Kubernetes 1.13. Cela permet aux utilisateurs de chiffrer les métadonnées des releases Helm at-rest et constitue donc un bon point de départ qui peut être étendu ultérieurement vers l'utilisation de solutions telles que Vault.

### Changements dans le chemin d'importation Go

Dans Helm 3, Helm a modifié le chemin d'importation Go de `k8s.io/helm` à `helm.sh/helm/v3`. Si vous prévoyez de mettre à niveau vers les bibliothèques clientes Go de Helm 3, assurez-vous de modifier vos chemins d'importation.

### Capacités

L'objet intégré `.Capabilities`, disponible durant la phase de rendu, a été simplifié.

[Objets intégrés]({{< ref "/docs/chart_template_guide/builtin_objects.md" >}})

### Validation des valeurs de Chart avec JSONSchema

Un schéma JSON peut désormais être imposé sur les valeurs de chart. Cela garantit que les valeurs fournies par l'utilisateur respectent le schéma défini par le mainteneur du chart, offrant ainsi de meilleurs rapports d'erreurs lorsque l'utilisateur fournit un ensemble incorrect de valeurs pour un chart.

La validation a lieu lorsque l'une des commandes suivantes est invoquée :

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

Consultez la documentation sur les [fichiers de schéma]({{< ref "/docs/topics/charts.md#fichiers-de-schéma" >}}) pour plus d'informations.

### Remplacement de `requirements.yaml` en `Chart.yaml`

Le système de gestion des dépendances des charts est passé de `requirements.yaml` et `requirements.lock` à `Chart.yaml` et `Chart.lock`. Nous recommandons que les nouveaux charts destinés à Helm 3 utilisent le nouveau format. Cependant, Helm 3 comprend toujours la version 1 de l'API des charts (`v1`) et chargera les fichiers `requirements.yaml` existants.

Dans Helm 2, voici à quoi ressemblait un `requirements.yaml` :

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

Dans Helm 3, la dépendance est exprimée de la même manière, mais maintenant dans votre `Chart.yaml` :

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

Les charts sont toujours téléchargés et placés dans le répertoire `charts/`, donc les sous-chart inclus dans le répertoire `charts/` continueront à fonctionner sans modification.

### Le nom (ou le `--generate-name`) est désormais requis lors de l'installation

Dans Helm 2, si aucun nom n'était fourni, un nom généré automatiquement était attribué. En production, cela s'est révélé plus gênant qu'utile. Dans Helm 3, Helm renverra une erreur si aucun nom n'est fourni avec `helm install`.

Pour ceux qui souhaitent toujours qu'un nom soit généré automatiquement, vous pouvez utiliser l'option `--generate-name` pour en créer un pour vous.

### Publication de Charts dans les registres OCI

Il s'agit d'une fonctionnalité expérimentale introduite dans Helm 3. Pour l'utiliser, définissez la variable d'environnement `HELM_EXPERIMENTAL_OCI=1`.

À un niveau élevé, un dépôt de Charts est un emplacement où les Charts peuvent être stockés et partagés. Le client Helm empaquette et expédie les Charts Helm vers un dépôt de Charts. En termes simples, un dépôt de Charts est un serveur HTTP basique qui héberge un fichier `index.yaml` et quelques charts empaquetés.

Bien qu'il y ait plusieurs avantages à ce que l'API des dépôts de Charts réponde aux exigences de stockage les plus élémentaires, quelques inconvénients ont commencé à apparaître :

- Les dépôts de Charts ont beaucoup de mal à abstraire la plupart des implémentations de sécurité nécessaires dans un environnement de production. Avoir une API standard pour l'authentification et l'autorisation est très important dans les scénarios de production.
- Les outils de provenance des Charts de Helm, utilisés pour signer et vérifier l'intégrité et l'origine d'un chart, sont un élément facultatif du processus de publication des Charts.
- Dans les scénarios multi-tenant, le même Chart peut être téléchargé par un autre tenant, ce qui double le coût de stockage pour le même contenu. Des dépôts de charts plus intelligents ont été conçus pour gérer cela, mais ce n'est pas partie de la spécification formelle.
- L'utilisation d'un seul fichier d'index pour la recherche, les informations de métadonnées et la récupération des Charts a rendu difficile ou maladroit la conception autour de cela dans les implémentations sécurisées multi-tenant.

Le projet Distribution de Docker (également connu sous le nom de Docker Registry v2) est le successeur du projet Docker Registry. De nombreux grands fournisseurs de cloud proposent une offre basée sur le projet Distribution, et avec autant de fournisseurs offrant le même produit, le projet Distribution a bénéficié de nombreuses années de renforcement, de meilleures pratiques en matière de sécurité et de tests en conditions réelles.

Veuillez consulter `helm help chart` et `helm help registry` pour plus d'informations sur la manière d'empaqueter un chart et de le publier dans un registre Docker.

Pour plus d'information, consultez [cette page]({{< ref "/docs/topics/registries.md" >}}).

### Suppression de `helm serve`

`helm serve` exécutait un dépôt de Charts local sur votre machine à des fins de développement. Cependant, il n'a pas beaucoup été utilisé en tant qu'outil de développement et avait de nombreux problèmes de conception. En fin de compte, nous avons décidé de le supprimer et de le séparer en tant que plugin.

Pour une expérience similaire à `helm serve`, consultez l'option de stockage sur le système de fichiers local dans [ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) et le [plugin servecm](https://github.com/jdolitsky/helm-servecm).


### Support des charts librairie

Helm 3 prend en charge une catégorie de charts appelée « chart librairie». Il s'agit d'un chart partagé par d'autres charts, mais qui ne crée aucun artefact de release propre. Les templates d'un chart de bibliothèque ne peuvent déclarer que des éléments `define`. Le contenu non `define` à portée globale est simplement ignoré. Cela permet aux utilisateurs de réutiliser et de partager des extraits de code pouvant être utilisés dans de nombreux charts, évitant ainsi la redondance et maintenant les charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Les charts librairie sont déclarés dans la directive des dépendances dans `Chart.yaml`, et sont installés et gérés comme tout autre chart.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

Nous sommes très enthousiastes de voir les cas d'utilisation que cette fonctionnalité ouvre pour les développeurs de charts, ainsi que les meilleures pratiques qui émergeront de l'utilisation des charts de bibliothèque.

### Mise à jour de l'apiVersion dans Charts.yaml

Avec l'introduction du support des charts de bibliothèque et la consolidation de `requirements.yaml` dans `Chart.yaml`, les clients qui comprenaient le format de package de Helm 2 ne comprendront pas ces nouvelles fonctionnalités. Nous avons donc augmenté la version de l'API dans `Chart.yaml` de `v1` à `v2`.

`helm create` crée désormais des charts en utilisant ce nouveau format, donc la version de l'API par défaut a également été augmentée.

Les clients souhaitant prendre en charge les deux versions des charts Helm doivent inspecter le champ `apiVersion` dans `Chart.yaml` pour comprendre comment analyser le format du package.

### Support des répertoires de base XDG

[La spécification des répertoires de base XDG](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) est une norme portable définissant où les fichiers de configuration, les données et les fichiers cache doivent être stockés sur le système de fichiers.

Dans Helm 2, Helm stockait toutes ces informations dans `~/.helm` (affectueusement connu sous le nom de `helm home`), ce qui pouvait être modifié en définissant la variable d'environnement `$HELM_HOME` ou en utilisant l'option globale `--home`.

Dans Helm 3, Helm respecte désormais les variables d'environnement suivantes conformément à la spécification des répertoires de base XDG :

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Les plugins Helm reçoivent toujours `$HELM_HOME` comme un alias de `$XDG_DATA_HOME` pour assurer la compatibilité avec les plugins qui utilisent `$HELM_HOME` comme un environnement temporaire.

Plusieurs nouvelles variables d'environnement sont également passées dans l'environnement du plugin pour s'adapter à ce changement :

- `$HELM_PATH_CACHE` pour l'emplacement du cache
- `$HELM_PATH_CONFIG` pour l'emplacement de la configuration
- `$HELM_PATH_DATA` pour l'emplacement des données

Les plugins Helm cherchant à prendre en charge Helm 3 devraient envisager d'utiliser ces nouvelles variables d'environnement à la place.

### Renommage des commandes CLI

Afin de mieux s'aligner avec la terminologie utilisée par d'autres gestionnaires de packages, `helm delete` a été renommé en `helm uninstall`. La commande `helm delete` est toujours conservée comme un alias de `helm uninstall`, donc les deux formes peuvent être utilisées.

Dans Helm 2, pour purger le registre des releases, il fallait fournir l'option `--purge`. Cette fonctionnalité est maintenant activée par défaut. Pour conserver le comportement précédent, utilisez `helm uninstall --keep-history`.

De plus, plusieurs autres commandes ont été renommées pour s'adapter aux mêmes conventions :

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

Ces commandes ont également conservé leurs anciens verbes en tant qu'alias, vous pouvez donc continuer à les utiliser sous l'une ou l'autre forme.

### Création automatique de namespaces

Lors de la création d'une release dans un espace de noms qui n'existe pas, Helm 2 créait l'espace de noms. Helm 3 suit le comportement des autres outils Kubernetes et renvoie une erreur si l'espace de noms n'existe pas. Helm 3 créera l'espace de noms si vous spécifiez explicitement l'option `--create-namespace`.

### Qu'est devenu `.Chart.ApiVersion` ?

Helm suit la convention typique du CamelCasing, qui consiste à mettre en majuscule un acronyme. Nous avons appliqué cette règle ailleurs dans le code, par exemple avec `.Capabilities.APIVersions.Has`. Dans Helm v3, nous avons corrigé `.Chart.ApiVersion` pour suivre ce modèle, en le renommant en `.Chart.APIVersion`.

