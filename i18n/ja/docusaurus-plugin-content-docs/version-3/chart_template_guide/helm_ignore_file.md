---
title: .helmignore ファイル
description: `.helmignore` ファイルは、Helm chart に含めたくないファイルを指定するために使用します。
sidebar_position: 12
---

`.helmignore` ファイルは、Helm chart に含めたくないファイルを指定するために使用します。

このファイルが存在する場合、`helm package` コマンドはアプリケーションをパッケージ化する際に `.helmignore` ファイルで指定されたパターンに一致するすべてのファイルを無視します。

これにより、不要なファイルや機密性の高いファイル、ディレクトリが Helm chart に含まれることを防ぐことができます。

`.helmignore` ファイルは、Unix シェルの glob マッチング、相対パスマッチング、および否定（先頭に ! を付ける）をサポートしています。1 行につき 1 つのパターンのみ認識されます。

以下は `.helmignore` ファイルの例です:

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

.gitignore との主な違いは以下のとおりです:
- `**` 構文はサポートされていません。
- glob ライブラリは fnmatch(3) ではなく、Go の `filepath.Match` を使用しています。
- 末尾のスペースは常に無視されます（エスケープシーケンスはサポートされていません）。
- `\!` を特別な先頭シーケンスとして使用することはできません。
- `.helmignore` ファイルはデフォルトでは自身を除外しないため、明示的にエントリを追加する必要があります。


**このドキュメントの改善にご協力ください。** 情報の追加、修正、削除については、[issue を作成する](https://github.com/helm/helm-www/issues)か、プルリクエストを送信してください。
