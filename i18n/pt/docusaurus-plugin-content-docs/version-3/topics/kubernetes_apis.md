---
title: APIs do Kubernetes Obsoletas
description: Explica APIs do Kubernetes obsoletas no Helm
---

O Kubernetes é um sistema orientado por APIs, e a API evolui ao longo do tempo para refletir uma melhor compreensão do domínio. Esta é uma prática comum em sistemas e suas APIs. Uma parte importante da evolução das APIs é ter uma boa política e processo de deprecação para informar os usuários sobre como as mudanças são implementadas. Em outras palavras, os consumidores da sua API precisam saber com antecedência em qual release uma API será removida ou alterada. Isso evita surpresas e quebras de compatibilidade para os consumidores.

A [política de deprecação do Kubernetes](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) documenta como o Kubernetes lida com as mudanças em suas versões de API. A política de deprecação estabelece o prazo em que as versões de API serão suportadas após um anúncio de deprecação. Portanto, é importante estar ciente dos anúncios de deprecação e saber quando as versões de API serão removidas, para ajudar a minimizar o impacto.

Este é um exemplo de um anúncio [para a remoção de versões de API obsoletas no Kubernetes 1.16](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/), que foi divulgado alguns meses antes do release. Essas versões de API teriam sido anunciadas como obsoletas antes disso novamente. Isso mostra que existe uma boa política em vigor que informa os consumidores sobre o suporte às versões de API.

Os templates do Helm especificam um [grupo de API do Kubernetes](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups) ao definir um objeto do Kubernetes, semelhante a um arquivo de manifesto do Kubernetes. Isso é especificado no campo `apiVersion` do template e identifica a versão da API do objeto Kubernetes. Isso significa que usuários do Helm e mantenedores de charts precisam estar cientes de quando versões de API do Kubernetes foram deprecadas e em qual versão do Kubernetes elas serão removidas.

## Mantenedores de Charts

Você deve auditar seus charts verificando versões de API do Kubernetes que estão obsoletas ou foram removidas em uma versão do Kubernetes. As versões de API que estão obsoletas ou já não são suportadas devem ser atualizadas para a versão suportada, e uma nova versão do chart deve ser lançada. A versão da API é definida pelos campos `kind` e `apiVersion`. Por exemplo, aqui está uma versão de API do objeto `Deployment` removida no Kubernetes 1.16:

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Usuários do Helm

