---
title: Gestion des permissions pour le backend de stockage SQL
description: Découvrez comment configurer les permissions lors de l'utilisation du backend de stockage SQL.
---

Ce document explique comment configurer et gérer les permissions lors de
l'utilisation du backend de stockage SQL.

## Introduction

Pour gérer les permissions, Helm s'appuie sur la fonctionnalité RBAC de
Kubernetes. Lorsque vous utilisez le backend de stockage SQL, les rôles
Kubernetes ne peuvent pas être utilisés pour déterminer si un utilisateur peut
accéder à une ressource donnée ou non. Ce document explique comment créer et
gérer ces permissions.

## Initialisation

La première fois que le CLI Helm se connectera à votre base de données, le
client s'assurera qu'elle a été préalablement initialisée. Si ce n'est pas le
cas, il effectuera automatiquement la configuration nécessaire. Cette
initialisation nécessite des privilèges d'administrateur sur le schéma public,
ou au minimum la capacité de :

* créer une table
* accorder des privilèges sur le schéma public

Une fois la migration exécutée sur votre base de données, tous les autres rôles
peuvent utiliser le client.

## Accorder des privilèges à un utilisateur non administrateur dans PostgreSQL

Pour gérer les permissions, le pilote du backend SQL utilise la fonctionnalité
[RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) (Row Security
Level) de PostgreSQL. RLS permet à tous les utilisateurs de lire et écrire dans
la même table, sans pouvoir manipuler les mêmes lignes s'ils n'y sont pas
explicitement autorisés. Par défaut, tout rôle qui n'a pas reçu explicitement
les privilèges appropriés obtiendra toujours une liste vide lors de l'exécution
de `helm list` et ne pourra ni récupérer ni modifier aucune ressource dans le
cluster.

Voyons comment accorder à un rôle donné l'accès à des namespaces spécifiques :

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

Cette commande accordera au rôle `role` les permissions de lecture et d'écriture
sur toutes les ressources qui respectent la condition `namespace = 'default'`.
Après la création de cette politique, l'utilisateur connecté à la base de
données pour le compte du rôle `role` pourra voir toutes les releases présentes
dans le namespace `default` lors de l'exécution de `helm list`, ainsi que les
modifier et les supprimer.

Les privilèges peuvent être gérés de manière granulaire avec RLS, et vous
pouvez restreindre l'accès en fonction des différentes colonnes de la table :
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
