---
title: 차트 리포지토리 동기화
description: 로컬 및 원격 차트 리포지토리를 동기화하는 방법
sidebar_position: 2
---

*참고: 이곳의 예제들은 차트 리포지토리를 제공하는*
*Google Cloud Storage (GCS) 버킷에 맞게 작성되었다.*

## 전제 조건
* [gsutil](https://cloud.google.com/storage/docs/gsutil) 툴을 설치해야 한다. *gsutill rsync 기능이 필요하다.*
* 헬름 바이너리에 대한 접근 권한이 있어야 한다.
* _선택 사항: 실수로 파일을 삭제할 경우를 대비하여 GCS 버킷에 [오브젝트 버전 관리](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)를 설정하는 것을 추천한다._

## 로컬 차트 리포지토리 디렉터리 설정
[차트 리포지토리 가이드](/topics/chart_repository.md)에서 한 것처럼 로컬 디렉터리를 만들고, 패키지된 차트를 그 디렉터리로 옮긴다.

예제:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## 업데이트 된 index.yaml 생성
다음과 같이 `helm repo index` 헬름 명령어에 원격 리포지토리의 디렉터리 경로와 URL을 전달하여 
업데이트된 index.yaml 파일을 생성한다.

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
그러면 업데이트된 index.yaml 파일이 생성되고 
`fantastic-charts/` 디렉토리에 위치하게 된다.

## 로컬 및 원격 차트 리포지토리 동기화
`scripts/sync-repo.sh` 명령어에 로컬 디렉터리명과 
GCS 버킷명을 전달하여 디렉터리 컨텐츠를 GCS 버킷에 업로드한다.

예제:
```console
$ pwd
/Users/me/code/go/src/helm.sh/helm
$ scripts/sync-repo.sh fantastic-charts/ fantastic-charts
Getting ready to sync your local directory (fantastic-charts/) to a remote repository at gs://fantastic-charts
Verifying Prerequisites....
Thumbs up! Looks like you have gsutil. Let's continue.
Building synchronization state...
Starting synchronization
Would copy file://fantastic-charts/alpine-0.1.0.tgz to gs://fantastic-charts/alpine-0.1.0.tgz
Would copy file://fantastic-charts/index.yaml to gs://fantastic-charts/index.yaml
Are you sure you would like to continue with these changes?? [y/N]} y
Building synchronization state...
Starting synchronization
Copying file://fantastic-charts/alpine-0.1.0.tgz [Content-Type=application/x-tar]...
Uploading   gs://fantastic-charts/alpine-0.1.0.tgz:              740 B/740 B
Copying file://fantastic-charts/index.yaml [Content-Type=application/octet-stream]...
Uploading   gs://fantastic-charts/index.yaml:                    347 B/347 B
Congratulations your remote chart repository now matches the contents of fantastic-charts/
```
## 차트 리포지토리 업데이트
필요시 차트 리포지토리 컨텐츠의 로컬 복사본을 따로 보관하거나
`gsutil rsync` 를 사용하여 원격 차트 리파지토리 컨텐츠를 로컬 디렉토리에 
복사해 둘 수 있다.

예제:
```console
$ gsutil rsync -d -n gs://bucket-name local-dir/    # the -n flag does a dry run
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gsutil rsync -d gs://bucket-name local-dir/       # performs the copy actions
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```

유용한 링크:
* [gsutil rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description) 에 
  대한 문서
* [차트 리포지토리 가이드](/topics/chart_repository.md)
* Google Cloud Storage의 
  [오브젝트 버전 관리 및 동시성 제어](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)에 
  대한 문서
  
