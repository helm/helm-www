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

Una **prueba** en un chart de helm vive en el directorio `templates/` y es una
definición de trabajo que especifica un contenedor con un comando dado para ejecutar.
El contenedor debe salir correctamente (salida 0) para que una prueba se considere
un éxito. La definición del trabajo debe contener la anotación del gancho de
prueba del timón: `helm.sh/hook: test`.

Tenga en cuenta que hasta Helm v3, la definición de trabajo debía contener una
de estas anotaciones de gancho de prueba de helm: `helm.sh/hook: test-success` o
`helm.sh/hook: test-failure`. `helm.sh/hook: test-success` todavía se acepta como
una alternativa compatible con versiones anteriores de `helm.sh/hook: test`.

Ejemplo de pruebas:

- Valide que su configuración del archivo values.yaml se haya inyectado correctamente.
  - Asegúrese de que su nombre de usuario y contraseña funcionen correctamente
  - Asegúrese de que un nombre de usuario y una contraseña incorrectos no funcionen
- Afirmar que sus servicios están activos y con el balanceo de carga correcto
- etc.

Puede ejecutar las pruebas predefinidas en Helm en un release usando el comando
`helm test <RELEASE_NAME>`. Para un consumidor de charts, esta es una excelente
manera de verificar que su release de un chart (o aplicación) funcione como se esperaba.

## Ejemplo de Prueba

A continuación se muestra un ejemplo de la definición de un módulo de prueba Helm
en el [chart de bitnami wordpress](https://hub.helm.sh/charts/bitnami/wordpress).
Si descarga una copia del chart, puede ver los archivos localmente:

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm pull bitnami/wordpress --untar
```

```
wordpress/
  Chart.yaml
  README.md
  values.yaml
  charts/
  templates/
  templates/tests/test-mariadb-connection.yaml
```

En el archivo `wordpress/templates/tests/test-mariadb-connection.yaml`, verás
una prueba que puedes probar:

```yaml
{{- if .Values.mariadb.enabled }}
apiVersion: v1
kind: Pod
metadata:
  name: "{{ .Release.Name }}-credentials-test"
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: {{ .Release.Name }}-credentials-test
      image: {{ template "wordpress.image" . }}
      imagePullPolicy: {{ .Values.image.pullPolicy | quote }}
      {{- if .Values.securityContext.enabled }}
      securityContext:
        runAsUser: {{ .Values.securityContext.runAsUser }}
      {{- end }}
      env:
        - name: MARIADB_HOST
          value: {{ template "mariadb.fullname" . }}
        - name: MARIADB_PORT
          value: "3306"
        - name: WORDPRESS_DATABASE_NAME
          value: {{ default "" .Values.mariadb.db.name | quote }}
        - name: WORDPRESS_DATABASE_USER
          value: {{ default "" .Values.mariadb.db.user | quote }}
        - name: WORDPRESS_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ template "mariadb.fullname" . }}
              key: mariadb-password
      command:
        - /bin/bash
        - -ec
        - |
          mysql --host=$MARIADB_HOST --port=$MARIADB_PORT --user=$WORDPRESS_DATABASE_USER --password=$WORDPRESS_DATABASE_PASSWORD
  restartPolicy: Never
{{- end }}
```

## Pasos Para Ejecutar un Conjunto de Pruebas sobre un Release

Primero, instale el chart en su clúster para crear un release. Puede que tenga
que esperar a que todos los Pods se activen; si prueba inmediatamente después de
esta instalación, es probable que muestre una falla transitiva y querrá volver
a probar.

```console
$ helm install quirky-walrus wordpress --namespace default
$ helm test quirky-walrus
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test succeeded
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 succeeded
NAME: quirky-walrus
LAST DEPLOYED: Mon Jun 22 17:24:31 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     quirky-walrus-mariadb-test-dqas5
Last Started:   Mon Jun 22 17:27:19 2020
Last Completed: Mon Jun 22 17:27:21 2020
Phase:          Succeeded
TEST SUITE:     quirky-walrus-credentials-test
Last Started:   Mon Jun 22 17:27:17 2020
Last Completed: Mon Jun 22 17:27:19 2020
Phase:          Succeeded
[...]
```

## Notas

- Puede definir tantas pruebas como desee en un solo archivo yaml o distribuirlas
  en varios archivos yaml en el directorio `templates/`.
- Le invitamos a anidar su suite de pruebas en un directorio `tests/` como
  `<chart-name>/templates/tests/` para mayor aislamiento.
- Una prueba es un [gancho de Helm](/topics/charts_hooks.md), por lo que anotaciones
  como `helm.sh/hook-weight` y `helm.sh/hook-delete-policy` pueden usarse con
  recursos de prueba.
