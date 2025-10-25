---
title: Шпаргалка
description: Шпаргалка Helm
sidebar_position: 4
---

Підказка Helm з усіма необхідними командами для керування програмою через Helm.

---

### Основні інтерпретації/контекст {#basic-interpretations-context}

**Chart (Чарт):**
- Це назва вашого чарту у випадку, якщо його було завантаженла та розпаковано.
- Це `<repo_name>/<chart_name>`, якщо репозиторій був доданий, але чарт не завантажений.
- Це URL/Абсолютний шлях до чарту.

**Name (Назва):**
- Це назва, яку ви хочете надати вашій поточній установці Helm-чарту.

**Release (Реліз):**
- Це назва, яку ви присвоїли екземпляру установки.

**Revision (Версія):**
- Це значення з команди Helm history.

**Repo-name (Назва репозиторію):**
- Назва репозиторію.

**DIR (Тека):**
- Назва/шлях теки.

---

### Управління чартами {#chart-management}

```bash
helm create <name>                      # Створює теку чарту разом з загальними файлами та теками, які використовуються в чарті.
helm package <chart-path>               # Упаковує чарт у файл архіву з версією.
helm lint <chart>                       # Запускає тести для перевірки чарту та виявлення можливих проблем.
helm show all <chart>                   # Переглядає чарт та виводить його вміст.
helm show values <chart>                # Показує вміст файлу values.yaml.
helm pull <chart>                       # Завантажує/витягує чарт.
helm pull <chart> --untar=true          # Якщо встановлено в true, розпаковує чарт після завантаження.
helm pull <chart> --verify              # Перевіряє пакет перед використанням.
helm pull <chart> --version <number>    # СТандартно використовується остання версія, вкажіть обмеження версії для використання чарту.
helm dependency list <chart>            # Відображає список залежностей чарту.
```

---

### Встановлення та видалення застосунків {#install-and-uninstall-apps}

```bash
helm install <name> <chart>                           # Встановлює чарт з зазначеною назвою.
helm install <name> <chart> --namespace <namespace>   # Встановлює чарт у певному просторі імен.
helm install <name> <chart> --set key1=val1,key2=val2 # Встановлює значення в командному рядку (можна вказати кілька значень, розділених комами).
helm install <name> <chart> --values <yaml-file/url>  # Встановлює чарт з вказаними вами значеннями.
helm install <name> <chart> --dry-run --debug         # Запускає тестове встановлення для перевірки чарту.
helm install <name> <chart> --verify                  # Перевіряє пакет перед використанням.
helm install <name> <chart> --dependency-update       # Оновлює залежності, якщо вони відсутні, перед встановленням чарту.
helm uninstall <name>                                 # Видаляє реліз.
```

---

### Оновлення застосунків та відкат {#perform-app-upgrade-and-rollback}

```bash
helm upgrade <release> <chart>                            # Оновлює реліз.
helm upgrade <release> <chart> --atomic                   # Якщо встановлено, процес оновлення поверне зміни в разі невдалого оновлення.
helm upgrade <release> <chart> --dependency-update        # Оновлює залежності, якщо вони відсутні, перед встановленням чарту.
helm upgrade <release> <chart> --version <version_number> # Вказує обмеження версії для використання чарту.
helm upgrade <release> <chart> --values                   # Вказує значення у YAML файлі або URL (можна вказати кілька).
helm upgrade <release> <chart> --set key1=val1,key2=val2  # Встановлює значення d командному рядку (можна вказати кілька значень).
helm upgrade <release> <chart> --force                    # Примусове оновлення ресурсів через стратегію заміни.
helm rollback <release> <revision>                        # Повертає реліз до певної версії.
helm rollback <release> <revision>  --cleanup-on-fail     # Дозволяє видалення нових ресурсів, створених під час цього відкату, якщо відкат не вдалося здійснити.
``` 

---

### Вивід списку, додавання, видалення та оновлення репозиторіїв {#list-add-remove-and-update-repositories}

```bash
helm repo add <repo-name> <url>   # Додає репозиторій з Інтернету.
helm repo list                    # Переглядає список доданих репозиторіїв чартів.
helm repo update                  # Оновлює інформацію про доступні чарти локально з репозиторіїв чартів.
helm repo remove <repo_name>      # Видаляє один або кілька репозиторіїв чартів.
helm repo index <DIR>             # Читає поточну теку та генерує файл індексу на основі знайдених чартів.
helm repo index <DIR> --merge     # Зливає згенерований індекс з існуючим файлом індексу.
helm search repo <keyword>        # Шукає в репозиторіях за ключовим словом в чарті.
helm search hub <keyword>         # Шукає чарт в Artifact Hub або у вашому власному хабі.
```

---

### Моніторинг релізів Helm {#helm-release-monitoring}

```bash
helm list                       # Переглядає всі релізи для вказаного простору імен, використовує поточний контекст простору імен, якщо простір не вказано.
helm list --all                 # Показує всі релізи без жодних фільтрів, можна використовувати -a.
helm list --all-namespaces      # Переглядає релізи по всіх просторах імен, можна використовувати -A.
helm list -l key1=value1,key2=value2 # Селектор (запит за мітками) для фільтрації, підтримує '=', '==' і '!='.
helm list --date                # Сортує за датою релізу.
helm list --deployed            # Показує розгорнуті релізи. Якщо не вказано інше, це буде автоматично увімкнено.
helm list --pending             # Показує очікуючі релізи.
helm list --failed              # Показує невдалі релізи.
helm list --uninstalled         # Показує видалені релізи (якщо використовувався 'helm uninstall --keep-history').
helm list --superseded          # Показує замінені релізи.
helm list -o yaml               # Виводить результат у вказаному форматі. Дозволені значення: table, json, yaml (стандартно table).
helm status <release>           # Ця команда показує статус зазначеного релізу.
helm status <release> --revision <number>   # Якщо встановлено, відображає статус зазначеного релізу з версією.
helm history <release>          # Історичні версії для даного релізу.
helm env                        # Env виводить всю інформацію про середовище, що використовується Helm.
```

---

### Завантаження інформації про реліз {#download-release-information}

```bash
helm get all <release>      # Колекція інформації про нотатки, хуки, надані значення та згенерований маніфест файлу для вказаного релізу.
helm get hooks <release>    # Завантажує хуки для вказаного релізу. Хуки форматує у YAML і розділяє за допомогою роздільника YAML '---\n'.
helm get manifest <release> # Маніфест є YAML-кодованим поданням ресурсів Kubernetes, що були згенеровані з цього релізу чарту. Якщо чарт залежить від інших чартів, ці ресурси також будуть включені в маніфест.
helm get notes <release>    # Показує нотатки, надані чартом для зазначеного релізу.
helm get values <release>   # Завантажує файл значень для даного релізу. Використовуйте -o для форматування виходу.
```

---

### Управління втулками {#plugin-management}

```bash
helm plugin install <path/url1>     # Встановлення втулків.
helm plugin list                    # Перегляд списку всіх встановлених втулків.
helm plugin update <plugin>         # Оновлення втулків.
helm plugin uninstall <plugin>      # Видалення втулка.
```

---
