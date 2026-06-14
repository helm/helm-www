---
title: ロールベースアクセス制御
description: Helm と Kubernetes のロールベースアクセス制御（RBAC）との連携について説明します。
sidebar_position: 11
---

Kubernetes では、ユーザーやアプリケーション固有のサービスアカウントにロールを付与することが推奨されます。これにより、アプリケーションを意図した範囲内で動作させることができます。サービスアカウントの権限については、[Kubernetes 公式ドキュメント](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions)を参照してください。

Kubernetes 1.6 以降、ロールベースアクセス制御（RBAC）はデフォルトで有効になっています。RBAC を使用すると、ユーザーとその組織内でのロールに応じて、許可されるアクションの種類を指定できます。

RBAC を使用すると、以下のことが可能です:

- 管理者に特権操作（クラスター全体のリソース作成、新しいロールの作成など）を付与する
- ユーザーがリソース（Pod、PersistentVolume、Deployment など）を作成できる範囲を、特定の namespace またはクラスター全体のスコープ（ResourceQuota、Role、CustomResourceDefinition）に制限する
- ユーザーがリソースを参照できる範囲を、特定の namespace またはクラスター全体のスコープに制限する

このガイドは、ユーザーと Kubernetes API のやり取りの範囲を制限したい管理者向けです。

## ユーザーアカウントの管理

すべての Kubernetes クラスターには、2 種類のユーザーカテゴリがあります: Kubernetes が管理するサービスアカウントと、通常のユーザーです。

通常のユーザーは、外部の独立したサービスによって管理されることが想定されています。たとえば、秘密鍵を配布する管理者、Keystone や Google アカウントなどのユーザーストア、ユーザー名とパスワードを記載したファイルなどが該当します。そのため、Kubernetes には通常のユーザーアカウントを表すオブジェクトがありません。通常のユーザーは API 呼び出しでクラスターに追加することができません。

一方、サービスアカウントは Kubernetes API によって管理されるユーザーです。サービスアカウントは特定の namespace にバインドされ、API サーバーによって自動的に作成されるか、API 呼び出しによって手動で作成されます。サービスアカウントは、Secret として保存された認証情報のセットに紐付けられています。この Secret は Pod にマウントされ、クラスター内のプロセスが Kubernetes API と通信できるようにします。

API リクエストは、通常のユーザーまたはサービスアカウントに紐付けられるか、匿名リクエストとして扱われます。つまり、ワークステーションで `kubectl` を入力する人間のユーザーから、ノード上の kubelet、コントロールプレーンのメンバーに至るまで、クラスター内外のすべてのプロセスは、API サーバーへのリクエスト時に認証を行う必要があります。認証しない場合は匿名ユーザーとして扱われます。

## Role、ClusterRole、RoleBinding、ClusterRoleBinding

Kubernetes では、ユーザーアカウントとサービスアカウントは、アクセスを付与されたリソースのみを参照および編集できます。このアクセスは、Role と RoleBinding を使用して付与されます。Role と RoleBinding は特定の namespace にバインドされ、その Role がアクセス権を提供する namespace 内のリソースを参照または編集する機能をユーザーに付与します。

クラスタースコープでは、これらは ClusterRole と ClusterRoleBinding と呼ばれます。ユーザーに ClusterRole を付与すると、クラスター全体のリソースを参照または編集するアクセス権が付与されます。また、クラスタースコープのリソース（namespace、ResourceQuota、Node）を参照または編集するためにも必要です。

ClusterRole は、RoleBinding 内で参照することで、特定の namespace にバインドできます。デフォルトの ClusterRole である `admin`、`edit`、`view` は、一般的にこの方法で使用されます。

Kubernetes にはデフォルトで利用可能な ClusterRole がいくつかあります。これらはユーザー向けのロールとして設計されています。スーパーユーザーロール（`cluster-admin`）や、より細かいアクセス権を持つロール（`admin`、`edit`、`view`）が含まれます。

