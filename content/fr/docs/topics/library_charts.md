---
title: "Charts de bibliothèque"
description: "Explique les charts de bibliothèque et donne des exemples d'utilisation"
weight: 4
---

Un chart de bibliothèque est un type de [Chart Helm]({{< ref "/docs/topics/charts.md" >}}) qui définit des primitives ou des définitions de chart pouvant être partagées par des templates Helm dans d'autres charts. Cela permet aux utilisateurs de partager des morceaux de code réutilisables dans différents charts, évitant ainsi la répétition et respectant le principe [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Le chart de bibliothèque a été introduit dans Helm 3 pour reconnaître formellement les charts communs ou d'assistance qui étaient utilisés par les mainteneurs de charts depuis Helm 2. En l'incluant comme un type de chart, il permet de :

- Distinguer explicitement les charts communs des charts d'application
- Empêcher l'installation d'un chart commun
- Ne pas rendre les templates d'un chart commun qui pourraient contenir des artefacts de release
- Permettre aux charts dépendants d'utiliser le contexte de l'importateur

Un mainteneur de chart peut définir un chart commun comme un chart de bibliothèque et avoir désormais la certitude que Helm le gérera de manière standard et cohérente. Cela signifie également que les définitions d'un chart d'application peuvent être partagées en modifiant simplement le type de chart.

## Créer un Chart de Bibliothèque Simple

Comme mentionné précédemment, un chart de bibliothèque est un type de [Chart Helm]({{< ref "/docs/topics/charts.md" >}}). Cela signifie que vous pouvez commencer par créer un chart de base :
```console
$ helm create mylibchart
Creating mylibchart
```

Vous devrez d'abord supprimer tous les fichiers dans le répertoire `templates`, car nous allons créer nos propres définitions de templates dans cet exemple.

```console
$ rm -rf mylibchart/templates/*
```

Le fichier `values.yaml` ne sera pas non plus nécessaire.

```console
$ rm -f mylibchart/values.yaml
```

Avant de commencer à créer du code commun, faisons un rapide tour d'horizon de certains concepts pertinents de Helm. Un [template nommé]({{< ref "/docs/chart_template_guide/named_templates.md" >}}) (parfois appelé partiel ou sous-template) est simplement un template défini dans un fichier et auquel on donne un nom. Dans le répertoire `templates/`, tout fichier commençant par un underscore (_) n'est pas censé produire un fichier manifeste Kubernetes. Par convention, les templates d'assistance et les partiels sont donc placés dans des fichiers `_*.tpl` ou `_*.yaml`.

Dans cet exemple, nous allons coder un ConfigMap commun qui crée une ressource ConfigMap vide. Nous définirons le ConfigMap commun dans le fichier `mylibchart/templates/_configmap.yaml` comme suit :

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

Le construct ConfigMap est défini dans le template nommé `mylibchart.configmap.tpl`. C'est un ConfigMap simple avec une ressource vide, `data`. Dans ce fichier, il y a un autre template nommé appelé `mylibchart.configmap`. Ce template nommé inclut un autre template nommé, `mylibchart.util.merge`, qui prendra deux templates nommés en arguments : le template appelant `mylibchart.configmap` et `mylibchart.configmap.tpl`.

