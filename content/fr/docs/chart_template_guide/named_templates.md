---
title: "Templates Nommés"
description: "Comment définir des templates nommés"
weight: 9
---

Il est temps de passer au-delà d'un seul template et de commencer à en créer d'autres. Dans cette section, nous verrons comment définir des _templates nommés_ dans un fichier, puis les utiliser ailleurs. Un _template nommé_ (parfois appelé _partiel_ ou _sous-template_) est simplement un template défini à l'intérieur d'un fichier et auquel on donne un nom. Nous verrons deux façons de les créer et quelques façons différentes de les utiliser.

Dans la section [Contrôle de flux]({{< ref "/docs/chart_template_guide/control_structures.md">}}) , nous avons présenté trois actions pour déclarer et gérer des templates : `define`, `template` et `block`. Dans cette section, nous aborderons ces trois actions, et nous introduirons également une fonction à usage spécial `include` qui fonctionne de manière similaire à l'action `template`.

Un détail important à garder à l'esprit lors de la nomination des templates : **les noms des templates sont globaux**. Si vous déclarez deux templates avec le même nom, celui qui est chargé en dernier sera celui utilisé. Étant donné que les templates dans les sous-charts sont compilés avec les templates de niveau supérieur, vous devez faire attention à nommer vos templates avec des _noms spécifiques au chart_.

Une convention de nommage populaire consiste à préfixer chaque template défini par le nom du chart : `{{ define "mychart.labels" }}`. En utilisant le nom spécifique du chart comme préfixe, nous pouvons éviter tout conflit qui pourrait survenir en raison de deux charts différents qui implémentent des templates du même nom.

Ce comportement s'applique également aux différentes versions d'un chart. Si vous avez le chart `mychart` version `1.0.0` qui définit un template d'une certaine manière, et un `mychart` version `2.0.0` qui modifie le template nommé existant, il utilisera celui qui a été chargé en dernier. Vous pouvez contourner ce problème en ajoutant également une version dans le nom du chart : `{{ define "mychart.v1.labels" }}` et `{{ define "mychart.v2.labels" }}`.

## Partiels et fichiers `_`

Jusqu'à présent, nous avons utilisé un fichier, et ce fichier contenait un seul modèle. Mais le langage de modèles de Helm permet de créer des modèles imbriqués nommés, qui peuvent être accessibles par leur nom ailleurs.

Avant d'entrer dans les détails de l'écriture de ces modèles, il y a une convention de nommage des fichiers qui mérite d'être mentionnée :

* La plupart des fichiers dans `templates/` sont considérés comme contenant des manifests Kubernetes.
* Le fichier `NOTES.txt` est une exception.
* Cependant, les fichiers dont le nom commence par un underscore (`_`) sont supposés _ne pas_ contenir de manifestes à l'intérieur. Ces fichiers ne sont pas rendus en définitions d'objets Kubernetes, mais sont disponibles partout dans les autres modèles de chartes pour utilisation.

Ces fichiers sont utilisés pour stocker des partiels et des helpers. En fait, lorsque nous avons d'abord créé `mychart`, nous avons vu un fichier appelé `_helpers.tpl`. Ce fichier est l'emplacement par défaut pour les partiels de modèles.

## Déclaration et utilisation de modèles avec `define` et `template`

L'action `define` nous permet de créer un modèle nommé à l'intérieur d'un fichier de modèle. Sa syntaxe est la suivante :

```yaml
{{- define "MY.NAME" }}
  # corps du modèle ici
{{- end }}
```

Par exemple, nous pouvons définir un modèle pour encapsuler un bloc de labels Kubernetes :

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Maintenant, nous pouvons intégrer ce modèle à notre ConfigMap existant, puis l'inclure avec l'action `template` :

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Lorsque le moteur de modèles lit ce fichier, il conservera la référence à `mychart.labels` jusqu'à ce que `template "mychart.labels"` soit appelé. Ensuite, il rendra ce modèle en ligne. Le résultat ressemblera donc à ceci :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Remarque : un `define` ne produit pas de sortie à moins qu'il ne soit appelé avec un modèle, comme dans cet exemple.

Conventionnellement, les charts Helm placent ces modèles à l'intérieur d'un fichier de partials, généralement `_helpers.tpl`. Déplaçons cette fonction là-bas :

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Par convention, les fonctions `define` doivent avoir un bloc de documentation simple (`{{/* ... */}}`) décrivant ce qu'elles font.

