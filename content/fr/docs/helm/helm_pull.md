---
title: "Helm Pull"
---

## helm pull

Télécharge un chart depuis un répertoire et (optionnellement) le décompresser dans un répertoire local.

### Synopsis

Récupère un package depuis un répertoire de packages et le télécharge localement.

Cela est utile pour récupérer des packages pour les inspecter, modifier ou pour les repackager. Cette commande peut également être utilisée pour effectuer une vérification cryptographique d'un chart sans l'installer.

Il y a une option pour décompresser le chart après l'avoir téléchargé. 
There are options for unpacking the chart after download. Cela créera un répertoire pour le chart et le décompressera dans ce répertoire.

Si l'argument `--verify` est spécifié, le chart demandé DOIT avoir un fichier de provenance et DOIT passer le processus de vérification. Un échec dans n’importe quelle partie entraînera une erreur et le chart ne sera pas enregistré localement.


```
helm pull [chart URL | repo/chartname] [...] [flags]
```

### Options

```
      --ca-file string             Vérifie les certificats des serveurs compatibles HTTPS à l'aide de ce bundle CA
      --cert-file string           Identifie le client HTTPS à l'aide de ce fichier de certificat SSL
  -d, --destination string         Emplacement pour écrire le chart (par défaut ".")
      --devel                      Utilise les versions de développement également. Équivalent à version '>0.0.0-0'. Si --version est fixé, cela sera ignoré
  -h, --help                       Aide pour la commande pull
      --insecure-skip-tls-verify   Passe les vérification du certificat TLS pour le téléchargement du chart
      --key-file string            Identifie le client HTTPS à l'aide de ce fichier de clé SSL
      --keyring string             Emplacement des clés public utilisées pour la vérification (par défaut "~/.gnupg/pubring.gpg")
      --pass-credentials           Transmettre les informations d'identification à tous les domaines
      --password string            Mot de passe du répertoire de chart
      --plain-http                 Utilise une connexion HTTP non-sécurisée pour le téléchargement du chart
      --prov                       Récupérer le fichier de provenance, mais n'effectue pas de vérification
      --repo string                URL du répertoire de chart
      --untar                      Si fixé à true, décompresse le chart après l'avoir téléchargé
      --untardir string            Si untar est spécifié, cet argument spécifie le nom du dossier dans lequel le chart sera décompressé (par défaut ".")
      --username string            Nom d'utilisateur du répertoire de chart
      --verify                     Vérifie le package avant de l'utiliser
      --version string             Spécifie une contrainte de version pour la version du chart à utiliser. Cette contrainte peut être un tag spécifique (ex: 1.1.1) ou elle peut faire référence à une plage valide (ex: ^2.0.0). Si ce n'est pas spécifié, la dernière version sera utilisée
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

* [helm](helm.md) -  Le gestionnaire de package Helm pour Kubernetes
