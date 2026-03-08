---
title: Depuración de Plantillas
description: Solución de problemas de charts que no se despliegan correctamente.
sidebar_position: 13
---

La depuración de plantillas puede ser complicada porque las plantillas renderizadas
se envían al servidor de API de Kubernetes, que puede rechazar los archivos YAML
por razones distintas al formato.

Hay algunos comandos que pueden ayudarle a depurar.

- `helm lint` es su herramienta principal para verificar que su chart sigue las
  mejores prácticas
- `helm template --debug` permite probar el renderizado de las plantillas del chart
  localmente.
- `helm install --dry-run --debug` también renderizará su chart localmente sin
  instalarlo, pero además verificará si hay recursos en conflicto que ya están
  ejecutándose en el clúster. Usar `--dry-run=server` también ejecutará cualquier
  `lookup` en su chart contra el servidor.
- `helm get manifest`: Esta es una buena manera de ver qué plantillas están
  instaladas en el servidor.

Cuando su YAML no se puede analizar, pero desea ver qué se genera, una forma
fácil de recuperar el YAML es comentar la sección problemática en la plantilla,
y luego volver a ejecutar `helm install --dry-run --debug`:

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

Lo anterior se renderizará y devolverá con los comentarios intactos:

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

Esto proporciona una forma rápida de ver el contenido generado sin que los
errores de análisis de YAML interfieran.
