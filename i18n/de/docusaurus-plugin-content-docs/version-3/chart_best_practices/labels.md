---
title: Labels und Annotationen
description: Behandelt Best Practices für die Verwendung von Labels und Annotationen in Ihrem Chart.
sidebar_position: 5
---

Dieser Teil des Best-Practices-Leitfadens behandelt Best Practices für die Verwendung von Labels und Annotationen in Ihrem Chart.

## Ist es ein Label oder eine Annotation?

Ein Metadateneintrag sollte unter folgenden Bedingungen ein Label sein:

- Es wird von Kubernetes verwendet, um diese Ressource zu identifizieren
- Es ist nützlich für Administratoren, um das System abzufragen.

Zum Beispiel empfehlen wir, `helm.sh/chart: NAME-VERSION` als Label zu verwenden, damit Administratoren bequem alle Instanzen eines bestimmten Charts finden können.

Wenn ein Metadateneintrag nicht für Abfragen verwendet wird, sollte er stattdessen als Annotation gesetzt werden.

Helm Hooks sind immer Annotationen.

## Standard-Labels

Die folgende Tabelle definiert gängige Labels, die Helm Charts verwenden. Helm selbst erfordert niemals, dass ein bestimmtes Label vorhanden ist. Labels, die mit REC gekennzeichnet sind, werden empfohlen und _sollten_ auf einem Chart für globale Konsistenz gesetzt werden. Die mit OPT gekennzeichneten sind optional. Diese sind üblich oder häufig verwendet, werden aber nicht oft für den Betrieb benötigt.

| Name | Status | Beschreibung |
|------|--------|--------------|
| `app.kubernetes.io/name` | REC | Der App-Name, der die gesamte App widerspiegelt. Üblicherweise wird `{{ template "name" . }}` dafür verwendet. Wird von vielen Kubernetes-Manifesten verwendet und ist nicht Helm-spezifisch. |
| `helm.sh/chart` | REC | Der Chart-Name und die Version: `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`. |
| `app.kubernetes.io/managed-by` | REC | Sollte immer auf `{{ .Release.Service }}` gesetzt werden. Dient dazu, alle von Helm verwalteten Ressourcen zu finden. |
| `app.kubernetes.io/instance` | REC | Sollte `{{ .Release.Name }}` sein. Hilft bei der Unterscheidung zwischen verschiedenen Instanzen derselben Anwendung. |
| `app.kubernetes.io/version` | OPT | Die Version der App, kann auf `{{ .Chart.AppVersion }}` gesetzt werden. |
| `app.kubernetes.io/component` | OPT | Ein gängiges Label zur Kennzeichnung der verschiedenen Rollen, die Komponenten in einer Anwendung spielen können. Zum Beispiel `app.kubernetes.io/component: frontend`. |
| `app.kubernetes.io/part-of` | OPT | Für den Fall, dass mehrere Charts oder Software-Komponenten zusammen eine Anwendung bilden. Zum Beispiel Anwendungssoftware und eine Datenbank für eine Website. Kann auf die übergeordnete Anwendung gesetzt werden. |

Weitere Informationen zu den Kubernetes-Labels mit dem Präfix `app.kubernetes.io` finden Sie in der [Kubernetes-Dokumentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).
