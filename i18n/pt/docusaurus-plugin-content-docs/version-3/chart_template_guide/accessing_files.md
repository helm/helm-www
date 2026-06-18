---
title: Acessando Arquivos Dentro de Templates
description: Como acessar arquivos de dentro de um template.
sidebar_position: 10
---

Na seção anterior, vimos várias maneiras de criar e acessar templates nomeados.
Isso facilita a importação de um template de dentro de outro template. Mas às
vezes é desejável importar um _arquivo que não é um template_ e injetar seu
conteúdo sem enviá-lo pelo renderizador de templates.

O Helm fornece acesso a arquivos através do objeto `.Files`. Antes de começarmos
com os exemplos de templates, porém, há algumas coisas a observar sobre como
isso funciona:

- É permitido adicionar arquivos extras ao seu chart do Helm. Esses arquivos serão
  empacotados. Mas tenha cuidado. Charts devem ter menos de 1M devido às limitações
  de armazenamento dos objetos do Kubernetes.
- Alguns arquivos não podem ser acessados através do objeto `.Files`, geralmente
  por razões de segurança.
  - Arquivos em `templates/` não podem ser acessados.
  - Arquivos excluídos usando `.helmignore` não podem ser acessados.
  - Arquivos fora de um [subchart](./subcharts_and_globals.md) de uma aplicação Helm, incluindo os do chart pai, não podem ser acessados
- Charts não preservam informações de modo UNIX, portanto as permissões a nível
  de arquivo não terão impacto na disponibilidade de um arquivo quando se trata
  do objeto `.Files`.

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [Exemplo básico](#exemplo-básico)
- [Helpers de caminho](#helpers-de-caminho)
- [Padrões glob](#padrões-glob)
- [Funções utilitárias para ConfigMap e Secrets](#funções-utilitárias-para-configmap-e-secrets)
- [Codificação](#codificação)
- [Linhas](#linhas)

<!-- tocstop -->

## Exemplo básico

Com essas ressalvas em mente, vamos escrever um template que lê três arquivos
em nosso ConfigMap. Para começar, adicionaremos três arquivos ao chart, colocando
os três diretamente dentro do diretório `mychart/`.

`config1.toml`:

```toml
message = "Hello from config 1"
```

`config2.toml`:

```toml
message = "This is config 2"
```

`config3.toml`:

```toml
message = "Goodbye from config 3"
```

Cada um destes é um arquivo TOML simples (pense nos arquivos INI do Windows antigo).
Sabemos os nomes desses arquivos, então podemos usar uma função `range` para
iterar sobre eles e injetar seu conteúdo em nosso ConfigMap.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

Este ConfigMap usa várias das técnicas discutidas nas seções anteriores.
Por exemplo, criamos uma variável `$files` para manter uma referência ao objeto
`.Files`. Também usamos a função `tuple` para criar uma lista de arquivos pela
qual iteramos. Então imprimimos cada nome de arquivo (`{{ . }}: |-`) seguido pelo
conteúdo do arquivo `{{ $files.Get . }}`.

Executar este template produzirá um único ConfigMap com o conteúdo de todos
os três arquivos:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## Helpers de caminho

Ao trabalhar com arquivos, pode ser muito útil realizar algumas operações padrão
nos próprios caminhos dos arquivos. Para ajudar com isso, o Helm importa muitas
das funções do pacote [path](https://golang.org/pkg/path/) do Go para seu uso.
Elas são todas acessíveis com os mesmos nomes do pacote Go, mas com a primeira
letra em minúsculo. Por exemplo, `Base` se torna `base`, etc.

As funções importadas são:
- Base
- Dir
- Ext
- IsAbs
- Clean

## Padrões glob

À medida que seu chart cresce, você pode descobrir que tem uma necessidade maior
de organizar seus arquivos, e por isso fornecemos um método
`Files.Glob(pattern string)` para ajudar a extrair certos arquivos com toda a
flexibilidade dos [padrões glob](https://godoc.org/github.com/gobwas/glob).

`.Glob` retorna um tipo `Files`, então você pode chamar qualquer um dos métodos
`Files` no objeto retornado.

Por exemplo, imagine a estrutura de diretórios:

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

Você tem múltiplas opções com Globs:

```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

Ou

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## Funções utilitárias para ConfigMap e Secrets

(Disponível no Helm 2.0.2 e posteriores)

É muito comum querer colocar conteúdo de arquivos tanto em ConfigMaps quanto em
Secrets, para montá-los em seus pods em tempo de execução. Para ajudar com isso,
fornecemos alguns métodos utilitários no tipo `Files`.

Para maior organização, é especialmente útil usar esses métodos em conjunto com
o método `Glob`.

Dada a estrutura de diretórios do exemplo [Glob](#padrões-glob) acima:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

## Codificação

Você pode importar um arquivo e fazer o template codificá-lo em base-64 para
garantir uma transmissão bem-sucedida:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

O exemplo acima pegará o mesmo arquivo `config1.toml` que usamos antes e o codificará:

```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```

## Linhas

Às vezes é desejável acessar cada linha de um arquivo em seu template. Fornecemos
um método conveniente `Lines` para isso.

Você pode percorrer `Lines` usando uma função `range`:

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

Não há como passar arquivos externos ao chart durante `helm install`. Portanto,
se você está pedindo aos usuários que forneçam dados, eles devem ser carregados
usando `helm install -f` ou `helm install --set`.

Esta discussão encerra nosso aprofundamento nas ferramentas e técnicas para
escrever templates do Helm. Na próxima seção, veremos como você pode usar um
arquivo especial, `templates/NOTES.txt`, para enviar instruções pós-instalação
aos usuários do seu chart.
