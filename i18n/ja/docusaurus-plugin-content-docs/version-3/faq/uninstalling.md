---
title: アンインストール
sidebar_position: 3
---

## アンインストール

### Helm をローカルから削除したい場合、関連ファイルはどこにありますか？

`helm` バイナリ本体のほか、Helm は以下の場所にもファイルを保存しています:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

上記の各環境変数に対応するデフォルトフォルダは、OS ごとに以下のとおりです:

| オペレーティングシステム | キャッシュパス                  | 設定パス                          | データパス                 |
|--------------------------|--------------------------------|----------------------------------|---------------------------|
| Linux                    | `$HOME/.cache/helm `           | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS                    | `$HOME/Library/Caches/helm`    | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows                  | `%TEMP%\helm  `                | `%APPDATA%\helm `                | `%APPDATA%\helm`          |
