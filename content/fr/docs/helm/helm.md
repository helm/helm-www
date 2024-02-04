---
title: "Helm"
---

## helm

Helm, Le gestionnaire de paquets pour Kubernetes

### Synopsis

Le gestionnaire de paquets pour Kubernetes

Actions courrantes de Helm:

- helm search:    cherche des charts installées dans Kubernetes
- helm pull:      télécharge l'archive chart dans le répertoire courant
- helm install:   installe le chart dans le namespace du cluster Kubernetes
- helm list:      liste les versions de charts installées dans le namespace du cluster Kubernetes

Variables d'environnement:

| Nom                                | Description                                                                                       |
|------------------------------------|---------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | définit un répertoire alternatif pour stocker les fichiers du cache.                              |
| $HELM_CONFIG_HOME                  | définit un répertoire alternatif pour stocker les fichiers de configuration.                      |
| $HELM_DATA_HOME                    | définit un répertoire alternatif pour stocker les fichiers de données.                            |
| $HELM_DEBUG                        | indique si Helm tourne en mode Debug                                                              |
| $HELM_DRIVER                       | définit le driver du stockage du backend. Il peut être: configmap, secret, memory, sql.           |
| $HELM_DRIVER_SQL_CONNECTION_STRING | définit la chaine de caractères que le driver de stockage SQL doit utiliser.                      |
| $HELM_MAX_HISTORY                  | définit le nombre maximum de versions helm conservées.                                            |
| $HELM_NAMESPACE                    | définit le namespace des operations helm.                                                         |
| $HELM_NO_PLUGINS                   | désactive les plugins. Positionne HELM_NO_PLUGINS=1 pour désactiver les plugins.                  |
| $HELM_PLUGINS                      | définit le chemin du répertoire de plugins.                                                       |
| $HELM_REGISTRY_CONFIG              | définit le chemin du registre de configuration.                                                   |
| $HELM_REPOSITORY_CACHE             | définit le chemin du repertoire cache.                                                            |
| $HELM_REPOSITORY_CONFIG            | définit le chemin du registre de configuration.                                                   |
| $KUBECONFIG                        | définit un chemin alternatif de configuration de kubernetes (default "~/.kube/config")            |
| $HELM_KUBEAPISERVER                | définit le point d'entrée API du serveur Kubernetes pour authentification                         |
| $HELM_KUBECAFILE                   | définit le fichier de certificat d'autorité de Kubernetes.                                        |
| $HELM_KUBEASGROUPS                 | définit le groupe à utiliser pour anonymisation en utilisant une liste csv.                       |
| $HELM_KUBEASUSER                   | définit le nom à utiliser pour anonymiser l'operation.                                            |
| $HELM_KUBECONTEXT                  | définit le nom du contexte kubeconfig.                                                            |
| $HELM_KUBETOKEN                    | définit le canal KubeToken utilisé pour authentification.                                         |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | indique si la vérification du certificat de l'API serveur ne doit pas être faite. (peu sûr)       |
| $HELM_KUBETLS_SERVER_NAME          | définit le nom du serveur utilisé pour valider le certificat de l'API Kubernetes.                 |
| $HELM_BURST_LIMIT                  | définit la limite burst au cas où le serveur contient plusieurs CRDs (défaut 100,-1 désactive)    |

Helm range le cache, configuration, et données suivant les configurations serveur suivantes:

- Si la variable d'environnement HELM_*_HOME est positionnée, elle sera utilisée
- Sinon, sur les systèmes supportant les spécifications XDG base directory, les variables XDG seront utilisées
- Lorsqu'aucun autre chemin n'est positionné, le chemin par défaut sera celui ddéfinit par le système d'exploitation OS

Par défaut, les répertoires par défaut dépendent du système d'exploitation OS:

| OS               | Chemin Cache              | Chemin Configuration           | Chemin Données          |
|------------------|---------------------------|--------------------------------|-------------------------|
| Linux            | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows          | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm          |


### Options

```
      --burst-limit int                 coté client limite bande passante (defaut 100)
      --debug                           active la verbosité
  -h, --help                            aide pour helm
      --kube-apiserver string           l'addresse et le port API du serveur Kubernetes
      --kube-as-group stringArray       group pour anonymiser l'opération, ce flag peut être répété pour spécifier plusieurs groupes.
      --kube-as-user string             nom utilisateur à anonymiser pour l'operation
      --kube-ca-file string             le fichier de l'autorité certifiante pour la connection à l'API serveur Kubernetes
      --kube-context string             nom du contexte kubeconfig à utiliser
      --kube-insecure-skip-tls-verify   Si true, la validité du certificat du serveur API Kubernetes ne sera pas vérifiée. Cela fera les connections HTTPS non sûres
      --kube-tls-server-name string     Nom du serveur utilisé pour la validation du certificat du serveur API Kubernetes. S'il n'est pas fourni, le nom de la machine cliente utilisée pour contacter le serveur sera utilisée
      --kube-token string               token du canal utilisé pour l'authentification
      --kubeconfig string               chemin du fichier de configuration kubeconfig
  -n, --namespace string                namespace utilisée pour la requête
      --registry-config string          chemin de configuration du registre (par defaut "~/.config/helm/registry/config.json")
      --repository-cache string         chemin contenant les indexes des repository en cache (default "~/.cache/helm/repository")
      --repository-config string        chemin contenant les noms et URLs des répertoires (default "~/.config/helm/repositories.yaml")
```

###### Auto generated by spf13/cobra on 8-Feb-2023
