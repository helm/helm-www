---
title: helm install
---

Instala um chart

### Sinopse


Esse comando instala um chart archive.

O argumento de instalação deve ser uma referência a um chart, um caminho para
um chart empacotado, um caminho para um diretório de chart descompactado ou uma URL.

Para sobrescrever valores em um chart, use o argumento `--values` indicando um arquivo
ou use o argumento `--set` passando configurações pela linha de comando. Para forçar
um valor no formato string use `--set-string`. Você pode usar `--set-file` para definir
valores individuais a partir de um arquivo quando o valor é muito longo para a linha
de comando ou é gerado dinamicamente. Você também pode usar `--set-json` para definir
valores JSON (valores escalares, objetos ou arrays) pela linha de comando.

    $ helm install -f myvalues.yaml myredis ./redis

ou

    $ helm install --set name=prod myredis ./redis

ou

    $ helm install --set-string long_int=1234567890 myredis ./redis

ou

    $ helm install --set-file my_script=dothings.sh myredis ./redis

ou

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


Você pode especificar o argumento `--values`/`-f` várias vezes. A prioridade será dada ao
último arquivo especificado (mais à direita). Por exemplo, se tanto myvalues.yaml quanto override.yaml
contêm uma chave chamada 'Test', o valor definido em override.yaml terá precedência:

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

Você pode especificar o argumento `--set` várias vezes. A prioridade será dada ao
último valor especificado (mais à direita). Por exemplo, se ambos os valores 'bar' e 'newbar' são
definidos para uma chave chamada 'foo', o valor 'newbar' terá precedência:

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

Da mesma forma, no exemplo a seguir 'foo' é definido como '["four"]':

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

E no exemplo a seguir, 'foo' é definido como '{"key1":"value1","key2":"bar"}':

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

Para verificar os manifestos gerados de uma release sem instalar o chart,
os argumentos --debug e --dry-run podem ser combinados.

O argumento --dry-run exibirá todos os manifestos gerados do chart, incluindo Secrets
que podem conter valores sensíveis. Para ocultar Secrets do Kubernetes use o
argumento --hide-secret. Por favor, considere cuidadosamente como e quando usar esses argumentos.

Se --verify for definido, o chart DEVE ter um arquivo de proveniência, e o arquivo
de proveniência DEVE passar em todas as etapas de verificação.

Há seis maneiras diferentes de expressar o chart que você deseja instalar:

1. Por referência do chart: helm install mymaria example/mariadb
2. Por caminho para um chart empacotado: helm install mynginx ./nginx-1.2.3.tgz
3. Por caminho para um diretório de chart descompactado: helm install mynginx ./nginx
4. Por URL absoluta: helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. Por referência do chart e URL do repositório: helm install --repo https://example.com/charts/ mynginx nginx
6. Por registries OCI: helm install mynginx --version 1.2.3 oci://example.com/charts/nginx

REFERÊNCIAS DE CHART

Uma referência de chart é uma forma conveniente de referenciar um chart em um repositório de charts.

Quando você usa uma referência de chart com um prefixo de repositório ('example/mariadb'), o Helm procurará na
configuração local por um repositório de charts chamado 'example', e então procurará um
chart nesse repositório cujo nome é 'mariadb'. Ele instalará a última versão estável desse chart
até que você especifique o argumento '--devel' para também incluir versões de desenvolvimento (releases alfa, beta e candidatas), ou
forneça um número de versão com o argumento '--version'.

Para ver a lista de repositórios de charts, use 'helm repo list'. Para pesquisar
charts em um repositório, use 'helm search'.


```
helm install [NAME] [CHART] [flags]
```

### Opções

