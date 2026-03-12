---
title: Values
description: Foca em como você deve estruturar e usar seus values.
sidebar_position: 2
---

Esta parte do guia de boas práticas aborda o uso de values. Nesta parte do
guia, fornecemos recomendações sobre como você deve estruturar e usar seus
values, com foco no design do arquivo `values.yaml` do chart.

## Convenções de Nomenclatura

Os nomes das variáveis devem começar com uma letra minúscula, e as palavras
devem ser separadas com camelCase:

Correto:

```yaml
chicken: true
chickenNoodleSoup: true
```

Incorreto:

```yaml
Chicken: true  # letras maiúsculas iniciais podem conflitar com variáveis internas
chicken-noodle-soup: true # não use hífens no nome
```

Note que todas as variáveis internas do Helm começam com uma letra maiúscula
para facilitar a distinção das variáveis definidas pelo usuário: `.Release.Name`,
`.Capabilities.KubeVersion`.

## Values Planos ou Aninhados

YAML é um formato flexível, e os values podem ser profundamente aninhados ou
planos.

Aninhado:

```yaml
server:
  name: nginx
  port: 80
```

Plano:

```yaml
serverName: nginx
serverPort: 80
```

Na maioria dos casos, prefira o formato plano ao aninhado. O motivo é que ele é
mais simples tanto para desenvolvedores de templates quanto para usuários.

Para segurança ideal, um valor aninhado deve ser verificado em cada nível:

```
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

Para cada camada de aninhamento, uma verificação de existência deve ser feita.
Mas para configuração plana, tais verificações podem ser ignoradas, tornando o
template mais fácil de ler e usar.

```
{{ default "none" .Values.serverName }}
```

Quando há um grande número de variáveis relacionadas, e pelo menos uma delas é
obrigatória, values aninhados podem ser usados para melhorar a legibilidade.

## Seja Claro com os Tipos

As regras de conversão de tipos do YAML às vezes são contraintuitivas. Por
exemplo, `foo: false` não é o mesmo que `foo: "false"`. Inteiros grandes como
`foo: 12345678` serão convertidos para notação científica em alguns casos.

A maneira mais fácil de evitar erros de conversão de tipo é ser explícito sobre
strings e implícito sobre todo o resto. Ou, em resumo, _coloque aspas em todas
as strings_.

Frequentemente, para evitar problemas de conversão de inteiros, é vantajoso
armazenar seus inteiros como strings também, e usar `{{ int $value }}` no
template para converter de uma string de volta para um inteiro.

Na maioria dos casos, tags de tipo explícitas são respeitadas, então `foo:
!!string 1234` deve tratar `1234` como uma string. _No entanto_, o parser YAML
consome as tags, então os dados de tipo são perdidos após um parse.

## Considere Como os Usuários Usarão Seus Values

Existem três fontes potenciais de values:

- O arquivo `values.yaml` do chart
- Um arquivo de values fornecido por `helm install -f` ou `helm upgrade -f`
- Os values passados para a flag `--set` ou `--set-string` no `helm install` ou
  `helm upgrade`

Ao projetar a estrutura dos seus values, tenha em mente que os usuários do seu
chart podem querer sobrescrevê-los via flag `-f` ou com a opção `--set`.

Como `--set` é mais limitado em expressividade, a primeira diretriz para
escrever seu arquivo `values.yaml` é _facilitar a sobrescrita via `--set`_.

Por essa razão, geralmente é melhor estruturar seu arquivo de values usando maps.

Difícil de usar com `--set`:

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

O exemplo acima não pode ser expresso com `--set` no Helm `<=2.4`. No Helm 2.5,
acessar a porta em foo é `--set servers[0].port=80`. Não apenas é mais difícil
para o usuário descobrir, mas também é propenso a erros se em algum momento
futuro a ordem dos `servers` for alterada.

Fácil de usar:

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

Acessar a porta de foo é muito mais óbvio: `--set servers.foo.port=80`.

## Documente o `values.yaml`

Cada propriedade definida no `values.yaml` deve ser documentada. A string de
documentação deve começar com o nome da propriedade que ela descreve e depois
fornecer pelo menos uma descrição de uma frase.

Incorreto:

```yaml
# o nome do host para o servidor web
serverHost: example
serverPort: 9191
```

Correto:

```yaml
# serverHost é o nome do host para o servidor web
serverHost: example
# serverPort é a porta do listener HTTP para o servidor web
serverPort: 9191
```

Começar cada comentário com o nome do parâmetro que ele documenta facilita a
busca por documentação com grep, e permitirá que ferramentas de documentação
correlacionem de forma confiável as strings de documentação com os parâmetros
que elas descrevem.
