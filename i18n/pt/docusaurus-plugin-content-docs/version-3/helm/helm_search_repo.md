---
title: helm search repo
---

pesquisa repositórios por uma palavra-chave em charts

### Sinopse

O comando search percorre todos os repositórios configurados no sistema e
procura por correspondências. A pesquisa desses repositórios utiliza os
metadados armazenados no sistema.

Serão exibidas as últimas versões estáveis dos charts encontrados. Se você
especificar o argumento --devel, a saída incluirá versões de pré-lançamento.
Se você deseja pesquisar usando uma restrição de versão, use --version.

Exemplos:

    # Pesquisa por versões de release estáveis correspondentes à palavra-chave "nginx"
    $ helm search repo nginx

    # Pesquisa por versões de release correspondentes à palavra-chave "nginx", incluindo versões de pré-lançamento
    $ helm search repo nginx --devel

    # Pesquisa pela última versão estável do nginx-ingress com uma versão major 1
    $ helm search repo nginx-ingress --version ^1.0.0

Repositórios são gerenciados com os comandos 'helm repo'.


```
helm search repo [keyword] [flags]
```

### Opções

```
      --devel                utiliza versões de desenvolvimento (alfa, beta e release candidates). Equivalente a versão '>0.0.0-0'. Se --version for definido, este argumento é ignorado
      --fail-on-no-result    a pesquisa falha se nenhum resultado for encontrado
  -h, --help                 exibe ajuda para o comando repo
      --max-col-width uint   largura máxima das colunas na tabela de saída (padrão 50)
  -o, --output format        exibe a saída no formato especificado. Valores permitidos: table, json, yaml (padrão table)
  -r, --regexp               utiliza expressões regulares para pesquisar nos repositórios que você adicionou
      --version string       pesquisa usando restrições de versionamento semântico nos repositórios que você adicionou
  -l, --versions             exibe a listagem completa, com cada versão de cada chart em sua própria linha, para os repositórios que você adicionou
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

* [helm search](./helm_search.md)	 - pesquisa por uma palavra-chave em charts

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
