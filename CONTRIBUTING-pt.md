# Diretrizes de Contribuição

Este é o guia de contribuição para o site e documentação do Helm.sh. Acesse [helm/helm](https://github.com/helm/helm/blob/main/CONTRIBUTING.md) para o projeto principal.

---

O Helm aceita contribuições por meio de pull requests no GitHub. Este documento descreve o processo para ajudar a aceitar sua contribuição.

## Relatando um Problema de Segurança

Na maioria das vezes, quando você encontra um bug no Helm, ele deve ser relatado usando [issues do GitHub](https://github.com/helm/helm/issues). No entanto, se você estiver relatando uma _vulnerabilidade de segurança_, envie um relatório por e-mail para [cncf-kubernetes-helm-security@lists.cncf.io](mailto:cncf-kubernetes-helm-security@lists.cncf.io). Isso nos dará a chance de tentar corrigir o problema antes que ele seja explorado.

## Assine seu Trabalho

O "sign-off" é uma linha simples no final da explicação de um commit. Todos os commits precisam ser assinados. Sua assinatura certifica que você escreveu o patch ou tem o direito de contribuir com o material. As regras são bastante simples, se você pode se certificar lendo o seguinte guia (de [developercertificate.org](https://developercertificate.org/)):

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
1 Letterman Drive
Suite D4700
San Francisco, CA, 94129

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

Em seguida, você apenas adiciona uma linha a cada mensagem de commit do git:

    Signed-off-by: Joe Smith <joe.smith@example.com>

Use seu nome real (desculpe, não são permitidos pseudônimos ou contribuições anônimas).

Se você configurar suas informações `user.name` e `user.email` no git, você pode assinar seu
commit automaticamente com `git commit -s`.

Observação: Se suas informações de configuração do git estiverem corretamente definidas, a visualização
das informações do `git log` para o seu commit será semelhante a isso:

```
Author: Joe Smith <joe.smith@example.com>
Date:   Thu Feb 2 11:41:15 2018 -0800

    Update README

    Signed-off-by: Joe Smith <joe.smith@example.com>
```

Observe que as linhas `Author` e `Signed-off-by` correspondem. Se elas não corresponderem,
seu PR será rejeitado pela verificação automatizada do DCO.

## Canais de Suporte

Seja você um usuário ou contribuidor, os canais oficiais de suporte incluem:

- [Issues](https://github.com/helm/helm/issues)
- Slack:
    - Usuários: [#helm-users](https://kubernetes.slack.com/messages/C0NH30761/details/)
    - Contribuidores: [#helm-dev](https://kubernetes.slack.com/messages/C51E88VDG/)

Antes de abrir um novo problema ou enviar uma nova solicitação de pull, é útil pesquisar no projeto - é provável que outro usuário já tenha relatado o problema que você está enfrentando, ou é um problema conhecido do qual já estamos cientes. Também vale a pena perguntar nos canais do Slack.

## Problemas

Problemas são usados como o método principal para rastrear qualquer coisa relacionada ao projeto Helm.

### Tipos de Problemas

Existem 5 tipos de problemas (cada um com sua própria [etiqueta](#etiquetas) correspondente):

- `pergunta/suporte`: São perguntas de suporte ou funcionalidade que queremos ter um registro para referência futura. Geralmente, essas são perguntas que são muito complexas ou grandes para serem armazenadas no canal Slack ou têm interesse particular para a comunidade como um todo. Dependendo da discussão, elas podem se tornar problemas de `funcionalidade` ou `bug`.
- `proposta`: Usado para itens (como este) que propõem novas ideias ou funcionalidades que requerem uma discussão maior na comunidade. Isso permite feedback de outras pessoas da comunidade antes que uma funcionalidade seja realmente desenvolvida. Isso não é necessário para pequenas adições. A decisão final sobre se uma funcionalidade precisa de uma proposta cabe aos mantenedores principais. Todos os problemas que são propostas devem ter tanto uma etiqueta quanto um título de problema de "Proposta: [o restante do título]". Uma proposta pode se tornar uma `funcionalidade` e não requer um marco.
- `funcionalidade`: Rastreiam solicitações e ideias de funcionalidades específicas até que sejam concluídas. Elas podem evoluir a partir de uma `proposta` ou podem ser enviadas individualmente, dependendo do tamanho.
- `bug`: Rastreiam bugs no código.
- `docs`: Rastreiam problemas com a documentação (por exemplo, faltando ou incompleta).

### Ciclo de Vida do Problema

O ciclo de vida do problema é principalmente conduzido pelos mantenedores principais, mas é uma informação importante para aqueles que contribuem para o Helm. Todos os tipos de problemas seguem o mesmo ciclo de vida geral. As diferenças são observadas abaixo.

1. Criação do problema
2. Triagem
    - O mantenedor responsável pela triagem aplicará as etiquetas apropriadas para o problema. Isso inclui etiquetas de prioridade, tipo e metadados (como `good first issue`). A única prioridade de problema que rastrearemos é se o problema é "crítico" ou não. Se forem necessários níveis adicionais no futuro, os adicionaremos.
    - (Se necessário) Limpe o título para declarar sucintamente e claramente o problema. Além disso, certifique-se de que as propostas sejam precedidas por "Proposta: [o restante do título]".
    - Adicione o problema à marco correto. Se surgirem dúvidas, não se preocupe em adicionar o problema a um marco até que as perguntas sejam respondidas.
    - Tentamos fazer esse processo pelo menos uma vez por dia de trabalho.
3. Discussão
    - Problemas rotulados como `feature` ou `bug` devem estar conectados à PR que os resolve.
    - Quem estiver trabalhando em um problema `feature` ou `bug` (seja um mantenedor ou alguém da comunidade) deve atribuir o problema a si mesmo ou fazer um comentário no problema informando que está assumindo.
    - Problemas de `proposal` e `support/question` devem permanecer abertos até serem resolvidos ou se não tiverem sido ativos por mais de 30 dias. Isso ajudará a manter a fila de problemas em um tamanho gerenciável e reduzir o ruído. Caso o problema precise permanecer aberto, a etiqueta `keep open` pode ser adicionada.
4. Encerramento do problema

## Como Contribuir com um Patch

1. Se você ainda não o fez, assine um Acordo de Licença do Contribuidor (veja os detalhes acima).
2. Faça um fork do repositório desejado, desenvolva e teste suas alterações de código.
3. Envie uma pull request.

As convenções e padrões de codificação são explicados na [documentação oficial para desenvolvedores](https://helm.sh/docs/developers/).

## Pull Requests

Como qualquer bom projeto de código aberto, usamos Pull Requests (PRs) para rastrear alterações de código.

### Ciclo de Vida do PR

1. Criação do PR
    - Os PRs geralmente são criados para corrigir ou ser um subconjunto de outros PRs que corrigem um problema específico.
    - Aceitamos PRs que estão em andamento. Eles são uma ótima maneira de acompanhar o trabalho importante que está em andamento, mas útil para que outros vejam. Se um PR estiver em andamento, ele **deve** ser precedido por "WIP: [título]". Assim que o PR estiver pronto para revisão, remova "WIP" do título.
    - É preferível, mas não obrigatório, ter um PR vinculado a um problema específico. Pode haver circunstâncias em que, se for uma correção rápida, um problema pode ser excessivo. Os detalhes fornecidos na descrição do PR seriam suficientes nesse caso.
2. Triagem
    - O mantenedor responsável pela triagem aplicará as etiquetas apropriadas para o problema. Isso deve incluir pelo menos uma etiqueta de tamanho, `bug` ou `feature`, e `awaiting review` assim que todas as etiquetas forem aplicadas. Consulte a seção [Etiquetas](#labels) para obter detalhes completos sobre as definições das etiquetas.
    - Adicione o PR ao marco correto. Isso deve ser o mesmo que o problema que o PR fecha.
3. Atribuição de revisões
    - Assim que uma revisão tiver a etiqueta `awaiting review`, os mantenedores as revisarão conforme a programação permitir. O mantenedor que assume o problema deve solicitar uma revisão a si mesmo.
    - Qualquer PR com a etiqueta `size/large` requer 2 aprovações de revisão de mantenedores antes de poder ser mesclado. Aqueles com `size/medium` ou `size/small` são a critério dos mantenedores.
4. Revisão/Discussão
    - Todas as revisões serão concluídas usando a ferramenta de revisão do GitHub.
    - Uma revisão "Comentário" deve ser usada quando houver perguntas sobre o código que devem ser respondidas, mas que não envolvem alterações de código. Esse tipo de revisão não conta como aprovação.
    - Uma revisão "Alterações Solicitadas" indica que alterações no código precisam ser feitas antes que elas sejam mescladas.
    - Os revisores devem atualizar as etiquetas conforme necessário (como `needs rebase`).
5. Responda aos comentários respondendo perguntas ou alterando o código.
6. LGTM (Looks good to me)
    - Assim que um Revisor concluir uma revisão e o código parecer pronto para ser mesclado, uma revisão "Aprovar" é usada para sinalizar ao contribuidor e a outros mantenedores que você revisou o código e acredita que ele está pronto para ser mesclado.
7. Mesclar ou fechar
    - Os PRs devem permanecer abertos até serem mesclados ou se não tiverem sido ativos por mais de 30 dias. Isso ajudará a manter a fila de PRs em um tamanho gerenciável e reduzir o ruído. Caso o PR precise permanecer aberto (como no caso de um WIP), a etiqueta `keep open` pode ser adicionada.
    - Antes de mesclar um PR, consulte o tópico sobre [Etiquetas de Tamanho](#size-labels) abaixo para determinar se o PR requer mais de um LGTM para ser mesclado.
    - Se o proprietário do PR estiver listado no arquivo `OWNERS`, esse usuário **deve** mesclar seus próprios PRs ou solicitar explicitamente que outro OWNER o faça por eles.
    - Se o proprietário de um PR _não_ estiver listado em `OWNERS`, qualquer mantenedor principal pode mesclar o PR.

#### PRs de Documentação

Os PRs de documentação seguirão o mesmo ciclo de vida que outros PRs. Eles também serão rotulados com a etiqueta `docs`. Para a documentação, será dada atenção especial à ortografia, gramática e clareza (enquanto essas coisas não são *tão* importantes para comentários em código).

## O Triager

A cada semana, um dos mantenedores principais será designado como "triager" a partir das reuniões públicas de stand-up às quintas-feiras. Essa pessoa será responsável por triar novos PRs e problemas ao longo da semana de trabalho.

## Etiquetas

As tabelas a seguir definem todos os tipos de etiquetas usadas para o Helm. Elas são divididas por categoria.

### Comuns

| Etiqueta | Descrição |
| -------- | --------- |
| `bug` | Marca um problema como um bug ou um PR como uma correção de bug |
| `critical` | Marca um problema ou PR como crítico. Isso significa que abordar o PR ou problema é uma prioridade máxima e deve ser resolvido o mais rápido possível |
| `docs` | Indica que o problema ou PR é uma alteração de documentação |
| `feature` | Marca o problema como uma solicitação de recurso ou um PR como uma implementação de recurso |
| `keep open` | Indica que o problema ou PR deve ser mantido aberto após 30 dias de inatividade |
| `refactor` | Indica que o problema é uma refatoração de código e não está corrigindo um bug ou adicionando funcionalidade adicional |

### Específico do Problema

| Etiqueta | Descrição |
| -------- | --------- |
| `help wanted` | Marca um problema que precisa de ajuda da comunidade para ser resolvido |
| `proposal` | Marca um problema como uma proposta |
| `question/support` | Marca um problema como uma solicitação de suporte ou pergunta |
| `good first issue` | Marca um problema como um bom problema inicial para alguém novo no Helm |
| `wont fix` | Marca um problema como discutido e não será implementado (ou aceito no caso de uma proposta) |

### Específico do PR

| Etiqueta | Descrição |
| -------- | --------- |
| `awaiting review` | Indica que um PR foi triado e está pronto para ser revisado |
| `breaking` | Indica que um PR tem alterações que quebram (como alterações de API) |
| `in progress` | Indica que um mantenedor está analisando o PR, mesmo que nenhuma revisão tenha sido publicada ainda |
| `needs rebase` | Indica que um PR precisa ser rebaseado antes de poder ser mesclado |
| `needs pick` | Indica que um PR precisa ser cherry-picked em um branch de recurso (geralmente branches de correção de bugs). Depois de feito, a etiqueta `picked` deve ser aplicada e esta removida |
| `picked` | Este PR foi cherry-picked em um branch de recurso |

#### Etiquetas de Tamanho

As etiquetas de tamanho são usadas para indicar o quão "perigoso" um PR é. As diretrizes abaixo são usadas para atribuir as etiquetas, mas, em última análise, isso pode ser alterado pelos mantenedores. Por exemplo, mesmo que um PR faça apenas 30 linhas de alterações em 1 arquivo, mas altere uma funcionalidade-chave, provavelmente será rotulado como `size/L` porque requer a aprovação de várias pessoas. Por outro lado, um PR que adiciona um pequeno recurso, mas requer mais 150 linhas de testes para cobrir todos os casos, pode ser rotulado como `size/S`, mesmo que o número de linhas seja maior do que o definido abaixo.

Os PRs enviados por um mantenedor principal, independentemente do tamanho, requerem apenas a aprovação de mais um mantenedor. Isso garante que haja pelo menos dois mantenedores cientes de quaisquer PRs significativos introduzidos no código.

| Etiqueta | Descrição |
| -------- | --------- |
| `size/XS` | Indica um PR que altera de 0 a 9 linhas, ignorando arquivos gerados. Poucos testes podem ser necessários, dependendo da alteração. |
| `size/S` | Indica um PR que altera de 10 a 29 linhas, ignorando arquivos gerados. Apenas pequenas quantidades de testes manuais podem ser necessárias. |
| `size/M` | Indica um PR que altera de 30 a 99 linhas, ignorando arquivos gerados. A validação manual deve ser necessária. |
| `size/L` | Indica um PR que altera de 100 a 499 linhas, ignorando arquivos gerados. Isso deve ser testado minuciosamente antes da mesclagem e sempre requer 2 aprovações. |
| `size/XL` | Indica um PR que altera de 500 a 999 linhas, ignorando arquivos gerados. Isso deve ser testado minuciosamente antes da mesclagem e sempre requer 2 aprovações. |
| `size/XXL` | Indica um PR que altera 1000+ linhas, ignorando arquivos gerados. Isso deve ser testado minuciosamente antes da mesclagem e sempre requer 2 aprovações. |
