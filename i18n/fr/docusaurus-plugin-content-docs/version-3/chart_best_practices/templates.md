---
title: Templates
description: Un examen approfondi des bonnes pratiques concernant les templates.
sidebar_position: 3
---

Cette partie du guide des bonnes pratiques se concentre sur les templates.

## Structure de `templates/`

Le répertoire `templates/` doit être structuré comme suit :

- Les fichiers template doivent avoir l'extension `.yaml` s'ils produisent une sortie YAML.
  L'extension `.tpl` peut être utilisée pour les fichiers template qui ne produisent pas
  de contenu formaté.
- Les noms de fichiers template doivent utiliser la notation avec tirets (`my-example-configmap.yaml`),
  et non le camelCase.
- Chaque définition de ressource doit être dans son propre fichier template.
- Les noms de fichiers template doivent refléter le type de ressource dans le nom. Par exemple :
  `foo-pod.yaml`, `bar-svc.yaml`

## Noms des templates définis

Les templates définis (templates créés à l'intérieur d'une directive `{{ define }}`) sont
globalement accessibles. Cela signifie qu'un chart et tous ses sous-charts auront
accès à tous les templates créés avec `{{ define }}`.

Pour cette raison, _tous les noms de templates définis doivent être préfixés par un espace de noms._

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

Il est fortement recommandé de créer de nouveaux charts via la commande `helm create`
car les noms de templates sont automatiquement définis selon cette bonne pratique.

## Formatage des templates

Les templates doivent être indentés avec _deux espaces_ (jamais des tabulations).

Les directives de template doivent avoir un espace après les accolades ouvrantes et avant
les accolades fermantes :

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

Les templates doivent supprimer les espaces blancs lorsque c'est possible :

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

Les blocs (tels que les structures de contrôle) peuvent être indentés pour indiquer le flux
du code template.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

Cependant, comme YAML est un langage orienté espaces blancs, il n'est souvent pas possible
pour l'indentation du code de suivre cette convention.

## Espaces blancs dans les templates générés

Il est préférable de limiter la quantité d'espaces blancs dans les templates générés
au minimum. En particulier, de nombreuses lignes vides ne doivent pas apparaître les unes
à côté des autres. Cependant, des lignes vides occasionnelles (en particulier entre les sections logiques)
sont acceptables.

Ceci est idéal :

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

Ceci est acceptable :

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

Mais ceci doit être évité :

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## Commentaires (Commentaires YAML vs. Commentaires de template)

YAML et les templates Helm disposent tous deux de marqueurs de commentaires.

Commentaires YAML :
```yaml
# Ceci est un commentaire
type: sprocket
```

Commentaires de template :
```yaml
{{- /*
Ceci est un commentaire.
*/}}
type: frobnitz
```

Les commentaires de template doivent être utilisés pour documenter les fonctionnalités d'un template,
comme expliquer un template défini :

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

À l'intérieur des templates, les commentaires YAML peuvent être utilisés lorsqu'il est utile
que les utilisateurs Helm puissent (éventuellement) voir les commentaires lors du débogage.

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

Le commentaire ci-dessus est visible lorsque l'utilisateur exécute `helm install --debug`, tandis que
les commentaires spécifiés dans les sections `{{- /* */}}` ne le sont pas.

Faites attention lors de l'ajout de commentaires YAML `#` sur des sections de template contenant des valeurs Helm qui peuvent être requises par certaines fonctions de template.

Par exemple, si la fonction `required` est introduite dans l'exemple ci-dessus, et que `maxMem` n'est pas défini, alors un commentaire YAML `#` provoquera une erreur de rendu.

Correct : `helm template` ne rend pas ce bloc
```yaml
{{- /*
# This may cause problems if the value is more than 100Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}
```

Incorrect : `helm template` retourne `Error: execution error at (templates/test.yaml:2:13): maxMem must be set`
```yaml
# This may cause problems if the value is more than 100Gi
# memory: {{ required .Values.maxMem "maxMem must be set" | quote }}
```

Consultez [Débogage des templates](../chart_template_guide/debugging.md) pour un autre exemple de ce comportement où les commentaires YAML sont conservés tels quels.

## Utilisation de JSON dans les templates et la sortie des templates

YAML est un sur-ensemble de JSON. Dans certains cas, utiliser une syntaxe JSON peut être
plus lisible que d'autres représentations YAML.

Par exemple, ce YAML est plus proche de la méthode YAML normale pour exprimer des listes :

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

Mais il est plus facile à lire lorsqu'il est condensé dans un style de liste JSON :

```yaml
arguments: ["--dirname", "/foo"]
```

Utiliser JSON pour améliorer la lisibilité est une bonne pratique. Cependant, la syntaxe JSON ne doit pas
être utilisée pour représenter des constructions plus complexes.

Lorsque vous travaillez avec du JSON pur intégré dans du YAML (comme la configuration
de conteneur init), il est bien sûr approprié d'utiliser le format JSON.
