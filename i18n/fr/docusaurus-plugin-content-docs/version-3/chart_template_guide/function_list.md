---
title: Liste des fonctions de template
description: Une liste des fonctions de template disponibles dans Helm
sidebar_position: 6
---

Helm inclut de nombreuses fonctions de template que vous pouvez utiliser dans vos templates.
Elles sont répertoriées ici et classées dans les catégories suivantes :

* [Fonctions cryptographiques et de sécurité](#fonctions-cryptographiques-et-de-sécurité)
* [Date](#fonctions-de-date)
* [Dictionnaires](#dictionnaires-et-fonctions-dict)
* [Encodage](#fonctions-dencodage)
* [Chemins de fichiers](#fonctions-de-chemin-de-fichier)
* [Kubernetes et Chart](#fonctions-kubernetes-et-chart)
* [Logique et contrôle de flux](#fonctions-de-logique-et-de-contrôle-de-flux)
* [Listes](#listes-et-fonctions-de-liste)
* [Mathématiques](#fonctions-mathématiques)
* [Mathématiques à virgule flottante](#fonctions-mathématiques-à-virgule-flottante)
* [Réseau](#fonctions-réseau)
* [Réflexion](#fonctions-de-réflexion)
* [Expressions régulières](#expressions-régulières)
* [Versions sémantiques](#fonctions-de-version-sémantique)
* [Chaînes de caractères](#fonctions-de-chaînes-de-caractères)
* [Conversion de types](#fonctions-de-conversion-de-types)
* [URL](#fonctions-url)
* [UUID](#fonctions-uuid)

## Fonctions de logique et de contrôle de flux

Helm inclut de nombreuses fonctions de logique et de contrôle de flux, notamment [and](#and),
[coalesce](#coalesce), [default](#default), [empty](#empty), [eq](#eq),
[fail](#fail), [ge](#ge), [gt](#gt), [le](#le), [lt](#lt), [ne](#ne),
[not](#not), [or](#or), et [required](#required).

### and

Retourne le ET logique de deux arguments ou plus
(le premier argument vide, ou le dernier argument).

```
and .Arg1 .Arg2
```

### or

Retourne le OU logique de deux arguments ou plus
(le premier argument non vide, ou le dernier argument).

```
or .Arg1 .Arg2
```

### not

Retourne la négation logique de son argument.

```
not .Arg
```

### eq

Retourne l'égalité booléenne des arguments (par exemple, Arg1 == Arg2).

```
eq .Arg1 .Arg2
```

### ne

Retourne l'inégalité booléenne des arguments (par exemple, Arg1 != Arg2)

```
ne .Arg1 .Arg2
```

### lt

Retourne vrai si le premier argument est inférieur au second. Retourne faux
sinon (par exemple, Arg1 < Arg2).

```
lt .Arg1 .Arg2
```

### le

Retourne vrai si le premier argument est inférieur ou égal au
second. Retourne faux sinon (par exemple, Arg1 <= Arg2).

```
le .Arg1 .Arg2
```

### gt

Retourne vrai si le premier argument est supérieur au second. Retourne faux
sinon (par exemple, Arg1 > Arg2).

```
gt .Arg1 .Arg2
```

### ge

Retourne vrai si le premier argument est supérieur ou égal au
second. Retourne faux sinon (par exemple, Arg1 >= Arg2).

```
ge .Arg1 .Arg2
```

### default

Pour définir une valeur par défaut simple, utilisez `default` :

```
default "foo" .Bar
```

Dans l'exemple ci-dessus, si `.Bar` s'évalue à une valeur non vide, elle sera utilisée. Sinon,
`foo` sera retourné à la place.

La définition de « vide » dépend du type :

- Numérique : 0
- Chaîne : ""
- Listes : `[]`
- Dicts : `{}`
- Booléen : `false`
- Et toujours `nil` (aka null)

Pour les structures, il n'y a pas de définition de vide, donc une structure ne retournera jamais
la valeur par défaut.

### required

Spécifiez les valeurs qui doivent être définies avec `required` :

```
required "A valid foo is required!" .Bar
```

Si `.Bar` est vide ou non défini (voir [default](#default) pour savoir comment cela est 
évalué), le template ne sera pas rendu et retournera le message d'erreur 
fourni à la place.

### empty

La fonction `empty` retourne `true` si la valeur donnée est considérée comme vide, et
`false` sinon. Les valeurs vides sont listées dans la section `default`.

```
empty .Foo
```

Notez que dans les conditionnels des templates Go, le vide est calculé pour vous. Ainsi,
vous avez rarement besoin de `if not empty .Foo`. Utilisez simplement `if .Foo`.

### fail

Retourne inconditionnellement une chaîne vide (`string`) et une erreur (`error`) avec le texte
spécifié. Ceci est utile dans les scénarios où d'autres conditionnels ont déterminé que
le rendu du template doit échouer.

```
fail "Please accept the end user license agreement"
```

### coalesce

La fonction `coalesce` prend une liste de valeurs et retourne la première valeur non vide.

```
coalesce 0 1 2
```

L'exemple ci-dessus retourne `1`.

Cette fonction est utile pour parcourir plusieurs variables ou valeurs :

```
coalesce .name .parent.name "Matt"
```

L'exemple ci-dessus vérifiera d'abord si `.name` est vide. Si ce n'est pas le cas, il
retournera cette valeur. Si c'est vide, `coalesce` évaluera `.parent.name` pour
vérifier s'il est vide. Enfin, si `.name` et `.parent.name` sont tous deux vides, il retournera
`Matt`.

### ternary

La fonction `ternary` prend deux valeurs et une valeur de test. Si la valeur de test est
vraie, la première valeur sera retournée. Si la valeur de test est vide, la seconde
valeur sera retournée. Ceci est similaire à l'opérateur ternaire en C et autres langages de programmation.

#### Valeur de test vraie

```
ternary "foo" "bar" true
```

ou

```
true | ternary "foo" "bar"
```

L'exemple ci-dessus retourne `"foo"`.

#### Valeur de test fausse

```
ternary "foo" "bar" false
```

ou

```
false | ternary "foo" "bar"
```

L'exemple ci-dessus retourne `"bar"`.

## Fonctions de chaînes de caractères

Helm inclut les fonctions de chaînes suivantes : [abbrev](#abbrev),
[abbrevboth](#abbrevboth), [camelcase](#camelcase), [cat](#cat),
[contains](#contains), [hasPrefix](#hasprefix-et-hassuffix),
[hasSuffix](#hasprefix-et-hassuffix), [indent](#indent), [initials](#initials),
[kebabcase](#kebabcase), [lower](#lower), [nindent](#nindent),
[nospace](#nospace), [plural](#plural), [print](#print), [printf](#printf),
[println](#println), [quote](#quote-et-squote),
[randAlpha](#randalphanum-randalpha-randnumeric-et-randascii),
[randAlphaNum](#randalphanum-randalpha-randnumeric-et-randascii),
[randAscii](#randalphanum-randalpha-randnumeric-et-randascii),
[randNumeric](#randalphanum-randalpha-randnumeric-et-randascii),
[repeat](#repeat), [replace](#replace), [shuffle](#shuffle),
[snakecase](#snakecase), [squote](#quote-et-squote), [substr](#substr),
[swapcase](#swapcase), [title](#title), [trim](#trim), [trimAll](#trimall),
[trimPrefix](#trimprefix), [trimSuffix](#trimsuffix), [trunc](#trunc),
[untitle](#untitle), [upper](#upper), [wrap](#wrap), et [wrapWith](#wrapwith).

### print

Retourne une chaîne à partir de la combinaison de ses parties.

```
print "Matt has " .Dogs " dogs"
```

Les types qui ne sont pas des chaînes sont convertis en chaînes lorsque c'est possible.

Notez que lorsque deux arguments côte à côte ne sont pas des chaînes, un espace est ajouté
entre eux.

### println

Fonctionne de la même manière que [print](#print) mais ajoute une nouvelle ligne à la fin.

### printf

Retourne une chaîne basée sur une chaîne de formatage et les arguments à lui passer dans
l'ordre.

```
printf "%s has %d dogs." .Name .NumberDogs
```

Le caractère de substitution à utiliser dépend du type de l'argument passé.
Cela inclut :

Usage général :

* `%v` la valeur dans un format par défaut
  * lors de l'impression de dicts, le flag plus (%+v) ajoute les noms de champs
* `%%` un signe pourcentage littéral ; ne consomme aucune valeur

Booléen :

* `%t` le mot true ou false

Entier :

* `%b` base 2
* `%c` le caractère représenté par le point de code Unicode correspondant
* `%d` base 10
* `%o` base 8
* `%O` base 8 avec le préfixe 0o
* `%q` un caractère littéral entre guillemets simples, échappé de manière sûre
* `%x` base 16, avec des lettres minuscules pour a-f
* `%X` base 16, avec des lettres majuscules pour A-F
* `%U` format Unicode : U+1234 ; identique à "U+%04X"

 Virgule flottante et constituants complexes :

* `%b` notation scientifique décimale avec exposant puissance de deux, par exemple
  -123456p-78
* `%e` notation scientifique, par exemple -1.234456e+78
* `%E` notation scientifique, par exemple -1.234456E+78
* `%f` virgule décimale sans exposant, par exemple 123.456
* `%F` synonyme de %f
* `%g` %e pour les grands exposants, %f sinon.
* `%G` %E pour les grands exposants, %F sinon
* `%x` notation hexadécimale (avec exposant puissance de deux décimale), par exemple
  -0x1.23abcp+20
* `%X` notation hexadécimale majuscule, par exemple -0X1.23ABCP+20

Chaîne et slice d'octets (traités de manière équivalente avec ces verbes) :

* `%s` les octets non interprétés de la chaîne ou du slice
* `%q` une chaîne entre guillemets doubles, échappée de manière sûre
* `%x` base 16, minuscules, deux caractères par octet
* `%X` base 16, majuscules, deux caractères par octet

Slice :

* `%p` adresse du 0ème élément en notation base 16, avec 0x en préfixe

### trim

La fonction `trim` supprime les espaces blancs des deux côtés d'une chaîne :

```
trim "   hello    "
```

L'exemple ci-dessus produit `hello`

### trimAll

Supprime les caractères donnés de l'avant et de l'arrière d'une chaîne :

```
trimAll "$" "$5.00"
```

L'exemple ci-dessus retourne `5.00` (en tant que chaîne).

### trimPrefix

Supprime uniquement le préfixe d'une chaîne :

```
trimPrefix "-" "-hello"
```

L'exemple ci-dessus retourne `hello`

### trimSuffix

Supprime uniquement le suffixe d'une chaîne :

```
trimSuffix "-" "hello-"
```

L'exemple ci-dessus retourne `hello`

### lower

Convertit toute la chaîne en minuscules :

```
lower "HELLO"
```

L'exemple ci-dessus retourne `hello`

### upper

Convertit toute la chaîne en majuscules :

```
upper "hello"
```

L'exemple ci-dessus retourne `HELLO`

### title

Convertit en casse titre :

```
title "hello world"
```

L'exemple ci-dessus retourne `Hello World`

### untitle

Supprime la casse titre. `untitle "Hello World"` produit `hello world`.

### repeat

Répète une chaîne plusieurs fois :

```
repeat 3 "hello"
```

L'exemple ci-dessus retourne `hellohellohello`

### substr

Obtient une sous-chaîne d'une chaîne. Cette fonction prend trois paramètres :

- start (int)
- end (int)
- string (string)

```
substr 0 5 "hello world"
```

L'exemple ci-dessus retourne `hello`

### nospace

Supprime tous les espaces blancs d'une chaîne.

```
nospace "hello w o r l d"
```

L'exemple ci-dessus retourne `helloworld`

### trunc

Tronque une chaîne

```
trunc 5 "hello world"
```

L'exemple ci-dessus produit `hello`.

```
trunc -5 "hello world"
```

L'exemple ci-dessus produit `world`.

### abbrev

Tronque une chaîne avec des points de suspension (`...`)

Paramètres :

- longueur maximale
- la chaîne

```
abbrev 5 "hello world"
```

L'exemple ci-dessus retourne `he...`, car la largeur des points de suspension est comptée dans la
longueur maximale.

### abbrevboth

Abrège des deux côtés :

```
abbrevboth 5 10 "1234 5678 9123"
```

L'exemple ci-dessus produit `...5678...`

Cette fonction prend :

- décalage gauche
- longueur maximale
- la chaîne

### initials

Étant donné plusieurs mots, prend la première lettre de chaque mot et les combine.

```
initials "First Try"
```

L'exemple ci-dessus retourne `FT`

### randAlphaNum, randAlpha, randNumeric et randAscii

Ces quatre fonctions génèrent des chaînes aléatoires cryptographiquement sécurisées (utilisant ```crypto/rand```),
mais avec différents jeux de caractères de base :

- `randAlphaNum` utilise `0-9a-zA-Z`
- `randAlpha` utilise `a-zA-Z`
- `randNumeric` utilise `0-9`
- `randAscii` utilise tous les caractères ASCII imprimables

Chacune d'elles prend un paramètre : la longueur entière de la chaîne.

```
randNumeric 3
```

L'exemple ci-dessus produira une chaîne aléatoire avec trois chiffres.

### wrap

Enveloppe le texte à un nombre de colonnes donné :

```
wrap 80 $someText
```

L'exemple ci-dessus enveloppera la chaîne dans `$someText` à 80 colonnes.

### wrapWith

`wrapWith` fonctionne comme `wrap`, mais vous permet de spécifier la chaîne avec laquelle envelopper.
(`wrap` utilise `\n`)

```
wrapWith 5 "\t" "Hello World"
```

L'exemple ci-dessus produit `Hello	World` (où l'espace blanc est un caractère de tabulation ASCII)

### contains

Teste si une chaîne est contenue dans une autre :

```
contains "cat" "catch"
```

L'exemple ci-dessus retourne `true` car `catch` contient `cat`.

### hasPrefix et hasSuffix

Les fonctions `hasPrefix` et `hasSuffix` testent si une chaîne a un
préfixe ou suffixe donné :

```
hasPrefix "cat" "catch"
```

L'exemple ci-dessus retourne `true` car `catch` a le préfixe `cat`.

### quote et squote

Ces fonctions entourent une chaîne de guillemets doubles (`quote`) ou de guillemets simples
(`squote`).

### cat

La fonction `cat` concatène plusieurs chaînes en une seule, en les séparant
par des espaces :

```
cat "hello" "beautiful" "world"
```

L'exemple ci-dessus produit `hello beautiful world`

### indent

La fonction `indent` indente chaque ligne d'une chaîne donnée à la largeur d'indentation
spécifiée. Ceci est utile lors de l'alignement de chaînes multilignes :

```
indent 4 $lots_of_text
```

L'exemple ci-dessus indentera chaque ligne de texte de 4 caractères d'espace.

### nindent

La fonction `nindent` est identique à la fonction indent, mais ajoute une nouvelle
ligne au début de la chaîne.

```
nindent 4 $lots_of_text
```

L'exemple ci-dessus indentera chaque ligne de texte de 4 caractères d'espace et ajoutera une nouvelle
ligne au début.

### replace

Effectue un simple remplacement de chaîne.

Cette fonction prend trois arguments :

- chaîne à remplacer
- chaîne de remplacement
- chaîne source

```
"I Am Henry VIII" | replace " " "-"
```

L'exemple ci-dessus produira `I-Am-Henry-VIII`

### plural

Pluralise une chaîne.

```
len $fish | plural "one anchovy" "many anchovies"
```

Dans l'exemple ci-dessus, si la longueur de la chaîne est 1, le premier argument sera
affiché (`one anchovy`). Sinon, le second argument sera affiché (`many
anchovies`).

Les arguments sont :

- chaîne au singulier
- chaîne au pluriel
- entier de longueur

NOTE : Helm ne prend actuellement pas en charge les langues avec des règles de pluralisation
plus complexes. Et `0` est considéré comme un pluriel car la langue anglaise le traite ainsi
(`zero anchovies`).

### snakecase

Convertit une chaîne de camelCase en snake_case.

```
snakecase "FirstName"
```

L'exemple ci-dessus produira `first_name`.

### camelcase

Convertit une chaîne de snake_case en CamelCase

```
camelcase "http_server"
```

L'exemple ci-dessus produira `HttpServer`.

### kebabcase

Convertit une chaîne de camelCase en kebab-case.

```
kebabcase "FirstName"
```

L'exemple ci-dessus produira `first-name`.

### swapcase

Inverse la casse d'une chaîne en utilisant un algorithme basé sur les mots.

Algorithme de conversion :

- Les caractères majuscules sont convertis en minuscules
- Les caractères en casse titre sont convertis en minuscules
- Les caractères minuscules après un espace ou au début sont convertis en casse titre
- Les autres caractères minuscules sont convertis en majuscules
- Les espaces sont définis par unicode.IsSpace(char)

```
swapcase "This Is A.Test"
```

L'exemple ci-dessus produira `tHIS iS a.tEST`.

### shuffle

Mélange une chaîne.

```
shuffle "hello"
```

L'exemple ci-dessus mélangera les lettres dans `hello`, produisant peut-être `oelhl`.

## Fonctions de conversion de types

Les fonctions de conversion de types suivantes sont fournies par Helm :

- `atoi` : Convertit une chaîne en entier.
- `float64` : Convertit en `float64`.
- `int` : Convertit en `int` à la largeur du système.
- `int64` : Convertit en `int64`.
- `toDecimal` : Convertit un octal unix en `int64`.
- `toString` : Convertit en chaîne.
- `toStrings` : Convertit une liste, un slice ou un tableau en une liste de chaînes.
- `toJson` (`mustToJson`) : Convertit une liste, un slice, un tableau, un dict ou un objet en JSON.
- `toPrettyJson` (`mustToPrettyJson`) : Convertit une liste, un slice, un tableau, un dict ou un
  objet en JSON indenté.
- `toRawJson` (`mustToRawJson`) : Convertit une liste, un slice, un tableau, un dict ou un objet en
  JSON avec les caractères HTML non échappés.
- `fromYaml` : Convertit une chaîne YAML en objet.
- `fromJson` : Convertit une chaîne JSON en objet.
- `fromJsonArray` : Convertit un tableau JSON en liste.
- `toYaml` : Convertit une liste, un slice, un tableau, un dict ou un objet en yaml indenté, peut être utilisé pour copier des morceaux de yaml depuis n'importe quelle source. Cette fonction est équivalente à la fonction GoLang yaml.Marshal, voir la documentation ici : https://pkg.go.dev/gopkg.in/yaml.v2#Marshal
- `toYamlPretty` : Convertit une liste, un slice, un tableau, un dict ou un objet en yaml indenté. Équivalent à `toYaml` mais indentera en plus les listes de 2 espaces.
- `toToml` : Convertit une liste, un slice, un tableau, un dict ou un objet en toml, peut être utilisé pour copier des morceaux de toml depuis n'importe quelle source.
- `fromYamlArray` : Convertit un tableau YAML en liste.

Seule `atoi` nécessite que l'entrée soit d'un type spécifique. Les autres tenteront
de convertir depuis n'importe quel type vers le type de destination. Par exemple, `int64` peut
convertir des flottants en entiers, et peut également convertir des chaînes en entiers.

### toStrings

Étant donné une collection de type liste, produit un slice de chaînes.

```
list 1 2 3 | toStrings
```

L'exemple ci-dessus convertit `1` en `"1"`, `2` en `"2"`, et ainsi de suite, puis les retourne
sous forme de liste.

### toDecimal

Étant donné une permission octal unix, produit un décimal.

```
"0777" | toDecimal
```

L'exemple ci-dessus convertit `0777` en `511` et retourne la valeur en tant qu'int64.

### toJson, mustToJson

La fonction `toJson` encode un élément en chaîne JSON. Si l'élément ne peut pas être
converti en JSON, la fonction retournera une chaîne vide. `mustToJson`
retournera une erreur si l'élément ne peut pas être encodé en JSON.

```
toJson .Item
```

L'exemple ci-dessus retourne la représentation en chaîne JSON de `.Item`.

### toPrettyJson, mustToPrettyJson

La fonction `toPrettyJson` encode un élément en chaîne JSON formatée (indentée).

```
toPrettyJson .Item
```

L'exemple ci-dessus retourne la représentation en chaîne JSON indentée de `.Item`.

### toRawJson, mustToRawJson

La fonction `toRawJson` encode un élément en chaîne JSON avec les caractères HTML
non échappés.

```
toRawJson .Item
```

L'exemple ci-dessus retourne la représentation en chaîne JSON non échappée de `.Item`.

### fromYaml

La fonction `fromYaml` prend une chaîne YAML et retourne un objet qui peut être utilisé dans les templates.

`Fichier à : yamls/person.yaml`
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

La fonction `fromJson` prend une chaîne JSON et retourne un objet qui peut être utilisé dans les templates.

`Fichier à : jsons/person.json`
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

La fonction `fromJsonArray` prend un tableau JSON et retourne une liste qui peut être utilisée dans les templates.

`Fichier à : jsons/people.json`
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

Les fonctions `toYaml` et `toYamlPretty` encodent un objet (liste, slice, tableau, dict ou objet) en une chaîne YAML indentée.

> Notez que `toYamlPretty` est fonctionnellement équivalent mais produira du YAML avec une indentation supplémentaire pour les éléments de liste

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

La fonction `fromYamlArray` prend un tableau YAML et retourne une liste qui peut être utilisée dans les templates.

`Fichier à : yamls/people.yml`
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


## Expressions régulières

Helm inclut les fonctions d'expressions régulières suivantes : [regexFind
(mustRegexFind)](#regexfindall-mustregexfindall), [regexFindAll
(mustRegexFindAll)](#regexfind-mustregexfind), [regexMatch
(mustRegexMatch)](#regexmatch-mustregexmatch), [regexReplaceAll
(mustRegexReplaceAll)](#regexreplaceall-mustregexreplaceall),
[regexReplaceAllLiteral
(mustRegexReplaceAllLiteral)](#regexreplaceallliteral-mustregexreplaceallliteral),
[regexSplit (mustRegexSplit)](#regexsplit-mustregexsplit).

### regexMatch, mustRegexMatch

Retourne vrai si la chaîne d'entrée contient une correspondance de l'expression régulière.

```
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"
```

L'exemple ci-dessus produit `true`

`regexMatch` provoque un panic en cas de problème et `mustRegexMatch` retourne une erreur
au moteur de template en cas de problème.

### regexFindAll, mustRegexFindAll

Retourne un slice de toutes les correspondances de l'expression régulière dans la chaîne d'entrée.
Le dernier paramètre n détermine le nombre de sous-chaînes à retourner, où -1
signifie retourner toutes les correspondances

```
regexFindAll "[2,4,6,8]" "123456789" -1
```

L'exemple ci-dessus produit `[2 4 6 8]`

`regexFindAll` provoque un panic en cas de problème et `mustRegexFindAll` retourne une
erreur au moteur de template en cas de problème.

### regexFind, mustRegexFind

Retourne la première (la plus à gauche) correspondance de l'expression régulière dans la chaîne d'entrée

```
regexFind "[a-zA-Z][1-9]" "abcd1234"
```

L'exemple ci-dessus produit `d1`

`regexFind` provoque un panic en cas de problème et `mustRegexFind` retourne une erreur au
moteur de template en cas de problème.

### regexReplaceAll, mustRegexReplaceAll

Retourne une copie de la chaîne d'entrée, en remplaçant les correspondances de l'expression régulière par
la chaîne de remplacement. Dans la chaîne de remplacement, les signes $ sont
interprétés comme dans Expand, donc par exemple $1 représente le texte de la première
sous-correspondance. Le premier argument est `<pattern>`, le second est `<input>`,
et le troisième est `<replacement>`.

```
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

L'exemple ci-dessus produit `-W-xxW-`

`regexReplaceAll` provoque un panic en cas de problème et `mustRegexReplaceAll` retourne
une erreur au moteur de template en cas de problème.

### regexReplaceAllLiteral, mustRegexReplaceAllLiteral

Retourne une copie de la chaîne d'entrée, en remplaçant les correspondances de l'expression régulière par
la chaîne de remplacement. La chaîne de remplacement est substituée directement,
sans utiliser Expand. Le premier argument est `<pattern>`, le second est `<input>`,
et le troisième est `<replacement>`.

```
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"
```

L'exemple ci-dessus produit `-${1}-${1}-`

`regexReplaceAllLiteral` provoque un panic en cas de problème et
`mustRegexReplaceAllLiteral` retourne une erreur au moteur de template en cas de
problème.

### regexSplit, mustRegexSplit

Découpe la chaîne d'entrée en sous-chaînes séparées par l'expression et retourne
un slice des sous-chaînes entre ces correspondances d'expression. Le dernier paramètre
`n` détermine le nombre de sous-chaînes à retourner, où `-1` signifie retourner toutes
les correspondances

```
regexSplit "z+" "pizza" -1
```

L'exemple ci-dessus produit `[pi a]`

`regexSplit` provoque un panic en cas de problème et `mustRegexSplit` retourne une erreur
au moteur de template en cas de problème.

## Fonctions cryptographiques et de sécurité

Helm fournit des fonctions cryptographiques avancées. Elles incluent
[adler32sum](#adler32sum), [buildCustomCert](#buildcustomcert),
[decryptAES](#decryptaes), [derivePassword](#derivepassword),
[encryptAES](#encryptaes), [genCA](#genca), [genPrivateKey](#genprivatekey),
[genSelfSignedCert](#genselfsignedcert), [genSignedCert](#gensignedcert),
[htpasswd](#htpasswd), [randBytes](#randbytes), [sha1sum](#sha1sum), et
[sha256sum](#sha256sum).

### sha1sum

La fonction `sha1sum` reçoit une chaîne et calcule son condensé SHA1.

```
sha1sum "Hello world!"
```

### sha256sum

La fonction `sha256sum` reçoit une chaîne et calcule son condensé SHA256.

```
sha256sum "Hello world!"
```

L'exemple ci-dessus calculera la somme SHA 256 dans un format « ASCII armored » qui est sûr
à afficher.

### adler32sum

La fonction `adler32sum` reçoit une chaîne et calcule sa somme de contrôle Adler-32.

```
adler32sum "Hello world!"
```

### htpasswd

La fonction `htpasswd` prend un `username` et un `password` et génère un
hachage `bcrypt` du mot de passe. Le résultat peut être utilisé pour l'authentification de base
sur un [serveur HTTP Apache](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html#basic).

```
htpasswd "myUser" "myPassword"
```

Notez qu'il n'est pas sécurisé de stocker le mot de passe directement dans le template.

### randBytes

La fonction randBytes accepte un compteur N et génère une séquence aléatoire
cryptographiquement sécurisée (utilise crypto/rand) de N octets. La séquence est retournée
sous forme de chaîne encodée en base64.

```
randBytes 24
```

### derivePassword

La fonction `derivePassword` peut être utilisée pour dériver un mot de passe spécifique basé sur
certaines contraintes d'un « mot de passe maître » partagé. L'algorithme pour cela est [bien
spécifié](https://web.archive.org/web/20211019121301/https://masterpassword.app/masterpassword-algorithm.pdf).

```
derivePassword 1 "long" "password" "user" "example.com"
```

Notez qu'il est considéré comme non sécurisé de stocker les parties directement dans le template.

### genPrivateKey

La fonction `genPrivateKey` génère une nouvelle clé privée encodée dans un bloc PEM.

Elle prend l'une des valeurs suivantes pour son premier paramètre :

- `ecdsa` : Génère une clé DSA à courbe elliptique (P256)
- `dsa` : Génère une clé DSA (L2048N256)
- `rsa` : Génère une clé RSA 4096

### buildCustomCert

La fonction `buildCustomCert` permet de personnaliser le certificat.

Elle prend les paramètres de chaîne suivants :

- Un certificat au format PEM encodé en base64
- Une clé privée au format PEM encodée en base64

Elle retourne un objet certificat avec les attributs suivants :

- `Cert` : Un certificat encodé en PEM
- `Key` : Une clé privée encodée en PEM

Exemple :

```
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
```

Notez que l'objet retourné peut être passé à la fonction `genSignedCert` pour
signer un certificat en utilisant cette CA.

### genCA

La fonction `genCA` génère une nouvelle autorité de certification x509 auto-signée.

Elle prend les paramètres suivants :

- Nom commun du sujet (cn)
- Durée de validité du certificat en jours

Elle retourne un objet avec les attributs suivants :

- `Cert` : Un certificat encodé en PEM
- `Key` : Une clé privée encodée en PEM

Exemple :

```
$ca := genCA "foo-ca" 365
```

Notez que l'objet retourné peut être passé à la fonction `genSignedCert` pour
signer un certificat en utilisant cette CA.

### genSelfSignedCert

La fonction `genSelfSignedCert` génère un nouveau certificat x509 auto-signé.

Elle prend les paramètres suivants :

- Nom commun du sujet (cn)
- Liste optionnelle d'IPs ; peut être nil
- Liste optionnelle de noms DNS alternatifs ; peut être nil
- Durée de validité du certificat en jours

Elle retourne un objet avec les attributs suivants :

- `Cert` : Un certificat encodé en PEM
- `Key` : Une clé privée encodée en PEM

Exemple :

```
$cert := genSelfSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365
```

### genSignedCert

La fonction `genSignedCert` génère un nouveau certificat x509 signé par la
CA spécifiée.

Elle prend les paramètres suivants :

- Nom commun du sujet (cn)
- Liste optionnelle d'IPs ; peut être nil
- Liste optionnelle de noms DNS alternatifs ; peut être nil
- Durée de validité du certificat en jours
- CA (voir `genCA`)

Exemple :

```
$ca := genCA "foo-ca" 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

### encryptAES

La fonction `encryptAES` chiffre du texte avec AES-256 CBC et retourne une chaîne
encodée en base64.

```
encryptAES "secretkey" "plaintext"
```

### decryptAES

La fonction `decryptAES` reçoit une chaîne base64 encodée par l'algorithme AES-256 CBC
et retourne le texte déchiffré.

```
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

## Fonctions de date

Helm inclut les fonctions de date suivantes que vous pouvez utiliser dans les templates :
[ago](#ago), [date](#date), [dateInZone](#dateinzone), [dateModify
(mustDateModify)](#datemodify-mustdatemodify), [duration](#duration),
[durationRound](#durationround), [htmlDate](#htmldate),
[htmlDateInZone](#htmldateinzone), [now](#now), [toDate
(mustToDate)](#todate-musttodate), et [unixEpoch](#unixepoch).

### now

La date/heure actuelle. Utilisez ceci en conjonction avec d'autres fonctions de date.

### ago

La fonction `ago` retourne la durée depuis un temps. Résolution en secondes.

```
ago .CreatedAt
```

retourne au format String() de `time.Duration`

```
2h34m7s
```

### date

La fonction `date` formate une date.

Formatez la date en ANNÉE-MOIS-JOUR :

```
now | date "2006-01-02"
```

Le formatage de date en Go est [un peu
différent](https://pauladamsmith.com/blog/2011/05/go_time.html).

En bref, prenez ceci comme date de référence :

```
Mon Jan 2 15:04:05 MST 2006
```

Écrivez-la dans le format souhaité. Ci-dessus, `2006-01-02` est la même date, mais dans
le format que nous voulons.

### dateInZone

Identique à `date`, mais avec un fuseau horaire.

```
dateInZone "2006-01-02" (now) "UTC"
```

### duration

Formate un nombre de secondes donné en `time.Duration`.

Ceci retourne 1m35s

```
duration "95"
```

### durationRound

Arrondit une durée donnée à l'unité la plus significative. Les chaînes et
`time.Duration` sont analysés comme une durée, tandis qu'un `time.Time` est calculé comme
la durée depuis.

Ceci retourne 2h

```
durationRound "2h10m5s"
```

Ceci retourne 3mo

```
durationRound "2400h10m5s"
```

### unixEpoch

Retourne les secondes depuis l'époque unix pour un `time.Time`.

```
now | unixEpoch
```

### dateModify, mustDateModify

La fonction `dateModify` prend une modification et une date et retourne l'horodatage.

Soustraire une heure et trente minutes de l'heure actuelle :

```
now | dateModify "-1.5h"
```

Si le format de modification est incorrect, `dateModify` retournera la date
non modifiée. `mustDateModify` retournera une erreur dans ce cas.

### htmlDate

La fonction `htmlDate` formate une date pour l'insertion dans un champ de sélection
de date HTML.

```
now | htmlDate
```

### htmlDateInZone

Identique à htmlDate, mais avec un fuseau horaire.

```
htmlDateInZone (now) "UTC"
```

### toDate, mustToDate

`toDate` convertit une chaîne en date. Le premier argument est le format de date et
le second est la chaîne de date. Si la chaîne ne peut pas être convertie, elle retourne la valeur zéro.
`mustToDate` retournera une erreur si la chaîne ne peut pas être convertie.

Ceci est utile lorsque vous voulez convertir une date en chaîne vers un autre format (en utilisant
un pipe). L'exemple ci-dessous convertit "2017-12-31" en "31/12/2017".

```
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

## Dictionnaires et fonctions Dict

Helm fournit un type de stockage clé/valeur appelé `dict` (abréviation de « dictionary »,
comme en Python). Un `dict` est un type _non ordonné_.

La clé d'un dictionnaire **doit être une chaîne**. Cependant, la valeur peut être de n'importe quel
type, même un autre `dict` ou une `list`.

Contrairement aux `list`s, les `dict`s ne sont pas immuables. Les fonctions `set` et `unset`
modifieront le contenu d'un dictionnaire.

Helm fournit les fonctions suivantes pour travailler avec les dicts : [deepCopy
(mustDeepCopy)](#deepcopy-mustdeepcopy), [dict](#dict), [dig](#dig), [get](#get),
[hasKey](#haskey), [keys](#keys), [merge (mustMerge)](#merge-mustmerge),
[mergeOverwrite (mustMergeOverwrite)](#mergeoverwrite-mustmergeoverwrite),
[omit](#omit), [pick](#pick), [pluck](#pluck), [set](#set), [unset](#unset), et
[values](#values).

### dict

La création de dictionnaires se fait en appelant la fonction `dict` et en lui passant une
liste de paires.

L'exemple suivant crée un dictionnaire avec trois éléments :

```
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
```

### get

Étant donné un map et une clé, obtient la valeur du map.

```
get $myDict "name1"
```

L'exemple ci-dessus retourne `"value1"`

Notez que si la clé n'est pas trouvée, cette opération retournera simplement `""`. Aucune
erreur ne sera générée.

### set

Utilisez `set` pour ajouter une nouvelle paire clé/valeur à un dictionnaire.

```
$_ := set $myDict "name4" "value4"
```

Notez que `set` _retourne le dictionnaire_ (une exigence des fonctions de template Go),
vous devrez donc peut-être capturer la valeur comme fait ci-dessus avec l'assignation `$_`.

### unset

Étant donné un map et une clé, supprime la clé du map.

```
$_ := unset $myDict "name4"
```

Comme avec `set`, ceci retourne le dictionnaire.

Notez que si la clé n'est pas trouvée, cette opération retournera simplement. Aucune erreur
ne sera générée.

### hasKey

La fonction `hasKey` retourne `true` si le dict donné contient la clé donnée.

```
hasKey $myDict "name1"
```

Si la clé n'est pas trouvée, ceci retourne `false`.

### pluck

La fonction `pluck` permet de donner une clé et plusieurs maps, et
d'obtenir une liste de toutes les correspondances :

```
pluck "name1" $myDict $myOtherDict
```

L'exemple ci-dessus retournera une `list` contenant chaque valeur trouvée (`[value1
otherValue1]`).

Si la clé donnée _n'est pas trouvée_ dans un map, ce map n'aura pas d'élément dans la
liste (et la longueur de la liste retournée sera inférieure au nombre de dicts
dans l'appel à `pluck`).

Si la clé _est trouvée_ mais que la valeur est une valeur vide, cette valeur sera
insérée.

Un idiome courant dans les templates Helm est d'utiliser `pluck... | first` pour obtenir la première
clé correspondante d'une collection de dictionnaires.

### dig

La fonction `dig` parcourt un ensemble imbriqué de dicts, en sélectionnant les clés d'une liste
de valeurs. Elle retourne une valeur par défaut si l'une des clés n'est pas trouvée dans le
dict associé.

```
dig "user" "role" "humanName" "guest" $dict
```

Étant donné un dict structuré comme
```
{
  user: {
    role: {
      humanName: "curator"
    }
  }
}
```

l'exemple ci-dessus retournerait `"curator"`. Si le dict n'avait même pas de champ `user`,
le résultat serait `"guest"`.

Dig peut être très utile dans les cas où vous souhaitez éviter les clauses de garde,
d'autant plus que le `and` du package template de Go ne fait pas de court-circuit. Par exemple
`and a.maybeNil a.maybeNil.iNeedThis` évaluera toujours
`a.maybeNil.iNeedThis`, et provoquera une panique si `a` n'a pas de champ `maybeNil`.)

`dig` accepte son argument dict en dernier afin de prendre en charge le pipelining. Par exemple :
```
merge a b c | dig "one" "two" "three" "<missing>"
```

### merge, mustMerge

Fusionne deux dictionnaires ou plus en un seul, en donnant la priorité au dictionnaire
de destination :

Étant donné :

```
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

le résultat sera :

```
newdict:
  default: default
  overwrite: me
  key: true
```
```
$newdict := merge $dest $source1 $source2
```

C'est une opération de fusion profonde mais pas une opération de copie profonde. Les objets imbriqués
qui sont fusionnés sont la même instance dans les deux dicts. Si vous voulez une copie profonde
en même temps que la fusion, utilisez la fonction `deepCopy` avec la fusion. Par
exemple,

```
deepCopy $source | merge $dest
```

`mustMerge` retournera une erreur en cas de fusion non réussie.

### mergeOverwrite, mustMergeOverwrite

Fusionne deux dictionnaires ou plus en un seul, en donnant la priorité **de droite à
gauche**, écrasant ainsi les valeurs dans le dictionnaire de destination :

Étant donné :

```
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

le résultat sera :

```
newdict:
  default: default
  overwrite: overwritten
  key: false
```

```
$newdict := mergeOverwrite $dest $source1 $source2
```

C'est une opération de fusion profonde mais pas une opération de copie profonde. Les objets imbriqués
qui sont fusionnés sont la même instance dans les deux dicts. Si vous voulez une copie profonde
en même temps que la fusion, utilisez la fonction `deepCopy` avec la fusion. Par
exemple,

```
deepCopy $source | mergeOverwrite $dest
```

`mustMergeOverwrite` retournera une erreur en cas de fusion non réussie.

### keys

La fonction `keys` retournera une `list` de toutes les clés dans un ou plusieurs
types `dict`. Puisqu'un dictionnaire est _non ordonné_, les clés ne seront pas dans un
ordre prévisible. Elles peuvent être triées avec `sortAlpha`.

```
keys $myDict | sortAlpha
```

Lors de la fourniture de plusieurs dictionnaires, les clés seront concaténées. Utilisez la
fonction `uniq` avec `sortAlpha` pour obtenir une liste unique et triée de clés.

```
keys $myDict $myOtherDict | uniq | sortAlpha
```

### pick

La fonction `pick` sélectionne uniquement les clés données d'un dictionnaire, créant un
nouveau `dict`.

```
$new := pick $myDict "name1" "name2"
```

L'exemple ci-dessus retourne `{name1: value1, name2: value2}`

### omit

La fonction `omit` est similaire à `pick`, sauf qu'elle retourne un nouveau `dict` avec
toutes les clés qui _ne correspondent pas_ aux clés données.

```
$new := omit $myDict "name1" "name3"
```

L'exemple ci-dessus retourne `{name2: value2}`

### values

La fonction `values` est similaire à `keys`, sauf qu'elle retourne une nouvelle `list` avec
toutes les valeurs du `dict` source (un seul dictionnaire est pris en charge).

```
$vals := values $myDict
```

L'exemple ci-dessus retourne `list["value1", "value2", "value 3"]`. Notez que la fonction `values`
ne donne aucune garantie sur l'ordre des résultats ; si cela vous importe,
utilisez `sortAlpha`.

### deepCopy, mustDeepCopy

Les fonctions `deepCopy` et `mustDeepCopy` prennent une valeur et en font une copie profonde.
Cela inclut les dicts et autres structures. `deepCopy` provoque un panic lorsqu'il
y a un problème, tandis que `mustDeepCopy` retourne une erreur au système de template
lorsqu'il y a une erreur.

```
dict "a" 1 "b" 2 | deepCopy
```

### Note sur les internes des Dict

Un `dict` est implémenté en Go comme un `map[string]interface{}`. Les développeurs Go peuvent
passer des valeurs `map[string]interface{}` dans le contexte pour les rendre disponibles aux
templates en tant que `dict`s.

## Fonctions d'encodage

Helm dispose des fonctions d'encodage et de décodage suivantes :

- `b64enc`/`b64dec` : Encoder ou décoder avec Base64
- `b32enc`/`b32dec` : Encoder ou décoder avec Base32

## Listes et fonctions de liste

Helm fournit un type `list` simple qui peut contenir des listes séquentielles arbitraires
de données. C'est similaire aux tableaux ou aux slices, mais les listes sont conçues pour être utilisées
comme types de données immuables.

Créer une liste d'entiers :

```
$myList := list 1 2 3 4 5
```

L'exemple ci-dessus crée une liste de `[1 2 3 4 5]`.

Helm fournit les fonctions de liste suivantes : [append
(mustAppend)](#append-mustappend), [chunk](#chunk), [compact
(mustCompact)](#compact-mustcompact), [concat](#concat), [first
(mustFirst)](#first-mustfirst), [has (mustHas)](#has-musthas), [initial
(mustInitial)](#initial-mustinitial), [last (mustLast)](#last-mustlast),
[prepend (mustPrepend)](#prepend-mustprepend), [rest
(mustRest)](#rest-mustrest), [reverse (mustReverse)](#reverse-mustreverse),
[seq](#seq), [index](#index), [slice (mustSlice)](#slice-mustslice), [uniq
(mustUniq)](#uniq-mustuniq), [until](#until), [untilStep](#untilstep), et
[without (mustWithout)](#without-mustwithout).

### first, mustFirst

Pour obtenir le premier élément d'une liste, utilisez `first`.

`first $myList` retourne `1`

`first` provoque un panic en cas de problème, tandis que `mustFirst` retourne une erreur au
moteur de template en cas de problème.

### rest, mustRest

Pour obtenir la queue de la liste (tout sauf le premier élément), utilisez `rest`.

`rest $myList` retourne `[2 3 4 5]`

`rest` provoque un panic en cas de problème, tandis que `mustRest` retourne une erreur au
moteur de template en cas de problème.

### last, mustLast

Pour obtenir le dernier élément d'une liste, utilisez `last` :

`last $myList` retourne `5`. C'est approximativement équivalent à inverser une liste et
ensuite appeler `first`.

### initial, mustInitial

Ceci complète `last` en retournant tous les éléments _sauf_ le dernier. `initial
$myList` retourne `[1 2 3 4]`.

`initial` provoque un panic en cas de problème, tandis que `mustInitial` retourne une erreur au
moteur de template en cas de problème.

### append, mustAppend

Ajoute un nouvel élément à une liste existante, créant une nouvelle liste.

```
$new = append $myList 6
```

L'exemple ci-dessus définirait `$new` à `[1 2 3 4 5 6]`. `$myList` resterait inchangé.

`append` provoque un panic en cas de problème, tandis que `mustAppend` retourne une erreur au
moteur de template en cas de problème.

### prepend, mustPrepend

Pousse un élément au début d'une liste, créant une nouvelle liste.

```
prepend $myList 0
```

L'exemple ci-dessus produirait `[0 1 2 3 4 5]`. `$myList` resterait inchangé.

`prepend` provoque un panic en cas de problème, tandis que `mustPrepend` retourne une erreur au
moteur de template en cas de problème.

### concat

Concatène un nombre arbitraire de listes en une seule.

```
concat $myList ( list 6 7 ) ( list 8 )
```

L'exemple ci-dessus produirait `[1 2 3 4 5 6 7 8]`. `$myList` resterait inchangé.

### reverse, mustReverse

Produit une nouvelle liste avec les éléments inversés de la liste donnée.

```
reverse $myList
```

L'exemple ci-dessus générerait la liste `[5 4 3 2 1]`.

`reverse` provoque un panic en cas de problème, tandis que `mustReverse` retourne une erreur au
moteur de template en cas de problème.

### uniq, mustUniq

Génère une liste avec tous les doublons supprimés.

```
list 1 1 1 2 | uniq
```

L'exemple ci-dessus produirait `[1 2]`

`uniq` provoque un panic en cas de problème, tandis que `mustUniq` retourne une erreur au
moteur de template en cas de problème.

### without, mustWithout

La fonction `without` filtre les éléments d'une liste.

```
without $myList 3
```

L'exemple ci-dessus produirait `[1 2 4 5]`

`without` peut prendre plus d'un filtre :

```
without $myList 1 3 5
```

Cela produirait `[2 4]`

`without` provoque un panic en cas de problème, tandis que `mustWithout` retourne une erreur au
moteur de template en cas de problème.

### has, mustHas

Teste si une liste contient un élément particulier.

```
has 4 $myList
```

L'exemple ci-dessus retournerait `true`, tandis que `has "hello" $myList` retournerait false.

`has` provoque un panic en cas de problème, tandis que `mustHas` retourne une erreur au
moteur de template en cas de problème.

### compact, mustCompact

Accepte une liste et supprime les entrées avec des valeurs vides.

```
$list := list 1 "a" "foo" ""
$copy := compact $list
```

`compact` retournera une nouvelle liste avec l'élément vide (c'est-à-dire "") supprimé.

`compact` provoque un panic en cas de problème et `mustCompact` retourne une erreur au
moteur de template en cas de problème.

### index

Pour obtenir le nième élément d'une liste, utilisez `index list [n]`. Pour indexer dans
des listes multidimensionnelles, utilisez `index list [n] [m] ...`
- `index $myList 0` retourne `1`. C'est la même chose que `myList[0]`
- `index $myList 0 1` serait la même chose que `myList[0][1]`

### slice, mustSlice

Pour obtenir des éléments partiels d'une liste, utilisez `slice list [n] [m]`. C'est équivalent à
`list[n:m]`.

- `slice $myList` retourne `[1 2 3 4 5]`. C'est la même chose que `myList[:]`.
- `slice $myList 3` retourne `[4 5]`. C'est la même chose que `myList[3:]`.
- `slice $myList 1 3` retourne `[2 3]`. C'est la même chose que `myList[1:3]`.
- `slice $myList 0 3` retourne `[1 2 3]`. C'est la même chose que `myList[:3]`.

`slice` provoque un panic en cas de problème, tandis que `mustSlice` retourne une erreur au
moteur de template en cas de problème.

### until

La fonction `until` construit une plage d'entiers.

```
until 5
```

L'exemple ci-dessus génère la liste `[0, 1, 2, 3, 4]`.

C'est utile pour boucler avec `range $i, $e := until 5`.

### untilStep

Comme `until`, `untilStep` génère une liste d'entiers à compter. Mais elle vous permet
de définir un début, une fin et un pas :

```
untilStep 3 6 2
```

L'exemple ci-dessus produira `[3 5]` en commençant par 3, et en ajoutant 2 jusqu'à ce que ce soit
égal ou supérieur à 6. C'est similaire à la fonction `range` de Python.

### seq

Fonctionne comme la commande bash `seq`.

* 1 paramètre  (end) - générera tous les entiers entre 1 et `end`
  inclus.
* 2 paramètres (start, end) - générera tous les entiers entre
  `start` et `end` inclus en incrémentant ou décrémentant de 1.
* 3 paramètres (start, step, end) - générera tous les entiers entre
  `start` et `end` inclus en incrémentant ou décrémentant de `step`.

```
seq 5       => 1 2 3 4 5
seq -3      => 1 0 -1 -2 -3
seq 0 2     => 0 1 2
seq 2 -2    => 2 1 0 -1 -2
seq 0 2 10  => 0 2 4 6 8 10
seq 0 -2 -5 => 0 -2 -4
```

### chunk

Pour diviser une liste en morceaux d'une taille donnée, utilisez `chunk size list`. C'est utile pour la pagination.

```
chunk 3 (list 1 2 3 4 5 6 7 8)
```

Ceci produit une liste de listes `[ [ 1 2 3 ] [ 4 5 6 ] [ 7 8 ] ]`.

## Fonctions mathématiques

Toutes les fonctions mathématiques opèrent sur des valeurs `int64` sauf indication contraire.

Les fonctions mathématiques suivantes sont disponibles : [add](#add), [add1](#add1),
[ceil](#ceil), [div](#div), [floor](#floor), [len](#len), [max](#max),
[min](#min), [mod](#mod), [mul](#mul), [round](#round), et [sub](#sub).

### add

Additionne des nombres avec `add`. Accepte deux entrées ou plus.

```
add 1 2 3
```

### add1

Pour incrémenter de 1, utilisez `add1`.

### sub

Pour soustraire, utilisez `sub`.

### div

Effectue une division entière avec `div`.

### mod

Modulo avec `mod`.

### mul

Multiplie avec `mul`. Accepte deux entrées ou plus.

```
mul 1 2 3
```

### max

Retourne le plus grand d'une série d'entiers.

Ceci retournera `3` :

```
max 1 2 3
```

### min

Retourne le plus petit d'une série d'entiers.

`min 1 2 3` retournera `1`.

### len

Retourne la longueur de l'argument en tant qu'entier.

```
len .Arg
```

## Fonctions mathématiques à virgule flottante

Toutes les fonctions mathématiques opèrent sur des valeurs `float64`.

### addf

Additionne des nombres avec `addf`

Ceci retournera `5.5` :

```
addf 1.5 2 2
```

### add1f

Pour incrémenter de 1, utilisez `add1f`

### subf

Pour soustraire, utilisez `subf`

Ceci est équivalent à `7.5 - 2 - 3` et retournera `2.5` :

```
subf 7.5 2 3
```

### divf

Effectue une division à virgule flottante avec `divf`

Ceci est équivalent à `10 / 2 / 4` et retournera `1.25` :

```
divf 10 2 4
```

### mulf

Multiplie avec `mulf`

Ceci retournera `6` :

```
mulf 1.5 2 2
```

### maxf

Retourne le plus grand d'une série de nombres à virgule flottante :

Ceci retournera `3` :

```
maxf 1 2.5 3
```

### minf

Retourne le plus petit d'une série de nombres à virgule flottante.

Ceci retournera `1.5` :

```
minf 1.5 2 3
```

### floor

Retourne la plus grande valeur flottante inférieure ou égale à la valeur d'entrée.

`floor 123.9999` retournera `123.0`.

### ceil

Retourne la plus grande valeur flottante supérieure ou égale à la valeur d'entrée.

`ceil 123.001` retournera `124.0`.

### round

Retourne une valeur flottante avec le reste arrondi au nombre donné de chiffres
après la virgule décimale.

`round 123.555555 3` retournera `123.556`.

## Fonctions réseau

Helm a une seule fonction réseau, `getHostByName`.

La fonction `getHostByName` reçoit un nom de domaine et retourne l'adresse IP.

`getHostByName "www.google.com"` retournerait l'adresse IP correspondante de `www.google.com`.

Cette fonction nécessite l'option `--enable-dns` à passer sur la ligne de commande helm.

## Fonctions de chemin de fichier

Bien que les fonctions de template Helm ne donnent pas accès au système de fichiers, elles fournissent
des fonctions pour travailler avec des chaînes qui suivent les conventions de chemins de fichiers.
Celles-ci incluent [base](#base), [clean](#clean), [dir](#dir), [ext](#ext), et
[isAbs](#isabs).

### base

Retourne le dernier élément d'un chemin.

```
base "foo/bar/baz"
```

L'exemple ci-dessus affiche "baz".

### dir

Retourne le répertoire, en supprimant la dernière partie du chemin. Donc `dir
"foo/bar/baz"` retourne `foo/bar`.

### clean

Nettoie un chemin.

```
clean "foo/bar/../baz"
```

L'exemple ci-dessus résout le `..` et retourne `foo/baz`.

### ext

Retourne l'extension du fichier.

```
ext "foo.bar"
```

L'exemple ci-dessus retourne `.bar`.

### isAbs

Pour vérifier si un chemin de fichier est absolu, utilisez `isAbs`.

## Fonctions de réflexion

Helm fournit des outils de réflexion rudimentaires. Ceux-ci aident les développeurs de templates avancés
à comprendre les informations de type Go sous-jacentes pour une valeur particulière.
Helm est écrit en Go et est fortement typé. Le système de types s'applique dans les
templates.

Go a plusieurs _kinds_ primitifs, comme `string`, `slice`, `int64`, et `bool`.

Go a un système de _types_ ouvert qui permet aux développeurs de créer leurs propres types.

Helm fournit un ensemble de fonctions pour chacun via les [fonctions kind](#fonctions-kind)
et les [fonctions type](#fonctions-type). Une fonction [deepEqual](#deepequal) est
également fournie pour comparer deux valeurs.

### Fonctions Kind

Il y a deux fonctions Kind : `kindOf` retourne le kind d'un objet.

```
kindOf "hello"
```

L'exemple ci-dessus retournerait `string`. Pour des tests simples (comme dans les blocs `if`), la
fonction `kindIs` vous permettra de vérifier qu'une valeur est d'un kind particulier :

```
kindIs "int" 123
```

L'exemple ci-dessus retournera `true`.

### Fonctions Type

Les types sont légèrement plus difficiles à manipuler, il y a donc trois fonctions différentes :

- `typeOf` retourne le type sous-jacent d'une valeur : `typeOf $foo`
- `typeIs` est comme `kindIs`, mais pour les types : `typeIs "*io.Buffer" $myVal`
- `typeIsLike` fonctionne comme `typeIs`, sauf qu'il déréférence également les pointeurs

**Note :** Aucune de ces fonctions ne peut tester si quelque chose implémente une
interface donnée, car cela nécessiterait de compiler l'interface à l'avance.

### deepEqual

`deepEqual` retourne vrai si deux valeurs sont [« profondément
égales »](https://golang.org/pkg/reflect/#DeepEqual)

Fonctionne également pour les types non primitifs (contrairement au `eq` intégré).

```
deepEqual (list 1 2 3) (list 1 2 3)
```

L'exemple ci-dessus retournera `true`.

## Fonctions de version sémantique

Certains schémas de version sont facilement analysables et comparables. Helm fournit des
fonctions pour travailler avec les versions [SemVer 2](http://semver.org). Celles-ci incluent
[semver](#semver) et [semverCompare](#semvercompare). Vous trouverez ci-dessous également des
détails sur l'utilisation des plages pour les comparaisons.

### semver

La fonction `semver` analyse une chaîne en une Version Sémantique :

```
$version := semver "1.2.3-alpha.1+123"
```

_Si l'analyseur échoue, il provoquera l'arrêt de l'exécution du template avec une erreur._

À ce stade, `$version` est un pointeur vers un objet `Version` avec les
propriétés suivantes :

- `$version.Major` : Le numéro majeur (`1` ci-dessus)
- `$version.Minor` : Le numéro mineur (`2` ci-dessus)
- `$version.Patch` : Le numéro de patch (`3` ci-dessus)
- `$version.Prerelease` : La préversion (`alpha.1` ci-dessus)
- `$version.Metadata` : Les métadonnées de build (`123` ci-dessus)
- `$version.Original` : La version originale sous forme de chaîne

De plus, vous pouvez comparer une `Version` à une autre `version` en utilisant la
fonction `Compare` :

```
semver "1.4.3" | (semver "1.2.3").Compare
```

L'exemple ci-dessus retournera `-1`.

Les valeurs de retour sont :

- `-1` si le semver donné est supérieur au semver dont la méthode `Compare` a été
  appelée
- `1` si la version dont la fonction `Compare` a été appelée est supérieure.
- `0` s'ils sont de la même version

(Notez que dans SemVer, le champ `Metadata` n'est pas comparé lors des opérations
de comparaison de version.)

### semverCompare

Une fonction de comparaison plus robuste est fournie par `semverCompare`. Cette version
prend en charge les plages de versions :

- `semverCompare "1.2.3" "1.2.3"` vérifie une correspondance exacte
- `semverCompare "~1.2.0" "1.2.3"` vérifie que les versions majeure et mineure
  correspondent, et que le numéro de patch du second paramètre est _supérieur ou
  égal au_ premier paramètre.

Les fonctions SemVer utilisent la [bibliothèque semver
Masterminds](https://github.com/Masterminds/semver), des créateurs de Sprig.

### Comparaisons de base

Il y a deux éléments dans les comparaisons. Premièrement, une chaîne de comparaison est une liste
de comparaisons ET séparées par des espaces ou des virgules. Celles-ci sont ensuite séparées par || (OU)
comparaisons. Par exemple, `">= 1.2 < 3.0.0 || >= 4.2.3"` recherche une
comparaison qui est supérieure ou égale à 1.2 et inférieure à 3.0.0 ou est supérieure
ou égale à 4.2.3.

Les comparaisons de base sont :

- `=` : égal (alias vers pas d'opérateur)
- `!=` : différent
- `>` : supérieur à
- `<` : inférieur à
- `>=` : supérieur ou égal à
- `<=` : inférieur ou égal à

### Travailler avec les versions préliminaires

Les préversions, pour ceux qui ne les connaissent pas, sont utilisées pour les versions de logiciels
avant les versions stables ou généralement disponibles. Des exemples de préversions incluent
les versions de développement, alpha, bêta et release candidate. Une préversion peut être une
version comme `1.2.3-beta.1`, tandis que la version stable serait `1.2.3`. Dans l'
ordre de préséance, les préversions viennent avant leurs versions associées. Dans cet
exemple `1.2.3-beta.1 < 1.2.3`.

Selon la spécification de Version Sémantique, les préversions peuvent ne pas être conformes à l'API
avec leur version correspondante. Elle dit :

> Une version préliminaire indique que la version est instable et pourrait ne pas
> satisfaire les exigences de compatibilité prévues comme indiqué par sa
> version normale associée.

Les comparaisons SemVer utilisant des contraintes sans comparateur de préversion sauteront
les versions préliminaires. Par exemple, `>=1.2.3` sautera les préversions lors de la recherche
dans une liste de versions, tandis que `>=1.2.3-0` évaluera et trouvera les préversions.

La raison du `0` comme version préliminaire dans l'exemple de comparaison est que
les préversions ne peuvent contenir que des alphanumériques ASCII et des tirets (avec
des séparateurs `.`), selon la spécification. Le tri se fait dans l'ordre de tri ASCII, encore
selon la spécification. Le caractère le plus bas est un `0` dans l'ordre de tri ASCII (voir une [Table
ASCII](http://www.asciitable.com/))

Comprendre l'ordre de tri ASCII est important car A-Z vient avant a-z.
Cela signifie que `>=1.2.3-BETA` retournera `1.2.3-alpha`. Ce à quoi vous pourriez vous attendre
de la sensibilité à la casse ne s'applique pas ici. C'est dû à l'ordre de tri ASCII qui est
ce que la spécification définit.

### Comparaisons de plage avec tiret

Il existe plusieurs méthodes pour gérer les plages et la première est les plages avec tirets.
Celles-ci ressemblent à :

- `1.2 - 1.4.5` qui est équivalent à `>= 1.2 <= 1.4.5`
- `2.3.4 - 4.5` qui est équivalent à `>= 2.3.4 <= 4.5`

### Caractères génériques dans les comparaisons

Les caractères `x`, `X` et `*` peuvent être utilisés comme caractère générique. Cela fonctionne
pour tous les opérateurs de comparaison. Lorsqu'il est utilisé avec l'opérateur `=`, il revient à la
comparaison au niveau du patch (voir tilde ci-dessous). Par exemple,

- `1.2.x` est équivalent à `>= 1.2.0, < 1.3.0`
- `>= 1.2.x` est équivalent à `>= 1.2.0`
- `<= 2.x` est équivalent à `< 3`
- `*` est équivalent à `>= 0.0.0`

### Comparaisons de plage avec tilde (Patch)

L'opérateur de comparaison tilde (`~`) est pour les plages au niveau du patch lorsqu'une version
mineure est spécifiée et les changements au niveau majeur lorsque le numéro mineur est manquant.
Par exemple,

- `~1.2.3` est équivalent à `>= 1.2.3, < 1.3.0`
- `~1` est équivalent à `>= 1, < 2`
- `~2.3` est équivalent à `>= 2.3, < 2.4`
- `~1.2.x` est équivalent à `>= 1.2.0, < 1.3.0`
- `~1.x` est équivalent à `>= 1, < 2`

### Comparaisons de plage avec accent circonflexe (Majeur)

L'opérateur de comparaison accent circonflexe (`^`) est pour les changements au niveau majeur une fois qu'une version
stable (1.0.0) a été publiée. Avant une version 1.0.0, les versions mineures agissent
comme le niveau de stabilité de l'API. C'est utile lors des comparaisons de versions d'API car un
changement majeur casse l'API. Par exemple,

- `^1.2.3` est équivalent à `>= 1.2.3, < 2.0.0`
- `^1.2.x` est équivalent à `>= 1.2.0, < 2.0.0`
- `^2.3` est équivalent à `>= 2.3, < 3`
- `^2.x` est équivalent à `>= 2.0.0, < 3`
- `^0.2.3` est équivalent à `>=0.2.3 <0.3.0`
- `^0.2` est équivalent à `>=0.2.0 <0.3.0`
- `^0.0.3` est équivalent à `>=0.0.3 <0.0.4`
- `^0.0` est équivalent à `>=0.0.0 <0.1.0`
- `^0` est équivalent à `>=0.0.0 <1.0.0`

## Fonctions URL

Helm inclut les fonctions [urlParse](#urlparse), [urlJoin](#urljoin), et
[urlquery](#urlquery) vous permettant de travailler avec les parties d'URL.

### urlParse

Analyse une chaîne pour une URL et produit un dict avec les parties de l'URL

```
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

L'exemple ci-dessus retourne un dict, contenant l'objet URL :

```yaml
scheme:   'http'
host:     'server.com:8080'
path:     '/api'
query:    'list=false'
opaque:   nil
fragment: 'anchor'
userinfo: 'admin:secret'
```

Ceci est implémenté en utilisant les packages URL de la bibliothèque standard Go. Pour plus
d'informations, consultez https://golang.org/pkg/net/url/#URL

### urlJoin

Joint un map (produit par `urlParse`) pour produire une chaîne URL

```
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

L'exemple ci-dessus retourne la chaîne suivante :
```
http://host:80/path?query#fragment
```

### urlquery

Retourne la version échappée de la valeur passée en argument de sorte qu'elle soit
adaptée à l'intégration dans la partie requête d'une URL.

```
$var := urlquery "string for query"
```

## Fonctions UUID

Helm peut générer des UUID v4 universellement uniques.

```
uuidv4
```

L'exemple ci-dessus retourne un nouvel UUID de type v4 (généré aléatoirement).

## Fonctions Kubernetes et Chart

Helm inclut des fonctions pour travailler avec Kubernetes, notamment
[.Capabilities.APIVersions.Has](#capabilitiesapiversionshas),
[Files](#fonctions-de-fichier), et [lookup](#lookup).

### lookup

`lookup` est utilisé pour rechercher une ressource dans un cluster en cours d'exécution. Lorsqu'il est utilisé avec la
commande `helm template`, il retourne toujours une réponse vide.

Vous pouvez trouver plus de détails dans la [documentation sur la fonction
lookup](./functions_and_pipelines.md#utilisation-de-la-fonction-lookup).

### .Capabilities.APIVersions.Has

Retourne si une version d'API ou une ressource est disponible dans un cluster.

```
.Capabilities.APIVersions.Has "apps/v1"
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

Plus d'informations sont disponibles dans la [documentation sur les objets
intégrés](./builtin_objects.md).

### Fonctions de fichier

Il existe plusieurs fonctions qui vous permettent d'accéder aux fichiers non spéciaux dans un
chart. Par exemple, pour accéder aux fichiers de configuration d'application. Celles-ci sont
documentées dans [Accéder aux fichiers dans les templates](./accessing_files.md).

_Note, la documentation de beaucoup de ces fonctions provient de
[Sprig](https://github.com/Masterminds/sprig). Sprig est une bibliothèque de fonctions de template
disponible pour les applications Go._