Você deve auditar os charts que utiliza (semelhante aos [mantenedores de charts](#mantenedores-de-charts)) e identificar quaisquer charts onde as versões de API estão obsoletas ou foram removidas em uma versão do Kubernetes. Para os charts identificados, você precisa verificar a versão mais recente do chart (que possui versões de API suportadas) ou atualizar o chart você mesmo.

Além disso, você também precisa auditar quaisquer charts implantados (ou seja, releases do Helm) verificando novamente se há versões de API obsoletas ou removidas. Isso pode ser feito obtendo detalhes de um release usando o comando `helm get manifest`.

A forma de atualizar um release do Helm para APIs suportadas depende das suas descobertas, conforme segue:

1. Se você encontrar apenas versões de API obsoletas:
  - Execute um `helm upgrade` com uma versão do chart que possui versões de API do Kubernetes suportadas
  - Adicione uma descrição no upgrade, algo como "não realizar rollback para uma versão do Helm anterior a esta versão atual"
2. Se você encontrar alguma versão de API que foi removida em uma versão do Kubernetes:
  - Se você estiver executando uma versão do Kubernetes onde a(s) versão(ões) de API ainda está(ão) disponível(is) (por exemplo, você está no Kubernetes 1.15 e descobriu que usa APIs que serão removidas no Kubernetes 1.16):
    - Siga o procedimento do passo 1
  - Caso contrário (por exemplo, você já está executando uma versão do Kubernetes onde algumas versões de API reportadas pelo `helm get manifest` não estão mais disponíveis):
    - Você precisa editar o manifesto do release que está armazenado no cluster para atualizar as versões de API para APIs suportadas. Consulte [Atualizando Versões de API de um Manifesto de Release](#atualizando-versões-de-api-de-um-manifesto-de-release) para mais detalhes

> Nota: Em todos os casos de atualização de um release do Helm com APIs suportadas, você nunca deve fazer rollback do release para uma versão anterior à versão do release com as APIs suportadas.

> Recomendação: A melhor prática é atualizar os releases que usam versões de API obsoletas para versões de API suportadas, antes de atualizar para um cluster Kubernetes que remove essas versões de API.

Se você não atualizar um release conforme sugerido anteriormente, você terá um erro semelhante ao seguinte ao tentar atualizar um release em uma versão do Kubernetes onde sua(s) versão(ões) de API foi(ram) removida(s):

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

O Helm falha neste cenário porque tenta criar um patch de diferença entre o release atualmente implantado (que contém as APIs do Kubernetes que foram removidas nesta versão do Kubernetes) e o chart que você está passando com as versões de API atualizadas/suportadas. A razão subjacente para a falha é que quando o Kubernetes remove uma versão de API, a biblioteca cliente Go do Kubernetes não consegue mais fazer parse dos objetos obsoletos e, portanto, o Helm falha ao chamar a biblioteca. Infelizmente, o Helm não consegue se recuperar desta situação e não é mais capaz de gerenciar tal release. Consulte [Atualizando Versões de API de um Manifesto de Release](#atualizando-versões-de-api-de-um-manifesto-de-release) para mais detalhes sobre como se recuperar deste cenário.

## Atualizando Versões de API de um Manifesto de Release

O manifesto é uma propriedade do objeto release do Helm que é armazenado no campo de dados de um Secret (padrão) ou ConfigMap no cluster. O campo de dados contém um objeto comprimido com gzip que está codificado em base 64 (há uma codificação base 64 adicional para um Secret). Existe um Secret/ConfigMap por versão/revisão do release no namespace do release.

Você pode usar o plugin [mapkubeapis](https://github.com/helm/helm-mapkubeapis) do Helm para realizar a atualização de um release para APIs suportadas. Consulte o readme para mais detalhes.

Alternativamente, você pode seguir estes passos manuais para realizar uma atualização das versões de API de um manifesto de release. Dependendo da sua configuração, você seguirá os passos para o backend Secret ou ConfigMap.

- Obtenha o nome do Secret ou ConfigMap associado ao último release implantado:
  - Backend Secrets: `kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - Backend ConfigMap: `kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- Obtenha os detalhes do último release implantado:
  - Backend Secrets: `kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - Backend ConfigMap: `kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- Faça backup do release caso precise restaurar se algo der errado:
  - `cp release.yaml release.bak`
  - Em caso de emergência, restaure: `kubectl apply -f release.bak -n
    <release_namespace>`
- Decodifique o objeto release:
  - Backend Secrets: `cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - Backend ConfigMap: `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- Altere as versões de API dos manifestos. Pode usar qualquer ferramenta (por exemplo, editor) para fazer as alterações. Isso está no campo `manifest` do seu objeto release decodificado (`release.data.decoded`)
- Codifique o objeto release:
  - Backend Secrets: `cat release.data.decoded | gzip | base64 | base64`
  - Backend ConfigMap: `cat release.data.decoded | gzip | base64`
- Substitua o valor da propriedade `data.release` no arquivo do release implantado (`release.yaml`) pelo novo objeto release codificado
- Aplique o arquivo ao namespace: `kubectl apply -f release.yaml -n
  <release_namespace>`
- Execute um `helm upgrade` com uma versão do chart que possui versões de API do Kubernetes suportadas
- Adicione uma descrição no upgrade, algo como "não realizar rollback para uma versão do Helm anterior a esta versão atual"
