---
title: Controle de Acesso Baseado em Funções
description: Explica como o Helm interage com o Controle de Acesso Baseado em Funções (RBAC) do Kubernetes.
sidebar_position: 11
---

No Kubernetes, conceder funções a um usuário ou a uma service account específica
da aplicação é uma prática recomendada para garantir que sua aplicação esteja
operando dentro do escopo que você especificou. Leia mais sobre permissões de
service account [na documentação oficial do
Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions).

A partir do Kubernetes 1.6, o Controle de Acesso Baseado em Funções é habilitado
por padrão. O RBAC permite especificar quais tipos de ações são permitidas
dependendo do usuário e de sua função na organização.

Com o RBAC, você pode

- conceder operações privilegiadas (como criar recursos com escopo de cluster,
  como novas funções) a administradores
- limitar a capacidade de um usuário criar recursos (pods, persistent volumes,
  deployments) a namespaces específicos, ou em escopos de todo o cluster
  (resource quotas, roles, custom resource definitions)
- limitar a capacidade de um usuário visualizar recursos em namespaces
  específicos ou em escopo de todo o cluster.

Este guia é para administradores que desejam restringir o escopo de interação de
um usuário com a API do Kubernetes.

## Gerenciando contas de usuário

Todos os clusters Kubernetes possuem duas categorias de usuários: service
accounts gerenciadas pelo Kubernetes e usuários normais.

Usuários normais são assumidos como gerenciados por um serviço externo e
independente. Um administrador distribuindo chaves privadas, um armazenamento de
usuários como Keystone ou Google Accounts, ou mesmo um arquivo com uma lista de
nomes de usuário e senhas. Nesse sentido, o Kubernetes não possui objetos que
representem contas de usuário normais. Usuários normais não podem ser
adicionados a um cluster através de uma chamada de API.

Em contraste, service accounts são usuários gerenciados pela API do Kubernetes.
Elas são vinculadas a namespaces específicos e criadas automaticamente pelo API
server ou manualmente através de chamadas de API. As service accounts estão
associadas a um conjunto de credenciais armazenadas como Secrets, que são
montados em pods permitindo que processos dentro do cluster se comuniquem com a
API do Kubernetes.

Requisições de API são associadas a um usuário normal ou a uma service account,
ou são tratadas como requisições anônimas. Isso significa que todo processo
dentro ou fora do cluster, desde um usuário humano digitando `kubectl` em uma
estação de trabalho, até kubelets nos nós, até membros do control plane, deve se
autenticar ao fazer requisições ao API server, ou ser tratado como um usuário
anônimo.

## Roles, ClusterRoles, RoleBindings e ClusterRoleBindings

No Kubernetes, contas de usuário e service accounts só podem visualizar e editar
recursos aos quais foi concedido acesso. Esse acesso é concedido através do uso
de Roles e RoleBindings. Roles e RoleBindings são vinculados a um namespace
específico, concedendo aos usuários a capacidade de visualizar e/ou editar
recursos dentro desse namespace aos quais o Role fornece acesso.

Em escopo de cluster, estes são chamados de ClusterRoles e ClusterRoleBindings.
Conceder a um usuário um ClusterRole concede acesso para visualizar e/ou editar
recursos em todo o cluster. Também é necessário para visualizar e/ou editar
recursos em escopo de cluster (namespaces, resource quotas, nodes).

ClusterRoles podem ser vinculados a um namespace específico através de
referência em um RoleBinding. Os ClusterRoles padrão `admin`, `edit` e `view`
são comumente usados dessa maneira.

Existem alguns ClusterRoles disponíveis por padrão no Kubernetes. Eles são
destinados a ser funções voltadas para o usuário. Incluem funções de
super-usuário (`cluster-admin`) e funções com acesso mais granular (`admin`,
`edit`, `view`).

