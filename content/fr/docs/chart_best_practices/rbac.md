---
title: "Role-Based Access Control"
description: "Création et formatage des ressources RBAC dans les manifests de Chart."
weight: 8
---

Cette partie du Guide des Bonnes Pratiques discute de la création et du formatage des ressources RBAC dans les manifests de chart.

Les ressources RBAC sont :

- ServiceAccount (namespacé)
- Role (namespacé)
- ClusterRole
- RoleBinding (namespacé)
- ClusterRoleBinding

## Configuration YAML

RBAC and ServiceAccount configuration should happen under separate keys. They
are separate things. Splitting these two concepts out in the YAML disambiguates
them and makes this clearer.

```yaml
rbac:
  # Précise si les ressources RBAC doivent être créées
  create: true

serviceAccount:
  # Précise si un ServiceAccount doit être créé
  create: true
  # Le nom du ServiceAccount à utiliser
  # Si ce n'est pas défini et que la création est activée, un nom est généré en utilisant le nom complet du modèle.
  name:
```

Cette structure peut être étendue pour des charts plus complexes qui nécessitent plusieurs ServiceAccounts.

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

## Les ressources RBAC devraient être créées par défaut 

`rbac.create` devrait être une valeur booléenne contrôlant la création des ressources RBAC. La valeur par défaut devrait être `true`. Les utilisateurs qui souhaitent gérer les contrôles d'accès RBAC eux-mêmes peuvent définir cette valeur sur `false` (voir ci-dessous dans ce cas).

## Utilisation des ressources RBAC

`serviceAccount.name` doit être défini sur le nom du ServiceAccount à utiliser par les ressources contrôlées par les accès créées par le chart. Si `serviceAccount.create` est vrai, alors un ServiceAccount avec ce nom doit être créé. Si le nom n'est pas défini, un nom est généré en utilisant le modèle `fullname`. Si `serviceAccount.create` est faux, le ServiceAccount ne doit pas être créé, mais il doit néanmoins être associé aux mêmes ressources afin que les ressources RBAC créées manuellement qui le référencent fonctionnent correctement. Si `serviceAccount.create` est faux et que le nom n'est pas spécifié, le ServiceAccount par défaut est utilisé.

Le modèle d'aide suivant devrait être utilisé pour le ServiceAccount :

```yaml
{{/*
Créer le nom du compte de service à utiliser
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
```
