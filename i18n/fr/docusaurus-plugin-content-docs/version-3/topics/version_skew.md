---
title: "Politique de Prise en Charge des Versions Helm"
description: "Décrit la politique de publication des correctifs de Helm ainsi que le décalage de version maximal pris en charge entre Helm et Kubernetes."
---

Ce document décrit le décalage de version maximal pris en charge entre Helm et
Kubernetes.

## Versions Prises en Charge

Les versions de Helm sont exprimées sous la forme `x.y.z`, où `x` est la version
majeure, `y` est la version mineure et `z` est la version de correctif, suivant
la terminologie du [Versionnement Sémantique](https://semver.org/spec/v2.0.0.html).

Le projet Helm maintient une branche de release pour la version mineure la plus
récente. Les correctifs applicables, y compris les correctifs de sécurité, sont
intégrés à la branche de release, en fonction de la gravité et de la faisabilité.
Plus de détails sont disponibles dans la [politique de publication de Helm](/topics/release_policy.md).

## Décalage de Version Pris en Charge

Lorsqu'une nouvelle version de Helm est publiée, elle est compilée pour une
version mineure particulière de Kubernetes. Par exemple, Helm 3.0.0 interagit
avec Kubernetes en utilisant le client Kubernetes 1.16.2, et est donc compatible
avec Kubernetes 1.16.

À partir de Helm 3, Helm est considéré comme compatible avec les versions `n-3`
de Kubernetes pour lesquelles il a été compilé. En raison des changements
apportés par Kubernetes entre les versions mineures, la politique de prise en
charge de Helm 2 est légèrement plus stricte, prenant en charge les versions
`n-1` de Kubernetes.

Par exemple, si vous utilisez une version de Helm 3 compilée avec les API du
client Kubernetes 1.17, vous pouvez l'utiliser en toute sécurité avec Kubernetes
1.17, 1.16, 1.15 et 1.14. Si vous utilisez une version de Helm 2 compilée avec
les API du client Kubernetes 1.16, vous pouvez l'utiliser en toute sécurité avec
Kubernetes 1.16 et 1.15.

Il n'est pas recommandé d'utiliser Helm avec une version de Kubernetes plus
récente que celle pour laquelle il a été compilé, car Helm ne garantit pas la
compatibilité ascendante.

Si vous choisissez d'utiliser Helm avec une version de Kubernetes non prise en
charge, vous le faites à vos propres risques.

Veuillez consulter le tableau ci-dessous pour déterminer quelle version de Helm
est compatible avec votre cluster.

| Version Helm | Versions Kubernetes Prises en Charge |
|--------------|--------------------------------------|
| 3.20.x       | 1.35.x - 1.32.x                      |
| 3.19.x       | 1.34.x - 1.31.x                      |
| 3.18.x       | 1.33.x - 1.30.x                      |
| 3.17.x       | 1.32.x - 1.29.x                      |
| 3.16.x       | 1.31.x - 1.28.x                      |
| 3.15.x       | 1.30.x - 1.27.x                      |
| 3.14.x       | 1.29.x - 1.26.x                      |
| 3.13.x       | 1.28.x - 1.25.x                      |
| 3.12.x       | 1.27.x - 1.24.x                      |
| 3.11.x       | 1.26.x - 1.23.x                      |
| 3.10.x       | 1.25.x - 1.22.x                      |
| 3.9.x        | 1.24.x - 1.21.x                      |
| 3.8.x        | 1.23.x - 1.20.x                      |
| 3.7.x        | 1.22.x - 1.19.x                      |
| 3.6.x        | 1.21.x - 1.18.x                      |
| 3.5.x        | 1.20.x - 1.17.x                      |
| 3.4.x        | 1.19.x - 1.16.x                      |
| 3.3.x        | 1.18.x - 1.15.x                      |
| 3.2.x        | 1.18.x - 1.15.x                      |
| 3.1.x        | 1.17.x - 1.14.x                      |
| 3.0.x        | 1.16.x - 1.13.x                      |
| 2.16.x       | 1.16.x - 1.15.x                      |
| 2.15.x       | 1.15.x - 1.14.x                      |
| 2.14.x       | 1.14.x - 1.13.x                      |
| 2.13.x       | 1.13.x - 1.12.x                      |
| 2.12.x       | 1.12.x - 1.11.x                      |
| 2.11.x       | 1.11.x - 1.10.x                      |
| 2.10.x       | 1.10.x - 1.9.x                       |
| 2.9.x        | 1.10.x - 1.9.x                       |
| 2.8.x        | 1.9.x - 1.8.x                        |
| 2.7.x        | 1.8.x - 1.7.x                        |
| 2.6.x        | 1.7.x - 1.6.x                        |
| 2.5.x        | 1.6.x - 1.5.x                        |
| 2.4.x        | 1.6.x - 1.5.x                        |
| 2.3.x        | 1.5.x - 1.4.x                        |
| 2.2.x        | 1.5.x - 1.4.x                        |
| 2.1.x        | 1.5.x - 1.4.x                        |
| 2.0.x        | 1.4.x - 1.3.x                        |
