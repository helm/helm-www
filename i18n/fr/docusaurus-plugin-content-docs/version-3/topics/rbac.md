---
title: Contrôle d'accès basé sur les rôles
description: Explique comment Helm interagit avec le contrôle d'accès basé sur les rôles (RBAC) de Kubernetes.
sidebar_position: 11
---

Dans Kubernetes, attribuer des rôles à un utilisateur ou à un compte de service
spécifique à une application est une bonne pratique pour garantir que votre
application fonctionne dans le périmètre que vous avez défini. Pour en savoir
plus sur les permissions des comptes de service, consultez [la documentation
officielle de Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions).

Depuis Kubernetes 1.6, le contrôle d'accès basé sur les rôles est activé par
défaut. RBAC vous permet de spécifier quels types d'actions sont autorisées en
fonction de l'utilisateur et de son rôle dans votre organisation.

Avec RBAC, vous pouvez :

- accorder des opérations privilégiées (création de ressources à l'échelle du
  cluster, comme de nouveaux rôles) aux administrateurs
- limiter la capacité d'un utilisateur à créer des ressources (Pods, volumes
  persistants, Deployments) à des namespaces spécifiques, ou à l'échelle du
  cluster (quotas de ressources, rôles, Custom Resource Definitions)
- limiter la capacité d'un utilisateur à visualiser des ressources dans des
  namespaces spécifiques ou à l'échelle du cluster.

Ce guide s'adresse aux administrateurs qui souhaitent restreindre le périmètre
d'interaction d'un utilisateur avec l'API Kubernetes.

## Gestion des comptes utilisateurs

Tous les clusters Kubernetes disposent de deux catégories d'utilisateurs : les
comptes de service gérés par Kubernetes, et les utilisateurs normaux.

Les utilisateurs normaux sont supposés être gérés par un service externe
indépendant. Il peut s'agir d'un administrateur distribuant des clés privées,
d'un annuaire d'utilisateurs comme Keystone ou Google Accounts, voire d'un
fichier contenant une liste de noms d'utilisateurs et de mots de passe. À cet
égard, Kubernetes ne possède pas d'objets représentant les comptes utilisateurs
normaux. Les utilisateurs normaux ne peuvent pas être ajoutés à un cluster via
un appel API.

En revanche, les comptes de service sont des utilisateurs gérés par l'API
Kubernetes. Ils sont liés à des namespaces spécifiques et créés automatiquement
par le serveur API ou manuellement via des appels API. Les comptes de service
sont associés à un ensemble d'identifiants stockés en tant que Secrets, qui sont
montés dans les Pods permettant aux processus du cluster de communiquer avec
l'API Kubernetes.

Les requêtes API sont liées soit à un utilisateur normal, soit à un compte de
service, soit traitées comme des requêtes anonymes. Cela signifie que chaque
processus à l'intérieur ou à l'extérieur du cluster, qu'il s'agisse d'un
utilisateur humain exécutant `kubectl` sur un poste de travail, des kubelets sur
les nœuds, ou des membres du plan de contrôle, doit s'authentifier lors des
requêtes au serveur API, sinon il sera traité comme un utilisateur anonyme.

## Roles, ClusterRoles, RoleBindings et ClusterRoleBindings

Dans Kubernetes, les comptes utilisateurs et les comptes de service ne peuvent
visualiser et modifier que les ressources auxquelles ils ont été autorisés à
accéder. Cet accès est accordé via l'utilisation de Roles et de RoleBindings.
Les Roles et RoleBindings sont liés à un namespace particulier, ce qui permet
aux utilisateurs de visualiser et/ou de modifier les ressources au sein de ce
namespace auxquelles le Role leur donne accès.

À l'échelle du cluster, on parle de ClusterRoles et de ClusterRoleBindings.
Accorder un ClusterRole à un utilisateur lui donne accès à la visualisation
et/ou à la modification des ressources sur l'ensemble du cluster. C'est
également nécessaire pour visualiser et/ou modifier des ressources à l'échelle
du cluster (namespaces, quotas de ressources, nœuds).

Les ClusterRoles peuvent être liés à un namespace particulier via une référence
dans un RoleBinding. Les ClusterRoles par défaut `admin`, `edit` et `view` sont
couramment utilisés de cette manière.

Voici quelques ClusterRoles disponibles par défaut dans Kubernetes. Ils sont
destinés aux utilisateurs finaux. Ils comprennent des rôles de super-utilisateur
(`cluster-admin`), et des rôles avec des accès plus granulaires (`admin`,
`edit`, `view`).

