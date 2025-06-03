---
title: "Role-based Access Control"
description: "Explique comment Helm interagit avec le contrôle d'accès basé sur les rôles (RBAC) de Kubernetes."
weight: 11
---

Dans Kubernetes, accorder des rôles à un utilisateur ou à un compte de service spécifique à une application est une bonne pratique pour garantir que votre application fonctionne dans le périmètre que vous avez spécifié. Pour en savoir plus sur les autorisations des comptes de service, consultez la [documentation officielle de Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions).

À partir de Kubernetes 1.6, le contrôle d'accès basé sur les rôles (RBAC) est activé par défaut. RBAC vous permet de spécifier quels types d'actions sont autorisés en fonction de l'utilisateur et de son rôle au sein de votre organisation.

Avec RBAC, vous pouvez :

- accorder des opérations privilégiées (création de ressources à l'échelle du cluster, comme de nouveaux rôles) aux administrateurs
- limiter la capacité d'un utilisateur à créer des ressources (pods, volumes persistants, déploiements) à des namespaces spécifiques, ou à l'échelle du cluster (quotas de ressources, rôles, définitions de ressources personnalisées)
- limiter la capacité d'un utilisateur à consulter des ressources, soit dans des namespaces spécifiques, soit à l'échelle du cluster.

Ce guide s'adresse aux administrateurs qui souhaitent restreindre la portée de l'interaction d'un utilisateur avec l'API Kubernetes.

## Gestion des comptes utilisateurs

Tous les clusters Kubernetes ont deux catégories d'utilisateurs : les comptes de service (ServiceAccount) gérés par Kubernetes et les utilisateurs normaux.

Les utilisateurs normaux sont supposés être gérés par un service externe et indépendant, comme un administrateur distribuant des clés privées, un magasin d'utilisateurs tel que Keystone ou Google Accounts, voire un fichier contenant une liste de noms d'utilisateur et de mots de passe. À cet égard, Kubernetes ne dispose pas d'objets représentant des comptes d'utilisateurs normaux. Les utilisateurs normaux ne peuvent pas être ajoutés à un cluster via un appel API.

En revanche, les comptes de service sont des utilisateurs gérés par l'API Kubernetes. Ils sont liés à des namespaces spécifiques et créés automatiquement par le serveur API ou manuellement via des appels API. Les comptes de service sont associés à un ensemble d'identifiants stockés sous forme de Secrets, qui sont montés dans des pods, permettant ainsi aux processus internes du cluster de communiquer avec l'API Kubernetes.

Les demandes API sont associées soit à un utilisateur normal, soit à un compte de service, ou sont traitées comme des demandes anonymes. Cela signifie que chaque processus à l'intérieur ou à l'extérieur du cluster, qu'il s'agisse d'un utilisateur humain tapant `kubectl` sur une station de travail, de kubelets sur des nœuds, ou de membres du plan de contrôle, doit s'authentifier lorsqu'il fait des demandes au serveur API, ou être traité comme un utilisateur anonyme.

## Roles, ClusterRoles, RoleBindings et ClusterRoleBindings

Dans Kubernetes, les comptes utilisateurs et les comptes de service ne peuvent voir et modifier que les ressources auxquelles ils ont été autorisés. Cet accès est accordé par l'utilisation de Rôles et de RoleBindings. Les Rôles et les RoleBindings sont liés à un namespace particulier, ce qui accorde aux utilisateurs la possibilité de voir et/ou de modifier les ressources dans ce namespace auxquelles le Rôle leur donne accès.

À l'échelle du cluster, ces objets sont appelés ClusterRoles et ClusterRoleBindings. Accorder à un utilisateur un ClusterRole lui donne accès pour voir et/ou modifier des ressources dans l'ensemble du cluster. Il est également nécessaire pour voir et/ou modifier des ressources à l'échelle du cluster (namespaces, quotas de ressources, nœuds).

Les ClusterRoles peuvent être liés à un namespace particulier par le biais d'une référence dans un RoleBinding. Les ClusterRoles par défaut `admin`, `edit` et `view` sont souvent utilisés de cette manière.

Voici quelques ClusterRoles disponibles par défaut dans Kubernetes. Ils sont destinés à être des rôles orientés utilisateur. Ils incluent des rôles super-utilisateur (`cluster-admin`), ainsi que des rôles avec un accès plus granulaire (`admin`, `edit`, `view`).

| ClusterRole par défaut | ClusterRoleBinding par défaut | Description
|------------------------|-------------------------------|-------------
| `cluster-admin`        | Groupe `system:masters`       | Permet un accès super-utilisateur pour effectuer toute action sur n'importe quelle ressource. Lorsqu'il est utilisé dans un ClusterRoleBinding, il donne un contrôle total sur chaque ressource du cluster et dans tous les namespaces. Lorsqu'il est utilisé dans un RoleBinding, il donne un contrôle total sur chaque ressource dans le namespace du RoleBinding, y compris le namespace lui-même.
| `admin`                | Aucun                         | Permet un accès administrateur, destiné à être accordé dans un namespace via un RoleBinding. Lorsqu'il est utilisé dans un RoleBinding, il permet un accès en lecture/écriture à la plupart des ressources dans un namespace, y compris la possibilité de créer des rôles et des RoleBindings dans le namespace. Il n'autorise pas l'accès en écriture aux quotas de ressources ou au namespace lui-même.
| `edit`                 | Aucun                         | Permet un accès en lecture/écriture à la plupart des objets dans un namespace. Il ne permet pas de voir ou de modifier les rôles ou les RoleBindings.
| `view`                 | Aucun                         | Permet un accès en lecture seule pour voir la plupart des objets dans un namespace. Il ne permet pas de voir les rôles ou les RoleBindings. Il ne permet pas de voir les secrets, car ceux-ci sont considérés comme des informations sensibles.

## Restreindre l'accès d'un compte utilisateur en utilisant RBAC

Maintenant que nous comprenons les bases du contrôle d'accès basé sur les rôles, discutons de la manière dont un administrateur peut restreindre le périmètre d'accès d'un utilisateur.

### Exemple : Accorder à un utilisateur un accès en lecture/écriture à un namespace particulier

Pour restreindre l'accès d'un utilisateur à un namespace particulier, nous pouvons utiliser soit le rôle `edit`, soit le rôle `admin`. Si vos charts créent ou interagissent avec des Roles et des RoleBindings, vous voudrez utiliser le ClusterRole `admin`.

De plus, vous pouvez également créer un RoleBinding avec un accès `cluster-admin`. Accorder à un utilisateur un accès `cluster-admin` à l'échelle du namespace lui donne un contrôle total sur chaque ressource dans le namespace, y compris le namespace lui-même.

Pour cet exemple, nous allons créer un utilisateur avec le rôle `edit`. Tout d'abord, créez le namespace :

```console
$ kubectl create namespace foo
```

Maintenant, créez un RoleBinding dans ce namespace, accordant à l'utilisateur le rôle `edit`.

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### Exemple : Accorder à un utilisateur un accès en lecture/écriture à l'échelle du cluster

Si un utilisateur souhaite installer un chart qui crée des ressources à l'échelle du cluster (namespaces, rôles, définitions de ressources personnalisées, etc.), il aura besoin d'un accès en écriture à l'échelle du cluster.

Pour cela, accordez à l'utilisateur un accès `admin` ou `cluster-admin`.

Accorder un accès `cluster-admin` à un utilisateur lui donne accès à toutes les ressources disponibles dans Kubernetes, y compris l'accès aux nœuds avec `kubectl drain` et d'autres tâches administratives. Il est fortement recommandé de considérer la possibilité de fournir à l'utilisateur un accès `admin` à la place, ou de créer un ClusterRole personnalisé adapté à ses besoins.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### Exemple : Accorder à un utilisateur un accès en lecture seule à un namespace particulier

Vous aurez peut-être remarqué qu'il n'existe pas de ClusterRole pour visualiser les secrets. Le ClusterRole `view` n'accorde pas à un utilisateur un accès en lecture aux Secrets en raison de préoccupations liées à l'escalade des privilèges. Helm stocke les métadonnées des releases sous forme de Secrets par défaut.

Pour qu'un utilisateur puisse exécuter `helm list`, il doit être en mesure de lire ces secrets. Pour cela, nous allons créer un ClusterRole spécial appelé `secret-reader`.

Créez le fichier `cluster-role-secret-reader.yaml` et écrivez le contenu suivant dans le fichier :

```yaml
apiVersion: rbac.authorization.k8s.io/v1​
kind: ClusterRole​
metadata:​
  name: secret-reader​
rules:​
- apiGroups: [""]​
  resources: ["secrets"]​
  verbs: ["get", "watch", "list"]
```

Ensuite, créez le ClusterRole en utilisant la commande suivante :

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

Une fois cela fait, nous pouvons accorder à un utilisateur un accès en lecture à la plupart des ressources, puis lui accorder un accès en lecture aux secrets :

```console
$ kubectl create namespace foo

$ kubectl create rolebinding sam-view
    --clusterrole view \​
    --user sam \​
    --namespace foo

$ kubectl create rolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam \​
    --namespace foo
```

### Exemple : Accorder à un utilisateur un accès en lecture seule à l'échelle du cluster

Dans certains scénarios, il peut être avantageux d'accorder à un utilisateur un accès à l'échelle du cluster. Par exemple, si un utilisateur souhaite exécuter la commande `helm list --all-namespaces`, l'API exige que l'utilisateur dispose d'un accès en lecture à l'échelle du cluster.

Pour ce faire, accordez à l'utilisateur à la fois les accès `view` et `secret-reader` comme décrit ci-dessus, mais avec un ClusterRoleBinding.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## Réflexions supplémentaires

Les exemples ci-dessus utilisent les ClusterRoles par défaut fournis avec Kubernetes. Pour un contrôle plus granulaire sur les ressources auxquelles les utilisateurs ont accès, consultez [la documentation de Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) sur la création de vos propres rôles et ClusterRoles personnalisés.
