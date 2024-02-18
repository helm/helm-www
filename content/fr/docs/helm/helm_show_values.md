---
title: "Helm Show Values"
---

## helm show values

Affiche les values du chart

### Synopsis

Cette commande inspect un chart (dossier, fichier ou URL) et affiche le contenu du fichier values.yaml.


```
helm show values [CHART] [flags]
```

### Options

```
      --ca-file string             Vérifie les certificats des serveurs compatibles HTTPS à l'aide de ce bundle CA
      --cert-file string           Identifie le client HTTPS à l'aide de ce fichier de certificat SSL
      --devel                      Utiliser également les version de développement (alpha, beta, et versions candidates). Équivalent à version '>0.0.0-0'. Si --version est fixé, cela sera ignoré
  -h, --help                       Aide pour la commande all
      --insecure-skip-tls-verify   Passe les vérification du certificat TLS pour le transfer du chart
      --jsonpath string            fournir une expression JSONPath pour filtrer la sortie
      --key-file string            Identifie le client HTTPS à l'aide de ce fichier de clé SSL
      --keyring string             Emplacement des clés publiques utilisé pour la vérification (par défaut "~/.gnupg/pubring.gpg")
      --pass-credentials           Transmet les informations d'identification à tous les domaines
      --password string            Mot de passe pour le répertoire de chart où est le chart demandé
      --plain-http                 Utilise une connexion HTTP non-sécurisée pour le transfert du chart
      --repo string                URL du répertoire du chart demandé
      --username string            Nom d'utilisateur pour le répertoire du chart demandé
      --verify                     Vérifie le package avant de l'utiliser
      --version string             Spécifie la contrainte de version pour la version du chart à utiliser. Cette contrainte peut être un tag spécifique (ex : 1.1.1) ou il peut faire référence à une plage valide (ex : ^2.0.0). Si non spécifié, la dernière version sera utilisée
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
* [helm show](helm_show.md) - Affiche les informations du chart

