---
title: "Le Guide des Plugins Helm"
description: "Présente comment utiliser et créer des plugins pour étendre les fonctionnalités de Helm"
weight: 12
---

Un plugin Helm est un outil qui peut être accédé via l'interface en ligne de commande `helm`, mais qui ne fait pas partie de la base de code intégrée de Helm.

Les plugins existants peuvent être trouvés dans la section [liée]({{}}) ou en recherchant sur [GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

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

Les plugins sont installés en utilisant la commande `$ helm plugin install <chemin|url>`. Vous pouvez spécifier un chemin vers un plugin sur votre système de fichiers local ou une URL d'un dépôt VCS distant. La commande `helm plugin install` clone ou copie le plugin au chemin/URL donné dans `$HELM_PLUGINS`

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

Si vous avez une distribution de plugin au format tar, il suffit de décompresser le plugin dans le répertoire `$HELM_PLUGINS`. Vous pouvez également installer des plugins au format tarball directement depuis une URL en exécutant `helm plugin install https://domain/path/to/plugin.tar.gz`.

## Créer un Plugin

À bien des égards, un plugin est similaire à un chart. Chaque plugin a un répertoire de niveau supérieur, ainsi qu'un fichier `plugin.yaml`.

```
$HELM_PLUGINS/
  |- last/
      |
      |- plugin.yaml
      |- last.sh

```

Dans l'exemple ci-dessus, le plugin `last` est contenu dans un répertoire nommé `last`. Il comprend deux fichiers : `plugin.yaml` (obligatoire) et un script exécutable, `last.sh` (optionnel).

Le cœur d'un plugin est un simple fichier YAML nommé `plugin.yaml`. Voici un exemple de YAML pour un plugin qui aide à obtenir le nom de la dernière release :

```yaml
name: "last"
version: "0.1.0"
usage: "obtenir le nom de la dernière release"
description: "obtenir le nom de la dernière release"
ignoreFlags: false
command: "$HELM_BIN --host $TILLER_HOST list --short --max 1 --date -r"
platformCommand:
  - os: linux
    arch: i386
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: linux
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: windows
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
```

Le `name` est le nom du plugin. Lorsque Helm exécute ce plugin, c'est ce nom qu'il utilisera (par exemple, `helm NAME` invoquera ce plugin).

_Le `name` doit correspondre au nom du répertoire._ Dans notre exemple, cela signifie que le plugin avec `name: last` doit être contenu dans un répertoire nommé `last`.

Restrictions sur le `name` :

- `name` ne peut pas dupliquer l'un des commandes de niveau supérieur existantes de `helm`.
- `name` doit être limité aux caractères ASCII a-z, A-Z, 0-9, `_` et `-`.

`version` est la version SemVer 2 du plugin. `usage` et `description` sont utilisés pour générer le texte d'aide d'une commande.

Le switch `ignoreFlags` indique à Helm de _ne pas_ passer les options au plugin. Ainsi, si un plugin est appelé avec `helm myplugin --foo` et que `ignoreFlags: true` est défini, alors `--foo` sera silencieusement ignoré.

Enfin, et surtout, `platformCommand` ou `command` est la commande que ce plugin exécutera lorsqu'il sera appelé. La section `platformCommand` définit les variations spécifiques au système d'exploitation/architecture d'une commande. Les règles suivantes s'appliquent pour décider quelle commande utiliser :

- Si `platformCommand` est présent, il sera recherché en premier.
- Si à la fois `os` et `arch` correspondent à la plateforme actuelle, la recherche s'arrêtera et la commande sera utilisée.
- Si `os` correspond et qu'il n'y a pas de correspondance plus spécifique pour `arch`, la commande sera utilisée.
- Si aucune correspondance dans `platformCommand` n'est trouvée, la commande par défaut `command` sera utilisée.
- Si aucune correspondance n'est trouvée dans `platformCommand` et qu'aucun `command` n'est présent, Helm quittera avec une erreur.

Les variables d'environnement sont interpolées avant l'exécution du plugin. Le modèle ci-dessus illustre la manière préférée d'indiquer où se trouve le programme du plugin.

Il existe plusieurs stratégies pour travailler avec les commandes de plugins :

- Si un plugin inclut un exécutable, l'exécutable pour un `platformCommand:` ou un `command:` doit être emballé dans le répertoire du plugin.
- La ligne `platformCommand:` ou `command:` aura toutes les variables d'environnement développées avant l'exécution. `$HELM_PLUGIN_DIR` pointera vers le répertoire du plugin.
- La commande elle-même n'est pas exécutée dans un shell. Vous ne pouvez donc pas enchaîner un script shell en une seule ligne.
- Helm injecte beaucoup de configuration dans les variables d'environnement. Consultez l'environnement pour voir quelles informations sont disponibles.
- Helm ne fait aucune restriction sur le langage du plugin. Vous pouvez l'écrire dans le langage de votre choix.
- Les commandes sont responsables de la mise en œuvre du texte d'aide spécifique pour `-h` et `--help`. Helm utilisera `usage` et `description` pour `helm help` et `helm help myplugin`, mais ne gérera pas `helm myplugin --help`.

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
6. La liste `validArgs` fournit une liste statique de complétions possibles pour le premier paramètre suivant une sous-commande. Il n'est pas toujours possible de fournir une telle liste à l'avance (voir la section [Complétion Dynamique]() ci-dessous), auquel cas la section `validArgs` peut être omise.

Le fichier `completion.yaml` est entièrement optionnel. S'il n'est pas fourni, Helm ne proposera tout simplement pas l'auto-complétion shell pour le plugin (à moins que la [Complétion Dynamique]() soit supportée par le plugin). De plus, l'ajout d'un fichier `completion.yaml` est rétrocompatible et n'affectera pas le comportement du plugin avec les versions antérieures de Helm.

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
2. Pour simplifier le support de la complétion dynamique, surtout si vous avez un plugin complexe, vous pouvez faire en sorte que votre script `plugin.complete` appelle votre script principal de plugin et demande des choix de complétion. Voir la section [Complétion Dynamique]() ci-dessus pour un exemple.
3. Pour déboguer la complétion dynamique et le fichier `plugin.complete`, vous pouvez exécuter ce qui suit pour voir les résultats de complétion :
   - `helm __complete <pluginName> <arguments à compléter>`. Par exemple :
     - `helm __complete fullstatus --output js<ENTER>`,
     - `helm __complete fullstatus -o json ""<ENTER>`
