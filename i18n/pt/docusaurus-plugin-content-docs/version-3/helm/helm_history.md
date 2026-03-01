---
title: helm history
---

Exibe o histórico de revisões de uma release

### Sinopse

Esse comando imprime as revisões históricas de uma determinada release.

Por padrão, serão retornadas no máximo 256 revisões. Utilize o argumento '--max'
para configurar o comprimento máximo da lista de revisões retornada.

O histórico de releases é exibido como uma tabela formatada, por exemplo:

    $ helm history angry-bird
    REVISION    UPDATED                     STATUS          CHART             APP VERSION     DESCRIPTION
    1           Mon Oct 3 10:15:13 2016     superseded      alpine-0.1.0      1.0             Initial install
    2           Mon Oct 3 10:15:13 2016     superseded      alpine-0.1.0      1.0             Upgraded successfully
    3           Mon Oct 3 10:15:13 2016     superseded      alpine-0.1.0      1.0             Rolled back to 2
    4           Mon Oct 3 10:15:13 2016     deployed        alpine-0.1.0      1.0             Upgraded successfully


```
helm history RELEASE_NAME [flags]
```

### Opções

```
  -h, --help            exibe ajuda para o comando history
      --max int         número máximo de revisões a incluir no histórico (padrão 256)
  -o, --output format   exibe a saída no formato especificado. Valores permitidos: table, json, yaml (padrão table)
```

### Opções gerais

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída verbosa
      --kube-apiserver string           o endereço e porta do Kubernetes API server
      --kube-as-group stringArray       grupo a representar para a operação, esse argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             usuário a representar para a operação
      --kube-ca-file string             arquivo de autoridade de certificado para conexão com o Kubernetes API server
      --kube-context string             nome do contexto do kubeconfig a usar
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será verificado quanto à validade. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a usar para validação do certificado do Kubernetes API server. Se não fornecido, o hostname usado para contatar o servidor é usado
      --kube-token string               bearer token usado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo do namespace para esta requisição
      --qps float32                     consultas por segundo usadas ao comunicar com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo índices de repositórios em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](/helm/helm.md)	 - O gerenciador de pacotes Helm para o Kubernetes.

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
