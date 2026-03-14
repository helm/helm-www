---
title: Funções de Template e Pipelines
description: Usando funções em templates.
sidebar_position: 5
---

Até agora, vimos como inserir informações em um template. Porém, essas
informações são inseridas sem modificação. Às vezes, queremos transformar
os dados fornecidos de uma forma que seja mais útil para nós.

Uma boa prática: ao injetar strings do objeto `.Values` no template, devemos
colocá-las entre aspas. Podemos fazer isso chamando a função `quote` na
diretiva do template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

As funções de template seguem a sintaxe `nomeDaFuncao arg1 arg2...`. No trecho
acima, `quote .Values.favorite.drink` chama a função `quote` e passa um
único argumento para ela.

O Helm tem mais de 60 funções disponíveis. Algumas delas são definidas pela própria
[linguagem de template do Go](https://godoc.org/text/template). A maioria das outras
faz parte da [biblioteca de templates Sprig](https://masterminds.github.io/sprig/).
Veremos muitas delas conforme avançamos pelos exemplos.

> Embora falemos da "linguagem de template do Helm" como se fosse específica do Helm,
> na verdade é uma combinação da linguagem de template do Go, algumas funções extras
> e uma variedade de wrappers para expor certos objetos aos templates. Muitos
> recursos sobre templates do Go podem ser úteis enquanto você aprende sobre templating.

## Pipelines

Uma das funcionalidades poderosas da linguagem de template é o conceito de
_pipelines_. Baseando-se em um conceito do UNIX, pipelines são uma ferramenta para
encadear uma série de comandos de template para expressar de forma compacta uma série
de transformações. Em outras palavras, pipelines são uma forma eficiente de fazer
várias coisas em sequência. Vamos reescrever o exemplo acima usando um pipeline.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

Neste exemplo, em vez de chamar `quote ARGUMENTO`, invertemos a ordem.
"Enviamos" o argumento para a função usando um pipeline (`|`):
`.Values.favorite.drink | quote`. Usando pipelines, podemos encadear várias
funções juntas:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> Inverter a ordem é uma prática comum em templates. Você verá `.val |
> quote` com mais frequência do que `quote .val`. Ambas as práticas são válidas.

Quando avaliado, esse template produzirá:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Observe que nosso `pizza` original agora foi transformado em `"PIZZA"`.

Quando usamos pipelines assim, o resultado da primeira avaliação
(`.Values.favorite.drink`) é enviado como o _último argumento para a função_. Podemos
modificar o exemplo da bebida acima para ilustrar com uma função que recebe dois
argumentos: `repeat COUNT STRING`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

A função `repeat` irá ecoar a string fornecida o número de vezes especificado, então
teremos esta saída:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## Usando a função `default`

Uma função frequentemente usada em templates é a função `default`: `default
VALOR_PADRAO VALOR_FORNECIDO`. Esta função permite especificar um valor padrão
dentro do template, caso o valor seja omitido. Vamos usá-la para modificar o
exemplo da bebida acima:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

Se executarmos isso normalmente, obteremos nosso `coffee`:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Agora, vamos remover a configuração da bebida favorita do `values.yaml`:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

Agora, executar novamente `helm install --dry-run --debug fair-worm ./mychart` produzirá
este YAML:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

Em um chart real, todos os valores padrão estáticos devem estar no `values.yaml`
e não devem ser repetidos usando o comando `default` (caso contrário, seriam
redundantes). No entanto, o comando `default` é perfeito para valores computados,
que não podem ser declarados dentro do `values.yaml`. Por exemplo:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

Em alguns casos, uma condição `if` pode ser mais adequada do que `default`.
Veremos isso na próxima seção.

Funções e pipelines de template são uma forma poderosa de transformar informações e
inseri-las no seu YAML. Mas às vezes é necessário adicionar alguma lógica de template
que seja um pouco mais sofisticada do que apenas inserir uma string. Na próxima
seção, veremos as estruturas de controle fornecidas pela linguagem de template.

## Usando a função `lookup`

A função `lookup` pode ser usada para _consultar_ recursos em um cluster em execução.
A sintaxe da função lookup é `lookup apiVersion, kind, namespace, name
-> recurso ou lista de recursos`.

| parâmetro  | tipo   |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

Tanto `name` quanto `namespace` são opcionais e podem ser passados como uma string
vazia (`""`). No entanto, se você estiver trabalhando com um recurso com escopo de
namespace, tanto `name` quanto `namespace` devem ser especificados.

As seguintes combinações de parâmetros são possíveis:

| Comportamento                          | Função lookup                              |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

Quando `lookup` retorna um objeto, ele retornará um dicionário. Este dicionário
pode ser navegado para extrair valores específicos.

O exemplo a seguir retornará as annotations presentes no objeto `mynamespace`:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

Quando `lookup` retorna uma lista de objetos, é possível acessar a lista de objetos
através do campo `items`:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* faça algo com cada serviço */}}
{{ end }}
```

Quando nenhum objeto é encontrado, um valor vazio é retornado. Isso pode ser usado para
verificar a existência de um objeto.

A função `lookup` usa a configuração de conexão existente do Helm com o Kubernetes
para consultar o Kubernetes. Se algum erro for retornado ao interagir com o servidor
da API (por exemplo, devido à falta de permissão para acessar um recurso), o
processamento de template do Helm falhará.

Tenha em mente que o Helm não deve contatar o Servidor da API do Kubernetes durante
uma operação `helm template|install|upgrade|delete|rollback --dry-run`. Para testar
`lookup` contra um cluster em execução, deve-se usar
`helm template|install|upgrade|delete|rollback --dry-run=server` para permitir a
conexão com o cluster.

## Operadores são funções

Para templates, os operadores (`eq`, `ne`, `lt`, `gt`, `and`, `or` e assim por diante)
são todos implementados como funções. Em pipelines, operações podem ser agrupadas com
parênteses (`(` e `)`).

Agora podemos passar de funções e pipelines para controle de fluxo com condições,
loops e modificadores de escopo.
