---
title: Gestión de permisos para el backend de almacenamiento SQL
description: Aprenda a configurar permisos cuando utilice el backend de almacenamiento SQL.
---

Este documento proporciona orientación para configurar y gestionar permisos al
utilizar el backend de almacenamiento SQL.

## Introducción

Para manejar permisos, Helm aprovecha la funcionalidad RBAC de Kubernetes. Al
utilizar el backend de almacenamiento SQL, los roles de Kubernetes no pueden
usarse para determinar si un usuario puede acceder a un recurso dado. Este
documento muestra cómo crear y gestionar estos permisos.

## Inicialización

Cuando el CLI de Helm se conecte por primera vez a su base de datos, el cliente
verificará que haya sido inicializada previamente. Si no lo está, realizará la
configuración necesaria automáticamente. Esta inicialización requiere
privilegios de administrador en el esquema público, o al menos poder:

* crear una tabla
* otorgar privilegios en el esquema público

Una vez ejecutada la migración en su base de datos, todos los demás roles pueden
utilizar el cliente.

## Otorgar privilegios a un usuario no administrador en PostgreSQL

Para gestionar permisos, el controlador del backend SQL aprovecha la
funcionalidad [RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html)
(Row Security Level) de PostgreSQL. RLS permite que todos los usuarios lean y
escriban en la misma tabla, pero solo puedan manipular las filas para las que
tienen permiso explícito. Por defecto, cualquier rol al que no se le hayan
otorgado explícitamente los privilegios correctos siempre devolverá una lista
vacía al ejecutar `helm list` y no podrá recuperar ni modificar ningún recurso
en el clúster.

Veamos cómo otorgar a un rol dado acceso a namespaces específicos:

```sql
CREATE POLICY <name> ON releases_v1 FOR ALL TO <role> USING (namespace = 'default');
```

Este comando otorgará permisos para leer y escribir todos los recursos que
cumplan la condición `namespace = 'default'` al rol `role`. Después de crear esta
política, el usuario conectado a la base de datos en representación del rol
`role` podrá ver todos los releases en el namespace `default` al ejecutar
`helm list`, y podrá modificarlos y eliminarlos.

Los privilegios pueden gestionarse de manera granular con RLS, y puede resultar
útil restringir el acceso según las diferentes columnas de la tabla:
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
