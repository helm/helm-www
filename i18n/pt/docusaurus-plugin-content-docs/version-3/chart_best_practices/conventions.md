---
title: Convenções Gerais
description: Convenções gerais para charts.
sidebar_position: 1
---

Esta parte do guia de boas práticas aborda convenções gerais.

## Nomes de Charts

Os nomes de charts devem conter apenas letras minúsculas e números. Palavras
_podem_ ser separadas com hífens (-):

Exemplos:

```
drupal
nginx-lego
aws-cluster-autoscaler
```

Letras maiúsculas e underscores não podem ser usados em nomes de charts. Pontos
também não devem ser usados.

## Números de Versão

Sempre que possível, o Helm usa [SemVer 2](https://semver.org) para representar
números de versão. (Note que tags de imagens Docker não seguem necessariamente
o SemVer, sendo consideradas uma exceção infeliz à regra.)

Quando versões SemVer são armazenadas em labels do Kubernetes, convencionalmente
alteramos o caractere `+` para `_`, pois labels não permitem o sinal `+` como
valor.

## Formatação YAML

Arquivos YAML devem ser indentados usando _dois espaços_ (nunca tabs).

## Uso das Palavras Helm e Chart

Existem algumas convenções para o uso das palavras _Helm_ e _helm_.

- _Helm_ refere-se ao projeto como um todo
- `helm` refere-se ao comando do lado do cliente
- O termo `chart` não precisa ser capitalizado, pois não é um nome próprio
- No entanto, `Chart.yaml` deve ser capitalizado porque o nome do arquivo é
  sensível a maiúsculas e minúsculas

Em caso de dúvida, use _Helm_ (com 'H' maiúsculo).

## Chart templates e namespaces

Evite definir a propriedade `namespace` na seção `metadata` dos seus templates
de chart. O namespace a ser aplicado aos templates renderizados deve ser
especificado na chamada ao cliente Kubernetes através de uma flag como
`--namespace`. O Helm renderiza seus templates como estão e os envia ao cliente
Kubernetes, seja o próprio Helm ou outro programa (kubectl, flux, spinnaker,
etc).
