---
title: Variáveis
description: Usando variáveis em templates.
sidebar_position: 8
---

Com funções, pipelines, objetos e estruturas de controle em mãos, podemos
passar para uma das ideias mais básicas em muitas linguagens de programação:
variáveis. Em templates, elas são usadas com menos frequência. Mas veremos como
utilizá-las para simplificar o código e fazer melhor uso de `with` e `range`.

Em um exemplo anterior, vimos que este código vai falhar:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` não está dentro do escopo restrito pelo bloco `with`.
Uma forma de contornar problemas de escopo é atribuir objetos a variáveis que podem
ser acessadas fora do escopo atual.

Em templates do Helm, uma variável é uma referência nomeada para outro objeto. Ela
segue a forma `$nome`. Variáveis são atribuídas com um operador especial de
atribuição: `:=`. Podemos reescrever o exemplo acima para usar uma variável para
`Release.Name`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

Observe que antes de iniciar o bloco `with`, atribuímos `$relname :=
.Release.Name`. Agora, dentro do bloco `with`, a variável `$relname` ainda
aponta para o nome da release.

Ao executar, teremos:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

Variáveis são particularmente úteis em loops `range`. Elas podem ser usadas em
objetos do tipo lista para capturar tanto o índice quanto o valor:

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

Note que `range` vem primeiro, depois as variáveis, em seguida o operador de
atribuição e por fim a lista. Isso atribuirá o índice inteiro (começando do zero)
a `$index` e o valor a `$topping`. O resultado será:

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

Para estruturas de dados que possuem tanto uma chave quanto um valor, podemos usar
`range` para obter ambos. Por exemplo, podemos iterar sobre `.Values.favorite`
desta forma:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Agora, na primeira iteração, `$key` será `drink` e `$val` será `coffee`, e na
segunda, `$key` será `food` e `$val` será `pizza`. Executar o exemplo acima irá
gerar:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Variáveis normalmente não são "globais". Elas têm escopo limitado ao bloco onde
foram declaradas. Anteriormente, atribuímos `$relname` no nível superior do
template. Essa variável estará disponível em todo o template. Mas no nosso último
exemplo, `$key` e `$val` só estarão disponíveis dentro do bloco
`{{ range... }}{{ end }}`.

No entanto, há uma variável que sempre aponta para o contexto raiz: `$`.
Isso pode ser muito útil quando você está iterando em um range e precisa saber o
nome da release do chart.

Um exemplo ilustrando isso:
```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # Muitos templates do Helm usariam `.` abaixo, mas isso não funcionará,
    # porém `$` funcionará aqui
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # Não posso referenciar .Chart.Name, mas posso fazer $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Valor de appVersion em Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

Até agora vimos apenas um template declarado em um único arquivo. Mas um dos
recursos poderosos da linguagem de templates do Helm é a capacidade de declarar
múltiplos templates e usá-los juntos. Abordaremos isso na próxima seção.
