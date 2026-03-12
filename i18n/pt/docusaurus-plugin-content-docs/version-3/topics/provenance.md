---
title: Proveniência e Integridade do Helm
description: Descreve como verificar a integridade e origem de um Chart.
sidebar_position: 5
---

O Helm possui ferramentas de proveniência que ajudam os usuários de charts a verificar a integridade e origem de um pacote. Usando ferramentas padrão da indústria baseadas em PKI, GnuPG e gerenciadores de pacotes bem conceituados, o Helm pode gerar e verificar arquivos de assinatura.

## Visão Geral

A integridade é estabelecida comparando um chart com um registro de proveniência. Os registros de proveniência são armazenados em _arquivos de proveniência_, que ficam junto ao chart empacotado. Por exemplo, se um chart se chama `myapp-1.2.3.tgz`, seu arquivo de proveniência será `myapp-1.2.3.tgz.prov`.

Os arquivos de proveniência são gerados no momento do empacotamento (`helm package --sign ...`) e podem ser verificados por vários comandos, principalmente `helm install --verify`.

## O Fluxo de Trabalho

Esta seção descreve um fluxo de trabalho potencial para usar dados de proveniência de forma eficaz.

Pré-requisitos:

- Um par de chaves PGP válido em formato binário (não ASCII-armored)
- A ferramenta de linha de comando `helm`
- Ferramentas de linha de comando GnuPG (opcional)
- Ferramentas de linha de comando Keybase (opcional)

**NOTA:** Se sua chave privada PGP possui uma passphrase, você será solicitado a digitá-la para qualquer comando que suporte a opção `--sign`.

Criar um novo chart é igual a antes:

```console
$ helm create mychart
Creating mychart
```

Quando estiver pronto para empacotar, adicione a flag `--sign` ao `helm package`. Especifique também o nome sob o qual a chave de assinatura é conhecida e o keyring (chaveiro) contendo a chave privada correspondente:

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**Nota:** O valor do argumento `--key` deve ser uma substring do `uid` da chave desejada (na saída de `gpg --list-keys`), por exemplo o nome ou email. **A impressão digital _não pode_ ser usada.**

**DICA:** para usuários GnuPG, seu keyring secreto está em `~/.gnupg/secring.gpg`. Você pode usar `gpg --list-secret-keys` para listar as chaves que possui.

**Aviso:** o GnuPG v2 armazena seu keyring secreto usando um novo formato `kbx` no local padrão `~/.gnupg/pubring.kbx`. Por favor, use o seguinte comando para converter seu keyring para o formato gpg legado:

