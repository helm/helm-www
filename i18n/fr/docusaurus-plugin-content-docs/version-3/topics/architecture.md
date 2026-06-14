---
title: Architecture de Helm
description: Décrit l'architecture de Helm à un niveau général.
sidebar_position: 8
---

# Architecture de Helm

Ce document décrit l'architecture de Helm à un niveau général.

## L'objectif de Helm

Helm est un outil de gestion des paquets Kubernetes appelés _charts_. Helm peut effectuer les opérations suivantes :

- Créer de nouveaux charts à partir de zéro
- Empaqueter des charts dans des fichiers d'archive (tgz)
- Interagir avec des dépôts de charts où les charts sont stockés
- Installer et désinstaller des charts dans un cluster Kubernetes existant
- Gérer le cycle de release des charts installés avec Helm

Pour Helm, il existe trois concepts importants :

1. Le _chart_ est un ensemble d'informations nécessaires à la création d'une instance d'une application Kubernetes.
2. La _config_ contient les informations de configuration qui peuvent être fusionnées avec un chart empaqueté pour créer un objet déployable.
3. Une _release_ est une instance en cours d'exécution d'un _chart_, combinée avec une _config_ spécifique.

## Composants

Helm est un exécutable implémenté en deux parties distinctes :

**Le client Helm** est un client en ligne de commande destiné aux utilisateurs finaux. Le client est responsable des opérations suivantes :

- Développement local de charts
- Gestion des dépôts
- Gestion des releases
- Interface avec la bibliothèque Helm
  - Envoi de charts à installer
  - Demande de mise à niveau ou de désinstallation de releases existantes

**La bibliothèque Helm** fournit la logique pour exécuter toutes les opérations Helm. Elle communique avec le serveur d'API Kubernetes et permet de :

- Combiner un chart et une configuration pour créer une release
- Installer des charts dans Kubernetes et fournir l'objet release résultant
- Mettre à niveau et désinstaller des charts en interagissant avec Kubernetes

La bibliothèque Helm autonome encapsule la logique Helm afin qu'elle puisse être utilisée par différents clients.

## Implémentation

Le client et la bibliothèque Helm sont écrits dans le langage de programmation Go.

La bibliothèque utilise la bibliothèque client Kubernetes pour communiquer avec Kubernetes. Actuellement, cette bibliothèque utilise REST+JSON. Elle stocke les informations dans des Secrets situés dans Kubernetes. Elle ne nécessite pas sa propre base de données.

Les fichiers de configuration sont, dans la mesure du possible, écrits en YAML.
