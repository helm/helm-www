---
title: Creación de un Archivo NOTES.txt
description: Cómo proporcionar instrucciones a los usuarios de su Chart.
sidebar_position: 10
---

En esta sección vamos a ver la herramienta de Helm para proporcionar
instrucciones a los usuarios de su chart. Al finalizar un `helm install` o
`helm upgrade`, Helm puede mostrar un bloque de información útil para los
usuarios. Esta información es altamente personalizable mediante plantillas.

Para agregar notas de instalación a su chart, simplemente cree un archivo
`templates/NOTES.txt`. Este archivo es texto plano, pero se procesa como una
plantilla, y tiene todas las funciones y objetos de plantilla normales
disponibles.

Creemos un archivo `NOTES.txt` simple:

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

Ahora, si ejecutamos `helm install rude-cardinal ./mychart`, veremos este mensaje
al final:

```
RESOURCES:
==> v1/Secret
NAME                   TYPE      DATA      AGE
rude-cardinal-secret   Opaque    1         0s

==> v1/ConfigMap
NAME                      DATA      AGE
rude-cardinal-configmap   3         0s


NOTES:
Thank you for installing mychart.

Your release is named rude-cardinal.

To learn more about the release, try:

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

Usar `NOTES.txt` de esta manera es una excelente forma de proporcionar a sus
usuarios información detallada sobre cómo usar su chart recién instalado. Se
recomienda encarecidamente crear un archivo `NOTES.txt`, aunque no es obligatorio.
