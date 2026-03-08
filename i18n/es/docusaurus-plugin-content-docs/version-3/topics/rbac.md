---
title: Control de Acceso Basado en Roles
description: Explica cómo Helm interactúa con el Control de Acceso Basado en Roles (RBAC) de Kubernetes.
sidebar_position: 11
---

En Kubernetes, otorgar roles a un usuario o a una cuenta de servicio específica
de la aplicación es una buena práctica para asegurar que su aplicación esté
operando dentro del alcance que usted ha especificado. Lea más sobre los permisos
de cuentas de servicio [en la documentación oficial de Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions).

A partir de Kubernetes 1.6, el Control de Acceso Basado en Roles está habilitado
por defecto. RBAC le permite especificar qué tipos de acciones están permitidas
dependiendo del usuario y su rol en su organización.

Con RBAC, puede:

- otorgar operaciones privilegiadas (crear recursos a nivel de clúster, como
  nuevos roles) a administradores
- limitar la capacidad de un usuario para crear recursos (pods, volúmenes
  persistentes, deployments) a namespaces específicos, o a nivel de todo el
  clúster (cuotas de recursos, roles, definiciones de recursos personalizados)
- limitar la capacidad de un usuario para ver recursos ya sea en namespaces
  específicos o a nivel de todo el clúster.

Esta guía es para administradores que desean restringir el alcance de la
interacción de un usuario con la API de Kubernetes.

## Administración de cuentas de usuario

Todos los clústeres de Kubernetes tienen dos categorías de usuarios: cuentas de
servicio administradas por Kubernetes, y usuarios normales.

Se asume que los usuarios normales son administrados por un servicio externo e
independiente. Un administrador que distribuye claves privadas, un almacén de
usuarios como Keystone o Google Accounts, incluso un archivo con una lista de
nombres de usuario y contraseñas. En este sentido, Kubernetes no tiene objetos
que representen cuentas de usuarios normales. Los usuarios normales no pueden
agregarse a un clúster mediante una llamada a la API.

En contraste, las cuentas de servicio son usuarios administrados por la API de
Kubernetes. Están vinculadas a namespaces específicos y son creadas
automáticamente por el servidor de API o manualmente mediante llamadas a la API.
Las cuentas de servicio están ligadas a un conjunto de credenciales almacenadas
como Secrets, que se montan en los pods permitiendo que los procesos dentro del
clúster se comuniquen con la API de Kubernetes.

Las solicitudes a la API están vinculadas ya sea a un usuario normal o a una
cuenta de servicio, o se tratan como solicitudes anónimas. Esto significa que
cada proceso dentro o fuera del clúster, desde un usuario humano escribiendo
`kubectl` en una estación de trabajo, hasta kubelets en los nodos, hasta miembros
del plano de control, debe autenticarse al hacer solicitudes al servidor de API,
o ser tratado como un usuario anónimo.

## Roles, ClusterRoles, RoleBindings y ClusterRoleBindings

En Kubernetes, las cuentas de usuario y las cuentas de servicio solo pueden ver y
editar los recursos a los que se les ha otorgado acceso. Este acceso se otorga
mediante el uso de Roles y RoleBindings. Los Roles y RoleBindings están vinculados
a un namespace particular, lo que otorga a los usuarios la capacidad de ver y/o
editar recursos dentro de ese namespace al que el Role les proporciona acceso.

A nivel de clúster, estos se denominan ClusterRoles y ClusterRoleBindings.
Otorgar a un usuario un ClusterRole le da acceso para ver y/o editar recursos en
todo el clúster. También es necesario para ver y/o editar recursos a nivel de
clúster (namespaces, cuotas de recursos, nodos).

Los ClusterRoles pueden vincularse a un namespace particular mediante referencia
en un RoleBinding. Los ClusterRoles predeterminados `admin`, `edit` y `view` se
utilizan comúnmente de esta manera.

Estos son algunos ClusterRoles disponibles por defecto en Kubernetes. Están
pensados para ser roles orientados al usuario. Incluyen roles de superusuario
(`cluster-admin`) y roles con acceso más granular (`admin`, `edit`, `view`).

