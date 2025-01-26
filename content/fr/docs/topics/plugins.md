---
title: "Le Guide des Plugins Helm"
description: "Présente comment utiliser et créer des plugins pour étendre les fonctionnalités de Helm"
weight: 12
---

Un plugin Helm est un outil qui peut être accédé via l'interface en ligne de commande `helm`, mais qui ne fait pas partie de la base de code intégrée de Helm.

Les plugins existants peuvent être trouvés dans la section [liée]({{< ref "/docs/community/related.md#plugins-helm" >}}) ou en recherchant sur [GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

Ce guide explique comment utiliser et créer des plugins.

## Un Aperçu

Les plugins Helm sont des outils complémentaires qui s'intègrent parfaitement à Helm. Ils offrent un moyen d'étendre les fonctionnalités de base de Helm, sans nécessiter que chaque nouvelle fonctionnalité soit écrite en Go et ajoutée à l'outil principal.

Les plugins Helm possèdent les caractéristiques suivantes :

- Ils peuvent être ajoutés et supprimés d'une installation Helm sans impacter l'outil Helm principal.
- Ils peuvent être écrits dans n'importe quel langage de programmation.
- Ils s'intègrent à Helm et apparaissent dans `helm help` et à d'autres endroits.

Les plugins Helm se trouvent dans `$HELM_PLUGINS`. Vous pouvez trouver la valeur actuelle de cette variable, y compris la valeur par défaut lorsqu'elle n'est pas définie dans l'environnement, en utilisant la commande `helm env`.

Le modèle de plugin Helm est en partie inspiré du modèle de plugins de Git. À ce titre, vous pourriez parfois entendre que `helm` est appelé la couche _porcelaine_, tandis que les plugins sont le _plomberie_. C'est une manière abrégée de suggérer que Helm fournit l'expérience utilisateur et la logique de traitement de haut niveau, tandis que les plugins se chargent du "travail de détail" pour exécuter une action souhaitée.

## Installer un Plugin

Les plugins sont installés en utilisant la commande `$ helm plugin install <chemin|url>`. Vous pouvez spécifier un chemin vers un plugin sur votre système de fichiers local ou une URL d'un dépôt VCS distant. La commande `helm plugin install` clone ou copie le plugin au chemin/URL donné dans `$HELM_PLUGINS`. Si vous installez à partir d'un système de contrôle de version (VCS), vous pouvez spécifier la version à l'aide de l'argument `--version`.

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

Si vous avez une distribution de plugin au format tar, il suffit de décompresser le plugin dans le répertoire `$HELM_PLUGINS`. Vous pouvez également installer des plugins au format tarball directement depuis une URL en exécutant `helm plugin install https://domain/path/to/plugin.tar.gz`.

## Structure des fichiers du plugin

À bien des égards, un plugin est similaire à un chart. Chaque plugin possède un répertoire de niveau supérieur contenant un fichier `plugin.yaml`. Des fichiers supplémentaires peuvent être présents, mais seul le fichier `plugin.yaml` est requis.

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## Fichier plugin.yaml

Le fichier `plugin.yaml` est requis pour un plugin. Il contient les champs suivants :

```yaml
name: Le nom du plugin (REQUIS)
version: Une version SemVer 2 (REQUIS)
usage: Texte d'utilisation sur une seule ligne affiché dans l'aide
description: Description longue affichée dans des endroits comme `helm help`
ignoreFlags: Ignorer les arguments passés depuis Helm
platformCommand: # Configurer la commande à exécuter en fonction de la plateforme.
  - os: Correspondance du système d'exploitation, peut être vide ou omis pour correspondre à tous les systèmes d'exploitation
    arch: Correspondance de l'architecture, peut être vide ou omis pour correspondre à toutes les architectures
    command: Plugin command to execute
    args: Commande du plugin à exécuter
command: (DÉPRÉCIÉ) Commande du plugin, utilisez `platformCommand` à la place
platformHooks: # Configurer les hooks du cycle de vie du plugin en fonction de la plateforme
install: # Commandes du cycle de vie d'installation
  - os: Correspondance du système d'exploitation, peut être vide ou omis pour correspondre à tous les systèmes d'exploitation
    arch: Correspondance de l'architecture, peut être vide ou omis pour correspondre à toutes les architectures
    command: Commande d'installation du plugin à exécuter
    args: Arguments de la commande d'installation du plugin
update: # Commandes du cycle de vie de mise à jour
  - os: Correspondance du système d'exploitation, peut être vide ou omis pour correspondre à tous les systèmes d'exploitation
    arch: Correspondance de l'architecture, peut être vide ou omis pour correspondre à toutes les architectures
    command: Commande de mise à jour du plugin à exécuter
    args: Arguments de la commande de mise à jour du plugin
delete: # Commandes du cycle de vie de suppression
  - os: Correspondance du système d'exploitation, peut être vide ou omis pour correspondre à tous les systèmes d'exploitation
    arch: Correspondance de l'architecture, peut être vide ou omis pour correspondre à toutes les architectures
    command: Commande de suppression du plugin à exécuter
    args: Arguments de la commande de suppression du plugin
hooks: # (Déprécié) Hooks du cycle de vie du plugin, utilisez `platformHooks` à la place
  install: Commande pour installer le plugin
  update: Commande pour mettre à jour le plugin
  delete: Commande pour supprimer le plugin
downloaders: # Configurer la capacité de téléchargement
  - command: Commande à invoquer
    protocols:
      - Schéma de protocole pris en charge
```

### Le champ `name`

Le champ `name` est le nom du plugin. Lorsque Helm exécute ce plugin, c'est ce nom qui sera utilisé (par exemple, `helm NAME` invoquera ce plugin).

_Le `name` doit correspondre au nom du répertoire._ Dans notre exemple ci-dessus, cela signifie que le plugin avec `name: last` doit être contenu dans un répertoire nommé `last`.

Restrictions sur `name` :

- `name` ne peut pas dupliquer l'un des commandes principales existantes de `helm`.
- `name` doit être limité aux caractères ASCII a-z, A-Z, 0-9, `_` et `-`.

### Le champ `version`

Le champ `version` est la version SemVer 2 du plugin. `usage` et `description` sont utilisés pour générer le texte d'aide d'une commande.

### Le champ `ignoreFlags`

Le commutateur `ignoreFlags` indique à Helm de _ne pas_ passer les arguments au plugin. Ainsi, si un plugin est appelé avec `helm myplugin --foo` et que `ignoreFlags: true`, alors `--foo` sera silencieusement ignoré.

### Le champ `platformCommand`

Le champ `platformCommand` configure la commande que le plugin exécutera lorsqu'il est appelé. Vous ne pouvez pas définir à la fois `platformCommand` et `command`, cela entraînera une erreur. Les règles suivantes s'appliquent pour décider quelle commande utiliser :

- Si `platformCommand` est présent, il sera utilisé.
    - Si `os` et `arch` correspondent à la plateforme actuelle, la recherche s'arrête et la commande sera utilisée.
    - Si `os` correspond et que `arch` est vide, la commande sera utilisée.
    - Si `os` et `arch` sont tous deux vides, la commande sera utilisée.
    - S'il n'y a pas de correspondance, Helm quittera avec une erreur.
- Si `platformCommand` n'est pas présent et que l'ancien `command` est présent, celui-ci sera utilisé.
    - Si la commande est vide, Helm quittera avec une erreur.

### Le champ `platformHooks`

Le champ `platformHooks` configure les commandes que le plugin exécutera pour les événements du cycle de vie. Vous ne pouvez pas définir à la fois `platformHooks` et `hooks`, cela entraînera une erreur. Les règles suivantes s'appliquent pour décider quelle commande de hook utiliser :

- Si `platformHooks` est présent, il sera utilisé et les commandes pour l'événement du cycle de vie seront traitées.
    - Si `os` et `arch` correspondent à la plateforme actuelle, la recherche s'arrête et la commande sera utilisée.
    - Si `os` correspond et que `arch` est vide, la commande sera utilisée.
    - Si `os` et `arch` sont tous deux vides, la commande sera utilisée.
    - S'il n'y a pas de correspondance, Helm ignorera l'événement.
- Si `platformHooks` n'est pas présent et que l'ancien `hooks` est présent, la commande pour l'événement du cycle de vie sera utilisée.
    - Si la commande est vide, Helm ignorera l'événement.

## Créer un Plugin

Voici le plugin YAML pour un plugin simple qui permet d'obtenir le nom de la dernière version :

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

Les plugins peuvent nécessiter des scripts et des exécutables supplémentaires. Les scripts peuvent être inclus dans le répertoire du plugin et les exécutables peuvent être téléchargés via un hook. Voici un exemple de plugin :

```console
$HELM_PLUGINS/
  |- monplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: monplugin
version: 0.1.0
usage: plugin exemple
description: plugin exemple
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/monplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\monplugin.exe
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

Les variables d'environnement sont interpolées avant l'exécution du plugin. Le modèle ci-dessus illustre la méthode préférée pour indiquer l'emplacement du programme du plugin.

### Commandes du plugin

Il existe plusieurs stratégies pour travailler avec les commandes de plugin :

- Si un plugin inclut un exécutable, l'exécutable pour un `platformCommand:` ou doit être empaqueté dans le répertoire du plugin ou installé via un hook.
- La ligne `platformCommand:` ou `command:` aura toutes les variables d'environnement étendues avant l'exécution. `$HELM_PLUGIN_DIR` pointera vers le répertoire du plugin.
- La commande elle-même n'est pas exécutée dans un shell. Vous ne pouvez donc pas écrire un script shell sur une seule ligne.
- Helm injecte beaucoup de configurations dans les variables d'environnement. Jetez un œil à l'environnement pour voir quelles informations sont disponibles.
- Helm ne fait aucune restriction sur le langage du plugin. Vous pouvez l'écrire dans le langage de votre choix.
- Les commandes sont responsables de l'implémentation du texte d'aide spécifique pour `-h` et `--help`. Helm utilisera `usage` et `description` pour `helm help` et `helm help monplugin`, mais ne gérera pas `helm monplugin --help`.

### Tester un plugin local

Tout d'abord, vous devez trouver le chemin de votre `HELM_PLUGINS`. Pour ce faire, exécutez la commande suivante :

```bash
helm env
```

Changez votre répertoire actuel pour celui qui est défini dans `HELM_PLUGINS`.

Maintenant, vous pouvez ajouter un lien symbolique vers le répertoire de sortie de votre plugin. Dans cet exemple, nous l'avons fait pour `mapkubeapis` :

```bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```


## Plugins de Téléchargement
Par défaut, Helm est capable de récupérer des Charts via HTTP/S. À partir de Helm 2.4.0, les plugins peuvent avoir une capacité spéciale pour télécharger des Charts depuis des sources arbitraires.

Les plugins doivent déclarer cette capacité spéciale dans le fichier `plugin.yaml` (au niveau supérieur) :

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

Si un tel plugin est installé, Helm peut interagir avec le dépôt en utilisant le schéma de protocole spécifié en invoquant la `command`. Le dépôt spécial doit être ajouté de la même manière que les dépôts réguliers : `helm repo add favorite myprotocol://example.com/`. Les règles pour les dépôts spéciaux sont les mêmes que pour les dépôts réguliers : Helm doit être capable de télécharger le fichier `index.yaml` afin de découvrir et de mettre en cache la liste des Charts disponibles.

La commande définie sera invoquée avec le schéma suivant : `command certFile keyFile caFile full-URL`. Les identifiants SSL proviennent de la définition du dépôt, stockée dans `$HELM_REPOSITORY_CONFIG` (c'est-à-dire, `$HELM_CONFIG_HOME/repositories.yaml`). Un plugin Downloader est censé émettre le contenu brut sur stdout et signaler les erreurs sur stderr.

La commande de téléchargement prend également en charge les sous-commandes ou arguments, vous permettant de spécifier par exemple `bin/mydownloader subcommand -d` dans le `plugin.yaml`. Cela est utile si vous souhaitez utiliser le même exécutable pour la commande principale du plugin et la commande de téléchargement, mais avec une sous-commande différente pour chacune.

## Variables d'Environnement

Lorsque Helm exécute un plugin, il passe l'environnement externe au plugin et injecte également certaines variables d'environnement supplémentaires.

Les variables comme `KUBECONFIG` sont définies pour le plugin si elles sont définies dans l'environnement externe.

Les variables suivantes sont garanties d'être définies :

- `HELM_PLUGINS` : Le chemin vers le répertoire des plugins.
- `HELM_PLUGIN_NAME` : Le nom du plugin, tel qu'invoqué par `helm`. Ainsi, `helm myplug` aura le nom court `myplug`.
- `HELM_PLUGIN_DIR` : Le répertoire contenant le plugin.
- `HELM_BIN` : Le chemin vers la commande `helm` (telle qu'exécutée par l'utilisateur).
- `HELM_DEBUG` : Indique si le flag de débogage a été activé par Helm.
- `HELM_REGISTRY_CONFIG` : L'emplacement de la configuration du registre (si utilisé). Notez que l'utilisation de Helm avec les registres est une fonctionnalité expérimentale.
- `HELM_REPOSITORY_CACHE` : Le chemin vers les fichiers de cache des dépôts.
- `HELM_REPOSITORY_CONFIG` : Le chemin vers le fichier de configuration des dépôts.
- `HELM_NAMESPACE` : L'espace de noms donné à la commande `helm` (généralement en utilisant le flag `-n`).
- `HELM_KUBECONTEXT` : Le nom du contexte de configuration Kubernetes donné à la commande `helm`.

De plus, si un fichier de configuration Kubernetes a été spécifié explicitement, il sera défini en tant que variable `KUBECONFIG`.

## Remarque sur l'Analyse des Arguments

Lors de l'exécution d'un plugin, Helm analysera les arguments globaux pour son propre usage. Aucun de ces arguments n'est transmis au plugin.

- `--debug` : Si cet argument est spécifié, `$HELM_DEBUG` est défini sur `1`.
- `--registry-config` : Ceci est converti en `$HELM_REGISTRY_CONFIG`.
- `--repository-cache` : Ceci est converti en `$HELM_REPOSITORY_CACHE`.
- `--repository-config` : Ceci est converti en `$HELM_REPOSITORY_CONFIG`.
- `--namespace` et `-n` : Ceci est converti en `$HELM_NAMESPACE`.
- `--kube-context` : Ceci est converti en `$HELM_KUBECONTEXT`.
- `--kubeconfig` : Ceci est converti en `$KUBECONFIG`.

Les plugins _devraient_ afficher le texte d'aide et ensuite se terminer pour `-h` et `--help`. Dans tous les autres cas, les plugins peuvent utiliser les arguments de manière appropriée.

## Fournir l'auto-complétion shell

Depuis Helm 3.2, un plugin peut optionnellement fournir un support pour l'auto-complétion shell dans le cadre du mécanisme d'auto-complétion existant de Helm.

### Complétion automatique statique

Si un plugin fournit ses propres arguments et/ou sous-commandes, il peut en informer Helm en ayant un fichier `completion.yaml` situé dans le répertoire racine du plugin. Le fichier `completion.yaml` a la forme suivante :

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

Remarques :
1. Toutes les sections sont optionnelles mais doivent être fournies si elles sont applicables.
2. Les arguments ne doivent pas inclure le préfixe `-` ou `--`.
3. Les arguments courts et longs peuvent et doivent être spécifiés. Un argument court n'a pas besoin d'être associé à sa forme longue correspondante, mais les deux formes doivent être listées.
4. Les arguments n'ont pas besoin d'être ordonnés de manière spécifique, mais doivent être listés au bon endroit dans la hiérarchie des sous-commandes du fichier.
5. Les arguments globaux existants de Helm sont déjà pris en charge par le mécanisme d'auto-complétion de Helm, donc les plugins n'ont pas besoin de spécifier les arguments suivants : `--debug`, `--namespace` ou `-n`, `--kube-context`, et `--kubeconfig`, ou tout autre flag global.
6. La liste `validArgs` fournit une liste statique de complétions possibles pour le premier paramètre suivant une sous-commande. Il n'est pas toujours possible de fournir une telle liste à l'avance (voir la section [Complétion Dynamique](#complétion-dynamique) ci-dessous), auquel cas la section `validArgs` peut être omise.

Le fichier `completion.yaml` est entièrement optionnel. S'il n'est pas fourni, Helm ne proposera tout simplement pas l'auto-complétion shell pour le plugin (à moins que la [Complétion Dynamique](#complétion-dynamique) soit supportée par le plugin). De plus, l'ajout d'un fichier `completion.yaml` est rétrocompatible et n'affectera pas le comportement du plugin avec les versions antérieures de Helm.

Par exemple, pour le [`plugin fullstatus`](https://github.com/marckhouzam/helm-fullstatus) qui n'a pas de sous-commandes mais accepte les mêmes flags que la commande `helm status`, le fichier `completion.yaml` est :

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

Un exemple plus complexe pour le [`plugin 2to3`](https://github.com/helm/helm-2to3) a un fichier `completion.yaml` comme suit :

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

### Complétion Dynamique

Depuis Helm 3.2, les plugins peuvent également fournir leur propre auto-complétion shell dynamique. La complétion shell dynamique concerne la complétion des valeurs de paramètres ou de flags qui ne peuvent pas être définies à l'avance. Par exemple, la complétion des noms des releases Helm actuellement disponibles sur le cluster.

Pour que le plugin supporte l'auto-complétion dynamique, il doit fournir un fichier **exécutable** appelé `plugin.complete` dans son répertoire racine. Lorsque le script de complétion Helm nécessite des complétions dynamiques pour le plugin, il exécutera le fichier `plugin.complete`, en lui passant la ligne de commande qui doit être complétée. L'exécutable `plugin.complete` devra avoir la logique pour déterminer quels sont les choix de complétion appropriés et les afficher sur la sortie standard pour être consommés par le script de complétion Helm.

Le fichier `plugin.complete` est entièrement optionnel. S'il n'est pas fourni, Helm ne proposera tout simplement pas de complétion dynamique pour le plugin. De plus, l'ajout d'un fichier `plugin.complete` est rétrocompatible et n'affectera pas le comportement du plugin avec les versions antérieures de Helm.

La sortie du script `plugin.complete` doit être une liste séparée par des sauts de ligne, par exemple :

```
rel1
rel2
rel3
```

Lorsque `plugin.complete` est appelé, l'environnement du plugin est configuré de la même manière que lorsqu'on appelle le script principal du plugin. Par conséquent, les variables `$HELM_NAMESPACE`, `$HELM_KUBECONTEXT`, et toutes les autres variables du plugin seront déjà définies, et les flags globaux correspondants seront supprimés.

Le fichier `plugin.complete` peut être sous n'importe quelle forme exécutable ; il peut s'agir d'un script shell, d'un programme Go, ou de tout autre type de programme que Helm peut exécuter. Le fichier `plugin.complete` ***doit*** avoir des permissions d'exécution pour l'utilisateur. Le fichier `plugin.complete` ***doit*** se terminer avec un code de succès (valeur 0).

Dans certains cas, la complétion dynamique nécessitera d'obtenir des informations depuis le cluster Kubernetes. Par exemple, le plugin `helm fullstatus` nécessite un nom de release en entrée. Dans le plugin `fullstatus`, pour que son script `plugin.complete` fournisse des complétions pour les noms de release actuels, il peut simplement exécuter `helm list -q` et afficher le résultat.

S'il est souhaité d'utiliser le même exécutable pour l'exécution du plugin et pour la complétion du plugin, le script `plugin.complete` peut être configuré pour appeler l'exécutable principal du plugin avec un paramètre ou un flag spécial. Lorsque l'exécutable principal du plugin détecte ce paramètre ou flag spécial, il saura qu'il doit exécuter la complétion. Dans notre exemple, `plugin.complete` pourrait être implémenté comme suit :

```sh
#!/usr/bin/env sh

# "$@" est la ligne de commande entière qui nécessite une complétion. 
# Il est important de mettre en double citation la variable "$@" pour préserver un éventuel dernier paramètre vide.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

Le vrai script du plugin `fullstatus` (`status.sh`) doit alors rechercher l'argument `--complete` et, s'il est trouvé, afficher les complétions appropriées.

### Conseils et astuces

1. Le shell filtrera automatiquement les choix de complétion qui ne correspondent pas à l'entrée de l'utilisateur. Un plugin peut donc retourner toutes les complétions pertinentes sans supprimer celles qui ne correspondent pas à l'entrée de l'utilisateur. Par exemple, si la ligne de commande est `helm fullstatus ngin<TAB>`, le script `plugin.complete` peut imprimer *tous* les noms de release (de l'espace de noms `default`), pas seulement ceux commençant par `ngin` ; le shell ne conservera que ceux commençant par `ngin`.
2. Pour simplifier le support de la complétion dynamique, surtout si vous avez un plugin complexe, vous pouvez faire en sorte que votre script `plugin.complete` appelle votre script principal de plugin et demande des choix de complétion. Voir la section [Complétion Dynamique](#complétion-dynamique) ci-dessus pour un exemple.
3. Pour déboguer la complétion dynamique et le fichier `plugin.complete`, vous pouvez exécuter ce qui suit pour voir les résultats de complétion :
   - `helm __complete <pluginName> <arguments à compléter>`. Par exemple :
     - `helm __complete fullstatus --output js<ENTER>`,
     - `helm __complete fullstatus -o json ""<ENTER>`
