---
title: Fortgeschrittene Helm-Techniken
description: Erläutert verschiedene fortgeschrittene Funktionen für erfahrene Helm-Benutzer
sidebar_position: 9
---

Dieser Abschnitt erläutert verschiedene fortgeschrittene Funktionen und Techniken für die Verwendung von Helm.
Die Informationen in diesem Abschnitt richten sich an „fortgeschrittene Benutzer" von Helm, die
erweiterte Anpassungen und Manipulationen ihrer Charts und Releases durchführen möchten. Jede
dieser fortgeschrittenen Funktionen bringt eigene Kompromisse und Einschränkungen mit sich, daher muss jede
mit Sorgfalt und fundiertem Wissen über Helm eingesetzt werden. Oder anders ausgedrückt:
Denken Sie an das [Peter-Parker-Prinzip](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility).

## Post Rendering
Post Rendering gibt Chart-Installierern die Möglichkeit, gerenderte Manifeste manuell zu manipulieren,
zu konfigurieren und/oder zu validieren, bevor sie von Helm installiert werden.
Dies ermöglicht es Benutzern mit erweiterten Konfigurationsanforderungen, Tools wie
[`kustomize`](https://kustomize.io) zu verwenden, um Konfigurationsänderungen anzuwenden, ohne
ein öffentliches Chart forken zu müssen oder von Chart-Maintainern zu verlangen, jede einzelne
Konfigurationsoption für eine Software bereitzustellen. Es gibt auch Anwendungsfälle für
das Einbinden gemeinsamer Tools und Sidecars in Unternehmensumgebungen oder die Analyse
der Manifeste vor der Bereitstellung.

### Voraussetzungen
- Helm 3.1+

### Verwendung
Ein Post-Renderer kann jede ausführbare Datei sein, die gerenderte Kubernetes-Manifeste
über STDIN akzeptiert und gültige Kubernetes-Manifeste über STDOUT zurückgibt. Bei einem
Fehler sollte ein Exit-Code ungleich 0 zurückgegeben werden. Dies ist die einzige „API" zwischen den
beiden Komponenten. Sie ermöglicht große Flexibilität bei dem, was Sie mit Ihrem
Post-Render-Prozess tun können.

Ein Post-Renderer kann mit `install`, `upgrade` und `template` verwendet werden. Um einen
Post-Renderer zu verwenden, nutzen Sie das Flag `--post-renderer` mit einem Pfad zur
ausführbaren Renderer-Datei:

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

Wenn der Pfad keine Trennzeichen enthält, wird in $PATH gesucht, andernfalls
werden relative Pfade zu einem vollqualifizierten Pfad aufgelöst.

Wenn Sie mehrere Post-Renderer verwenden möchten, rufen Sie alle in einem Skript auf oder
kombinieren Sie sie in einem beliebigen Binary-Tool, das Sie erstellt haben. In Bash wäre dies so
einfach wie `renderer1 | renderer2 | renderer3`.

Sie können ein Beispiel für die Verwendung von `kustomize` als Post-Renderer
[hier](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render) sehen.

### Einschränkungen
Bei der Verwendung von Post-Renderern gibt es mehrere wichtige Punkte zu beachten.
Der wichtigste davon ist, dass bei Verwendung eines Post-Renderers alle Personen,
die dieses Release modifizieren, **denselben Renderer verwenden müssen**, um
reproduzierbare Builds zu gewährleisten. Diese Funktion wurde absichtlich so entwickelt, dass jeder Benutzer
den verwendeten Renderer wechseln oder die Verwendung eines Renderers beenden kann, aber dies
sollte bewusst geschehen, um versehentliche Änderungen oder Datenverlust zu vermeiden.

Ein weiterer wichtiger Hinweis betrifft die Sicherheit. Wenn Sie einen Post-Renderer verwenden,
sollten Sie sicherstellen, dass er aus einer zuverlässigen Quelle stammt (wie bei jeder
anderen beliebigen ausführbaren Datei). Die Verwendung von nicht vertrauenswürdigen oder nicht verifizierten Renderern wird NICHT
empfohlen, da sie vollen Zugriff auf gerenderte Templates haben, die oft
sensible Daten enthalten.

### Benutzerdefinierte Post-Renderer
Der Post-Render-Schritt bietet noch mehr Flexibilität bei Verwendung des Go SDK. Jeder
Post-Renderer muss nur das folgende Go-Interface implementieren:

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Weitere Informationen zur Verwendung des Go SDK finden Sie im [Go SDK-Abschnitt](#go-sdk).

## Go SDK
Helm 3 führte ein komplett umstrukturiertes Go SDK ein, das eine bessere Erfahrung beim
Erstellen von Software und Tools bietet, die Helm nutzen. Die vollständige Dokumentation finden Sie
im [Go SDK-Abschnitt](/sdk/gosdk.md).

## Speicher-Backends

Helm 3 hat den Standard-Speicherort für Release-Informationen auf Secrets im
Namespace des Releases geändert. Helm 2 speicherte Release-Informationen standardmäßig als
ConfigMaps im Namespace der Tiller-Instanz. Die folgenden Unterabschnitte
zeigen, wie verschiedene Backends konfiguriert werden. Diese Konfiguration basiert auf der
Umgebungsvariablen `HELM_DRIVER`. Sie kann auf einen der folgenden Werte gesetzt werden:
`[configmap, secret, sql]`.

### ConfigMap-Speicher-Backend

Um das ConfigMap-Backend zu aktivieren, müssen Sie die Umgebungsvariable
`HELM_DRIVER` auf `configmap` setzen.

Sie können sie in einer Shell wie folgt setzen:

```shell
export HELM_DRIVER=configmap
```

Wenn Sie vom Standard-Backend zum ConfigMap-Backend wechseln möchten, müssen Sie
die Migration selbst durchführen. Sie können Release-Informationen mit folgendem
Befehl abrufen:

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**PRODUKTIONSHINWEISE**: Die Release-Informationen enthalten den Inhalt von Charts und
Values-Dateien und können daher sensible Daten (wie
Passwörter, private Schlüssel und andere Anmeldedaten) enthalten, die vor
unbefugtem Zugriff geschützt werden müssen. Bei der Verwaltung von Kubernetes-Berechtigungen, beispielsweise mit
[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), ist es
möglich, breiteren Zugriff auf ConfigMap-Ressourcen zu gewähren, während der
Zugriff auf Secret-Ressourcen eingeschränkt bleibt. Zum Beispiel gewährt die standardmäßige [benutzerorientierte
Rolle](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
„view" Zugriff auf die meisten Ressourcen, aber nicht auf Secrets. Darüber hinaus können Secrets-Daten für
[verschlüsselte Speicherung](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
konfiguriert werden. Bitte beachten Sie dies, wenn Sie zum ConfigMap-Backend wechseln möchten, da
dies die sensiblen Daten Ihrer Anwendung offenlegen könnte.

### SQL-Speicher-Backend

Es gibt ein ***Beta***-SQL-Speicher-Backend, das Release-Informationen in einer SQL-Datenbank
speichert.

Die Verwendung eines solchen Speicher-Backends ist besonders nützlich, wenn Ihre Release-Informationen
mehr als 1 MB wiegen (in diesem Fall können sie aufgrund interner Beschränkungen im
zugrundeliegenden etcd-Schlüssel-Wert-Speicher von Kubernetes nicht in ConfigMaps/Secrets gespeichert werden).

Um das SQL-Backend zu aktivieren, müssen Sie eine SQL-Datenbank bereitstellen und die
Umgebungsvariable `HELM_DRIVER` auf `sql` setzen. Die Datenbankdetails werden mit der
Umgebungsvariablen `HELM_DRIVER_SQL_CONNECTION_STRING` festgelegt.

Sie können sie in einer Shell wie folgt setzen:

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> Hinweis: Derzeit wird nur PostgreSQL unterstützt.

**PRODUKTIONSHINWEISE**: Es wird empfohlen:
- Ihre Datenbank produktionsreif zu machen. Für PostgreSQL finden Sie weitere Details in der Dokumentation zur [Serveradministration](https://www.postgresql.org/docs/12/admin.html)
- [Berechtigungsverwaltung](/topics/permissions_sql_storage_backend.md) zu aktivieren, um
Kubernetes RBAC für Release-Informationen zu spiegeln

Wenn Sie vom Standard-Backend zum SQL-Backend wechseln möchten, müssen Sie
die Migration selbst durchführen. Sie können Release-Informationen mit folgendem
Befehl abrufen:

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
