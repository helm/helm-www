---
title: Contrôle d'accès basé sur les rôles
description: Traite de la création et du formatage des ressources RBAC dans les manifestes de chart.
sidebar_position: 8
---

Cette partie du guide des bonnes pratiques traite de la création et du formatage des
ressources RBAC dans les manifestes de chart.

Les ressources RBAC sont :

- ServiceAccount (namespaced)
- Role (namespaced)
- ClusterRole
- RoleBinding (namespaced)
- ClusterRoleBinding

## Configuration YAML

La configuration de RBAC et de ServiceAccount doit se faire sous des clés séparées. Ce sont
des concepts distincts. Les séparer dans le YAML permet de les distinguer clairement.

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

Cette structure peut être étendue pour des charts plus complexes nécessitant plusieurs
ServiceAccounts.

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

## Les ressources RBAC doivent être créées par défaut

`rbac.create` doit être une valeur booléenne contrôlant si les ressources RBAC sont
créées. La valeur par défaut doit être `true`. Les utilisateurs qui souhaitent gérer eux-mêmes
les contrôles d'accès RBAC peuvent définir cette valeur à `false` (dans ce cas, voir ci-dessous).

## Utilisation des ressources RBAC

`serviceAccount.name` doit être défini avec le nom du ServiceAccount à utiliser
par les ressources soumises au contrôle d'accès créées par le chart.

- Si `serviceAccount.create` est true, un ServiceAccount avec ce nom doit être créé.
- Si le nom n'est pas défini, un nom est généré en utilisant le template `fullname`.
- Si `serviceAccount.create` est false, le ServiceAccount ne doit pas être créé, mais il doit
  tout de même être associé aux mêmes ressources afin que les ressources RBAC créées
  manuellement ultérieurement fonctionnent correctement.
- Si `serviceAccount.create` est false et que le nom n'est pas spécifié, le
  ServiceAccount par défaut est utilisé.

Le helper template suivant doit être utilisé pour le ServiceAccount.

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
