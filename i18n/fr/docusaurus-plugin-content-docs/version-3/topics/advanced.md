---
title: Techniques Helm avancées
description: Explique diverses fonctionnalités avancées pour les utilisateurs expérimentés de Helm
sidebar_position: 9
---

Cette section présente diverses fonctionnalités et techniques avancées pour utiliser Helm.
Ces informations sont destinées aux « utilisateurs expérimentés » de Helm qui souhaitent effectuer des personnalisations et manipulations avancées de leurs charts et releases.

Chacune de ces fonctionnalités avancées comporte ses propres compromis et mises en garde. Elles doivent donc être utilisées avec précaution et une connaissance approfondie de Helm. Autrement dit, gardez à l'esprit le [principe de Peter Parker](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility).

## Post Rendering

Le post rendering permet de manipuler, configurer et/ou valider manuellement les manifestes rendus avant leur installation par Helm.
Cette fonctionnalité permet aux utilisateurs ayant des besoins de configuration avancés d'utiliser des outils comme
[`kustomize`](https://kustomize.io) pour appliquer des modifications de configuration sans
avoir à forker un chart public ou exiger des mainteneurs qu'ils spécifient chaque
option de configuration possible pour un logiciel. Il existe également des cas d'utilisation pour
l'injection d'outils communs et de sidecars dans les environnements d'entreprise, ou l'analyse
des manifestes avant le déploiement.

### Prérequis
- Helm 3.1+

### Utilisation
Un post-renderer peut être n'importe quel exécutable qui accepte les manifestes Kubernetes rendus
sur STDIN et retourne des manifestes Kubernetes valides sur STDOUT. Il doit retourner un
code de sortie non nul en cas d'échec. C'est la seule « API » entre les
deux composants. Cela offre une grande flexibilité dans ce que vous pouvez faire avec votre
processus de post-render.

Un post renderer peut être utilisé avec `install`, `upgrade` et `template`. Pour utiliser un
post-renderer, utilisez le flag `--post-renderer` avec le chemin vers l'exécutable
du renderer que vous souhaitez utiliser :

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

Si le chemin ne contient aucun séparateur, il sera recherché dans $PATH, sinon
les chemins relatifs seront résolus en chemins absolus.

Si vous souhaitez utiliser plusieurs post-renderers, appelez-les tous dans un script ou
ensemble dans l'outil binaire que vous avez construit. En bash, cela serait aussi
simple que `renderer1 | renderer2 | renderer3`.

Vous pouvez voir un exemple d'utilisation de `kustomize` comme post renderer
[ici](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render).

### Mises en garde

Lors de l'utilisation de post renderers, plusieurs points importants sont à garder à l'esprit.

Le plus important : toutes les personnes modifiant une release **DOIVENT** utiliser le même renderer afin d'avoir des builds reproductibles. Cette fonctionnalité permet à tout utilisateur de changer de renderer ou d'arrêter d'en utiliser un, mais cela doit être fait délibérément pour éviter toute modification accidentelle ou perte de données.

Point important sur la sécurité : si vous utilisez un post-renderer, assurez-vous qu'il provient d'une source fiable (comme pour tout autre exécutable arbitraire). L'utilisation de renderers non fiables ou non vérifiés N'EST PAS recommandée, car ils ont un accès complet aux templates rendus, qui contiennent souvent des données sensibles.

### Post Renderers personnalisés
L'étape de post render offre encore plus de flexibilité lorsqu'elle est utilisée avec le SDK Go. Tout
post renderer n'a qu'à implémenter l'interface Go suivante :

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Pour plus d'informations sur l'utilisation du SDK Go, consultez la [section SDK Go](#sdk-go)

## SDK Go
Helm 3 a introduit un SDK Go entièrement restructuré pour une meilleure expérience lors
de la création de logiciels et d'outils exploitant Helm. La documentation complète se trouve
dans la [section SDK Go](/sdk/gosdk.md).

## Backends de stockage

Helm 3 a changé le stockage par défaut des informations de release vers les Secrets dans le
namespace de la release. Helm 2 stockait par défaut les informations de release sous forme de
ConfigMaps dans le namespace de l'instance Tiller. Les sous-sections suivantes
expliquent comment configurer différents backends. Cette configuration est basée sur la
variable d'environnement `HELM_DRIVER`. Elle peut être définie sur l'une des valeurs suivantes :
`[configmap, secret, sql]`.

### Backend de stockage ConfigMap

Pour activer le backend ConfigMap, vous devez définir la variable d'environnement
`HELM_DRIVER` sur `configmap`.

Vous pouvez la définir dans un shell comme suit :

```shell
export HELM_DRIVER=configmap
```

Si vous souhaitez passer du backend par défaut au backend ConfigMap, vous devrez
effectuer la migration vous-même. Vous pouvez récupérer les informations de release
avec la commande suivante :

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**NOTES DE PRODUCTION** : Les informations de release incluent le contenu des charts et
des fichiers values, et peuvent donc contenir des données sensibles (comme
des mots de passe, des clés privées et d'autres identifiants) qui doivent être protégées contre
les accès non autorisés. Lors de la gestion des autorisations Kubernetes, par exemple avec
[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), il est
possible d'accorder un accès plus large aux ressources ConfigMap, tout en restreignant
l'accès aux ressources Secret. Par exemple, le [rôle orienté utilisateur](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
par défaut « view » accorde l'accès à la plupart des ressources, mais pas aux Secrets. De plus, les
données des secrets peuvent être configurées pour un [stockage chiffré](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).
Gardez cela à l'esprit si vous décidez de passer au backend ConfigMap, car cela
pourrait exposer les données sensibles de votre application.

### Backend de stockage SQL

Il existe un backend de stockage SQL en ***beta*** qui stocke les informations de release dans une base
de données SQL.

L'utilisation d'un tel backend de stockage est particulièrement utile si vos informations de release
pèsent plus de 1 Mo (auquel cas, elles ne peuvent pas être stockées dans ConfigMaps/Secrets
en raison des limites internes du magasin clé-valeur etcd sous-jacent de Kubernetes).

Pour activer le backend SQL, vous devez déployer une base de données SQL et définir la
variable d'environnement `HELM_DRIVER` sur `sql`. Les détails de la base de données sont définis avec la
variable d'environnement `HELM_DRIVER_SQL_CONNECTION_STRING`.

Vous pouvez les définir dans un shell comme suit :

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> Note : Seul PostgreSQL est pris en charge pour le moment.

**NOTES DE PRODUCTION** : Il est recommandé de :
- Rendre votre base de données prête pour la production. Pour PostgreSQL, consultez la documentation [Server Administration](https://www.postgresql.org/docs/12/admin.html) pour plus de détails
- Activer la [gestion des permissions](/topics/permissions_sql_storage_backend.md) pour
refléter le RBAC Kubernetes pour les informations de release

Si vous souhaitez passer du backend par défaut au backend SQL, vous devrez
effectuer la migration vous-même. Vous pouvez récupérer les informations de release
avec la commande suivante :

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
