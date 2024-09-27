---
title: "Traduction de la documentation Helm"
description: "Instructions pour traduire la documentation de Helm"
weight: 5
---

Ce guide explique comment traduire la documentation de Helm.

## Commencer

Les contributions pour les traductions suivent le même processus que les contributions pour la documentation. Les traductions sont fournies via des [pull requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) au dépôt git [helm-www](https://github.com/helm/helm-www), et les pull requests sont examinées par l'équipe qui gère le site web.

### Code de la langue à 2 lettres

La documentation est organisée selon la norme [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) pour les codes de langue. Par exemple, le code à deux lettres pour le coréen est `ko`.

Dans le contenu et la configuration, vous trouverez le code de langue utilisé. Voici 3 exemples :

- Dans le répertoire `content`, les codes de langue sont utilisés comme sous-répertoires et le contenu localisé pour chaque langue se trouve dans ces répertoires. Principalement dans le sous-répertoire `docs` de chaque répertoire de code de langue.
- Le répertoire `i18n` contient un fichier de configuration pour chaque langue avec les phrases utilisées sur le site Web. Les fichiers sont nommés selon le modèle `[LANG].toml`, où `[LANG]` est le code de langue à deux lettres.
- Dans le fichier `config.toml` au niveau supérieur, il y a une configuration pour la navigation et d'autres détails organisés par code de langue.

L'anglais, avec un code de langue `en`, est la langue par défaut et la source des traductions.

### Fork, Branche, Changement, Pull Request

Pour contribuer aux traductions, commencez par [créer un fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) du [dépôt helm-www](https://github.com/helm/helm-www) sur GitHub. Vous commencerez par valider les modifications dans votre fork.

Par défaut, votre fork sera configuré pour travailler sur la branche par défaut, connue sous le nom de `main`. Veuillez utiliser des branches pour développer vos modifications et créer des pull requests. Si vous n'êtes pas familier avec les branches, vous pouvez [lire à leur sujet dans la documentation GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-branches).

Une fois que vous avez créé une branche, apportez les modifications nécessaires pour ajouter des traductions et localiser le contenu dans la langue souhaitée.

Remarque : Helm utilise un [Certificate of Origin pour les Développeurs](https://developercertificate.org/). Tous les commits doivent être signés. Lorsque vous effectuez un commit, vous pouvez utiliser le drapeau `-s` ou `--signoff` pour signer le commit avec votre nom et votre adresse e-mail configurés dans Git. Plus de détails sont disponibles dans le fichier [CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md#sign-your-work).

Lorsque vous êtes prêt, créez une [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) pour soumettre la traduction au dépôt `helm-www`.

Une fois qu'une pull request a été créée, l'un des mainteneurs l'examinera. Les détails sur ce processus se trouvent dans le fichier [CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md).

## Traduction du contenu

La localisation de tout le contenu de Helm est une tâche importante. Il est tout à fait acceptable de commencer par une petite partie. Les traductions peuvent être étendues au fil du temps.

### Commencer avec une nouvelle langue

Lorsque vous commencez à travailler sur une nouvelle langue, un minimum est nécessaire. Cela inclut :

- Ajouter un répertoire `content/[LANG]/docs` contenant un fichier `_index.md`. C'est la page de destination principale de la documentation.
- Créer un fichier `[LANG].toml` dans le répertoire `i18n`. Vous pouvez initialement copier le fichier `en.toml` comme point de départ.
- Ajouter une section pour la langue dans le fichier `config.toml` pour exposer la nouvelle langue. Une section de langue existante peut servir de point de départ.

### Traduction

Le contenu traduit doit être situé dans le répertoire `content/[LANG]/docs`. Il doit avoir la même URL que la source en anglais. Par exemple, pour traduire l'introduction en coréen, il peut être utile de copier la source en anglais comme suit :

```sh
mkdir -p content/ko/docs/intro
cp content/en/docs/intro/install.md content/ko/docs/intro/install.md
```

Le contenu du nouveau fichier peut ensuite être traduit dans l'autre langue.

Ne pas ajouter une copie non traduite d'un fichier en anglais dans `content/[LANG]/`. Une fois qu'une langue existe sur le site, les pages non traduites seront automatiquement redirigées vers la version anglaise. La traduction prend du temps, et il est important de toujours traduire la version la plus récente de la documentation, et non un fork obsolète.

Assurez-vous de supprimer toutes les lignes `aliases` de la section d'en-tête. Une ligne comme `aliases: ["/docs/using_helm/"]` n'a pas sa place dans les traductions. Ce sont des redirections pour d'anciens liens qui n'existent pas pour les nouvelles pages.

Notez que les outils de traduction peuvent aider dans le processus. Cela inclut les traductions générées automatiquement. Les traductions automatiques doivent être révisées ou corrigées par un locuteur natif à la langue traduite pour vérifier la grammaire et le sens avant leur publication.


## Naviguer entre les langues

![Screen Shot 2020-05-11 at 11 24 22
AM](https://user-images.githubusercontent.com/686194/81597103-035de600-937a-11ea-9834-cd9dcef4e914.png)

Le fichier de configuration global du site, [`config.toml`](https://github.com/helm/helm-www/blob/main/config.toml#L83L89), est l'endroit où la navigation entre les langues est configurée.

Pour ajouter une nouvelle langue, ajoutez un nouvel ensemble de paramètres en utilisant le [code de langue à deux lettres](./localization/#code-de-la-langue-à-2-lettres) défini ci-dessus. Exemple :

```
# Korean
[languages.ko]
title = "Helm"
description = "Helm - The Kubernetes Package Manager."
contentDir = "content/ko"
languageName = "한국어 Korean"
weight = 1
```

## Résolution des Liens Internes

Le contenu traduit peut parfois inclure des liens vers des pages qui n'existent que dans une autre langue. Cela entraînera des [erreurs de construction du site](https://app.netlify.com/sites/helm-merge/deploys). Exemple :

```
12:45:31 PM: htmltest started at 12:45:30 on app
12:45:31 PM: ========================================================================
12:45:31 PM: ko/docs/chart_template_guide/accessing_files/index.html
12:45:31 PM:   hash does not exist --- ko/docs/chart_template_guide/accessing_files/index.html --> #basic-example
12:45:31 PM: ✘✘✘ failed in 197.566561ms
12:45:31 PM: 1 error in 212 documents
```

Pour résoudre ce problème, vous devez vérifier votre contenu pour les liens internes.

* Les liens d'ancrage doivent refléter la valeur `id` traduite.
* Les liens vers les pages internes doivent être corrigés.

Pour les pages internes qui n'existent pas _(ou qui n'ont pas encore été traduites)_, le site ne sera pas généré tant qu'une correction n'aura pas été apportée. En tant que solution de repli, l'URL peut pointer vers une autre langue où ce contenu _existe_ comme suit :

`< relref path="/docs/topics/library_charts.md" lang="en" >`

Voir les [documents Hugo sur les références croisées entre langues](https://gohugo.io/content-management/cross-references/#link-to-another-language-version) pour plus d'informations.
