---
title: "Authenticité et Intégrité de Helm"
description: "Décrit comment vérifier l'intégrité et l'origine d'un chart"
weight: 5
---

Helm dispose d'outils d'authenticité qui aident les utilisateurs de charts à vérifier l'intégrité et l'origine d'un package. En utilisant des outils standards de l'industrie basés sur PKI, GnuPG et des gestionnaires de packages reconnus, Helm peut générer et vérifier des fichiers de signature.

## Aperçu

L'intégrité est établie en comparant un chart à un enregistrement d'authenticité. Les enregistrements d'authenticité sont stockés dans des _fichiers de provenance_, qui sont enregistrés aux côtés d'un chart empaqueté. Par exemple, si un chart s'appelle `myapp-1.2.3.tgz`, son fichier de provenance sera `myapp-1.2.3.tgz.prov`.

Les fichiers de provenance sont générés au moment de l'empaquetage (`helm package --sign ...`) et peuvent être vérifiés par plusieurs commandes, notamment `helm install --verify`.

## Le Flux de Travail

Cette section décrit un flux de travail possible pour utiliser efficacement les données d'authenticité.

Prérequis :

- Une paire de clés PGP valide au format binaire (pas en ASCII armé)
- L'outil en ligne de commande `helm`
- Outils en ligne de commande GnuPG (optionnel)
- Outils en ligne de commande Keybase (optionnel)

**REMARQUE :** Si votre clé privée PGP est protégée par une phrase de passe, vous serez invité à entrer cette phrase pour toute commande qui prend en charge l'option `--sign`.

Créer un nouveau chart :

```console
$ helm create mychart
Creating mychart
```

Une fois prêt à empaqueter, ajoutez l'argument `--sign` à `helm package`. Spécifiez également le nom sous lequel la clé de signature est connue et le trousseau de clés contenant la clé privée correspondante :

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**Remarque :** La valeur de l'argument `--key` doit être une sous-chaîne de l'`uid` de la clé souhaitée (dans la sortie de `gpg --list-keys`), par exemple le nom ou l'e-mail. **L'empreinte digitale _ne peut pas_ être utilisée.**

**CONSEIL :** Pour les utilisateurs de GnuPG, votre trousseau de clés secrètes se trouve dans `~/.gnupg/secring.gpg`. Vous pouvez utiliser `gpg --list-secret-keys` pour lister les clés dont vous disposez.

**Avertissement :** GnuPG v2 stocke votre trousseau de clés secrètes dans un nouveau format `kbx` à l'emplacement par défaut `~/.gnupg/pubring.kbx`. Veuillez utiliser la commande suivante pour convertir votre trousseau de clés au format GPG traditionnel :

