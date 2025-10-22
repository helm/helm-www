---
title: Role-based Access Control
description: Explains how Helm interacts with Kubernetes' Role-Based Access Control.
sidebar_position: 11
---

In Kubernetes, granting roles to a user or an application-specific service
account is a best practice to ensure that your application is operating in the
scope that you have specified. Read more about service account permissions [in
the official Kubernetes
docs](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions).

From Kubernetes 1.6 onwards, Role-based Access Control is enabled by default.
RBAC allows you to specify which types of actions are permitted depending on the
user and their role in your organization.

With RBAC, you can

- grant privileged operations (creating cluster-wide resources, like new roles)
  to administrators
- limit a user's ability to create resources (pods, persistent volumes,
  deployments) to specific namespaces, or in cluster-wide scopes (resource
  quotas, roles, custom resource definitions)
- limit a user's ability to view resources either in specific namespaces or at a
  cluster-wide scope.

This guide is for administrators who want to restrict the scope of a user's
interaction with the Kubernetes API.

## Managing user accounts

All Kubernetes clusters have two categories of users: service accounts managed
by Kubernetes, and normal users.

Normal users are assumed to be managed by an outside, independent service. An
administrator distributing private keys, a user store like Keystone or Google
Accounts, even a file with a list of usernames and passwords. In this regard,
Kubernetes does not have objects which represent normal user accounts. Normal
users cannot be added to a cluster through an API call.

In contrast, service accounts are users managed by the Kubernetes API. They are
bound to specific namespaces, and created automatically by the API server or
manually through API calls. Service accounts are tied to a set of credentials
stored as Secrets, which are mounted into pods allowing in-cluster processes to
talk to the Kubernetes API.

API requests are tied to either a normal user or a service account, or are
treated as anonymous requests. This means every process inside or outside the
cluster, from a human user typing `kubectl` on a workstation, to kubelets on
nodes, to members of the control plane, must authenticate when making requests
to the API server, or be treated as an anonymous user.

## Roles, ClusterRoles, RoleBindings, and ClusterRoleBindings

In Kubernetes, user accounts and service accounts can only view and edit
resources they have been granted access to. This access is granted through the
use of Roles and RoleBindings. Roles and RoleBindings are bound to a particular
namespace, which grant users the ability to view and/or edit resources within
that namespace the Role provides them access to.

At a cluster scope, these are called ClusterRoles and ClusterRoleBindings.
Granting a user a ClusterRole grants them access to view and/or edit resources
across the entire cluster. It is also required to view and/or edit resources at
the cluster scope (namespaces, resource quotas, nodes).

ClusterRoles can be bound to a particular namespace through reference in a
RoleBinding. The `admin`, `edit` and `view` default ClusterRoles are commonly
used in this manner.

These are a few ClusterRoles available by default in Kubernetes. They are
intended to be user-facing roles. They include super-user roles
(`cluster-admin`), and roles with more granular access (`admin`, `edit`,
`view`).

| Default ClusterRole | Default ClusterRoleBinding | Description
|---------------------|----------------------------|-------------
| `cluster-admin`     | `system:masters` group     | Allows super-user access to perform any action on any resource. When used in a ClusterRoleBinding, it gives full control over every resource in the cluster and in all namespaces. When used in a RoleBinding, it gives full control over every resource in the rolebinding's namespace, including the namespace itself.
| `admin`             | None                       | Allows admin access, intended to be granted within a namespace using a RoleBinding. If used in a RoleBinding, allows read/write access to most resources in a namespace, including the ability to create roles and rolebindings within the namespace. It does not allow write access to resource quota or to the namespace itself.
| `edit`              | None                       | Allows read/write access to most objects in a namespace. It does not allow viewing or modifying roles or rolebindings.
| `view`              | None                       | Allows read-only access to see most objects in a namespace. It does not allow viewing roles or rolebindings. It does not allow viewing secrets, since those are escalating.

## Restricting a user account's access using RBAC

Now that we understand the basics of Role-based Access Control, let's discuss
how an administrator can restrict a user's scope of access.

### Example: Grant a user read/write access to a particular namespace

To restrict a user's access to a particular namespace, we can use either the
`edit` or the `admin` role. If your charts create or interact with Roles and
Rolebindings, you'll want to use the `admin` ClusterRole.

Additionally, you may also create a RoleBinding with `cluster-admin` access.
Granting a user `cluster-admin` access at the namespace scope provides full
control over every resource in the namespace, including the namespace itself.

For this example, we will create a user with the `edit` Role. First, create the
namespace:

```console
$ kubectl create namespace foo
```

Now, create a RoleBinding in that namespace, granting the user the `edit` role.

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### Example: Grant a user read/write access at the cluster scope

If a user wishes to install a chart that installs cluster-scope resources
(namespaces, roles, custom resource definitions, etc.), they will require
cluster-scope write access.

To do that, grant the user either `admin` or `cluster-admin` access.

Granting a user `cluster-admin` access grants them access to absolutely every
resource available in Kubernetes, including node access with `kubectl drain` and
other administrative tasks. It is highly recommended to consider providing the
user `admin` access instead, or to create a custom ClusterRole tailored to their
needs.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### Example: Grant a user read-only access to a particular namespace

You might've noticed that there is no ClusterRole available for viewing secrets.
The `view` ClusterRole does not grant a user read access to Secrets due to
escalation concerns. Helm stores release metadata as Secrets by default.

In order for a user to run `helm list`, they need to be able to read these
secrets. For that, we will create a special `secret-reader` ClusterRole.

Create the file `cluster-role-secret-reader.yaml` and write the following
content into the file:

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

Then, create the ClusterRole using

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

Once that's done, we can grant a user read access to most resources, and then
grant them read access to secrets:

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

### Example: Grant a user read-only access at the cluster scope

In certain scenarios, it may be beneficial to grant a user cluster-scope access.
For example, if a user wants to run the command `helm list --all-namespaces`,
the API requires the user has cluster-scope read access.

To do that, grant the user both `view` and `secret-reader` access as described
above, but with a ClusterRoleBinding.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## Additional Thoughts

The examples shown above utilize the default ClusterRoles provided with
Kubernetes. For more fine-grained control over what resources users are granted
access to, have a look at [the Kubernetes
documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) on
creating your own custom Roles and ClusterRoles.
