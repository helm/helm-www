---
title: "Helm Versionsunterstützung"
description: "Beschreibt die Patch-Release-Richtlinie von Helm sowie die maximal unterstützte Versionsabweichung zwischen Helm und Kubernetes."
---

Dieses Dokument beschreibt die maximal unterstützte Versionsabweichung zwischen Helm und
Kubernetes.

## Unterstützte Versionen

Helm-Versionen werden als `x.y.z` ausgedrückt, wobei `x` die Hauptversion, `y` die
Nebenversion und `z` die Patch-Version ist. Dies entspricht der [Semantischen
Versionierung](https://semver.org/spec/v2.0.0.html).

Das Helm-Projekt pflegt einen Release-Branch für die jeweils aktuellste Nebenversion.
Relevante Korrekturen, einschließlich Sicherheitskorrekturen, werden je nach Schweregrad
und Machbarkeit in den Release-Branch übernommen. Weitere Details finden Sie in
[Helms Release-Richtlinie](/topics/release_policy.md).

## Unterstützte Versionsabweichung

Jede neue Helm-Version wird gegen eine bestimmte Nebenversion von Kubernetes kompiliert.
Helm 3.0.0 verwendet beispielsweise den Kubernetes 1.16.2 Client und ist daher mit
Kubernetes 1.16 kompatibel.

Ab Helm 3 gilt die Kompatibilität mit `n-3` Versionen von Kubernetes, gegen die Helm
kompiliert wurde. Bei Helm 2 ist die Unterstützungsrichtlinie aufgrund der Änderungen
zwischen Kubernetes-Nebenversionen strenger: hier gilt die Kompatibilität mit `n-1`
Versionen.

Wenn Sie beispielsweise eine Version von Helm 3 verwenden, die gegen die Kubernetes 1.17
Client-APIs kompiliert wurde, können Sie diese sicher mit Kubernetes 1.17, 1.16, 1.15
und 1.14 verwenden. Bei einer Version von Helm 2, die gegen die Kubernetes 1.16
Client-APIs kompiliert wurde, ist die Verwendung mit Kubernetes 1.16 und 1.15 sicher.

Es wird nicht empfohlen, Helm mit einer neueren Kubernetes-Version zu verwenden als der,
gegen die es kompiliert wurde. Helm gibt keine Vorwärtskompatibilitätsgarantien.

Wenn Sie Helm mit einer nicht unterstützten Kubernetes-Version verwenden, tun Sie dies
auf eigenes Risiko.

In der folgenden Tabelle sehen Sie, welche Helm-Version mit Ihrem Cluster kompatibel ist.

| Helm-Version | Unterstützte Kubernetes-Versionen |
|--------------|-----------------------------------|
| 3.20.x       | 1.35.x - 1.32.x                   |
| 3.19.x       | 1.34.x - 1.31.x                   |
| 3.18.x       | 1.33.x - 1.30.x                   |
| 3.17.x       | 1.32.x - 1.29.x                   |
| 3.16.x       | 1.31.x - 1.28.x                   |
| 3.15.x       | 1.30.x - 1.27.x                   |
| 3.14.x       | 1.29.x - 1.26.x                   |
| 3.13.x       | 1.28.x - 1.25.x                   |
| 3.12.x       | 1.27.x - 1.24.x                   |
| 3.11.x       | 1.26.x - 1.23.x                   |
| 3.10.x       | 1.25.x - 1.22.x                   |
| 3.9.x        | 1.24.x - 1.21.x                   |
| 3.8.x        | 1.23.x - 1.20.x                   |
| 3.7.x        | 1.22.x - 1.19.x                   |
| 3.6.x        | 1.21.x - 1.18.x                   |
| 3.5.x        | 1.20.x - 1.17.x                   |
| 3.4.x        | 1.19.x - 1.16.x                   |
| 3.3.x        | 1.18.x - 1.15.x                   |
| 3.2.x        | 1.18.x - 1.15.x                   |
| 3.1.x        | 1.17.x - 1.14.x                   |
| 3.0.x        | 1.16.x - 1.13.x                   |
| 2.16.x       | 1.16.x - 1.15.x                   |
| 2.15.x       | 1.15.x - 1.14.x                   |
| 2.14.x       | 1.14.x - 1.13.x                   |
| 2.13.x       | 1.13.x - 1.12.x                   |
| 2.12.x       | 1.12.x - 1.11.x                   |
| 2.11.x       | 1.11.x - 1.10.x                   |
| 2.10.x       | 1.10.x - 1.9.x                    |
| 2.9.x        | 1.10.x - 1.9.x                    |
| 2.8.x        | 1.9.x - 1.8.x                     |
| 2.7.x        | 1.8.x - 1.7.x                     |
| 2.6.x        | 1.7.x - 1.6.x                     |
| 2.5.x        | 1.6.x - 1.5.x                     |
| 2.4.x        | 1.6.x - 1.5.x                     |
| 2.3.x        | 1.5.x - 1.4.x                     |
| 2.2.x        | 1.5.x - 1.4.x                     |
| 2.1.x        | 1.5.x - 1.4.x                     |
| 2.0.x        | 1.4.x - 1.3.x                     |
