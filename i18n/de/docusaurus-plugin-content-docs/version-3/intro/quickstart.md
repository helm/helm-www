---
title: "Schnellstartanleitung"
description: "Wie mit Helm anfangen, incl. Anleitungen für Distributionen, FAQs und Plugins."
sidebar_position: 1
---

Mit dieser Anleitung können Sie schnell mit Helm starten.

## Vorbedingungen

Die folgenden Vorbedingungen sind erforderlich, um Helm erfolgreich und sicher
zu nutzen.

1. Ein Kubernetes Cluster
2. Entscheiden, welche Sicherheitskonfigurationen zur Installation verwendet werden
3. Installieren und konfigurieren von Helm.

### Installieren von Kubernetes oder Zugriff auf einen Cluster haben

- Sie müssen Kubernetes installiert haben. Für die letzte Version von Helm
  empfehlen wir die letzte stabile Version von Kubernetes, was in den meisten
  Fällen die zweitletzte Unterversion ist.
- Sie sollten eine lokale Kopie eines konfigurierten kubectl haben.

Sehen Sie die [Helm Version Support Policy](https://helm.sh/docs/topics/version_skew/)
für die maximal unterstützte Version zwischen Helm und Kubernetes.

## Installieren von Helm

Laden Sie eine Binary Version von Helm herunter. Sie können Werkzeuge verwenden wie homebrew
oder schauen Sie auf [die offizielle Versionsseite](https://github.com/helm/helm/releases).

Für mehr Details oder weitere Optionen schauen Sie in die [Installationsanleitung](/intro/install.md).

## Initialisieren eines Helm Chart Repository {#initialize-a-helm-chart-repository}

Wenn Sie Helm installiert haben, können Sie ein Chart Repository hinzufügen. Schauen Sie nach
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) für verfügbare Helm Chart
Repositories.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Einmal installiert können Sie die installierbaren Charts auflisten:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## Installieren eines Beispiel Chart

Um ein Chart zu installieren, können Sie das `helm install` Kommando verwenden.
Helm kennt verschieden Wege, um ein Chart zu finden und zu installieren, aber
am einfachsten ist die Verwendung des `bitnami` Charts.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

Im Beispiel oben wurde das `bitnami/mysql` Chart versioniert und der Name
der neuen Version ist `mysql-1612624192`.

Sie kriegen eine grobe Idee über die Funktionen dieses MySQL Charts mit dem
Kommando `helm show chart bitnami/mysql`. Oder dem Kommando `helm show all bitnami/mysql`,
um alle Informationen über das Chart zu bekommen.

Wennimmer Sie ein Chart installieren, wird eine neue Version erstellt. So kann
ein Chart beliebig oft im selben Cluster installiert und unabhängig verwaltet und
aktualisiert werden.

Das `helm install` Kommando ist ein sehr mächtiges Kommand mit vielen Möglichkeiten.
Um mehr darüber zu lernen, schauen Sie ins [Helm Benutzerhandbuch](/intro/using_helm.md)

## Mehr über Versionen lernen

Es ist einfach zu sehen, was durch Helm versioniert wurde:

```console
$ helm ls
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

Die `helm list` Funktion wird Ihnen eine Liste auf alle installierten Versionen zeigen.

## Eine Version deinstallieren

Um eine Version zu deinstallieren, benutzen Sie das `helm uninstall` Kommando:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

Das wird `mysql-1612624192` von Kubernetes deinstallieren, was wiederum alle
Resourcen löscht, die mit dieser Version verbunden sind, genauso wie die Versionshistorie.

Wenn die Option `--keep-history` verwendet wird, bleibt die Versionshistorie erhalten.
So können Sie Informationen über diese Version erhalten:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Weil Helm Ihre Versionen nachverfolgt, nachdem Sie es deinstalliert hat, können Sie
die Historie des Clusters auditieren und immer eine gelöschte Version zurückholen
(mit `helm rollback`).

## Die Hilfe lesen

Um mehr über die verfügbaren Helm Kommandos zu lesen, benutzen Sie `helm help` oder
tippen das Kommando gefolgt von einem `-h` ein:

```console
$ helm get -h
```
