---
title: 卸载
sidebar_position: 3
---

## 卸载

### 我想删除本地的 Helm，它的文件存放在哪里？

除了 `helm` 二进制文件之外，Helm 还将一些文件存储在以下位置：

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

下表列出了各操作系统上这些目录的默认路径：

| 操作系统 | 缓存路径                    | 配置路径                          | 数据路径                  |
|----------|-----------------------------|---------------------------------|---------------------------|
| Linux    | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS    | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows  | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |
