---
title: "Apêndice: Tipos de Dados Go e Templates"
description: Uma visão geral rápida sobre variáveis em templates.
sidebar_position: 16
---

A linguagem de templates do Helm é implementada na linguagem de programação Go,
que é fortemente tipada. Por isso, variáveis em templates são _tipadas_. Na
maior parte dos casos, as variáveis serão expostas como um dos seguintes tipos:

- string: Uma cadeia de texto
- bool: `true` ou `false`
- int: Um valor inteiro (há também variantes de 8, 16, 32 e 64 bits, com sinal
  e sem sinal)
- float64: Um valor de ponto flutuante de 64 bits (há também variantes de 8, 16
  e 32 bits)
- um slice de bytes (`[]byte`), frequentemente usado para armazenar dados
  (potencialmente) binários
- struct: um objeto com propriedades e métodos
- um slice (lista indexada) de um dos tipos anteriores
- um map com chaves string (`map[string]interface{}`) onde o valor é um dos
  tipos anteriores

Existem muitos outros tipos em Go, e às vezes você precisará converter entre eles
nos seus templates. A forma mais fácil de identificar o tipo de um objeto é usar
`printf "%T"` em um template, que exibirá o tipo. Veja também as funções `typeOf`
e `kindOf`.
