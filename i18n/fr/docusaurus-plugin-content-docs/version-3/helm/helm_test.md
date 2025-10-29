---
title: helm test
---
Lance des tests sur une release

### Synopsis

La commande test, lance des tests sur une release.

Cette commande prend le nom d'une release déployée. Les tests à exécuter sont définis dans le chart qui a été installée.


```
helm test [RELEASE] [flags]
```

### Options

```
      --filter strings     Spécifier les tests par attribut (actuellement "name") en utilisant la syntaxe attribut=valeur ou '!attribut=valeur' ​​pour exclure un test (vous pouvez spécifier plusieurs valeurs ou des valeurs distinctes avec des virgules : name=test1, name=test2)
  -h, --help               Aide pour la commande test
      --logs               Récupère les logs du pod de test (cela s'exécutera une fois tous les tests terminés, mais avant de tout nettoyer)
      --timeout duration   Temps d'attente pour chaque opération Kubernetes (comme les Jobs pour les hooks) (par défaut 5m0s)
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

* [helm](/helm/helm.md) - Le gestionnaire de package Helm pour Kubernetes

