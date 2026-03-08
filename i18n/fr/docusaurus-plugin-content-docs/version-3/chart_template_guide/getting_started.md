---
title: Premiers pas
description: Un guide rapide sur les templates de chart.
sidebar_position: 2
---

Dans cette section du guide, nous allons créer un chart et y ajouter un premier template. Le chart créé ici sera utilisé tout au long du reste du guide.

Pour commencer, examinons brièvement la structure d'un chart Helm.

## Charts

Comme décrit dans le [Guide des charts](/topics/charts.md), les charts Helm sont structurés de la manière suivante :

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

Le répertoire `templates/` contient les fichiers de template. Lorsque Helm évalue un chart, il envoie tous les fichiers du répertoire `templates/` au moteur de rendu de templates. Il collecte ensuite les résultats de ces templates et les envoie à Kubernetes.

Le fichier `values.yaml` est également important pour les templates. Ce fichier contient les _valeurs par défaut_ d'un chart. Ces valeurs peuvent être remplacées par les utilisateurs lors de l'exécution de `helm install` ou `helm upgrade`.

Le fichier `Chart.yaml` contient une description du chart. Vous pouvez y accéder depuis un template.

Le répertoire `charts/` _peut_ contenir d'autres charts (que nous appelons _sous-charts_). Plus loin dans ce guide, nous verrons comment ceux-ci fonctionnent lors du rendu des templates.

## Un premier chart

Pour ce guide, nous allons créer un chart simple appelé `mychart`, puis nous créerons quelques templates à l'intérieur de ce chart.

```console
$ helm create mychart
Creating mychart
```

### Un aperçu rapide de `mychart/templates/`

Si vous examinez le répertoire `mychart/templates/`, vous remarquerez que quelques fichiers sont déjà présents :

- `NOTES.txt` : Le « texte d'aide » de votre chart. Il sera affiché aux utilisateurs lorsqu'ils exécuteront `helm install`.
- `deployment.yaml` : Un manifeste de base pour créer un [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) Kubernetes
- `service.yaml` : Un manifeste de base pour créer un [endpoint de service](https://kubernetes.io/docs/concepts/services-networking/service/) pour votre deployment
- `_helpers.tpl` : Un emplacement pour les fonctions de template réutilisables dans tout le chart

Et ce que nous allons faire, c'est... _tous les supprimer !_ De cette façon, nous pourrons suivre notre tutoriel depuis le début. Nous créerons en fait nos propres fichiers `NOTES.txt` et `_helpers.tpl` au fur et à mesure.

```console
$ rm -rf mychart/templates/*
```

Lorsque vous écrivez des charts de qualité production, avoir des versions de base de ces fichiers peut être très utile. Dans votre travail quotidien de création de charts, vous ne voudrez probablement pas les supprimer.

## Un premier template

Le premier template que nous allons créer sera un `ConfigMap`. Dans Kubernetes, un ConfigMap est simplement un objet permettant de stocker des données de configuration. D'autres éléments, comme les pods, peuvent accéder aux données d'un ConfigMap.

Comme les ConfigMaps sont des ressources de base, ils constituent un excellent point de départ pour nous.

Commençons par créer un fichier appelé `mychart/templates/configmap.yaml` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**ASTUCE :** Les noms de template ne suivent pas de convention de nommage stricte. Cependant, nous recommandons d'utiliser l'extension `.yaml` pour les fichiers YAML et `.tpl` pour les fichiers d'aide.

Le fichier YAML ci-dessus est un ConfigMap minimaliste, contenant uniquement les champs minimaux nécessaires. Du fait que ce fichier se trouve dans le répertoire `mychart/templates/`, il sera envoyé au moteur de templates.

Il est tout à fait acceptable de placer un fichier YAML simple comme celui-ci dans le répertoire `mychart/templates/`. Lorsque Helm lit ce template, il l'envoie simplement à Kubernetes tel quel.

Avec ce template simple, nous avons maintenant un chart installable. Et nous pouvons l'installer de cette façon :

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

En utilisant Helm, nous pouvons récupérer la release et voir le template réellement chargé.

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

La commande `helm get manifest` prend un nom de release (`full-coral`) et affiche toutes les ressources Kubernetes qui ont été envoyées au serveur. Chaque fichier commence par `---` pour indiquer le début d'un document YAML, puis est suivi d'une ligne de commentaire générée automatiquement qui nous indique quel fichier de template a généré ce document YAML.

À partir de là, nous pouvons voir que les données YAML sont exactement ce que nous avons mis dans notre fichier `configmap.yaml`.

Maintenant, nous pouvons désinstaller notre release : `helm uninstall full-coral`.

### Ajouter un appel de template simple

Coder en dur le champ `name:` dans une ressource est généralement considéré comme une mauvaise pratique. Les noms doivent être uniques pour chaque release. Nous pourrions donc vouloir générer le champ name en insérant le nom de la release.

**ASTUCE :** Le champ `name:` est limité à 63 caractères en raison des limitations du système DNS. Pour cette raison, les noms de release sont limités à 53 caractères. Kubernetes 1.3 et les versions antérieures étaient limitées à seulement 24 caractères (donc des noms de 14 caractères).

Modifions `configmap.yaml` en conséquence.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

Le changement majeur se trouve dans la valeur du champ `name:`, qui est maintenant `{{ .Release.Name }}-configmap`.

> Une directive de template est encadrée par les blocs `{{` et `}}`.

La directive de template `{{ .Release.Name }}` injecte le nom de la release dans le template. Les valeurs passées à un template peuvent être considérées comme des _objets à espace de noms_, où un point (`.`) sépare chaque élément.

Le point initial avant `Release` indique que nous commençons par l'espace de noms racine pour cette portée (nous parlerons de la portée plus tard). Nous pouvons donc lire `.Release.Name` comme « partir de l'espace de noms racine, trouver l'objet `Release`, puis chercher à l'intérieur un objet appelé `Name` ».

L'objet `Release` est l'un des objets intégrés de Helm, et nous l'aborderons plus en détail ultérieurement. Pour l'instant, il suffit de dire qu'il affichera le nom de release que la bibliothèque attribue à notre release.

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

Vous pouvez exécuter `helm get manifest clunky-serval` pour voir l'ensemble du YAML généré.

Notez que le nom du ConfigMap dans Kubernetes est `clunky-serval-configmap` au lieu de `mychart-configmap` précédemment.

À ce stade, nous avons vu les templates dans leur forme la plus basique : des fichiers YAML avec des directives de template intégrées dans `{{` et `}}`. Dans la partie suivante, nous examinerons les templates plus en profondeur. Mais avant de continuer, voici une astuce qui peut accélérer la création de templates : lorsque vous voulez tester le rendu d'un template sans rien installer réellement, vous pouvez utiliser `helm install --debug --dry-run goodly-guppy ./mychart`. Cela effectuera le rendu des templates. Mais au lieu d'installer le chart, cela vous retournera le template rendu pour que vous puissiez voir le résultat :

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

L'utilisation de `--dry-run` facilite le test de votre code, mais ne garantit pas que Kubernetes acceptera les templates que vous générez. Il vaut mieux ne pas supposer que votre chart s'installera simplement parce que `--dry-run` fonctionne.

Dans le [Guide des templates de chart](/chart_template_guide/index.mdx), nous reprenons le chart de base défini ici et explorons le langage de template Helm en détail. Et nous commencerons par les objets intégrés.
