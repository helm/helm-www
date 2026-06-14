---
title: "Apêndice: Técnicas de YAML"
description: Uma análise mais detalhada da especificação YAML e como ela se aplica ao Helm.
sidebar_position: 15
---

A maior parte deste guia foi focada em escrever a linguagem de template. Aqui,
vamos analisar o formato YAML. O YAML tem alguns recursos úteis que nós, como
autores de templates, podemos usar para tornar nossos templates menos propensos
a erros e mais fáceis de ler.

## Escalares e Coleções

De acordo com a [especificação YAML](https://yaml.org/spec/1.2/spec.html), existem dois
tipos de coleções e muitos tipos escalares.

Os dois tipos de coleções são mapas e sequências:

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

Valores escalares são valores individuais (em oposição a coleções)

### Tipos Escalares em YAML

No dialeto YAML do Helm, o tipo de dados escalar de um valor é determinado por um
conjunto complexo de regras, incluindo o schema do Kubernetes para definições de recursos.
Mas ao inferir tipos, as seguintes regras geralmente se aplicam.

Se um inteiro ou float for uma palavra simples sem aspas, ele é tipicamente tratado como um
tipo numérico:

```yaml
count: 1
size: 2.34
```

Mas se estiverem entre aspas, são tratados como strings:

```yaml
count: "1" # <-- string, não int
size: '2.34' # <-- string, não float
```

O mesmo vale para booleanos:

```yaml
isGood: true   # bool
answer: "true" # string
```

A palavra para um valor vazio é `null` (não `nil`).

Note que `port: "80"` é YAML válido e passará tanto pelo motor de template quanto
pelo parser YAML, mas falhará se o Kubernetes esperar que `port` seja um
inteiro.

Em alguns casos, você pode forçar uma inferência de tipo específica usando tags de tipo YAML:

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

No exemplo acima, `!!str` informa ao parser que `age` é uma string, mesmo que pareça
um int. E `port` é tratado como int, mesmo estando entre aspas.


## Strings em YAML

Grande parte dos dados que colocamos em documentos YAML são strings. O YAML tem mais de
uma maneira de representar uma string. Esta seção explica as diferentes formas e demonstra
como usar algumas delas.

Existem três formas "inline" de declarar uma string:

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

Todos os estilos inline devem estar em uma única linha.

- Palavras simples não têm aspas e não são escapadas. Por isso, você precisa ter
  cuidado com os caracteres que usa.
- Strings com aspas duplas podem ter caracteres específicos escapados com `\`. Por
  exemplo `"\"Hello\", she said"`. Você pode escapar quebras de linha com `\n`.
- Strings com aspas simples são strings "literais" e não usam `\` para escapar
  caracteres. A única sequência de escape é `''`, que é decodificada como um único
  `'`.

Além das strings de uma linha, você pode declarar strings de múltiplas linhas:

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

O exemplo acima tratará o valor de `coffee` como uma única string equivalente a
`Latte\nCappuccino\nEspresso\n`.

Note que a primeira linha após o `|` deve estar corretamente indentada. Então poderíamos
quebrar o exemplo acima fazendo isso:

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

Como `Latte` está incorretamente indentado, teríamos um erro como este:

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

Em templates, às vezes é mais seguro colocar uma "primeira linha" fictícia de conteúdo em um
documento de múltiplas linhas para proteção contra o erro acima:

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

Seja qual for essa primeira linha, ela será preservada na saída da
string. Então, se você estiver usando essa técnica para injetar o conteúdo de um arquivo
em um ConfigMap, o comentário deve ser do tipo esperado por
qualquer coisa que esteja lendo essa entrada.

### Controlando Espaços em Strings de Múltiplas Linhas

No exemplo acima, usamos `|` para indicar uma string de múltiplas linhas. Mas note
que o conteúdo da nossa string era seguido por um `\n` final. Se quisermos que o
processador YAML remova a nova linha final, podemos adicionar um `-` após o
`|`:

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

Agora o valor de `coffee` será: `Latte\nCappuccino\nEspresso` (sem o
`\n` final).

Outras vezes, podemos querer preservar todos os espaços em branco finais. Podemos fazer
isso com a notação `|+`:

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

Agora o valor de `coffee` será `Latte\nCappuccino\nEspresso\n\n\n`.

A indentação dentro de um bloco de texto é preservada e resulta na preservação
de quebras de linha também:

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

No caso acima, `coffee` será `Latte\n  12 oz\n  16
oz\nCappuccino\nEspresso`.

### Indentação e Templates

Ao escrever templates, você pode precisar injetar o conteúdo de
um arquivo no template. Como vimos em capítulos anteriores, existem duas maneiras de
fazer isso:

- Use `{{ .Files.Get "FILENAME" }}` para obter o conteúdo de um arquivo no chart.
- Use `{{ include "TEMPLATE" . }}` para renderizar um template e então colocar seu
  conteúdo no chart.

Ao inserir arquivos em YAML, é bom entender as regras de múltiplas linhas
acima. Frequentemente, a maneira mais fácil de inserir um arquivo estático é fazer algo
como isto:

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

Note como fazemos a indentação acima: `indent 2` instrui o motor de template a
indentar cada linha em "myfile.txt" com dois espaços. Note que não indentamos
essa linha de template. Isso porque, se fizéssemos, o conteúdo do arquivo da primeira linha
seria indentado duas vezes.

### Strings de Múltiplas Linhas Dobradas

Às vezes você quer representar uma string em seu YAML com múltiplas linhas, mas
quer que ela seja tratada como uma única linha longa quando interpretada. Isso é chamado
de "dobramento" (folding). Para declarar um bloco dobrado, use `>` em vez de `|`:

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

O valor de `coffee` acima será `Latte Cappuccino Espresso\n`. Note que todas
as quebras de linha, exceto a última, serão convertidas em espaços. Você pode combinar os
controles de espaço em branco com o marcador de texto dobrado, então `>-` substituirá ou removerá
todas as novas linhas.

Note que na sintaxe dobrada, indentar o texto fará com que as linhas sejam preservadas.

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

O exemplo acima produzirá `Latte\n  12 oz\n  16 oz\nCappuccino Espresso`. Note que
tanto o espaçamento quanto as novas linhas ainda estão lá.

## Incorporando Múltiplos Documentos em Um Arquivo

É possível colocar mais de um documento YAML em um único arquivo. Isso é
feito prefixando um novo documento com `---` e terminando o documento com
`...`

```yaml

---
document: 1
...
---
document: 2
...
```

Em muitos casos, tanto o `---` quanto o `...` podem ser omitidos.

Alguns arquivos no Helm não podem conter mais de um documento. Se, por exemplo, mais de
um documento for fornecido dentro de um arquivo `values.yaml`, apenas o primeiro será
usado.

Arquivos de template, no entanto, podem ter mais de um documento. Quando isso acontece, o
arquivo (e todos os seus documentos) é tratado como um objeto durante a renderização do template.
Mas então o YAML resultante é dividido em múltiplos documentos antes
de ser enviado ao Kubernetes.

Recomendamos usar múltiplos documentos por arquivo apenas quando for absolutamente
necessário. Ter múltiplos documentos em um arquivo pode ser difícil de depurar.

## YAML é um Superconjunto de JSON

Como YAML é um superconjunto de JSON, qualquer documento JSON válido _deve_ ser YAML válido.

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

O exemplo acima é outra forma de representar isto:

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

E os dois podem ser misturados (com cuidado):

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]
```

Todos os três devem resultar na mesma representação interna.

Embora isso signifique que arquivos como `values.yaml` podem conter dados JSON, o Helm
não trata a extensão de arquivo `.json` como um sufixo válido.

## Âncoras YAML

A especificação YAML fornece uma maneira de armazenar uma referência a um valor e depois referir-se
a esse valor por referência. O YAML chama isso de "ancoragem":

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

No exemplo acima, `&favoriteCoffee` define uma referência para `Cappuccino`. Depois, essa
referência é usada como `*favoriteCoffee`. Então `coffees` se torna `Latte, Cappuccino,
Espresso`.

Embora existam alguns casos em que âncoras são úteis, há um aspecto delas que
pode causar bugs sutis: Na primeira vez que o YAML é consumido, a
referência é expandida e depois descartada.

Então, se decodificássemos e depois recodificássemos o exemplo acima, o YAML resultante
seria:

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

Como o Helm e o Kubernetes frequentemente leem, modificam e depois reescrevem arquivos YAML, as
âncoras serão perdidas.
