---
title: "Anhang: YAML-Techniken"
description: Ein genauerer Blick auf die YAML-Spezifikation und wie sie auf Helm angewendet wird.
sidebar_position: 15
---

Der Großteil dieser Anleitung hat sich auf das Schreiben der Template-Sprache
konzentriert. Hier werden wir uns das YAML-Format ansehen. YAML hat einige
nützliche Funktionen, die wir als Template-Autoren nutzen können, um unsere
Templates weniger fehleranfällig und leichter lesbar zu machen.

## Skalare und Collections

Laut der [YAML-Spezifikation](https://yaml.org/spec/1.2/spec.html) gibt es zwei
Arten von Collections und viele skalare Typen.

Die zwei Arten von Collections sind Maps und Sequences:

```yaml
map:
  one: 1
  two: 2
  three: 3

sequence:
  - one
  - two
  - three
```

Skalare Werte sind einzelne Werte (im Gegensatz zu Collections).

### Skalare Typen in YAML

In Helms YAML-Dialekt wird der skalare Datentyp eines Wertes durch einen
komplexen Satz von Regeln bestimmt, einschließlich des Kubernetes-Schemas für
Ressourcendefinitionen. Bei der Typinferenz gelten jedoch in der Regel die
folgenden Regeln.

Wenn eine Ganzzahl oder Fließkommazahl ein nicht in Anführungszeichen
gesetztes Wort ist, wird sie typischerweise als numerischer Typ behandelt:

```yaml
count: 1
size: 2.34
```

Wenn sie jedoch in Anführungszeichen gesetzt sind, werden sie als Strings behandelt:

```yaml
count: "1" # <-- string, not int
size: '2.34' # <-- string, not float
```

Dasselbe gilt für Booleans:

```yaml
isGood: true   # bool
answer: "true" # string
```

Das Wort für einen leeren Wert ist `null` (nicht `nil`).

Beachten Sie, dass `port: "80"` gültiges YAML ist und sowohl durch die
Template-Engine als auch den YAML-Parser läuft, aber fehlschlägt, wenn
Kubernetes erwartet, dass `port` eine Ganzzahl ist.

In einigen Fällen können Sie eine bestimmte Typinferenz mit YAML-Node-Tags erzwingen:

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

Im obigen Beispiel teilt `!!str` dem Parser mit, dass `age` ein String ist, auch
wenn es wie ein Integer aussieht. Und `port` wird als Integer behandelt, obwohl
es in Anführungszeichen steht.


## Strings in YAML

Ein Großteil der Daten, die wir in YAML-Dokumenten platzieren, sind Strings.
YAML hat mehr als eine Möglichkeit, einen String darzustellen. Dieser Abschnitt
erklärt die verschiedenen Wege und zeigt, wie einige davon verwendet werden.

Es gibt drei "inline" Möglichkeiten, einen String zu deklarieren:

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

Alle Inline-Stile müssen in einer Zeile stehen.

- Bare Words (unquotierte Wörter) sind nicht in Anführungszeichen gesetzt und
  werden nicht escaped. Aus diesem Grund müssen Sie darauf achten, welche
  Zeichen Sie verwenden.
- Strings in doppelten Anführungszeichen können bestimmte Zeichen mit `\`
  escapen. Zum Beispiel `"\"Hello\", she said"`. Sie können Zeilenumbrüche mit
  `\n` escapen.
- Strings in einfachen Anführungszeichen sind "literale" Strings und verwenden
  nicht `\` zum Escapen von Zeichen. Die einzige Escape-Sequenz ist `''`, die
  als einzelnes `'` dekodiert wird.

Zusätzlich zu den einzeiligen Strings können Sie mehrzeilige Strings deklarieren:

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

Das obige Beispiel behandelt den Wert von `coffee` als einen einzelnen String,
der `Latte\nCappuccino\nEspresso\n` entspricht.

Beachten Sie, dass die erste Zeile nach dem `|` korrekt eingerückt sein muss.
Wir könnten das obige Beispiel also durch Folgendes ungültig machen:

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

Da `Latte` falsch eingerückt ist, würden wir einen Fehler wie diesen erhalten:

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

In Templates ist es manchmal sicherer, eine "erste Zeile" als Platzhalter in
einem mehrzeiligen Dokument zu setzen, um den obigen Fehler zu vermeiden:

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

Beachten Sie, dass diese erste Zeile in der Ausgabe des Strings erhalten bleibt.
Wenn Sie diese Technik beispielsweise verwenden, um den Inhalt einer Datei in
eine ConfigMap einzufügen, sollte der Kommentar dem Typ entsprechen, der von
dem erwartet wird, was diesen Eintrag liest.

### Kontrolle von Leerzeichen in mehrzeiligen Strings

Im obigen Beispiel haben wir `|` verwendet, um einen mehrzeiligen String
anzuzeigen. Beachten Sie jedoch, dass dem Inhalt unseres Strings ein
abschließendes `\n` folgte. Wenn wir möchten, dass der YAML-Prozessor das
abschließende Newline entfernt, können wir ein `-` nach dem `|` hinzufügen:

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

Jetzt wird der `coffee`-Wert sein: `Latte\nCappuccino\nEspresso` (ohne
abschließendes `\n`).

In anderen Fällen möchten wir vielleicht, dass alle abschließenden Leerzeichen
erhalten bleiben. Wir können dies mit der `|+`-Notation tun:

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

Jetzt wird der Wert von `coffee` sein: `Latte\nCappuccino\nEspresso\n\n\n`.

Die Einrückung innerhalb eines Textblocks wird beibehalten und führt auch zur
Beibehaltung von Zeilenumbrüchen:

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

Im obigen Fall wird `coffee` sein: `Latte\n  12 oz\n  16
oz\nCappuccino\nEspresso`.

### Einrückung und Templates

Beim Schreiben von Templates möchten Sie möglicherweise den Inhalt einer Datei
in das Template einfügen. Wie wir in vorherigen Kapiteln gesehen haben, gibt es
zwei Möglichkeiten, dies zu tun:

- Verwenden Sie `{{ .Files.Get "FILENAME" }}`, um den Inhalt einer Datei im
  Chart zu erhalten.
- Verwenden Sie `{{ include "TEMPLATE" . }}`, um ein Template zu rendern und
  dann dessen Inhalt in das Chart einzufügen.

Beim Einfügen von Dateien in YAML ist es gut, die obigen mehrzeiligen Regeln zu
verstehen. Oft ist der einfachste Weg, eine statische Datei einzufügen,
folgender:

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

Beachten Sie, wie wir die Einrückung oben durchführen: `indent 2` weist die
Template-Engine an, jede Zeile in "myfile.txt" mit zwei Leerzeichen
einzurücken. Beachten Sie, dass wir diese Template-Zeile nicht einrücken. Das
liegt daran, dass andernfalls der Dateiinhalt der ersten Zeile doppelt
eingerückt würde.

### Gefaltete mehrzeilige Strings

Manchmal möchten Sie einen String in Ihrem YAML mit mehreren Zeilen darstellen,
aber möchten, dass er bei der Interpretation als eine lange Zeile behandelt
wird. Dies wird "Folding" (Falten) genannt. Um einen gefalteten Block zu
deklarieren, verwenden Sie `>` anstelle von `|`:

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

Der Wert von `coffee` oben wird `Latte Cappuccino Espresso\n` sein. Beachten
Sie, dass alle außer dem letzten Zeilenvorschub in Leerzeichen umgewandelt
werden. Sie können die Leerzeichen-Kontrollen mit dem Folded-Text-Marker
kombinieren, sodass `>-` alle Newlines ersetzt oder entfernt.

Beachten Sie, dass in der Folded-Syntax das Einrücken von Text dazu führt, dass
Zeilen erhalten bleiben.

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

Das obige Beispiel ergibt `Latte\n  12 oz\n  16 oz\nCappuccino Espresso`.
Beachten Sie, dass sowohl die Leerzeichen als auch die Zeilenumbrüche noch
vorhanden sind.

## Einbetten mehrerer Dokumente in einer Datei

Es ist möglich, mehr als ein YAML-Dokument in einer einzigen Datei zu
platzieren. Dies geschieht, indem ein neues Dokument mit `---` eingeleitet und
das Dokument mit `...` beendet wird.

```yaml

---
document: 1
...
---
document: 2
...
```

In vielen Fällen kann entweder `---` oder `...` weggelassen werden.

Einige Dateien in Helm können nicht mehr als ein Dokument enthalten. Wenn
beispielsweise mehr als ein Dokument in einer `values.yaml`-Datei bereitgestellt
wird, wird nur das erste verwendet.

Template-Dateien können jedoch mehr als ein Dokument haben. In diesem Fall wird
die Datei (und alle ihre Dokumente) beim Template-Rendering als ein Objekt
behandelt. Aber dann wird das resultierende YAML in mehrere Dokumente
aufgeteilt, bevor es an Kubernetes übergeben wird.

Wir empfehlen, mehrere Dokumente pro Datei nur dann zu verwenden, wenn es
unbedingt notwendig ist. Das Vorhandensein mehrerer Dokumente in einer Datei
kann das Debugging erschweren.

## YAML ist eine Obermenge von JSON

Da YAML eine Obermenge von JSON ist, _sollte_ jedes gültige JSON-Dokument auch
gültiges YAML sein.

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

Das obige ist eine andere Art, dies darzustellen:

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

Und die beiden können (mit Vorsicht) gemischt werden:

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]
```

Alle drei sollten zur gleichen internen Darstellung geparst werden.

Obwohl dies bedeutet, dass Dateien wie `values.yaml` JSON-Daten enthalten
können, behandelt Helm die Dateiendung `.json` nicht als gültiges Suffix.

## YAML-Anker

Die YAML-Spezifikation bietet eine Möglichkeit, eine Referenz auf einen Wert zu
speichern und später auf diesen Wert per Referenz zu verweisen. YAML nennt dies
"Anchoring":

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

Im obigen Beispiel setzt `&favoriteCoffee` eine Referenz auf `Cappuccino`.
Später wird diese Referenz als `*favoriteCoffee` verwendet. So wird `coffees` zu
`Latte, Cappuccino, Espresso`.

Obwohl es einige Fälle gibt, in denen Anker nützlich sind, gibt es einen
Aspekt, der subtile Bugs verursachen kann: Wenn das YAML zum ersten Mal
eingelesen wird, wird die Referenz aufgelöst und dann verworfen.

Wenn wir also das obige Beispiel dekodieren und dann wieder kodieren würden,
wäre das resultierende YAML:

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

Da Helm und Kubernetes oft YAML-Dateien lesen, modifizieren und dann neu
schreiben, gehen die Anker verloren.
