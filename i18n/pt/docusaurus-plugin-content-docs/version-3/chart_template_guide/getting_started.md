---
title: Primeiros Passos
description: Um guia rápido sobre templates de Chart.
sidebar_position: 2
---

Nesta seção do guia, criaremos um chart e adicionaremos um primeiro template.
O chart que criaremos aqui será usado ao longo do restante do guia.

Para começar, vamos dar uma breve olhada em um chart do Helm.

## Charts

Conforme descrito no [Guia de Charts](../topics/charts.md), os charts do Helm são
estruturados assim:

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

O diretório `templates/` é para arquivos de template. Quando o Helm avalia um chart,
ele passa todos os arquivos do diretório `templates/` pelo motor de templates.
Em seguida, coleta os resultados desses templates e os envia ao Kubernetes.

O arquivo `values.yaml` também é importante para templates. Este arquivo contém os
_valores padrão_ de um chart. Esses valores podem ser sobrescritos pelos usuários durante
`helm install` ou `helm upgrade`.

O arquivo `Chart.yaml` contém uma descrição do chart. Você pode acessá-lo
de dentro de um template.

O diretório `charts/` _pode_ conter outros charts (que chamamos de _subcharts_).
Mais adiante neste guia veremos como eles funcionam quando se trata de renderização
de templates.

## Um Chart Inicial

Para este guia, criaremos um chart simples chamado `mychart`, e depois criaremos
alguns templates dentro dele.

```console
$ helm create mychart
Creating mychart
```

### Uma Visão Rápida de `mychart/templates/`

Se você olhar o diretório `mychart/templates/`, notará que alguns arquivos
já estão lá.

- `NOTES.txt`: O "texto de ajuda" do seu chart. Será exibido para os usuários
  quando executarem `helm install`.
- `deployment.yaml`: Um manifesto básico para criar um
  [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
  do Kubernetes
- `service.yaml`: Um manifesto básico para criar um [endpoint de
  serviço](https://kubernetes.io/docs/concepts/services-networking/service/) para seu deployment
- `_helpers.tpl`: Um lugar para colocar helpers de template que você pode reutilizar
  em todo o chart

E o que vamos fazer é... _remover todos eles!_ Dessa forma, podemos trabalhar no nosso
tutorial do zero. Na verdade, criaremos nossos próprios `NOTES.txt` e
`_helpers.tpl` conforme avançamos.

```console
$ rm -rf mychart/templates/*
```

Quando você estiver escrevendo charts de nível de produção, ter versões básicas desses
arquivos pode ser muito útil. Então, no seu dia a dia de criação de charts, você provavelmente
não vai querer removê-los.

## Um Primeiro Template

O primeiro template que vamos criar será um `ConfigMap`. No Kubernetes, um ConfigMap
é simplesmente um objeto para armazenar dados de configuração. Outras coisas, como
pods, podem acessar os dados em um ConfigMap.

Como ConfigMaps são recursos básicos, eles são um ótimo ponto de partida para nós.

Vamos começar criando um arquivo chamado `mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**DICA:** Os nomes dos templates não seguem um padrão rígido de nomenclatura. No entanto,
recomendamos usar a extensão `.yaml` para arquivos YAML e `.tpl` para helpers.

O arquivo YAML acima é um ConfigMap básico, com os campos mínimos necessários.
Por estar no diretório `mychart/templates/`, ele passará pelo motor de templates.

Não há problema em colocar um arquivo YAML simples como este no diretório
`mychart/templates/`. Quando o Helm lê este template, ele simplesmente o envia ao
Kubernetes como está.

Com este template simples, agora temos um chart instalável. E podemos instalá-lo
assim:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Usando o Helm, podemos recuperar a release e ver o template real que foi carregado.

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

O comando `helm get manifest` recebe um nome de release (`full-coral`) e imprime
todos os recursos do Kubernetes que foram enviados ao servidor. Cada arquivo
começa com `---` para indicar o início de um documento YAML, e depois é seguido
por uma linha de comentário gerada automaticamente que nos diz qual arquivo de template
gerou este documento YAML.

A partir daí, podemos ver que os dados YAML são exatamente o que colocamos no nosso
arquivo `configmap.yaml`.

Agora podemos desinstalar nossa release: `helm uninstall full-coral`.

### Adicionando uma Chamada de Template Simples

Codificar o `name:` diretamente em um recurso é geralmente considerado uma má
prática. Os nomes devem ser únicos para uma release. Então, podemos querer gerar
um campo name inserindo o nome da release.

**DICA:** O campo `name:` é limitado a 63 caracteres devido a limitações do sistema
DNS. Por isso, os nomes de release são limitados a 53 caracteres.
O Kubernetes 1.3 e anteriores eram limitados a apenas 24 caracteres (portanto,
nomes de 14 caracteres).

Vamos alterar `configmap.yaml` de acordo.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

A grande mudança está no valor do campo `name:`, que agora é
`{{ .Release.Name }}-configmap`.

> Uma diretiva de template é delimitada por blocos `{{` e `}}`.

A diretiva de template `{{ .Release.Name }}` injeta o nome da release no template.
Os valores passados para um template podem ser pensados como _objetos com namespace_,
onde um ponto (`.`) separa cada elemento do namespace.

O ponto inicial antes de `Release` indica que começamos no namespace de nível mais
alto para este escopo (falaremos sobre escopo em breve). Assim, podemos ler
`.Release.Name` como "comece no namespace de nível superior, encontre o objeto
`Release`, e então procure dentro dele por um objeto chamado `Name`".

O objeto `Release` é um dos objetos embutidos do Helm, e o abordaremos com mais
profundidade depois. Mas, por enquanto, basta dizer que isso exibirá o nome da
release que a biblioteca atribui à nossa release.

Agora, quando instalamos nosso recurso, veremos imediatamente o resultado de usar
esta diretiva de template:

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Você pode executar `helm get manifest clunky-serval` para ver o YAML completo gerado.

Note que o ConfigMap dentro do Kubernetes agora se chama `clunky-serval-configmap`
em vez de `mychart-configmap` como antes.

Neste ponto, vimos templates em sua forma mais básica: arquivos YAML que têm
diretivas de template incorporadas em `{{` e `}}`. Na próxima parte, daremos uma
olhada mais profunda nos templates. Mas antes de seguir em frente, há um truque
rápido que pode tornar a construção de templates mais rápida: quando você quiser
testar a renderização do template, mas não quiser realmente instalar nada, você
pode usar `helm install --debug --dry-run goodly-guppy ./mychart`. Isso renderizará
os templates. Mas em vez de instalar o chart, retornará o template renderizado
para você, para que você possa ver a saída:

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

Usar `--dry-run` facilitará o teste do seu código, mas não garantirá que o
Kubernetes em si aceitará os templates que você gerar. É melhor não presumir que
seu chart será instalado só porque `--dry-run` funciona.

No [Guia de Templates de Chart](./index.md), pegamos o chart básico que definimos
aqui e exploramos a linguagem de templates do Helm em detalhes. E começaremos com
os objetos embutidos.
