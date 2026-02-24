---
title: Charts
description: Explique le format des charts et fournit des conseils de base pour créer des charts avec Helm.
sidebar_position: 1
---

Helm utilise un format de packaging appelé _charts_. Un chart est une collection
de fichiers décrivant un ensemble cohérent de ressources Kubernetes. Un seul
chart peut être utilisé pour déployer quelque chose de simple, comme un pod
memcached, ou quelque chose de complexe, comme une pile applicative web complète
avec serveurs HTTP, bases de données, caches, etc.

Les charts sont créés sous forme de fichiers organisés dans une arborescence de
répertoires particulière. Ils peuvent être empaquetés dans des archives versionnées
pour être déployés.

Si vous souhaitez télécharger et examiner les fichiers d'un chart publié sans
l'installer, vous pouvez le faire avec `helm pull chartrepo/chartname`.

Ce document explique le format des charts et fournit des conseils de base pour
créer des charts avec Helm.

## Structure des fichiers d'un chart

Un chart est organisé comme une collection de fichiers dans un répertoire. Le nom
du répertoire est le nom du chart (sans information de version). Ainsi, un chart
décrivant WordPress serait stocké dans un répertoire `wordpress/`.

À l'intérieur de ce répertoire, Helm s'attend à une structure correspondant à ceci :

```text
wordpress/
  Chart.yaml          # Un fichier YAML contenant des informations sur le chart
  LICENSE             # OPTIONNEL : Un fichier texte contenant la licence du chart
  README.md           # OPTIONNEL : Un fichier README lisible par les humains
  values.yaml         # Les valeurs de configuration par défaut pour ce chart
  values.schema.json  # OPTIONNEL : Un JSON Schema pour imposer une structure au fichier values.yaml
  charts/             # Un répertoire contenant les charts dont ce chart dépend
  crds/               # Custom Resource Definitions
  templates/          # Un répertoire de templates qui, combinés aux values,
                      # génèreront des fichiers manifestes Kubernetes valides
  templates/NOTES.txt # OPTIONNEL : Un fichier texte contenant des notes d'utilisation courtes
```

Helm réserve l'utilisation des répertoires `charts/`, `crds/` et `templates/`,
ainsi que des noms de fichiers listés ci-dessus. Les autres fichiers sont laissés
tels quels.

## Le fichier Chart.yaml

Le fichier `Chart.yaml` est obligatoire pour un chart. Il contient les champs
suivants :

```yaml
apiVersion: The chart API version (required)
name: The name of the chart (required)
version: The version of the chart (required)
kubeVersion: A SemVer range of compatible Kubernetes versions (optional)
description: A single-sentence description of this project (optional)
type: The type of the chart (optional)
keywords:
  - A list of keywords about this project (optional)
home: The URL of this projects home page (optional)
sources:
  - A list of URLs to source code for this project (optional)
dependencies: # A list of the chart requirements (optional)
  - name: The name of the chart (nginx)
    version: The version of the chart ("1.2.3")
    repository: (optional) The repository URL ("https://example.com/charts") or alias ("@repo-name")
    condition: (optional) A yaml path that resolves to a boolean, used for enabling/disabling charts (e.g. subchart1.enabled )
    tags: # (optional)
      - Tags can be used to group charts for enabling/disabling together
    import-values: # (optional)
      - ImportValues holds the mapping of source values to parent key to be imported. Each item can be a string or pair of child/parent sublist items.
    alias: (optional) Alias to be used for the chart. Useful when you have to add the same chart multiple times
maintainers: # (optional)
  - name: The maintainers name (required for each maintainer)
    email: The maintainers email (optional for each maintainer)
    url: A URL for the maintainer (optional for each maintainer)
icon: A URL to an SVG or PNG image to be used as an icon (optional).
appVersion: The version of the app that this contains (optional). Needn't be SemVer. Quotes recommended.
deprecated: Whether this chart is deprecated (optional, boolean)
annotations:
  example: A list of annotations keyed by name (optional).
```

À partir de [v3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2), les champs
supplémentaires ne sont plus autorisés. L'approche recommandée est d'ajouter des
métadonnées personnalisées dans `annotations`.

### Charts et versioning

