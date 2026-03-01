---
title: helm completion fish
---

Gera scripts de preenchimento automático para o fish

### Sinopse

Gera scripts de preenchimento automático do Helm para o fish shell.

Para carregar o script de preenchimento automático na sessão ativa do fish:

    helm completion fish | source

Para carregar o script para cada nova sessão, execute uma vez:

    helm completion fish > ~/.config/fish/completions/helm.fish

Será necessário iniciar um novo shell para que as modificações tenham efeito.


```
helm completion fish [flags]
```

### Opções

```
  -h, --help              ajuda para o preenchimento automático do fish
      --no-descriptions   desabilita descrições do preenchimento automático
```

### Opções herdadas dos comandos superiores

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           exibe uma saída verbosa
      --kube-apiserver string           o endereço e porta do Kubernetes API server
      --kube-as-group stringArray       o grupo que representará essa operação, esse argumento pode ser repetido para indicar múltiplos grupos
      --kube-as-user string             o usuário que representará essa operação
      --kube-ca-file string             caminho para o certificado para conexão com o Kubernetes API server
      --kube-context string             nome do contexto do kubeconfig a ser usado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será verificado. Isso torna suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a ser usado para validação do certificado do Kubernetes API server. Se não for fornecido, será usado o hostname usado para contatar o servidor
      --kube-token string               bearer token usado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                namespace para essa requisição
      --qps float32                     consultas por segundo usadas na comunicação com a API do Kubernetes, sem incluir bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo os índices de repositório em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm completion](helm_completion.md)	 - gera scripts de preenchimento automático para um shell específico

###### Gerado automaticamente pelo spf13/cobra em 14-Jan-2026
