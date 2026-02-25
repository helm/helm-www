---
title: Guide des plugins Helm
description: Présente comment utiliser et créer des plugins pour étendre les fonctionnalités de Helm.
sidebar_position: 12
---

Un plugin Helm est un outil accessible via la CLI `helm`, mais qui ne fait pas partie du code source intégré de Helm.

Les plugins existants peuvent être trouvés dans la section [associée](/community/related#helm-plugins) ou en recherchant sur [GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

Ce guide explique comment utiliser et créer des plugins.

## Vue d'ensemble

Les plugins Helm sont des outils complémentaires qui s'intègrent parfaitement à Helm. Ils permettent d'étendre les fonctionnalités de base de Helm, sans nécessiter que chaque nouvelle fonctionnalité soit écrite en Go et ajoutée à l'outil principal.

Les plugins Helm possèdent les caractéristiques suivantes :

- Ils peuvent être ajoutés et supprimés d'une installation Helm sans impacter l'outil Helm principal.
- Ils peuvent être écrits dans n'importe quel langage de programmation.
- Ils s'intègrent à Helm et apparaissent dans `helm help` et ailleurs.

Les plugins Helm résident dans `$HELM_PLUGINS`. Vous pouvez trouver la valeur actuelle de cette variable, y compris la valeur par défaut lorsqu'elle n'est pas définie dans l'environnement, en utilisant la commande `helm env`.

Le modèle de plugin Helm est partiellement basé sur le modèle de plugin de Git. De ce fait, vous pouvez parfois entendre `helm` désigné comme la couche _porcelaine_, et les plugins comme la _plomberie_. C'est une façon abrégée de suggérer que Helm fournit l'expérience utilisateur et la logique de traitement de haut niveau, tandis que les plugins effectuent le « travail de fond » pour réaliser une action souhaitée.

## Installer un plugin

Les plugins sont installés à l'aide de la commande `$ helm plugin install <path|url>`. Vous pouvez passer un chemin vers un plugin sur votre système de fichiers local ou une URL d'un dépôt VCS distant. La commande `helm plugin install` clone ou copie le plugin situé au chemin/URL donné dans `$HELM_PLUGINS`. Si vous installez depuis un VCS, vous pouvez spécifier la version avec l'argument `--version`.

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

Si vous avez une distribution tar d'un plugin, extrayez simplement le plugin dans le répertoire `$HELM_PLUGINS`. Vous pouvez également installer des plugins tarball directement depuis une URL en exécutant `helm plugin install https://domain/path/to/plugin.tar.gz`

## Structure de fichiers d'un plugin

À bien des égards, un plugin est similaire à un chart. Chaque plugin possède un répertoire de premier niveau contenant un fichier `plugin.yaml`. D'autres fichiers peuvent être présents, mais seul le fichier `plugin.yaml` est requis.

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## Le fichier plugin.yaml

Le fichier plugin.yaml est requis pour un plugin. Il contient les champs suivants :

```yaml
name: The name of the plugin (REQUIRED)
version: A SemVer 2 version (REQUIRED)
usage: Single line usage text shown in help
description: Long description shown in places like helm help
ignoreFlags: Ignore flags passed in from Helm
platformCommand: # Configure command to run based on the platform
  - os: OS match, can be empty or omitted to match all OS'
    arch: Architecture match, can be empty or omitted to match all architectures
    command: Plugin command to execute
    args: Plugin command arguments
command: (DEPRECATED) Plugin command, use platformCommand instead
platformHooks: # Configure plugin lifecycle hooks based on the platform
  install: # Install lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin install command to execute
      args: Plugin install command arguments
  update: # Update lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin update command to execute
      args: Plugin update command arguments
  delete: # Delete lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin delete command to execute
      args: Plugin delete command arguments
hooks: # (Deprecated) Plugin lifecycle hooks, use platformHooks instead
  install: Command to install plugin
  update: Command to update plugin
  delete: Command to delete plugin
downloaders: # Configure downloaders capability
  - command: Command to invoke
    protocols:
      - Protocol schema supported
```

### Le champ `name`

Le champ `name` est le nom du plugin. Lorsque Helm exécute ce plugin, c'est le nom qu'il utilisera (par exemple, `helm NAME` invoquera ce plugin).

_Le `name` doit correspondre au nom du répertoire._ Dans notre exemple ci-dessus, cela signifie que le plugin avec `name: last` doit être contenu dans un répertoire nommé `last`.

Restrictions sur `name` :

- `name` ne peut pas dupliquer l'une des commandes de premier niveau existantes de `helm`.
- `name` doit être limité aux caractères ASCII a-z, A-Z, 0-9, `_` et `-`.

### Le champ `version`

Le champ `version` est la version SemVer 2 du plugin. `usage` et `description` sont tous deux utilisés pour générer le texte d'aide d'une commande.

### Le champ `ignoreFlags`

Le paramètre `ignoreFlags` indique à Helm de _ne pas_ transmettre les flags au plugin. Ainsi, si un plugin est appelé avec `helm myplugin --foo` et que `ignoreFlags: true`, alors `--foo` est ignoré silencieusement.

### Le champ `platformCommand`

Le champ `platformCommand` configure la commande que le plugin exécutera lorsqu'il sera appelé. Vous ne pouvez pas définir à la fois `platformCommand` et `command`, cela entraînerait une erreur. Les règles suivantes s'appliquent pour déterminer quelle commande utiliser :

- Si `platformCommand` est présent, il sera utilisé.
  - Si `os` et `arch` correspondent à la plateforme actuelle, la recherche s'arrête et la commande sera utilisée.
  - Si `os` correspond et `arch` est vide, la commande sera utilisée.
  - Si `os` et `arch` sont tous deux vides, la commande sera utilisée.
  - S'il n'y a pas de correspondance, Helm se terminera avec une erreur.
- Si `platformCommand` n'est pas présent et que la commande dépréciée `command` est présente, elle sera utilisée.
  - Si la commande est vide, Helm se terminera avec une erreur.

### Le champ `platformHooks`

Le champ `platformHooks` configure les commandes que le plugin exécutera pour les événements du cycle de vie. Vous ne pouvez pas définir à la fois `platformHooks` et `hooks`, cela entraînerait une erreur. Les règles suivantes s'appliquent pour déterminer quelle commande de hook utiliser :

- Si `platformHooks` est présent, il sera utilisé et les commandes pour l'événement du cycle de vie seront traitées.
  - Si `os` et `arch` correspondent à la plateforme actuelle, la recherche s'arrête et la commande sera utilisée.
  - Si `os` correspond et `arch` est vide, la commande sera utilisée.
  - Si `os` et `arch` sont tous deux vides, la commande sera utilisée.
  - S'il n'y a pas de correspondance, Helm ignorera l'événement.
- Si `platformHooks` n'est pas présent et que le hook déprécié `hooks` est présent, la commande pour l'événement du cycle de vie sera utilisée.
  - Si la commande est vide, Helm ignorera l'événement.

## Créer un plugin

Voici le YAML de plugin pour un plugin simple qui aide à obtenir le nom de la dernière release :

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

Les plugins peuvent nécessiter des scripts et exécutables supplémentaires. Les scripts peuvent être inclus dans le répertoire du plugin et les exécutables peuvent être téléchargés via un hook. Voici un exemple de plugin :

```console
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

Les variables d'environnement sont interpolées avant l'exécution du plugin. Le modèle ci-dessus illustre la méthode préférée pour indiquer où se trouve le programme du plugin.

### Commandes de plugin

Il existe quelques stratégies pour travailler avec les commandes de plugin :

- Si un plugin inclut un exécutable, l'exécutable pour un `platformCommand:` doit être packagé dans le répertoire du plugin ou installé via un hook.
- La ligne `platformCommand:` ou `command:` aura toutes ses variables d'environnement développées avant l'exécution. `$HELM_PLUGIN_DIR` pointera vers le répertoire du plugin.
- La commande elle-même n'est pas exécutée dans un shell. Vous ne pouvez donc pas écrire un script shell sur une seule ligne.
- Helm injecte beaucoup de configuration dans les variables d'environnement. Consultez l'environnement pour voir quelles informations sont disponibles.
- Helm ne fait aucune supposition sur le langage du plugin. Vous pouvez l'écrire dans le langage de votre choix.
- Les commandes sont responsables d'implémenter un texte d'aide spécifique pour `-h` et `--help`. Helm utilisera `usage` et `description` pour `helm help` et `helm help myplugin`, mais ne gérera pas `helm myplugin --help`.

### Tester un plugin local

Vous devez d'abord trouver votre chemin `HELM_PLUGINS`. Pour ce faire, exécutez la commande suivante :

``` bash
helm env
```

Changez votre répertoire actuel vers le répertoire défini par `HELM_PLUGINS`.

Maintenant vous pouvez ajouter un lien symbolique vers la sortie de build de votre plugin. Dans cet exemple, nous l'avons fait pour `mapkubeapis`.

``` bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

## Plugins téléchargeurs

Par défaut, Helm est capable de télécharger des charts via HTTP/S. À partir de Helm 2.4.0, les plugins peuvent avoir une capacité spéciale pour télécharger des charts depuis des sources arbitraires.

Les plugins doivent déclarer cette capacité spéciale dans le fichier `plugin.yaml` (au niveau supérieur) :

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

Si un tel plugin est installé, Helm peut interagir avec le dépôt en utilisant le protocole spécifié en invoquant la `command`. Le dépôt spécial doit être ajouté de manière similaire aux dépôts réguliers : `helm repo add favorite myprotocol://example.com/`. Les règles pour les dépôts spéciaux sont les mêmes que pour les dépôts réguliers : Helm doit être capable de télécharger le fichier `index.yaml` afin de découvrir et mettre en cache la liste des charts disponibles.

La commande définie sera invoquée avec le schéma suivant : `command certFile keyFile caFile full-URL`. Les identifiants SSL proviennent de la définition du dépôt, stockée dans `$HELM_REPOSITORY_CONFIG` (c'est-à-dire `$HELM_CONFIG_HOME/repositories.yaml`). Un plugin téléchargeur doit écrire le contenu brut sur stdout et signaler les erreurs sur stderr.

La commande de téléchargement supporte également les sous-commandes ou arguments, vous permettant de spécifier par exemple `bin/mydownloader subcommand -d` dans le `plugin.yaml`. Ceci est utile si vous souhaitez utiliser le même exécutable pour la commande principale du plugin et la commande de téléchargement, mais avec une sous-commande différente pour chacune.

## Variables d'environnement

Lorsque Helm exécute un plugin, il transmet l'environnement externe au plugin et injecte également quelques variables d'environnement supplémentaires.

Les variables comme `KUBECONFIG` sont définies pour le plugin si elles sont définies dans l'environnement externe.

Les variables suivantes sont garanties d'être définies :

- `HELM_PLUGINS` : Le chemin vers le répertoire des plugins.
- `HELM_PLUGIN_NAME` : Le nom du plugin, tel qu'invoqué par `helm`. Ainsi `helm myplug` aura le nom court `myplug`.
- `HELM_PLUGIN_DIR` : Le répertoire qui contient le plugin.
- `HELM_BIN` : Le chemin vers la commande `helm` (telle qu'exécutée par l'utilisateur).
- `HELM_DEBUG` : Indique si le flag debug a été défini par helm.
- `HELM_REGISTRY_CONFIG` : L'emplacement de la configuration du registre (si utilisé). Notez que l'utilisation de Helm avec des registres est une fonctionnalité expérimentale.
- `HELM_REPOSITORY_CACHE` : Le chemin vers les fichiers de cache du dépôt.
- `HELM_REPOSITORY_CONFIG` : Le chemin vers le fichier de configuration du dépôt.
- `HELM_NAMESPACE` : Le namespace donné à la commande `helm` (généralement via le flag `-n`).
- `HELM_KUBECONTEXT` : Le nom du contexte de configuration Kubernetes donné à la commande `helm`.

De plus, si un fichier de configuration Kubernetes a été explicitement spécifié, il sera défini comme variable `KUBECONFIG`.

## Note sur l'analyse des flags

Lors de l'exécution d'un plugin, Helm analyse les flags globaux pour son propre usage. Aucun de ces flags n'est transmis au plugin.
- `--burst-limit` : Converti en `$HELM_BURST_LIMIT`
- `--debug` : Si spécifié, `$HELM_DEBUG` est défini à `1`
- `--kube-apiserver` : Converti en `$HELM_KUBEAPISERVER`
- `--kube-as-group` : Converti en `$HELM_KUBEASGROUPS`
- `--kube-as-user` : Converti en `$HELM_KUBEASUSER`
- `--kube-ca-file` : Converti en `$HELM_KUBECAFILE`
- `--kube-context` : Converti en `$HELM_KUBECONTEXT`
- `--kube-insecure-skip-tls-verify` : Converti en `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY`
- `--kube-tls-server-name` : Converti en `$HELM_KUBETLS_SERVER_NAME`
- `--kube-token` : Converti en `$HELM_KUBETOKEN`
- `--kubeconfig` : Converti en `$KUBECONFIG`
- `--namespace` et `-n` : Converti en `$HELM_NAMESPACE`
- `--qps` : Converti en `$HELM_QPS`
- `--registry-config` : Converti en `$HELM_REGISTRY_CONFIG`
- `--repository-cache` : Converti en `$HELM_REPOSITORY_CACHE`
- `--repository-config` : Converti en `$HELM_REPOSITORY_CONFIG`

Les plugins _devraient_ afficher un texte d'aide et se terminer pour `-h` et `--help`. Dans tous les autres cas, les plugins peuvent utiliser les flags comme approprié.

## Fournir l'auto-complétion shell

À partir de Helm 3.2, un plugin peut optionnellement fournir le support de l'auto-complétion shell dans le cadre du mécanisme d'auto-complétion existant de Helm.

### Auto-complétion statique

Si un plugin fournit ses propres flags et/ou sous-commandes, il peut en informer Helm via un fichier `completion.yaml` situé dans le répertoire racine du plugin. Le fichier `completion.yaml` a la forme suivante :

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

Notes :

1. Toutes les sections sont optionnelles mais doivent être fournies si applicables.
1. Les flags ne doivent pas inclure le préfixe `-` ou `--`.
1. Les flags courts et longs peuvent et doivent être spécifiés. Un flag court n'a pas besoin d'être associé à sa forme longue correspondante, mais les deux formes doivent être listées.
1. Les flags n'ont pas besoin d'être ordonnés d'une manière particulière, mais doivent être listés au bon endroit dans la hiérarchie des sous-commandes du fichier.
1. Les flags globaux existants de Helm sont déjà gérés par le mécanisme d'auto-complétion de Helm, les plugins n'ont donc pas besoin de spécifier les flags suivants : `--debug`, `--namespace` ou `-n`, `--kube-context`, et `--kubeconfig`, ou tout autre flag global.
1. La liste `validArgs` fournit une liste statique des complétions possibles pour le premier paramètre suivant une sous-commande. Il n'est pas toujours possible de fournir une telle liste à l'avance (voir la section [Complétion dynamique](#complétion-dynamique) ci-dessous), auquel cas la section `validArgs` peut être omise.

Le fichier `completion.yaml` est entièrement optionnel. S'il n'est pas fourni, Helm ne fournira simplement pas d'auto-complétion shell pour le plugin (sauf si la [Complétion dynamique](#complétion-dynamique) est supportée par le plugin). De plus, l'ajout d'un fichier `completion.yaml` est rétro-compatible et n'impactera pas le comportement du plugin lors de l'utilisation de versions plus anciennes de Helm.

Par exemple, pour le plugin [`fullstatus`](https://github.com/marckhouzam/helm-fullstatus) qui n'a pas de sous-commandes mais accepte les mêmes flags que la commande `helm status`, le fichier `completion.yaml` est :

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

Un exemple plus élaboré pour le plugin [`2to3`](https://github.com/helm/helm-2to3), a un fichier `completion.yaml` de :

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### Complétion dynamique

Également à partir de Helm 3.2, les plugins peuvent fournir leur propre auto-complétion shell dynamique. L'auto-complétion shell dynamique est la complétion des valeurs de paramètres ou de flags qui ne peuvent pas être définies à l'avance. Par exemple, la complétion des noms des releases Helm actuellement disponibles sur le cluster.

Pour que le plugin supporte la complétion dynamique, il doit fournir un fichier **exécutable** appelé `plugin.complete` dans son répertoire racine. Lorsque le script de complétion de Helm nécessite des complétions dynamiques pour le plugin, il exécutera le fichier `plugin.complete`, en lui passant la ligne de commande qui doit être complétée. L'exécutable `plugin.complete` devra avoir la logique pour déterminer quels sont les choix de complétion appropriés et les afficher sur la sortie standard pour être consommés par le script de complétion de Helm.

Le fichier `plugin.complete` est entièrement optionnel. S'il n'est pas fourni, Helm ne fournira simplement pas d'auto-complétion dynamique pour le plugin. De plus, l'ajout d'un fichier `plugin.complete` est rétro-compatible et n'impactera pas le comportement du plugin lors de l'utilisation de versions plus anciennes de Helm.

La sortie du script `plugin.complete` doit être une liste séparée par des sauts de ligne telle que :

```console
rel1
rel2
rel3
```

Lorsque `plugin.complete` est appelé, l'environnement du plugin est défini exactement comme lorsque le script principal du plugin est appelé. Par conséquent, les variables `$HELM_NAMESPACE`, `$HELM_KUBECONTEXT` et toutes les autres variables de plugin seront déjà définies, et leurs flags globaux correspondants auront été supprimés.

Le fichier `plugin.complete` peut être sous n'importe quelle forme exécutable ; ce peut être un script shell, un programme Go, ou tout autre type de programme que Helm peut exécuter. Le fichier `plugin.complete` ***doit*** avoir les permissions d'exécution pour l'utilisateur. Le fichier `plugin.complete` ***doit*** se terminer avec un code de succès (valeur 0).

Dans certains cas, la complétion dynamique nécessitera d'obtenir des informations du cluster Kubernetes. Par exemple, le plugin `helm fullstatus` nécessite un nom de release en entrée. Dans le plugin `fullstatus`, pour que son script `plugin.complete` fournisse la complétion pour les noms de release actuels, il peut simplement exécuter `helm list -q` et afficher le résultat.

Si vous souhaitez utiliser le même exécutable pour l'exécution du plugin et pour la complétion du plugin, le script `plugin.complete` peut être fait pour appeler l'exécutable principal du plugin avec un paramètre ou flag spécial ; lorsque l'exécutable principal du plugin détecte le paramètre ou flag spécial, il saura qu'il doit exécuter la complétion. Dans notre exemple, `plugin.complete` pourrait être implémenté ainsi :

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

Le vrai script du plugin `fullstatus` (`status.sh`) doit alors rechercher le flag `--complete` et si trouvé, afficher les complétions appropriées.

### Astuces et conseils

1. Le shell filtrera automatiquement les choix de complétion qui ne correspondent pas à l'entrée de l'utilisateur. Un plugin peut donc retourner toutes les complétions pertinentes sans supprimer celles qui ne correspondent pas à l'entrée de l'utilisateur. Par exemple, si la ligne de commande est `helm fullstatus ngin<TAB>`, le script `plugin.complete` peut afficher *tous* les noms de release (du namespace `default`), pas seulement ceux commençant par `ngin` ; le shell ne conservera que ceux commençant par `ngin`.
1. Pour simplifier le support de la complétion dynamique, surtout si vous avez un plugin complexe, vous pouvez faire en sorte que votre script `plugin.complete` appelle votre script principal du plugin et demande les choix de complétion. Voir la section [Complétion dynamique](#complétion-dynamique) ci-dessus pour un exemple.
1. Pour déboguer la complétion dynamique et le fichier `plugin.complete`, vous pouvez exécuter ce qui suit pour voir les résultats de complétion :
    - `helm __complete <pluginName> <arguments to complete>`. Par exemple :
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`
