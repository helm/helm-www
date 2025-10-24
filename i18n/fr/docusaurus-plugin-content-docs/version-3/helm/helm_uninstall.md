---
title: "Helm Uninstall"
---

## helm uninstall

Désinstalle une release

### Synopsis

Cette commande prend le nom d'une release et la désinstalle.

Cela supprimera toutes les ressources associées à la dernière release d'un chart ainsi que l'historique des versions, le libérant pour une utilisation future.

Utilisez l'argument `--dry-run` pour voir quelles releases seront désinstallés sans vraiment les désinstaller.


```
helm uninstall RELEASE_NAME [...] [flags]
```

### Options

```
      --cascade string       Doit être "background", "orphan", ou "foreground". Séléctionne la stratègie de suppression des dépendances (par défaut "background")
      --description string   Ajoute une description personnalisée
      --dry-run              Simule une désinstallation
  -h, --help                 Aide pour la commande unistall
      --ignore-not-found     Considère l'erreur "release not found" comme une désinstallation réussie
      --keep-history         Supprime toutes les ressources associés et marque la release comme supprimé mais garde l'historique des versions
      --no-hooks             Empêche les hooks de fonctionner pendant la désinstallation
      --timeout duration     Temps d'attente pour chaque opération Kubernetes (comme les Jobs pour les hooks) (par défaut 5m0s)
      --wait                 Si fixé, cela attendra que toutes les ressources soient supprimées avant de finir, Il attendra aussi longtemps que --timeout
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

* [helm](helm.md) - Le gestionnaire de package Helm pour Kubernetes

