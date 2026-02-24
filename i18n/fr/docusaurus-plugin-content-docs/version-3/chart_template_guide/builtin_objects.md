---
title: Objets intégrés
description: Les objets intégrés disponibles dans les templates.
sidebar_position: 3
---

Les objets sont passés dans un template par le moteur de template. Votre code peut également transmettre des objets (nous verrons des exemples lorsque nous examinerons les instructions `with` et `range`). Il existe même plusieurs façons de créer de nouveaux objets dans vos templates, comme avec la fonction `tuple` que nous verrons plus tard.

Les objets peuvent être simples et n'avoir qu'une seule valeur. Ou ils peuvent contenir d'autres objets ou fonctions. Par exemple, l'objet `Release` contient plusieurs objets (comme `Release.Name`) et l'objet `Files` possède quelques fonctions.

Dans la section précédente, nous avons utilisé `{{ .Release.Name }}` pour insérer le nom d'une release dans un template. `Release` est l'un des objets de premier niveau auxquels vous pouvez accéder dans vos templates.

- `Release` : Cet objet décrit la release elle-même. Il contient plusieurs objets :
  - `Release.Name` : Le nom de la release
  - `Release.Namespace` : Le namespace dans lequel la release sera déployée (si le manifeste ne le remplace pas)
  - `Release.IsUpgrade` : Cette valeur est définie à `true` si l'opération en cours est une mise à niveau ou un rollback.
  - `Release.IsInstall` : Cette valeur est définie à `true` si l'opération en cours est une installation.
  - `Release.Revision` : Le numéro de révision pour cette release. Lors de l'installation, cette valeur est 1, et elle est incrémentée à chaque mise à niveau et rollback.
  - `Release.Service` : Le service qui effectue le rendu du template actuel. Dans Helm, c'est toujours `Helm`.
- `Values` : Les valeurs passées dans le template depuis le fichier `values.yaml` et depuis les fichiers fournis par l'utilisateur. Par défaut, `Values` est vide.
- `Chart` : Le contenu du fichier `Chart.yaml`. Toutes les données de `Chart.yaml` seront accessibles ici. Par exemple, `{{ .Chart.Name }}-{{ .Chart.Version }}` affichera `mychart-0.1.0`.
  - Les champs disponibles sont listés dans le [Guide des Charts](/topics/charts.md#the-chartyaml-file)
- `Subcharts` : Cet objet donne accès à la portée (`.Values`, `.Charts`, `.Releases`, etc.) des sous-charts depuis le chart parent. Par exemple, `.Subcharts.mySubChart.myValue` pour accéder à `myValue` dans le chart `mySubChart`.
- `Files` : Cet objet donne accès à tous les fichiers non spéciaux dans un chart. Bien que vous ne puissiez pas l'utiliser pour accéder aux templates, vous pouvez l'utiliser pour accéder aux autres fichiers du chart. Consultez la section [Accès aux fichiers](/chart_template_guide/accessing_files.md) pour plus de détails.
  - `Files.Get` est une fonction pour obtenir un fichier par son nom (`.Files.Get config.ini`)
  - `Files.GetBytes` est une fonction pour obtenir le contenu d'un fichier sous forme de tableau d'octets au lieu d'une chaîne de caractères. Ceci est utile pour des éléments comme les images.
  - `Files.Glob` est une fonction qui retourne une liste de fichiers dont les noms correspondent au motif glob donné.
  - `Files.Lines` est une fonction qui lit un fichier ligne par ligne. Utile pour itérer sur chaque ligne d'un fichier.
  - `Files.AsSecrets` est une fonction qui retourne le contenu des fichiers encodé en Base 64.
  - `Files.AsConfig` est une fonction qui retourne le contenu des fichiers sous forme de map YAML.
- `Capabilities` : Cet objet fournit des informations sur les fonctionnalités prises en charge par le cluster Kubernetes.
  - `Capabilities.APIVersions` est un ensemble de versions.
  - `Capabilities.APIVersions.Has $version` indique si une version (par exemple, `batch/v1`) ou une ressource (par exemple, `apps/v1/Deployment`) est disponible sur le cluster.
  - `Capabilities.KubeVersion` et `Capabilities.KubeVersion.Version` représentent la version de Kubernetes.
  - `Capabilities.KubeVersion.Major` est la version majeure de Kubernetes.
  - `Capabilities.KubeVersion.Minor` est la version mineure de Kubernetes.
  - `Capabilities.HelmVersion` est l'objet contenant les détails de la version de Helm, c'est la même sortie que `helm version`.
  - `Capabilities.HelmVersion.Version` est la version actuelle de Helm au format semver.
  - `Capabilities.HelmVersion.GitCommit` est le sha1 git de Helm.
  - `Capabilities.HelmVersion.GitTreeState` est l'état de l'arborescence git de Helm.
  - `Capabilities.HelmVersion.GoVersion` est la version du compilateur Go utilisé.
- `Template` : Contient des informations sur le template en cours d'exécution
  - `Template.Name` : Le chemin qualifié vers le template actuel (par exemple, `mychart/templates/mytemplate.yaml`)
  - `Template.BasePath` : Le chemin qualifié vers le répertoire templates du chart actuel (par exemple, `mychart/templates`).

Les valeurs intégrées commencent toujours par une majuscule. Ceci est conforme à la convention de nommage de Go. Lorsque vous créez vos propres noms, vous êtes libre d'utiliser la convention qui convient à votre équipe. Certaines équipes, comme celles dont vous pouvez voir les charts sur [Artifact Hub](https://artifacthub.io/packages/search?kind=0), choisissent d'utiliser uniquement des minuscules en première lettre afin de distinguer les noms locaux de ceux qui sont intégrés. Dans ce guide, nous suivons cette convention.
