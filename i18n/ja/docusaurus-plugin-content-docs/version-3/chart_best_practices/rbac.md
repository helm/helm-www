---
title: ロールベースアクセス制御
description: Chart マニフェストにおける RBAC リソースの作成とフォーマットについて解説します。
sidebar_position: 8
---

ベストプラクティスガイドのこの部分では、chart マニフェストにおける RBAC リソースの作成とフォーマットについて解説します。

RBAC リソースには以下が含まれます:

- ServiceAccount（namespace スコープ）
- Role（namespace スコープ）
- ClusterRole
- RoleBinding（namespace スコープ）
- ClusterRoleBinding

## YAML の設定

RBAC と ServiceAccount の設定は、別々のキーで管理してください。
これらは異なる概念であり、YAML 内で分離することで明確になります。

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

この構造は、複数の ServiceAccount を必要とするより複雑な chart にも拡張できます。

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

## RBAC リソースはデフォルトで作成する

`rbac.create` は RBAC リソースを作成するかどうかを制御するブール値です。
デフォルト値は `true` にしてください。
RBAC のアクセス制御を自分で管理したいユーザーは、この値を `false` に設定できます（その場合は以下を参照）。

## RBAC リソースの使用

`serviceAccount.name` には、chart が作成するアクセス制御対象リソースで使用する ServiceAccount の名前を設定します。

- `serviceAccount.create` が true の場合: この名前で ServiceAccount が作成されます。名前が設定されていない場合は、`fullname` テンプレートを使用して名前が生成されます。
- `serviceAccount.create` が false の場合: ServiceAccount は作成されませんが、同じリソースに関連付けられたままにしておく必要があります。これにより、後で手動で作成した RBAC リソースがこの ServiceAccount を参照しても正しく機能します。名前が指定されていない場合は、デフォルトの ServiceAccount が使用されます。

ServiceAccount には以下のヘルパーテンプレートを使用してください。

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
