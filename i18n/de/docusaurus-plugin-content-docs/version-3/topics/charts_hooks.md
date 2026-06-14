---
title: Chart Hooks
description: Beschreibt die Arbeit mit Chart Hooks.
sidebar_position: 2
---

Helm bietet einen _Hook_-Mechanismus, der es Chart-Entwicklern ermöglicht, an
bestimmten Punkten im Lebenszyklus eines Release einzugreifen. Sie können Hooks
beispielsweise nutzen, um:

- Eine ConfigMap oder ein Secret während der Installation zu laden, bevor andere Charts geladen werden.
- Einen Job auszuführen, der vor der Installation eines neuen Charts eine Datenbank sichert, und anschließend einen zweiten Job nach dem Upgrade auszuführen, um die Daten wiederherzustellen.
- Einen Job vor dem Löschen eines Release auszuführen, um einen Dienst ordnungsgemäß aus der Rotation zu nehmen, bevor er entfernt wird.

Hooks funktionieren wie reguläre Templates, verfügen jedoch über spezielle Annotationen, die Helm veranlassen, sie anders zu behandeln. In diesem Abschnitt behandeln wir das grundlegende Nutzungsmuster für Hooks.

## Die verfügbaren Hooks

Folgende Hooks sind definiert:

| Annotationswert  | Beschreibung                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `pre-install`    | Wird ausgeführt, nachdem Templates gerendert wurden, aber bevor Ressourcen in Kubernetes erstellt werden |
| `post-install`   | Wird ausgeführt, nachdem alle Ressourcen in Kubernetes geladen wurden                                   |
| `pre-delete`     | Wird bei einer Löschanfrage ausgeführt, bevor Ressourcen aus Kubernetes gelöscht werden                 |
| `post-delete`    | Wird bei einer Löschanfrage ausgeführt, nachdem alle Ressourcen des Release gelöscht wurden             |
| `pre-upgrade`    | Wird bei einer Upgrade-Anfrage ausgeführt, nachdem Templates gerendert wurden, aber bevor Ressourcen aktualisiert werden |
| `post-upgrade`   | Wird bei einer Upgrade-Anfrage ausgeführt, nachdem alle Ressourcen aktualisiert wurden                  |
| `pre-rollback`   | Wird bei einer Rollback-Anfrage ausgeführt, nachdem Templates gerendert wurden, aber bevor Ressourcen zurückgerollt werden |
| `post-rollback`  | Wird bei einer Rollback-Anfrage ausgeführt, nachdem alle Ressourcen geändert wurden                     |
| `test`           | Wird ausgeführt, wenn der Helm-Unterbefehl test aufgerufen wird ([siehe Testdokumentation](/topics/chart_tests.md)) |

_Hinweis: Der `crd-install` Hook wurde in Helm 3 zugunsten des `crds/`-Verzeichnisses entfernt._

## Hooks und der Release-Lebenszyklus

Hooks bieten Ihnen als Chart-Entwickler die Möglichkeit, Operationen an strategischen Punkten im Lebenszyklus eines Release durchzuführen. Betrachten Sie beispielsweise den Lebenszyklus einer `helm install`-Operation. Standardmäßig sieht der Lebenszyklus so aus:

1. Der Benutzer führt `helm install foo` aus
2. Die Install-API der Helm-Bibliothek wird aufgerufen
3. Nach einigen Validierungen rendert die Bibliothek die `foo`-Templates
4. Die Bibliothek lädt die resultierenden Ressourcen in Kubernetes
5. Die Bibliothek gibt das Release-Objekt (und andere Daten) an den Client zurück
6. Der Client wird beendet

Helm definiert zwei Hooks für den `install`-Lebenszyklus: `pre-install` und
`post-install`. Wenn der Entwickler des `foo`-Charts beide Hooks implementiert, ändert sich der Lebenszyklus wie folgt:

1. Der Benutzer führt `helm install foo` aus
2. Die Install-API der Helm-Bibliothek wird aufgerufen
3. CRDs im `crds/`-Verzeichnis werden installiert
4. Nach einigen Validierungen rendert die Bibliothek die `foo`-Templates
5. Die Bibliothek bereitet die Ausführung der `pre-install` Hooks vor (lädt Hook-Ressourcen in Kubernetes)
6. Die Bibliothek sortiert Hooks nach Gewichtung (standardmäßig wird eine Gewichtung von 0 zugewiesen), dann nach Ressourcentyp und schließlich nach Name in aufsteigender Reihenfolge.
7. Die Bibliothek lädt dann den Hook mit der niedrigsten Gewichtung zuerst (negativ bis positiv)
8. Die Bibliothek wartet, bis der Hook "Ready" ist (außer bei CRDs)
9. Die Bibliothek lädt die resultierenden Ressourcen in Kubernetes. Wenn das `--wait`-Flag gesetzt ist, wartet die Bibliothek, bis alle Ressourcen bereit sind, und führt den `post-install` Hook erst aus, wenn sie bereit sind.
10. Die Bibliothek führt den `post-install` Hook aus (lädt Hook-Ressourcen)
11. Die Bibliothek wartet, bis der Hook "Ready" ist
12. Die Bibliothek gibt das Release-Objekt (und andere Daten) an den Client zurück
13. Der Client wird beendet

