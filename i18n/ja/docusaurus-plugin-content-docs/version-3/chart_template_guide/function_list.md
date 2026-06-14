---
title: テンプレート関数リスト
description: Helm で利用可能なテンプレート関数の一覧です
sidebar_position: 6
---

Helm にはテンプレートで活用できる多くのテンプレート関数が用意されています。
以下のカテゴリごとに一覧を掲載します:

* [暗号化とセキュリティ](#cryptographic-and-security-functions)
* [日付](#date-functions)
* [辞書](#dictionaries-and-dict-functions)
* [エンコーディング](#encoding-functions)
* [ファイルパス](#file-path-functions)
* [Kubernetes と Chart](#kubernetes-and-chart-functions)
* [論理とフロー制御](#logic-and-flow-control-functions)
* [リスト](#lists-and-list-functions)
* [算術](#math-functions)
* [浮動小数点算術](#float-math-functions)
* [ネットワーク](#network-functions)
* [リフレクション](#reflection-functions)
* [正規表現](#regular-expressions)
* [セマンティックバージョン](#semantic-version-functions)
* [文字列](#string-functions)
* [型変換](#type-conversion-functions)
* [URL](#url-functions)
* [UUID](#uuid-functions)

## 論理とフロー制御関数

Helm には多くの論理・制御フロー関数が含まれています: [and](#and)、
[coalesce](#coalesce)、[default](#default)、[empty](#empty)、[eq](#eq)、
[fail](#fail)、[ge](#ge)、[gt](#gt)、[le](#le)、[lt](#lt)、[ne](#ne)、
[not](#not)、[or](#or)、[required](#required)。

### and

2つ以上の引数のブール論理積（AND）を返します
（最初の空の引数、または最後の引数を返します）。

```
and .Arg1 .Arg2
```

### or

2つ以上の引数のブール論理和（OR）を返します
（最初の空でない引数、または最後の引数を返します）。

```
or .Arg1 .Arg2
```

### not

引数のブール否定を返します。

```
not .Arg
```

### eq

引数のブール等価性を返します（例: Arg1 == Arg2）。

```
eq .Arg1 .Arg2
```

### ne

引数のブール不等価性を返します（例: Arg1 != Arg2）。

```
ne .Arg1 .Arg2
```

### lt

第1引数が第2引数より小さい場合に true を返します。
それ以外は false を返します（例: Arg1 < Arg2）。

```
lt .Arg1 .Arg2
```

### le

第1引数が第2引数以下の場合に true を返します。
それ以外は false を返します（例: Arg1 <= Arg2）。

```
le .Arg1 .Arg2
```

### gt

第1引数が第2引数より大きい場合に true を返します。
それ以外は false を返します（例: Arg1 > Arg2）。

```
gt .Arg1 .Arg2
```

### ge

第1引数が第2引数以上の場合に true を返します。
それ以外は false を返します（例: Arg1 >= Arg2）。

```
ge .Arg1 .Arg2
```

### default

シンプルなデフォルト値を設定するには `default` を使用します:

```
default "foo" .Bar
```

上記の場合、`.Bar` が空でない値に評価されればその値が使用されます。
空の場合は代わりに `foo` が返されます。

「空」の定義は型によって異なります:

- 数値: 0
- 文字列: ""
- リスト: `[]`
- 辞書: `{}`
- ブール: `false`
- および常に `nil`（null）

構造体には空の定義がないため、構造体がデフォルト値を返すことはありません。

### required

`required` を使用して必須の値を指定します:

```
required "A valid foo is required!" .Bar
```

`.Bar` が空または未定義の場合（評価方法については [default](#default) を参照）、
テンプレートはレンダリングされず、指定されたエラーメッセージが返されます。

### empty

`empty` 関数は、指定された値が空と見なされる場合に `true` を返し、
それ以外は `false` を返します。空の値は `default` セクションに記載されています。

```
empty .Foo
```

Go テンプレートの条件文では、空かどうかは自動的に計算されます。
そのため、`if not empty .Foo` はほとんど必要ありません。代わりに `if .Foo` を使用してください。

### fail

無条件に空の `string` と指定されたテキストを含む `error` を返します。
これは、他の条件によってテンプレートのレンダリングが失敗すべきと判断された
シナリオで役立ちます。

```
fail "Please accept the end user license agreement"
```

### coalesce

`coalesce` 関数は値のリストを受け取り、最初の空でない値を返します。

```
coalesce 0 1 2
```

上記は `1` を返します。

この関数は複数の変数や値をスキャンする際に便利です:

```
coalesce .name .parent.name "Matt"
```

上記はまず `.name` が空かどうかを確認します。空でなければその値を返します。
空の場合、`coalesce` は `.parent.name` の空をチェックします。
最終的に `.name` と `.parent.name` の両方が空の場合、`Matt` を返します。

### ternary

`ternary` 関数は2つの値とテスト値を受け取ります。テスト値が true の場合は
第1の値を返します。テスト値が空の場合は第2の値を返します。
これは C や他のプログラミング言語の三項演算子に似ています。

#### true テスト値

```
ternary "foo" "bar" true
```

または

```
true | ternary "foo" "bar"
```

上記は `"foo"` を返します。

#### false テスト値

```
ternary "foo" "bar" false
```

または

```
false | ternary "foo" "bar"
```

上記は `"bar"` を返します。

## 文字列関数

Helm には以下の文字列関数が含まれています: [abbrev](#abbrev)、
[abbrevboth](#abbrevboth)、[camelcase](#camelcase)、[cat](#cat)、
[contains](#contains)、[hasPrefix](#hasprefix-and-hassuffix)、
[hasSuffix](#hasprefix-and-hassuffix)、[indent](#indent)、[initials](#initials)、
[kebabcase](#kebabcase)、[lower](#lower)、[nindent](#nindent)、
[nospace](#nospace)、[plural](#plural)、[print](#print)、[printf](#printf)、
[println](#println)、[quote](#quote-and-squote)、
[randAlpha](#randalphanum-randalpha-randnumeric-and-randascii)、
[randAlphaNum](#randalphanum-randalpha-randnumeric-and-randascii)、
[randAscii](#randalphanum-randalpha-randnumeric-and-randascii)、
[randNumeric](#randalphanum-randalpha-randnumeric-and-randascii)、
[repeat](#repeat)、[replace](#replace)、[shuffle](#shuffle)、
[snakecase](#snakecase)、[squote](#quote-and-squote)、[substr](#substr)、
[swapcase](#swapcase)、[title](#title)、[trim](#trim)、[trimAll](#trimall)、
[trimPrefix](#trimprefix)、[trimSuffix](#trimsuffix)、[trunc](#trunc)、
[untitle](#untitle)、[upper](#upper)、[wrap](#wrap)、[wrapWith](#wrapwith)。

### print

パーツを組み合わせて文字列を返します。

```
print "Matt has " .Dogs " dogs"
```

文字列でない型は可能な限り文字列に変換されます。

隣り合う2つの引数が文字列でない場合、間にスペースが追加されます。

### println

[print](#print) と同様に動作しますが、末尾に改行を追加します。

### printf

フォーマット文字列と順番に渡す引数に基づいて文字列を返します。

```
printf "%s has %d dogs." .Name .NumberDogs
```

使用するプレースホルダーは渡す引数の型によって異なります。
以下が含まれます:

汎用:

* `%v` デフォルトフォーマットでの値
  * 辞書を出力する場合、プラスフラグ（%+v）でフィールド名を追加
* `%%` リテラルのパーセント記号、値を消費しない

ブール:

* `%t` true または false という単語

整数:

* `%b` 2進数
* `%c` 対応する Unicode コードポイントで表される文字
* `%d` 10進数
* `%o` 8進数
* `%O` 0o プレフィックス付き8進数
* `%q` 安全にエスケープされたシングルクォート文字リテラル
* `%x` 16進数（a-f は小文字）
* `%X` 16進数（A-F は大文字）
* `%U` Unicode フォーマット: U+1234、"U+%04X" と同等

浮動小数点と複素数の構成要素:

* `%b` 指数が2のべき乗の10進なし科学的記数法（例: -123456p-78）
* `%e` 科学的記数法（例: -1.234456e+78）
* `%E` 科学的記数法（例: -1.234456E+78）
* `%f` 小数点あり、指数なし（例: 123.456）
* `%F` %f と同義
* `%g` 大きな指数には %e、それ以外は %f
* `%G` 大きな指数には %E、それ以外は %F
* `%x` 16進表記（2のべき乗の10進指数付き、例: -0x1.23abcp+20）
* `%X` 大文字16進表記（例: -0X1.23ABCP+20）

文字列とバイトスライス（これらの動詞で同等に扱われます）:

* `%s` 文字列またはスライスの解釈されないバイト
* `%q` 安全にエスケープされたダブルクォート文字列
* `%x` 16進（小文字、バイトあたり2文字）
* `%X` 16進（大文字、バイトあたり2文字）

スライス:

* `%p` 先頭 0x 付き16進表記での第0要素のアドレス

### trim

`trim` 関数は文字列の両側から空白を削除します:

```
trim "   hello    "
```

上記は `hello` を生成します。

### trimAll

文字列の前後から指定した文字を削除します:

```
trimAll "$" "$5.00"
```

上記は `5.00`（文字列として）を返します。

### trimPrefix

文字列からプレフィックスのみを削除します:

```
trimPrefix "-" "-hello"
```

上記は `hello` を返します。

### trimSuffix

文字列からサフィックスのみを削除します:

```
trimSuffix "-" "hello-"
```

上記は `hello` を返します。

### lower

文字列全体を小文字に変換します:

```
lower "HELLO"
```

上記は `hello` を返します。

### upper

文字列全体を大文字に変換します:

```
upper "hello"
```

上記は `HELLO` を返します。

### title

タイトルケースに変換します:

```
title "hello world"
```

上記は `Hello World` を返します。

### untitle

タイトルケースを解除します。`untitle "Hello World"` は `hello world` を生成します。

### repeat

文字列を複数回繰り返します:

```
repeat 3 "hello"
```

上記は `hellohellohello` を返します。

### substr

文字列から部分文字列を取得します。3つのパラメータを取ります:

- start（int）
- end（int）
- string（string）

```
substr 0 5 "hello world"
```

上記は `hello` を返します。

### nospace

文字列からすべての空白を削除します。

```
nospace "hello w o r l d"
```

上記は `helloworld` を返します。

### trunc

文字列を切り詰めます。

```
trunc 5 "hello world"
```

上記は `hello` を生成します。

```
trunc -5 "hello world"
```

上記は `world` を生成します。

### abbrev

文字列を省略記号（`...`）付きで切り詰めます。

パラメータ:

- 最大長
- 文字列

```
abbrev 5 "hello world"
```

上記は `he...` を返します。省略記号の幅も最大長に含まれます。

### abbrevboth

両側を省略します:

```
abbrevboth 5 10 "1234 5678 9123"
```

上記は `...5678...` を生成します。

パラメータ:

- 左オフセット
- 最大長
- 文字列

### initials

複数の単語から各単語の最初の文字を取得して組み合わせます。

```
initials "First Try"
```

上記は `FT` を返します。

### randAlphaNum、randAlpha、randNumeric、randAscii

これら4つの関数は暗号学的に安全な（```crypto/rand``` を使用）
ランダム文字列を生成しますが、基本文字セットが異なります:

- `randAlphaNum` は `0-9a-zA-Z` を使用
- `randAlpha` は `a-zA-Z` を使用
- `randNumeric` は `0-9` を使用
- `randAscii` はすべての印刷可能 ASCII 文字を使用

それぞれ1つのパラメータ（文字列の整数長）を取ります。

```
randNumeric 3
```

上記は3桁のランダム文字列を生成します。

### wrap

指定した列数でテキストを折り返します:

```
wrap 80 $someText
```

上記は `$someText` 内の文字列を80列で折り返します。

### wrapWith

`wrapWith` は `wrap` と同様に動作しますが、折り返しに使用する文字列を指定できます
（`wrap` は `\n` を使用）。

```
wrapWith 5 "\t" "Hello World"
```

上記は `Hello World` を生成します（空白は ASCII タブ文字）。

### contains

ある文字列が別の文字列に含まれているかテストします:

```
contains "cat" "catch"
```

上記は `true` を返します。`catch` には `cat` が含まれているためです。

### hasPrefix と hasSuffix

`hasPrefix` と `hasSuffix` 関数は、文字列が指定したプレフィックスまたは
サフィックスを持っているかテストします:

```
hasPrefix "cat" "catch"
```

上記は `true` を返します。`catch` にはプレフィックス `cat` があるためです。

### quote と squote

これらの関数は文字列をダブルクォート（`quote`）または
シングルクォート（`squote`）で囲みます。

### cat

`cat` 関数は複数の文字列をスペースで区切りながら1つに連結します:

```
cat "hello" "beautiful" "world"
```

上記は `hello beautiful world` を生成します。

### indent

`indent` 関数は指定した文字列のすべての行を指定したインデント幅で
インデントします。複数行の文字列を揃える際に便利です:

```
indent 4 $lots_of_text
```

上記はテキストのすべての行を4つのスペース文字でインデントします。

### nindent

`nindent` 関数は indent 関数と同じですが、文字列の先頭に改行を追加します。

```
nindent 4 $lots_of_text
```

上記はテキストのすべての行を4つのスペース文字でインデントし、
先頭に改行を追加します。

### replace

単純な文字列置換を行います。

3つの引数を取ります:

- 置換する文字列
- 置換後の文字列
- ソース文字列

```
"I Am Henry VIII" | replace " " "-"
```

上記は `I-Am-Henry-VIII` を生成します。

### plural

文字列を複数形にします。

```
len $fish | plural "one anchovy" "many anchovies"
```

上記で、文字列の長さが1の場合は第1引数が出力されます（`one anchovy`）。
それ以外の場合は第2引数が出力されます（`many anchovies`）。

引数:

- 単数形文字列
- 複数形文字列
- 長さ整数

NOTE: 現在 Helm はより複雑な複数形ルールを持つ言語をサポートしていません。
また、`0` は複数形として扱われます。英語ではそのように扱われるためです
（`zero anchovies`）。

### snakecase

文字列を camelCase から snake_case に変換します。

```
snakecase "FirstName"
```

上記は `first_name` を生成します。

### camelcase

文字列を snake_case から CamelCase に変換します。

```
camelcase "http_server"
```

上記は `HttpServer` を生成します。

### kebabcase

文字列を camelCase から kebab-case に変換します。

```
kebabcase "FirstName"
```

上記は `first-name` を生成します。

### swapcase

単語ベースのアルゴリズムを使用して文字列の大文字小文字を入れ替えます。

変換アルゴリズム:

- 大文字は小文字に変換
- タイトルケース文字は小文字に変換
- 空白の後または先頭の小文字はタイトルケースに変換
- その他の小文字は大文字に変換
- 空白は unicode.IsSpace(char) で定義

```
swapcase "This Is A.Test"
```

上記は `tHIS iS a.tEST` を生成します。

### shuffle

文字列をシャッフルします。

```
shuffle "hello"
```

上記は `hello` の文字をランダムに並べ替えます。`oelhl` のような結果になる可能性があります。

## 型変換関数

Helm は以下の型変換関数を提供しています:

- `atoi`: 文字列を整数に変換
- `float64`: `float64` に変換
- `int`: システムのビット幅で `int` に変換
- `int64`: `int64` に変換
- `toDecimal`: Unix 8進数を `int64` に変換
- `toString`: 文字列に変換
- `toStrings`: リスト、スライス、または配列を文字列のリストに変換
- `toJson`（`mustToJson`）: リスト、スライス、配列、辞書、またはオブジェクトを JSON に変換
- `toPrettyJson`（`mustToPrettyJson`）: リスト、スライス、配列、辞書、またはオブジェクトをインデント付き JSON に変換
- `toRawJson`（`mustToRawJson`）: リスト、スライス、配列、辞書、またはオブジェクトを HTML 文字がエスケープされていない JSON に変換
- `fromYaml`: YAML 文字列をオブジェクトに変換
- `fromJson`: JSON 文字列をオブジェクトに変換
- `fromJsonArray`: JSON 配列をリストに変換
- `toYaml`: リスト、スライス、配列、辞書、またはオブジェクトをインデント付き yaml に変換。任意のソースから yaml のチャンクをコピーするのに使用できます。この関数は GoLang の yaml.Marshal 関数と同等です。詳細はこちらを参照: https://pkg.go.dev/gopkg.in/yaml.v2#Marshal
- `toYamlPretty`: リスト、スライス、配列、辞書、またはオブジェクトをインデント付き yaml に変換。`toYaml` と同等ですが、リストを2スペースでさらにインデントします。
- `toToml`: リスト、スライス、配列、辞書、またはオブジェクトを toml に変換。任意のソースから toml のチャンクをコピーするのに使用できます。
- `fromYamlArray`: YAML 配列をリストに変換

`atoi` のみ入力が特定の型である必要があります。その他は任意の型から
目的の型への変換を試みます。例えば、`int64` は浮動小数点を整数に変換でき、
文字列を整数に変換することもできます。

### toStrings

リスト型のコレクションを与えると、文字列のスライスを生成します。

```
list 1 2 3 | toStrings
```

上記は `1` を `"1"` に、`2` を `"2"` に変換し、リストとして返します。

### toDecimal

Unix 8進数パーミッションを与えると、10進数を生成します。

```
"0777" | toDecimal
```

上記は `0777` を `511` に変換し、int64 として値を返します。

### toJson、mustToJson

`toJson` 関数は項目を JSON 文字列にエンコードします。項目を JSON に変換できない場合、
関数は空の文字列を返します。`mustToJson` は項目を JSON にエンコードできない場合に
エラーを返します。

```
toJson .Item
```

上記は `.Item` の JSON 文字列表現を返します。

### toPrettyJson、mustToPrettyJson

`toPrettyJson` 関数は項目をインデント付きの整形された JSON 文字列にエンコードします。

```
toPrettyJson .Item
```

上記は `.Item` のインデント付き JSON 文字列表現を返します。

### toRawJson、mustToRawJson

`toRawJson` 関数は項目を HTML 文字がエスケープされていない JSON 文字列にエンコードします。

```
toRawJson .Item
```

上記は `.Item` のエスケープされていない JSON 文字列表現を返します。

### fromYaml

`fromYaml` 関数は YAML 文字列を受け取り、テンプレートで使用できるオブジェクトを返します。

`File at: yamls/person.yaml`
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

`fromJson` 関数は JSON 文字列を受け取り、テンプレートで使用できるオブジェクトを返します。

`File at: jsons/person.json`
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

`fromJsonArray` 関数は JSON 配列を受け取り、テンプレートで使用できるリストを返します。

`File at: jsons/people.json`
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

### toYaml、toYamlPretty

`toYaml` と `toYamlPretty` 関数はオブジェクト（リスト、スライス、配列、辞書、またはオブジェクト）をインデント付き YAML 文字列にエンコードします。

> `toYamlPretty` は機能的に同等ですが、リスト要素を追加でインデントした YAML を出力します。

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

`fromYamlArray` 関数は YAML 配列を受け取り、テンプレートで使用できるリストを返します。

`File at: yamls/people.yml`
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


## 正規表現

Helm には以下の正規表現関数が含まれています: [regexFind
（mustRegexFind）](#regexfindall-mustregexfindall)、[regexFindAll
（mustRegexFindAll）](#regexfind-mustregexfind)、[regexMatch
（mustRegexMatch）](#regexmatch-mustregexmatch)、[regexReplaceAll
（mustRegexReplaceAll）](#regexreplaceall-mustregexreplaceall)、
[regexReplaceAllLiteral
（mustRegexReplaceAllLiteral）](#regexreplaceallliteral-mustregexreplaceallliteral)、
[regexSplit（mustRegexSplit）](#regexsplit-mustregexsplit)。

### regexMatch、mustRegexMatch

入力文字列が正規表現にマッチするものを含む場合に true を返します。

```
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"
```

上記は `true` を生成します。

`regexMatch` は問題があるとパニックし、`mustRegexMatch` は問題があると
テンプレートエンジンにエラーを返します。

### regexFindAll、mustRegexFindAll

入力文字列内の正規表現のすべてのマッチのスライスを返します。
最後のパラメータ n は返す部分文字列の数を決定し、-1 はすべてのマッチを返すことを意味します。

```
regexFindAll "[2,4,6,8]" "123456789" -1
```

上記は `[2 4 6 8]` を生成します。

`regexFindAll` は問題があるとパニックし、`mustRegexFindAll` は問題があると
テンプレートエンジンにエラーを返します。

### regexFind、mustRegexFind

入力文字列内の正規表現の最初の（最も左の）マッチを返します。

```
regexFind "[a-zA-Z][1-9]" "abcd1234"
```

上記は `d1` を生成します。

`regexFind` は問題があるとパニックし、`mustRegexFind` は問題があると
テンプレートエンジンにエラーを返します。

### regexReplaceAll、mustRegexReplaceAll

入力文字列のコピーを返し、正規表現のマッチを置換文字列で置換します。
置換文字列内では、$ 記号は Expand と同様に解釈されます。
例えば、$1 は最初のサブマッチのテキストを表します。
第1引数は `<pattern>`、第2引数は `<input>`、第3引数は `<replacement>` です。

```
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

上記は `-W-xxW-` を生成します。

`regexReplaceAll` は問題があるとパニックし、`mustRegexReplaceAll` は問題があると
テンプレートエンジンにエラーを返します。

### regexReplaceAllLiteral、mustRegexReplaceAllLiteral

入力文字列のコピーを返し、正規表現のマッチを置換文字列で置換します。
置換文字列は Expand を使用せずに直接代入されます。
第1引数は `<pattern>`、第2引数は `<input>`、第3引数は `<replacement>` です。

```
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"
```

上記は `-${1}-${1}-` を生成します。

`regexReplaceAllLiteral` は問題があるとパニックし、
`mustRegexReplaceAllLiteral` は問題があるとテンプレートエンジンにエラーを返します。

### regexSplit、mustRegexSplit

入力文字列を正規表現で区切られた部分文字列にスライスし、
それらの正規表現マッチ間の部分文字列のスライスを返します。
最後のパラメータ `n` は返す部分文字列の数を決定し、
`-1` はすべてのマッチを返すことを意味します。

```
regexSplit "z+" "pizza" -1
```

上記は `[pi a]` を生成します。

`regexSplit` は問題があるとパニックし、`mustRegexSplit` は問題があると
テンプレートエンジンにエラーを返します。

## 暗号化とセキュリティ関数

Helm はいくつかの高度な暗号化関数を提供しています:
[adler32sum](#adler32sum)、[buildCustomCert](#buildcustomcert)、
[decryptAES](#decryptaes)、[derivePassword](#derivepassword)、
[encryptAES](#encryptaes)、[genCA](#genca)、[genPrivateKey](#genprivatekey)、
[genSelfSignedCert](#genselfsignedcert)、[genSignedCert](#gensignedcert)、
[htpasswd](#htpasswd)、[randBytes](#randbytes)、[sha1sum](#sha1sum)、
[sha256sum](#sha256sum)。

### sha1sum

`sha1sum` 関数は文字列を受け取り、その SHA1 ダイジェストを計算します。

```
sha1sum "Hello world!"
```

### sha256sum

`sha256sum` 関数は文字列を受け取り、その SHA256 ダイジェストを計算します。

```
sha256sum "Hello world!"
```

上記は印刷しても安全な「ASCII アーマー」形式で SHA 256 サムを計算します。

### adler32sum

`adler32sum` 関数は文字列を受け取り、その Adler-32 チェックサムを計算します。

```
adler32sum "Hello world!"
```

### htpasswd

`htpasswd` 関数は `username` と `password` を受け取り、パスワードの
`bcrypt` ハッシュを生成します。結果は [Apache HTTP
Server](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html#basic) での
基本認証に使用できます。

```
htpasswd "myUser" "myPassword"
```

パスワードをテンプレートに直接保存することは安全ではありません。

### randBytes

randBytes 関数はカウント N を受け取り、暗号学的に安全な
（crypto/rand を使用）N バイトのランダムシーケンスを生成します。
シーケンスは base64 エンコードされた文字列として返されます。

```
randBytes 24
```

### derivePassword

`derivePassword` 関数は、共有「マスターパスワード」の制約に基づいて
特定のパスワードを導出するために使用できます。
このアルゴリズムは[明確に仕様化されています](https://web.archive.org/web/20211019121301/https://masterpassword.app/masterpassword-algorithm.pdf)。

```
derivePassword 1 "long" "password" "user" "example.com"
```

パーツをテンプレートに直接保存することは安全でないと見なされます。

### genPrivateKey

`genPrivateKey` 関数は PEM ブロックにエンコードされた新しい秘密鍵を生成します。

最初のパラメータとして以下のいずれかの値を取ります:

- `ecdsa`: 楕円曲線 DSA 鍵を生成（P256）
- `dsa`: DSA 鍵を生成（L2048N256）
- `rsa`: RSA 4096 鍵を生成

### buildCustomCert

`buildCustomCert` 関数は証明書のカスタマイズを可能にします。

以下の文字列パラメータを取ります:

- base64 エンコードされた PEM 形式の証明書
- base64 エンコードされた PEM 形式の秘密鍵

以下の属性を持つ証明書オブジェクトを返します:

- `Cert`: PEM エンコードされた証明書
- `Key`: PEM エンコードされた秘密鍵

例:

```
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
```

返されたオブジェクトは `genSignedCert` 関数に渡して、この CA を使用して
証明書に署名できます。

### genCA

`genCA` 関数は新しい自己署名 x509 認証局を生成します。

以下のパラメータを取ります:

- サブジェクトのコモンネーム（cn）
- 証明書の有効期間（日数）

以下の属性を持つオブジェクトを返します:

- `Cert`: PEM エンコードされた証明書
- `Key`: PEM エンコードされた秘密鍵

例:

```
$ca := genCA "foo-ca" 365
```

返されたオブジェクトは `genSignedCert` 関数に渡して、この CA を使用して
証明書に署名できます。

### genSelfSignedCert

`genSelfSignedCert` 関数は新しい自己署名 x509 証明書を生成します。

以下のパラメータを取ります:

- サブジェクトのコモンネーム（cn）
- IP のオプションリスト（nil 可）
- 代替 DNS 名のオプションリスト（nil 可）
- 証明書の有効期間（日数）

以下の属性を持つオブジェクトを返します:

- `Cert`: PEM エンコードされた証明書
- `Key`: PEM エンコードされた秘密鍵

例:

```
$cert := genSelfSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365
```

### genSignedCert

`genSignedCert` 関数は指定した CA によって署名された新しい x509 証明書を生成します。

以下のパラメータを取ります:

- サブジェクトのコモンネーム（cn）
- IP のオプションリスト（nil 可）
- 代替 DNS 名のオプションリスト（nil 可）
- 証明書の有効期間（日数）
- CA（`genCA` を参照）

例:

```
$ca := genCA "foo-ca" 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

### encryptAES

`encryptAES` 関数は AES-256 CBC でテキストを暗号化し、
base64 エンコードされた文字列を返します。

```
encryptAES "secretkey" "plaintext"
```

### decryptAES

`decryptAES` 関数は AES-256 CBC アルゴリズムでエンコードされた
base64 文字列を受け取り、復号されたテキストを返します。

```
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

## 日付関数

Helm にはテンプレートで使用できる以下の日付関数が含まれています:
[ago](#ago)、[date](#date)、[dateInZone](#dateinzone)、[dateModify
（mustDateModify）](#datemodify-mustdatemodify)、[duration](#duration)、
[durationRound](#durationround)、[htmlDate](#htmldate)、
[htmlDateInZone](#htmldateinzone)、[now](#now)、[toDate
（mustToDate）](#todate-musttodate)、[unixEpoch](#unixepoch)。

### now

現在の日時を返します。他の日付関数と組み合わせて使用します。

### ago

`ago` 関数は現在からの経過時間を秒単位の解像度で返します。

```
ago .CreatedAt
```

`time.Duration` の String() 形式で返します。

```
2h34m7s
```

### date

`date` 関数は日付をフォーマットします。

日付を YEAR-MONTH-DAY 形式でフォーマット:

```
now | date "2006-01-02"
```

Go での日付フォーマットは[少し異なります](https://pauladamsmith.com/blog/2011/05/go_time.html)。

簡単に言うと、以下を基準日として使用します:

```
Mon Jan 2 15:04:05 MST 2006
```

これを希望する形式で記述します。上記の `2006-01-02` は同じ日付ですが、
希望する形式になっています。

### dateInZone

`date` と同じですが、タイムゾーン付きです。

```
dateInZone "2006-01-02" (now) "UTC"
```

### duration

指定した秒数を `time.Duration` としてフォーマットします。

以下は 1m35s を返します。

```
duration "95"
```

### durationRound

指定した期間を最も重要な単位に丸めます。文字列と `time.Duration` は
期間として解析され、`time.Time` はそこからの経過時間として計算されます。

以下は 2h を返します。

```
durationRound "2h10m5s"
```

以下は 3mo を返します。

```
durationRound "2400h10m5s"
```

### unixEpoch

`time.Time` に対する Unix エポックからの秒数を返します。

```
now | unixEpoch
```

### dateModify、mustDateModify

`dateModify` は修正と日付を受け取り、タイムスタンプを返します。

現在時刻から1時間30分を引く:

```
now | dateModify "-1.5h"
```

修正形式が間違っている場合、`dateModify` は日付を変更せずに返します。
`mustDateModify` はそれ以外の場合にエラーを返します。

### htmlDate

`htmlDate` 関数は HTML の日付ピッカー入力フィールドに挿入するために
日付をフォーマットします。

```
now | htmlDate
```

### htmlDateInZone

htmlDate と同じですが、タイムゾーン付きです。

```
htmlDateInZone (now) "UTC"
```

### toDate、mustToDate

`toDate` は文字列を日付に変換します。第1引数は日付レイアウト、
第2引数は日付文字列です。文字列を変換できない場合はゼロ値を返します。
`mustToDate` は文字列を変換できない場合にエラーを返します。

これは文字列の日付を別の形式に変換したい場合に便利です（パイプを使用）。
以下の例は "2017-12-31" を "31/12/2017" に変換します。

```
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

## 辞書と Dict 関数

Helm は `dict`（Python の「dictionary」の略）と呼ばれるキー/値ストレージ型を
提供しています。`dict` は _順序なし_ の型です。

辞書のキーは **文字列でなければなりません**。ただし、値は任意の型にでき、
別の `dict` や `list` でも構いません。

`list` とは異なり、`dict` は不変ではありません。`set` と `unset` 関数は
辞書の内容を変更します。

Helm は辞書を扱うために以下の関数を提供しています: [deepCopy
（mustDeepCopy）](#deepcopy-mustdeepcopy)、[dict](#dict)、[dig](#dig)、[get](#get)、
[hasKey](#haskey)、[keys](#keys)、[merge（mustMerge）](#merge-mustmerge)、
[mergeOverwrite（mustMergeOverwrite）](#mergeoverwrite-mustmergeoverwrite)、
[omit](#omit)、[pick](#pick)、[pluck](#pluck)、[set](#set)、[unset](#unset)、
[values](#values)。

### dict

辞書の作成は `dict` 関数を呼び出してペアのリストを渡すことで行います。

以下は3つの項目を持つ辞書を作成します:

```
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
```

### get

マップとキーを与えると、マップから値を取得します。

```
get $myDict "name1"
```

上記は `"value1"` を返します。

キーが見つからない場合、この操作は単に `""` を返します。
エラーは生成されません。

### set

`set` を使用して辞書に新しいキー/値ペアを追加します。

```
$_ := set $myDict "name4" "value4"
```

`set` は _辞書を返す_（Go テンプレート関数の要件）ため、
上記の `$_` 代入のように値をトラップする必要がある場合があります。

### unset

マップとキーを与えると、マップからキーを削除します。

```
$_ := unset $myDict "name4"
```

`set` と同様に、辞書を返します。

キーが見つからない場合、この操作は単に戻ります。エラーは生成されません。

### hasKey

`hasKey` 関数は、指定した辞書に指定したキーが含まれている場合に `true` を返します。

```
hasKey $myDict "name1"
```

キーが見つからない場合は `false` を返します。

### pluck

`pluck` 関数は1つのキーと複数のマップを与えて、
すべてのマッチのリストを取得することを可能にします:

```
pluck "name1" $myDict $myOtherDict
```

上記は見つかったすべての値を含む `list` を返します（`[value1
otherValue1]`）。

指定したキーがマップに _見つからない_ 場合、そのマップはリストに項目を持ちません
（返されるリストの長さは `pluck` 呼び出しの辞書の数より少なくなります）。

キーが _見つかった_ が値が空の値の場合、その値は挿入されます。

Helm テンプレートでの一般的なイディオムは、`pluck... | first` を使用して
辞書のコレクションから最初にマッチするキーを取得することです。

### dig

`dig` 関数はネストした辞書のセットを走査し、値のリストからキーを選択します。
関連する辞書でキーが見つからない場合はデフォルト値を返します。

```
dig "user" "role" "humanName" "guest" $dict
```

以下のような構造の辞書が与えられた場合
```
{
  user: {
    role: {
      humanName: "curator"
    }
  }
}
```

上記は `"curator"` を返します。辞書に `user` フィールドさえない場合、
結果は `"guest"` になります。

Dig はガード句を避けたい場合に非常に便利です。特に Go のテンプレートパッケージの
`and` はショートサーキットしないためです。例えば `and a.maybeNil a.maybeNil.iNeedThis` は
常に `a.maybeNil.iNeedThis` を評価し、`a` に `maybeNil` フィールドがない場合は
パニックします。

`dig` はパイプラインをサポートするために辞書引数を最後に受け取ります。例えば:
```
merge a b c | dig "one" "two" "three" "<missing>"
```

### merge、mustMerge

2つ以上の辞書を1つにマージし、dest 辞書を優先します:

与えられた場合:

```
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

結果は:

```
newdict:
  default: default
  overwrite: me
  key: true
```
```
$newdict := merge $dest $source1 $source2
```

これはディープマージ操作ですが、ディープコピー操作ではありません。
マージされるネストしたオブジェクトは両方の辞書で同じインスタンスです。
マージと一緒にディープコピーが必要な場合は、マージと一緒に `deepCopy` 関数を
使用してください。例えば、

```
deepCopy $source | merge $dest
```

`mustMerge` はマージが失敗した場合にエラーを返します。

### mergeOverwrite、mustMergeOverwrite

2つ以上の辞書を1つにマージし、**右から左**への優先順位で、
dest 辞書の値を上書きします:

与えられた場合:

```
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

結果は:

```
newdict:
  default: default
  overwrite: overwritten
  key: false
```

```
$newdict := mergeOverwrite $dest $source1 $source2
```

これはディープマージ操作ですが、ディープコピー操作ではありません。
マージされるネストしたオブジェクトは両方の辞書で同じインスタンスです。
マージと一緒にディープコピーが必要な場合は、マージと一緒に `deepCopy` 関数を
使用してください。例えば、

```
deepCopy $source | mergeOverwrite $dest
```

`mustMergeOverwrite` はマージが失敗した場合にエラーを返します。

### keys

`keys` 関数は1つ以上の `dict` 型のすべてのキーの `list` を返します。
辞書は _順序なし_ なので、キーは予測可能な順序にはなりません。
`sortAlpha` でソートできます。

```
keys $myDict | sortAlpha
```

複数の辞書を指定すると、キーは連結されます。`uniq` 関数と `sortAlpha` を
使用して、一意でソートされたキーのリストを取得できます。

```
keys $myDict $myOtherDict | uniq | sortAlpha
```

### pick

`pick` 関数は辞書から指定したキーのみを選択し、新しい `dict` を作成します。

```
$new := pick $myDict "name1" "name2"
```

上記は `{name1: value1, name2: value2}` を返します。

### omit

`omit` 関数は `pick` に似ていますが、指定したキーに _マッチしない_
すべてのキーを持つ新しい `dict` を返します。

```
$new := omit $myDict "name1" "name3"
```

上記は `{name2: value2}` を返します。

### values

`values` 関数は `keys` に似ていますが、ソース `dict` のすべての値を持つ
新しい `list` を返します（辞書は1つのみサポート）。

```
$vals := values $myDict
```

上記は `list["value1", "value2", "value 3"]` を返します。`values` 関数は
結果の順序を保証しません。順序が重要な場合は `sortAlpha` を使用してください。

### deepCopy、mustDeepCopy

`deepCopy` と `mustDeepCopy` 関数は値を受け取り、その値のディープコピーを作成します。
これには辞書やその他の構造も含まれます。`deepCopy` は問題があるとパニックし、
`mustDeepCopy` はエラーがあるとテンプレートシステムにエラーを返します。

```
dict "a" 1 "b" 2 | deepCopy
```

### Dict 内部に関する注記

`dict` は Go では `map[string]interface{}` として実装されています。
Go 開発者は `map[string]interface{}` 値をコンテキストに渡して、
テンプレートで `dict` として利用可能にすることができます。

## エンコーディング関数

Helm には以下のエンコードおよびデコード関数があります:

- `b64enc`/`b64dec`: Base64 でエンコード/デコード
- `b32enc`/`b32dec`: Base32 でエンコード/デコード

## リストと List 関数

Helm は任意のデータの連続リストを含むことができるシンプルな `list` 型を提供しています。
これは配列やスライスに似ていますが、リストは不変のデータ型として使用されるように
設計されています。

整数のリストを作成:

```
$myList := list 1 2 3 4 5
```

上記は `[1 2 3 4 5]` のリストを作成します。

Helm は以下のリスト関数を提供しています: [append
（mustAppend）](#append-mustappend)、[chunk](#chunk)、[compact
（mustCompact）](#compact-mustcompact)、[concat](#concat)、[first
（mustFirst）](#first-mustfirst)、[has（mustHas）](#has-musthas)、[initial
（mustInitial）](#initial-mustinitial)、[last（mustLast）](#last-mustlast)、
[prepend（mustPrepend）](#prepend-mustprepend)、[rest
（mustRest）](#rest-mustrest)、[reverse（mustReverse）](#reverse-mustreverse)、
[seq](#seq)、[index](#index)、[slice（mustSlice）](#slice-mustslice)、[uniq
（mustUniq）](#uniq-mustuniq)、[until](#until)、[untilStep](#untilstep)、
[without（mustWithout）](#without-mustwithout)。

### first、mustFirst

リストの先頭項目を取得するには `first` を使用します。

`first $myList` は `1` を返します。

`first` は問題があるとパニックし、`mustFirst` は問題があると
テンプレートエンジンにエラーを返します。

### rest、mustRest

リストの末尾（先頭項目以外のすべて）を取得するには `rest` を使用します。

`rest $myList` は `[2 3 4 5]` を返します。

`rest` は問題があるとパニックし、`mustRest` は問題があると
テンプレートエンジンにエラーを返します。

### last、mustLast

リストの最後の項目を取得するには `last` を使用します:

`last $myList` は `5` を返します。これはリストを逆にしてから
`first` を呼び出すのとほぼ同じです。

### initial、mustInitial

これは `last` を補完し、最後の要素 _以外_ のすべてを返します。
`initial $myList` は `[1 2 3 4]` を返します。

`initial` は問題があるとパニックし、`mustInitial` は問題があると
テンプレートエンジンにエラーを返します。

### append、mustAppend

既存のリストに新しい項目を追加し、新しいリストを作成します。

```
$new = append $myList 6
```

上記は `$new` を `[1 2 3 4 5 6]` に設定します。`$myList` は変更されません。

`append` は問題があるとパニックし、`mustAppend` は問題があると
テンプレートエンジンにエラーを返します。

### prepend、mustPrepend

リストの先頭に要素をプッシュし、新しいリストを作成します。

```
prepend $myList 0
```

上記は `[0 1 2 3 4 5]` を生成します。`$myList` は変更されません。

`prepend` は問題があるとパニックし、`mustPrepend` は問題があると
テンプレートエンジンにエラーを返します。

### concat

任意の数のリストを1つに連結します。

```
concat $myList ( list 6 7 ) ( list 8 )
```

上記は `[1 2 3 4 5 6 7 8]` を生成します。`$myList` は変更されません。

### reverse、mustReverse

与えられたリストの要素を逆にした新しいリストを生成します。

```
reverse $myList
```

上記はリスト `[5 4 3 2 1]` を生成します。

`reverse` は問題があるとパニックし、`mustReverse` は問題があると
テンプレートエンジンにエラーを返します。

### uniq、mustUniq

すべての重複を削除したリストを生成します。

```
list 1 1 1 2 | uniq
```

上記は `[1 2]` を生成します。

`uniq` は問題があるとパニックし、`mustUniq` は問題があると
テンプレートエンジンにエラーを返します。

### without、mustWithout

`without` 関数はリストから項目をフィルタリングします。

```
without $myList 3
```

上記は `[1 2 4 5]` を生成します。

`without` は複数のフィルターを取ることができます:

```
without $myList 1 3 5
```

これは `[2 4]` を生成します。

`without` は問題があるとパニックし、`mustWithout` は問題があると
テンプレートエンジンにエラーを返します。

### has、mustHas

リストに特定の要素があるかテストします。

```
has 4 $myList
```

上記は `true` を返しますが、`has "hello" $myList` は false を返します。

`has` は問題があるとパニックし、`mustHas` は問題があると
テンプレートエンジンにエラーを返します。

### compact、mustCompact

リストを受け取り、空の値を持つエントリを削除します。

```
$list := list 1 "a" "foo" ""
$copy := compact $list
```

`compact` は空（つまり ""）の項目を削除した新しいリストを返します。

`compact` は問題があるとパニックし、`mustCompact` は問題があると
テンプレートエンジンにエラーを返します。

### index

リストの n 番目の要素を取得するには `index list [n]` を使用します。
多次元リストにインデックスするには `index list [n] [m] ...` を使用します。
- `index $myList 0` は `1` を返します。`myList[0]` と同じです。
- `index $myList 0 1` は `myList[0][1]` と同じです。

### slice、mustSlice

リストの部分要素を取得するには `slice list [n] [m]` を使用します。
これは `list[n:m]` と同等です。

- `slice $myList` は `[1 2 3 4 5]` を返します。`myList[:]` と同じです。
- `slice $myList 3` は `[4 5]` を返します。`myList[3:]` と同じです。
- `slice $myList 1 3` は `[2 3]` を返します。`myList[1:3]` と同じです。
- `slice $myList 0 3` は `[1 2 3]` を返します。`myList[:3]` と同じです。

`slice` は問題があるとパニックし、`mustSlice` は問題があると
テンプレートエンジンにエラーを返します。

### until

`until` 関数は整数の範囲を構築します。

```
until 5
```

上記はリスト `[0, 1, 2, 3, 4]` を生成します。

これは `range $i, $e := until 5` でループする際に便利です。

### untilStep

`until` と同様に、`untilStep` はカウント整数のリストを生成します。
ただし、開始、終了、ステップを定義できます:

```
untilStep 3 6 2
```

上記は 3 から開始し、6 以上になるまで 2 を加算して `[3 5]` を生成します。
これは Python の `range` 関数に似ています。

### seq

bash の `seq` コマンドのように動作します。

* 1 パラメータ（end）- 1 から `end` までのすべてのカウント整数を生成します（両端含む）。
* 2 パラメータ（start, end）- `start` から `end` までのすべてのカウント整数を
  1 ずつ増減して生成します（両端含む）。
* 3 パラメータ（start, step, end）- `start` から `end` までのすべてのカウント整数を
  `step` ずつ増減して生成します（両端含む）。

```
seq 5       => 1 2 3 4 5
seq -3      => 1 0 -1 -2 -3
seq 0 2     => 0 1 2
seq 2 -2    => 2 1 0 -1 -2
seq 0 2 10  => 0 2 4 6 8 10
seq 0 -2 -5 => 0 -2 -4
```

### chunk

リストを指定したサイズのチャンクに分割するには `chunk size list` を使用します。
これはページネーションに便利です。

```
chunk 3 (list 1 2 3 4 5 6 7 8)
```

これはリストのリスト `[ [ 1 2 3 ] [ 4 5 6 ] [ 7 8 ] ]` を生成します。

## 算術関数

すべての算術関数は、特に指定がない限り `int64` 値で動作します。

以下の算術関数が利用可能です: [add](#add)、[add1](#add1)、
[ceil](#ceil)、[div](#div)、[floor](#floor)、[len](#len)、[max](#max)、
[min](#min)、[mod](#mod)、[mul](#mul)、[round](#round)、[sub](#sub)。

### add

`add` で数値を合計します。2つ以上の入力を受け付けます。

```
add 1 2 3
```

### add1

1 を加算するには `add1` を使用します。

### sub

減算するには `sub` を使用します。

### div

`div` で整数除算を行います。

### mod

`mod` で剰余を求めます。

### mul

`mul` で乗算します。2つ以上の入力を受け付けます。

```
mul 1 2 3
```

### max

一連の整数の最大値を返します。

以下は `3` を返します:

```
max 1 2 3
```

### min

一連の整数の最小値を返します。

`min 1 2 3` は `1` を返します。

### len

引数の長さを整数として返します。

```
len .Arg
```

## 浮動小数点算術関数

すべての算術関数は `float64` 値で動作します。

### addf

`addf` で数値を合計します。

以下は `5.5` を返します:

```
addf 1.5 2 2
```

### add1f

1 を加算するには `add1f` を使用します。

### subf

減算するには `subf` を使用します。

以下は `7.5 - 2 - 3` と同等で、`2.5` を返します:

```
subf 7.5 2 3
```

### divf

`divf` で整数除算を行います。

以下は `10 / 2 / 4` と同等で、`1.25` を返します:

```
divf 10 2 4
```

### mulf

`mulf` で乗算します。

以下は `6` を返します:

```
mulf 1.5 2 2
```

### maxf

一連の浮動小数点の最大値を返します:

以下は `3` を返します:

```
maxf 1 2.5 3
```

### minf

一連の浮動小数点の最小値を返します。

以下は `1.5` を返します:

```
minf 1.5 2 3
```

### floor

入力値以下の最大の浮動小数点値を返します。

`floor 123.9999` は `123.0` を返します。

### ceil

入力値以上の最小の浮動小数点値を返します。

`ceil 123.001` は `124.0` を返します。

### round

小数点以下の指定した桁数に余りを丸めた浮動小数点値を返します。

`round 123.555555 3` は `123.556` を返します。

## ネットワーク関数

Helm には1つのネットワーク関数 `getHostByName` があります。

`getHostByName` はドメイン名を受け取り、IP アドレスを返します。

`getHostByName "www.google.com"` は `www.google.com` に対応する IP アドレスを返します。

この関数を使用するには、helm コマンドラインで `--enable-dns` オプションを渡す必要があります。

## ファイルパス関数

Helm テンプレート関数はファイルシステムへのアクセスを許可しませんが、
ファイルパスの規則に従う文字列を扱う関数を提供しています。
[base](#base)、[clean](#clean)、[dir](#dir)、[ext](#ext)、[isAbs](#isabs) があります。

### base

パスの最後の要素を返します。

```
base "foo/bar/baz"
```

上記は "baz" を出力します。

### dir

最後の部分を除いたディレクトリを返します。つまり `dir
"foo/bar/baz"` は `foo/bar` を返します。

### clean

パスをクリーンアップします。

```
clean "foo/bar/../baz"
```

上記は `..` を解決し、`foo/baz` を返します。

### ext

ファイル拡張子を返します。

```
ext "foo.bar"
```

上記は `.bar` を返します。

### isAbs

ファイルパスが絶対パスかどうかを確認するには `isAbs` を使用します。

## リフレクション関数

Helm は初歩的なリフレクションツールを提供しています。
これらは上級テンプレート開発者が特定の値の基盤となる Go の型情報を
理解するのに役立ちます。Helm は Go で書かれており、厳密に型付けされています。
型システムはテンプレート内でも適用されます。

Go には `string`、`slice`、`int64`、`bool` などのいくつかのプリミティブ _kind_ があります。

Go にはオープンな _type_ システムがあり、開発者は独自の型を作成できます。

Helm は [kind 関数](#kind-functions) と [type 関数](#type-functions) を通じて
それぞれに対する関数セットを提供しています。2つの値を比較するための
[deepEqual](#deepequal) 関数も提供されています。

### Kind 関数

Kind 関数は2つあります: `kindOf` はオブジェクトの kind を返します。

```
kindOf "hello"
```

上記は `string` を返します。単純なテスト（`if` ブロックなど）では、
`kindIs` 関数で値が特定の kind かどうかを確認できます:

```
kindIs "int" 123
```

上記は `true` を返します。

### Type 関数

型は扱いが少し難しいため、3つの異なる関数があります:

- `typeOf` は値の基盤となる型を返します: `typeOf $foo`
- `typeIs` は `kindIs` のようなものですが、型用です: `typeIs "*io.Buffer" $myVal`
- `typeIsLike` は `typeIs` のように動作しますが、ポインタの参照解除も行います

**注意:** これらはいずれも、何かが特定のインターフェースを実装しているかどうかを
テストできません。そのためには、インターフェースを事前にコンパイルする必要があるためです。

### deepEqual

`deepEqual` は2つの値が["深く等しい"](https://golang.org/pkg/reflect/#DeepEqual)
場合に true を返します。

非プリミティブ型でも動作します（組み込みの `eq` と比較して）。

```
deepEqual (list 1 2 3) (list 1 2 3)
```

上記は `true` を返します。

## セマンティックバージョン関数

一部のバージョンスキームは簡単に解析・比較できます。Helm は [SemVer 2](http://semver.org)
バージョンを扱うための関数を提供しています。これには [semver](#semver) と
[semverCompare](#semvercompare) が含まれます。以下では、比較のための
範囲の使用方法についても詳しく説明します。

### semver

`semver` 関数は文字列をセマンティックバージョンに解析します:

```
$version := semver "1.2.3-alpha.1+123"
```

_パーサーが失敗した場合、テンプレートの実行はエラーで停止します。_

この時点で、`$version` は以下のプロパティを持つ `Version` オブジェクトへのポインタです:

- `$version.Major`: メジャー番号（上記では `1`）
- `$version.Minor`: マイナー番号（上記では `2`）
- `$version.Patch`: パッチ番号（上記では `3`）
- `$version.Prerelease`: プレリリース（上記では `alpha.1`）
- `$version.Metadata`: ビルドメタデータ（上記では `123`）
- `$version.Original`: 元のバージョン文字列

さらに、`Compare` 関数を使用して `Version` を別の `version` と比較できます:

```
semver "1.4.3" | (semver "1.2.3").Compare
```

上記は `-1` を返します。

戻り値は:

- `-1`: 指定した semver が `Compare` メソッドを呼び出した semver より大きい場合
- `1`: `Compare` 関数を呼び出したバージョンの方が大きい場合
- `0`: 同じバージョンの場合

（SemVer では、バージョン比較操作中に `Metadata` フィールドは比較されません。）

### semverCompare

より堅牢な比較関数として `semverCompare` が提供されています。
このバージョンはバージョン範囲をサポートします:

- `semverCompare "1.2.3" "1.2.3"` は完全一致をチェックします
- `semverCompare "~1.2.0" "1.2.3"` はメジャーとマイナーバージョンが一致し、
  第2パラメータのパッチ番号が第1パラメータ _以上_ であることをチェックします。

SemVer 関数は Sprig の作成者による [Masterminds semver
ライブラリ](https://github.com/Masterminds/semver) を使用しています。

### 基本的な比較

比較には2つの要素があります。まず、比較文字列はスペースまたはカンマで区切られた
AND 比較のリストです。これらは ||（OR）比較で区切られます。
例えば、`">= 1.2 < 3.0.0 || >= 4.2.3"` は、1.2 以上かつ 3.0.0 未満、
または 4.2.3 以上の比較を探しています。

基本的な比較は:

- `=`: 等しい（演算子なしと同義）
- `!=`: 等しくない
- `>`: より大きい
- `<`: より小さい
- `>=`: 以上
- `<=`: 以下

### プレリリースバージョンの扱い

プレリリースは、安定版または一般公開リリースの前のソフトウェアリリースに
使用されます。プレリリースの例には、開発版、アルファ版、ベータ版、
リリース候補版などがあります。プレリリースは `1.2.3-beta.1` のようなバージョンで、
安定版リリースは `1.2.3` です。優先順位では、プレリリースは関連するリリースの
前に来ます。この例では `1.2.3-beta.1 < 1.2.3` です。

セマンティックバージョン仕様によると、プレリリースは
そのリリース版と API 互換でない場合があります。以下のように述べられています:

> プレリリースバージョンは、バージョンが不安定であり、
> 関連する通常バージョンで示される意図された互換性要件を
> 満たさない可能性があることを示します。

プレリリース比較子なしの制約を使用した SemVer 比較は、
リリースのリストを見るときにプレリリースバージョンをスキップします。
例えば、`>=1.2.3` はプレリリースをスキップしますが、
`>=1.2.3-0` はプレリリースを評価して見つけます。

比較例でプレリリースバージョンとして `0` を使用する理由は、
プレリリースには仕様に従って ASCII 英数字とハイフン（および `.` 区切り）のみを
含めることができるためです。ソートは仕様に従って ASCII ソート順で行われます。
ASCII ソート順で最も低い文字は `0` です（[ASCII
テーブル](http://www.asciitable.com/)を参照）。

ASCII ソート順を理解することは重要です。なぜなら、A-Z は a-z の前に来るからです。
つまり、`>=1.2.3-BETA` は `1.2.3-alpha` を返します。
大文字小文字の区別から期待することはここでは適用されません。
これは仕様で指定されている ASCII ソート順によるものです。

### ハイフン範囲比較

範囲を扱う方法は複数あり、最初はハイフン範囲です。
以下のような形式になります:

- `1.2 - 1.4.5` は `>= 1.2 <= 1.4.5` と同等
- `2.3.4 - 4.5` は `>= 2.3.4 <= 4.5` と同等

### 比較でのワイルドカード

`x`、`X`、`*` 文字はワイルドカード文字として使用できます。
これはすべての比較演算子で動作します。`=` 演算子で使用すると、
パッチレベルの比較にフォールバックします（下記のチルダを参照）。例えば、

- `1.2.x` は `>= 1.2.0, < 1.3.0` と同等
- `>= 1.2.x` は `>= 1.2.0` と同等
- `<= 2.x` は `< 3` と同等
- `*` は `>= 0.0.0` と同等

### チルダ範囲比較（パッチ）

チルダ（`~`）比較演算子は、マイナーバージョンが指定されている場合は
パッチレベルの範囲、マイナー番号がない場合はメジャーレベルの変更用です。
例えば、

- `~1.2.3` は `>= 1.2.3, < 1.3.0` と同等
- `~1` は `>= 1, < 2` と同等
- `~2.3` は `>= 2.3, < 2.4` と同等
- `~1.2.x` は `>= 1.2.0, < 1.3.0` と同等
- `~1.x` は `>= 1, < 2` と同等

### キャレット範囲比較（メジャー）

キャレット（`^`）比較演算子は、安定版（1.0.0）リリース後の
メジャーレベルの変更用です。1.0.0 リリース前は、マイナーバージョンが
API 安定性レベルとして機能します。これは API バージョンの比較に便利です。
メジャーな変更は API を壊すためです。例えば、

- `^1.2.3` は `>= 1.2.3, < 2.0.0` と同等
- `^1.2.x` は `>= 1.2.0, < 2.0.0` と同等
- `^2.3` は `>= 2.3, < 3` と同等
- `^2.x` は `>= 2.0.0, < 3` と同等
- `^0.2.3` は `>=0.2.3 <0.3.0` と同等
- `^0.2` は `>=0.2.0 <0.3.0` と同等
- `^0.0.3` は `>=0.0.3 <0.0.4` と同等
- `^0.0` は `>=0.0.0 <0.1.0` と同等
- `^0` は `>=0.0.0 <1.0.0` と同等

## URL 関数

Helm には [urlParse](#urlparse)、[urlJoin](#urljoin)、
[urlquery](#urlquery) 関数が含まれており、URL の部分を扱えます。

### urlParse

文字列を URL として解析し、URL 部分を含む辞書を生成します。

```
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

上記は URL オブジェクトを含む辞書を返します:

```yaml
scheme:   'http'
host:     'server.com:8080'
path:     '/api'
query:    'list=false'
opaque:   nil
fragment: 'anchor'
userinfo: 'admin:secret'
```

これは Go 標準ライブラリの URL パッケージを使用して実装されています。
詳細は https://golang.org/pkg/net/url/#URL を参照してください。

### urlJoin

マップ（`urlParse` で生成）を結合して URL 文字列を生成します。

```
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

上記は以下の文字列を返します:
```
http://host:80/path?query#fragment
```

### urlquery

引数として渡された値のエスケープ版を返します。
URL のクエリ部分に埋め込むのに適しています。

```
$var := urlquery "string for query"
```

## UUID 関数

Helm は UUID v4 ユニバーサル一意識別子を生成できます。

```
uuidv4
```

上記は v4（ランダム生成）タイプの新しい UUID を返します。

## Kubernetes と Chart 関数

Helm には Kubernetes を扱うための関数が含まれています:
[.Capabilities.APIVersions.Has](#capabilitiesapiversionshas)、
[Files](#file-functions)、[lookup](#lookup)。

### lookup

`lookup` は実行中のクラスターでリソースを検索するために使用されます。
`helm template` コマンドで使用すると、常に空のレスポンスを返します。

詳細は [lookup 関数のドキュメント](/chart_template_guide/functions_and_pipelines.md#using-the-lookup-function)を
参照してください。

### .Capabilities.APIVersions.Has

API バージョンまたはリソースがクラスターで利用可能かどうかを返します。

```
.Capabilities.APIVersions.Has "apps/v1"
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

詳細は[組み込みオブジェクトのドキュメント](/chart_template_guide/builtin_objects.md)を
参照してください。

### File 関数

chart 内の特別でないファイルにアクセスできる関数がいくつかあります。
例えば、アプリケーション設定ファイルにアクセスする場合などです。
これらは[テンプレート内でのファイルへのアクセス](/chart_template_guide/accessing_files.md)で
ドキュメント化されています。

_注意: これらの関数の多くのドキュメントは
[Sprig](https://github.com/Masterminds/sprig) から来ています。
Sprig は Go アプリケーションで利用可能なテンプレート関数ライブラリです。_
