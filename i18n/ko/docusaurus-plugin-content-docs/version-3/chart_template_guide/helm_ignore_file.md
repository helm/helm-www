---
title: .helmignore 파일
description: "`.helmignore` 파일은 헬름 차트에 포함시키고 싶지 않은 파일들을 지정하는 데 사용한다."
sidebar_position: 12
---

`.helmignore` 파일은 헬름 차트에 포함시키고 싶지 않은 파일들을 지정하는 데 사용한다.

이 파일이 있으면, `helm package` 명령어는 애플리케이션을 패키징할 때 `.helmignore`에서 지정한 패턴에 매칭되는 모든 파일들을 무시할 것이다.

이를 통해 불필요하거나 민감한 파일 또는 디렉토리들이 헬름 차트에 추가되는 것을 막을 수 있다.

`.helmignore` 파일은 유닉스 쉘 글롭(glob) 매칭, 상대 경로 매칭, 부정(negation, 접두어 ! 사용)을 지원한다. 한 줄당 하나의 패턴만 인식된다.

`.helmignore` 파일 예시는 다음과 같다.

```
# 주석

# .helmignore라는 이름의 파일 또는 경로와 매칭
.helmignore

# .git이라는 이름의 파일 또는 경로와 매칭
.git

# 모든 텍스트 파일과 매칭
*.txt

# mydir이라는 이름의 디렉토리만 매칭
mydir/

# 최상위 디렉토리의 텍스트 파일만 매칭
/*.txt

# 최상위 디렉토리의 foo.txt 파일만 매칭
/foo.txt

# ab.txt, ac.txt, ad.txt 파일과 매칭
a[b-d].txt

# subdir 하위의 temp*와 매칭되는 모든 파일과 매칭
*/temp*

*/*/temp*
temp?
```

.gitignore와의 주목할 만한 차이점:
- '**' 구문은 지원되지 않는다.
- 글로빙 라이브러리는 fnmatch(3)가 아니라 Go의 'filepath.Match'이다.
- 후행 공백은 항상 무시된다 (이를 유지하는 이스케이프 시퀀스가 없다).
- '\!'를 특수 선행 시퀀스로 지원하지 않는다.
- 기본적으로 자기 자신을 제외하지 않으므로, `.helmignore`에 대한 명시적 항목을 추가해야 한다.


이 문서를 개선하는 데 **여러분의 도움이 필요합니다.**
정보를 추가, 수정, 삭제하려면, [이슈를 제기](https://github.com/helm/helm-www/issues)하거나 풀 리퀘스트를 보내주세요.
