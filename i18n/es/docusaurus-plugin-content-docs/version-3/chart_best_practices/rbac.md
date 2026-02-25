---
title: Control de Acceso Basado en Roles
description: Discute la creación y formato de recursos RBAC en manifiestos de Charts.
sidebar_position: 8
---

Esta parte de la Guía de Mejores Prácticas cubre la creación y formato de
recursos RBAC en manifiestos de charts.

Los recursos RBAC son:

- ServiceAccount (con namespace)
- Role (con namespace)
- ClusterRole
- RoleBinding (con namespace)
- ClusterRoleBinding

## Configuración YAML

La configuración de RBAC y ServiceAccount debe realizarse bajo claves separadas.
Son conceptos distintos. Separar estos dos conceptos en el YAML los desambigua
y lo hace más claro.

```yaml
rbac:
  # Specifies whether RBAC resources should be created
  create: true

serviceAccount:
  # Specifies whether a ServiceAccount should be created
  create: true
  # The name of the ServiceAccount to use.
  # If not set and create is true, a name is generated using the fullname template
  name:
```

Esta estructura puede extenderse para charts más complejos que requieren
múltiples ServiceAccounts.

```yaml
someComponent:
  serviceAccount:
    create: true
    name:
anotherComponent:
  serviceAccount:
    create: true
    name:
```

## Los Recursos RBAC Deben Crearse por Defecto

`rbac.create` debe ser un valor booleano que controle si se crean los recursos
RBAC. El valor por defecto debe ser `true`. Los usuarios que deseen gestionar
los controles de acceso RBAC por sí mismos pueden establecer este valor a `false`
(en cuyo caso, consulte la sección siguiente).

## Uso de Recursos RBAC

`serviceAccount.name` debe establecerse con el nombre del ServiceAccount que
usarán los recursos creados por el chart.

- Si `serviceAccount.create` es true, se debe crear un ServiceAccount con este
  nombre. Si el nombre no está establecido, se genera uno usando la plantilla
  `fullname`.
- Si `serviceAccount.create` es false, no se debe crear el ServiceAccount, pero
  aún debe asociarse con los mismos recursos para que los recursos RBAC creados
  manualmente posteriormente funcionen correctamente.
- Si `serviceAccount.create` es false y el nombre no está especificado, se usa
  el ServiceAccount por defecto.

La siguiente plantilla auxiliar puede usarse para el ServiceAccount.

```yaml
{{/*
Create the name of the service account to use
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
```
