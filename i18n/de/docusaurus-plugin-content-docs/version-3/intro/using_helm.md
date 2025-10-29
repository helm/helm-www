---
title: "Helm benutzen"
description: "Erklärt die Grundsätze zu Helm."
sidebar_position: 3
---

Diese Anleiting erklärt die Grundsätze zu Helm, um Pakete in Ihrem Kubernetes
Cluster zu verwalten. Es wird erwartet, dass Sie das Helm Programm bereits
[installiert](/intro/install.md) haben.

Wenn Sie nur daran interessiert, ein paar einfache Kommandos schnell zu lernen,
beginnen Sie mit der [Schnellstartanleitung](/intro/quickstart.md). 
Dieses Kapitel erklärt die speziellen Helm Kommandos und erklärt, wie 
Helm zu benutzen ist.

## Drei grosse Konzepte

Ein *Chart* ist ein Helm Paket. Es beinhaltet alle Resourcedefinitionen, die zur
Ausführung einer Applikation, eines Werkzeugs oder Dienstes im Kubernetes
Cluster erforderlich sind. Denken Sie an etwas wie ein Homebrew Formular für
Kubernetes, ein Apt dpkg oder eine Yum RPM Datei.

Ein *Repository* ist ein Platz, wo Charts gesammelt und gespeichert werden können.
Es ist wie Perl's [CPAN Archiv](https://www.cpan.org) oder die [Fedora Package
Database](https://src.fedoraproject.org/), aber für Kubernetes Pakete.

Ein(e) *Release/Version* ist eine Instanz von einem Chart, welches in einem
Kubernetes Cluster läuft. Ein Chart kann beliebig oft im selben Cluster
installiert werden. Und immer wenn es neu installiert wird, wird ein neues
_release_ erstellt. Denken Sie an ein MySQL Chart. Wenn Sie zwei laufende
Datenbanken in Ihrem Cluster haben möchten, können Sie dieses Chart zweimal
installieren. Jedes bekommt sein eigenes _release_, welches sich über seinen
eigenen _release_name_ identifiziert.

Mit diesem Konzept im Hinterkopf, können wir das Helm Konzept erklären wie:

Helm installiert _charts_ in Kubernetes, erstellt ein neues _release_ für jede
Installation. Und zur Suche nach neuen Charts, können Sie Helm Chart _repositories_ durchsuchen.

## 'helm search': Charts finden

Helm kommt mit einem mächtigen Suchkommando. Es kann zwei verschiedene Quelltypen suchen:

- `helm search hub` sucht [den Artifact Hub](https://artifacthub.io), welches
  Helm Charts von dutzenden unterschiedlichen Repositories listet.
- `helm search repo` sucht das Repositorie, welches Sie lokal in Ihrem Helm
  Programm hinzugefügt haben (mit `helm repo add`). Diese Suche wird über lokale Daten
  durchgeführt, ohne das eine öffentliche Netzwerkverbindung notwendig ist.

Sie können öffentlich verfügbare Charts finden mit dem Kommando `helm search hub`:

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

Die obige Suche nach allen `wordpress` Charts auf Artifact Hub.

Ohne Filter zeigt `helm search hub` alle verfügbaren Charts.

Wenn Sie `helm search repo` benutzen, können Sie alle Namen von Charts
in Repositories finden, die Sie schon hinzugefügt haben:

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Die Helm Suche benutzt ein Fuzzy String Matching Algorithmus, wodurch
Sie Teile von Wortphrasen eingeben können:

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Sie Suche ist ein guter Weg, um alle verfügbaren Pakete zu finden. Wennimmer
Sie ein Paket gefunden haben, können Sie es mit `helm install` installieren.

## 'helm install': Ein Paket installieren

Benutzen Sie das `helm install` Kommando, um ein neues Helm Paket zu installieren.
Am einfachsten hat das Kommando zwei Argumente: Einen Versionsnamen, den Sie gewählt
haben und den Namen des Charts, dass Sie installieren möchten.

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Jetzt ist das `wordpress` Chart installiert. Beachten Sie dass das Installieren
eines Charts ein neues _release_ Objekt erstellt. Die Version oben hat den Namen
`happy-panda`. (Wenn Sie möchten, dass Helm einen Namen für Sie generiert, lassen
Sie den Versionsnamen offen und geben den Parameter `--generate-name` an.)

Währen der Installation gibt das `helm` Programm nützzliche Informationen aus wie
die erstellten Resourcen, der Status der Version und falls vorhanden zusätzliche
Konfigurationsschritte, die Sie durchführen können.

Helm wartet nicht, bis alle Resourcen laufen. Viele Charts brauchen Docker Images
mit einer Grösse von 600 MB und brauchen länger, um im Cluster installiert zu
werden.

Um auf dem Laufenden zu bleiben oder um Konfigurationsinformationen nochmal zu lesen,
können Sie `helm status` benutzen:

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Die Informationen oben zeigen den Status der letzten Version.

### Anpassen des Charts vor der Installation

Bisher nutzen wir nur die Standardoptionen der Konfiguration eines Charts.
Öfters will man aber das Chart anpassen.

Um zu sehen, welche Konfigurationsoptionen ein Chart bietet, nutzen Sie `helm show values`:

```console
$ helm show values bitnami/wordpress
## Global Docker image parameters
## Please, note that this will override the image parameters, including dependencies, configured to use the global value
## Current available global Docker image parameters: imageRegistry and imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass

## Bitnami WordPress image version
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/
##
image:
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

Sie können alle Einstellungen in einer YAML formatierten Datei überschreiben und
dann bei der Installation angeben.

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

Das oben wird eine Standard MariaDB mit dem Benutzer `user0` erstellen, ihm
Rechte auf der neu erstellten Datenbank `user0db` einrichten, aber alle anderen
Werte auf dem Standard des Charts belassen.

Es gibt zwei Wege, um Konfigurationsdaten während der Installation anzupassen:

- `--values` (or `-f`): Gibt eine YAML Datei mit Werten zum Überschreiben an. Das
  kann beliebig oft gemacht werden, die am weitesten rechts benutzte Datei wird
  den Wert bestimmen.
- `--set`: Gibt Überschreibungen auf der Kommandozeile an.

Wenn beide verwendet werden, `--set` Werte werden in `--values` mit einer höheren
Gewichtung verschmolzen. Überschreibungen mit `--set` sind in einer ConfigMap persistiert.
Werte die mit `--set` angegeben wurden, können in einer Version mit `helm get
values <release-name>` ausgegeben werden. Werte, die mit `--set` angegeben wurden,
können mit dem Kommando `helm upgrade` mit `--reset-values` gelöscht werden.

#### Format und Limitierungen von `--set`

Die `--set` Option hat null oder mehrere Name/Wert Paare. Am einfachsten ist es zu
benutzen wie: `--set name=value`. Die YAML Syntax ist:

```yaml
name: value
```

Mehere Werte werden separiert mit `,` Zeichen. Aus `--set a=b,c=d` wird:

```yaml
a: b
c: d
```

Mehr komplextere Beschreibungen werden auch unterstützt. Zum Beispiel `--set outer.inner=value`
wird übersetzt in:

```yaml
outer:
  inner: value
```

Listen können mit geschweiften Klammern `{` und `}` angegeben werden. Zum Beispiel `--set
name={a, b, c}` wird übersetzt in:

```yaml
name:
  - a
  - b
  - c
```

Mit Helm 2.5.0 ist es möglich, Listenwerte in einer Arrayindex-Syntax
anzugeben, Zum Beispiel `--set servers[0].port=80` wird:

```yaml
servers:
  - port: 80
```

Mehrere Werte können auf diesem Weg angebenen werden. Die Zeile `--set
servers[0].port=80,servers[0].host=example` wird:

```yaml
servers:
  - port: 80
    host: example
```

Manchmal brauchen Sie spezielle Zeichen in Ihrer `--set` Zeile. Sie können
Backslash zum Verstecken des Zeichens benutzen: `--set name=value1\,value2` wird:

```yaml
name: "value1,value2"
```

Genauso können Sie Punktsequenzen verstecken, die möglicherweise beim Parsen von Charts
in Annotations, Labels und Node Selectors mit der `toYaml` Funktion problematisc
werden könnten. Die Syntax für `--set nodeSelector."kubernetes\.io/role"=master`
wird:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Tief verzweigte Datenstrukturen können schwierig darzustellen sein mit `--set`. Chart Designer
sind angewiesen, die Benutzung von `--set` durch die Benutzung des Formats
der `values.yaml` Datei zu minimieren.
(Lesen Sie mehr dazu in [Values Files](/chart_template_guide/values_files.md)).

### Mehr Installationsmethoden

Das `helm install` Kommando kann von verschiedenen Quellen installieren:

- Ein Chart Repository (wie wir es oben gesehen haben)
- Ein lokales Chart Archiv (`helm install foo foo-0.1.1.tgz`)
- Ein ungepacktes Chart Verzeichnis (`helm install foo path/to/foo`)
- Eine URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' und 'helm rollback': Eine Version aktualisieren und die Wiederherstellung nach einem Fehler

Wenn eine neue Version von einem Chart installiert ist oder wenn Sie Änderungen
an der Konfiguration durchführen möchten, können Sie das
`helm upgrade` Kommando verwenden.

Eine Aktualisierung nimmt eine bestehende Version und aktualisiert sie nach
den gegebenen Informationen, die Sie bereitstellen. Da Kubernetes Charts
sehr gross und komplex sein können, probiert Helm die wenigst invasive
Aktualisierung. Es wird nur Dinge aktualisieren, die sich seit der letzten
Version wirklich geändert haben.

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

In dem Fall oben wird die `happy-panda` Version mit dem selben Chart aber mit einer
neuen YAML Datei aktualisiert:

```yaml
mariadb.auth.username: user1
```

Wir können `helm get values` benutzen, um zu sehen, ob die Änderungen durchgeführt wurden.

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

Das `helm get` Kommando ist ein nützliches Werkzeug, um nach der Version in Ihrem
Cluster zu schauen. Wie wir oben sehen können, sieht es so aus, als wenn unsere
neuen Werte von `panda.yaml` im Cluster installiert wurden sind.

Jetzt, wenn etwas ungeplantes in dieser Version passiert ist, ist es einfach zu
einer vorherigen Version mit dem Kommando `helm rollback [RELEASE] [REVISION]`
zu wechseln.


```console
$ helm rollback happy-panda 1
```

Dies rollt unsere happy-panda Installation zur allerersten Version zurück. Bei jeder
Installation, Aktualisierung oder Zurückrollen wird die Revisionsnummer um 1 erhöht.
Die erste Revisionsnummer ist immer die 1. Und mit dem Kommando `helm history [RELEASE]`
sehen wir die Historie zu jeder Version.

## Hilfreiche Optionen für Installation/Aktualisierung/Zurückrollen

Es gibt sehr viele hilfreiche Optionen, um das Verhalten von Helm bei der Installation,
der Aktualisierung oder dem Zurückrollen zu ändern. Bitte beachten Sie, dass das keine
vollständige Liste der Optionen ist. Zur vollen Beschreibung rufen Sie einfach
`helm <command> --help` auf.

- `--timeout`: Ein Wert der [Go Wartezeit](https://golang.org/pkg/time/#ParseDuration),
  um auf den Abschluss eines Kubernetes Kommandos zu warten. Der Standardwert ist `5m0s`.
- `--wait`: Wartet bis alle Pods im Status Running sind, PVCs gebunden sind und
  Deployments eine minimale Verfügbarkeit besitzen (`Desired` minus `maxUnavailable`),
  Services eine IP-Adresse haben (Ingress wenn es ein `LoadBalancer` ist), bevor
  die ganze Version als erfolgreich installiert markiert wird. Wenn das Timeout `--timeout`
  erreicht wird, wird die Version als `FAILED` markiert. Hinweis: In Deployments in denen
  `replicas` auf 1 und `maxUnavailable` als Teil der Aktualisierungsstrategie gesetzt ist,
  wird `--wait` den Status fertig melden, wenn es den minimalen Pod als fertig gesehen hat.
- `--no-hooks`: Dies übergeht Hooks für dieses Kommando
- `--recreate-pods` (nur verfügbar bei `upgrade` und `rollback`): Diese Option wird
  alle Pods neu erstellen (ausser den Pods in diesem Deployment). (VERALTET in Helm 3)

## 'helm uninstall': Eine Version deinstallieren

Benutzen Sie das Kommando `helm uninstall`, wenn es an der Zeit ist, eine Version vom
Cluster zu deinstallieren: 

```console
$ helm uninstall happy-panda
```

Das wird die Version vom Cluster löschen. Sie können die derzeit im Cluster installierte
Version mit dem Kommando `helm list` sehen:

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

Von der Ausgaben oben sehen wir, dass die Version `happy-panda` deinstalliert
wurde.

In einer vorherigen Version von Helm wurde sich immer das Löschen einer Version
gemerkt. In Helm 3 wird dieser Eintrag auch gelöscht.
Wenn Sie diese Löscheinträge behalten wollen, benutzen Sie beim Deinstallieren
--keep-history`. Die Benutzung von `helm list --uninstalled` wird nur die Versionen
zeigen, die mit der Option `--keep-history` gelöscht wurden.

Die Option `helm list --all` zeigt alle Versionseinträge, die Helm aufgehoben hat,
incl. fehlerhafte und gelöschte Werte (wenn `--keep-history` verwendet wurde):

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

Beachten Sie, dass es durch die standardmässig gelöschten Versionen es nicht mehr
möglich ist, eine nicht installierte Resource zurückzurollen.

## 'helm repo': Arbeiten mit Repositories

Helm 3 wird nicht mehr mit einem Standard Chart Verzeichnis ausgeliefert. Das
`helm repo` Gruppenkommando stellt Kommandos zum Hinzufügen, Auflisten und Löschen
von Verzeichnissen zur Verfügung.

Mit dem Kommando `helm repo list` können Sie sehen, welche Verzeichnisse konfiguriert sind:

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

Und neue Verzeichnisse können hinzugefügt werden mit `helm repo add`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Weil Sich Chart Repositories ständig ändern, sollten Sie an dieser Stelle
sicherstellen, dass Ihr Helm Programm mit dem Kommando `helm repo update`
aktuell ist.

Repositories können mit `helm repo remove` gelöscht werden.

## Ihr eigenes Chart erstellen

Das [Chart Entwicklungshandbuch](/topics/charts.md) erklärt,
wie Sie Ihr eigenes Chart entwickeln können. Aber Sie können auch schnell starten
mit dem Kommando `helm create`:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Nun gibt es ein Chart in `./deis-workflow`. Sie können es editieren und Ihre 
eigene Vorlage erstellen.

Nach dem Editieren können Sie das Format mit dem Kommando `helm lint` validieren.

Wenn es Zeit ist, ein Paket von diesem Chart für eine Distribution zu erstellen, können Sie das
Kommando `helm package` verwenden:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

Jetzt kann das Chart einfach installiert werden mit `helm install`:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

Chart Pakete können einfach in ein Repository geladen werden. Schauen Sie
die Dokumentation für [Helm Chart Repositories](/topics/chart_repository.md) für mehr Details.

## Zusammenfassung

Dieses Kapitel behandelte die Verwendung des Basismodels vom `helm` Programm,
incl. Suchen, Installieren, Aktualisieren und Uninstallieren. Es wurden auch
hilfreiche Zusatzkommandos besprochen wie `helm status`, `helm get` und `helm repo`.

Für mehr Informationen zu diesen Kommandos, schauen Sie in die eingebaute Hilfe:
`helm help`.

Im [nächsten Kapitel](/howto/charts_tips_and_tricks.md) werden wir
einen Blick in die Entwicklung von Charts.
