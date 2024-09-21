---
title: "Charts"
description: "Explique le format des charts et fournit des conseils de base pour créer des charts avec Helm."
weight: 1
---

Helm utilise un format de packaging appelé _charts_. Un chart est une collection de fichiers qui décrivent un ensemble de ressources Kubernetes liées. Un seul chart peut être utilisé pour déployer quelque chose de simple, comme un pod memcached, ou quelque chose de complexe, comme une pile d'application web complète avec serveurs HTTP, bases de données, caches, etc.

Les charts sont créés sous forme de fichiers organisés dans un arbre de répertoires particulier. Ils peuvent être emballés dans des archives versionnées pour être déployés.

Si vous souhaitez télécharger et consulter les fichiers d'un chart publié sans l'installer, vous pouvez le faire avec la commande `helm pull chartrepo/chartname`.

Ce document explique le format des charts et fournit des conseils de base pour créer des charts avec Helm.

## La structure des fichiers d'un chart

Un chart est organisé comme une collection de fichiers dans un répertoire. Le nom du répertoire est le nom du chart (sans les informations de version). Ainsi, un chart décrivant WordPress serait stocké dans un répertoire `wordpress/`.

À l'intérieur de ce répertoire, Helm s'attend à une structure qui correspond à ceci :

```text
wordpress/
  Chart.yaml          # Un fichier YAML qui contient les informations sur le charts
  LICENSE             # OPTIONNEL : Un fichier en texte brut contenant la licence du chart
  README.md           # OPTIONNEL : Un fichier README lisible par l'homme
  values.yaml         # Les valeurs de configuration par défaut pour ce chart
  values.schema.json  # OPTIONNEL : Un schéma JSON pour imposer une structure au fichier values.yaml
  charts/             # Un répertoire contenant les charts dont ce chart dépend.
  crds/               # Custom Resource Definitions
  templates/          # Un répertoire de templates qui, combinés avec les valeurs, généreront des fichiers manifest Kubernetes valides.
  templates/NOTES.txt # OPTIONNEL : Un fichier en texte brut contenant de courtes notes d'utilisation
```

Helm réserve l'utilisation des répertoires `charts/`, `crds/` et `templates/`, ainsi que des noms de fichiers listés. Les autres fichiers seront laissés tels quels.

## Le fichier Chart.yaml

Le fichier `Chart.yaml` est requis pour un chart. Il contient les champs suivants :

```yaml
apiVersion: La version API du chart (requis)
name: Le nom du chart (requis)
version: Une version SemVer 2 (requis)
kubeVersion: Une plage de versions Kubernetes compatibles en SemVer (optionnel)
description: Une description en une phrase de ce projet (optionnel)
type: Le type du chart (optionnel)
keywords:
  - Une liste de mots-clés concernant ce projet (optionnel)
home: L'URL de la page d'accueil de ce projet (optionnel)
sources:
  - Une liste d'URLs vers le code source de ce projet (optionnel)
dependencies: # Une liste des dépendances du chart (optionnel)
  - name: Le nom du chart (nginx)
    version: La version du chart ("1.2.3")
    repository: (optionnel) L'URL du dépôt ("https://example.com/charts") ou un alias ("@repo-name")
    condition: (optionnel) Un chemin YAML qui résout en booléen, utilisé pour activer/désactiver des charts (ex. : subchart1.enabled)
    tags: # (optionnel)
      - Les tags peuvent être utilisés pour grouper les charts pour les activer/désactiver ensemble
    import-values: # (optionnel)
      - ImportValues contient le mappage des valeurs source vers la clé parente à importer. Chaque élément peut être une chaîne ou une paire d'éléments enfants/parents.
    alias: (optionnel) Alias à utiliser pour le chart. Utile lorsque vous devez ajouter le même chart plusieurs fois
maintainers: # (optionnel)
  - name: Le nom du mainteneur (requis pour chaque mainteneur)
    email: L'email du mainteneur (optionnel pour chaque mainteneur)
    url: Une URL pour le mainteneur (optionnel pour chaque mainteneur)
icon: Une URL vers une image SVG ou PNG à utiliser comme icône (optionnel)
appVersion: La version de l'application que ce chart contient (optionnel). N'a pas besoin d'être en SemVer. Les guillemets sont recommandés.
deprecated: Indique si ce chart est obsolète (optionnel, booléen)
annotations:
  example: Une liste d'annotations avec des clés par nom (optionnel).
```

Depuis [v3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2), les champs supplémentaires ne sont pas autorisés. L'approche recommandée est d'ajouter des métadonnées personnalisées dans `annotations`.

### Charts et versionnage

