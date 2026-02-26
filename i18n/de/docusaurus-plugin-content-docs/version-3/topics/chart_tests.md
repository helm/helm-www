---
title: Chart Tests
description: Beschreibt, wie Sie Ihre Charts ausführen und testen können.
sidebar_position: 3
---

Ein Chart enthält eine Reihe von Kubernetes-Ressourcen und Komponenten, die zusammenarbeiten. Als Chart-Autor möchten Sie möglicherweise Tests schreiben, die überprüfen, ob Ihr Chart bei der Installation wie erwartet funktioniert. Diese Tests helfen auch dem Chart-Benutzer zu verstehen, was Ihr Chart tun soll.

Ein **Test** in einem Helm Chart befindet sich im Verzeichnis `templates/` und ist eine Job-Definition, die einen Container mit einem auszuführenden Befehl spezifiziert. Der Container sollte erfolgreich beendet werden (Exit-Code 0), damit ein Test als erfolgreich gilt. Die Job-Definition muss die Helm-Test-Hook-Annotation enthalten: `helm.sh/hook: test`.

Hinweis: Bis Helm v3 musste die Job-Definition eine der folgenden Helm-Test-Hook-Annotationen enthalten: `helm.sh/hook: test-success` oder `helm.sh/hook: test-failure`. Die Annotation `helm.sh/hook: test-success` wird weiterhin als abwärtskompatible Alternative zu `helm.sh/hook: test` akzeptiert.

Beispiele für Tests:

- Validieren Sie, dass Ihre Konfiguration aus der values.yaml-Datei korrekt übernommen wurde.
  - Stellen Sie sicher, dass Ihr Benutzername und Passwort korrekt funktionieren
  - Stellen Sie sicher, dass ein falscher Benutzername und falsches Passwort nicht funktionieren
- Überprüfen Sie, dass Ihre Services aktiv sind und die Lastverteilung korrekt funktioniert
- usw.

Sie können die vordefinierten Tests in Helm für ein Release mit dem Befehl `helm test <RELEASE_NAME>` ausführen. Für einen Chart-Benutzer ist dies eine hervorragende Möglichkeit, zu prüfen, ob das Release eines Charts (oder einer Anwendung) wie erwartet funktioniert.

## Beispieltest

Der Befehl [helm create](/helm/helm_create.md) erstellt automatisch eine Reihe von Ordnern und Dateien. Um die Helm-Testfunktionalität auszuprobieren, erstellen Sie zunächst ein Demo-Helm-Chart.

```console
$ helm create demo
```

Sie sehen nun die folgende Struktur in Ihrem Demo-Helm-Chart.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

In `demo/templates/tests/test-connection.yaml` finden Sie einen Test, den Sie ausprobieren können. Hier sehen Sie die Pod-Definition für den Helm-Test:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## Schritte zum Ausführen einer Testsuite für ein Release

Installieren Sie zunächst das Chart in Ihrem Cluster, um ein Release zu erstellen. Möglicherweise müssen Sie warten, bis alle Pods aktiv sind; wenn Sie den Test direkt nach der Installation ausführen, wird wahrscheinlich ein vorübergehender Fehler angezeigt, und Sie sollten den Test erneut durchführen.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## Hinweise

- Sie können beliebig viele Tests in einer einzelnen YAML-Datei definieren oder auf mehrere YAML-Dateien im Verzeichnis `templates/` verteilen.
- Sie können Ihre Testsuite in einem Unterverzeichnis `tests/` wie `<chart-name>/templates/tests/` unterbringen, um eine bessere Übersichtlichkeit zu erreichen.
- Ein Test ist ein [Helm Hook](/topics/charts_hooks.md), daher können Annotationen wie `helm.sh/hook-weight` und `helm.sh/hook-delete-policy` mit Test-Ressourcen verwendet werden.
