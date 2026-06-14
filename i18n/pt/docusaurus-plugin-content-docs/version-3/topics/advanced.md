---
title: Técnicas Avançadas do Helm
description: Explica várias funcionalidades avançadas para usuários experientes do Helm
sidebar_position: 9
---

Esta seção explica várias funcionalidades e técnicas avançadas para usar o Helm.
As informações nesta seção são destinadas a "usuários experientes" do Helm que
desejam fazer personalizações e manipulações avançadas de seus charts e releases.
Cada uma dessas funcionalidades avançadas vem com seus próprios compromissos e
ressalvas, então cada uma deve ser usada com cuidado e com conhecimento
aprofundado do Helm. Em outras palavras, lembre-se do [Princípio do Peter
Parker](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility).

## Pós-Renderização

A pós-renderização permite que instaladores de charts manipulem, configurem e/ou
validem manualmente os manifests renderizados antes de serem instalados pelo
Helm. Isso permite que usuários com necessidades de configuração avançadas usem
ferramentas como [`kustomize`](https://kustomize.io) para aplicar mudanças de
configuração sem a necessidade de fazer fork de um chart público ou exigir que
os mantenedores de charts especifiquem cada última opção de configuração para um
software. Também existem casos de uso para injetar ferramentas comuns e sidecars
em ambientes corporativos ou análise dos manifests antes da implantação.

### Pré-requisitos

- Helm 3.1+

### Uso

Um pós-renderizador pode ser qualquer executável que aceite manifests Kubernetes
renderizados via STDIN e retorne manifests Kubernetes válidos via STDOUT. Ele
deve retornar um código de saída diferente de 0 em caso de falha. Esta é a única
"API" entre os dois componentes. Isso permite grande flexibilidade no que você
pode fazer com seu processo de pós-renderização.

Um pós-renderizador pode ser usado com `install`, `upgrade` e `template`. Para
usar um pós-renderizador, use a flag `--post-renderer` com o caminho para o
executável do renderizador que você deseja usar:

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

Se o caminho não contiver nenhum separador, ele será buscado em $PATH, caso
contrário, caminhos relativos serão resolvidos para um caminho totalmente
qualificado.

Se você deseja usar múltiplos pós-renderizadores, chame todos eles em um script
ou em qualquer ferramenta binária que você tenha construído. Em bash, isso seria
tão simples quanto `renderer1 | renderer2 | renderer3`.

Você pode ver um exemplo de uso do `kustomize` como pós-renderizador
[aqui](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render).

### Ressalvas

Ao usar pós-renderizadores, existem várias coisas importantes a ter em mente.
A mais importante delas é que, ao usar um pós-renderizador, todas as pessoas
que modificam essa release **DEVEM** usar o mesmo renderizador para ter builds
reprodutíveis. Esta funcionalidade foi propositalmente construída para permitir
que qualquer usuário troque qual renderizador está usando ou pare de usar um
renderizador, mas isso deve ser feito deliberadamente para evitar modificações
acidentais ou perda de dados.

Outra nota importante é sobre segurança. Se você está usando um pós-renderizador,
você deve garantir que ele venha de uma fonte confiável (como é o caso para
qualquer outro executável arbitrário). Usar renderizadores não confiáveis ou não
verificados NÃO é recomendado, pois eles têm acesso completo aos templates
renderizados, que frequentemente contêm dados sensíveis.

### Pós-Renderizadores Personalizados

O passo de pós-renderização oferece ainda mais flexibilidade quando usado no
Go SDK. Qualquer pós-renderizador só precisa implementar a seguinte interface Go:

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Para mais informações sobre como usar o Go SDK, veja a [seção Go SDK](#go-sdk).

## Go SDK

O Helm 3 introduziu um Go SDK completamente reestruturado para uma melhor
experiência ao construir software e ferramentas que aproveitam o Helm.
Documentação completa pode ser encontrada na [Seção Go SDK](/sdk/gosdk.md).

## Backends de armazenamento

O Helm 3 mudou o armazenamento padrão de informações de release para Secrets no
namespace da release. O Helm 2 armazenava por padrão informações de release como
ConfigMaps no namespace da instância do Tiller. As subseções a seguir mostram
como configurar diferentes backends. Esta configuração é baseada na variável de
ambiente `HELM_DRIVER`. Ela pode ser definida como um dos valores:
`[configmap, secret, sql]`.

### Backend de armazenamento ConfigMap

Para habilitar o backend ConfigMap, você precisará definir a variável de ambiente
`HELM_DRIVER` para `configmap`.

Você pode defini-la no shell da seguinte forma:

```shell
export HELM_DRIVER=configmap
```

Se você deseja mudar do backend padrão para o backend ConfigMap, você terá que
fazer a migração por conta própria. Você pode recuperar as informações de
release com o seguinte comando:

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**NOTAS DE PRODUÇÃO**: As informações de release incluem o conteúdo dos charts e
arquivos values, e portanto podem conter dados sensíveis (como senhas, chaves
privadas e outras credenciais) que precisam ser protegidos de acesso não
autorizado. Ao gerenciar autorização no Kubernetes, por exemplo com
[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), é possível
conceder acesso mais amplo a recursos ConfigMap, enquanto restringe acesso a
recursos Secret. Por exemplo, a [role padrão voltada para
usuários](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
"view" concede acesso à maioria dos recursos, mas não a Secrets. Além disso, os
dados de secrets podem ser configurados para [armazenamento
criptografado](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).
Por favor, tenha isso em mente se você decidir mudar para o backend ConfigMap,
pois isso pode expor dados sensíveis da sua aplicação.

### Backend de armazenamento SQL

Existe um backend de armazenamento SQL em ***beta*** que armazena informações de
release em um banco de dados SQL.

Usar tal backend de armazenamento é particularmente útil se suas informações de
release pesam mais de 1MB (nesse caso, não podem ser armazenadas em
ConfigMaps/Secrets devido a limites internos no armazenamento key-value etcd
subjacente do Kubernetes).

Para habilitar o backend SQL, você precisará implantar um banco de dados SQL e
definir a variável de ambiente `HELM_DRIVER` para `sql`. Os detalhes do banco
de dados são definidos com a variável de ambiente
`HELM_DRIVER_SQL_CONNECTION_STRING`.

Você pode defini-las no shell da seguinte forma:

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> Nota: Apenas PostgreSQL é suportado no momento.

**NOTAS DE PRODUÇÃO**: É recomendado:
- Deixar seu banco de dados pronto para produção. Para PostgreSQL, consulte a
documentação de [Administração de Servidor](https://www.postgresql.org/docs/12/admin.html)
para mais detalhes
- Habilitar [gerenciamento de permissões](/topics/permissions_sql_storage_backend.md)
para espelhar o RBAC do Kubernetes para informações de release

Se você deseja mudar do backend padrão para o backend SQL, você terá que fazer a
migração por conta própria. Você pode recuperar as informações de release com o
seguinte comando:

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
