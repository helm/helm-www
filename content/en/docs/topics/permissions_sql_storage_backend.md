---
title: "Permissions management for SQL storage backend"
description: "Get to know how to properly setup permissions when using SQL storage backend."
aliases: ["/docs/permissions_sql_storage_backend/"]
---

This document aims to provide guidance to Helm 3 users for setting up and managing permissions properly when using the SQL storage backend.

## Introduction

To handle permissions, Helm leverages the RBAC feature of Kubernetes. When using the SQL storage backend, Kubernetes' roles can't be used to determine whether or not an user can access a given resource. We'll here discuss how to properly create and manage these permissions.

## Initialization

The first time the Helm CLI will make connect to your database, the client will make sure that it was previously initialized. If it was not, it will take care of running the migration scripts. This initialization requires admin privileges on the public schema, or at least to be able to:

* create a table
* grant privileges on the public schema

After the migration was run against your database, all the other roles can use the client.

## Grant privileges to a non admin user

To manage permissions, the SQL backend driver leverages the [RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html)(Row Security Level) feature of PostgreSQL. RLS allows all users to be able to read/write from/to the same table, without being able to manipulate the same rows if they were not explicitely allowed to. By default, any role that has not been explicitely granted with the right privileges will always get an empty list when running `helm list` and will not be able to get nor to modify any resource in the cluster.

Let's see how to grant a given role access to specific namespaces:

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

This command will grant the permissions to read and write all resources that meet the `namespace = 'default'` condition to the role `role`. After creating this policy, the user being connected to the database on the behalf of the role `role` will therefore be able to see all the releases living in the `default` namespace when running `helm list`, and to modify and delete them.

Privileges can be managed granularly with RLS, and one might be interested in restraining access given the different columns of the table:
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