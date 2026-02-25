---
title: Fichiers Values
description: Instructions sur l'utilisation du flag --values.
sidebar_position: 4
---

Dans la section précédente, nous avons examiné les objets intégrés que les templates Helm proposent. L'un de ces objets intégrés est `Values`. Cet objet donne accès aux valeurs passées dans le chart. Son contenu provient de plusieurs sources :

- Le fichier `values.yaml` du chart
- Si c'est un sous-chart, le fichier `values.yaml` du chart parent
- Un fichier values passé à `helm install` ou `helm upgrade` avec le flag `-f` (`helm install -f myvals.yaml ./mychart`)
- Des paramètres individuels passés avec `--set` (par exemple `helm install --set foo=bar ./mychart`)

La liste ci-dessus est ordonnée par spécificité : `values.yaml` est la valeur par défaut, qui peut être remplacée par le `values.yaml` d'un chart parent, qui peut à son tour être remplacé par un fichier values fourni par l'utilisateur, qui peut lui-même être remplacé par les paramètres `--set`.

Les fichiers values sont de simples fichiers YAML. Modifions `mychart/values.yaml`, puis éditons notre template ConfigMap.

En supprimant les valeurs par défaut dans `values.yaml`, nous définirons un seul paramètre :

```yaml
favoriteDrink: coffee
```

Nous pouvons maintenant l'utiliser dans un template :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Remarquez qu'à la dernière ligne, nous accédons à `favoriteDrink` comme attribut de `Values` : `{{ .Values.favoriteDrink }}`.

Voyons comment cela est rendu.

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

Puisque `favoriteDrink` est défini dans le fichier `values.yaml` par défaut à `coffee`, c'est la valeur affichée dans le template. Nous pouvons facilement la remplacer en ajoutant un flag `--set` dans notre appel à `helm install` :

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

Puisque `--set` a une priorité plus élevée que le fichier `values.yaml` par défaut, notre template génère `drink: slurm`.

Les fichiers values peuvent également contenir du contenu plus structuré. Par exemple, nous pourrions créer une section `favorite` dans notre fichier `values.yaml`, puis y ajouter plusieurs clés :

```yaml
favorite:
  drink: coffee
  food: pizza
```

Il faudrait alors modifier légèrement le template :

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

Bien que structurer les données de cette façon soit possible, la recommandation est de garder vos arbres de valeurs peu imbriqués, en privilégiant une structure plate. Lorsque nous examinerons l'assignation de valeurs aux sous-charts, nous verrons comment les valeurs sont nommées en utilisant une structure arborescente.

## Supprimer une clé par défaut

Si vous avez besoin de supprimer une clé des valeurs par défaut, vous pouvez remplacer la valeur de cette clé par `null`, auquel cas Helm supprimera la clé lors de la fusion des valeurs surchargées.

Par exemple, le chart Drupal stable permet de configurer la sonde de vivacité (liveness probe), au cas où vous configureriez une image personnalisée. Voici les valeurs par défaut :

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

Si vous essayez de remplacer le handler livenessProbe par `exec` au lieu de `httpGet` en utilisant `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`, Helm fusionnera les clés par défaut et celles surchargées, produisant le YAML suivant :

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

Cependant, Kubernetes échouera car vous ne pouvez pas déclarer plus d'un handler livenessProbe. Pour contourner ce problème, vous pouvez demander à Helm de supprimer `livenessProbe.httpGet` en le définissant à null :

```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

À ce stade, nous avons vu plusieurs objets intégrés et les avons utilisés pour injecter des informations dans un template. Nous allons maintenant examiner un autre aspect du moteur de templates : les fonctions et les pipelines.
