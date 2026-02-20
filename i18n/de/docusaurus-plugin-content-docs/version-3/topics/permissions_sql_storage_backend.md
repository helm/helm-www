---
title: Berechtigungsverwaltung für das SQL-Speicher-Backend
description: Erfahren Sie, wie Sie Berechtigungen bei Verwendung des SQL-Speicher-Backends einrichten.
---

Dieses Dokument bietet eine Anleitung zur Einrichtung und Verwaltung von
Berechtigungen bei Verwendung des SQL-Speicher-Backends.

## Einführung

Helm nutzt für die Berechtigungsverwaltung die RBAC-Funktion von Kubernetes. Bei
Verwendung des SQL-Speicher-Backends können Kubernetes-Roles jedoch nicht verwendet
werden, um zu bestimmen, ob ein Benutzer auf eine bestimmte Ressource zugreifen darf.
Dieses Dokument zeigt, wie Sie diese Berechtigungen erstellen und verwalten.

## Initialisierung

Beim ersten Verbindungsaufbau der Helm CLI mit Ihrer Datenbank prüft der Client,
ob diese bereits initialisiert wurde. Falls nicht, führt er die notwendige
Einrichtung automatisch durch. Diese Initialisierung erfordert Administratorrechte
auf dem public-Schema oder mindestens folgende Berechtigungen:

* eine Tabelle erstellen
* Berechtigungen auf dem public-Schema vergeben

Nachdem die Migration auf Ihrer Datenbank ausgeführt wurde, können alle anderen
Rollen den Client nutzen.

## Berechtigungen für einen Nicht-Administrator in PostgreSQL vergeben

Zur Verwaltung von Berechtigungen nutzt der SQL-Backend-Treiber die
[RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html)-Funktion
(Row-Level Security, Sicherheit auf Zeilenebene) von PostgreSQL. RLS ermöglicht
es allen Benutzern, aus derselben Tabelle zu lesen und in diese zu schreiben,
ohne dabei auf dieselben Zeilen zugreifen zu können, sofern ihnen dies nicht
explizit erlaubt wurde. Standardmäßig erhält jede Rolle, der nicht explizit die
entsprechenden Rechte gewährt wurden, eine leere Liste bei Ausführung von
`helm list` und kann keine Ressourcen im Cluster abrufen oder ändern.

So gewähren Sie einer bestimmten Rolle Zugriff auf spezifische Namespaces:

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

Dieser Befehl gewährt der Rolle `role` die Berechtigung, alle Ressourcen zu lesen
und zu schreiben, die die Bedingung `namespace = 'default'` erfüllen. Nach dem
Erstellen dieser Policy kann der Benutzer, der im Namen der Rolle `role` mit der
Datenbank verbunden ist, alle Releases im Namespace `default` bei Ausführung von
`helm list` sehen sowie diese bearbeiten und löschen.

Berechtigungen lassen sich mit RLS granular verwalten. So können Sie den Zugriff
anhand der verschiedenen Tabellenspalten einschränken:
* key
* type
* body
* name
* namespace
* version
* status
* owner
* createdAt
* modifiedAt
