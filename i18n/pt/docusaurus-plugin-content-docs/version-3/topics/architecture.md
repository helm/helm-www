---
title: Arquitetura do Helm
description: Descreve a arquitetura do Helm em alto nível.
sidebar_position: 8
---

# Arquitetura do Helm

Este documento descreve a arquitetura do Helm em alto nível.

## O Propósito do Helm

O Helm é uma ferramenta para gerenciar pacotes do Kubernetes chamados _charts_.
O Helm pode fazer o seguinte:

- Criar novos charts do zero
- Empacotar charts em arquivos compactados (tgz)
- Interagir com repositórios de charts onde os charts são armazenados
- Instalar e desinstalar charts em um cluster Kubernetes existente
- Gerenciar o ciclo de vida de releases de charts que foram instalados com o Helm

Para o Helm, existem três conceitos importantes:

1. O _chart_ é um pacote de informações necessárias para criar uma instância de
   uma aplicação Kubernetes.
2. A _config_ contém informações de configuração que podem ser mescladas em um
   chart empacotado para criar um objeto de release.
3. Uma _release_ é uma instância em execução de um _chart_, combinada com uma
   _config_ específica.

## Componentes

O Helm é um executável que é implementado em duas partes distintas:

**O Cliente Helm** é um cliente de linha de comando para usuários finais. O
cliente é responsável pelo seguinte:

- Desenvolvimento local de charts
- Gerenciamento de repositórios
- Gerenciamento de releases
- Interface com a biblioteca do Helm
  - Enviar charts para serem instalados
  - Solicitar atualização ou desinstalação de releases existentes

**A Biblioteca do Helm** fornece a lógica para executar todas as operações do
Helm. Ela interage com o servidor de API do Kubernetes e oferece as seguintes
funcionalidades:

- Combinar um chart e uma configuração para construir uma release
- Instalar charts no Kubernetes e fornecer o objeto de release subsequente
- Atualizar e desinstalar charts interagindo com o Kubernetes

A biblioteca independente do Helm encapsula a lógica do Helm para que possa ser
aproveitada por diferentes clientes.

## Implementação

O cliente e a biblioteca do Helm são escritos na linguagem de programação Go.

A biblioteca usa a biblioteca cliente do Kubernetes para se comunicar com o
Kubernetes. Atualmente, essa biblioteca usa REST+JSON. Ela armazena informações
em Secrets localizados dentro do Kubernetes. Ela não necessita de um banco de
dados próprio.

Os arquivos de configuração são, quando possível, escritos em YAML.
