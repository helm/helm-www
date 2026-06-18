---
title: helm list
---

lista as releases

### Sinopse

Este comando lista todas as releases de um namespace especificado (utiliza o namespace do contexto atual se nenhum namespace for especificado).

Por padrão, lista apenas releases que estão implantadas (deployed) ou com falha (failed). Argumentos como '--uninstalled' e '--all' alteram este comportamento. Esses argumentos podem ser combinados: '--uninstalled --failed'.

Por padrão, os itens são ordenados alfabeticamente. Utilize o argumento '-d' para ordenar por data da release.

Se o argumento --filter for fornecido, ele será tratado como um filtro. Filtros são expressões regulares (compatíveis com Perl) que são aplicadas à lista de releases. Apenas itens que correspondam ao filtro serão retornados.

    $ helm list --filter 'ara[a-z]+'
    NAME                UPDATED                                  CHART
    maudlin-arachnid    2020-06-18 14:17:46.125134977 +0000 UTC  alpine-0.1.0

Se nenhum resultado for encontrado, 'helm list' retornará com código 0, mas sem saída (ou, no caso de não utilizar o argumento '-q', apenas os cabeçalhos).

Por padrão, podem ser retornados até 256 itens. Para limitar isso, utilize o argumento '--max'. Definir '--max' como 0 não retornará todos os resultados. Em vez disso, retornará o padrão do servidor, que pode ser muito maior que 256. Combinar o argumento '--max' com o argumento '--offset' permite paginar os resultados.


```
helm list [flags]
```

### Opções

```
  -a, --all                  exibe todas as releases sem nenhum filtro aplicado
  -A, --all-namespaces       lista releases em todos os namespaces
  -d, --date                 ordena por data da release
      --deployed             exibe releases implantadas. Se nenhuma outra opção for especificada, esta será habilitada automaticamente
      --failed               exibe releases com falha
  -f, --filter string        uma expressão regular (compatível com Perl). Qualquer release que corresponda à expressão será incluída nos resultados
  -h, --help                 exibe ajuda para o comando list
  -m, --max int              número máximo de releases a buscar (padrão 256)
      --no-headers           não exibe cabeçalhos ao utilizar o formato de saída padrão
      --offset int           próximo índice de release na lista, utilizado para deslocar do valor inicial
  -o, --output format        imprime a saída no formato especificado. Valores permitidos: table, json, yaml (padrão table)
      --pending              exibe releases pendentes
  -r, --reverse              inverte a ordem de classificação
  -l, --selector string      seletor (consulta de label) para filtrar, suporta '=', '==', e '!='.(ex.: -l key1=value1,key2=value2). Funciona apenas para backends de armazenamento secret (padrão) e configmap.
  -q, --short                formato de saída resumido
      --superseded           exibe releases substituídas
      --time-format string   formata a hora utilizando o formatador de tempo do golang. Exemplo: --time-format "2006-01-02 15:04:05Z0700"
      --uninstalled          exibe releases desinstaladas (se 'helm uninstall --keep-history' foi utilizado)
      --uninstalling         exibe releases que estão sendo desinstaladas no momento
```

### Opções herdadas dos comandos superiores

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída detalhada
      --kube-apiserver string           endereço e porta do servidor da API do Kubernetes
      --kube-as-group stringArray       grupo a ser representado para a operação, este argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             nome de usuário a ser representado para a operação
      --kube-ca-file string             arquivo de autoridade de certificação para a conexão com o servidor da API do Kubernetes
      --kube-context string             nome do contexto kubeconfig a ser utilizado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do servidor da API do Kubernetes não será verificado. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a ser utilizado para validação do certificado do servidor da API do Kubernetes. Se não for fornecido, será utilizado o hostname usado para contatar o servidor
      --kube-token string               bearer token utilizado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo de namespace para esta requisição
      --qps float32                     consultas por segundo utilizadas na comunicação com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo os índices de repositório em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### VEJA TAMBÉM

* [helm](./helm.md)	 - O gerenciador de pacotes Helm para Kubernetes.

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
