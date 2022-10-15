---
title: "템플릿 디버깅"
description: "배포에 실패한 차트의 트러블슈팅"
weight: 13
---

렌더링된 템플릿이 쿠버네티스 API 서버로 전송될 때 문서 형식 
이외의 이유로 YAML 파일들이 거부될 수 있기 때문에,
템플릿 디버깅은 다소 까다로울 수 있다.

디버깅에 도움이 되는 몇 가지 명령어들이 있다.

- `helm lint` 는 내 차트가 모범 사례에 맞는지 검증하는 믿을만한
  도구이다.
- `helm install --dry-run --debug` 혹은 `helm template --debug`: 앞에서 설명한 적이 있는
  방법이다. 서버가 템플릿을 렌더링한 결과물을 매니페스트 파일로 돌려받아 볼 수 있는
  매우 유용한 방법이다.
- `helm get manifest`: 서버에 어떤 템플릿들이 설치되어 있는지 알아 볼 수 있는 유용한 
  방법이다.

내 YAML이 파싱에 실패했지만, 무엇이 생성되는지를 확인해보고 싶을 때,
템플릿에서 문제가 되는 섹션을 주석처리하고 `helm install --dry-run --debug` 를 다시 실행해보면
YAML 을 쉽게 확인해 볼 수 있다.

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

윗쪽 내용은 렌더링되고 주석은 그대로 반환된다.

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

이렇게 하면 YAML 파싱 오류로 인한 차단 없이 생성되는 내용을 빠르게
확인해 볼 수 있다.
