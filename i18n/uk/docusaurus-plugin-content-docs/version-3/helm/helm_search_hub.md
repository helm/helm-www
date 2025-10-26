---
title: helm search hub
---
шукати чарти в Artifact Hub або у власному екземплярі хабу

### Опис {#synopsis}

Шукайте Helm чарти в Artifact Hub або у власному екземплярі хабу.

Artifact Hub — це вебзастосунок, що дозволяє знаходити, встановлювати та публікувати пакети та конфігурації для проєктів CNCF, включаючи публічно доступні розподілені Helm чарти. Це проєкт Sandbox Cloud Native Computing Foundation. Ви можете переглянути хаб за адресою https://artifacthub.io/

Аргумент [KEYWORD] приймає як ключове слово, так і рядок з параметрами розширеного запиту. Документацію з параметрів розширеного запиту дивіться на https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

Попередні версії Helm використовували екземпляр Monocular як стандартне значення для 'endpoint', тому для зворотної сумісності Artifact Hub сумісний з API пошуку Monocular. Аналогічно, при встановленні прапорця 'endpoint' зазначена точка доступу також має реалізовувати API пошуку, сумісний з Monocular. Зверніть увагу, що при вказівці екземпляра Monocular як 'endpoint', розширені запити не підтримуються. Для деталей API дивіться https://github.com/helm/monocular

```shell
helm search hub [KEYWORD] [flags]
```

### Параметри {#options}

```none
      --endpoint string      Екземпляр хаба для запитів чартів (стандартно "https://hub.helm.sh")
      --fail-on-no-result    пошук не вдається, якщо результати не знайдені
  -h, --help                 довідка hub
      --list-repo-url        вивести URL репозиторію чартів
      --max-col-width uint   максимальна ширина стовпця для таблиці виводу (стандартно 50)
  -o, --output format        вивести результат у вказаному форматі. Доступні значення: table, json, yaml (стандартно table)
```

### Параметри, успадковані від батьківських команд {#options-inherited-from-parent-commands}

```none
      --burst-limit int                 стандартні обмеження на стороні клієнта (стандартно 100)
      --debug                           увімкнути розширений вивід
      --kube-apiserver string           адреса та порт сервера API Kubernetes
      --kube-as-group stringArray       група для імперсонації під час операції, цей прапор може бути повторений для вказання кількох груп.
      --kube-as-user string             імʼя користувача для імперсонації під час операції
      --kube-ca-file string             файл центру сертифікаці СА для підключення до сервера API Kubernetes
      --kube-context string             імʼя контексту kubeconfig для використання
      --kube-insecure-skip-tls-verify   якщо встановлено true, сертифікат сервера API Kubernetes не буде перевірятися на дійсність. Це робить ваші HTTPS-зʼєднання небезпечними
      --kube-tls-server-name string     імʼя сервера для перевірки сертифіката сервера API Kubernetes. Якщо не вказано, використовується імʼя хоста, що використовується для підключення до сервера
      --kube-token string               токен на предʼявника, який використовується для автентифікації
      --kubeconfig string               шлях до файлу kubeconfig
  -n, --namespace string                простір імен для цього запиту
      --qps float32                     кількість запитів в секунду під час взаємодії з API Kubernetes, не включаючи сплески
      --registry-config string          шлях до файлу конфігурації реєстру (стандартно "~/.config/helm/registry/config.json")
      --repository-cache string         шлях до теки, що містить кешовані індекси репозиторіїв (стандартно "~/.cache/helm/repository")
      --repository-config string        шлях до файлу, що містить імена та URL репозиторіїв (стандартно "~/.config/helm/repositories.yaml")
```

### ДИВІТЬСЯ ТАКОЖ {#see-also}

* [helm search](/helm/helm_search.md) — пошук ключового слова в чартах

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
