---
title: 삭제
sidebar_position: 3
---

## 삭제

### 로컬 헬름을 삭제하고 싶어요. 그 파일들은 모두 어디에 있나요?

`helm` 바이너리 외에도 헬름은 일부 파일을 다음 위치에 저장합니다:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

다음 표는 운영 체제별 각 항목의 기본 폴더를 보여줍니다:

| 운영 체제 | 캐시 경로                   | 설정 경로                        | 데이터 경로               |
|-----------|-----------------------------|---------------------------------|---------------------------|
| Linux     | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS     | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows   | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |
