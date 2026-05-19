---
title: Liste der Template-Funktionen
description: Eine Liste der in Helm verfügbaren Template-Funktionen
sidebar_position: 6
---

Helm enthält viele Template-Funktionen, die Sie in Templates nutzen können.
Sie sind hier aufgelistet und in folgende Kategorien unterteilt:

* [Kryptografie und Sicherheit](#kryptografie--und-sicherheitsfunktionen)
* [Datum](#datumsfunktionen)
* [Dictionaries](#dictionaries-und-dict-funktionen)
* [Encoding](#encoding-funktionen)
* [Dateipfade](#dateipfad-funktionen)
* [Kubernetes und Chart](#kubernetes--und-chart-funktionen)
* [Logik und Ablaufsteuerung](#logik--und-ablaufsteuerungsfunktionen)
* [Listen](#listen-und-list-funktionen)
* [Mathematik](#mathematische-funktionen)
* [Float-Mathematik](#float-mathematik-funktionen)
* [Netzwerk](#netzwerk-funktionen)
* [Reflection](#reflection-funktionen)
* [Reguläre Ausdrücke](#reguläre-ausdrücke)
* [Semantische Versionen](#semantische-versionsfunktionen)
* [Strings](#string-funktionen)
* [Typkonvertierung](#typkonvertierungsfunktionen)
* [URL](#url-funktionen)
* [UUID](#uuid-funktionen)

## Logik- und Ablaufsteuerungsfunktionen

Helm enthält zahlreiche Logik- und Ablaufsteuerungsfunktionen, darunter [and](#and),
[coalesce](#coalesce), [default](#default), [empty](#empty), [eq](#eq),
[fail](#fail), [ge](#ge), [gt](#gt), [le](#le), [lt](#lt), [ne](#ne),
[not](#not), [or](#or) und [required](#required).

### and

Gibt das boolesche AND von zwei oder mehr Argumenten zurück
(das erste leere Argument oder das letzte Argument).

```
and .Arg1 .Arg2
```

### or

Gibt das boolesche OR von zwei oder mehr Argumenten zurück
(das erste nicht-leere Argument oder das letzte Argument).

```
or .Arg1 .Arg2
```

### not

Gibt die boolesche Negation des Arguments zurück.

```
not .Arg
```

### eq

Gibt die boolesche Gleichheit der Argumente zurück (z.B. Arg1 == Arg2).

```
eq .Arg1 .Arg2
```

### ne

Gibt die boolesche Ungleichheit der Argumente zurück (z.B. Arg1 != Arg2).

```
ne .Arg1 .Arg2
```

### lt

Gibt `true` zurück, wenn das erste Argument kleiner als das zweite ist.
Andernfalls wird `false` zurückgegeben (z.B. Arg1 < Arg2).

```
lt .Arg1 .Arg2
```

### le

Gibt `true` zurück, wenn das erste Argument kleiner oder gleich dem zweiten ist.
Andernfalls wird `false` zurückgegeben (z.B. Arg1 <= Arg2).

```
le .Arg1 .Arg2
```

### gt

Gibt `true` zurück, wenn das erste Argument größer als das zweite ist.
Andernfalls wird `false` zurückgegeben (z.B. Arg1 > Arg2).

```
gt .Arg1 .Arg2
```

### ge

Gibt `true` zurück, wenn das erste Argument größer oder gleich dem zweiten ist.
Andernfalls wird `false` zurückgegeben (z.B. Arg1 >= Arg2).

```
ge .Arg1 .Arg2
```

### default

Um einen einfachen Standardwert zu setzen, verwenden Sie `default`:

```
default "foo" .Bar
```

Wenn `.Bar` einen nicht-leeren Wert ergibt, wird dieser verwendet. Ist er
jedoch leer, wird stattdessen `foo` zurückgegeben.

Die Definition von "leer" hängt vom Typ ab:

- Numerisch: 0
- String: ""
- Listen: `[]`
- Dicts: `{}`
- Boolean: `false`
- Und immer `nil` (auch bekannt als null)

Für Structs gibt es keine Definition von leer, daher gibt ein Struct niemals
den Standardwert zurück.

### required

Geben Sie Werte an, die mit `required` gesetzt werden müssen:

```
required "A valid foo is required!" .Bar
```

Wenn `.Bar` leer oder nicht definiert ist (siehe [default](#default) für die
Auswertung), wird das Template nicht gerendert und stattdessen die angegebene
Fehlermeldung zurückgegeben.

### empty

Die Funktion `empty` gibt `true` zurück, wenn der angegebene Wert als leer
gilt, andernfalls `false`. Die leeren Werte sind im Abschnitt `default`
aufgelistet.

```
empty .Foo
```

Beachten Sie, dass in Go-Template-Bedingungen die Leerheit automatisch
berechnet wird. Daher benötigen Sie selten `if not empty .Foo`. Verwenden Sie
stattdessen einfach `if .Foo`.

### fail

Gibt bedingungslos einen leeren `string` und einen `error` mit dem angegebenen
Text zurück. Dies ist nützlich in Szenarien, in denen andere Bedingungen
festgestellt haben, dass das Template-Rendering fehlschlagen sollte.

```
fail "Please accept the end user license agreement"
```

### coalesce

Die Funktion `coalesce` nimmt eine Liste von Werten und gibt den ersten
nicht-leeren zurück.

```
coalesce 0 1 2
```

Das obige gibt `1` zurück.

Diese Funktion ist nützlich, um mehrere Variablen oder Werte zu durchsuchen:

```
coalesce .name .parent.name "Matt"
```

Das obige prüft zunächst, ob `.name` leer ist. Falls nicht, wird dieser Wert
zurückgegeben. Falls er _leer ist_, wertet `coalesce` `.parent.name` auf
Leerheit aus. Wenn schließlich sowohl `.name` als auch `.parent.name` leer
sind, wird `Matt` zurückgegeben.

### ternary

Die Funktion `ternary` nimmt zwei Werte und einen Testwert. Wenn der Testwert
`true` ist, wird der erste Wert zurückgegeben. Wenn der Testwert leer ist, wird
der zweite Wert zurückgegeben. Dies ähnelt dem ternären Operator in C und
anderen Programmiersprachen.

#### true-Testwert

```
ternary "foo" "bar" true
```

oder

```
true | ternary "foo" "bar"
```

Das obige gibt `"foo"` zurück.

#### false-Testwert

```
ternary "foo" "bar" false
```

oder

```
false | ternary "foo" "bar"
```

Das obige gibt `"bar"` zurück.

## String-Funktionen

Helm enthält die folgenden String-Funktionen: [abbrev](#abbrev),
[abbrevboth](#abbrevboth), [camelcase](#camelcase), [cat](#cat),
[contains](#contains), [hasPrefix](#hasprefix-und-hassuffix),
[hasSuffix](#hasprefix-und-hassuffix), [indent](#indent), [initials](#initials),
[kebabcase](#kebabcase), [lower](#lower), [nindent](#nindent),
[nospace](#nospace), [plural](#plural), [print](#print), [printf](#printf),
[println](#println), [quote](#quote-und-squote),
[randAlpha](#randalphanum-randalpha-randnumeric-und-randascii),
[randAlphaNum](#randalphanum-randalpha-randnumeric-und-randascii),
[randAscii](#randalphanum-randalpha-randnumeric-und-randascii),
[randNumeric](#randalphanum-randalpha-randnumeric-und-randascii),
[repeat](#repeat), [replace](#replace), [shuffle](#shuffle),
[snakecase](#snakecase), [squote](#quote-und-squote), [substr](#substr),
[swapcase](#swapcase), [title](#title), [trim](#trim), [trimAll](#trimall),
[trimPrefix](#trimprefix), [trimSuffix](#trimsuffix), [trunc](#trunc),
[untitle](#untitle), [upper](#upper), [wrap](#wrap) und [wrapWith](#wrapwith).

### print

Gibt einen String aus der Kombination seiner Teile zurück.

```
print "Matt has " .Dogs " dogs"
```

Typen, die keine Strings sind, werden nach Möglichkeit in Strings konvertiert.

Beachten Sie, dass zwischen zwei nebeneinanderstehenden Argumenten, die keine
Strings sind, ein Leerzeichen eingefügt wird.

### println

Funktioniert wie [print](#print), fügt aber am Ende eine neue Zeile hinzu.

### printf

Gibt einen String basierend auf einem Formatierungsstring und den übergebenen
Argumenten zurück.

```
printf "%s has %d dogs." .Name .NumberDogs
```

Der zu verwendende Platzhalter hängt vom Typ des übergebenen Arguments ab.
Dies umfasst:

Allgemein:

* `%v` der Wert im Standardformat
  * beim Drucken von Dicts fügt das Plus-Flag (%+v) Feldnamen hinzu
* `%%` ein literales Prozentzeichen; verbraucht keinen Wert

Boolean:

* `%t` das Wort true oder false

Integer:

* `%b` Basis 2
* `%c` das Zeichen, das durch den entsprechenden Unicode-Codepunkt dargestellt wird
* `%d` Basis 10
* `%o` Basis 8
* `%O` Basis 8 mit 0o-Präfix
* `%q` ein einzeln zitiertes Zeichenliteral, sicher escaped
* `%x` Basis 16, mit Kleinbuchstaben für a-f
* `%X` Basis 16, mit Großbuchstaben für A-F
* `%U` Unicode-Format: U+1234; entspricht "U+%04X"

Fließkomma- und komplexe Bestandteile:

* `%b` dezimale wissenschaftliche Notation mit Exponent als Zweierpotenz, z.B.
  -123456p-78
* `%e` wissenschaftliche Notation, z.B. -1.234456e+78
* `%E` wissenschaftliche Notation, z.B. -1.234456E+78
* `%f` Dezimalpunkt ohne Exponent, z.B. 123.456
* `%F` Synonym für %f
* `%g` %e für große Exponenten, sonst %f
* `%G` %E für große Exponenten, sonst %F
* `%x` hexadezimale Notation (mit dezimaler Zweierpotenz als Exponent), z.B.
  -0x1.23abcp+20
* `%X` hexadezimale Notation in Großbuchstaben, z.B. -0X1.23ABCP+20

String und Byte-Slice (werden gleichwertig behandelt mit diesen Verben):

* `%s` die nicht interpretierten Bytes des Strings oder Slice
* `%q` ein doppelt zitierter String, sicher escaped
* `%x` Basis 16, Kleinbuchstaben, zwei Zeichen pro Byte
* `%X` Basis 16, Großbuchstaben, zwei Zeichen pro Byte

Slice:

* `%p` Adresse des 0. Elements in Basis-16-Notation mit führendem 0x

### trim

Die Funktion `trim` entfernt Leerzeichen von beiden Seiten eines Strings:

```
trim "   hello    "
```

Das obige erzeugt `hello`

### trimAll

Entfernt die angegebenen Zeichen vorne und hinten aus einem String:

```
trimAll "$" "$5.00"
```

Das obige gibt `5.00` zurück (als String).

### trimPrefix

Entfernt nur das Präfix aus einem String:

```
trimPrefix "-" "-hello"
```

Das obige gibt `hello` zurück

### trimSuffix

Entfernt nur das Suffix aus einem String:

```
trimSuffix "-" "hello-"
```

Das obige gibt `hello` zurück

### lower

Konvertiert den gesamten String in Kleinbuchstaben:

```
lower "HELLO"
```

Das obige gibt `hello` zurück

### upper

Konvertiert den gesamten String in Großbuchstaben:

```
upper "hello"
```

Das obige gibt `HELLO` zurück

### title

Konvertiert in Titel-Schreibweise:

```
title "hello world"
```

Das obige gibt `Hello World` zurück

### untitle

Entfernt die Titel-Schreibweise. `untitle "Hello World"` erzeugt `hello world`.

### repeat

Wiederholt einen String mehrfach:

```
repeat 3 "hello"
```

Das obige gibt `hellohellohello` zurück

### substr

Holt einen Teilstring aus einem String. Es werden drei Parameter benötigt:

- start (int)
- end (int)
- string (string)

```
substr 0 5 "hello world"
```

Das obige gibt `hello` zurück

### nospace

Entfernt alle Leerzeichen aus einem String.

```
nospace "hello w o r l d"
```

Das obige gibt `helloworld` zurück

### trunc

Kürzt einen String

```
trunc 5 "hello world"
```

Das obige erzeugt `hello`.

```
trunc -5 "hello world"
```

Das obige erzeugt `world`.

### abbrev

Kürzt einen String mit Auslassungspunkten (`...`)

Parameter:

- maximale Länge
- der String

```
abbrev 5 "hello world"
```

Das obige gibt `he...` zurück, da die Breite der Auslassungspunkte gegen die
maximale Länge gerechnet wird.

### abbrevboth

Kürzt auf beiden Seiten:

```
abbrevboth 5 10 "1234 5678 9123"
```

Das obige erzeugt `...5678...`

Es werden benötigt:

- linker Offset
- maximale Länge
- der String

### initials

Nimmt bei mehreren Wörtern den ersten Buchstaben jedes Wortes und kombiniert sie.

```
initials "First Try"
```

Das obige gibt `FT` zurück

### randAlphaNum, randAlpha, randNumeric und randAscii

Diese vier Funktionen generieren kryptografisch sichere (verwendet
```crypto/rand```) zufällige Strings, aber mit unterschiedlichen
Basis-Zeichensätzen:

- `randAlphaNum` verwendet `0-9a-zA-Z`
- `randAlpha` verwendet `a-zA-Z`
- `randNumeric` verwendet `0-9`
- `randAscii` verwendet alle druckbaren ASCII-Zeichen

Jede nimmt einen Parameter: die ganzzahlige Länge des Strings.

```
randNumeric 3
```

Das obige erzeugt einen zufälligen String mit drei Ziffern.

### wrap

Umbricht Text bei einer angegebenen Spaltenanzahl:

```
wrap 80 $someText
```

Das obige umbricht den String in `$someText` bei 80 Spalten.

### wrapWith

`wrapWith` funktioniert wie `wrap`, aber erlaubt die Angabe des
Umbruch-Strings. (`wrap` verwendet `\n`)

```
wrapWith 5 "\t" "Hello World"
```

Das obige erzeugt `Hello World` (wobei das Leerzeichen ein ASCII-Tabulatorzeichen ist)

### contains

Prüft, ob ein String in einem anderen enthalten ist:

```
contains "cat" "catch"
```

Das obige gibt `true` zurück, weil `catch` das Wort `cat` enthält.

### hasPrefix und hasSuffix

Die Funktionen `hasPrefix` und `hasSuffix` prüfen, ob ein String ein bestimmtes
Präfix oder Suffix hat:

```
hasPrefix "cat" "catch"
```

Das obige gibt `true` zurück, weil `catch` das Präfix `cat` hat.

### quote und squote

Diese Funktionen umschließen einen String mit doppelten Anführungszeichen
(`quote`) oder einfachen Anführungszeichen (`squote`).

### cat

Die Funktion `cat` verkettet mehrere Strings zu einem und trennt sie durch
Leerzeichen:

```
cat "hello" "beautiful" "world"
```

Das obige erzeugt `hello beautiful world`

### indent

Die Funktion `indent` rückt jede Zeile in einem gegebenen String um die
angegebene Einrückungsbreite ein. Dies ist nützlich beim Ausrichten von
mehrzeiligen Strings:

```
indent 4 $lots_of_text
```

Das obige rückt jede Textzeile um 4 Leerzeichen ein.

### nindent

Die Funktion `nindent` ist identisch mit der Funktion indent, stellt aber eine
neue Zeile an den Anfang des Strings.

```
nindent 4 $lots_of_text
```

Das obige rückt jede Textzeile um 4 Leerzeichen ein und fügt am Anfang eine
neue Zeile hinzu.

### replace

Führt eine einfache String-Ersetzung durch.

Es werden drei Argumente benötigt:

- zu ersetzender String
- Ersetzungs-String
- Quell-String

```
"I Am Henry VIII" | replace " " "-"
```

Das obige erzeugt `I-Am-Henry-VIII`

### plural

Pluralisiert einen String.

```
len $fish | plural "one anchovy" "many anchovies"
```

Wenn die Länge des Strings 1 ist, wird das erste Argument ausgegeben (`one
anchovy`). Andernfalls wird das zweite Argument ausgegeben (`many anchovies`).

Die Argumente sind:

- Singular-String
- Plural-String
- Länge als Integer

HINWEIS: Helm unterstützt derzeit keine Sprachen mit komplexeren
Pluralbildungsregeln. Und `0` wird als Plural betrachtet, weil die englische
Sprache es so behandelt (`zero anchovies`).

### snakecase

Konvertiert einen String von camelCase in snake_case.

```
snakecase "FirstName"
```

Das obige erzeugt `first_name`.

### camelcase

Konvertiert einen String von snake_case in CamelCase.

```
camelcase "http_server"
```

Das obige erzeugt `HttpServer`.

### kebabcase

Konvertiert einen String von camelCase in kebab-case.

```
kebabcase "FirstName"
```

Das obige erzeugt `first-name`.

### swapcase

Tauscht die Groß-/Kleinschreibung eines Strings mit einem wortbasierten
Algorithmus.

Konvertierungsalgorithmus:

- Großbuchstabe wird zu Kleinbuchstabe
- Titelbuchstabe wird zu Kleinbuchstabe
- Kleinbuchstabe nach Leerzeichen oder am Anfang wird zu Titelbuchstabe
- Andere Kleinbuchstaben werden zu Großbuchstaben
- Leerzeichen wird durch unicode.IsSpace(char) definiert

```
swapcase "This Is A.Test"
```

Das obige erzeugt `tHIS iS a.tEST`.

### shuffle

Mischt einen String.

```
shuffle "hello"
```

Das obige randomisiert die Buchstaben in `hello` und erzeugt möglicherweise
`oelhl`.

## Typkonvertierungsfunktionen

Die folgenden Typkonvertierungsfunktionen werden von Helm bereitgestellt:

- `atoi`: Konvertiert einen String in einen Integer.
- `float64`: Konvertiert in einen `float64`.
- `int`: Konvertiert in einen `int` mit der Systembreite.
- `int64`: Konvertiert in einen `int64`.
- `toDecimal`: Konvertiert eine Unix-Oktalzahl in einen `int64`.
- `toString`: Konvertiert in einen String.
- `toStrings`: Konvertiert eine Liste, Slice oder Array in eine Liste von Strings.
- `toJson` (`mustToJson`): Konvertiert Liste, Slice, Array, Dict oder Objekt in JSON.
- `toPrettyJson` (`mustToPrettyJson`): Konvertiert Liste, Slice, Array, Dict
  oder Objekt in eingerücktes JSON.
- `toRawJson` (`mustToRawJson`): Konvertiert Liste, Slice, Array, Dict oder
  Objekt in JSON mit nicht-escaped HTML-Zeichen.
- `fromYaml`: Konvertiert einen YAML-String in ein Objekt.
- `fromJson`: Konvertiert einen JSON-String in ein Objekt.
- `fromJsonArray`: Konvertiert ein JSON-Array in eine Liste.
- `toYaml`: Konvertiert Liste, Slice, Array, Dict oder Objekt in eingerücktes
  YAML. Diese Funktion entspricht der GoLang yaml.Marshal-Funktion, siehe Dokumentation:
  https://pkg.go.dev/gopkg.in/yaml.v2#Marshal
- `toYamlPretty`: Konvertiert Liste, Slice, Array, Dict oder Objekt in
  eingerücktes YAML. Entspricht `toYaml`, rückt aber Listen zusätzlich um 2
  Leerzeichen ein.
- `toToml`: Konvertiert Liste, Slice, Array, Dict oder Objekt in TOML.
- `fromYamlArray`: Konvertiert ein YAML-Array in eine Liste.

Nur `atoi` erfordert, dass die Eingabe einen bestimmten Typ hat. Die anderen
versuchen, von jedem Typ in den Zieltyp zu konvertieren. Zum Beispiel kann
`int64` Floats in Ints und auch Strings in Ints konvertieren.

### toStrings

Erzeugt bei einer listenähnlichen Sammlung eine Liste von Strings.

```
list 1 2 3 | toStrings
```

Das obige konvertiert `1` in `"1"`, `2` in `"2"` usw. und gibt sie dann als
Liste zurück.

### toDecimal

Erzeugt aus einer Unix-Oktal-Berechtigung eine Dezimalzahl.

```
"0777" | toDecimal
```

Das obige konvertiert `0777` in `511` und gibt den Wert als int64 zurück.

### toJson, mustToJson

Die Funktion `toJson` kodiert ein Element in einen JSON-String. Wenn das
Element nicht in JSON konvertiert werden kann, gibt die Funktion einen leeren
String zurück. `mustToJson` gibt einen Fehler zurück, falls das Element nicht
in JSON kodiert werden kann.

```
toJson .Item
```

Das obige gibt die JSON-String-Darstellung von `.Item` zurück.

### toPrettyJson, mustToPrettyJson

Die Funktion `toPrettyJson` kodiert ein Element in einen formatierten
(eingerückten) JSON-String.

```
toPrettyJson .Item
```

Das obige gibt die eingerückte JSON-String-Darstellung von `.Item` zurück.

### toRawJson, mustToRawJson

Die Funktion `toRawJson` kodiert ein Element in einen JSON-String mit
nicht-escaped HTML-Zeichen.

```
toRawJson .Item
```

Das obige gibt die nicht-escaped JSON-String-Darstellung von `.Item` zurück.

### fromYaml

Die Funktion `fromYaml` nimmt einen YAML-String und gibt ein Objekt zurück,
das in Templates verwendet werden kann.

`Datei unter: yamls/person.yaml`
```yaml
name: Bob
age: 25
hobbies:
  - hiking
  - fishing
  - cooking
```
```yaml
{{- $person := .Files.Get "yamls/person.yaml" | fromYaml }}
greeting: |
  Hi, my name is {{ $person.name }} and I am {{ $person.age }} years old.
  My hobbies are {{ range $person.hobbies }}{{ . }} {{ end }}.
```

### fromJson

Die Funktion `fromJson` nimmt einen JSON-String und gibt ein Objekt zurück,
das in Templates verwendet werden kann.

`Datei unter: jsons/person.json`
```json
{
  "name": "Bob",
  "age": 25,
  "hobbies": [
    "hiking",
    "fishing",
    "cooking"
  ]
}
```
```yaml
{{- $person := .Files.Get "jsons/person.json" | fromJson }}
greeting: |
  Hi, my name is {{ $person.name }} and I am {{ $person.age }} years old.
  My hobbies are {{ range $person.hobbies }}{{ . }} {{ end }}.
```


### fromJsonArray

Die Funktion `fromJsonArray` nimmt ein JSON-Array und gibt eine Liste zurück,
die in Templates verwendet werden kann.

`Datei unter: jsons/people.json`
```json
[
 { "name": "Bob","age": 25 },
 { "name": "Ram","age": 16 }
]
```
```yaml
{{- $people := .Files.Get "jsons/people.json" | fromJsonArray }}
{{- range $person := $people }}
greeting: |
  Hi, my name is {{ $person.name }} and I am {{ $person.age }} years old.
{{ end }}
```

### toYaml, toYamlPretty

Die Funktionen `toYaml` und `toYamlPretty` kodieren ein Objekt (Liste, Slice,
Array, Dict oder Objekt) in einen eingerückten YAML-String.

> Beachten Sie, dass `toYamlPretty` funktional äquivalent ist, aber YAML mit
> zusätzlicher Einrückung für Listenelemente ausgibt

```yaml
# toYaml
- name: bob
  age: 25
  hobbies:
  - hiking
  - fishing
  - cooking
```

```yaml
# toYamlPretty
- name: bob
  age: 25
  hobbies:
    - hiking
    - fishing
    - cooking
```

### fromYamlArray

Die Funktion `fromYamlArray` nimmt ein YAML-Array und gibt eine Liste zurück,
die in Templates verwendet werden kann.

`Datei unter: yamls/people.yml`
```yaml
- name: Bob
  age: 25
- name: Ram
  age: 16
```
```yaml
{{- $people := .Files.Get "yamls/people.yml" | fromYamlArray }}
{{- range $person := $people }}
greeting: |
  Hi, my name is {{ $person.name }} and I am {{ $person.age }} years old.
{{ end }}
```


## Reguläre Ausdrücke

Helm enthält die folgenden Funktionen für reguläre Ausdrücke: [regexFind
(mustRegexFind)](#regexfindall-mustregexfindall), [regexFindAll
(mustRegexFindAll)](#regexfind-mustregexfind), [regexMatch
(mustRegexMatch)](#regexmatch-mustregexmatch), [regexReplaceAll
(mustRegexReplaceAll)](#regexreplaceall-mustregexreplaceall),
[regexReplaceAllLiteral
(mustRegexReplaceAllLiteral)](#regexreplaceallliteral-mustregexreplaceallliteral),
[regexSplit (mustRegexSplit)](#regexsplit-mustregexsplit).

### regexMatch, mustRegexMatch

Gibt `true` zurück, wenn der Eingabe-String eine Übereinstimmung mit dem
regulären Ausdruck enthält.

```
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"
```

Das obige erzeugt `true`

`regexMatch` löst einen Panic aus, wenn ein Problem auftritt, und
`mustRegexMatch` gibt einen Fehler an die Template-Engine zurück, wenn ein
Problem auftritt.

### regexFindAll, mustRegexFindAll

Gibt eine Liste aller Übereinstimmungen des regulären Ausdrucks im
Eingabe-String zurück. Der letzte Parameter n bestimmt die Anzahl der
zurückzugebenden Teilstrings, wobei -1 bedeutet, dass alle Übereinstimmungen
zurückgegeben werden.

```
regexFindAll "[2,4,6,8]" "123456789" -1
```

Das obige erzeugt `[2 4 6 8]`

`regexFindAll` löst einen Panic aus, wenn ein Problem auftritt, und
`mustRegexFindAll` gibt einen Fehler an die Template-Engine zurück, wenn ein
Problem auftritt.

### regexFind, mustRegexFind

Gibt die erste (am weitesten links stehende) Übereinstimmung des regulären
Ausdrucks im Eingabe-String zurück.

```
regexFind "[a-zA-Z][1-9]" "abcd1234"
```

Das obige erzeugt `d1`

`regexFind` löst einen Panic aus, wenn ein Problem auftritt, und
`mustRegexFind` gibt einen Fehler an die Template-Engine zurück, wenn ein
Problem auftritt.

### regexReplaceAll, mustRegexReplaceAll

Gibt eine Kopie des Eingabe-Strings zurück, wobei Übereinstimmungen des
regulären Ausdrucks durch den Ersetzungs-String ersetzt werden. Innerhalb des
Ersetzungs-Strings werden $-Zeichen wie bei Expand interpretiert, sodass z.B.
$1 den Text der ersten Unterübereinstimmung darstellt. Das erste Argument ist
`<pattern>`, das zweite ist `<input>` und das dritte ist `<replacement>`.

```
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

Das obige erzeugt `-W-xxW-`

`regexReplaceAll` löst einen Panic aus, wenn ein Problem auftritt, und
`mustRegexReplaceAll` gibt einen Fehler an die Template-Engine zurück, wenn ein
Problem auftritt.

### regexReplaceAllLiteral, mustRegexReplaceAllLiteral

Gibt eine Kopie des Eingabe-Strings zurück, wobei Übereinstimmungen des
regulären Ausdrucks durch den Ersetzungs-String ersetzt werden. Der
Ersetzungs-String wird direkt eingesetzt, ohne Expand zu verwenden. Das erste
Argument ist `<pattern>`, das zweite ist `<input>` und das dritte ist
`<replacement>`.

```
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"
```

Das obige erzeugt `-${1}-${1}-`

`regexReplaceAllLiteral` löst einen Panic aus, wenn ein Problem auftritt, und
`mustRegexReplaceAllLiteral` gibt einen Fehler an die Template-Engine zurück,
wenn ein Problem auftritt.

### regexSplit, mustRegexSplit

Teilt den Eingabe-String in Teilstrings auf, die durch den Ausdruck getrennt
sind, und gibt eine Liste der Teilstrings zwischen diesen
Ausdrucksübereinstimmungen zurück. Der letzte Parameter `n` bestimmt die Anzahl
der zurückzugebenden Teilstrings, wobei `-1` bedeutet, dass alle
Übereinstimmungen zurückgegeben werden.

```
regexSplit "z+" "pizza" -1
```

Das obige erzeugt `[pi a]`

`regexSplit` löst einen Panic aus, wenn ein Problem auftritt, und
`mustRegexSplit` gibt einen Fehler an die Template-Engine zurück, wenn ein
Problem auftritt.

## Kryptografie- und Sicherheitsfunktionen

Helm bietet einige fortgeschrittene kryptografische Funktionen. Diese umfassen
[adler32sum](#adler32sum), [buildCustomCert](#buildcustomcert),
[decryptAES](#decryptaes), [derivePassword](#derivepassword),
[encryptAES](#encryptaes), [genCA](#genca), [genPrivateKey](#genprivatekey),
[genSelfSignedCert](#genselfsignedcert), [genSignedCert](#gensignedcert),
[htpasswd](#htpasswd), [randBytes](#randbytes), [sha1sum](#sha1sum) und
[sha256sum](#sha256sum).

### sha1sum

Die Funktion `sha1sum` empfängt einen String und berechnet dessen SHA1-Digest.

```
sha1sum "Hello world!"
```

### sha256sum

Die Funktion `sha256sum` empfängt einen String und berechnet dessen SHA256-Digest.

```
sha256sum "Hello world!"
```

Das obige berechnet die SHA-256-Summe in einem "ASCII-armored"-Format, das
sicher gedruckt werden kann.

### adler32sum

Die Funktion `adler32sum` empfängt einen String und berechnet dessen
Adler-32-Prüfsumme.

```
adler32sum "Hello world!"
```

### htpasswd

Die Funktion `htpasswd` nimmt einen `username` und ein `password` und erzeugt
einen `bcrypt`-Hash des Passworts. Das Ergebnis kann für die
Basis-Authentifizierung auf einem [Apache HTTP
Server](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html#basic)
verwendet werden.

```
htpasswd "myUser" "myPassword"
```

Beachten Sie, dass es unsicher ist, das Passwort direkt im Template zu speichern.

### randBytes

Die Funktion randBytes akzeptiert eine Anzahl N und erzeugt eine
kryptografisch sichere (verwendet crypto/rand) zufällige Sequenz von N Bytes.
Die Sequenz wird als base64-kodierter String zurückgegeben.

```
randBytes 24
```

### derivePassword

Die Funktion `derivePassword` kann verwendet werden, um ein bestimmtes Passwort
basierend auf einigen gemeinsamen "Master-Passwort"-Beschränkungen abzuleiten.
Der Algorithmus dafür ist [gut
spezifiziert](https://web.archive.org/web/20211019121301/https://masterpassword.app/masterpassword-algorithm.pdf).

```
derivePassword 1 "long" "password" "user" "example.com"
```

Beachten Sie, dass es als unsicher gilt, die Teile direkt im Template zu speichern.

### genPrivateKey

Die Funktion `genPrivateKey` erzeugt einen neuen privaten Schlüssel, der in
einen PEM-Block kodiert ist.

Sie nimmt einen der folgenden Werte als ersten Parameter:

- `ecdsa`: Erzeugt einen elliptischen Kurven-DSA-Schlüssel (P256)
- `dsa`: Erzeugt einen DSA-Schlüssel (L2048N256)
- `rsa`: Erzeugt einen RSA-4096-Schlüssel

### buildCustomCert

Die Funktion `buildCustomCert` ermöglicht die Anpassung des Zertifikats.

Sie nimmt die folgenden String-Parameter:

- Ein base64-kodiertes Zertifikat im PEM-Format
- Ein base64-kodierter privater Schlüssel im PEM-Format

Sie gibt ein Zertifikatsobjekt mit den folgenden Attributen zurück:

- `Cert`: Ein PEM-kodiertes Zertifikat
- `Key`: Ein PEM-kodierter privater Schlüssel

Beispiel:

```
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
```

Beachten Sie, dass das zurückgegebene Objekt an die Funktion `genSignedCert`
übergeben werden kann, um ein Zertifikat mit dieser CA zu signieren.

### genCA

Die Funktion `genCA` erzeugt ein neues, selbstsigniertes
x509-Zertifizierungsstellenzertifikat.

Sie nimmt die folgenden Parameter:

- Common Name (cn) des Subjekts
- Gültigkeitsdauer des Zertifikats in Tagen

Sie gibt ein Objekt mit den folgenden Attributen zurück:

- `Cert`: Ein PEM-kodiertes Zertifikat
- `Key`: Ein PEM-kodierter privater Schlüssel

Beispiel:

```
$ca := genCA "foo-ca" 365
```

Beachten Sie, dass das zurückgegebene Objekt an die Funktion `genSignedCert`
übergeben werden kann, um ein Zertifikat mit dieser CA zu signieren.

### genSelfSignedCert

Die Funktion `genSelfSignedCert` erzeugt ein neues, selbstsigniertes
x509-Zertifikat.

Sie nimmt die folgenden Parameter:

- Common Name (cn) des Subjekts
- Optionale Liste von IPs; kann nil sein
- Optionale Liste alternativer DNS-Namen; kann nil sein
- Gültigkeitsdauer des Zertifikats in Tagen

Sie gibt ein Objekt mit den folgenden Attributen zurück:

- `Cert`: Ein PEM-kodiertes Zertifikat
- `Key`: Ein PEM-kodierter privater Schlüssel

Beispiel:

```
$cert := genSelfSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365
```

### genSignedCert

Die Funktion `genSignedCert` erzeugt ein neues x509-Zertifikat, das von der
angegebenen CA signiert ist.

Sie nimmt die folgenden Parameter:

- Common Name (cn) des Subjekts
- Optionale Liste von IPs; kann nil sein
- Optionale Liste alternativer DNS-Namen; kann nil sein
- Gültigkeitsdauer des Zertifikats in Tagen
- CA (siehe `genCA`)

Beispiel:

```
$ca := genCA "foo-ca" 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

### encryptAES

Die Funktion `encryptAES` verschlüsselt Text mit AES-256 CBC und gibt einen
base64-kodierten String zurück.

```
encryptAES "secretkey" "plaintext"
```

### decryptAES

Die Funktion `decryptAES` empfängt einen base64-String, der mit dem
AES-256-CBC-Algorithmus kodiert wurde, und gibt den entschlüsselten Text zurück.

```
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

## Datumsfunktionen

Helm enthält die folgenden Datumsfunktionen, die Sie in Templates verwenden
können: [ago](#ago), [date](#date), [dateInZone](#dateinzone), [dateModify
(mustDateModify)](#datemodify-mustdatemodify), [duration](#duration),
[durationRound](#durationround), [htmlDate](#htmldate),
[htmlDateInZone](#htmldateinzone), [now](#now), [toDate
(mustToDate)](#todate-musttodate) und [unixEpoch](#unixepoch).

### now

Das aktuelle Datum/Uhrzeit. Verwenden Sie dies in Verbindung mit anderen
Datumsfunktionen.

### ago

Die Funktion `ago` gibt die Dauer seit einer Zeit zurück. Jetzt in
Sekundenauflösung.

```
ago .CreatedAt
```

gibt im `time.Duration` String()-Format zurück

```
2h34m7s
```

### date

Die Funktion `date` formatiert ein Datum.

Formatiert das Datum als JAHR-MONAT-TAG:

```
now | date "2006-01-02"
```

Die Datumsformatierung in Go ist [etwas
anders](https://pauladamsmith.com/blog/2011/05/go_time.html).

Kurz gesagt, nehmen Sie dies als Basisdatum:

```
Mon Jan 2 15:04:05 MST 2006
```

Schreiben Sie es in dem Format, das Sie möchten. Oben ist `2006-01-02` dasselbe
Datum, aber in dem gewünschten Format.

### dateInZone

Wie `date`, aber mit einer Zeitzone.

```
dateInZone "2006-01-02" (now) "UTC"
```

### duration

Formatiert eine gegebene Anzahl von Sekunden als `time.Duration`.

Dies gibt 1m35s zurück

```
duration "95"
```

### durationRound

Rundet eine gegebene Dauer auf die signifikanteste Einheit. Strings und
`time.Duration` werden als Dauer geparst, während eine `time.Time` als die
Dauer seit diesem Zeitpunkt berechnet wird.

Dies gibt 2h zurück

```
durationRound "2h10m5s"
```

Dies gibt 3mo zurück

```
durationRound "2400h10m5s"
```

### unixEpoch

Gibt die Sekunden seit der Unix-Epoche für eine `time.Time` zurück.

```
now | unixEpoch
```

### dateModify, mustDateModify

Die Funktion `dateModify` nimmt eine Modifikation und ein Datum und gibt den
Zeitstempel zurück.

Subtrahiert eine Stunde und dreißig Minuten von der aktuellen Zeit:

```
now | dateModify "-1.5h"
```

Wenn das Modifikationsformat falsch ist, gibt `dateModify` das Datum unverändert
zurück. `mustDateModify` gibt andernfalls einen Fehler zurück.

### htmlDate

Die Funktion `htmlDate` formatiert ein Datum zum Einfügen in ein
HTML-Datumsauswahl-Eingabefeld.

```
now | htmlDate
```

### htmlDateInZone

Wie htmlDate, aber mit einer Zeitzone.

```
htmlDateInZone (now) "UTC"
```

### toDate, mustToDate

`toDate` konvertiert einen String in ein Datum. Das erste Argument ist das
Datumslayout und das zweite der Datums-String. Wenn der String nicht
konvertiert werden kann, wird der Nullwert zurückgegeben. `mustToDate` gibt
einen Fehler zurück, falls der String nicht konvertiert werden kann.

Dies ist nützlich, wenn Sie einen Datums-String in ein anderes Format
konvertieren möchten (mit Pipe). Das folgende Beispiel konvertiert "2017-12-31"
in "31/12/2017".

```
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

## Dictionaries und Dict-Funktionen

Helm bietet einen Schlüssel/Wert-Speichertyp namens `dict` (kurz für
"Dictionary", wie in Python). Ein `dict` ist ein _ungeordneter_ Typ.

Der Schlüssel eines Dictionary **muss ein String sein**. Der Wert kann jedoch
jeden Typ haben, einschließlich eines anderen `dict` oder einer `list`.

Im Gegensatz zu `list`s sind `dict`s nicht unveränderlich. Die Funktionen `set`
und `unset` ändern den Inhalt eines Dictionary.

Helm bietet die folgenden Funktionen zur Arbeit mit Dicts: [deepCopy
(mustDeepCopy)](#deepcopy-mustdeepcopy), [dict](#dict), [dig](#dig), [get](#get),
[hasKey](#haskey), [keys](#keys), [merge (mustMerge)](#merge-mustmerge),
[mergeOverwrite (mustMergeOverwrite)](#mergeoverwrite-mustmergeoverwrite),
[omit](#omit), [pick](#pick), [pluck](#pluck), [set](#set), [unset](#unset) und
[values](#values).

### dict

Das Erstellen von Dictionaries erfolgt durch Aufrufen der Funktion `dict` und
Übergeben einer Liste von Paaren.

Das Folgende erstellt ein Dictionary mit drei Elementen:

```
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
```

### get

Holt bei gegebenem Map und Schlüssel den Wert aus dem Map.

```
get $myDict "name1"
```

Das obige gibt `"value1"` zurück

Beachten Sie, dass diese Operation einfach `""` zurückgibt, wenn der Schlüssel
nicht gefunden wird. Es wird kein Fehler erzeugt.

### set

Verwenden Sie `set`, um ein neues Schlüssel/Wert-Paar zu einem Dictionary
hinzuzufügen.

```
$_ := set $myDict "name4" "value4"
```

Beachten Sie, dass `set` _das Dictionary zurückgibt_ (eine Anforderung von
Go-Template-Funktionen), daher müssen Sie den Wert möglicherweise wie oben mit
der `$_`-Zuweisung auffangen.

### unset

Löscht bei gegebenem Map und Schlüssel den Schlüssel aus dem Map.

```
$_ := unset $myDict "name4"
```

Wie bei `set` gibt dies das Dictionary zurück.

Beachten Sie, dass diese Operation einfach zurückkehrt, wenn der Schlüssel
nicht gefunden wird. Es wird kein Fehler erzeugt.

### hasKey

Die Funktion `hasKey` gibt `true` zurück, wenn das gegebene Dict den gegebenen
Schlüssel enthält.

```
hasKey $myDict "name1"
```

Wenn der Schlüssel nicht gefunden wird, gibt dies `false` zurück.

### pluck

Die Funktion `pluck` ermöglicht es, einen Schlüssel und mehrere Maps anzugeben
und eine Liste aller Übereinstimmungen zu erhalten:

```
pluck "name1" $myDict $myOtherDict
```

Das obige gibt eine `list` zurück, die jeden gefundenen Wert enthält (`[value1
otherValue1]`).

Wenn der gegebene Schlüssel _nicht gefunden_ wird in einem Map, hat dieses Map
kein Element in der Liste (und die Länge der zurückgegebenen Liste ist kleiner
als die Anzahl der Dicts im Aufruf von `pluck`).

Wenn der Schlüssel _gefunden_ wird, aber der Wert ein leerer Wert ist, wird
dieser Wert eingefügt.

Ein gängiges Idiom in Helm-Templates ist die Verwendung von `pluck... | first`,
um den ersten passenden Schlüssel aus einer Sammlung von Dictionaries zu erhalten.

### dig

Die Funktion `dig` durchläuft eine verschachtelte Menge von Dicts und wählt
Schlüssel aus einer Werteliste aus. Sie gibt einen Standardwert zurück, wenn
einer der Schlüssel im zugehörigen Dict nicht gefunden wird.

```
dig "user" "role" "humanName" "guest" $dict
```

Bei einem Dict mit folgender Struktur
```
{
  user: {
    role: {
      humanName: "curator"
    }
  }
}
```

würde das obige `"curator"` zurückgeben. Wenn das Dict nicht einmal ein
`user`-Feld hätte, wäre das Ergebnis `"guest"`.

Dig kann sehr nützlich sein in Fällen, in denen Sie Schutzklauseln vermeiden
möchten, besonders da das `and` des Go-Template-Pakets nicht kurzschließt.
Zum Beispiel wird `and a.maybeNil a.maybeNil.iNeedThis` immer
`a.maybeNil.iNeedThis` auswerten und einen Panic auslösen, wenn `a` kein
`maybeNil`-Feld hat.)

`dig` akzeptiert sein Dict-Argument zuletzt, um Pipelining zu unterstützen. Zum Beispiel:
```
merge a b c | dig "one" "two" "three" "<missing>"
```

### merge, mustMerge

Führt zwei oder mehr Dictionaries zu einem zusammen, wobei das
Ziel-Dictionary Vorrang hat:

Gegeben:

```
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

ergibt sich:

```
newdict:
  default: default
  overwrite: me
  key: true
```
```
$newdict := merge $dest $source1 $source2
```

Dies ist eine tiefe Merge-Operation, aber keine tiefe Kopier-Operation.
Verschachtelte Objekte, die zusammengeführt werden, sind dieselbe Instanz in
beiden Dicts. Wenn Sie eine tiefe Kopie zusammen mit dem Merge möchten,
verwenden Sie die Funktion `deepCopy` zusammen mit dem Merging. Zum Beispiel:

```
deepCopy $source | merge $dest
```

`mustMerge` gibt einen Fehler zurück, falls das Merge nicht erfolgreich ist.

### mergeOverwrite, mustMergeOverwrite

Führt zwei oder mehr Dictionaries zu einem zusammen, wobei der Vorrang von
**rechts nach links** gilt, also Werte im Ziel-Dictionary überschrieben werden:

Gegeben:

```
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

ergibt sich:

```
newdict:
  default: default
  overwrite: overwritten
  key: false
```

```
$newdict := mergeOverwrite $dest $source1 $source2
```

Dies ist eine tiefe Merge-Operation, aber keine tiefe Kopier-Operation.
Verschachtelte Objekte, die zusammengeführt werden, sind dieselbe Instanz in
beiden Dicts. Wenn Sie eine tiefe Kopie zusammen mit dem Merge möchten,
verwenden Sie die Funktion `deepCopy` zusammen mit dem Merging. Zum Beispiel:

```
deepCopy $source | mergeOverwrite $dest
```

`mustMergeOverwrite` gibt einen Fehler zurück, falls das Merge nicht
erfolgreich ist.

### keys

Die Funktion `keys` gibt eine `list` aller Schlüssel in einem oder mehreren
`dict`-Typen zurück. Da ein Dictionary _ungeordnet_ ist, sind die Schlüssel
nicht in einer vorhersagbaren Reihenfolge. Sie können mit `sortAlpha` sortiert
werden.

```
keys $myDict | sortAlpha
```

Bei der Angabe mehrerer Dictionaries werden die Schlüssel verkettet. Verwenden
Sie die Funktion `uniq` zusammen mit `sortAlpha`, um eine eindeutige, sortierte
Liste von Schlüsseln zu erhalten.

```
keys $myDict $myOtherDict | uniq | sortAlpha
```

### pick

Die Funktion `pick` wählt nur die angegebenen Schlüssel aus einem Dictionary
aus und erstellt ein neues `dict`.

```
$new := pick $myDict "name1" "name2"
```

Das obige gibt `{name1: value1, name2: value2}` zurück

### omit

Die Funktion `omit` ähnelt `pick`, gibt aber ein neues `dict` mit allen
Schlüsseln zurück, die _nicht_ mit den angegebenen Schlüsseln übereinstimmen.

```
$new := omit $myDict "name1" "name3"
```

Das obige gibt `{name2: value2}` zurück

### values

Die Funktion `values` ähnelt `keys`, gibt aber eine neue `list` mit allen
Werten des Quell-`dict` zurück (nur ein Dictionary wird unterstützt).

```
$vals := values $myDict
```

Das obige gibt `list["value1", "value2", "value 3"]` zurück. Beachten Sie, dass
die Funktion `values` keine Garantien für die Reihenfolge des Ergebnisses gibt;
wenn Ihnen das wichtig ist, verwenden Sie `sortAlpha`.

### deepCopy, mustDeepCopy

Die Funktionen `deepCopy` und `mustDeepCopy` nehmen einen Wert und erstellen
eine tiefe Kopie des Wertes. Dies umfasst Dicts und andere Strukturen.
`deepCopy` löst einen Panic aus, wenn ein Problem auftritt, während
`mustDeepCopy` einen Fehler an das Template-System zurückgibt, wenn ein Fehler
auftritt.

```
dict "a" 1 "b" 2 | deepCopy
```

### Eine Anmerkung zu Dict-Interna

Ein `dict` ist in Go als `map[string]interface{}` implementiert. Go-Entwickler
können `map[string]interface{}`-Werte in den Kontext übergeben, um sie für
Templates als `dict`s verfügbar zu machen.

## Encoding-Funktionen

Helm hat die folgenden Kodierungs- und Dekodierungsfunktionen:

- `b64enc`/`b64dec`: Kodieren oder Dekodieren mit Base64
- `b32enc`/`b32dec`: Kodieren oder Dekodieren mit Base32

## Listen und List-Funktionen

Helm bietet einen einfachen `list`-Typ, der beliebige sequentielle Datenlisten
enthalten kann. Dies ähnelt Arrays oder Slices, aber Listen sind so konzipiert,
dass sie als unveränderliche Datentypen verwendet werden.

Erstellen Sie eine Liste von Integers:

```
$myList := list 1 2 3 4 5
```

Das obige erstellt eine Liste von `[1 2 3 4 5]`.

Helm bietet die folgenden List-Funktionen: [append
(mustAppend)](#append-mustappend), [chunk](#chunk), [compact
(mustCompact)](#compact-mustcompact), [concat](#concat), [first
(mustFirst)](#first-mustfirst), [has (mustHas)](#has-musthas), [initial
(mustInitial)](#initial-mustinitial), [last (mustLast)](#last-mustlast),
[prepend (mustPrepend)](#prepend-mustprepend), [rest
(mustRest)](#rest-mustrest), [reverse (mustReverse)](#reverse-mustreverse),
[seq](#seq), [index](#index), [slice (mustSlice)](#slice-mustslice), [uniq
(mustUniq)](#uniq-mustuniq), [until](#until), [untilStep](#untilstep) und
[without (mustWithout)](#without-mustwithout).

### first, mustFirst

Um das erste Element einer Liste zu erhalten, verwenden Sie `first`.

`first $myList` gibt `1` zurück

`first` löst einen Panic aus, wenn ein Problem auftritt, während `mustFirst`
einen Fehler an die Template-Engine zurückgibt, wenn ein Problem auftritt.

### rest, mustRest

Um den Rest der Liste zu erhalten (alles außer dem ersten Element), verwenden
Sie `rest`.

`rest $myList` gibt `[2 3 4 5]` zurück

`rest` löst einen Panic aus, wenn ein Problem auftritt, während `mustRest`
einen Fehler an die Template-Engine zurückgibt, wenn ein Problem auftritt.

### last, mustLast

Um das letzte Element einer Liste zu erhalten, verwenden Sie `last`:

`last $myList` gibt `5` zurück. Dies entspricht ungefähr dem Umkehren einer
Liste und dem anschließenden Aufrufen von `first`.

### initial, mustInitial

Dies ergänzt `last`, indem alle Elemente _außer_ dem letzten zurückgegeben
werden. `initial $myList` gibt `[1 2 3 4]` zurück.

`initial` löst einen Panic aus, wenn ein Problem auftritt, während
`mustInitial` einen Fehler an die Template-Engine zurückgibt, wenn ein Problem
auftritt.

### append, mustAppend

Fügt ein neues Element zu einer bestehenden Liste hinzu und erstellt eine neue
Liste.

```
$new = append $myList 6
```

Das obige würde `$new` auf `[1 2 3 4 5 6]` setzen. `$myList` bleibt unverändert.

`append` löst einen Panic aus, wenn ein Problem auftritt, während `mustAppend`
einen Fehler an die Template-Engine zurückgibt, wenn ein Problem auftritt.

### prepend, mustPrepend

Fügt ein Element am Anfang einer Liste ein und erstellt eine neue Liste.

```
prepend $myList 0
```

Das obige würde `[0 1 2 3 4 5]` erzeugen. `$myList` bleibt unverändert.

`prepend` löst einen Panic aus, wenn ein Problem auftritt, während `mustPrepend`
einen Fehler an die Template-Engine zurückgibt, wenn ein Problem auftritt.

### concat

Verkettet eine beliebige Anzahl von Listen zu einer.

```
concat $myList ( list 6 7 ) ( list 8 )
```

Das obige würde `[1 2 3 4 5 6 7 8]` erzeugen. `$myList` bleibt unverändert.

### reverse, mustReverse

Erzeugt eine neue Liste mit den umgekehrten Elementen der gegebenen Liste.

```
reverse $myList
```

Das obige würde die Liste `[5 4 3 2 1]` erzeugen.

`reverse` löst einen Panic aus, wenn ein Problem auftritt, während
`mustReverse` einen Fehler an die Template-Engine zurückgibt, wenn ein Problem
auftritt.

### uniq, mustUniq

Erzeugt eine Liste, aus der alle Duplikate entfernt wurden.

```
list 1 1 1 2 | uniq
```

Das obige würde `[1 2]` erzeugen

`uniq` löst einen Panic aus, wenn ein Problem auftritt, während `mustUniq`
einen Fehler an die Template-Engine zurückgibt, wenn ein Problem auftritt.

### without, mustWithout

Die Funktion `without` filtert Elemente aus einer Liste heraus.

```
without $myList 3
```

Das obige würde `[1 2 4 5]` erzeugen

`without` kann mehr als einen Filter haben:

```
without $myList 1 3 5
```

Das würde `[2 4]` erzeugen

`without` löst einen Panic aus, wenn ein Problem auftritt, während
`mustWithout` einen Fehler an die Template-Engine zurückgibt, wenn ein Problem
auftritt.

### has, mustHas

Prüft, ob eine Liste ein bestimmtes Element enthält.

```
has 4 $myList
```

Das obige würde `true` zurückgeben, während `has "hello" $myList` `false`
zurückgeben würde.

`has` löst einen Panic aus, wenn ein Problem auftritt, während `mustHas` einen
Fehler an die Template-Engine zurückgibt, wenn ein Problem auftritt.

### compact, mustCompact

Akzeptiert eine Liste und entfernt Einträge mit leeren Werten.

```
$list := list 1 "a" "foo" ""
$copy := compact $list
```

`compact` gibt eine neue Liste zurück, aus der das leere (d.h. "") Element
entfernt wurde.

`compact` löst einen Panic aus, wenn ein Problem auftritt, und `mustCompact`
gibt einen Fehler an die Template-Engine zurück, wenn ein Problem auftritt.

### index

Um das n-te Element einer Liste zu erhalten, verwenden Sie `index list [n]`. Um
in mehrdimensionale Listen zu indizieren, verwenden Sie `index list [n] [m] ...`
- `index $myList 0` gibt `1` zurück. Es entspricht `myList[0]`
- `index $myList 0 1` würde `myList[0][1]` entsprechen

### slice, mustSlice

Um Teilelemente einer Liste zu erhalten, verwenden Sie `slice list [n] [m]`. Es
entspricht `list[n:m]`.

- `slice $myList` gibt `[1 2 3 4 5]` zurück. Es entspricht `myList[:]`.
- `slice $myList 3` gibt `[4 5]` zurück. Es entspricht `myList[3:]`.
- `slice $myList 1 3` gibt `[2 3]` zurück. Es entspricht `myList[1:3]`.
- `slice $myList 0 3` gibt `[1 2 3]` zurück. Es entspricht `myList[:3]`.

`slice` löst einen Panic aus, wenn ein Problem auftritt, während `mustSlice`
einen Fehler an die Template-Engine zurückgibt, wenn ein Problem auftritt.

### until

Die Funktion `until` erstellt einen Bereich von Integers.

```
until 5
```

Das obige erzeugt die Liste `[0, 1, 2, 3, 4]`.

Dies ist nützlich für Schleifen mit `range $i, $e := until 5`.

### untilStep

Wie `until` erzeugt `untilStep` eine Liste von Zähl-Integers. Aber es erlaubt
die Definition eines Starts, Stopps und Schritts:

```
untilStep 3 6 2
```

Das obige erzeugt `[3 5]`, indem es bei 3 beginnt und 2 addiert, bis es gleich
oder größer als 6 ist. Dies ähnelt Pythons `range`-Funktion.

### seq

Funktioniert wie der Bash-Befehl `seq`.

* 1 Parameter (end) - erzeugt alle Zähl-Integers zwischen 1 und `end`
  einschließlich.
* 2 Parameter (start, end) - erzeugt alle Zähl-Integers zwischen `start` und
  `end` einschließlich, inkrementierend oder dekrementierend um 1.
* 3 Parameter (start, step, end) - erzeugt alle Zähl-Integers zwischen `start`
  und `end` einschließlich, inkrementierend oder dekrementierend um `step`.

```
seq 5       => 1 2 3 4 5
seq -3      => 1 0 -1 -2 -3
seq 0 2     => 0 1 2
seq 2 -2    => 2 1 0 -1 -2
seq 0 2 10  => 0 2 4 6 8 10
seq 0 -2 -5 => 0 -2 -4
```

### chunk

Um eine Liste in Chunks einer gegebenen Größe zu teilen, verwenden Sie `chunk
size list`. Dies ist nützlich für Paginierung.

```
chunk 3 (list 1 2 3 4 5 6 7 8)
```

Dies erzeugt eine Liste von Listen `[ [ 1 2 3 ] [ 4 5 6 ] [ 7 8 ] ]`.

## Mathematische Funktionen

Alle mathematischen Funktionen arbeiten mit `int64`-Werten, sofern nicht anders
angegeben.

Die folgenden mathematischen Funktionen sind verfügbar: [add](#add),
[add1](#add1), [ceil](#ceil), [div](#div), [floor](#floor), [len](#len),
[max](#max), [min](#min), [mod](#mod), [mul](#mul), [round](#round) und
[sub](#sub).

### add

Summiert Zahlen mit `add`. Akzeptiert zwei oder mehr Eingaben.

```
add 1 2 3
```

### add1

Um um 1 zu inkrementieren, verwenden Sie `add1`.

### sub

Zum Subtrahieren verwenden Sie `sub`.

### div

Führt Integer-Division mit `div` durch.

### mod

Modulo mit `mod`.

### mul

Multipliziert mit `mul`. Akzeptiert zwei oder mehr Eingaben.

```
mul 1 2 3
```

### max

Gibt den größten aus einer Reihe von Integers zurück.

Dies gibt `3` zurück:

```
max 1 2 3
```

### min

Gibt den kleinsten aus einer Reihe von Integers zurück.

`min 1 2 3` gibt `1` zurück.

### len

Gibt die Länge des Arguments als Integer zurück.

```
len .Arg
```

## Float-Mathematik-Funktionen

Alle mathematischen Funktionen arbeiten mit `float64`-Werten.

### addf

Summiert Zahlen mit `addf`

Dies gibt `5.5` zurück:

```
addf 1.5 2 2
```

### add1f

Um um 1 zu inkrementieren, verwenden Sie `add1f`

### subf

Zum Subtrahieren verwenden Sie `subf`

Dies entspricht `7.5 - 2 - 3` und gibt `2.5` zurück:

```
subf 7.5 2 3
```

### divf

Führt Integer-Division mit `divf` durch

Dies entspricht `10 / 2 / 4` und gibt `1.25` zurück:

```
divf 10 2 4
```

### mulf

Multipliziert mit `mulf`

Dies gibt `6` zurück:

```
mulf 1.5 2 2
```

### maxf

Gibt den größten aus einer Reihe von Floats zurück:

Dies gibt `3` zurück:

```
maxf 1 2.5 3
```

### minf

Gibt den kleinsten aus einer Reihe von Floats zurück.

Dies gibt `1.5` zurück:

```
minf 1.5 2 3
```

### floor

Gibt den größten Float-Wert zurück, der kleiner oder gleich dem Eingabewert ist.

`floor 123.9999` gibt `123.0` zurück.

### ceil

Gibt den größten Float-Wert zurück, der größer oder gleich dem Eingabewert ist.

`ceil 123.001` gibt `124.0` zurück.

### round

Gibt einen Float-Wert zurück, bei dem der Rest auf die angegebene Anzahl von
Nachkommastellen gerundet ist.

`round 123.555555 3` gibt `123.556` zurück.

## Netzwerk-Funktionen

Helm hat eine einzige Netzwerk-Funktion, `getHostByName`.

Die Funktion `getHostByName` empfängt einen Domainnamen und gibt die
IP-Adresse zurück.

`getHostByName "www.google.com"` würde die entsprechende IP-Adresse von
`www.google.com` zurückgeben.

Diese Funktion erfordert, dass die Option `--enable-dns` an der
Helm-Kommandozeile übergeben wird.

## Dateipfad-Funktionen

Obwohl Helm-Template-Funktionen keinen Zugriff auf das Dateisystem gewähren,
bieten sie Funktionen für die Arbeit mit Strings, die Dateipfad-Konventionen
folgen. Diese umfassen [base](#base), [clean](#clean), [dir](#dir), [ext](#ext)
und [isAbs](#isabs).

### base

Gibt das letzte Element eines Pfades zurück.

```
base "foo/bar/baz"
```

Das obige gibt "baz" aus.

### dir

Gibt das Verzeichnis zurück und entfernt den letzten Teil des Pfades. Also gibt
`dir "foo/bar/baz"` `foo/bar` zurück.

### clean

Bereinigt einen Pfad.

```
clean "foo/bar/../baz"
```

Das obige löst das `..` auf und gibt `foo/baz` zurück.

### ext

Gibt die Dateierweiterung zurück.

```
ext "foo.bar"
```

Das obige gibt `.bar` zurück.

### isAbs

Um zu prüfen, ob ein Dateipfad absolut ist, verwenden Sie `isAbs`.

## Reflection-Funktionen

Helm bietet grundlegende Reflection-Tools. Diese helfen fortgeschrittenen
Template-Entwicklern, die zugrunde liegenden Go-Typinformationen für einen
bestimmten Wert zu verstehen. Helm ist in Go geschrieben und streng typisiert.
Das Typsystem gilt auch innerhalb von Templates.

Go hat mehrere primitive _Arten_, wie `string`, `slice`, `int64` und `bool`.

Go hat ein offenes _Typ_-System, das es Entwicklern ermöglicht, eigene Typen zu
erstellen.

Helm bietet eine Reihe von Funktionen für jede über [Kind-Funktionen](#kind-funktionen)
und [Type-Funktionen](#type-funktionen). Eine [deepEqual](#deepequal)-Funktion
wird ebenfalls bereitgestellt, um zwei Werte zu vergleichen.

### Kind-Funktionen

Es gibt zwei Kind-Funktionen: `kindOf` gibt die Art eines Objekts zurück.

```
kindOf "hello"
```

Das obige würde `string` zurückgeben. Für einfache Tests (wie in `if`-Blöcken)
können Sie mit der Funktion `kindIs` prüfen, ob ein Wert eine bestimmte Art hat:

```
kindIs "int" 123
```

Das obige gibt `true` zurück.

### Type-Funktionen

Typen sind etwas schwieriger zu handhaben, daher gibt es drei verschiedene
Funktionen:

- `typeOf` gibt den zugrunde liegenden Typ eines Wertes zurück: `typeOf $foo`
- `typeIs` ist wie `kindIs`, aber für Typen: `typeIs "*io.Buffer" $myVal`
- `typeIsLike` funktioniert wie `typeIs`, dereferenziert aber auch Pointer

**Hinweis:** Keine dieser Funktionen kann testen, ob etwas ein bestimmtes
Interface implementiert, da dies erfordern würde, das Interface vorab zu
kompilieren.

### deepEqual

`deepEqual` gibt true zurück, wenn zwei Werte ["tief
gleich"](https://golang.org/pkg/reflect/#DeepEqual) sind.

Funktioniert auch für nicht-primitive Typen (im Gegensatz zum eingebauten `eq`).

```
deepEqual (list 1 2 3) (list 1 2 3)
```

Das obige gibt `true` zurück.

## Semantische Versionsfunktionen

Einige Versionsschemata sind leicht parsebar und vergleichbar. Helm bietet
Funktionen für die Arbeit mit [SemVer 2](http://semver.org)-Versionen. Diese
umfassen [semver](#semver) und [semverCompare](#semvercompare). Im Folgenden
finden Sie auch Details zur Verwendung von Bereichen für Vergleiche.

### semver

Die Funktion `semver` parst einen String in eine Semantische Version:

```
$version := semver "1.2.3-alpha.1+123"
```

_Wenn der Parser fehlschlägt, wird die Template-Ausführung mit einem Fehler
angehalten._

An diesem Punkt ist `$version` ein Pointer auf ein `Version`-Objekt mit den
folgenden Eigenschaften:

- `$version.Major`: Die Hauptversionsnummer (`1` oben)
- `$version.Minor`: Die Nebenversionsnummer (`2` oben)
- `$version.Patch`: Die Patch-Nummer (`3` oben)
- `$version.Prerelease`: Das Prerelease (`alpha.1` oben)
- `$version.Metadata`: Die Build-Metadaten (`123` oben)
- `$version.Original`: Die Originalversion als String

Zusätzlich können Sie eine `Version` mit einer anderen `Version` mithilfe der
`Compare`-Funktion vergleichen:

```
semver "1.4.3" | (semver "1.2.3").Compare
```

Das obige gibt `-1` zurück.

Die Rückgabewerte sind:

- `-1` wenn die gegebene Semver größer ist als die Semver, deren `Compare`-Methode
  aufgerufen wurde
- `1` wenn die Version, deren `Compare`-Funktion aufgerufen wurde, größer ist.
- `0` wenn sie dieselbe Version sind

(Beachten Sie, dass in SemVer das `Metadata`-Feld bei Versionsvergleichen nicht
verglichen wird.)

### semverCompare

Eine robustere Vergleichsfunktion wird als `semverCompare` bereitgestellt. Diese
Version unterstützt Versionsbereiche:

- `semverCompare "1.2.3" "1.2.3"` prüft auf eine exakte Übereinstimmung
- `semverCompare "~1.2.0" "1.2.3"` prüft, ob die Haupt- und Nebenversionen
  übereinstimmen und ob die Patch-Nummer der zweiten Version _größer oder
  gleich_ dem ersten Parameter ist.

Die SemVer-Funktionen verwenden die [Masterminds
semver-Bibliothek](https://github.com/Masterminds/semver) von den Machern von
Sprig.

### Einfache Vergleiche

Es gibt zwei Elemente bei den Vergleichen. Erstens ist ein Vergleichs-String
eine Liste von durch Leerzeichen oder Kommas getrennten AND-Vergleichen. Diese
werden dann durch || (OR)-Vergleiche getrennt. Zum Beispiel sucht `">= 1.2 <
3.0.0 || >= 4.2.3"` nach einem Vergleich, der größer oder gleich 1.2 und kleiner
als 3.0.0 ist oder größer oder gleich 4.2.3 ist.

Die grundlegenden Vergleiche sind:

- `=`: gleich (Alias für keinen Operator)
- `!=`: ungleich
- `>`: größer als
- `<`: kleiner als
- `>=`: größer oder gleich
- `<=`: kleiner oder gleich

### Arbeiten mit Prerelease-Versionen

Prereleases sind, für diejenigen, die damit nicht vertraut sind, für
Software-Releases vor stabilen oder allgemein verfügbaren Releases gedacht.
Beispiele für Prereleases sind Entwicklungs-, Alpha-, Beta- und
Release-Candidate-Releases. Ein Prerelease kann eine Version wie `1.2.3-beta.1`
sein, während der stabile Release `1.2.3` wäre. In der Rangfolge kommen
Prereleases vor ihren zugehörigen Releases. In diesem Beispiel `1.2.3-beta.1 <
1.2.3`.

Gemäß der Semantic-Version-Spezifikation sind Prereleases möglicherweise nicht
API-kompatibel mit ihrem Release-Gegenstück. Es heißt:

> Eine Prerelease-Version zeigt an, dass die Version instabil ist und
> möglicherweise nicht die beabsichtigten Kompatibilitätsanforderungen erfüllt,
> wie sie durch ihre zugehörige normale Version gekennzeichnet sind.

SemVer-Vergleiche mit Constraints ohne Prerelease-Vergleicher überspringen
Prerelease-Versionen. Zum Beispiel überspringt `>=1.2.3` Prereleases beim
Durchsuchen einer Liste von Releases, während `>=1.2.3-0` Prereleases
auswertet und findet.

Der Grund für die `0` als Prerelease-Version im Beispielvergleich ist, dass
Prereleases nur ASCII-alphanumerische Zeichen und Bindestriche (zusammen mit
`.`-Trennzeichen) enthalten können, gemäß Spezifikation. Die Sortierung erfolgt
in ASCII-Sortierreihenfolge, ebenfalls gemäß Spezifikation. Das niedrigste
Zeichen ist eine `0` in der ASCII-Sortierreihenfolge (siehe eine
[ASCII-Tabelle](http://www.asciitable.com/))

Das Verständnis der ASCII-Sortierreihenfolge ist wichtig, da A-Z vor a-z kommt.
Das bedeutet, `>=1.2.3-BETA` gibt `1.2.3-alpha` zurück. Was Sie von
Groß-/Kleinschreibungsempfindlichkeit erwarten könnten, gilt hier nicht. Dies
liegt an der ASCII-Sortierreihenfolge, die die Spezifikation vorgibt.

### Bindestrich-Bereichsvergleiche

Es gibt mehrere Methoden zur Handhabung von Bereichen, und die erste sind
Bindestrich-Bereiche. Diese sehen so aus:

- `1.2 - 1.4.5` was äquivalent ist zu `>= 1.2 <= 1.4.5`
- `2.3.4 - 4.5` was äquivalent ist zu `>= 2.3.4 <= 4.5`

### Wildcards in Vergleichen

Die Zeichen `x`, `X` und `*` können als Wildcard-Zeichen verwendet werden. Dies
funktioniert für alle Vergleichsoperatoren. Bei Verwendung mit dem `=`-Operator
fällt es auf den Patch-Level-Vergleich zurück (siehe Tilde unten). Zum Beispiel:

- `1.2.x` ist äquivalent zu `>= 1.2.0, < 1.3.0`
- `>= 1.2.x` ist äquivalent zu `>= 1.2.0`
- `<= 2.x` ist äquivalent zu `< 3`
- `*` ist äquivalent zu `>= 0.0.0`

### Tilde-Bereichsvergleiche (Patch)

Der Tilde (`~`)-Vergleichsoperator ist für Patch-Level-Bereiche, wenn eine
Nebenversion angegeben ist, und für Major-Level-Änderungen, wenn die
Nebenversionsnummer fehlt. Zum Beispiel:

- `~1.2.3` ist äquivalent zu `>= 1.2.3, < 1.3.0`
- `~1` ist äquivalent zu `>= 1, < 2`
- `~2.3` ist äquivalent zu `>= 2.3, < 2.4`
- `~1.2.x` ist äquivalent zu `>= 1.2.0, < 1.3.0`
- `~1.x` ist äquivalent zu `>= 1, < 2`

### Caret-Bereichsvergleiche (Major)

Der Caret (`^`)-Vergleichsoperator ist für Major-Level-Änderungen, sobald ein
stabiles (1.0.0) Release erfolgt ist. Vor einem 1.0.0-Release fungiert die
Nebenversion als API-Stabilitätsstufe. Dies ist nützlich bei Vergleichen von
API-Versionen, da eine Major-Änderung API-brechend ist. Zum Beispiel:

- `^1.2.3` ist äquivalent zu `>= 1.2.3, < 2.0.0`
- `^1.2.x` ist äquivalent zu `>= 1.2.0, < 2.0.0`
- `^2.3` ist äquivalent zu `>= 2.3, < 3`
- `^2.x` ist äquivalent zu `>= 2.0.0, < 3`
- `^0.2.3` ist äquivalent zu `>=0.2.3 <0.3.0`
- `^0.2` ist äquivalent zu `>=0.2.0 <0.3.0`
- `^0.0.3` ist äquivalent zu `>=0.0.3 <0.0.4`
- `^0.0` ist äquivalent zu `>=0.0.0 <0.1.0`
- `^0` ist äquivalent zu `>=0.0.0 <1.0.0`

## URL-Funktionen

Helm enthält die Funktionen [urlParse](#urlparse), [urlJoin](#urljoin) und
[urlquery](#urlquery), die Ihnen die Arbeit mit URL-Teilen ermöglichen.

### urlParse

Parst einen String als URL und erzeugt ein Dict mit URL-Teilen

```
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

Das obige gibt ein Dict zurück, das das URL-Objekt enthält:

```yaml
scheme:   'http'
host:     'server.com:8080'
path:     '/api'
query:    'list=false'
opaque:   nil
fragment: 'anchor'
userinfo: 'admin:secret'
```

Dies wird mit den URL-Paketen aus der Go-Standardbibliothek implementiert.
Für weitere Informationen siehe https://golang.org/pkg/net/url/#URL

### urlJoin

Verbindet ein Map (erzeugt von `urlParse`) zu einem URL-String

```
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

Das obige gibt den folgenden String zurück:
```
http://host:80/path?query#fragment
```

### urlquery

Gibt die escaped Version des übergebenen Werts zurück, sodass er zum Einbetten
in den Query-Teil einer URL geeignet ist.

```
$var := urlquery "string for query"
```

## UUID-Funktionen

Helm kann UUID v4 universell eindeutige Identifikatoren generieren.

```
uuidv4
```

Das obige gibt eine neue UUID vom Typ v4 (zufällig generiert) zurück.

## Kubernetes- und Chart-Funktionen

Helm enthält Funktionen für die Arbeit mit Kubernetes, darunter
[.Capabilities.APIVersions.Has](#capabilitiesapiversionshas),
[Files](#file-funktionen) und [lookup](#lookup).

### lookup

`lookup` wird verwendet, um Ressourcen in einem laufenden Cluster nachzuschlagen.
Bei Verwendung mit dem Befehl `helm template` gibt es immer eine leere Antwort
zurück.

Weitere Details finden Sie in der [Dokumentation zur lookup-Funktion](./functions_and_pipelines.md#verwendung-der-lookup-funktion).

### .Capabilities.APIVersions.Has

Gibt zurück, ob eine API-Version oder Ressource in einem Cluster verfügbar ist.

```
.Capabilities.APIVersions.Has "apps/v1"
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

Weitere Informationen finden Sie in der [Dokumentation der eingebauten
Objekte](./builtin_objects.md).

### File-Funktionen

Es gibt mehrere Funktionen, die Ihnen den Zugriff auf nicht-spezielle Dateien
innerhalb eines Charts ermöglichen. Zum Beispiel zum Zugriff auf
Anwendungskonfigurationsdateien. Diese sind dokumentiert unter [Zugriff auf
Dateien in Templates](./accessing_files.md).

_Hinweis: Die Dokumentation für viele dieser Funktionen stammt von
[Sprig](https://github.com/Masterminds/sprig). Sprig ist eine
Template-Funktionsbibliothek, die für Go-Anwendungen verfügbar ist._
