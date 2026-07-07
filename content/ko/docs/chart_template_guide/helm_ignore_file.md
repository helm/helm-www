---
title: ".helmignore 파일"
description: "`.helmignore` 파일은 헬름 차트에 포함시키고 싶지 않은 파일들을 지정하는 데 사용한다."
weight: 12
---

`.helmignore` 파일은 헬름 차트에 포함시키고 싶지 않은 파일들을 지정하는 데 사용한다.

이 파일이 있으면, `helm package` 명령어는 애플리케이션을 패키징할 때 `.helmignore`에서 지정한 패턴에 매칭되는 모든 파일들을 무시할 것이다.

이를 통해 불필요하거나 민감한 파일 또는 디렉토리들이 헬름 차트에 추가되는 것을 막을 수 있다.

`.helmignore` 파일

`.helmignore` 파일은 유닉스 쉘 글롭(glob) 매칭, 상대 경로 매칭, 부정(negation, 접두어 ! 사용)을 지원한다.
한 줄에는 하나의 패턴만 있다는 것으로 취급된다.

`.helmignore` 파일 예시는 다음과 같다.

```
# comment
.git
*/temp*
*/*/temp*
temp?
```

이 문서를 개선하기 위해 **당신의 도움을 필요합니다.**
정보를 추가, 수정, 삭제하려면, [이슈를 제기](https://github.com/helm/helm-www/issues)하거나 풀 리퀘스트를 보내주세요.
