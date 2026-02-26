---
title: "Anhang: Go-Datentypen und Templates"
description: Ein kurzer Überblick über Variablen in Templates.
sidebar_position: 16
---

Die Helm-Template-Sprache ist in der stark typisierten Programmiersprache Go
implementiert. Aus diesem Grund sind Variablen in Templates _typisiert_. In den
meisten Fällen werden Variablen als einer der folgenden Typen bereitgestellt:

- string: Eine Textzeichenkette
- bool: Ein `true` oder `false`
- int: Ein Integer-Wert (es gibt auch 8-, 16-, 32- und 64-Bit-Varianten, jeweils
  mit und ohne Vorzeichen)
- float64: Ein 64-Bit-Gleitkommawert (es gibt auch 8-, 16- und 32-Bit-Varianten
  davon)
- Ein Byte-Slice (`[]byte`), das häufig für (potenziell) binäre Daten verwendet
  wird
- struct: Ein Objekt mit Eigenschaften und Methoden
- Ein Slice (indizierte Liste) eines der vorherigen Typen
- Eine Map mit String-Schlüsseln (`map[string]interface{}`), wobei der Wert
  einer der vorherigen Typen ist

Es gibt viele andere Typen in Go, und manchmal müssen Sie in Ihren Templates
zwischen ihnen konvertieren. Am einfachsten ermitteln Sie den Typ eines Objekts,
indem Sie es in einem Template an `printf "%T"` übergeben – dies gibt den Typ
aus. Siehe hierfür auch die Funktionen `typeOf` und `kindOf`.
