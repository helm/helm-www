---
title: "Guide du Développeur"
description: "Insctructions pour configurer votre environement de développement pour Helm"
weight: 1
---

Ce guide explique comment configurer votre environnement pour le développement sur Helm.

## Prérequis

- La dernière version de Go
- Un cluster Kubernetes avec kubectl (optionnel)
- Git

## Construire Helm

Nous utiliserons Make pour compiler nos programmes. La manière la plus simple de commencer est la suivantes :

```console
$ make
```

Si nécessaire, cela installera d'abord les dépendances et validera la configuration. Ensuite, cela compilera `helm` et le placera dans `bin/helm`.

Pour exécuter Helm localement, vous pouvez exécuter `bin/helm`.

- Helm est connu pour fonctionner sur macOS et la plupart des distributions Linux, y compris Alpine.

## Lancer des Tests

Pour exécuter tous les tests, lancez `make test`. Comme prérequis, vous devez avoir [golangci-lint](https://golangci-lint.run) installé.

## Exécution locale

Vous pouvez mettre à jour votre variable PATH et ajouter le chemin de votre binaire Helm local. Dans un éditeur, ouvrez votre fichier de configuration de shell. Ajoutez la ligne suivante en veillant à remplacer `<path to your binary folder>` par le répertoire de votre dossier binaire local :

```
export PATH="<path to your binary folder>:$PATH"
```

Cela vous permettra d'exécuter la version construite localement de Helm depuis votre terminal.

## Directives de Contribution

Nous accueillons volontiers les contributions. Ce projet a établi certaines directives afin de garantir que (a) la qualité du code reste élevée, (b) le projet reste cohérent, et (c) les contributions respectent les exigences légales en matière de logiciel open source. Notre intention n'est pas de surcharger les contributeurs, mais de construire un code open source élégant et de haute qualité afin que nos utilisateurs en bénéficient.

Assurez-vous d'avoir lu et compris le guide principal de CONTRIBUTION :

<https://github.com/helm/helm/blob/main/CONTRIBUTING.md>

### Structure du Code

Le code du projet Helm est organisé comme suit :

- Les programmes individuels se trouvent dans `cmd/`. Le code à l'intérieur de `cmd/` n'est pas conçu pour être réutilisé en tant que bibliothèque.
- Les bibliothèques partagées sont stockées dans `pkg/`.
- Le répertoire `scripts/` contient plusieurs scripts utilitaires. La plupart d'entre eux sont utilisés par le pipeline CI/CD.

La gestion des dépendances Go est en évolution, et il est probable qu'elle change au cours du cycle de vie de Helm. Nous encourageons les développeurs à _ne pas_ essayer de gérer les dépendances manuellement. Au lieu de cela, nous suggérons de vous fier au `Makefile` du projet pour le faire à votre place. Avec Helm 3, il est recommandé d'utiliser la version 1.13 de Go ou ultérieure.

### Écriture de la Documentation

Depuis Helm 3, la documentation a été déplacée dans son propre dépôt. Lors de l'ajout de nouvelles fonctionnalités, veuillez rédiger la documentation correspondante et la soumettre au dépôt [helm-www](https://github.com/helm/helm-www).

Une exception : [La sortie CLI de Helm (en anglais)](https://helm.sh/docs/helm/) est générée à partir du binaire `helm` lui-même. Voir [Mise à jour de la documentation de référence CLI de Helm](https://github.com/helm/helm-www#updating-the-helm-cli-reference-docs) pour les instructions sur la génération de cette sortie. Lorsqu'elle est traduite, la sortie CLI n'est pas générée et peut être trouvée dans `/content/<lang>/docs/helm`.

### Conventions Git

Nous utilisons Git pour notre système de contrôle de version. La branche `main` est le lieu des candidats actuels au développement. Les versions sont marquées avec des tags.

Nous acceptons les modifications du code via des Pull Requests (PRs) sur GitHub. Un flux de travail pour cela est le suivant :

1. **Forkez** le dépôt `github.com/helm/helm` dans votre compte GitHub.
2. **Clonez** le dépôt forké dans le répertoire de votre choix avec `git clone`.
3. Créez une nouvelle branche de travail (`git checkout -b feat/my-feature`) et effectuez vos modifications sur cette branche.
4. Lorsque vous êtes prêt pour la révision, **poussez** votre branche sur GitHub, puis **ouvrez** une nouvelle pull request avec nous.

Pour les messages de commit Git, nous suivons les [Semantic Commit Messages](https://karma-runner.github.io/0.13/dev/git-commit-msg.html) :

```
fix(helm): add --foo flag to 'helm install'

When 'helm install --foo bar' is run, this will print "foo" in the
output regardless of the outcome of the installation.

Closes #1234
```

Types communs de commit :

- fix : Corriger un bug ou une erreur
- feat : Ajouter une nouvelle fonctionnalité
- docs : Modifier la documentation
- test : Améliorer les tests
- ref : Refactoriser le code existant

Scope communs :

- `helm` : La CLI Helm
- `pkg/lint` : Le package lint. Suivez une convention similaire pour tout autre package
- `*` : Deux scopes ou plus

Voir plus :

- Les [Directives Deis](https://github.com/deis/workflow/blob/master/src/contributing/submitting-a-pull-request.md) ont été l'inspiration pour cette section.
- [Karma Runner](https://karma-runner.github.io/0.13/dev/git-commit-msg.html), qui définisse l'idée des messages de commit sémantiques.

### Conventions Go

Nous suivons de très près les standards de style de codage Go. En général, l'exécution de `go fmt` rendra votre code élégant pour vous.

Nous suivons également les conventions recommandées par `go lint` et `gometalinter`. Exécutez `make test-style` pour vérifier la conformité du style.

Voir plus :

- Le guide Effective Go [introduit la mise en forme](https://golang.org/doc/effective_go.html#formatting).
- Le Wiki de Go contient un excellent article sur la [mise en forme](https://github.com/golang/go/wiki/CodeReviewComments).

Si vous exécutez la cible `make test`, non seulement les tests unitaires seront exécutés, mais les tests de style le seront également. Si la cible `make test` échoue, même pour des raisons de style, votre PR ne sera pas considérée comme prête à être fusionnée.
