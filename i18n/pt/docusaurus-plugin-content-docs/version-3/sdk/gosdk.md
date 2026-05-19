---
title: Introdução
description: Apresenta o SDK Go do Helm
sidebar_position: 1
---
O SDK Go do Helm permite que software personalizado aproveite os charts do Helm e a funcionalidade do Helm para gerenciar a implantação de software no Kubernetes
(Na verdade, a CLI do Helm é efetivamente apenas uma dessas ferramentas!)

Atualmente, o SDK foi funcionalmente separado da CLI do Helm.
O SDK pode ser (e é) utilizado por ferramentas independentes.
O projeto Helm se comprometeu com a estabilidade da API para o SDK.
Vale ressaltar que o SDK ainda tem algumas arestas, remanescentes do trabalho inicial de separação entre a CLI e o SDK, que o projeto Helm pretende melhorar ao longo do tempo.

A documentação completa da API pode ser encontrada em [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

Uma breve visão geral de alguns dos principais tipos de pacotes e um exemplo simples seguem abaixo.
Consulte a seção [Exemplos](/sdk/examples.mdx) para mais exemplos e um 'driver' mais completo.

## Visão geral dos principais pacotes

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  Contém o "cliente" principal para executar ações do Helm.
  Este é o mesmo pacote que a CLI usa internamente.
  Se você precisa apenas executar comandos básicos do Helm a partir de outro programa Go, este pacote é para você
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  Métodos e utilitários utilizados para carregar e manipular charts
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) e seus subpacotes:
  Contém todos os manipuladores para as variáveis de ambiente padrão do Helm e seus subpacotes contêm manipulação de saída e arquivos de valores
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  Define o objeto `Release` e seus status

Existem muitos outros pacotes além desses, então consulte a documentação para mais informações!

### Exemplo simples
Este é um exemplo simples de como executar um `helm list` usando o SDK Go.
Consulte a seção [Exemplos](/sdk/examples.mdx) para exemplos mais completos.

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```


## Compatibilidade

O SDK do Helm segue explicitamente as garantias de compatibilidade retroativa do Helm:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

Ou seja, mudanças que quebram compatibilidade só serão feitas em versões principais (major).
