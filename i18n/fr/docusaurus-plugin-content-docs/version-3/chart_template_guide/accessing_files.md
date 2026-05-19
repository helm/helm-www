---
title: Accéder aux fichiers dans les templates
description: Comment accéder aux fichiers depuis un template.
sidebar_position: 10
---

Dans la section précédente, nous avons examiné plusieurs façons de créer et d'accéder à des templates nommés. Cela facilite l'importation d'un template depuis un autre template. Mais parfois, il est souhaitable d'importer un _fichier qui n'est pas un template_ et d'injecter son contenu sans le faire passer par le moteur de rendu de templates.

Helm permet d'accéder aux fichiers via l'objet `.Files`. Avant de passer aux exemples de templates, voici quelques points importants à noter sur son fonctionnement :

- Vous pouvez ajouter des fichiers supplémentaires à votre chart Helm. Ces fichiers seront inclus dans le package.
  Attention toutefois : les charts doivent faire moins de 1 Mo en raison des limitations de stockage des objets Kubernetes.
- Certains fichiers ne sont pas accessibles via l'objet `.Files`, généralement pour des raisons de sécurité.
  - Les fichiers dans `templates/` ne sont pas accessibles.
  - Les fichiers exclus via `.helmignore` ne sont pas accessibles.
  - Les fichiers situés en dehors d'un [sous-chart](/chart_template_guide/subcharts_and_globals.md) de l'application Helm, y compris ceux du chart parent, ne sont pas accessibles.
- Les charts ne préservent pas les informations de mode UNIX, donc les permissions au niveau des fichiers n'auront aucun impact sur la disponibilité d'un fichier via l'objet `.Files`.

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [Exemple de base](#exemple-de-base)
- [Fonctions d'aide pour les chemins](#fonctions-daide-pour-les-chemins)
- [Motifs glob](#motifs-glob)
- [Fonctions utilitaires pour ConfigMap et Secrets](#fonctions-utilitaires-pour-configmap-et-secrets)
- [Encodage](#encodage)
- [Lignes](#lignes)

<!-- tocstop -->

## Exemple de base

Ces points clarifiés, écrivons un template qui lit trois fichiers dans notre ConfigMap. Pour commencer, nous allons ajouter trois fichiers au chart, en les plaçant tous directement dans le répertoire `mychart/`.

`config1.toml` :

```toml
message = "Hello from config 1"
```

`config2.toml` :

```toml
message = "This is config 2"
```

`config3.toml` :

```toml
message = "Goodbye from config 3"
```

Chacun de ces fichiers est un simple fichier TOML (pensez aux anciens fichiers INI de Windows). Nous connaissons les noms de ces fichiers, nous pouvons donc utiliser une fonction `range` pour les parcourir et injecter leur contenu dans notre ConfigMap.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

Ce ConfigMap utilise plusieurs des techniques abordées dans les sections précédentes. Par exemple, nous créons une variable `$files` pour conserver une référence à l'objet `.Files`. Nous utilisons également la fonction `tuple` pour créer une liste de fichiers que nous parcourons. Ensuite, nous affichons le nom de chaque fichier (`{{ . }}: |-`) suivi du contenu du fichier `{{ $files.Get . }}`.

L'exécution de ce template produira un seul ConfigMap contenant le contenu des trois fichiers :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## Fonctions d'aide pour les chemins

Lorsque vous travaillez avec des fichiers, il peut être très utile d'effectuer des opérations standard sur les chemins de fichiers eux-mêmes. Pour vous aider, Helm importe de nombreuses fonctions du package [path](https://golang.org/pkg/path/) de Go. Elles sont toutes accessibles avec les mêmes noms que dans le package Go, mais avec une première lettre en minuscule. Par exemple, `Base` devient `base`, etc.

Les fonctions importées sont :
- Base
- Dir
- Ext
- IsAbs
- Clean

## Motifs glob

À mesure que votre chart grandit, vous pourriez avoir besoin d'organiser davantage vos fichiers. Nous fournissons donc une méthode `Files.Glob(pattern string)` pour vous aider à extraire certains fichiers avec toute la flexibilité des [motifs glob](https://godoc.org/github.com/gobwas/glob).

`.Glob` retourne un type `Files`, vous pouvez donc appeler n'importe quelle méthode de `Files` sur l'objet retourné.

Par exemple, imaginez la structure de répertoires suivante :

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

Vous avez plusieurs options avec les Globs :

```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

Ou

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## Fonctions utilitaires pour ConfigMap et Secrets

(Disponible depuis Helm 2.0.2)

Il est très courant de vouloir placer le contenu de fichiers dans des ConfigMaps et des Secrets, pour les monter dans vos pods au moment de l'exécution. Pour vous aider, nous fournissons quelques méthodes utilitaires sur le type `Files`.

Pour une meilleure organisation, il est particulièrement utile d'utiliser ces méthodes en conjonction avec la méthode `Glob`.

Avec la structure de répertoires de l'exemple [Glob](#motifs-glob) ci-dessus :

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

## Encodage

Vous pouvez importer un fichier et demander au template de l'encoder en base64 pour garantir une transmission réussie :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

Le code ci-dessus prendra le même fichier `config1.toml` utilisé précédemment et l'encodera :

```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```

## Lignes

Parfois, il est souhaitable d'accéder à chaque ligne d'un fichier dans votre template. Nous fournissons une méthode `Lines` pratique pour cela.

Vous pouvez parcourir `Lines` en utilisant une fonction `range` :

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

Il n'est pas possible de passer des fichiers externes au chart lors de `helm install`. Donc, si vous demandez aux utilisateurs de fournir des données, celles-ci doivent être chargées en utilisant `helm install -f` ou `helm install --set`.

Cette discussion conclut notre exploration des outils et techniques pour écrire des templates Helm. Dans la prochaine section, nous verrons comment utiliser un fichier spécial, `templates/NOTES.txt`, pour envoyer des instructions post-installation aux utilisateurs de votre chart.
