---
title: Файл .helmignore
description: Файл `.helmignore` используется для указания файлов, которые не должны включаться в ваш чарт.
sidebar_position: 12
---

Файл `.helmignore` используется для указания файлов, которые не должны включаться в ваш чарт.

Если этот файл существует, команда `helm package` при упаковке вашего приложения будет игнорировать все файлы, соответствующие шаблонам, указанным в файле `.helmignore`.

Это помогает избежать включения ненужных или конфиденциальных файлов и директорий в ваш чарт.

Файл `.helmignore` поддерживает шаблоны glob в стиле Unix shell, относительные пути и отрицание (с префиксом !). На каждой строке допускается только один шаблон.

Вот пример файла `.helmignore`:

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

Некоторые важные отличия от .gitignore:
- Синтаксис '**' не поддерживается
- Библиотека для glob-шаблонов — это Go 'filepath.Match', а не fnmatch(3)
- Завершающие пробелы всегда игнорируются (способа их сохранить не предусмотрено)
- Нет поддержки '\!' в качестве специальной начальной последовательности
- Файл `.helmignore` не исключает сам себя по умолчанию — вам нужно явно добавить для него запись `.helmignore`


**Мы будем рады вашей помощи** в улучшении этого документа. Чтобы добавить, исправить или удалить информацию, [создайте issue](https://github.com/helm/helm-www/issues) или отправьте нам pull request.
