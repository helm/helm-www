---
title: Instalação
sidebar_position: 2
---

## Instalação

### Por que não existem pacotes nativos do Helm para Fedora e outras distribuições Linux?

O projeto Helm não mantém pacotes para sistemas operacionais e ambientes. A comunidade do Helm pode fornecer pacotes nativos e, se o projeto Helm tiver conhecimento deles, serão listados. Foi assim que a fórmula do Homebrew foi criada e listada. Se você tiver interesse em manter um pacote, adoraríamos isso.

### Por que vocês fornecem um script `curl ...|bash`?

Existe um script em nosso repositório (`scripts/get-helm-3`) que pode ser executado como um script `curl ..|bash`. As transferências são todas protegidas por HTTPS, e o script faz algumas verificações nos pacotes que baixa. No entanto, o script tem os riscos típicos de qualquer script de shell.

Nós o fornecemos porque é útil, mas sugerimos que os usuários leiam o script cuidadosamente primeiro. O que realmente gostaríamos, porém, são versões do Helm mais bem empacotadas.

### Como coloco os arquivos do cliente Helm em um local diferente dos padrões?

O Helm usa a estrutura XDG para armazenar arquivos. Existem variáveis de ambiente que você pode usar para substituir esses locais:

- `$XDG_CACHE_HOME`: define um local alternativo para armazenar arquivos em cache.
- `$XDG_CONFIG_HOME`: define um local alternativo para armazenar a configuração do Helm.
- `$XDG_DATA_HOME`: define um local alternativo para armazenar dados do Helm.

Note que, se você tiver repositórios existentes, precisará adicioná-los novamente com `helm repo add...`.
