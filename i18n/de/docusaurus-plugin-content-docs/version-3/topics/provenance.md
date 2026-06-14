---
title: Helm-Provenienz und -Integrität
description: Beschreibt, wie Sie die Integrität und Herkunft eines Charts überprüfen können.
sidebar_position: 5
---

Helm verfügt über Provenienz-Werkzeuge, die Chart-Benutzern helfen, die Integrität und
Herkunft eines Pakets zu überprüfen. Mithilfe von branchenüblichen Werkzeugen, die auf
PKI, GnuPG und anerkannten Paketmanagern basieren, kann Helm Signaturdateien erstellen
und verifizieren.

## Überblick

Die Integrität wird durch den Vergleich eines Charts mit einem Provenienz-Datensatz
festgestellt. Provenienz-Datensätze werden in _Provenienz-Dateien_ gespeichert, die
zusammen mit einem gepackten Chart abgelegt werden. Wenn beispielsweise ein Chart
`myapp-1.2.3.tgz` heißt, lautet seine Provenienz-Datei `myapp-1.2.3.tgz.prov`.

Provenienz-Dateien werden beim Paketieren erstellt (`helm package --sign ...`) und
können von mehreren Befehlen geprüft werden, insbesondere `helm install --verify`.

## Der Workflow

Dieser Abschnitt beschreibt einen möglichen Workflow für die effektive Nutzung von
Provenienz-Daten.

Voraussetzungen:

- Ein gültiges PGP-Schlüsselpaar im Binärformat (nicht ASCII-armored)
- Das Kommandozeilenwerkzeug `helm`
- GnuPG-Kommandozeilenwerkzeuge (optional)
- Keybase-Kommandozeilenwerkzeuge (optional)

**Hinweis:** Falls Ihr privater PGP-Schlüssel ein Passwort hat, werden Sie bei allen
Befehlen, die die Option `--sign` unterstützen, zur Eingabe dieses Passworts
aufgefordert.

Das Erstellen eines neuen Charts funktioniert wie gewohnt:

```console
$ helm create mychart
Creating mychart
```

Wenn Sie bereit zum Paketieren sind, fügen Sie das Flag `--sign` zu `helm package`
hinzu. Geben Sie außerdem den Namen an, unter dem der Signaturschlüssel bekannt ist,
sowie den Schlüsselring, der den entsprechenden privaten Schlüssel enthält:

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**Hinweis:** Der Wert des Arguments `--key` muss ein Teilstring der `uid` des
gewünschten Schlüssels sein (in der Ausgabe von `gpg --list-keys`), zum Beispiel
der Name oder die E-Mail-Adresse.
**Der Fingerprint _kann nicht_ verwendet werden.**

**Tipp:** Für GnuPG-Benutzer befindet sich der geheime Schlüsselring in
`~/.gnupg/secring.gpg`. Mit `gpg --list-secret-keys` können Sie Ihre verfügbaren
Schlüssel auflisten.

**Warnung:** GnuPG v2 speichert Ihren geheimen Schlüsselring in einem neuen Format
`kbx` am Standardspeicherort `~/.gnupg/pubring.kbx`. Verwenden Sie bitte den
folgenden Befehl, um Ihren Schlüsselring in das alte gpg-Format zu konvertieren:

