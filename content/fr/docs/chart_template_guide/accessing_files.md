---
title: "Accès aux fichiers à l'intérieur des modèles"
description: "Comment accéder aux fichiers depuis un modèle"
weight: 10
---

Dans la section précédente, nous avons examiné plusieurs façons de créer et d'accéder à des modèles nommés. Cela facilite l'importation d'un modèle à partir d'un autre modèle. Mais il arrive parfois qu'il soit souhaitable d'importer un _fichier qui n'est pas un modèle_ et d'injecter son contenu sans passer par le moteur de rendu des modèles.

Helm permet d'accéder aux fichiers via l'objet `.Files`. Avant de commencer avec les exemples de modèles, il y a quelques points à noter concernant son fonctionnement :

- Il est acceptable d'ajouter des fichiers supplémentaires à votre chart Helm. Ces fichiers seront inclus. Faites cependant attention, car les charts doivent être inférieurs à 1 Mo en raison des limitations de stockage des objets Kubernetes.
- Certains fichiers ne peuvent pas être accédés via l'objet `.Files`, généralement pour des raisons de sécurité :
  - Les fichiers dans `templates/` ne peuvent pas être accédés.
  - Les fichiers exclus à l'aide de `.helmignore` ne peuvent pas être accédés.
  - Les fichiers en dehors d'une application Helm [sous-chart]({{< ref "/docs/chart_template_guide/subcharts_and_globals.md" >}}), y compris ceux du parent, ne peuvent pas être accédés.
- Les charts ne conservent pas les informations de mode UNIX, donc les permissions au niveau des fichiers n'affecteront pas la disponibilité d'un fichier via l'objet `.Files`.


<!-- toc -->

- [Exemple de base](#exemple-de-base)
- [Aides pour les chemins](#aides-pour-les-chemins)
- [Modèles Glob](#modèles-glob)
- [Fonctions utilitaires pour ConfigMap et Secrets](#fonctions-utilitaires-pour-configmap-et-secrets)
- [Encodage](#encodage)
- [Lignes](#lignes)

<!-- tocstop -->

## Exemple de base

Avec ces mises en garde en tête, rédigeons un modèle qui lit trois fichiers dans notre ConfigMap. Pour commencer, nous allons ajouter trois fichiers au chart, en plaçant les trois directement dans le répertoire `mychart/`.

`config1.toml`:

```toml
message = Hello from config 1
```

`config2.toml`:

```toml
message = This is config 2
```

`config3.toml`:

```toml
message = Goodbye from config 3
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

Ce ConfigMap utilise plusieurs des techniques abordées dans les sections précédentes. Par exemple, nous créons une variable `$files` pour contenir une référence à l'objet `.Files`. Nous utilisons également la fonction `tuple` pour créer une liste de fichiers que nous parcourons. Ensuite, nous affichons chaque nom de fichier (`{{ . }}: |-`) suivi du contenu du fichier `{{ $files.Get . }}`.

L'exécution de ce modèle produira un seul ConfigMap contenant le contenu des trois fichiers :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = Hello from config 1

  config2.toml: |-
    message = This is config 2

  config3.toml: |-
    message = Goodbye from config 3
```

## Aides pour les chemins

Lorsque vous travaillez avec des fichiers, il peut être très utile d'effectuer certaines opérations standard sur les chemins de fichiers eux-mêmes. Pour vous aider, Helm importe de nombreuses fonctions du package [path](https://golang.org/pkg/path/) de Go pour votre utilisation. Elles sont toutes accessibles avec les mêmes noms que dans le package Go, mais avec une première lettre en minuscule. Par exemple, `Base` devient `base`, etc.

Les fonctions importées sont :
- `base`
- `dir`
- `ext`
- `isAbs`
- `clean`

## Modèles glob

À mesure que votre chart grandit, vous pourriez avoir besoin d'organiser davantage vos fichiers. Nous fournissons donc une méthode `Files.Glob(pattern string)` pour aider à extraire certains fichiers avec toute la flexibilité des [modèles glob](https://godoc.org/github.com/gobwas/glob).

`.Glob` renvoie un type `Files`, vous pouvez donc appeler n'importe quelle méthode `Files` sur l'objet retourné.

Par exemple, imaginez la structure de répertoire suivante :

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

Vous avez plusieurs options avec les modèles glob :

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

(Disponible à partir de Helm 2.0.2)

Il est très courant de vouloir placer le contenu de fichiers à la fois dans des ConfigMaps et des Secrets, afin de les monter dans vos pods au moment de l'exécution. Pour vous aider, nous fournissons quelques méthodes utilitaires sur le type `Files`.

Pour une meilleure organisation, il est particulièrement utile d'utiliser ces méthodes en conjonction avec la méthode `Glob`.

Étant donné la structure de répertoire de l'exemple [Glob](#modèles-glob) ci-dessus :

```yaml
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

Vous pouvez importer un fichier et faire en sorte que le modèle l'encode en base64 pour garantir une transmission réussie :

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

Ce qui précède prendra le même fichier `config1.toml` que nous avons utilisé précédemment et l'encodera :

```yaml
# Source : mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9IEhlbGxvIGZyb20gY29uZmlnIDEK
```

## Lignes

Parfois, il est souhaitable d'accéder à chaque ligne d'un fichier dans votre modèle. Nous fournissons une méthode pratique `Lines` pour cela.

Vous pouvez parcourir `Lines` en utilisant une fonction `range` :

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

Il n'est pas possible de passer des fichiers externes au chart lors de l'exécution de `helm install`. Donc, si vous demandez aux utilisateurs de fournir des données, celles-ci doivent être chargées en utilisant `helm install -f` ou `helm install --set`.

Cette discussion conclut notre exploration des outils et techniques pour écrire des modèles Helm. Dans la section suivante, nous verrons comment vous pouvez utiliser un fichier spécial, `templates/NOTES.txt`, pour envoyer des instructions post-installation aux utilisateurs de votre chart.
