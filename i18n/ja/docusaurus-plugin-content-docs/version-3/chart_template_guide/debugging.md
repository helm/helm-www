---
title: テンプレートのデバッグ
description: デプロイに失敗する chart のトラブルシューティング方法。
sidebar_position: 13
---

テンプレートのデバッグは難しいことがあります。レンダリングされたテンプレートは Kubernetes API サーバーに送信され、フォーマット以外の理由で YAML ファイルが拒否される可能性があるためです。

デバッグに役立つコマンドをいくつか紹介します。

- `helm lint`: chart がベストプラクティスに従っているかを検証する基本ツールです。
- `helm template --debug`: chart テンプレートをローカルでレンダリングしてテストします。
- `helm install --dry-run --debug`: chart をローカルでレンダリングし、インストールは行いません。また、競合するリソースがクラスター上で既に実行されていないかもチェックします。`--dry-run=server` を指定すると、chart 内の `lookup` もサーバーに対して実行されます。
- `helm get manifest`: サーバーにインストールされているテンプレートを確認できます。

YAML のパースに失敗したが、生成された内容を確認したい場合は、テンプレート内の問題箇所をコメントアウトしてから `helm install --dry-run --debug` を再実行する方法があります:

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

上記はコメントを含んだままレンダリングされます:

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

この方法により、YAML パースエラーに妨げられずに生成内容を素早く確認できます。
