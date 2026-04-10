---
title: Templates
description: Uma visão mais detalhada das boas práticas relacionadas a templates.
sidebar_position: 3
---

Esta parte do guia de boas práticas foca em templates.

## Estrutura de `templates/`

O diretório `templates/` deve ser estruturado da seguinte forma:

- Arquivos de template devem ter a extensão `.yaml` se produzirem saída YAML.
  A extensão `.tpl` pode ser usada para arquivos de template que não produzem
  conteúdo formatado.
- Nomes de arquivos de template devem usar notação com hífens (`my-example-configmap.yaml`),
  não camelCase.
- Cada definição de recurso deve estar em seu próprio arquivo de template.
- Nomes de arquivos de template devem refletir o tipo de recurso no nome. Ex.:
  `foo-pod.yaml`, `bar-svc.yaml`

## Nomes de Templates Definidos

Templates definidos (templates criados dentro de uma diretiva `{{ define }}`) são
globalmente acessíveis. Isso significa que um chart e todos os seus subcharts terão
acesso a todos os templates criados com `{{ define }}`.

Por esse motivo, _todos os nomes de templates definidos devem usar namespace._

Correto:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

Incorreto:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```

É altamente recomendado que novos charts sejam criados através do comando `helm create`,
pois os nomes dos templates são automaticamente definidos de acordo com esta boa prática.

## Formatação de Templates

Templates devem ser indentados usando _dois espaços_ (nunca tabs).

As diretivas de template devem ter espaço em branco após as chaves de abertura e antes
das chaves de fechamento:

Correto:
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

Incorreto:
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

Templates devem suprimir espaços em branco quando possível:

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

Blocos (como estruturas de controle) podem ser indentados para indicar o fluxo do
código do template.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

No entanto, como YAML é uma linguagem orientada a espaços em branco, nem sempre é
possível que a indentação do código siga essa convenção.

## Espaços em Branco nos Templates Gerados

É preferível manter a quantidade de espaços em branco nos templates gerados no
mínimo. Em particular, várias linhas em branco não devem aparecer adjacentes umas
às outras. Porém, linhas vazias ocasionais (particularmente entre seções lógicas) são
aceitáveis.

Ideal:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

Aceitável:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

Mas isto deve ser evitado:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## Comentários (Comentários YAML vs. Comentários de Template)

Tanto YAML quanto Helm Templates possuem marcadores de comentário.

Comentários YAML:
```yaml
# This is a comment
type: sprocket
```

Comentários de Template:
```yaml
{{- /*
This is a comment.
*/}}
type: frobnitz
```

Comentários de template devem ser usados ao documentar funcionalidades de um template,
como explicar um template definido:

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

Dentro dos templates, comentários YAML podem ser usados quando for útil para os
usuários do Helm (possivelmente) verem os comentários durante a depuração.

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

O comentário acima é visível quando o usuário executa `helm install --debug`, enquanto
comentários especificados em seções `{{- /* */}}` não são.

Tenha cuidado ao adicionar comentários YAML `#` em seções de template que contêm values do Helm que podem ser exigidos por certas funções de template.

Por exemplo, se a função `required` for introduzida no exemplo acima, e `maxMem` não estiver definido, então um comentário YAML `#` introduzirá um erro de renderização.

Correto: `helm template` não renderiza este bloco
```yaml
{{- /*
# This may cause problems if the value is more than 100Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}
```

Incorreto: `helm template` retorna `Error: execution error at (templates/test.yaml:2:13): maxMem must be set`
```yaml
# This may cause problems if the value is more than 100Gi
# memory: {{ required .Values.maxMem "maxMem must be set" | quote }}
```

Consulte [Depuração de Templates](../chart_template_guide/debugging.md) para outro exemplo deste comportamento de como comentários YAML são mantidos intactos.

## Uso de JSON em Templates e Saída de Template

YAML é um superconjunto de JSON. Em alguns casos, usar uma sintaxe JSON pode ser mais
legível do que outras representações YAML.

Por exemplo, este YAML está mais próximo do método normal de YAML para expressar listas:

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

Mas é mais fácil de ler quando colapsado em estilo de lista JSON:

```yaml
arguments: ["--dirname", "/foo"]
```

Usar JSON para maior legibilidade é bom. No entanto, a sintaxe JSON não deve ser
usada para representar construções mais complexas.

Ao lidar com JSON puro incorporado dentro de YAML (como configuração de init container),
é claro que é apropriado usar o formato JSON.
