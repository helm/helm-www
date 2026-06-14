---
title: helm completion powershell
---

Gera o script de preenchimento automático para o powershell

### Sinopse

Gera o script de preenchimento automático para o powershell.

Para carregar o preenchimento automático na sessão atual do shell:

    PS C:\> helm completion powershell | Out-String | Invoke-Expression

Para carregar o preenchimento automático para cada nova sessão, adicione a saída do
comando acima ao seu perfil do powershell.


```
helm completion powershell [flags]
```

### Opções

```
  -h, --help              ajuda para o powershell
      --no-descriptions   desabilita descrições do preenchimento automático
```

### Opções herdadas dos comandos superiores

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída detalhada
      --kube-apiserver string           o endereço e a porta do Kubernetes API server
      --kube-as-group stringArray       grupo a ser representado para a operação, esse argumento pode ser repetido para especificar múltiplos grupos
      --kube-as-user string             usuário a ser representado para a operação
      --kube-ca-file string             o arquivo de autoridade de certificação para conexão com o Kubernetes API server
      --kube-context string             nome do contexto do kubeconfig a ser usado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será verificado. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a ser usado para validação do certificado do Kubernetes API server. Se não for fornecido, o hostname usado para contatar o servidor será usado
      --kube-token string               bearer token usado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo do namespace para essa requisição
      --qps float32                     consultas por segundo usadas na comunicação com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo os índices do repositório em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs dos repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja também

* [helm completion](helm_completion.md)	 - gera scripts de preenchimento automático para o shell especificado

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
