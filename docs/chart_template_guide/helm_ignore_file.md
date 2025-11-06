---
title: The .helmignore file
description: The `.helmignore` file is used to specify files you don't want to include in your helm chart.
sidebar_position: 12
---

The `.helmignore` file is used to specify files you don't want to include in
your helm chart.

If this file exists, the `helm package` command will ignore all the files that
match the pattern specified in the `.helmignore` file while packaging your
application.

This can help in avoiding unnecessary or sensitive files or directories from
being added in your helm chart.

The `.helmignore` file supports Unix shell glob matching, relative path
matching, and negation (prefixed with !). Only one pattern per line is
considered.

Here is an example `.helmignore` file:

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

Some notable differences from .gitignore:
- The '**' syntax is not supported.
- The globbing library is Go's 'filepath.Match', not fnmatch(3)
- Trailing spaces are always ignored (there is no supported escape sequence)
- There is no support for '\!' as a special leading sequence.
- It does not exclude itself by default, you have to add an explicit entry for `.helmignore`


**We'd love your help** making this document better. To add, correct, or remove
information, [file an issue](https://github.com/helm/helm-www/issues) or send us a
pull request.
