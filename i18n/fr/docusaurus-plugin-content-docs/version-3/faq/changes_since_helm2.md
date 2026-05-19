---
title: Changements depuis Helm 2
sidebar_position: 1
---

## Changements depuis Helm 2

Voici une liste exhaustive de tous les changements majeurs introduits dans Helm 3.

### Suppression de Tiller

Durant le cycle de développement de Helm 2, nous avons introduit Tiller. Tiller jouait un rôle important pour les équipes travaillant sur un cluster partagé : il permettait à plusieurs opérateurs différents d'interagir avec le même ensemble de releases.

Avec le contrôle d'accès basé sur les rôles (RBAC) activé par défaut dans Kubernetes 1.6, sécuriser Tiller pour une utilisation en production est devenu plus difficile à gérer. En raison du grand nombre de politiques de sécurité possibles, notre position était de fournir une configuration permissive par défaut. Cela permettait aux nouveaux utilisateurs de commencer à expérimenter avec Helm et Kubernetes sans avoir à plonger directement dans les contrôles de sécurité. Malheureusement, cette configuration permissive pouvait accorder à un utilisateur un large éventail de permissions qu'il n'était pas censé avoir. Les équipes DevOps et SRE devaient apprendre des étapes opérationnelles supplémentaires lors de l'installation de Tiller dans un cluster multi-tenant.

Après avoir écouté comment les membres de la communauté utilisaient Helm dans certains scénarios, nous avons constaté que le système de gestion des releases de Tiller n'avait pas besoin de s'appuyer sur un opérateur dans le cluster pour maintenir l'état ou servir de hub central pour les informations de release Helm. Au lieu de cela, nous pouvions simplement récupérer les informations depuis le serveur API Kubernetes, effectuer le rendu des Charts côté client, et stocker un enregistrement de l'installation dans Kubernetes.

L'objectif principal de Tiller pouvait être atteint sans Tiller, c'est pourquoi l'une des premières décisions que nous avons prises concernant Helm 3 a été de supprimer complètement Tiller.

Avec la disparition de Tiller, le modèle de sécurité de Helm est radicalement simplifié. Helm 3 prend désormais en charge toutes les fonctionnalités modernes de sécurité, d'identité et d'autorisation de Kubernetes moderne. Les permissions de Helm sont évaluées en utilisant votre [fichier kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). Les administrateurs de cluster peuvent restreindre les permissions des utilisateurs avec la granularité qu'ils jugent appropriée. Les releases sont toujours enregistrées dans le cluster, et le reste des fonctionnalités de Helm reste inchangé.

### Stratégie de mise à niveau améliorée : correctifs de fusion stratégique à 3 voies

Helm 2 utilisait un correctif de fusion stratégique à deux voies. Lors d'une mise à niveau, il comparait le manifeste du chart le plus récent avec le manifeste du chart proposé (celui fourni lors de `helm upgrade`). Il comparait les différences entre ces deux charts pour déterminer quels changements devaient être appliqués aux ressources dans Kubernetes. Si des changements étaient appliqués au cluster hors bande (par exemple lors d'un `kubectl edit`), ces changements n'étaient pas pris en compte. Cela empêchait les ressources de revenir à leur état précédent : parce que Helm ne considérait que le manifeste du dernier chart appliqué comme son état actuel, s'il n'y avait pas de changements dans l'état du chart, l'état actif restait inchangé.

Dans Helm 3, nous utilisons maintenant un correctif de fusion stratégique à trois voies. Helm prend en compte l'ancien manifeste, son état actif et le nouveau manifeste lors de la génération d'un correctif.

#### Exemples

Passons en revue quelques exemples courants pour illustrer l'impact de ce changement.

##### Retour en arrière lorsque l'état actif a changé

Votre équipe vient de déployer son application en production sur Kubernetes en utilisant Helm. Le chart contient un objet Deployment où le nombre de réplicas est défini à trois :

```console
$ helm install myapp ./myapp
```

Un nouveau développeur rejoint l'équipe. Le premier jour, en observant le cluster de production, un terrible accident de café renversé sur le clavier se produit et il exécute `kubectl scale` sur le déploiement de production, passant de trois réplicas à zéro.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

Un autre développeur de votre équipe remarque que le site de production est hors service et décide de restaurer la release à son état précédent :

```console
$ helm rollback myapp
```

Que se passe-t-il ?