| ClusterRole Padrão | ClusterRoleBinding Padrão | Descrição
|---------------------|----------------------------|-------------
| `cluster-admin`     | grupo `system:masters`     | Permite acesso de super-usuário para executar qualquer ação em qualquer recurso. Quando usado em um ClusterRoleBinding, dá controle total sobre todos os recursos no cluster e em todos os namespaces. Quando usado em um RoleBinding, dá controle total sobre todos os recursos no namespace do RoleBinding, incluindo o próprio namespace.
| `admin`             | Nenhum                     | Permite acesso administrativo, destinado a ser concedido dentro de um namespace usando um RoleBinding. Se usado em um RoleBinding, permite acesso de leitura/escrita à maioria dos recursos em um namespace, incluindo a capacidade de criar roles e rolebindings dentro do namespace. Não permite acesso de escrita a resource quotas ou ao próprio namespace.
| `edit`              | Nenhum                     | Permite acesso de leitura/escrita à maioria dos objetos em um namespace. Não permite visualizar ou modificar roles ou rolebindings.
| `view`              | Nenhum                     | Permite acesso somente leitura para ver a maioria dos objetos em um namespace. Não permite visualizar roles ou rolebindings. Não permite visualizar secrets, pois isso pode permitir escalação de privilégios.

## Restringindo o acesso de uma conta de usuário usando RBAC

Agora que entendemos os conceitos básicos de Controle de Acesso Baseado em
Funções, vamos discutir como um administrador pode restringir o escopo de acesso
de um usuário.

### Exemplo: Conceder acesso de leitura/escrita a um namespace específico

Para restringir o acesso de um usuário a um namespace específico, podemos usar
o role `edit` ou `admin`. Se seus charts criam ou interagem com Roles e
RoleBindings, você deve usar o ClusterRole `admin`.

Além disso, você também pode criar um RoleBinding com acesso `cluster-admin`.
Conceder a um usuário acesso `cluster-admin` no escopo do namespace fornece
controle total sobre todos os recursos no namespace, incluindo o próprio
namespace.

Para este exemplo, criaremos um usuário com o Role `edit`. Primeiro, crie o
namespace:

```console
$ kubectl create namespace foo
```

Agora, crie um RoleBinding nesse namespace, concedendo ao usuário o role `edit`.

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### Exemplo: Conceder acesso de leitura/escrita em escopo de cluster

Se um usuário deseja instalar um chart que instala recursos com escopo de
cluster (namespaces, roles, custom resource definitions, etc.), ele precisará de
acesso de escrita em escopo de cluster.

Para isso, conceda ao usuário acesso `admin` ou `cluster-admin`.

Conceder a um usuário acesso `cluster-admin` concede acesso a absolutamente
todos os recursos disponíveis no Kubernetes, incluindo acesso a nós com
`kubectl drain` e outras tarefas administrativas. É altamente recomendado
considerar fornecer ao usuário acesso `admin` em vez disso, ou criar um
ClusterRole personalizado adaptado às suas necessidades.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### Exemplo: Conceder acesso somente leitura a um namespace específico

Você pode ter notado que não há um ClusterRole disponível para visualizar
secrets. O ClusterRole `view` não concede acesso de leitura a Secrets devido a
preocupações de escalação. O Helm armazena metadados de release como Secrets por
padrão.

Para que um usuário possa executar `helm list`, ele precisa ser capaz de ler
esses secrets. Para isso, criaremos um ClusterRole especial `secret-reader`.

Crie o arquivo `cluster-role-secret-reader.yaml` e escreva o seguinte conteúdo
no arquivo:

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

Em seguida, crie o ClusterRole usando

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

Uma vez feito isso, podemos conceder a um usuário acesso de leitura à maioria
dos recursos e, em seguida, conceder acesso de leitura aos secrets:

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

### Exemplo: Conceder acesso somente leitura em escopo de cluster

Em certos cenários, pode ser benéfico conceder a um usuário acesso em escopo de
cluster. Por exemplo, se um usuário deseja executar o comando
`helm list --all-namespaces`, a API requer que o usuário tenha acesso de leitura
em escopo de cluster.

Para isso, conceda ao usuário acesso `view` e `secret-reader` conforme descrito
acima, mas com um ClusterRoleBinding.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## Considerações Adicionais

Os exemplos mostrados acima utilizam os ClusterRoles padrão fornecidos com o
Kubernetes. Para um controle mais refinado sobre quais recursos os usuários
podem acessar, consulte [a documentação do
Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) sobre
como criar seus próprios Roles e ClusterRoles personalizados.
