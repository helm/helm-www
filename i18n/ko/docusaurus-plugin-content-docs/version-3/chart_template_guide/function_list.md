---
title: 템플릿 함수 목록
description: 헬름에서 사용가능한 템플릿 함수에 대한 목록
sidebar_position: 6
---

헬름에는 템플릿에서 활용할 수 있는 많은 템플릿 함수들이 포함되어 있다.
여기에 나열되며 다음 범주로 분류된다.

* [암호화 및 보안](#암호화-및-보안-함수)
* [날짜](#날짜-함수)
* [사전](#사전-및-사전-함수)
* [인코딩](#인코딩-함수)
* [파일 경로](#파일-경로-함수)
* [쿠버네티스 및 차트](#쿠버네티스-및-차트-함수)
* [논리 및 흐름 제어](#논리-및-흐름-제어-함수)
* [목록](#목록-및-목록-함수)
* [수학](#수학-함수)
* [네트워크](#네트워크-함수)
* [리플렉션](#리플렉션-함수)
* [정규 표현식](#정규-표현식)
* [유의적 버전](#유의적-버전-함수)
* [문자열](#문자열-함수)
* [형 변환](#형-변환-함수)
* [URL](#url-함수)
* [UUID](#uuid-함수)

## 논리 및 흐름 제어 함수

헬름은 
[and](#and), [coalesce](#coalesce), [default](#default), [empty](#empty), [eq](#eq), [fail](#fail), 
[ge](#ge), [gt](#gt), [le](#le), [lt](#lt), [ne](#ne), [not](#not), [or](#or) 를
포함한 수많은 논리 및 흐름 제어 기능이 포함되어 있다.

### and

두 인수의 불리언 and를 반환한다.

```
and .Arg1 .Arg2
```

### or

두 인수의 불리언 or를 반환한다. 
비어 있지 않은 첫 번째 인수 또는 마지막 인수를 반환한다.

```
or .Arg1 .Arg2
```

### not

인수의 불리언 부정을 반환한다.

```
not .Arg
```

### eq

인수들이 같은지 여부를 불리언으로 반환한다. (예: Arg1 == Arg2)

```
eq .Arg1 .Arg2
```

### ne

인수들이 같지 않은지 여부를 불리언으로 반환한다. (예: Arg1 != Arg2)

```
ne .Arg1 .Arg2
```

### lt

첫 번째 인수가 두 번째 인수보다 작으면 불리언 true를 반환한다. 
그렇지 않으면 False가 반환된다 (예 : Arg1 < Arg2).

```
lt .Arg1 .Arg2
```

### le

첫 번째 인수가 두 번째 인수보다 작거나 같은 경우 불리언 true를 반환한다. 
그렇지 않으면 False가 반환된다 (예 : Arg1 <= Arg2).

```
le .Arg1 .Arg2
```

### gt

첫 번째 인수가 두 번째 인수보다 크면 불리언 true를 반환한다. 
그렇지 않으면 False가 반환된다 (예 : Arg1 > Arg2).

```
gt .Arg1 .Arg2
```

### ge

첫 번째 인수가 두 번째 인수보다 크거나 같은 경우 불리언 true를 반환한다. 
그렇지 않으면 False가 반환된다 (예 : Arg1 >= Arg2).

```
ge .Arg1 .Arg2
```

### default

간단한 기본값을 설정하려면 `default`를 사용한다.

```
default "foo" .Bar
```

위에서 `.Bar` 가 비어 있지 않은 값으로 평가되면 사용된다. 
하지만 비어 있으면 `foo` 가 대신 반환된다.

"비어 있음"의 정의는 다음의 유형을 따른다.

- 숫자: 0
- 문자열: ""
- 리스트형: `[]`
- 딕셔너리형: `{}`
- 불리언: `false`
- `nil` 의 경우 항상 (null 이라고도 함)

구조체의 경우 비어 있다는 정의가 없으므로, 구조체는
기본값을 반환하지 않는다.

### empty

`empty` 함수는 주어진 값이 비어 있다고 간주되면 `true` 를 반환하고 
그렇지 않으면 `false` 를 반환한다. 빈 값은 `default` 섹션에 나열된다.

```
empty .Foo
```

Go 템플릿 조건부에서는 비어 있음이 자동으로 계산된다. 
따라서 `if not empty .Foo` 는 거의 필요하지 않다. 대신 `if .Foo` 를 사용하도록 하자.

### fail

지정된 텍스트와 함께 빈 `문자열` 과 `오류` 를 무조건 반환한다. 
이는 다른 조건에서 템플릿 렌더링이 실패해야 한다고 
결정한 시나리오에서 유용하다.

```
fail "Please accept the end user license agreement"
```

### coalesce

`coalesce` 함수는 값 목록을 가져와 비어 있지 않은 
첫 번째 값을 반환한다.

```
coalesce 0 1 2
```

위의 경우 `1` 을 반환한다.

이 함수는 여러 변수 또는 값을 스캔하는데 유용하다.

```
coalesce .name .parent.name "Matt"
```

위 코드는 먼저 `.name` 이 비어 있는지 확인한다. 
그렇지 않은 경우 해당 값을 반환한다. 
비어있는 경우 `coalesce` 는 `.parent.name` 이 비어 있는지 평가한다. 
마지막으로 `.name` 과 `.parent.name` 이 모두 비어 있으면 `Matt` 를 반환한다.

### ternary

`삼항(ternary)` 함수는 두 개의 값과 테스트 값을 취한다. 
테스트 값이 참이면 첫 번째 값이 반환된다. 
테스트 값이 비어 있으면 두 번째 값이 반환된다. 이것은 C 언어의 삼항 연산자와 유사하다.

#### true 테스트 값

```
ternary "foo" "bar" true
```

또는

```
true | ternary "foo" "bar"
```

위의 결과는 `"foo"` 를 반환한다.

#### false 테스트 값

```
ternary "foo" "bar" false
```

또는

```
false | ternary "foo" "bar"
```

위의 결과는 `"bar"` 를 반환한다.

## 문자열 함수

헬름은 다음과 같은 문자열 함수들을 포함한다. 
[abbrev](#abbrev),[abbrevboth](#abbrevboth), [camelcase](#camelcase), [cat](#cat),
[contains](#contains), [hasPrefix](#hasprefix-및-hassuffix),
[hasSuffix](#hasprefix-및-hassuffix), [indent](#indent), [initials](#initials),
[kebabcase](#kebabcase), [lower](#lower), [nindent](#nindent),
[nospace](#nospace), [plural](#plural), [print](#print), [printf](#printf),
[println](#println), [quote](#quote-및-squote),
[randAlpha](#randalphanum-randalpha-randnumeric-randascii),
[randAlphaNum](#randalphanum-randalpha-randnumeric-randascii),
[randAscii](#randalphanum-randalpha-randnumeric-randascii),
[randNumeric](#randalphanum-randalpha-randnumeric-randascii),
[repeat](#repeat), [replace](#replace), [shuffle](#shuffle),
[snakecase](#snakecase), [squote](#quote-및-squote), [substr](#substr),
[swapcase](#swapcase), [title](#title), [trim](#trim), [trimAll](#trimall),
[trimPrefix](#trimprefix), [trimSuffix](#trimsuffix), [trunc](#trunc),
[untitle](#untitle), [upper](#upper), [wrap](#wrap), [wrapWith](#wrapwith).

### print

일부의 조합에서 문자열을 반환한다.

```
print "Matt has " .Dogs " dogs"
```

문자열이 아닌 유형은 가능한 경우 문자열로 변환된다.

서로 옆에 있는 두 인수가 문자열이 아닌 경우 그 사이에 
공백이 추가된다.

### println

[print](#print) 와 같은 방식으로 동작하지만, 끝에 새 줄을 추가한다.

### printf

형식화 문자열과 순서대로 전달할 인수를 기반으로 문자열을 
반환한다.

```
printf "%s has %d dogs." .Name .NumberDogs
```

사용할 자리 표시자는 전달되는 인수의 유형에 따라 다르다.
여기에는 다음이 포함된다.

일반적인 목적:

* `%v` 기본 형식의 값
  * 사전형 출력의 경우, 더하기 플래그(%+v) 는 필드 이름을 추가
* `%%` 는 리터럴 퍼센트 기호로  값을 소비하지 않음

불리언:

* `%t` 단어 true 또는 false

정수:

* `%b` 2진법
* `%c` 해당 유니코드 포인트가 표현하는 문자
* `%d` 10진법
* `%o` 8진법
* `%O` 접두사 0 이 있는 8진법
* `%q` 홑따옴표로 묶인 문자는 안전하게 통과(escaped)
* `%x` a-f 의 소문자를 사용하는 16진법
* `%X` A-F 의 대문자를 사용하는 16진법
* `%U` 유니코드 형식: U+1234("U+%04X"와 동일)

부동 소수점 및 복잡한 요소:

* `%b` 지수가 2의 거듭제곱인, 십진수가 없는 과학적 표기법. 예를 들어,
  -123456p-78
* `%e` 과학적 표기법. 예: -1.234456e+78
* `%E` 과학적 표기법. 예: -1.234456E+78
* `%f` 지수가 없는 소수점. 예: 123.456
* `%F` %f 와 동일
* `%g` 지수가 클 경우 %e, 그렇지 않은 경우 %f.
* `%G` 지수가 클 경우 %E, 그렇지 않은 경우 %F.
* `%x` (두 지수의 10진수 거듭제곱 형태의) 16진수 표기법, 예를 들어,
  -0x1.23abcp+20
* `%X` 대문자 16진수 표기법. 예를 들어, -0X1.23ABCP+20

바이트의 문자열 또는 슬라이스(이러한 동사들과 동일하게 취급):

* `%s` 문자열 또는 슬라이스의 해석되지 않은 바이트
* `%q` 안전하게 이스케이프된 겹따옴표 문자열
* `%x` 16진법, 소문자이며 바이트 당 2자
* `%X` 16진법, 대문자이며 바이트 당 2자

슬라이스:

* `%p` 0x로 시작하는, 16 진수 표기에서의 0번째 요소의 주소

### trim

`trim` 함수는 문자열의 양쪽에서 공백을 제거한다.

```
trim "   hello    "
```

위 결과는 `hello` 이다.

### trimAll

문자열의 앞뒤에서 주어진 문자를 제거한다.

```
trimAll "$" "$5.00"
```

위 결과는 (문자열인) `5.00` 이다.

### trimPrefix

문자열에서 접두어만 제거한다.

```
trimPrefix "-" "-hello"
```

위 결과는 `hello` 를 반환한다.

### trimSuffix

문자열에서 접미어만 제거한다.

```
trimSuffix "-" "hello-"
```

위 결과는 `hello` 를 반환한다.

### lower

전체 문자열을 소문자로 변환한다.

```
lower "HELLO"
```

위 결과는 `hello` 를 반환한다.

### upper

전체 문자열을 대문자로 반환한다.

```
upper "hello"
```

위 결과는 `HELLO` 를 반환한다.

### title

제목의 형식으로 변환한다.

```
title "hello world"
```

위 결과는 `Hello World` 반환한다.

### untitle

제목의 형식을 제거한다. `untitle "Hello World"` 는 `hello world` 를 반환한다..

### repeat

문자열을 여러 번 반복한다.

```
repeat 3 "hello"
```

위의 결과는 `hellohellohello` 를 반환한다.

### substr

문자열에서 부분문자열을 가져온다. 세가지 매개변수가 필요하다.

- 시작 지점 (int)
- 끝 지점 (int)
- 원본 문자열 (string)

```
substr 0 5 "hello world"
```

위 결과는 `hello` 를 반환한다.

### nospace

문자열에서 모든 공백을 제거한다.

```
nospace "hello w o r l d"
```

위 결과는 `helloworld` 를 반환한다.

### trunc

문자열을 자른다.

```
trunc 5 "hello world"
```

위 결과는 `hello` 을 반환한다.

```
trunc -5 "hello world"
```

위 결과는 `world` 를 반환한다.

### abbrev

줄임표 (`...`) 로 문자열을 자른다.

매개변수:

- 최대 길이
- 문자열

```
abbrev 5 "hello world"
```

위 결과는 최대 길이에 대해 너비를 계산하므로, `he...` 를
반환한다.

### abbrevboth

양쪽을 축약한다.

```
abbrevboth 5 10 "1234 5678 9123"
```

위 결과는 `...5678...` 를 반환한다.

다음이 필요하다.

- 왼쪽 오프셋
- 최대 길이
- 원본 문자열

### initials

주어진 여러 단어에서, 각 단어의 첫 단어를 취하고 결합한다.

```
initials "First Try"
```

위 결과는 `FT` 를 반환한다.

### randAlphaNum, randAlpha, randNumeric, randAscii

이 네 가지 함수는 암호화적으로 안전한 (```crypto/rand``` 사용) 임의의 문자열을 생성하지만 
기본 문자 집합은 상이하다.

- `randAlphaNum` 는 `0-9a-zA-Z` 를 사용한다
- `randAlpha` 는 `a-zA-Z` 를 사용한다
- `randNumeric` 는 `0-9` 를 사용한다
- `randAscii` 는 출력가능한 모든 ASCII 문자를 사용한다

각각은 하나의 매개 변수, 즉 문자열의 정수 길이를 취한다.

```
randNumeric 3
```

위 결과는 3자리 숫자로 된 임의의 문자열을 생성한다.

### wrap

주어진 열 개수로 텍스트를 래핑(wrap)한다.

```
wrap 80 $someText
```

위 결과는 80 번째 열에서 `$someText`의 문자열을 래핑한다.

### wrapWith

`wrapWith` 는 `wrap` 로 작동하지만, 래핑할 문자열을 지정할 수 있다.
(`wrap` 은 `\n` 을 사용)

```
wrapWith 5 "\t" "Hello World"
```

위는 `hello world` 를 생성한다. 
(여기서 공백은 ASCII 탭 문자이다.)

### contains

한 문자열이 다른 문자열 안에 포함되어 있는지 테스트한다.

```
contains "cat" "catch"
```

위 결과는 `catch` 에 `cat` 이 포함되어 있으므로 `true` 를 반환한다.

### hasPrefix 및 hasSuffix

`hasPrefix` 및 `hasSuffix` 함수는 문자열에 주어진 접두어 또는 접미어가 있는지
여부를 테스트한다.

```
hasPrefix "cat" "catch"
```

위 결과는 `catch` 에 접두사 `cat` 이 있으므로, `true` 를 반환한다.

### quote 및 squote

이 함수는 문자열을 겹따옴표("quote") 또는 홑따옴표(`quote`)로
묶는다.

### cat

`cat` 함수는 여러 문자열을 하나로 결합하고
공백으로 구분한다.

```
cat "hello" "beautiful" "world"
```

위 결과는 `hello beautiful world` 이다.

### indent

`indent` 함수는 주어진 문자열의 모든 줄을 지정된 들여쓰기 너비로 들여쓴다.
이것은 여러 줄 문자열을 정렬할 때 유용하다.

```
indent 4 $lots_of_text
```

위 결과는 모든 텍스트 줄을 4개의 공백 문자로 들여쓴다.

### nindent

`nindent` 함수는 indent 함수와 동일하지만 문자열 시작 부분에
새 줄을 추가한다.

```
nindent 4 $lots_of_text
```

위 결과는 모든 텍스트 줄을 공백 문자 4개로 들여쓰기하고 시작
부분에 새 줄을 추가한다.

### replace

간단한 문자열 교체를 수행한다.

3가지 인수를 필요로 한다.

- 대체할 문자열
- 대체될 문자열
- 원본 문자열

```
"I Am Henry VIII" | replace " " "-"
```

위 결과는 `I-Am-Henry-VIII` 이다.

### plural

문자열을 복수(plural)화 한다.

```
len $fish | plural "one anchovy" "many anchovies"
```

위에서 문자열의 길이가 1이면 첫 번째 인수(`one anchovy`)가 출력된다. 
그렇지 않으면 두 번째 인수(`many anchovies`)가
출력된다.

인수는 다음과 같다.

- 단수 문자열
- 복수 문자열
- 길이 정수

참고: 헬름은 현재로서는 더 복잡한 복수화 규칙이 있는 언어를 지원하지 않는다.
그리고 `0` 은, 영어가 그렇게 취급하기 때문에, 복수형으로 
간주 된다. (`zero anchovies`)

### snakecase

camelCase에서 snake_case로 변환한다.

```
snakecase "FirstName"
```

위 결과는 `first_name` 이다.

### camelcase

snake_case에서 camelCase로 변환한다.

```
camelcase "http_server"
```

위 결과는 `HttpServer` 이다.

### kebabcase

camelCase에서 kebab-case로 변환한다.

```
kebabcase "FirstName"
```

위 결과는 `first-name` 이다.

### swapcase

단어 기반 알고리즘을 사용하여 문자열의 대소문자를 바꾼다.

변환 알고리즘:

- 대문자는 소문자로 변환한다
- 제목 형식의 문자는 소문자로 변환한다
- 공백 뒤 또는 시작시의 소문자는 제목 형식의 대소문자로 변환한다
- 기타 소문자는 대문자로 변환한다
- 화이트스페이스는 unicode.IsSpace(char)로 정의된다

```
swapcase "This Is A.Test"
```

위 결과는 `tHIS iS a.tEST` 이다.

### shuffle

문자열을 섞는다.

```
shuffle "hello"
```

위 결과는 `hello` 의 문자를 무작위로 변경하여, `oelhl` 일 수도 있다.

## 형 변환 함수

헬름에서 제공하는 형 변환 함수는 다음과 같다.

- `atoi`: 문자열을 정수로 변환한다.
- `float64`: `float64` 로 변환한다.
- `int`: 시스템 기준의 `int` 로 변환한다.
- `int64`: `int64` 로 변환한다.
- `toDecimal`: 유닉스 8진수를 `int64` 로 변환한다.
- `toString`: 문자열로 변환한다.
- `toStrings`: 목록, 슬라이스 또는 배열을 문자열 목록으로 변환한다.
- `toJson` (`mustToJson`): 목록, 슬라이스, 배열, 사전형 또는 객체를 JSON 으로 변환한다.
- `toPrettyJson` (`mustToPrettyJson`): 목록, 슬라이스, 배열, 사전형 또는 객체를 들여쓰기 된 
  JSON 으로 변환한다.
- `toRawJson` (`mustToRawJson`): 목록, 슬라이스, 배열, 사전형 또는 객체를
  HTML 문자가 이스케이프 되지 않은 JSON 으로 변환한다.

`atoi` 함수는 입력이 특정 유형이어야 한다. 
나머지는 모든 유형에서 대상 유형으로 변환을 시도한다. 
예를 들어 `int64` 는 부동 소수점을 정수로 변환 할 수 있으며 문자열을 정수로 변환 할 수도 있다.

### toStrings

목록과 같은 컬렉션이 주어지면 문자열 슬라이스를 생성한다.

```
list 1 2 3 | toStrings
```

위는 결과는 `1` 을 `"1"` 로, `2` 를 `"2"` 로 변환한 다음 목록으로
반환한다.

### toDecimal

주어진 유닉스 8진수 권한 값에 대하여, 10진수 값을 생성한다.

```
"0777" | toDecimal
```

위 코드는 `0777` 을 `511` 로 변환하고 값을 int64 형태로 변환한다.

### toJson, mustToJson

`toJson` 함수는 항목을 JSON 문자열로 인코딩한다. 
항목을 JSON으로 변환 할 수 없는 경우 함수는 빈 문자열을 반환한다. 
`mustToJson` 은 항목을 JSON으로 인코딩할 수 없는 경우 오류를 반환한다.

```
toJson .Item
```

위 결과는 `.Item` 의 JSON 문자열 표현을 반환한다.

### toPrettyJson, mustToPrettyJson

`toPrettyJson` 함수는 항목을 잘 정제된(들여쓰기) JSON 문자열로 
인코딩한다.

```
toPrettyJson .Item
```

위 결과는 `.Item` 의 들여쓰기된 JSON 문자열 표현을 반환한다.

### toRawJson, mustToRawJson

`toRawJson` 함수는 특정 항목을 HTML 문자가 이스케이프 되지 않은 JSON 문자열로 
인코딩한다. 

```
toRawJson .Item
```

위는 `.Item` 의 이스케이프 처리되지 않은 JSON 문자열 표현을 반환합니다.

## 정규 표현식

헬름에는 다음의 정규식 함수가 표현된다: [regexFind
(mustRegexFind)](#regexfindall-mustregexfindall), [regexFindAll
(mustRegexFindAll)](#regexfind-mustregexfind), [regexMatch
(mustRegexMatch)](#regexmatch-mustregexmatch), [regexReplaceAll
(mustRegexReplaceAll)](#regexreplaceall-mustregexreplaceall),
[regexReplaceAllLiteral
(mustRegexReplaceAllLiteral)](#regexreplaceallliteral-mustregexreplaceallliteral),
[regexSplit (mustRegexSplit)](#regexsplit-mustregexsplit).

### regexMatch, mustRegexMatch

입력 문자열에 정규식과 일치하는 항목이 있으면 true 를 반환한다.

```
regexMatch "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" "test@acme.com"
```

위 결과는 `true` 이다.

`regexMatch` 는 문제가 있는 경우 패닉이 발생하며, `mustRegexMatch` 는 문제가 있을 경우
템플릿 엔진에 오류를 반환한다.

### regexFindAll, mustRegexFindAll

입력 문자열에서 정규식과 일치하는 모든 항목의 슬라이스를 반환한다. 
마지막 매개 변수 n은 반환할 하위 문자열의 수를 결정한다. 
여기서 -1은 모든 일치 항목을 반환함을 의미한다.

```
regexFindAll "[2,4,6,8]" "123456789" -1
```

위 결과는 `[2 4 6 8]` 이다.

`regexFindAll` 은 문제가 있으면 패닉이 발생하며 
`mustRegexFindAll` 은 문제가 있으면 템플릿 엔진에 오류를 반환한다.

### regexFind, mustRegexFind

입력 문자열에서 정규식의 첫 번째(가장 왼쪽) 일치 항목을 반환한다.

```
regexFind "[a-zA-Z][1-9]" "abcd1234"
```

위 결과는 `d1` 이다.

`regexFind` 는 문제가 있으면 패닉이 발생하며 
`mustRegexFind` 는 문제가 있으면 템플릿 엔진에 오류를 반환한다.

### regexReplaceAll, mustRegexReplaceAll

입력 문자열의 복사본을 반환하여 정규 표현식의 일치 항목을 
교체 문자열로 바꾼다. 문자열 교체 내에서 $ 기호는 
확장된 차트에서와 같이 해석되므로, 예를 들어 
$1은 첫 번째 부분의 일치하는 텍스트를 나타낸다.

```
regexReplaceAll "a(x*)b" "-ab-axxb-" "${1}W"
```

위 결과는 `-W-xxW-` 이다.

`regexReplaceAll` 은 문제가 있는 경우 패닉이 발생하며 
`mustRegexReplaceAll` 은 문제가 있는 경우 템플릿 엔진에 오류를 반환한다.

### regexReplaceAllLiteral, mustRegexReplaceAllLiteral

입력 문자열의 복사본을 반환하고 
정규 표현식의 일치 항목을 대체 문자열로 변경한다. 
대체 문자열은 확장(Expand)를 사용하지 않고 직접 대체된다.

```
regexReplaceAllLiteral "a(x*)b" "-ab-axxb-" "${1}"
```

위 결과는 `-${1}-${1}-` 이다.

`regexReplaceAllLiteral` 는 문제가 있으면 패닉이 발생하며,
`mustRegexReplaceAllLiteral` 는 문제가 있으면 템플릿 엔진에 오류를 
반환한다.

### regexSplit, mustRegexSplit

입력 문자열을 식으로 구분 된 하위 문자열로 분할하고 
해당 식 일치 사이의 하위 문자열 슬라이스를 반환한다. 
마지막 매개 변수 `n` 은 반환 할 하위 문자열 수를 결정한다. 
여기서 `-1` 은 모든 일치 항목을 반환 함을 의미한다.

```
regexSplit "z+" "pizza" -1
```

위 결과는 `[pi a]` 이다.

`regexSplit` 은 문제가 있는 경우 패닉이 발생하며 
`mustRegexSplit` 는 문제가 있는 경우 템플릿 엔진에 오류를 반환한다.

## 암호화 및 보안 함수

헬름은 몇 가지 고급 암호화 함수를 제공한다.
[adler32sum](#adler32sum), [buildCustomCert](#buildcustomcert),
[decryptAES](#decryptaes), [derivePassword](#derivepassword),
[encryptAES](#encryptaes), [genCA](#genca), [genPrivateKey](#genprivatekey),
[genSelfSignedCert](#genselfsignedcert), [genSignedCert](#gensignedcert),
[htpasswd](#htpasswd), [sha1sum](#sha1sum), [sha256sum](#sha256sum).

### sha1sum

`sha1sum` 함수는 문자열을 수신하고 SHA1 다이제스트를 계산한다.

```
sha1sum "Hello world!"
```

### sha256sum

`sha256sum` 함수는 문자열을 수신하고 SHA256 다이제스트 값을 계산한다.

```
sha256sum "Hello world!"
```

위 결과는 출력을 위해 안전한 "ASCII armored" 형식의 SHA256 합을 
계산한다. 

### adler32sum

`adler32sum` 함수는 문자열을 수신하고 Adler-32 체크섬을 계산한다.

```
adler32sum "Hello world!"
```

### htpasswd

`htpasswd` 함수는 `username` 과 `password` 를 
가져 와서 패스워드의 `bcrypt` 해시를 생성한다. 
결과는 [아파치 HTTP 서버] (https://httpd.apache.org/docs/2.4/misc/password_encryptions.html#basic)에서 
기본 인증에 사용될 수 있다.

```
htpasswd "myUser" "myPassword"
```

템플릿에 직접 암호를 저장하는 것은 안전하지 않음을 유의하자.

### derivePassword

`derivePassword` 함수는 일부 공유되는 "마스터 패스워드" 
제약 조건을 기반으로 특정 패스워드를 도출하는 데 사용할 수 있다. 
이에 대한 알고리즘이 [잘 명세되어] (https://masterpassword.app/masterpassword-algorithm.pdf) 있다.

```
derivePassword 1 "long" "password" "user" "example.com"
```

일부를 템플릿에 직접 저장하는 것은 안전하지 않을 수 있다는 점에 유의하자.

### genPrivateKey

`genPrivateKey` 함수는 PEM 블록으로 인코딩된 새 개인키를 
생성한다.

첫 번째 매개변수의 값 중 하나를 사용한다.

- `ecdsa`: 타원 곡선 DSA 키 생성 (P256)
- `dsa`: DSA 키 생성 (L2048N256)
- `rsa`: RSA 4096 키 생성

### buildCustomCert

`buildCustomCert` 함수를 사용하면 커스텀 인증서 설정이 가능하다.

다음의 문자열 매개변수를 사용한다.

- base64 인코딩된 PEM 형식의 인증서
- base64 인코딩된 PEM 형식의 개인키

다음 속성을 가진 인증서 객체를 반환한다.

- `Cert`: PEM 인코딩 인증서
- `Key`: PEM 인코딩된 개인 키

예:

```
$ca := buildCustomCert "base64-encoded-ca-crt" "base64-encoded-ca-key"
```

반환된 객체는 `genSignedCert` 함수에 전달되어 이 CA를 사용하여
인증서에 서명할 수 있다.

### genCA

`genCA` 함수는 자체 서명된 새로운 x509 인증기관을 생성한다.

다음의 매개 변수를 사용한다.

- 주체의 일반 이름 (common name. cn)
- 인증서의 유효 기간 (일)

다음 속성을 가진 객체를 반환한다.

- `Cert`: PEM 인코딩 인증서
- `Key`: PEM 인코딩된 개인키

예:

```
$ca := genCA "foo-ca" 365
```

반환 된 객체는 `genSignedCert` 함수에 전달되어 이 CA를 사용하여 
인증서에 서명 할 수 있습니다.

### genSelfSignedCert

`genSelfSignedCert` 함수는 자체 서명 된 새로운 x509 인증서를 생성한다.

다음의 매개 변수를 사용한다.

- 주체의 일반 이름 (cn)
- 선택적인 IP 목록으로 nil도 가능
- 선택적인 대체 DNS 이름으로 nil 도 가능
- 인증서 유효 기간 (일)

다음 속성을 가진 객체를 반환한다.

- `Cert`: PEM 인코딩 인증서
- `Key`: PEM 인코딩된 개인키

예:

```
$cert := genSelfSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365
```

### genSignedCert

`genSignedCert` 함수는 지정된 CA에서 서명 한 새로운 x509 인증서를 
생성한다.

다음의 매개 변수를 사용한다.

- 주체의 일반 이름 (cn)
- 선택적인 IP 목록으로 nil도 가능
- 선택적인 대체 DNS 이름으로 nil 도 가능
- 인증서 유효 기간 (일)
- CA (`genCA` 를 참조)

예:

```
$ca := genCA "foo-ca" 365
$cert := genSignedCert "foo.com" (list "10.0.0.1" "10.0.0.2") (list "bar.com" "bat.com") 365 $ca
```

### encryptAES

`encryptAES` 함수는 AES-256 CBC로 텍스트를 암호화하고 base64 인코딩된 문자열을 
반환한다.

```
encryptAES "secretkey" "plaintext"
```

### decryptAES

`decryptAES` 함수는 AES-256 CBC 알고리즘으로 인코딩된 base64 문자열을 수신하고 디코딩된 
텍스트를 반환한다.

```
"30tEfhuJSVRhpG97XCuWgz2okj7L8vQ1s6V9zVUPeDQ=" | decryptAES "secretkey"
```

## 날짜 함수

헬름에는 템플릿에서 사용할 수 있는 다음의 날짜 함수들이 포함되어 있다.
[ago](#ago), [date](#date), [dateInZone](#dateinzone), [dateModify
(mustDateModify)](#datemodify-mustdatemodify), [duration](#duration),
[durationRound](#durationround), [htmlDate](#htmldate),
[htmlDateInZone](#htmldateinzone), [now](#now), [toDate
(mustToDate)](#todate-musttodate), [unixEpoch](#unixepoch).

### now

현재 날짜/시간으로, 다른 날짜 기능과 함께 사용한다.

### ago

`ago` 함수는 time.Now에서 초 단위로 기간을 반환한다.

```
ago .CreatedAt
```

`time.Duration` String() 형식을 반환한다.

```
2h34m7s
```

### date

`date` 함수는 날짜 형식을 지정한다.

날짜 형식을 YEAR-MONTH-DAY로 지정한다.

```
now | date "2006-01-02"
```

Go 에서의 날짜 형식은 
[조금 상이하다](https://pauladamsmith.com/blog/2011/05/go_time.html).

간단히 말해서, 이것을 기준 날짜로 한다.

```
Mon Jan 2 15:04:05 MST 2006
```

원하는 형식으로 작성하자.
위의 경우, `2006-01-02` 와 같은 날짜이지만, 우리가 원하는 형식으로 작성되었다.

### dateInZone

`date` 와 동일하지만, 시간대가 있다.

```
dateInZone "2006-01-02" (now) "UTC"
```

### duration

주어진 시간(초)을 `time.Duration` 형식으로 지정한다.

아래의 경우, 1분 35초를 반환한다.

```
duration 95
```

### durationRound

주어진 기간을 가장 중요한 단위로 반올림한다. 
문자열과 `time.Duration` 은 기간으로 파싱되며, 
`time.Time` 은 경과한 기간으로 계산된다.

아래의 경우, 2h 를 반환한다.

```
durationRound "2h10m5s"
```

이 경우는 3mo를 반환한다.

```
durationRound "2400h10m5s"
```

### unixEpoch

`time.Time` 에 대한 유닉스 시간(unix epoch)를 반환한다.

```
now | unixEpoch
```

### dateModify, mustDateModify

`dateModify` 는 날짜를 가져와서 수정한 후에, 타임 스탬프를 반환한다.

아래의 경우 현재 시간에서 1시간 30분을 뺀 시간을 반환한다.

```
now | date_modify "-1.5h"
```

수정 형식이 잘못된 경우 `dateModify` 는 수정되지 않은 날짜를 반환한다.
`mustDateModify` 는 수정 형식이 잘못된 경우 오류를 반환한다.

### htmlDate

`htmlDate` 함수는 HTML 날짜 선택기 입력 필드에 삽입할 날짜 형식을 
지정한다.

```
now | htmlDate
```

### htmlDateInZone

htmlDate 와 동일하지만, 시간대가 추가된다.

```
htmlDateInZone (now) "UTC"
```

### toDate, mustToDate

`toDate` 는 문자열을 날짜로 변환한다. 첫 번째 인수는 날짜 레이아웃이고 두 번째 인수는 날짜 문자열이다. 
문자열을 변환할 수 없으면 0 값을 반환한다. 
`mustToDate` 는 문자열을 변환할 수 없는 경우 오류를 반환한다.

이는 문자열 날짜를 파이프를 사용하여 다른 형식으로 변환하려는 경우에 유용하다. 
아래 예는 "2017-12-31" 을 "31/12/2017" 로 변환한다.

```
toDate "2006-01-02" "2017-12-31" | date "02/01/2006"
```

## 사전 및 사전 함수

헬름은 `dict` (파이썬에서의 "dictionary"의 약자) 라는 키/값 저장소 유형을 제공한다.
`dict` 는 _정렬되지 않는_ 유형이다.

딕셔너리의 키는 **문자열이어야 한다.** 그러나 값은 모든 유형, 심지어
다른 `dict` 또는 `list` 일 수도 있다.

`list` 와 달리, `dict` 는 변경 불가능(immutable)하다. `set`과 `unset` 함수는 딕셔너리의
내용을 변경한다.

헬름은 딕셔너리에 대한 작업을 지원하기 위해 다음의 함수를 제공한다: [deepCopy
(mustDeepCopy)](#deepcopy-mustdeepcopy), [dict](#dict), [get](#get),
[hasKey](#haskey), [keys](#keys), [merge (mustMerge)](#merge-mustmerge),
[mergeOverwrite (mustMergeOverwrite)](#mergeoverwrite-mustmergeoverwrite),
[omit](#omit), [pick](#pick), [pluck](#pluck), [set](#set), [unset](#unset), 
[values](#values).

### dict
ㅣ
`dict` 함수를 호출하고 키/값들의 리스트를 전달함으로써 사전이 
생성된다. 

다음은 세 항목이 있는 사전을 만든다.

```
$myDict := dict "name1" "value1" "name2" "value2" "name3" "value 3"
```

### get

주어진 맵과 그 키에 대하여, 맵으로부터 값을 가져온다.

```
get $myDict "key1"
```

위 결과는 `"value1"` 을 반환한다.

키를 찾을 수 없는 경우 이 작업은 단순히 `""` 를 반환한다. 
별도의 오류가 발생하지는 않는다.

### set

`set` 을 사용하여 새 키/값 쌍을 사전에 추가한다.

```
$_ := set $myDict "name4" "value4"
```

`set` 은 (Go 템플릿 함수의 요구 사항으로) _사전을 반환함으로_ 
위와 같이 `$ _` 을 이용하여 값을 관리해야 
할 수도 있다.

### unset

주어진 맵과 그 키에 대하여, 맵에서 키와 값을 삭제한다.

```
$_ := unset $myDict "name4"
```

`set` 과 마찬가지로, 사전을 반환한다.

키를 찾을 수 없는 경우, 이 작업은 단순하게 반환된다.
별도의 오류는 생성되지 않는다.

### hasKey

주어진 사전에 주어진 키가 포함되어 있으면, `hasKey` 함수는 `true` 를 반환한다.

```
hasKey $myDict "name1"
```

키를 찾을 수 없는 경우 `false` 를 반환한다.

### pluck

`pluck` 함수를 사용하면 하나의 키와 여러 맵을 제공하고 모든 일치 항목의 목록을 
가져올 수 있다.

```
pluck "name1" $myDict $myOtherDict
```

위는 발견된 모든 값 (`[value1 otherValue1]`)을 
포함하는 `list` 를 반환한다.

지정된 키가 맵에서 발견되지 _않으면_ 해당 맵은 
목록에 항목이 없는 것이며 반환 된 목록의 길이는 `pluck` 호출의 
딕셔너리 수보다 적게 된다.

만약 키가 _발견되었는데_ 그 값이 빈 값이면 해당 값이 
삽입된다.

헬름 템플릿에서는 일반적으로, 사전 모음에서 첫 번째 일치하는 키를 가져오기 위해
`pluck ... | first` 와 같이 사용한다.

### merge, mustMerge

둘 이상의 사전을 하나로 병합하여 대상 사전에 우선 순위를 
부여한다.

```
$newdict := merge $dest $source1 $source2
```

이것은 전체 병합 작업이지만 전체 복사 작업은 아니다. 
병합되어 중첩된 개체는 두 딕셔너리에서 동일한 인스턴스이다. 
병합과 함께 깊은 복사(deep copy)를 원하면 병합하면서 `deepCopy` 기능을 사용하자. 
예를 들면

```
deepCopy $source | merge $dest
```

`mustMerge` 는 병합에 실패한 경우 오류를 반환한다.

### mergeOverwrite, mustMergeOverwrite

둘 이상의 사전을 하나로 병합하여 **오른쪽에서 왼쪽으로** 우선 순위를 지정하여 
대상 사전의 값을 효과적으로 덮어쓴다.

아래의 경우

```
dst:
  default: default
  overwrite: me
  key: true

src:
  overwrite: overwritten
  key: false
```

결과는 다음과 같다.

```
newdict:
  default: default
  overwrite: overwritten
  key: false
```

```
$newdict := mergeOverwrite $dest $source1 $source2
```

이것은 전체 병합 작업이지만 전체 복사 작업은 아니다. 
병합되어 중첩된(nested) 객체는 두 딕셔너리에서 동일한 인스턴스이다. 
병합과 함께 깊은 복사(deep copy)를 원하면 병합할 때 `deepCopy` 기능을 사용하자. 
예를 들면,

```
deepCopy $source | mergeOverwrite $dest
```

병합에 실패한 경우 `mustMergeOverwrite` 는 오류를 반환한다.

### keys

`keys` 함수는 하나 이상의 `dict` 유형에 있는 모든 키의 `list` 를 반환한다. 
딕셔너리는 _정렬되어 있지 않으므로_ 키는 예측 가능한 순서가 아니다. 
`sortAlpha` 로 정렬할 수 있다.

```
keys $myDict | sortAlpha
```

여러 딕셔너리를 제공할 때 키들은 결합된다(concatenated). `sortAlpha` 와 
함께 `uniq` 함수를 사용하여 정렬된 키 목록을 얻을 수 있다.

```
keys $myDict $myOtherDict | uniq | sortAlpha
```

### pick

`pick` 함수는 사전에서 주어진 키만 선택하여 
새로운 `dict` 를 만든다.

```
$new := pick $myDict "name1" "name2"
```

위 결과는 `{name1 : value1, name2 : value2}` 를 반환한다.

### omit

`omit` 함수는 주어진 키와 일치하지 _않는_ 모든 키가 포함된 
새로운 `dict` 를 반환한다는 점을 제외하면 `pick` 과 유사하다.

```
$new := omit $myDict "name1" "name3"
```

위 결과는 `{name2: value2}` 를 반환한다.

### values

`values` 함수는 원본 `dict` 의 모든 값이 포함된 새로운 
`list` 를 반환한다는 점을 제외하면 `keys` 와 유사하다(오직 하나의 딕셔너리만 지원).

```
$vals := values $myDict
```

위 결과는 `list [ "value1", "value2", "value 3"]` 를 반환한다. 
`values` 함수는 결과에 대한 순서를 보장하지 않는다.
필요시에는 `sortAlpha` 를 사용하자.

### deepCopy, mustDeepCopy

`deepCopy` 및 `mustDeepCopy` 함수는 값을 가져와 
값의 깊은 복사본(deep copy)을 만든다. 여기에는 딕셔너리 등 다른 구조가 포함된다. 
문제가 있으면 `deepCopy` 의 경우 패닉이 발생하며,
`mustDeepCopy` 는 오류가 있을 때 템플릿 시스템에 오류를 반환한다.

```
dict "a" 1 "b" 2 | deepCopy
```

### Dict 내부에 대한 참고 사항

`dict` 는 Go에서 `map[string] interface{}` 으로 구현된다. 
Go 개발자는 `map[string] interface{}` 값을 컨텍스트에 전달하여 
템플릿에서 `dict` 로 사용하도록 할 수 있다.

## 인코딩 함수

헬름에는 다음과 같은 인코딩 및 디코딩 기능이 있다.

- `b64enc`/`b64dec`: Base64로 인코딩 또는 디코딩
- `b32enc`/`b32dec`: Base32로 인코딩 또는 디코딩

## 목록 및 목록 함수

헬름은 임의의 순차적 데이터 목록을 포함할 수 있는 간단한 `리스트` 형을 
제공한다. 이것은 배열 또는 슬라이스와 유사하지만 목록은 변경 불가능한 
데이터 유형으로 사용되도록 설계되었다.

정수의 목록을 생성해보자.

```
$myList := list 1 2 3 4 5
```

위 결과는 `[1 2 3 4 5]` 의 목록을 생성한다.

헬름은 다음의 함수 목록을 제공한다. [append
(mustAppend)](#append-mustappend), [compact
(mustCompact)](#compact-mustcompact), [concat](#concat), [first
(mustFirst)](#first-mustfirst), [has (mustHas)](#has-musthas), [initial
(mustInitial)](#initial-mustinitial), [last (mustLast)](#last-mustlast),
[prepend (mustPrepend)](#prepend-mustprepend), [rest
(mustRest)](#rest-mustrest), [reverse (mustReverse)](#reverse-mustreverse),
[seq](#seq), [slice (mustSlice)](#slice-mustslice), [uniq
(mustUniq)](#uniq-mustuniq), [until](#until), [untilStep](#untilstep),
[without (mustWithout)](#without-mustwithout).

### first, mustFirst

목록에서 머리부분 항목을 얻어 오려면 `first` 를 사용하자.

`first $myList` 는 `1` 를 반환한다.

문제가 있으면 `first` 는 패닉이 발생하며, `mustFirst` 의 경우 문제가 있으면 
템플릿 엔진에 오류를 반환한다.

### rest, mustRest

목록의 꼬리부분(첫 번째 항목을 제외한 모든 항목)을 얻으려면 `rest` 를 사용하자.

`rest $myList` 는 `[2 3 4 5]` 반환한다.

문제가 있으면 `rest` 는 패닉이 발생하며, `mustRest` 는 
문제가 있으면 템플릿 엔진에 오류를 반환한다.

### last, mustLast

목록의 마지막 항목을 가져 오려면 `last` 를 사용하자.

`last $myList` 는 `5` 를 반환한다.
이것은 목록을 뒤집은 다음 `first` 를 호출하는 것과 거의 유사하다.

### initial, mustInitial

이 함수는 마지막 요소를 _제외한_ 모든 요소를 반환함으로써 `last` 를 보완한다. 
`initial $myList` 는 `[1 2 3 4]` 를 반환한다.

문제가 있으면 `initial` 은 패닉이 발생하고 `mustInitial` 의 경우, 
템플릿 엔진에 오류를 반환한다.

### append, mustAppend

기존 목록에 새 항목을 추가하여 새 목록을 만든다.

```
$new = append $myList 6
```

위의 경우 `$new` 를 `[1 2 3 4 5 6]` 로 설정한다. `$myList` 는 변경되지 않는다.

문제가 있으면 `append` 는 패닉이 발생하며 `mustAppend` 의 경우, 
문제가 있으면 템플릿 엔진에 오류를 반환한다.

### prepend, mustPrepend

요소를 목록의 맨 앞으로 밀어 새 목록을 만든다.

```
prepend $myList 0
```

위의 경우 `[0 1 2 3 4 5]` 가 생성된다. `$myList` 는 변경되지 않는다.

문제가 있을 경우 `prepend` 는 패닉이 발생하며 `mustPrepend` 는 
문제가 있을 경우 템플릿 엔진에 오류를 반환한다.

### concat

임의의 수의 목록을 하나로 결합한다.

```
concat $myList ( list 6 7 ) ( list 8 )
```

위의 경우 `[1 2 3 4 5 6 7 8]` 이 생성된다. `$myList` 는 변경되지 않는다.

### reverse, mustReverse

주어진 목록의 반전 된 요소로 새 목록을 생성한다.

```
reverse $myList
```

위의 경우 `[5 4 3 2 1]` 목록이 반환된다.

`reverse` 는 문제가 있으면 패닉이 발생하고
`mustReverse` 는 문제가 있으면 템플릿 엔진에 오류를 반환한다.

### uniq, mustUniq

모든 중복 항목이 제거 된 목록을 생성한다.

```
list 1 1 1 2 | uniq
```

위의 경우 `[1 2]` 가 생성된다.

문제가 있으면 `uniq` 는 패닉이 발생하고 
`mustUniq` 는 문제가 있으면 템플릿 엔진에 오류를 반환한다.

### without, mustWithout

`without` 함수는 목록에서 항목을 필터링한다.

```
without $myList 3
```

위의 경우`[1 2 4 5]` 가 생성된다.

without 의 경우 하나 이상의 필터를 사용할 수도 있다.

```
without $myList 1 3 5
```

그러면 `[2 4]` 가 생성된다.

문제가 있으면 `without` 의 경우 패닉이 발생하고
`mustWithout` 의 경우는 문제가 있으면 템플릿 엔진에 오류를 반환한다.

### has, mustHas

목록에 특정 요소가 있는지를 테스트한다.

```
has 4 $myList
```

위의 경우 `true` 를 반환하고 `has "hello" $myList` 는 false를 반환한다.

문제가 있으면 `has` 는 패닉이 발생하고 `mustHas` 는 문제가 있으면 템플릿 엔진에 
오류를 반환한다.

### compact, mustCompact

목록을 승인하고 값이 비어있는 항목을 제거한다.

```
$list := list 1 "a" "foo" ""
$copy := compact $list
```

`compact` 는 비어 있는 항목(즉, "")이 제거된 새 목록을 반환한다.

문제가 있는 경우 `compact` 는 패닉이 발생하고 
`mustCompact` 의 경우 템플릿 엔진에 오류를 반환한다.

### slice, mustSlice

목록의 일부 요소를 가져 오려면 `slice list [n] [m]` 을 사용하자. `list [n : m]` 과도 
동일하다.

- `slice $myList` 는 `[1 2 3 4 5]` 을 반환한다. `myList[:]` 와 동일하다.
- `slice $myList 3` 는 `[4 5]` 을 반환한다. `myList[3:]` 와 동일하다.
- `slice $myList 1 3` 는 `[2 3]` 을 반환한다. `myList[1:3]` 와 동일하다.
- `slice $myList 0 3` 는 `[1 2 3]` 을 반환한다. `myList[:3]` 와 동일하다.

문제가 있으면 `slice` 는 패닉이 발생하며, `mustSlice` 는 문제가 있으면 
템플릿 엔진에 오류를 반환한다.

### until

`until` 함수는 정수 범위를 만든다.

```
until 5
```

위 결과로 `[0, 1, 2, 3, 4]` 목록을 생성한다.

이것은 `range $i, $e := until 5` 로 반복할 때 유용하다.

### untilStep

`until` 과 마찬가지로 `untilStep` 은 지표로서의 정수 목록을 생성한다. 
또한 시작 지표, 끝 지표 및 지표 증분을 정의 할 수 있다.

```
untilStep 3 6 2
```

위의 코드는 3으로 시작하여 6보다 크거나 같을 때까지 2를 더하여 
`[3 5]` 를 생성한다. 이것은 파이썬의 `range` 함수와 유사하다.

### seq

bash 셸의 `seq` 명령어와 유사하게 작동한다.

* 1 개의 매개 변수 (끝) - 1과 `끝` 사이의 
  모든 지표 정수를 생성.
* 2 개의 매개 변수 (시작, 끝) - `start` 와 `end` 사이에 1 씩 
  증가 또는 감소하는 모든 지표 정수를 생성.
* 3 개의 매개 변수 (시작, 증분, 끝) - `start` 와 `end` 사이의 모든 
  지표 정수 (`step` 단위 증가 또는 감소 포함)를 생성합니다.

```
seq 5       => 1 2 3 4 5
seq -3      => 1 0 -1 -2 -3
seq 0 2     => 0 1 2
seq 2 -2    => 2 1 0 -1 -2
seq 0 2 10  => 0 2 4 6 8 10
seq 0 -2 -5 => 0 -2 -4
```

## 수학 함수

모든 수학 함수는 달리 지정하지 않는 한 `int64` 값으로 작동한다.

다음의 수학 함수를 사용할 수 있다: [add](#add), [add1](#add1),
[ceil](#ceil), [div](#div), [floor](#floor), [len](#len), [max](#max),
[min](#min), [mod](#mod), [mul](#mul), [round](#round), [sub](#sub).

### add

몇 개의 숫자를 더한다. 2개나 그 이상의 입력도 허용된다.

```
add 1 2 3
```

### add1

1만큼 증가시키려면 `add1` 을 사용하자.

### sub

빼려면 `sub` 를 사용한다.

### div

`div` 로 정수 나누기를 수행한다.

### mod

`mod` 로 모듈로 연산을 수행한다.

### mul

`mul` 로 곱하기 연산을 수행한다. 2개 이상의 입력을 허용한다.

```
mul 1 2 3
```

### max

일련의 정수중 가장 큰 값을 반환한다.

아래의 경우 `3` 을 반환한다.

```
max 1 2 3
```

### min

일련의 정수중 가장 작 값을 반환한다.

아래의 경우 `1` 을 반환한다.

### floor

입력 값보다 작거나 같은 가장 큰 부동 소수점 값을 출력한다.

`floor 123.9999` 의 경우 `123.0` 을 반환한다.

### ceil

입력 값보다 크거나 같은 가장 작은 부동 소수점 값을 출력한다.

`ceil 123.001` 의 경우 `124.0` 을 반환한다.

### round

반올림하여, 주어진 소수점의 자리수를 갖는 부동 소수점 값을 
반환한다.

`round 123.555555 3` 의 경우 `123.556` 을 반환한다.

### len

인수의 길이를 정수로 반환한다.

```
len .Arg
```

## 네트워크 함수

헬름에는 `getHostByName` 하나의 네트워크 함수가 있다.

`getHostByName` 은 도메인 이름을 받고 IP 주소를 반환한다.

```
getHostByName "www.google.com" would return the corresponding ip address of www.google.com
```

## 파일 경로 함수

헬름 템플릿 함수는 파일 시스템에 대한 액세스 권한을 부여하지 않지만 
파일 경로 규칙을 따르는 문자열 작업을위한 함수 를 제공한다. 
여기에는 [base] (# base), [clean] (# clean), 
[dir] (# dir), [ext] (# ext) 및 [isAbs] (# isabs)가 포함된다.

### base

경로의 마지막 요소를 반환한다.

```
base "foo/bar/baz"
```

위 결과는 "baz" 를 반환한다.

### dir

경로의  마지막 부분을 제거하여 디렉토리를 반환한다. 따라서 `dir "foo/bar/baz"` 
는 `foo/bar` 를 반환한다.

### clean

경로를 삭제한다.

```
clean "foo/bar/../baz"
```

위 결과는 `..` 을 찾아서 `foo/baz` 를 반환한다.

### ext

파일의 확장자를 반환한다.

```
ext "foo.bar"
```

위 결과는 `.bar` 를 반환한다.

### isAbs

파일 경로가 절대경로인지 확인하려는 경우 `isAbs` 를 사용한다.

## 리플렉션 함수

헬름은 기초적인 리플렉션 도구를 제공한다. 
이는 고급 템플릿 개발자가 특정 값에 대한 기본 Go 유형 정보를 이해하는 데 도움이 된다.
헬름은 Go로 작성되었으며 강타입 언어이다. 타입 시스템은 템플릿 내에서 
적용된다.

Go 에는 `string`, `slice`, `int64`, `bool` 과 같은 몇 가지 기본(primitive) _유형(kind)_ 이 있다.

Go 에는 개발자가 자신의 자료형을 만들 수 있는 개방형 _자료형_ 체계가 있다.

헬름은 [유형 함수](#유형-함수) 및 [타입 함수](#타입-함수)을 통해 
각각에 대한 함수 집합을 제공한다. 
값과 비교하기 위해 [deepEqual](#deepequal) 함수도 제공된다.

### 유형 함수

유형 함수에는 두 가지가 있다. `kindOf` 는 객체의 유형을 반환한다.

```
kindOf "hello"
```

위는 `string` 을 반환한다. (`if` 블록과 같은) 간단한 테스트의 경우 
`isKind` 함수를 사용하면 값이 특정 유형인지 확인할 수 있다.

```
kindIs "int" 123
```

위 결과는 `true` 를 반환한다.

### 타입 함수

타입은 다루기가 약간 더 어렵기에, 타입 함수는 총 3가지가 있다. 

- `typeOf` 는 값의 기본 타입을 반환한다. 예) `typeOf $foo`
- `typeIs` 는 `kindIs` 와 비슷하지만, 타입에 대한 것이다. 예) `typeIs "*io.Buffer" $myVal`
- `typeIsLike` 는 포인터를 역참조한다는 점을 제외하면 `typeIs` 처럼 동작한다.

**참고:** 이 중 어느 것도 주어진 인터페이스를 구현하는지 
여부를 테스트할 수는 없다. 그렇게 하려면 인터페이스를 미리 컴파일해야
하기 때문이다.

### deepEqual

`deepEqual` 은 두 값이 
["깊은 같음"](https://golang.org/pkg/reflect/#DeepEqual)이면 true를 반환한다.

비-기본(non-primitive) 타입에서도 동작한다. (내장된 `eq`와 비교된다.)

```
deepEqual (list 1 2 3) (list 1 2 3)
```

위 결과는 `true` 를 반환한다.

## 유의적 버전 함수

일부 버전 체계는 쉽게 구문을 분석하고 비교할 수 있다. 
헬름은 [유의적 버전 2] (http://semver.org) 버전 작업을 위한 기능을 제공한다. 
여기에는 [semver](#semver) 및 [semverCompare](#semvercompare)가 포함된다. 
아래에서 비교를 위해 범위를 사용하는 방법에 대한 세부 정보도 찾을 수 있다.

### semver

`semver` 함수는 문자열을 유의적 버전으로 구문 분석한다.

```
$version := semver "1.2.3-alpha.1+123"
```

_파서가 실패하면 템플릿 실행이 오류와 함께 중지된다._

이 시점에서 `$version` 은 다음 속성을 가진 `Version` 객체에 대한 
포인터이다.

- `$version.Major` : 주 번호 (위의 `1`)
- `$version.Minor` : 부 번호 (위의 `2`)
- `$version.Patch` : 패치 번호 (위의 `3`)
- `$version.Prerelease` : 프리 릴리스 (위의 `alpha.1`)
- `$version.Metadata` : 빌드 메타 데이터 (위의 `123`)
- `$version.Original` : 문자열로 된 원본 버전

또한 `Compare` 함수를 사용하여 `버전` 을 다른 `버전` 과 비교할 수 
있다.

```
semver "1.4.3" | (semver "1.2.3").Compare
```

위 결과는 `-1` 을 반환한다.

반환 값은 다음과 같다.

- 주어진 유의적 버전이 `Compare` 메소드로 호출된 
  유의적 버전보다 큰 경우 `-1`
- `Compare` 함수로 호출 된 버전이 더 큰 경우 `1`.
- 동일한 버전인 경우 `0`

(유의적 버전에서는 버전 비교 작업 중 `Metadata` 필드는 비교되지 않는 것에 
유의하자.)

### semverCompare

보다 강력한 비교 기능은 `semverCompare` 를 통해 제공된다. 
이 버전은 버전의 범위를 지원한다.

- `semverCompare "1.2.3" "1.2.3"` 은 정확히 일치하는지 확인합니다.
- `semverCompare "^ 1.2.0" "1.2.3"` 은 주 버전과 부 버전이 일치하는지, 
  두 번째 버전의 패치 번호가 첫 번째 매개 변수보다 크거나 같은지 
  확인한다.

SemVer 함수는 Sprig 제작자의 
[Masterminds semver 라이브러리] (https://github.com/Masterminds/semver)를 사용한다.

### 기본 비교

비교에는 두 가지 요소가 있다. 
첫째, 비교 문자열은 공백 또는 쉼표로 구분 된 AND 비교 목록이다. 
그런 다음 || (OR) 비교로 구분된다. 
예를 들어 `"> = 1.2 <3.0.0 ||> = 4.2.3"` 은 
1.2보다 크거나 같고 3.0.0보다 작거나 4.2.3보다 크거나 같은지를 비교한다.

기본 비교는 다음과 같다.

- `=` : 같음 (연산자 없음으로 별칭 지정)
- `! =` : 같지 않음
- `>` : 보다 큼
- `<` : 보다 작음
- `> =` : 보다 크거나 같음
- `<=` : 보다 작거나 같음

_참고로, 유의적 버전 사양에 따라 프리 릴리스는 
해당 릴리스의 대응하는 부분의 API를 준수하지 않을 수도 있다._

### 프리 릴리스 버전으로 작업하기

익숙하지 않은 사용자를 위해 프리-릴리스는, 안정된 릴리스 또는 일반적으로 
사용 가능한 릴리스 이전의 소프트웨어 릴리스에 사용된다. 
프리-릴리스의 예로는 개발, 알파, 베타 및 릴리스 후보 릴리스가 있다. 
프리 릴리스는 `1.2.3-beta.1` 와 같은 버전 일 수 있고 안정된 릴리스는 `1.2.3` 이 될 수 있다. 
우선 순위에 따라 프리 릴리스가 관련 릴리스보다 먼저 나온다. 
이 예에서는 `1.2.3-beta.1 <1.2.3` 이다.

유의적 버전 사양에 따라 프리 릴리스는 
해당 릴리스의 대응하는 부분의 API를 준수하지 않을 수도 있다.

> 프리-릴리스 버전은 버전이 불안정하고 
> 관련 일반 버전에 표시된대로 의도 된 호환성 요구 사항을 
> 충족하지 않을 수 있음을 나타낸다.

프리-릴리스 버전을 비교하지 않고 제약 조건을 사용하는 유의적 버전의 비교는 프리-릴리스 버전을 건너 뛴다. 
예를 들어 `>=1.2.3` 은 출시 목록을 볼 때 프리 릴리스를 건너 뛰고 
`>=1.2.3-0` 은 프리 릴리스를 평가하고 찾는다.

비교의 예에서 `0` 이 출시 전 버전인 이유는 
사양에 따라 출시 전 버전에 ASCII 영문/숫자 및 하이픈 (`.` 구분 기호 포함)만 
포함할 수 있기 때문이다. 
정렬은 사양에 따라 ASCII 정렬 순서로 발생한다. 
가장 낮은 문자는 ASCII 정렬 순서로 `0` 이다([ASCII 테이블](http://www.asciitable.com/) 참조).

ASCII 정렬 순서를 이해하는 것은 A-Z가 a-z 앞에 오기 때문에 중요하다. 
즉, `>=1.2.3-BETA` 는 `1.2.3-alpha` 를 반환한다. 
대소문자는 구분되지 않는다.
이것은 지정된 ASCII 정렬 순서 때문이다.

### 하이픈 범위 비교

범위를 처리하는 방법은 여러 가지가 있으며, 첫 번째 방법은 하이픈 범위이다.
다음과 같다.

- `1.2 - 1.4.5` 는 `>= 1.2 <= 1.4.5` 과 동일하다.
- `2.3.4 - 4.5` 는 `>= 2.3.4 <= 4.5` 과 동일하다.

### 비교에서의 와일드카드

`x` , `X` , `*` 문자는 와일드 카드 문자로 사용할 수 있다. 
이것은 모든 비교 연산자에 적용된다. 
`=` 연산자에 사용하면 패치 수준의 비교로 돌아간다 (아래 물결표 참조). 예를 들면

- `1.2.x` 는 `>= 1.2.0, < 1.3.0` 과 동일하다.
- `>= 1.2.x` 는 `>= 1.2.0` 과 동일하다.
- `<= 2.x` 는 `< 3` 과 동일하다.
- `*` 는 `>= 0.0.0` 과 동일하다.

### 물결표 범위 비교 (패치)

물결표 (`~`) 비교 연산자는 부 버전이 지정되면 
패치 수준 범위에 사용되며 부 번호가 누락되면 주 수준이 변경된다. 
예를 들면,

- `~1.2.3` 는 `>= 1.2.3, < 1.3.0` 과 동일하다.
- `~1` 는 `>= 1, < 2` 과 동일하다.
- `~2.3` 는 `>= 2.3, < 2.4` 과 동일하다.
- `~1.2.x` 는 `>= 1.2.0, < 1.3.0` 과 동일하다.
- `~1.x` 는 `>= 1, < 2` 과 동일하다.

### 캐럿 범위 비교 (주)

캐럿 (`^`) 비교 연산자는 안정적인 (1.0.0) 릴리스가 발생했을 때 
주요 레벨 변경을 위한 것이다. 
1.0.0 릴리스 이전에는 부 버전이 API 안정성 수준으로 작동한다. 
API 버전을 비교할 때 주요 변경 사항이 API 중단일 때 유용하다. 예를 들면,

- `^1.2.3` 는 `>= 1.2.3, < 2.0.0` 과 동일하다.
- `^1.2.x` 는 `>= 1.2.0, < 2.0.0` 과 동일하다.
- `^2.3` 는 `>= 2.3, < 3` 과 동일하다.
- `^2.x` 는 `>= 2.0.0, < 3` 과 동일하다.
- `^0.2.3` 는 `>=0.2.3 <0.3.0` 과 동일하다.
- `^0.2` 는 `>=0.2.0 <0.3.0` 과 동일하다.
- `^0.0.3` 는 `>=0.0.3 <0.0.4` 과 동일하다.
- `^0.0` 는 `>=0.0.0 <0.1.0` 과 동일하다.
- `^0` 는 `>=0.0.0 <1.0.0` 과 동일하다.

## URL 함수

헬름에는 [urlParse](#urlparse), [urlJoin](#urljoin) 및 [urlquery](#urlquery) 함수가 
포함되어있어 URL 부분으로 작업 할 수 있다다.

### urlParse

URL에 대한 문자열을 구문 분석하고 URL 부분으로 딕셔너리를 생성한다.

```
urlParse "http://admin:secret@server.com:8080/api?list=false#anchor"
```

위는 URL 객체를 포함하는 딕셔너리를 반환한다.

```yaml
scheme:   'http'
host:     'server.com:8080'
path:     '/api'
query:    'list=false'
opaque:   nil
fragment: 'anchor'
userinfo: 'admin:secret'
```

이것은 Go 표준 라이브러리의 URL 패키지를 사용하여 구현된다. 
자세한 내용은 https://golang.org/pkg/net/url/#URL을 확인하자.

### urlJoin

(`urlParse`에서 생성된) 맵을 결합하여 URL 문자열을 생성한다.

```
urlJoin (dict "fragment" "fragment" "host" "host:80" "path" "/path" "query" "query" "scheme" "http")
```

위는 다음 문자열을 반환한다.
```
http://host:80/path?query#fragment
```

### urlquery

URL의 쿼리 부분에 포함하기에 적합하도록 인수로 전달된 값의 
이스케이프된 버전을 반환한다.

```
$var := urlquery "string for query"
```

## UUID 함수

헬름은 UUID v4 범용 고유 ID를 생성할 수 있다.

```
uuidv4
```

위는 v4 (무작위 생성) 유형의 새 UUID를 반환한다.

## 쿠버네티스 및 차트 함수

헬름에는 
[.Capabilities.APIVersions.Has](#capabilitiesapiversionshas), [Files](#파일-함수), [lookup](#lookup) 등 
쿠버네티스 작업을 위한 함수가 포함되어 있다.

### lookup

`lookup` 은 실행중인 클러스터에서 리소스를 조회하는 데 사용된다. 
`helm template` 명령어와 함께 사용하면 항상 빈 응답을 반환한다.

[조회 함수에 대한 문서](/chart_template_guide/functions_and_pipelines.md#lookup-함수-사용하기)에서 
자세한 내용을 확인할 수 있다.

### .Capabilities.APIVersions.Has

클러스터에서 API 버전 또는 리소스를 사용할 수 있는지에 대한 여부를 반환한다.

```
.Capabilities.APIVersions.Has "apps/v1"
.Capabilities.APIVersions.Has "apps/v1/Deployment"
```

더 많은 정보는 [내장 객체 문서](/chart_template_guide/builtin_objects.md)에서 
확인할 수 있다.

### 파일 함수

차트 내에서 비 특수 파일을 얻을 수 있는 함수가 몇 가지 있다. 
예를 들면, 애플리케이션 구성 파일에 액세스하는 것이다. 
이는 [템플릿 내 파일 액세스](/chart_template_guide/accessing_files.md)에 설명되어 있다.

_ 참고로, 이렇게 많은 함수들에 대한 문서화는 
[Sprig](https://github.com/Masterminds/sprig)로 이루어졌다.
Sprig은 Go 애플리케이션에서 사용할 수 있는 템플릿 함수 라이브러리이다._