Bien que cette définition soit dans `_helpers.tpl`, elle peut toujours être accessible dans `configmap.yaml`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Comme mentionné ci-dessus, **les noms de modèles sont globaux**. Par conséquent, si deux modèles sont déclarés avec le même nom, la dernière occurrence sera celle qui sera utilisée. Étant donné que les modèles dans les sous-charts sont compilés avec les modèles de niveau supérieur, il est préférable de nommer vos modèles avec des _noms spécifiques au chart_. Une convention de nommage populaire consiste à préfixer chaque modèle défini avec le nom du chart : `{{ define "mychart.labels" }}`.

## Définir la portée d'un modèle

Dans le modèle que nous avons défini ci-dessus, nous n'avons utilisé aucun objet. Nous avons simplement utilisé des fonctions. Modifions notre modèle défini pour inclure le nom du chart et la version du chart :

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

Si nous rendons cela, nous obtiendrons une erreur comme celle-ci :

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

Pour voir ce qui a été rendu, réexécutez avec `--disable-openapi-validation` : `helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`. Le résultat ne sera pas ce que nous attendons :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart:
    version:
```

Que s'est-il passé avec le nom et la version ? Ils n'étaient pas dans le scope de notre template défini. Lorsqu'un template nommé (créé avec `define`) est rendu, il recevra le scope passé par l'appel `template`. Dans notre exemple, nous avons inclus le template de cette manière :

```yaml
{{- template "mychart.labels" }}
```

Aucun scope n'a été passé, donc à l'intérieur du template, nous ne pouvons accéder à rien dans `.`. Cela se résout facilement : il suffit de passer un scope au template :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

Notez que nous passons `.` à la fin de l'appel `template`. Nous pourrions tout aussi bien passer `.Values`, `.Values.favorite` ou tout autre scope souhaité. Mais ce que nous voulons ici, c'est le scope de niveau supérieur. Dans le contexte du modèle nommé, `$` fera référence au scope que vous avez passé et non à un scope global.

Maintenant, lorsque nous exécutons ce modèle avec `helm install --dry-run --debug plinking-anaco ./mychart`, nous obtenons ceci :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plinking-anaco-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart: mychart
    version: 0.1.0
```

Maintenant, `{{ .Chart.Name }}` résout à `mychart`, et `{{ .Chart.Version }}` résout à `0.1.0`.

## La fonction `include`

Disons que nous avons défini un modèle simple qui ressemble à ceci :

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

Maintenant, disons que je veux insérer cela à la fois dans la section `labels:` de mon modèle, et aussi dans la section `data:` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

Si nous rendons cela, nous obtiendrons une erreur comme celle-ci :

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

Pour voir ce qui a été rendu, réexécutez avec `--disable-openapi-validation` :  
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`. La sortie ne sera pas ce que nous attendons :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: measly-whippet-configmap
  labels:
    app_name: mychart
app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
app_name: mychart
app_version: "0.1.0"
```

Notez que l'indentation de `app_version` est incorrecte dans les deux endroits. Pourquoi ? Parce que le modèle qui est substitué a le texte aligné à gauche. Comme `template` est une action et non une fonction, il n'y a pas moyen de passer la sortie d'un appel `template` à d'autres fonctions ; les données sont simplement insérées en ligne.

Pour contourner ce cas, Helm propose une alternative à `template` qui importera le contenu d'un modèle dans le pipeline actuel, où il pourra être transmis à d'autres fonctions dans le pipeline.

Voici l'exemple ci-dessus, corrigé pour utiliser `indent` afin d'indiquer correctement le modèle `mychart.app` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

Maintenant, le YAML produit est correctement indenté pour chaque section :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-mole-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
  app_name: mychart
  app_version: "0.1.0"
```

> Il est considéré comme préférable d'utiliser `include` plutôt que `template` dans les modèles Helm afin que le formatage de la sortie puisse être géré plus efficacement pour les documents YAML.

Parfois, nous souhaitons importer du contenu, mais pas en tant que modèles. C'est-à-dire que nous voulons importer des fichiers tels quels. Nous pouvons y parvenir en accédant aux fichiers via l'objet `.Files` décrit dans la section suivante.
