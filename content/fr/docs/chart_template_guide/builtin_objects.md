---
title: "Objets intégrés"
description: "Objets intégrés disponibles pour les templates"
weight: 3
---

Les objets sont transmis à un template par le moteur de templates. Votre code peut également passer des objets d'un endroit à un autre (nous verrons des exemples en étudiant les déclarations `with` et `range`). Il existe même quelques méthodes pour créer de nouveaux objets au sein de vos templates, comme avec la fonction `tuple` que nous aborderons plus tard.

Les objets peuvent être simples et n’avoir qu’une seule valeur. Ou bien, ils peuvent contenir d’autres objets ou fonctions. Par exemple, l’objet `Release` contient plusieurs sous-objets (comme `Release.Name`), et l’objet `Files` possède plusieurs fonctions.

Dans la section précédente, nous avons utilisé `{{ .Release.Name }}` pour insérer le nom d'une release dans un template. `Release` est l'un des objets de haut niveau que vous pouvez accéder dans vos templates.

- `Release` : Cet objet décrit la release elle-même et contient plusieurs objets à l'intérieur :
  - `Release.Name` : Le nom de la release.
  - `Release.Namespace` : Le namespace dans lequel la release sera déployée (sauf si le manifest en décide autrement).
  - `Release.IsUpgrade` : Défini à `true` si l'opération actuelle est une mise à jour ou un rollback.
  - `Release.IsInstall` : Défini à `true` si l'opération actuelle est une installation.
  - `Release.Revision` : Le numéro de révision pour cette release. Lors d'une installation, ce numéro est à 1 et il s'incrémente à chaque mise à jour ou rollback.
  - `Release.Service` : Le service qui rend le template en cours. Avec Helm, c'est toujours `Helm`.
- `Values` : Valeurs passées dans le template depuis le fichier `values.yaml` et les fichiers fournis par l'utilisateur. Par défaut, `Values` est vide.
- `Chart` : Contenu du fichier `Chart.yaml`. Toutes les données de ce fichier sont accessibles ici. Par exemple, `{{ .Chart.Name }}-{{ .Chart.Version }}` affichera `mychart-0.1.0`.
  - Les champs disponibles sont listés dans le [Guide des Charts]({{< ref
    "/docs/topics/charts.md#le-fichier-chartyaml" >}}).
- `Subcharts` : Donne accès à la portée (.Values, .Charts, .Releases, etc.) des sous-charts du parent. Par exemple, `.Subcharts.mySubChart.myValue` permet d'accéder à `myValue` dans le chart `mySubChart`.
- `Files` : Permet d'accéder à tous les fichiers non-spéciaux d'un chart, mais pas aux templates. Consultez la section [Accéder aux fichiers]({{< ref "/docs/chart_template_guide/accessing_files" >}}) pour en savoir plus.
  - `Files.Get` permet d'obtenir un fichier par son nom (`.Files.Get config.ini`).
  - `Files.GetBytes` retourne le contenu du fichier sous forme de tableau d'octets au lieu d'une chaîne. Utile pour des fichiers comme des images.
  - `Files.Glob` retourne une liste de fichiers dont les noms correspondent au pattern glob donné.
  - `Files.Lines` lit un fichier ligne par ligne, pratique pour parcourir chaque ligne d'un fichier.
  - `Files.AsSecrets` retourne les corps de fichiers sous forme de chaînes encodées en Base64.
  - `Files.AsConfig` retourne les corps de fichiers sous forme de map YAML.
- `Capabilities` : Donne des informations sur les capacités du cluster Kubernetes.
  - `Capabilities.APIVersions` est un ensemble de versions.
  - `Capabilities.APIVersions.Has $version` indique si une version (ex. `batch/v1`) ou une ressource (ex. `apps/v1/Deployment`) est disponible dans le cluster.
  - `Capabilities.KubeVersion` et `Capabilities.KubeVersion.Version` affichent la version de Kubernetes.
  - `Capabilities.KubeVersion.Major` affiche la version majeure de Kubernetes.
  - `Capabilities.KubeVersion.Minor` affiche la version mineure de Kubernetes.
  - `Capabilities.HelmVersion` contient les détails de la version de Helm, correspondant à la sortie de `helm version`.
  - `Capabilities.HelmVersion.Version` affiche la version actuelle de Helm au format semver.
  - `Capabilities.HelmVersion.GitCommit` affiche le SHA1 du commit git de Helm.
  - `Capabilities.HelmVersion.GitTreeState` indique l'état de l'arbre git de Helm.
  - `Capabilities.HelmVersion.GoVersion` affiche la version du compilateur Go utilisée.
- `Template` : Contient des informations sur le template en cours d'exécution.
  - `Template.Name` : Le chemin vers le template actuel (ex. `mychart/templates/mytemplate.yaml`).
  - `Template.BasePath` : Le chemin vers le répertoire des templates du chart en cours (ex. `mychart/templates`).

Les valeurs intégrées commencent toujours par une majuscule, conformément à la convention de nommage de Go. Lorsque vous créez vos propres noms, vous êtes libre d'utiliser une convention qui convient à votre équipe. Certaines équipes, comme celles dont vous verrez les charts sur [Artifact Hub](https://artifacthub.io/packages/search?kind=0), choisissent d'utiliser uniquement des lettres minuscules au début pour distinguer les noms locaux de ceux intégrés. Dans ce guide, nous suivons cette convention.
