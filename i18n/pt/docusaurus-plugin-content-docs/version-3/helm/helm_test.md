---
title: helm test
---

Executa os testes de uma release

### Sinopse

O comando test executa os testes de uma release.

Este comando recebe como argumento o nome de uma release implantada.
Os testes executados são definidos no chart que foi instalado.

```
helm test [RELEASE] [flags]
```

### Opções

```
      --filter strings     especifica testes por atributo (atualmente "name") usando a sintaxe atributo=valor ou '!atributo=valor' para excluir um teste (pode especificar múltiplos ou separar valores com vírgulas: name=test1,name=test2)
  -h, --help               ajuda para test
      --hide-notes         se definido, não mostra notas na saída do teste. Não afeta a presença nos metadados do chart
      --logs               exibe os logs dos pods de teste (isso é executado após todos os testes serem concluídos, mas antes de qualquer limpeza)
      --timeout duration   tempo de espera para qualquer operação individual do Kubernetes (como Jobs para hooks) (padrão 5m0s)
```

### Opções herdadas dos comandos superiores

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída detalhada
      --kube-apiserver string           o endereço e a porta para o servidor da API do Kubernetes
      --kube-as-group stringArray       grupo a ser personificado para a operação, este argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             nome de usuário a ser personificado para a operação
      --kube-ca-file string             o arquivo de autoridade certificadora para a conexão com o servidor da API do Kubernetes
      --kube-context string             nome do contexto kubeconfig a ser utilizado
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do servidor da API do Kubernetes não será verificado quanto à validade. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a ser utilizado para validação do certificado do servidor da API do Kubernetes. Se não for fornecido, o hostname utilizado para contatar o servidor será usado
      --kube-token string               token bearer utilizado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo do namespace para esta solicitação
      --qps float32                     consultas por segundo utilizadas ao comunicar com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo índices de repositórios em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja Também

* [helm](/helm/helm.md) - Helm, o gerenciador de pacotes para o Kubernetes.

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
