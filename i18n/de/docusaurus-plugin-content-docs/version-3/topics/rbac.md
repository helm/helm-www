---
title: Rollenbasierte Zugriffskontrolle
description: Erläutert, wie Helm mit der rollenbasierten Zugriffskontrolle (RBAC) von Kubernetes interagiert.
sidebar_position: 11
---

In Kubernetes ist es eine Best Practice, Benutzern oder anwendungsspezifischen
ServiceAccounts Rollen zuzuweisen, um sicherzustellen, dass Ihre Anwendung nur
innerhalb des vorgesehenen Geltungsbereichs agiert. Weitere Informationen zu
ServiceAccount-Berechtigungen finden Sie in der [offiziellen Kubernetes-Dokumentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions).

Seit Kubernetes 1.6 ist die rollenbasierte Zugriffskontrolle (RBAC) standardmäßig
aktiviert. Mit RBAC können Sie festlegen, welche Aktionstypen je nach Benutzer und
dessen Rolle in Ihrer Organisation erlaubt sind.

Mit RBAC können Sie:

- Administratoren privilegierte Operationen gewähren (z. B. das Erstellen
  clusterweiter Ressourcen wie neue Roles)
- die Fähigkeit eines Benutzers einschränken, Ressourcen (Pods, Persistent Volumes,
  Deployments) entweder in bestimmten Namespaces oder clusterweit zu erstellen
  (Resource Quotas, Roles, Custom Resource Definitions)
- die Fähigkeit eines Benutzers einschränken, Ressourcen entweder in bestimmten
  Namespaces oder clusterweit einzusehen.

Dieser Leitfaden richtet sich an Administratoren, die den Zugriff eines Benutzers
auf die Kubernetes-API einschränken möchten.

## Benutzerkonten verwalten

Alle Kubernetes-Cluster haben zwei Kategorien von Benutzern: von Kubernetes
verwaltete ServiceAccounts und normale Benutzer.

Normale Benutzer werden von einem externen, unabhängigen Dienst verwaltet. Ein
Administrator kann private Schlüssel verteilen, einen Benutzerspeicher wie Keystone
oder Google Accounts verwenden, oder sogar eine Datei mit Benutzernamen und
Passwörtern nutzen. Kubernetes verfügt nicht über Objekte, die normale
Benutzerkonten repräsentieren. Normale Benutzer können nicht über einen API-Aufruf
zum Cluster hinzugefügt werden.

Im Gegensatz dazu werden ServiceAccounts von der Kubernetes-API verwaltet. Sie sind
an bestimmte Namespaces gebunden und werden entweder automatisch vom API-Server oder
manuell durch API-Aufrufe erstellt. ServiceAccounts sind mit Anmeldeinformationen
verknüpft, die als Secrets gespeichert und in Pods gemountet werden. Dadurch können
Prozesse innerhalb des Clusters mit der Kubernetes-API kommunizieren.

API-Anfragen werden entweder einem normalen Benutzer oder einem ServiceAccount
zugeordnet, oder sie werden als anonyme Anfragen behandelt. Das bedeutet, dass
jeder Prozess innerhalb oder außerhalb des Clusters – ob ein Benutzer, der `kubectl`
auf einer Workstation eingibt, Kubelets auf Nodes oder Mitglieder der Control Plane –
sich beim API-Server authentifizieren muss oder als anonymer Benutzer behandelt wird.

## Roles, ClusterRoles, RoleBindings und ClusterRoleBindings

In Kubernetes können Benutzerkonten und ServiceAccounts nur Ressourcen einsehen und
bearbeiten, für die ihnen Zugriff gewährt wurde. Dieser Zugriff wird durch Roles und
RoleBindings gewährt. Roles und RoleBindings sind an einen bestimmten Namespace
gebunden und gewähren Benutzern die Fähigkeit, Ressourcen innerhalb dieses Namespace
einzusehen und/oder zu bearbeiten.

Auf Clusterebene heißen diese ClusterRoles und ClusterRoleBindings. Wenn Sie einem
Benutzer eine ClusterRole zuweisen, gewähren Sie ihm Zugriff auf das Einsehen
und/oder Bearbeiten von Ressourcen im gesamten Cluster. Dies ist auch erforderlich,
um Ressourcen auf Clusterebene (Namespaces, Resource Quotas, Nodes) einzusehen
und/oder zu bearbeiten.

ClusterRoles können über eine Referenz in einem RoleBinding an einen bestimmten
Namespace gebunden werden. Die Standard-ClusterRoles `admin`, `edit` und `view`
werden häufig auf diese Weise verwendet.

Es gibt einige ClusterRoles, die standardmäßig in Kubernetes verfügbar sind. Sie
sind für Endbenutzer gedacht und umfassen Super-User-Rollen (`cluster-admin`) sowie
Rollen mit granularerem Zugriff (`admin`, `edit`, `view`).

