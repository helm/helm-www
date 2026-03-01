---
title: Controle de Fluxo
description: Uma visão rápida sobre a estrutura de fluxo dentro dos templates.
sidebar_position: 7
---

Estruturas de controle (chamadas de "actions" na terminologia de templates)
fornecem a você, o autor do template, a capacidade de controlar o fluxo de
geração de um template. A linguagem de template do Helm oferece as seguintes
estruturas de controle:

- `if`/`else` para criar blocos condicionais
- `with` para especificar um escopo
- `range`, que fornece um loop no estilo "for each"

Além destas, ela fornece algumas actions para declarar e usar segmentos
de template nomeados:

- `define` declara um novo template nomeado dentro do seu template
- `template` importa um template nomeado
- `block` declara um tipo especial de área de template preenchível

Nesta seção, falaremos sobre `if`, `with` e `range`. Os outros são
abordados na seção "Templates Nomeados" mais adiante neste guia.

## If/Else

A primeira estrutura de controle que veremos é para incluir condicionalmente
blocos de texto em um template. Este é o bloco `if`/`else`.

A estrutura básica de uma condicional é assim:

```
{{ if PIPELINE }}
  # Faça algo
{{ else if OTHER PIPELINE }}
  # Faça outra coisa
{{ else }}
  # Caso padrão
{{ end }}
```

Note que agora estamos falando sobre _pipelines_ em vez de valores. O motivo
é deixar claro que estruturas de controle podem executar um pipeline inteiro,
não apenas avaliar um valor.

Um pipeline é avaliado como _false_ se o valor for:

- um booleano false
- um zero numérico
- uma string vazia
- um `nil` (vazio ou nulo)
- uma coleção vazia (`map`, `slice`, `tuple`, `dict`, `array`)

Em todas as outras condições, a condição é verdadeira.

Vamos adicionar uma condicional simples ao nosso ConfigMap. Adicionaremos
outra configuração se a bebida estiver definida como coffee:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

Como comentamos `drink: coffee` no nosso último exemplo, a saída não
deve incluir a flag `mug: "true"`. Mas se adicionarmos essa linha de volta
ao nosso arquivo `values.yaml`, a saída deve ficar assim:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## Controlando Espaços em Branco

Enquanto olhamos para condicionais, devemos dar uma olhada rápida na forma
como os espaços em branco são controlados em templates. Vamos pegar o exemplo
anterior e formatá-lo para ser um pouco mais fácil de ler:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

Inicialmente, isso parece bom. Mas se passarmos pelo motor de template, teremos
um resultado infeliz:

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

O que aconteceu? Geramos YAML incorreto por causa dos espaços em branco acima.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

`mug` está indentado incorretamente. Vamos apenas remover a indentação
dessa linha e executar novamente:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

Quando enviarmos isso, obteremos um YAML que é válido, mas ainda parece
um pouco estranho:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

Note que recebemos algumas linhas vazias no nosso YAML. Por quê? Quando o
motor de template executa, ele _remove_ o conteúdo dentro de `{{` e `}}`,
mas deixa os espaços em branco restantes exatamente como estão.

O YAML atribui significado aos espaços em branco, então gerenciar os espaços
em branco se torna bastante importante. Felizmente, os templates do Helm têm
algumas ferramentas para ajudar.

Primeiro, a sintaxe de chaves das declarações de template pode ser modificada
com caracteres especiais para instruir o motor de template a consumir espaços
em branco. `{{- ` (com o hífen e espaço adicionados) indica que os espaços em
branco à esquerda devem ser consumidos, enquanto ` -}}` significa que os
espaços em branco à direita devem ser consumidos. _Cuidado! Quebras de linha
são espaços em branco!_

> Certifique-se de que há um espaço entre o `-` e o resto da sua diretiva.
> `{{- 3 }}` significa "remover espaços à esquerda e imprimir 3" enquanto
> `{{-3 }}` significa "imprimir -3".

Usando essa sintaxe, podemos modificar nosso template para eliminar essas
novas linhas:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

Apenas para deixar esse ponto claro, vamos ajustar o texto acima e
substituir um `*` para cada espaço em branco que será removido seguindo
esta regra. Um `*` no final da linha indica um caractere de nova linha
que seria removido

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

Tendo isso em mente, podemos executar nosso template através do Helm e
ver o resultado:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

Tenha cuidado com os modificadores de remoção de espaços. É fácil
acidentalmente fazer coisas assim:

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

Isso produzirá `food: "PIZZA"mug: "true"` porque consumiu as novas linhas
em ambos os lados.

