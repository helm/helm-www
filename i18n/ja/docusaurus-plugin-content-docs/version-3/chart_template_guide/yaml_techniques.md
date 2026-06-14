---
title: "付録: YAML テクニック"
description: YAML 仕様と Helm での活用方法について詳しく解説します。
sidebar_position: 15
---

このガイドでは主にテンプレート言語について説明してきました。ここでは、YAML フォーマットについて見ていきます。YAML には、テンプレート作成者として活用できる便利な機能があり、テンプレートでのエラーを減らし、読みやすくすることができます。

## スカラーとコレクション

[YAML 仕様](https://yaml.org/spec/1.2/spec.html)によると、コレクションには 2 種類あり、スカラー型は多数あります。

コレクションの 2 種類は、マップとシーケンスです:

```yaml
map:
  one: 1
  two: 2
  three: 3

sequence:
  - one
  - two
  - three
```

スカラー値は（コレクションとは対照的に）個々の値です。

### YAML のスカラー型

Helm の YAML 方言では、値のスカラーデータ型は、リソース定義の Kubernetes スキーマを含む複雑なルールセットによって決定されます。ただし、型を推論する際には、以下のルールが一般的に当てはまります。

整数または浮動小数点数が引用符なしの単語の場合、通常は数値型として扱われます:

```yaml
count: 1
size: 2.34
```

ただし、引用符で囲むと、文字列として扱われます:

```yaml
count: "1" # <-- string, not int
size: '2.34' # <-- string, not float
```

ブール値も同様です:

```yaml
isGood: true   # bool
answer: "true" # string
```

空の値を表す単語は `null` です（`nil` ではありません）。

`port: "80"` は有効な YAML であり、テンプレートエンジンと YAML パーサーの両方を通過しますが、Kubernetes が `port` を整数として期待している場合は失敗することに注意してください。

場合によっては、YAML ノードタグを使用して特定の型推論を強制できます:

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

上記では、`!!str` は `age` が整数のように見えても文字列であることをパーサーに伝えます。また、`port` は引用符で囲まれていても整数として扱われます。


## YAML の文字列

YAML ドキュメントに配置するデータの多くは文字列です。YAML には文字列を表現する方法が複数あります。このセクションでは、その方法を説明し、いくつかの使用方法を示します。

文字列を宣言する「インライン」の方法は 3 つあります:

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

すべてのインラインスタイルは 1 行で記述する必要があります。

- ベアワード（引用符なしの語）はエスケープされません。そのため、使用する文字に注意が必要です。
- ダブルクォート文字列では、`\` で特定の文字をエスケープできます。例: `"\"Hello\", she said"`。`\n` で改行をエスケープできます。
- シングルクォート文字列は「リテラル」文字列であり、`\` を使用して文字をエスケープしません。唯一のエスケープシーケンスは `''` で、これは単一の `'` にデコードされます。

1 行の文字列に加えて、複数行の文字列を宣言できます:

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

上記では、`coffee` の値は `Latte\nCappuccino\nEspresso\n` と同等の単一の文字列として扱われます。

`|` の後の最初の行は正しくインデントされている必要があることに注意してください。次のようにすると上記の例は壊れます:

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

`Latte` のインデントが正しくないため、次のようなエラーが発生します:

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

テンプレートでは、上記のエラーを防ぐために、保護用のダミー行を最初に配置しておくと安全な場合があります:

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

最初の行が何であれ、文字列の出力に保持されることに注意してください。たとえば、この技法を使用してファイルの内容を ConfigMap に挿入する場合、コメントはそのエントリを読み取るものが期待する形式である必要があります。

### 複数行文字列の空白制御

上記の例では、`|` を使用して複数行文字列を示しました。しかし、文字列の内容の末尾に `\n` が付いていることに注意してください。YAML プロセッサに末尾の改行を削除させたい場合は、`|` の後に `-` を追加できます:

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

これで `coffee` の値は `Latte\nCappuccino\nEspresso` になります（末尾の `\n` なし）。

逆に、すべての末尾の空白を保持したい場合もあります。これは `|+` 記法で実現できます:

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

これで `coffee` の値は `Latte\nCappuccino\nEspresso\n\n\n` になります。

テキストブロック内のインデントは保持され、改行も保持されます:

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

上記の場合、`coffee` は `Latte\n  12 oz\n  16 oz\nCappuccino\nEspresso` になります。

### インデントとテンプレート

テンプレートを記述するとき、ファイルの内容をテンプレートに挿入したい場合があります。前の章で見たように、これを行う方法は 2 つあります:

- `{{ .Files.Get "FILENAME" }}` を使用して chart 内のファイルの内容を取得する。
- `{{ include "TEMPLATE" . }}` を使用してテンプレートをレンダリングし、その内容を chart に配置する。

ファイルを YAML に挿入する場合、上記の複数行ルールを理解することが重要です。多くの場合、静的ファイルを挿入する最も簡単な方法は次のようなものです:

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

上記のインデントの方法に注意してください: `indent 2` はテンプレートエンジンに「myfile.txt」のすべての行を 2 つのスペースでインデントするよう指示します。テンプレート行自体はインデントしないことに注意してください。インデントすると、最初の行のファイル内容が 2 回インデントされてしまいます。

### 折りたたみ複数行文字列

YAML で文字列を複数行で表現したいが、解釈時には 1 つの長い行として扱いたい場合があります。これは「折りたたみ」と呼ばれます。折りたたみブロックを宣言するには、`|` の代わりに `>` を使用します:

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

上記の `coffee` の値は `Latte Cappuccino Espresso\n` になります。最後の改行を除くすべてがスペースに変換されることに注意してください。空白制御を折りたたみテキストマーカーと組み合わせることができるため、`>-` はすべての改行を置き換えるか削除します。

折りたたみ構文では、テキストをインデントすると行が保持されることに注意してください。

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

上記は `Latte\n  12 oz\n  16 oz\nCappuccino Espresso` を生成します。スペースと改行の両方がまだ残っていることに注意してください。

## 1 つのファイルに複数のドキュメントを埋め込む

1 つのファイルに複数の YAML ドキュメントを配置することができます。これは、新しいドキュメントの前に `---` を付け、ドキュメントの終わりに `...` を付けることで行います。

```yaml

---
document: 1
...
---
document: 2
...
```

多くの場合、`---` または `...` のいずれかを省略できます。

Helm の一部のファイルには複数のドキュメントを含めることができません。たとえば、`values.yaml` ファイル内に複数のドキュメントが提供されている場合、最初のドキュメントのみが使用されます。

ただし、テンプレートファイルには複数のドキュメントを含めることができます。この場合、ファイル（およびそのすべてのドキュメント）はテンプレートレンダリング中に 1 つのオブジェクトとして扱われます。ただし、結果の YAML は Kubernetes に渡される前に複数のドキュメントに分割されます。

複数ドキュメントの使用は、本当に必要な場合に限ることを推奨します。ファイルに複数のドキュメントがあると、デバッグが困難になる可能性があります。

## YAML は JSON のスーパーセット

YAML は JSON のスーパーセットであるため、有効な JSON ドキュメントは_有効な_ YAML でもあるはずです。

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

上記は、以下を表現する別の方法です:

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

そして、2 つを（注意して）混合することもできます:

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]
```

これら 3 つはすべて同じ内部表現にパースされるはずです。

つまり、`values.yaml` などのファイルには JSON データを含めることができますが、Helm はファイル拡張子 `.json` を有効なサフィックスとして扱いません。

## YAML アンカー

YAML 仕様では、値への参照を保存し、後でその値を参照によって参照する方法が提供されています。YAML ではこれを「アンカー」と呼びます:

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

上記では、`&favoriteCoffee` が `Cappuccino` への参照を設定します。後で、その参照は `*favoriteCoffee` として使用されます。したがって、`coffees` は `Latte, Cappuccino, Espresso` になります。

アンカーが役立つケースはいくつかありますが、気づきにくいバグを引き起こす可能性がある点が 1 つあります: YAML が最初に読み込まれるとき、参照は展開されてから破棄されます。

したがって、上記の例をデコードしてから再エンコードすると、結果の YAML は次のようになります:

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

Helm と Kubernetes は YAML ファイルを読み取り、変更し、再書き込みすることが多いため、アンカーは失われます。
