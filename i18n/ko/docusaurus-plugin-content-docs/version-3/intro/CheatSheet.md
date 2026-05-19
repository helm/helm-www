---
title: 치트 시트
description: Helm 치트 시트
sidebar_position: 4
---

Helm을 통해 애플리케이션을 관리하는 데 필요한 모든 명령어를 담은 치트 시트입니다.

-----------------------------------------------------------------------------------------------------------------------------------------------
### 기본 해석/맥락

Chart:
- pull하여 압축 해제한 차트의 이름입니다.
- 저장소는 추가했지만 차트를 pull하지 않은 경우 <repo_name>/<chart_name> 형식입니다.
- 차트의 URL 또는 절대 경로입니다.

Name:
- 현재 Helm 차트 설치에 부여할 이름입니다.

Release:
- 설치 인스턴스에 할당한 이름입니다.

Revision:
- Helm history 명령어에서 확인할 수 있는 값입니다.

Repo-name:
- 저장소의 이름입니다.

DIR:
- 디렉토리 이름 또는 경로입니다.

------------------------------------------------------------------------------------------------------------------------------------------------

### 차트 관리

```bash
helm create <name>                      # 차트에서 사용되는 공통 파일 및 디렉토리와 함께 차트 디렉토리를 생성합니다.
helm package <chart-path>               # 차트를 버전이 지정된 차트 아카이브 파일로 패키징합니다.
helm lint <chart>                       # 차트를 검사하고 가능한 문제를 식별하는 테스트를 실행합니다.
helm show all <chart>                   # 차트를 검사하고 내용을 나열합니다.
helm show values <chart>                # values.yaml 파일의 내용을 표시합니다.
helm pull <chart>                       # 차트를 다운로드/pull 합니다.
helm pull <chart> --untar=true          # true로 설정하면 다운로드 후 차트 압축을 해제합니다.
helm pull <chart> --verify              # 사용 전에 패키지를 검증합니다.
helm pull <chart> --version <number>    # 기본값은 최신 버전이며, 사용할 차트 버전에 대한 버전 제약을 지정합니다.
helm dependency list <chart>            # 차트의 의존성 목록을 표시합니다.
```
--------------------------------------------------------------------------------------------------------------------------------------------------

### 애플리케이션 설치 및 제거

```bash
helm install <name> <chart>                           # 이름을 지정하여 차트를 설치합니다.
helm install <name> <chart> --namespace <namespace>   # 특정 네임스페이스에 차트를 설치합니다.
helm install <name> <chart> --set key1=val1,key2=val2 # 명령줄에서 값을 설정합니다 (여러 값을 쉼표로 구분하여 지정 가능).
helm install <name> <chart> --values <yaml-file/url>  # 지정한 값으로 차트를 설치합니다.
helm install <name> <chart> --dry-run --debug         # 차트를 검증하기 위한 테스트 설치를 실행합니다.
helm install <name> <chart> --verify                  # 사용 전에 패키지를 검증합니다.
helm install <name> <chart> --dependency-update       # 차트 설치 전에 누락된 의존성을 업데이트합니다.
helm uninstall <name>                                 # 현재(기본) 네임스페이스에서 릴리스를 제거합니다.
helm uninstall <release-name> --namespace <namespace> # 지정된 네임스페이스에서 릴리스를 제거합니다.
```
------------------------------------------------------------------------------------------------------------------------------------------------
### 애플리케이션 업그레이드 및 롤백

```bash
helm upgrade <release> <chart>                            # 릴리스를 업그레이드합니다.
helm upgrade <release> <chart> --rollback-on-failure      # 설정 시, 업그레이드 실패 시 변경 사항을 롤백합니다.
helm upgrade <release> <chart> --dependency-update        # 차트 설치 전에 누락된 의존성을 업데이트합니다.
helm upgrade <release> <chart> --version <version_number> # 사용할 차트 버전에 대한 버전 제약을 지정합니다.
helm upgrade <release> <chart> --values                   # YAML 파일 또는 URL로 값을 지정합니다 (여러 개 지정 가능).
helm upgrade <release> <chart> --set key1=val1,key2=val2  # 명령줄에서 값을 설정합니다 (여러 값 지정 가능).
helm upgrade <release> <chart> --force                    # 교체 전략을 통해 리소스를 강제 업데이트합니다.
helm rollback <release> <revision>                        # 릴리스를 특정 리비전으로 롤백합니다.
helm rollback <release> <revision>  --cleanup-on-fail     # 롤백 실패 시 이 롤백에서 생성된 새 리소스 삭제를 허용합니다.
```
------------------------------------------------------------------------------------------------------------------------------------------------
### 저장소 목록 조회, 추가, 삭제 및 업데이트