> Para detalhes sobre controle de espaços em branco em templates, veja a
> [documentação oficial de templates do Go](https://godoc.org/text/template)

Finalmente, às vezes é mais fácil dizer ao sistema de templates como indentar
para você em vez de tentar dominar o espaçamento das diretivas de template.
Por essa razão, você pode às vezes achar útil usar a função `indent`
(`{{ indent 2 "mug:true" }}`).

## Modificando o Escopo com `with`

A próxima estrutura de controle a ser analisada é a action `with`. Ela controla
o escopo de variáveis. Lembre-se de que `.` é uma referência ao _escopo atual_.
Então `.Values` diz ao template para encontrar o objeto `Values` no escopo
atual.

A sintaxe do `with` é similar a uma instrução `if` simples:

```
{{ with PIPELINE }}
  # escopo restrito
{{ end }}
```

Escopos podem ser alterados. `with` permite que você defina o escopo atual (`.`)
para um objeto específico. Por exemplo, estivemos trabalhando com
`.Values.favorite`. Vamos reescrever nosso ConfigMap para alterar o escopo de `.`
para apontar para `.Values.favorite`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

Note que removemos a condicional `if` do exercício anterior porque agora ela
é desnecessária - o bloco após `with` só é executado se o valor de `PIPELINE`
não for vazio.

Observe que agora podemos referenciar `.drink` e `.food` sem qualificá-los.
Isso porque a instrução `with` define `.` para apontar para `.Values.favorite`.
O `.` é redefinido para seu escopo anterior após `{{ end }}`.

Mas aqui vai uma nota de cautela! Dentro do escopo restrito, você não poderá
acessar os outros objetos do escopo pai usando `.`. Por exemplo, isso falhará:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Isso produzirá um erro porque `Release.Name` não está dentro do escopo
restrito de `.`. No entanto, se trocarmos as duas últimas linhas, tudo
funcionará como esperado porque o escopo é redefinido após `{{ end }}`.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

Ou, podemos usar `$` para acessar o objeto `Release.Name` do escopo pai.
`$` é mapeado para o escopo raiz quando a execução do template começa e
não muda durante a execução do template. O seguinte também funcionaria:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

Depois de ver `range`, daremos uma olhada nas variáveis de template, que
oferecem uma solução para o problema de escopo acima.

## Iterando com a Action `range`

Muitas linguagens de programação têm suporte para iteração usando loops `for`,
loops `foreach` ou mecanismos funcionais similares. Na linguagem de template
do Helm, a forma de iterar através de uma coleção é usar o operador `range`.

Para começar, vamos adicionar uma lista de coberturas de pizza ao nosso
arquivo `values.yaml`:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
  - pineapple
```

Agora temos uma lista (chamada de `slice` em templates) de `pizzaToppings`.
Podemos modificar nosso template para imprimir essa lista no nosso ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

Podemos usar `$` para acessar a lista `Values.pizzaToppings` do escopo pai.
`$` é mapeado para o escopo raiz quando a execução do template começa e
não muda durante a execução do template. O seguinte também funcionaria:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

Vamos olhar mais de perto a lista `toppings:`. A função `range` irá
"iterar sobre" (percorrer) a lista `pizzaToppings`. Mas agora algo
interessante acontece. Assim como `with` define o escopo de `.`, um
operador `range` também faz isso. Cada vez que passa pelo loop, `.`
é definido para a cobertura de pizza atual. Ou seja, na primeira vez,
`.` é definido como `mushrooms`. Na segunda iteração, é definido como
`cheese`, e assim por diante.

Podemos enviar o valor de `.` diretamente para um pipeline, então quando
fazemos `{{ . | title | quote }}`, ele envia `.` para `title` (função que
coloca em título) e depois para `quote`. Se executarmos esse template,
a saída será:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

Agora, neste exemplo fizemos algo astuto. A linha `toppings: |-` está
declarando uma string de múltiplas linhas. Então nossa lista de coberturas
na verdade não é uma lista YAML. É uma grande string. Por que faríamos isso?
Porque os dados em `data` de ConfigMaps são compostos de pares chave/valor,
onde tanto a chave quanto o valor são strings simples. Para entender por que
é assim, dê uma olhada na
[documentação de ConfigMap do Kubernetes](https://kubernetes.io/docs/concepts/configuration/configmap/).
Para nós, porém, esse detalhe não importa muito.

> O marcador `|-` no YAML recebe uma string de múltiplas linhas. Essa pode ser
> uma técnica útil para incorporar grandes blocos de dados dentro dos seus
> manifests, como exemplificado aqui.

Às vezes é útil poder criar rapidamente uma lista dentro do seu template,
e depois iterar sobre essa lista. Os templates do Helm têm uma função para
facilitar isso: `tuple`. Em ciência da computação, uma tupla é uma coleção
semelhante a uma lista de tamanho fixo, mas com tipos de dados arbitrários.
Isso transmite aproximadamente a forma como um `tuple` é usado.

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

O código acima produzirá isso:

```yaml
  sizes: |-
    - small
    - medium
    - large
```

Além de listas e tuplas, `range` pode ser usado para iterar sobre coleções
que têm uma chave e um valor (como um `map` ou `dict`). Veremos como fazer
isso na próxima seção quando introduzirmos variáveis de template.
