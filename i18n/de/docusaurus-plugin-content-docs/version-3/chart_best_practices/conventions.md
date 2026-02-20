---
title: Allgemeine Konventionen
description: Allgemeine Konventionen für Charts.
sidebar_position: 1
---

Dieser Teil des Best-Practices-Leitfadens erklärt allgemeine Konventionen.

## Chart-Namen

Chart-Namen müssen aus Kleinbuchstaben und Zahlen bestehen. Wörter _können_ durch Bindestriche (-) getrennt werden:

Beispiele:

```
drupal
nginx-lego
aws-cluster-autoscaler
```

Weder Großbuchstaben noch Unterstriche können in Chart-Namen verwendet werden. Punkte sollten in Chart-Namen nicht verwendet werden.

## Versionsnummern

Wo immer möglich, verwendet Helm [SemVer 2](https://semver.org), um Versionsnummern darzustellen. (Beachten Sie, dass Docker-Image-Tags nicht unbedingt SemVer folgen und daher als unglückliche Ausnahme von dieser Regel gelten.)

Wenn SemVer-Versionen in Kubernetes-Labels gespeichert werden, ersetzen wir üblicherweise das `+`-Zeichen durch ein `_`-Zeichen, da Labels das `+`-Zeichen als Wert nicht zulassen.

## YAML-Formatierung

YAML-Dateien sollten mit _zwei Leerzeichen_ eingerückt werden (und niemals mit Tabs).

## Verwendung der Wörter Helm und Chart

Es gibt einige Konventionen für die Verwendung der Wörter _Helm_ und _helm_.

- _Helm_ bezieht sich auf das Projekt als Ganzes
- `helm` bezieht sich auf den clientseitigen Befehl
- Der Begriff `chart` muss nicht großgeschrieben werden, da es sich nicht um einen Eigennamen handelt
- Allerdings muss `Chart.yaml` großgeschrieben werden, da der Dateiname Groß- und Kleinschreibung unterscheidet

Im Zweifelsfall verwenden Sie _Helm_ (mit einem großen 'H').

## Chart-Templates und Namespaces

Vermeiden Sie es, die Eigenschaft `namespace` im Abschnitt `metadata` Ihrer Chart-Templates zu definieren. Der Namespace, auf den gerenderte Templates angewendet werden sollen, sollte beim Aufruf eines Kubernetes-Clients über ein Flag wie `--namespace` angegeben werden. Helm rendert Ihre Templates unverändert und sendet sie an den Kubernetes-Client, sei es Helm selbst oder ein anderes Programm (kubectl, Flux, Spinnaker, etc.).