```bash
helm repo add <repo-name> <url>   # 인터넷에서 저장소를 추가합니다.
helm repo list                    # 추가된 차트 저장소를 나열합니다.
helm repo update                  # 차트 저장소에서 사용 가능한 차트 정보를 로컬에서 업데이트합니다.
helm repo remove <repo_name>      # 하나 이상의 차트 저장소를 제거합니다.
helm repo index <DIR>             # 현재 디렉토리를 읽고 발견된 차트를 기반으로 인덱스 파일을 생성합니다.
helm repo index <DIR> --merge     # 생성된 인덱스를 기존 인덱스 파일과 병합합니다.
helm search repo <keyword>        # 차트에서 키워드로 저장소를 검색합니다.
helm search hub <keyword>         # Artifact Hub 또는 사용자 허브 인스턴스에서 차트를 검색합니다.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Helm 릴리스 모니터링

```bash
helm list                       # 지정된 네임스페이스의 모든 릴리스를 나열합니다. 네임스페이스를 지정하지 않으면 현재 네임스페이스 컨텍스트를 사용합니다.
helm list --all                 # 필터 없이 모든 릴리스를 표시합니다. -a 사용 가능합니다.
helm list --all-namespaces      # 모든 네임스페이스의 릴리스를 나열합니다. -A 사용 가능합니다.
helm list -l key1=value1,key2=value2 # 필터링할 셀렉터(레이블 쿼리)입니다. '=', '==', '!='를 지원합니다.
helm list --date                # 릴리스 날짜로 정렬합니다.
helm list --deployed            # 배포된 릴리스를 표시합니다. 다른 옵션이 지정되지 않으면 자동으로 활성화됩니다.
helm list --pending             # 대기 중인 릴리스를 표시합니다.
helm list --failed              # 실패한 릴리스를 표시합니다.
helm list --uninstalled         # 제거된 릴리스를 표시합니다 ('helm uninstall --keep-history'를 사용한 경우).
helm list --superseded          # 대체된 릴리스를 표시합니다.
helm list -o yaml               # 지정된 형식으로 출력합니다. 허용 값: table, json, yaml (기본값 table).
helm status <release>           # 지정된 릴리스의 상태를 표시합니다.
helm status <release> --revision <number>   # 설정 시, 지정된 리비전의 릴리스 상태를 표시합니다.
helm history <release>          # 지정된 릴리스의 히스토리 리비전을 표시합니다.
helm env                        # Helm에서 사용 중인 모든 환경 정보를 출력합니다.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### 릴리스 정보 다운로드

```bash
helm get all <release>      # 지정된 릴리스의 notes, hooks, 제공된 values, 생성된 manifest 파일에 대한 사람이 읽을 수 있는 정보 모음입니다.
helm get hooks <release>    # 지정된 릴리스의 hooks를 다운로드합니다. Hooks는 YAML 형식이며 YAML '---\n' 구분자로 분리됩니다.
helm get manifest <release> # manifest는 이 릴리스의 차트에서 생성된 Kubernetes 리소스의 YAML 인코딩 표현입니다. 차트가 다른 차트에 의존하는 경우 해당 리소스도 manifest에 포함됩니다.
helm get notes <release>    # 지정된 릴리스의 차트에서 제공하는 notes를 표시합니다.
helm get values <release>   # 지정된 릴리스의 values 파일을 다운로드합니다. 출력 형식을 지정하려면 -o를 사용합니다.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### 플러그인 관리

```bash
helm plugin install <path/url>      # 플러그인을 설치합니다.
helm plugin list                    # 설치된 모든 플러그인 목록을 봅니다.
helm plugin update <plugin>         # 플러그인을 업데이트합니다.
helm plugin uninstall <plugin>      # 플러그인을 제거합니다.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
