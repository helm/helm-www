---
title: Archivos Values
description: Instrucciones sobre cómo usar la opción --values.
sidebar_position: 4
---

En la sección anterior vimos los objetos integrados que ofrecen las plantillas
de Helm. Uno de los objetos integrados es `Values`. Este objeto permite acceder
a los valores que se pasan al chart. Su contenido proviene de múltiples fuentes:

- El archivo `values.yaml` en el chart
- Si es un subchart, el archivo `values.yaml` de un chart padre
- Un archivo values pasado a `helm install` o `helm upgrade` con la opción `-f`
  (`helm install -f myvals.yaml ./mychart`)
- Parámetros individuales pasados con `--set` (como `helm install --set foo=bar
  ./mychart`)

La lista anterior está en orden de prioridad: `values.yaml` es el valor por
defecto, que puede ser sobrescrito por el `values.yaml` de un chart padre, que
a su vez puede ser sobrescrito por un archivo values proporcionado por el usuario,
que a su vez puede ser sobrescrito por los parámetros `--set`.

Los archivos values son archivos YAML simples. Editemos `mychart/values.yaml` y
luego editemos nuestra plantilla de ConfigMap.

Eliminando los valores por defecto en `values.yaml`, estableceremos solo un
parámetro:

```yaml
favoriteDrink: coffee
```

Ahora podemos usar esto dentro de una plantilla:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Observe en la última línea que accedemos a `favoriteDrink` como un atributo de
`Values`: `{{ .Values.favoriteDrink }}`.

Veamos cómo se renderiza.

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

Dado que `favoriteDrink` está configurado en el archivo `values.yaml` por
defecto como `coffee`, ese es el valor que se muestra en la plantilla. Podemos
sobrescribirlo fácilmente agregando una opción `--set` en nuestra llamada a
`helm install`:

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

Dado que `--set` tiene mayor prioridad que el archivo `values.yaml` por defecto,
nuestra plantilla genera `drink: slurm`.

Los archivos values también pueden contener contenido más estructurado. Por
ejemplo, podríamos crear una sección `favorite` en nuestro archivo `values.yaml`
y agregar varias claves allí:

```yaml
favorite:
  drink: coffee
  food: pizza
```

Ahora tendríamos que modificar ligeramente la plantilla:

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

Aunque es posible estructurar los datos de esta manera, la recomendación es
mantener los árboles de values poco profundos, favoreciendo una estructura plana.
Cuando veamos cómo asignar valores a subcharts, veremos cómo los values se
nombran usando una estructura de árbol.

## Eliminar una clave por defecto

Si necesita eliminar una clave de los values por defecto, puede sobrescribir el
valor de la clave como `null`, en cuyo caso Helm eliminará la clave de la fusión
de valores sobrescritos.

Por ejemplo, el chart estable de Drupal permite configurar el liveness probe,
en caso de que configure una imagen personalizada. Estos son los valores por
defecto:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

Si intenta sobrescribir el handler del livenessProbe a `exec` en lugar de
`httpGet` usando `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`,
Helm fusionará las claves por defecto y las sobrescritas, resultando en el
siguiente YAML:
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

Sin embargo, Kubernetes fallaría porque no se puede declarar más de un handler
de livenessProbe. Para resolver esto, puede indicar a Helm que elimine
`livenessProbe.httpGet` estableciéndolo como null:
```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

En este punto, hemos visto varios objetos integrados y los hemos usado para
inyectar información en una plantilla. Ahora veremos otro aspecto del motor de
plantillas: funciones y pipelines.
