---
title: "Helm Completion Fish"
---

## helm completion fish

Générer des scripts d'auto-complétion pour fish

### Synopsis

Générer des scripts d'auto-complétion pour Helm pour le shell fish.

Pour charger les complétions dans votre session shell courante :

    helm completion fish | source

Pour charger les complétion pour chaque nouvelles session, exécutez une fois :

    helm completion fish > ~/.config/fish/completions/helm.fish

Vous devez relancer un nouveau shell pour que cette configuration prenne effet.

```
helm completion fish [flags]
```

### Options

```
  -h, --help              Aide pour fish
      --no-descriptions   Désactiver les descriptions des complétions
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
      --kube-token string               Jeton bearer pour l'autentification
      --kubeconfig string               Chemin vers le fichier kubeconfig
  -n, --namespace string                Namespace pour cette requête
      --registry-config string          Chemin vers le fichier de configuration du registre (par défaut "~/.config/helm/registry/config.json")
      --repository-cache string         Chemin vers le fichier contenant les index du référentiel mis en cache (par défaut "~/.cache/helm/repository")
      --repository-config string        Chemin vers le fichier contenant les URL du référentiel (par défaut "~/.config/helm/repositories.yaml")
```

### Voir également

* [helm completion](helm_completion.md) - Générer des scripts d'auto-complétion pour le shell spécifié
