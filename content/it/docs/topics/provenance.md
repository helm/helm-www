---
title: "Provenienza e integrità di Helm"
description: "Descrive come verificare l'integrità e l'origine di un chart."
aliases: ["/docs/provenance/"]
weight: 5
---

Helm dispone di strumenti di provenienza che aiutano gli utenti dei chart a verificare l'integrità e l'origine di un pacchetto. 
Utilizzando strumenti standard del settore basati su PKI, GnuPG e gestori di pacchetti ben noti, Helm è in grado di generare e verificare i file di firma.

## Panoramica

L'integrità viene stabilita confrontando un chart con un record di provenienza. I record di provenienza
sono memorizzati in _file di provenienza_, che vengono memorizzati insieme a un chart impacchettato. Per esempio, se un chart è chiamato `myapp-1.2.3.tgz`, il suo file di provenienza
sarà `myapp-1.2.3.tgz.prov`.

I file di provenienza sono generati al momento dell'impacchettamento (`helm package --sign ...`),
e possono essere controllati da più comandi, in particolare `helm install --verify`.

## Il flusso di lavoro

Questa sezione descrive un potenziale flusso di lavoro per utilizzare i dati di provenienza in modo efficace.

Prerequisiti:

- Una coppia di chiavi PGP valida in un formato binario (non in formato ASCII)
- Lo strumento a riga di comando `helm`
- Strumenti a riga di comando GnuPG (opzionale)
- Strumenti a riga di comando Keybase (opzionale)

**NOTA:** Se la vostra chiave privata PGP ha una passphrase, vi sarà richiesto di
 inserire tale passphrase per tutti i comandi che supportano l'opzione `--sign'.

La creazione di un nuovo chart è identica a quella precedente:

```console
$ helm create mychart
Creating mychart
```

Una volta pronti per l'impacchettamento, aggiungere il flag `-sign' a `helm package'. Inoltre, specificare il nome con cui è conosciuta la chiave di firma e il portachiavi che contiene la
corrispondente chiave privata:

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**Nota:** Il valore dell'argomento `--key` deve essere una sottostringa del `uid` 
della chiave desiderata (nell'output di `gpg --list-keys`), ad esempio il nome o l'email. **L'impronta digitale non può essere usata.**

**TIP:** per gli utenti di GnuPG, il portachiavi segreto si trova in `~/.gnupg/secring.gpg`. È possibile
usare `gpg --list-secret-keys` per elencare le chiavi in proprio possesso.

**Attenzione:** GnuPG v2 memorizza il portachiavi segreto usando un nuovo formato `kbx`nel percorso predefinito `~/.gnupg/pubring.kbx`. Utilizzare il seguente comando
per convertire il portachiavi nel formato gpg tradizionale:

```console
$ gpg --export >~/.gnupg/pubring.gpg
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

A questo punto, si dovrebbero vedere sia `mychart-0.1.0.tgz` che 
`mychart-0.1.0.tgz.prov`. Entrambi i file dovrebbero essere caricati nel repository desiderato.

È possibile verificare un chart usando `helm verify`:

```console
$ helm verify mychart-0.1.0.tgz
```

Una verifica fallita si presenta così:

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

Per verificare durante un'installazione, usare il flag `--verify`.

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

Se il portachiavi contenente la chiave pubblica associata al grafico firmato non si trova nella posizione predefinita, potrebbe essere necessario indicare il portachiavi con `--keyring PATH` come nell'esempio del pacchetto `helm`.

Se la verifica fallisce, l'installazione verrà interrotta prima che il chart venga
renderizzato.

### Utilizzo delle credenziali di Keybase.io

Il servizio [Keybase.io](https://keybase.io) semplifica la creazione di una catena di fiducia per un'identità crittografica. Le credenziali di Keybase possono essere usate per firmare
chart.

Prerequisiti:

- Un account Keybase.io configurato
- GnuPG installato localmente
- La CLI `keybase` installata localmente

#### Firmare i pacchetti

Il primo passo è importare le chiavi del keybase nel portachiavi GnuPG locale:

```console
$ keybase pgp export -s | gpg --import
```

Questo convertirà la vostra chiave Keybase nel formato OpenPGP, e poi la importerà
localmente nel file `~/.gnupg/secring.gpg`.

Si può verificare eseguendo `gpg --list-secret-keys`.

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

Si noti che la chiave segreta avrà una stringa identificativa:

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

Questo è il nome completo della chiave.

Successivamente, si può impacchettare e firmare un chart con `helm package`. Assicuratevi di usare almeno
 una parte di questi nomi in `--key`.

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

Di conseguenza, il comando `package` dovrebbe produrre sia un file `.tgz` che un file `.tgz.prov`.

#### Verifica dei pacchetti

È possibile utilizzare una tecnica simile anche per verificare un chart firmato con la chiave
Keybase di qualcun altro. Supponiamo di voler verificare un pacchetto firmato da
`keybase.io/technosophos`. Per farlo, utilizzate lo strumento `keybase`:

```console
$ keybase follow technosophos
$ keybase pgp pull
```

Il primo comando qui sopra traccia l'utente `technosophos`. Successivamente `keybase pgp pull`
scarica le chiavi OpenPGP di tutti gli account che si seguono, inserendole nel proprio portachiavi GnuPG (`~/.gnupg/pubring.gpg`).

A questo punto, è possibile utilizzare `helm verify` o uno qualsiasi dei comandi con il flag
`--verify`:

```console
$ helm verify somechart-1.2.3.tgz
```

### Motivi per cui un chart non può essere verificato

Queste sono le ragioni più comuni del fallimento.

- Il file `.prov' è mancante o corrotto. Questo indica che qualcosa è
  configurato male o che il manteiner originale non ha creato un file di provenienza.
- La chiave usata per firmare il file non è presente nel portachiavi. Questo indica che l'entità che ha firmato il chart non è qualcuno di cui avete già segnalato la fiducia.
- La verifica del file `.prov` non è riuscita. Questo indica che c'è qualcosa di
  sbagliato nel chart o nei dati di provenienza.
- Gli hash dei file nel file di provenienza non corrispondono all'hash del file 
  dell'archivio. Ciò indica che l'archivio è stato manomesso.

Se la verifica fallisce, c'è motivo di diffidare del pacchetto.

## Il file di provenienza

Il file di provenienza contiene il file YAML di un chart e diverse informazioni di verifica. I file di provenienza sono progettati per essere
generati automaticamente.

Vengono aggiunti i seguenti dati di provenienza:

* Il file del chart (`Chart.yaml`) è incluso per dare sia all'uomo che agli strumenti una facile visione del contenuto del chart.
* La firma (SHA256, proprio come Docker) del pacchetto del chart (il file `.tgz`) è inclusa e può essere usata per verificare l'integrità del pacchetto chart.  
* L'intero corpo del file è firmato con l'algoritmo usato da OpenPGP (vedi
  [Keybase.io](https://keybase.io) per un modo emergente di rendere semplice la firma crittografica e la verifica).

La combinazione di questi elementi fornisce agli utenti le seguenti garanzie:

* Il pacchetto stesso non è stato manomesso (checksum del pacchetto `.tgz`).
* L'entità che ha rilasciato il pacchetto è nota (tramite la firma GnuPG/PGP).

Il formato del file è simile a questo:

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

Si noti che la sezione YAML contiene due documenti (separati da `...\n`). Il primo file è il contenuto di `Chart.yaml`.Il secondo è il checksum, una mappa di
nomi di file e digest SHA-256 del contenuto di quel file al momento del packaging.

Il blocco della firma è una firma PGP standard, che fornisce [resistenza alla manomissione](https://www.rossde.com/PGP/pgp_signatures.html).

## Chart Repositories

I chart repository servono come raccolta centralizzata dei chart Helm.

I chart repository devono consentire di fornire i file di provenienza via HTTP tramite una
una richiesta specifica e devono renderli disponibili nello stesso percorso URI del chart.

Ad esempio, se l'URL di base di un pacchetto è`https://example.com/charts/mychart-1.2.3.tgz`, il file di provenienza, se esiste, DEVE essere accessibile all'indirizzo
`https://example.com/charts/mychart-1.2.3.tgz.prov`.

Dal punto di vista dell'utente finale, `helm install --verify myrepo/mychart-1.2.3`
dovrebbe portare al download sia del chart che del file di provenienza, senza alcuna
configurazione o azione aggiuntiva da parte dell'utente.

### Firme nei registri basati su OCI

Se si pubblicano charts in un [registro basato su OCI]({{< ref "registries.md" >}}), si può usare il
[plugin `helm-sigstore`](https://github.com/sigstore/helm-sigstore/)  
per pubblicare la provenienza su [sigstore](https://sigstore.dev/).
[Come descritto nella documentazione](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md), il processo di creazione della provenienza e di firma con una chiave GPG sono comuni, ma il comando `helm sigstore upload` può essere usato per pubblicare la provenienza in un registro di trasparenza immutabile.

## Stabilire autorità e autenticità

Quando si ha a che fare con i sistemi a catena di fiducia, è importante essere in grado di
stabilire l'autorità di un firmatario. O, per dirla in parole povere, il sistema di cui sopra
si basa sul fatto che ci si fida della persona che ha firmato il chart. Questo, a sua volta significa che bisogna fidarsi della chiave pubblica del firmatario.

Una delle decisioni progettuali di Helm è stata quella di non inserirsi nella catena di fiducia come una parte necessaria. 
Non vogliamo essere
"l'autorità di certificazione" per tutti i firmatari di chart. Al contrario, siamo decisamente favorevoli a un modello decentralizzato, e questo è uno dei motivi per cui abbiamo scelto OpenPGP come
tecnologia di base. Quindi, quando si tratta di stabilire l'autorità, abbiamo
 lasciato questo passo più o meno indefinito in Helm 2 (una decisione portata avanti in
Helm 3).

Tuttavia, abbiamo alcune indicazioni e raccomandazioni per coloro che sono interessati a utilizzare
il sistema di provenienza:

- La piattaforma [Keybase](https://keybase.io) fornisce un archivio pubblico centralizzato per le informazioni sulla fiducia.
  
- È possibile utilizzare Keybase per memorizzare le proprie chiavi o per ottenere le chiavi pubbliche di altri.
- Keybase ha anche una favolosa documentazione disponibile
- Anche se non l'abbiamo testata, la funzione "sito web sicuro" di Keybase potrebbe essere usata
    per fornire i chart di Helm.
- L'idea di base è che un "revisore di chart" ufficiale firmi i chart con la sua chiave e il file di provenienza risultante venga caricato nel chart repository.
- Si è lavorato sull'idea che un elenco di chiavi di firma valide possa essere incluso nel file `index.yaml` di un repository.