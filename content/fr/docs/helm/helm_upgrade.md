---
title: "Helm Upgrade"
---

## helm upgrade

Met à jour une release

### Synopsis

Cette commande met à jour une release vers une nouvelle version du chart.

Cette commande prend une release et un chart. L'argument 'CHART' peut être soit :  une référence de chart ('example/mariadb'), un chemin vers un répertoire de chart,
un chart packagé, ou une URL complète. Pour les références de chart, la dernière version sera spécifiée à moins que l'argument `--version` soit défini.

Pour remplacer les valeurs dans un chart, utilisez soit l'argument `--values` et donnez un fichier ou utilisez l'argument `--set` et donnez une configuration depuis la console, pour forcer les valeurs en string, utilisez `--set-string`. Vous pouvez utiliser `--set-file` pour fixer les valeurs depuis un fichier, quand les valeurs son trop longues pour la ligne de commande ou si elles sont générées dynamiquement. Vous pouvez également utiliser `--set-json` pour fixer les valeurs en JSON (scalars/objects/arrays) dans la ligne de commande.

Vous pouvez spécifier l'argument `--values` / `-f` plusieurs fois. La priorité sera donnée au dernier spécifié (à l'extreme droite). Par exemple, si `myvalues.yaml` et `override.yaml` contiennent une clé nommée 'Test', la valeur fixée dans `override.yaml` sera prioritaire :

    $ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

Vous pouvez spécifier l'argument `--set` plusieurs fois. La priorité sera donnée au dernier spécifié (à l'extreme droite). Par exemple, si les valeurs 'bar' et 'newbar' sont fixé pour la clé nommée 'newbar', la valeur 'newbar' sera prioritaire : 

    $ helm upgrade --set foo=bar --set foo=newbar redis ./redis

Vous pouvez également remplacer les valeurs d'une release existante avec cette commande via l'argument `--reuse-values`. Les arguments 'RELEASE' et 'CHART' doivent être fixés comme paramètres et les valeurs existantes seront fusionnés avec toutes les valeurs fixés via les arguments `--values` / `-f` ou `--set`. La priorité est donnée aux nouvelles valeurs.

    $ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis


```
helm upgrade [RELEASE] [CHART] [flags]
```

### Options

```
      --atomic                                     if set, upgrade process rolls back changes made in case of failed upgrade. The --wait flag will be set automatically if --atomic is used
      --ca-file string                             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string                           identify HTTPS client using this SSL certificate file
      --cleanup-on-fail                            allow deletion of new resources created in this upgrade when upgrade fails
      --create-namespace                           if --install is set, create the release namespace if not present
      --dependency-update                          update dependencies if they are missing before installing the chart
      --description string                         add a custom description
      --devel                                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
      --disable-openapi-validation                 if set, the upgrade process will not validate rendered templates against the Kubernetes OpenAPI Schema
      --dry-run string[="client"]                  simulate an install. If --dry-run is set with no option being specified or as '--dry-run=client', it will not attempt cluster connections. Setting '--dry-run=server' allows attempting cluster connections.
      --enable-dns                                 enable DNS lookups when rendering templates
      --force                                      force resource updates through a replacement strategy
  -h, --help                                       help for upgrade
      --history-max int                            limit the maximum number of revisions saved per release. Use 0 for no limit (default 10)
      --insecure-skip-tls-verify                   skip tls certificate checks for the chart download
  -i, --install                                    if a release by this name doesn't already exist, run an install
      --key-file string                            identify HTTPS client using this SSL key file
      --keyring string                             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Labels that would be added to release metadata. Should be separated by comma. Original release labels will be merged with upgrade labels. You can unset label using null. (default [])
      --no-hooks                                   disable pre/post upgrade hooks
  -o, --output format                              prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pass-credentials                           pass credentials to all domains
      --password string                            chart repository password where to locate the requested chart
      --plain-http                                 use insecure HTTP connections for the chart download
      --post-renderer postRendererString           the path to an executable to be used for post rendering. If it exists in $PATH, the binary will be used, otherwise it will try to look for the executable at the given path
      --post-renderer-args postRendererArgsSlice   an argument to the post-renderer (can specify multiple) (default [])
      --render-subchart-notes                      if set, render subchart notes along with the parent
      --repo string                                chart repository url where to locate the requested chart
      --reset-then-reuse-values                    when upgrading, reset the values to the ones built into the chart, apply the last release's values and merge in any overrides from the command line via --set and -f. If '--reset-values' or '--reuse-values' is specified, this is ignored
      --reset-values                               when upgrading, reset the values to the ones built into the chart
      --reuse-values                               when upgrading, reuse the last release's values and merge in any overrides from the command line via --set and -f. If '--reset-values' is specified, this is ignored
      --set stringArray                            set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray                       set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-json stringArray                       set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    set a literal STRING value on the command line
      --set-string stringArray                     set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-crds                                  if set, no CRDs will be installed when an upgrade is performed with install flag enabled. By default, CRDs are installed if not already present, when an upgrade is performed with install flag enabled
      --timeout duration                           time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --username string                            chart repository username where to locate the requested chart
  -f, --values strings                             specify values in a YAML file or a URL (can specify multiple)
      --verify                                     verify the package before using it
      --version string                             specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used
      --wait                                       if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
      --wait-for-jobs                              if set and --wait enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as --timeout
```

### Options héritées des commandes parents

```
      --burst-limit int                 Limite coté client de la bande passante (par défaut 100)
      --debug                           Active la sortie détaillée
      --kube-apiserver string           L'adresse et le port API du serveur Kubernetes
      --kube-as-group stringArray       Groupe à utiliser pour l'opération, cet argument peut être répété pour spécifier plusieurs groupes
      --kube-as-user string             Nom d'utilisateur à utiliser pour l'operation
      --kube-ca-file string             Le fichier de l'autorité de certification pour la connection à l'API Kubernetes
      --kube-context string             Nom du contexte kubeconfig à utiliser
      --kube-insecure-skip-tls-verify   Si true, la validité du certificat du serveur API Kubernetes ne sera pas vérifiée. Cela fera les connections HTTPS non sûres
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

