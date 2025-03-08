---
title: "Gestion des autorisations pour le backend de stockage SQL"
description: "Découvrez comment configurer les autorisations lors de l'utilisation d'un backend de stockage SQL"
---

Ce document a pour objectif de fournir des conseils aux utilisateurs pour la configuration et la gestion des autorisations lors de l'utilisation d'un backend de stockage SQL.

## Introduction

Pour gérer les autorisations, Helm s'appuie sur la fonctionnalité RBAC de Kubernetes. Lors de l'utilisation du backend de stockage SQL, les rôles de Kubernetes ne peuvent pas être utilisés pour déterminer si un utilisateur peut accéder à une ressource donnée. Ce document montre comment créer et gérer ces autorisations.

## Initialisation

La première fois que l'interface en ligne de commande Helm se connectera à votre base de données, le client s'assurera qu'elle a été initialisée au préalable. Si ce n'est pas le cas, il s'occupera automatiquement de la configuration nécessaire. Cette initialisation nécessite des privilèges d'administrateur sur le schéma public, ou au moins la capacité de :

* créer une table  
* accorder des privilèges sur le schéma public

Après l'exécution de la migration sur votre base de données, tous les autres rôles peuvent utiliser le client.

## Accorder des privilèges à un utilisateur non administrateur dans PostgreSQL

Pour gérer les autorisations, le pilote de backend SQL utilise la fonctionnalité [RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) (Row Security Level) de PostgreSQL. RLS permet à tous les utilisateurs de lire/écrire dans la même table, sans pouvoir manipuler les mêmes lignes s'ils n'y sont pas explicitement autorisés. Par défaut, tout rôle qui n'a pas reçu les privilèges appropriés renverra toujours une liste vide lors de l'exécution de la commande `helm list` et ne pourra ni récupérer ni modifier une ressource dans le cluster.

Voyons comment accorder à un rôle donné l'accès à des espaces de noms spécifiques :

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

Cette commande accordera les autorisations de lecture et d'écriture pour toutes les ressources répondant à la condition `namespace = 'default'` au rôle `role`. Après avoir créé cette politique, l'utilisateur connecté à la base de données au nom du rôle `role` pourra donc voir toutes les releases se trouvant dans l'espace de noms `default` lors de l'exécution de `helm list`, ainsi que les modifier et les supprimer.

Les privilèges peuvent être gérés de manière granulaire avec RLS, et il peut être intéressant de restreindre l'accès en fonction des différentes colonnes de la table :
* key
* type
* body
* name
* namespace
* version
* status
* owner
* createdAt
* modifiedAt