```console
$ gpg --export >~/.gnupg/pubring.gpg
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

An diesem Punkt sollten Sie sowohl `mychart-0.1.0.tgz` als auch
`mychart-0.1.0.tgz.prov` sehen. Beide Dateien sollten letztendlich in Ihr gewünschtes
Chart Repository hochgeladen werden.

Sie können ein Chart mit `helm verify` verifizieren:

```console
$ helm verify mychart-0.1.0.tgz
```

Eine fehlgeschlagene Verifizierung sieht so aus:

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

Um während der Installation zu verifizieren, verwenden Sie das Flag `--verify`.

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

Falls sich der Schlüsselring mit dem öffentlichen Schlüssel, der zum signierten Chart
gehört, nicht am Standardspeicherort befindet, müssen Sie möglicherweise mit
`--keyring PATH` auf den Schlüsselring verweisen, wie im Beispiel `helm package`.

Wenn die Verifizierung fehlschlägt, wird die Installation abgebrochen, bevor das
Chart überhaupt gerendert wird.

### Keybase.io-Anmeldedaten verwenden

Der Dienst [Keybase.io](https://keybase.io) erleichtert das Aufbauen einer
Vertrauenskette für eine kryptografische Identität. Keybase-Anmeldedaten können zum
Signieren von Charts verwendet werden.

Voraussetzungen:

- Ein konfiguriertes Keybase.io-Konto
- GnuPG lokal installiert
- Die `keybase`-CLI lokal installiert

#### Pakete signieren

Der erste Schritt besteht darin, Ihre Keybase-Schlüssel in Ihren lokalen
GnuPG-Schlüsselring zu importieren:

```console
$ keybase pgp export -s | gpg --import
```

Dies konvertiert Ihren Keybase-Schlüssel in das OpenPGP-Format und importiert ihn
dann lokal in Ihre `~/.gnupg/secring.gpg`-Datei.

Sie können dies mit `gpg --list-secret-keys` überprüfen.

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

Beachten Sie, dass Ihr geheimer Schlüssel eine Identifikationszeichenkette hat:

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

Dies ist der vollständige Name Ihres Schlüssels.

Als Nächstes können Sie ein Chart mit `helm package` paketieren und signieren. Stellen
Sie sicher, dass Sie mindestens einen Teil dieser Namenszeichenkette in `--key`
verwenden.

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

Als Ergebnis sollte der `package`-Befehl sowohl eine `.tgz`-Datei als auch eine
`.tgz.prov`-Datei erzeugen.

#### Pakete verifizieren

Sie können eine ähnliche Technik verwenden, um ein Chart zu verifizieren, das mit dem
Keybase-Schlüssel einer anderen Person signiert wurde. Angenommen, Sie möchten ein
Paket verifizieren, das von `keybase.io/technosophos` signiert wurde. Verwenden Sie
dazu das `keybase`-Werkzeug:

```console
$ keybase follow technosophos
$ keybase pgp pull
```

Der erste Befehl oben folgt dem Benutzer `technosophos`. Dann lädt `keybase pgp pull`
die OpenPGP-Schlüssel aller Konten herunter, denen Sie folgen, und platziert sie in
Ihrem GnuPG-Schlüsselring (`~/.gnupg/pubring.gpg`).

An diesem Punkt können Sie nun `helm verify` oder jeden Befehl mit dem Flag `--verify`
verwenden:

```console
$ helm verify somechart-1.2.3.tgz
```

### Gründe, warum ein Chart nicht verifiziert werden kann

Dies sind häufige Gründe für ein Fehlschlagen.

- Die `.prov`-Datei fehlt oder ist beschädigt. Dies deutet darauf hin, dass etwas
  falsch konfiguriert ist oder dass der ursprüngliche Maintainer keine Provenienz-Datei
  erstellt hat.
- Der Schlüssel, der zum Signieren der Datei verwendet wurde, befindet sich nicht in
  Ihrem Schlüsselring. Dies deutet darauf hin, dass die Entität, die das Chart
  signiert hat, keine Person ist, der Sie bereits Ihr Vertrauen signalisiert haben.
- Die Verifizierung der `.prov`-Datei ist fehlgeschlagen. Dies deutet darauf hin, dass
  entweder mit dem Chart oder den Provenienz-Daten etwas nicht stimmt.
- Die Datei-Hashes in der Provenienz-Datei stimmen nicht mit dem Hash der Archivdatei
  überein. Dies deutet darauf hin, dass das Archiv manipuliert wurde.

Wenn eine Verifizierung fehlschlägt, gibt es Grund, dem Paket zu misstrauen.

## Die Provenienz-Datei

Die Provenienz-Datei enthält die YAML-Datei eines Charts sowie mehrere
Verifizierungsinformationen. Provenienz-Dateien sind so konzipiert, dass sie
automatisch generiert werden.

Die folgenden Provenienz-Daten werden hinzugefügt:

* Die Chart-Datei (`Chart.yaml`) wird einbezogen, um sowohl Menschen als auch
  Werkzeugen einen einfachen Einblick in den Inhalt des Charts zu geben.
* Die Signatur (SHA256, wie bei Docker) des Chart-Pakets (die `.tgz`-Datei) wird
  einbezogen und kann zur Überprüfung der Integrität des Chart-Pakets verwendet werden.
* Der gesamte Inhalt wird mit dem von OpenPGP verwendeten Algorithmus signiert (siehe
  [Keybase.io](https://keybase.io) für einen aufkommenden Weg, kryptografisches
  Signieren und Verifizieren zu vereinfachen).

Diese Kombination gibt Benutzern die folgenden Zusicherungen:

* Das Paket selbst wurde nicht manipuliert (Prüfsumme des `.tgz`-Pakets).
* Die Entität, die dieses Paket veröffentlicht hat, ist bekannt (durch die
  GnuPG/PGP-Signatur).

Das Format der Datei sieht ungefähr so aus:

```
Hash: SHA512

apiVersion: v2
appVersion: "1.16.0"
description: Sample chart
name: mychart
type: application
version: 0.1.0

...
files:
  mychart-0.1.0.tgz: sha256:d31d2f08b885ec696c37c7f7ef106709aaf5e8575b6d3dc5d52112ed29a9cb92
-----BEGIN PGP SIGNATURE-----

