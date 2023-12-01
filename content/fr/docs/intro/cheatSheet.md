---
title: "Cheat Sheet"
description: "Helm cheatsheet"
weight: 4
---

La cheatsheet d'Helm contient toutes les commandes nécessaires pour gérer une application avec Helm.

-----------------------------------------------------------------------------------------------------------------------------------------------
### Base

Chart:
- Il s'agit du nom de votre chart dans le cas où il aurait été télécharger ou décompressé.
- Il s'agit du <repo_name>/<chart_name> dans le cas où le répertoire a été ajouté mais que le chart n'a pas été téléchargé.
- Il s'agit de l'URL/chemin absolu vers le chart.

Name:
- C'est le nom que vous souhaitez donner à votre installation du Chart Helm.

Release:
- C'est le nom que vous donnez à une instance d'installation.

Revision:
- C'est le numéro de l'historique de déploiement.

Repo-name:
- Le nom d'un répertoire

DIR:
- Nom/chemin du dossier

------------------------------------------------------------------------------------------------------------------------------------------------

### Gestion des Chart

```bash
helm create <name>                      # Créer un dossier chart avec les fichiers et dossiers utilisé dans un chart.
helm package <chart-path>               # Emballe un chart dans une archive compressée et versionnée.
helm lint <chart>                       # Lance des tests pour examiner un chart et identifier des problèmes.
helm show all <chart>                   # Inspect et liste le contenu d'un chart.
helm show values <chart>                # Affiche le contenu du fichier values.yaml
helm pull <chart>                       # Télécharge/pull un chart 
helm pull <chart> --untar=true          # Si spécifié à true, décompresse le chart une fois téléchargé.
helm pull <chart> --verify              # Vérifie le package avant de l'utiliser
helm pull <chart> --version <number>    # Par défaut, c'est la denière version (latest) qui est utilisée, vous pouvez spécifier une version pour utiliser.
helm dependency list <chart>            # Affiche la liste des dépendances du chart.
``` 
--------------------------------------------------------------------------------------------------------------------------------------------------

### Installer et Désinstaller des Applications

```bash
helm install <name> <chart>                           # Installe le chart avec son nom
helm install <name> <chart> --namespace <namespace>   # Installe le chart dans une namespace spécifié
helm install <name> <chart> --set key1=val1,key2=val2 # Définir des valeurs en ligne de commande (vous pouvez spécifier plusieurs valeur ou les séparer par des virgules)
helm install <name> <chart> --values <yaml-file/url>  # Installe le chart avec vos valeurs spécifiques
helm install <name> <chart> --dry-run --debug         # Lance un test d'installation pour valider le chart
helm install <name> <chart> --verify                  # Vérifie le package avant de l'utiliser
helm install <name> <chart> --dependency-update       # Met à jour les dépendances si elles sont manquantes avant d'installer le chart
helm uninstall <name>                                 # Désinstalle une release
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Mise à jour et Restauration de l'Application

```bash
helm upgrade <release> <chart>                            # Met à niveau une version
helm upgrade <release> <chart> --atomic                   # Si fixé, le processus de mise à niveau restore en cas d'erreur
helm upgrade <release> <chart> --dependency-update        # Met à jour les dépendances si elles sont manquantes avant d'installer le chart
helm upgrade <release> <chart> --version <version_number> # Spécifie une version à installer
helm upgrade <release> <chart> --values                   # Spécifier des valeurs dans un fichier YAML ou une URL (vous pouvez en spécifier plusieurs)
helm upgrade <release> <chart> --set key1=val1,key2=val2  # Définir des valeurs en ligne de commande (vous pouvez spécifier plusieurs valeur ou les séparer par des virgules)
helm upgrade <release> <chart> --force                    # Force la mise à jour des ressources via une stratégie de remplacement
helm rollback <release> <revision>                        # Restore une release pour une version spécifique
helm rollback <release> <revision>  --cleanup-on-fail     # Autorise la suppression des nouvelles ressources créées si le rollback échoue
``` 
------------------------------------------------------------------------------------------------------------------------------------------------
### Liste, Ajoute, Supprime et Mise à jour des dépots

```bash
helm repo add <repo-name> <url>   # Ajoute un dépots depuis Internet
helm repo list                    # Liste les dépots de chart ajoutés
helm repo update                  # Met à jour les informations des chart disponible locallement à partir des dépots
helm repo remove <repo_name>      # Supprime un ou plusieurs dépots
helm repo index <DIR>             # Lis le dossier courant et génère un fichier d'index sur les chart trouvés
helm repo index <DIR> --merge     # Fusionne l'index généré avec un fichier d'index existant
helm search repo <keyword>        # Recherche des dépots pour un mot clé dans les charts
helm search hub <keyword>         # Recher des charts sur l'Artificat Hub ou sur votre propre hub
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Helm Release monitoring

```bash
helm list                       # Lists all of the releases for a specified namespace, uses current namespace context if namespace not specified
helm list --all                 # Show all releases without any filter applied, can use -a
helm list --all-namespaces      # List releases across all namespaces, we can use -A
helm -l key1=value1,key2=value2 # Selector (label query) to filter on, supports '=', '==', and '!='
helm list --date                # Sort by release date
helm list --deployed            # Show deployed releases. If no other is specified, this will be automatically enabled
helm list --pending             # Show pending releases
helm list --failed              # Show failed releases
helm list --uninstalled         # Show uninstalled releases (if 'helm uninstall --keep-history' was used)
helm list --superseded          # Show superseded releases
helm list -o yaml               # Prints the output in the specified format. Allowed values: table, json, yaml (default table)
helm status <release>           # This command shows the status of a named release.
helm status <release> --revision <number>   # if set, display the status of the named release with revision
helm history <release>          # Historical revisions for a given release.
helm env                        # Env prints out all the environment information in use by Helm.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Download Release Information

```bash
helm get all <release>      # A human readable collection of information about the notes, hooks, supplied values, and generated manifest file of the given release.
helm get hooks <release>    # This command downloads hooks for a given release. Hooks are formatted in YAML and separated by the YAML '---\n' separator.
helm get manifest <release> # A manifest is a YAML-encoded representation of the Kubernetes resources that were generated from this release's chart(s). If a chart is dependent on other charts, those resources will also be included in the manifest.
helm get notes <release>    # Shows notes provided by the chart of a named release.
helm get values <release>   # Downloads a values file for a given release. use -o to format output
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Gestion des Plugins

```bash
helm plugin install <path/url1>     # Installation des plugins
helm plugin list                    # Affiche la liste des plugins installés
helm plugin update <plugin>         # Mise à jour des plugins
helm plugin uninstall <plugin>      # Désinstalle un plugin
```
-------------------------------------------------------------------------------------------------------------------------------------------------
