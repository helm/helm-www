---
title: "Templates"
description: "Point plus précis sur les bonnes pratiques concernant les templates"
weight: 3
---

Cette partie du Guide des Bonnes Pratiques se concentre sur les Templates.

## Structure de `templates/`

Le répertoire `templates/` devrait être structuré comme suit :

- Les fichiers de template devraient avoir l'extension `.yaml` s'ils produisent une sortie en YAML. L'extension `.tpl` peut être utilisée pour les fichiers de template qui ne produisent aucun contenu formaté.
- Les noms de fichiers de template devraient utiliser la notation avec des tirets (`my-example-configmap.yaml`), et non le camelcase.
- Chaque définition de ressource devrait être dans son propre fichier de template.
- Les noms de fichiers de template devraient refléter le type de ressource dans le nom. Par exemple, `foo-pod.yaml`, `bar-svc.yaml`.

## Noms des templates définis

Les templates définis (templates créés à l'intérieur d'une directive `{{ define }}`) sont accessibles globalement. Cela signifie qu'un chart et tous ses sous-charts auront accès à tous les templates créés avec `{{ define }}`.

Pour cette raison, _tous les noms de templates définis devraient être nommés de manière à inclure un espace de nom.

Correct :

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

Incorrect :

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```
Il est fortement recommandé de créer de nouveaux charts via la commande `helm create`, car les noms de templates y sont automatiquement définis conformément à cette bonne pratique.

## Formatage de Templates

Les templates doivent être indentés en utilisant _deux espaces_ (jamais de tabulations).

Les directives de template doivent avoir un espace après les accolades d'ouverture et avant les accolades de fermeture :

Correct :
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

Incorrect :
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

Les templates devraient supprimer les espaces blancs lorsque cela est possible :

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

Les blocs (tels que les structures de contrôle) peuvent être indentés pour indiquer le flux du code du template.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

Cependant, étant donné que YAML est un langage orienté sur les espaces blancs, il n'est souvent pas possible pour l'indentation du code de suivre cette convention.

## Les espaces dans les templates générés

Il est préférable de minimiser la quantité d'espaces blancs dans les templates générés. En particulier, de nombreuses lignes vides ne devraient pas apparaître les unes à côté des autres. Cependant, quelques lignes vides occasionnelles (notamment entre les sections logiques) sont acceptables.

Le mieux :

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

Cela est OK :

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

Mais cela devrait être a éviter :

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## Commentaires (Commentaires YAML vs. Commentaires de Template)

Tant YAML que les Templates Helm disposent de marqueurs de commentaire.

Commentaires en YAML
```yaml
# Ceci est un commentaire
type: sprocket
```

Commentaires des les Template :
```yaml
{{- /*
c'est un commentaire
*/}}
type: frobnitz
```

Les commentaires dans les templates devraient être utilisés pour documenter les fonctionnalités d'un template, comme l'explication d'un template défini :

```yaml
{{- /*
mychart.shortname fournit une version tronquée à 6 caractères du nom de la release.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

À l'intérieur des templates, les commentaires YAML peuvent être utilisés lorsqu'il est utile que les utilisateurs de Helm puissent (éventuellement) voir les commentaires lors du débogage.

```yaml
# Cela peut poser des problèmes si la valeur est supérieure à 100 Gi
memory: {{ .Values.maxMem | quote }}
```

Le commentaire ci-dessus est visible lorsque l'utilisateur exécute `helm install --debug`, tandis que les commentaires spécifiés dans les sections `{{- /* */}}` ne le sont pas.

Attention à ne pas ajouter de commentaires YAML `#` dans les sections de template contenant des valeurs Helm qui peuvent être requises par certaines fonctions de template.

Par exemple, si la fonction `required` est introduite dans l'exemple ci-dessus et que `maxMem` n'est pas définie, un commentaire YAML `#` introduira une erreur de rendu.

Correct : `helm template` ne rend pas ce bloc.
```yaml
{{- /*
# Cela peut poser des problèmes si la valeur est supérieure à 100 Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}
```

Incorrect : `helm template` retourne `Error: execution error at (templates/test.yaml:2:13): maxMem must be set`
```yaml
# Cela peut poser des problèmes si la valeur est supérieure à 100 Gi
# memory: {{ required .Values.maxMem "maxMem must be set" | quote }}
```

Consultez [Débogage des Templates](../chart_template_guide/debugging.md) pour un autre exemple de ce comportement, montrant comment les commentaires YAML restent intacts.

## Utilisation du JSON dans les Templates et la sortie des Templates

YAML est un sur-ensemble de JSON. Dans certains cas, l'utilisation de la syntaxe JSON peut être plus lisible que d'autres représentations YAML.

Par exemple, ce YAML est plus proche de la méthode normale YAML d'expression des listes :

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

Mais il est plus facile à lire lorsqu'il est compressé en style liste JSON :

```yaml
arguments: ["--dirname", "/foo"]
```

Utiliser JSON pour améliorer la lisibilité est une bonne pratique. Cependant, la syntaxe JSON ne devrait pas être utilisée pour représenter des constructions plus complexes.

Lorsqu'il s'agit de JSON pur intégré dans du YAML (comme la configuration des conteneurs d'initialisation), il est bien sûr approprié d'utiliser le format JSON.
