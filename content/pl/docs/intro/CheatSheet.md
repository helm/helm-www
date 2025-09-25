---
title: "Ściągawka"
description: "Ściągawka Helm"
weight: 4
---

Arkusz ściągawki zawiera wszystkie niezbędne polecenia wymagane do zarządzania aplikacją za pomocą Helm.

------------------------------------------------------------------------------------------------------------------------------------------------
### Podstawowe znaczenia i kontekst {#basic-interpretationscontext}

Chart:
- Jest to nazwa twojego chartu w przypadku, gdy został on pobrany i rozpakowany.
- Jest to <repo_name>/<chart_name> w przypadku, gdy repozytorium zostało dodane, ale chart nie został pobrany.
- Jest to URL/absolutna ścieżka do chartu.

Nazwa:
- Jest to nazwa, którą chcesz nadać bieżącej instalacji chartu helm.

Wydanie (ang. release):
- Jest to nazwa przypisana do instancji instalacyjnej.

Rewizja (ang. revision):
- Jest to wartość z polecenia historii Helm.

Nazwa repozytorium (ang. Repo-name):
- Nazwa repozytorium.

Katalog (ang. DIR):
- Nazwa katalogu / ścieżka

------------------------------------------------------------------------------------------------------------------------------------------------

### Zarządzanie Chartem {#chart-management}

```bash
helm create <name>                      # Tworzy katalog chartu wraz z typowymi plikami i katalogami używanymi w chartach.
helm package <chart-path>               # Pakuje chart do wersjonowanego pliku archiwum chartu.
helm lint <chart>                       # Uruchamia testy w celu sprawdzenia chartu i wykrycia potencjalnych problemów.
helm show all <chart>                   # Inspekcja chartu i wyświetlenie jego zawartości.
helm show values <chart>                # Wyświetla zawartość pliku values.yaml.
helm pull <chart>                       # Pobiera/ściąga chart.
helm pull <chart> --untar=true          # Jeśli ustawione na true, rozpakowuje (untar) chart po pobraniu.
helm pull <chart> --verify              # Weryfikuje pakiet przed jego użyciem.
helm pull <chart> --version <number>    # Domyślnie używana jest najnowsza wersja, można określić wersję chartu do użycia.
helm dependency list <chart>            # Wyświetla listę zależności chartu.
``` 
--------------------------------------------------------------------------------------------------------------------------------------------------

### Instalowanie i odinstalowywanie aplikacji {#install-and-uninstall-apps}