Chaque chart doit avoir un numéro de version. Une version doit suivre le standard [SemVer 2](https://semver.org/spec/v2.0.0.html). Contrairement à Helm Classic, Helm v2 et les versions ultérieures utilisent les numéros de version comme marqueurs de release. Les packages dans les dépôts sont identifiés par leur nom ainsi que leur version.

Par exemple, un chart `nginx` dont le champ de version est défini sur `version: 1.2.3` sera nommé :

```text
nginx-1.2.3.tgz
```

Des noms SemVer 2 plus complexes sont également pris en charge, tels que `version: 1.2.3-alpha.1+ef365`. Cependant, les noms non conformes à SemVer sont explicitement interdits par le système.

**REMARQUE :** Alors que Helm Classic et Deployment Manager étaient très orientés GitHub pour les charts, Helm v2 et les versions ultérieures ne dépendent ni de GitHub ni de Git. Par conséquent, il n'utilise pas du tout les SHAs Git pour le versionnage.

Le champ `version` à l'intérieur du fichier `Chart.yaml` est utilisé par de nombreux outils Helm, y compris la CLI. Lors de la génération d'un package, la commande `helm package` utilise la version trouvée dans le `Chart.yaml` comme jeton dans le nom du package. Le système suppose que le numéro de version dans le nom du package du chart correspond au numéro de version dans le `Chart.yaml`. Le non-respect de cette hypothèse entraînera une erreur.

### Le champ `apiVersion`

Le champ `apiVersion` doit être `v2` pour les charts Helm qui nécessitent au moins Helm 3. Les charts compatibles avec les versions précédentes de Helm ont un `apiVersion` défini sur `v1` et sont toujours installables par Helm 3.

Changements de `v1` à `v2` :

- Un champ `dependencies` définissant les dépendances du chart, qui étaient situées dans un fichier `requirements.yaml` séparé pour les charts `v1` (voir [Dépendances des Charts](#chart-dependencies)).
- Le champ `type`, discriminant les charts d'application et les charts de bibliothèque (voir [Types de Charts](#chart-types)).

### Le champ `appVersion`

Notez que le champ `appVersion` n'est pas lié au champ `version`. Il sert à spécifier la version de l'application. Par exemple, le chart `drupal` peut avoir un `appVersion: "8.2.1"`, ce qui indique que la version de Drupal incluse dans le chart (par défaut) est `8.2.1`. Ce champ est informatif et n'a aucun impact sur les calculs de version du chart. Il est fortement recommandé d'encapsuler la version entre guillemets. Cela force le parseur YAML à traiter le numéro de version comme une chaîne. Le fait de laisser la version sans guillemets peut entraîner des problèmes de parsing dans certains cas. Par exemple, YAML interprète `1.0` comme une valeur flottante, et un SHA de commit git comme `1234e10` comme une notation scientifique.

Depuis Helm v3.5.0, `helm create` entoure le champ `appVersion` par défaut de guillemets.

### Le champ `kubeVersion` 

Le champ optionnel `kubeVersion` peut définir des contraintes semver sur les versions Kubernetes prises en charge. Helm validera les contraintes de version lors de l'installation du chart et échouera si le cluster utilise une version de Kubernetes non supportée.

Les contraintes de version peuvent comprendre des comparaisons AND séparées par des espaces, telles que
```
>= 1.13.0 < 1.15.0
```
qui peuvent elles-mêmes être combinées avec l'opérateur OR `||`, comme dans l'exemple suivant
```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```
Dans cet exemple, la version `1.14.0` est exclue, ce qui peut être pertinent si un bug dans certaines versions est connu pour empêcher le bon fonctionnement du chart.

Outre les contraintes de version utilisant les opérateurs `=`, `!=`, `>`, `<`, `>=`, `<=`, les notations abrégées suivantes sont prises en charge :

* Plages par tiret pour les intervalles fermés, où `1.1 - 2.3.4` est équivalent à `>= 1.1 <= 2.3.4`.
* Caractères génériques `x`, `X` et `*`, où `1.2.x` est équivalent à `>= 1.2.0 < 1.3.0`.
* Plages avec tilde (changements de version de correctif autorisés), où `~1.2.3` est équivalent à `>= 1.2.3 < 1.3.0`.
* Plages avec caret (changements de version mineure autorisés), où `^1.2.3` est équivalent à `>= 1.2.3 < 2.0.0`.

Pour une explication détaillée des contraintes semver prises en charge, consultez [Masterminds/semver](https://github.com/Masterminds/semver).

### Dépréciation des Charts

Lors de la gestion des charts dans un dépôt de charts, il est parfois nécessaire de déprécier un chart. Le champ optionnel `deprecated` dans `Chart.yaml` peut être utilisé pour marquer un chart comme déprécié. Si la **dernière** version d'un chart dans le dépôt est marquée comme dépréciée, alors le chart dans son ensemble est considéré comme déprécié. Le nom du chart peut être réutilisé ultérieurement en publiant une version plus récente qui n'est pas marquée comme dépréciée. Le flux de travail pour la dépréciation des charts est le suivant :

1. Mettez à jour le `Chart.yaml` du chart pour marquer le chart comme déprécié, en augmentant la version.
2. Publiez la nouvelle version du chart dans le dépôt de charts.
3. Supprimez le chart du dépôt source (par exemple, git).

### Types de Charts

Le champ `type` définit le type de chart. Il y a deux types : `application` et `library`. `application` est le type par défaut et c'est le chart standard qui peut être entièrement utilisé. Le [chart de bibliothèque]({{}}) fournit des utilitaires ou des fonctions pour le constructeur de charts. Un chart de bibliothèque diffère d'un chart d'application car il n'est pas installable et ne contient généralement aucun objet de ressource.

**Remarque :** Un chart d'application peut être utilisé comme un chart de bibliothèque. Cela est possible en définissant le type sur `library`. Le chart sera alors rendu comme un chart de bibliothèque où toutes les utilitaires et fonctions peuvent être utilisées. Tous les objets de ressource du chart ne seront pas rendus.

## Licence, README et NOTES de Chart

Les charts peuvent également contenir des fichiers qui décrivent l'installation, la configuration, l'utilisation et la licence d'un chart.

Un fichier LICENSE est un fichier texte brut contenant la [licence](https://en.wikipedia.org/wiki/Software_license) du chart. Le chart peut contenir une licence car il peut avoir une logique de programmation dans les templates et ne serait donc pas uniquement une configuration. Il peut également y avoir des licences séparées pour l'application installée par le chart, si nécessaire.

Un README pour un chart devrait être formaté en Markdown (README.md) et devrait généralement contenir :

- Une description de l'application ou du service fourni par le chart
- Les prérequis ou les exigences pour exécuter le chart
- Descriptions des options dans `values.yaml` et des valeurs par défaut
- Toute autre information pertinente pour l'installation ou la configuration du chart

Lorsque les hubs et autres interfaces utilisateur affichent des détails sur un chart, ces détails sont tirés du contenu du fichier `README.md`.

Le chart peut également contenir un fichier `templates/NOTES.txt` en texte brut qui sera imprimé après l'installation et lors de la consultation du statut d'une release. Ce fichier est évalué comme un [template](#templates-and-values) et peut être utilisé pour afficher des notes d'utilisation, des étapes suivantes ou toute autre information pertinente pour une release du chart. Par exemple, des instructions pourraient être fournies pour se connecter à une base de données ou accéder à une interface web. Étant donné que ce fichier est imprimé sur STDOUT lors de l'exécution de `helm install` ou `helm status`, il est recommandé de garder le contenu bref et de renvoyer au README pour plus de détails.

## Dépendances des Charts

Dans Helm, un chart peut dépendre d'un certain nombre d'autres charts. Ces dépendances peuvent être liées dynamiquement à l'aide du champ `dependencies` dans `Chart.yaml` ou ajoutées manuellement dans le répertoire `charts/` et gérées manuellement.

### Gestion des dépendances avec le champ `dependencies`

Les charts requis par le chart actuel sont définis sous forme de liste dans le champ `dependencies`.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- Le champ `name` correspond au nom du chart souhaité.
- Le champ `version` correspond à la version du chart souhaitée.
- Le champ `repository` correspond à l'URL complète du dépôt de charts. Notez que vous devez également utiliser `helm repo add` pour ajouter ce dépôt localement.
- Vous pouvez utiliser le nom du dépôt à la place de l'URL.

```console
$ helm repo add fantastic-charts https://charts.helm.sh/incubator
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

Une fois que vous avez défini les dépendances, vous pouvez exécuter `helm dependency update` et cela utilisera votre fichier de dépendances pour télécharger tous les charts spécifiés dans votre répertoire `charts/`.

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

Lorsque `helm dependency update` récupère des charts, il les stocke sous forme d'archives de charts dans le répertoire `charts/`. Ainsi, pour l'exemple ci-dessus, on s'attendrait à voir les fichiers suivants dans le répertoire `charts/` :

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### Champ Alias dans les dépendances

En plus des autres champs mentionnés ci-dessus, chaque entrée de dépendance peut contenir le champ optionnel `alias`.

Ajouter un alias pour un chart de dépendance permettrait de placer un chart dans les dépendances en utilisant l'alias comme nom de la nouvelle dépendance.

On peut utiliser `alias` dans les cas où il est nécessaire d'accéder à un chart sous un ou plusieurs autres noms.

```yaml
# chartparent/Chart.yaml

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

La méthode manuelle pour y parvenir consiste à copier/coller le même chart plusieurs fois dans le répertoire `charts/` avec des noms différents.

#### Champs Tags et Condition dans les dépendances

En plus des autres champs mentionnés ci-dessus, chaque entrée de dépendance peut contenir les champs optionnels `tags` et `condition`.

Tous les charts sont chargés par défaut. Si les champs `tags` ou `condition` sont présents, ils seront évalués et utilisés pour contrôler le chargement des charts auxquels ils sont appliqués.

Condition - Le champ `condition` contient un ou plusieurs chemins YAML (séparés par des virgules). Si ce chemin existe dans les valeurs du chart parent et se résout en une valeur booléenne, le chart sera activé ou désactivé en fonction de cette valeur booléenne. Seul le premier chemin valide trouvé dans la liste est évalué, et si aucun chemin n'existe, le condition n'a aucun effet.

Tags - Le champ `tags` est une liste YAML d'étiquettes à associer à ce chart. Dans les valeurs du chart parent, tous les charts avec des tags peuvent être activés ou désactivés en spécifiant le tag et une valeur booléenne.

```yaml
# chartparent/Chart.yaml

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
# chartparent/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

Dans l'exemple ci-dessus, tous les charts avec le tag `front-end` seraient désactivés, mais comme le chemin `subchart1.enabled` évalue à `true` dans les valeurs du parent, la condition annulera le tag `front-end` et `subchart1` sera activé.

Étant donné que `subchart2` est étiqueté avec `back-end` et que ce tag évalue à `true`, `subchart2` sera activé. Notez également que bien que `subchart2` ait une condition spécifiée, il n'y a pas de chemin et de valeur correspondants dans les valeurs du parent, donc cette condition n'a aucun effet.

##### Utilisation de la CLI avec les Tags et Conditions
 
Le paramètre `--set` peut être utilisé comme d'habitude pour modifier les valeurs des tags et des conditions.

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### Résolution des Tags et des Conditions

- **Les conditions (lorsqu'elles sont définies dans les valeurs) remplacent toujours les tags.** Le premier chemin de condition existant est pris en compte, et les suivants pour ce chart sont ignorés.
- Les tags sont évalués comme suit : "si l'un des tags du chart est vrai, alors activez le chart".
- Les valeurs des tags et des conditions doivent être définies dans les valeurs du chart parent.
- La clé `tags:` dans les valeurs doit être une clé de niveau supérieur. Les tables `tags:` globales et imbriquées ne sont pas actuellement prises en charge.

#### Importation des Valeurs Enfants via les Dépendances

Dans certains cas, il est souhaitable de permettre aux valeurs d'un chart enfant de se propager au chart parent et d'être partagées comme valeurs par défaut communes. Un avantage supplémentaire de l'utilisation du format `exports` est qu'il permettra aux outils futurs d'examiner les valeurs modifiables par l'utilisateur.

Les clés contenant les valeurs à importer peuvent être spécifiées dans les dépendances du chart parent dans le champ `import-values` en utilisant une liste YAML. Chaque élément de la liste est une clé qui est importée depuis le champ `exports` du chart enfant.

Pour importer des valeurs non contenues dans la clé `exports`, utilisez le format [child-parent](#using-the-child-parent-format). Des exemples des deux formats sont décrits ci-dessous.

##### Utilisation du format `exports`

Si le fichier `values.yaml` d'un chart enfant contient un champ `exports` à la racine, son contenu peut être importé directement dans les valeurs du parent en spécifiant les clés à importer comme dans l'exemple ci-dessous :

```yaml
# fichier `Chart.yaml` du parent

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# fichier `values.yaml` de l'enfant

exports:
  data:
    myint: 99
```

Puisque nous spécifions la clé `data` dans notre liste d'importation, Helm cherche dans le champ `exports` du chart enfant la clé `data` et importe son contenu.

Les valeurs finales du parent contiendraient notre champ exporté :

```yaml
# valeurs du parent

myint: 99
```

Veuillez noter que la clé `data` du parent n'est pas contenue dans les valeurs finales du parent. Si vous devez spécifier la clé du parent, utilisez le format `child-parent`.

##### Utilisation du format enfant-parent

Pour accéder aux valeurs qui ne sont pas contenues dans la clé `exports` des valeurs du chart enfant, vous devrez spécifier la clé source des valeurs à importer (`child`) et le chemin de destination dans les valeurs du chart parent (`parent`).

Le champ `import-values` dans l'exemple ci-dessous indique à Helm de prendre toutes les valeurs trouvées au chemin `child:` et de les copier dans les valeurs du parent au chemin spécifié dans `parent:`.

```yaml
# fichier Chart.yaml du parent

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

Dans l'exemple ci-dessus, les valeurs trouvées à `default.data` dans les valeurs du `subchart1` seront importées sous la clé `myimports` dans les valeurs du chart parent comme détaillé ci-dessous :

```yaml
# fichier values.yaml du parent

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# fichier values.yaml du souschart1

default:
  data:
    myint: 999
    mybool: true
```

Les valeurs résultantes du chart parent seraient :

```yaml
# valeurs finales du parent

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

Les valeurs finales du parent contiennent désormais les champs `myint` et `mybool` importés du `souschart1`.

### Gestion des dépendances manuellement via le répertoire charts/

Si un contrôle plus précis sur les dépendances est souhaité, ces dépendances peuvent être exprimées explicitement en copiant les charts de dépendance dans le répertoire `charts/`.

Une dépendance doit être un répertoire de chart décompressé, mais son nom ne peut pas commencer par `_` ou `.`. De tels fichiers sont ignorés par le chargeur de charts.

Par exemple, si le chart WordPress dépend du chart Apache, le chart Apache (de la version correcte) est fourni dans le répertoire `charts/` du chart WordPress :

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

L'exemple ci-dessus montre comment le chart WordPress exprime sa dépendance vis-à-vis d'Apache et de MySQL en incluant ces charts dans son répertoire `charts/`.

**CONSEIL :** _Pour ajouter une dépendance dans votre répertoire `charts/`, utilisez la commande `helm pull`._

### Aspects opérationnels de l'utilisation des dépendances

Les sections ci-dessus expliquent comment spécifier les dépendances des charts, mais comment cela affecte-t-il l'installation des charts avec `helm install` et `helm upgrade` ?

Supposons qu'un chart nommé "A" crée les objets Kubernetes suivants :

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

De plus, A dépend du chart B qui crée les objets suivants :

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

Après l'installation ou la mise à jour du chart A, une seule release Helm est créée ou modifiée. Cette release créera ou mettra à jour tous les objets Kubernetes ci-dessus dans l'ordre suivant :

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

Cela est dû au fait que lorsque Helm installe ou met à jour des charts, les objets Kubernetes provenant des charts et de toutes ses dépendances sont :

- agrégés en un seul ensemble ;
- triés par type puis par nom ;
- et enfin créés/mis à jour dans cet ordre.

Ainsi, une seule release est créée avec tous les objets pour le chart et ses dépendances.

L'ordre d'installation des types Kubernetes est défini par l'énumération `InstallOrder` dans le fichier `kind_sorter.go` (voir [le fichier source de Helm](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)).

## Modèles et Valeurs

Les modèles de Helm Chart sont écrits dans le [langage de modèles Go](https://golang.org/pkg/text/template/), avec l'ajout d'environ 50 fonctions de modèle supplémentaires [provenant de la bibliothèque Sprig](https://github.com/Masterminds/sprig) et quelques autres [fonctions spécialisées]({{< ref "/docs/howto/charts_tips_and_tricks.md" >}}).

Tous les fichiers de modèles sont stockés dans le dossier `templates/` d'un chart. Lorsque Helm rend les charts, il passe chaque fichier de ce répertoire par le moteur de modèles.

Les valeurs pour les modèles sont fournies de deux manières :

- Les développeurs de charts peuvent fournir un fichier appelé `values.yaml` à l'intérieur d'un chart. Ce fichier peut contenir des valeurs par défaut.
- Les utilisateurs de charts peuvent fournir un fichier YAML contenant des valeurs. Cela peut être fourni en ligne de commande avec `helm install`.

Lorsque l'utilisateur fournit des valeurs personnalisées, celles-ci remplaceront les valeurs du fichier `values.yaml` du chart.

### Fichiers de modèles 

Les fichiers de modèles suivent les conventions standard pour l'écriture de modèles Go (voir [la documentation du package text/template Go](https://golang.org/pkg/text/template/) pour plus de détails). Un exemple de fichier de modèle pourrait ressembler à ceci :

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

L'exemple ci-dessus, basé librement sur [https://github.com/deis/charts](https://github.com/deis/charts), est un modèle pour un contrôleur de réplication Kubernetes. Il peut utiliser les quatre valeurs de modèle suivantes (généralement définies dans un fichier `values.yaml`) :

- `imageRegistry` : Le registre source pour l'image Docker.
- `dockerTag` : Le tag pour l'image Docker.
- `pullPolicy` : La politique de récupération de Kubernetes.
- `storage` : Le backend de stockage, dont la valeur par défaut est `"minio"`

Toutes ces valeurs sont définies par l'auteur du modèle. Helm ne nécessite ni ne dicte de paramètres.

Pour voir de nombreux charts fonctionnels, consultez le [CNCF Artifact Hub](https://artifacthub.io/packages/search?kind=0).

### Valeurs prédéfinies

Les valeurs fournies via un fichier `values.yaml` (ou via l'option `--set`) sont accessibles depuis l'objet `.Values` dans un modèle. Mais il y a d'autres données prédéfinies auxquelles vous pouvez accéder dans vos modèles.

Les valeurs suivantes sont prédéfinies, disponibles dans chaque modèle et ne peuvent pas être remplacées. Comme pour toutes les valeurs, les noms sont _sensibles à la casse_.

- `Release.Name` : Le nom de la release (et non du chart).
- `Release.Namespace` : Le namespace dans lequel le chart a été déployé.
- `Release.Service` : Le service qui a réalisé la release.
- `Release.IsUpgrade` : Cela est défini sur `true` si l'opération actuelle est une mise à niveau ou un retour en arrière.
- `Release.IsInstall` : Cela est défini sur `true` si l'opération actuelle est une installation.
- `Chart` : Le contenu du fichier `Chart.yaml`. Ainsi, la version du chart est obtenable avec `Chart.Version` et les mainteneurs sont dans `Chart.Maintainers`.
- `Files` : Un objet de type map contenant tous les fichiers non spéciaux dans le chart. Cela ne vous donnera pas accès aux modèles, mais vous permettra d'accéder à des fichiers supplémentaires présents (sauf s'ils sont exclus via `.helmignore`). Les fichiers peuvent être accédés en utilisant `{{ index .Files "file.name" }}` ou la fonction `{{.Files.Get name }}`. Vous pouvez également accéder au contenu du fichier en tant que `[]byte` en utilisant `{{ .Files.GetBytes }}`
- `Capabilities` : Un objet de type map contenant des informations sur les versions de Kubernetes (`{{ .Capabilities.KubeVersion }}`) et les versions API Kubernetes prises en charge (`{{ .Capabilities.APIVersions.Has "batch/v1" }}`)

**REMARQUE :** Tout champ inconnu dans `Chart.yaml` sera ignoré. Ils ne seront pas accessibles à l'intérieur de l'objet `Chart`. Ainsi, `Chart.yaml` ne peut pas être utilisé pour passer des données structurées arbitraires dans le modèle. En revanche, le fichier de valeurs peut être utilisé à cette fin.

### Fichiers de valeurs

En considérant le modèle de la section précédente, un fichier `values.yaml` qui fournit les valeurs nécessaires pourrait ressembler à ceci :

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

Un fichier de valeurs est formaté en YAML. Un chart peut inclure un fichier `values.yaml` par défaut. La commande d'installation de Helm permet à un utilisateur de remplacer les valeurs en fournissant des valeurs YAML supplémentaires :

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

Lorsque les valeurs sont passées de cette manière, elles seront fusionnées avec le fichier de valeurs par défaut. Par exemple, considérez un fichier `myvals.yaml` qui ressemble à ceci :

```yaml
storage: "gcs"
```

Lorsque cela est fusionné avec le fichier `values.yaml` dans le chart, le contenu généré résultant sera :

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Notez que seul le dernier champ a été remplacé.

**REMARQUE :** Le fichier de valeurs par défaut inclus à l'intérieur d'un chart _doit_ être nommé `values.yaml`. Mais les fichiers spécifiés en ligne de commande peuvent avoir n'importe quel nom.

**REMARQUE :** Si l'option `--set` est utilisée avec `helm install` ou `helm upgrade`, ces valeurs sont simplement converties en YAML côté client.

**REMARQUE :** Si des entrées requises dans le fichier de valeurs existent, elles peuvent être déclarées comme requises dans le modèle de chart en utilisant la fonction ['required']({{}})

Chacune de ces valeurs est ensuite accessible à l'intérieur des modèles en utilisant l'objet `.Values` :

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

### Portée, Dépendances et Valeurs

Les fichiers de valeurs peuvent déclarer des valeurs pour le chart de niveau supérieur, ainsi que pour tous les charts inclus dans le répertoire `charts/` de ce chart. Autrement dit, un fichier de valeurs peut fournir des valeurs au chart ainsi qu'à ses dépendances. Par exemple, le chart WordPress de démonstration ci-dessus a à la fois `mysql` et `apache` comme dépendances. Le fichier de valeurs pourrait fournir des valeurs à tous ces composants :

```yaml
title: "Mon Site Wordpress" # Envoyé au modèle WordPress

mysql:
  max_connections: 100 # Envoyé à MySQL
  password: "secret"

apache:
  port: 8080 # Passé à Apache
```

Les charts de niveau supérieur ont accès à toutes les variables définies en dessous. Ainsi, le chart WordPress peut accéder au mot de passe MySQL via `.Values.mysql.password`. En revanche, les charts de niveau inférieur ne peuvent pas accéder aux éléments des charts parents, donc MySQL ne pourra pas accéder à la propriété `title`. De même, il ne pourra pas accéder à `apache.port`.

Les valeurs sont nommées par espace de noms, mais les espaces de noms sont réduits. Ainsi, pour le chart WordPress, il peut accéder au champ du mot de passe MySQL en tant que `.Values.mysql.password`. Mais pour le chart MySQL, la portée des valeurs a été réduite et le préfixe de l'espace de noms supprimé, donc il verra le champ du mot de passe simplement comme `.Values.password`.

#### Valeurs globales

Depuis la version 2.0.0-Alpha.2, Helm prend en charge une valeur spéciale appelée "global". Considérons cette version modifiée de l'exemple précédent :

```yaml
title: "Mon Site Wordpress" # Envoyé au modèle WordPress

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Envoyé à MySQL
  password: "secret"

apache:
  port: 8080 # Passé à Apache
```

L'exemple ci-dessus ajoute une section `global` avec la valeur `app: MyWordPress`. Cette valeur est disponible pour _tous_ les charts sous la forme `.Values.global.app`.

Par exemple, les modèles `mysql` peuvent accéder à `app` en utilisant `{{ .Values.global.app }}`, tout comme le chart `apache`. Effectivement, le fichier de valeurs ci-dessus est régénéré comme ceci :

```yaml
title: "Mon Site Wordpress" # Envoyé au modèle WordPress

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Envoyé à MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Passé à Apache
```

Cela permet de partager une variable de niveau supérieur avec tous les sous-charts, ce qui est utile pour des éléments tels que la définition de propriétés `metadata` comme les labels.

Si un sous-chart déclare une variable globale, cette variable sera transmise _vers le bas_ (aux sous-charts du sous-chart), mais pas _vers le haut_ au chart parent. Il n'existe aucun moyen pour un sous-chart d'influencer les valeurs du chart parent.

De plus, les variables globales des charts parents prennent le pas sur les variables globales des sous-charts.

### Fichiers de Schéma

Parfois, un mainteneur de chart peut vouloir définir une structure pour ses valeurs. Cela peut être fait en définissant un schéma dans le fichier `values.schema.json`. Un schéma est représenté sous la forme d'un [Schéma JSON](https://json-schema.org/). Il pourrait ressembler à ceci :

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

Ce schéma sera appliqué aux valeurs pour les valider. La validation se produit lorsque l'une des commandes suivantes est invoquée :

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

Un exemple de fichier `values.yaml` qui respecte les exigences de ce schéma pourrait ressembler à ceci :

```yaml
name: frontend
protocol: https
port: 443
```

Notez que le schéma est appliqué à l'objet final `.Values`, et non seulement au fichier `values.yaml`. Cela signifie que le fichier `yaml` suivant est valide, à condition que le chart soit installé avec l'option `--set` appropriée, comme indiqué ci-dessous.

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

De plus, l'objet final `.Values` est vérifié par rapport à *tous* les schémas des sous-charts. Cela signifie que les restrictions d'un sous-chart ne peuvent pas être contournées par un chart parent. Cela fonctionne également dans l'autre sens : si un sous-chart a une exigence qui n'est pas respectée dans son fichier `values.yaml`, le chart parent *doit* satisfaire à ces restrictions pour être valide.

### Références

En ce qui concerne l'écriture de modèles, de valeurs et de fichiers de schéma, il existe plusieurs références standard qui peuvent vous aider.

- [Templates Go](https://godoc.org/text/template)
- [Fonctions supplémentaires pour les modèles](https://godoc.org/github.com/Masterminds/sprig)
- [Le format YAML](https://yaml.org/spec/)
- [Schéma JSON](https://json-schema.org/)

## Définitions de Ressources Personnalisées (CRDs)

Kubernetes fournit un mécanisme pour déclarer de nouveaux types d'objets Kubernetes. En utilisant les CustomResourceDefinitions (CRD), les développeurs Kubernetes peuvent déclarer des types de ressources personnalisées.

Dans Helm 3, les CRD (Custom Resource Definitions) sont considérés comme un type spécial d'objet. Ils sont installés avant le reste du chart et sont soumis à certaines limitations.

Les fichiers YAML des CRD doivent être placés dans le répertoire `crds/` à l'intérieur d'un chart. Plusieurs CRD (séparées par des marqueurs de début et de fin YAML) peuvent être placées dans le même fichier. Helm tentera de charger _tous_ les fichiers du répertoire CRD dans Kubernetes.

Les fichiers de CRD _ne peuvent pas être modélisés_. Ils doivent être de simple documents YAML. 

Lorsque Helm installe un nouveau chart, il télécharge les CRD, fait une pause jusqu'à ce que les CRD soient disponibles via le serveur API, puis démarre le moteur de modèles, rend le reste du chart et le télécharge dans Kubernetes. En raison de cet ordre, les informations sur les CRD sont disponibles dans l'objet `.Capabilities` des modèles Helm, et les modèles Helm peuvent créer de nouvelles instances d'objets déclarés dans les CRD.

Par exemple, si votre chart avait une CRD pour `CronTab` dans le répertoire `crds/`, vous pouvez créer des instances du type `CronTab` dans le répertoire `templates/` :

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

Le fichier `crontab.yaml` doit contenir la CRD sans directives de modèle :

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

Ensuite, le modèle `mycrontab.yaml` peut créer un nouveau `CronTab` (en utilisant des modèles comme d'habitude) :

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

Helm s'assurera que le type `CronTab` a été installé et est disponible depuis le serveur API Kubernetes avant de procéder à l'installation des éléments dans `templates/`.

### Limitations sur les CRDs

Contrairement à la plupart des objets dans Kubernetes, les CRD sont installées globalement. Pour cette raison, Helm adopte une approche très prudente dans la gestion des CRD. Les CRD sont soumises aux limitations suivantes :

- Les CRD ne sont jamais réinstallées. Si Helm détermine que les CRD dans le répertoire `crds/` sont déjà présentes (indépendamment de la version), Helm ne tentera pas de les installer ou de les mettre à niveau.
- Les CRD ne sont jamais installées lors d'une mise à niveau ou d'un retour en arrière. Helm ne créera des CRD que lors des opérations d'installation.
- Les CRD ne sont jamais supprimées. La suppression d'une CRD supprime automatiquement tout le contenu de la CRD dans tous les namespaces du cluster. Par conséquent, Helm ne supprimera pas les CRD.

Les opérateurs qui souhaitent mettre à niveau ou supprimer des CRD sont encouragés à le faire manuellement et avec une grande prudence.

## Utiliser Helm pour gérer les Charts

L'outil `helm` dispose de plusieurs commandes pour travailler avec les charts.

Il peut créer un nouveau chart pour vous :

```console
$ helm create mychart
Created mychart/
```

Une fois que vous avez modifié un chart, `helm` peut l'emballer dans une archive de chart pour vous :

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

Vous pouvez également utiliser `helm` pour vous aider à trouver des problèmes avec le formatage ou les informations de votre chart :

```console
$ helm lint mychart
No issues found
```

## Dépôts de Charts

Un _dépôt de charts_ est un serveur HTTP qui héberge un ou plusieurs charts emballés. Bien que `helm` puisse être utilisé pour gérer des répertoires de charts locaux, le mécanisme préféré pour partager des charts est un dépôt de charts.

Tout serveur HTTP capable de servir des fichiers YAML et des fichiers tar, et de répondre aux requêtes GET, peut être utilisé comme serveur de dépôt. L'équipe Helm a testé certains serveurs, y compris Google Cloud Storage avec le mode site Web activé, et S3 avec le mode site Web activé.

Un dépôt est principalement caractérisé par la présence d'un fichier spécial appelé `index.yaml`, qui contient une liste de tous les packages fournis par le dépôt, ainsi que des métadonnées permettant de récupérer et de vérifier ces packages.

Côté client, les dépôts sont gérés avec les commandes `helm repo`. Cependant, Helm ne fournit pas d'outils pour télécharger des charts sur des serveurs de dépôt distants. En effet, cela imposerait des exigences substantielles au serveur de dépôt, augmentant ainsi la difficulté de mise en place d'un dépôt.

## Packs de démarrage de Charts

La commande `helm create` prend une option `--starter` facultative qui vous permet de spécifier un "chart de démarrage". De plus, l'option de démarrage a un alias court `-p`.

Exemple d'utilisation :

```console
helm create my-chart --starter starter-name
helm create my-chart -p starter-name
helm create my-chart -p /absolute/path/to/starter-name
```

Les starters sont simplement des charts réguliers, mais situés dans `$XDG_DATA_HOME/helm/starters`. En tant que développeur de charts, vous pouvez créer des charts spécifiquement conçus pour être utilisés comme starters. Ces charts doivent être conçus en tenant compte des considérations suivantes :

- Le fichier `Chart.yaml` sera écrasé par le générateur.
- Les utilisateurs s'attendront à modifier le contenu d'un tel chart, donc la documentation doit indiquer comment les utilisateurs peuvent le faire.
- Toutes les occurrences de `<CHARTNAME>` seront remplacées par le nom du chart spécifié afin que les charts de démarrage puissent être utilisés comme modèles, à l'exception de certains fichiers de variables. Par exemple, si vous utilisez des fichiers personnalisés dans le répertoire `vars` ou certains fichiers `README.md`, `<CHARTNAME>` ne sera PAS remplacé à l'intérieur de ceux-ci. De plus, la description du chart n'est pas héritée.

Actuellement, la seule façon d'ajouter un chart à `$XDG_DATA_HOME/helm/starters` est de le copier manuellement à cet emplacement. Dans la documentation de votre chart, vous pourriez vouloir expliquer ce processus.
