---
title: helm rollback
---

Reverte uma release para uma revisão anterior

### Sinopse

Esse comando reverte uma release para uma revisão anterior.

O primeiro argumento do comando rollback é o nome de uma release, e o
segundo é o número de uma revisão (versão). Se esse argumento for omitido
ou definido como 0, a release será revertida para a revisão anterior.

Para ver os números de revisão, execute 'helm history RELEASE'.


```
helm rollback <RELEASE> [REVISION] [flags]
```

### Opções

```
      --cleanup-on-fail    permite a exclusão de novos recursos criados neste rollback quando o rollback falhar
      --dry-run            simula um rollback
      --force              força atualização de recursos através de exclusão/recriação se necessário
  -h, --help               exibe ajuda para o comando rollback
      --history-max int    limita o número máximo de revisões salvas por release. Use 0 para sem limite (padrão 10)
      --no-hooks           impede a execução de hooks durante o rollback
      --recreate-pods      reinicia os pods do recurso se aplicável
      --timeout duration   tempo de espera para qualquer operação individual do Kubernetes (como Jobs para hooks) (padrão 5m0s)
      --wait               se configurado, esperará até todos os Pods, PVCs, Services e um número mínimo de Pods de um Deployment, StatefulSet ou ReplicaSet estejam em estado pronto antes de marcar a release como bem-sucedida. Esperará pelo tempo definido em --timeout
      --wait-for-jobs      se configurado e --wait habilitado, esperará até todos os Jobs serem completados antes de marcar a release como bem-sucedida. Esperará pelo tempo definido em --timeout
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
