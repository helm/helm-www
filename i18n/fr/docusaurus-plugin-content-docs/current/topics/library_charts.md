---
title: Charts de type library
description: Explique les charts de type library et donne des exemples d'utilisation
sidebar_position: 4
default_lang_commit: 5a854d17682d9512caad275c1e2db9069481aa8e
---

Un chart de type library est un type de [chart Helm](/topics/charts.mdx)
qui définit des primitives ou des définitions de chart que les templates Helm
d'autres charts peuvent partager. Les utilisateurs peuvent ainsi partager des
extraits de code réutilisables d'un chart à l'autre, sans répétition, en gardant
leurs charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Le chart de type library a été introduit dans Helm 3 pour reconnaître
officiellement les charts communs ou utilitaires utilisés par les mainteneurs
de charts depuis Helm 2. En l'intégrant comme type de chart à part entière, Helm apporte :
- Un moyen de distinguer explicitement les charts communs des charts d'application
- Une logique empêchant l'installation d'un chart commun
- L'absence de rendu des templates d'un chart commun, qui pourraient contenir des
  artefacts de release
- La possibilité pour les charts dépendants d'utiliser le contexte du chart qui les importe

Un mainteneur de chart peut définir un chart commun comme chart de type library
et avoir désormais la certitude que Helm traitera ce chart de façon standard et
cohérente. Cela veut aussi dire que les définitions d'un chart d'application
peuvent être partagées en changeant simplement le type du chart.

## Créer un chart de type library simple {#create-a-simple-library-chart}

Comme mentionné précédemment, un chart de type library est un type de
[chart Helm](/topics/charts.mdx). Cela signifie que vous pouvez
commencer par créer un squelette de chart :

```console
$ helm create mylibchart
Creating mylibchart
```

Commencez par supprimer tous les fichiers du répertoire `templates`, car nous
allons créer nos propres définitions de templates dans cet exemple.

```console
$ rm -rf mylibchart/templates/*
```

Le fichier de valeurs ne sera pas non plus nécessaire.

```console
$ rm -f mylibchart/values.yaml
```

Avant de créer le code commun, faisons un rapide rappel de quelques
concepts Helm utiles ici. Un [template nommé](/chart_template_guide/named_templates.md)
(parfois appelé partial ou sous-template) est simplement un template défini dans
un fichier et auquel on donne un nom. Dans le répertoire `templates/`, tout fichier
commençant par un tiret bas (_) n'est pas censé générer un fichier manifeste
Kubernetes. Par convention, les templates utilitaires et les partials sont donc
placés dans des fichiers `_*.tpl` ou `_*.yaml`.

Dans cet exemple, nous allons écrire un ConfigMap commun qui crée une ressource
ConfigMap vide. Nous définirons ce ConfigMap commun dans le fichier
`mylibchart/templates/_configmap.yaml` comme suit :

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

La structure du ConfigMap est définie dans le template nommé `mylibchart.configmap.tpl`.
C'est un simple ConfigMap avec une ressource vide, `data`. Dans ce fichier, il y a
un autre template nommé appelé `mylibchart.configmap`. Ce template nommé inclut un
autre template nommé `mylibchart.util.merge` qui prend deux templates nommés comme
arguments : le template appelant `mylibchart.configmap` et `mylibchart.configmap.tpl`.

