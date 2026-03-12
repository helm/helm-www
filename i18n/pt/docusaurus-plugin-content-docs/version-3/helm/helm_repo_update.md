---
title: helm repo update
---

atualiza informações de charts disponíveis localmente a partir dos repositórios de charts

### Sinopse

O comando update obtém as informações mais recentes sobre charts dos respectivos repositórios de charts.
As informações são armazenadas em cache localmente, onde são utilizadas por comandos como 'helm search'.

Você pode opcionalmente especificar uma lista de repositórios que deseja atualizar.
	$ helm repo update <repo_name> ...
Para atualizar todos os repositórios, use 'helm repo update'.


```
helm repo update [REPO1 [REPO2 ...]] [flags]
```

### Opções

```
      --fail-on-repo-update-fail   a atualização falha se qualquer uma das atualizações de repositório falhar
  -h, --help                       exibe ajuda para o comando update
      --timeout duration           tempo de espera para o download do arquivo de índice ser concluído (padrão 2m0s)
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

* [helm repo](./helm_repo.md)	 - adiciona, lista, remove, atualiza e indexa repositórios de charts

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