| ClusterRole par défaut | ClusterRoleBinding par défaut | Description
|------------------------|-------------------------------|-------------
| `cluster-admin`        | groupe `system:masters`       | Permet un accès super-utilisateur pour effectuer n'importe quelle action sur n'importe quelle ressource. Lorsqu'il est utilisé dans un ClusterRoleBinding, il donne un contrôle total sur chaque ressource du cluster et de tous les namespaces. Lorsqu'il est utilisé dans un RoleBinding, il donne un contrôle total sur chaque ressource du namespace du RoleBinding, y compris le namespace lui-même.
| `admin`                | Aucun                         | Permet un accès administrateur, destiné à être accordé au sein d'un namespace via un RoleBinding. S'il est utilisé dans un RoleBinding, il permet un accès en lecture/écriture à la plupart des ressources d'un namespace, y compris la possibilité de créer des Roles et des RoleBindings au sein du namespace. Il ne permet pas l'accès en écriture aux quotas de ressources ou au namespace lui-même.
| `edit`                 | Aucun                         | Permet un accès en lecture/écriture à la plupart des objets d'un namespace. Il ne permet pas de visualiser ou de modifier les Roles ou les RoleBindings.
| `view`                 | Aucun                         | Permet un accès en lecture seule pour voir la plupart des objets d'un namespace. Il ne permet pas de visualiser les Roles ou les RoleBindings. Il ne permet pas de visualiser les Secrets, car cela constituerait une élévation de privilèges.

## Restreindre l'accès d'un compte utilisateur avec RBAC

Maintenant que nous comprenons les bases du contrôle d'accès basé sur les rôles,
voyons comment un administrateur peut restreindre le périmètre d'accès d'un
utilisateur.

### Exemple : Accorder à un utilisateur un accès en lecture/écriture à un namespace particulier

Pour restreindre l'accès d'un utilisateur à un namespace particulier, nous
pouvons utiliser soit le rôle `edit`, soit le rôle `admin`. Si vos charts créent
ou interagissent avec des Roles et des RoleBindings, vous devrez utiliser le
ClusterRole `admin`.

De plus, vous pouvez également créer un RoleBinding avec un accès
`cluster-admin`. Accorder à un utilisateur l'accès `cluster-admin` au niveau
d'un namespace lui donne un contrôle total sur chaque ressource du namespace, y
compris le namespace lui-même.

Pour cet exemple, nous allons créer un utilisateur avec le Role `edit`. Tout
d'abord, créez le namespace :

```console
$ kubectl create namespace foo
```

Ensuite, créez un RoleBinding dans ce namespace, accordant à l'utilisateur le
rôle `edit`.

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### Exemple : Accorder à un utilisateur un accès en lecture/écriture à l'échelle du cluster

Si un utilisateur souhaite installer un chart qui installe des ressources à
l'échelle du cluster (namespaces, rôles, Custom Resource Definitions, etc.), il
aura besoin d'un accès en écriture à l'échelle du cluster.

Pour cela, accordez à l'utilisateur l'accès `admin` ou `cluster-admin`.

Accorder à un utilisateur l'accès `cluster-admin` lui donne accès à absolument
toutes les ressources disponibles dans Kubernetes, y compris l'accès aux nœuds
avec `kubectl drain` et d'autres tâches administratives. Il est fortement
recommandé d'envisager de fournir à l'utilisateur l'accès `admin` à la place, ou
de créer un ClusterRole personnalisé adapté à ses besoins.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### Exemple : Accorder à un utilisateur un accès en lecture seule à un namespace particulier

Vous avez peut-être remarqué qu'il n'existe pas de ClusterRole permettant de
visualiser les Secrets. Le ClusterRole `view` n'accorde pas l'accès en lecture
aux Secrets car cela permettrait une élévation de privilèges. Helm stocke les
métadonnées des releases en tant que Secrets par défaut.

Pour qu'un utilisateur puisse exécuter `helm list`, il doit pouvoir lire ces
Secrets. Pour cela, nous allons créer un ClusterRole spécial `secret-reader`.

Créez le fichier `cluster-role-secret-reader.yaml` et écrivez le contenu suivant
dans le fichier :

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

Ensuite, créez le ClusterRole avec la commande :

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

Une fois cela fait, nous pouvons accorder à un utilisateur un accès en lecture à
la plupart des ressources, puis lui accorder un accès en lecture aux Secrets :

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

Dans certains scénarios, il peut être utile d'accorder à un utilisateur un accès
à l'échelle du cluster. Par exemple, si un utilisateur souhaite exécuter la
commande `helm list --all-namespaces`, l'API exige que l'utilisateur dispose
d'un accès en lecture à l'échelle du cluster.

Pour cela, accordez à l'utilisateur les accès `view` et `secret-reader` comme
décrit ci-dessus, mais avec un ClusterRoleBinding.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## Réflexions supplémentaires

Les exemples présentés ci-dessus utilisent les ClusterRoles par défaut fournis
avec Kubernetes. Pour un contrôle plus fin sur les ressources auxquelles les
utilisateurs ont accès, consultez [la documentation
Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) sur
la création de vos propres Roles et ClusterRoles personnalisés.