```console
$ gpg --export >~/.gnupg/pubring.gpg
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

À ce stade, vous devriez voir à la fois `mychart-0.1.0.tgz` et `mychart-0.1.0.tgz.prov`. Les deux fichiers doivent finalement être téléchargés dans le dépôt de charts de votre choix.

Vous pouvez vérifier un chart en utilisant `helm verify` :

```console
$ helm verify mychart-0.1.0.tgz
```

Une vérification échouée ressemblera à ça :

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

Pour vérifier lors de l'installation, utilisez l'argument `--verify`.

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

Si le trousseau de clés contenant la clé publique associée au chart signé n'est pas à l'emplacement par défaut, vous devrez peut-être indiquer le trousseau de clés avec `--keyring PATH`, comme dans l'exemple de `helm package`.

Si la vérification échoue, l'installation sera annulée avant même que le chart ne soit rendu.

### Utilisation des identifiants Keybase.io

Le service [Keybase.io](https://keybase.io) facilite l'établissement d'une chaîne de confiance pour une identité cryptographique. Les identifiants Keybase peuvent être utilisés pour signer des charts.

Prérequis :

- Un compte Keybase.io configuré
- GnuPG installé localement
- L'outil en ligne de commande `keybase` installé localement

#### Signature des packages

La première étape est d'importer vos clés Keybase dans votre trousseau de clés GnuPG local :

```console
$ keybase pgp export -s | gpg --import
```

Cela convertira votre clé Keybase au format OpenPGP, puis l'importera localement dans votre fichier `~/.gnupg/secring.gpg`.

Vous pouvez vérifier en exécutant `gpg --list-secret-keys`.

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

Notez que votre clé secrète aura une chaîne d'identifiant :

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

C'est le nom complet de votre clé.

Ensuite, vous pouvez empaqueter et signer un chart avec `helm package`. Assurez-vous d'utiliser au moins une partie de cette chaîne de nom dans `--key`.

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

En conséquence, la commande `package` devrait produire à la fois un fichier `.tgz` et un fichier `.tgz.prov`.

#### Vérification des packages

Vous pouvez également utiliser une technique similaire pour vérifier un chart signé avec la clé Keybase d'une autre personne. Supposons que vous souhaitiez vérifier un package signé par `keybase.io/technosophos`. Pour ce faire, utilisez l'outil `keybase` :

```console
$ keybase follow technosophos
$ keybase pgp pull
```

La première commande ci-dessus suit l'utilisateur `technosophos`. Ensuite, `keybase pgp pull` télécharge les clés OpenPGP de tous les comptes que vous suivez, les plaçant dans votre trousseau de clés GnuPG (`~/.gnupg/pubring.gpg`).

À ce stade, vous pouvez maintenant utiliser `helm verify` ou toute autre commande avec un argument `--verify` :

```console
$ helm verify somechart-1.2.3.tgz
```

### Raisons pour lesquelles un chart peut ne pas être vérifié

Voici les raisons courantes d'échec :

- Le fichier `.prov` est manquant ou corrompu. Cela indique qu'il y a une mauvaise configuration ou que le mainteneur original n'a pas créé de fichier de provenance.
- La clé utilisée pour signer le fichier n'est pas dans votre trousseau de clés. Cela indique que l'entité ayant signé le chart n'est pas quelqu'un que vous avez déjà signalé comme fiable.
- La vérification du fichier `.prov` a échoué. Cela indique qu'il y a un problème soit avec le chart, soit avec les données de provenance.
- Les hashs des fichiers dans le fichier de provenance ne correspondent pas au hash du fichier d'archive. Cela indique que l'archive a été modifiée.

Si une vérification échoue, il y a des raisons de ne pas faire confiance au package.

## Le Fichier de Provenance

Le fichier de provenance contient le fichier YAML d'un chart ainsi que plusieurs éléments d'information pour la vérification. Les fichiers de provenance sont conçus pour être générés automatiquement.

Les éléments suivants sont ajoutés aux données de provenance :

* Le fichier de chart (`Chart.yaml`) est inclus pour offrir aux utilisateurs et aux outils une vue facile sur le contenu du chart.
* La signature (SHA256, comme pour Docker) du package de chart (le fichier `.tgz`) est incluse et peut être utilisée pour vérifier l'intégrité du package de chart.
* L'ensemble du corps est signé en utilisant l'algorithme utilisé par OpenPGP (voir [Keybase.io](https://keybase.io) pour une méthode émergente facilitant la signature et la vérification cryptographiques).

La combinaison de ces éléments donne aux utilisateurs les assurances suivantes :

* Le package lui-même n'a pas été modifié (checksum du package `.tgz`).
* L'entité ayant publié ce package est connue (via la signature GnuPG/PGP).

Le format du fichier ressemble à ceci :

```
Hash: SHA512

apiVersion: v2
appVersion: "1.16.0"
description: Sample chart
name: mychart
type: application
version: 0.1.0

...
files:
  mychart-0.1.0.tgz: sha256:d31d2f08b885ec696c37c7f7ef106709aaf5e8575b6d3dc5d52112ed29a9cb92
-----BEGIN PGP SIGNATURE-----

