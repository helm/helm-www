---
title: "Procedencia e Integridad de Helm"
description: "Describe cómo verificar la integridad y el origen de un Chart."
sidebar_position: 5
---

Helm tiene herramientas de procedencia que ayudan a los usuarios de charts a
verificar la integridad y el origen de un paquete. Utilizando herramientas estándar
de la industria basadas en PKI, GnuPG y administradores de paquetes muy respetados,
Helm puede generar y verificar archivos de firmas.

## Descripción General

La integridad se establece comparando un chart con un registro de procedencia.
Los registros de procedencia se almacenan en _archivos de procedencia_, que se
almacenan junto con un chart empaquetado. Por ejemplo, si un chart se llama
`myapp-1.2.3.tgz`, su archivo de procedencia será `myapp-1.2.3.tgz.prov`.

Los archivos de procedencia se generan en el momento del empaquetado
(`helm package --sign ...`) y se pueden verificar mediante varios comandos,
en particular `helm install --verify`.

## El Flujo de Trabajo

Esta sección describe un flujo de trabajo potencial para utilizar los datos de
procedencia de manera eficaz.

Requisitos previos:

- Un par de claves PGP válido en formato binario (no blindado ASCII)
- La herramienta de línea de comandos `helm`
- Herramientas de línea de comandos de GnuPG (opcional)
- Herramientas de línea de comando de base de claves (opcional)

**NOTA:** Si su clave privada PGP tiene una frase de contraseña, se le pedirá que
ingrese esa frase de contraseña para cualquier comando que admita la opción `--sign`.

Crear un nuevo chart es el mismo que antes:

```console
$ helm create mychart
Creating mychart
```

Una vez que esté listo para empaquetar, agregue la marca `--sign` a `helm package`.
Además, especifique el nombre con el que se conoce la clave de firma y el anillo
de claves que contiene la clave privada correspondiente:

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**Nota:** El valor del argumento `--key` debe ser una subcadena del `uid` de la
clave deseada (en la salida de `gpg --list-keys`), por ejemplo, el nombre o el
correo electrónico. **La huella _no_ se puede utilizar.**

**SUGERENCIA:** para los usuarios de GnuPG, su anillo de claves secreto está en
`~ /.gnupg /secring.gpg`. Puede usar `gpg --list-secret-keys` para enumerar las
claves que tiene.

**Advertencia:** GnuPG v2 almacena su llavero secreto usando un nuevo formato
`kbx` en la ubicación predeterminada `~/.gnupg/pubring.kbx`. Utilice el siguiente
comando para convertir su llavero al formato gpg heredado:

