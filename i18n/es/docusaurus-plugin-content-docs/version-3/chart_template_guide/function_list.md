---
title: Lista de Funciones de Plantilla
description: Una lista de funciones de plantilla disponibles en Helm
sidebar_position: 6
---

Helm incluye muchas funciones de plantilla que puede aprovechar en sus plantillas.
Se enumeran aquí y se desglosan en las siguientes categorías:

* [Criptografía y Seguridad](#funciones-de-criptografía-y-seguridad)
* [Fecha](#funciones-de-fecha)
* [Diccionarios](#funciones-de-diccionarios-y-dict)
* [Codificación](#funciones-de-codificación)
* [Rutas de Archivos](#funciones-de-rutas-de-archivos)
* [Kubernetes y Chart](#funciones-de-kubernetes-y-chart)
* [Lógica y Control de Flujo](#funciones-de-lógica-y-control-de-flujo)
* [Listas](#funciones-de-listas-y-list)
* [Matemáticas](#funciones-matemáticas)
* [Matemáticas de Punto Flotante](#funciones-matemáticas-de-punto-flotante)
* [Red](#funciones-de-red)
* [Reflexión](#funciones-de-reflexión)
* [Expresiones Regulares](#expresiones-regulares)
* [Versiones Semánticas](#funciones-de-versiones-semánticas)
* [Cadenas](#funciones-de-cadenas)
* [Conversión de Tipos](#funciones-de-conversión-de-tipos)
* [URL](#funciones-de-url)
* [UUID](#funciones-de-uuid)

## Funciones de Lógica y Control de Flujo

Helm incluye numerosas funciones de lógica y control de flujo incluyendo [and](#and),
[coalesce](#coalesce), [default](#default), [empty](#empty), [eq](#eq),
[fail](#fail), [ge](#ge), [gt](#gt), [le](#le), [lt](#lt), [ne](#ne),
[not](#not), [or](#or), y [required](#required).

### and

Devuelve el AND booleano de dos o más argumentos
(el primer argumento vacío, o el último argumento).

```
and .Arg1 .Arg2
```

### or

Devuelve el OR booleano de dos o más argumentos
(el primer argumento no vacío, o el último argumento).

```
or .Arg1 .Arg2
```

### not

Devuelve la negación booleana de su argumento.

```
not .Arg
```

### eq

Devuelve la igualdad booleana de los argumentos (ej., Arg1 == Arg2).

```
eq .Arg1 .Arg2
```

### ne

Devuelve la desigualdad booleana de los argumentos (ej., Arg1 != Arg2)

```
ne .Arg1 .Arg2
```

### lt

Devuelve un booleano verdadero si el primer argumento es menor que el segundo. De lo contrario
devuelve falso (ej., Arg1 < Arg2).

```
lt .Arg1 .Arg2
```

### le

Devuelve un booleano verdadero si el primer argumento es menor o igual que el
segundo. De lo contrario devuelve falso (ej., Arg1 <= Arg2).

```
le .Arg1 .Arg2
```

### gt

Devuelve un booleano verdadero si el primer argumento es mayor que el segundo. De lo contrario
devuelve falso (ej., Arg1 > Arg2).

```
gt .Arg1 .Arg2
```

### ge

Devuelve un booleano verdadero si el primer argumento es mayor o igual que el
segundo. De lo contrario devuelve falso (ej., Arg1 >= Arg2).

```
ge .Arg1 .Arg2
```

### default

Para establecer un valor por defecto simple, use `default`:

```
default "foo" .Bar
```

En el ejemplo anterior, si `.Bar` evalúa a un valor no vacío, se usará ese valor. Pero si
está vacío, se devolverá `foo` en su lugar.

La definición de "vacío" depende del tipo:

- Numérico: 0
- Cadena: ""
- Listas: `[]`
- Diccionarios: `{}`
- Booleano: `false`
- Y siempre `nil` (también conocido como null)

Para estructuras, no hay definición de vacío, por lo que una estructura nunca devolverá el
valor por defecto.

### required

Especifique valores que deben establecerse con `required`:

```
required "A valid foo is required!" .Bar
```

Si `.Bar` está vacío o no está definido (consulte [default](#default) para saber cómo se
evalúa), la plantilla no se renderizará y devolverá el mensaje de error
proporcionado en su lugar.

### empty

La función `empty` devuelve `true` si el valor dado se considera vacío, y
`false` en caso contrario. Los valores vacíos se enumeran en la sección `default`.

```
empty .Foo
```

Note que en los condicionales de plantillas de Go, el vacío se calcula automáticamente. Por lo tanto,
raramente necesitará `if not empty .Foo`. En su lugar, simplemente use `if .Foo`.

### fail

Devuelve incondicionalmente un `string` vacío y un `error` con el texto
especificado. Esto es útil en escenarios donde otras condiciones han determinado que
el renderizado de la plantilla debe fallar.

```
fail "Please accept the end user license agreement"
```

### coalesce

La función `coalesce` toma una lista de valores y devuelve el primer valor no vacío.

```
coalesce 0 1 2
```

Lo anterior devuelve `1`.

Esta función es útil para recorrer múltiples variables o valores:

```
coalesce .name .parent.name "Matt"
```

Lo anterior primero verificará si `.name` está vacío. Si no lo está, devolverá
ese valor. Si _está_ vacío, `coalesce` evaluará `.parent.name` para verificar
si está vacío. Finalmente, si tanto `.name` como `.parent.name` están vacíos, devolverá
`Matt`.

### ternary

La función `ternary` toma dos valores y un valor de prueba. Si el valor de prueba es
verdadero, se devolverá el primer valor. Si el valor de prueba está vacío, se devolverá
el segundo valor. Esto es similar al operador ternario en C y otros lenguajes de programación.

#### valor de prueba verdadero

```
ternary "foo" "bar" true
```

o

```
true | ternary "foo" "bar"
```

Lo anterior devuelve `"foo"`.

#### valor de prueba falso

```
ternary "foo" "bar" false
```

o

```
false | ternary "foo" "bar"
```

Lo anterior devuelve `"bar"`.

## Funciones de Cadenas

Helm incluye las siguientes funciones de cadenas: [abbrev](#abbrev),
[abbrevboth](#abbrevboth), [camelcase](#camelcase), [cat](#cat),
[contains](#contains), [hasPrefix](#hasprefix-y-hassuffix),
[hasSuffix](#hasprefix-y-hassuffix), [indent](#indent), [initials](#initials),
[kebabcase](#kebabcase), [lower](#lower), [nindent](#nindent),
[nospace](#nospace), [plural](#plural), [print](#print), [printf](#printf),
[println](#println), [quote](#quote-y-squote),
[randAlpha](#randalphanum-randalpha-randnumeric-y-randascii),
[randAlphaNum](#randalphanum-randalpha-randnumeric-y-randascii),
[randAscii](#randalphanum-randalpha-randnumeric-y-randascii),
[randNumeric](#randalphanum-randalpha-randnumeric-y-randascii),
[repeat](#repeat), [replace](#replace), [shuffle](#shuffle),
[snakecase](#snakecase), [squote](#quote-y-squote), [substr](#substr),
[swapcase](#swapcase), [title](#title), [trim](#trim), [trimAll](#trimall),
[trimPrefix](#trimprefix), [trimSuffix](#trimsuffix), [trunc](#trunc),
[untitle](#untitle), [upper](#upper), [wrap](#wrap), y [wrapWith](#wrapwith).

### print

Devuelve una cadena a partir de la combinación de sus partes.

```
print "Matt has " .Dogs " dogs"
```

Los tipos que no son cadenas se convierten a cadenas cuando es posible.

Note que cuando dos argumentos adyacentes no son cadenas, se agrega un espacio
entre ellos.

### println

Funciona de la misma manera que [print](#print) pero agrega una nueva línea al final.

### printf

Devuelve una cadena basada en una cadena de formato y los argumentos a pasar en
orden.

```
printf "%s has %d dogs." .Name .NumberDogs
```

El marcador de posición a usar depende del tipo del argumento que se pasa.
Esto incluye:

Propósito general:

* `%v` el valor en formato por defecto
  * al imprimir diccionarios, el flag plus (%+v) agrega nombres de campo
* `%%` un signo de porcentaje literal; no consume ningún valor

Booleano:

* `%t` la palabra true o false

Entero:

* `%b` base 2
* `%c` el carácter representado por el punto de código Unicode correspondiente
* `%d` base 10
* `%o` base 8
* `%O` base 8 con prefijo 0o
* `%q` un literal de carácter entre comillas simples escapado de forma segura
* `%x` base 16, con letras minúsculas para a-f
* `%X` base 16, con letras mayúsculas para A-F
* `%U` formato Unicode: U+1234; igual que "U+%04X"

 Punto flotante y componentes complejos:

* `%b` notación científica decimal con exponente potencia de dos, ej.
  -123456p-78
* `%e` notación científica, ej. -1.234456e+78
* `%E` notación científica, ej. -1.234456E+78
* `%f` punto decimal pero sin exponente, ej. 123.456
* `%F` sinónimo de %f
* `%g` %e para exponentes grandes, %f en caso contrario.
* `%G` %E para exponentes grandes, %F en caso contrario
* `%x` notación hexadecimal (con exponente potencia de dos decimal), ej.
  -0x1.23abcp+20
* `%X` notación hexadecimal mayúsculas, ej. -0X1.23ABCP+20

Cadena y slice de bytes (tratados de manera equivalente con estos verbos):

* `%s` los bytes sin interpretar de la cadena o slice
* `%q` una cadena entre comillas dobles escapada de forma segura
* `%x` base 16, minúsculas, dos caracteres por byte
* `%X` base 16, mayúsculas, dos caracteres por byte

Slice:

* `%p` dirección del elemento 0 en notación base 16, con 0x inicial

### trim

La función `trim` elimina los espacios en blanco de ambos lados de una cadena:

```
trim "   hello    "
```

Lo anterior produce `hello`

### trimAll

Elimina los caracteres dados del principio y final de una cadena:

```
trimAll "$" "$5.00"
```

Esto devuelve `5.00` (como cadena).

### trimPrefix

Elimina solo el prefijo de una cadena:

```
trimPrefix "-" "-hello"
```

Lo anterior devuelve `hello`

### trimSuffix

Elimina solo el sufijo de una cadena:

```
trimSuffix "-" "hello-"
```

Lo anterior devuelve `hello`

### lower

Convierte toda la cadena a minúsculas:

```
lower "HELLO"
```

Esto devuelve `hello`

### upper

Convierte toda la cadena a mayúsculas:

```
upper "hello"
```

Lo anterior devuelve `HELLO`

### title

Convierte a formato de título:

```
title "hello world"
```

Lo anterior devuelve `Hello World`

### untitle

Elimina el formato de título. `untitle "Hello World"` produce `hello world`.

### repeat

Repite una cadena múltiples veces:

```
repeat 3 "hello"
```

Lo anterior devuelve `hellohellohello`

### substr

Obtiene una subcadena de una cadena. Toma tres parámetros:

- inicio (int)
- fin (int)
- cadena (string)

```
substr 0 5 "hello world"
```

El resultado es `hello`

### nospace

Elimina todos los espacios en blanco de una cadena.

```
nospace "hello w o r l d"
```

El resultado es `helloworld`

### trunc

Trunca una cadena

```
trunc 5 "hello world"
```

Lo anterior produce `hello`.

```
trunc -5 "hello world"
```

Lo anterior produce `world`.

### abbrev

Trunca una cadena con puntos suspensivos (`...`)

Parámetros:

- longitud máxima
- la cadena

```
abbrev 5 "hello world"
```

Lo anterior devuelve `he...`, ya que cuenta el ancho de los puntos suspensivos contra la
longitud máxima.

### abbrevboth

Abrevia en ambos lados:

```
abbrevboth 5 10 "1234 5678 9123"
```

Lo anterior produce `...5678...`

Toma:

- desplazamiento izquierdo
- longitud máxima
- la cadena

### initials

Dadas múltiples palabras, toma la primera letra de cada palabra y las combina.

```
initials "First Try"
```

Esto devuelve `FT`

### randAlphaNum, randAlpha, randNumeric, y randAscii

Estas cuatro funciones generan cadenas aleatorias criptográficamente seguras (usan ```crypto/rand```),
pero con diferentes conjuntos de caracteres base:

- `randAlphaNum` usa `0-9a-zA-Z`
- `randAlpha` usa `a-zA-Z`
- `randNumeric` usa `0-9`
- `randAscii` usa todos los caracteres ASCII imprimibles

Cada una toma un parámetro: la longitud entera de la cadena.

```
randNumeric 3
```

Lo anterior producirá una cadena aleatoria con tres dígitos.

### wrap

Ajusta el texto a un número de columnas dado:

```
wrap 80 $someText
```

Lo anterior ajustará la cadena en `$someText` a 80 columnas.

### wrapWith

`wrapWith` funciona como `wrap`, pero le permite especificar la cadena con la que ajustar.
(`wrap` usa `\n`)

```
wrapWith 5 "\t" "Hello World"
```

Lo anterior produce `Hello World` (donde el espacio en blanco es un carácter de tabulación ASCII)

### contains

Prueba si una cadena está contenida dentro de otra:

```
contains "cat" "catch"
```

Esto devuelve `true` porque `catch` contiene `cat`.

### hasPrefix y hasSuffix

Las funciones `hasPrefix` y `hasSuffix` prueban si una cadena tiene un
prefijo o sufijo dado:

```
hasPrefix "cat" "catch"
```

Lo anterior devuelve `true` porque `catch` tiene el prefijo `cat`.

### quote y squote

Estas funciones envuelven una cadena en comillas dobles (`quote`) o comillas simples
(`squote`).

### cat

La función `cat` concatena múltiples cadenas en una, separándolas
con espacios:

```
cat "hello" "beautiful" "world"
```

Lo anterior produce `hello beautiful world`

### indent

La función `indent` indenta cada línea en una cadena dada al ancho de
indentación especificado. Esto es útil cuando se alinean cadenas multilínea:

```
indent 4 $lots_of_text
```

Lo anterior indentará cada línea de texto con 4 caracteres de espacio.

### nindent

La función `nindent` es igual que la función indent, pero antepone una nueva
línea al principio de la cadena.

```
nindent 4 $lots_of_text
```

Lo anterior indentará cada línea de texto con 4 caracteres de espacio y agregará una nueva
línea al principio.

### replace

Realiza un reemplazo simple de cadenas.

Toma tres argumentos:

- cadena a reemplazar
- cadena con la que reemplazar
- cadena fuente

```
"I Am Henry VIII" | replace " " "-"
```

Lo anterior producirá `I-Am-Henry-VIII`

### plural

Pluraliza una cadena.

```
len $fish | plural "one anchovy" "many anchovies"
```

En el ejemplo anterior, si la longitud de la cadena es 1, se imprimirá el primer argumento
(`one anchovy`). De lo contrario, se imprimirá el segundo argumento (`many
anchovies`).

Los argumentos son:

- cadena singular
- cadena plural
- entero de longitud

NOTA: Helm actualmente no soporta idiomas con reglas de pluralización más complejas.
Y `0` se considera plural porque el idioma inglés lo trata así
(`zero anchovies`).

### snakecase

Convierte una cadena de camelCase a snake_case.

```
snakecase "FirstName"
```

Esto producirá `first_name`.

### camelcase

Convierte una cadena de snake_case a CamelCase

```
camelcase "http_server"
```

Esto producirá `HttpServer`.

### kebabcase

Convierte una cadena de camelCase a kebab-case.

```
kebabcase "FirstName"
```

Lo anterior producirá `first-name`.

### swapcase

Intercambia las mayúsculas/minúsculas de una cadena usando un algoritmo basado en palabras.

Algoritmo de conversión:

- Carácter mayúscula se convierte a minúscula
- Carácter de título se convierte a minúscula
- Carácter minúscula después de espacio en blanco o al inicio se convierte a título
- Otros caracteres minúsculas se convierten a mayúsculas
- El espacio en blanco se define por unicode.IsSpace(char)

```
swapcase "This Is A.Test"
```

Lo anterior producirá `tHIS iS a.tEST`.

### shuffle

Mezcla aleatoriamente una cadena.

```
shuffle "hello"
```

Lo anterior reordenará aleatoriamente las letras en `hello`, produciendo quizás `oelhl`.

## Funciones de Conversión de Tipos

Helm proporciona las siguientes funciones de conversión de tipos:

- `atoi`: Convierte una cadena a un entero.
- `float64`: Convierte a `float64`.
- `int`: Convierte a `int` en el ancho del sistema.
- `int64`: Convierte a `int64`.
- `toDecimal`: Convierte un octal unix a `int64`.
- `toString`: Convierte a una cadena.
- `toStrings`: Convierte una lista, slice o arreglo a una lista de cadenas.
- `toJson` (`mustToJson`): Convierte lista, slice, arreglo, dict u objeto a JSON.
- `toPrettyJson` (`mustToPrettyJson`): Convierte lista, slice, arreglo, dict u
  objeto a JSON indentado.
- `toRawJson` (`mustToRawJson`): Convierte lista, slice, arreglo, dict u objeto a
  JSON con caracteres HTML sin escapar.
- `fromYaml`: Convierte una cadena YAML a un objeto.
- `fromJson`: Convierte una cadena JSON a un objeto.
- `fromJsonArray`: Convierte un arreglo JSON a una lista.
- `toYaml`: Convierte lista, slice, arreglo, dict u objeto a yaml indentado, puede usarse para copiar fragmentos de yaml de cualquier fuente. Esta función es equivalente a la función yaml.Marshal de GoLang, consulte la documentación aquí: https://pkg.go.dev/gopkg.in/yaml.v2#Marshal
- `toYamlPretty`: Convierte lista, slice, arreglo, dict u objeto a yaml indentado. Equivalente a `toYaml` pero adicionalmente indentará listas por 2 espacios.
- `toToml`: Convierte lista, slice, arreglo, dict u objeto a toml, puede usarse para copiar fragmentos de toml de cualquier fuente.
- `fromYamlArray`: Convierte un arreglo YAML a una lista.

Solo `atoi` requiere que la entrada sea de un tipo específico. Las demás intentarán
convertir de cualquier tipo al tipo de destino. Por ejemplo, `int64` puede
convertir flotantes a enteros, y también puede convertir cadenas a enteros.

### toStrings

Dada una colección tipo lista, produce un slice de cadenas.

```
list 1 2 3 | toStrings
```

Lo anterior convierte `1` a `"1"`, `2` a `"2"`, y así sucesivamente, y luego los devuelve
como una lista.

### toDecimal

Dado un permiso octal unix, produce un decimal.

```
"0777" | toDecimal
```

Lo anterior convierte `0777` a `511` y devuelve el valor como int64.

### toJson, mustToJson

La función `toJson` codifica un elemento en una cadena JSON. Si el elemento no puede ser
convertido a JSON, la función devolverá una cadena vacía. `mustToJson` devolverá
un error en caso de que el elemento no pueda ser codificado en JSON.

```
toJson .Item
```

Lo anterior devuelve la representación en cadena JSON de `.Item`.

### toPrettyJson, mustToPrettyJson

La función `toPrettyJson` codifica un elemento en una cadena JSON formateada (indentada).

```
toPrettyJson .Item
```

Lo anterior devuelve la representación en cadena JSON indentada de `.Item`.

### toRawJson, mustToRawJson

La función `toRawJson` codifica un elemento en una cadena JSON con caracteres HTML
sin escapar.

```
toRawJson .Item
```

Lo anterior devuelve la representación en cadena JSON sin escapar de `.Item`.

### fromYaml

La función `fromYaml` toma una cadena YAML y devuelve un objeto que puede usarse en plantillas.

`Archivo en: yamls/person.yaml`
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

La función `fromJson` toma una cadena JSON y devuelve un objeto que puede usarse en plantillas.

`Archivo en: jsons/person.json`
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

La función `fromJsonArray` toma un arreglo JSON y devuelve una lista que puede usarse en plantillas.

`Archivo en: jsons/people.json`
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

Las funciones `toYaml` y `toYamlPretty` codifican un objeto (lista, slice, arreglo, dict u objeto) en una cadena YAML indentada.

> Note que `toYamlPretty` es funcionalmente equivalente pero mostrará YAML con indentación adicional para elementos de lista

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

La función `fromYamlArray` toma un arreglo YAML y devuelve una lista que puede usarse en plantillas.

`Archivo en: yamls/people.yml`
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


## Expresiones Regulares

Helm incluye las siguientes funciones de expresiones regulares: [regexFind
(mustRegexFind)](#regexfindall-mustregexfindall), [regexFindAll
(mustRegexFindAll)](#regexfind-mustregexfind), [regexMatch
(mustRegexMatch)](#regexmatch-mustregexmatch), [regexReplaceAll
(mustRegexReplaceAll)](#regexreplaceall-mustregexreplaceall),
[regexReplaceAllLiteral
(mustRegexReplaceAllLiteral)](#regexreplaceallliteral-mustregexreplaceallliteral),
[regexSplit (mustRegexSplit)](#regexsplit-mustregexsplit).

### regexMatch, mustRegexMatch

Devuelve true si la cadena de entrada contiene alguna coincidencia de la expresión regular.

```
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"
```

Lo anterior produce `true`

`regexMatch` entra en pánico si hay un problema y `mustRegexMatch` devuelve un error
al motor de plantillas si hay un problema.

### regexFindAll, mustRegexFindAll

Devuelve un slice de todas las coincidencias de la expresión regular en la cadena de entrada.
El último parámetro n determina el número de subcadenas a devolver, donde -1
significa devolver todas las coincidencias

```
regexFindAll "[2,4,6,8]" "123456789" -1
```

Lo anterior produce `[2 4 6 8]`

`regexFindAll` entra en pánico si hay un problema y `mustRegexFindAll` devuelve un
error al motor de plantillas si hay un problema.

### regexFind, mustRegexFind

Devuelve la primera coincidencia (la más a la izquierda) de la expresión regular en la cadena de entrada

```
regexFind "[a-zA-Z][1-9]" "abcd1234"
```

Lo anterior produce `d1`

`regexFind` entra en pánico si hay un problema y `mustRegexFind` devuelve un error al
motor de plantillas si hay un problema.

### regexReplaceAll, mustRegexReplaceAll

Devuelve una copia de la cadena de entrada, reemplazando las coincidencias de la Regexp con la
cadena de reemplazo. Dentro de la cadena de reemplazo, los signos $ se
interpretan como en Expand, por lo que por ejemplo $1 representa el texto de la primera
subcoincidencia. El primer argumento es `<pattern>`, el segundo es `<input>`,
y el tercero es `<replacement>`.

```
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

Lo anterior produce `-W-xxW-`

`regexReplaceAll` entra en pánico si hay un problema y `mustRegexReplaceAll` devuelve
un error al motor de plantillas si hay un problema.

### regexReplaceAllLiteral, mustRegexReplaceAllLiteral

Devuelve una copia de la cadena de entrada, reemplazando las coincidencias de la Regexp con la
cadena de reemplazo. La cadena de reemplazo se sustituye directamente,
sin usar Expand. El primer argumento es `<pattern>`, el segundo es `<input>`,
y el tercero es `<replacement>`.

```
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"
```

Lo anterior produce `-${1}-${1}-`

`regexReplaceAllLiteral` entra en pánico si hay un problema y
`mustRegexReplaceAllLiteral` devuelve un error al motor de plantillas si hay un
problema.

### regexSplit, mustRegexSplit

Divide la cadena de entrada en subcadenas separadas por la expresión y devuelve
un slice de las subcadenas entre esas coincidencias de expresión. El último parámetro
`n` determina el número de subcadenas a devolver, donde `-1` significa devolver todas
las coincidencias

```
regexSplit "z+" "pizza" -1
```

Lo anterior produce `[pi a]`

`regexSplit` entra en pánico si hay un problema y `mustRegexSplit` devuelve un error
al motor de plantillas si hay un problema.

## Funciones de Criptografía y Seguridad

Helm proporciona algunas funciones criptográficas avanzadas. Incluyen
[adler32sum](#adler32sum), [buildCustomCert](#buildcustomcert),
[decryptAES](#decryptaes), [derivePassword](#derivepassword),
[encryptAES](#encryptaes), [genCA](#genca), [genPrivateKey](#genprivatekey),
[genSelfSignedCert](#genselfsignedcert), [genSignedCert](#gensignedcert),
[htpasswd](#htpasswd), [randBytes](#randbytes), [sha1sum](#sha1sum), y
[sha256sum](#sha256sum).

### sha1sum

La función `sha1sum` recibe una cadena y calcula su resumen SHA1.

```
sha1sum "Hello world!"
```

### sha256sum

La función `sha256sum` recibe una cadena y calcula su resumen SHA256.

```
sha256sum "Hello world!"
```

Lo anterior calculará la suma SHA 256 en un formato "blindado ASCII" que es seguro
para imprimir.

### adler32sum

La función `adler32sum` recibe una cadena y calcula su suma de verificación Adler-32.

```
adler32sum "Hello world!"
```

### htpasswd

La función `htpasswd` toma un `username` y `password` y genera un
hash `bcrypt` de la contraseña. El resultado puede usarse para autenticación básica
en un [Servidor HTTP Apache](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html#basic).

```
htpasswd "myUser" "myPassword"
```

Note que es inseguro almacenar la contraseña directamente en la plantilla.

### randBytes

La función randBytes acepta un conteo N y genera una secuencia aleatoria
criptográficamente segura (usa crypto/rand) de N bytes. La secuencia se devuelve
como una cadena codificada en base64.

```
randBytes 24
```

### derivePassword

La función `derivePassword` puede usarse para derivar una contraseña específica basada en
algunas restricciones de "contraseña maestra" compartidas. El algoritmo para esto está [bien
especificado](https://web.archive.org/web/20211019121301/https://masterpassword.app/masterpassword-algorithm.pdf).

```
derivePassword 1 "long" "password" "user" "example.com"
```

Note que se considera inseguro almacenar las partes directamente en la plantilla.

### genPrivateKey

La función `genPrivateKey` genera una nueva clave privada codificada en un bloque PEM.

Toma uno de los valores para su primer parámetro:

- `ecdsa`: Genera una clave DSA de curva elíptica (P256)
- `dsa`: Genera una clave DSA (L2048N256)
- `rsa`: Genera una clave RSA 4096

### buildCustomCert

La función `buildCustomCert` permite personalizar el certificado.

Toma los siguientes parámetros de cadena:

- Un certificado en formato PEM codificado en base64
- Una clave privada en formato PEM codificada en base64

Devuelve un objeto de certificado con los siguientes atributos:

- `Cert`: Un certificado codificado en PEM
- `Key`: Una clave privada codificada en PEM

Ejemplo:

```
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
```

Note que el objeto devuelto puede pasarse a la función `genSignedCert` para
firmar un certificado usando esta CA.

### genCA

La función `genCA` genera una nueva autoridad de certificación x509 autofirmada.

Toma los siguientes parámetros:

- Nombre común del sujeto (cn)
- Duración de validez del certificado en días

Devuelve un objeto con los siguientes atributos:

- `Cert`: Un certificado codificado en PEM
- `Key`: Una clave privada codificada en PEM

Ejemplo:

```
$ca := genCA "foo-ca" 365
```

Note que el objeto devuelto puede pasarse a la función `genSignedCert` para
firmar un certificado usando esta CA.

### genSelfSignedCert

La función `genSelfSignedCert` genera un nuevo certificado x509 autofirmado.

Toma los siguientes parámetros:

- Nombre común del sujeto (cn)
- Lista opcional de IPs; puede ser nil
- Lista opcional de nombres DNS alternativos; puede ser nil
- Duración de validez del certificado en días

Devuelve un objeto con los siguientes atributos:

- `Cert`: Un certificado codificado en PEM
- `Key`: Una clave privada codificada en PEM

Ejemplo:

```
$cert := genSelfSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365
```

### genSignedCert

La función `genSignedCert` genera un nuevo certificado x509 firmado por la
CA especificada.

Toma los siguientes parámetros:

- Nombre común del sujeto (cn)
- Lista opcional de IPs; puede ser nil
- Lista opcional de nombres DNS alternativos; puede ser nil
- Duración de validez del certificado en días
- CA (ver `genCA`)

Ejemplo:

```
$ca := genCA "foo-ca" 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

### encryptAES

La función `encryptAES` cifra texto con AES-256 CBC y devuelve una cadena
codificada en base64.

```
encryptAES "secretkey" "plaintext"
```

### decryptAES

La función `decryptAES` recibe una cadena base64 codificada por el algoritmo AES-256 CBC
y devuelve el texto descifrado.

```
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

## Funciones de Fecha

Helm incluye las siguientes funciones de fecha que puede usar en plantillas:
[ago](#ago), [date](#date), [dateInZone](#dateinzone), [dateModify
(mustDateModify)](#datemodify-mustdatemodify), [duration](#duration),
[durationRound](#durationround), [htmlDate](#htmldate),
[htmlDateInZone](#htmldateinzone), [now](#now), [toDate
(mustToDate)](#todate-musttodate), y [unixEpoch](#unixepoch).

### now

La fecha/hora actual. Use esto en conjunto con otras funciones de fecha.

### ago

La función `ago` devuelve la duración desde un momento en el tiempo. Ahora en resolución de segundos.

```
ago .CreatedAt
```

devuelve en formato String() de `time.Duration`

```
2h34m7s
```

### date

La función `date` formatea una fecha.

Formatear la fecha a AÑO-MES-DÍA:

```
now | date "2006-01-02"
```

El formateo de fechas en Go es [un poco
diferente](https://pauladamsmith.com/blog/2011/05/go_time.html).

En resumen, tome esto como la fecha base:

```
Mon Jan 2 15:04:05 MST 2006
```

Escríbala en el formato que desee. Arriba, `2006-01-02` es la misma fecha, pero en
el formato que queremos.

### dateInZone

Igual que `date`, pero con una zona horaria.

```
dateInZone "2006-01-02" (now) "UTC"
```

### duration

Formatea una cantidad dada de segundos como `time.Duration`.

Esto devuelve 1m35s

```
duration "95"
```

### durationRound

Redondea una duración dada a la unidad más significativa. Las cadenas y
`time.Duration` se parsean como duración, mientras que un `time.Time` se calcula como
la duración desde entonces.

Esto devuelve 2h

```
durationRound "2h10m5s"
```

Esto devuelve 3mo

```
durationRound "2400h10m5s"
```

### unixEpoch

Devuelve los segundos desde el epoch unix para un `time.Time`.

```
now | unixEpoch
```

### dateModify, mustDateModify

`dateModify` toma una modificación y una fecha y devuelve la marca de tiempo.

Restar una hora y treinta minutos del tiempo actual:

```
now | dateModify "-1.5h"
```

Si el formato de modificación es incorrecto, `dateModify` devolverá la fecha
sin modificar. `mustDateModify` devolverá un error en su lugar.

### htmlDate

La función `htmlDate` formatea una fecha para insertarla en un campo de entrada
de selector de fecha HTML.

```
now | htmlDate
```

### htmlDateInZone

Igual que htmlDate, pero con una zona horaria.

```
htmlDateInZone (now) "UTC"
```

### toDate, mustToDate

`toDate` convierte una cadena a una fecha. El primer argumento es el layout de fecha y
el segundo la cadena de fecha. Si la cadena no puede convertirse, devuelve el valor
cero. `mustToDate` devolverá un error en caso de que la cadena no pueda convertirse.

Esto es útil cuando desea convertir una cadena de fecha a otro formato (usando
pipe). El ejemplo siguiente convierte "2017-12-31" a "31/12/2017".

```
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

## Funciones de Diccionarios y Dict

Helm proporciona un tipo de almacenamiento clave/valor llamado `dict` (abreviatura de "dictionary",
como en Python). Un `dict` es un tipo _no ordenado_.

La clave de un diccionario **debe ser una cadena**. Sin embargo, el valor puede ser de cualquier
tipo, incluso otro `dict` o `list`.

A diferencia de las `list`s, los `dict`s no son inmutables. Las funciones `set` y `unset`
modificarán el contenido de un diccionario.

Helm proporciona las siguientes funciones para trabajar con dicts: [deepCopy
(mustDeepCopy)](#deepcopy-mustdeepcopy), [dict](#dict), [dig](#dig), [get](#get),
[hasKey](#haskey), [keys](#keys), [merge (mustMerge)](#merge-mustmerge),
[mergeOverwrite (mustMergeOverwrite)](#mergeoverwrite-mustmergeoverwrite),
[omit](#omit), [pick](#pick), [pluck](#pluck), [set](#set), [unset](#unset), y
[values](#values).

### dict

La creación de diccionarios se hace llamando a la función `dict` y pasándole una
lista de pares.

Lo siguiente crea un diccionario con tres elementos:

```
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
```

### get

Dado un mapa y una clave, obtiene el valor del mapa.

```
get $myDict "name1"
```

Lo anterior devuelve `"value1"`

Note que si la clave no se encuentra, esta operación simplemente devolverá `""`. No se
generará ningún error.

### set

Use `set` para agregar un nuevo par clave/valor a un diccionario.

```
$_ := set $myDict "name4" "value4"
```

Note que `set` _devuelve el diccionario_ (un requisito de las funciones de plantilla de Go),
por lo que puede necesitar capturar el valor como se hizo arriba con la asignación `$_`.

### unset

Dado un mapa y una clave, elimina la clave del mapa.

```
$_ := unset $myDict "name4"
```

Al igual que con `set`, esto devuelve el diccionario.

Note que si la clave no se encuentra, esta operación simplemente retornará. No se
generará ningún error.

### hasKey

La función `hasKey` devuelve `true` si el dict dado contiene la clave dada.

```
hasKey $myDict "name1"
```

Si la clave no se encuentra, devuelve `false`.

### pluck

La función `pluck` hace posible dar una clave y múltiples mapas, y
obtener una lista de todas las coincidencias:

```
pluck "name1" $myDict $myOtherDict
```

Lo anterior devolverá una `list` que contiene cada valor encontrado (`[value1
otherValue1]`).

Si la clave dada _no se encuentra_ en un mapa, ese mapa no tendrá un elemento en la
lista (y la longitud de la lista devuelta será menor que el número de dicts
en la llamada a `pluck`).

Si la clave _se encuentra_ pero el valor es un valor vacío, ese valor se
insertará.

Un patrón común en las plantillas de Helm es usar `pluck... | first` para obtener la primera
clave coincidente de una colección de diccionarios.

### dig

La función `dig` recorre un conjunto anidado de dicts, seleccionando claves de una lista
de valores. Devuelve un valor por defecto si alguna de las claves no se encuentra en el
dict asociado.

```
dig "user" "role" "humanName" "guest" $dict
```

Dado un dict estructurado como
```
{
  user: {
    role: {
      humanName: "curator"
    }
  }
}
```

lo anterior devolvería `"curator"`. Si el dict careciera incluso de un campo `user`,
el resultado sería `"guest"`.

Dig puede ser muy útil en casos donde le gustaría evitar cláusulas de guardia,
especialmente ya que el `and` del paquete de plantillas de Go no hace cortocircuito. Por ejemplo
`and a.maybeNil a.maybeNil.iNeedThis` siempre evaluará
`a.maybeNil.iNeedThis`, y entrará en pánico si `a` carece de un campo `maybeNil`.)

`dig` acepta su argumento dict al final para soportar pipelining. Por ejemplo:
```
merge a b c | dig "one" "two" "three" "<missing>"
```

### merge, mustMerge

Combina dos o más diccionarios en uno, dando precedencia al diccionario
de destino:

Dado:

```
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

resultará en:

```
newdict:
  default: default
  overwrite: me
  key: true
```
```
$newdict := merge $dest $source1 $source2
```

Esta es una operación de combinación profunda pero no una operación de copia profunda. Los objetos
anidados que se combinan son la misma instancia en ambos dicts. Si desea una copia profunda
junto con la combinación, entonces use la función `deepCopy` junto con la combinación. Por
ejemplo,

```
deepCopy $source | merge $dest
```

`mustMerge` devolverá un error en caso de una combinación fallida.

### mergeOverwrite, mustMergeOverwrite

Combina dos o más diccionarios en uno, dando precedencia de **derecha a
izquierda**, sobrescribiendo efectivamente valores en el diccionario de destino:

Dado:

```
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

resultará en:

```
newdict:
  default: default
  overwrite: overwritten
  key: false
```

```
$newdict := mergeOverwrite $dest $source1 $source2
```

Esta es una operación de combinación profunda pero no una operación de copia profunda. Los objetos
anidados que se combinan son la misma instancia en ambos dicts. Si desea una copia profunda
junto con la combinación, entonces use la función `deepCopy` junto con la combinación. Por
ejemplo,

```
deepCopy $source | mergeOverwrite $dest
```

`mustMergeOverwrite` devolverá un error en caso de una combinación fallida.

### keys

La función `keys` devolverá una `list` de todas las claves en uno o más
tipos `dict`. Dado que un diccionario está _desordenado_, las claves no estarán en un
orden predecible. Pueden ordenarse con `sortAlpha`.

```
keys $myDict | sortAlpha
```

Al proporcionar múltiples diccionarios, las claves se concatenarán. Use la
función `uniq` junto con `sortAlpha` para obtener una lista única y ordenada de claves.

```
keys $myDict $myOtherDict | uniq | sortAlpha
```

### pick

La función `pick` selecciona solo las claves dadas de un diccionario, creando un
nuevo `dict`.

```
$new := pick $myDict "name1" "name2"
```

Lo anterior devuelve `{name1: value1, name2: value2}`

### omit

La función `omit` es similar a `pick`, excepto que devuelve un nuevo `dict` con
todas las claves que _no coinciden_ con las claves dadas.

```
$new := omit $myDict "name1" "name3"
```

Lo anterior devuelve `{name2: value2}`

### values

La función `values` es similar a `keys`, excepto que devuelve una nueva `list` con
todos los valores del `dict` fuente (solo se soporta un diccionario).

```
$vals := values $myDict
```

Lo anterior devuelve `list["value1", "value2", "value 3"]`. Note que la función `values`
no da garantías sobre el orden del resultado; si le importa esto,
entonces use `sortAlpha`.

### deepCopy, mustDeepCopy

Las funciones `deepCopy` y `mustDeepCopy` toman un valor y hacen una copia profunda
del valor. Esto incluye dicts y otras estructuras. `deepCopy` entra en pánico cuando
hay un problema, mientras que `mustDeepCopy` devuelve un error al sistema de plantillas
cuando hay un error.

```
dict "a" 1 "b" 2 | deepCopy
```

### Una Nota sobre los Internos de Dict

Un `dict` se implementa en Go como un `map[string]interface{}`. Los desarrolladores de Go pueden
pasar valores `map[string]interface{}` al contexto para hacerlos disponibles a
las plantillas como `dict`s.

## Funciones de Codificación

Helm tiene las siguientes funciones de codificación y decodificación:

- `b64enc`/`b64dec`: Codificar o decodificar con Base64
- `b32enc`/`b32dec`: Codificar o decodificar con Base32

## Funciones de Listas y List

Helm proporciona un tipo `list` simple que puede contener listas secuenciales arbitrarias
de datos. Esto es similar a arreglos o slices, pero las listas están diseñadas para ser usadas
como tipos de datos inmutables.

Crear una lista de enteros:

```
$myList := list 1 2 3 4 5
```

Lo anterior crea una lista de `[1 2 3 4 5]`.

Helm proporciona las siguientes funciones de lista: [append
(mustAppend)](#append-mustappend), [chunk](#chunk), [compact
(mustCompact)](#compact-mustcompact), [concat](#concat), [first
(mustFirst)](#first-mustfirst), [has (mustHas)](#has-musthas), [initial
(mustInitial)](#initial-mustinitial), [last (mustLast)](#last-mustlast),
[prepend (mustPrepend)](#prepend-mustprepend), [rest
(mustRest)](#rest-mustrest), [reverse (mustReverse)](#reverse-mustreverse),
[seq](#seq), [index](#index), [slice (mustSlice)](#slice-mustslice), [uniq
(mustUniq)](#uniq-mustuniq), [until](#until), [untilStep](#untilstep), y
[without (mustWithout)](#without-mustwithout).

### first, mustFirst

Para obtener el primer elemento de una lista, use `first`.

`first $myList` devuelve `1`

`first` entra en pánico si hay un problema, mientras que `mustFirst` devuelve un error al
motor de plantillas si hay un problema.

### rest, mustRest

Para obtener la cola de la lista (todo excepto el primer elemento), use `rest`.

`rest $myList` devuelve `[2 3 4 5]`

`rest` entra en pánico si hay un problema, mientras que `mustRest` devuelve un error al
motor de plantillas si hay un problema.

### last, mustLast

Para obtener el último elemento de una lista, use `last`:

`last $myList` devuelve `5`. Esto es aproximadamente análogo a invertir una lista y
luego llamar a `first`.

### initial, mustInitial

Esto complementa a `last` devolviendo todo _excepto_ el último elemento. `initial
$myList` devuelve `[1 2 3 4]`.

`initial` entra en pánico si hay un problema, mientras que `mustInitial` devuelve un error al
motor de plantillas si hay un problema.

### append, mustAppend

Agrega un nuevo elemento a una lista existente, creando una nueva lista.

```
$new = append $myList 6
```

Lo anterior establecería `$new` a `[1 2 3 4 5 6]`. `$myList` permanecería sin cambios.

`append` entra en pánico si hay un problema, mientras que `mustAppend` devuelve un error al
motor de plantillas si hay un problema.

### prepend, mustPrepend

Inserta un elemento al principio de una lista, creando una nueva lista.

```
prepend $myList 0
```

Lo anterior produciría `[0 1 2 3 4 5]`. `$myList` permanecería sin cambios.

`prepend` entra en pánico si hay un problema, mientras que `mustPrepend` devuelve un error al
motor de plantillas si hay un problema.

### concat

Concatena un número arbitrario de listas en una.

```
concat $myList ( list 6 7 ) ( list 8 )
```

Lo anterior produciría `[1 2 3 4 5 6 7 8]`. `$myList` permanecería sin cambios.

### reverse, mustReverse

Produce una nueva lista con los elementos invertidos de la lista dada.

```
reverse $myList
```

Lo anterior generaría la lista `[5 4 3 2 1]`.

`reverse` entra en pánico si hay un problema, mientras que `mustReverse` devuelve un error al
motor de plantillas si hay un problema.

### uniq, mustUniq

Genera una lista con todos los duplicados eliminados.

```
list 1 1 1 2 | uniq
```

Lo anterior produciría `[1 2]`

`uniq` entra en pánico si hay un problema, mientras que `mustUniq` devuelve un error al
motor de plantillas si hay un problema.

### without, mustWithout

La función `without` filtra elementos de una lista.

```
without $myList 3
```

Lo anterior produciría `[1 2 4 5]`

`without` puede tomar más de un filtro:

```
without $myList 1 3 5
```

Eso produciría `[2 4]`

`without` entra en pánico si hay un problema, mientras que `mustWithout` devuelve un error al
motor de plantillas si hay un problema.

### has, mustHas

Prueba si una lista tiene un elemento particular.

```
has 4 $myList
```

Lo anterior devolvería `true`, mientras que `has "hello" $myList` devolvería false.

`has` entra en pánico si hay un problema, mientras que `mustHas` devuelve un error al
motor de plantillas si hay un problema.

### compact, mustCompact

Acepta una lista y elimina entradas con valores vacíos.

```
$list := list 1 "a" "foo" ""
$copy := compact $list
```

`compact` devolverá una nueva lista con el elemento vacío (es decir, "") eliminado.

`compact` entra en pánico si hay un problema y `mustCompact` devuelve un error al
motor de plantillas si hay un problema.

### index

Para obtener el elemento n-ésimo de una lista, use `index list [n]`. Para indexar en
listas multidimensionales, use `index list [n] [m] ...`
- `index $myList 0` devuelve `1`. Es lo mismo que `myList[0]`
- `index $myList 0 1` sería lo mismo que `myList[0][1]`

### slice, mustSlice

Para obtener elementos parciales de una lista, use `slice list [n] [m]`. Es equivalente a
`list[n:m]`.

- `slice $myList` devuelve `[1 2 3 4 5]`. Es lo mismo que `myList[:]`.
- `slice $myList 3` devuelve `[4 5]`. Es lo mismo que `myList[3:]`.
- `slice $myList 1 3` devuelve `[2 3]`. Es lo mismo que `myList[1:3]`.
- `slice $myList 0 3` devuelve `[1 2 3]`. Es lo mismo que `myList[:3]`.

`slice` entra en pánico si hay un problema, mientras que `mustSlice` devuelve un error al
motor de plantillas si hay un problema.

### until

La función `until` construye un rango de enteros.

```
until 5
```

Lo anterior genera la lista `[0, 1, 2, 3, 4]`.

Esto es útil para iterar con `range $i, $e := until 5`.

### untilStep

Como `until`, `untilStep` genera una lista de enteros contando. Pero le permite
definir un inicio, fin y paso:

```
untilStep 3 6 2
```

Lo anterior producirá `[3 5]` comenzando con 3 y sumando 2 hasta que sea
igual o mayor que 6. Esto es similar a la función `range` de Python.

### seq

Funciona como el comando `seq` de bash.

* 1 parámetro (fin) - generará todos los enteros contando entre 1 y `fin`
  inclusive.
* 2 parámetros (inicio, fin) - generará todos los enteros contando entre
  `inicio` y `fin` inclusive incrementando o decrementando en 1.
* 3 parámetros (inicio, paso, fin) - generará todos los enteros contando entre
  `inicio` y `fin` inclusive incrementando o decrementando en `paso`.

```
seq 5       => 1 2 3 4 5
seq -3      => 1 0 -1 -2 -3
seq 0 2     => 0 1 2
seq 2 -2    => 2 1 0 -1 -2
seq 0 2 10  => 0 2 4 6 8 10
seq 0 -2 -5 => 0 -2 -4
```

### chunk

Para dividir una lista en fragmentos de un tamaño dado, use `chunk size list`. Esto es útil para paginación.

```
chunk 3 (list 1 2 3 4 5 6 7 8)
```

Esto produce una lista de listas `[ [ 1 2 3 ] [ 4 5 6 ] [ 7 8 ] ]`.

## Funciones Matemáticas

Todas las funciones matemáticas operan con valores `int64` a menos que se especifique lo contrario.

Las siguientes funciones matemáticas están disponibles: [add](#add), [add1](#add1),
[ceil](#ceil), [div](#div), [floor](#floor), [len](#len), [max](#max),
[min](#min), [mod](#mod), [mul](#mul), [round](#round), y [sub](#sub).

### add

Suma números con `add`. Acepta dos o más entradas.

```
add 1 2 3
```

### add1

Para incrementar en 1, use `add1`.

### sub

Para restar, use `sub`.

### div

Realiza división entera con `div`.

### mod

Módulo con `mod`.

### mul

Multiplica con `mul`. Acepta dos o más entradas.

```
mul 1 2 3
```

### max

Devuelve el mayor de una serie de enteros.

Esto devolverá `3`:

```
max 1 2 3
```

### min

Devuelve el menor de una serie de enteros.

`min 1 2 3` devolverá `1`.

### len

Devuelve la longitud del argumento como un entero.

```
len .Arg
```

## Funciones Matemáticas de Punto Flotante

Todas las funciones matemáticas operan con valores `float64`.

### addf

Suma números con `addf`

Esto devolverá `5.5`:

```
addf 1.5 2 2
```

### add1f

Para incrementar en 1, use `add1f`

### subf

Para restar, use `subf`

Esto es equivalente a `7.5 - 2 - 3` y devolverá `2.5`:

```
subf 7.5 2 3
```

### divf

Realiza división con `divf`

Esto es equivalente a `10 / 2 / 4` y devolverá `1.25`:

```
divf 10 2 4
```

### mulf

Multiplica con `mulf`

Esto devolverá `6`:

```
mulf 1.5 2 2
```

### maxf

Devuelve el mayor de una serie de flotantes:

Esto devolverá `3`:

```
maxf 1 2.5 3
```

### minf

Devuelve el menor de una serie de flotantes.

Esto devolverá `1.5`:

```
minf 1.5 2 3
```

### floor

Devuelve el mayor valor flotante menor o igual al valor de entrada.

`floor 123.9999` devolverá `123.0`.

### ceil

Devuelve el mayor valor flotante mayor o igual al valor de entrada.

`ceil 123.001` devolverá `124.0`.

### round

Devuelve un valor flotante con el resto redondeado al número dado de dígitos
después del punto decimal.

`round 123.555555 3` devolverá `123.556`.

## Funciones de Red

Helm tiene una única función de red, `getHostByName`.

`getHostByName` recibe un nombre de dominio y devuelve la dirección ip.

`getHostByName "www.google.com"` devolvería la dirección ip correspondiente de `www.google.com`.

Esta función requiere que se pase la opción `--enable-dns` en la línea de comandos de helm.

## Funciones de Rutas de Archivos

Aunque las funciones de plantilla de Helm no otorgan acceso al sistema de archivos, sí
proporcionan funciones para trabajar con cadenas que siguen convenciones de rutas de archivos.
Estas incluyen [base](#base), [clean](#clean), [dir](#dir), [ext](#ext), e
[isAbs](#isabs).

### base

Devuelve el último elemento de una ruta.

```
base "foo/bar/baz"
```

Lo anterior imprime "baz".

### dir

Devuelve el directorio, eliminando la última parte de la ruta. Así que `dir
"foo/bar/baz"` devuelve `foo/bar`.

### clean

Limpia una ruta.

```
clean "foo/bar/../baz"
```

Lo anterior resuelve el `..` y devuelve `foo/baz`.

### ext

Devuelve la extensión del archivo.

```
ext "foo.bar"
```

Lo anterior devuelve `.bar`.

### isAbs

Para verificar si una ruta de archivo es absoluta, use `isAbs`.

## Funciones de Reflexión

Helm proporciona herramientas de reflexión rudimentarias. Estas ayudan a los desarrolladores avanzados
de plantillas a entender la información de tipo de Go subyacente para un valor particular.
Helm está escrito en Go y tiene tipado fuerte. El sistema de tipos aplica dentro
de las plantillas.

Go tiene varios _kinds_ primitivos, como `string`, `slice`, `int64`, y `bool`.

Go tiene un sistema de _tipos_ abierto que permite a los desarrolladores crear sus propios tipos.

Helm proporciona un conjunto de funciones para cada uno a través de [funciones kind](#funciones-kind)
y [funciones type](#funciones-type). También se proporciona una función [deepEqual](#deepequal)
para comparar dos valores.

### Funciones Kind

Hay dos funciones Kind: `kindOf` devuelve el kind de un objeto.

```
kindOf "hello"
```

Lo anterior devolvería `string`. Para pruebas simples (como en bloques `if`), la
función `kindIs` le permitirá verificar que un valor es de un kind particular:

```
kindIs "int" 123
```

Lo anterior devolverá `true`.

### Funciones Type

Los tipos son ligeramente más difíciles de trabajar, por lo que hay tres funciones diferentes:

- `typeOf` devuelve el tipo subyacente de un valor: `typeOf $foo`
- `typeIs` es como `kindIs`, pero para tipos: `typeIs "*io.Buffer" $myVal`
- `typeIsLike` funciona como `typeIs`, excepto que también desreferencia punteros

**Nota:** Ninguna de estas puede probar si algo implementa una
interfaz dada, ya que hacerlo requeriría compilar la interfaz por adelantado.

### deepEqual

`deepEqual` devuelve true si dos valores son ["profundamente
iguales"](https://golang.org/pkg/reflect/#DeepEqual)

Funciona también para tipos no primitivos (comparado con el `eq` incorporado).

```
deepEqual (list 1 2 3) (list 1 2 3)
```

Lo anterior devolverá `true`.

## Funciones de Versiones Semánticas

Algunos esquemas de versiones son fácilmente parseables y comparables. Helm proporciona
funciones para trabajar con versiones [SemVer 2](http://semver.org). Estas incluyen
[semver](#semver) y [semverCompare](#semvercompare). A continuación también encontrará
detalles sobre el uso de rangos para comparaciones.

### semver

La función `semver` parsea una cadena en una Versión Semántica:

```
$version := semver "1.2.3-alpha.1+123"
```

_Si el parser falla, causará que la ejecución de la plantilla se detenga con un error._

En este punto, `$version` es un puntero a un objeto `Version` con las siguientes
propiedades:

- `$version.Major`: El número mayor (`1` arriba)
- `$version.Minor`: El número menor (`2` arriba)
- `$version.Patch`: El número de parche (`3` arriba)
- `$version.Prerelease`: El prerelease (`alpha.1` arriba)
- `$version.Metadata`: Los metadatos de compilación (`123` arriba)
- `$version.Original`: La versión original como cadena

Además, puede comparar una `Version` con otra `version` usando la
función `Compare`:

```
semver "1.4.3" | (semver "1.2.3").Compare
```

Lo anterior devolverá `-1`.

Los valores de retorno son:

- `-1` si la semver dada es mayor que la semver cuyo método `Compare` fue
  llamado
- `1` si la versión cuya función `Compare` fue llamada es mayor.
- `0` si son la misma versión

(Note que en SemVer, el campo `Metadata` no se compara durante las operaciones de
comparación de versiones.)

### semverCompare

Se proporciona una función de comparación más robusta como `semverCompare`. Esta versión
soporta rangos de versiones:

- `semverCompare "1.2.3" "1.2.3"` comprueba una coincidencia exacta
- `semverCompare "~1.2.0" "1.2.3"` comprueba que las versiones mayor y menor
  coincidan, y que el número de parche de la segunda versión sea _mayor o
  igual al_ primer parámetro.

Las funciones SemVer usan la [biblioteca semver de
Masterminds](https://github.com/Masterminds/semver), de los creadores de Sprig.

### Comparaciones Básicas

Hay dos elementos en las comparaciones. Primero, una cadena de comparación es una lista
de comparaciones AND separadas por espacios o comas. Estas luego se separan por || (OR)
comparaciones. Por ejemplo, `">= 1.2 < 3.0.0 || >= 4.2.3"` busca una
comparación que sea mayor o igual a 1.2 y menor que 3.0.0 o sea mayor
o igual a 4.2.3.

Las comparaciones básicas son:

- `=`: igual (alias de ningún operador)
- `!=`: no igual
- `>`: mayor que
- `<`: menor que
- `>=`: mayor o igual que
- `<=`: menor o igual que

### Trabajando con Versiones Prerelease

Los prereleases, para aquellos no familiarizados con ellos, se usan para lanzamientos de software
antes de lanzamientos estables o disponibles de forma general. Ejemplos de prereleases incluyen
lanzamientos de desarrollo, alpha, beta y release candidate. Un prerelease puede ser una
versión como `1.2.3-beta.1`, mientras que el lanzamiento estable sería `1.2.3`. En el
orden de precedencia, los prereleases vienen antes de sus lanzamientos asociados. En este
ejemplo `1.2.3-beta.1 < 1.2.3`.

Según la especificación de Versiones Semánticas, los prereleases pueden no ser compatibles
con la API de su contraparte de lanzamiento. Dice,

> Una versión prerelease indica que la versión es inestable y podría no
> satisfacer los requisitos de compatibilidad previstos como lo denota su
> versión normal asociada.

Las comparaciones de SemVer usando restricciones sin un comparador de prerelease omitirán
las versiones prerelease. Por ejemplo, `>=1.2.3` omitirá prereleases al buscar
en una lista de lanzamientos, mientras que `>=1.2.3-0` evaluará y encontrará prereleases.

La razón del `0` como versión prerelease en la comparación de ejemplo es
porque los prereleases solo pueden contener alfanuméricos ASCII y guiones (junto
con separadores `.`), según la especificación. El ordenamiento ocurre en orden ASCII,
nuevamente según la especificación. El carácter más bajo es un `0` en el orden ASCII (vea una [Tabla
ASCII](http://www.asciitable.com/))

Entender el ordenamiento ASCII es importante porque A-Z viene antes de a-z.
Eso significa que `>=1.2.3-BETA` devolverá `1.2.3-alpha`. Lo que podría esperar de la
sensibilidad a mayúsculas no aplica aquí. Esto se debe al ordenamiento ASCII que es lo que
la especificación indica.

### Comparaciones de Rango con Guion

Hay múltiples métodos para manejar rangos y el primero son los rangos con guion.
Estos se ven así:

- `1.2 - 1.4.5` que es equivalente a `>= 1.2 <= 1.4.5`
- `2.3.4 - 4.5` que es equivalente a `>= 2.3.4 <= 4.5`

### Comodines en Comparaciones

Los caracteres `x`, `X`, y `*` pueden usarse como comodines. Esto funciona
para todos los operadores de comparación. Cuando se usa en el operador `=` se retrocede al
nivel de comparación de parche (ver tilde abajo). Por ejemplo,

- `1.2.x` es equivalente a `>= 1.2.0, < 1.3.0`
- `>= 1.2.x` es equivalente a `>= 1.2.0`
- `<= 2.x` es equivalente a `< 3`
- `*` es equivalente a `>= 0.0.0`

### Comparaciones de Rango Tilde (Parche)

El operador de comparación tilde (`~`) es para rangos a nivel de parche cuando se especifica una versión
menor y cambios a nivel mayor cuando falta el número menor.
Por ejemplo,

- `~1.2.3` es equivalente a `>= 1.2.3, < 1.3.0`
- `~1` es equivalente a `>= 1, < 2`
- `~2.3` es equivalente a `>= 2.3, < 2.4`
- `~1.2.x` es equivalente a `>= 1.2.0, < 1.3.0`
- `~1.x` es equivalente a `>= 1, < 2`

### Comparaciones de Rango Circunflejo (Mayor)

El operador de comparación circunflejo (`^`) es para cambios a nivel mayor una vez que ha ocurrido un
lanzamiento estable (1.0.0). Antes de un lanzamiento 1.0.0, las versiones menores actúan
como el nivel de estabilidad de la API. Esto es útil cuando las comparaciones de versiones de API como un
cambio mayor es un cambio que rompe la API. Por ejemplo,

- `^1.2.3` es equivalente a `>= 1.2.3, < 2.0.0`
- `^1.2.x` es equivalente a `>= 1.2.0, < 2.0.0`
- `^2.3` es equivalente a `>= 2.3, < 3`
- `^2.x` es equivalente a `>= 2.0.0, < 3`
- `^0.2.3` es equivalente a `>=0.2.3 <0.3.0`
- `^0.2` es equivalente a `>=0.2.0 <0.3.0`
- `^0.0.3` es equivalente a `>=0.0.3 <0.0.4`
- `^0.0` es equivalente a `>=0.0.0 <0.1.0`
- `^0` es equivalente a `>=0.0.0 <1.0.0`

## Funciones de URL

Helm incluye las funciones [urlParse](#urlparse), [urlJoin](#urljoin), y
[urlquery](#urlquery) que le permiten trabajar con partes de URL.

### urlParse

Parsea una cadena para URL y produce un dict con las partes de la URL

```
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

Lo anterior devuelve un dict, conteniendo un objeto URL:

```yaml
scheme:   'http'
host:     'server.com:8080'
path:     '/api'
query:    'list=false'
opaque:   nil
fragment: 'anchor'
userinfo: 'admin:secret'
```

Esto se implementa usando los paquetes URL de la biblioteca estándar de Go. Para más
información, consulte https://golang.org/pkg/net/url/#URL

### urlJoin

Une un mapa (producido por `urlParse`) para producir una cadena URL

```
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

Lo anterior devuelve la siguiente cadena:
```
http://host:80/path?query#fragment
```

### urlquery

Devuelve la versión escapada del valor pasado como argumento para que sea
adecuado para incrustar en la parte de query de una URL.

```
$var := urlquery "string for query"
```

## Funciones de UUID

Helm puede generar IDs universalmente únicos UUID v4.

```
uuidv4
```

Lo anterior devuelve un nuevo UUID del tipo v4 (generado aleatoriamente).

## Funciones de Kubernetes y Chart

Helm incluye funciones para trabajar con Kubernetes incluyendo
[.Capabilities.APIVersions.Has](#capabilitiesapiversionshas),
[Files](#funciones-de-archivos), y [lookup](#lookup).

### lookup

`lookup` se usa para buscar recursos en un clúster en ejecución. Cuando se usa con el
comando `helm template` siempre devuelve una respuesta vacía.

Puede encontrar más detalles en la [documentación sobre la función
lookup](./functions_and_pipelines.md#usando-la-función-lookup).

### .Capabilities.APIVersions.Has

Devuelve si una versión de API o recurso está disponible en un clúster.

```
.Capabilities.APIVersions.Has "apps/v1"
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

Más información está disponible en la [documentación de objetos
incorporados](./builtin_objects.md).

### Funciones de Archivos

Hay varias funciones que le permiten acceder a archivos no especiales dentro de un
chart. Por ejemplo, para acceder a archivos de configuración de aplicaciones. Estas están
documentadas en [Acceder a Archivos Dentro de Plantillas](./accessing_files.md).

_Nota, la documentación para muchas de estas funciones proviene de
[Sprig](https://github.com/Masterminds/sprig). Sprig es una biblioteca de funciones de plantilla
disponible para aplicaciones Go._
