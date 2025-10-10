---
title: "Architecture de Helm"
description: "Décrit l'architecture de Helm à un niveau élevé"
weight: 8
---

# Architecture de Helm

Ce document décrit l'architecture de Helm à un niveau élevé.

## L'objectif de Helm

Helm est un outil pour gérer les packages Kubernetes appelés _charts_. Helm peut faire ce qui suit :

- Créer de nouveaux charts à partir de zéro
- Emballer les charts dans des archives de chart (.tgz)
- Interagir avec les dépôts de charts où les charts sont stockés
- Installer et désinstaller des charts dans un cluster Kubernetes existant
- Gérer le cycle de vie des releases de charts qui ont été installées avec Helm

Pour Helm, il y a trois concepts importants :

1. Le _chart_ est un ensemble d'informations nécessaires pour créer une instance d'une application Kubernetes.
2. La _config_ contient des informations de configuration qui peuvent être fusionnées dans un chart emballé pour créer un objet déployable.
3. Une _release_ est une instance en cours d'exécution d'un _chart_, combinée avec une configuration spécifique.

## Composants

Helm est un exécutable qui est implémenté en deux parties distinctes :

**Le Client Helm** est un client en ligne de commande pour les utilisateurs finaux. Le client est responsable des éléments suivants :

- Développement local de charts
- Gestion des dépôts
- Gestion des releases
- Interface avec la bibliothèque Helm
  - Envoi des charts à installer
  - Demande de mise à jour ou de désinstallation des releases existantes

**La Bibliothèque Helm** fournit la logique pour exécuter toutes les opérations Helm. Elle interagit avec le serveur API Kubernetes et offre les capacités suivantes :

- Combinaison d'un chart et d'une configuration pour créer une release
- Installation de charts dans Kubernetes et fourniture de l'objet de release correspondant
- Mise à jour et désinstallation de charts en interagissant avec Kubernetes

La bibliothèque Helm autonome encapsule la logique Helm afin qu'elle puisse être utilisée par différents clients.

## Implémentation

Le client Helm et la bibliothèque sont écrits en langage de programmation Go.

La bibliothèque utilise la bibliothèque cliente Kubernetes pour communiquer avec Kubernetes. Actuellement, cette bibliothèque utilise REST+JSON. Elle stocke les informations dans des Secrets situés à l'intérieur de Kubernetes. Elle n'a pas besoin de sa propre base de données.

Les fichiers de configuration sont, lorsque cela est possible, écrits en YAML.
