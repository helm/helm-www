---
title: Subcharts e Valores Globais
description: Como trabalhar com subcharts e valores globais.
sidebar_position: 11
---

Até este ponto, trabalhamos apenas com um único chart. Mas charts podem ter
dependências, chamadas _subcharts_, que também possuem seus próprios values e
templates. Nesta seção, vamos criar um subchart e ver as diferentes formas de
acessar values dentro de templates.

Antes de entrarmos no código, há alguns detalhes importantes sobre subcharts
de aplicação:

1. Um subchart é considerado "independente", o que significa que um subchart
   nunca pode depender explicitamente de seu chart pai.
2. Por essa razão, um subchart não pode acessar os values de seu chart pai.
3. Um chart pai pode sobrescrever values para subcharts.
4. O Helm possui um conceito de _valores globais_ que podem ser acessados por
   todos os charts.

> Essas limitações não se aplicam necessariamente a [library charts](/topics/library_charts.md), que são projetados para fornecer funcionalidade auxiliar padronizada.

À medida que avançamos pelos exemplos desta seção, muitos desses conceitos
ficarão mais claros.

## Criando um Subchart

Para estes exercícios, vamos começar com o chart `mychart/` que criamos no
início deste guia e adicionar um novo chart dentro dele.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

Note que, assim como antes, excluímos todos os templates base para que possamos
começar do zero. Neste guia, estamos focados em como os templates funcionam, não
em gerenciar dependências. Mas o [Guia de Charts](/topics/charts.md)
tem mais informações sobre como subcharts funcionam.

## Adicionando Values e um Template ao Subchart

Em seguida, vamos criar um template simples e um arquivo de values para nosso
chart `mysubchart`. Já deve existir um `values.yaml` em `mychart/charts/mysubchart`.
Vamos configurá-lo assim:

```yaml
dessert: cake
```

Em seguida, vamos criar um novo template de ConfigMap em
`mychart/charts/mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

Como cada subchart é um _chart independente_, podemos testar `mysubchart`
separadamente:

```console
$ helm install --generate-name --dry-run --debug mychart/charts/mysubchart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart/charts/mysubchart
NAME:   newbie-elk
TARGET NAMESPACE:   default
CHART:  mysubchart 0.1.0
MANIFEST:
---
# Source: mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: newbie-elk-cfgmap2
data:
  dessert: cake
```

## Sobrescrevendo Values de um Chart Pai

Nosso chart original, `mychart`, agora é o _chart pai_ de `mysubchart`. Essa
relação é baseada inteiramente no fato de que `mysubchart` está dentro de
`mychart/charts`.

Como `mychart` é um chart pai, podemos especificar configuração em `mychart` e
ter essa configuração aplicada ao `mysubchart`. Por exemplo, podemos modificar
`mychart/values.yaml` assim:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

Note as duas últimas linhas. Qualquer diretiva dentro da seção `mysubchart` será
enviada para o chart `mysubchart`. Então, se executarmos `helm install --generate-name --dry-run --debug
mychart`, uma das coisas que veremos é o ConfigMap do `mysubchart`:

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

O valor no nível superior agora sobrescreveu o valor do subchart.

Há um detalhe importante a notar aqui. Não alteramos o template de
`mychart/charts/mysubchart/templates/configmap.yaml` para apontar para
`.Values.mysubchart.dessert`. Da perspectiva desse template, o valor ainda está
localizado em `.Values.dessert`. À medida que o motor de templates passa os
values, ele define o escopo. Então, para os templates do `mysubchart`, apenas
values específicos para `mysubchart` estarão disponíveis em `.Values`.

Às vezes, porém, você quer que certos values estejam disponíveis para todos os
templates. Isso é realizado usando valores globais de chart.

## Valores Globais de Chart

Valores globais são values que podem ser acessados de qualquer chart ou subchart
pelo exato mesmo nome. Valores globais requerem declaração explícita. Você não
pode usar um valor não-global existente como se fosse global.

O tipo de dados Values possui uma seção reservada chamada `Values.global` onde
valores globais podem ser definidos. Vamos definir um no nosso arquivo
`mychart/values.yaml`.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar
```

Devido à forma como os valores globais funcionam, tanto `mychart/templates/configmap.yaml`
quanto `mysubchart/templates/configmap.yaml` devem ser capazes de acessar esse
valor como `{{ .Values.global.salad }}`.

`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

Agora, se executarmos uma instalação dry run, veremos o mesmo valor em ambas as
saídas:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-configmap
data:
  salad: caesar

---
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-cfgmap2
data:
  dessert: ice cream
  salad: caesar
```

Valores globais são úteis para passar informações assim, embora exija algum
planejamento para garantir que os templates corretos estejam configurados para
usar valores globais.

## Compartilhando Templates com Subcharts

Charts pai e subcharts podem compartilhar templates. Qualquer bloco definido em
qualquer chart está disponível para outros charts.

Por exemplo, podemos definir um template simples assim:

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

Lembre-se de como os labels em templates são _globalmente compartilhados_. Assim,
o chart `labels` pode ser incluído de qualquer outro chart.

Embora desenvolvedores de charts possam escolher entre `include` e `template`,
uma vantagem de usar `include` é que `include` pode referenciar templates
dinamicamente:

```yaml
{{ include $mytemplate }}
```

O código acima desreferencia `$mytemplate`. A função `template`, em contraste,
aceita apenas uma string literal.

## Evite Usar Blocks

A linguagem de template Go fornece uma palavra-chave `block` que permite aos
desenvolvedores fornecer uma implementação padrão que é sobrescrita posteriormente.
Em charts do Helm, blocks não são a melhor ferramenta para sobrescrita porque,
se múltiplas implementações do mesmo block forem fornecidas, a selecionada é
imprevisível.

A recomendação é usar `include` em vez disso.
