---
title: "Politique de support des versions de Helm"
description: "Décrit la politique de publication des versions de correction de Helm ainsi que l'écart de version maximal supporté entre Helm et Kubernetes"
---

Ce document décrit l'écart de version maximal supporté entre Helm et Kubernetes.

## Versions supportées

Les versions de Helm sont exprimées sous la forme `x.y.z`, où `x` est la version majeure, `y` est la version mineure et `z` est la version de correction, conformément à la terminologie du [Versionnage Sémantique](https://semver.org/spec/v2.0.0.html).

Le projet Helm maintient une branche de version pour la dernière version mineure en date. Les correctifs applicables, y compris les correctifs de sécurité, sont sélectionnés et intégrés dans la branche de version, en fonction de la gravité et de la faisabilité. Plus de détails peuvent être trouvés dans la [politique de publication de Helm]({{< ref "/docs/topics/release_policy.md" >}}).

## Écart de version supporté

Lorsqu'une nouvelle version de Helm est publiée, elle est compilée contre une version mineure particulière de Kubernetes. Par exemple, Helm 3.0.0 interagit avec Kubernetes en utilisant le client Kubernetes 1.16.2, donc elle est compatible avec Kubernetes 1.16.

À partir de Helm 3, Helm est supposé être compatible avec les versions de Kubernetes allant jusqu'à `n-3` versions par rapport à celle contre laquelle il a été compilé. En raison des changements dans Kubernetes entre les versions mineures, la politique de support de Helm 2 est légèrement plus stricte, en supposant une compatibilité avec les versions `n-1` de Kubernetes.

Par exemple, si vous utilisez une version de Helm 3 qui a été compilée avec les API client de Kubernetes 1.17, alors il devrait être sûr de l'utiliser avec Kubernetes 1.17, 1.16, 1.15 et 1.14. Si vous utilisez une version de Helm 2 qui a été compilée avec les API client de Kubernetes 1.16, alors il devrait être sûr de l'utiliser avec Kubernetes 1.16 et 1.15.

Il n'est pas recommandé d'utiliser Helm avec une version de Kubernetes plus récente que celle contre laquelle il a été compilé, car Helm ne fournit aucune garantie de compatibilité ascendante.

Si vous choisissez d'utiliser Helm avec une version de Kubernetes qu'il ne prend pas en charge, vous le faites à vos propres risques.

Veuillez consulter le tableau ci-dessous pour déterminer quelle version de Helm est compatible avec votre cluster.

| Version d'Helm | Versions de Kubernetes supportées |
|----------------|-----------------------------------|
| 3.16.x         | 1.31.x - 1.28.x                   |
| 3.15.x         | 1.30.x - 1.27.x                   |
| 3.14.x         | 1.29.x - 1.26.x                   |
| 3.13.x         | 1.28.x - 1.25.x                   |
| 3.12.x         | 1.27.x - 1.24.x                   |
| 3.11.x         | 1.26.x - 1.23.x                   |
| 3.10.x         | 1.25.x - 1.22.x                   |
| 3.9.x          | 1.24.x - 1.21.x                   |
| 3.8.x          | 1.23.x - 1.20.x                   |
| 3.7.x          | 1.22.x - 1.19.x                   |
| 3.6.x          | 1.21.x - 1.18.x                   |
| 3.5.x          | 1.20.x - 1.17.x                   |
| 3.4.x          | 1.19.x - 1.16.x                   |
| 3.3.x          | 1.18.x - 1.15.x                   |
| 3.2.x          | 1.18.x - 1.15.x                   |
| 3.1.x          | 1.17.x - 1.14.x                   |
| 3.0.x          | 1.16.x - 1.13.x                   |
| 2.16.x         | 1.16.x - 1.15.x                   |
| 2.15.x         | 1.15.x - 1.14.x                   |
| 2.14.x         | 1.14.x - 1.13.x                   |
| 2.13.x         | 1.13.x - 1.12.x                   |
| 2.12.x         | 1.12.x - 1.11.x                   |
| 2.11.x         | 1.11.x - 1.10.x                   |
| 2.10.x         | 1.10.x - 1.9.x                    |
| 2.9.x          | 1.10.x - 1.9.x                    |
| 2.8.x          | 1.9.x - 1.8.x                     |
| 2.7.x          | 1.8.x - 1.7.x                     |
| 2.6.x          | 1.7.x - 1.6.x                     |
| 2.5.x          | 1.6.x - 1.5.x                     |
| 2.4.x          | 1.6.x - 1.5.x                     |
| 2.3.x          | 1.5.x - 1.4.x                     |
| 2.2.x          | 1.5.x - 1.4.x                     |
| 2.1.x          | 1.5.x - 1.4.x                     |
| 2.0.x          | 1.4.x - 1.3.x                     |
