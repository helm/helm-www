---
title: Templates Nommés
description: Comment définir des templates nommés.
sidebar_position: 9
---

Il est temps d'aller au-delà d'un seul template et de commencer à en créer d'autres. Dans cette section, nous verrons comment définir des _templates nommés_ dans un fichier, puis les utiliser ailleurs. Un _template nommé_ (parfois appelé _partial_ ou _sous-template_) est simplement un template défini à l'intérieur d'un fichier et auquel on donne un nom. Nous verrons deux façons de les créer et plusieurs façons de les utiliser.

Dans la section [Structures de contrôle](/chart_template_guide/control_structures.md), nous avons introduit trois actions pour déclarer et gérer les templates : `define`, `template` et `block`. Dans cette section, nous aborderons ces trois actions et présenterons également une fonction spéciale `include` qui fonctionne de manière similaire à l'action `template`.

Un détail important à garder à l'esprit lors de la création de templates : **les noms de templates sont globaux**. Si vous déclarez deux templates avec le même nom, celui qui est chargé en dernier sera utilisé. Comme les templates des sous-charts sont compilés avec les templates de niveau supérieur, vous devez veiller à nommer vos templates avec des _noms spécifiques au chart_.

Une convention de nommage répandue consiste à préfixer chaque template défini avec le nom du chart : `{{ define "mychart.labels" }}`. En utilisant le nom spécifique du chart comme préfixe, nous pouvons éviter tout conflit qui pourrait survenir si deux charts différents implémentent des templates du même nom.

Ce comportement s'applique également aux différentes versions d'un chart. Si vous avez `mychart` version `1.0.0` qui définit un template d'une certaine manière, et `mychart` version `2.0.0` qui modifie ce template nommé existant, c'est celui qui a été chargé en dernier qui sera utilisé. Vous pouvez contourner ce problème en ajoutant également une version dans le nom du chart : `{{ define "mychart.v1.labels" }}` et `{{ define "mychart.v2.labels" }}`.

## Partials et fichiers `_`

Jusqu'à présent, nous avons utilisé un seul fichier, et ce fichier contenait un seul template. Mais le langage de template de Helm permet de créer des templates nommés intégrés, qui peuvent être accédés par leur nom ailleurs.

Avant d'entrer dans les détails de l'écriture de ces templates, il y a une convention de nommage de fichiers qui mérite d'être mentionnée :

* La plupart des fichiers dans `templates/` sont traités comme s'ils contenaient des manifestes Kubernetes
* Le fichier `NOTES.txt` est une exception
* Mais les fichiers dont le nom commence par un underscore (`_`) sont supposés _ne pas_ contenir de manifeste. Ces fichiers ne sont pas rendus en définitions d'objets Kubernetes, mais sont disponibles partout dans les autres templates du chart pour être utilisés.

Ces fichiers sont utilisés pour stocker des partials et des helpers. En fait, lorsque nous avons créé `mychart` pour la première fois, nous avons vu un fichier appelé `_helpers.tpl`. Ce fichier est l'emplacement par défaut pour les partials de template.

## Déclarer et utiliser des templates avec `define` et `template`

L'action `define` nous permet de créer un template nommé à l'intérieur d'un fichier template. Sa syntaxe est la suivante :

```yaml
{{- define "MY.NAME" }}
  # corps du template ici
{{- end }}
```

Par exemple, nous pouvons définir un template pour encapsuler un bloc de labels Kubernetes :

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Nous pouvons maintenant intégrer ce template dans notre ConfigMap existant, puis l'inclure avec l'action `template` :

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

Lorsque le moteur de template lit ce fichier, il stocke la référence à `mychart.labels` jusqu'à ce que `template "mychart.labels"` soit appelé. Il rend alors ce template en ligne. Le résultat ressemblera à ceci :

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

Remarque : un `define` ne produit pas de sortie à moins d'être appelé avec un template, comme dans cet exemple.

Par convention, les charts Helm placent ces templates dans un fichier de partials, généralement `_helpers.tpl`. Déplaçons cette fonction là-bas :

