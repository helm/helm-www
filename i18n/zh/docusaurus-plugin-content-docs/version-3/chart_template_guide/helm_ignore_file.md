---
title: .helmignore 文件
description: "`.helmignore` 文件用于指定不想包含在 Helm chart 中的文件。"
sidebar_position: 12
---

`.helmignore` 文件用于指定不想包含在 Helm chart 中的文件。

如果该文件存在，`helm package` 命令会在打包应用时忽略所有匹配 `.helmignore` 文件中指定模式的文件。

这有助于避免将不必要或敏感的文件及目录添加到 Helm chart 中。

`.helmignore` 文件支持 Unix shell 通配符匹配、相对路径匹配以及取反匹配（以 ! 作为前缀）。每行只能指定一种模式。

以下是一个 `.helmignore` 文件示例：

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

与 `.gitignore` 的一些显著差异：

- 不支持 `**` 语法。
- globbing 库使用的是 Go 的 `filepath.Match`，而非 fnmatch(3)
- 末尾空格总会被忽略（不支持转义序列）
- 不支持 `\!` 作为特殊的前导序列。
- 默认不会排除自身，需要显式添加 `.helmignore` 条目


**我们需要你的帮助**，让这篇文档更加完善。如需添加、修正或删除信息，请[提交 issue](https://github.com/helm/helm-www/issues) 或发起 pull request。
