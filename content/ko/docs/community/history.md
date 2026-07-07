---
title: "프로젝트 연혁"
description: "프로젝트의 연혁에 대한 개요를 설명한다."
weight: 4
---

헬름 3는 [인큐베이션(incubation) 최종단계](https://github.com/cncf/toc/blob/main/process/graduation_criteria.adoc)에 있는 [CNCF 프로젝트](https://www.cncf.io/projects/)이다.

헬름은, 2015년에 시작되어 KubeCon에서 소개된 바 있는 [헬름 클래식](https://github.com/helm/helm-classic)이라 하는 멋진 프로젝트에서 시작되었다.

2016년 1월, 프로젝트는 쿠버네티스 디플로이먼트 매니저라고 불리는 GCS 도구로 병합되며, [쿠버네티스](https://kubernetes.io) 산하로 옮겨갔다.
코드베이스 병합의 결과로, 그 이듬해 헬름 2.0이 릴리스되었다.
디플로이먼트 매니저(Deployment Manager)의 핵심기능은 헬름 2로 이어져, 최종 헬름 2.0 릴리스에서 틸러(Tiller)라고 명명된 서버측 컴포넌트가 되었다.

2018년 6월에 헬름은 쿠버네티스의 서브프로젝트에서 본격적인 CNCF 프로젝트로 승격되었다.
헬름은 최상위 관리조직을 구성하고 헬름 프로젝트 산하로 여러 프로젝트들을 포괄하였는데,
모노큘러(Monocular), 헬름 차트 저장소(Helm Chart Repo), 차트 뮤지엄(Chart Museum), 나중에 헬름 허브(Helm Hub)를 포함하였다.

헬름 3 개발 사이클이 시작되면서, 틸러(Tiller)가 제거되고, 클라이언트 도구로서의 본래의 지향점에 더 가까워졌다.
그러면서도 헬름 3는 쿠버네티스 클러스터 내부의 릴리스 추적을 계속하여,
팀에서 공동의 헬름 릴리스 세트를 함께 다룰 수 있게 해준다.

헬름 3는 2019년 11월에 릴리스되었다.

