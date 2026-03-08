---
title: "Politique de planification des releases"
description: "Décrit la politique de planification des releases de Helm."
---

Dans l'intérêt de ses utilisateurs, Helm définit et annonce les dates de release
à l'avance. Ce document décrit la politique régissant la planification des
releases de Helm.

## Calendrier des releases

Un calendrier public indiquant les prochaines releases de Helm est disponible
[ici](https://helm.sh/calendar/release).

## Versionnement sémantique

Les versions de Helm sont exprimées sous la forme `x.y.z`, où `x` est la version
majeure, `y` est la version mineure et `z` est la version de correctif, suivant
la terminologie du [Versionnement Sémantique](https://semver.org/spec/v2.0.0.html).

## Releases de correctifs

Les releases de correctifs fournissent aux utilisateurs des corrections de bugs
et des correctifs de sécurité. Elles ne contiennent pas de nouvelles
fonctionnalités.

Une nouvelle release de correctif relative à la dernière version mineure/majeure
est normalement effectuée une fois par mois, le deuxième mercredi de chaque mois.

Une release de correctif pour résoudre une régression de haute priorité ou un
problème de sécurité peut être effectuée à tout moment si nécessaire.

Une release de correctif sera annulée pour l'une des raisons suivantes :
- s'il n'y a pas de nouveau contenu depuis la release précédente
- si la date de la release de correctif tombe dans la semaine précédant la
  première release candidate (RC1) d'une prochaine version mineure
- si la date de la release de correctif tombe dans les quatre semaines suivant
  une release mineure

## Releases mineures

Les releases mineures contiennent des correctifs de sécurité, des corrections de
bugs ainsi que de nouvelles fonctionnalités. Elles sont rétrocompatibles en ce
qui concerne l'API et l'utilisation de la CLI.

Pour s'aligner sur les releases de Kubernetes, une release mineure de Helm est
effectuée tous les 4 mois (3 releases par an).

Des releases mineures supplémentaires peuvent être effectuées si nécessaire,
mais n'affecteront pas le calendrier d'une release future annoncée, sauf si
celle-ci est prévue dans moins de 7 jours.

Au moment de la publication d'une release, la date de la prochaine release
mineure sera annoncée et publiée sur la page principale du site web de Helm.

## Releases majeures

Les releases majeures contiennent des changements non rétrocompatibles. Ces
releases sont rares mais parfois nécessaires pour permettre à Helm de continuer
à évoluer dans de nouvelles directions importantes.

Les releases majeures peuvent être difficiles à planifier. Dans cet esprit, une
date de release finale ne sera choisie et annoncée qu'une fois la première
version bêta d'une telle release disponible.
