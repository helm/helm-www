---
title: helm lint
---

examina um chart em busca de possíveis problemas

### Sinopse

Este comando recebe um caminho para um chart e executa uma série de testes para verificar se o chart está bem-formado.

Se o linter encontrar algo que causará falha na instalação do chart, ele emitirá mensagens de [ERROR]. Se encontrar problemas que quebram convenções ou recomendações, ele emitirá mensagens de [WARNING].


```
helm lint PATH [flags]
```

### Opções

```
  -h, --help                      exibe ajuda para o comando lint
      --kube-version string       versão do Kubernetes utilizada para verificações de capacidades e depreciação
      --quiet                     exibe apenas avisos e erros
      --set stringArray           define valores na linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=val1,key2=val2)
      --set-file stringArray      define valores a partir de arquivos especificados via linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=path1,key2=path2)
      --set-json stringArray      define valores JSON na linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray   define um valor STRING literal na linha de comando
      --set-string stringArray    define valores STRING na linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=val1,key2=val2)
      --skip-schema-validation    se definido, desabilita a validação de JSON schema
      --strict                    falha em avisos do lint
  -f, --values strings            especifica valores em um arquivo YAML ou URL (pode especificar múltiplos)
      --with-subcharts            executa lint nos charts dependentes
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
