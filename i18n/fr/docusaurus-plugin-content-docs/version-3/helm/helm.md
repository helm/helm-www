---
title: helm
slug: helm
---
Helm, Le gestionnaire de paquets pour Kubernetes

### Synopsis

Le gestionnaire de paquets pour Kubernetes

Actions courantes de Helm :

- `helm search` :    cherche des charts installées dans Kubernetes
- `helm pull` :      télécharge l'archive chart dans le répertoire courant
- `helm install` :   installe le chart dans le namespace du cluster Kubernetes
- `helm list` :      liste les versions de charts installées dans le namespace du cluster Kubernetes

Variables d'environnement :

| Nom                                | Description                                                                                        |
|------------------------------------|----------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | définit un répertoire alternatif pour stocker les fichiers du cache.                               |
| $HELM_CONFIG_HOME                  | définit un répertoire alternatif pour stocker les fichiers de configuration.                       |
| $HELM_DATA_HOME                    | définit un répertoire alternatif pour stocker les fichiers de données.                             |
| $HELM_DEBUG                        | indique si Helm tourne en mode Debug                                                               |
| $HELM_DRIVER                       | définit le driver du stockage du backend. Il peut être: configmap, secret, memory, sql.            |
| $HELM_DRIVER_SQL_CONNECTION_STRING | définit la chaîne de caractères que le driver de stockage SQL doit utiliser.                       |
| $HELM_MAX_HISTORY                  | définit le nombre maximum de versions helm conservées.                                             |
| $HELM_NAMESPACE                    | définit le namespace des operations helm.                                                          |
| $HELM_NO_PLUGINS                   | désactive les plugins. Mettre HELM_NO_PLUGINS=1 pour désactiver les plugins.                       |
| $HELM_PLUGINS                      | définit le chemin du répertoire de plugins.                                                        |
| $HELM_REGISTRY_CONFIG              | définit le chemin de la configuration du registre.                                                 |
| $HELM_REPOSITORY_CACHE             | définit le chemin du repertoire cache.                                                             |
| $HELM_REPOSITORY_CONFIG            | définit le chemin de la configuration du répertoire.                                               |
| $KUBECONFIG                        | définit un chemin alternatif de configuration de kubernetes (par défaut "~/.kube/config")          |
| $HELM_KUBEAPISERVER                | définit le point d'entrée API du serveur Kubernetes pour l'authentification                        |
| $HELM_KUBECAFILE                   | définit le fichier de l'autorité de certification de Kubernetes.                                   |
| $HELM_KUBEASGROUPS                 | définit le groupe à utiliser pour anonymisation en utilisant une liste csv.                        |
| $HELM_KUBEASUSER                   | définit le nom à utiliser pour anonymiser l'operation.                                             |
| $HELM_KUBECONTEXT                  | définit le nom du contexte kubeconfig.                                                             |
| $HELM_KUBETOKEN                    | définit le canal KubeToken utilisé pour l'authentification.                                        |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | indique si la vérification du certificat de l'API ne doit pas être faite. (peu sûr)                |
| $HELM_KUBETLS_SERVER_NAME          | définit le nom du serveur utilisé pour valider le certificat de l'API Kubernetes.                  |
| $HELM_BURST_LIMIT                  | définit la limite burst au cas où le serveur contient plusieurs CRDs (par défaut 100, -1 désactive)|
| $HELM_QPS                          | définit le nombre de requêtes par seconde lorsqu'un grand nombre d'appels dépasse les valeurs de burst |

Helm stocke le cache, la configuration, et les données suivant les configurations serveur suivantes :

- Si la variable d'environnement `HELM_*_HOME` est positionnée, elle sera utilisée
- Sinon, sur les systèmes supportant les spécifications XDG base directory, les variables XDG seront utilisées
- Lorsqu'aucun autre chemin n'est positionné, le chemin par défaut sera celui définit par le système d'exploitation OS

Par défaut, les répertoires par défaut dépendent du système d'exploitation OS:

| OS               | Chemin Cache              | Chemin Configuration           | Chemin Données          |
|------------------|---------------------------|--------------------------------|-------------------------|
| Linux            | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows          | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm          |