```console
$ gpg --export >~/.gnupg/pubring.gpg
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

Neste ponto, você deve ver tanto `mychart-0.1.0.tgz` quanto `mychart-0.1.0.tgz.prov`. Ambos os arquivos devem eventualmente ser enviados para o repositório de charts desejado.

Você pode verificar um chart usando `helm verify`:

```console
$ helm verify mychart-0.1.0.tgz
```

Uma verificação com falha aparece assim:

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

Para verificar durante uma instalação, use a flag `--verify`.

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

Se o keyring contendo a chave pública associada ao chart assinado não estiver no local padrão, você pode precisar apontar para o keyring com `--keyring PATH` como no exemplo do `helm package`.

Se a verificação falhar, a instalação será abortada antes mesmo do chart ser renderizado.

### Usando credenciais do Keybase.io

O serviço [Keybase.io](https://keybase.io) facilita o estabelecimento de uma cadeia de confiança para uma identidade criptográfica. As credenciais do Keybase podem ser usadas para assinar charts.

Pré-requisitos:

- Uma conta Keybase.io configurada
- GnuPG instalado localmente
- A CLI `keybase` instalada localmente

#### Assinando pacotes

O primeiro passo é importar suas chaves Keybase para seu keyring GnuPG local:

```console
$ keybase pgp export -s | gpg --import
```

Este comando converte sua chave Keybase para o formato OpenPGP e a importa para o arquivo local `~/.gnupg/secring.gpg`.

Você pode verificar executando `gpg --list-secret-keys`.

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

Note que sua chave secreta terá uma string identificadora:

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

Esse é o nome completo da sua chave.

Em seguida, você pode empacotar e assinar um chart com `helm package`. Certifique-se de usar pelo menos parte dessa string de nome em `--key`.

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

Como resultado, o comando `package` deve produzir tanto um arquivo `.tgz` quanto um arquivo `.tgz.prov`.

#### Verificando pacotes

Você também pode usar uma técnica similar para verificar um chart assinado pela chave Keybase de outra pessoa. Digamos que você quer verificar um pacote assinado por `keybase.io/technosophos`. Para fazer isso, use a ferramenta `keybase`:

```console
$ keybase follow technosophos
$ keybase pgp pull
```

O primeiro comando acima rastreia o usuário `technosophos`. Em seguida, `keybase pgp pull` baixa as chaves OpenPGP de todas as contas que você segue, colocando-as no seu keyring GnuPG (`~/.gnupg/pubring.gpg`).

Neste ponto, você agora pode usar `helm verify` ou qualquer um dos comandos com a flag `--verify`:

```console
$ helm verify somechart-1.2.3.tgz
```

### Razões pelas quais um chart pode não ser verificado

Estas são razões comuns para falha.

- O arquivo `.prov` está faltando ou corrompido. Isso indica que algo está mal configurado ou que o mantenedor original não criou um arquivo de proveniência.
- A chave usada para assinar o arquivo não está no seu keyring. Isso indica que a entidade que assinou o chart não é alguém em quem você já sinalizou que confia.
- A verificação do arquivo `.prov` falhou. Isso indica que algo está errado com o chart ou com os dados de proveniência.
- Os hashes de arquivo no arquivo de proveniência não correspondem ao hash do arquivo de pacote. Isso indica que o pacote foi adulterado.

Se uma verificação falhar, há razão para desconfiar do pacote.

## O Arquivo de Proveniência

O arquivo de proveniência contém o arquivo YAML do chart mais várias informações de verificação. Os arquivos de proveniência são projetados para serem gerados automaticamente.

Os seguintes dados de proveniência são adicionados:

* O arquivo do chart (`Chart.yaml`) é incluído para dar tanto a humanos quanto a ferramentas uma visão fácil do conteúdo do chart.
* A assinatura (SHA256, assim como o Docker) do pacote do chart (o arquivo `.tgz`) é incluída e pode ser usada para verificar a integridade do pacote do chart.
* O corpo inteiro é assinado usando o algoritmo usado pelo OpenPGP (veja [Keybase.io](https://keybase.io) para uma forma emergente de tornar a assinatura e verificação criptográfica fáceis).

A combinação disso dá aos usuários as seguintes garantias:

* O pacote em si não foi adulterado (checksum do pacote `.tgz`).
* A entidade que lançou este pacote é conhecida (via a assinatura GnuPG/PGP).

O formato do arquivo se parece com algo assim:

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

Note que a seção YAML contém dois documentos (separados por `...\n`). O primeiro arquivo é o conteúdo de `Chart.yaml`. O segundo são os checksums, um mapa de nomes de arquivo para digests SHA-256 do conteúdo desse arquivo no momento do empacotamento.

O bloco de assinatura é uma assinatura PGP padrão, que fornece [resistência à adulteração](https://www.rossde.com/PGP/pgp_signatures.html).

## Repositórios de Charts

Os repositórios de charts servem como uma coleção centralizada de charts Helm.

Os repositórios de charts devem tornar possível servir arquivos de proveniência via HTTP através de uma requisição específica, e devem disponibilizá-los no mesmo caminho URI que o chart.

Por exemplo, se a URL base para um pacote é `https://example.com/charts/mychart-1.2.3.tgz`, o arquivo de proveniência, se existir, DEVE estar acessível em `https://example.com/charts/mychart-1.2.3.tgz.prov`.

Da perspectiva do usuário final, `helm install --verify myrepo/mychart-1.2.3` deve resultar no download tanto do chart quanto do arquivo de proveniência sem configuração ou ação adicional do usuário.

### Assinaturas em registries baseados em OCI

Ao publicar charts em um [registry baseado em OCI](/topics/registries.md), o [plugin `helm-sigstore`](https://github.com/sigstore/helm-sigstore/) pode ser usado para publicar proveniência no [sigstore](https://sigstore.dev/). [Conforme descrito na documentação](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md), o processo de criar proveniência e assinar com uma chave GPG são comuns, mas o comando `helm sigstore upload` pode ser usado para publicar a proveniência em um log de transparência imutável.

## Estabelecendo Autoridade e Autenticidade

Ao lidar com sistemas de cadeia de confiança, é importante ser capaz de estabelecer a autoridade de um assinante. Em outras palavras, o sistema acima depende do fato de você confiar na pessoa que assinou o chart. Isso, por sua vez, significa que você precisa confiar na chave pública do assinante.

Uma das decisões de design do Helm foi que o projeto Helm não se inseriria na cadeia de confiança como uma parte necessária. Não queremos ser "a autoridade certificadora" para todos os assinantes de charts. Em vez disso, favorecemos fortemente um modelo descentralizado, que é parte da razão pela qual escolhemos OpenPGP como nossa tecnologia fundamental. Então, quando se trata de estabelecer autoridade, deixamos esta etapa mais ou menos indefinida no Helm 2 (uma decisão mantida no Helm 3).

No entanto, temos algumas indicações e recomendações para aqueles interessados em usar o sistema de proveniência:

- A plataforma [Keybase](https://keybase.io) fornece um repositório público centralizado para informações de confiança.
  - Você pode usar o Keybase para armazenar suas chaves ou para obter as chaves públicas de outros.
  - O Keybase também tem documentação fantástica disponível
  - Embora não tenhamos testado, o recurso "secure website" do Keybase poderia ser usado para servir charts Helm.
  - A ideia básica é que um "revisor de charts" oficial assina charts com sua chave, e o arquivo de proveniência resultante é então enviado para o repositório de charts.
  - Houve algum trabalho na ideia de que uma lista de chaves de assinatura válidas pode ser incluída no arquivo `index.yaml` de um repositório.