```bash
helm install <name> <chart>                           # Instalacja chartu z określoną nazwą.
helm install <name> <chart> --namespace <namespace>   # Instalacja chartu w określonej przestrzeni nazw (namespace).
helm install <name> <chart> --set key1=val1,key2=val2 # Ustawienie wartości z poziomu wiersza poleceń (można podać wiele wartości, oddzielając je przecinkami).
helm install <name> <chart> --values <yaml-file/url>  # Instalacja chartu z określonymi wartościami.
helm install <name> <chart> --dry-run --debug         # Przeprowadzenie testowej instalacji w celu walidacji chartu.
helm install <name> <chart> --verify                  # Weryfikacja pakietu przed użyciem.
helm install <name> <chart> --dependency-update       # Aktualizacja zależności, jeśli ich brakuje, przed instalacją chartu.
helm uninstall <name>                                 # Odinstalowanie wydania (release).
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Wykonowanie aktualizacji i przywracania aplikacji {#perform-app-upgrade-and-rollback}

```bash
helm upgrade <release> <chart>                            # Zaktualizuj wydanie (release).
helm upgrade <release> <chart> --atomic                   # Jeśli ustawione, proces aktualizacji cofnie zmiany w przypadku niepowodzenia.
helm upgrade <release> <chart> --dependency-update        # Zaktualizuj brakujące zależności przed instalacją chartu.
helm upgrade <release> <chart> --version <version_number> # Określ wersję chartu do użycia.
helm upgrade <release> <chart> --values                   # Określ wartości w pliku YAML lub adresie URL (można podać wiele).
helm upgrade <release> <chart> --set key1=val1,key2=val2  # Ustaw wartości z poziomu wiersza poleceń (można podać wiele wartości, oddzielając je przecinkami).
helm upgrade <release> <chart> --force                    # Wymuś aktualizację zasobów poprzez strategię zastępowania.
helm rollback <release> <revision>                        # Przywróć wydanie (release) do określonej rewizji.
helm rollback <release> <revision> --cleanup-on-fail      # Usuń nowo utworzone zasoby w przypadku niepowodzenia rollbacku.
``` 
------------------------------------------------------------------------------------------------------------------------------------------------
### Listowanie, dodawanie, usuwanie i aktualizacja repozytoriów {#list-add-remove-and-update-repositories}

```bash
helm repo add <repo-name> <url>   # Dodanie repozytorium z internetu
helm repo list                    # Wyświetlenie listy dodanych repozytoriów chartów
helm repo update                  # Aktualizacja lokalnych informacji o dostępnych chartach z repozytoriów
helm repo remove <repo_name>      # Usunięcie jednego lub więcej repozytoriów chartów
helm repo index <DIR>             # Odczyt bieżącego katalogu i wygenerowanie pliku indeksu na podstawie znalezionych chartów
helm repo index <DIR> --merge     # Połączenie wygenerowanego indeksu z istniejącym plikiem indeksu
helm search repo <keyword>        # Wyszukiwanie chartów w repozytoriach na podstawie słowa kluczowego
helm search hub <keyword>         # Wyszukiwanie chartów w Artifact Hub lub własnej instancji huba
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Monitorowanie wydania Helm {#helm-release-monitoring}

```bash
helm list                       # Wyświetla wszystkie wydania (releases) dla określonej przestrzeni nazw (namespace), jeśli nie podano namespace, używa aktualnego kontekstu.
helm list --all                 # Pokaż wszystkie wydania bez stosowania filtrów (można użyć -a).
helm list --all-namespaces      # Wyświetl wydania we wszystkich przestrzeniach nazw (można użyć -A).
helm list -l key1=value1,key2=value2 # Filtrowanie wydań na podstawie selektora (zapytanie o etykiety), obsługuje '=', '==', oraz '!='.
helm list --date                # Sortowanie według daty wydania.
helm list --deployed            # Wyświetlanie tylko wdrożonych wydań. Jeśli nie podano innej opcji, ta jest domyślnie włączona.
helm list --pending             # Pokaż wydania o statusie "oczekujące".
helm list --failed              # Pokaż wydania, które zakończyły się niepowodzeniem.
helm list --uninstalled         # Pokaż odinstalowane wydania (jeśli użyto 'helm uninstall --keep-history').
helm list --superseded          # Pokaż zastąpione (superseded) wydania.
helm list -o yaml               # Wyświetla wynik w określonym formacie. Dozwolone wartości: table, json, yaml (domyślnie table).
helm status <release>           # Wyświetla status określonego wydania.
helm status <release> --revision <number>   # Jeśli ustawione, pokazuje status określonego wydania dla wybranej rewizji.
helm history <release>          # Wyświetla historię rewizji dla określonego wydania.
helm env                        # Wyświetla wszystkie informacje o środowisku używanym przez Helm.
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Pobieranie informacji o wydaniu {#download-release-information}

```bash
helm get all <release>      # Czytelny zbiór informacji o notatkach, hookach, przekazanych wartościach i wygenerowanym pliku manifestu dla danego wydania.
helm get hooks <release>    # Pobiera hooki dla określonego wydania. Hooki są sformatowane w YAML i oddzielone separatorem YAML '---\n'.
helm get manifest <release> # Manifest to zakodowana w YAML reprezentacja zasobów Kubernetes wygenerowanych z chartu danego wydania. Jeśli chart zależy od innych chartów, ich zasoby również zostaną uwzględnione w manifeście.
helm get notes <release>    # Wyświetla notatki dostarczone przez chart dla określonego wydania.
helm get values <release>   # Pobiera plik wartości dla danego wydania. Można użyć opcji -o do sformatowania wyjścia.
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Zarządzanie wtyczkami {#plugin-management}

```bash
helm plugin install <path/url>      # Instalacja wtyczek
helm plugin list                    # Wyświetlenie listy wszystkich zainstalowanych wtyczek
helm plugin update <plugin>         # Aktualizacja wtyczek
helm plugin uninstall <plugin>      # Odinstalowanie wtyczki
```
------------------------------------------------------------------------------------------------------------------------------------------------
