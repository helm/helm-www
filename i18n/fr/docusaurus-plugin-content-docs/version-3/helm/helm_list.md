---
title: helm list
---
liste les publications

### Synopsis

Cette commande liste toutes les publications pour un namespace donné (utilise le namespace du contexte si le namespace n'est pas spécifié).

Par défaut, cela liste uniquement les publications qui sont déployées ou échouées. Des options telles que '--uninstalled' et '--all' modifieront ce comportement. Ces options peuvent être combinées, par exemple '--uninstalled --failed'.

Par défaut, les éléments sont triés par ordre alphabétique. Vous pouvez utiliser l'option '-d' pour trier par date de publication.

Si l'option '--filter' est renseigné, il sera traité comme un filtre. Les filtres sont des expressions régulières (regEx) (compatibles avec Perl) qui sont appliquées à la liste des publications. Seuls les éléments qui correspondent au filtre seront renvoyées. 

    $ helm list --filter 'ara[a-z]+'
    NAME                UPDATED                                  CHART
    maudlin-arachnid    2020-06-18 14:17:46.125134977 +0000 UTC  alpine-0.1.0

Si aucun résultat n'est trouvé, 'helm list' se terminera avec le code de sortie 0, mais sans affichage (ou dans le cas de l'absence de l'option '-q', seulement les en-têtes).

Par défaut, jusqu'à 256 éléments peuvent être renvoyés. Pour limiter cela, utilisez l'option '--max'.
Définir '--max' à 0 ne renverra pas tous les résultats. Au lieu de ça, il renverra la valeur par défaut du serveur qui peut être beaucoup plus élevée que 256.
L'utilisation de l'option '--max' avec l'option '--offset' vous permet de parcourir les résultats pages par pages.

```
helm list [flags]
```

### Options

```
  -a, --all                  Affiche toutes les publications sans filtre d'appliqué
  -A, --all-namespaces       Liste les publications à travers tous les namespace
  -d, --date                 Trie par date de publication
      --deployed             Affiche les publications déployées. Si aucun autre n'est spécifié, celle-ci sera automatiquement activé
      --failed               Affiche les publications échouées
  -f, --filter string        Une expression régulière (compatible Perl). Toutes les publications correspondant à l'expression régulières seront incluses dans les résultats
  -h, --help                 Aide pour la commande list
  -m, --max int              Nombre maximum de publications à récupérer (par défaut 256)
      --no-headers           Ne pas afficher les en-têtes lors de l'utilisation de sortie par défaut
      --offset int           Index de la prochaine publication dans la liste, utilisé pour décaler à partir de la valeur de départ
  -o, --output format        Affiche la sortie dans un format spécifique. Valeurs possible : table, json, yaml (par défaut table)
      --pending              Affiche les publications en attente
  -r, --reverse              Inverse l'ordre de tri
  -l, --selector string      Sélecteur (requête d'étiquette) à utiliser comme filtre, prend en charge '=', '==', et '!='.(ex : -l key1=value1,key2=value2). Fonctionne uniquement avec les backends de stockage secret (par défaut) et configmap
  -q, --short                Format de la liste de sortie courte (silencieux)
      --superseded           Affiche les publications remplacées
      --time-format string   Format du temps en utilisant le formateur de temps de GoLang. Exemple : --time-format "2006-01-02 15:04:05Z0700"
      --uninstalled          Affiche les publications désinstallées (Si 'helm uninstall --keep-history' a été utilisé)
      --uninstalling         Affiche les publications en cours de désinstallation
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
