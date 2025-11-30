---
title: Szybki start
description: Instrukcje instalacji Helma oraz wprowadzenie do pracy z narzędziem, obejmujące dystrybucje, sekcję FAQ i wtyczki.
sidebar_position: 1
---

Ten przewodnik opisuje, jak szybko rozpocząć korzystanie z Helma.

## Wymagania wstępne {#prerequisites}

Do prawidłowego i bezpiecznego
korzystania z Helm wymagane są następujące elementy:

1. Klaster Kubernetesa
2. Określenie, jakie konfiguracje zabezpieczeń (jeśli w ogóle) mają zostać zastosowane podczas instalacji
3. Instalacja i konfiguracja Helm.

### Zainstaluj Kubernetesa lub uzyskaj dostęp do klastra {#install-kubernetes-or-have-access-to-a-cluster}

- Musisz mieć zainstalowanego Kubernetesa. Dla najnowszego wydania
  Helma, zalecamy najnowsze stabilne wydanie Kubernetesa, które w
  większości przypadków jest przedostatnim _mniejszym wydaniem_ (ang. minor release).
- Powinieneś również mieć lokalnie skonfigurowaną kopię `kubectl`.

Zobacz [politykę wsparcia wersji Helma](https://helm.sh/docs/topics/version_skew/) dotyczącą maksymalnych różnic w wersjach wspieranych pomiędzy Helmem a Kubernetesem.

## Zainstaluj Helma {#install-helm}

Pobierz binarną wersję klienta Helma. Możesz użyć narzędzi takich jak
`homebrew` lub sprawdzić [oficjalną stronę wydań](https://github.com/helm/helm/releases).

Aby uzyskać więcej szczegółów, zobacz [przewodnik instalacji](/intro/install.mdx).

## Zainicjuj repozytorium chartów Helma (ang. Helm Chart Repository) {#initialize-a-helm-chart-repository}

Gdy Helm jest gotowy, możesz dodać repozytorium
chartów. Sprawdź [Artifact Hub](https://artifacthub.io/packages/search?kind=0)
w poszukiwaniu dostępnych repozytoriów.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Po zainstalowaniu będziesz w stanie wyświetlić listę chartów, które możesz zainstalować:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## Zainstaluj przykładowy chart {#install-an-example-chart}

Aby zainstalować chart, można użyć polecenia
`helm install`. Helm ma kilka sposobów na znalezienie i
zainstalowanie chartu, ale najprostszym jest użycie chartów `bitnami`.

```console
$ helm repo update              # Upewnij się, że mamy najnowszą listę chartów
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

W powyższym przykładzie wydano chart `bitnami/mysql`,
a nazwa naszego nowego wydania to `mysql-1612624192`.

Aby uzyskać podstawowe informacje na temat funkcji tego chartu MySQL,
uruchom `helm show chart bitnami/mysql`. Możesz również uruchomić
`helm show all bitnami/mysql`, aby uzyskać wszystkie informacje na temat tego chartu.

Za każdym razem, gdy instalujesz chart, tworzone jest nowe wydanie (ang.
release). W związku z tym jeden chart może być zainstalowany wielokrotnie w tym samym
klastrze. I każdy z nich może być zarządzany i aktualizowany niezależnie.

Polecenie `helm install` jest bardzo potężnym poleceniem o wielu możliwościach. Aby dowiedzieć
się więcej na jego temat, zapoznaj się z [Przewodnikiem użytkownika Helma](/intro/using_helm.mdx)

## O wydaniach {#learn-about-releases}

Za pomocą Helma można łatwo zobaczyć, co zostało wydane:

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

Funkcja `helm list` (lub `helm ls`) pokaże listę wszystkich wdrożonych wydań.

## Odinstalowanie wydania {#uninstall-a-release}

Aby odinstalować wydanie, użyj polecenia `helm uninstall`:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

To odinstaluje `mysql-1612624192` z Kubernetesa, czyli usunie
wszystkie zasoby związane z wydaniem, jak również historię tego wydania.

Jeśli zostanie użyta flaga `--keep-history`, historia wydania
zostanie zachowana. Będziesz mógł uzyskać informacje na temat tego wydania:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Ponieważ Helm śledzi Twoje wydania nawet po ich odinstalowaniu, możesz przeprowadzić audyt
historii klastra, a nawet cofnąć usunięcie wydania (za pomocą `helm rollback`).

## Czytanie tekstu pomocy {#reading-the-help-text}

Aby dowiedzieć się więcej o dostępnych poleceniach
Helma, użyj `helm help` lub wpisz polecenie z flagą `-h`:

```console
$ helm get -h
```