```yaml
{{/* Génère les labels de base */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Par convention, les fonctions `define` devraient avoir un simple bloc de documentation (`{{/* ... */}}`) décrivant ce qu'elles font.

Même si cette définition est dans `_helpers.tpl`, elle peut toujours être accédée dans `configmap.yaml` :

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

Comme mentionné ci-dessus, **les noms de templates sont globaux**. Par conséquent, si deux templates sont déclarés avec le même nom, la dernière occurrence sera celle utilisée. Comme les templates des sous-charts sont compilés avec les templates de niveau supérieur, il est préférable de nommer vos templates avec des _noms spécifiques au chart_. Une convention de nommage répandue consiste à préfixer chaque template défini avec le nom du chart : `{{ define "mychart.labels" }}`.

## Définir la portée d'un template

Dans le template que nous avons défini ci-dessus, nous n'avons utilisé aucun objet. Nous avons juste utilisé des fonctions. Modifions notre template défini pour inclure le nom du chart et la version du chart :

```yaml
{{/* Génère les labels de base */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

Si nous rendons ceci, nous obtiendrons une erreur comme celle-ci :

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

Pour voir ce qui a été rendu, relancez avec `--disable-openapi-validation` :
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`.
Le résultat ne sera pas celui attendu :

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

Que s'est-il passé avec le nom et la version ? Ils n'étaient pas dans la portée de notre template défini. Lorsqu'un template nommé (créé avec `define`) est rendu, il reçoit la portée passée par l'appel à `template`. Dans notre exemple, nous avons inclus le template comme ceci :

```yaml
{{- template "mychart.labels" }}
```

Aucune portée n'a été passée, donc à l'intérieur du template nous ne pouvons accéder à rien dans `.`. La solution est simple : il suffit de passer une portée au template :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

Notez que nous passons `.` à la fin de l'appel `template`. Nous pourrions tout aussi bien passer `.Values` ou `.Values.favorite` ou n'importe quelle portée souhaitée. Mais ce que nous voulons, c'est la portée de niveau supérieur. Dans le contexte du template nommé, `$` fera référence à la portée que vous avez passée et non à une portée globale.

Maintenant, lorsque nous exécutons ce template avec `helm install --dry-run --debug plinking-anaco ./mychart`, nous obtenons ceci :

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

Maintenant `{{ .Chart.Name }}` se résout en `mychart`, et `{{ .Chart.Version }}` se résout en `0.1.0`.

## La fonction `include`

Supposons que nous ayons défini un template simple qui ressemble à ceci :

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

Maintenant, supposons que je veuille insérer ceci à la fois dans la section `labels:` de mon template et aussi dans la section `data:` :

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

Si nous rendons ceci, nous obtiendrons une erreur comme celle-ci :

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

Pour voir ce qui a été rendu, relancez avec `--disable-openapi-validation` :
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`.
La sortie ne sera pas celle attendue :

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

Notez que l'indentation de `app_version` est incorrecte aux deux endroits. Pourquoi ? Parce que le template substitué a le texte aligné à gauche. Comme `template` est une action et non une fonction, il n'y a aucun moyen de passer la sortie d'un appel `template` à d'autres fonctions ; les données sont simplement insérées en ligne.

Pour contourner ce cas, Helm fournit une alternative à `template` qui importera le contenu d'un template dans le pipeline actuel où il peut être passé à d'autres fonctions dans le pipeline.

Voici l'exemple ci-dessus, corrigé pour utiliser `indent` afin d'indenter correctement le template `mychart.app` :

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

Maintenant le YAML produit est correctement indenté pour chaque section :

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

> Il est préférable d'utiliser `include` plutôt que `template` dans les templates Helm, simplement pour que le formatage de la sortie puisse être mieux géré pour les documents YAML.

Parfois, nous voulons importer du contenu, mais pas en tant que templates. C'est-à-dire que nous voulons importer des fichiers tels quels. Nous pouvons y parvenir en accédant aux fichiers via l'objet `.Files` décrit dans la section suivante.
