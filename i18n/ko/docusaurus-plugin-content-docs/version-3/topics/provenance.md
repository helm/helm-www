---
title: 헬름 출처 및 무결성
description: 차트의 무결성과 출처를 검증하는 방법을 설명한다.
sidebar_position: 5
---

헬름에는 차트 사용자가 패키지의 무결성과 출처를 검증하는 데 도움이 되는 출처 도구가 있다.
헬름은 PKI, GnuPG 및 평판이 좋은 패키지 관리자에 기반한 업계 표준 도구를 사용하여
서명 파일을 생성하고 검증할 수 있다.

## 개요

무결성은 차트를 출처기록과 비교하여 설정된다. 출처 레코드는 
패키지 차트와 함께 저장되는 _출처 파일_에 저장되며 패키지 
차트와 함께 저장된다. 예를 들어 차트 이름이 `myapp-1.2.3.tgz` 인 경우 
출처 파일은 `myapp-1.2.3.tgz.prov` 이 된다.

출처 파일은 패키징 시 (`helm package --sign ...`) 에 생성되며, 여러 가지 명령어로
확인할 수 있는데 흔히 `helm install --verify` 를 사용한다.

## 작업흐름

이 섹션에서는 출처 데이터를 효과적으로 사용하기 위한 작업흐름 예시를 
설명한다.

전제 조건:

- (ASCII-armored가 아닌) 바이너리 형식의 유효한 PGP 키페어
- `헬름` 명령줄 도구
- GnuPG 명령줄 도구 (선택사항)
- 키베이스(Keybase) 명령줄 도구 (선택사항)

**참고:** PGP 개인 키에 암호가 있을 경우 `--sign` 옵션을 지원하는
명령어에 대해 해당 암호를 입력하라는 메시지가 표시된다.

새 차트를 만드는 방법은 이전과 동일하다.

```console
$ helm create mychart
Creating mychart
```

패키징할 준비가 되면 `--sign` 플래그를 `helm package` 에 
추가해야 한다. 또한 서명 키가 알려진 이름과 해당 개인 키를 포함하는 
키링을 지정해야 한다.

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**참고:** `--key` 인수의 값은 이름 또는 이메일과 같이 원하는 키의 
`uid` (`gpg --list-keys` 출력에 존재)의 
하위 문자여야 한다. **지문(fingerprint)은 사용할 수 _없다_**

**팁:** GnuPG 사용자의 경우 비밀 키링은 `~/.gnupg/secring.gpg` 에 존재한다.
`gpg --list-secret-keys` 를 사용하여 보유한 키를 나열할 수 있다.

**경고:** GnuPG v2는 기본 위치 `~/.gnupg/pubring.kbx` 에 
새로운 형식 `kbx` 를 사용하여 비밀 키링을 저장한다.
다음 명령어를 사용하여 키링을 레거시 gpg 형식으로 변환한다.

