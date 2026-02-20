---
title: Custom Resource Definitions
description: Erstellen und Verwenden von CRDs.
sidebar_position: 7
---

Dieser Teil des Best-Practices-Leitfadens behandelt die Erstellung und Verwendung von Custom-Resource-Definition-Objekten.

Bei der Arbeit mit Custom Resource Definitions (CRDs) ist es wichtig, zwei Dinge zu unterscheiden:

- Es gibt eine Deklaration einer CRD. Dies ist die YAML-Datei mit `kind: CustomResourceDefinition`
- Dann gibt es Ressourcen, die die CRD _verwenden_. Angenommen, eine CRD definiert `foo.example.com/v1`. Jede Ressource mit `apiVersion: example.com/v1` und `kind: Foo` ist eine Ressource, die die CRD verwendet.

## CRD-Deklaration vor Ressourcenverwendung installieren

Helm ist darauf optimiert, so viele Ressourcen wie möglich so schnell wie möglich in Kubernetes zu laden. Kubernetes kann standardmäßig einen gesamten Satz von Manifesten entgegennehmen und alle gleichzeitig online bringen (dies wird als Abgleichsschleife bzw. Reconciliation Loop bezeichnet).

Bei CRDs gibt es jedoch einen Unterschied.

Bei einer CRD muss die Deklaration registriert werden, bevor Ressourcen dieser CRD-Art(en) verwendet werden können. Der Registrierungsprozess dauert manchmal einige Sekunden.

### Methode 1: Helm die Arbeit überlassen

Mit der Einführung von Helm 3 haben wir die alten `crd-install`-Hooks für eine einfachere Methode entfernt. Es gibt jetzt ein spezielles Verzeichnis namens `crds`, das Sie in Ihrem Chart erstellen können, um Ihre CRDs zu speichern. Diese CRDs werden nicht als Templates verarbeitet, aber standardmäßig installiert, wenn Sie `helm install` für das Chart ausführen. Wenn die CRD bereits existiert, wird sie mit einer Warnung übersprungen. Wenn Sie den CRD-Installationsschritt überspringen möchten, können Sie das Flag `--skip-crds` verwenden.

#### Einige Vorbehalte (und Erklärungen)

Derzeit gibt es keine Unterstützung für das Aktualisieren oder Löschen von CRDs mit Helm. Dies war eine bewusste Entscheidung nach ausführlicher Community-Diskussion aufgrund der Gefahr eines unbeabsichtigten Datenverlusts. Außerdem gibt es derzeit keinen Community-Konsens darüber, wie CRDs und ihr Lebenszyklus gehandhabt werden sollen. Sobald sich dies weiterentwickelt, wird Helm Unterstützung für diese Anwendungsfälle hinzufügen.

Das `--dry-run`-Flag von `helm install` und `helm upgrade` wird derzeit für CRDs nicht unterstützt. Der Zweck von „Dry Run" ist zu validieren, dass die Ausgabe des Charts tatsächlich funktioniert, wenn sie an den Server gesendet wird. Aber CRDs ändern das Serververhalten. Helm kann die CRD bei einem Dry Run nicht installieren, daher kennt der Discovery-Client diese Custom Resource (CR) nicht, und die Validierung schlägt fehl. Sie können alternativ die CRDs in ein eigenes Chart verschieben oder stattdessen `helm template` verwenden.

Ein weiterer wichtiger Punkt in der Diskussion um CRD-Unterstützung ist, wie das Rendern von Templates gehandhabt wird. Einer der deutlichen Nachteile der `crd-install`-Methode in Helm 2 war die Unfähigkeit, Charts aufgrund sich ändernder API-Verfügbarkeit ordnungsgemäß zu validieren (eine CRD fügt Ihrem Kubernetes-Cluster tatsächlich eine weitere verfügbare API hinzu). Wenn ein Chart eine CRD installierte, hatte `helm` keinen gültigen Satz von API-Versionen mehr, gegen den es arbeiten konnte. Dies ist auch der Grund für die Entfernung der Template-Unterstützung von CRDs. Mit der neuen `crds`-Methode der CRD-Installation stellen wir nun sicher, dass `helm` vollständig gültige Informationen über den aktuellen Zustand des Clusters hat.

### Methode 2: Separate Charts

Eine andere Möglichkeit ist, die CRD-Definition in ein Chart zu packen und dann alle Ressourcen, die diese CRD verwenden, in ein _anderes_ Chart zu packen.

Bei dieser Methode muss jedes Chart separat installiert werden. Dieser Workflow kann jedoch für Cluster-Operatoren nützlicher sein, die Administratorzugriff auf einen Cluster haben.
