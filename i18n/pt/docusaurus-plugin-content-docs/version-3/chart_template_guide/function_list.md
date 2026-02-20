---
title: Lista de Funções de Template
description: Uma lista de funções de template disponíveis no Helm
sidebar_position: 6
---

O Helm inclui muitas funções de template que você pode utilizar em seus templates.
Elas estão listadas aqui e organizadas nas seguintes categorias:

* [Criptográficas e de Segurança](#funções-criptográficas-e-de-segurança)
* [Data](#funções-de-data)
* [Dicionários](#funções-de-dicionário-e-dict)
* [Codificação](#funções-de-codificação)
* [Caminhos de Arquivo](#funções-de-caminho-de-arquivo)
* [Kubernetes e Chart](#funções-de-kubernetes-e-chart)
* [Lógica e Controle de Fluxo](#funções-de-lógica-e-controle-de-fluxo)
* [Listas](#funções-de-lista-e-list)
* [Matemática](#funções-matemáticas)
* [Matemática com Float](#funções-matemáticas-com-float)
* [Rede](#funções-de-rede)
* [Reflexão](#funções-de-reflexão)
* [Expressões Regulares](#expressões-regulares)
* [Versões Semânticas](#funções-de-versão-semântica)
* [String](#funções-de-string)
* [Conversão de Tipos](#funções-de-conversão-de-tipos)
* [URL](#funções-de-url)
* [UUID](#funções-de-uuid)

## Funções de Lógica e Controle de Fluxo

O Helm inclui diversas funções de lógica e controle de fluxo, incluindo [and](#and),
[coalesce](#coalesce), [default](#default), [empty](#empty), [eq](#eq),
[fail](#fail), [ge](#ge), [gt](#gt), [le](#le), [lt](#lt), [ne](#ne),
[not](#not), [or](#or) e [required](#required).

### and

Retorna o AND booleano de dois ou mais argumentos
(o primeiro argumento vazio, ou o último argumento).

```
and .Arg1 .Arg2
```

### or

Retorna o OR booleano de dois ou mais argumentos
(o primeiro argumento não vazio, ou o último argumento).

```
or .Arg1 .Arg2
```

### not

Retorna a negação booleana do seu argumento.

```
not .Arg
```

### eq

Retorna a igualdade booleana dos argumentos (ex.: Arg1 == Arg2).

```
eq .Arg1 .Arg2
```

### ne

Retorna a desigualdade booleana dos argumentos (ex.: Arg1 != Arg2)

```
ne .Arg1 .Arg2
```

### lt

Retorna verdadeiro se o primeiro argumento for menor que o segundo. Caso
contrário, retorna falso (ex.: Arg1 < Arg2).

```
lt .Arg1 .Arg2
```

### le

Retorna verdadeiro se o primeiro argumento for menor ou igual ao segundo.
Caso contrário, retorna falso (ex.: Arg1 <= Arg2).

```
le .Arg1 .Arg2
```

### gt

Retorna verdadeiro se o primeiro argumento for maior que o segundo. Caso
contrário, retorna falso (ex.: Arg1 > Arg2).

```
gt .Arg1 .Arg2
```

### ge

Retorna verdadeiro se o primeiro argumento for maior ou igual ao segundo.
Caso contrário, retorna falso (ex.: Arg1 >= Arg2).

```
ge .Arg1 .Arg2
```

### default

Para definir um valor padrão simples, use `default`:

```
default "foo" .Bar
```

No exemplo acima, se `.Bar` for avaliado como um valor não vazio, ele será
usado. Mas se estiver vazio, `foo` será retornado em seu lugar.

A definição de "vazio" depende do tipo:

- Numérico: 0
- String: ""
- Listas: `[]`
- Dicts: `{}`
- Booleano: `false`
- E sempre `nil` (também conhecido como null)

Para structs, não há definição de vazio, então uma struct nunca retornará o
valor padrão.

### required

Especifique valores que devem ser definidos com `required`:

```
required "A valid foo is required!" .Bar
```

Se `.Bar` estiver vazio ou não definido (veja [default](#default) para saber como isso é 
avaliado), o template não será renderizado e retornará a mensagem de erro 
fornecida.

### empty

A função `empty` retorna `true` se o valor fornecido for considerado vazio, e
`false` caso contrário. Os valores vazios estão listados na seção `default`.

```
empty .Foo
```

Note que em condicionais de templates Go, o vazio é calculado automaticamente.
Assim, raramente você precisará usar `if not empty .Foo`. Em vez disso, use
apenas `if .Foo`.

### fail

Retorna incondicionalmente uma `string` vazia e um `error` com o texto
especificado. Isso é útil em cenários onde outras condicionais determinaram que
a renderização do template deve falhar.

```
fail "Please accept the end user license agreement"
```

### coalesce

A função `coalesce` recebe uma lista de valores e retorna o primeiro que não
estiver vazio.

```
coalesce 0 1 2
```

O exemplo acima retorna `1`.

Esta função é útil para verificar múltiplas variáveis ou valores:

```
coalesce .name .parent.name "Matt"
```

O exemplo acima primeiro verificará se `.name` está vazio. Se não estiver,
retornará esse valor. Se _estiver_ vazio, `coalesce` avaliará `.parent.name`
para verificar se está vazio. Finalmente, se tanto `.name` quanto `.parent.name`
estiverem vazios, retornará `Matt`.

### ternary

A função `ternary` recebe dois valores e um valor de teste. Se o valor de teste
for verdadeiro, o primeiro valor será retornado. Se o valor de teste estiver
vazio, o segundo valor será retornado. Isso é semelhante ao operador ternário em
C e outras linguagens de programação.

#### valor de teste verdadeiro

```
ternary "foo" "bar" true
```

ou

```
true | ternary "foo" "bar"
```

O exemplo acima retorna `"foo"`.

#### valor de teste falso

```
ternary "foo" "bar" false
```

ou

```
false | ternary "foo" "bar"
```

O exemplo acima retorna `"bar"`.

## Funções de String

O Helm inclui as seguintes funções de string: [abbrev](#abbrev),
[abbrevboth](#abbrevboth), [camelcase](#camelcase), [cat](#cat),
[contains](#contains), [hasPrefix](#hasprefix-e-hassuffix),
[hasSuffix](#hasprefix-e-hassuffix), [indent](#indent), [initials](#initials),
[kebabcase](#kebabcase), [lower](#lower), [nindent](#nindent),
[nospace](#nospace), [plural](#plural), [print](#print), [printf](#printf),
[println](#println), [quote](#quote-e-squote),
[randAlpha](#randalphanum-randalpha-randnumeric-e-randascii),
[randAlphaNum](#randalphanum-randalpha-randnumeric-e-randascii),
[randAscii](#randalphanum-randalpha-randnumeric-e-randascii),
[randNumeric](#randalphanum-randalpha-randnumeric-e-randascii),
[repeat](#repeat), [replace](#replace), [shuffle](#shuffle),
[snakecase](#snakecase), [squote](#quote-e-squote), [substr](#substr),
[swapcase](#swapcase), [title](#title), [trim](#trim), [trimAll](#trimall),
[trimPrefix](#trimprefix), [trimSuffix](#trimsuffix), [trunc](#trunc),
[untitle](#untitle), [upper](#upper), [wrap](#wrap) e [wrapWith](#wrapwith).

### print

Retorna uma string a partir da combinação de suas partes.

```
print "Matt has " .Dogs " dogs"
```

Tipos que não são strings são convertidos para strings quando possível.

Note que quando dois argumentos adjacentes não são strings, um espaço é
adicionado entre eles.

### println

Funciona da mesma forma que [print](#print), mas adiciona uma nova linha no
final.

### printf

Retorna uma string baseada em uma string de formatação e nos argumentos
passados a ela em ordem.

```
printf "%s has %d dogs." .Name .NumberDogs
```

O placeholder a ser usado depende do tipo do argumento que está sendo passado.
Isso inclui:

Propósito geral:

* `%v` o valor em um formato padrão
  * ao imprimir dicts, a flag plus (%+v) adiciona nomes de campos
* `%%` um sinal de porcentagem literal; não consome nenhum valor

Booleano:

* `%t` a palavra true ou false

Inteiro:

* `%b` base 2
* `%c` o caractere representado pelo ponto de código Unicode correspondente
* `%d` base 10
* `%o` base 8
* `%O` base 8 com prefixo 0o
* `%q` um caractere literal entre aspas simples, escapado de forma segura
* `%x` base 16, com letras minúsculas para a-f
* `%X` base 16, com letras maiúsculas para A-F
* `%U` formato Unicode: U+1234; mesmo que "U+%04X"

 Ponto flutuante e constituintes complexos:

* `%b` notação científica decimal com expoente sendo potência de dois, ex.: -123456p-78
* `%e` notação científica, ex.: -1.234456e+78
* `%E` notação científica, ex.: -1.234456E+78
* `%f` ponto decimal sem expoente, ex.: 123.456
* `%F` sinônimo para %f
* `%g` %e para expoentes grandes, %f caso contrário.
* `%G` %E para expoentes grandes, %F caso contrário
* `%x` notação hexadecimal (com expoente decimal de potência de dois), ex.: -0x1.23abcp+20
* `%X` notação hexadecimal maiúscula, ex.: -0X1.23ABCP+20

String e slice de bytes (tratados de forma equivalente com estes verbos):

* `%s` os bytes não interpretados da string ou slice
* `%q` uma string entre aspas duplas, escapada de forma segura
* `%x` base 16, minúsculo, dois caracteres por byte
* `%X` base 16, maiúsculo, dois caracteres por byte

Slice:

* `%p` endereço do elemento 0 em notação base 16, com 0x inicial

### trim

A função `trim` remove espaços em branco de ambos os lados de uma string:

```
trim "   hello    "
```

O exemplo acima produz `hello`

### trimAll

Remove os caracteres especificados do início e do final de uma string:

```
trimAll "$" "$5.00"
```

O exemplo acima retorna `5.00` (como uma string).

### trimPrefix

Remove apenas o prefixo de uma string:

```
trimPrefix "-" "-hello"
```

O exemplo acima retorna `hello`

### trimSuffix

Remove apenas o sufixo de uma string:

```
trimSuffix "-" "hello-"
```

O exemplo acima retorna `hello`

### lower

Converte toda a string para minúsculas:

```
lower "HELLO"
```

O exemplo acima retorna `hello`

### upper

Converte toda a string para maiúsculas:

```
upper "hello"
```

O exemplo acima retorna `HELLO`

### title

Converte para formato de título:

```
title "hello world"
```

O exemplo acima retorna `Hello World`

### untitle

Remove a formatação de título. `untitle "Hello World"` produz `hello world`.

### repeat

Repete uma string múltiplas vezes:

```
repeat 3 "hello"
```

O exemplo acima retorna `hellohellohello`

### substr

Obtém uma substring de uma string. Recebe três parâmetros:

- start (int)
- end (int)
- string (string)

```
substr 0 5 "hello world"
```

O exemplo acima retorna `hello`

### nospace

Remove todos os espaços em branco de uma string.

```
nospace "hello w o r l d"
```

O exemplo acima retorna `helloworld`

### trunc

Trunca uma string

```
trunc 5 "hello world"
```

O exemplo acima produz `hello`.

```
trunc -5 "hello world"
```

O exemplo acima produz `world`.

### abbrev

Trunca uma string com reticências (`...`)

Parâmetros:

- comprimento máximo
- a string

```
abbrev 5 "hello world"
```

O exemplo acima retorna `he...`, pois conta a largura das reticências contra o
comprimento máximo.

### abbrevboth

Abrevia em ambos os lados:

```
abbrevboth 5 10 "1234 5678 9123"
```

O exemplo acima produz `...5678...`

Recebe:

- deslocamento à esquerda
- comprimento máximo
- a string

### initials

Dadas múltiplas palavras, pega a primeira letra de cada palavra e as combina.

```
initials "First Try"
```

O exemplo acima retorna `FT`

### randAlphaNum, randAlpha, randNumeric e randAscii

Estas quatro funções geram strings aleatórias criptograficamente seguras (usam
```crypto/rand```), mas com diferentes conjuntos de caracteres base:

- `randAlphaNum` usa `0-9a-zA-Z`
- `randAlpha` usa `a-zA-Z`
- `randNumeric` usa `0-9`
- `randAscii` usa todos os caracteres ASCII imprimíveis

Cada uma delas recebe um parâmetro: o comprimento inteiro da string.

```
randNumeric 3
```

O exemplo acima produzirá uma string aleatória com três dígitos.

### wrap

Quebra texto em uma contagem de colunas especificada:

```
wrap 80 $someText
```

O exemplo acima quebrará a string em `$someText` em 80 colunas.

### wrapWith

`wrapWith` funciona como `wrap`, mas permite especificar a string usada para
quebrar. (`wrap` usa `\n`)

```
wrapWith 5 "\t" "Hello World"
```

O exemplo acima produz `Hello World` (onde o espaço em branco é um caractere de
tabulação ASCII)

### contains

Testa se uma string está contida dentro de outra:

```
contains "cat" "catch"
```

O exemplo acima retorna `true` porque `catch` contém `cat`.

### hasPrefix e hasSuffix

As funções `hasPrefix` e `hasSuffix` testam se uma string tem um determinado
prefixo ou sufixo:

```
hasPrefix "cat" "catch"
```

O exemplo acima retorna `true` porque `catch` tem o prefixo `cat`.

### quote e squote

Estas funções envolvem uma string em aspas duplas (`quote`) ou aspas simples
(`squote`).

### cat

A função `cat` concatena múltiplas strings em uma, separando-as com espaços:

```
cat "hello" "beautiful" "world"
```

O exemplo acima produz `hello beautiful world`

### indent

A função `indent` indenta cada linha de uma string com a largura de indentação
especificada. Isso é útil ao alinhar strings de múltiplas linhas:

```
indent 4 $lots_of_text
```

O exemplo acima indentará cada linha de texto com 4 caracteres de espaço.

### nindent

A função `nindent` é igual à função indent, mas adiciona uma nova linha no
início da string.

```
nindent 4 $lots_of_text
```

O exemplo acima indentará cada linha de texto com 4 caracteres de espaço e
adicionará uma nova linha no início.

### replace

Realiza substituição simples de string.

Recebe três argumentos:

- string a ser substituída
- string de substituição
- string fonte

```
"I Am Henry VIII" | replace " " "-"
```

O exemplo acima produzirá `I-Am-Henry-VIII`

### plural

Pluraliza uma string.

```
len $fish | plural "one anchovy" "many anchovies"
```

No exemplo acima, se o comprimento da string for 1, o primeiro argumento será
impresso (`one anchovy`). Caso contrário, o segundo argumento será impresso
(`many anchovies`).

Os argumentos são:

- string singular
- string plural
- inteiro de comprimento

NOTA: O Helm atualmente não suporta idiomas com regras de pluralização mais
complexas. E `0` é considerado plural porque o idioma inglês o trata assim
(`zero anchovies`).

### snakecase

Converte string de camelCase para snake_case.

```
snakecase "FirstName"
```

O exemplo acima produzirá `first_name`.

### camelcase

Converte string de snake_case para CamelCase

```
camelcase "http_server"
```

O exemplo acima produzirá `HttpServer`.

### kebabcase

Converte string de camelCase para kebab-case.

```
kebabcase "FirstName"
```

O exemplo acima produzirá `first-name`.

### swapcase

Troca o caso de uma string usando um algoritmo baseado em palavras.

Algoritmo de conversão:

- Caractere maiúsculo converte para minúsculo
- Caractere de título converte para minúsculo
- Caractere minúsculo após espaço em branco ou no início converte para título
- Outro caractere minúsculo converte para maiúsculo
- Espaço em branco é definido por unicode.IsSpace(char)

```
swapcase "This Is A.Test"
```

O exemplo acima produzirá `tHIS iS a.tEST`.

### shuffle

Embaralha uma string.

```
shuffle "hello"
```

O exemplo acima randomizará as letras em `hello`, possivelmente produzindo
`oelhl`.

## Funções de Conversão de Tipos

As seguintes funções de conversão de tipos são fornecidas pelo Helm:

- `atoi`: Converte uma string para um inteiro.
- `float64`: Converte para um `float64`.
- `int`: Converte para um `int` com a largura do sistema.
- `int64`: Converte para um `int64`.
- `toDecimal`: Converte um octal unix para um `int64`.
- `toString`: Converte para uma string.
- `toStrings`: Converte uma list, slice ou array para uma lista de strings.
- `toJson` (`mustToJson`): Converte list, slice, array, dict ou objeto para JSON.
- `toPrettyJson` (`mustToPrettyJson`): Converte list, slice, array, dict ou
  objeto para JSON indentado.
- `toRawJson` (`mustToRawJson`): Converte list, slice, array, dict ou objeto
  para JSON com caracteres HTML não escapados.
- `fromYaml`: Converte uma string YAML para um objeto.
- `fromJson`: Converte uma string JSON para um objeto.
- `fromJsonArray`: Converte um array JSON para uma lista.
- `toYaml`: Converte list, slice, array, dict ou objeto para yaml indentado,
  pode ser usado para copiar trechos de yaml de qualquer fonte. Esta função é
  equivalente à função GoLang yaml.Marshal, veja a documentação aqui:
  https://pkg.go.dev/gopkg.in/yaml.v2#Marshal
- `toYamlPretty`: Converte list, slice, array, dict ou objeto para yaml
  indentado. Equivalente a `toYaml`, mas adicionalmente indenta listas em 2
  espaços.
- `toToml`: Converte list, slice, array, dict ou objeto para toml, pode ser
  usado para copiar trechos de toml de qualquer fonte.
- `fromYamlArray`: Converte um array YAML para uma lista.

Apenas `atoi` requer que a entrada seja de um tipo específico. As outras
tentarão converter de qualquer tipo para o tipo de destino. Por exemplo, `int64`
pode converter floats para ints, e também pode converter strings para ints.

### toStrings

Dada uma coleção similar a lista, produz uma slice de strings.

```
list 1 2 3 | toStrings
```

O exemplo acima converte `1` para `"1"`, `2` para `"2"`, e assim por diante, e
então os retorna como uma lista.

### toDecimal

Dada uma permissão octal unix, produz um decimal.

```
"0777" | toDecimal
```

O exemplo acima converte `0777` para `511` e retorna o valor como um int64.

### toJson, mustToJson

A função `toJson` codifica um item em uma string JSON. Se o item não puder ser
convertido para JSON, a função retornará uma string vazia. `mustToJson`
retornará um erro caso o item não possa ser codificado em JSON.

```
toJson .Item
```

O exemplo acima retorna a representação em string JSON de `.Item`.

### toPrettyJson, mustToPrettyJson

A função `toPrettyJson` codifica um item em uma string JSON formatada
(indentada).

```
toPrettyJson .Item
```

O exemplo acima retorna a representação indentada em string JSON de `.Item`.

### toRawJson, mustToRawJson

A função `toRawJson` codifica um item em uma string JSON com caracteres HTML não
escapados.

```
toRawJson .Item
```

O exemplo acima retorna a representação em string JSON não escapada de `.Item`.

### fromYaml

A função `fromYaml` recebe uma string YAML e retorna um objeto que pode ser
usado em templates.

`Arquivo em: yamls/person.yaml`
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

A função `fromJson` recebe uma string JSON e retorna um objeto que pode ser
usado em templates.

`Arquivo em: jsons/person.json`
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

A função `fromJsonArray` recebe um Array JSON e retorna uma lista que pode ser
usada em templates.

`Arquivo em: jsons/people.json`
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

As funções `toYaml` e `toYamlPretty` codificam um objeto (list, slice, array,
dict ou objeto) em uma string YAML indentada.

> Note que `toYamlPretty` é funcionalmente equivalente, mas produzirá YAML com
> indentação adicional para elementos de lista

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

A função `fromYamlArray` recebe um Array YAML e retorna uma lista que pode ser
usada em templates.

`Arquivo em: yamls/people.yml`
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


## Expressões Regulares

O Helm inclui as seguintes funções de expressões regulares: [regexFind
(mustRegexFind)](#regexfindall-mustregexfindall), [regexFindAll
(mustRegexFindAll)](#regexfind-mustregexfind), [regexMatch
(mustRegexMatch)](#regexmatch-mustregexmatch), [regexReplaceAll
(mustRegexReplaceAll)](#regexreplaceall-mustregexreplaceall),
[regexReplaceAllLiteral
(mustRegexReplaceAllLiteral)](#regexreplaceallliteral-mustregexreplaceallliteral),
[regexSplit (mustRegexSplit)](#regexsplit-mustregexsplit).

### regexMatch, mustRegexMatch

Retorna true se a string de entrada contiver qualquer correspondência da
expressão regular.

```
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"
```

O exemplo acima produz `true`

`regexMatch` causa panic se houver um problema e `mustRegexMatch` retorna um
erro para o motor de templates se houver um problema.

### regexFindAll, mustRegexFindAll

Retorna uma slice de todas as correspondências da expressão regular na string de
entrada. O último parâmetro n determina o número de substrings a retornar, onde
-1 significa retornar todas as correspondências

```
regexFindAll "[2,4,6,8]" "123456789" -1
```

O exemplo acima produz `[2 4 6 8]`

`regexFindAll` causa panic se houver um problema e `mustRegexFindAll` retorna
um erro para o motor de templates se houver um problema.

### regexFind, mustRegexFind

Retorna a primeira (mais à esquerda) correspondência da expressão regular na
string de entrada

```
regexFind "[a-zA-Z][1-9]" "abcd1234"
```

O exemplo acima produz `d1`

`regexFind` causa panic se houver um problema e `mustRegexFind` retorna um erro
para o motor de templates se houver um problema.

### regexReplaceAll, mustRegexReplaceAll

Retorna uma cópia da string de entrada, substituindo correspondências da Regexp
pela string de substituição. Dentro da string de substituição, sinais $ são
interpretados como em Expand, então, por exemplo, $1 representa o texto da
primeira subcorrespondência. O primeiro argumento é `<pattern>`, o segundo é
`<input>`, e o terceiro é `<replacement>`.

```
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

O exemplo acima produz `-W-xxW-`

`regexReplaceAll` causa panic se houver um problema e `mustRegexReplaceAll`
retorna um erro para o motor de templates se houver um problema.

### regexReplaceAllLiteral, mustRegexReplaceAllLiteral

Retorna uma cópia da string de entrada, substituindo correspondências da Regexp
pela string de substituição. A string de substituição é substituída diretamente,
sem usar Expand. O primeiro argumento é `<pattern>`, o segundo é `<input>`, e o
terceiro é `<replacement>`.

```
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"
```

O exemplo acima produz `-${1}-${1}-`

`regexReplaceAllLiteral` causa panic se houver um problema e
`mustRegexReplaceAllLiteral` retorna um erro para o motor de templates se houver
um problema.

### regexSplit, mustRegexSplit

Divide a string de entrada em substrings separadas pela expressão e retorna uma
slice das substrings entre essas correspondências da expressão. O último
parâmetro `n` determina o número de substrings a retornar, onde `-1` significa
retornar todas as correspondências

```
regexSplit "z+" "pizza" -1
```

O exemplo acima produz `[pi a]`

`regexSplit` causa panic se houver um problema e `mustRegexSplit` retorna um
erro para o motor de templates se houver um problema.

## Funções Criptográficas e de Segurança

O Helm fornece algumas funções criptográficas avançadas. Elas incluem
[adler32sum](#adler32sum), [buildCustomCert](#buildcustomcert),
[decryptAES](#decryptaes), [derivePassword](#derivepassword),
[encryptAES](#encryptaes), [genCA](#genca), [genPrivateKey](#genprivatekey),
[genSelfSignedCert](#genselfsignedcert), [genSignedCert](#gensignedcert),
[htpasswd](#htpasswd), [randBytes](#randbytes), [sha1sum](#sha1sum) e
[sha256sum](#sha256sum).

### sha1sum

A função `sha1sum` recebe uma string e calcula seu digest SHA1.

```
sha1sum "Hello world!"
```

### sha256sum

A função `sha256sum` recebe uma string e calcula seu digest SHA256.

```
sha256sum "Hello world!"
```

O exemplo acima calculará a soma SHA 256 em um formato "ASCII armored" que é
seguro para imprimir.

### adler32sum

A função `adler32sum` recebe uma string e calcula seu checksum Adler-32.

```
adler32sum "Hello world!"
```

### htpasswd

A função `htpasswd` recebe um `username` e `password` e gera um hash `bcrypt` da
senha. O resultado pode ser usado para autenticação básica em um [Servidor HTTP
Apache](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html#basic).

```
htpasswd "myUser" "myPassword"
```

Note que é inseguro armazenar a senha diretamente no template.

### randBytes

A função randBytes aceita um número N e gera uma sequência aleatória
criptograficamente segura (usa crypto/rand) de N bytes. A sequência é retornada
como uma string codificada em base64.

```
randBytes 24
```

### derivePassword

A função `derivePassword` pode ser usada para derivar uma senha específica
baseada em algumas restrições de "senha mestre" compartilhadas. O algoritmo para
isso é [bem
especificado](https://web.archive.org/web/20211019121301/https://masterpassword.app/masterpassword-algorithm.pdf).

```
derivePassword 1 "long" "password" "user" "example.com"
```

Note que é considerado inseguro armazenar as partes diretamente no template.

### genPrivateKey

A função `genPrivateKey` gera uma nova chave privada codificada em um bloco PEM.

Ela aceita um dos seguintes valores para seu primeiro parâmetro:

- `ecdsa`: Gera uma chave DSA de curva elíptica (P256)
- `dsa`: Gera uma chave DSA (L2048N256)
- `rsa`: Gera uma chave RSA 4096

### buildCustomCert

A função `buildCustomCert` permite personalizar o certificado.

Ela recebe os seguintes parâmetros string:

- Um certificado em formato PEM codificado em base64
- Uma chave privada em formato PEM codificada em base64

Retorna um objeto de certificado com os seguintes atributos:

- `Cert`: Um certificado codificado em PEM
- `Key`: Uma chave privada codificada em PEM

Exemplo:

```
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
```

Note que o objeto retornado pode ser passado para a função `genSignedCert` para
assinar um certificado usando esta CA.

### genCA

A função `genCA` gera uma nova autoridade certificadora x509 autoassinada.

Ela recebe os seguintes parâmetros:

- Nome comum do sujeito (cn)
- Duração da validade do certificado em dias

Retorna um objeto com os seguintes atributos:

- `Cert`: Um certificado codificado em PEM
- `Key`: Uma chave privada codificada em PEM

Exemplo:

```
$ca := genCA "foo-ca" 365
```

Note que o objeto retornado pode ser passado para a função `genSignedCert` para
assinar um certificado usando esta CA.

### genSelfSignedCert

A função `genSelfSignedCert` gera um novo certificado x509 autoassinado.

Ela recebe os seguintes parâmetros:

- Nome comum do sujeito (cn)
- Lista opcional de IPs; pode ser nil
- Lista opcional de nomes DNS alternativos; pode ser nil
- Duração da validade do certificado em dias

Retorna um objeto com os seguintes atributos:

- `Cert`: Um certificado codificado em PEM
- `Key`: Uma chave privada codificada em PEM

Exemplo:

```
$cert := genSelfSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365
```

### genSignedCert

A função `genSignedCert` gera um novo certificado x509 assinado pela CA
especificada.

Ela recebe os seguintes parâmetros:

- Nome comum do sujeito (cn)
- Lista opcional de IPs; pode ser nil
- Lista opcional de nomes DNS alternativos; pode ser nil
- Duração da validade do certificado em dias
- CA (veja `genCA`)

Exemplo:

```
$ca := genCA "foo-ca" 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

### encryptAES

A função `encryptAES` criptografa texto com AES-256 CBC e retorna uma string
codificada em base64.

```
encryptAES "secretkey" "plaintext"
```

### decryptAES

A função `decryptAES` recebe uma string base64 codificada pelo algoritmo AES-256
CBC e retorna o texto decodificado.

```
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

## Funções de Data

O Helm inclui as seguintes funções de data que você pode usar em templates:
[ago](#ago), [date](#date), [dateInZone](#dateinzone), [dateModify
(mustDateModify)](#datemodify-mustdatemodify), [duration](#duration),
[durationRound](#durationround), [htmlDate](#htmldate),
[htmlDateInZone](#htmldateinzone), [now](#now), [toDate
(mustToDate)](#todate-musttodate) e [unixEpoch](#unixepoch).

### now

A data/hora atual. Use isso em conjunto com outras funções de data.

### ago

A função `ago` retorna a duração desde o momento. Agora em resolução de segundos.

```
ago .CreatedAt
```

retorna no formato String() de `time.Duration`

```
2h34m7s
```

### date

A função `date` formata uma data.

Formata a data para ANO-MÊS-DIA:

```
now | date "2006-01-02"
```

A formatação de datas em Go é [um pouco
diferente](https://pauladamsmith.com/blog/2011/05/go_time.html).

Em resumo, use isso como a data base:

```
Mon Jan 2 15:04:05 MST 2006
```

Escreva-a no formato que você deseja. Acima, `2006-01-02` é a mesma data, mas no
formato que queremos.

### dateInZone

Igual a `date`, mas com um fuso horário.

```
dateInZone "2006-01-02" (now) "UTC"
```

### duration

Formata uma quantidade de segundos como um `time.Duration`.

Isso retorna 1m35s

```
duration "95"
```

### durationRound

Arredonda uma duração para a unidade mais significativa. Strings e
`time.Duration` são analisados como uma duração, enquanto um `time.Time` é
calculado como a duração desde então.

Isso retorna 2h

```
durationRound "2h10m5s"
```

Isso retorna 3mo

```
durationRound "2400h10m5s"
```

### unixEpoch

Retorna os segundos desde a época unix para um `time.Time`.

```
now | unixEpoch
```

### dateModify, mustDateModify

O `dateModify` recebe uma modificação e uma data e retorna o timestamp.

Subtrai uma hora e trinta minutos do horário atual:

```
now | dateModify "-1.5h"
```

Se o formato de modificação estiver errado, `dateModify` retornará a data sem
modificação. `mustDateModify` retornará um erro caso contrário.

### htmlDate

A função `htmlDate` formata uma data para inserir em um campo de entrada de
seleção de data HTML.

```
now | htmlDate
```

### htmlDateInZone

Igual a htmlDate, mas com um fuso horário.

```
htmlDateInZone (now) "UTC"
```

### toDate, mustToDate

`toDate` converte uma string para uma data. O primeiro argumento é o layout da
data e o segundo é a string da data. Se a string não puder ser convertida,
retorna o valor zero. `mustToDate` retornará um erro caso a string não possa ser
convertida.

Isso é útil quando você quer converter uma data em string para outro formato
(usando pipe). O exemplo abaixo converte "2017-12-31" para "31/12/2017".

```
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

## Funções de Dicionário e Dict

O Helm fornece um tipo de armazenamento chave/valor chamado `dict` (abreviação
de "dictionary", como em Python). Um `dict` é um tipo _não ordenado_.

A chave de um dicionário **deve ser uma string**. No entanto, o valor pode ser
de qualquer tipo, incluindo outro `dict` ou `list`.

Diferente de `list`s, `dict`s não são imutáveis. As funções `set` e `unset`
modificarão o conteúdo de um dicionário.

O Helm fornece as seguintes funções para trabalhar com dicts: [deepCopy
(mustDeepCopy)](#deepcopy-mustdeepcopy), [dict](#dict), [dig](#dig), [get](#get),
[hasKey](#haskey), [keys](#keys), [merge (mustMerge)](#merge-mustmerge),
[mergeOverwrite (mustMergeOverwrite)](#mergeoverwrite-mustmergeoverwrite),
[omit](#omit), [pick](#pick), [pluck](#pluck), [set](#set), [unset](#unset) e
[values](#values).

### dict

Criar dicionários é feito chamando a função `dict` e passando uma lista de
pares.

O seguinte cria um dicionário com três itens:

```
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
```

### get

Dado um map e uma chave, obtém o valor do map.

```
get $myDict "name1"
```

O exemplo acima retorna `"value1"`

Note que se a chave não for encontrada, esta operação simplesmente retornará
`""`. Nenhum erro será gerado.

### set

Use `set` para adicionar um novo par chave/valor a um dicionário.

```
$_ := set $myDict "name4" "value4"
```

Note que `set` _retorna o dicionário_ (um requisito das funções de template Go),
então você pode precisar capturar o valor como feito acima com a atribuição
`$_`.

### unset

Dado um map e uma chave, remove a chave do map.

```
$_ := unset $myDict "name4"
```

Assim como `set`, isso retorna o dicionário.

Note que se a chave não for encontrada, esta operação simplesmente retornará.
Nenhum erro será gerado.

### hasKey

A função `hasKey` retorna `true` se o dict fornecido contiver a chave
especificada.

```
hasKey $myDict "name1"
```

Se a chave não for encontrada, retorna `false`.

### pluck

A função `pluck` permite fornecer uma chave e múltiplos maps, e obter uma lista
de todas as correspondências:

```
pluck "name1" $myDict $myOtherDict
```

O exemplo acima retornará uma `list` contendo cada valor encontrado (`[value1
otherValue1]`).

Se a chave _não for encontrada_ em um map, esse map não terá um item na lista (e
o comprimento da lista retornada será menor que o número de dicts na chamada de
`pluck`).

Se a chave _for encontrada_ mas o valor estiver vazio, esse valor será inserido.

Um idioma comum em templates Helm é usar `pluck... | first` para obter a
primeira chave correspondente de uma coleção de dicionários.

### dig

A função `dig` percorre um conjunto aninhado de dicts, selecionando chaves de
uma lista de valores. Ela retorna um valor padrão se alguma das chaves não for
encontrada no dict associado.

```
dig "user" "role" "humanName" "guest" $dict
```

Dado um dict estruturado como
```
{
  user: {
    role: {
      humanName: "curator"
    }
  }
}
```

o exemplo acima retornaria `"curator"`. Se o dict não tivesse nem um campo
`user`, o resultado seria `"guest"`.

Dig pode ser muito útil em casos onde você gostaria de evitar cláusulas de
guarda, especialmente porque o `and` do pacote de templates Go não faz
curto-circuito. Por exemplo, `and a.maybeNil a.maybeNil.iNeedThis` sempre
avaliará `a.maybeNil.iNeedThis`, e causará panic se `a` não tiver um campo
`maybeNil`.)

`dig` aceita seu argumento dict por último para suportar pipelining. Por
exemplo:
```
merge a b c | dig "one" "two" "three" "<missing>"
```

### merge, mustMerge

Mescla dois ou mais dicionários em um, dando precedência ao dicionário de
destino:

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

resultará em:

```
newdict:
  default: default
  overwrite: me
  key: true
```
```
$newdict := merge $dest $source1 $source2
```

Esta é uma operação de mesclagem profunda, mas não uma operação de cópia
profunda. Objetos aninhados que são mesclados são a mesma instância em ambos os
dicts. Se você quiser uma cópia profunda junto com a mesclagem, use a função
`deepCopy` junto com a mesclagem. Por exemplo,

```
deepCopy $source | merge $dest
```

`mustMerge` retornará um erro em caso de mesclagem malsucedida.

### mergeOverwrite, mustMergeOverwrite

Mescla dois ou mais dicionários em um, dando precedência **da direita para a
esquerda**, efetivamente sobrescrevendo valores no dicionário de destino:

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

resultará em:

```
newdict:
  default: default
  overwrite: overwritten
  key: false
```

```
$newdict := mergeOverwrite $dest $source1 $source2
```

Esta é uma operação de mesclagem profunda, mas não uma operação de cópia
profunda. Objetos aninhados que são mesclados são a mesma instância em ambos os
dicts. Se você quiser uma cópia profunda junto com a mesclagem, use a função
`deepCopy` junto com a mesclagem. Por exemplo,

```
deepCopy $source | mergeOverwrite $dest
```

`mustMergeOverwrite` retornará um erro em caso de mesclagem malsucedida.

### keys

A função `keys` retornará uma `list` de todas as chaves em um ou mais tipos
`dict`. Como um dicionário é _não ordenado_, as chaves não estarão em uma ordem
previsível. Elas podem ser ordenadas com `sortAlpha`.

```
keys $myDict | sortAlpha
```

Ao fornecer múltiplos dicionários, as chaves serão concatenadas. Use a função
`uniq` junto com `sortAlpha` para obter uma lista única e ordenada de chaves.

```
keys $myDict $myOtherDict | uniq | sortAlpha
```

### pick

A função `pick` seleciona apenas as chaves especificadas de um dicionário,
criando um novo `dict`.

```
$new := pick $myDict "name1" "name2"
```

O exemplo acima retorna `{name1: value1, name2: value2}`

### omit

A função `omit` é similar a `pick`, exceto que retorna um novo `dict` com todas
as chaves que _não_ correspondem às chaves especificadas.

```
$new := omit $myDict "name1" "name3"
```

O exemplo acima retorna `{name2: value2}`

### values

A função `values` é similar a `keys`, exceto que retorna uma nova `list` com
todos os valores do `dict` de origem (apenas um dicionário é suportado).

```
$vals := values $myDict
```

O exemplo acima retorna `list["value1", "value2", "value 3"]`. Note que a função
`values` não dá garantias sobre a ordenação do resultado; se você se importa com
isso, use `sortAlpha`.

### deepCopy, mustDeepCopy

As funções `deepCopy` e `mustDeepCopy` recebem um valor e fazem uma cópia
profunda dele. Isso inclui dicts e outras estruturas. `deepCopy` causa panic
quando há um problema, enquanto `mustDeepCopy` retorna um erro para o sistema de
templates quando há um erro.

```
dict "a" 1 "b" 2 | deepCopy
```

### Uma Nota sobre Internos de Dict

Um `dict` é implementado em Go como um `map[string]interface{}`. Desenvolvedores
Go podem passar valores `map[string]interface{}` para o contexto para
disponibilizá-los para templates como `dict`s.

## Funções de Codificação

O Helm tem as seguintes funções de codificação e decodificação:

- `b64enc`/`b64dec`: Codifica ou decodifica com Base64
- `b32enc`/`b32dec`: Codifica ou decodifica com Base32

## Funções de Lista e List

O Helm fornece um tipo simples `list` que pode conter listas sequenciais
arbitrárias de dados. Isso é similar a arrays ou slices, mas listas são
projetadas para serem usadas como tipos de dados imutáveis.

Crie uma lista de inteiros:

```
$myList := list 1 2 3 4 5
```

O exemplo acima cria uma lista `[1 2 3 4 5]`.

O Helm fornece as seguintes funções de lista: [append
(mustAppend)](#append-mustappend), [chunk](#chunk), [compact
(mustCompact)](#compact-mustcompact), [concat](#concat), [first
(mustFirst)](#first-mustfirst), [has (mustHas)](#has-musthas), [initial
(mustInitial)](#initial-mustinitial), [last (mustLast)](#last-mustlast),
[prepend (mustPrepend)](#prepend-mustprepend), [rest
(mustRest)](#rest-mustrest), [reverse (mustReverse)](#reverse-mustreverse),
[seq](#seq), [index](#index), [slice (mustSlice)](#slice-mustslice), [uniq
(mustUniq)](#uniq-mustuniq), [until](#until), [untilStep](#untilstep) e
[without (mustWithout)](#without-mustwithout).

### first, mustFirst

Para obter o primeiro item de uma lista, use `first`.

`first $myList` retorna `1`

`first` causa panic se houver um problema, enquanto `mustFirst` retorna um erro
para o motor de templates se houver um problema.

### rest, mustRest

Para obter a cauda da lista (tudo exceto o primeiro item), use `rest`.

`rest $myList` retorna `[2 3 4 5]`

`rest` causa panic se houver um problema, enquanto `mustRest` retorna um erro
para o motor de templates se houver um problema.

### last, mustLast

Para obter o último item de uma lista, use `last`:

`last $myList` retorna `5`. Isso é aproximadamente análogo a inverter uma lista
e então chamar `first`.

### initial, mustInitial

Isso complementa `last` retornando todos os elementos _exceto_ o último.
`initial $myList` retorna `[1 2 3 4]`.

`initial` causa panic se houver um problema, enquanto `mustInitial` retorna um
erro para o motor de templates se houver um problema.

### append, mustAppend

Adiciona um novo item a uma lista existente, criando uma nova lista.

```
$new = append $myList 6
```

O exemplo acima definiria `$new` como `[1 2 3 4 5 6]`. `$myList` permaneceria
inalterada.

`append` causa panic se houver um problema, enquanto `mustAppend` retorna um
erro para o motor de templates se houver um problema.

### prepend, mustPrepend

Adiciona um elemento no início de uma lista, criando uma nova lista.

```
prepend $myList 0
```

O exemplo acima produziria `[0 1 2 3 4 5]`. `$myList` permaneceria inalterada.

`prepend` causa panic se houver um problema, enquanto `mustPrepend` retorna um
erro para o motor de templates se houver um problema.

### concat

Concatena um número arbitrário de listas em uma.

```
concat $myList ( list 6 7 ) ( list 8 )
```

O exemplo acima produziria `[1 2 3 4 5 6 7 8]`. `$myList` permaneceria
inalterada.

### reverse, mustReverse

Produz uma nova lista com os elementos invertidos da lista fornecida.

```
reverse $myList
```

O exemplo acima geraria a lista `[5 4 3 2 1]`.

`reverse` causa panic se houver um problema, enquanto `mustReverse` retorna um
erro para o motor de templates se houver um problema.

### uniq, mustUniq

Gera uma lista com todas as duplicatas removidas.

```
list 1 1 1 2 | uniq
```

O exemplo acima produziria `[1 2]`

`uniq` causa panic se houver um problema, enquanto `mustUniq` retorna um erro
para o motor de templates se houver um problema.

### without, mustWithout

A função `without` filtra itens de uma lista.

```
without $myList 3
```

O exemplo acima produziria `[1 2 4 5]`

`without` pode receber mais de um filtro:

```
without $myList 1 3 5
```

Isso produziria `[2 4]`

`without` causa panic se houver um problema, enquanto `mustWithout` retorna um
erro para o motor de templates se houver um problema.

### has, mustHas

Testa se uma lista contém um determinado elemento.

```
has 4 $myList
```

O exemplo acima retornaria `true`, enquanto `has "hello" $myList` retornaria
false.

`has` causa panic se houver um problema, enquanto `mustHas` retorna um erro para
o motor de templates se houver um problema.

### compact, mustCompact

Aceita uma lista e remove entradas com valores vazios.

```
$list := list 1 "a" "foo" ""
$copy := compact $list
```

`compact` retornará uma nova lista com o item vazio (ou seja, "") removido.

`compact` causa panic se houver um problema e `mustCompact` retorna um erro para
o motor de templates se houver um problema.

### index

Para obter o n-ésimo elemento de uma lista, use `index list [n]`. Para indexar
em listas multidimensionais, use `index list [n] [m] ...`
- `index $myList 0` retorna `1`. É o mesmo que `myList[0]`
- `index $myList 0 1` seria o mesmo que `myList[0][1]`

### slice, mustSlice

Para obter elementos parciais de uma lista, use `slice list [n] [m]`. É
equivalente a `list[n:m]`.

- `slice $myList` retorna `[1 2 3 4 5]`. É o mesmo que `myList[:]`.
- `slice $myList 3` retorna `[4 5]`. É o mesmo que `myList[3:]`.
- `slice $myList 1 3` retorna `[2 3]`. É o mesmo que `myList[1:3]`.
- `slice $myList 0 3` retorna `[1 2 3]`. É o mesmo que `myList[:3]`.

`slice` causa panic se houver um problema, enquanto `mustSlice` retorna um erro
para o motor de templates se houver um problema.

### until

A função `until` constrói um intervalo de inteiros.

```
until 5
```

O exemplo acima gera a lista `[0, 1, 2, 3, 4]`.

Isso é útil para fazer loop com `range $i, $e := until 5`.

### untilStep

Como `until`, `untilStep` gera uma lista de inteiros contados. Mas permite
definir um início, fim e passo:

```
untilStep 3 6 2
```

O exemplo acima produzirá `[3 5]` começando com 3 e adicionando 2 até que seja
igual ou maior que 6. Isso é similar à função `range` do Python.

### seq

Funciona como o comando `seq` do bash.

* 1 parâmetro (end) - gerará todos os inteiros contados entre 1 e `end`
  inclusive.
* 2 parâmetros (start, end) - gerará todos os inteiros contados entre `start` e
  `end` inclusive, incrementando ou decrementando por 1.
* 3 parâmetros (start, step, end) - gerará todos os inteiros contados entre
  `start` e `end` inclusive, incrementando ou decrementando por `step`.

```
seq 5       => 1 2 3 4 5
seq -3      => 1 0 -1 -2 -3
seq 0 2     => 0 1 2
seq 2 -2    => 2 1 0 -1 -2
seq 0 2 10  => 0 2 4 6 8 10
seq 0 -2 -5 => 0 -2 -4
```

### chunk

Para dividir uma lista em pedaços de tamanho especificado, use `chunk size
list`. Isso é útil para paginação.

```
chunk 3 (list 1 2 3 4 5 6 7 8)
```

Isso produz uma lista de listas `[ [ 1 2 3 ] [ 4 5 6 ] [ 7 8 ] ]`.

## Funções Matemáticas

Todas as funções matemáticas operam em valores `int64`, a menos que especificado
de outra forma.

As seguintes funções matemáticas estão disponíveis: [add](#add), [add1](#add1),
[ceil](#ceil), [div](#div), [floor](#floor), [len](#len), [max](#max),
[min](#min), [mod](#mod), [mul](#mul), [round](#round) e [sub](#sub).

### add

Soma números com `add`. Aceita duas ou mais entradas.

```
add 1 2 3
```

### add1

Para incrementar por 1, use `add1`.

### sub

Para subtrair, use `sub`.

### div

Realiza divisão inteira com `div`.

### mod

Módulo com `mod`.

### mul

Multiplica com `mul`. Aceita duas ou mais entradas.

```
mul 1 2 3
```

### max

Retorna o maior de uma série de inteiros.

Isso retornará `3`:

```
max 1 2 3
```

### min

Retorna o menor de uma série de inteiros.

`min 1 2 3` retornará `1`.

### len

Retorna o comprimento do argumento como um inteiro.

```
len .Arg
```

## Funções Matemáticas com Float

Todas as funções matemáticas operam em valores `float64`.

### addf

Soma números com `addf`

Isso retornará `5.5`:

```
addf 1.5 2 2
```

### add1f

Para incrementar por 1, use `add1f`

### subf

Para subtrair, use `subf`

Isso é equivalente a `7.5 - 2 - 3` e retornará `2.5`:

```
subf 7.5 2 3
```

### divf

Realiza divisão inteira com `divf`

Isso é equivalente a `10 / 2 / 4` e retornará `1.25`:

```
divf 10 2 4
```

### mulf

Multiplica com `mulf`

Isso retornará `6`:

```
mulf 1.5 2 2
```

### maxf

Retorna o maior de uma série de floats:

Isso retornará `3`:

```
maxf 1 2.5 3
```

### minf

Retorna o menor de uma série de floats.

Isso retornará `1.5`:

```
minf 1.5 2 3
```

### floor

Retorna o maior valor float menor ou igual ao valor de entrada.

`floor 123.9999` retornará `123.0`.

### ceil

Retorna o maior valor float maior ou igual ao valor de entrada.

`ceil 123.001` retornará `124.0`.

### round

Retorna um valor float com o resto arredondado para o número de dígitos
especificado após o ponto decimal.

`round 123.555555 3` retornará `123.556`.

## Funções de Rede

O Helm tem uma única função de rede, `getHostByName`.

O `getHostByName` recebe um nome de domínio e retorna o endereço IP.

`getHostByName "www.google.com"` retornaria o endereço IP correspondente de
`www.google.com`.

Esta função requer que a opção `--enable-dns` seja passada na linha de comando
do helm.

## Funções de Caminho de Arquivo

Embora as funções de template do Helm não concedam acesso ao sistema de
arquivos, elas fornecem funções para trabalhar com strings que seguem convenções
de caminhos de arquivo. Essas incluem [base](#base), [clean](#clean),
[dir](#dir), [ext](#ext) e [isAbs](#isabs).

### base

Retorna o último elemento de um caminho.

```
base "foo/bar/baz"
```

O exemplo acima imprime "baz".

### dir

Retorna o diretório, removendo a última parte do caminho. Então `dir
"foo/bar/baz"` retorna `foo/bar`.

### clean

Limpa um caminho.

```
clean "foo/bar/../baz"
```

O exemplo acima resolve o `..` e retorna `foo/baz`.

### ext

Retorna a extensão do arquivo.

```
ext "foo.bar"
```

O exemplo acima retorna `.bar`.

### isAbs

Para verificar se um caminho de arquivo é absoluto, use `isAbs`.

## Funções de Reflexão

O Helm fornece ferramentas rudimentares de reflexão. Estas ajudam
desenvolvedores de templates avançados a entender as informações de tipo Go
subjacentes para um determinado valor. O Helm é escrito em Go e é fortemente
tipado. O sistema de tipos se aplica dentro de templates.

Go tem vários _kinds_ primitivos, como `string`, `slice`, `int64` e `bool`.

Go tem um sistema de _tipos_ aberto que permite desenvolvedores criar seus
próprios tipos.

O Helm fornece um conjunto de funções para cada através de [funções
kind](#funções-kind) e [funções type](#funções-type). Uma função
[deepEqual](#deepequal) também é fornecida para comparar dois valores.

### Funções Kind

Existem duas funções Kind: `kindOf` retorna o kind de um objeto.

```
kindOf "hello"
```

O exemplo acima retornaria `string`. Para testes simples (como em blocos `if`),
a função `kindIs` permitirá verificar se um valor é de um kind específico:

```
kindIs "int" 123
```

O exemplo acima retornará `true`.

### Funções Type

Tipos são um pouco mais difíceis de trabalhar, então existem três funções
diferentes:

- `typeOf` retorna o tipo subjacente de um valor: `typeOf $foo`
- `typeIs` é como `kindIs`, mas para tipos: `typeIs "*io.Buffer" $myVal`
- `typeIsLike` funciona como `typeIs`, exceto que também desreferencia ponteiros

**Nota:** Nenhuma dessas pode testar se algo implementa uma determinada
interface, pois fazer isso exigiria compilar a interface antecipadamente.

### deepEqual

`deepEqual` retorna true se dois valores são ["profundamente
iguais"](https://golang.org/pkg/reflect/#DeepEqual)

Funciona para tipos não primitivos também (comparado ao `eq` embutido).

```
deepEqual (list 1 2 3) (list 1 2 3)
```

O exemplo acima retornará `true`.

## Funções de Versão Semântica

Alguns esquemas de versão são facilmente analisáveis e comparáveis. O Helm
fornece funções para trabalhar com versões [SemVer 2](http://semver.org). Essas
incluem [semver](#semver) e [semverCompare](#semvercompare). Abaixo você também
encontrará detalhes sobre o uso de intervalos para comparações.

### semver

A função `semver` analisa uma string em uma Versão Semântica:

```
$version := semver "1.2.3-alpha.1+123"
```

_Se o analisador falhar, causará a interrupção da execução do template com um
erro._

Neste ponto, `$version` é um ponteiro para um objeto `Version` com as seguintes
propriedades:

- `$version.Major`: O número major (`1` acima)
- `$version.Minor`: O número minor (`2` acima)
- `$version.Patch`: O número patch (`3` acima)
- `$version.Prerelease`: O prerelease (`alpha.1` acima)
- `$version.Metadata`: Os metadados de build (`123` acima)
- `$version.Original`: A versão original como string

Adicionalmente, você pode comparar uma `Version` com outra `version` usando a
função `Compare`:

```
semver "1.4.3" | (semver "1.2.3").Compare
```

O exemplo acima retornará `-1`.

Os valores de retorno são:

- `-1` se a semver fornecida for maior que a semver cujo método `Compare` foi
  chamado
- `1` se a versão cujo função `Compare` foi chamada for maior.
- `0` se forem a mesma versão

(Note que em SemVer, o campo `Metadata` não é comparado durante operações de
comparação de versão.)

### semverCompare

Uma função de comparação mais robusta é fornecida como `semverCompare`. Esta
versão suporta intervalos de versão:

- `semverCompare "1.2.3" "1.2.3"` verifica uma correspondência exata
- `semverCompare "~1.2.0" "1.2.3"` verifica se as versões major e minor
  correspondem, e que o número patch do segundo parâmetro é _maior ou igual_ ao
  primeiro parâmetro.

As funções SemVer usam a [biblioteca semver
Masterminds](https://github.com/Masterminds/semver), dos criadores do Sprig.

### Comparações Básicas

Existem dois elementos nas comparações. Primeiro, uma string de comparação é uma
lista de comparações AND separadas por espaço ou vírgula. Estas são então
separadas por || (comparações OR). Por exemplo, `">= 1.2 < 3.0.0 || >= 4.2.3"`
está procurando uma comparação que seja maior ou igual a 1.2 e menor que 3.0.0
ou que seja maior ou igual a 4.2.3.

As comparações básicas são:

- `=`: igual (alias para nenhum operador)
- `!=`: diferente
- `>`: maior que
- `<`: menor que
- `>=`: maior ou igual a
- `<=`: menor ou igual a

### Trabalhando com Versões Prerelease

Prereleases, para quem não está familiarizado com elas, são usadas para
lançamentos de software antes de lançamentos estáveis ou geralmente disponíveis.
Exemplos de prereleases incluem lançamentos de desenvolvimento, alpha, beta e
release candidate. Uma prerelease pode ser uma versão como `1.2.3-beta.1`,
enquanto o lançamento estável seria `1.2.3`. Na ordem de precedência,
prereleases vêm antes de seus lançamentos associados. Neste exemplo
`1.2.3-beta.1 < 1.2.3`.

De acordo com a especificação de Versão Semântica, prereleases podem não ser
compatíveis com a API de sua contraparte de lançamento. Ela diz,

> Uma versão prerelease indica que a versão é instável e pode não satisfazer os
> requisitos de compatibilidade pretendidos, conforme indicado por sua versão
> normal associada.

Comparações SemVer usando restrições sem um comparador de prerelease irão pular
versões prerelease. Por exemplo, `>=1.2.3` pulará prereleases ao olhar uma lista
de lançamentos, enquanto `>=1.2.3-0` avaliará e encontrará prereleases.

A razão para o `0` como uma versão prerelease no exemplo de comparação é porque
prereleases podem conter apenas alfanuméricos ASCII e hífens (junto com
separadores `.`), conforme a especificação. A ordenação acontece em ordem de
classificação ASCII, novamente conforme a especificação. O caractere mais baixo
é um `0` na ordem de classificação ASCII (veja uma [Tabela
ASCII](http://www.asciitable.com/))

Entender a ordenação de classificação ASCII é importante porque A-Z vem antes de
a-z. Isso significa que `>=1.2.3-BETA` retornará `1.2.3-alpha`. O que você pode
esperar da sensibilidade a maiúsculas/minúsculas não se aplica aqui. Isso se
deve à ordenação de classificação ASCII, que é o que a especificação determina.

### Comparações de Intervalo com Hífen

Existem múltiplos métodos para lidar com intervalos e o primeiro são intervalos
com hífen. Eles se parecem com:

- `1.2 - 1.4.5` que é equivalente a `>= 1.2 <= 1.4.5`
- `2.3.4 - 4.5` que é equivalente a `>= 2.3.4 <= 4.5`

### Curingas em Comparações

Os caracteres `x`, `X` e `*` podem ser usados como caractere curinga. Isso
funciona para todos os operadores de comparação. Quando usado no operador `=`,
ele volta para a comparação de nível patch (veja til abaixo). Por exemplo,

- `1.2.x` é equivalente a `>= 1.2.0, < 1.3.0`
- `>= 1.2.x` é equivalente a `>= 1.2.0`
- `<= 2.x` é equivalente a `< 3`
- `*` é equivalente a `>= 0.0.0`

### Comparações de Intervalo Til (Patch)

O operador de comparação til (`~`) é para intervalos de nível patch quando uma
versão minor é especificada e mudanças de nível major quando o número minor está
faltando. Por exemplo,

- `~1.2.3` é equivalente a `>= 1.2.3, < 1.3.0`
- `~1` é equivalente a `>= 1, < 2`
- `~2.3` é equivalente a `>= 2.3, < 2.4`
- `~1.2.x` é equivalente a `>= 1.2.0, < 1.3.0`
- `~1.x` é equivalente a `>= 1, < 2`

### Comparações de Intervalo Circunflexo (Major)

O operador de comparação circunflexo (`^`) é para mudanças de nível major uma
vez que um lançamento estável (1.0.0) tenha ocorrido. Antes de um lançamento
1.0.0, as versões minor funcionam como o nível de estabilidade da API. Isso é
útil ao comparar versões de API, pois uma mudança major quebra a API. Por
exemplo,

- `^1.2.3` é equivalente a `>= 1.2.3, < 2.0.0`
- `^1.2.x` é equivalente a `>= 1.2.0, < 2.0.0`
- `^2.3` é equivalente a `>= 2.3, < 3`
- `^2.x` é equivalente a `>= 2.0.0, < 3`
- `^0.2.3` é equivalente a `>=0.2.3 <0.3.0`
- `^0.2` é equivalente a `>=0.2.0 <0.3.0`
- `^0.0.3` é equivalente a `>=0.0.3 <0.0.4`
- `^0.0` é equivalente a `>=0.0.0 <0.1.0`
- `^0` é equivalente a `>=0.0.0 <1.0.0`

## Funções de URL

O Helm inclui as funções [urlParse](#urlparse), [urlJoin](#urljoin) e
[urlquery](#urlquery) permitindo que você trabalhe com partes de URL.

### urlParse

Analisa uma string para URL e produz um dict com as partes da URL

```
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

O exemplo acima retorna um dict, contendo o objeto URL:

```yaml
scheme:   'http'
host:     'server.com:8080'
path:     '/api'
query:    'list=false'
opaque:   nil
fragment: 'anchor'
userinfo: 'admin:secret'
```

Isso é implementado usando os pacotes URL da biblioteca padrão Go. Para mais
informações, consulte https://golang.org/pkg/net/url/#URL

### urlJoin

Une um map (produzido por `urlParse`) para produzir uma string URL

```
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

O exemplo acima retorna a seguinte string:
```
http://host:80/path?query#fragment
```

### urlquery

Retorna a versão escapada do valor passado como argumento para que seja
adequado para incorporação na parte de query de uma URL.

```
$var := urlquery "string for query"
```

## Funções de UUID

O Helm pode gerar UUIDs v4 universalmente únicos.

```
uuidv4
```

O exemplo acima retorna um novo UUID do tipo v4 (gerado aleatoriamente).

## Funções de Kubernetes e Chart

O Helm inclui funções para trabalhar com Kubernetes, incluindo
[.Capabilities.APIVersions.Has](#capabilitiesapiversionshas),
[Files](#funções-de-arquivo) e [lookup](#lookup).

### lookup

`lookup` é usado para consultar recursos em um cluster em execução. Quando usado
com o comando `helm template`, sempre retorna uma resposta vazia.

Você pode encontrar mais detalhes na [documentação sobre a função
lookup](./functions_and_pipelines.md#usando-a-função-lookup).

### .Capabilities.APIVersions.Has

Retorna se uma versão da API ou recurso está disponível em um cluster.

```
.Capabilities.APIVersions.Has "apps/v1"
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

Mais informações estão disponíveis na [documentação de objetos
embutidos](./builtin_objects.md).

### Funções de Arquivo

Existem várias funções que permitem acessar arquivos não especiais dentro de um
chart. Por exemplo, para acessar arquivos de configuração de aplicação. Estas
estão documentadas em [Acessando Arquivos Dentro de
Templates](./accessing_files.md).

_Nota: a documentação para muitas dessas funções vem do
[Sprig](https://github.com/Masterminds/sprig). Sprig é uma biblioteca de funções
de template disponível para aplicações Go._
