---
title: "Política de Suporte de Versão do Helm"
description: "Descreve a política de releases de correção do Helm, bem como a diferença máxima de versões suportada entre o Helm e o Kubernetes."
---

Este documento descreve a diferença máxima de versões suportada entre o Helm e
o Kubernetes.

## Versões Suportadas

As versões do Helm são expressas como `x.y.z`, onde `x` é a versão principal
(major), `y` é a versão secundária (minor) e `z` é a versão de correção (patch),
seguindo a terminologia de [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

O projeto Helm mantém um branch de release para a versão secundária mais recente.
Correções aplicáveis, incluindo correções de segurança, são incorporadas ao branch
de release, dependendo da severidade e viabilidade. Mais detalhes podem ser
encontrados na [política de releases do Helm](/topics/release_policy.md).

## Diferença de Versão Suportada

Quando uma nova versão do Helm é lançada, ela é compilada com uma versão secundária
específica do Kubernetes. Por exemplo, o Helm 3.0.0 interage com o Kubernetes
usando o cliente Kubernetes 1.16.2, portanto é compatível com o Kubernetes 1.16.

A partir do Helm 3, o Helm é compatível com versões `n-3` do Kubernetes com o
qual foi compilado. Devido às mudanças do Kubernetes entre versões secundárias,
a política de suporte do Helm 2 é um pouco mais restrita, sendo compatível com
versões `n-1` do Kubernetes.

Por exemplo, se você estiver usando uma versão do Helm 3 que foi compilada com
as APIs do cliente Kubernetes 1.17, ela deve funcionar de forma segura com o
Kubernetes 1.17, 1.16, 1.15 e 1.14. Se você estiver usando uma versão do Helm 2
que foi compilada com as APIs do cliente Kubernetes 1.16, ela deve funcionar de
forma segura com o Kubernetes 1.16 e 1.15.

Não é recomendado usar o Helm com uma versão do Kubernetes mais recente do que
aquela com a qual ele foi compilado, pois o Helm não oferece garantias de
compatibilidade futura.

Se você optar por usar o Helm com uma versão do Kubernetes que não é suportada,
você estará fazendo isso por sua própria conta e risco.

Consulte a tabela abaixo para determinar qual versão do Helm é compatível com
o seu cluster.

| Versão do Helm | Versões do Kubernetes Suportadas |
|----------------|----------------------------------|
| 3.20.x         | 1.35.x - 1.32.x                  |
| 3.19.x         | 1.34.x - 1.31.x                  |
| 3.18.x         | 1.33.x - 1.30.x                  |
| 3.17.x         | 1.32.x - 1.29.x                  |
| 3.16.x         | 1.31.x - 1.28.x                  |
| 3.15.x         | 1.30.x - 1.27.x                  |
| 3.14.x         | 1.29.x - 1.26.x                  |
| 3.13.x         | 1.28.x - 1.25.x                  |
| 3.12.x         | 1.27.x - 1.24.x                  |
| 3.11.x         | 1.26.x - 1.23.x                  |
| 3.10.x         | 1.25.x - 1.22.x                  |
| 3.9.x          | 1.24.x - 1.21.x                  |
| 3.8.x          | 1.23.x - 1.20.x                  |
| 3.7.x          | 1.22.x - 1.19.x                  |
| 3.6.x          | 1.21.x - 1.18.x                  |
| 3.5.x          | 1.20.x - 1.17.x                  |
| 3.4.x          | 1.19.x - 1.16.x                  |
| 3.3.x          | 1.18.x - 1.15.x                  |
| 3.2.x          | 1.18.x - 1.15.x                  |
| 3.1.x          | 1.17.x - 1.14.x                  |
| 3.0.x          | 1.16.x - 1.13.x                  |
| 2.16.x         | 1.16.x - 1.15.x                  |
| 2.15.x         | 1.15.x - 1.14.x                  |
| 2.14.x         | 1.14.x - 1.13.x                  |
| 2.13.x         | 1.13.x - 1.12.x                  |
| 2.12.x         | 1.12.x - 1.11.x                  |
| 2.11.x         | 1.11.x - 1.10.x                  |
| 2.10.x         | 1.10.x - 1.9.x                   |
| 2.9.x          | 1.10.x - 1.9.x                   |
| 2.8.x          | 1.9.x - 1.8.x                    |
| 2.7.x          | 1.8.x - 1.7.x                    |
| 2.6.x          | 1.7.x - 1.6.x                    |
| 2.5.x          | 1.6.x - 1.5.x                    |
| 2.4.x          | 1.6.x - 1.5.x                    |
| 2.3.x          | 1.5.x - 1.4.x                    |
| 2.2.x          | 1.5.x - 1.4.x                    |
| 2.1.x          | 1.5.x - 1.4.x                    |
| 2.0.x          | 1.4.x - 1.3.x                    |