Dans Helm 2, un correctif serait généré en comparant l'ancien manifeste avec le nouveau manifeste. Comme il s'agit d'un rollback, c'est le même manifeste. Helm déterminerait qu'il n'y a rien à changer car il n'y a pas de différence entre l'ancien manifeste et le nouveau manifeste. Le nombre de réplicas reste à zéro. C'est la panique.

Dans Helm 3, le correctif est généré en utilisant l'ancien manifeste, l'état actif et le nouveau manifeste. Helm reconnaît que l'ancien état était à trois, que l'état actif est à zéro et que le nouveau manifeste souhaite le ramener à trois, il génère donc un correctif pour remettre l'état à trois.

##### Mises à niveau lorsque l'état actif a changé

De nombreux service meshes et autres applications basées sur des contrôleurs injectent des données dans les objets Kubernetes. Cela peut être un sidecar, des labels ou d'autres informations. Auparavant, si vous aviez le manifeste suivant rendu depuis un Chart :

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

Et que l'état actif avait été modifié par une autre application pour devenir :

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

Maintenant, vous voulez mettre à jour le tag de l'image `nginx` vers `2.1.0`. Vous effectuez donc une mise à niveau vers un chart avec le manifeste suivant :

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

Que se passe-t-il ?

Dans Helm 2, Helm génère un correctif de l'objet `containers` entre l'ancien manifeste et le nouveau manifeste. L'état actif du cluster n'est pas pris en compte lors de la génération du correctif.

L'état actif du cluster est modifié pour ressembler à ceci :

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

Le pod sidecar est supprimé de l'état actif. Encore plus de panique.

Dans Helm 3, Helm génère un correctif de l'objet `containers` entre l'ancien manifeste, l'état actif et le nouveau manifeste. Il remarque que le nouveau manifeste change le tag de l'image vers `2.1.0`, mais que l'état actif contient un conteneur sidecar.

L'état actif du cluster est modifié pour ressembler à ceci :

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### Les noms de releases sont maintenant limités au namespace

Avec la suppression de Tiller, les informations sur chaque release devaient être stockées quelque part. Dans Helm 2, elles étaient stockées dans le même namespace que Tiller. En pratique, cela signifiait qu'une fois qu'un nom était utilisé par une release, aucune autre release ne pouvait utiliser ce même nom, même si elle était déployée dans un namespace différent.

Dans Helm 3, les informations sur une release particulière sont maintenant stockées dans le même namespace que la release elle-même. Cela signifie que les utilisateurs peuvent maintenant exécuter `helm install wordpress stable/wordpress` dans deux namespaces séparés, et chacune peut être référencée avec `helm list` en changeant le contexte du namespace actuel (par exemple `helm list --namespace foo`).