La fonction d'assistance `mylibchart.util.merge` est un template nommé dans `mylibchart/templates/_util.yaml`. C'est un utilitaire pratique de [Le Chart d'Assistance Helm Commun](#le-chart-dassistance-helm-commun) car il fusionne les deux templates et remplace les parties communes dans les deux :

```yaml
{{- /*
mylibchart.util.merge fusionnera deux templates YAML et produira le résultat. Il prend un tableau de trois valeurs :
- le contexte principal
- le nom du template des remplacements (destination)
- le nom du template de base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

C'est important lorsqu'un chart souhaite utiliser du code commun qu'il doit personnaliser avec sa propre configuration.

Enfin, changeons le type de chart en `library`. Cela nécessite de modifier `mylibchart/Chart.yaml` comme suit :

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# Un chart peut être soit un chart 'application', soit un chart 'library'.
#
# Les charts d'application sont une collection de templates qui peuvent être empaquetés en archives versionnées
# pour être déployés.
#
# Les charts de bibliothèque fournissent des utilitaires ou des fonctions utiles pour le développeur de charts. Ils sont inclus comme
# une dépendance des charts d'application pour injecter ces utilitaires et fonctions dans le pipeline de rendu. Les charts de bibliothèque ne définissent
# aucun template et ne peuvent donc pas être déployés.
# type: application
type: library

# C'est la version du chart. Ce numéro de version doit être incrémenté chaque fois que vous apportez des modifications 
# au chart et à ses templates, y compris la version de l'application.
version: 0.1.0

# C'est le numéro de version de l'application déployée. Ce numéro de version doit être
# incrémenté chaque fois que vous apportez des modifications à l'application et il est recommandé de l'utiliser entre guillemets.
appVersion: "1.16.0"
```

Le chart de bibliothèque est maintenant prêt à être partagé et sa définition de ConfigMap peut être réutilisée.

Avant de continuer, il est utile de vérifier si Helm reconnaît le chart comme un chart de bibliothèque :

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Utiliser le Chart de Bibliothèque Simple

Il est temps d'utiliser le chart de bibliothèque. Cela signifie qu'il faut à nouveau créer un chart de base :

```console
$ helm create mychart
Creating mychart
```

Nettoyons à nouveau les fichiers de templates, car nous souhaitons créer uniquement un ConfigMap :

```console
$ rm -rf mychart/templates/*
```

Lorsque nous voulons créer un ConfigMap simple dans un template Helm, il pourrait ressembler à ce qui suit :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

Nous allons cependant réutiliser le code commun déjà créé dans `mylibchart`. Le ConfigMap peut être créé dans le fichier `mychart/templates/configmap.yaml` comme suit :

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Vous pouvez voir que cela simplifie le travail à réaliser en héritant de la définition commune du ConfigMap, qui ajoute des propriétés standard pour le ConfigMap. Dans notre template, nous ajoutons la configuration, dans ce cas, la clé de données `myvalue` et sa valeur. La configuration remplace la ressource vide du ConfigMap commun. Cela est possible grâce à la fonction d'assistance `mylibchart.util.merge` que nous avons mentionnée dans la section précédente.

Pour pouvoir utiliser le code commun, nous devons ajouter `mylibchart` comme dépendance. Ajoutez ce qui suit à la fin du fichier `mychart/Chart.yaml` :

```yaml
# Mon code commun dans mon chart de bibliothèque
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Cela inclut le chart de bibliothèque comme une dépendance dynamique depuis le système de fichiers, qui se trouve au même niveau que notre chart d'application. Comme nous incluons le chart de bibliothèque comme une dépendance dynamique, nous devons exécuter `helm dependency update`. Cette commande copiera le chart de bibliothèque dans votre répertoire `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Nous sommes maintenant prêts à déployer notre chart. Avant d'installer, il est utile de vérifier d'abord le template rendu.

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

Cela ressemble au ConfigMap que nous souhaitons, avec l'écrasement des données pour `myvalue: Hello World`. Installons-le :

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Nous pouvons récupérer la version et vérifier que le template réel a été chargé.

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## Avantages des Charts de Bibliothèque
En raison de leur incapacité à agir en tant que charts autonomes, les charts de bibliothèque peuvent tirer parti des fonctionnalités suivantes :

- L'objet `.Files` fait référence aux chemins de fichiers du chart parent, plutôt qu'au chemin local au chart de bibliothèque.
- L'objet `.Values` est identique à celui du chart parent, contrairement aux [sous-charts]({{< ref "/docs/chart_template_guide/subcharts_and_globals.md" >}}) d'application qui reçoivent la section des valeurs configurées sous leur en-tête dans le parent.


## Le Chart d'Assistance Helm Commun

```markdown
Note : Le dépôt Common Helm Helper Chart sur GitHub n'est plus activement maintenu. Le dépôt a été déprécié et archivé.
```

Ce [chart](https://github.com/helm/charts/tree/master/incubator/common) était le modèle original pour les charts communs. Il fournit des utilitaires qui reflètent les meilleures pratiques du développement de charts Kubernetes. Le mieux, c'est qu'il peut être utilisé immédiatement par vous lors du développement de vos charts pour vous fournir du code partagé pratique.

Voici une méthode rapide pour l'utiliser. Pour plus de détails, consultez le [README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Créez à nouveau un chart de base :

```console
$ helm create demo
Creating demo
```

Utilisons le code commun du chart d'assistance. Tout d'abord, modifiez le fichier `demo/templates/deployment.yaml` comme suit :

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Définissez les surcharges pour votre ressource Deployment ici, par exemple
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}
```

Et maintenant, le fichier de service, `demo/templates/service.yaml`, comme suit :

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Définissez les surcharges pour votre ressource Deployment ici, par exemple
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

Ces templates montrent comment l'héritage du code commun du chart d'assistance simplifie votre codage en le réduisant à la configuration ou à la personnalisation des ressources.

Pour pouvoir utiliser le code commun, nous devons ajouter `common` comme dépendance. Ajoutez ce qui suit à la fin du fichier `demo/Chart.yaml` :

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Note : Vous devrez ajouter le dépôt `incubator` à la liste des dépôts Helm (`helm repo add`).

Comme nous incluons le chart comme une dépendance dynamique, nous devons exécuter `helm dependency update`. Cela copiera le chart d'assistance dans votre répertoire `charts/`.

Étant donné que le chart d'assistance utilise certains éléments de Helm 2, vous devrez ajouter ce qui suit à `demo/values.yaml` pour permettre le chargement de l'image `nginx`, car cela a été mis à jour dans le chart de base Helm 3 :

```yaml
image:
  tag: 1.16.0
```

Vous pouvez vérifier que les templates du chart sont corrects avant de déployer en utilisant les commandes `helm lint` et `helm template`.

Si tout est en ordre, déployez avec `helm install` !