```console
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

En este punto, debería ver tanto `mychart-0.1.0.tgz` como `mychart-0.1.0.tgz.prov`.
Finalmente, ambos archivos deberían cargarse en el repositorio de charts que desee.

Puede verificar un chart usando `helm verify`:

```console
$ helm verify mychart-0.1.0.tgz
```

Una verificación fallida se ve así:

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

Para verificar durante una instalación, use la bandera `--verify`.

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

Si el llavero que contiene la clave pública asociada con el chart firmado no se
encuentra en la ubicación predeterminada, es posible que deba señalar el llavero
con `--keyring PATH` como en el ejemplo de `helm package`.

Si la verificación falla, la instalación se cancelará antes de que el chart sea renderizado.

### Usando las credenciales de Keybase.io

El servicio [Keybase.io](https://keybase.io) facilita el establecimiento de una
cadena de confianza para una identidad criptográfica. Las credenciales de la base
de claves se pueden utilizar para firmar charts.

Requisitos previos:

- Una cuenta Keybase.io configurada
- GnuPG instalado localmente
- La CLI `keybase` instalada localmente

#### Firma de paquetes

El primer paso es importar las claves de la base de claves a su anillo de
claves GnuPG local:

```console
$ keybase pgp export -s | gpg --import
```

Esto convertirá su clave de Keybase al formato OpenPGP, y luego la importará
localmente en su archivo `~/.gnupg/secring.gpg`.

Puede comprobarlo ejecutando `gpg --list-secret-keys`.

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

Tenga en cuenta que su clave secreta tendrá una cadena de identificación:

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

Ese es el nombre completo de su clave.

A continuación, puede empaquetar y firmar un chart con `helm package`. Asegúrese
de utilizar al menos parte de esa cadena de nombre en `--key`.

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

Como resultado, el comando `package` debería producir tanto un archivo
`.tgz` como un archivo `.tgz.prov`.

#### Verificación de paquetes

También puede utilizar una técnica similar para verificar un chart firmado por
la clave de Keybase de otra persona. Supongamos que desea verificar un paquete
firmado por `keybase.io/technosophos`. Para hacer esto, use la herramienta `keybase`:

```console
$ keybase follow technosophos
$ keybase pgp pull
```

El primer comando de arriba rastrea al usuario `technosophos`. A continuación,
`keybase pgp pull` descarga las claves OpenPGP de todas las cuentas que sigue,
colocándolas en su anillo de claves GnuPG (`~/.gnupg/pubring.gpg`).

En este punto, ahora puede usar `helm verify` o cualquiera de los comandos con
una marca `--verify`:

```console
$ helm verify somechart-1.2.3.tgz
```

### Razones por las que un chart no puede verificar

Éstas son razones comunes de falla.

- Falta el archivo `.prov` o está dañado. Esto indica que algo está mal configurado
  o que el responsable de mantenimiento original no creó un archivo de procedencia.
- La clave utilizada para firmar el archivo no está en su llavero. Esto indica que
  la entidad que firmó el chart no es alguien a quien ya haya señalado que confía.
- Falló la verificación del archivo `.prov`. Esto indica que algo anda mal con
  el chart o con los datos de procedencia.
- Los hash de archivo en el archivo de procedencia no coinciden con el hash del
  archivo de almacenamiento. Esto indica que el archivo ha sido manipulado.

Si una verificación falla, hay motivos para desconfiar del paquete.

## El Archivo de Procedencia

El archivo de procedencia contiene un archivo YAML de un chart más varios datos
de verificación. Los archivos de procedencia están diseñados para generarse automáticamente.

Se agregan los siguientes datos de procedencia:

- El archivo de chart (`Chart.yaml`) se incluye para que tanto los humanos como
  las herramientas puedan ver fácilmente el contenido del chart.
- La firma (SHA256, al igual que Docker) del paquete de charts (el archivo `.tgz`)
  está incluida y puede usarse para verificar la integridad del paquete de charts.
- Todo el cuerpo está firmado utilizando el algoritmo utilizado por OpenPGP
  (consulte [Keybase.io](https://keybase.io) para conocer una forma emergente de
  facilitar la firma y verificación de cifrado).

La combinación de esto brinda a los usuarios las siguientes garantías:

- El paquete en sí no ha sido manipulado (suma de comprobación del paquete `.tgz`).
- Se conoce la entidad que liberó este paquete (a través de la firma GnuPG/PGP).

El formato del archivo se parece a esto:

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

Tenga en cuenta que la sección YAML contiene dos documentos (separados por `...\n`).
El primer archivo es el contenido de `Chart.yaml`. El segundo son las sumas de
comprobación, un mapa de nombres de archivo a resúmenes SHA-256 del contenido de
ese archivo en el momento del empaquetado.

El bloque de firma es una firma PGP estándar, que proporciona [resistencia a la
manipulación(https://www.rossde.com/PGP/pgp_signatures.html).

## Repositorios de Charts

Los repositorios de charts sirven como una colección centralizada de charts de Helm.

Los repositorios de charts deben permitir la entrega de archivos de procedencia
a través de HTTP a través de una solicitud específica, y deben hacerlos disponibles
en la misma ruta de URI que el chart.

Por ejemplo, si la URL base de un paquete es
`https://example.com/charts/mychart-1.2.3.tgz`, el archivo de procedencia,
si existe, DEBE ser accesible en `https://example.com/charts/mychart-1.2.3.tgz.prov`.

Desde la perspectiva del usuario final, `helm install --verify myrepo/mychart-1.2.3`
debería resultar en la descarga tanto del chart como del archivo de procedencia
sin configuración o acción adicional del usuario.

## Establecimiento de Autoridad y Autenticidad

Cuando se trata de sistemas de cadena de confianza, es importante poder establecer
la autoridad de un firmante. O, para decirlo claramente, el sistema anterior depende
del hecho de que usted confía en la persona que firmó el chart. Eso, a su vez,
significa que debe confiar en la clave pública del firmante.

Una de las decisiones de diseño de Helm ha sido que el proyecto Helm no se
insertará en la cadena de confianza como parte necesaria. No queremos ser
"la autoridad de certificación" para todos los firmantes de charts. En cambio,
estamos a favor de un modelo descentralizado, que es parte de la razón por la
que elegimos OpenPGP como nuestra tecnología fundamental. Entonces, cuando se
trata de establecer la autoridad, hemos dejado este paso más o menos indefinido
en Helm 2 (una decisión llevada a cabo en Helm 3).

Sin embargo, tenemos algunos consejos y recomendaciones para aquellos interesados
en utilizar el sistema de procedencia:

- La plataforma [Keybase](https://keybase.io) proporciona un repositorio público
  centralizado para información de confianza.
  - Puede utilizar Keybase para almacenar sus claves o para obtener las claves
    públicas de otros.
  - Keybase también tiene documentación fabulosa disponible
  - Si bien no lo hemos probado, la función de "sitio web seguro" de Keybase
    podría usarse para servir charts de Helm.
  - La idea básica es que un "revisor de charts" oficial firme los charts con
    su clave, y el archivo de procedencia resultante se carga en el repositorio
    de charts.
  - Se ha trabajado en la idea de que se pueda incluir una lista de claves de
    firmas válidas en el archivo `index.yaml` de un repositorio.

