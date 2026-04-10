---
title: "Política de Cronograma de Releases"
description: "Descreve a política de cronograma de releases do Helm."
---

Para benefício de seus usuários, o Helm define e anuncia as datas de releases
com antecedência. Este documento descreve a política que governa o cronograma
de releases do Helm.

## Calendário de Releases

Um calendário público mostrando os próximos releases do Helm pode ser encontrado [aqui](https://helm.sh/calendar/release).

## Versionamento Semântico

As versões do Helm são expressas como `x.y.z`, onde `x` é a versão principal
(major), `y` é a versão secundária (minor) e `z` é a versão de correção (patch),
seguindo a terminologia de [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## Releases de Correção

Os releases de correção fornecem aos usuários correções de bugs e correções de
segurança. Eles não contêm novas funcionalidades.

Um novo release de correção relacionado ao release secundário/principal mais
recente normalmente será feito uma vez por mês, na segunda quarta-feira de cada
mês.

Um release de correção para resolver uma regressão de alta prioridade ou um
problema de segurança pode ser feito sempre que necessário.

Um release de correção será cancelado por qualquer um dos seguintes motivos:
- se não houver novo conteúdo desde o release anterior
- se a data do release de correção cair dentro de uma semana antes do primeiro
  release candidate (RC1) de um próximo release secundário
- se a data do release de correção cair dentro de quatro semanas após um release
  secundário

## Releases Secundários

Os releases secundários contêm correções de segurança e bugs, bem como novas
funcionalidades. Eles são retrocompatíveis em relação à API e ao uso da CLI.

Para alinhar com os releases do Kubernetes, um release secundário do Helm será
feito a cada 4 meses (3 releases por ano).

Releases secundários extras podem ser feitos se necessário, mas não afetarão o
cronograma de um release futuro anunciado, a menos que o release anunciado
esteja a menos de 7 dias.

Ao mesmo tempo em que um release é publicado, a data do próximo release secundário
será anunciada e publicada na página principal do Helm.

## Releases Principais

Os releases principais contêm mudanças incompatíveis. Tais releases são raros,
mas às vezes são necessários para permitir que o Helm continue a evoluir em
novas direções importantes.

Os releases principais podem ser difíceis de planejar. Com isso em mente, uma
data final de release só será escolhida e anunciada quando a primeira versão
beta de tal release estiver disponível.
