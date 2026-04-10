---
title: Solução de Problemas
sidebar_position: 4
---

## Solução de Problemas

### Estou recebendo um aviso sobre "Unable to get an update from the 'stable' chart repository"

Execute `helm repo list`. Se mostrar que o seu repositório `stable` aponta para uma URL `storage.googleapis.com`, você precisará atualizar esse repositório. Em 13 de novembro de 2020, o repositório de Charts do Helm [deixou de ser suportado](https://github.com/helm/charts#deprecation-timeline) após um ano de depreciação. Um arquivo está disponível em `https://charts.helm.sh/stable`, mas não receberá mais atualizações.

Você pode executar o seguinte comando para corrigir o seu repositório:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

O mesmo vale para o repositório `incubator`, que tem um arquivo disponível em https://charts.helm.sh/incubator.
Você pode executar o seguinte comando para corrigi-lo:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Estou recebendo o aviso 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

O antigo repositório de charts do Google foi substituído por um novo repositório de charts do Helm.

Execute o seguinte comando para corrigir isso permanentemente:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Se você receber um erro semelhante para o `incubator`, execute este comando:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Quando adiciono um repositório Helm, recebo o erro 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Os repositórios de Charts do Helm não são mais suportados após [um período de depreciação de um ano](https://github.com/helm/charts#deprecation-timeline). 
Arquivos desses repositórios estão disponíveis em `https://charts.helm.sh/stable` e `https://charts.helm.sh/incubator`, porém não receberão mais atualizações. O comando
`helm repo add` não permitirá que você adicione as URLs antigas, a menos que especifique `--use-deprecated-repos`.

### No GKE (Google Container Engine) recebo "No SSH tunnels currently open"

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Outra variação da mensagem de erro é:

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

O problema é que o seu arquivo de configuração local do Kubernetes deve ter as credenciais corretas.

Quando você cria um cluster no GKE, ele fornece credenciais, incluindo certificados SSL e autoridades certificadoras. Esses precisam ser armazenados em um arquivo de configuração do Kubernetes (Padrão: `~/.kube/config`) para que `kubectl` e `helm` possam acessá-los.

### Após a migração do Helm 2, `helm list` mostra apenas algumas (ou nenhuma) das minhas releases

Provavelmente você não percebeu que o Helm 3 agora usa namespaces do cluster para definir o escopo das releases. Isso significa que, para todos os comandos que referenciam uma release, você deve:

* usar o namespace atual no contexto ativo do Kubernetes (conforme mostrado pelo comando `kubectl config view --minify`),
* especificar o namespace correto usando a flag `--namespace`/`-n`, ou
* para o comando `helm list`, especificar a flag `--all-namespaces`/`-A`

Isso se aplica a `helm ls`, `helm uninstall` e todos os outros comandos `helm` que referenciam uma release.


### No macOS, o arquivo `/etc/.mdns_debug` é acessado. Por quê?

Temos conhecimento de um caso no macOS em que o Helm tenta acessar um arquivo chamado `/etc/.mdns_debug`. Se o arquivo existir, o Helm mantém o handle do arquivo aberto enquanto executa.

Isso é causado pela biblioteca MDNS do macOS. Ela tenta carregar esse arquivo para ler configurações de depuração (se habilitadas). O handle do arquivo provavelmente não deveria permanecer aberto, e esse problema foi reportado à Apple. No entanto, é o macOS, não o Helm, que causa esse comportamento.

Se você não quiser que o Helm carregue esse arquivo, você pode compilar o Helm como uma biblioteca estática que não usa a pilha de rede do host. Fazer isso aumentará o tamanho do binário do Helm, mas impedirá que o arquivo seja aberto.

Esse problema foi inicialmente sinalizado como um potencial problema de segurança. Mas desde então foi determinado que não há falha ou vulnerabilidade causada por esse comportamento.

### helm repo add falha quando funcionava antes

No Helm 3.3.1 e anteriores, o comando `helm repo add <reponame> <url>` não exibia nenhuma saída se você tentasse adicionar um repositório que já existe. A flag `--no-update` geraria um erro se o repositório já estivesse registrado.

No Helm 3.3.2 e posteriores, uma tentativa de adicionar um repositório existente resultará em erro:

`Error: repository name (reponame) already exists, please specify a different name`

O comportamento padrão agora é invertido. `--no-update` agora é ignorado, enquanto se você quiser substituir (sobrescrever) um repositório existente, você pode usar `--force-update`.

Essa mudança foi feita por motivos de segurança, conforme explicado nas [notas de release do Helm 3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2).

### Habilitando logs do cliente Kubernetes

A impressão de mensagens de log para depuração do cliente Kubernetes pode ser habilitada usando as flags do [klog](https://pkg.go.dev/k8s.io/klog). Usar a flag `-v` para definir o nível de verbosidade será suficiente para a maioria dos casos.

Por exemplo:

```
helm list -v 6
```

### Instalações do Tiller pararam de funcionar e o acesso é negado

As releases do Helm costumavam estar disponíveis em <https://storage.googleapis.com/kubernetes-helm/>. Conforme explicado em ["Announcing get.helm.sh"](https://helm.sh/blog/get-helm-sh/), a localização oficial mudou em junho de 2019. O [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) disponibiliza todas as imagens antigas do Tiller.


Se você está tentando baixar versões mais antigas do Helm do bucket de armazenamento que usava no passado, pode descobrir que elas estão faltando:

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

O [local legado das imagens do Tiller](https://gcr.io/kubernetes-helm/tiller) começou a remoção de imagens em agosto de 2021. Disponibilizamos essas imagens no [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller). Por exemplo, para baixar a versão v2.17.0, substitua:

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

por:

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Para inicializar com o Helm v2.17.0:

`helm init —upgrade`

Ou se uma versão diferente for necessária, use a flag --tiller-image para sobrescrever o local padrão e instalar uma versão específica do Helm v2:

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**Nota:** Os mantenedores do Helm recomendam a migração para uma versão atualmente suportada do Helm. O Helm v2.17.0 foi a release final do Helm v2; o Helm v2 não é mais suportado desde novembro de 2020, conforme detalhado em [Helm 2 and the Charts Project Are Now Unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/). Muitos CVEs foram identificados no Helm desde então, e essas vulnerabilidades são corrigidas no Helm v3, mas nunca serão corrigidas no Helm v2. Consulte a [lista atual de avisos de segurança publicados do Helm](https://github.com/helm/helm/security/advisories?state=published) e faça um plano para [migrar para o Helm v3](/topics/v2_v3_migration.md) hoje.