Chaque chart doit avoir un numéro de version. Une version doit suivre le standard
[SemVer 2](https://semver.org/spec/v2.0.0.html), mais ce n'est pas strictement
imposé. Contrairement à Helm Classic, Helm v2 et les versions ultérieures utilisent
les numéros de version comme marqueurs de release. Les paquets dans les dépôts sont
identifiés par leur nom plus leur version.

Par exemple, un chart `nginx` dont le champ version est défini à `version: 1.2.3`
sera nommé :

```text
nginx-1.2.3.tgz
```

Des noms SemVer 2 plus complexes sont également supportés, comme `version:
1.2.3-alpha.1+ef365`. Cependant, les noms non-SemVer sont explicitement interdits
par le système. Sont toutefois acceptés les formats de version `x` ou `x.y`.
Par exemple, s'il y a un `v` initial ou une version listée sans les 3 parties
(par ex. `v1.2`), Helm tentera de la convertir en une version sémantique valide
(par ex. `v1.2.0`).

**NOTE :** Alors que Helm Classic et Deployment Manager étaient très orientés
GitHub en ce qui concerne les charts, Helm v2 et les versions ultérieures ne
dépendent pas de GitHub ni ne requièrent Git. Par conséquent, les SHA Git ne
sont pas du tout utilisés pour le versioning.

Le champ `version` dans le fichier `Chart.yaml` est utilisé par de nombreux
outils Helm, y compris la CLI. Lors de la génération d'un paquet, la commande
`helm package` utilisera la version trouvée dans le `Chart.yaml` comme jeton
dans le nom du paquet. Le système suppose que le numéro de version dans le nom
du paquet de chart correspond au numéro de version dans le `Chart.yaml`. Le
non-respect de cette hypothèse provoquera une erreur.

### Le champ `apiVersion`

Le champ `apiVersion` doit être `v2` pour les charts Helm nécessitant au moins
Helm 3. Les charts supportant les versions précédentes de Helm ont un `apiVersion`
défini à `v1` et restent installables par Helm 3.

Changements de `v1` à `v2` :

- Un champ `dependencies` définissant les dépendances du chart, qui étaient
  situées dans un fichier séparé `requirements.yaml` pour les charts `v1`
  (voir [Dépendances des charts](#dependances-des-charts)).
- Le champ `type`, distinguant les charts d'application et les charts de type
  library (voir [Types de charts](#types-de-charts)).

### Le champ `appVersion`

Notez que le champ `appVersion` n'est pas lié au champ `version`. C'est un moyen
de spécifier la version de l'application. Par exemple, le chart `drupal` peut
avoir un `appVersion: "8.2.1"`, indiquant que la version de Drupal incluse dans
le chart (par défaut) est `8.2.1`. Ce champ est informatif et n'a aucun impact
sur les calculs de version du chart. Il est fortement recommandé d'entourer la
version de guillemets. Cela force l'analyseur YAML à traiter le numéro de version
comme une chaîne. Ne pas utiliser de guillemets peut entraîner des problèmes
d'analyse dans certains cas. Par exemple, YAML interprète `1.0` comme une valeur
à virgule flottante, et un SHA de commit git comme `1234e10` comme une notation
scientifique.

À partir de Helm v3.5.0, `helm create` entoure le champ `appVersion` par défaut
de guillemets.

### Le champ `kubeVersion`

Le champ optionnel `kubeVersion` peut définir des contraintes semver sur les
versions de Kubernetes supportées. Helm validera les contraintes de version lors
de l'installation du chart et échouera si le cluster exécute une version de
Kubernetes non supportée.

Les contraintes de version peuvent comprendre des comparaisons AND séparées par
des espaces comme :
```
>= 1.13.0 < 1.15.0
```
qui peuvent elles-mêmes être combinées avec l'opérateur OR `||` comme dans
l'exemple suivant :
```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```
Dans cet exemple, la version `1.14.0` est exclue, ce qui peut être utile si un
bug dans certaines versions est connu pour empêcher le chart de fonctionner
correctement.

En plus des contraintes de version utilisant les opérateurs `=` `!=` `>` `<`
`>=` `<=`, les notations raccourcies suivantes sont supportées :

 * plages avec tiret pour les intervalles fermés, où `1.1 - 2.3.4` est équivalent
   à `>= 1.1 <= 2.3.4`.
 * jokers `x`, `X` et `*`, où `1.2.x` est équivalent à `>= 1.2.0 < 1.3.0`.
 * plages tilde (changements de version patch autorisés), où `~1.2.3` est
   équivalent à `>= 1.2.3 < 1.3.0`.
 * plages caret (changements de version mineure autorisés), où `^1.2.3` est
   équivalent à `>= 1.2.3 < 2.0.0`.

Pour une explication détaillée des contraintes semver supportées, consultez
[Masterminds/semver](https://github.com/Masterminds/semver).

### Déprécier des charts

Lors de la gestion de charts dans un dépôt de charts, il est parfois nécessaire
de déprécier un chart. Le champ optionnel `deprecated` dans `Chart.yaml` peut
être utilisé pour marquer un chart comme déprécié. Si la **dernière** version
d'un chart dans le dépôt est marquée comme dépréciée, alors le chart dans son
ensemble est considéré comme déprécié. Le nom du chart peut être réutilisé
ultérieurement en publiant une nouvelle version qui n'est pas marquée comme
dépréciée. Le workflow pour déprécier des charts est :

1. Mettre à jour le `Chart.yaml` du chart pour le marquer comme déprécié, en
   incrémentant la version
2. Publier la nouvelle version du chart dans le dépôt de charts
3. Supprimer le chart du dépôt source (par ex. git)

### Types de charts

Le champ `type` définit le type de chart. Il existe deux types : `application`
et `library`. Application est le type par défaut et c'est le chart standard sur
lequel on peut effectuer toutes les opérations. Le [chart de type library](/topics/library_charts.md)
fournit des utilitaires ou des fonctions pour le créateur du chart. Un chart de
type library diffère d'un chart d'application car il n'est pas installable et
ne contient généralement pas d'objets ressources.

**Note :** Un chart d'application peut être utilisé comme chart de type library.
Cela s'active en définissant le type à `library`. Le chart sera alors rendu
comme un chart de type library où tous les utilitaires et fonctions peuvent être
exploités. Tous les objets ressources du chart ne seront pas rendus.

## LICENSE, README et NOTES d'un chart

Les charts peuvent également contenir des fichiers décrivant l'installation, la
configuration, l'utilisation et la licence d'un chart.

Une LICENSE est un fichier texte brut contenant la
[licence](https://fr.wikipedia.org/wiki/Licence_de_logiciel) du chart. Le chart
peut contenir une licence car il peut avoir une logique de programmation dans
les templates et ne serait donc pas uniquement de la configuration. Il peut
également y avoir des licences séparées pour l'application installée par le
chart, si nécessaire.

Un README pour un chart doit être formaté en Markdown (README.md), et devrait
généralement contenir :

- Une description de l'application ou du service fourni par le chart
- Tout prérequis ou exigence pour exécuter le chart
- Des descriptions des options dans `values.yaml` et des valeurs par défaut
- Toute autre information pertinente pour l'installation ou la configuration
  du chart

Lorsque les hubs et autres interfaces utilisateur affichent les détails d'un
chart, ces informations sont extraites du contenu du fichier `README.md`.

Le chart peut également contenir un court fichier texte `templates/NOTES.txt`
qui sera affiché après l'installation et lors de l'affichage du statut d'une
release. Ce fichier est évalué comme un [template](#templates-et-values), et
peut être utilisé pour afficher des notes d'utilisation, les prochaines étapes,
ou toute autre information pertinente pour une release du chart. Par exemple,
des instructions pourraient être fournies pour se connecter à une base de
données ou accéder à une interface web. Comme ce fichier est affiché sur STDOUT
lors de l'exécution de `helm install` ou `helm status`, il est recommandé de
garder le contenu bref et de pointer vers le README pour plus de détails.

## Dépendances des charts

Dans Helm, un chart peut dépendre de n'importe quel nombre d'autres charts. Ces
dépendances peuvent être liées dynamiquement en utilisant le champ `dependencies`
dans `Chart.yaml` ou importées dans le répertoire `charts/` et gérées manuellement.

### Gérer les dépendances avec le champ `dependencies`

Les charts requis par le chart actuel sont définis comme une liste dans le champ
`dependencies`.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- Le champ `name` est le nom du chart souhaité.
- Le champ `version` est la version du chart souhaitée.
- Le champ `repository` est l'URL complète du dépôt de charts. Notez que vous
  devez également utiliser `helm repo add` pour ajouter ce dépôt localement.
- Vous pouvez utiliser le nom du dépôt au lieu de l'URL

```console
$ helm repo add fantastic-charts https://charts.helm.sh/incubator
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

Une fois les dépendances définies, vous pouvez exécuter `helm dependency update`
qui utilisera votre fichier de dépendances pour télécharger tous les charts
spécifiés dans votre répertoire `charts/`.

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

Lorsque `helm dependency update` récupère les charts, il les stocke sous forme
d'archives de charts dans le répertoire `charts/`. Ainsi, pour l'exemple
ci-dessus, on s'attendrait à voir les fichiers suivants dans le répertoire charts :

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### Champ alias dans les dépendances

En plus des autres champs ci-dessus, chaque entrée de dépendance peut contenir
le champ optionnel `alias`.

Ajouter un alias pour un chart de dépendance place ce chart dans les dépendances
en utilisant l'alias comme nom de la nouvelle dépendance.

On peut utiliser `alias` lorsqu'on a besoin d'accéder à un chart avec un ou
plusieurs autres noms.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

Dans l'exemple ci-dessus, nous obtiendrons 3 dépendances au total pour `parentchart` :

```text
subchart
new-subchart-1
new-subchart-2
```

La méthode manuelle pour accomplir cela serait de copier/coller le même chart
dans le répertoire `charts/` plusieurs fois avec des noms différents.

#### Champs tags et condition dans les dépendances

En plus des autres champs ci-dessus, chaque entrée de dépendance peut contenir
les champs optionnels `tags` et `condition`.

Tous les charts sont chargés par défaut. Si les champs `tags` ou `condition`
sont présents, ils seront évalués et utilisés pour contrôler le chargement des
charts auxquels ils s'appliquent.

Condition - Le champ condition contient un ou plusieurs chemins YAML (délimités
par des virgules). Si ce chemin existe dans les values du parent de niveau
supérieur et se résout en une valeur booléenne, le chart sera activé ou
désactivé en fonction de cette valeur booléenne. Seul le premier chemin valide
trouvé dans la liste est évalué et si aucun chemin n'existe, la condition n'a
aucun effet.

Tags - Le champ tags est une liste YAML de labels à associer à ce chart. Dans
les values du parent de niveau supérieur, tous les charts avec des tags peuvent
être activés ou désactivés en spécifiant le tag et une valeur booléenne.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled,global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

Dans l'exemple ci-dessus, tous les charts avec le tag `front-end` seraient
désactivés, mais comme le chemin `subchart1.enabled` s'évalue à 'true' dans les
values du parent, la condition prendra le dessus sur le tag `front-end` et
`subchart1` sera activé.

Puisque `subchart2` a le tag `back-end` et que ce tag s'évalue à `true`,
`subchart2` sera activé. Notez également que bien que `subchart2` ait une
condition spécifiée, il n'y a pas de chemin et de valeur correspondants dans
les values du parent, donc cette condition n'a aucun effet.

##### Utiliser la CLI avec les tags et conditions

Le paramètre `--set` peut être utilisé comme d'habitude pour modifier les
valeurs des tags et conditions.

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### Résolution des tags et conditions

- **Les conditions (quand elles sont définies dans les values) prennent toujours
  le dessus sur les tags.** Le premier chemin de condition qui existe l'emporte
  et les suivants pour ce chart sont ignorés.
- Les tags sont évalués comme "si l'un des tags du chart est vrai, alors activer
  le chart".
- Les valeurs des tags et conditions doivent être définies dans les values du
  parent de niveau supérieur.
- La clé `tags:` dans les values doit être une clé de niveau supérieur. Les
  globaux et les tables `tags:` imbriquées ne sont actuellement pas supportés.

#### Importer les values des charts enfants via les dépendances

Dans certains cas, il est souhaitable de permettre aux values d'un chart enfant
de se propager au chart parent et d'être partagées comme valeurs par défaut
communes. Un avantage supplémentaire de l'utilisation du format `exports` est
qu'il permettra aux outils futurs d'introspecter les valeurs configurables par
l'utilisateur.

Les clés contenant les values à importer peuvent être spécifiées dans les
`dependencies` du chart parent dans le champ `import-values` en utilisant une
liste YAML. Chaque élément de la liste est une clé qui est importée depuis le
champ `exports` du chart enfant.

Pour importer des values non contenues dans la clé `exports`, utilisez le format
[child-parent](#utiliser-le-format-child-parent). Des exemples des deux formats
sont décrits ci-dessous.

##### Utiliser le format exports

Si le fichier `values.yaml` d'un chart enfant contient un champ `exports` à la
racine, son contenu peut être importé directement dans les values du parent en
spécifiant les clés à importer comme dans l'exemple ci-dessous :

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

Puisque nous spécifions la clé `data` dans notre liste d'import, Helm cherche
dans le champ `exports` du chart enfant la clé `data` et importe son contenu.

Les values finales du parent contiendront notre champ exporté :

```yaml
# parent's values

myint: 99
```

Veuillez noter que la clé parente `data` n'est pas contenue dans les values
finales du parent. Si vous avez besoin de spécifier la clé parente, utilisez le
format 'child-parent'.

##### Utiliser le format child-parent

Pour accéder aux values qui ne sont pas contenues dans la clé `exports` des
values du chart enfant, vous devrez spécifier la clé source des values à
importer (`child`) et le chemin de destination dans les values du chart parent
(`parent`).

Le `import-values` dans l'exemple ci-dessous indique à Helm de prendre toutes
les values trouvées au chemin `child:` et de les copier vers les values du
parent au chemin spécifié dans `parent:`

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

Dans l'exemple ci-dessus, les values trouvées à `default.data` dans les values
de subchart1 seront importées à la clé `myimports` dans les values du chart
parent comme détaillé ci-dessous :

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true
```

Les values résultantes du chart parent seraient :

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

Les values finales du parent contiennent maintenant les champs `myint` et
`mybool` importés de subchart1.

### Gérer les dépendances manuellement via le répertoire `charts/`

Si plus de contrôle sur les dépendances est souhaité, ces dépendances peuvent
être exprimées explicitement en copiant les charts de dépendance dans le
répertoire `charts/`.

Une dépendance doit être un répertoire de chart non compressé mais son nom ne
peut pas commencer par `_` ou `.`. De tels fichiers sont ignorés par le chargeur
de chart.

Par exemple, si le chart WordPress dépend du chart Apache, le chart Apache (de
la bonne version) est fourni dans le répertoire `charts/` du chart WordPress :

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

L'exemple ci-dessus montre comment le chart WordPress exprime sa dépendance
envers Apache et MySQL en incluant ces charts dans son répertoire `charts/`.

**CONSEIL :** _Pour placer une dépendance dans votre répertoire `charts/`,
utilisez la commande `helm pull`_

### Aspects opérationnels de l'utilisation des dépendances

Les sections ci-dessus expliquent comment spécifier les dépendances de charts,
mais comment cela affecte-t-il l'installation de charts avec `helm install` et
`helm upgrade` ?

Supposons qu'un chart nommé "A" crée les objets Kubernetes suivants :

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

De plus, A dépend du chart B qui crée les objets :

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

Après l'installation/mise à niveau du chart A, une seule release Helm est
créée/modifiée. La release créera/mettra à jour tous les objets Kubernetes
ci-dessus dans l'ordre suivant :

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

C'est parce que lorsque Helm installe/met à niveau des charts, les objets
Kubernetes provenant des charts et de toutes leurs dépendances sont :

- agrégés en un seul ensemble ; puis
- triés par type suivi du nom ; et ensuite
- créés/mis à jour dans cet ordre.

Par conséquent, une seule release est créée avec tous les objets du chart et de
ses dépendances.

L'ordre d'installation des types Kubernetes est donné par l'énumération
InstallOrder dans kind_sorter.go (voir [le fichier source Helm](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)).

## Templates et Values

Les templates de charts Helm sont écrits dans le [langage de template
Go](https://golang.org/pkg/text/template/), avec l'ajout d'une cinquantaine de
fonctions de template supplémentaires [de la bibliothèque Sprig](https://github.com/Masterminds/sprig)
et quelques autres [fonctions spécialisées](/howto/charts_tips_and_tricks.md).

Tous les fichiers de template sont stockés dans le dossier `templates/` d'un
chart. Lorsque Helm effectue le rendu des charts, il passe chaque fichier de ce
répertoire à travers le moteur de template.

Les values pour les templates sont fournies de deux manières :

- Les développeurs de charts peuvent fournir un fichier appelé `values.yaml` dans
  un chart. Ce fichier peut contenir des valeurs par défaut.
- Les utilisateurs de charts peuvent fournir un fichier YAML contenant des values.
  Celui-ci peut être fourni en ligne de commande avec `helm install`.

Lorsqu'un utilisateur fournit des values personnalisées, ces values remplaceront
les values du fichier `values.yaml` du chart.

### Fichiers de template

Les fichiers de template suivent les conventions standard pour écrire des
templates Go (voir la [documentation du package Go text/template](https://golang.org/pkg/text/template/)
pour les détails). Un exemple de fichier de template pourrait ressembler à ceci :

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

L'exemple ci-dessus, inspiré de
[https://github.com/deis/charts](https://github.com/deis/charts), est un template
pour un contrôleur de réplication Kubernetes. Il peut utiliser les quatre values
de template suivantes (généralement définies dans un fichier `values.yaml`) :

- `imageRegistry` : Le registre source pour l'image Docker.
- `dockerTag` : Le tag pour l'image Docker.
- `pullPolicy` : La politique de pull Kubernetes.
- `storage` : Le backend de stockage, dont la valeur par défaut est `"minio"`

Toutes ces values sont définies par l'auteur du template. Helm n'exige ni ne
dicte de paramètres.

Pour voir de nombreux charts fonctionnels, consultez le [Artifact Hub](https://artifacthub.io/packages/search?kind=0)
de la CNCF.

### Values prédéfinies

Les values fournies via un fichier `values.yaml` (ou via le flag `--set`) sont
accessibles depuis l'objet `.Values` dans un template. Mais il existe d'autres
éléments de données prédéfinis auxquels vous pouvez accéder dans vos templates.

Les values suivantes sont prédéfinies, disponibles pour chaque template, et ne
peuvent pas être remplacées. Comme pour toutes les values, les noms sont
_sensibles à la casse_.

- `Release.Name` : Le nom de la release (pas du chart)
- `Release.Namespace` : Le namespace dans lequel le chart a été déployé.
- `Release.Service` : Le service qui a effectué la release.
- `Release.IsUpgrade` : Défini à true si l'opération actuelle est une mise à
  niveau ou un rollback.
- `Release.IsInstall` : Défini à true si l'opération actuelle est une installation.
- `Chart` : Le contenu du `Chart.yaml`. Ainsi, la version du chart est accessible
  via `Chart.Version` et les mainteneurs sont dans `Chart.Maintainers`.
- `Files` : Un objet de type map contenant tous les fichiers non spéciaux du
  chart. Cela ne vous donne pas accès aux templates, mais vous permet d'accéder
  aux fichiers additionnels présents (sauf s'ils sont exclus via `.helmignore`).
  Les fichiers sont accessibles via `{{ index .Files "file.name" }}` ou via la
  fonction `{{.Files.Get name }}`. Vous pouvez également accéder au contenu du
  fichier sous forme de `[]byte` avec `{{ .Files.GetBytes }}`
- `Capabilities` : Un objet de type map contenant des informations sur les
  versions de Kubernetes (`{{ .Capabilities.KubeVersion }}`) et les versions
  d'API Kubernetes supportées
  (`{{ .Capabilities.APIVersions.Has "batch/v1" }}`)

**NOTE :** Tout champ inconnu du `Chart.yaml` sera supprimé. Il ne sera pas
accessible dans l'objet `Chart`. Ainsi, `Chart.yaml` ne peut pas être utilisé
pour passer des données structurées arbitraires dans le template. Le fichier
values peut être utilisé à cette fin.

### Fichiers values

En considérant le template de la section précédente, un fichier `values.yaml`
fournissant les values nécessaires ressemblerait à ceci :

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

Un fichier values est formaté en YAML. Un chart peut inclure un fichier
`values.yaml` par défaut. La commande helm install permet à un utilisateur de
remplacer les values en fournissant des values YAML supplémentaires :

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

Lorsque les values sont passées de cette manière, elles seront fusionnées avec
le fichier values par défaut. Par exemple, considérons un fichier `myvals.yaml`
qui ressemble à ceci :

```yaml
storage: "gcs"
```

Lorsque ceci est fusionné avec le `values.yaml` du chart, le contenu généré
résultant sera :

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Notez que seul le dernier champ a été remplacé.

**NOTE :** Le fichier values par défaut inclus dans un chart _doit_ être nommé
`values.yaml`. Mais les fichiers spécifiés en ligne de commande peuvent avoir
n'importe quel nom.

**NOTE :** Si le flag `--set` est utilisé avec `helm install` ou `helm upgrade`,
ces values sont simplement converties en YAML côté client.

**NOTE :** Si des entrées obligatoires existent dans le fichier values, elles
peuvent être déclarées comme requises dans le template du chart en utilisant la
[fonction 'required'](/howto/charts_tips_and_tricks.md).

Toutes ces values sont ensuite accessibles dans les templates via l'objet
`.Values` :

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### Portée, dépendances et values

Les fichiers values peuvent déclarer des values pour le chart de niveau
supérieur, ainsi que pour tous les charts inclus dans le répertoire `charts/`
de ce chart. Ou, formulé différemment, un fichier values peut fournir des values
au chart ainsi qu'à toutes ses dépendances. Par exemple, le chart WordPress de
démonstration ci-dessus a `mysql` et `apache` comme dépendances. Le fichier
values pourrait fournir des values à tous ces composants :

```yaml
title: "My WordPress Site" # Sent to the WordPress template

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Les charts de niveau supérieur ont accès à toutes les variables définies en
dessous. Ainsi, le chart WordPress peut accéder au mot de passe MySQL via
`.Values.mysql.password`. Mais les charts de niveau inférieur ne peuvent pas
accéder aux éléments des charts parents, donc MySQL ne pourra pas accéder à la
propriété `title`. De même, il ne peut pas accéder à `apache.port`.

Les values sont séparées par namespace, mais les préfixes de namespace sont
supprimés. Ainsi, pour le chart WordPress, il peut accéder au champ du mot de
passe MySQL via `.Values.mysql.password`. Mais pour le chart MySQL, la portée
des values a été réduite et le préfixe de namespace supprimé, donc il verra le
champ password simplement comme `.Values.password`.

#### Values globales

À partir de la version 2.0.0-Alpha.2, Helm supporte des values "globales"
spéciales. Considérons cette version modifiée de l'exemple précédent :

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Ceci ajoute une section `global` avec la valeur `app: MyWordPress`. Cette valeur
est disponible pour _tous_ les charts via `.Values.global.app`.

Par exemple, les templates `mysql` peuvent accéder à `app` via
`{{ .Values.global.app }}`, tout comme le chart `apache`. En fait, le fichier
values ci-dessus est régénéré comme ceci :

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Passed to Apache
```

Cela fournit un moyen de partager une variable de niveau supérieur avec tous les
sous-charts, ce qui est utile pour des choses comme définir des propriétés
`metadata` comme les labels.

Si un sous-chart déclare une variable globale, cette globale sera passée _vers
le bas_ (aux sous-charts du sous-chart), mais pas _vers le haut_ au chart parent.
Il n'y a aucun moyen pour un sous-chart d'influencer les values du chart parent.

De plus, les variables globales des charts parents ont la priorité sur les
variables globales des sous-charts.

### Fichiers de schéma

Parfois, un mainteneur de chart peut vouloir définir une structure pour ses
values. Cela peut être fait en définissant un schéma dans le fichier
`values.schema.json`. Un schéma est représenté sous forme de [JSON Schema](https://json-schema.org/).
Il pourrait ressembler à ceci :

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

Ce schéma sera appliqué aux values pour les valider. La validation se produit
lorsque l'une des commandes suivantes est invoquée :

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

Un exemple de fichier `values.yaml` qui répond aux exigences de ce schéma
pourrait ressembler à ceci :

```yaml
name: frontend
protocol: https
port: 443
```

Notez que le schéma est appliqué à l'objet `.Values` final, et pas seulement au
fichier `values.yaml`. Cela signifie que le fichier `yaml` suivant est valide,
à condition que le chart soit installé avec l'option `--set` appropriée montrée
ci-dessous.

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

De plus, l'objet `.Values` final est vérifié par rapport aux schémas de *tous*
les sous-charts. Cela signifie que les restrictions d'un sous-chart ne peuvent
pas être contournées par un chart parent. Cela fonctionne également dans l'autre
sens - si un sous-chart a une exigence qui n'est pas satisfaite dans le fichier
`values.yaml` du sous-chart, le chart parent *doit* satisfaire ces restrictions
pour être valide.

La validation de schéma peut être désactivée avec l'option montrée ci-dessous.
C'est particulièrement utile dans les environnements isolés lorsque le fichier
JSON Schema d'un chart contient des références distantes.
```console
helm install --skip-schema-validation
```

### Références

En ce qui concerne l'écriture de templates, values et fichiers de schéma, il
existe plusieurs références standard qui vous aideront.

- [Templates Go](https://godoc.org/text/template)
- [Fonctions de template supplémentaires](https://godoc.org/github.com/Masterminds/sprig)
- [Le format YAML](https://yaml.org/spec/)
- [JSON Schema](https://json-schema.org/)

## Custom Resource Definitions (CRDs)

Kubernetes fournit un mécanisme pour déclarer de nouveaux types d'objets
Kubernetes. En utilisant les CustomResourceDefinitions (CRDs), les développeurs
Kubernetes peuvent déclarer des types de ressources personnalisées.

Dans Helm 3, les CRDs sont traitées comme un type spécial d'objet. Elles sont
installées avant le reste du chart et sont soumises à certaines limitations.

Les fichiers YAML CRD doivent être placés dans le répertoire `crds/` à
l'intérieur d'un chart. Plusieurs CRDs (séparées par des marqueurs de début et
de fin YAML) peuvent être placées dans le même fichier. Helm tentera de charger
_tous_ les fichiers du répertoire CRD dans Kubernetes.

Les fichiers CRD _ne peuvent pas être templatisés_. Ils doivent être des
documents YAML bruts.

Lorsque Helm installe un nouveau chart, il télécharge les CRDs, attend jusqu'à
ce que les CRDs soient rendues disponibles par le serveur API, puis démarre le
moteur de template, effectue le rendu du reste du chart, et le télécharge vers
Kubernetes. En raison de cet ordre, les informations CRD sont disponibles dans
l'objet `.Capabilities` des templates Helm, et les templates Helm peuvent créer
de nouvelles instances d'objets qui ont été déclarés dans les CRDs.

Par exemple, si votre chart avait une CRD pour `CronTab` dans le répertoire
`crds/`, vous pouvez créer des instances du type `CronTab` dans le répertoire
`templates/` :

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

Le fichier `crontab.yaml` doit contenir la CRD sans directives de template :

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

Ensuite, le template `mycrontab.yaml` peut créer un nouveau `CronTab` (en
utilisant les templates comme d'habitude) :

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

Helm s'assurera que le type `CronTab` a été installé et est disponible depuis
le serveur API Kubernetes avant de procéder à l'installation des éléments dans
`templates/`.

### Limitations des CRDs

Contrairement à la plupart des objets dans Kubernetes, les CRDs sont installées
globalement. Pour cette raison, Helm adopte une approche très prudente dans la
gestion des CRDs. Les CRDs sont soumises aux limitations suivantes :

- Les CRDs ne sont jamais réinstallées. Si Helm détermine que les CRDs dans le
  répertoire `crds/` sont déjà présentes (quelle que soit la version), Helm ne
  tentera pas de les installer ou de les mettre à niveau.
- Les CRDs ne sont jamais installées lors d'une mise à niveau ou d'un rollback.
  Helm créera uniquement les CRDs lors des opérations d'installation.
- Les CRDs ne sont jamais supprimées. La suppression d'une CRD supprime
  automatiquement tout le contenu de la CRD dans tous les namespaces du cluster.
  Par conséquent, Helm ne supprimera pas les CRDs.

Les opérateurs qui souhaitent mettre à niveau ou supprimer des CRDs sont
encouragés à le faire manuellement et avec beaucoup de précaution.

## Utiliser Helm pour gérer les charts

L'outil `helm` dispose de plusieurs commandes pour travailler avec les charts.

Il peut créer un nouveau chart pour vous :

```console
$ helm create mychart
Created mychart/
```

Une fois que vous avez modifié un chart, `helm` peut l'empaqueter dans une
archive de chart pour vous :

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

Vous pouvez également utiliser `helm` pour vous aider à trouver des problèmes
de formatage ou d'information dans votre chart :

```console
$ helm lint mychart
No issues found
```

## Dépôts de charts

Un _dépôt de charts_ est un serveur HTTP qui héberge un ou plusieurs charts
empaquetés. Bien que `helm` puisse être utilisé pour gérer des répertoires de
charts locaux, quand il s'agit de partager des charts, le mécanisme préféré est
un dépôt de charts.

Tout serveur HTTP capable de servir des fichiers YAML et tar et de répondre aux
requêtes GET peut être utilisé comme serveur de dépôt. L'équipe Helm a testé
certains serveurs, notamment Google Cloud Storage avec le mode site web activé,
et S3 avec le mode site web activé.

Un dépôt est caractérisé principalement par la présence d'un fichier spécial
appelé `index.yaml` qui contient une liste de tous les paquets fournis par le
dépôt, ainsi que des métadonnées permettant de récupérer et vérifier ces paquets.

Côté client, les dépôts sont gérés avec les commandes `helm repo`. Cependant,
Helm ne fournit pas d'outils pour télécharger des charts vers des serveurs de
dépôt distants. En effet, cela ajouterait des exigences substantielles à un
serveur implémentant cette fonctionnalité, et augmenterait donc la barrière
pour mettre en place un dépôt.

## Packs de démarrage de charts

La commande `helm create` prend une option optionnelle `--starter` qui vous
permet de spécifier un "chart de démarrage". De plus, l'option starter a un
alias court `-p`.

Exemples d'utilisation :

```console
helm create my-chart --starter starter-name
helm create my-chart -p starter-name
helm create my-chart -p /absolute/path/to/starter-name
```

Les starters sont simplement des charts ordinaires, mais situés dans
`$XDG_DATA_HOME/helm/starters`. En tant que développeur de chart, vous pouvez
créer des charts spécifiquement conçus pour être utilisés comme starters. Ces
charts doivent être conçus avec les considérations suivantes en tête :

- Le `Chart.yaml` sera écrasé par le générateur.
- Les utilisateurs s'attendront à modifier le contenu d'un tel chart, donc la
  documentation devrait indiquer comment les utilisateurs peuvent le faire.
- Toutes les occurrences de `<CHARTNAME>` seront remplacées par le nom de chart
  spécifié afin que les charts de démarrage puissent être utilisés comme
  templates, sauf pour certains fichiers de variables. Par exemple, si vous
  utilisez des fichiers personnalisés dans le répertoire `vars` ou certains
  fichiers `README.md`, `<CHARTNAME>` ne sera PAS remplacé à l'intérieur de
  ceux-ci. De plus, la description du chart n'est pas héritée.

Actuellement, la seule façon d'ajouter un chart à `$XDG_DATA_HOME/helm/starters`
est de le copier manuellement. Dans la documentation de votre chart, vous
voudrez peut-être expliquer ce processus.
