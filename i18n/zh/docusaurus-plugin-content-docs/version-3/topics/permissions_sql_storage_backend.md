---
title: "SQL 存储后端的权限管理"
description: "了解如何在使用 SQL 存储后端时设置权限"
---

本文档旨在指导用户在使用 SQL 存储后端时如何设置和管理权限。

## 介绍

Helm 利用 Kubernetes 的 RBAC 特性来处理权限。但在使用 SQL 存储后端时，无法使用 Kubernetes 的角色来判断用户是否可以访问特定资源。本文档将展示如何创建和管理这些权限。

## 初始化

Helm CLI 首次连接数据库时，客户端会检查数据库是否已完成初始化。如果尚未初始化，客户端会自动完成必要的设置。初始化过程需要 public 模式（schema）的管理员权限，或者至少能够：

* 创建表
* 在 public 模式上授予权限

数据库完成迁移后，其他角色就可以使用客户端了。

## 在 PostgreSQL 中向非管理员用户授权

SQL 后端驱动使用 PostgreSQL 的 [RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html)（行级安全）特性来管理权限。RLS 允许所有用户对同一张表进行读写操作，但在未获得明确授权的情况下，无法操作相同的行。默认情况下，未被明确授予相应权限的角色在运行 `helm list` 时会返回空列表，也无法检索或修改集群中的任何资源。

下面介绍如何为指定角色授予访问特定命名空间的权限：

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

此命令会将满足 `namespace = 'default'` 条件的所有资源的读写权限授予角色 `role`。创建该策略后，以角色 `role` 身份连接数据库的用户在运行 `helm list` 时就能看到 `default` 命名空间中的所有 release，并可以对其进行修改和删除。

RLS 支持细粒度的权限管理。你可以根据表的不同列来限制访问权限：

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
