---
title: "Helm Plugin Install"
---

## helm plugin install

installe un ou plusieurs plugins Helm

### Synopsis

Cette commande vous permet d'installer un plugin depuis une URL vers un dépôt VCS ou un chemin local.


```
helm plugin install [options] <path|url>... [flags]
```

### Options

```
  -h, --help             Aide pour la commande install
      --version string   Spécifie une contraintre de version. Si cela n'est pas spécifé, la dernière version sera installé
```

### Options héritées des commandes parents

```
      --burst-limit int                 Limitation coté client (par dfaut 100)
      --debug                           Active la sortie détaillée
      --kube-apiserver string           L'adresse et le port de l'API Kubernetes
      --kube-as-group stringArray       Groupe à utiliser pour l'opération, cet indicateur peut être répété pour spécifier plusieurs groupes
      --kube-as-user string             Nom d'utilisateur à utiliser pour l'opération
      --kube-ca-file string             Le fichier de l'autorité de certification pour se connecter au serveur de l'API Kubernetes
      --kube-context string             Nom du contexte kubeconfig à utiliser
      --kube-insecure-skip-tls-verify   Si indiqué, la validité du certificat de l'API Kubernetes ne sera pas vérifiée. Cela rend votre connexion HTTPS non sécurisée
      --kube-tls-server-name string     Nom du serveur à utiliser pour la validité du certificat de l'API Kubernetes. Si non renseigné, le nom d'hôte utilisé pour contacter le serveur sera utilisé
      --kube-token string               Jeton bearer pour l'authentification
      --kubeconfig string               Chemin vers le fichier kubeconfig
  -n, --namespace string                Namespace pour cette requête
      --registry-config string          Chemin vers le fichier de configuration du registre (par défaut "~/.config/helm/registry/config.json")
      --repository-cache string         Chemin vers le fichier contenant les index du référentiel mis en cache (par défaut "~/.cache/helm/repository")
      --repository-config string        Chemin vers le fichier contenant les URL du référentiel (par défaut "~/.config/helm/repositories.yaml")
```

### Voir également

* [helm plugin](helm_plugin.md) - Installer, lister ou désinstaller des plugins Helm
