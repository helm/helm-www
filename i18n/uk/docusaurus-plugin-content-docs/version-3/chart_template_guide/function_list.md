---
title: Список функцій шаблонів
description: Список функцій шаблонів, доступних у Helm
sidebar_position: 6
---

Helm містить багато функцій шаблонів, якими ви можете скористатися у шаблонах. Вони перераховані тут і розбиті на наступні категорії:

* [Криптографія та безпека](#cryptographic-and-security-functions)
* [Дата](#date-functions)
* [Словники](#dictionaries-and-dict-functions)
* [Кодування](#encoding-functions)
* [Шлях до файлу](#file-path-functions)
* [Kubernetes та чарти](#kubernetes-and-chart-functions)
* [Логіка та керування потоком](#logic-and-flow-control-functions)
* [Списки](#lists-and-list-functions)
* [Математичні функції](#math-functions)
* [Математичні обчислення з комою](#float-math-functions)
* [Мережа](#network-functions)
* [Аналіз](#reflection-functions)
* [Регулярні вирази](#regular-expressions)
* [Семантичні версії](#semantic-version-functions)
* [Рядки](#string-functions)
* [Перетворення типів](#type-conversion-functions)
* [URL](#url-functions)
* [UUID](#uuid-functions)

## Логічні функції та функції керування потоком {#logic-and-flow-control-functions}

Helm містить численні логічні та контрольні функції, включаючи [and](#and), [coalesce](#coalesce), [default](#default), [empty](#empty), [eq](#eq), [fail](#fail), [ge](#ge), [gt](#gt), [le](#le), [lt](#lt), [ne](#ne), [not](#not), [or](#or), і [required](#required).

### and

Повертає логічне AND для двох або більше аргументів (перший пустий аргумент або останній аргумент).

```none
and .Arg1 .Arg2
```

### or

Повертає логічне OR для двох або більше аргументів (перший непустий аргумент або останній аргумент).

```none
or .Arg1 .Arg2
```

### not

Повертає логічне заперечення свого аргументу.

```none
not .Arg
```

### eq

Повертає логічну рівність аргументів (наприклад, Arg1 == Arg2).

```none
eq .Arg1 .Arg2
```

### ne

Повертає логічну нерівність аргументів (наприклад, Arg1 != Arg2)

```none
ne .Arg1 .Arg2
```

### lt

Повертає логічне `true`, якщо перший аргумент менший за другий. В іншому випадку повертає `false` (наприклад, Arg1 < Arg2).

```none
lt .Arg1 .Arg2
```

### le

Повертає логічне `true`, якщо перший аргумент менший або дорівнює другому. В іншому випадку повертає `false` (наприклад, Arg1 <= Arg2).

```none
le .Arg1 .Arg2
```

### gt

Повертає логічне `true`, якщо перший аргумент більший за другий. В іншому випадку повертає `false` (наприклад, Arg1 > Arg2).

```none
gt .Arg1 .Arg2
```

### ge

Повертає логічне `true`, якщо перший аргумент більший або дорівнює другому. В іншому випадку повертає `false` (наприклад, Arg1 >= Arg2).

```none
ge .Arg1 .Arg2
```

### default

Щоб встановити просте стандартне значення, використовуйте `default`:

```none
default "foo" .Bar
```

У наведеному прикладі, якщо `.Bar` має непусте значення, воно буде використане. Якщо ж воно пусте, повернеться `foo`.

Визначення "пустого" залежить від типу:

* Числові: 0
* Рядок: ""
* Списки: `[]`
* Словники: `{}`
* Логічний: `false`
* І завжди `nil` (або null)

Для структур немає визначення пустого значення, тому структура ніколи не поверне стандартного значення.

### required

Вкажіть значення, які повинні бути встановлені, за допомогою `required`:

```none
required "A valid foo is required!" .Bar
```

Якщо `.Bar` є пустим або не визначеним (див. [default](#default) щодо того, як це оцінюється), шаблон не буде згенерований і поверне надане повідомлення про помилку.

### empty

Функція `empty` повертає `true`, якщо надане значення вважається пустим, і `false` в іншому випадку. Пусті значення перелічені в розділі `default`.

```none
empty .Foo
```

Зверніть увагу, що в умовах шаблонів Go пустота розраховується автоматично. Таким чином, рідко потрібно використовувати `if not empty .Foo`. Замість цього просто використовуйте `if .Foo`.

### fail

Безумовно повертає пустий `string` та `error` з зазначеним текстом. Це корисно в ситуаціях, коли інші умови визначили, що рендеринг шаблону повинен зазнати невдачі.

```none
fail "Please accept the end user license agreement"
```

### coalesce

Функція `coalesce` приймає список значень і повертає перше непусте.

```none
coalesce 0 1 2
```

У наведеному випадку повертає `1`.

Ця функція корисна для перевірки кількох змінних або значень:

```none
coalesce .name .parent.name "Matt"
```

Цей приклад спочатку перевірить, чи є `.name` непустим. Якщо це так, буде повернене це значення. Якщо ж воно _пусте_, `coalesce` перевірить `.parent.name` на пустоту. Нарешті, якщо обидва `.name` і `.parent.name` пусті, буде повернене `Matt`.

### ternary

Функція `ternary` приймає два значення і тестове значення. Якщо тестове значення є `true`, повернеться перше значення. Якщо тестове значення є пустим, повернеться друге значення. Це подібно до тернарного оператора в C та інших мовах програмування.

#### тестове значення true {#true-test-value}

```none
ternary "foo" "bar" true
```

або

```none
true | ternary "foo" "bar"
```

У цьому випадку повертається `"foo"`.

#### тестове значення false {#false-test-value}

```none
ternary "foo" "bar" false
```

або

```none
false | ternary "foo" "bar"
```

У цьому випадку повертається `"bar"`.

## Функції для роботи з рядками {#string-functions}

Helm включає такі функції для рядків: [abbrev](#abbrev), [abbrevboth](#abbrevboth), [camelcase](#camelcase), [cat](#cat), [contains](#contains), [hasPrefix](#hasprefix-and-hassuffix), [hasSuffix](#hasprefix-and-hassuffix), [indent](#indent), [initials](#initials), [kebabcase](#kebabcase), [lower](#lower), [nindent](#nindent), [nospace](#nospace), [plural](#plural), [print](#print), [printf](#printf), [println](#println), [quote](#quote-and-squote), [randAlpha](#randalphanum-randalpha-randnumeric-and-randascii), [randAlphaNum](#randalphanum-randalpha-randnumeric-and-randascii), [randAscii](#randalphanum-randalpha-randnumeric-and-randascii), [randNumeric](#randalphanum-randalpha-randnumeric-and-randascii), [repeat](#repeat), [replace](#replace), [shuffle](#shuffle), [snakecase](#snakecase), [squote](#quote-and-squote), [substr](#substr), [swapcase](#swapcase), [title](#title), [trim](#trim), [trimAll](#trimall), [trimPrefix](#trimprefix), [trimSuffix](#trimsuffix), [trunc](#trunc), [untitle](#untitle), [upper](#upper), [wrap](#wrap), і [wrapWith](#wrapwith).

### print

Повертає рядок, що є комбінацією його частин.

```none
print "Matt has " .Dogs " dogs"
```

Типи, які не є рядками, перетворюються на рядки, якщо це можливо.

Зверніть увагу, що коли два аргументи поруч один з одним не є рядками, між ними додається пробіл.

### println

Працює так само як [print](#print), але додає новий рядок наприкінці.

### printf

Повертає рядок на основі відформатованого рядка та аргументів, що передаються у до нього.

```none
printf "%s has %d dogs." .Name .NumberDogs
```

Заповнювач, який слід використовувати, залежить від типу переданого аргументу. Серед них:

Загального призначення:

* `%v` значення в стандартному форматі
  * при друку словників, прапорець `+` (%+v) додає імена полів
* `%%` літеральний знак відсотка; не використовує значення

Логічний:

* `%t` слово true або false

Цілі числа:

* `%b` двійкові, основа 2
* `%c` символ, що відповідає точці Unicode
* `%d` десяткові, основа 10
* `%o` вісімкові, основа 8
* `%O` основа 8 з префіксом 0o
* `%q` вісімкові, однорядковий літерал символу, безпечно екранований
* `%x` шістнадцяткові, основа 16, з малими літерами для a-f
* `%X` шістнадцяткові, основа 16, з великими літерами для A-F
* `%U` Unicode формат: U+1234; те ж саме, що "U+%04X"

Числа з плаваючою комою та складові частини:

* `%b` десятковий формат без наукової нотації з показником ступеня двійки, наприклад
  -123456p-78
* `%e` наукова нотація, наприклад -1.234456e+78
* `%E` наукова нотація, наприклад -1.234456E+78
* `%f` десятковий формат без експоненти, наприклад 123.456
* `%F` синонім для %f
* `%g` %e для великих експонент, %f в іншому випадку
* `%G` %E для великих експонент, %F в іншому випадку
* `%x` шістнадцяткова нотація (з десятковим показником ступеня), наприклад -0x1.23abcp+20
* `%X` шістнадцяткова нотація у верхньому регістрі, наприклад -0X1.23ABCP+20

Рядок та зріз байтів (обробляються однаково з цими діями):

* `%s` необроблені байти рядка або зрізу
* `%q` рядок в подвійних лапках, безпечно екранований
* `%x` основа 16, малий регістр, два символи на байт
* `%X` основа 16, великий регістр, два символи на байт

Зріз:

* `%p` адреса 0-го елемента у шістнадцятковій нотації, з передуючим 0x

### trim

Функція `trim` видаляє пробіли з обох сторін рядка:

```none
trim "   hello    "
```

У результаті отримаємо `hello`.

### trimAll

Видаляє зазначені символи з початку та кінця рядка:

```none
trimAll "$" "$5.00"
```

У результаті отримаємо `5.00` (як рядок).

### trimPrefix

Видаляє лише префікс з рядка:

```none
trimPrefix "-" "-hello"
```

У результаті отримаємо `hello`.

### trimSuffix

Видаляє лише суфікс з рядка:

```none
trimSuffix "-" "hello-"
```

У результаті отримаємо `hello`.

### lower

Перетворює весь рядок у нижній регістр:

```none
lower "HELLO"
```

У результаті отримаємо `hello`.

### upper

Перетворює весь рядок у верхній регістр:

```none
upper "hello"
```

У результаті отримаємо `HELLO`.

### title

Перетворює рядок у титульний регістр:

```none
title "hello world"
```

У результаті отримаємо `Hello World`.

### untitle

Видаляє титульне оформлення. `untitle "Hello World"` поверне `hello world`.

### repeat

Повторює рядок кілька разів:

```none
repeat 3 "hello"
```

У результаті отримаємо `hellohellohello`.

### substr

Отримує підрядок з рядка. Параметри:

* start (int)
* end (int)
* рядок (string)

```none
substr 0 5 "hello world"
```

У результаті отримаємо `hello`.

### nospace

Видаляє всі пробіли з рядка:

```none
nospace "hello w o r l d"
```

У результаті отримаємо `helloworld`.

### trunc

Обрізає рядок:

```none
trunc 5 "hello world"
```

У результаті отримаємо `hello`.

```none
trunc -5 "hello world"
```

У результаті отримаємо `world`.

### abbrev

Обрізає рядок додаючи три крапки (`...`):

Параметри:

* максимальна довжина
* рядок

```none
abbrev 5 "hello world"
```

У результаті отримаємо `he...`, оскільки ширина трьох крапок враховується до максимальної довжини.

### abbrevboth

Обрізає обидві сторони:

```none
abbrevboth 5 10 "1234 5678 9123"
```

У результаті отримаємо `...5678...`.

Параметри:

* зсув ліворуч
* максимальна довжина
* рядок

### initials

Для кількох слів бере першу літеру кожного слова та обʼєднує їх:

```none
initials "First Try"
```

У результаті отримаємо `FT`.

### randAlphaNum, randAlpha, randNumeric та randAscii {#randalphanum-randalpha-randnumeric-and-randascii}

Ці чотири функції генерують криптографічно безпечні (використовує ```crypto/rand```) випадкові рядки, але з різними базовими наборами символів:

* `randAlphaNum` використовує `0-9a-zA-Z`
* `randAlpha` використовує `a-zA-Z`
* `randNumeric` використовує `0-9`
* `randAscii` використовує всі друковані ASCII символи

Кожна з них приймає один параметр: цілу довжину рядка.

```none
randNumeric 3
```

У результаті отримаємо випадковий рядок з трьох цифр.

### wrap

Виконує перенесення тексту на вказаній кількості стовпців:

```none
wrap 80 $someText
```

У результаті для рядка `$someText` буде виконано перенесення на 80-му стовпці.

### wrapWith

`wrapWith` працює так само як і `wrap`, але дозволяє вказати рядок для перенесення.
(`wrap` використовує `\n`)

```none
wrapWith 5 "\t" "Hello World"
```

У результаті отримаємо `Hello World` (де пробіл є символом ASCII табуляції).

### contains

Перевіряє, чи один рядок міститься всередині іншого:

```none
contains "cat" "catch"
```

У результаті отримаємо `true`, оскільки `catch` містить `cat`.

### hasPrefix і hasSuffix {#hasprefix-and-hassuffix}

Функції `hasPrefix` і `hasSuffix` перевіряють, чи має рядок заданий префікс або суфікс:

```none
hasPrefix "cat" "catch"
```

У результаті отримаємо `true`, оскільки `catch` має префікс `cat`.

### quote і squote {#quote-and-squote}

Ці функції обгортають рядок у подвійні лапки (`quote`) або одинарні лапки (`squote`).

### cat

Функція `cat` обʼєднує кілька рядків в один, розділяючи їх пробілами:

```none
cat "hello" "beautiful" "world"
```

У результаті отримаємо `hello beautiful world`.

### indent

Функція `indent` додає відступ у кожному рядку вказаного тексту на зазначену кількість символів. Це корисно для вирівнювання багаторядкових текстів:

```none
indent 4 $lots_of_text
```

У результаті кожен рядок тексту буде мати відступ на 4 символи пробілу.

### nindent

Функція `nindent` є такою ж, як і `indent`, але додає новий рядок на початку рядка.

```none
nindent 4 $lots_of_text
```

У результаті кожен рядок тексту буде мати відступ на 4 символи пробілу, а також буде додано новий рядок на початку.

### replace

Виконує просту заміну рядків.

Вона приймає три аргументи:

* рядок для заміни
* рядок, на який замінювати
* вихідний рядок

```none
"I Am Henry VIII" | replace " " "-"
```

У результаті отримаємо `I-Am-Henry-VIII`.

### plural

Форма множини.

```none
len $fish | plural "one anchovy" "many anchovies"
```

У наведеному випадку, якщо довжина рядка дорівнює 1, буде надруковано перший аргумент (`one anchovy`). В іншому випадку буде надруковано другий аргумент (`many anchovies`).

Аргументи:

* однина
* множина
* довжина (ціле число)

ПРИМІТКА: Helm наразі не підтримує мови зі складнішими правилами множини. І `0` вважається множиною, оскільки англійська мова ставиться до нього саме так (`zero anchovies`).

### snakecase

Перетворює рядок з camelCase в snake_case.

```none
snakecase "FirstName"
```

У результаті отримаємо `first_name`.

### camelcase

Перетворює рядок з snake_case в CamelCase.

```none
camelcase "http_server"
```

У результаті отримаємо `HttpServer`.

### kebabcase

Перетворює рядок з camelCase в kebab-case.

```none
kebabcase "FirstName"
```

У результаті отримаємо `first-name`.

### swapcase

Змінює регістр рядка за допомогою алгоритму на основі слів.

Алгоритм перетворення:

* Символи у верхньому регістрі перетворюються у нижній регістр
* Символи в титульному регістрі перетворюються у нижній регістр
* Символи у нижньому регістрі після пробілу або на початку перетворюються у титульний регістр
* Інші символи у нижньому регістрі перетворюються у верхній регістр
* Пробіли визначаються як unicode.IsSpace(char)

```none
swapcase "This Is A.Test"
```

У результаті отримаємо `tHIS iS a.tEST`.

### shuffle

Перемішує рядок.

```none
shuffle "hello"
```

У результаті отримаємо випадковий порядок літер у `hello`, можливо, `oelhl`.

## Функції перетворення типів {#type-conversion-functions}

Helm пропонує такі функції для перетворення типів:

* `atoi`: Перетворює рядок на ціле число.
* `float64`: Перетворює на `float64`.
* `int`: Перетворює на `int` відповідно до ширини системи.
* `int64`: Перетворює на `int64`.
* `toDecimal`: Перетворює unix octal на `int64`.
* `toString`: Перетворює на рядок.
* `toStrings`: Перетворює список, зріз або масив на список рядків.
* `toJson` (`mustToJson`): Перетворює список, зріз, масив, словник або обʼєкт на JSON.
* `toPrettyJson` (`mustToPrettyJson`): Перетворює список, зріз, масив, словник або обʼєкт на форматований JSON.
* `toRawJson` (`mustToRawJson`): Перетворює список, зріз, масив, словник або обʼєкт на JSON з неекранованими HTML символами.
* `fromYaml`: Перетворює YAML рядок на обʼєкт.
* `fromJson`: Перетворює JSON рядок на обʼєкт.
* `fromJsonArray`: Перетворює JSON масив на список.
* `toYaml`: Перетворює список, зріз, масив, словник або обʼєкт на відформатований YAML.
* `toToml`: Перетворює список, зріз, масив, словник або обʼєкт на TOML.
* `fromYamlArray`: Перетворює YAML масив на список.

### toStrings

Перетворює колекцію схожу на список на зріз рядків.

```none
list 1 2 3 | toStrings
```

Перетворює `1` на `"1"`, `2` на `"2"` і так далі, а потім повертає їх як список.

### toDecimal

Перетворює unix octal на десятковий формат.

```none
"0777" | toDecimal
```

Перетворює `0777` на `511` і повертає значення як int64.

### toJson, mustToJson

Функція `toJson` кодує елемент у JSON рядок. Якщо елемент не може бути перетворений на JSON, функція поверне порожній рядок. `mustToJson` поверне помилку, якщо елемент не може бути закодований в JSON.

```none
toJson .Item
```

Поверне JSON рядкове представлення `.Item`.

### toPrettyJson, mustToPrettyJson

Функція `toPrettyJson` кодує елемент у форматований (з відступами) JSON рядок.

```none
toPrettyJson .Item
```

Поверне відформатоване JSON рядкове представлення `.Item`.

### toRawJson, mustToRawJson

Функція `toRawJson` кодує елемент у JSON рядок з неекранованими HTML символами.

```none
toRawJson .Item
```

Поверне неекрановане JSON рядкове представлення `.Item`.

### fromYaml

Функція `fromYaml` приймає YAML рядок і повертає обʼєкт, який можна використовувати в шаблонах.

Файл `yamls/person.yaml`:

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

Функція `fromJson` приймає JSON рядок і повертає обʼєкт, який можна використовувати в шаблонах.

Файл `jsons/person.json`:

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

Функція `fromJsonArray` приймає JSON масив і повертає список, який можна використовувати в шаблонах.

Файл `jsons/people.json`:

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

Функція `fromYamlArray` приймає YAML масив і повертає список, який можна використовувати в шаблонах.

Файл `yamls/people.yml`:

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

## Регулярні Вирази {#regular-expressions}

Helm включає такі функції для роботи з регулярними виразами: [regexMatch](#regexmatch-mustregexmatch), [regexFindAll](#regexfindall-mustregexfindall), [regexFind](#regexfind-mustregexfind), [regexReplaceAll](#regexreplaceall-mustregexreplaceall), [regexReplaceAllLiteral](#regexreplaceallliteral-mustregexreplaceallliteral), [regexSplit](#regexsplit-mustregexsplit).

### regexMatch, mustRegexMatch

Повертає `true`, якщо вхідний рядок містить хоча б один збіг для регулярного виразу.

```yaml
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"
```

Поверне `true`.

`regexMatch` викликає паніку у разі проблеми, а `mustRegexMatch` поверне помилку у рушії шаблонів у разі проблеми.

### regexFindAll, mustRegexFindAll

Повертає зріз усіх збігів регулярного виразу у вхідному рядку. Останній параметр `n` визначає кількість підрядків для повернення, де `-1` означає повернути всі збіги.

```yaml
regexFindAll "[2,4,6,8]" "123456789" -1
```

Поверне `[2 4 6 8]`.

`regexFindAll` викликає паніку у разі проблеми, а `mustRegexFindAll` поверне помилку у рушії шаблонів у разі проблеми.

### regexFind, mustRegexFind

Повертає перший (зліва) збіг регулярного виразу у вхідному рядку.

```yaml
regexFind "[a-zA-Z][1-9]" "abcd1234"
```

Поверне `d1`.

`regexFind` викликає паніку у разі проблеми, а `mustRegexFind` поверне помилку у рушії шаблонів у разі проблеми.

### regexReplaceAll, mustRegexReplaceAll

Повертає копію вхідного рядка, замінюючи збіг регулярного виразу на рядок заміни `replacement`. У рядку заміни знаки `$` інтерпретуються як в Expand, тому, наприклад, `$1` представляє текст першого збігу.

```yaml
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

Поверне `-W-xxW-`.

`regexReplaceAll` викликає паніку у разі проблеми, а `mustRegexReplaceAll` поверне помилку у рушії шаблонів у разі проблеми.

### regexReplaceAllLiteral, mustRegexReplaceAllLiteral

Повертає копію вхідного рядка, замінюючи збіг регулярного виразу на рядок заміни `replacement`. Рядок заміни підставляється без використання Expand.

```yaml
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"
```

Поверне `-${1}-${1}-`.

`regexReplaceAllLiteral` викликає паніку у разі проблеми, а `mustRegexReplaceAllLiteral` поверне помилку у рушії шаблонів у разі проблеми.

### regexSplit, mustRegexSplit

Розбиває вхідний рядок на підрядки, розділені виразом, і повертає зріз підрядків між збігами цього виразу. Останній параметр `n` визначає кількість підрядків для повернення, де `-1` означає повернути всі збіги.

```yaml
regexSplit "z+" "pizza" -1
```

Поверне `[pi a]`.

`regexSplit` викликає паніку у разі проблеми, а `mustRegexSplit` поверне помилку у рушії шаблонів у разі проблеми.

## Функції криптографії та безпеки {#cryptographic-and-security-functions}

Helm надає декілька розширених криптографічних функцій, серед яких: [adler32sum](#adler32sum), [buildCustomCert](#buildcustomcert), [decryptAES](#decryptaes), [derivePassword](#derivepassword), [encryptAES](#encryptaes), [genCA](#genca), [genPrivateKey](#genprivatekey), [genSelfSignedCert](#genselfsignedcert), [genSignedCert](#gensignedcert), [htpasswd](#htpasswd), [sha1sum](#sha1sum), та [sha256sum](#sha256sum).

### sha1sum

Функція `sha1sum` отримує рядок і обчислює його SHA1-дайджест.

```yaml
sha1sum "Hello world!"
```

### sha256sum

Функція `sha256sum` отримує рядок і обчислює його SHA256-дайджест.

```yaml
sha256sum "Hello world!"
```

Це обчислює SHA 256 контрольну суму у форматі "ASCII armored", який є безпечним для друку.

### adler32sum

Функція `adler32sum` отримує рядок і обчислює його контрольну суму Adler-32.

```yaml
adler32sum "Hello world!"
```

### htpasswd

Функція `htpasswd` приймає `username` і `password` та генерує `bcrypt` хеш паролю. Результат може бути використаний для базової автентифікації на [Apache HTTP Server](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html#basic).

```yaml
htpasswd "myUser" "myPassword"
```

Зверніть увагу, що небезпечно зберігати пароль безпосередньо в шаблоні.

### derivePassword

Функція `derivePassword` може бути використана для виведення певного пароля на основі деяких спільних "основних" обмежень пароля. Алгоритм для цього добре [описаний](https://web.archive.org/web/20211019121301/https://masterpassword.app/masterpassword-algorithm.pdf).

```yaml
derivePassword 1 "long" "password" "user" "example.com"
```

Зверніть увагу, що небезпечно зберігати частини безпосередньо в шаблоні.

### genPrivateKey

Функція `genPrivateKey` генерує новий приватний ключ, закодований у PEM-блок.

Вона приймає одне з наступних значень для свого першого параметра:

* `ecdsa`: Генерує ключ еліптичної кривої DSA (P256)
* `dsa`: Генерує DSA ключ (L2048N256)
* `rsa`: Генерує RSA 4096 ключ

### buildCustomCert

Функція `buildCustomCert` дозволяє налаштувати сертифікат.

Вона приймає наступні строкові параметри:

* Сертифікат у форматі PEM, закодований у base64
* Приватний ключ у форматі PEM, закодований у base64

Функція повертає обʼєкт сертифіката з наступними атрибутами:

* `Cert`: Сертифікат у форматі PEM
* `Key`: Приватний ключ у форматі PEM

Приклад:

```yaml
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
```

Зверніть увагу, що повернутий обʼєкт може бути переданий до функції `genSignedCert` для підписання сертифіката за допомогою цього CA.

### genCA

Функція `genCA` генерує новий самопідписний сертифікат x509 для центру сертифікацї.

Вона приймає наступні параметри:

* Загальне імʼя субʼєкта (cn)
* Термін дії сертифіката у днях

Функція повертає обʼєкт з наступними атрибутами:

* `Cert`: Сертифікат у форматі PEM
* `Key`: Приватний ключ у форматі PEM

Приклад:

```yaml
$ca := genCA "foo-ca" 365
```

Зверніть увагу, що повернутий обʼєкт може бути переданий до функції `genSignedCert` для підписання сертифіката за допомогою цього CA.

### genSelfSignedCert

Функція `genSelfSignedCert` генерує новий самопідписаний сертифікат x509.

Вона приймає наступні параметри:

* Загальне імʼя субʼєкта (cn)
* Необовʼязковий список IP-адрес; може бути nil
* Необовʼязковий список альтернативних DNS-імен; може бути nil
* Термін дії сертифіката у днях

Функція повертає обʼєкт з наступними атрибутами:

* `Cert`: Сертифікат у форматі PEM
* `Key`: Приватний ключ у форматі PEM

Приклад:

```yaml
$cert := genSelfSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365
```

### genSignedCert

Функція `genSignedCert` генерує новий сертифікат x509, підписаний зазначеним CA.

Вона приймає наступні параметри:

* Спільне імʼя субʼєкта (cn)
* Необовʼязковий список IP-адрес; може бути nil
* Необовʼязковий список альтернативних DNS-імен; може бути nil
* Термін дії сертифіката у днях
* CA (див. `genCA`)

Приклад:

```yaml
$ca := genCA "foo-ca" 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

### encryptAES

Функція `encryptAES` шифрує текст за допомогою AES-256 CBC і повертає рядок, закодований у base64.

```yaml
encryptAES "secretkey" "plaintext"
```

### decryptAES

Функція `decryptAES` отримує рядок у форматі base64, закодований за допомогою алгоритму AES-256 CBC, і повертає розкодований текст.

```yaml
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

## Функції дати {#date-functions}

Helm включає наступні функції дати, які ви можете використовувати в шаблонах: [ago](#ago), [date](#date), [dateInZone](#dateinzone), [dateModify (mustDateModify)](#datemodify-mustdatemodify), [duration](#duration), [durationRound](#durationround), [htmlDate](#htmldate), [htmlDateInZone](#htmldateinzone), [now](#now), [toDate (mustToDate)](#todate-musttodate) та [unixEpoch](#unixepoch).

### now

Поточна дата/час. Використовуйте це разом з іншими функціями дати.

### ago

Функція `ago` повертає тривалість від часу. Зараз у секундах.

```none
ago .CreatedAt
```

повертає у форматі `time.Duration` String()

```none
2h34m7s
```

### date

Функція `date` форматує дату.

Формат дати до РІК-МІСЯЦЬ-ДЕНЬ:

```none
now | date "2006-01-02"
```

Форматування дати в Go [дещо відрізняється](https://pauladamsmith.com/blog/2011/05/go_time.html).

Коротко, візьміть цю базову дату:

```none
Mon Jan 2 15:04:05 MST 2006
```

Запишіть її у потрібному форматі. Вище, `2006-01-02` — це та ж дата, але в потрібному форматі.

### dateInZone

Те ж саме, що і `date`, але з часовою зоною.

```none
dateInZone "2006-01-02" (now) "UTC"
```

### duration

Форматує задану кількість секунд як `time.Duration`.

Це повертає 1m35s

```none
duration "95"
```

### durationRound

Округлює задану тривалість до найзначнішої одиниці. Рядки та `time.Duration` аналізуються як тривалість, тоді як `time.Time` обчислюється як тривалість з моменту.

Це повертає 2h

```none
durationRound "2h10m5s"
```

Це повертає 3mo

```none
durationRound "2400h10m5s"
```

### unixEpoch

Повертає кількість секунд з unix-епохи для `time.Time`.

```none
now | unixEpoch
```

### dateModify, mustDateModify

Функція `dateModify` приймає модифікацію та дату і повертає часову мітку.

Відніміть годину і тридцять хвилин від поточного часу:

```none
now | dateModify "-1.5h"
```

Якщо формат модифікації неправильний, `dateModify` поверне дату немодифікованою. `mustDateModify` поверне помилку в іншому випадку.

### htmlDate

Функція `htmlDate` форматує дату для вставки в поле введення дати в HTML.

```none
now | htmlDate
```

### htmlDateInZone

Те ж саме, що і htmlDate, але з часовою зоною.

```none
htmlDateInZone (now) "UTC"
```

### toDate, mustToDate

Функція `toDate` перетворює рядок у дату. Перший аргумент — це макет дати, а другий — рядок дати. Якщо рядок не можна перетворити, він поверне нульове значення. `mustToDate` поверне помилку в разі, якщо рядок не можна перетворити.

Це корисно, коли ви хочете перетворити дату-рядок в інший формат (використовуючи конвеєр). Нижче наведений приклад перетворює "2017-12-31" на "31/12/2017".

```none
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

## Словники та функції словників {#dictionaries-and-dict-functions}

Helm надає тип зберігання ключ/значення, який називається `dict` (скорочено від "dictionary" ["словник"], як у Python). `dict` є _невпорядкованим_ типом.

Ключ у словнику **має бути рядком**. Однак значення може бути будь-якого типу, навіть іншим `dict` або `list`.

На відміну від `list`, `dict` не є незмінним. Функції `set` та `unset` змінюють вміст словника.

Helm надає такі функції для роботи зі словниками: [deepCopy (mustDeepCopy)](#deepcopy-mustdeepcopy), [dict](#dict), [dig](#dig), [get](#get), [hasKey](#haskey), [keys](#keys), [merge (mustMerge)](#merge-mustmerge), [mergeOverwrite (mustMergeOverwrite)](#mergeoverwrite-mustmergeoverwrite), [omit](#omit), [pick](#pick), [pluck](#pluck), [set](#set), [unset](#unset) та [values](#values).

### dict

Створення словників здійснюється шляхом виклику функції `dict` і передачі їй списку пар.

Наступний приклад створює словник з трьома елементами:

```none
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
```

### get

За наявності map і ключа отримає значення з map.

```none
get $myDict "name1"
```

Наведений вище приклад поверне `"value1"`.

Зверніть увагу, що якщо ключ не знайдено, ця операція просто поверне `""`. Помилка не буде згенерована.

### set

Використовуйте `set`, щоб додати нову пару ключ/значення до словника.

```none
$_ := set $myDict "name4" "value4"
```

Зверніть увагу, що `set` _повертає словник_ (вимога функцій шаблону Go), тому вам може знадобитися захопити значення, як це зроблено вище за допомогою присвоєння `$_`.

### unset

За наявності map і ключа видалить ключ з map.

```none
$_ := unset $myDict "name4"
```

Як і у випадку з `set`, це повертає словник.

Зверніть увагу, що якщо ключ не знайдено, ця операція просто повернеться. Помилка не буде згенерована.

### hasKey

Функція `hasKey` повертає `true`, якщо даний словник містить даний ключ.

```none
hasKey $myDict "name1"
```

Якщо ключ не знайдено, це повертає `false`.

### pluck

Функція `pluck` дозволяє вказати один ключ і кілька map, і отримати список усіх знайдених збігів:

```none
pluck "name1" $myDict $myOtherDict
```

Наведений вище приклад поверне `list`, що містить усі знайдені значення (`[value1 otherValue1]`).

Якщо даний ключ _не знайдено_ в map, цей map не буде мати елемента у списку (і довжина повернутого списку буде меншою, ніж кількість словників у виклику `pluck`).

Якщо ключ _знайдено_, але значення є порожнім, це значення буде вставлено.

Поширеною ідіомою у шаблонах Helm є використання `pluck... | first`, щоб отримати перший відповідний ключ із колекції словників.

### dig

Функція `dig` проходить через вкладені набори словників, вибираючи ключі зі списку значень. Вона повертає стандартне значення, якщо будь-який з ключів не знайдено в асоційованому словнику.

```none
dig "user" "role" "humanName" "guest" $dict
```

За наявності словника, структурованого таким чином:

```none
{
  user: {
    role: {
      humanName: "curator"
    }
  }
}
```

наведений вище приклад поверне `"curator"`. Якщо у словнику навіть не було поля `user`, результатом буде `"guest"`.

`dig` може бути дуже корисним у випадках, коли ви хочете уникнути охоронних конструкцій, особливо тому, що `and` у пакеті шаблонів Go не є скороченим. Наприклад, `and a.maybeNil a.maybeNil.iNeedThis` завжди буде оцінювати `a.maybeNil.iNeedThis` і викличе паніку, якщо у `a` відсутнє поле `maybeNil`.

`dig` приймає свій аргумент словника останнім, щоб підтримувати конвеєрну обробку. Наприклад:

```none
merge a b c | dig "one" "two" "three" "<missing>"
```

### merge, mustMerge

Обʼєднує два або більше словників в один, надаючи перевагу словнику призначення:

Наприклад:

```yaml
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

результатом буде:

```yaml
newdict:
  default: default
  overwrite: me
  key: true
```

```none
$newdict := merge $dest $source1 $source2
```

Це операція глибокого обʼєднання, але не глибокого копіювання. Вкладені обʼєкти, що обʼєднуються, є однією і тією ж сутністю в обох словниках. Якщо ви хочете глибоке копіювання разом з обʼєднанням, то використовуйте функцію `deepCopy` разом з обʼєднанням. Наприклад,

```none
deepCopy $source | merge $dest
```

`mustMerge` поверне помилку в разі невдалого обʼєднання.

### mergeOverwrite, mustMergeOverwrite {#mergeoverwrite-mustmergeoverwrite}

Обʼєднує два або більше словників в один, надаючи перевагу з **права наліво**, ефективно перезаписуючи значення в словнику призначення:

Наприклад:

```yaml
dest:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

результатом буде:

```yaml
newdict:
  default: default
  overwrite: overwritten
  key: false
```

```none
$newdict := mergeOverwrite $dest $source1 $source2
```

Це операція глибокого обʼєднання, але не глибокого копіювання. Вкладені обʼєкти, що обʼєднуються, є однією і тією ж сутністю в обох словниках. Якщо ви хочете глибоке копіювання разом з обʼєднанням, то використовуйте функцію `deepCopy` разом з обʼєднанням. Наприклад,

```none
deepCopy $source | mergeOverwrite $dest
```

`mustMergeOverwrite` поверне помилку в разі невдалого обʼєднання.

### keys

Функція `keys` повертає `list` усіх ключів одного або декількох типів `dict`. Оскільки словник є _невпорядкованим_, ключі не будуть у передбачуваному порядку. Їх можна відсортувати за допомогою `sortAlpha`.

```none
keys $myDict | sortAlpha
```

При поданні кількох словників ключі будуть обʼєднані. Використовуйте функцію `uniq` разом із `sortAlpha`, щоб отримати унікальний, відсортований список ключів.

```none
keys $myDict $myOtherDict | uniq | sortAlpha
```

### pick

Функція `pick` вибирає тільки зазначені ключі зі словника, створюючи новий `dict`.

```none
$new := pick $myDict "name1" "name2"
```

Наведений вище приклад поверне `{name1: value1, name2: value2}`.

### omit

Функція `omit` схожа на `pick`, за винятком того, що вона повертає новий `dict` з усіма ключами, які _не_ збігаються з даними ключами.

```none
$new := omit $myDict "name1" "name3"
```

Наведений вище приклад поверне `{name2: value2}`.

### values

Функція `values` схожа на `keys`, за винятком того, що вона повертає новий `list` з усіма значеннями вихідного `dict` (підтримується тільки один словник).

```none
$vals := values $myDict
```

Наведений вище приклад поверне `list["value1", "value2", "value 3"]`. Зверніть увагу, що функція `values` не дає жодних гарантій щодо порядку результатів; якщо це важливо, використовуйте `sortAlpha`.

### deepCopy, mustDeepCopy

Функції `deepCopy` і `mustDeepCopy` приймають значення і роблять глибоку копію цього значення. Це включає словники та інші структури. `deepCopy` викликає паніку, коли виникає проблема, тоді як `mustDeepCopy` повертає помилку системі шаблонів, коли виникає помилка.

```none
dict "a" 1 "b" 2 | deepCopy
```

### Примітка про внутрішню структуру Dict {#a-note-on-dict-internals}

`dict` реалізовано в Go як `map[string]interface{}`. Розробники Go можуть передавати значення `map[string]interface{}` у контекст, щоб зробити їх доступними для шаблонів як `dict`.

## Функції кодування {#encoding-functions}

Helm має такі функції для кодування та декодування:

* `b64enc`/`b64dec`: Кодування або декодування з використанням Base64
* `b32enc`/`b32dec`: Кодування або декодування з використанням Base32

## Списки та функції для роботи зі списками {#lists-and-list-functions}

Helm надає простий тип `list`, який може містити довільні послідовні дані. Це схоже на масиви або зрізи, але списки призначені для використання як незмінні типи даних.

Створення списку цілих чисел:

```none
$myList := list 1 2 3 4 5
```

Це створить список `[1 2 3 4 5]`.

Helm надає наступні функції для роботи зі списками: [append (mustAppend)](#append-mustappend), [compact (mustCompact)](#compact-mustcompact), [concat](#concat), [first (mustFirst)](#first-mustfirst), [has (mustHas)](#has-musthas), [initial (mustInitial)](#initial-mustinitial), [last (mustLast)](#last-mustlast), [prepend (mustPrepend)](#prepend-mustprepend), [rest (mustRest)](#rest-mustrest), [reverse (mustReverse)](#reverse-mustreverse), [seq](#seq), [index](#index), [slice (mustSlice)](#slice-mustslice), [uniq (mustUniq)](#uniq-mustuniq), [until](#until), [untilStep](#untilstep) та [without (mustWithout)](#without-mustwithout).

### first, mustFirst

Щоб отримати перший елемент списку, використовуйте `first`.

`first $myList` повертає `1`.

`first` викликає panic у разі проблеми, тоді як `mustFirst` повертає помилку в рушій шаблонів, якщо виникає проблема.

### rest, mustRest

Щоб отримати залишок списку (все, окрім першого елемента), використовуйте `rest`.

`rest $myList` повертає `[2 3 4 5]`.

`rest` викликає panic у разі проблеми, тоді як `mustRest` повертає помилку в рушій шаблонів, якщо виникає проблема.

### last, mustLast

Щоб отримати останній елемент списку, використовуйте `last`:

`last $myList` повертає `5`. Це аналогічно до реверсування списку та виклику `first`.

### initial, mustInitial

Ця функція доповнює `last`, повертаючи всі елементи, окрім останнього. `initial $myList` повертає `[1 2 3 4]`.

`initial` викликає panic у разі проблеми, тоді як `mustInitial` повертає помилку в рушій шаблонів, якщо виникає проблема.

### append, mustAppend

Додає новий елемент до існуючого списку, створюючи новий список.

```none
$new = append $myList 6
```

Це встановлює `$new` до `[1 2 3 4 5 6]`. `$myList` залишається незмінним.

`append` викликає panic у разі проблеми, тоді як `mustAppend` повертає помилку в рушій шаблонів, якщо виникає проблема.

### prepend, mustPrepend

Додає елемент на початок списку, створюючи новий список.

```none
prepend $myList 0
```

Це створить `[0 1 2 3 4 5]`. `$myList` залишається незмінним.

`prepend` викликає panic у разі проблеми, тоді як `mustPrepend` повертає помилку в рушій шаблонів, якщо виникає проблема.

### concat

Обʼєднує довільну кількість списків в один.

```none
concat $myList (list 6 7) (list 8)
```

Це створить `[1 2 3 4 5 6 7 8]`. `$myList` залишається незмінним.

### reverse, mustReverse

Створює новий список з елементами у зворотному порядку.

```none
reverse $myList
```

Це генерує список `[5 4 3 2 1]`.

`reverse` викликає panic у разі проблеми, тоді як `mustReverse` повертає помилку в рушій шаблонів, якщо виникає проблема.

### uniq, mustUniq

Створює список без дублікатів.

```none
list 1 1 1 2 | uniq
```

Це створить `[1 2]`.

`uniq` викликає panic у разі проблеми, тоді як `mustUniq` повертає помилку в рушій шаблонів, якщо виникає проблема.

### without, mustWithout

Функція `without` видаляє елементи зі списку.

```none
without $myList 3
```

Це створить `[1 2 4 5]`.

`without` може приймати більше одного фільтра:

```none
without $myList 1 3 5
```

Це створить `[2 4]`.

`without` викликає panic у разі проблеми, тоді як `mustWithout` повертає помилку в рушій шаблонів, якщо виникає проблема.

### has, mustHas

Перевіряє, чи містить список певний елемент.

```none
has 4 $myList
```

Це поверне `true`, а `has "hello" $myList` поверне `false`.

`has` викликає panic у разі проблеми, тоді як `mustHas` повертає помилку в рушій шаблонів, якщо виникає проблема.

### compact, mustCompact

Приймає список та видаляє елементи з пустими значеннями.

```none
$list := list 1 "a" "foo" ""
$copy := compact $list
```

`compact` поверне новий список з видаленим пустим (тобто "") елементом.

`compact` викликає panic у разі проблеми, тоді як `mustCompact` повертає помилку в рушій шаблонів, якщо виникає проблема.

### index

Щоб отримати n-й елемент списку, використовуйте `index list [n]`. Щоб отримати
елемент у багатовимірних списках, використовуйте `index list [n] [m] ...`.

* `index $myList 0` повертає `1`. Це те саме, що і `myList[0]`.
* `index $myList 0 1` повертає той самий результат, що і `myList[0][1]`.

### slice, mustSlice

Щоб отримати часткові елементи списку, використовуйте `slice list [n] [m]`. Це еквівалентно до `list[n:m]`.

* `slice $myList` повертає `[1 2 3 4 5]`. Це те саме, що і `myList[:]`.
* `slice $myList 3` повертає `[4 5]`. Це те саме, що і `myList[3:]`.
* `slice $myList 1 3` повертає `[2 3]`. Це те саме, що і `myList[1:3]`.
* `slice $myList 0 3` повертає `[1 2 3]`. Це те саме, що і `myList[:3]`.

`slice` викликає panic у разі проблеми, тоді як `mustSlice` повертає помилку в рушій шаблонів, якщо виникає проблема.

### until

Функція `until` створює діапазон цілих чисел.

```none
until 5
```

Це генерує список `[0, 1, 2, 3, 4]`.

Це корисно для циклів з `range $i, $e := until 5`.

### untilStep

Як і `until`, функція `untilStep` створює список рахуючих цілих чисел. Але вона дозволяє визначити початок, кінець та крок:

```none
untilStep 3 6 2
```

Це створить `[3 5]`, починаючи з 3 та додаючи 2, поки не буде досягнуто або перевищено 6. Це схоже на функцію `range` в Python.

### seq

Працює як команда `seq` у bash.

* 1 параметр (end) — генерує всі рахуючі цілі числа між 1 та `end` включно.
* 2 параметри (start, end) — генерує всі рахуючі цілі числа між `start` та `end` включно, збільшуючи або зменшуючи на 1.
* 3 параметри (start, step, end) — генерує всі рахуючі цілі числа між `start` та `end` включно, збільшуючи або зменшуючи на `step`.

```none
seq 5       => 1 2 3 4 5
seq -3      => 1 0 -1 -2 -3
seq 0 2     => 0 1 2
seq 2 -2    => 2 1 0 -1 -2
seq 0 2 10  => 0 2 4 6 8 10
seq 0 -2 -5 => 0 -2 -4
```

## Математичні функції {#math-functions}

Усі математичні функції працюють із значеннями типу `int64`, якщо не зазначено інше.

Доступні наступні математичні функції: [add](#add), [add1](#add1), [ceil](#ceil), [div](#div), [floor](#floor), [len](#len), [max](#max), [min](#min), [mod](#mod), [mul](#mul), [round](#round) та [sub](#sub).

### add

Додавайте числа за допомогою `add`. Приймає два або більше аргументів.

```none
add 1 2 3
```

### add1

Щоб збільшити на 1, використовуйте `add1`.

### sub

Щоб відняти, використовуйте `sub`.

### div

Виконуйте цілочисельне ділення за допомогою `div`.

### mod

Залишок від ділення можна отримати за допомогою `mod`.

### mul

Множте за допомогою `mul`. Приймає два або більше аргументів.

```none
mul 1 2 3
```

### max

Повертає найбільше із серії цілих чисел.

Це поверне `3`:

```none
max 1 2 3
```

### min

Повертає найменше із серії цілих чисел.

`min 1 2 3` поверне `1`.

### len

Повертає довжину аргументу у вигляді цілого числа.

```none
len .Arg
```

## Математичні функції з плаваючою комою {#float-math-functions}

Усі математичні функції працюють із значеннями типу `float64`.

### addf

Додавайте числа за допомогою `addf`.

Це поверне `5.5`:

```none
addf 1.5 2 2
```

### add1f

Щоб збільшити на 1, використовуйте `add1f`.

### subf

Щоб відняти, використовуйте `subf`.

Це еквівалентно `7.5 - 2 - 3` і поверне `2.5`:

```none
subf 7.5 2 3
```

### divf

Виконуйте ділення з плаваючою комою за допомогою `divf`.

Це еквівалентно `10 / 2 / 4` і поверне `1.25`:

```none
divf 10 2 4
```

### mulf

Множте за допомогою `mulf`.

Це поверне `6`:

```none
mulf 1.5 2 2
```

### maxf

Повертає найбільше із серії чисел з плаваючою комою:

Це поверне `3`:

```none
maxf 1 2.5 3
```

### minf

Повертає найменше із серії чисел з плаваючою комою.

Це поверне `1.5`:

```none
minf 1.5 2 3
```

### floor

Повертає найбільше число з плаваючою комою, яке менше або рівне вхідному значенню.

`floor 123.9999` поверне `123.0`.

### ceil

Повертає найбільше число з плаваючою комою, яке більше або рівне вхідному значенню.

`ceil 123.001` поверне `124.0`.

### round

Повертає число з плаваючою комою з округленим залишком до зазначеної кількості цифр
після десяткової крапки.

`round 123.555555 3` поверне `123.556`.

## Мережеві функції {#network-functions}

Helm має одну мережеву функцію, `getHostByName`.

Функція `getHostByName` приймає доменне імʼя і повертає IP-адресу.

`getHostByName "www.google.com"` поверне відповідну IP-адресу для `www.google.com`.

## Функції роботи з шляхами до файлів {#file-path-functions}

Хоча функції шаблонів Helm не надають доступ до файлової системи, вони забезпечують функції для роботи з рядками, які відповідають конвенціям шляхів до файлів. До них відносяться [base](#base), [clean](#clean), [dir](#dir), [ext](#ext) та [isAbs](#isabs).

### base

Повертає останній елемент шляху.

```none
base "foo/bar/baz"
```

Вищезазначене поверне "baz".

### dir

Повертає теку, видаляючи останню частину шляху. Отже, `dir "foo/bar/baz"` повертає `foo/bar`.

### clean

Очищує шлях.

```none
clean "foo/bar/../baz"
```

Вищезазначене знаходить `..` і повертає `foo/baz`.

### ext

Повертає розширення файлу.

```none
ext "foo.bar"
```

Вищезазначене поверне `.bar`.

### isAbs

Щоб перевірити, чи є шлях до файлу абсолютним, використовуйте `isAbs`.

## Функції аналізу {#reflection-functions}

Helm надає базові інструменти аналізу. Це допомагає розробникам шаблонів зрозуміти основну інформацію про типи Go для конкретного значення. Helm написано на Go і він має строгий типізований підхід. Система типів застосовується всередині шаблонів.

Go має кілька примітивів _видів (kind)_, таких як `string`, `slice`, `int64` і `bool`.

Go має відкриту систему _типів_, яка дозволяє розробникам створювати власні типи.

Helm надає набір функцій для кожного з них через [функції kind](#kind-functions) і [функції type](#type-functions). Також надана функція [deepEqual](#deepequal) для порівняння значень.

### Функції kind {#kind-functions}

Є дві функції видів: `kindOf` повертає вид обʼєкта.

```none
kindOf "hello"
```

Вищезазначене поверне `string`. Для простих тестів (наприклад, у блоці `if`), функція `kindIs` дозволяє перевірити, що значення має певний вид:

```none
kindIs "int" 123
```

Вищезазначене поверне `true`.

### Функції type {#type-functions}

Типи трохи складніше обробляти, тому є три різні функції:

* `typeOf` повертає основний тип значення: `typeOf $foo`
* `typeIs` подібна до `kindIs`, але для типів: `typeIs "*io.Buffer" $myVal`
* `typeIsLike` працює як `typeIs`, але також розіменовує покажчики

**Примітка:** Жодна з цих функцій не може перевірити, чи реалізує щось певний інтерфейс, оскільки це вимагало б компіляції інтерфейсу заздалегідь.

### deepEqual

`deepEqual` повертає `true`, якщо два значення є ["глибоко рівними"](https://golang.org/pkg/reflect/#DeepEqual).

Працює і для типів непримітивів (в порівнянні з вбудованим `eq`).

```none
deepEqual (list 1 2 3) (list 1 2 3)
```

Вищезазначене поверне `true`.

## Функції семантичного версіонування {#semantic-version-functions}

Деякі схеми версій легко розпізнати та порівнювати. Helm надає функції для роботи з версіями [SemVer 2](http://semver.org). До них відносяться [semver](#semver) і [semverCompare](#semvercompare). Нижче ви також знайдете деталі про використання діапазонів для порівнянь.

### semver

Функція `semver` розбирає рядок у семантичну версію:

```none
$version := semver "1.2.3-alpha.1+123"
```

_Якщо синтаксичний аналізатор не спрацює, виконання шаблону буде зупинено з помилкою._

На цьому етапі `$version` є покажчиком на обʼєкт `Version` з наступними властивостями:

* `$version.Major`: Основний номер (`1` вище)
* `$version.Minor`: Мінорний номер (`2` вище)
* `$version.Patch`: Номер патчу (`3` вище)
* `$version.Prerelease`: Пре-реліз (`alpha.1` вище)
* `$version.Metadata`: Метадані збірки (`123` вище)
* `$version.Original`: Оригінальна версія у вигляді рядка

Крім того, ви можете порівнювати `Version` з іншою версією, використовуючи функцію `Compare`:

```none
semver "1.4.3" | (semver "1.2.3").Compare
```

Вищезазначене поверне `-1`.

Значення повернення такі:

* `-1`, якщо дана версія SemVer більша за версію, метод `Compare` якої був викликаний
* `1`, якщо версія, для якої була викликана функція `Compare`, більша
* `0`, якщо версії однакові

(Зверніть увагу, що в SemVer поле `Metadata` не порівнюється під час операцій порівняння версій.)

### semverCompare

Більш надійна функція порівняння надається як `semverCompare`. Ця версія підтримує діапазони версій:

* `semverCompare "1.2.3" "1.2.3"` перевіряє на точний збіг
* `semverCompare "~1.2.0" "1.2.3"` перевіряє, що основні та мінорні версії збігаються, і що номер патчу другої версії _більший або рівний_ першому параметру.

Функції SemVer використовують бібліотеку [Masterminds semver](https://github.com/Masterminds/semver), від творців Sprig.

### Основні порівняння {#basic-comparisons}

Є два елементи порівнянь. По-перше, рядок порівняння є списком порівнянь з AND, розділених пробілом або комою. Ці порівняння потім розділяються операцією || (OR). Наприклад, `">= 1.2 < 3.0.0 || >= 4.2.3"` шукає порівняння, яке більше або дорівнює 1.2 і менше 3.0.0 або більше або дорівнює 4.2.3.

Основні порівняння:

* `=`: рівно (аналогічно відсутності оператора)
* `!=`: не рівно
* `>`: більше ніж
* `<`: менше ніж
* `>=`: більше або рівно
* `<=`: менше або рівно

### Робота з версіями пре-релізів {#working-with-prerelease-versions}

Пре-релізи, для тих, хто не знайомий з ними, використовуються для випусків програмного забезпечення до стабільних або загальнодоступних випусків. Прикладами пре-релізів є розробка, альфа, бета та реліз-кандидат. Пре-реліз може бути версією, наприклад, `1.2.3-beta.1`, в той час як стабільний реліз буде `1.2.3`. За порядком пріоритету пре-релізи йдуть перед їх повʼязаними релізами. У цьому прикладі `1.2.3-beta.1 < 1.2.3`.

Згідно з специфікацією Semantic Version, пре-релізи можуть не відповідати API сумісності зі своїм релізом. Вона говорить,

> Версія пре-релізу вказує, що версія нестабільна і може не відповідати запланованим вимогам сумісності, як зазначено у відповідній нормальній версії.

Порівняння SemVer з використанням обмежень без компаратора пре-релізу пропустять пре-релізи. Наприклад, `>=1.2.3` пропустить пре-релізи при перегляді списку релізів, тоді як `>=1.2.3-0` буде оцінювати і знаходити пре-релізи.

Причина для `0` як версії пре-релізу у прикладі порівняння полягає в тому, що пре-релізи можуть містити лише ASCII числа, літери та дефіси (разом з роздільниками `.`), згідно з специфікацією. Сортування відбувається в ASCII порядку сортування, згідно з специфікацією. Найнижчий символ — це `0` в ASCII порядку сортування (див. [ASCII Таблицю](http://www.asciitable.com/)).

Розуміння ASCII порядку сортування важливе, оскільки A-Z йде перед a-z. Це означає, що `>=1.2.3-BETA` поверне `1.2.3-alpha`. Те, що ви могли б очікувати від чутливості до регістру, тут не застосовується. Це через ASCII порядок сортування, який зазначено у специфікації.

### Порівняння діапазонів з дефісами {#hyphen-range-comparisons}

Є кілька методів обробки діапазонів, і перший — діапазони з дефісами. Вони виглядають так:

* `1.2 - 1.4.5`, що еквівалентно `>= 1.2 <= 1.4.5`
* `2.3.4 - 4.5`, що еквівалентно `>= 2.3.4 <= 4.5`

### Підстановочні символи в порівняннях {#wildcard-in-comparisons}

Символи `x`, `X` та `*` можуть використовуватися як символи заміщення. Це працює для всіх операторів порівняння. Коли використовується з оператором `=`, він переходить до порівняння рівня патчу (див. тильду нижче). Наприклад,

* `1.2.x` еквівалентно `>= 1.2.0, < 1.3.0`
* `>= 1.2.x` еквівалентно `>= 1.2.0`
* `<= 2.x` еквівалентно `< 3`
* `*` еквівалентно `>= 0.0.0`

### Порівняння діапазонів з тильдою (patch) {#tilde-range-comparisons-patch}

Оператор порівняння тильди (`~`) використовується для діапазонів рівня патчу, коли вказана мінорна версія, і для змін на рівні основної версії, коли мінорний номер відсутній. Наприклад,

* `~1.2.3` еквівалентно `>= 1.2.3, < 1.3.0`
* `~1` еквівалентно `>= 1, < 2`
* `~2.3` еквівалентно `>= 2.3, < 2.4`
* `~1.2.x` еквівалентно `>= 1.2.0, < 1.3.0`
* `~1.x` еквівалентно `>= 1, < 2`

### Порівняння діапазонів з кареткою (major) {#caret-range-comparisons-major}

Оператор порівняння каретки (`^`) використовується для змін на рівні основної версії після випуску стабільної (1.0.0) версії. До випуску 1.0.0 мінорні версії діють як рівень стабільності API. Це корисно при порівнянні версій API, оскільки велика зміна є порушенням API. Наприклад,

* `^1.2.3` еквівалентно `>= 1.2.3, < 2.0.0`
* `^1.2.x` еквівалентно `>= 1.2.0, < 2.0.0`
* `^2.3` еквівалентно `>= 2.3, < 3`
* `^2.x` еквівалентно `>= 2.0.0, < 3`
* `^0.2.3` еквівалентно `>=0.2.3 <0.3.0`
* `^0.2` еквівалентно `>=0.2.0 <0.3.0`
* `^0.0.3` еквівалентно `>=0.0.3 <0.0.4`
* `^0.0` еквівалентно `>=0.0.0 <0.1.0`
* `^0` еквівалентно `>=0.0.0 <1.0.0`

## Функції URL {#url-functions}

Helm включає функції [urlParse](#urlparse), [urlJoin](#urljoin) і [urlquery](#urlquery), які дозволяють працювати з частинами URL.

### urlParse

Розбирає рядок для URL і створює словник з частинами URL

```none
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

Вищезазначене повертає словник, що містить обʼєкт URL:

```yaml
scheme:   'http'
host:     'server.com:8080'
path:     '/api'
query:    'list=false'
opaque:   nil
fragment: 'anchor'
userinfo: 'admin:secret'
```

Це реалізовано за допомогою пакетів URL з стандартної бібліотеки Go. Для отримання додаткової інформації перевірте https://golang.org/pkg/net/url/#URL

### urlJoin

Обʼєднує словник (створений за допомогою `urlParse`) для створення рядка URL

```none
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

Вищезазначене поверне наступний рядок:

```none
http://host:80/path?query#fragment
```

### urlquery

Повертає екрановану версію значення, переданого як аргумент, так що воно підходить для вбудовування в частину запиту URL.

```none
$var := urlquery "string for query"
```

## Функції UUID {#uuid-functions}

Helm може генерувати UUID v4, унікальні ідентифікатори.

```none
uuidv4
```

Вищезазначене повертає новий UUID типу v4 (згенерований випадковим чином).

## Функції Kubernetes і Chart {#kubernetes-and-chart-functions}

Helm включає функції для роботи з Kubernetes, зокрема [`.Capabilities.APIVersions.Has`](#capabilitiesapiversionshas), [Files](#file-functions) та [lookup](#lookup).

### lookup

`lookup` використовується для пошуку ресурсу в працюючому кластері. При використанні з командою `helm template` він завжди повертає порожній результат.

Більше деталей можна знайти в [документації по функції lookup](/chart_template_guide/functions_and_pipelines.md#using-the-lookup-function).

### .Capabilities.APIVersions.Has

Повертає, чи доступна API-версія або ресурс у кластері.

```none
.Capabilities.APIVersions.Has "apps/v1"
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

Більше інформації доступно в [документації по вбудованих обʼєктах](/chart_template_guide/builtin_objects.md).

### Функції файлів {#file-functions}

Є кілька функцій, які дозволяють отримати доступ до не-спеціальних файлів всередині chart. Наприклад, для доступу до конфігураційних файлів програми. Ці функції документовані в [Доступ до файлів всередині шаблонів](/chart_template_guide/accessing_files.md).

_Зверніть увагу, що документація для багатьох з цих функцій надходить з [Sprig](https://github.com/Masterminds/sprig). Sprig — це бібліотека функцій шаблонів, доступна для застосунків на Go._