```console
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

이 시점에서, `mychart-0.1.0.tgz` 와 
`mychart-0.1.0.tgz.prov` 가 모두 표시되어야 한다. 결국 두 파일 모두
원하는 차트 저장소에 업로드되어야 한다.

`helm verify` 를 사용하여 차트를 검증할 수 있다.

```console
$ helm verify mychart-0.1.0.tgz
```

검증에 실패한 경우 다음과 같다.

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

설치 중에 검증하려면 `--verify` 플래그를 사용한다.

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

서명된 차트와 연결된 공개키와 포함된 키링이 기본 위치에 없으면 
`helm pakcage` 예제에서와 같이 사용자가 `--keyring PATH`로
키링의 위치를 지정해야 할 수 있다.

검증에 실패하면 차트가 렌더링되기 전에 설치가 
중단된다.

### Keybase.io 자격증명 사용하기

[Keybase.io](https://keybase.io) 서비스를 사용하면 암호화 ID에 대한
신뢰 체인을 쉽게 설정할 수 있다. keybase 자격 증명은 차트에 서명하는데
사용될 수 있다.

전제 조건:

- 구성된 Keybase.io 계정
- 로컬에 설치된 GnuPG
- 로컬에 설치된 `keybase` CLI

#### 패키지 서명하기

첫 번째 단계는 keybase 키를 로컬 GnuPG 키링으로 가져오는 것이다.

```console
$ keybase pgp export -s | gpg --import
```

이렇게 하면 Kyebase 키가 OpenPGP 형식으로 변환된 다음 
`~/.gnupg/secring.gpg` 파일로 로컬에 저장한다.

`gpg --list-secret-keys` 를 실행하여 다시 확인할 수 있다.

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

비밀 키에는 식별자 문자열이 있다.

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

이것이 키의 전체 이름이다.

다음으로 `helm package` 로 차트를 패키징하고 서명할 수 있다.
최소한 `--key` 에서 해당 이름 문자열의 일부는 사용해야 한다.

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

결과적으로, `package` 명령어는 `.tgz` 파일과 `.tgz.prov` 파일 모두를
생성해야 한다.

#### 패키지 검증하기

유사한 기술을 사용하여 다른 사람의 keybase 키로 서명된 차트를 검증할 수 있다. 
`keybase.io/technosophos` 로 서명된 패키지를 검증하려는 경우를 생각해보자. 
그런 경우 `keybase` 도구를 사용해야 한다.

```console
$ keybase follow technosophos
$ keybase pgp pull
```

위의 첫 번째 명령어는 `technosophos` 사용자를 추적한다. 다음으로 
`keybase pgp pull` 은 팔로우하는 모든 계정의 OpenPGP 키를 다운로드하여
GnuPG 키링(`~/.gnupg/pubring.gpg`)에 배치한다.

이 시점에서 이제 `helm verify` 또는 `--verify` 플래그가 있는 명령어를 사용할
수 있다.

```console
$ helm verify somechart-1.2.3.tgz
```

### 차트가 검증되지 않는 이유

실패하는 이유는 주로 다음과 같다.

- `.prov` 파일이 없거나 손상된 경우다. 이것은 무언가가 
  잘못 구성되었거나 기존 관리자가 출처 파일을 
  만들지 않은 경우이다.
- 파일 서명에 사용된 키가 키링에 없는 경우이다. 
  이는 차트에 서명한 엔티티가 사용자가 
  신뢰한다고 신호를 보낸 사람이 아님을 의미한다.
- `.prov` 파일 검증에 실패한 경우다. 이는 차트 또는 출처 데이터에 문제가 있음을
  나타낸다.
- 출처 파일의 파일 해시가 아카이브 파일의 해시와 일치하지 않는 경우이다.
  이는 아카이브가 변조되었음을 나타낸다.

검증이 실패한다면 그 패키지를 신뢰할 수 없는 이유가 된다.

## 출처 파일

출처 파일에는 차트의 YAML 파일과 몇 가지 
검증 정보가 포함되어 있다.
출처 파일은 자동으로 생성되도록 설계되어 있다.

다음과 같은 출처 데이터가 추가된다.

* 차트 파일(`Chart.yaml`) 이 포함되어 있어 사람과 도구 모두 차트 내용을 쉽게 
  볼 수 있다.
* 차트 패키지(`.tgz` 파일)의 서명(도커와 마찬가지로 SHA256)이 포함되어 있으며
  차트 패키지의 무결성을 검증하는 데
  사용할 수 있다.
* 전체 본문은 OpenPGP 에서 사용하는 
  알고리즘을 사용하여 서명된다(암호화 서명 및 
  검증을 쉽게 하는 새로운 방법은 [Keybase.io](https://keybase.io) 참고하자).

이러한 조합은 사용자에게 다음과 같은 보증을 제공한다.

* 패키지 자체가 변경되지 않았다. (체크섬 패키지 `.tgz`)
* 이 패키지를 출시한 엔티티가 (GnuPG/PGP 서명을 통해) 알려져 있다. 

파일 형식은 다음과 같다.

```
Hash: SHA512

apiVersion: v2
appVersion: 1.16.0
description: Sample chart
name: mychart
type: application
version: 0.1.0

...
files:
  mychart-0.1.0.tgz: sha256:d31d2f08b885ec696c37c7f7ef106709aaf5e8575b6d3dc5d52112ed29a9cb92
-----BEGIN PGP SIGNATURE-----