### Options

```
      --burst-limit int                 Limite coté client de la bande passante (par défaut 100)
      --debug                           Active la sortie détaillée
  -h, --help                            Aide pour Helm
      --kube-apiserver string           L'adresse et le port API du serveur Kubernetes
      --kube-as-group stringArray       Groupe à utiliser pour l'opération, cet argument peut être répété pour spécifier plusieurs groupes
      --kube-as-user string             Nom d'utilisateur à utiliser pour l'operation
      --kube-ca-file string             Le fichier de l'autorité de certification pour la connexion à l'API Kubernetes
      --kube-context string             Nom du contexte kubeconfig à utiliser
      --kube-insecure-skip-tls-verify   Si true, la validité du certificat du serveur API Kubernetes ne sera pas vérifiée. Cela fera les connexions HTTPS non sûres
      --kube-tls-server-name string     Nom du serveur utilisé pour la validation du certificat du serveur API Kubernetes. S'il n'est pas fourni, le nom de la machine cliente utilisée pour contacter le serveur sera utilisé
      --kube-token string               Jeton utilisé pour l'authentification
      --kubeconfig string               Chemin du fichier de configuration kubeconfig
  -n, --namespace string                Namespace à utiliser pour la requête
      --qps float32                     Requêtes par seconde utilisées lors de la communication avec l'API Kubernetes, hors burst
      --registry-config string          Chemin vers le fichier de configuration du registre (par défaut "~/.config/helm/registry/config.json")
      --repository-cache string         Chemin vers le fichier contenant les index du répertoire mis en cache (par défaut "~/.cache/helm/repository")
      --repository-config string        Chemin vers le fichier contenant les noms et URLs des répertoires (par défaut "~/.config/helm/repositories.yaml")
```
### VOIR AUSSI

* [helm completion](./helm_completion.md)	 - génère des scripts d'autocomplétion pour le shell spécifié
* [helm create](./helm_create.md)	 - crée un nouveau chart avec le nom donné
* [helm dependency](./helm_dependency.md)	 - gère les dépendances d'un chart
* [helm env](./helm_env.md)	 - informations sur l'environnement client Helm
* [helm get](./helm_get.md)	 - télécharge des informations étendues d'une release nommée
* [helm history](./helm_history.md)	 - récupère l'historique d'une release
* [helm install](./helm_install.md)	 - installe un chart
* [helm lint](./helm_lint.md)	 - examine un chart pour détecter d'éventuels problèmes
* [helm list](./helm_list.md)	 - liste les releases
* [helm package](./helm_package.md)	 - empaquète un répertoire chart dans une archive chart
* [helm plugin](./helm_plugin.md)	 - installe, liste ou désinstalle des plugins Helm
* [helm pull](./helm_pull.md)	 - télécharge un chart depuis un dépôt et (optionnellement) le décompresse localement
* [helm push](./helm_push.md)	 - pousse un chart vers un dépôt distant
* [helm registry](./helm_registry.md)	 - connexion ou déconnexion d'un registre
* [helm repo](./helm_repo.md)	 - ajoute, liste, supprime, met à jour et indexe des dépôts de charts
* [helm rollback](./helm_rollback.md)	 - restaure une release à une révision précédente
* [helm search](./helm_search.md)	 - recherche un mot-clé dans les charts
* [helm show](./helm_show.md)	 - affiche les informations d'un chart
* [helm status](./helm_status.md)	 - affiche le statut de la release nommée
* [helm template](./helm_template.md)	 - effectue le rendu local des templates
* [helm test](./helm_test.md)	 - exécute les tests d'une release
* [helm uninstall](./helm_uninstall.md)	 - désinstalle une release
* [helm upgrade](./helm_upgrade.md)	 - met à niveau une release
* [helm verify](./helm_verify.md)	 - vérifie qu'un chart à un chemin donné a été signé et est valide
* [helm version](./helm_version.md)	 - affiche les informations de version du client

###### Généré automatiquement par spf13/cobra le 14-Jan-2026