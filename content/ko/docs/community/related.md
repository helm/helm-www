---
title: "관련 프로젝트와 문서"
description: "커뮤니티에서 제공하는 서드파티 도구, 플러그인 및 문서"
weight: 3
---

헬름 커뮤니티는 헬름에 대한 많은 추가 도구, 플러그인 및 문서를 만들었습니다. 우리는
이러한 프로젝트에 대해 듣고 싶습니다.

이 목록에 추가하고 싶은 것이 있으면 
[이슈](https://github.com/helm/helm-www/issues)나 [풀 
리퀘스트(PR)](https://github.com/helm/helm-www/pulls) 할 수 있습니다.

## 헬름 플러그인

- [Helm Diff](https://github.com/databus23/helm-diff) - 컬러 diff로 `helm upgrade` 
  미리보기
- [helm-gcs](https://github.com/hayorov/helm-gcs) - Google Cloud Storage에서 
  저장소를 관리하는 플러그인
- [helm-monitor](https://github.com/ContainerSolutions/helm-monitor) - 프로메테우스/엘라스틱서치 쿼리를 기반으로 
  릴리스 및 롤백을 모니터링하는 플러그인
- [helm-k8comp](https://github.com/cststack/k8comp) - k8comp 를 사용하여 hiera 에서 
  헬름 차트를 생성하는 플러그인
- [helm-unittest](https://github.com/lrills/helm-unittest) - YAML로 
  로컬에서 차트를 단위 테스트하기 위한 플러그인
- [hc-unit](https://github.com/xchapter7x/hcunit) - OPA (Open Policy Agent) 및 Rego로
  로컬에서 차트를 단위 테스트하기 위한 플러그인
- [helm-s3](https://github.com/hypnoglow/helm-s3) - [프라이빗] 차트 저장소로 AWS S3를 
  사용할 수 있게 해주는 헬름 플러그인
- [helm-schema-gen](https://github.com/karuppiah7890/helm-schema-gen) - 헬름 3 차트에 대한 
  값(values) yaml 스키마를 생성하는 헬름 플러그인
- [helm-secrets](https://github.com/jkroepke/helm-secrets) - 비밀정보를 안전하게 관리하고
  보관하기 위한 플러그인 ([sops](https://github.com/mozilla/sops) 기반)

GitHub 작성자가 플러그인 저장소에 
[helm-plugin](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories) 태그를 
사용할 것을 권장한다.

## 추가적인 도구들

헬름의 상위 계층 도구들.

- [Chartify](https://github.com/appscode/chartify) - 기존 쿠버네티스 리소스에서 
  헬름 차트를 생성
- [VIM-Kubernetes](https://github.com/andrewstuart/vim-kubernetes) - 쿠버네티스 및 헬름용(用)
  VIM 플러그인
- [Landscaper](https://github.com/Eneco/landscaper/) - "Landscaper 는 값(원하는 상태)을 가진 
  헬름 차트 참조 집합을 가져와서
  쿠버네티스 클러스터에서 실현한다."
- [Helmfile](https://github.com/helmfile/helmfile) - Helmfile은 헬름 차트 배포를 
  위한 선언적 사양이다
- [Helmsman](https://github.com/Praqma/helmsman) - Helmsman은
  버전 관리되는 원하는 상태 파일들(간단한 TOML 형식으로 기술됨)로부터
  릴리스를 설치/업그레이드/보호/이동/삭제할 수 있는 
  코드로서의-헬름-차트(helm-charts-as-code) 도구이다
- [Terraform Helm Provider](https://github.com/hashicorp/terraform-provider-helm) - HashiCorp 
  Terraform용 헬름 공급자(provider)는 선언적 코드형 인프라(infrastructure-as-code) 구문으로
  헬름 차트의 수명주기를 관리할 수 있게 해준다. 헬름 공급자는 쿠버네티스 공급자처럼,
  모든 인프라 서비스에서 통용되는 워크플로를 만들기 위해, 다른 테라폼 공급자와 
  쌍을 이루는 경우가 많다.
- [Monocular](https://github.com/helm/monocular) - 헬름 차트 저장소를 
  위한 웹 UI
- [Armada](https://airshipit.readthedocs.io/projects/armada/en/latest/) - 여러 
  쿠버네티스 네임스페이스에 걸쳐 접두어가 붙은 릴리스들을 관리하며,
  복잡한 배포에서의 완료된 작업들을 제거한다
- [ChartMuseum](https://github.com/helm/chartmuseum) - Amazon S3와
  Google Cloud Storage를 지원하는 헬름 차트 저장소
- [Codefresh](https://codefresh.io) - 헬름 차트 및 릴리스를 관리하기 위한
  UI 대시보드가 있는 쿠버네티스 네이티브 CI/CD 및 관리 플랫폼 
- [Captain](https://github.com/alauda/captain) - HelmRequest 및 
  릴리스 CRD를 사용하는 Helm3 컨트롤러
- [chart-registry](https://github.com/hangyan/chart-registry) - OCI 저장소 상의
  헬름 차트 호스트
- [avionix](https://github.com/zbrookle/avionix) - 상속과 코드중복 저감을 할 수 있는
  헬름 차트와 쿠버네티스 yaml 을 생성하는 파이썬 인터페이스. 

## 헬름 지원

헬름 지원을 포함하는 플랫폼, 배포판 및 서비스.

- [Kubernetic](https://kubernetic.com/) - 쿠버네티스 데스크탑 클라이언트
- [Jenkins X](https://jenkins-x.io/) - GitOps 환경을 통해 애플리케이션을 
  [프로모션(promotion)](https://jenkins-x.io/docs/getting-started/promotion/)하기 위해
  헬름을 사용하는 쿠버네티스용 오픈소스 자동화 CI/CD

## 기타

차트 작성자와 헬름 사용자에게 유용한 것 모음.

- [Await](https://github.com/saltside/await) - 다른 조건들에 대해 "대기(await)"하는 
  도커 이미지--특히 초기화 컨테이너에 유용하다. [더 
  보기](https://blog.slashdeploy.com/2017/02/16/introducing-await/)