Avec ce meilleur alignement sur les namespaces natifs du cluster, la commande `helm list` ne liste plus toutes les releases par défaut. Au lieu de cela, elle ne liste que les releases dans le namespace de votre contexte Kubernetes actuel (c'est-à-dire le namespace affiché lorsque vous exécutez `kubectl config view --minify`). Cela signifie également que vous devez fournir le flag `--all-namespaces` à `helm list` pour obtenir un comportement similaire à Helm 2.

### Les Secrets comme backend de stockage par défaut

Dans Helm 3, les Secrets sont maintenant utilisés comme [backend de stockage par défaut](/topics/advanced.md#storage-backends). Helm 2 utilisait les ConfigMaps par défaut pour stocker les informations de release. Dans Helm 2.7.0, un nouveau backend de stockage utilisant des Secrets pour stocker les informations de release a été implémenté, et c'est maintenant le backend par défaut à partir de Helm 3.

Le passage aux Secrets comme valeur par défaut de Helm 3 permet une sécurité supplémentaire pour protéger les charts en conjonction avec le chiffrement des Secrets dans Kubernetes.

[Le chiffrement des secrets au repos](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) est devenu disponible en tant que fonctionnalité alpha dans Kubernetes 1.7 et est devenu stable à partir de Kubernetes 1.13. Cela permet aux utilisateurs de chiffrer les métadonnées de release Helm au repos, ce qui constitue un bon point de départ qui peut être étendu ultérieurement à l'utilisation de quelque chose comme Vault.

### Changements du chemin d'import Go

Dans Helm 3, Helm a changé le chemin d'import Go de `k8s.io/helm` vers `helm.sh/helm/v3`. Si vous avez l'intention de mettre à niveau vers les bibliothèques clientes Go de Helm 3, assurez-vous de modifier vos chemins d'import.

### Capabilities

L'objet intégré `.Capabilities` disponible pendant la phase de rendu a été simplifié.

[Objets intégrés](/chart_template_guide/builtin_objects.md)

### Validation des valeurs de chart avec JSONSchema

Un schéma JSON peut maintenant être imposé aux valeurs de chart. Cela garantit que les valeurs fournies par l'utilisateur suivent le schéma défini par le mainteneur du chart, fournissant un meilleur rapport d'erreurs lorsque l'utilisateur fournit un ensemble incorrect de valeurs pour un chart.

La validation se produit lorsque l'une des commandes suivantes est invoquée :

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

Consultez la documentation sur les [fichiers de schéma](/topics/charts.md#schema-files) pour plus d'informations.

### Consolidation de `requirements.yaml` dans `Chart.yaml`

Le système de gestion des dépendances de chart a été déplacé de requirements.yaml et requirements.lock vers Chart.yaml et Chart.lock. Nous recommandons que les nouveaux charts destinés à Helm 3 utilisent le nouveau format. Cependant, Helm 3 comprend toujours la version 1 de l'API Chart (`v1`) et chargera les fichiers `requirements.yaml` existants.

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

Dans Helm 3, la dépendance est exprimée de la même manière, mais maintenant depuis votre `Chart.yaml` :

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

Les charts sont toujours téléchargés et placés dans le répertoire `charts/`, donc les sous-charts intégrés dans le répertoire `charts/` continueront à fonctionner sans modification.

### Le nom (ou --generate-name) est maintenant requis lors de l'installation

Dans Helm 2, si aucun nom n'était fourni, un nom auto-généré était attribué. En production, cela s'est avéré être plus une nuisance qu'une fonctionnalité utile. Dans Helm 3, Helm génère une erreur si aucun nom n'est fourni avec `helm install`.

Pour ceux qui souhaitent toujours avoir un nom auto-généré, vous pouvez utiliser le flag `--generate-name` pour en créer un.

### Publication de charts vers des registres OCI

Il s'agit d'une fonctionnalité expérimentale introduite dans Helm 3. Pour l'utiliser, définissez la variable d'environnement `HELM_EXPERIMENTAL_OCI=1`.

À un niveau général, un dépôt de charts est un emplacement où les charts peuvent être stockés et partagés. Le client Helm empaquette et envoie les Helm Charts vers un dépôt de charts. En termes simples, un dépôt de charts est un serveur HTTP basique qui héberge un fichier index.yaml et quelques charts empaquetés.

Bien que l'API des dépôts de charts présente plusieurs avantages pour répondre aux exigences de stockage les plus basiques, quelques inconvénients ont commencé à apparaître :

- Les dépôts de charts ont beaucoup de mal à abstraire la plupart des implémentations de sécurité requises dans un environnement de production. Avoir une API standard pour l'authentification et l'autorisation est très important dans les scénarios de production.
- Les outils de provenance de chart de Helm utilisés pour signer et vérifier l'intégrité et l'origine d'un chart sont une partie optionnelle du processus de publication de chart.
- Dans les scénarios multi-tenant, le même chart peut être téléchargé par un autre tenant, coûtant deux fois le coût de stockage pour stocker le même contenu. Des dépôts de charts plus intelligents ont été conçus pour gérer cela, mais ce n'est pas une partie de la spécification formelle.
- L'utilisation d'un seul fichier index pour la recherche, les informations de métadonnées et la récupération des charts a rendu difficile ou maladroite la conception dans des implémentations multi-tenant sécurisées.

Le projet Distribution de Docker (également connu sous le nom de Docker Registry v2) est le successeur du projet Docker Registry. De nombreux grands fournisseurs cloud proposent une offre produit du projet Distribution, et avec tant de fournisseurs offrant le même produit, le projet Distribution a bénéficié de nombreuses années de durcissement, de meilleures pratiques de sécurité et de tests intensifs.

Consultez `helm help chart` et `helm help registry` pour plus d'informations sur comment empaqueter un chart et le publier vers un registre Docker.

Pour plus d'informations, consultez [cette page](/topics/registries.md).

### Suppression de `helm serve`

`helm serve` exécutait un dépôt de charts local sur votre machine à des fins de développement. Cependant, il n'a pas reçu beaucoup d'adoption en tant qu'outil de développement et avait de nombreux problèmes de conception. Finalement, nous avons décidé de le supprimer et de le séparer en tant que plugin.

Pour une expérience similaire à `helm serve`, consultez l'option de stockage sur système de fichiers local dans [ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) et le [plugin servecm](https://github.com/jdolitsky/helm-servecm).

### Support des charts de type bibliothèque

Helm 3 prend en charge une catégorie de chart appelée "chart de bibliothèque". C'est un chart qui est partagé par d'autres charts, mais qui ne crée pas d'artefacts de release par lui-même. Les templates d'un chart de bibliothèque ne peuvent déclarer que des éléments `define`. Le contenu à portée globale non-`define` est simplement ignoré. Cela permet aux utilisateurs de réutiliser et de partager des extraits de code qui peuvent être réutilisés dans de nombreux charts, évitant ainsi la redondance et gardant les charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Les charts de bibliothèque sont déclarés dans la directive dependencies de Chart.yaml, et sont installés et gérés comme n'importe quel autre chart.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

Nous sommes très enthousiastes de voir les cas d'utilisation que cette fonctionnalité ouvre pour les développeurs de charts, ainsi que les meilleures pratiques qui émergeront de l'utilisation des charts de bibliothèque.

### Mise à jour de l'apiVersion de Chart.yaml

Avec l'introduction du support des charts de bibliothèque et la consolidation de requirements.yaml dans Chart.yaml, les clients qui comprenaient le format de package de Helm 2 ne comprendront pas ces nouvelles fonctionnalités. Nous avons donc mis à jour l'apiVersion dans Chart.yaml de `v1` vers `v2`.

`helm create` crée maintenant des charts en utilisant ce nouveau format, donc l'apiVersion par défaut a également été mise à jour.

Les clients souhaitant prendre en charge les deux versions de charts Helm devraient inspecter le champ `apiVersion` dans Chart.yaml pour comprendre comment analyser le format de package.

### Support de la spécification des répertoires de base XDG

[La spécification des répertoires de base XDG](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) est un standard portable définissant où les fichiers de configuration, de données et de cache doivent être stockés sur le système de fichiers.

Dans Helm 2, Helm stockait toutes ces informations dans `~/.helm` (affectueusement connu sous le nom de `helm home`), qui pouvait être modifié en définissant la variable d'environnement `$HELM_HOME`, ou en utilisant le flag global `--home`.

Dans Helm 3, Helm respecte maintenant les variables d'environnement suivantes conformément à la spécification des répertoires de base XDG :

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Les plugins Helm reçoivent toujours `$HELM_HOME` comme alias vers `$XDG_DATA_HOME` pour la rétrocompatibilité avec les plugins qui utilisent `$HELM_HOME` comme environnement de travail.

Plusieurs nouvelles variables d'environnement sont également transmises à l'environnement du plugin pour s'adapter à ce changement :

- `$HELM_PATH_CACHE` pour le chemin du cache
- `$HELM_PATH_CONFIG` pour le chemin de la configuration
- `$HELM_PATH_DATA` pour le chemin des données

Les plugins Helm souhaitant prendre en charge Helm 3 devraient envisager d'utiliser ces nouvelles variables d'environnement à la place.

### Renommage des commandes CLI

Afin de mieux aligner la terminologie avec d'autres gestionnaires de paquets, `helm delete` a été renommé en `helm uninstall`. `helm delete` est toujours conservé comme alias de `helm uninstall`, donc les deux formes peuvent être utilisées.

Dans Helm 2, pour purger le registre des releases, le flag `--purge` devait être fourni. Cette fonctionnalité est maintenant activée par défaut. Pour conserver le comportement précédent, utilisez `helm uninstall --keep-history`.

De plus, plusieurs autres commandes ont été renommées pour suivre les mêmes conventions :

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

Ces commandes ont également conservé leurs anciens verbes comme alias, vous pouvez donc continuer à les utiliser sous l'une ou l'autre forme.

### Création automatique des namespaces

Lors de la création d'une release dans un namespace qui n'existe pas, Helm 2 créait le namespace. Helm 3 suit le comportement des autres outils Kubernetes et renvoie une erreur si le namespace n'existe pas. Helm 3 créera le namespace si vous spécifiez explicitement le flag `--create-namespace`.

### Qu'est-il arrivé à .Chart.ApiVersion ?

Helm suit la convention typique de CamelCase qui consiste à mettre une majuscule aux acronymes. Nous avons fait cela ailleurs dans le code, comme avec `.Capabilities.APIVersions.Has`. Dans Helm v3, nous avons corrigé `.Chart.ApiVersion` pour suivre ce modèle, en le renommant `.Chart.APIVersion`.