```
      --atomic                                     se definido, o processo de instalação exclui a instalação em caso de falha. O argumento --wait será definido automaticamente se --atomic for usado
      --ca-file string                             verifica certificados de servidores habilitados para HTTPS usando este pacote CA
      --cert-file string                           identifica cliente HTTPS usando este arquivo de certificado SSL
      --create-namespace                           cria o namespace da release se não estiver presente
      --dependency-update                          atualiza dependências se estiverem faltando antes de instalar o chart
      --description string                         adiciona uma descrição personalizada
      --devel                                      usa versões de desenvolvimento também. Equivalente a version '>0.0.0-0'. Se --version for definido, isso é ignorado
      --disable-openapi-validation                 se definido, o processo de instalação não validará templates renderizados contra o Kubernetes OpenAPI Schema
      --dry-run string[="client"]                  simula uma instalação. Se --dry-run for definido sem opção especificada ou como '--dry-run=client', não tentará conexões com o cluster. Definir '--dry-run=server' permite tentar conexões com o cluster.
      --enable-dns                                 habilita pesquisas DNS ao renderizar templates
      --force                                      força atualizações de recursos através de uma estratégia de substituição
  -g, --generate-name                              gera o nome (e omite o parâmetro NAME)
  -h, --help                                       ajuda para install
      --hide-notes                                 se definido, não mostra notas na saída de instalação. Não afeta a presença nos metadados do chart
      --hide-secret                                oculta Secrets do Kubernetes quando também estiver usando o argumento --dry-run
      --insecure-skip-tls-verify                   ignora verificações de certificado tls para o download do chart
      --key-file string                            identifica cliente HTTPS usando este arquivo de chave SSL
      --keyring string                             localização das chaves públicas usadas para verificação (padrão "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Labels que seriam adicionados aos metadados da release. Devem ser separados por vírgula. (padrão [])
      --name-template string                       especifica template usado para nomear a release
      --no-hooks                                   impede que hooks sejam executados durante a instalação
  -o, --output format                              imprime a saída no formato especificado. Valores permitidos: table, json, yaml (padrão table)
      --pass-credentials                           passa credenciais para todos os domínios
      --password string                            senha do repositório de charts onde localizar o chart solicitado
      --plain-http                                 usa conexões HTTP inseguras para o download do chart
      --post-renderer postRendererString           o caminho para um executável a ser usado para pós-renderização. Se existir em $PATH, o binário será usado, caso contrário tentará procurar o executável no caminho fornecido
      --post-renderer-args postRendererArgsSlice   um argumento para o post-renderer (pode especificar múltiplos) (padrão [])
      --render-subchart-notes                      se definido, renderiza notas de subcharts junto com o principal
      --replace                                    reutiliza o nome fornecido, apenas se esse nome for uma release excluída que permanece no histórico. Isso não é seguro em produção
      --repo string                                URL do repositório de charts onde localizar o chart solicitado
      --set stringArray                            define valores na linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=val1,key2=val2)
      --set-file stringArray                       define valores a partir dos respectivos arquivos especificados via linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=path1,key2=path2)
      --set-json stringArray                       define valores JSON na linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    define um valor STRING literal na linha de comando
      --set-string stringArray                     define valores STRING na linha de comando (pode especificar múltiplos ou separar valores com vírgulas: key1=val1,key2=val2)
      --skip-crds                                  se definido, nenhum CRD será instalado. Por padrão, CRDs são instalados se ainda não estiverem presentes
      --skip-schema-validation                     se definido, desabilita a validação de JSON schema
      --take-ownership                             se definido, install ignorará a verificação de anotações helm e assumirá a propriedade dos recursos existentes
      --timeout duration                           tempo de espera para qualquer operação individual do Kubernetes (como Jobs para hooks) (padrão 5m0s)
      --username string                            nome de usuário do repositório de charts onde localizar o chart solicitado
  -f, --values strings                             especifica valores em um arquivo YAML ou uma URL (pode especificar múltiplos)
      --verify                                     verifica o pacote antes de usá-lo
      --version string                             especifica uma restrição de versão para a versão do chart a usar. Esta restrição pode ser uma tag específica (ex: 1.1.1) ou pode referenciar um intervalo válido (ex: ^2.0.0). Se não especificado, a última versão é usada
      --wait                                       se definido, esperará até que todos os Pods, PVCs, Services e número mínimo de Pods de um Deployment, StatefulSet ou ReplicaSet estejam em estado pronto antes de marcar a release como bem-sucedida. Esperará pelo tempo definido em --timeout
      --wait-for-jobs                              se definido e --wait habilitado, esperará até que todos os Jobs sejam completados antes de marcar a release como bem-sucedida. Esperará pelo tempo definido em --timeout
```

### Opções herdadas dos comandos superiores

```
      --burst-limit int                 limite de throttling padrão do lado do cliente (padrão 100)
      --debug                           habilita saída detalhada
      --kube-apiserver string           o endereço e a porta do Kubernetes API server
      --kube-as-group stringArray       grupo a representar para a operação, este argumento pode ser repetido para especificar múltiplos grupos.
      --kube-as-user string             nome de usuário a representar para a operação
      --kube-ca-file string             o arquivo de autoridade de certificação para a conexão com o Kubernetes API server
      --kube-context string             nome do contexto kubeconfig a usar
      --kube-insecure-skip-tls-verify   se verdadeiro, o certificado do Kubernetes API server não será verificado quanto à validade. Isso tornará suas conexões HTTPS inseguras
      --kube-tls-server-name string     nome do servidor a usar para validação de certificado do Kubernetes API server. Se não fornecido, o hostname usado para contatar o servidor é usado
      --kube-token string               bearer token usado para autenticação
      --kubeconfig string               caminho para o arquivo kubeconfig
  -n, --namespace string                escopo de namespace para esta requisição
      --qps float32                     consultas por segundo usadas ao comunicar com a API do Kubernetes, não incluindo bursting
      --registry-config string          caminho para o arquivo de configuração do registry (padrão "~/.config/helm/registry/config.json")
      --repository-cache string         caminho para o diretório contendo índices de repositório em cache (padrão "~/.cache/helm/repository")
      --repository-config string        caminho para o arquivo contendo nomes e URLs de repositórios (padrão "~/.config/helm/repositories.yaml")
```

### Veja também

* [helm](/helm/helm.md)	 - O gerenciador de pacotes Helm para Kubernetes.

###### Gerado automaticamente por spf13/cobra em 14-Jan-2026
