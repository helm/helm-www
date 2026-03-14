---
title: Controle de Acesso Baseado em Funções
description: Discute a criação e formatação de recursos RBAC em manifestos de Chart.
sidebar_position: 8
---

Esta parte do guia de boas práticas discute a criação e formatação de recursos
RBAC em manifestos de chart.

Os recursos RBAC são:

- ServiceAccount (com namespace)
- Role (com namespace)
- ClusterRole
- RoleBinding (com namespace)
- ClusterRoleBinding

## Configuração YAML

A configuração de RBAC e ServiceAccount deve ser feita em chaves separadas. São
conceitos distintos. Separá-los no YAML deixa essa distinção mais clara.

```yaml
rbac:
  # Especifica se os recursos RBAC devem ser criados
  create: true

serviceAccount:
  # Especifica se uma ServiceAccount deve ser criada
  create: true
  # O nome da ServiceAccount a ser usada.
  # Se não definido e create for true, um nome é gerado usando o template fullname
  name:
```

Esta estrutura pode ser estendida para charts mais complexos que requerem
múltiplas ServiceAccounts.

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

## Recursos RBAC Devem Ser Criados por Padrão

`rbac.create` deve ser um valor booleano que controla se os recursos RBAC são
criados. O padrão deve ser `true`. Usuários que desejam gerenciar os controles
de acesso RBAC por conta própria podem definir este valor como `false` (nesse
caso, veja abaixo).

## Usando Recursos RBAC

`serviceAccount.name` deve ser definido como o nome da ServiceAccount a ser
usada pelos recursos com controle de acesso criados pelo chart. Se
`serviceAccount.create` for true, então uma ServiceAccount com este nome deve
ser criada. Se o nome não for definido, então um nome é gerado usando o template
`fullname`. Se `serviceAccount.create` for false, então ela não deve ser criada,
mas ainda deve ser associada aos mesmos recursos para que recursos RBAC criados
manualmente posteriormente que a referenciem funcionem corretamente. Se
`serviceAccount.create` for false e o nome não for especificado, então a
ServiceAccount padrão é usada.

O seguinte template auxiliar deve ser usado para a ServiceAccount.

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
