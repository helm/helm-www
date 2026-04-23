---
title: The .helmignore file
description: The `.helmignore` file is used to specify files you don't want to include in your helm chart.
sidebar_position: 12
---

The `.helmignore` file is used to specify files you don't want to include in
your helm chart.

If this file exists, Helm commands will ignore all the files that
match the pattern specified in the `.helmignore` file. The ignore file affects
most Helm commands including `helm package`, `helm template` and `helm install`.

This can help in avoiding unnecessary or sensitive files or directories from
being added in your helm chart.

The `.helmignore` file supports Unix shell glob matching, relative path
matching. Only one pattern per line is considered. 

⚠️ The semantics of `.helmignore` are [significantly different to other common ignore files like `.gitignore`](#differences-from-gitignore).

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

## Differences from `.gitignore`

Some notable differences from .gitignore:

- The '**' syntax is not supported.
- **[Negation with `!` is unusable](https://github.com/helm/helm/issues/8688)** - `!file` adds everthing _except_ `file` to the ignore list, rather than removing `file` from the ignore list.
- The globbing library is Go's 'filepath.Match', not fnmatch(3)
- Trailing spaces are always ignored (there is no supported escape sequence)
- There is no support for '\!' as a special leading sequence.
- It does not exclude itself by default, you have to add an explicit entry for `.helmignore`
- evaluation order is reversed vs `.gitignore`

See [HIP 027: Bring .helmignore to parity with .gitignore file targeting syntax](https://github.com/helm/community/blob/main/hips/hip-0027.md) for details.

**We'd love your help** making this document better. To add, correct, or remove
information, [file an issue](https://github.com/helm/helm-www/issues) or send us a
pull request.
