---
title: helm version
---

exibe a versão do cliente

### Sinopse

Exibe a versão do Helm.

Este comando exibirá uma representação da versão do Helm.
A saída será algo como:

version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a", GitTreeState:"clean", GoVersion:"go1.13.10"}

- Version é a versão semântica da release.
- GitCommit é o SHA do commit a partir do qual esta versão foi construída.
- GitTreeState é "clean" se não havia alterações locais no código quando este binário foi
  construído, e "dirty" se o binário foi construído a partir de código modificado localmente.
- GoVersion é a versão do Go utilizada para compilar o Helm.

Ao utilizar a flag `--template`, as seguintes propriedades estão disponíveis para uso
no template:

- .Version contém a versão semântica do Helm
- .GitCommit é o commit git
- .GitTreeState é o estado da árvore git quando o Helm foi construído
- .GoVersion contém a versão do Go com a qual o Helm foi compilado

Por exemplo, `--template='Version: {{.Version}}'` produz a saída 'Version: v3.2.1'.


```
helm version [flags]
```

### Opções

```
  -h, --help              ajuda para version
      --short             exibe o número da versão
      --template string   template para o formato da string de versão
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
