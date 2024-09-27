---
title: "Liste des fonctions de modèle"
description: "Une liste des fonctions de modèle disponibles dans Helm"
weight: 6
---

Helm comprend de nombreuses fonctions de modèle que vous pouvez utiliser dans les modèles. Elles sont listées ici et classées par les catégories suivantes :

* [Cryptographiques et Sécurité](#fonctions-cryptographiques-et-de-sécurité)
* [Date](#fonctions-de-date)
* [Dictionnaires](#dictionnaires-et-fonctions-de-dictionnaire)
* [Encodage](#fonctions-dencodage)
* [Chemin de Fichier](#fonctions-de-chemin-de-fichier)
* [Kubernetes et Charts](#kubernetes-et-fonctions-de-charts)
* [Logique et de Contrôle de Flux.](#fonctions-de-logique-et-de-contrôle-de-flux)
* [Listes](#listes-et-fonctions-de-liste)
* [Mathématiques](#fonctions-mathématiques)
* [Flottant en Mathématique](#fonctions-mathématiques-pour-les-nombres-à-virgule-flottante)
* [Réseau](#fonctions-réseau)
* [Réflexion](#fonctions-de-réflexion)
* [Expressions régulières](#expressions-régulières)
* [Version Sémantique](#fonctions-de-version-sémantique)
* [String](#string-functions)
* [Conversion de Type](#fonctions-de-conversion-de-type)
* [URL](#fonctions-durl)
* [UUID](#fonctions-uuid)

## Fonctions de logique et de contrôle de flux.

Helm comprend de nombreuses fonctions de logique et de contrôle de flux, notamment : [and](#and),
[coalesce](#coalesce), [default](#default), [empty](#empty), [eq](#eq),
[fail](#fail), [ge](#ge), [gt](#gt), [le](#le), [lt](#lt), [ne](#ne),
[not](#not), [or](#or) et [required](#required).

### and

Renvoie le booléen ET de deux arguments ou plus (le premier argument vide, ou le dernier argument).

```
and .Arg1 .Arg2
```

### or

Renvoie le booléen OU de deux arguments ou plus (le premier argument non vide, ou le dernier argument).

```
or .Arg1 .Arg2
```

### not

Renvoie la négation booléenne de son argument.

```
not .Arg
```

### eq

Renvoie l'égalité booléenne des arguments (par exemple, Arg1 == Arg2).

```
eq .Arg1 .Arg2
```

### ne

Renvoie l'inégalité booléenne des arguments (par exemple, Arg1 != Arg2).

```
ne .Arg1 .Arg2
```

### lt

Renvoie un booléen vrai si le premier argument est inférieur au second. Faux est renvoyé dans le cas contraire (par exemple, Arg1 < Arg2).

```
lt .Arg1 .Arg2
```

### le

Renvoie un booléen vrai si le premier argument est inférieur ou égal au second. Faux est renvoyé dans le cas contraire (par exemple, Arg1 <= Arg2).

```
le .Arg1 .Arg2
```

### gt

Renvoie un booléen vrai si le premier argument est supérieur au second. Faux est renvoyé dans le cas contraire (par exemple, Arg1 > Arg2).

```
gt .Arg1 .Arg2
```

### ge

Renvoie un booléen vrai si le premier argument est supérieur ou égal au second. Faux est renvoyé dans le cas contraire (par exemple, Arg1 >= Arg2).

```
ge .Arg1 .Arg2
```

### default

Pour définir une valeur par défaut simple, utilisez `default` :

```
default "foo" .Bar
```

Dans ce qui précède, si `.Bar` évalue à une valeur non vide, elle sera utilisée. Mais si elle est vide, `foo` sera renvoyé à la place.

La définition de "vide" dépend du type :

- Numérique : 0
- Chaîne : ""
- Listes : `[]`
- Dictionnaires : `{}`
- Booléen : `false`
- Et toujours `nil` (c'est-à-dire null)

Pour les structs, il n'existe pas de définition de vide, donc un struct ne renverra jamais la valeur par défaut.

### required

Spécifiez les valeurs qui doivent être définies avec `required` :

```
required "A valid foo is required!" .Bar
```

Si `.Bar` est vide ou non défini (voir [default](#default) sur la façon dont cela est évalué), le modèle ne sera pas rendu et renverra le message d'erreur fourni à la place.

### empty

La fonction `empty` renvoie `true` si la valeur donnée est considérée comme vide, et `false` dans le cas contraire. Les valeurs vides sont listées dans la section `default`.

```
empty .Foo
```

Notez que dans les conditionnels des modèles Go, la vacuité est calculée pour vous. Ainsi, vous n'avez que rarement besoin d'utiliser `if not empty .Foo`. Utilisez plutôt simplement `if .Foo`.

### fail

Renvoie inconditionnellement une chaîne vide et une erreur avec le texte spécifié. Ceci est utile dans les scénarios où d'autres conditionnels ont déterminé que le rendu du modèle devrait échouer.

```
fail "Please accept the end user license agreement"
```

### coalesce

La fonction `coalesce` prend une liste de valeurs et renvoie la première non vide.

```
coalesce 0 1 2
```

Ce qui précède renvoie `1`.

Cette fonction est utile pour parcourir plusieurs variables ou valeurs :

```
coalesce .name .parent.name "Matt"
```

Ce qui précède vérifiera d'abord si `.name` est vide. Si ce n'est pas le cas, il renverra cette valeur. Si c'est _vide_, `coalesce` évaluera `.parent.name` pour vérifier sa vacuité. Enfin, si à la fois `.name` et `.parent.name` sont vides, il renverra `Matt`.

### ternary

La fonction `ternary` prend deux valeurs et une valeur de test. Si la valeur de test est vraie, la première valeur sera renvoyée. Si la valeur de test est vide, la deuxième valeur sera renvoyée. Cela est similaire à l'opérateur ternaire en C et dans d'autres langages de programmation.

#### true test value

```
ternary "foo" "bar" true
```

ou

```
true | ternary "foo" "bar"
```

Ce qui précède renvoie `"foo"`.

#### false test value

```
ternary "foo" "bar" false
```

ou

```
false | ternary "foo" "bar"
```

Ce qui précède renvoie `"bar"`.

## Fonction de chaîne de caractères

Helm comprend les fonctions de chaîne suivantes : [abbrev](#abbrev),
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
[untitle](#untitle), [upper](#upper), [wrap](#wrap) et [wrapWith](#wrapwith).

### print

Renvoie une chaîne résultant de la combinaison de ses parties.

```
print "Matt has " .Dogs " dogs"
```

Les types qui ne sont pas des chaînes sont convertis en chaînes lorsque cela est possible.

Notez que lorsque deux arguments adjacents ne sont pas des chaînes, un espace est ajouté entre eux.

### println

Fonctionne de la même manière que [print](#print) mais ajoute une nouvelle ligne à la fin.

### printf

Renvoie une chaîne basée sur une chaîne de formatage et les arguments à lui passer dans l'ordre.

```
printf "%s has %d dogs." .Name .NumberDogs
```

Le placeholder à utiliser dépend du type de l'argument passé. Cela inclut :

Usage général :

* `%v` la valeur dans un format par défaut
  * lors de l'impression de dictionnaires, le flag plus (%+v) ajoute les noms de champs
* `%%` un signe pourcentage littéral ; ne consomme aucune valeur

Booléen :

* `%t` le mot true ou false

Entier :

* `%b` base 2
* `%c` le caractère représenté par le point de code Unicode correspondant
* `%d` base 10
* `%o` base 8
* `%O` base 8 avec le préfixe 0o
* `%q` un littéral de caractère entre guillemets simples, échappé en toute sécurité
* `%x` base 16, avec des lettres minuscules pour a-f
* `%X` base 16, avec des lettres majuscules pour A-F
* `%U` format Unicode : U+1234 ; identique à "U+%04X"

Flottants et nombres complexes :

* `%b` décimal sans notation scientifique avec exponent à une puissance de deux, par ex. -123456p-78
* `%e` notation scientifique, par ex. -1.234456e+78
* `%E` notation scientifique, par ex. -1.234456E+78
* `%f` point décimal sans exponent, par ex. 123.456
* `%F` synonyme de %f
* `%g` %e pour de grands exposants, %f sinon.
* `%G` %E pour de grands exposants, %F sinon
* `%x` notation hexadécimale (avec exponent en puissance de deux décimal), par ex. -0x1.23abcp+20
* `%X` notation hexadécimale en majuscules, par ex. -0X1.23ABCP+20

Chaîne et tranche d'octets (traitées de manière équivalente avec ces verbes) :

* `%s` les octets non interprétés de la chaîne ou de la tranche
* `%q` une chaîne entre guillemets doubles, échappée en toute sécurité
* `%x` base 16, en minuscules, deux caractères par octet
* `%X` base 16, en majuscules, deux caractères par octet

Tranche :

* `%p` adresse du 0ème élément en notation hexadécimale, avec le préfixe 0x

### trim

La fonction `trim` supprime les espaces des deux côtés d'une chaîne :

```
trim "   hello    "
```

Cela donnera `hello`

### trimAll

Supprime les caractères donnés du début et de la fin d'une chaîne :

```
trimAll "$" "$5.00"
```

Ce qui précède renvoie `5.00` (sous forme de chaîne).

### trimPrefix

Supprime uniquement le préfixe d'une chaîne :

```
trimPrefix "-" "-hello"
```

Ce qui précède renvoie `hello`.

### trimSuffix

Supprime simplement le suffixe d'une chaîne :

```
trimSuffix "-" "hello-"
```

Ce qui précède renvoie `hello`.

### lower

Convertit toute la chaîne en minuscules :

```
lower "HELLO"
```

Ce qui précède renvoie `hello`.

### upper

Convertit toute la chaîne en majuscules :

```
upper "hello"
```

Ce qui précède renvoie `HELLO`.

### title

Convertit en titre :

```
title "hello world"
```

L'exemple ci-dessus renverra `Hello World`

### untitle

Supprime la casse titre. `untitle "Hello World"` produit `hello world`.

### repeat

Répète une chaîne plusieurs fois :

```
repeat 3 "hello"
```

L'exemple ci-dessus renverra `hellohellohello`

### substr

Obtenir une sous-chaîne d'une chaîne. Cela prend trois paramètres :

- début (int)
- fin (int)
- chaîne (string)

```
substr 0 5 "hello world"
```

L'exemple ci-dessus renverra `hello`

### nospace

Supprime tout les espaces d'une chaîne de caractère

```
nospace "hello w o r l d"
```

L'exemple ci-dessus renverra `helloworld`

### trunc

Tronque une chaîne

```
trunc 5 "hello world"
```

Ce qui précède produit `hello`.

```
trunc -5 "hello world"
```

Ce qui précède produit `world`.

### abbrev

Tronque une chaîne avec des points de suspension (`...`) :

Paramètres :

- longueur maximale
- la chaîne

```
abbrev 5 "hello world"
```

Ce qui précède renvoie `he...`, car il prend en compte la largeur des points de suspension dans la longueur maximale.

### abbrevboth

Abréger des deux côtés :

```
abbrevboth 5 10 "1234 5678 9123"
```

Ce qui précède produit `...5678...`.

Cela prend :

- décalage gauche
- longueur maximale
- la chaîne

### initials

Étant donné plusieurs mots, prenez la première lettre de chaque mot et combinez-les.

```
initials "First Try"
```

Ce qui précède produit `FT`

### randAlphaNum, randAlpha, randNumeric et randAscii

Ces quatre fonctions génèrent des chaînes aléatoires sécurisées sur le plan cryptographique (utilisant ```crypto/rand```) avec différents ensembles de caractères de base :

- `randAlphaNum` utilise `0-9a-zA-Z`
- `randAlpha` utilise `a-zA-Z`
- `randNumeric` utilise `0-9`
- `randAscii` utilise tous les caractères ASCII imprimables

Chacune d'elles prend un paramètre, la longueur entière de la chaîne.

```
randNumeric 3
```

Ce qui précède produira une chaîne aléatoire avec trois chiffres.

### wrap

Envelopper le texte à un nombre de colonnes donné :

```
wrap 80 $someText
```

Ce qui précède enveloppera la chaîne dans `$someText` à 80 colonnes.

### wrapWith

`wrapWith` fonctionne comme `wrap`, mais vous permet de spécifier la chaîne avec laquelle envelopper. (`wrap` utilise `\n`)

```
wrapWith 5 "\t" "Hello World"
```

Ce qui précède produit `Hello World` (où l'espace est un caractère de tabulation ASCII).

### contains

Tester pour voir si une chaîne est contenue dans une autre :

```
contains "cat" "catch"
```

Ce qui précède renvoie `true` car `catch` contient `cat`.

### hasPrefix et hasSuffix

Les fonctions `hasPrefix` et `hasSuffix` testent si une chaîne a un préfixe ou un suffixe donné :

```
hasPrefix "cat" "catch"
```

Ce qui précède renvoie `true` car `catch` a le préfixe `cat`.

### quote et squote

Ces fonctions enveloppent une chaîne entre des guillemets doubles (`quote`) ou des guillemets simples (`squote`).

### cat

La fonction `cat` concatène plusieurs chaînes en une seule, en les séparant par des espaces :

```
cat "hello" "beautiful" "world"
```

Ce qui précède produit `hello beautiful world`.

### indent

La fonction `indent` indente chaque ligne d'une chaîne donnée à la largeur d'indentation spécifiée. Cela est utile pour aligner des chaînes multi-lignes :

```
indent 4 $lots_of_text
```

Le résultat ci-dessus indente chaque ligne de texte de 4 caractères d'espace.

### nindent

La fonction `nindent` est identique à la fonction `indent`, mais elle ajoute une nouvelle ligne au début de la chaîne.

```
nindent 4 $lots_of_text
```

Cela ajoutera une nouvelle ligne au début et indenter chaque ligne de texte de 4 espaces.

### replace

Effectue un remplacement simple de chaîne.

Il prend trois arguments :

- chaîne à remplacer
- chaîne de remplacement
- chaîne source

```
"I Am Henry VIII" | replace " " "-"
```

Cela produira `I-Am-Henry-VIII`.

### plural

Pluraliser une chaîne.

```
len $fish | plural "one anchovy" "many anchovies"
```

Dans l'exemple ci-dessus, si la longueur de la chaîne est de 1, le premier argument sera imprimé (`une anchois`). Sinon, le deuxième argument sera imprimé (`plusieurs anchois`).

Les arguments sont :

- chaîne au singulier
- chaîne au pluriel
- entier de longueur

REMARQUE : Helm ne prend actuellement pas en charge les langues avec des règles de pluralisation plus complexes. De plus, `0` est considéré comme un pluriel car la langue anglaise le traite ainsi (`zero anchovies`).

### snakecase

Convertir une chaîne de `camelCase` en `snake_case`.

```
snakecase "FirstName"
```

Cela produira `first_name`.

### camelcase

Convertir une chaîne de `snake_case` en `CamelCase`.

```
camelcase "http_server"
```

Cela produira `HttpServer`.

### kebabcase

Convertir une chaîne de `camelCase` en `kebab-case`.

```
kebabcase "FirstName"
```

Cela produira `first-name`.

### swapcase

Échanger la casse d'une chaîne en utilisant un algorithme basé sur les mots.

Algorithme de conversion :

- Un caractère en majuscule se convertit en minuscule.
- Un caractère en casse de titre se convertit en minuscule.
- Un caractère en minuscule après un espace ou au début se convertit en casse de titre.
- Un autre caractère en minuscule se convertit en majuscule.
- L'espace est défini par `unicode.IsSpace(char)`.

```
swapcase "This Is A.Test"
```

Cela produira `tHIS iS a.tEST`.

### shuffle

Mélanger une chaîne de caractères.

```
shuffle "hello"
```

Le résultat ci-dessus randomisera les lettres de « hello », produisant peut-être « oelhl ».

## Fonctions de conversion de type

Les fonctions de conversion de type suivantes sont fournies par Helm :

- `atoi` : Convertit une chaîne en entier.
- `float64` : Convertit en `float64`.
- `int` : Convertit en `int` selon la largeur du système.
- `int64` : Convertit en `int64`.
- `toDecimal` : Convertit un octal Unix en `int64`.
- `toString` : Convertit en chaîne.
- `toStrings` : Convertit une liste, un tableau ou un tableau en une liste de chaînes.
- `toJson` (`mustToJson`) : Convertit une liste, un tableau, un dictionnaire ou un objet en JSON.
- `toPrettyJson` (`mustToPrettyJson`) : Convertit une liste, un tableau, un dictionnaire ou un objet en JSON indenté.
- `toRawJson` (`mustToRawJson`) : Convertit une liste, un tableau, un dictionnaire ou un objet en JSON avec les caractères HTML non échappés.
- `fromYaml` : Convertit une chaîne YAML en objet.
- `fromJson` : Convertit une chaîne JSON en objet.
- `fromJsonArray` : Convertit un tableau JSON en liste.
- `toYaml` : Convertit une liste, un tableau, un dictionnaire ou un objet en YAML indenté, peut être utilisé pour copier des morceaux de YAML à partir de n'importe quelle source. Cette fonction est équivalente à la fonction GoLang `yaml.Marshal`, voir la documentation ici : https://pkg.go.dev/gopkg.in/yaml.v2#Marshal.
- `toToml` : Convertit une liste, un tableau, un dictionnaire ou un objet en TOML, peut être utilisé pour copier des morceaux de TOML à partir de n'importe quelle source.
- `fromYamlArray` : Convertit un tableau YAML en liste.

Seule la fonction `atoi` exige que l'entrée soit d'un type spécifique. Les autres essaieront de convertir n'importe quel type en type de destination. Par exemple, `int64` peut convertir des flottants en entiers, et il peut également convertir des chaînes en entiers.

### toStrings

Étant donné une collection de type liste, produisez une tranche de chaînes.

```
list 1 2 3 | toStrings
```

Ce qui précède convertit `1` en `"1"`, `2` en `"2"`, et ainsi de suite, puis les retourne sous forme de liste.

### toDecimal

Étant donné une permission octale UNIX, produit un décimal.

```
"0777" | toDecimal
```

Le code ci-dessus convertit `0777` en `511` et renvoie la valeur en tant qu'int64.

### toJson, mustToJson

La fonction `toJson` encode un élément en une chaîne JSON. Si l'élément ne peut pas être converti en JSON, la fonction renverra une chaîne vide. La fonction `mustToJson` renverra une erreur si l'élément ne peut pas être encodé en JSON.

```
toJson .Item
```

Cela renvoie la représentation sous forme de chaîne JSON de `.Item`.

### toPrettyJson, mustToPrettyJson

La fonction `toPrettyJson` encode un élément en une chaîne JSON joliment formatée (indente).

```
toPrettyJson .Item
```

Le résultat ci-dessus renvoie une représentation en chaîne JSON indentée de `.Item`.

### toRawJson, mustToRawJson

La fonction `toRawJson` encode un élément en une chaîne JSON avec des caractères HTML non échappés.

```
toRawJson .Item
```

Cela renvoie une représentation de chaîne JSON non échappée de `.Item`.

### fromYaml

La fonction `fromYaml` prend une chaîne YAML et renvoie un objet qui peut être utilisé dans des templates.

`Fichier : yamls/person.yaml`
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

La fonction `fromJson` prend une chaîne JSON et renvoie un objet qui peut être utilisé dans des templates.

`Fichier : jsons/person.json`
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

La fonction `fromJsonArray` prend un tableau JSON et renvoie une liste qui peut être utilisée dans des templates.

`Fichier : jsons/people.json`
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

### fromYamlArray

La fonction `fromYamlArray` prend un tableau YAML et renvoie une liste qui peut être utilisée dans des templates.

`Fichier : yamls/people.yml`
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

Retourne `true` si la chaîne d'entrée contient une correspondance avec l'expression régulière.

```
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"
```

L'exemple ci-dessus produit `true`

`regexMatch` provoque une panique en cas de problème, tandis que `mustRegexMatch` renvoie une erreur au moteur de template si un problème survient.

### regexFindAll, mustRegexFindAll

Retourne un tableau de toutes les correspondances de l'expression régulière dans la chaîne d'entrée. Le dernier paramètre `n` détermine le nombre de sous-chaînes à retourner, où `-1` signifie retourner toutes les correspondances.

```
regexFindAll "[2,4,6,8]" "123456789" -1
```

L'exemple ci-dessus produit `[2 4 6 8]`.

`regexFindAll` provoque une panique s'il y a un problème, tandis que `mustRegexFindAll` renvoie une erreur au moteur de templates s'il y a un problème.

### regexFind, mustRegexFind

Renvoie la première correspondance (la plus à gauche) de l'expression régulière dans la chaîne d'entrée.

```
regexFind "[a-zA-Z][1-9]" "abcd1234"
```

L'exemple ci-dessus produit `d1`.

`regexFind` panique s'il y a un problème, et `mustRegexFind` renvoie une erreur au moteur de template s'il y a un problème.

### regexReplaceAll, mustRegexReplaceAll

Retourne une copie de la chaîne d'entrée, remplaçant les correspondances de l'expression régulière par la chaîne de remplacement. Dans la chaîne de remplacement, les signes `$` sont interprétés comme dans `Expand`, donc par exemple `$1` représente le texte de la première sous-correspondance.

```
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

L'exemple ci-dessus produit `-W-xxW-`.

`regexReplaceAll` provoque une panique s'il y a un problème, tandis que `mustRegexReplaceAll` renvoie une erreur au moteur de template en cas de problème.

### regexReplaceAllLiteral, mustRegexReplaceAllLiteral

Renvoie une copie de la chaîne d'entrée, remplaçant les correspondances de l'expression régulière par la chaîne de remplacement. La chaîne de remplacement est substituée directement, sans utiliser Expand.

```
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"
```

L'exemple ci-dessus produit `-${1}-${1}-`

`regexReplaceAllLiteral` provoque une panique en cas de problème, tandis que `mustRegexReplaceAllLiteral` renvoie une erreur au moteur de template s'il y a un problème.

### regexSplit, mustRegexSplit

Divise la chaîne d'entrée en sous-chaînes séparées par l'expression et renvoie un tableau des sous-chaînes situées entre ces correspondances d'expression. Le dernier paramètre `n` détermine le nombre de sous-chaînes à renvoyer, où `-1` signifie renvoyer toutes les correspondances.

```
regexSplit "z+" "pizza" -1
```

L'exemple ci-dessus produit `[pi a]`

`regexSplit` provoque une panique en cas de problème et `mustRegexSplit` renvoie une erreur au moteur de template s'il y a un problème.

## Fonctions cryptographiques et de sécurité

Helm propose des fonctions cryptographiques avancées, notamment :
[adler32sum](#adler32sum), [buildCustomCert](#buildcustomcert),
[decryptAES](#decryptaes), [derivePassword](#derivepassword),
[encryptAES](#encryptaes), [genCA](#genca), [genPrivateKey](#genprivatekey),
[genSelfSignedCert](#genselfsignedcert), [genSignedCert](#gensignedcert),
[htpasswd](#htpasswd), [sha1sum](#sha1sum) et [sha256sum](#sha256sum).

### sha1sum

La fonction `sha1sum` reçoit une chaîne de caractères et calcule son empreinte SHA1.

```
sha1sum "Hello world!"
```

### sha256sum

La fonction `sha256sum` reçoit une chaîne de caractères et calcule son empreinte SHA256.

```
sha256sum "Hello world!"
```

L'exemple ci-dessus calcule la somme SHA 256 dans un format "ASCII armored" qui est sûr à imprimer.

### adler32sum

La fonction `adler32sum` reçoit une chaîne de caractères et calcule son empreinte Adler-32.

```
adler32sum "Hello world!"
```

### htpasswd

La fonction `htpasswd` prend un `nom d'utilisateur` et un `mot de passe`, et génère un hachage `bcrypt` du mot de passe. Le résultat peut être utilisé pour l'authentification de base sur un [serveur HTTP Apache](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html#basic).

```
htpasswd "myUser" "myPassword"
```

Notez qu'il est dangereux de stocker le mot de passe directement dans le template.

### derivePassword

La fonction `derivePassword` peut être utilisée pour dériver un mot de passe spécifique en fonction de certaines contraintes d'un "mot de passe maître" partagé. L'algorithme pour cela est [bien spécifié](https://web.archive.org/web/20211019121301/https://masterpassword.app/masterpassword-algorithm.pdf).

```
derivePassword 1 "long" "password" "user" "example.com"
```

Notez qu'il est dangereux de stocker le mot de passe directement dans le template.

### genPrivateKey

La fonction `genPrivateKey` génère une nouvelle clé privée encodée dans un bloc PEM.

Elle prend l'une des valeurs suivantes pour son premier paramètre :

- `ecdsa` : Génère une clé DSA à courbe elliptique (P256)
- `dsa` : Génère une clé DSA (L2048N256)
- `rsa` : Génère une clé RSA 4096

### buildCustomCert

La fonction `buildCustomCert` permet de personnaliser le certificat.

Elle prend les paramètres suivants sous forme de chaînes de caractères :

- Un certificat au format PEM encodé en base64
- Une clé privée au format PEM encodée en base64

Elle renvoie un objet certificat avec les attributs suivants :

- `Cert` : Un certificat encodé en PEM
- `Key` : Une clé privée encodée en PEM

Exemple :

```
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
```

Notez que l'objet retourné peut être passé à la fonction `genSignedCert` pour signer un certificat en utilisant cette autorité de certification (CA).

### genCA

La fonction `genCA` génère une nouvelle autorité de certification (CA) x509 auto-signée.

Elle prend les paramètres suivants :

- Nom commun (cn) du sujet
- Durée de validité du certificat en jours

Elle retourne un objet avec les attributs suivants :

- `Cert`: Un certificat encodé en PEM
- `Key`: Une clé privée encodée en PEM

Exemple :

```
$ca := genCA "foo-ca" 365
```

Notez que l'objet retourné peut être passé à la fonction `genSignedCert` pour signer un certificat en utilisant cette autorité de certification.

### genSelfSignedCert

La fonction `genSelfSignedCert` génère un nouveau certificat x509 auto-signé.

Elle prend les paramètres suivants :

- Nom commun du sujet (cn)
- Liste optionnelle d'adresses IP ; peut être nil
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

La fonction `genSignedCert` génère un nouveau certificat x509 signé par la CA spécifiée.

Elle prend les paramètres suivants :

- Nom commun du sujet (cn)
- Liste optionnelle d'adresses IP ; peut être nil
- Liste optionnelle de noms DNS alternatifs ; peut être nil
- Durée de validité du certificat en jours
- CA (voir `genCA`)

Exemple :

```
$ca := genCA "foo-ca" 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

### encryptAES

La fonction `encryptAES` chiffre du texte avec AES-256 CBC et retourne une chaîne encodée en base64.

```
encryptAES "secretkey" "plaintext"
```

### decryptAES

La fonction `decryptAES` reçoit une chaîne encodée en base64 par l'algorithme AES-256 CBC et retourne le texte décodé.

```
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

## Fonctions de date

Helm inclut les fonctions de date suivantes que vous pouvez utiliser dans les modèles :
[ago](#ago), [date](#date), [dateInZone](#dateinzone), [dateModify
(mustDateModify)](#datemodify-mustdatemodify), [duration](#duration),
[durationRound](#durationround), [htmlDate](#htmldate),
[htmlDateInZone](#htmldateinzone), [now](#now), [toDate
(mustToDate)](#todate-musttodate) et [unixEpoch](#unixepoch).

### now

La date/heure actuelle. Utilisez cela en conjonction avec d'autres fonctions de date.

### ago

La fonction `ago` renvoie la durée depuis un moment donné. Maintenant avec une résolution en secondes.

```
ago .CreatedAt
```

renvoie au format `time.Duration` String().

```
2h34m7s
```

### date

La fonction `date` formate une date.

Formate la date au format ANNÉE-MOIS-JOUR :

```
now | date "2006-01-02"
```

Le formatage des dates en Go est [un peu différent](https://pauladamsmith.com/blog/2011/05/go_time.html).

En résumé, prenez ceci comme date de référence :

```
Mon Jan 2 15:04:05 MST 2006
```

Écrivez-le dans le format que vous souhaitez. Ci-dessus, `2006-01-02` est la même date, mais dans le format que nous voulons.

### dateInZone

Identique à `date`, mais avec un fuseau horaire.

```
dateInZone "2006-01-02" (now) "UTC"
```

### duration

Formate une durée donnée en secondes sous la forme `time.Duration`.

Cela retourne 1m35s

```
duration "95"
```

### durationRound

Arrondit une durée donnée à l'unité la plus significative. Les chaînes et `time.Duration` sont analysées comme une durée, tandis qu'un `time.Time` est calculé comme la durée écoulée depuis.

Cela retourne 2h

```
durationRound "2h10m5s"
```

Cela retourne 3mo

```
durationRound "2400h10m5s"
```

### unixEpoch

Renvoie le nombre de secondes écoulées depuis l'époque Unix pour un `time.Time`.

```
now | unixEpoch
```

### dateModify, mustDateModify

La fonction `dateModify` prend une modification et une date et renvoie l'horodatage.

Soustraire une heure et trente minutes à l'heure actuelle :

```
now | dateModify "-1.5h"
```

Si le format de la modification est incorrect, `dateModify` renverra la date sans modification. `mustDateModify` renverra une erreur sinon.

### htmlDate

La fonction `htmlDate` formate une date pour l'insertion dans un champ d'entrée de sélecteur de date HTML.

```
now | htmlDate
```

### htmlDateInZone

Identique à `htmlDate`, mais avec un fuseau horaire.

```
htmlDateInZone (now) "UTC"
```

### toDate, mustToDate

`toDate` convertit une chaîne en date. Le premier argument est le format de la date et le second est la chaîne de date. Si la chaîne ne peut pas être convertie, elle renvoie la valeur nulle. `mustToDate` renverra une erreur si la chaîne ne peut pas être convertie.

Ceci est utile lorsque vous souhaitez convertir une date sous forme de chaîne dans un autre format (en utilisant un pipe). L'exemple ci-dessous convertit "2017-12-31" en "31/12/2017".

```
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

## Dictionnaires et fonctions de dictionnaire.

Helm fournit un type de stockage clé/valeur appelé `dict` (abréviation de "dictionnaire", comme en Python). Un `dict` est un type _non ordonné_.

La clé d'un dictionnaire **doit être une chaîne de caractères**. Cependant, la valeur peut être de n'importe quel type, même un autre `dict` ou `liste`.

Contrairement aux `listes`, les `dicts` ne sont pas immuables. Les fonctions `set` et `unset` modifieront le contenu d'un dictionnaire.

Helm fournit les fonctions suivantes pour prendre en charge le travail avec les dictionnaires : [deepCopy
(mustDeepCopy)](#deepcopy-mustdeepcopy), [dict](#dict), [dig](#dig), [get](#get),
[hasKey](#haskey), [keys](#keys), [merge (mustMerge)](#merge-mustmerge),
[mergeOverwrite (mustMergeOverwrite)](#mergeoverwrite-mustmergeoverwrite),
[omit](#omit), [pick](#pick), [pluck](#pluck), [set](#set), [unset](#unset) et [values](#values).

### dict

La création de dictionnaires se fait en appelant la fonction `dict` et en lui passant une liste de paires.

Ce qui suit, crée un dictionnaire avec trois éléments :

```
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
```

### get

Étant donné une map et une clé, obtenez la valeur de la carte.

```
get $myDict "name1"
```

Le résultat ci-dessus renvoie `"value1"`.

Notez que si la clé n'est pas trouvée, cette opération renverra simplement `""`. Aucune erreur ne sera générée.

### set

Utilisez `set` pour ajouter une nouvelle paire clé/valeur à un dictionnaire.

```
$_ := set $myDict "name4" "value4"
```

Notez que `set` _renvoie le dictionnaire_ (une exigence des fonctions de modèle Go), donc vous devrez peut-être capturer la valeur comme fait ci-dessus avec l'assignation `$_`.

### unset

Étant donné une map et une clé, supprimez la clé de la map.

```
$_ := unset $myDict "name4"
```

Comme avec `set`, cela renvoie le dictionnaire.

Notez que si la clé n'est pas trouvée, cette opération renverra simplement. Aucune erreur ne sera générée.

### hasKey

La fonction `hasKey` renvoie `true` si le dictionnaire donné contient la clé spécifiée.

```
hasKey $myDict "name1"
```

Si la clé n'est pas trouvée, cela renvoie `false`.

### pluck

La fonction `pluck` permet de fournir une clé et plusieurs cartes, et d'obtenir une liste de toutes les correspondances :

```
pluck "name1" $myDict $myOtherDict
```

Ce qui précède renverra une `liste` contenant toutes les valeurs trouvées (`[value1 otherValue1]`).

Si la clé n'est _pas trouvée_ dans une map, cette map ne sera pas incluse dans la liste (et la longueur de la liste retournée sera inférieure au nombre de dictionnaires dans l'appel à `pluck`).

Si la clé est _trouvée_ mais que la valeur est une valeur vide, cette valeur sera insérée.

Une idiome courant dans les modèles Helm est d'utiliser `pluck... | first` pour obtenir la première clé correspondante d'une collection de dictionnaires.

### dig

La fonction `dig` parcourt un ensemble imbriqué de dictionnaires, sélectionnant des clés à partir d'une liste de valeurs. Elle renvoie une valeur par défaut si l'une des clés n'est pas trouvée dans le dictionnaire associé.

```
dig "user" "role" "humanName" "guest" $dict
```

Donnez un dictionnaire structuré comme ceci :
```
{
  user: {
    role: {
      humanName: "curator"
    }
  }
}
```

le résultat serait `"curator"`. Si le dictionnaire manquait même d'un champ `user`, le résultat serait `"guest"`.

La fonction `dig` peut être très utile dans les cas où vous souhaitez éviter les clauses de garde, surtout puisque la fonction `and` du package de modèles Go ne fait pas de court-circuit. Par exemple, `and a.maybeNil a.maybeNil.iNeedThis` évaluera toujours `a.maybeNil.iNeedThis`, et provoquera un panic si `a` n'a pas de champ `maybeNil`.

`dig` accepte son argument de dictionnaire en dernier pour prendre en charge le passage en pipeline. Par exemple :
```
merge a b c | dig "one" "two" "three" "<missing>"
```

### merge, mustMerge

Fusionnez deux ou plusieurs dictionnaires en un seul, en donnant la priorité au dictionnaire de destination :

Donnée :

```
dst:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

Fera :

```
newdict:
  default: default
  overwrite: me
  key: true
```
```
$newdict := merge $dest $source1 $source2
```

C'est une opération de fusion profonde mais pas une opération de copie profonde. Les objets imbriqués qui sont fusionnés sont la même instance dans les deux dictionnaires. Si vous souhaitez une copie profonde ainsi que la fusion, utilisez alors la fonction `deepCopy` en même temps que la fusion. Par exemple :

```
deepCopy $source | merge $dest
```

`mustMerge` renverra une erreur en cas d'échec de la fusion.

### mergeOverwrite, mustMergeOverwrite

Fusionnez deux ou plusieurs dictionnaires en un, en donnant la priorité de **droite à gauche**, écrasant ainsi les valeurs dans le dictionnaire de destination :

Donnée :

```
dst:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

Fera :

```
newdict:
  default: default
  overwrite: overwritten
  key: false
```

```
$newdict := mergeOverwrite $dest $source1 $source2
```

C'est une opération de fusion profonde mais pas une opération de copie profonde. Les objets imbriqués qui sont fusionnés sont la même instance dans les deux dictionnaires. Si vous souhaitez une copie profonde ainsi que la fusion, utilisez la fonction `deepCopy` en plus de la fusion. Par exemple :

```
deepCopy $source | mergeOverwrite $dest
```

`mustMergeOverwrite` renverra une erreur en cas d'échec de la fusion.

### keys

La fonction `keys` renverra une `liste` de toutes les clés dans un ou plusieurs types de `dict`. Étant donné qu'un dictionnaire est _non ordonné_, les clés ne seront pas dans un ordre prévisible. Elles peuvent être triées avec `sortAlpha`.

```
keys $myDict | sortAlpha
```

Lorsque vous fournissez plusieurs dictionnaires, les clés seront concaténées. Utilisez la fonction `uniq` avec `sortAlpha` pour obtenir une liste de clés unique et triée.

```
keys $myDict $myOtherDict | uniq | sortAlpha
```

### pick

La fonction `pick` sélectionne uniquement les clés données d'un dictionnaire, créant ainsi un nouveau `dict`.

```
$new := pick $myDict "name1" "name2"
```

L'exemple ci-dessus retourne : `{name1: value1, name2: value2}`

### omit

La fonction `omit` est similaire à `pick`, sauf qu'elle retourne un nouveau `dict` avec toutes les clés qui ne correspondent pas aux clés données.

```
$new := omit $myDict "name1" "name3"
```

L'exemple ci-dessus retournera : `{name2: value2}`

### values

La fonction `values` est similaire à `keys`, sauf qu'elle retourne une nouvelle `list` contenant toutes les valeurs du `dict` source (un seul dictionnaire est pris en charge).

```
$vals := values $myDict
```

Le résultat ci-dessus retourne `list["value1", "value2", "value 3"]`. Notez que la fonction `values` ne garantit pas l'ordre du résultat ; si cela vous importe, utilisez `sortAlpha`.

### deepCopy, mustDeepCopy

Les fonctions `deepCopy` et `mustDeepCopy` prennent une valeur et en font une copie profonde. Cela inclut les dictionnaires et d'autres structures. `deepCopy` provoque un panique en cas de problème, tandis que `mustDeepCopy` renvoie une erreur au système de templates lorsqu'il y a une erreur.

```
dict "a" 1 "b" 2 | deepCopy
```

### Une note sur le fonctionnement des dictionnaires

Un `dict` est implémenté en Go comme un `map[string]interface{}`. Les développeurs Go peuvent passer des valeurs de `map[string]interface{}` dans le contexte pour les rendre disponibles aux templates sous forme de `dict`.

## Fonctions d'encodage

Helm dispose des fonctions d'encodage et de décodage suivantes :

- `b64enc`/`b64dec` : Encoder ou décoder avec Base64
- `b32enc`/`b32dec` : Encoder ou décoder avec Base32

## Listes et Fonctions de Liste

Helm fournit un type `list` simple qui peut contenir des listes séquentielles de données arbitraires. Cela est similaire aux tableaux ou aux slice, mais les listes sont conçues pour être utilisées comme des types de données immuables.

Créer une liste d'entier :

```
$myList := list 1 2 3 4 5
```

Cela créera la liste `[1 2 3 4 5]`.

Helm fournit les fonctions de liste suivantes : [append
(mustAppend)](#append-mustappend), [compact
(mustCompact)](#compact-mustcompact), [concat](#concat), [first
(mustFirst)](#first-mustfirst), [has (mustHas)](#has-musthas), [initial
(mustInitial)](#initial-mustinitial), [last (mustLast)](#last-mustlast),
[prepend (mustPrepend)](#prepend-mustprepend), [rest
(mustRest)](#rest-mustrest), [reverse (mustReverse)](#reverse-mustreverse),
[seq](#seq), [index](#index), [slice (mustSlice)](#slice-mustslice), [uniq
(mustUniq)](#uniq-mustuniq), [until](#until), [untilStep](#untilstep) et
[without (mustWithout)](#without-mustwithout).

### first, mustFirst

Pour obtenir le premier élément d'une liste, utilisez `first`.

`first $myList` renvoie `1`

`first` provoque une panique en cas de problème, tandis que `mustFirst` renvoie une erreur au moteur de template si un problème survient.

### rest, mustRest

Pour obtenir la queue de la liste (tout sauf le premier élément), utilisez `rest`.

`rest $myList` renvoie `[2 3 4 5]`

`rest` provoque une panique en cas de problème, tandis que `mustRest` renvoie une erreur au moteur de template si un problème survient.

### last, mustLast

Pour obtenir le dernier élément d'une liste, utilisez `last` :

`last $myList` renvoie `5`. Cela revient à inverser une liste et à appeler ensuite `first`.

### initial, mustInitial

Cela complète `last` en renvoyant tous les éléments _sauf_ le dernier. `initial $myList` renvoie `[1 2 3 4]`.

`initial` panique s'il y a un problème, tandis que `mustInitial` renvoie une erreur au moteur de template s'il y a un problème.

### append, mustAppend

Ajoutez un nouvel élément à une liste existante, créant ainsi une nouvelle liste.

```
$new = append $myList 6
```

Le code ci-dessus affectera à `$new` la valeur `[1 2 3 4 5 6]`. `$myList` resterait inchangé.

La fonction `append` génère une panique en cas de problème, tandis que `mustAppend` retourne une erreur au moteur de modèles en cas de problème.

### prepend, mustPrepend

Ajoute un élément au début d'une liste, en créant une nouvelle liste.

```
prepend $myList 0
```

Le résultat ci-dessus produira `[0 1 2 3 4 5]`. `$myList` restera inchangé.

`prepend` déclenche une panique s'il y a un problème, tandis que `mustPrepend` renvoie une erreur au moteur de templates en cas de problème.

### concat

Concaténer un nombre arbitraire de listes en une seule.

```
concat $myList ( list 6 7 ) ( list 8 )
```

Cela produira `[1 2 3 4 5 6 7 8]`. `$myList` restera inchangé.

### reverse, mustReverse

Produire une nouvelle liste avec les éléments inversés de la liste donnée.

```
reverse $myList
```

Cela générera la liste `[5 4 3 2 1]`.

`reverse` provoquera une panique en cas de problème, tandis que `mustReverse` retournera une erreur au moteur de templates s'il y a un problème.

### uniq, mustUniq

Générez une liste avec toutes les duplications supprimées.

```
list 1 1 1 2 | uniq
```

Le résultat ci-dessus produira `[1 2]`.

`uniq` panique s'il y a un problème, tandis que `mustUniq` renverra une erreur au moteur de modèles s'il y a un problème.

### without, mustWithout

La fonction `without` filtre les éléments d'une liste.

```
without $myList 3
```

Cela produira `[1 2 4 5]`.

La fonction `without` peut prendre plusieurs filtres :

```
without $myList 1 3 5
```

Cela produira `[2 4]`

La fonction `without` déclenchera une panique en cas de problème, tandis que `mustWithout` renverra une erreur au moteur de templates en cas de problème.

### has, mustHas

Test to see if a list has a particular element.

```
has 4 $myList
```

L'exemple ci-dessus retournerait `true`, tandis que `has "hello" $myList` retournerait `false`.

La fonction `has` panique s'il y a un problème, tandis que `mustHas` renverra une erreur au moteur de template en cas de problème.

### compact, mustCompact

Accepte une liste et supprime les entrées avec des valeurs vides.

```
$list := list 1 "a" "foo" ""
$copy := compact $list
```

`compact` renverra une nouvelle liste avec l'élément vide (c'est-à-dire, "") supprimé.

`compact` panique s'il y a un problème et `mustCompact` renverra une erreur au moteur de template s'il y a un problème.

### index

Pour obtenir le n-ième élément d'une liste, utilisez `index list [n]`. Pour indexer des listes multidimensionnelles, utilisez `index list [n] [m] ...`

- `index $myList 0` renverra `1`. C'est la même chose que `myList[0]`.
- `index $myList 0 1` serait identique à `myList[0][1]`.

### slice, mustSlice

Pour obtenir des éléments partiels d'une liste, utilisez `slice list [n] [m]`. Cela équivaut à `list[n:m]`.

- `slice $myList` renverra `[1 2 3 4 5]`. C'est la même chose que `myList[:]`.
- `slice $myList 3` renverra `[4 5]`. C'est la même chose que `myList[3:]`.
- `slice $myList 1 3` renverra `[2 3]`. C'est la même chose que `myList[1:3]`.
- `slice $myList 0 3` renverra `[1 2 3]`. C'est la même chose que `myList[:3]`.

`slice` panique s'il y a un problème, tandis que `mustSlice` renverra une erreur au moteur de template s'il y a un problème.

### until

La fonction `until` construit une plage d'entiers.

```
until 5
```

Cela génère la liste `[0, 1, 2, 3, 4]`.

Ceci est utile pour itérer avec `range $i, $e := until 5`.

### untilStep

Comme `until`, `untilStep` génère une liste d'entiers comptés. Mais il vous permet de définir un point de départ, un point d'arrêt et un pas :

```
untilStep 3 6 2
```

Cela produira `[3 5]` en commençant par 3 et en ajoutant 2 jusqu'à ce qu'il soit égal ou supérieur à 6. C'est similaire à la fonction `range` de Python.

### seq

Fonctionne comme la commande `seq` de bash.

* 1 paramètre (fin) - générera tous les entiers entre 1 et `fin`, inclus.
* 2 paramètres (début, fin) - générera tous les entiers entre `début` et `fin`, inclus, en incrémentant ou en décrémentant de 1.
* 3 paramètres (début, pas, fin) - générera tous les entiers entre `début` et `fin`, inclus, en incrémentant ou en décrémentant de `pas`.

```
seq 5       => 1 2 3 4 5
seq -3      => 1 0 -1 -2 -3
seq 0 2     => 0 1 2
seq 2 -2    => 2 1 0 -1 -2
seq 0 2 10  => 0 2 4 6 8 10
seq 0 -2 -5 => 0 -2 -4
```

## Fonctions Mathématiques

Toutes les fonctions mathématiques opèrent sur des valeurs `int64`, sauf indication contraire.

Les fonctions mathématiques suivantes sont disponibles : [add](#add), [add1](#add1),
[ceil](#ceil), [div](#div), [floor](#floor), [len](#len), [max](#max),
[min](#min), [mod](#mod), [mul](#mul), [round](#round) et [sub](#sub).

### add

Additionnez des nombres avec `add`. Accepte deux entrées ou plus.

```
add 1 2 3
```

### add1

Pour incrémenter de 1, utilisez `add1`.

### sub

Pour soustraire, utilisez `sub`.

### div

Effectuez une division entière avec `div`.

### mod

Effectuez un modulo avec `mod`.

### mul

Multipliez avec `mul`. Accepte deux entrées ou plus.

```
mul 1 2 3
```

### max

Retournez le plus grand d'une série d'entiers.

Cela retournera `3` :

```
max 1 2 3
```

### min

Retournez le plus petit d'une série d'entiers.

`min 1 2 3` renverra `1`.

### len

Retourne la longueur de l'argument sous forme d'entier.

```
len .Arg
```

## Fonctions mathématiques pour les nombres à virgule flottante.

Toutes les fonctions mathématiques opèrent sur des valeurs `float64`.

### addf

Faites la somme des nombres avec `addf`.

Cela retournera `5.5` :

```
addf 1.5 2 2
```

### add1f

Pour incrémenter de 1, utilisez `add1f`.

### subf

Pour soustraire, utilisez `subf`.

Ceci est équivalent à `7.5 - 2 - 3` et renverra `2.5`.

```
subf 7.5 2 3
```

### divf

Effectuez une division entière avec `divf`.

Ceci est équivalent à `10 / 2 / 4` et renverra `1.25`.

```
divf 10 2 4
```

### mulf

Multipliez avec `mulf`.

Ceci renverra `6`.

```
mulf 1.5 2 2
```

### maxf

Renvoie le plus grand d'une série de nombres à virgule flottante :

Ceci renverra `3`.

```
maxf 1 2.5 3
```

### minf

Renvoie le plus petit d'une série de nombres à virgule flottante.

Ceci renverra `1.5`.

```
minf 1.5 2 3
```

### floor

Renvoie la plus grande valeur à virgule flottante inférieure ou égale à la valeur d'entrée.

`floor 123.9999` renverra `123.0`.

### ceil

Renvoie la plus grande valeur à virgule flottante supérieure ou égale à la valeur d'entrée.

`ceil 123.001` renverra `124.0`.

### round

Renvoie une valeur à virgule flottante avec le reste arrondi au nombre donné de chiffres après la virgule décimale.

`round 123.555555 3` renverra `123.556`.

## Fonctions Réseau

Helm dispose d'une seule fonction réseau, `getHostByName`.

La fonction `getHostByName` reçoit un nom de domaine et renvoie l'adresse IP.

`getHostByName "www.google.com"` renverra l'adresse IP correspondante de `www.google.com`.

## Fonctions de Chemin de Fichier.

Bien que les fonctions de modèle Helm n'accordent pas l'accès au système de fichiers, elles fournissent des fonctions pour travailler avec des chaînes qui suivent les conventions de chemin de fichier. Cela inclut [base](#base), [clean](#clean), [dir](#dir), [ext](#ext) et [isAbs](#isabs).

### base

Retourne le dernier élément d'un chemin.

```
base "foo/bar/baz"
```

Cela affichera "baz".

### dir

Retourne le répertoire, en supprimant la dernière partie du chemin. Ainsi, `dir "foo/bar/baz"` renvoie `foo/bar`.

### clean

Nettoie un chemin.

```
clean "foo/bar/../baz"
```

La phrase ci-dessus résout le `..` et renvoie `foo/baz`.

### ext

Retourner l'extension de fichier.

```
ext "foo.bar"
```

Ce qui précède renverra `.bar`.

### isAbs

Pour vérifier si un chemin de fichier est absolu, utilisez `isAbs`.

## Fonctions de Réflexion

Helm fournit des outils de réflexion rudimentaires. Ceux-ci aident les développeurs de modèles avancés à comprendre les informations de type Go sous-jacentes pour une valeur particulière. Helm est écrit en Go et utilise un système de types fortement typé. Le système de types s'applique dans les modèles.

Go possède plusieurs _kinds_ primitifs, comme `string`, `slice`, `int64`, et `bool`.

Go possède un système de _types_ ouvert qui permet aux développeurs de créer leurs propres types.

Helm fournit un ensemble de fonctions pour chaque via [fonctions de kind](#fonctions-de-kind) et [fonctions de type](#functions-de-type). Une fonction [deepEqual](#deepequal) est également fournie pour comparer deux valeurs.

### Fonctions de Kind

Il existe deux fonctions de kind : `kindOf` retourne le kind (type primitif) d'un objet.

```
kindOf "hello"
```

La phrase ci-dessus retournerait `string`. Pour des tests simples (comme dans les blocs `if`), la fonction `kindIs` vous permettra de vérifier qu'une valeur est d'un kind particulier :

```
kindIs "int" 123
```

La phrase ci-dessus retournerait `true`.

### Functions de Type

Les types sont un peu plus difficiles à manipuler, c'est pourquoi il existe trois fonctions différentes :

- `typeOf` retourne le type sous-jacent d'une valeur : `typeOf $foo`
- `typeIs` fonctionne comme `kindIs`, mais pour les types : `typeIs "*io.Buffer" $myVal`
- `typeIsLike` fonctionne comme `typeIs`, sauf qu'il déréférence également les pointeurs.

**Remarque :** Aucune de ces fonctions ne peut tester si quelque chose implémente une interface donnée, car cela nécessiterait de compiler l'interface à l'avance.

### deepEqual

`deepEqual` retourne true si deux valeurs sont ["profondément égales"](https://golang.org/pkg/reflect/#DeepEqual).

Fonctionne également pour les types non primitifs (par rapport à la fonction `eq` intégrée).

```
deepEqual (list 1 2 3) (list 1 2 3)
```

La phrase ci-dessus retournerait `true`.

## Fonctions de Version Sémantique

Certains schémas de version sont facilement analysables et comparables. Helm fournit des fonctions pour travailler avec les versions [SemVer 2](http://semver.org). Celles-ci incluent [semver](#semver) et [semverCompare](#semvercompare). Vous trouverez ci-dessous également des détails sur l'utilisation des plages pour les comparaisons.

### semver

La fonction `semver` analyse une chaîne de caractères en une version sémantique :

```
$version := semver "1.2.3-alpha.1+123"
```

_Si l'analyseur échoue, l'exécution du modèle sera arrêtée avec une erreur._

À ce stade, `$version` est un pointeur vers un objet `Version` avec les propriétés suivantes :

- `$version.Major` : Le numéro majeur (`1` ci-dessus)
- `$version.Minor` : Le numéro mineur (`2` ci-dessus)
- `$version.Patch` : Le numéro patch (`3` ci-dessus)
- `$version.Prerelease` : La version préliminaire (`alpha.1` ci-dessus)
- `$version.Metadata` : Les métadonnées de build (`123` ci-dessus)
- `$version.Original` : La version originale en tant que chaîne de caractères

De plus, vous pouvez comparer une `Version` à une autre version en utilisant la fonction `Compare` :

```
semver "1.4.3" | (semver "1.2.3").Compare
```

L'exemple ci-dessus retournera `-1`.

Les valeurs de retour sont :

- `-1` si la version sémantique donnée est supérieure à la version sémantique dont la méthode `Compare` a été appelée
- `1` si la version dont la fonction `Compare` a été appelée est supérieure
- `0` si ce sont les mêmes versions

(Notez que dans SemVer, le champ `Metadata` n'est pas comparé lors des opérations de comparaison de versions.)

### semverCompare

Une fonction de comparaison plus robuste est fournie sous le nom de `semverCompare`. Cette version prend en charge les plages de versions :

- `semverCompare "1.2.3" "1.2.3"` vérifie une correspondance exacte.
- `semverCompare "~1.2.0" "1.2.3"` vérifie que les versions majeures et mineures correspondent, et que le numéro de patch de la deuxième version est _supérieur ou égal_ au premier paramètre.

Les fonctions SemVer utilisent la [bibliothèque semver de Masterminds](https://github.com/Masterminds/semver), créée par les développeurs de Sprig.

### Comparaisons Simple

Il y a deux éléments dans les comparaisons. Tout d'abord, une chaîne de comparaison est une liste de comparaisons AND séparées par des espaces ou des virgules. Ensuite, ces comparaisons sont séparées par des `||` (comparaisons OR). Par exemple, `">= 1.2 < 3.0.0 || >= 4.2.3"` recherche une version qui est supérieure ou égale à 1.2 et inférieure à 3.0.0 ou est supérieure ou égale à 4.2.3.

Les comparaisons de base sont :

- `=` : égal (alias pour aucun opérateur)
- `!=` : différent de
- `>` : supérieur à
- `<` : inférieur à
- `>=` : supérieur ou égal à
- `<=` : inférieur ou égal à

### Travailler avec les Versions Préliminaires

Les préversions, pour ceux qui ne les connaissent pas, sont utilisées pour les versions de logiciels avant les versions stables ou généralement disponibles. Les exemples de préversions incluent les versions de développement, alpha, bêta et candidates à la publication. Une préversion peut être une version telle que `1.2.3-beta.1`, tandis que la version stable serait `1.2.3`. Dans l'ordre de préséance, les préversions précèdent leurs versions associées. Dans cet exemple, `1.2.3-beta.1 < 1.2.3`.

Selon la spécification de la version sémantique, les préversions peuvent ne pas être compatibles avec l'API de leur version associée. Elle stipule :

> Une version préliminaire indique que la version est instable et pourrait ne pas
> satisfaire aux exigences de compatibilité prévues telles que désignées par sa version normale associée.

Les comparaisons SemVer utilisant des contraintes sans un comparateur de préversions ignoreront les préversions. Par exemple, `>=1.2.3` ignorera les préversions lors de l'examen d'une liste de versions, tandis que `>=1.2.3-0` évaluera et trouvera les préversions.

La raison pour laquelle le `0` est utilisé comme version de préversion dans l'exemple de comparaison est que les préversions ne peuvent contenir que des alphanumériques ASCII et des tirets (avec des séparateurs `.`), selon la spécification. Le tri se fait dans l'ordre de tri ASCII, conformément à la spécification. Le caractère le plus bas est un `0` dans l'ordre de tri ASCII (voir une [table ASCII](http://www.asciitable.com/)).

Comprendre l'ordre de tri ASCII est important car les lettres majuscules A-Z viennent avant les lettres minuscules a-z. Cela signifie que `>=1.2.3-BETA` retournera `1.2.3-alpha`. Ce que vous pourriez attendre de la sensibilité à la casse ne s'applique pas ici. C'est en raison de l'ordre de tri ASCII qui est ce que spécifie la spécification.

### Comparaisons de Plages avec Tirets

Il existe plusieurs méthodes pour gérer les plages, et la première est celle des plages avec tirets. Cela ressemble à :

- `1.2 - 1.4.5` qui est équivalent à `>= 1.2 <= 1.4.5`
- `2.3.4 - 4.5` qui est équivalent à `>= 2.3.4 <= 4.5`

### Caractères Génériques dans les Comparaisons

Les caractères `x`, `X` et `*` peuvent être utilisés comme caractères génériques. Cela fonctionne pour tous les opérateurs de comparaison. Lorsqu'ils sont utilisés avec l'opérateur `=`, ils se replient sur la comparaison au niveau du patch (voir le tilde ci-dessous). Par exemple :

- `1.2.x` est équivalent à `>= 1.2.0, < 1.3.0`
- `>= 1.2.x` est équivalent à `>= 1.2.0`
- `<= 2.x` est équivalent à `< 3`
- `*` est équivalent à `>= 0.0.0`

### Comparaisons de Plages avec Tilde (patch)

L'opérateur de comparaison tilde (`~`) est utilisé pour les plages de niveaux de patch lorsqu'une version mineure est spécifiée et pour les changements de niveaux majeurs lorsque le numéro mineur est absent. Par exemple :

- `~1.2.3` est équivalent à `>= 1.2.3, < 1.3.0`
- `~1` est équivalent à `>= 1, < 2`
- `~2.3` est équivalent à `>= 2.3, < 2.4`
- `~1.2.x` est équivalent à `>= 1.2.0, < 1.3.0`
- `~1.x` est équivalent à `>= 1, < 2`

### Comparaisons de Plages avec accent circonflexe (majeur)

L'opérateur de comparaison accent circonflexe (`^`) est utilisé pour les changements de niveau majeur une fois qu'une version stable (1.0.0) a été publiée. Avant une version 1.0.0, les versions mineures agissent comme le niveau de stabilité de l'API. Cela est utile pour les comparaisons des versions de l'API, car un changement majeur casse la compatibilité de l'API. Par exemple :

- `^1.2.3` est équivalent à `>= 1.2.3, < 2.0.0`
- `^1.2.x` est équivalent à `>= 1.2.0, < 2.0.0`
- `^2.3` est équivalent à `>= 2.3, < 3`
- `^2.x` est équivalent à `>= 2.0.0, < 3`
- `^0.2.3` est équivalent à `>= 0.2.3, < 0.3.0`
- `^0.2` est équivalent à `>= 0.2.0, < 0.3.0`
- `^0.0.3` est équivalent à `>= 0.0.3, < 0.0.4`
- `^0.0` est équivalent à `>= 0.0.0, < 0.1.0`
- `^0` est équivalent à `>= 0.0.0, < 1.0.0`

## Fonctions d'URL

Helm inclut les fonctions [urlParse](#urlparse), [urlJoin](#urljoin) et [urlQuery](#urlquery) vous permettant de travailler avec les parties d'une URL.

### urlParse

Analyse une chaîne pour une URL et produit un dictionnaire avec les parties de l'URL.

```
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

Ce qui précède renverra un dictionnaire contenant l'objet URL :

```yaml
scheme:   'http'
host:     'server.com:8080'
path:     '/api'
query:    'list=false'
opaque:   nil
fragment: 'anchor'
userinfo: 'admin:secret'
```

Cela est implémenté en utilisant les packages URL de la bibliothèque standard Go. Pour plus d'informations, consultez https://golang.org/pkg/net/url/#URL

### urlJoin

Concatène une map (produite par `urlParse`) pour produire une chaîne URL.

```
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

Cela retournera la chaîne suivante :
```
http://host:80/path?query#fragment
```

### urlquery

Renvoie la version échappée de la valeur passée en argument de manière à ce qu'elle soit adaptée à l'insertion dans la partie query d'une URL.

```
$var := urlquery "string for query"
```

## Fonctions UUID

Helm peut générer des UUID v4 (identifiants uniques universels).

```
uuidv4
```

L'exemple 'ci-dessus renverra un nouvel UUID de type v4 (généré de manière aléatoire).

## Kubernetes et Fonctions de Charts

Helm inclut des fonctions pour travailler avec Kubernetes, y compris
[.Capabilities.APIVersions.Has](#capabilitiesapiversionshas),
[Fichiers](#fonctions-de-fichiers) et [lookup](#lookup).

### lookup

`lookup` est utilisé pour rechercher des ressources dans un cluster en cours d'exécution. Lorsqu'il est utilisé avec la commande `helm template`, il renvoie toujours une réponse vide.

Vous pouvez trouver plus de détails dans la [documentation sur la fonction lookup](functions_and_pipelines.md/#utilisation-de-la-fonction-lookup).

### .Capabilities.APIVersions.Has

Renvoie si une version d'API ou une ressource est disponible dans un cluster.

```
.Capabilities.APIVersions.Has "apps/v1"
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

Plus d'informations sont disponibles sur le [built-in objects](builtin_objects.md).

### Fonctions de Fichiers

Il existe plusieurs fonctions qui vous permettent d'accéder à des fichiers non spéciaux dans un chart. Par exemple, pour accéder aux fichiers de configuration de l'application. Ces fonctions sont documentées dans [Accéder aux fichiers à l'intérieur des modèles](accessing_files.md).

_Remarque : la documentation pour beaucoup de ces fonctions provient de [Sprig](https://github.com/Masterminds/sprig). Sprig est une bibliothèque de fonctions de modèle disponible pour les applications Go._
