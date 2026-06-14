---
title: helm verify
---

verifica se um chart no caminho especificado foi assinado e é válido

### Sinopse


Verifica se o chart fornecido possui um arquivo de proveniência válido.

Arquivos de proveniência fornecem verificação criptográfica de que um chart não foi
adulterado e foi empacotado por um provedor confiável.

Este comando pode ser usado para verificar um chart local. Vários outros comandos fornecem
flags '--verify' que executam a mesma validação. Para gerar um pacote assinado, use
o comando 'helm package --sign'.


```
helm verify PATH [flags]
```

### Opções

```
  -h, --help             ajuda para verify
      --keyring string   keyring contendo chaves públicas (padrão "~/.gnupg/pubring.gpg")
```

### Opções gerais

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída verbosa
      --kube-apiserver string           o endereço e porta do Kubernetes API server
      --kube-as-group stringArray       grupo a representar para a operação, esta flag pode ser repetida para especificar múltiplos grupos.
      --kube-as-user string             nome de usuário a representar para a operação
      --kube-ca-file string             o arquivo de autoridade certificadora para conexão com o Kubernetes API server
      --kube-context string             nome do contexto do kubeconfig a ser usado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será verificado quanto à validade. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a ser usado para validação do certificado do Kubernetes API server. Se não for fornecido, será usado o hostname utilizado para contactar o servidor
      --kube-token string               bearer token usado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo de namespace para esta requisição
      --qps float32                     consultas por segundo usadas na comunicação com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo os índices de repositório em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs dos repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](/helm/helm.md)	 - O gerenciador de pacotes Helm para Kubernetes.

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
