---
title: Gerenciamento de permissões para backend de armazenamento SQL
description: Saiba como configurar permissões ao usar o backend de armazenamento SQL.
---

Este documento fornece orientações para configurar e gerenciar permissões ao
usar o backend de armazenamento SQL.

## Introdução

Para gerenciar permissões, o Helm utiliza o recurso RBAC do Kubernetes. Ao usar
o backend de armazenamento SQL, os roles do Kubernetes não podem ser usados para
determinar se um usuário pode acessar um determinado recurso. Este documento
mostra como criar e gerenciar essas permissões.

## Inicialização

Na primeira vez que o CLI do Helm se conectar ao seu banco de dados, o client
verificará se ele foi previamente inicializado. Caso contrário, realizará a
configuração necessária automaticamente. Esta inicialização requer privilégios
de administrador no schema public, ou pelo menos a capacidade de:

* criar uma tabela
* conceder privilégios no schema public

Após a migração ser executada no seu banco de dados, todos os outros roles
podem usar o client.

## Conceder privilégios a um usuário não administrador no PostgreSQL

Para gerenciar permissões, o driver do backend SQL utiliza o recurso
[RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) (Row Security
Level) do PostgreSQL. O RLS permite que todos os usuários possam ler/escrever
na mesma tabela, sem conseguir manipular as mesmas linhas se não tiverem sido
explicitamente autorizados. Por padrão, qualquer role que não tenha recebido
explicitamente os privilégios adequados sempre retornará uma lista vazia ao
executar `helm list` e não conseguirá recuperar ou modificar nenhum recurso no
cluster.

Veja como conceder a um determinado role acesso a namespaces específicos:

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

Este comando concederá as permissões de leitura e escrita de todos os recursos
que atendem à condição `namespace = 'default'` ao role `role`. Após criar esta
política, o usuário conectado ao banco de dados com o role `role` poderá ver
todos os releases no namespace `default` ao executar `helm list`, além de
modificá-los e excluí-los.

Os privilégios podem ser gerenciados de forma granular com RLS, e pode ser
interessante restringir o acesso de acordo com as diferentes colunas da tabela:
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
