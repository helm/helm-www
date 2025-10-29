---
title: 헬름 사용하기
description: 헬름의 기본사항을 설명한다.
sidebar_position: 3
---

이 가이드는, 쿠버네티스 클러스터에서 패키지를 관리하는, 헬름 사용시의 기본사항을 설명한다.
헬름 클라이언트는 이미 [설치되어](/intro/install.md) 있다고 가정한다.

명령어 몇 개를 빨리 실행해보는 데에 관심이 있다면 [퀵스타트 가이드](/intro/quickstart.md)를 참고하는 것도 좋다.
이 장은 헬름 명령어들의 세부사항을 다루며, 헬름을 사용하는 방법을 설명한다.

## 주요 개념 3가지

*차트*는 헬름 패키지이다. 
이 패키지에는 쿠버네티스 클러스터 내에서 애플리케이션, 도구, 서비스를 구동하는데 필요한 모든 리소스 정의가 포함되어 있다.
쿠버네티스에서의 Homebrew 포뮬러, Apt dpkg, YUM RPM 파일과 같은 것으로 생각할 수 있다.

*저장소*는 차트를 모아두고 공유하는 장소이다.
이것은 마치 Perl의 [CPAN 아카이브](https://www.cpan.org)나 [페도라 패키지 데이터베이스](https://src.fedoraproject.org/)와 같은데, 쿠버네티스 패키지용이라고 보면 된다.

*릴리스*는 쿠버네티스 클러스터에서 구동되는 차트의 인스턴스이다.
일반적으로 하나의 차트는 동일한 클러스터내에 여러 번 설치될 수 있다.
설치될 때마다, 새로운 _release_ 가 생성된다.

MySQL 차트의 경우를 생각해보자. 
클러스터 내에 데이터베이스 2대를 구동하려면, 차트를 두번 설치하면 된다.
차례로 각각의 _release name_ 을 가지는, 각각의 _release_ 를 가지게 될 것이다.

이러한 개념을 염두에 두고, 헬름 설명을 이어간다.

헬름은 쿠버네티스 내부에 _charts_ 를 설치하고, 각 설치에 대해 새로운 _release_ 를 생성한다.
새로운 차트를 찾기 위해 헬름 차트 _repositories_ 를 검색할 수 있다.

## 'helm search': 차트 찾기

헬름은 강력한 검색 명령어를 제공한다. 서로 다른 2가지 소스 유형을 검색하는데 사용할 수 있다.

- `helm search hub`는 여러 저장소들에 있는 헬름 차트들을 포괄하는 [헬름 허브](https://hub.helm.sh)를 검색한다.
- `helm search repo`는 `helm repo add`를 사용하여 로컬 헬름 클라이언트에 추가된 저장소들을 검색한다.
   검색은 로컬 데이터 상에서 이루어지며, 퍼블릭 네트워크 접속이 필요하지 않다.

`helm search hub`를 실행하면 공개적으로 사용 가능한 차트들을 찾아볼 수 있다.

```console
$ helm search hub wordpress
URL                                               	CHART VERSION	APP VERSION	DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress      	7.6.7        	5.2.4      	Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...	v0.6.3       	v0.6.3     	Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...	v0.7.1       	v0.7.1     	A Helm chart for deploying a WordPress site on ...
```

위와 같이 하면 헬름 허브에서 모든 `wordpress` 차트를 찾는다.

필터 없이 `helm search hub`을 실행하면 사용 가능한 모든 차트를 보여준다.

`helm search repo`를 사용하면, 기존에 추가된 저장소들에 있는 차트 이름을 볼 수 있다.

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                        	CHART VERSION	APP VERSION	DESCRIPTION
brigade/brigade             	1.3.2        	v1.2.1     	Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app  	0.4.1        	v0.2.1     	The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth	0.2.0        	v0.20.0    	The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway 	0.1.0        	           	A Helm chart for Kubernetes
brigade/brigade-project     	1.0.0        	v1.0.0     	Create a Brigade project
brigade/kashti              	0.4.0        	v0.4.0     	A Helm chart for Kubernetes
```

helm search는 퍼지 문자열 매칭 알고리즘을 사용하므로, 단어 또는 문구의 일부분만 입력해도 된다.

```console
$ helm search repo kash
NAME          	CHART VERSION	APP VERSION	DESCRIPTION
brigade/kashti	0.4.0        	v0.4.0     	A Helm chart for Kubernetes
```
search는 사용 가능한 패키지를 찾는 좋은 방법이다.
설치하려는 패키지를 찾았다면 `helm install`을 이용하여 설치할 수 있다.

## 'helm install': 패키지 설치

새 패키지를 설치하려면, `helm install` 명령어를 사용하자. 

가장 간단하게는 사용자가 지정한 릴리스 이름, 설치하려는 차트 이름의 2개 인수를 받는다.

```console
$ helm install happy-panda stable/mariadb
Fetched stable/mariadb-0.3.0 to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
happy-panda
Last Deployed: Wed Sep 28 12:32:28 2016
Namespace: default
Status: DEPLOYED

Resources:
==> extensions/Deployment
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
happy-panda-mariadb   1         0         0            0           1s

==> v1/Secret
NAME                     TYPE      DATA      AGE
happy-panda-mariadb   Opaque    2         1s

==> v1/Service
NAME                     CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
happy-panda-mariadb   10.0.0.70    <none>        3306/TCP   1s


Notes:
MariaDB can be accessed via port 3306 on the following DNS name from within your cluster:
happy-panda-mariadb.default.svc.cluster.local

To connect to your database run the following command:

   kubectl run happy-panda-mariadb-client --rm --tty -i --image bitnami/mariadb --command -- mysql -h happy-panda-mariadb
```

이제 `mariadb` 차트가 설치되었다.
차트를 설치하면 새 _release_ 오브젝트가 생성된다는 점을 알아두자.
위에서 릴리스의 이름이 `happy-panda`이다. 
(헬름이 생성해주는 이름을 그대로 사용하려면 릴리스 이름을 넣지 말고 `--generate-name`을 사용하자.)

설치하는 동안, `helm` 클라이언트는 어떤 리소스가 생성되는지, 릴리스의 상태는 어떤지, 추가 설정단계가 있는지에 관한 유용한 정보를 출력할 것이다.

헬름은 모든 리소스가 구동(running)할 때까지 기다리지 않는다.

많은 차트들이 크기 600M 이상의 Docker 이미지를 필요로 하며, 클러스터에 설치되기까지는 상당한 시간이 걸린다.

릴리스의 상태 추적을 계속하거나, 구성 정보를 재확인하려면, `helm status`를 사용하자.

```console
$ helm status happy-panda
Last Deployed: Wed Sep 28 12:32:28 2016
Namespace: default
Status: DEPLOYED

Resources:
==> v1/Service
NAME                     CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
happy-panda-mariadb   10.0.0.70    <none>        3306/TCP   4m

==> extensions/Deployment
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
happy-panda-mariadb   1         1         1            1           4m

==> v1/Secret
NAME                     TYPE      DATA      AGE
happy-panda-mariadb   Opaque    2         4m


Notes:
MariaDB can be accessed via port 3306 on the following DNS name from within your cluster:
happy-panda-mariadb.default.svc.cluster.local

To connect to your database run the following command:

   kubectl run happy-panda-mariadb-client --rm --tty -i --image bitnami/mariadb --command -- mysql -h happy-panda-mariadb
```

위와 같이 릴리스의 현재 상태가 표시된다.


### 설치 전 차트 커스터마이징

여기서는 이 차트의 기본 구성 옵션들만 사용할 것이다.
대부분의 경우 선호하는 구성을 사용하기 위해 차트를 커스터마이징하게 될 것이다.

차트에 어떤 옵션이 구성 가능한지 보려면, `helm show values`를 사용하자.

```console
$ helm show values stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
## Bitnami MariaDB image version
## ref: https://hub.docker.com/r/bitnami/mariadb/tags/
##
## Default: none
imageTag: 10.1.14-r3

## Specify a imagePullPolicy
## Default to 'Always' if imageTag is 'latest', else set to 'IfNotPresent'
## ref: https://kubernetes.io/docs/user-guide/images/#pre-pulling-images
##
# imagePullPolicy:

## Specify password for root user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#setting-the-root-password-on-first-run
##
# mariadbRootPassword:

## Create a database user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-user-on-first-run
##
# mariadbUser:
# mariadbPassword:

## Create a database
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-on-first-run
##
# mariadbDatabase:
# ...
```

YAML 형식 파일에 있는 이러한 설정들을 오버라이드(override)하여, 설치시 파일과 함께 반영시킬 수 있다.

```console
$ echo '{mariadbUser: user0, mariadbDatabase: user0db}' > config.yaml
$ helm install -f config.yaml stable/mariadb --generate-name
```

위와 같이 하면 `user0`이라는 기본 MariaDB 사용자가 생성될 것이고,
이 사용자에게는 새로 생성된 `user0db` 데이터베이스에 대한 접근권한이 부여되지만,
나머지 모든 기본설정은 해당 차트를 따르게 된다.

설치 작업에 구성 데이터를 전달하는 방법에는 두가지가 있다.

- `--values` (또는 `-f`): 오버라이드(override)할 YAML 파일을 지정한다.
  여러 번 지정할 수 있지만 가장 오른쪽에 있는 파일이 우선시된다.
- `--set`: 명령줄 상에서 오버라이드(override)를 지정한다.

둘 다 사용하면, `--set` 값은 더 높은 우선순위를 가진 `--values` 으로 병합된다.
`--set`에 명시된 오버라이드 사항들은 컨피그맵(ConfigMap)으로 보관된다.
`helm get values <release-name>`로 해당 릴리스에 대한 `--set` 설정값들을 조회할 수 있다.
`--set` 설정값들은 `helm upgrade`를 실행할 때 `--reset-values`를 명시하여 제거할 수 있다.

#### `--set`의 형식과 제한점

`--set` 옵션은 0개 이상의 이름/값 쌍을 받는다.
가장 간단하게는 `--set name=value`와 같이 사용할 수 있다.
YAML로 표현하면 다음과 같다.

```yaml
name: value
```

여러 개의 값들은 `,` 문자로 구분된다. 그래서 `--set a=b,c=d`는 다음과 같다.

```yaml
a: b
c: d
```

더 복잡한 표현도 지원한다. 예를 들어, `--set outer.inner=value`
는 다음과 같이 표현된다.
```yaml
outer:
  inner: value
```

리스트는 `{`, `}` 를 사용하여 표현할 수 있다.
예를 들어, `--set name={a, b, c}`는 다음과 같이 표현된다.

```yaml
name:
  - a
  - b
  - c
```

헬름 2.5.0이라면, 배열 인덱스 문법을 써서 리스트 항목들에 접근할 수 있다.
예를 들어 `--set servers[0].port=80` 는 다음과 같이 된다.

```yaml
servers:
  - port: 80
```

여러 개의 값들이 이런 방식으로 설정될 수 있다.
`--set servers[0].port=80,servers[0].host=example` 행은 다음과 같이 된다.

```yaml
servers:
  - port: 80
    host: example
```

때로는 `--set` 행에 특수문자를 써야할 필요가 있을 것이다.
문자를 이스케이프하기 위해 백슬래시를 사용할 수 있다. `--set name=value1\,value2`는 다음과 같다.

```yaml
name: "value1,value2"
```

비슷한 예로, `toYaml` 기능으로 어노테이션, 레이블, 노드 셀렉터를 파싱하는 차트에서 편리하게 사용되는 점 표기를 이스케이프할 수 있다.
`--set nodeSelector."kubernetes\.io/role"=master`를 나타내는 구문은 다음과 같다.

```yaml
nodeSelector:
  kubernetes.io/role: master
```

여러 단계로 중첩된 자료구조는 `--set`로 표현하기 어려울 수 있다.
차트 설계자는 `values.yaml` 파일의 형식을 설계할 때 `--set`를 사용하는 경우도 고려해주면 좋다.

### 더 많은 설치 방법들

`helm install` 명령어를 사용하여 여러 소스에서 설치를 수행할 수 있다.

- 차트 저장소 (위에서 살펴본 것)
- 로컬 차트 압축파일 (`helm install foo foo-0.1.1.tgz`)
- 압축해제된 차트 디렉토리 (`helm install foo path/to/foo`)
- 완전한 URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' 및 'helm rollback': 릴리스 업그레이드 및 실패 복구

새로운 버전의 차트가 릴리스되었을 때, 또는 릴리스의 구성을 변경하고자 할 때,
`helm upgrade` 명령어를 사용할 수 있다.

업그레이드는 현존하는 릴리스를 가지고, 사용자가 입력한 정보에 따라 업그레이드한다.
쿠버네티스 차트는 크고 복잡할 수 있기 때문에, 헬름은 최소한의 개입으로 업그레이드를 수행하려고 한다.
최근 릴리스 이후로 변경된 것들만 업데이트하게 될 것이다.

```console
$ helm upgrade -f panda.yaml happy-panda stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
happy-panda has been upgraded. Happy Helming!
Last Deployed: Wed Sep 28 12:47:54 2016
Namespace: default
Status: DEPLOYED
...
```

위의 경우, `happy-panda` 릴리스의 차트가 업그레이드되는데 새 YAML 파일도 반영된다.

```yaml
mariadbUser: user1
```

`helm get values`를 사용하여 새로운 설정이 적용되었는지 확인해 볼 수 있다.

```console
$ helm get values happy-panda
mariadbUser: user1
```

`helm get` 명령어는 클러스터에서 릴리스 정보를 확인할 때 유용한 도구이다.
위의 예에서 `panda.yaml`의 새로운 값이 클러스터에 배포되었음을 확인할 수 있다.

릴리스가 계획대로 되지 않는다면, 
`helm rollback [RELEASE] [REVISION]`를 사용하여 이전 릴리스로 간단히 롤백할 수 있다.

```console
$ helm rollback happy-panda 1
```

위와 같이 하면 happy-panda가 맨 첫번째 릴리스 버전으로 롤백된다.
릴리스 버전은 증분 리비전(incremental revision)을 나타낸다.
설치, 업그레이드, 롤백 등이 실행될 때마다, 리비전 번호는 1씩 증가한다.
첫 번째 리비전 번호는 항상 1이다.
특정 릴리스의 리비전 번호를 확인하기 위해서는 `helm history [RELEASE]`를 사용할 수 있다.

## 설치/업그레이드/롤백에 관한 유용한 옵션들

설치/업그레이드/롤백 시의 헬름 작동을 커스터마이징하는 다른 여러 유용한 옵션들이 있다.
아래 나열한 CLI 플래그가 전체 목록은 아니라는 점을 알아두자.
모든 플래그들에 관한 설명을 보려면, `helm <command> --help`을 실행하자.

- `--timeout`: 쿠버네티스 명령어가 완료되기를 기다려주는 시간 값(초)
  기본값은 5m0s`
- `--wait`: 릴리스가 성공적이었다고 기록하기 전에,
  모든 포드들이 준비 상태가 되고 PVC들이 연결되고
  디플로이먼트가 최소한(`Desired` - `maxUnavailable`)의 준비 상태 포드 수를 갖추며
  서비스들이 IP 주소(`LoadBalancer`라면 인그레스)를 가질 때까지
  기다린다. `--timeout` 값만큼 기다릴 것이다.
  타임아웃되면 릴리스는 `FAILED`로 기록될 것이다. 참고: 
  롤링 업데이트 전략의 일부로서 `replicas` 설정은 1이고 `maxUnavailable` 설정은 0이 아닌 디플로이먼트의 경우,
  `--wait`는 최소 준비 상태 포드 수를 만족하면 준비 상태로 응답할 것이다.
- `--no-hooks`: 명령어에 대한 훅(hook) 작동을 생략함
- `--recreate-pods` (`upgrade`와 `rollback`에만 적용가능): 이 플래그는
  모든 포드들의 재생성을 일으킬 수 있다 (디플로이먼트에 속한 포드들은 제외). (헬름 3에서 사용 중단(DEPRECATED))

## 'helm uninstall': 릴리스 언인스톨하기

클러스터에서 릴리스를 언인스톨하고자 할 때, `helm uninstall`을 사용해보자.

```console
$ helm uninstall happy-panda
```

이렇게 하면 클러스터에서 릴리스가 제거될 것이다.
`helm list` 명령어로 현재 배포된 모든 릴리스들을 확인할 수 있다.

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

위의 결과에서 `happy-panda` 릴리스가 언인스톨된 것을 확인할 수 있다.

Helm 구버전에서는 릴리스를 삭제하면 삭제된 기록이 남았는데,
Helm 3에서는 삭제시에 릴리스 기록도 제거한다.
삭제 릴리스 기록을 보존하고 싶다면, `helm uninstall --keep-history`을 사용하자.
`helm list --uninstalled`는 사용하면, `--keep-history` 플래그로 언인스톨된 릴리스들만 볼 수 있다.

`helm list --all` 플래그는, 실패하거나 삭제(`--keep-history` 지정된 경우)된 기록을 포함하여,
헬름이 가지고 있는 모든 릴리스 기록들을 보여준다.


```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     mariadb-0.3.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

기본적으로 릴리스는 바로 삭제되기 때문에, 언인스톨된 리소스를 롤백하는 것을 불가능하는 것을 알아두자.

## 'helm repo': 저장소 작업하기

헬름 3는 더 이상 기본 차트 저장소를 제공하지 않는다.
`helm repo` 명령어 그룹은 저장소를 추가, 목록조회, 제거하는 명령어를 제공한다.

`helm repo list`를 사용하여 어떤 저장소들이 설정되어 있는지 확인할 수 있다.

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

`helm repo add`로 새 저장소들을 추가할 수 있다.

```console
$ helm repo add dev https://example.com/dev-charts
```

차트 저장소는 자주 바뀌므로, `helm repo update`을 실행하여 언제든 헬름 클라이언트를 
업데이트할 수 있다.

`helm repo remove`로 저장소들을 삭제할 수 있다.

## 내 차트 만들기


[차트 개발 가이드](https://helm.sh/docs/topics/charts/)는 내 차트를 개발하는 방법을 설명한다.
하지만 `helm create` 명령어를 사용하여 빠르게 시작해볼 수 있다:

```console
$ helm create deis-workflow
Creating deis-workflow
```

이제 `./deis-workflow`에 차트가 생겼다.
생성된 차트를 편집하거나 내 템플릿을 생성할 수 있다.

차트를 편집했다면, `helm lint`를 실행하여 형식이 맞지는 검증할 수 있다.

배포용 차트로 패키징하고자 할 때는, `helm package` 명령어를 사용할 수 있다:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

이 차트는 이제 `helm install`로 쉽게 설치할 수 있다:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

패키징된 차트들은 차트 저장소에 보관할 수 있다.
업로드하는 방법을 알아보려면 차트 저장소 서버에 관한 문서를 보자.

참고: `stable` 저장소는 [쿠버네티스 차트 GitHub 저장소](https://github.com/helm/charts)에서 관리한다.
해당 프로젝트는 차트 소스코드를 받고 검사(audit) 후 패키징한다.

## 맺음말

이 장은 검색, 설치, 업그레이드, 언인스톨을 포함한 `helm` 클라이언트의 기본 사용패턴을 다룬다.
또한 `helm status`, `helm get`, `helm repo`와 같은 유용한 도구 명령어도 다루었다.

이 명령어들에 대해 더 알아보려면, 헬름에 내장된 도움말을 보도록 하자.
`helm help`

다음 장에서는, 차트 개발 프로세스를 살펴볼 것이다.