Was bedeutet es, zu warten, bis ein Hook bereit ist? Das hängt von der im Hook deklarierten Ressource ab. Bei Ressourcen vom Typ `Job` oder `Pod` wartet Helm, bis diese erfolgreich abgeschlossen sind. Wenn der Hook fehlschlägt, schlägt auch das Release fehl. Dies ist eine _blockierende Operation_, sodass der Helm-Client während der Ausführung des Jobs pausiert.

Bei allen anderen Ressourcentypen gilt eine Ressource als "Ready", sobald Kubernetes sie als geladen (hinzugefügt oder aktualisiert) markiert. Wenn mehrere Ressourcen in einem Hook deklariert sind, werden die Ressourcen seriell ausgeführt. Wenn sie Hook-Gewichtungen haben (siehe unten), werden sie in gewichteter Reihenfolge ausgeführt.
Ab Helm 3.2.0 werden Hook-Ressourcen mit gleicher Gewichtung in derselben Reihenfolge wie normale Nicht-Hook-Ressourcen installiert. Andernfalls ist die Reihenfolge nicht garantiert. (In Helm 2.3.0 und später wurden sie alphabetisch sortiert. Dieses Verhalten ist jedoch nicht bindend und könnte sich in Zukunft ändern.) Es gilt als gute Praxis, eine Hook-Gewichtung hinzuzufügen und sie auf `0` zu setzen, wenn die Gewichtung nicht wichtig ist.

### Hook-Ressourcen werden nicht mit den zugehörigen Releases verwaltet

Die von einem Hook erstellten Ressourcen werden derzeit nicht als Teil des Release verfolgt oder verwaltet. Sobald Helm verifiziert hat, dass der Hook seinen Ready-Status erreicht hat, belässt es die Hook-Ressource unverändert. Die Garbage Collection von Hook-Ressourcen beim Löschen des zugehörigen Release könnte in Zukunft zu Helm 3 hinzugefügt werden, daher sollten Hook-Ressourcen, die niemals gelöscht werden dürfen, mit `helm.sh/resource-policy: keep` annotiert werden.

Praktisch bedeutet dies: Wenn Sie Ressourcen in einem Hook erstellen, können Sie sich nicht darauf verlassen, dass `helm uninstall` diese Ressourcen entfernt. Um solche Ressourcen zu zerstören, müssen Sie entweder [eine benutzerdefinierte `helm.sh/hook-delete-policy`-Annotation](#hook-löschrichtlinien) zur Hook-Template-Datei hinzufügen oder [das Time-to-Live (TTL)-Feld einer Job-Ressource setzen](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Einen Hook schreiben

Hooks sind einfach Kubernetes-Manifest-Dateien mit speziellen Annotationen im `metadata`-Abschnitt. Da es sich um Template-Dateien handelt, können Sie alle normalen Template-Funktionen nutzen, einschließlich des Lesens von `.Values`, `.Release` und `.Template`.

Das folgende Template, gespeichert unter `templates/post-install-job.yaml`, deklariert beispielsweise einen Job, der bei `post-install` ausgeführt wird:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

Was dieses Template zu einem Hook macht, ist die Annotation:

```yaml
annotations:
  "helm.sh/hook": post-install
```

Eine Ressource kann mehrere Hooks implementieren:

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

Ebenso gibt es keine Begrenzung für die Anzahl verschiedener Ressourcen, die einen bestimmten Hook implementieren können. Sie könnten beispielsweise sowohl ein Secret als auch eine ConfigMap als pre-install Hook deklarieren.

Wenn Subcharts Hooks deklarieren, werden diese ebenfalls ausgewertet. Es gibt keine Möglichkeit für ein übergeordnetes Chart, die von Subcharts deklarierten Hooks zu deaktivieren.

Es ist möglich, eine Gewichtung für einen Hook zu definieren, die bei der Bestimmung einer deterministischen Ausführungsreihenfolge hilft. Gewichtungen werden mit der folgenden Annotation definiert:

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

Hook-Gewichtungen können positive oder negative Zahlen sein, müssen aber als Strings dargestellt werden. Wenn Helm den Ausführungszyklus von Hooks eines bestimmten Typs startet, sortiert es diese Hooks in aufsteigender Reihenfolge.

### Hook-Löschrichtlinien

Es ist möglich, Richtlinien zu definieren, die festlegen, wann die entsprechenden Hook-Ressourcen gelöscht werden sollen. Hook-Löschrichtlinien werden mit der folgenden Annotation definiert:

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

Sie können einen oder mehrere der definierten Annotationswerte wählen:

| Annotationswert        | Beschreibung                                                           |
| ---------------------- | ---------------------------------------------------------------------- |
| `before-hook-creation` | Die vorherige Ressource löschen, bevor ein neuer Hook gestartet wird (Standard) |
| `hook-succeeded`       | Die Ressource löschen, nachdem der Hook erfolgreich ausgeführt wurde   |
| `hook-failed`          | Die Ressource löschen, wenn der Hook während der Ausführung fehlgeschlagen ist |

Wenn keine Hook-Löschrichtlinien-Annotation angegeben ist, gilt standardmäßig das `before-hook-creation`-Verhalten.