| Standard-ClusterRole | Standard-ClusterRoleBinding | Beschreibung
|----------------------|-----------------------------|--------------
| `cluster-admin`      | `system:masters`-Gruppe     | Erlaubt Super-User-Zugriff für alle Aktionen auf allen Ressourcen. Bei Verwendung in einem ClusterRoleBinding gewährt sie volle Kontrolle über jede Ressource im Cluster und in allen Namespaces. Bei Verwendung in einem RoleBinding gewährt sie volle Kontrolle über jede Ressource im Namespace des RoleBindings, einschließlich des Namespace selbst.
| `admin`              | Keine                       | Erlaubt Admin-Zugriff, vorgesehen für die Zuweisung innerhalb eines Namespace über ein RoleBinding. Bei Verwendung in einem RoleBinding erlaubt sie Lese-/Schreibzugriff auf die meisten Ressourcen in einem Namespace, einschließlich der Fähigkeit, Roles und RoleBindings innerhalb des Namespace zu erstellen. Sie erlaubt keinen Schreibzugriff auf Resource Quotas oder den Namespace selbst.
| `edit`               | Keine                       | Erlaubt Lese-/Schreibzugriff auf die meisten Objekte in einem Namespace. Sie erlaubt nicht das Einsehen oder Bearbeiten von Roles oder RoleBindings.
| `view`               | Keine                       | Erlaubt schreibgeschützten Zugriff auf die meisten Objekte in einem Namespace. Sie erlaubt nicht das Einsehen von Roles oder RoleBindings. Sie erlaubt nicht das Einsehen von Secrets, da dies eine Rechteausweitung ermöglichen würde.

## Den Zugriff eines Benutzerkontos mit RBAC einschränken

Nachdem wir die Grundlagen der rollenbasierten Zugriffskontrolle verstanden haben,
besprechen wir nun, wie ein Administrator den Zugriffsbereich eines Benutzers
einschränken kann.

### Beispiel: Einem Benutzer Lese-/Schreibzugriff auf einen bestimmten Namespace gewähren

Um den Zugriff eines Benutzers auf einen bestimmten Namespace einzuschränken, können
Sie entweder die Role `edit` oder `admin` verwenden. Wenn Ihre Charts Roles und
RoleBindings erstellen oder damit interagieren, sollten Sie die ClusterRole `admin`
verwenden.

Zusätzlich können Sie auch ein RoleBinding mit `cluster-admin`-Zugriff erstellen.
Die Gewährung von `cluster-admin`-Zugriff auf Namespace-Ebene gibt dem Benutzer
volle Kontrolle über jede Ressource im Namespace, einschließlich des Namespace
selbst.

Für dieses Beispiel erstellen wir einen Benutzer mit der Role `edit`. Erstellen
Sie zunächst den Namespace:

```console
$ kubectl create namespace foo
```

Erstellen Sie nun ein RoleBinding in diesem Namespace, das dem Benutzer die Role
`edit` zuweist.

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### Beispiel: Einem Benutzer Lese-/Schreibzugriff auf Clusterebene gewähren

Wenn ein Benutzer ein Chart installieren möchte, das clusterweite Ressourcen
installiert (Namespaces, Roles, Custom Resource Definitions usw.), benötigt er
clusterweiten Schreibzugriff.

Gewähren Sie dem Benutzer dafür entweder `admin`- oder `cluster-admin`-Zugriff.

Die Gewährung von `cluster-admin`-Zugriff gibt dem Benutzer Zugriff auf absolut
jede in Kubernetes verfügbare Ressource, einschließlich Node-Zugriff mit `kubectl
drain` und anderen administrativen Aufgaben. Es wird dringend empfohlen, dem
Benutzer stattdessen `admin`-Zugriff zu gewähren oder eine benutzerdefinierte
ClusterRole zu erstellen, die auf seine Bedürfnisse zugeschnitten ist.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### Beispiel: Einem Benutzer schreibgeschützten Zugriff auf einen bestimmten Namespace gewähren

Sie haben vielleicht bemerkt, dass es keine ClusterRole zum Einsehen von Secrets
gibt. Die ClusterRole `view` gewährt Benutzern aufgrund von Bedenken bezüglich
Rechteausweitung keinen Lesezugriff auf Secrets. Helm speichert Release-Metadaten
standardmäßig als Secrets.

Damit ein Benutzer `helm list` ausführen kann, muss er diese Secrets lesen können.
Dafür erstellen wir eine spezielle ClusterRole `secret-reader`.

Erstellen Sie die Datei `cluster-role-secret-reader.yaml` mit folgendem Inhalt:

```yaml
apiVersion: rbac.authorization.k8s.io/v1​
kind: ClusterRole​
metadata:​
  name: secret-reader​
rules:​
- apiGroups: [""]​
  resources: ["secrets"]​
  verbs: ["get", "watch", "list"]
```

Erstellen Sie dann die ClusterRole mit:

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

Sobald dies erledigt ist, können wir einem Benutzer Lesezugriff auf die meisten
Ressourcen gewähren und ihm dann Lesezugriff auf Secrets geben:

```console
$ kubectl create namespace foo

$ kubectl create rolebinding sam-view
    --clusterrole view \​
    --user sam \​
    --namespace foo

$ kubectl create rolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam \​
    --namespace foo
```

### Beispiel: Einem Benutzer schreibgeschützten Zugriff auf Clusterebene gewähren

In bestimmten Szenarien kann es vorteilhaft sein, einem Benutzer clusterweiten
Zugriff zu gewähren. Beispielsweise erfordert die API, dass der Benutzer
clusterweiten Lesezugriff hat, wenn er den Befehl `helm list --all-namespaces`
ausführen möchte.

Gewähren Sie dem Benutzer dafür sowohl `view`- als auch `secret-reader`-Zugriff
wie oben beschrieben, aber mit einem ClusterRoleBinding.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## Weitere Überlegungen

Die oben gezeigten Beispiele verwenden die Standard-ClusterRoles, die mit
Kubernetes bereitgestellt werden. Für eine feinere Kontrolle darüber, auf welche
Ressourcen Benutzer Zugriff erhalten, lesen Sie die [Kubernetes-Dokumentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) zum Erstellen
eigener benutzerdefinierter Roles und ClusterRoles.
