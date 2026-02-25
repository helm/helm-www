---
title: Provenance et intégrité dans Helm
description: Décrit comment vérifier l'intégrité et l'origine d'un Chart.
sidebar_position: 5
---

Helm dispose d'outils de provenance qui aident les utilisateurs de charts à
vérifier l'intégrité et l'origine d'un package. Basé sur des outils standard de
l'industrie comme PKI, GnuPG et des gestionnaires de paquets reconnus, Helm peut
générer et vérifier des fichiers de signature.

## Vue d'ensemble

L'intégrité est établie en comparant un chart à un enregistrement de provenance.
Ces enregistrements sont stockés dans des _fichiers de provenance_, conservés aux
côtés du chart packageé. Par exemple, si un chart est nommé `myapp-1.2.3.tgz`,
son fichier de provenance sera `myapp-1.2.3.tgz.prov`.

Les fichiers de provenance sont générés lors du packaging (`helm package --sign ...`)
et peuvent être vérifiés par plusieurs commandes, notamment `helm install --verify`.

## Le flux de travail

Cette section décrit un flux de travail possible pour utiliser efficacement les
données de provenance.

Prérequis :

- Une paire de clés PGP valide au format binaire (pas au format ASCII-armored)
- L'outil en ligne de commande `helm`
- Les outils en ligne de commande GnuPG (optionnel)
- Les outils en ligne de commande Keybase (optionnel)

**NOTE :** Si votre clé privée PGP possède une phrase de passe, vous serez invité
à la saisir pour toute commande prenant en charge l'option `--sign`.

La création d'un nouveau chart se fait comme d'habitude :

```console
$ helm create mychart
Creating mychart
```

