---
title: "Helm installieren"
description: "Lernen Sie wie man Helm installiert und zum Laufen kriegt."
sidebar_position: 2
---

Diese Anleitung zeigt, wie Helm CLI zu installieren ist. Helm kann sowohl
vom Quellcode als auch vorkompilierten Binaries installiert werden.

## Vom Helm Projekt

Das Helm Projekt stellt zwei Wege zum Beziehen und Installieren von Helm zur
Verfügung. Dies sind die offiziellen Methoden, um Helm Versionen zu bekommen.
Zusätzlich zu dem stellt die Helm Gemeinschaft Methoden zur Installation
mit verschiedenen Paketmanagern zur Verfügung. Die Installation mit diesen
Methoden können am Ende der Anleitung zu den offiziellen Methoden gelesen 
werden.

### Von Binary Versionen

Jede [Version](https://github.com/helm/helm/releases) von Helm stellt Binary
Versionen für verschiedene Betriebssysteme zur Verfügung. Diese Binary Versionen
kann man herunterladen und installieren.

1. Laden Sie die [gewünschte Version](https://github.com/helm/helm/releases) herunter
2. Entpacken Sie diese (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Finden Sie das Helm Binary im entpackten Verzeichnis und verschieben es zum
   gewünschten Ziel (`mv linux-amd64/helm /usr/local/bin/helm`)

Von dort aus sollten Sie in der Lage sein, das Programm aufzurufen und ein
[erstes Repo hinzuzufügen](/intro/quickstart.md#initialize-a-helm-chart-repository):
`helm help`.

**Hinweis:** In den automatisierten Tests von Helm wird nur die Version von
Linux AMD64 beim Bau durch GitHub Actions berücksichtig. Das Testen von anderen
Betriebssystemen liegt in der Zuständigkeit der Gemeinschaft.

### Von einem Script

Helm hat ein Installations-Script, mit der automatisch die neueste Version
bezogen und [lokal installiert wird](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Sie können dieses Script aufrufen und lokal ausführen. Es ist gut dokumentiert,
so dass Sie es lesen und gut verstehen können, bevor Sie es ausführen.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Ja, Sie können auch `curl
https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` if
aufrufen, wenn Sie am Rande des Abgrunds leben.

## Durch einen Paket Manager

Die Helm Gemeinschaft stellt auch die Möglichkeit der Installation durch einen
Paket Managers des Betriebssystems zur Verfügung. Diese werden vom Helm Projekt
nicht unterstützt und haben den Status einer dritten Partei (3rd party software).

### Von Homebrew (macOS)

Mitglieder der Helm Gemeinschaft haben eine Form des Baus durch Homebrew zur
Verfügung gestellt. Diese Form ist generell immer aktuell.

```console
brew install helm
```

(Hinweis: Es gibt noch eine Form von emacs-helm, was ein anderes Projekt ist.)

### Von Chocolatey (Windows)

Mitglieder der Helm Gemeinschaft haben ein [Helm
Paket](https://chocolatey.org/packages/kubernetes-helm) gebaut mit
[Chocolatey](https://chocolatey.org/) beigetragen. Dieses Paket ist generell aktuell.

```console
choco install kubernetes-helm
```

### Von Winget (Windows)

Mitglieder der Helm Gemeinschaft haben ein [Helm
Paket](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) gebaut mit
[Winget](https://learn.microsoft.com/en-us/windows/package-manager/) beigetragen. Dieses Paket ist generell aktuell.

```console
winget install Helm.Helm
```

### Von Apt (Debian/Ubuntu)

Mitglieder der Helm Gemeinschaft haben ein [Helm
Paket](https://helm.baltorepo.com/stable/debian/) for Apt beigetragen. Dieses Paket
ist generell aktuell.

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Von Snap

Die [Snapcrafters](https://github.com/snapcrafters) Gemeinschaft unterstützt die Snap
Version vom [Helm Paket](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

### Von pkg (FreeBSD)

Mitglieder der Helm Gemeinschaft haben ein [Helm
Paket](https://www.freshports.org/sysutils/helm) gebaut für
[FreeBSD Ports Collection](https://man.freebsd.org/ports) beigetragen.
Dieses Paket ist generell aktuell.

```console
pkg install helm
```

### Entwickler Builds

Zusätzlich zu den Versionen können auch Entwicklerkopien von Helm installiert
werden.

### Von Canary Builds

"Canary" Builds sind Versionen der Helm Software gebaut vom letzten Master Zweig.
Das sind keine offizielle Versionen und sind möglichweise nicht stabil. Sie bieten
die Möglichkeit, die neuesten Funktionen zu testen.

Canary Helm Binaries sind gespeichert auf [get.helm.sh](https://get.helm.sh). Hier
sind die Links zu den üblichen Builds:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### Vom Quellcode (Linux, macOS)

Das Bauen von Helm vom Quellcode ist ein bischen komplizierter, aber es ist
die beste Möglichkeit, die letzte (vor-veröffentlichte) Version von Helm
zu testen.

Sie brauchen eine Go Arbeitsumgebung.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

Wenn erforderlich, werden die Abhängigkeiten heruntergeladen und zwischengespeichert.
Die Konfuguration wird validiert und Helm kompiliert nach `bin/helm`.

## Zusammenfassung

In den meisten Fällen ist die Installation einfach durch das Beziehen der vorkompilierten
Helm Binaries. Dieses Dokument deckt zusätzliche Fälle ab für Leute, die anspruchsvolle
Dinge mit Helm bewerkstelligen wollen.

Wenn Sie das Helm Programm erfolgreich installiert haben, können Sie zur Verwaltung
von Charts und [Hinzufügen des stabilen Repos](/intro/quickstart.md#initialize-a-helm-chart-repository)
wechseln.
