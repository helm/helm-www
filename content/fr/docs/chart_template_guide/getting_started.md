---
title: "Commencer"
weight: 2
description: "Un guide rapide sur les templates de Chart"
---

Dans cette section du guide, nous allons créer un chart puis ajouter un premier template. Le chart que nous créons ici sera utilisé tout au long du reste du guide.

Pour commencer, jetons un rapide coup d'œil à un chart Helm.

## Charts

Comme décrit dans le [Guide des Charts](../../topics/charts), les charts Helm sont structurés de cette manière :

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

Le répertoire `templates/` est destiné aux fichiers de template. Lorsque Helm évalue un chart, il enverra tous les fichiers du répertoire `templates/` au moteur de rendu des templates. Ensuite, il collecte les résultats de ces templates et les transmet à Kubernetes.

Le fichier `values.yaml` est également important pour les templates. Ce fichier contient les _valeurs par défaut_ pour un chart. Ces valeurs peuvent être remplacées par les utilisateurs lors de `helm install` ou `helm upgrade`.

Le fichier `Chart.yaml` contient une description du chart. Vous pouvez y accéder depuis un template.

Le répertoire `charts/` _peut_ contenir d'autres charts (que nous appelons _sous-charts_). Plus tard dans ce guide, nous verrons comment ceux-ci fonctionnent lors du rendu des templates.

## Chart d'Initiation

Pour ce guide, nous allons créer un chart simple appelé `mychart`, puis nous allons créer quelques templates à l'intérieur de ce chart.

```console
$ helm create mychart
Creating mychart
```

### Un aperçu rapide de `mychart/templates/`

Si vous regardez le répertoire `mychart/templates/`, vous remarquerez qu'il y a déjà quelques fichiers présents.

- `NOTES.txt` : Le "texte d'aide" pour votre chart. Cela sera affiché à vos utilisateurs lorsqu'ils exécutent `helm install`.
- `deployment.yaml` : Un manifeste de base pour créer un [déploiement Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).
- `service.yaml` : Un manifeste de base pour créer un [service](https://kubernetes.io/docs/concepts/services-networking/service/) pour votre déploiement.
- `_helpers.tpl` : Un endroit pour mettre des helpers de template que vous pouvez réutiliser dans tout le chart.

Et ce que nous allons faire, c'est... _les supprimer tous !_ Ainsi, nous pourrons travailler à travers notre tutoriel depuis le début. Nous allons en fait créer notre propre `NOTES.txt` et `_helpers.tpl` au fur et à mesure.

```console
$ rm -rf mychart/templates/*
```

Lorsque vous rédigez des charts de qualité production, avoir des versions de base de ces charts peut être très utile. Donc, dans votre rédaction quotidienne de charts, vous ne voudrez probablement pas les supprimer.

## Premier Modèle

Le premier template que nous allons créer sera un `ConfigMap`. Dans Kubernetes, un ConfigMap est simplement un objet pour stocker des données de configuration. D'autres objets, comme les pods, peuvent accéder aux données dans un ConfigMap.

Parce que les ConfigMaps sont des ressources de base, ils constituent un excellent point de départ pour nous.

Commençons par créer un fichier appelé `mychart/templates/configmap.yaml` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**CONSEIL :** Les noms de modèles ne suivent pas un schéma de nommage rigide. Cependant, nous recommandons d'utiliser l'extension `.yaml` pour les fichiers YAML et `.tpl` pour les fichiers d'assistance.

Le fichier YAML ci-dessus est un ConfigMap minimal, comportant les champs nécessaires. En raison du fait que ce fichier se trouve dans le répertoire `mychart/templates/`, il sera traité par le moteur de template.

Il est tout à fait acceptable de placer un fichier YAML simple comme celui-ci dans le répertoire `mychart/templates/`. Lorsque Helm lit ce template, il l'enverra simplement à Kubernetes tel quel.

Avec ce template simple, nous avons maintenant un chart installable. Nous pouvons l'installer de la manière suivante :

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

En utilisant Helm, nous pouvons récupérer la version et voir le template réel qui a été chargé.

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

La commande `helm get manifest` prend un nom de version (`full-coral`) et affiche toutes les ressources Kubernetes qui ont été téléchargées sur le serveur. Chaque fichier commence par `---` pour indiquer le début d'un document YAML, suivi d'une ligne de commentaire générée automatiquement qui nous indique quel fichier de template a généré ce document YAML.

À partir de là, nous pouvons constater que les données YAML sont exactement ce que nous avons mis dans notre fichier `configmap.yaml`.

Maintenant, nous pouvons désinstaller notre release : `helm uninstall full-coral`.

### Ajouter un appel de template simple

Il est généralement considéré comme une mauvaise pratique de coder en dur le champ `name:` dans une ressource. Les noms doivent être uniques à une release. Ainsi, nous pourrions vouloir générer un champ de nom en insérant le nom de la release.

**ASTUCE :** Le champ `name:` est limité à 63 caractères en raison des limitations du système DNS. Pour cette raison, les noms de release sont limités à 53 caractères. Kubernetes 1.3 et les versions antérieures limitaient cela à seulement 24 caractères (ce qui signifie des noms de 14 caractères maximum).

Modifions `configmap.yaml` en conséquence.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

Le changement majeur concerne la valeur du champ `name:`, qui est maintenant `{{ .Release.Name }}-configmap`.

> Une directive de template est encadrée par des blocs `{{` et `}}`.

La directive de template `{{ .Release.Name }}` injecte le nom de la version dans le template. Les valeurs passées dans un template peuvent être considérées comme des objets _namespacés_, où un point (`.`) sépare chaque élément du namespace.

Le point précédant `Release` indique que nous commençons par le namespace le plus élevé pour ce scope (nous parlerons du scope un peu plus tard). Ainsi, nous pourrions lire `.Release.Name` comme "partir du namespace supérieur, trouver l'objet `Release`, puis chercher à l'intérieur de celui-ci un objet appelé `Name`".

L'objet `Release` est l'un des objets intégrés de Helm, et nous le couvrirons plus en profondeur plus tard. Mais pour l'instant, il suffit de dire que cela affichera le nom de la release que la bibliothèque attribue à notre release.

Maintenant, lorsque nous installons notre ressource, nous verrons immédiatement le résultat de l'utilisation de cette directive de template :

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Vous pouvez exécuter `helm get manifest clunky-serval` pour voir l'intégralité du YAML généré.

Notez que le nom du ConfigMap dans Kubernetes est `clunky-serval-configmap` au lieu de `mychart-configmap` comme auparavant.

À ce stade, nous avons vu les modèles dans leur forme la plus basique : des fichiers YAML contenant des directives de modèle intégrées dans `{{` et `}}`. Dans la prochaine partie, nous examinerons les modèles de manière plus approfondie. Mais avant de continuer, voici une astuce rapide qui peut rendre la création de modèles plus rapide : lorsque vous souhaitez tester le rendu des modèles sans rien installer, vous pouvez utiliser `helm install --debug --dry-run goodly-guppy ./mychart`. Cela rendra les modèles. Mais au lieu d'installer le graphique, cela vous renverra le modèle rendu afin que vous puissiez voir la sortie :

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
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
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

L'utilisation de `--dry-run` facilitera le test de votre code, mais cela ne garantira pas que Kubernetes acceptera les modèles que vous générez. Il est préférable de ne pas supposer que votre graphique s'installera simplement parce que `--dry-run` fonctionne.

Dans le [Guide des modèles de graphiques](_index.md), nous prendrons le graphique de base que nous avons défini ici et explorerons en détail le langage de modèle Helm. Nous commencerons par les objets intégrés.
