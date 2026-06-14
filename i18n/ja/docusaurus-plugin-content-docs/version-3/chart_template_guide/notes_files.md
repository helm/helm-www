---
title: NOTES.txt ファイルの作成
description: chart のユーザーに使い方を伝える方法を解説します。
sidebar_position: 10
---

このセクションでは、chart のユーザーに使い方を伝えるための Helm の機能を紹介します。`helm install` や `helm upgrade` の実行後、Helm はユーザーに役立つ情報を出力できます。この情報はテンプレートを使って自由にカスタマイズできます。

chart にインストール時のメモを追加するには、`templates/NOTES.txt` ファイルを作成します。このファイルはプレーンテキストですが、テンプレートとして処理されるため、通常のテンプレート関数やオブジェクトをすべて利用できます。

それでは、簡単な `NOTES.txt` ファイルを作成してみましょう:

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

`helm install rude-cardinal ./mychart` を実行すると、以下のようなメッセージが末尾に表示されます:

```
RESOURCES:
==> v1/Secret
NAME                   TYPE      DATA      AGE
rude-cardinal-secret   Opaque    1         0s

==> v1/ConfigMap
NAME                      DATA      AGE
rude-cardinal-configmap   3         0s


NOTES:
Thank you for installing mychart.

Your release is named rude-cardinal.

To learn more about the release, try:

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

`NOTES.txt` を活用すれば、新しくインストールした chart の使い方をユーザーに詳しく伝えられます。`NOTES.txt` ファイルの作成は必須ではありませんが、強く推奨します。