| デフォルト ClusterRole | デフォルト ClusterRoleBinding | 説明
|---------------------|----------------------------|-------------
| `cluster-admin`     | `system:masters` グループ     | すべてのリソースに対してすべてのアクションを実行できるスーパーユーザーアクセスを許可します。ClusterRoleBinding で使用すると、クラスター内およびすべての namespace 内のすべてのリソースを完全に制御できます。RoleBinding で使用すると、その namespace 内のすべてのリソース（namespace 自体を含む）を完全に制御できます。
| `admin`             | なし                       | 管理者アクセスを許可します。RoleBinding を使用して namespace 内で付与することを想定しています。RoleBinding で使用すると、namespace 内のほとんどのリソースへの読み取り/書き込みアクセス（Role と RoleBinding の作成機能を含む）が許可されます。ResourceQuota や namespace 自体への書き込みアクセスは許可されません。
| `edit`              | なし                       | namespace 内のほとんどのオブジェクトへの読み取り/書き込みアクセスを許可します。Role や RoleBinding の参照や変更は許可されません。
| `view`              | なし                       | namespace 内のほとんどのオブジェクトへの読み取り専用アクセスを許可します。Role や RoleBinding の参照は許可されません。Secret の参照も許可されません（権限昇格につながるため）。

## RBAC を使用したユーザーアカウントのアクセス制限

ロールベースアクセス制御の基本を理解したところで、管理者がユーザーのアクセス範囲を制限する方法について説明します。

### 例: 特定の namespace への読み取り/書き込みアクセスを付与する

ユーザーのアクセスを特定の namespace に制限するには、`edit` または `admin` ロールを使用します。chart が Role や RoleBinding を作成または操作する場合は、`admin` ClusterRole を使用してください。

また、`cluster-admin` アクセス権を持つ RoleBinding を作成することもできます。namespace スコープで `cluster-admin` アクセスをユーザーに付与すると、namespace 自体を含む namespace 内のすべてのリソースを完全に制御できます。

この例では、`edit` Role を持つユーザーを作成します。まず、namespace を作成します:

```console
$ kubectl create namespace foo
```

次に、その namespace で RoleBinding を作成し、ユーザーに `edit` ロールを付与します。

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### 例: クラスタースコープでの読み取り/書き込みアクセスを付与する

ユーザーがクラスタースコープのリソース（namespace、Role、CustomResourceDefinition など）をインストールする chart をインストールしたい場合、クラスタースコープの書き込みアクセスが必要になります。

これを行うには、ユーザーに `admin` または `cluster-admin` アクセスを付与します。

ユーザーに `cluster-admin` アクセスを付与すると、`kubectl drain` を使用したノードアクセスやその他の管理タスクを含む、Kubernetes で利用可能なすべてのリソースへのアクセスが付与されます。代わりにユーザーに `admin` アクセスを提供するか、ニーズに合わせたカスタム ClusterRole を作成することを強く推奨します。

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### 例: 特定の namespace への読み取り専用アクセスを付与する

Secret を参照するための ClusterRole はデフォルトでは用意されていません。`view` ClusterRole は、権限昇格の懸念から、ユーザーに Secret への読み取りアクセスを付与しません。Helm はデフォルトで release のメタデータを Secret として保存します。

ユーザーが `helm list` を実行するには、これらの Secret を読み取る必要があります。そのために、`secret-reader` という ClusterRole を作成します。

`cluster-role-secret-reader.yaml` ファイルを作成し、以下の内容を記述します:

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

次に、以下のコマンドで ClusterRole を作成します:

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

これで、ユーザーにほとんどのリソースへの読み取りアクセスを付与し、さらに Secret への読み取りアクセスを付与できます:

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

### 例: クラスタースコープでの読み取り専用アクセスを付与する

特定のシナリオでは、ユーザーにクラスタースコープのアクセスを付与することが有益な場合があります。たとえば、ユーザーが `helm list --all-namespaces` コマンドを実行したい場合、API はユーザーにクラスタースコープの読み取りアクセスを要求します。

これを行うには、上記で説明したように、ユーザーに `view` と `secret-reader` の両方のアクセスを付与しますが、ClusterRoleBinding を使用します。

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## 補足

上記の例では、Kubernetes に付属するデフォルトの ClusterRole を使用しています。ユーザーがアクセスできるリソースをより細かく制御するには、[Kubernetes のドキュメント](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)を参照して、独自のカスタム Role や ClusterRole を作成してください。
