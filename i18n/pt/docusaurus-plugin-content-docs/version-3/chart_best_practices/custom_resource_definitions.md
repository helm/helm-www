---
title: Custom Resource Definitions
description: Como criar e utilizar CRDs.
sidebar_position: 7
---

Esta seção do guia de boas práticas aborda a criação e utilização de objetos
Custom Resource Definition.

Ao trabalhar com Custom Resource Definitions (CRDs), é importante distinguir
duas partes diferentes:

- Existe uma declaração de um CRD. Este é o arquivo YAML que tem kind
  `CustomResourceDefinition`
- Depois existem recursos que _usam_ o CRD. Digamos que um CRD define
  `foo.example.com/v1`. Qualquer recurso que tenha `apiVersion: example.com/v1` e
  kind `Foo` é um recurso que usa o CRD.

## Instalar uma Declaração de CRD Antes de Usar o Recurso

O Helm é otimizado para carregar o máximo de recursos possível no Kubernetes o
mais rápido possível. Por design, o Kubernetes pode pegar um conjunto inteiro de
manifests e colocá-los todos online (isso é chamado de loop de reconciliação).

Mas há uma diferença com CRDs.

Para um CRD, a declaração deve ser registrada antes que quaisquer recursos dos
tipos do CRD possam ser usados. E o processo de registro às vezes leva alguns
segundos.

### Método 1: Deixe o `helm` Fazer Por Você

Com a chegada do Helm 3, removemos os antigos hooks `crd-install` por uma
metodologia mais simples. Agora existe um diretório especial chamado `crds` que
você pode criar no seu chart para armazenar seus CRDs. Esses CRDs não são
templateados, mas serão instalados por padrão ao executar `helm install` para o
chart. Se o CRD já existir, ele será ignorado com um aviso. Se você deseja pular
a etapa de instalação de CRD, pode passar a flag `--skip-crds`.

#### Algumas ressalvas (e explicações)

No momento não há suporte para atualizar ou excluir CRDs usando o Helm. Esta foi
uma decisão explícita após muita discussão na comunidade devido ao perigo de
perda acidental de dados. Além disso, atualmente não há consenso na comunidade
sobre como lidar com CRDs e seu ciclo de vida. À medida que isso evolui, o Helm
adicionará suporte para esses casos de uso.

A flag `--dry-run` de `helm install` e `helm upgrade` não é suportada atualmente
para CRDs. O propósito do "Dry Run" é validar que a saída do chart realmente
funcionará se enviada ao servidor. Mas CRDs são uma modificação do comportamento
do servidor. O Helm não pode instalar o CRD em um dry run, então o cliente de
discovery não saberá sobre aquele Custom Resource (CR), e a validação falhará.
Como alternativa, você pode mover os CRDs para seu próprio chart ou usar
`helm template` em vez disso.

Outro ponto importante a considerar na discussão sobre suporte a CRD é como a
renderização de templates é tratada. Uma das desvantagens distintas do método
`crd-install` usado no Helm 2 era a incapacidade de validar charts corretamente
devido à mudança na disponibilidade de API (um CRD está na verdade adicionando
outra API disponível ao seu cluster Kubernetes). Se um chart instalava um CRD,
o `helm` não tinha mais um conjunto válido de versões de API para trabalhar.
Esta também é a razão para remover o suporte a templates dos CRDs. Com o novo
método `crds` de instalação de CRD, agora garantimos que o `helm` tenha
informações completamente válidas sobre o estado atual do cluster.

### Método 2: Charts Separados

Outra forma de fazer isso é colocar a definição do CRD em um chart, e depois
colocar quaisquer recursos que usam esse CRD em _outro_ chart.

Neste método, cada chart deve ser instalado separadamente. No entanto, esse
fluxo de trabalho pode ser mais útil para operadores de cluster que têm acesso
de administrador a um cluster.