La fonction utilitaire `mylibchart.util.merge` est un template nommé dans
`mylibchart/templates/_util.yaml`. C'est un utilitaire pratique tiré du
[Common Helm Helper Chart](#the-common-helm-helper-chart) : il fusionne
les deux templates et remplace les parties communes aux deux :

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

C'est important lorsqu'un chart veut utiliser du code commun qu'il doit
personnaliser avec sa propre configuration.

Enfin, changeons le type de chart en `library`. Cela nécessite de modifier le
fichier `mylibchart/Chart.yaml` comme suit :

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application and it is recommended to use it with quotes.
appVersion: "1.16.0"
```

Le chart de type library est maintenant prêt à être partagé et sa définition de
ConfigMap peut être réutilisée.

Avant de continuer, il est utile de vérifier si Helm reconnaît le chart comme un
chart de type library :

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Utiliser le chart de type library simple {#use-the-simple-library-chart}

Il est temps d'utiliser le chart de type library. Pour cela, créez de nouveau
un squelette de chart :

```console
$ helm create mychart
Creating mychart
```

Supprimons à nouveau les fichiers de templates, car nous voulons créer uniquement
un ConfigMap :

```console
$ rm -rf mychart/templates/*
```

Pour créer un simple ConfigMap dans un template Helm, on écrirait par
exemple :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

Cependant, nous allons réutiliser le code commun déjà créé dans `mylibchart`.
Le ConfigMap peut être créé dans le fichier `mychart/templates/configmap.yaml`
comme suit :

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Vous voyez que le travail est simplifié, puisque le template hérite de la
définition commune du ConfigMap, qui ajoute les propriétés standard. Dans notre template,
nous ajoutons la configuration, ici la clé `myvalue` et sa
valeur. La configuration remplace la ressource vide du ConfigMap commun. C'est
possible grâce à la fonction utilitaire `mylibchart.util.merge` mentionnée
dans la section précédente.

Pour pouvoir utiliser le code commun, nous devons ajouter `mylibchart` comme
dépendance. Ajoutez ce qui suit à la fin du fichier `mychart/Chart.yaml` :

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Le chart de type library est ainsi inclus comme dépendance dynamique depuis le
système de fichiers, situé dans le même répertoire parent que notre chart d'application. Comme nous
incluons le chart de type library en tant que dépendance dynamique, nous devons
exécuter `helm dependency update`. Cette commande copiera le chart de type
library dans votre répertoire `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Nous sommes maintenant prêts à déployer notre chart. Avant l'installation, il
est utile de vérifier le template rendu.

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

C'est bien le ConfigMap que nous voulions, avec
`myvalue: Hello World`, qui remplace le `data` vide du ConfigMap commun. Installons-le :

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Nous pouvons récupérer la release et constater que c'est bien notre template qui a été chargé.

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

## Avantages des charts de type library {#library-chart-benefits}

Parce qu'ils ne peuvent pas fonctionner comme des charts autonomes, les charts de
type library peuvent tirer parti des fonctionnalités suivantes :
- L'objet `.Files` référence les chemins de fichiers du chart parent, plutôt que
  le chemin local du chart de type library
- L'objet `.Values` est le même que celui du chart parent, contrairement aux
  [sous-charts](/chart_template_guide/subcharts_and_globals.md) d'application
  qui reçoivent uniquement la partie des valeurs placée sous leur nom dans le chart parent.

## Le Common Helm Helper Chart {#the-common-helm-helper-chart}

```markdown
Note: The Common Helm Helper Chart repo on Github is no longer actively maintained, and the repo has been deprecated and archived.
```

Ce [chart](https://github.com/helm/charts/tree/master/incubator/common) était le
modèle original pour les charts communs. Il fournit des utilitaires qui reflètent
les bonnes pratiques de développement de charts Kubernetes. Mieux encore, vous
pouvez l'utiliser d'emblée dans vos charts et profiter ainsi de code partagé
bien pratique.

Voici une façon rapide de l'utiliser. Pour plus de détails, consultez le
[README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Créez de nouveau un squelette de chart :

```console
$ helm create demo
Creating demo
```

Utilisons le code commun du chart utilitaire. Commencez par modifier le fichier
`demo/templates/deployment.yaml` comme suit :

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g.
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

Puis le fichier du service, `demo/templates/service.yaml`, comme suit :

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g.
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

Ces templates montrent qu'en héritant du code commun du chart utilitaire, vous
n'avez plus qu'à écrire la configuration ou la personnalisation des
ressources.

Pour pouvoir utiliser le code commun, nous devons ajouter `common` comme
dépendance. Ajoutez ce qui suit à la fin du fichier `demo/Chart.yaml` :

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Remarque : vous devrez ajouter le dépôt `incubator` à la liste des dépôts Helm
(`helm repo add`).

Comme nous incluons le chart en tant que dépendance dynamique, nous devons
exécuter `helm dependency update`. Cette commande copiera le chart utilitaire
dans votre répertoire `charts/`.

Comme le chart utilitaire utilise certaines constructions de Helm 2, vous devrez
ajouter ce qui suit à `demo/values.yaml` pour que l'image
`nginx` puisse être chargée, le squelette de chart de Helm 3 ayant changé sur ce point :

```yaml
image:
  tag: 1.16.0
```

Avant de déployer, vous pouvez vérifier que les templates du chart sont corrects
avec les commandes `helm lint` et `helm template`.

Si tout est en ordre, déployez avec `helm install` !