wsBcBAEBCgAQBQJdy0ReCRCEO7+YH8GHYgAAfhUIADx3pHHLLINv0MFkiEYpX/Kd
nvHFBNps7hXqSocsg0a9Fi1LRAc3OpVh3knjPfHNGOy8+xOdhbqpdnB+5ty8YopI
mYMWp6cP/Mwpkt7/gP1ecWFMevicbaFH5AmJCBihBaKJE4R1IX49/wTIaLKiWkv2
cR64bmZruQPSW83UTNULtdD7kuTZXeAdTMjAK0NECsCz9/eK5AFggP4CDf7r2zNi
hZsNrzloIlBZlGGns6mUOTO42J/+JojnOLIhI3Psd0HBD2bTlsm/rSfty4yZUs7D
qtgooNdohoyGSzR5oapd7fEvauRQswJxOA0m0V+u9/eyLR0+JcYB8Udi1prnWf8=
=aHfz
-----END PGP SIGNATURE-----
```

YAML 섹션에는 (`...\n` 로 구분되는) 두 개의 문서가 포함되어 있다. 
첫 번째 파일은 `Chart.yaml` 의 내용이다. 
두 번째는 패키징 시 해당 파일 콘텐츠의 SHA-256 다이제스트에 대한 파일 이름 맵인 체크섬 파일이다.

서명 블록은 [변조 방지](https://www.rossde.com/PGP/pgp_signatures.html)를 
제공하는 표준 PGP 서명이다.

## 차트 저장소

차트 저장소는 헬름 차트의 중앙 집중식 콜렉션 역할을 한다.

차트 저장소는 특정 요청을 통해 HTTP를 통해 
출처 파일을 제공할 수 있도록 해야 하며 차트와 
동일하게 URI 경로에서 사용할 수 있도록 해야 한다.

예를 들어 패키지의 기본 URL이 
`https://example.com/charts/mychart-1.2.3.tgz` 일 때 
출처 파일이 있는 경우에는, 
`https://example.com/charts/mychart-1.2.3.tgz.prov` 에서 접근할 수 있어야 한다. 

최종 사용자의 관점에서 `helm install --verify myrepo/mychart-1.2.3` 은 
추가 사용자 구성이나 작업없이 차트와 출처 파일을 모두
다운로드해야 한다.

## 권한 및 인증 확립하기

신뢰 체인 시스템을 다룰 때는 서명자의 권한을 수립할 수 있게
하는 것이 중요하다. 쉽게 말하면, 이 체계는 
차트에 서명한 사람을 신뢰할 수 있는지에 달려 있다.
바꿔 말하면, 서명자의 공개키를 신뢰할 필요가 있다는 것을 의미한다.

헬름의 디자인 철학 중 하나는, 헬름 프로젝트가 신뢰 체인에 
필요한 당사자로 자기 자신을 포함시키지 않는다는 것이다. 
우리는 모든 차트 서명자의 "인증기관"이 되고 싶지 않다.
대신 우리는 탈중앙화 모델을 선호하며, 
OpenPGP를 기반 기술로 선택한 이유 중 하나이다.
따라서 권한 수립에 관한 진행단계는 헬름 2(헬름 3로 넘김)에서
정의되지 않은 채로 남아 있다 .

하지만, 출처 시스템 사용에 관심이 있는 분들을 위한 몇 가지 조언과
권장 사항은 있다.

- [Keybase](https://keybase.io) 플랫폼은 신뢰 정보를 위한 공개 중앙 
  저장소를 제공한다.
  - Keybase를 사용하여 키를 저장하거나 다른 사람의 공개 키를 가져올 수 있다.
  - Keybase 에는 사용 가능한 훌륭한 문서도 존재한다.
  - 테스트되진 않았지만, Keybase 의 "보안 웹사이트" 기능을 사용하여
    헬름 차트를 제공할 수도 있다.
- [공식 헬름 차트 프로젝트](https://github.com/helm/charts) 는 공식 차트 저장소를 위해
  이 문제를 해결하기 위해 노력하고 있다.
  - [현재의 생각을 자세히 설명하는](https://github.com/helm/charts/issues/23)
    긴 이슈가 존재한다.
  - 기본 아이디어는 공식 "차트 리뷰어"가 자신의 키로 차트에 서명하고
    생성된 출처 파일을 차트 저장소에
	  업로드하는 것이다.
  - 저장소의 `index.yaml` 파일에 유효한 서명 키 목록이 포함될 수 있다는 
    아이디어에 대한 몇 가지 작업이 있었다.

