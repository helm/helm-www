---
title: O arquivo .helmignore
description: O arquivo `.helmignore` é usado para especificar arquivos que você não deseja incluir no seu chart Helm.
sidebar_position: 12
---

O arquivo `.helmignore` é usado para especificar arquivos que você não deseja
incluir no seu chart Helm.

Se este arquivo existir, o comando `helm package` ignorará todos os arquivos que
corresponderem aos padrões especificados no `.helmignore` ao empacotar sua
aplicação.

Isso ajuda a evitar que arquivos ou diretórios desnecessários ou sensíveis
sejam adicionados ao seu chart.

O arquivo `.helmignore` suporta padrões glob do shell Unix, correspondência
de caminhos relativos e negação (prefixada com !). Apenas um padrão por linha é
considerado.

Aqui está um exemplo de arquivo `.helmignore`:

```
# comment

# Match any file or path named .helmignore
.helmignore

# Match any file or path named .git
.git

# Match any text file
*.txt

# Match only directories named mydir
mydir/

# Match only text files in the top-level directory
/*.txt

# Match only the file foo.txt in the top-level directory
/foo.txt

# Match any file named ab.txt, ac.txt, or ad.txt
a[b-d].txt

# Match any file under subdir matching temp*
*/temp*

*/*/temp*
temp?
```

Algumas diferenças notáveis em relação ao .gitignore:
- A sintaxe '**' não é suportada.
- A biblioteca de globbing é `filepath.Match` do Go, não fnmatch(3)
- Espaços em branco no final são sempre ignorados (não há sequência de escape para preservá-los)
- Não há suporte para '\!' como sequência especial inicial.
- O arquivo não se exclui automaticamente; você precisa adicionar uma entrada explícita para `.helmignore`


**Adoraríamos sua ajuda** para melhorar este documento. Para adicionar, corrigir
ou remover informações, [abra uma issue](https://github.com/helm/helm-www/issues)
ou envie-nos um pull request.
