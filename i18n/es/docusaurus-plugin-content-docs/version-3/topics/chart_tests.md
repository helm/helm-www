---
title: Pruebas de Chart
description: Describe cómo ejecutar y probar sus charts.
sidebar_position: 3
---

Un chart contiene varios recursos y componentes de Kubernetes que funcionan
juntos. Como autor de charts, es posible que desee escribir algunas pruebas
que validen que su chart funciona como se esperaba cuando se instala. Estas
pruebas también ayudan al consumidor de charts a comprender lo que se supone
que debe hacer su chart.

Una **prueba** en un chart de Helm vive en el directorio `templates/` y es una
definición de Job que especifica un contenedor con un comando dado para ejecutar.
El contenedor debe salir correctamente (exit 0) para que una prueba se considere
exitosa. La definición del Job debe contener la anotación del hook de
prueba de Helm: `helm.sh/hook: test`.

Tenga en cuenta que hasta Helm v3, la definición de trabajo debía contener una
de estas anotaciones de hook de prueba de Helm: `helm.sh/hook: test-success` o
`helm.sh/hook: test-failure`. `helm.sh/hook: test-success` todavía se acepta como
una alternativa compatible con versiones anteriores de `helm.sh/hook: test`.

Ejemplos de pruebas:

- Validar que su configuración del archivo values.yaml se haya inyectado correctamente.
  - Asegurarse de que su nombre de usuario y contraseña funcionen correctamente
  - Asegurarse de que un nombre de usuario y una contraseña incorrectos no funcionen
- Verificar que sus servicios están activos y con el balanceo de carga correcto
- etc.

Puede ejecutar las pruebas predefinidas en Helm sobre un release usando el comando
`helm test <RELEASE_NAME>`. Para un consumidor de charts, esta es una excelente
manera de verificar que su release de un chart (o aplicación) funcione como se esperaba.

## Ejemplo de Prueba

El comando [helm create](/helm/helm_create.md) creará automáticamente varias carpetas y archivos. Para probar la funcionalidad de helm test, primero cree un chart de demostración.

```console
$ helm create demo
```

Ahora podrá ver la siguiente estructura en su chart de demostración.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

En `demo/templates/tests/test-connection.yaml` encontrará una prueba que puede ejecutar. A continuación se muestra la definición del Pod de prueba de Helm:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## Pasos para Ejecutar un Conjunto de Pruebas sobre un Release

Primero, instale el chart en su clúster para crear un release. Puede que tenga
que esperar a que todos los pods se activen; si prueba inmediatamente después de
esta instalación, es probable que muestre una falla transitoria y querrá volver
a probar.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## Notas

- Puede definir tantas pruebas como desee en un solo archivo yaml o distribuirlas
  en varios archivos yaml en el directorio `templates/`.
- Le invitamos a anidar su suite de pruebas en un directorio `tests/` como
  `<chart-name>/templates/tests/` para mayor aislamiento.
- Una prueba es un [hook de Helm](/topics/charts_hooks.md), por lo que anotaciones
  como `helm.sh/hook-weight` y `helm.sh/hook-delete-policy` pueden usarse con
  recursos de prueba.
