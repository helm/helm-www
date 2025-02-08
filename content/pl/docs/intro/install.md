---
title: "Instalacja Helma"
description: "Poznaj proces instalacji i konfiguracji Helma."
weight: 2
aliases: ["/docs/install/"]
---

Ten przewodnik pokazuje, jak zainstalować Helm CLI. Helm można go
zainstalować albo ze źródła, albo z prekompilowanych wydań binarnych.

## Z Projektu Helm {#from-the-helm-project}

Projekt Helm udostępnia dwa sposoby pobierania i instalacji Helm. Są to
oficjalne metody uzyskiwania wersji Helm. Oprócz tego, społeczność Helm
oferuje sposoby instalacji Helm za pośrednictwem różnych menedżerów
pakietów. Instalacja za pomocą tych metod znajduje się poniżej oficjalnych metod.

### Z wydania binarnego {#from-the-binary-releases}

Każde [wydanie](https://github.com/helm/helm/releases)
Helm dostarcza _wydania binarne_ dla różnych systemów
operacyjnych. Te wersje binarne można pobrać ręcznie i zainstalować.

1. Pobierz [wybraną wersję](https://github.com/helm/helm/releases)
2. Rozpakuj (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Znajdź plik binarny `helm` w rozpakowanym katalogu i przenieś go do wybranego
   miejsca docelowego (`mv linux-amd64/helm /usr/local/bin/helm`)

Stamtąd powinieneś być w stanie uruchomić klienta i
[dodać stabilne repozytorium chartów](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository):
`helm help`.

**Uwaga:** Zautomatyzowane testy Helm są wykonywane wyłącznie dla Linux AMD64
podczas budowania i wydawania w GitHub Actions. Testowanie innych systemów operacyjnych
jest odpowiedzialnością społeczności pragnącej używać Helm dla innego systemu operacyjnego.

### Ze skryptu {#from-script}

Helm posiada teraz skrypt instalacyjny, który automatycznie
pobierze najnowszą wersję Helm i
[zainstaluje ją lokalnie](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Możesz pobrać ten skrypt, a następnie wykonać go lokalnie. Jest on dobrze
udokumentowany, dzięki czemu możesz go przeczytać i zrozumieć, co robi, zanim go uruchomisz.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Tak, możesz użyć `curl`
https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` jeśli
chcesz podjąć ryzyko.

## Za pomocą menedżerów pakietów {#through-package-managers}

Społeczność Helm umożliwia instalację Helm za pośrednictwem
menedżerów pakietów systemu operacyjnego. Nie są one wspierane przez
projekt Helm i nie są uznawane za zaufane strony trzecie.

### Z Homebrew (macOS) {#from-homebrew-macos}

Członkowie społeczności Helm przyczynili się do stworzenia formuły
Helm dla Homebrew. Ta formuła jest na ogół aktualna.

```console
brew install helm
```

(Uwaga: Istnieje również formuła dla emacs-helm, który jest innym projektem.)

### Z Chocolatey (Windows) {#from-chocolatey-windows}

Członkowie społeczności Helm przyczynili się do stworzenia kompilacji [pakietu Helm](https://chocolatey.org/packages/kubernetes-helm)
dla
[Chocolatey](https://chocolatey.org/). Ten pakiet jest zazwyczaj aktualny.

```console
choco install kubernetes-helm
```

### Z Scoop (Windows) {#from-scoop-windows}

Członkowie społeczności Helm przyczynili się do zbudowania pakietu
[Helm](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json) dla [Scoop](https://scoop.sh). Ten Pakiet jest zazwyczaj aktualny.

```console
scoop install helm
```

### Z Winget (Windows) {#from-winget-windows}

Członkowie społeczności Helm przyczynili się do stworzenia [pakietu Helm](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm)
dla [Winget](https://learn.microsoft.com/en-us/windows/package-manager/). Ten pakiet jest zazwyczaj aktualny.

```console
winget install Helm.Helm
```

### Z APT (Debian/Ubuntu) {#from-apt-debianubuntu}

Członkowie społeczności Helm przyczynili się do
stworzenia [pakietu Helm](https://helm.baltorepo.com/stable/debian/)
dla Apt. Ten pakiet jest zazwyczaj aktualny.

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Z menedżera dnf/yum (fedora) {#from-dnfyum-fedora}
Od Fedora 35, helm jest dostępny w oficjalnym
repozytorium. Możesz zainstalować helm, wywołując:

```console
sudo dnf install helm
```

### From Snap {#from-snap}

Społeczność [Snapcrafters](https://github.com/snapcrafters)
utrzymuje wersję Snap [pakietu Helm](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

### From pkg (FreeBSD) {#from-pkg-freebsd}

Członkowie społeczności FreeBSD przyczynili się do
stworzenia kompilacji [pakietu Helm](https://www.freshports.org/sysutils/helm)
w [FreeBSD Ports Collection](https://man.freebsd.org/ports).
Pakiet ten jest zazwyczaj aktualny.

```console
pkg install helm
```

### Development Builds {#development-builds}

Oprócz oficjalnych wydań możesz
pobierać lub instalować wersje rozwojowe Helm.

### Canary Builds {#from-canary-builds}

Wersje "Canary" to wersje oprogramowania Helm, które są budowane z
najnowszej gałęzi `main`. Nie są to oficjalne wydania i mogą być
niestabilne. Jednakże, oferują możliwość testowania najnowszych funkcji.

Binaria Canary Helm są przechowywane w
[get.helm.sh](https://get.helm.sh). Oto linki do często używanych kompilacji:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Eksperymentalny Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)
  

### Ze źródła (Linux, macOS) {#from-source-linux-macos}

Budowanie Helm ze źródła wymaga nieco więcej pracy, ale jest najlepszym
wyborem, jeśli chcesz przetestować najnowszą (przedpremierową) wersję Helm.

Musisz mieć działające środowisko Go.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

To polecenie, jeśli będzie konieczne, pobierze zależności i zapisze je w pamięci
podręcznej oraz zweryfikuje konfigurację. Następnie skompiluje `helm` i umieści go w `bin/helm`.

## Podsumowanie {#conclusion}

W większości przypadków instalacja sprowadza się do uzyskania
gotowego binarnego pliku `helm`. Ten dokument omawia dodatkowe
przypadki dla tych, którzy chcą robić bardziej zaawansowane rzeczy z Helm.

Gdy klient Helm jest już pomyślnie zainstalowany, możesz przejść do
użycia Helma do zarządzania chartami i [dodania stabilnego repozytorium chartów](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository).

