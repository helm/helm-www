---
title: Usando registries baseados em OCI
description: Descreve como usar OCI para distribuição de charts.
sidebar_position: 7
---

A partir do Helm 3, você pode usar registries de containers com suporte a [OCI](https://www.opencontainers.org/) para armazenar e compartilhar pacotes de charts. A partir do Helm v3.8.0, o suporte a OCI é habilitado por padrão.


## Suporte a OCI antes da v3.8.0

O suporte a OCI evoluiu de experimental para disponibilidade geral com o Helm v3.8.0. Em versões anteriores do Helm, o suporte a OCI se comportava de maneira diferente. Se você estava usando o suporte a OCI antes do Helm v3.8.0, é importante entender o que mudou nas diferentes versões do Helm.

### Habilitando o suporte a OCI antes da v3.8.0

Antes do Helm v3.8.0, o suporte a OCI é *experimental* e deve ser habilitado manualmente.

Para habilitar o suporte experimental a OCI para versões do Helm anteriores à v3.8.0, defina `HELM_EXPERIMENTAL_OCI` no seu ambiente. Por exemplo:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Depreciações e mudanças de comportamento do OCI com a v3.8.0

Com o lançamento do [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0), as seguintes funcionalidades e comportamentos são diferentes das versões anteriores do Helm:

- Ao definir um chart nas dependências como OCI, a versão pode ser definida como um intervalo, assim como outras dependências.
- Tags SemVer que incluem informações de build podem ser enviadas e usadas. Registries OCI não suportam `+` como caractere de tag. O Helm converte o `+` para `_` ao armazenar como tag.
- O comando `helm registry login` agora segue a mesma estrutura do Docker CLI para armazenar credenciais. O mesmo local de configuração do registry pode ser passado tanto para o Helm quanto para o Docker CLI.

### Depreciações e mudanças de comportamento do OCI com a v3.7.0

Com o lançamento do [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0), foi incluída a implementação do [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) para suporte a OCI. Como resultado, as seguintes funcionalidades e comportamentos são diferentes das versões anteriores do Helm:

- O subcomando `helm chart` foi removido.
- O cache de charts foi removido (sem `helm chart list` etc.).
- Referências a registries OCI agora sempre são prefixadas com `oci://`.
- O nome base da referência do registry deve *sempre* corresponder ao nome do chart.
- A tag da referência do registry deve *sempre* corresponder à versão semântica do chart (ou seja, sem tags `latest`).
- O media type da camada do chart foi alterado de `application/tar+gzip` para `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.


## Usando um registry baseado em OCI

### Repositórios Helm em registries baseados em OCI

Um [repositório Helm](/topics/chart_repository.md) é uma forma de hospedar e distribuir charts Helm empacotados. Um registry baseado em OCI pode conter zero ou mais repositórios Helm e cada um desses repositórios pode conter zero ou mais charts Helm empacotados.

### Usando registries hospedados

Existem vários registries de containers hospedados com suporte a OCI que você pode usar para seus charts Helm. Por exemplo:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)
  

Siga a documentação do provedor do registry de containers hospedado para criar e configurar um registry com suporte a OCI.

**Nota:**  Você pode executar o [Docker Registry](https://docs.docker.com/registry/deploying/) ou [`zot`](https://github.com/project-zot/zot), que são registries baseados em OCI, no seu computador de desenvolvimento. Executar um registry baseado em OCI no seu computador de desenvolvimento deve ser usado apenas para fins de teste.

### Usando sigstore para assinar charts baseados em OCI

O plugin [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) permite usar o [Sigstore](https://sigstore.dev/) para assinar charts Helm com as mesmas ferramentas usadas para assinar imagens de containers. Isso fornece uma alternativa ao [provenance baseado em GPG](/topics/provenance.md) suportado pelos [repositórios de charts](/topics/chart_repository.md) clássicos.

Para mais detalhes sobre como usar o plugin `helm sigstore`, consulte a [documentação do projeto](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Comandos para trabalhar com registries

### O subcomando `registry`

#### `login`

fazer login em um registry (com entrada manual de senha)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

fazer logout de um registry

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### O subcomando `push`

Enviar um chart para um registry baseado em OCI:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

O subcomando `push` só pode ser usado com arquivos `.tgz`
criados anteriormente usando `helm package`.

Ao usar `helm push` para enviar um chart para um registry OCI, a referência
deve ser prefixada com `oci://` e não deve conter o nome base ou a tag.

O nome base da referência do registry é inferido do nome do chart,
e a tag é inferida da versão semântica do chart. Este é
atualmente um requisito estrito.

Certos registries exigem que o repositório e/ou namespace (se especificado)
sejam criados previamente. Caso contrário, um erro será produzido durante a
operação `helm push`.

Se você criou um [arquivo de provenance](/topics/provenance.md) (`.prov`) e ele estiver presente ao lado do arquivo `.tgz` do chart, ele será
automaticamente enviado para o registry durante o `push`. Isso resulta em
uma camada extra no [manifesto do chart Helm](#manifesto-do-chart-helm).

Usuários do [plugin helm-push](https://github.com/chartmuseum/helm-push) (para enviar charts ao [ChartMuseum](/topics/chart_repository.md#chartmuseum-repository-server))
podem ter problemas, já que o plugin conflita com o novo `push` integrado.
A partir da versão v0.10.0, o plugin foi renomeado para `cm-push`.

### Outros subcomandos

O suporte para o protocolo `oci://` também está disponível em vários outros subcomandos.
Aqui está a lista completa:

- `helm pull`
- `helm push`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

O nome base (nome do chart) da referência do registry *é*
incluído para qualquer tipo de ação envolvendo download de chart
(diferente do `helm push` onde é omitido).

Aqui estão alguns exemplos de uso dos subcomandos listados acima com
charts baseados em OCI:

```
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## Instalando charts com digest

Instalar um chart com um digest é mais seguro do que com uma tag, pois os digests são imutáveis.
O digest é especificado na URI do chart:

```
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...
```

## Especificando dependências

As dependências de um chart podem ser baixadas de um registry usando o subcomando `dependency update`.

O `repository` para uma entrada específica no `Chart.yaml` é especificado como a referência do registry sem o nome base:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
Isso buscará `oci://localhost:5000/myrepo/mychart:2.7.0` quando `dependency update` for executado.

## Manifesto do chart Helm

Exemplo de manifesto de chart Helm como representado em um registry
(observe os campos `mediaType`):
```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

O exemplo a seguir contém um
[arquivo de provenance](/topics/provenance.md)
(observe a camada extra):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## Migrando de repositórios de charts

Migrar dos [repositórios de charts](/topics/chart_repository.md) clássicos
(repositórios baseados em index.yaml) é simples: use `helm pull` e depois `helm push` para enviar os arquivos `.tgz` resultantes para um registry.
