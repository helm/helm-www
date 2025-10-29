---
title: .helmignore 文件
description: "`.helmignore` 文件用来指定你不想包含在你的helm chart中的文件。"
sidebar_position: 13
---

`.helmignore` 文件用来指定你不想包含在你的helm chart中的文件。

如果该文件存在，`helm package` 命令会在打包应用时忽略所有在`.helmignore`文件中匹配的文件。

这有助于避免不需要的或敏感文件及目录添加到你的helm chart中。

`.helmignore` 文件支持Unix shell的全局匹配，相对路径匹配，以及反向匹配（以！作为前缀）。每行只考虑一种模式。

这里是一个`.helmignore`文件示例：

```shell
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

一些值得注意的和.gitignore不同之处：

- 不支持'**'语法。
- globbing库是Go的 'filepath.Match'，不是fnmatch(3)
- 末尾空格总会被忽略(不支持转义序列)
- 不支持'\!'作为特殊的引导序列
- 默认不会排除自身，需要显式添加 `.helmignore`

**我们需要你的帮助** 使该文档更好。添加、修正或移除信息， [提交问题](https://github.com/helm/helm-www/issues) 或者发起PR。
