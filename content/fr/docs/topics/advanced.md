---
title: "Techniques avancées de Helm"
description: "Explique diverses fonctionnalités avancées pour les utilisateurs expérimentés de Helm"
weight: 9
---

Cette section explique diverses fonctionnalités et techniques avancées pour l'utilisation de Helm. Les informations de cette section sont destinées aux « power users » de Helm qui souhaitent effectuer des personnalisations et manipulations avancées de leurs charts et releases. Chacune de ces fonctionnalités avancées comporte ses propres compromis et mises en garde, il est donc nécessaire de les utiliser avec précaution et une connaissance approfondie de Helm. En d'autres termes, souvenez-vous du [principe de Peter Parker](https://fr.wikipedia.org/wiki/Un_grand_pouvoir_implique_de_grandes_responsabilit%C3%A9s).

## Post Rendering
Le post rendering donne aux installateurs de charts la possibilité de manipuler, configurer et/ou valider manuellement les manifestes rendus avant qu'ils ne soient installés par Helm. Cela permet aux utilisateurs ayant des besoins de configuration avancés d'utiliser des outils comme [`kustomize`](https://kustomize.io) pour appliquer des modifications de configuration sans avoir à forker un chart public ou à demander aux mainteneurs de chart de spécifier chaque option de configuration pour un logiciel. Il existe également des cas d'utilisation pour l'injection d'outils communs et de side-cars dans des environnements d'entreprise, ou pour l'analyse des manifestes avant le déploiement.

### Prérequis
- Helm 3.1+

### Utilisation
Un post-renderer peut être n'importe quel exécutable qui accepte des manifestes Kubernetes rendus sur STDIN et renvoie des manifestes Kubernetes valides sur STDOUT. Il doit retourner un code de sortie non nul en cas d'échec. Il s'agit de la seule "API" entre les deux composants. Cela offre une grande flexibilité dans ce que vous pouvez faire avec votre processus de post-rendering.

Un post-renderer peut être utilisé avec les commandes `install`, `upgrade` et `template`. Pour utiliser un post-renderer, il suffit d'ajouter l'option `--post-renderer` suivie du chemin vers l'exécutable du renderer que vous souhaitez utiliser :

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

Si le chemin ne contient aucun séparateur, il effectuera une recherche dans $PATH, sinon il résoudra tout chemin relatif en un chemin entièrement qualifié.

Si vous souhaitez utiliser plusieurs post-renderers, appelez-les tous dans un script ou ensemble dans l'outil binaire que vous avez créé. En bash, cela serait aussi simple que `renderer1 | renderer2 | renderer3`.

Vous pouvez voir un exemple d'utilisation de `kustomize` comme post-renderer [ici](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render).

### Précautions
Lors de l'utilisation de post-renderers, il y a plusieurs points importants à garder à l'esprit. Le plus crucial est que, lorsque vous utilisez un post-renderer, toutes les personnes modifiant cette release **DOIVENT** utiliser le même renderer afin d'avoir des builds reproductibles. Cette fonctionnalité est intentionnellement conçue pour permettre à tout utilisateur de changer de renderer ou de cesser d'utiliser un renderer, mais cela doit être fait de manière délibérée pour éviter les modifications accidentelles ou la perte de données.

Une autre note importante concerne la sécurité. Si vous utilisez un post-renderer, vous devez vous assurer qu'il provient d'une source fiable (comme c'est le cas pour tout autre exécutable arbitraire). L'utilisation de renderers non fiables ou non vérifiés n'est PAS recommandée, car ils ont un accès complet aux templates rendus, qui contiennent souvent des données secrètes.

### Post-renderers personnalisés
L'étape de post-rendering offre encore plus de flexibilité lorsqu'elle est utilisée dans le Go SDK. Tout post-renderer doit simplement implémenter l'interface Go suivante :

```go
type PostRenderer interface {
    //Run attend un seul buffer rempli de manifestes rendus par Helm. Il
    // attend que les résultats modifiés soient retournés dans un buffer séparé ou
    // une erreur s'il y a un problème ou un échec pendant l'exécution de l'étape de post-rendering.
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Pour plus d'informations sur l'utilisation du Go SDK, consultez la [section Go SDK](https://helm.sh/docs/sdk/gosdk/).

## Stockage des backends

Helm 3 a modifié le stockage par défaut des informations de release en utilisant des Secrets dans le namespace de la release. Helm 2 stockait par défaut les informations de release sous forme de ConfigMaps dans le namespace de l'instance de Tiller. Les sous-sections suivantes montrent comment configurer différents backends. Cette configuration est basée sur la variable d'environnement `HELM_DRIVER`. Elle peut être définie sur l'une des valeurs suivantes : `[configmap, secret, sql]`.

### Backend de stockage ConfigMap

Pour activer le backend de stockage ConfigMap, vous devez définir la variable d'environnement `HELM_DRIVER` sur `configmap`.

Vous pouvez la définir dans un shell comme suit :

```shell
export HELM_DRIVER=configmap
```

Si vous souhaitez passer du backend par défaut au backend ConfigMap, vous devrez effectuer la migration vous-même. Vous pouvez récupérer les informations de release avec la commande suivante :

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**REMARQUES POUR LA PRODUCTION** : Les informations de release incluent le contenu des charts et des fichiers de valeurs, et peuvent donc contenir des données sensibles (comme des mots de passe, des clés privées et d'autres identifiants) qui doivent être protégées contre tout accès non autorisé. Lors de la gestion de l'autorisation Kubernetes, par exemple avec [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), il est possible de donner un accès plus large aux ressources ConfigMap, tout en restreignant l'accès aux ressources Secret. Par exemple, le rôle [orienté utilisateur par défaut](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) "view" accorde l'accès à la plupart des ressources, mais pas aux Secrets. De plus, les données des secrets peuvent être configurées pour un [stockage chiffré](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/). Veuillez en tenir compte si vous décidez de passer au backend ConfigMap, car cela pourrait exposer les données sensibles de votre application.

### Backend de stockage SQL

Il existe un backend de stockage SQL en ***bêta*** qui stocke les informations de release dans une base de données SQL.

L'utilisation d'un tel backend de stockage est particulièrement utile si vos informations de release pèsent plus de 1 Mo (dans ce cas, elles ne peuvent pas être stockées dans ConfigMaps/Secrets en raison des limites internes du store de clés-valeurs etcd sous-jacent de Kubernetes).

Pour activer le backend SQL, vous devrez déployer une base de données SQL et définir la variable d'environnement `HELM_DRIVER` sur `sql`. Les détails de la base de données sont configurés avec la variable d'environnement `HELM_DRIVER_SQL_CONNECTION_STRING`.

Vous pouvez la définir dans un shell comme suit :

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> Note : Uniquement PostgreSQL est actuellement supporté.

**REMARQUES POUR LA PRODUCTION** : Il est recommandé de :
- Préparer votre base de données pour la production. Pour PostgreSQL, consultez la documentation sur l'[administration du serveur](https://www.postgresql.org/docs/12/admin.html) pour plus de détails.
- Activer la [gestion des permissions](/docs/permissions_sql_storage_backend/) pour refléter les RBAC Kubernetes pour les informations de release.

Si vous souhaitez passer du backend par défaut au backend SQL, vous devrez effectuer la migration vous-même. Vous pouvez récupérer les informations de release avec la commande suivante :

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
