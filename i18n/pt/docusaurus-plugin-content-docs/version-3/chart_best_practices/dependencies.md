---
title: Dependências
description: Aborda boas práticas para dependências declaradas no Chart.
sidebar_position: 4
---

Esta seção do guia aborda boas práticas para `dependencies` declaradas no
`Chart.yaml`.

## Versões

Sempre que possível, use intervalos de versão em vez de fixar uma versão exata.
O padrão sugerido é usar correspondência no nível de patch:

```yaml
version: ~1.2.3
```

Isso corresponderá à versão `1.2.3` e quaisquer patches dessa release. Em outras
palavras, `~1.2.3` é equivalente a `>= 1.2.3, < 1.3.0`

Para a sintaxe completa de correspondência de versão, consulte a [documentação
do semver](https://github.com/Masterminds/semver#checking-version-constraints).

### Versões de Pré-lançamento

As restrições de versão acima não corresponderão a versões de pré-lançamento.
Por exemplo, `version: ~1.2.3` corresponderá a `version: ~1.2.4`, mas não a
`version: ~1.2.3-1`. O seguinte fornece correspondência tanto para pré-lançamento
quanto para nível de patch:

```yaml
version: ~1.2.3-0
```

### URLs de Repositório

Sempre que possível, use URLs de repositório `https://`, seguidas por URLs `http://`.

Se o repositório foi adicionado ao arquivo de índice de repositórios, o nome do
repositório pode ser usado como alias da URL. Use `alias:` ou `@` seguido do nome
do repositório.

URLs de arquivo (`file://...`) são consideradas um "caso especial" para charts
montados por um pipeline de deploy fixo.

Ao usar [plugins de download](/topics/plugins.md#downloader-plugins), o esquema
de URL será específico do plugin. Note que um usuário do chart precisará ter um
plugin que suporte o esquema instalado para atualizar ou construir a dependência.

O Helm não pode realizar operações de gerenciamento de dependências quando o campo
`repository` é deixado em branco. Nesse caso, o Helm assumirá que a dependência
está em um subdiretório da pasta `charts` com o nome sendo o mesmo da propriedade
`name` da dependência.

## Condições e Tags

Condições ou tags devem ser adicionadas a quaisquer dependências que _sejam
opcionais_. Note que, por padrão, uma `condition` é `true`.

A forma preferida de uma condição é:

```yaml
condition: somechart.enabled
```

Onde `somechart` é o nome do chart da dependência.

Quando múltiplos subcharts (dependências) juntos fornecem uma funcionalidade
opcional ou substituível, esses charts devem compartilhar as mesmas tags.

Por exemplo, se tanto `nginx` quanto `memcached` juntos fornecem otimizações de
desempenho para a aplicação principal no chart, e ambos precisam estar presentes
quando essa funcionalidade está habilitada, então ambos devem ter uma seção de
tags assim:

```yaml
tags:
  - webaccelerator
```

Isso permite que um usuário ative ou desative essa funcionalidade com uma única tag.
