---
title: Migrando do Helm v2 para v3
description: Aprenda como migrar do Helm v2 para o v3.
sidebar_position: 13
---

Este guia mostra como migrar do Helm v2 para o v3. O Helm v2 precisa estar
instalado e gerenciando releases em um ou mais clusters.

## Visão Geral das Mudanças do Helm 3

A lista completa de mudanças do Helm 2 para o 3 está documentada na [seção de
FAQ](/faq/changes_since_helm2.md). A seguir está um resumo de algumas dessas
mudanças que o usuário deve conhecer antes e durante a migração:

1. Remoção do Tiller:
   - Substitui a arquitetura cliente/servidor por uma arquitetura
     cliente/biblioteca (apenas o binário `helm`)
   - A segurança agora é baseada por usuário (delegada à segurança do usuário
     no cluster Kubernetes)
   - Os releases agora são armazenados como secrets dentro do cluster e os
     metadados do objeto release foram alterados
   - Os releases são persistidos com base no namespace do release e não mais
     no namespace do Tiller
2. Repositório de charts atualizado:
   - `helm search` agora suporta tanto buscas em repositórios locais quanto
     consultas no Artifact Hub
3. apiVersion do chart elevada para "v2" devido às seguintes mudanças na
   especificação:
   - Dependências de charts vinculadas dinamicamente foram movidas para
     `Chart.yaml` (`requirements.yaml` removido e requirements --> dependencies)
   - Charts de biblioteca (helper/common charts) agora podem ser adicionados
     como dependências de charts vinculadas dinamicamente
   - Charts possuem um campo de metadados `type` para definir se o chart é do
     tipo `application` ou `library`. Por padrão, é application, o que significa
     que é renderizável e instalável
   - Charts do Helm 2 (apiVersion=v1) ainda podem ser instalados
4. Especificação de diretórios XDG adicionada:
   - Helm home foi removido e substituído pela especificação de diretórios XDG
     para armazenar arquivos de configuração
   - Não é mais necessário inicializar o Helm
   - `helm init` e `helm home` foram removidos
5. Mudanças adicionais:
   - A instalação/configuração do Helm foi simplificada:
     - Apenas o cliente Helm (binário helm) (sem Tiller)
     - Paradigma de execução direta
   - Repositórios `local` ou `stable` não são configurados por padrão
   - O hook `crd-install` foi removido e substituído pelo diretório `crds` no
     chart, onde todos os CRDs definidos nele serão instalados antes de qualquer
     renderização do chart
   - O valor de anotação do hook `test-failure` foi removido, e `test-success`
     foi descontinuado. Use `test` em vez disso
   - Comandos removidos/substituídos/adicionados:
       - delete --> uninstall : remove todo o histórico de releases por padrão
         (anteriormente era necessário `--purge`)
       - fetch --> pull
       - home (removido)
       - init (removido)
       - install: requer nome do release ou argumento `--generate-name`
       - inspect --> show
       - reset (removido)
       - serve (removido)
       - template: argumento `-x`/`--execute` renomeado para `-s`/`--show-only`
       - upgrade: Adicionado argumento `--history-max` que limita o número
         máximo de revisões salvas por release (0 para sem limite)
   - A biblioteca Go do Helm 3 passou por muitas mudanças e é incompatível com
     a biblioteca do Helm 2
   - Os binários de release agora são hospedados em `get.helm.sh`

## Casos de Uso da Migração

Os casos de uso da migração são os seguintes:

1. Helm v2 e v3 gerenciando o mesmo cluster:
   - Esse caso de uso é recomendado apenas se você pretende descontinuar o
     Helm v2 gradualmente e não precisa que o v3 gerencie nenhum release
     implantado pelo v2. Todos os novos releases sendo implantados devem ser
     realizados pelo v3 e os releases existentes implantados pelo v2 devem ser
     atualizados/removidos apenas pelo v2
   - O Helm v2 e v3 podem gerenciar o mesmo cluster sem problemas. As versões
     do Helm podem ser instaladas no mesmo sistema ou em sistemas separados
   - Se instalar o Helm v3 no mesmo sistema, você precisa realizar um passo
     adicional para garantir que ambas as versões do cliente possam coexistir
     até que você esteja pronto para remover o cliente Helm v2. Renomeie ou
     coloque o binário do Helm v3 em uma pasta diferente para evitar conflitos
   - Caso contrário, não há conflitos entre ambas as versões devido às
     seguintes distinções:
     - O armazenamento de releases (histórico) do v2 e v3 são independentes um
       do outro. As mudanças incluem o recurso Kubernetes usado para
       armazenamento e os metadados do objeto release contidos no recurso. Os
       releases também estarão em um namespace por usuário em vez de usar o
       namespace do Tiller (por exemplo, namespace padrão do Tiller no v2 é
       kube-system). O v2 usa "ConfigMaps" ou "Secrets" no namespace do Tiller
       com propriedade `TILLER`. O v3 usa "Secrets" no namespace do usuário com
       propriedade `helm`. Os releases são incrementais tanto no v2 quanto no v3
     - O único problema possível seria se recursos com escopo de cluster
       Kubernetes (por exemplo, `clusterroles.rbac`) forem definidos em um
       chart. A implantação do v3 falharia mesmo sendo única no namespace, pois
       os recursos entrariam em conflito
     - A configuração do v3 não usa mais `$HELM_HOME` e usa a especificação de
       diretórios XDG em vez disso. Ela também é criada sob demanda. Portanto,
       é independente da configuração do v2. Isso se aplica apenas quando ambas
       as versões estão instaladas no mesmo sistema

2. Migrando do Helm v2 para o Helm v3:
   - Esse caso de uso se aplica quando você deseja que o Helm v3 gerencie
     releases existentes do Helm v2
   - Deve-se observar que um cliente Helm v2:
     - pode gerenciar 1 ou mais clusters Kubernetes
     - pode conectar-se a 1 ou mais instâncias do Tiller em um cluster
   - Isso significa que você deve estar ciente disso ao migrar, pois os
     releases são implantados nos clusters pelo Tiller e seu namespace. Você
     deve, portanto, estar ciente de migrar cada cluster e cada instância do
     Tiller que é gerenciada pela instância do cliente Helm v2
   - O caminho recomendado para migração de dados é o seguinte:
     1. Fazer backup dos dados do v2
     2. Migrar a configuração do Helm v2
     3. Migrar os releases do Helm v2
     4. Quando estiver confiante de que o Helm v3 está gerenciando todos os
        dados do Helm v2 (para todos os clusters e instâncias do Tiller da
        instância do cliente Helm v2) conforme esperado, então limpe os dados
        do Helm v2
   - O processo de migração é automatizado pelo plugin
     [2to3](https://github.com/helm/helm-2to3) do Helm v3

## Referência

   - Plugin [2to3](https://github.com/helm/helm-2to3) do Helm v3
   - [Post](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/) do blog
     explicando o uso do plugin `2to3` com exemplos
