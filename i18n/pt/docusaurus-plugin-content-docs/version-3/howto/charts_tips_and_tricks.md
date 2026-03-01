---
title: Dicas e Truques de Desenvolvimento de Charts
description: Cobre algumas das dicas e truques que desenvolvedores de charts do Helm aprenderam enquanto criavam charts de qualidade para produção.
sidebar_position: 1
---

Este guia cobre algumas das dicas e truques que desenvolvedores de charts do Helm
aprenderam enquanto criavam charts de qualidade para produção.

## Conheça as Funções de Template

O Helm usa [Go templates](https://godoc.org/text/template) para criar templates
dos seus arquivos de recursos. Embora o Go já inclua várias funções nativas,
adicionamos muitas outras.

Primeiro, adicionamos todas as funções da [biblioteca
Sprig](https://masterminds.github.io/sprig/), exceto `env` e `expandenv`, por
razões de segurança.

Também adicionamos duas funções especiais de template: `include` e `required`. A
função `include` permite trazer outro template e então passar os resultados para
outras funções de template.

Por exemplo, este trecho de template inclui um template chamado `mytpl`, então
converte o resultado para minúsculas e o envolve em aspas duplas.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

A função `required` permite declarar uma entrada de valores específica como
obrigatória para a renderização do template. Se o valor estiver vazio, a
renderização do template falhará com uma mensagem de erro enviada pelo usuário.

O exemplo a seguir da função `required` declara que uma entrada para
`.Values.who` é obrigatória, e exibirá uma mensagem de erro quando essa entrada
estiver ausente:

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## Use Aspas em Strings, Não em Inteiros

Quando você está trabalhando com dados de string, é sempre mais seguro colocar
aspas nas strings do que deixá-las sem:

```yaml
name: {{ .Values.MyName | quote }}
```

Mas quando estiver trabalhando com inteiros, _não coloque aspas nos valores._
Isso pode, em muitos casos, causar erros de parsing dentro do Kubernetes.

```yaml
port: {{ .Values.Port }}
```

Esta observação não se aplica a valores de variáveis de ambiente que são
esperados como strings, mesmo quando representam inteiros:

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## Usando a Função 'include'

O Go fornece uma maneira de incluir um template em outro usando a diretiva
nativa `template`. No entanto, a função nativa não pode ser usada em pipelines
de template do Go.

Para tornar possível incluir um template e então realizar uma operação na saída
desse template, o Helm tem uma função especial `include`:

```
{{ include "toYaml" $value | indent 2 }}
```

O código acima inclui um template chamado `toYaml`, passa `$value` para ele, e
então passa a saída desse template para a função `indent`.

Como o YAML atribui significado aos níveis de indentação e espaços em branco,
esta é uma ótima maneira de incluir trechos de código, enquanto manipula a
indentação em um contexto relevante.

## Usando a Função 'required'

O Go fornece uma maneira de definir opções de template para controlar o
comportamento quando um mapa é indexado com uma chave que não está presente no
mapa. Isso é tipicamente configurado com `template.Options("missingkey=option")`,
onde `option` pode ser `default`, `zero` ou `error`. Embora definir esta opção
como error vá parar a execução com um erro, isso se aplicaria a cada chave
ausente no mapa. Pode haver situações em que um desenvolvedor de chart queira
impor esse comportamento para valores selecionados no arquivo `values.yaml`.

A função `required` dá aos desenvolvedores a capacidade de declarar uma entrada
de valor como obrigatória para a renderização do template. Se a entrada estiver
vazia em `values.yaml`, o template não será renderizado e retornará uma mensagem
de erro fornecida pelo desenvolvedor.

Por exemplo:

```
{{ required "A valid foo is required!" .Values.foo }}
```

O código acima renderizará o template quando `.Values.foo` estiver definido, mas
falhará na renderização e sairá quando `.Values.foo` estiver indefinido.

## Usando a Função 'tpl'

A função `tpl` permite que desenvolvedores avaliem strings como templates dentro
de um template. Isso é útil para passar uma string de template como valor para
um chart ou renderizar arquivos de configuração externos. Sintaxe:
`{{ tpl TEMPLATE_STRING VALUES }}`

Exemplos:

```yaml
# values
template: "{{ .Values.name }}"
name: "Tom"

# template
{{ tpl .Values.template . }}

# output
Tom
```

Renderizando um arquivo de configuração externo:

```yaml
# external configuration file conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# values
firstName: Peter
lastName: Parker

# template
{{ tpl (.Files.Get "conf/app.conf") . }}

# output
firstName=Peter
lastName=Parker
```

## Criando Image Pull Secrets

Image pull secrets são essencialmente uma combinação de _registry_, _username_ e
_password_. Você pode precisar deles em uma aplicação que está implantando, mas
para criá-los é necessário executar `base64` algumas vezes. Podemos escrever um
template auxiliar para compor o arquivo de configuração do Docker para uso como
payload do Secret. Aqui está um exemplo:

Primeiro, assuma que as credenciais estão definidas no arquivo `values.yaml`
assim:

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

Em seguida, definimos nosso template auxiliar assim:

```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

Finalmente, usamos o template auxiliar em um template maior para criar o
manifesto do Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Reiniciando Deployments Automaticamente

Muitas vezes ConfigMaps ou Secrets são injetados como arquivos de configuração
em containers ou existem outras mudanças de dependências externas que exigem
reiniciar pods. Dependendo da aplicação, uma reinicialização pode ser necessária
se eles forem atualizados com um subsequente `helm upgrade`, mas se a spec do
deployment em si não mudou, a aplicação continua executando com a configuração
antiga, resultando em um deployment inconsistente.

A função `sha256sum` pode ser usada para garantir que a seção de annotations de
um deployment seja atualizada se outro arquivo mudar:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

NOTA: Se você está adicionando isso a um library chart, você não conseguirá
acessar seu arquivo em `$.Template.BasePath`. Em vez disso, você pode referenciar
sua definição com `{{ include ("mylibchart.configmap") . | sha256sum }}`.

No caso de você sempre querer reiniciar seu deployment, você pode usar um passo
de annotation similar ao acima, substituindo por uma string aleatória para que
ela sempre mude e cause a reinicialização do deployment:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

Cada invocação da função de template gerará uma string aleatória única. Isso
significa que se for necessário sincronizar as strings aleatórias usadas por
múltiplos recursos, todos os recursos relevantes precisarão estar no mesmo
arquivo de template.

Ambos os métodos permitem que seu Deployment aproveite a lógica de estratégia de
atualização nativa para evitar downtime.

NOTA: No passado, recomendávamos usar a flag `--recreate-pods` como outra opção.
Esta flag foi marcada como obsoleta no Helm 3 em favor do método declarativo
acima.

## Instruindo o Helm a Não Desinstalar um Recurso

Às vezes existem recursos que não devem ser desinstalados quando o Helm executa
um `helm uninstall`. Desenvolvedores de chart podem adicionar uma annotation a
um recurso para prevenir que ele seja desinstalado.

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
[...]
```

A annotation `helm.sh/resource-policy: keep` instrui o Helm a pular a exclusão
deste recurso quando uma operação do helm (como `helm uninstall`, `helm upgrade`
ou `helm rollback`) resultaria em sua exclusão. _No entanto_, este recurso se
torna órfão. O Helm não o gerenciará mais de forma alguma. Isso pode levar a
problemas se usar `helm install --replace` em uma release que já foi
desinstalada, mas manteve recursos.

## Usando "Partials" e Template Includes

Às vezes você quer criar algumas partes reutilizáveis em seu chart, sejam elas
blocos ou partials de template. E frequentemente, é mais limpo mantê-los em seus
próprios arquivos.

No diretório `templates/`, qualquer arquivo que começa com um underscore (`_`)
não é esperado que produza um arquivo de manifesto Kubernetes. Então, por
convenção, templates auxiliares e partials são colocados em um arquivo
`_helpers.tpl`.

## Charts Complexos com Muitas Dependências

Muitos dos charts no [Artifact Hub](https://artifacthub.io/packages/search?kind=0)
da CNCF são "blocos de construção" para criar aplicações mais avançadas. Mas
charts podem ser usados para criar instâncias de aplicações em grande escala.
Nesses casos, um único chart guarda-chuva pode ter múltiplos subcharts, cada um
funcionando como uma peça do todo.

A prática recomendada atual para compor uma aplicação complexa a partir de
partes discretas é criar um chart guarda-chuva de nível superior que expõe as
configurações globais, e então usar o subdiretório `charts/` para incorporar
cada um dos componentes.

## YAML é um Superset de JSON

De acordo com a especificação YAML, YAML é um superset de JSON. Isso significa
que qualquer estrutura JSON válida deveria ser válida em YAML.

Isso tem uma vantagem: Às vezes, desenvolvedores de template podem achar mais
fácil expressar uma estrutura de dados com uma sintaxe similar ao JSON em vez de
lidar com a sensibilidade de espaços em branco do YAML.

Como melhor prática, templates devem seguir uma sintaxe similar ao YAML _a menos
que_ a sintaxe JSON reduza substancialmente o risco de um problema de formatação.

## Cuidado ao Gerar Valores Aleatórios

Existem funções no Helm que permitem gerar dados aleatórios, chaves
criptográficas, e assim por diante. São boas para usar. Mas esteja ciente de que
durante upgrades, os templates são re-executados. Quando uma execução de
template gera dados que diferem da última execução, isso acionará uma atualização
desse recurso.

## Instalar ou Atualizar uma Release com um Único Comando

O Helm fornece uma maneira de realizar um install-or-upgrade como um único
comando. Use `helm upgrade` com o comando `--install`. Isso fará com que o Helm
verifique se a release já está instalada. Se não estiver, ele executará um
install. Se estiver, então a release existente será atualizada.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
