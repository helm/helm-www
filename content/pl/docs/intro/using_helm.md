---
title: "Używanie Helm"
description: "Objaśnia podstawowe koncepcje Helma."
weight: 3
---

Niniejszy przewodnik wyjaśnia podstawy korzystania z Helm do zarządzania
pakietami w klastrze Kubernetes. Zakłada się,
że masz już [zainstalowany]({{< ref "install.md" >}}) klient Helm.

Jeśli jesteś po prostu zainteresowany uruchomieniem kilku szybkich
poleceń, możesz rozpocząć od [Szybkiego wprowadzenia]({{< ref "quickstart.md" >}}).
Ten rozdział obejmuje szczegóły poleceń Helm i wyjaśnia, jak używać Helm.

## Trzy główne koncepcje {#three-big-concepts}

*Chart* to pakiet Helm. Zawiera wszystkie definicje
zasobów niezbędne do uruchomienia aplikacji, narzędzia lub
usługi w klastrze Kubernetes. Można go porównać do
odpowiednika formuły Homebrew, pakietu Apt dpkg lub pliku Yum RPM.

*Repozytorium* (ang. Repository) to miejsce, gdzie można gromadzić i udostępniać
charty. Jest to podobne do archiwum [CPAN Perla](https://www.cpan.org) lub
[Bazy Danych Pakietów Fedora](https://src.fedoraproject.org/), ale przeznaczone dla pakietów Kubernetes.

*Wydanie* (ang. Release) to instancja _charta_ działającego w klastrze Kubernetes. Jeden
_chart_ może być często zainstalowany wiele razy w tym samym klastrze. Za każdym razem, gdy jest
zainstalowany, tworzone jest nowe _wydanie_. Weźmy pod uwagę _chart_ MySQL. Jeśli chcesz mieć dwie
bazy danych działające w twoim klastrze, możesz zainstalować ten _chart_ dwa razy.
Każdy z nich będzie miał swoje własne _wydanie_, które z kolei będzie miało swoją własną _nazwę wydania_.

Znając te pojęcia, możemy teraz wyjaśnić Helm w następujący sposób:

Helm instaluje _chartsy_ w Kubernetes, tworząc nową _wydanie_ dla każdej
instalacji. Aby znaleźć nowe chartsy, możesz przeszukiwać _repozytoria_ chartów Helm.

## 'helm search': Wyszukiwanie Chartów {#helm-search-finding-charts}

Helm posiada potężną komendę wyszukiwania. Może być używana
do przeszukiwania dwóch różnych typów źródeł:

- `helm search hub` przeszukuje [Artifact Hub](https://artifacthub.io),
  który zawiera listę chartów Helm z wielu różnych repozytoriów.
- `helm search repo` przeszukuje repozytoria, które zostały dodane do
  Twojego lokalnego klienta helm (za pomocą `helm repo add`). Przeszukiwanie odbywa
  się na podstawie lokalnych danych i nie wymaga publicznego połączenia sieciowego.

Możesz znaleźć publicznie dostępne charty, uruchamiając `helm search hub`:

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

Powyższe polecenie przeszukuje wszystkie charty `wordpress` na Artifact Hub.

Bez zastosowania filtra, `helm search hub` pokazuje wszystkie dostępne charty.

Polecenie `helm search hub` ujawnia URL do lokalizacji na [artifacthub.io](https://artifacthub.io/), ale nie do faktycznego repozytorium Helm.
`helm search hub --list-repo-url` ujawnia faktyczny URL repozytorium Helm, co jest przydatne, gdy chcesz dodać nowe repozytorium: `helm repo add [NAME] [URL]`.

Używając `helm search repo`, można znaleźć nazwy chartów
w repozytoriach, które już zostały dodane:

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Wyszukiwanie Helm wykorzystuje algorytm dopasowania
przybliżonego ciągu znaków, więc możesz wpisywać fragmenty słów lub fraz:

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Wyszukiwanie to dobry sposób na znalezienie dostępnych pakietów. Gdy znajdziesz
pakiet, który chcesz zainstalować, możesz użyć `helm install`, aby go zainstalować.

## 'helm install': Instalowanie pakietu {#helm-install-installing-a-package}

Aby zainstalować nowy pakiet, użyj polecenia `helm install`. W
najprostszej formie przyjmuje dwa argumenty: nazwę
wydania, którą wybierasz, oraz nazwę chartu, który chcesz zainstalować.

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Teraz chart `wordpress` jest zainstalowany. Zauważ, że instalowanie
chartu tworzy nowy obiekt typu _wydanie_ (ang. _release_). Powyższa wersja jest
nazwana `happy-panda`. (Jeśli chcesz, aby Helm wygenerował dla
Ciebie nazwę, pomiń nazwę _wydania_ (ang. release) i użyj `--generate-name`.)

Podczas instalacji klient `helm` wyświetli przydatne informacje na
temat tego, które zasoby zostały utworzone, jaki jest stan wydania, a także czy
istnieją dodatkowe kroki konfiguracyjne, które można lub należy podjąć.

Helm instaluje zasoby w następującej kolejności:

- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- PersistentVolume
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService

Helm nie czeka, aż wszystkie zasoby będą uruchomione, zanim się zakończy.
Wiele chartów wymaga obrazów Docker o rozmiarze
ponad 600 MB, co może zająć dużo czasu, aby zainstalować je w klastrze.

Aby śledzić stan wydania lub ponownie odczytać
informacje konfiguracyjne, możesz użyć `helm status`:

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Powyższe polecenie pokazuje aktualny stan Twojego wydania.

### Dostosowywanie chartu przed instalacją {#customizing-the-chart-before-installing}

Instalacja w sposób, jaki tutaj przedstawiliśmy, będzie używać
wyłącznie domyślnych opcji konfiguracji tego chartu. W wielu
przypadkach będziesz chciał dostosować chart do preferowanej konfiguracji.

Aby zobaczyć, jakie opcje można skonfigurować w charcie, użyj `helm show values`:

```console
$ helm show values bitnami/wordpress
## Global Docker image parameters
## Please, note that this will override the image parameters, including dependencies, configured to use the global value
## Current available global Docker image parameters: imageRegistry and imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass

## Bitnami WordPress image version
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/
##
image:
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

Możesz następnie nadpisać dowolne z tych ustawień w pliku
sformatowanym jako YAML, a następnie przekazać ten plik podczas instalacji.

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

Powyższe polecenie spowoduje utworzenie domyślnego użytkownika MariaDB o nazwie
`user0`, a także przyznanie temu użytkownikowi dostępu do nowo utworzonej bazy
danych `user0db`, ale pozostawi wszystkie pozostałe wartości domyślne dla tego chartu.

Istnieją dwa sposoby przekazywania danych konfiguracyjnych podczas instalacji:

- `--values` (lub `-f`): Określa plik YAML z ustawieniami. Może być
  podany wielokrotnie, a plik najbardziej z prawej będzie miał pierwszeństwo.
- `--set`: Określa wartości w wierszu poleceń.

Jeśli oba są używane, wartości `--set` są scalane z `--values` z wyższym
priorytetem. Nadpisania określone za pomocą `--set` są przechowywane w obiekcie _Secret_.
Wartości, które zostały ustawione za pomocą `--set`, można wyświetlić dla danego wydania
za pomocą `helm get values <release-name>`. Wartości, które zostały ustawione za
pomocą `--set`, można usunąć, uruchamiając `helm upgrade` z określoną opcją `--reset-values`.

#### Format i ograniczenia `--set` {#the-format-and-limitations-of---set}

Opcja `--set` przyjmuje zero lub więcej par nazwa/wartość. W najprostszej
formie jest używana w następujący sposób: `--set name=value`. Równoważnik w YAML to:

```yaml
name: value
```

Wiele wartości jest rozdzielanych znakami `,`. Tak więc `--set a=b,c=d` staje się:

```yaml
a: b
c: d
```

Obsługiwane są bardziej złożone wyrażenia. Na
przykład, `--set outer.inner=value` jest tłumaczone na:
```yaml
outer:
  inner: value
```

Listy można wyrazić, otaczając wartości nawiasami `{` i `}`.
Na przykład, `--set name={a, b, c}` tłumaczy się na:

```yaml
name:
  - a
  - b
  - c
```

Niektóre nazwy/klucze mogą być ustawione na `null` lub na pustą tablicę `[]`. Na przykład, `--set name=[],a=null` tłumaczy

```yaml
name:
  - a
  - b
  - c
a: b
```

na

```yaml
name: []
a: null
```

Od Helm 2.5.0 możliwy jest dostęp do elementów listy za pomocą
składni indeksu tablicy. Na przykład, `--set servers[0].port=80` staje się:

```yaml
servers:
  - port: 80
```

Wiele wartości można ustawić w ten sposób. Linia
`--set servers[0].port=80,servers[0].host=example` staje się:

```yaml
servers:
  - port: 80
    host: example
```

Czasami musisz użyć specjalnych znaków w swoich liniach `--set`. Możesz użyć
ukośnika odwrotnego jako znaku ucieczki; `--set name=value1\,value2` stanie się:

```yaml
name: "value1,value2"
```

Podobnie, można także uciec znakom kropki, co może być
przydatne, gdy charty używają funkcji `toYaml` do
parsowania adnotacji, etykiet i selektorów węzłów. Składnia dla `--set nodeSelector."kubernetes\.io/role"=master`
staje się:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Głęboko zagnieżdżone struktury danych mogą być trudne do wyrażenia za pomocą `--set`. Projektanci
chartów są zachęcani do rozważenia użycia `--set` przy projektowaniu formatu pliku `values.yaml`
(więcej na temat [Plików wartości]({{< relref path="/docs/chart_template_guide/values_files/" lang="en" >}})).

### Kolejne Metody Instalacji {#more-installation-methods}

Polecenie `helm install` może instalować z kilku źródeł:

- Repozytorium chartów (jak widzieliśmy powyżej)
- Lokalne archiwum chartów (`helm install foo foo-0.1.1.tgz`)
- Rozpakowany katalog chartu (`helm install foo path/to/foo`)
- Pełny URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## Polecenia 'helm upgrade' i 'helm rollback': aktualizacja wydania oraz odzyskiwanie po niepowodzeniu {#helm-upgrade-and-helm-rollback-upgrading-a-release-and-recovering-on-failure}

Gdy nowa wersja chartu zostanie wydana lub gdy chcesz zmienić
konfigurację swojego wydania, możesz użyć polecenia `helm upgrade`.

Aktualizacja bierze istniejące wydanie i aktualizuje je zgodnie z
dostarczonymi informacjami. Ponieważ charty Kubernetes mogą być obszerne i
skomplikowane, Helm stara się przeprowadzić jak najmniej inwazyjną aktualizację.
Zaktualizowane zostaną tylko te elementy, które zmieniły się od ostatniego wydania.

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

W opisanym przypadku, wydanie `happy-panda` jest
aktualizowane przy użyciu tego samego chartu, ale z nowym plikiem YAML:

```yaml
mariadb.auth.username: user1
```

Możesz użyć `helm get values`, aby sprawdzić, czy nowe ustawienie weszło w życie.

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

Polecenie `helm get` jest przydatnym narzędziem do
przeglądania wydania w klastrze. Jak widać powyżej, pokazuje ono, że
nasze nowe wartości z `panda.yaml` zostały wdrożone do klastra.

Teraz, jeśli coś nie pójdzie zgodnie z planem podczas wydania, łatwo jest
przywrócić poprzednie wydanie używając `helm rollback [RELEASE] [REVISION]`.

```console
$ helm rollback happy-panda 1
```

Powyższe polecenie przywraca nasze wydanie happy-panda do jego
pierwszej wersji. Wersja wydania to inkrementalna rewizja. Za każdym razem, gdy
następuje instalacja, aktualizacja lub wycofanie, numer rewizji
jest zwiększany o 1. Pierwszy numer rewizji zawsze wynosi 1. Możemy
użyć `helm history [RELEASE]`, aby zobaczyć numery rewizji dla danego wydania.

## Przydatne opcje dla Instalacji/Aktualizacji/Cofnięcia {#helpful-options-for-installupgraderollback}

Istnieje kilka innych przydatnych opcji, które można określić, aby
dostosować zachowanie Helm podczas
instalacji/aktualizacji/przywracania. Należy pamiętać, że nie jest to pełna lista flag CLI. Aby
zobaczyć opis wszystkich flag, wystarczy uruchomić `helm <komenda> --help`.

- `--timeout`: Wartość typu [Go duration](https://golang.org/pkg/time/#ParseDuration),
  która określa, jak długo czekać na zakończenie poleceń Kubernetes. Domyślnie jest to `5m0s`.
- `--wait`: Czeka, aż wszystkie Pody będą w stanie gotowości, PVC będą powiązane,
  Deploymenty będą miały minimalną liczbę Podów (`Desired` minus `maxUnavailable`) w stanie gotowości, a Usługi
  (ang. Service) będą miały przypisany adres IP (oraz Ingress, jeśli jest to
  `LoadBalancer`), zanim uznane zostaną za zakończone sukcesem. Będzie czekać tak długo, jak określono
  wartość `--timeout`. Jeśli osiągnięty zostanie limit czasu, wydanie zostanie oznaczone jako
  `FAILED`. Uwaga: W scenariuszach, gdzie Deployment ma ustawioną wartość `replicas` na 1, a
  `maxUnavailable` nie jest ustawione na 0 jako część strategii aktualizacji kroczącej (ang.
  rolling update strategy), `--wait` uzna za gotowe po spełnieniu minimalnego warunku Poda w stanie gotowości.
- `--no-hooks`: Pomija uruchamianie hooków dla polecenia
- `--recreate-pods` (dostępne tylko dla `upgrade` i `rollback`): Ta
  flaga spowoduje, że wszystkie pody zostaną odtworzone (z wyjątkiem
  podów należących do deploymentów). (PRZESTARZAŁE (ang. DEPRECATED) w Helm 3)

## `helmuninstall`: Odinstalowywanie wydania {#helm-uninstall-uninstalling-a-release}

Gdy nadejdzie czas na odinstalowanie
wydania z klastra, użyj polecenia `helm uninstall`:

```console
$ helm uninstall happy-panda
```

To spowoduje usunięcie wydania z klastra. Możesz zobaczyć
wszystkie aktualnie wdrożone wydania za pomocą polecenia `helm list`:

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

Z powyższego wyniku widzimy, że
wydanie `happy-panda` zostało odinstalowane.

W poprzednich wersjach Helm, kiedy wydanie było usuwane, pozostawał zapis
jego usunięcia. W Helm 3, usunięcie usuwa również zapis o
wydaniu. Jeśli chcesz zachować zapis o usuniętym wydaniu, użyj
`helm uninstall --keep-history`. Używając `helm list --uninstalled`,
zobaczysz tylko wydania, które zostały odinstalowane z flagą `--keep-history`.

Flaga `helm list --all` pokaże wszystkie rekordy wydania,
które Helm zachował, w tym rekordy dla elementów zakończonych
niepowodzeniem lub usuniętych (jeśli określono `--keep-history`):

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

Ponieważ wersje są teraz domyślnie usuwane, nie jest
już możliwe cofnięcie instalacji odinstalowanego zasobu.

## 'helm repo': Praca z repozytoriami {#helm-repo-working-with-repositories}

Helm 3 nie dostarcza już domyślnego repozytorium chartów. Grupa poleceń
`helm repo` dostarcza polecenia do dodawania, wyświetlania i usuwania repozytoriów.

Możesz zobaczyć, które repozytoria są skonfigurowane, używając `helm repo list`:

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

A nowe repozytoria można dodawać za pomocą
`helm repo add [NAZWA] [URL]`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Ponieważ repozytoria chartów zmieniają się często, w każdej chwili możesz
upewnić się, że Twój klient Helm jest aktualny, uruchamiając `helm repo update`.

Repozytoria można usunąć za pomocą `helm repo remove`.

## Tworzenie własnych chartów {#creating-your-own-charts}

[Przewodnik po tworzeniu chartów]({{< relref path="/docs/topics/charts.md" lang="en" >}})
wyjaśnia, jak rozwijać własne
charty. Możesz jednak szybko rozpocząć, używając polecenia `helm create`:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Teraz istnieje chart w `./deis-workflow`.
Możesz go edytować i tworzyć własne szablony.

Podczas edytowania chartu możesz sprawdzić, czy
jest poprawnie skonstruowany, uruchamiając `helm lint`.

Gdy nadejdzie pora na zapakowanie chartu do
dystrybucji, możesz uruchomić polecenie `helm package`:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

A ten chart może teraz być łatwo zainstalowany za pomocą `helm install`:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

Wstępnie skonfigurowane charty można załadować do repozytoriów chartów. Zobacz
dokumentację [repozytoriów chartów
Helm]({{< relref path="/docs/topics/chart_repository.md" lang="en" >}}) aby uzyskać więcej szczegółów.

## Podsumowanie {#conclusion}

Ten rozdział omówił podstawowe wzorce użycia klienta `helm`, w tym
wyszukiwanie, instalację, aktualizację i odinstalowywanie. Omówił również
przydatne polecenia narzędziowe, takie jak `helm status`, `helm get` i `helm repo`.

Aby uzyskać więcej informacji na temat tych
poleceń, zapoznaj się z wbudowaną pomocą Helm: `helm help`.

W [następnym rozdziale]({{< relref path="/docs/howto/charts_tips_and_tricks/" lang="en" >}})) przyjrzymy się procesowi tworzenia chartów.