Lorsque vous êtes prêt à packager, ajoutez le drapeau `--sign` à `helm package`.
Spécifiez également le nom sous lequel la clé de signature est connue ainsi que
le trousseau de clés contenant la clé privée correspondante :

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**Note :** La valeur de l'argument `--key` doit être une sous-chaîne de l'`uid`
de la clé souhaitée (tel qu'affiché par `gpg --list-keys`), par exemple le nom ou
l'email. **L'empreinte _ne peut pas_ être utilisée.**

**ASTUCE :** Pour les utilisateurs de GnuPG, votre trousseau de clés secrètes se
trouve dans `~/.gnupg/secring.gpg`. Utilisez `gpg --list-secret-keys` pour lister
vos clés disponibles.

**Attention :** GnuPG v2 stocke votre trousseau de clés secrètes dans un nouveau
format `kbx` à l'emplacement par défaut `~/.gnupg/pubring.kbx`. Utilisez la
commande suivante pour convertir votre trousseau au format gpg historique :

```console
$ gpg --export >~/.gnupg/pubring.gpg
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

À ce stade, vous devriez voir à la fois `mychart-0.1.0.tgz` et
`mychart-0.1.0.tgz.prov`. Ces deux fichiers doivent ensuite être téléversés vers
votre dépôt de charts.

Vous pouvez vérifier un chart avec `helm verify` :

```console
$ helm verify mychart-0.1.0.tgz
```

Une vérification échouée ressemble à ceci :

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

Pour vérifier lors d'une installation, utilisez le drapeau `--verify`.

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

Si le trousseau de clés contenant la clé publique associée au chart signé n'est
pas à l'emplacement par défaut, vous devrez peut-être indiquer le trousseau avec
`--keyring PATH` comme dans l'exemple `helm package`.

Si la vérification échoue, l'installation sera annulée avant même que le chart
ne soit rendu.

### Utiliser les identifiants Keybase.io

Le service [Keybase.io](https://keybase.io) facilite l'établissement d'une chaîne
de confiance pour une identité cryptographique. Les identifiants Keybase peuvent
être utilisés pour signer des charts.

Prérequis :

- Un compte Keybase.io configuré
- GnuPG installé localement
- La CLI `keybase` installée localement

#### Signer des packages

La première étape consiste à importer vos clés Keybase dans votre trousseau
GnuPG local :

```console
$ keybase pgp export -s | gpg --import
```

Cela convertira votre clé Keybase au format OpenPGP, puis l'importera localement
dans votre fichier `~/.gnupg/secring.gpg`.

Vous pouvez vérifier en exécutant `gpg --list-secret-keys`.

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

Notez que votre clé secrète possède une chaîne d'identification :

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

C'est le nom complet de votre clé.

Ensuite, vous pouvez packager et signer un chart avec `helm package`. Assurez-vous
d'utiliser au moins une partie de cette chaîne de nom dans `--key`.

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

En résultat, la commande `package` produira à la fois un fichier `.tgz` et un
fichier `.tgz.prov`.

#### Vérifier des packages

Vous pouvez également utiliser une technique similaire pour vérifier un chart
signé avec la clé Keybase d'une autre personne. Supposons que vous souhaitiez
vérifier un package signé par `keybase.io/technosophos`. Utilisez l'outil
`keybase` :

```console
$ keybase follow technosophos
$ keybase pgp pull
```

La première commande suit l'utilisateur `technosophos`. Ensuite, `keybase pgp pull`
télécharge les clés OpenPGP de tous les comptes que vous suivez et les place dans
votre trousseau GnuPG (`~/.gnupg/pubring.gpg`).

À ce stade, vous pouvez utiliser `helm verify` ou n'importe quelle commande avec
le drapeau `--verify` :

```console
$ helm verify somechart-1.2.3.tgz
```

### Raisons pour lesquelles un chart peut ne pas être vérifié

Voici les raisons courantes d'échec.

- Le fichier `.prov` est manquant ou corrompu. Cela indique que quelque chose est
  mal configuré ou que le mainteneur original n'a pas créé de fichier de
  provenance.
- La clé utilisée pour signer le fichier n'est pas dans votre trousseau. Cela
  indique que l'entité qui a signé le chart n'est pas quelqu'un en qui vous avez
  déjà indiqué avoir confiance.
- La vérification du fichier `.prov` a échoué. Cela indique un problème avec le
  chart ou les données de provenance.
- Les hachages de fichiers dans le fichier de provenance ne correspondent pas au
  hachage du fichier d'archive. Cela indique que l'archive a été altérée.

Si une vérification échoue, il convient de se méfier du package.

## Le fichier de provenance

Le fichier de provenance contient le fichier YAML du chart ainsi que plusieurs
informations de vérification. Les fichiers de provenance sont conçus pour être
générés automatiquement.

Les données de provenance suivantes sont ajoutées :

* Le fichier du chart (`Chart.yaml`) est inclus pour donner aux humains et aux
  outils une vue claire du contenu du chart.
* La signature (SHA256, comme Docker) du package du chart (le fichier `.tgz`)
  est incluse et peut être utilisée pour vérifier l'intégrité du package.
* L'ensemble du corps est signé avec l'algorithme utilisé par OpenPGP (voir
  [Keybase.io](https://keybase.io) pour une méthode émergente de signature et de
  vérification cryptographiques simplifiées).

Cette combinaison donne aux utilisateurs les assurances suivantes :

* Le package lui-même n'a pas été altéré (somme de contrôle du package `.tgz`).
* L'entité qui a publié ce package est connue (via la signature GnuPG/PGP).

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

Notez que la section YAML contient deux documents (séparés par `...\n`). Le
premier est le contenu de `Chart.yaml`. Le second contient les sommes de
contrôle : une correspondance entre les noms de fichiers et les condensés SHA-256
du contenu de chaque fichier au moment du packaging.

Le bloc de signature est une signature PGP standard, qui fournit une [résistance
à l'altération](https://www.rossde.com/PGP/pgp_signatures.html).

## Dépôts de charts

Les dépôts de charts constituent une collection centralisée de charts Helm.

Les dépôts de charts doivent permettre de servir les fichiers de provenance via
HTTP par une requête spécifique, et doivent les rendre disponibles au même chemin
URI que le chart.

Par exemple, si l'URL de base d'un package est
`https://example.com/charts/mychart-1.2.3.tgz`, le fichier de provenance, s'il
existe, DOIT être accessible à
`https://example.com/charts/mychart-1.2.3.tgz.prov`.

Du point de vue de l'utilisateur final, `helm install --verify myrepo/mychart-1.2.3`
doit entraîner le téléchargement du chart et du fichier de provenance sans
configuration ni action supplémentaire de l'utilisateur.

### Signatures dans les registres basés sur OCI

Lors de la publication de charts vers un [registre basé sur OCI](/topics/registries.md),
le [plugin `helm-sigstore`](https://github.com/sigstore/helm-sigstore/) peut être
utilisé pour publier la provenance sur [sigstore](https://sigstore.dev/). [Comme
décrit dans la documentation](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md),
le processus de création de provenance et de signature avec une clé GPG est
commun, mais la commande `helm sigstore upload` peut être utilisée pour publier
la provenance vers un journal de transparence immuable.

## Établir l'autorité et l'authenticité

Dans les systèmes basés sur une chaîne de confiance, il est important de pouvoir
établir l'autorité d'un signataire. Autrement dit, le système ci-dessus repose
sur le fait que vous faites confiance à la personne qui a signé le chart. Ce qui
implique que vous devez faire confiance à la clé publique du signataire.

L'une des décisions de conception de Helm a été de ne pas s'insérer dans la
chaîne de confiance en tant que partie nécessaire. Nous ne voulons pas être
« l'autorité de certification » pour tous les signataires de charts. Nous
privilégions un modèle décentralisé, ce qui explique notre choix d'OpenPGP comme
technologie de base. Concernant l'établissement de l'autorité, nous avons laissé
cette étape relativement indéfinie dans Helm 2 (décision reprise dans Helm 3).

Cependant, voici quelques conseils et recommandations pour ceux qui souhaitent
utiliser le système de provenance :

- La plateforme [Keybase](https://keybase.io) fournit un dépôt public centralisé
  pour les informations de confiance.
  - Vous pouvez utiliser Keybase pour stocker vos clés ou obtenir les clés
    publiques d'autres personnes.
  - Keybase dispose également d'une excellente documentation.
  - Bien que nous ne l'ayons pas testé, la fonctionnalité « site web sécurisé »
    de Keybase pourrait être utilisée pour servir des charts Helm.
  - L'idée de base est qu'un « réviseur de charts » officiel signe les charts
    avec sa clé, et le fichier de provenance résultant est ensuite téléversé
    vers le dépôt de charts.
  - Des travaux ont été menés sur l'idée qu'une liste de clés de signature
    valides pourrait être incluse dans le fichier `index.yaml` d'un dépôt.
