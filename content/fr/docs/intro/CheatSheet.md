---
title: "Cheat Sheet"
description: "Helm cheatsheet"
weight: 4
---

La cheatsheet d'Helm contient toutes les commandes nécessaires pour gérer une application avec Helm.

-----------------------------------------------------------------------------------------------------------------------------------------------
### Base

Chart:
- Il s'agit du nom de votre chart dans le cas où il aurait été téléchargé ou décompressé.
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
helm install <name> <chart>                           # Installe le chart avec son nom.
helm install <name> <chart> --namespace <namespace>   # Installe le chart dans un namespace spécifié.
helm install <name> <chart> --set key1=val1,key2=val2 # Définir des valeurs en ligne de commande (vous pouvez spécifier plusieurs valeur ou les séparer par des virgules).
helm install <name> <chart> --values <yaml-file/url>  # Installe le chart avec vos valeurs spécifiques.
helm install <name> <chart> --dry-run --debug         # Lance un test d'installation pour valider le chart.
helm install <name> <chart> --verify                  # Vérifie le package avant de l'utiliser.
helm install <name> <chart> --dependency-update       # Met à jour les dépendances si elles sont manquantes avant d'installer le chart.
helm uninstall <name>                                 # Désinstalle un chart.
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Mise à jour et Restauration de l'Application

```bash
helm upgrade <release> <chart>                            # Met à niveau une version
helm upgrade <release> <chart> --atomic                   # Si fixé, le processus de mise à niveau restore en cas d'erreur
helm upgrade <release> <chart> --dependency-update        # Met à jour les dépendances si elles sont manquantes avant d'installer le chart
helm upgrade <release> <chart> --version <version_number> # Spécifie une version à installer
helm upgrade <release> <chart> --values                   # Spécifier des valeurs dans un fichier YAML ou une URL (vous pouvez en spécifier plusieurs)
helm upgrade <release> <chart> --set key1=val1,key2=val2  # Définir des valeurs en ligne de commande (vous pouvez spécifier plusieurs valeurs ou les séparer par des virgules)
helm upgrade <release> <chart> --force                    # Force la mise à jour des ressources via une stratégie de remplacement
helm rollback <release> <revision>                        # Restore une release pour une version spécifique
helm rollback <release> <revision>  --cleanup-on-fail     # Autorise la suppression des nouvelles ressources créées si le rollback échoue
``` 
------------------------------------------------------------------------------------------------------------------------------------------------
### Lister, Ajouter, Supprimer et Mettre à jour des dépôts

```bash
helm repo add <repo-name> <url>   # Ajoute un dépôts depuis Internet.
helm repo list                    # Liste les dépôts de chart ajoutés.
helm repo update                  # Met à jour les informations des charts disponible locallement à partir des dépôts.
helm repo remove <repo_name>      # Supprime un ou plusieurs dépôts.
helm repo index <DIR>             # Lis le dossier courant et génère un fichier d'index sur les charts trouvés.
helm repo index <DIR> --merge     # Fusionne l'index généré avec un fichier d'index existant.
helm search repo <keyword>        # Recherche des dépôts pour un mot clé dans les charts.
helm search hub <keyword>         # Recherche des charts sur l'Artificat Hub ou sur votre propre hub.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Surveillance des Version Helm

```bash
helm list                       # Liste toutes les versions pour un namespace spécifique, utilise le namespace du contexte courant si le namespace n'est pas spécifié.
helm list --all                 # Liste toutes les versions sans filtre appliqué, vous pouvez utiliser '-a'.
helm list --all-namespaces      # Liste toutes les versions dans tous les namespaces, vous pouvez utiliser '-A'.
helm -l key1=value1,key2=value2 # Sélécteur (requête sur les étiquettes) sur lequel filtrer, prend en charge '=', '==', et '!='.
helm list --date                # Tri par date de sortie.
helm list --deployed            # Liste les versions déployées. Si aucune n'est spécifiée, cela sera automatiquement activé.
helm list --pending             # Liste les versions en attente.
helm list --failed              # Liste les versions ayant échouées.
helm list --uninstalled         # Liste les versions désinstallées (si 'helm uninstall --keep-history' a été utilisé).
helm list --superseded          # Liste les versions remplacées.
helm list -o yaml               # Affiche la sortie dans le format spécifié. Valeurs autorisées : table, json, yaml (par défaut table).
helm status <release>           # Cette commande affiche l'état de la version nommée.
helm status <release> --revision <number>   # Si fixé, affiche l'état d'un version nommée avec sa révision.
helm history <release>          # Historique des révisions pour une version donnée.
helm env                        # Affiche toutes les informations sur l'environnement utilisées par Helm.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Télécharger les Informations des Versions

```bash
helm get all <release>      # Une collection d'informations lisible par l'homme sur les notes, les hooks, les valeurs fournies et le fichier manifeste généré de la version donnée.
helm get hooks <release>    # Cette commande télécharge les hooks d'une version. Les hooks sont formatés en YAML et séparés par le spérateur YAML '---\n'.
helm get manifest <release> # Un manifeste est une réprésentation encodée en YAML des ressources Kubernetes qui ont été générées par cette version du/des chart(s). Si un chart dépend d'autres charts, ces ressources seront également incluses dans le manifest.
helm get notes <release>    # Affiche les notes fournies par le chart d'une version donnée.
helm get values <release>   # Télécharge un fichier de valeurs pour une version donnée. Utilisez l'argument '-o' pour formater la sortie.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Gestion des Plugins

```bash
helm plugin install <path/url1>     # Installe des plugins
helm plugin list                    # Affiche la liste des plugins installés
helm plugin update <plugin>         # Met à jour des plugins
helm plugin uninstall <plugin>      # Désinstalle un plugin
```
-------------------------------------------------------------------------------------------------------------------------------------------------