---
title: helm uninstall
---

Desinstala uma release

### Sinopse

Esse comando recebe o nome de uma release e a desinstala.

Ele remove todos os recursos associados à última release do chart,
assim como o histórico da release, liberando-o para uso futuro.

Use o argumento '--dry-run' para visualizar quais releases serão desinstaladas
sem realmente desinstalá-las.


```
helm uninstall RELEASE_NAME [...] [flags]
```

### Opções

```
      --cascade string       Deve ser "background", "orphan" ou "foreground". Seleciona a estratégia de exclusão em cascata para os dependentes. O padrão é background. (padrão "background")
      --description string   adiciona uma descrição personalizada
      --dry-run              simula uma desinstalação
  -h, --help                 exibe ajuda para o comando uninstall
      --ignore-not-found     Trata "release not found" como uma desinstalação bem-sucedida
      --keep-history         remove todos os recursos associados e marca a release como deletada, mas mantém o histórico da release
      --no-hooks             evita que hooks sejam executados durante a desinstalação
      --timeout duration     tempo de espera para qualquer operação individual do Kubernetes (como Jobs para hooks) (padrão 5m0s)
      --wait                 se configurado, esperará até que todos os recursos sejam deletados antes de retornar. Esperará pelo tempo definido em --timeout
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
