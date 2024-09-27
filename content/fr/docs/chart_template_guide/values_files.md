---
title: "Fichiers de Valeurs"
description: "Instructions sur l'utilisation de l'argument --values"
weight: 4
---

Dans la section précédente, nous avons examiné les objets intégrés que les modèles Helm offrent. L'un des objets intégrés est `Values`. Cet objet permet d'accéder aux valeurs passées au chart. Son contenu provient de plusieurs sources :

- Le fichier `values.yaml` dans le chart
- Si c'est un sous-chart, le fichier `values.yaml` d'un chart parent
- Un fichier de valeurs est passé à `helm install` ou `helm upgrade` avec l'argument `-f` (`helm install -f myvals.yaml ./mychart`)
- Des paramètres individuels sont passés avec `--set` (comme `helm install --set foo=bar ./mychart`)

La liste ci-dessus est par ordre de spécificité : `values.yaml` est la valeur par défaut, qui peut être remplacée par le `values.yaml` d'un chart parent, qui peut à son tour être remplacé par un fichier de valeurs fourni par l'utilisateur, qui peut à son tour être remplacé par des paramètres `--set`.

Les fichiers de valeurs sont des fichiers YAML simples. Éditons `mychart/values.yaml` puis modifions notre modèle de ConfigMap.

En supprimant les valeurs par défaut dans `values.yaml`, nous allons définir juste un paramètre :

```yaml
favoriteDrink: coffee
```

Nous pouvons maintenant l'utiliser à l'intérieur d'un modèle :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Remarquez que sur la dernière ligne, nous accédons à `favoriteDrink` en tant qu'attribut de `Values` : `{{ .Values.favoriteDrink }}`.

Voyons comment cela se rend.

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

Puisque `favoriteDrink` est défini dans le fichier `values.yaml` par défaut sur `coffee`, c'est la valeur affichée dans le modèle. Nous pouvons facilement remplacer cela en ajoutant un argument `--set` dans notre appel à `helm install` :

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

Puisque `--set` a une priorité plus élevée que le fichier `values.yaml` par défaut, notre modèle génère `drink: slurm`.

Les fichiers de valeurs peuvent également contenir un contenu plus structuré. Par exemple, nous pourrions créer une section `favorite` dans notre fichier `values.yaml`, puis y ajouter plusieurs clés :

```yaml
favorite:
  drink: coffee
  food: pizza
```

Maintenant, nous devrions modifier légèrement le modèle :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

Bien que structurer les données de cette manière soit possible, il est recommandé de garder vos arbres de valeurs peu profonds, en favorisant la platitude. Lorsque nous examinerons l'attribution de valeurs aux sous-charts, nous verrons comment les valeurs sont nommées en utilisant une structure arborescente.

## Supprimer une clé par défaut

Si vous devez supprimer une clé des valeurs par défaut, vous pouvez remplacer la valeur de la clé par `null`, auquel cas Helm supprimera la clé de la fusion des valeurs remplacées.

Par exemple, le chart stable de Drupal permet de configurer le probe de vivacité, au cas où vous configureriez une image personnalisée. Voici les valeurs par défaut :
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

Si vous essayez de remplacer le gestionnaire de livenessProbe par `exec` au lieu de `httpGet` en utilisant `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`, Helm va fusionner les clés par défaut et remplacées, ce qui donne le YAML suivant :
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

Cependant, Kubernetes échouerait alors parce que vous ne pouvez pas déclarer plus d'un gestionnaire de livenessProbe. Pour contourner cela, vous pouvez indiquer à Helm de supprimer le `livenessProbe.httpGet` en le définissant sur null :
```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

À ce stade, nous avons vu plusieurs objets intégrés et les avons utilisés pour injecter des informations dans un modèle. Maintenant, nous allons examiner un autre aspect du moteur de modèles : les fonctions et les pipelines.
