---
title: "SQL存储后端的权限管理"
description: "了解SQL存储后端的权限设置"
---

该文档旨在提供用户使用SQL存储后端时设置和管理权限的指导。

## 介绍

为了处理权限，Helm利用了Kubernetes的RBAC特性。使用SQL存储后端时，
Kubernetes的角色不能被用于确认用户是否可以访问给定的资源。该文档会展示如果创建和管理权限。

## 初始化

Helm CLI 首先会连接您的数据库。客户端会确认数据库是否已经预先初始化，如果没有，
它会自动处理必要的安装。初始化需要在public架构的admin权限，或者至少可以做以下事情：

* 创建一个表
* 在public架构授予权限

当你的数据库执行过迁移操作之后，其他角色就可以使用客户端了。

## PostgreSQL向非管理员用户授权

管理权限时，SQL后端驱动会利用PostgreSQL的[RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html)(
行安全级别)特性。RLS允许所有用户读/写同一张表，如果没有明确说明，不允许操作相同的行。
默认情况下，运行`helm list`时任何角色如果没有明确授权正确的权限会返回空列表，并且不能检索或修改集群中的任何资源。

我们来看看如何为给定角色授予访问特定命名空间的权限：

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

这个命令在使用`namespace = 'default'`条件时会授权给角色`role`所有资源读和写操作权限。
在创建这个策略时，运行`helm list`时会代表角色`role`在默认的命名空间中连接数据库，
因而能看到命名空间中所有的版本，并能修改和删除它们。

权限可以按照RLS粒度进行管理，人们可能会对表的不同列的访问限制感兴趣：
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
