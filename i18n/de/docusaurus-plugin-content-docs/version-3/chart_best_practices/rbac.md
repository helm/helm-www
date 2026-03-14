---
title: Rollenbasierte Zugriffskontrolle
description: Behandelt die Erstellung und Formatierung von RBAC-Ressourcen in Chart-Manifesten.
sidebar_position: 8
---

Dieser Teil des Best-Practices-Leitfadens behandelt die Erstellung und Formatierung von
RBAC-Ressourcen in Chart-Manifesten.

RBAC-Ressourcen sind:

- ServiceAccount (Namespace-gebunden)
- Role (Namespace-gebunden)
- ClusterRole
- RoleBinding (Namespace-gebunden)
- ClusterRoleBinding

## YAML-Konfiguration

RBAC- und ServiceAccount-Konfiguration sollte unter separaten Schlüsseln erfolgen.
Es handelt sich um unterschiedliche Konzepte. Die Trennung in der YAML-Datei
verdeutlicht den Unterschied und macht die Konfiguration klarer.

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

Diese Struktur kann für komplexere Charts erweitert werden, die mehrere
ServiceAccounts benötigen.

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

## RBAC-Ressourcen sollten standardmäßig erstellt werden

`rbac.create` sollte ein boolescher Wert sein, der steuert, ob RBAC-Ressourcen
erstellt werden. Der Standardwert sollte `true` sein. Benutzer, die ihre
RBAC-Zugriffskontrollen selbst verwalten möchten, können diesen Wert auf `false`
setzen (siehe hierzu den Abschnitt unten).

## Verwendung von RBAC-Ressourcen

`serviceAccount.name` sollte auf den Namen des ServiceAccounts gesetzt werden,
der von den zugriffskontrollierten Ressourcen des Charts verwendet wird.

- Wenn `serviceAccount.create` auf `true` gesetzt ist, wird ein ServiceAccount mit
  diesem Namen erstellt. Wenn kein Name angegeben ist, wird ein Name anhand des
  `fullname`-Templates generiert.
- Wenn `serviceAccount.create` auf `false` gesetzt ist, wird der ServiceAccount
  nicht erstellt. Er sollte jedoch denselben Ressourcen zugeordnet werden, damit
  manuell erstellte RBAC-Ressourcen, die später darauf verweisen, korrekt funktionieren.
- Wenn `serviceAccount.create` auf `false` gesetzt ist und kein Name angegeben wurde,
  wird der Standard-ServiceAccount verwendet.

Verwenden Sie das folgende Helper-Template für den ServiceAccount:

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
