---
title: Depurando Templates
description: Solucionando problemas em charts que falham ao fazer deploy.
sidebar_position: 13
---

Depurar templates pode ser complicado porque os templates renderizados são enviados
para o servidor da API do Kubernetes, que pode rejeitar os arquivos YAML por razões
além de formatação.

Existem alguns comandos que podem ajudar você a depurar.

- `helm lint` é sua ferramenta principal para verificar se seu chart segue as
  melhores práticas
- `helm template --debug` testa a renderização dos templates do chart localmente.
- `helm install --dry-run --debug` também renderiza seu chart localmente sem
instalá-lo, mas também verifica se recursos conflitantes já estão em execução
no cluster. Configurar `--dry-run=server` também executará qualquer
`lookup` no seu chart contra o servidor.
- `helm get manifest`: Esta é uma boa maneira de ver quais templates estão instalados
  no servidor.

Quando seu YAML falha ao ser analisado, mas você quer ver o que é gerado, uma
maneira fácil de obter o YAML é comentar a seção problemática no template
e então executar novamente `helm install --dry-run --debug`:

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

O exemplo acima será renderizado e retornado com os comentários intactos:

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

Isso fornece uma maneira rápida de visualizar o conteúdo gerado sem que erros de
análise YAML bloqueiem o processo.
