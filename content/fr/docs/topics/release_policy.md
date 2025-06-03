---
title: "Politique de planification des versions"
description: "Décrit la politique de planification des versions de Helm"
---

Pour le bénéfice de ses utilisateurs, Helm définit et annonce les dates de publication à l'avance. Ce document décrit la politique régissant le calendrier des versions de Helm.

## Calendrier des sorties

Un calendrier public montrant les prochaines versions de Helm peut être consulté [ici](https://helm.sh/calendar/release).

## Versionnage sémantique

Les versions de Helm sont exprimées sous la forme `x.y.z`, où `x` est la version majeure, `y` est la version mineure et `z` est la version de correction, conformément à la terminologie du [Versionnage Sémantique](https://semver.org/spec/v2.0.0.html).

## Versions de correction

Les versions de correction fournissent aux utilisateurs des corrections de bogues et des correctifs de sécurité. Elles ne contiennent pas de nouvelles fonctionnalités.

Une nouvelle version de correction relative à la dernière version mineure/majeure sera normalement publiée une fois par mois, le deuxième mercredi de chaque mois.

Une version de correction pour résoudre un problème de régression ou de sécurité de haute priorité peut être publiée dès que nécessaire.

Une version de correction sera annulée pour l'une des raisons suivantes :
- s'il n'y a pas de nouveau contenu depuis la version précédente
- si la date de la version de correction tombe dans la semaine précédant le premier candidat à la publication (RC1) d'une version mineure à venir
- si la date de la version de correction tombe dans les quatre semaines suivant une version mineure

## Versions mineures

Les versions mineures contiennent des corrections de sécurité et de bogues ainsi que de nouvelles fonctionnalités. Elles sont compatibles avec les versions précédentes en ce qui concerne l'API et l'utilisation de l'interface en ligne de commande (CLI).

Pour s'aligner sur les versions de Kubernetes, une version mineure de Helm sera publiée tous les 4 mois (3 versions par an).

Des versions mineures supplémentaires peuvent être publiées si nécessaire, mais elles n'affecteront pas le calendrier d'une version future annoncée, sauf si la version annoncée est prévue dans moins de 7 jours.

En même temps qu'une version est publiée, la date de la prochaine version mineure sera annoncée et publiée sur la page principale de Helm.

## Versions majeures

Les versions majeures contiennent des changements incompatibles avec les versions précédentes. Ces versions sont rares mais parfois nécessaires pour permettre à Helm de continuer à évoluer dans des directions nouvelles et importantes.

Les versions majeures peuvent être difficiles à planifier. Dans cette optique, une date de publication finale ne sera choisie et annoncée qu'une fois que la première version bêta de cette version sera disponible.