| ClusterRole predeterminado | ClusterRoleBinding predeterminado | Descripción
|----------------------------|-----------------------------------|-------------
| `cluster-admin`            | grupo `system:masters`            | Permite acceso de superusuario para realizar cualquier acción en cualquier recurso. Cuando se usa en un ClusterRoleBinding, otorga control total sobre todos los recursos en el clúster y en todos los namespaces. Cuando se usa en un RoleBinding, otorga control total sobre todos los recursos en el namespace del RoleBinding, incluyendo el namespace en sí.
| `admin`                    | Ninguno                           | Permite acceso de administrador, destinado a ser otorgado dentro de un namespace usando un RoleBinding. Si se usa en un RoleBinding, permite acceso de lectura/escritura a la mayoría de los recursos en un namespace, incluyendo la capacidad de crear roles y rolebindings dentro del namespace. No permite acceso de escritura a la cuota de recursos ni al namespace en sí.
| `edit`                     | Ninguno                           | Permite acceso de lectura/escritura a la mayoría de los objetos en un namespace. No permite ver ni modificar roles o rolebindings.
| `view`                     | Ninguno                           | Permite acceso de solo lectura para ver la mayoría de los objetos en un namespace. No permite ver roles o rolebindings. No permite ver secrets, ya que permiten escalada de privilegios.

## Restringir el acceso de una cuenta de usuario usando RBAC

Ahora que entendemos los conceptos básicos del Control de Acceso Basado en Roles,
analicemos cómo un administrador puede restringir el alcance del acceso de un
usuario.

### Ejemplo: Otorgar a un usuario acceso de lectura/escritura a un namespace particular

Para restringir el acceso de un usuario a un namespace particular, podemos usar
el role `edit` o el role `admin`. Si sus charts crean o interactúan con Roles y
RoleBindings, querrá usar el ClusterRole `admin`.

Adicionalmente, también puede crear un RoleBinding con acceso `cluster-admin`.
Otorgar a un usuario acceso `cluster-admin` a nivel de namespace proporciona
control total sobre todos los recursos en el namespace, incluyendo el namespace
en sí.

Para este ejemplo, crearemos un usuario con el Role `edit`. Primero, cree el
namespace:

```console
$ kubectl create namespace foo
```

Ahora, cree un RoleBinding en ese namespace, otorgando al usuario el role `edit`.

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### Ejemplo: Otorgar a un usuario acceso de lectura/escritura a nivel de clúster

Si un usuario desea instalar un chart que instala recursos a nivel de clúster
(namespaces, roles, definiciones de recursos personalizados, etc.), necesitará
acceso de escritura a nivel de clúster.

Para hacer esto, otorgue al usuario acceso `admin` o `cluster-admin`.

Otorgar a un usuario acceso `cluster-admin` le da acceso a absolutamente todos
los recursos disponibles en Kubernetes, incluyendo acceso a nodos con
`kubectl drain` y otras tareas administrativas. Es altamente recomendable
considerar proporcionar al usuario acceso `admin` en su lugar, o crear un
ClusterRole personalizado adaptado a sus necesidades.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### Ejemplo: Otorgar a un usuario acceso de solo lectura a un namespace particular

Habrá notado que no hay un ClusterRole disponible para ver secrets. El ClusterRole
`view` no otorga a un usuario acceso de lectura a Secrets debido a preocupaciones
de escalada de privilegios. Helm almacena los metadatos de releases como Secrets por defecto.

Para que un usuario pueda ejecutar `helm list`, necesita poder leer estos secrets.
Para esto, crearemos un ClusterRole especial `secret-reader`.

Cree el archivo `cluster-role-secret-reader.yaml` y escriba el siguiente
contenido en el archivo:

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

Luego, cree el ClusterRole usando

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

Una vez hecho esto, podemos otorgar a un usuario acceso de lectura a la mayoría
de los recursos, y luego otorgarle acceso de lectura a los secrets:

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

### Ejemplo: Otorgar a un usuario acceso de solo lectura a nivel de clúster

En ciertos escenarios, puede ser beneficioso otorgar a un usuario acceso a nivel
de clúster. Por ejemplo, si un usuario quiere ejecutar el comando
`helm list --all-namespaces`, la API requiere que el usuario tenga acceso de
lectura a nivel de clúster.

Para hacer esto, otorgue al usuario acceso tanto a `view` como a `secret-reader`
como se describió anteriormente, pero con un ClusterRoleBinding.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## Consideraciones adicionales

Los ejemplos mostrados anteriormente utilizan los ClusterRoles predeterminados
proporcionados con Kubernetes. Para un control más detallado sobre a qué recursos
se les otorga acceso a los usuarios, consulte [la documentación de Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
sobre cómo crear sus propios Roles y ClusterRoles personalizados.
