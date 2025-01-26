---
title: "Liste de vérification pour les releases"
description: "Liste de vérification pour les mainteneurs lors de la publication de leur prochaine release Helm"
weight: 2
---

# Guide du Mainteneur pour les Releases Helm

Il est temps de publier une nouvelle version de Helm ! En tant que mainteneur de Helm responsable de la publication, vous êtes la personne la mieux placée pour [mettre à jour cette liste de vérification de publication](https://github.com/helm/helm-www/blob/main/content/en/docs/community/release_checklist.md) si votre expérience diffère de ce qui est documenté ici.

Toutes les versions seront sous la forme vX.Y.Z où X est le numéro de version majeure, Y est le numéro de version mineure et Z est le numéro de correctif. Ce projet suit strictement [le versionnage sémantique](https://semver.org/), donc suivre cette étape est crucial.

Helm annonce à l'avance la date de sa prochaine version mineure. Tous les efforts doivent être faits pour respecter la date annoncée. De plus, au moment de commencer le processus de publication, la date de la prochaine version doit avoir été sélectionnée car elle sera utilisée dans le processus de publication.

Ces instructions couvriront la configuration initiale suivie du processus de publication pour trois types de versions différents :

* **Versions majeures** - publiées moins fréquemment - ont des changements incompatibles
* **Versions mineures** - publiées tous les 3 à 4 mois - sans changements incompatibles
* **Versions de correction** - publiées mensuellement - ne nécessitent pas toutes les étapes de ce guide

[Configuration Initiale](#configuration-initiale)

1. [Créer une branche de release](#1-créer-une-branche-de-release)
2. [Versions majeures/mineures : Modifier le numéro de version dans Git](#2-versions-majeuresmineures--modifier-le-numéro-de-version-dans-git)
3. [Versions majeures/mineures : Commiter et pousser la branche de version](#3-versions-majeuresmineures--commiter-et-pousser-la-branche-de-version)
4. [Version majeures/mineures : Créer une version candidate](#4-version-majeuresmineures--créer-une-version-candidate)
5. [Versions majeures/mineures : Itérer sur les candidats à la version successifs](#5-versions-majeuresmineures--itérer-sur-les-candidats-à-la-version-successifs)
6. [Finaliser la version](#6-finaliser-la-version)
7. [Rédiger les notes de version](#7-rédiger-les-notes-de-version)
8. [Signer les téléchargements avec PGP](#8-signer-les-téléchargements-avec-pgp)
9. [Publication d'une version](#9-publication-dune-version)
10. [Mettre à jour la documentation](#10-mettre-à-jour-la-documentation)
11. [Informer la communauté](#11-informer-la-communauté)

## Configuration Initiale

### Configurer le dépôt distant Git

Il est important de noter que ce document suppose que le dépôt distant Git dans votre référentiel correspondant à <https://github.com/helm/helm> est nommé "upstream". Si ce n'est pas le cas (par exemple, si vous avez choisi de le nommer "origin" ou quelque chose de similaire), assurez-vous d'ajuster les extraits listés en fonction de votre environnement local. Si vous n'êtes pas sûr du nom de votre dépôt distant "upstream", utilisez une commande comme `git remote -v` pour le découvrir.

Si vous n'avez pas de dépôt distant [upstream](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork), vous pouvez en ajouter un en utilisant une commande comme :

```shell
git remote add upstream git@github.com:helm/helm.git
```

### Configurer les variables d'environnement

Dans cet documentation, nous allons également faire référence à quelques variables d'environnement que vous pourriez vouloir définir pour plus de commodité. Pour les versions majeures/minor, utilisez les variables suivantes :

```shell
export RELEASE_NAME=vX.Y.0
export RELEASE_BRANCH_NAME="release-X.Y"
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.1"
```

Si vous créez une version de correctif, utilisez les variables suivantes à la place :

```shell
export PREVIOUS_PATCH_RELEASE=vX.Y.Z
export RELEASE_NAME=vX.Y.Z+1
export RELEASE_BRANCH_NAME="release-X.Y"
```

### Configurer la clé de signature

Nous allons également ajouter des mesures de sécurité et de vérification au processus de publication en hachant les binaires et en fournissant des fichiers de signature. Nous effectuons cela en utilisant [GitHub et GPG](https://help.github.com/en/articles/about-commit-signature-verification). Si vous n'avez pas encore configuré GPG, vous pouvez suivre ces étapes :

1. [Installer GPG](https://gnupg.org/index.html)
2. [Générer une clé GPG](https://help.github.com/en/articles/generating-a-new-gpg-key)
3. [Ajouter la clé à votre compte GitHub](https://help.github.com/en/articles/adding-a-new-gpg-key-to-your-github-account)
4. [Ajouter la clé de signature à Git](https://help.github.com/en/articles/telling-git-about-your-signing-key)

Une fois que vous avez une clé de signature, vous devez l'ajouter au fichier KEYS à la racine du dépôt. Les instructions pour l'ajouter au fichier KEYS sont présentes dans le fichier lui-même. Si vous ne l'avez pas encore fait, vous devez ajouter votre clé publique au réseau de serveurs de clés. Si vous utilisez GnuPG, vous pouvez suivre les [instructions fournies par Debian](https://debian-administration.org/article/451/Submitting_your_GPG_key_to_a_keyserver).

## 1. Créer une branche de release

### Version Majeures/Mineur

Les versions majeures sont destinées à l'ajout de nouvelles fonctionnalités et aux changements de comportement *qui cassent la compatibilité ascendante*. Les versions mineures concernent l'ajout de nouvelles fonctionnalités qui ne cassent pas la compatibilité ascendante. Pour créer une version majeure ou mineure, commencez par créer une branche `release-X.Y` à partir de `main`.

```shell
git fetch upstream
git checkout upstream/main
git checkout -b $RELEASE_BRANCH_NAME
```

Cette nouvelle branche servira de base pour la version, sur laquelle nous allons itérer par la suite.

Vérifiez qu'un [milestone helm/helm](https://github.com/helm/helm/milestones) pour la version existe sur GitHub (en le créant si nécessaire). Assurez-vous que les PRs et les issues pour cette version sont inclus dans ce milestone.

Pour les versions majeures et mineures, passez à l'étape 2 : [Versions majeures/minor : Changer le numéro de version dans Git](#2-versions-majeuresmineures--modifier-le-numéro-de-version-dans-git).

### Versions de correction

Les versions de correction sont quelques corrections critiques sélectionnées pour les versions existantes.  
Commencez par créer une branche `release-X.Y` :

```shell
git fetch upstream
git checkout -b $RELEASE_BRANCH_NAME upstream/$RELEASE_BRANCH_NAME
```

À partir de là, nous pouvons sélectionner les commits que nous souhaitons inclure dans la version de correction :

```shell
# get the commits ids we want to cherry-pick
git log --oneline
# cherry-pick the commits starting from the oldest one, without including merge commits
git cherry-pick -x <commit-id>
```

Après que les commits aient été sélectionnés, la branche de version doit être poussée.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

Pousser la branche déclenchera l'exécution des tests. Assurez-vous qu'ils passent avant de créer le tag. Ce nouveau tag servira de base pour la version de correction.

La création d'un [jalon Helm/helm](https://github.com/helm/helm/milestones) est facultative pour les versions de correction.

Assurez-vous de vérifier [GitHub Actions](https://github.com/helm/helm/actions) pour voir si la version a réussi les tests CI avant de continuer. Les versions de correction peuvent sauter les étapes 2 à 5 et passer directement à l'étape 6 pour [Finaliser la version](#6-finaliser-la-version).

## 2. Versions majeures/mineures : Modifier le numéro de version dans Git

Lors d'une version majeure ou mineure, assurez-vous de mettre à jour `internal/version/version.go` avec le nouveau numéro de version.

```shell
$ git diff internal/version/version.go
diff --git a/internal/version/version.go b/internal/version/version.go
index 712aae64..c1ed191e 100644
--- a/internal/version/version.go
+++ b/internal/version/version.go
@@ -30,7 +30,7 @@ var (
        // Increment major number for new feature additions and behavioral changes.
        // Increment minor number for bug fixes and performance enhancements.
        // Increment patch number for critical fixes to existing releases.
-       version = "v3.3"
+       version = "v3.4"

        // metadata is extra build time data
        metadata = ""
```

En plus de mettre à jour la version dans le fichier `version.go`, vous devrez également mettre à jour les tests correspondants utilisant ce numéro de version.

* `cmd/helm/testdata/output/version.txt`
* `cmd/helm/testdata/output/version-client.txt`
* `cmd/helm/testdata/output/version-client-shorthand.txt`
* `cmd/helm/testdata/output/version-short.txt`
* `cmd/helm/testdata/output/version-template.txt`
* `pkg/chartutil/capabilities_test.go`

```shell
git add .
git commit -m "bump version to $RELEASE_NAME"
```

Cela mettra à jour uniquement la branche `$RELEASE_BRANCH_NAME`. Vous devrez également intégrer ce changement dans la branche principale pour la création de la prochaine version, comme dans [cet exemple de 3.2 à 3.3](https://github.com/helm/helm/pull/8411/files), et l'ajouter au jalon pour la prochaine version.

```shell
# get the last commit id i.e. commit to bump the version
git log --format="%H" -n 1

# create new branch off main
git checkout main
git checkout -b bump-version-<release_version>

# cherry pick the commit using id from first command
git cherry-pick -x <commit-id>

# commit the change
git push origin bump-version-<release-version>
```

## 3. Versions majeures/mineures : Commiter et pousser la branche de version

Pour que les autres puissent commencer les tests, nous pouvons maintenant pousser la branche de version en amont et démarrer le processus de test.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

Assurez-vous de vérifier [GitHub Actions](https://github.com/helm/helm/actions) pour voir si la version a réussi les tests CI avant de continuer.

Si possible, demandez à d'autres personnes de faire une révision par les pairs de la branche avant de poursuivre, afin de garantir que toutes les modifications nécessaires ont été apportées et que tous les commits pour la version sont présents.

## 4. Version majeures/mineures : Créer une version candidate

Maintenant que la branche de version est prête, il est temps de commencer à créer et à itérer sur les candidats à la version.

```shell
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

GitHub Actions créera automatiquement une image de version taguée et un binaire client pour les tests.

Pour les testeurs, le processus pour commencer les tests après que GitHub Actions ait terminé la construction des artefacts comprend les étapes suivantes pour récupérer le client :

linux/amd64, utilisez /bin/bash:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-linux-amd64.tar.gz
```

darwin/amd64, utilisez Terminal.app:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-darwin-amd64.tar.gz
```

windows/amd64, utilisez PowerShell:

```shell
PS C:\> Invoke-WebRequest -Uri "https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-windows-amd64.tar.gz" -OutFile "helm-$ReleaseCandidateName-windows-amd64.tar.gz"
```

Ensuite, décompressez et déplacez le binaire dans un répertoire de votre `$PATH`, ou déplacez-le quelque part et ajoutez-le à votre `$PATH` (par exemple, `/usr/local/bin/helm` pour Linux/macOS, `C:\Program Files\helm\helm.exe` pour Windows).

## 5. Versions majeures/mineures : Itérer sur les candidats à la version successifs

Passez plusieurs jours à investir du temps et des ressources pour essayer de casser Helm de toutes les manières possibles, en documentant toutes les découvertes pertinentes pour la version. Ce temps doit être consacré aux tests et à la recherche de manières dont la version pourrait avoir causé des problèmes avec diverses fonctionnalités ou environnements de mise à niveau, et non au codage. Pendant cette période, la version est en gel de code, et toute modification supplémentaire du code sera repoussée à la prochaine version.

Pendant cette phase, la branche `$RELEASE_BRANCH_NAME` continuera d'évoluer à mesure que vous produirez de nouveaux candidats à la version. La fréquence des nouveaux candidats dépend du responsable de la version : utilisez votre meilleur jugement en tenant compte de la gravité des problèmes signalés, de la disponibilité des testeurs et de la date limite de la version. En général, il vaut mieux laisser une version dépasser la date limite que de publier une version défectueuse.

Chaque fois que vous souhaiterez produire un nouveau candidat à la version, vous commencerez par ajouter des commits à la branche en les sélectionnant depuis la branche principale :

```shell
git cherry-pick -x <commit_id>
```

Vous devrez également pousser la branche sur GitHub et vous assurer qu'elle passe les tests CI.

Ensuite, taguez-la et informez les utilisateurs du nouveau candidat à la version :

```shell
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.2"
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

Une fois poussée sur GitHub, vérifiez que la branche avec ce tag se construit correctement dans CI.

À partir de là, répétez simplement ce processus en testant en continu jusqu'à ce que vous soyez satisfait du candidat à la version. Pour un candidat à la version, nous ne rédigeons pas les notes complètes, mais vous pouvez esquisser quelques [notes de version](#7-rédiger-les-notes-de-version).

## 6. Finaliser la version

Lorsque vous êtes enfin satisfait de la qualité d'un candidat à la version, vous pouvez passer à la création de la version finale. Vérifiez une dernière fois pour vous assurer que tout est en ordre, puis poussez enfin le tag de version.

```shell
git checkout $RELEASE_BRANCH_NAME
git tag --sign --annotate "${RELEASE_NAME}" --message "Helm release ${RELEASE_NAME}"
git push upstream $RELEASE_NAME
```

Vérifiez que la version a réussi dans [GitHub Actions](https://github.com/helm/helm/actions). Si ce n'est pas le cas, vous devrez corriger la version et la pousser à nouveau.

Comme le job CI prendra un certain temps à s'exécuter, vous pouvez passer à la rédaction des notes de version pendant que vous attendez sa conclusion.

## 7. Rédiger les notes de version

Nous générerons automatiquement un changelog basé sur les commits effectués pendant un cycle de version, mais il est généralement plus bénéfique pour l'utilisateur final que les notes de version soient rédigées par un être humain, une équipe marketing ou un chien.

Si vous publiez une version majeure ou mineure, il suffit généralement de lister les fonctionnalités notables visibles par l'utilisateur. Pour les versions de correction, faites de même, mais indiquez les symptômes et les personnes concernées.

Les notes de version doivent inclure le numéro de version et la date prévue de la prochaine version.

Un exemple de note de version pour une version mineure serait le suivant :

```markdown
## vX.Y.Z

Helm vX.Y.Z is a feature release. This release, we focused on <insert focal point>. Users are encouraged to upgrade for the best experience.

The community keeps growing, and we'd love to see you there!

- Join the discussion in [Kubernetes Slack](https://kubernetes.slack.com):
  - `#helm-users` for questions and just to hang out
  - `#helm-dev` for discussing PRs, code, and bugs
- Hang out at the Public Developer Call: Thursday, 9:30 Pacific via [Zoom](https://zoom.us/j/696660622)
- Test, debug, and contribute charts: [Artifact Hub helm charts](https://artifacthub.io/packages/search?kind=0)

## Notable Changes

- Kubernetes 1.16 is now supported including new manifest apiVersions
- Sprig was upgraded to 2.22

## Installation and Upgrading

Download Helm X.Y. The common platform binaries are here:

- [MacOS amd64](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux amd64](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux arm](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz.sha256) / CHECKSUM_VAL)
- [Linux arm64](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux i386](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz.sha256) / CHECKSUM_VAL)
- [Linux ppc64le](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux s390x](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Windows amd64](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip) ([checksum](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip.sha256sum) / CHECKSUM_VAL)

The [Quickstart Guide](https://docs.helm.sh/using_helm/#quickstart-guide) will get you going from there. For **upgrade instructions** or detailed installation notes, check the [install guide](https://docs.helm.sh/using_helm/#installing-helm). You can also use a [script to install](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3) on any system with `bash`.

## What's Next

- vX.Y.Z+1 will contain only bug fixes and is planned for <insert DATE>.
- vX.Y+1.0 is the next feature release and is planned for <insert DATE>. This release will focus on ...

## Changelog

- chore(*): bump version to v2.7.0 08c1144f5eb3e3b636d9775617287cc26e53dba4 (Adam Reese)
- fix circle not building tags f4f932fabd197f7e6d608c8672b33a483b4b76fa (Matthew Fisher)
```

Un ensemble partiellement complété de notes de version, y compris le changelog, peut être créé en exécutant la commande suivante :

```shell
export VERSION="$RELEASE_NAME"
export PREVIOUS_RELEASE=vX.Y.Z
make clean
make fetch-dist
make release-notes
```

Cela créera un bon ensemble de notes de version de base auquel vous devrez simplement ajouter les sections **Changements notables** et **À venir**.

N'hésitez pas à personnaliser les notes de version ; il est agréable pour les gens de penser que nous ne sommes pas tous des robots.

Vous devez également vérifier que les URLs et les sommes de contrôle sont correctes dans les notes de version générées automatiquement.

Une fois terminé, allez sur GitHub dans [helm/helm releases](https://github.com/helm/helm/releases) et éditez les notes de version pour la version taguée avec les notes rédigées ici.
Pour la branche cible, définissez-la sur `$RELEASE_BRANCH_NAME`.

Il est maintenant utile de demander à d'autres personnes de jeter un œil aux notes de version avant la publication de la version. Envoyez une demande de révision à [#helm-dev](https://kubernetes.slack.com/messages/C51E88VDG). C'est toujours bénéfique car il est facile de passer à côté de quelque chose.

## 8. Signer les téléchargements avec PGP

Bien que les sommes de contrôle fournissent une signature confirmant que le contenu des téléchargements est bien celui attendu, les packages signés offrent une traçabilité sur l'origine du package.

Pour ce faire, exécutez les commandes `make` suivantes :

```shell
export VERSION="$RELEASE_NAME"
make clean		# if not already run
make fetch-dist	# if not already run
make sign
```

Cela générera des fichiers de signature en ASCII armé pour chacun des fichiers poussés par CI.

Tous les fichiers de signature (`*.asc`) doivent être téléchargés sur la version GitHub (joindre les binaires).

## 9. Publication d'une version

C'est le moment d'officialiser cette version !

Après avoir sauvegardé les notes de version sur GitHub, complété la construction CI et ajouté les fichiers de signature à la version, vous pouvez cliquer sur "Publier" pour publier la version. Cela la répertorie comme "latest" et affiche cette version sur la page d'accueil du dépôt [helm/helm](https://github.com/helm/helm).

## 10. Mettre à jour la documentation

La section des docs du site [Helm](https://helm.sh/docs) liste les versions de Helm pour la documentation. Les versions majeures, mineures et de correction doivent être mises à jour sur le site. La date de la prochaine version mineure est également publiée sur le site et doit être mise à jour.

Pour ce faire, créez une demande de tirage (pull request) contre le dépôt [helm-www](https://github.com/helm/helm-www). Dans le fichier `config.toml`, trouvez la section `params.versions` appropriée et mettez à jour la version de Helm, comme dans cet exemple de [mise à jour de la version actuelle](https://github.com/helm/helm-www/pull/676/files). Dans le même fichier `config.toml`, mettez également à jour la section `params.nextversion`.

Fermez le [jalon helm/helm](https://github.com/helm/helm/milestones) pour la version, si applicable.

Mettez à jour le [version skew](https://github.com/helm/helm-www/blob/main/content/en/docs/topics/version_skew.md) pour les versions majeures et mineures.

Mettez à jour le calendrier des versions [ici](https://helm.sh/calendar/release) :
* Créez une entrée pour la prochaine version mineure avec un rappel pour ce jour à 17h GMT.
* Créez une entrée pour le RC1 de la prochaine version mineure le lundi de la semaine précédant la version prévue, avec un rappel pour ce jour à 17h GMT.

## 11. Informer la communauté

Félicitations ! Vous avez terminé. Allez vous servir une $BOISSON_DE_VOTRE_CHOIX. Vous l'avez bien mérité.

Après avoir savouré une bonne $BOISSON_DE_VOTRE_CHOIX, annoncez la nouvelle version sur Slack et sur Twitter avec un lien vers la [version sur GitHub](https://github.com/helm/helm/releases).

Optionnellement, rédigez un article de blog sur la nouvelle version et mettez en avant certaines des nouvelles fonctionnalités !
