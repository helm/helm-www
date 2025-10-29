---
title: helm search hub
---
Recherche de charts dans l'Artifact Hub ou dans votre propre instance du hub

### Synopsis
Rechercher des charts Helm dans l'Artifact Hub ou dans votre propre instance du hub.

L'Artifact Hub est une application web qui permet de trouver, installer et publier des packages et des configurations pour les projets de la CNCF, y compris des charts Helm publiques. Vous pouvez parcourir le hub via le site https://artifacthub.io/

L'argument `[KEYWORD]` accepte soit une chaîne de mot-clé, soit une chaîne entre guillemets d'options de requête enrichies. Pour la documentation sur les options des requêtes enrichies, rendez-vous sur https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

Les versions précédentes de Helm utilisaient une instance de Monocular comme « point de terminaison » par défaut. Par conséquent, pour une rétro compatibilité, Artifact Hub est compatible avec l'API de recherche Monocular. 
De même, lors de la définition de l'argument `endpoint`, le point de terminaison spécifié doit également implémenter un point de terminaison d'API de recherche compatible Monocular. Notez que lorsque vous spécifiez une instance Monocular comme « point de terminaison », les requêtes enrichies ne sont pas prises en charge. Pour plus de détails sur l'API, voir https://github.com/helm/monocular


```
helm search hub [KEYWORD] [flags]
```

### Options

```
      --endpoint string      instance du Hub pour rechercher les charts (par défaut "https://hub.helm.sh")
      --fail-on-no-result    La recherche échoue si pas de résultat trouvé
  -h, --help                 Aide pour la commande hub
      --list-repo-url        Affiche les URLs des répertoires de charts
      --max-col-width uint   Largeur maximum de colonne pour la table de sortie (par défaut 50)
  -o, --output format        Affiche la sortie dans le format spécifié. Valeurs autorisées : table, json, yaml (par défaut table)
```

### Options héritées des commandes parents

```
      --burst-limit int                 Limite coté client de la bande passante (par défaut 100)
      --debug                           Active la sortie détaillée
      --kube-apiserver string           L'adresse et le port API du serveur Kubernetes
      --kube-as-group stringArray       Groupe à utiliser pour l'opération, cet argument peut être répété pour spécifier plusieurs groupes
      --kube-as-user string             Nom d'utilisateur à utiliser pour l'operation
      --kube-ca-file string             Le fichier de l'autorité de certification pour la connexion à l'API Kubernetes
      --kube-context string             Nom du contexte kubeconfig à utiliser
      --kube-insecure-skip-tls-verify   Si true, la validité du certificat du serveur API Kubernetes ne sera pas vérifiée. Cela fera les connexions HTTPS non sûres
      --kube-tls-server-name string     Nom du serveur utilisé pour la validation du certificat du serveur API Kubernetes. S'il n'est pas fourni, le nom de la machine cliente utilisée pour contacter le serveur sera utilisé
      --kube-token string               Jeton utilisé pour l'authentification
      --kubeconfig string               Chemin du fichier de configuration kubeconfig
  -n, --namespace string                Namespace à utilisé pour la requête
	  --qps float32                     Requêtes par seconde utilisées lors de la communication avec l'API Kubernetes, sans compter le bursting
      --registry-config string          Chemin vers le fichier de configuration du registre (par défaut "~/.config/helm/registry/config.json")
      --repository-cache string         Chemin vers le fichier contenant les index du répertoire mis en cache (par défaut "~/.cache/helm/repository")
      --repository-config string        Chemin vers le fichier contenant les noms et URLs des répertoires (par défaut "~/.config/helm/repositories.yaml")
```

### Voir également

* [helm search](/helm/helm_search.md) - Recherche par mot clé dans les charts