wsBcBAEBCgAQBQJdy0ReCRCEO7+YH8GHYgAAfhUIADx3pHHLLINv0MFkiEYpX/Kd
nvHFBNps7hXqSocsg0a9Fi1LRAc3OpVh3knjPfHNGOy8+xOdhbqpdnB+5ty8YopI
mYMWp6cP/Mwpkt7/gP1ecWFMevicbaFH5AmJCBihBaKJE4R1IX49/wTIaLKiWkv2
cR64bmZruQPSW83UTNULtdD7kuTZXeAdTMjAK0NECsCz9/eK5AFggP4CDf7r2zNi
hZsNrzloIlBZlGGns6mUOTO42J/+JojnOLIhI3Psd0HBD2bTlsm/rSfty4yZUs7D
qtgooNdohoyGSzR5oapd7fEvauRQswJxOA0m0V+u9/eyLR0+JcYB8Udi1prnWf8=
=aHfz
-----END PGP SIGNATURE-----
```

Notez que la section YAML contient deux documents (séparés par `...\n`). Le premier document est le contenu de `Chart.yaml`. Le second document est constitué des checksums, une map des noms de fichiers aux résumés SHA-256 du contenu de ces fichiers au moment de l'empaquetage.

Le bloc de signature est une signature PGP standard, qui offre une [résistance à la falsification](https://www.rossde.com/PGP/pgp_signatures.html).

## Dépôts de Charts

Les dépôts de charts servent de collection centralisée de charts Helm.

Les dépôts de charts doivent permettre de servir les fichiers de provenance via HTTP à l'aide d'une requête spécifique, et doivent les rendre disponibles au même chemin URI que le chart.

Par exemple, si l'URL de base pour un package est `https://example.com/charts/mychart-1.2.3.tgz`, le fichier de provenance, s'il existe, DOIT être accessible à `https://example.com/charts/mychart-1.2.3.tgz.prov`.

Du point de vue de l'utilisateur final, la commande `helm install --verify myrepo/mychart-1.2.3` devrait entraîner le téléchargement à la fois du chart et du fichier de provenance, sans configuration ou action supplémentaire de l'utilisateur.

### Signatures dans les registres basés sur OCI

Lors de la publication de charts dans un [registre basé sur OCI]({{< ref "/docs/topics/registries.md" >}}), le [plugin `helm-sigstore`](https://github.com/sigstore/helm-sigstore/) peut être utilisé pour publier les informations de provenance sur [sigstore](https://sigstore.dev/). [Comme décrit dans la documentation](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md), le processus de création de provenance et de signature avec une clé GPG est similaire, mais la commande `helm sigstore upload` peut être utilisée pour publier la provenance sur un registre d'immuabilité transparent.

## Établir l'Autorité et l'Authenticité

Lorsqu'on traite des systèmes de chaîne de confiance, il est important de pouvoir établir l'autorité d'un signataire. Autrement dit, le système repose sur le fait que vous faites confiance à la personne qui a signé le chart. Cela signifie, à son tour, que vous devez faire confiance à la clé publique du signataire.

L'une des décisions de conception de Helm a été que le projet Helm ne s'insérerait pas dans la chaîne de confiance en tant que partie nécessaire. Nous ne voulons pas être "l'autorité de certification" pour tous les signataires de charts. Au lieu de cela, nous privilégions fortement un modèle décentralisé, ce qui est en partie la raison pour laquelle nous avons choisi OpenPGP comme technologie de base. Ainsi, en ce qui concerne l'établissement de l'autorité, nous avons laissé cette étape plus ou moins indéfinie dans Helm 2 (une décision maintenue dans Helm 3).

Cependant, nous avons quelques indications et recommandations pour ceux qui souhaitent utiliser le système de provenance :

- La plateforme [Keybase](https://keybase.io) fournit un dépôt public centralisé pour les informations de confiance.
  - Vous pouvez utiliser Keybase pour stocker vos clés ou obtenir les clés publiques des autres.
  - Keybase dispose également d'une documentation excellente.
  - Bien que nous ne l'ayons pas testé, la fonctionnalité de "site web sécurisé" de Keybase pourrait être utilisée pour servir des charts Helm.
  - L'idée de base est qu'un "examinateur de charts" officiel signe les charts avec sa clé, et le fichier de provenance résultant est ensuite téléchargé dans le dépôt de charts.
  - Il y a eu des travaux sur l'idée qu'une liste de clés de signature valides pourrait être incluse dans le fichier `index.yaml` d'un dépôt.