wsBcBAEBCgAQBQJdy0ReCRCEO7+YH8GHYgAAfhUIADx3pHHLLINv0MFkiEYpX/Kd
nvHFBNps7hXqSocsg0a9Fi1LRAc3OpVh3knjPfHNGOy8+xOdhbqpdnB+5ty8YopI
mYMWp6cP/Mwpkt7/gP1ecWFMevicbaFH5AmJCBihBaKJE4R1IX49/wTIaLKiWkv2
cR64bmZruQPSW83UTNULtdD7kuTZXeAdTMjAK0NECsCz9/eK5AFggP4CDf7r2zNi
hZsNrzloIlBZlGGns6mUOTO42J/+JojnOLIhI3Psd0HBD2bTlsm/rSfty4yZUs7D
qtgooNdohoyGSzR5oapd7fEvauRQswJxOA0m0V+u9/eyLR0+JcYB8Udi1prnWf8=
=aHfz
-----END PGP SIGNATURE-----
```

Beachten Sie, dass der YAML-Abschnitt zwei Dokumente enthält (getrennt durch
`...\n`). Die erste Datei ist der Inhalt von `Chart.yaml`. Die zweite enthält
die Prüfsummen, eine Zuordnung von Dateinamen zu SHA-256-Digests des Dateiinhalts
zum Zeitpunkt des Paketierens.

Der Signaturblock ist eine standardmäßige PGP-Signatur, die
[Manipulationsschutz](https://www.rossde.com/PGP/pgp_signatures.html) bietet.

## Chart Repositories

Chart Repositories dienen als zentrale Sammlung von Helm-Charts.

Chart Repositories müssen es ermöglichen, Provenienz-Dateien über HTTP über eine
bestimmte Anfrage bereitzustellen, und müssen sie unter demselben URI-Pfad wie das
Chart verfügbar machen.

Wenn beispielsweise die Basis-URL für ein Paket
`https://example.com/charts/mychart-1.2.3.tgz` ist, MUSS die Provenienz-Datei,
falls vorhanden, unter
`https://example.com/charts/mychart-1.2.3.tgz.prov` erreichbar sein.

Aus Sicht des Endbenutzers sollte `helm install --verify myrepo/mychart-1.2.3`
zum Download sowohl des Charts als auch der Provenienz-Datei führen, ohne
zusätzliche Benutzerkonfiguration oder -aktion.

### Signaturen in OCI-basierten Registries

Beim Veröffentlichen von Charts in einer [OCI-basierten Registry](/topics/registries.md)
kann das [`helm-sigstore`-Plugin](https://github.com/sigstore/helm-sigstore/) verwendet
werden, um Provenienz in [sigstore](https://sigstore.dev/) zu veröffentlichen.
[Wie in der Dokumentation beschrieben](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md),
sind das Erstellen von Provenienz und das Signieren mit einem GPG-Schlüssel üblich,
aber der Befehl `helm sigstore upload` kann verwendet werden, um die Provenienz in
einem unveränderlichen Transparenz-Log zu veröffentlichen.

## Autorität und Authentizität etablieren

Beim Umgang mit Vertrauensketten-Systemen ist es wichtig, die Autorität eines
Signierenden feststellen zu können. Anders ausgedrückt: Das oben beschriebene
System basiert darauf, dass Sie der Person vertrauen, die das Chart signiert hat.
Das wiederum bedeutet, dass Sie dem öffentlichen Schlüssel des Signierenden
vertrauen müssen.

Eine der Design-Entscheidungen bei Helm war, dass sich das Helm-Projekt nicht als
notwendige Partei in die Vertrauenskette einschalten würde. Wir wollen nicht die
"Zertifizierungsstelle" für alle Chart-Signierer sein. Stattdessen bevorzugen wir
stark ein dezentrales Modell, weshalb wir OpenPGP als unsere grundlegende
Technologie gewählt haben. Wenn es also darum geht, Autorität zu etablieren, haben
wir diesen Schritt in Helm 2 mehr oder weniger undefiniert gelassen (eine
Entscheidung, die in Helm 3 beibehalten wurde).

Dennoch haben wir einige Hinweise und Empfehlungen für diejenigen, die das
Provenienz-System nutzen möchten:

- Die [Keybase](https://keybase.io)-Plattform bietet ein öffentliches,
  zentralisiertes Repository für Vertrauensinformationen.
  - Sie können Keybase verwenden, um Ihre Schlüssel zu speichern oder die
    öffentlichen Schlüssel anderer zu erhalten.
  - Keybase bietet auch hervorragende Dokumentation.
  - Obwohl wir es nicht getestet haben, könnte die "sichere Website"-Funktion
    von Keybase verwendet werden, um Helm-Charts bereitzustellen.
  - Die Grundidee ist, dass ein offizieller "Chart-Reviewer" Charts mit seinem
    Schlüssel signiert und die resultierende Provenienz-Datei dann in das Chart
    Repository hochgeladen wird.
  - Es wurde an der Idee gearbeitet, dass eine Liste gültiger Signaturschlüssel
    in der `index.yaml`-Datei eines Repositorys enthalten sein könnte.
