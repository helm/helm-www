---
title: NOTES.txt 파일 작성하기
description: 차트 사용자에게 설명서를 제공하는 방법
sidebar_position: 10
---

이 섹션에서는 차트 사용자에게 지침을 제공하는 헬름의 도구들을 살펴본다.
`helm install` 이나 `helm upgrade` 가 끝나면, 
헬름은 사용자에게 유용한 정보들을 출력할 수 있다. 
이 정보는 템플릿을 사용하여 많은 부분을 커스터마이징할 수 있다.

차트에 설치 메모를 추가하기 위해, 간단하게 `templates/NOTES.txt` 
파일을 생성한다. 이 파일은 평범한 텍스트이지만, 템플릿처럼 처리되며 
모든 일반 템플릿 기능과 객체를 사용할 수 있다.

간단히 `NOTES.txt` 파일을 생성한다.

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

이제 `helm install rude-cardinal ./mychart` 를 실행하면 하단에 이런 메세지가 
표시된다.

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

이러한 방식으로 `NOTES.txt` 를 사용하면 새로 설치된 차트를 
사용하는 방법에 대한 자세한 정보를 사용자에게 제공할 수 있다. 필수는 아니지만, 
`NOTES.txt` 파일 생성을 강력히 추천한다.
