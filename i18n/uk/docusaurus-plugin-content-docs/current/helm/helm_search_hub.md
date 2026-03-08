---
title: helm search hub
---

Шукати чарти в Artifact Hub або у власному екземплярі хабу

### Опис {#synopsis}

Шукайте Helm чарти в Artifact Hub або у власному екземплярі хабу.

Artifact Hub — це вебдодаток, що дозволяє знаходити, встановлювати та публікувати пакети та конфігурації для проєктів CNCF, включаючи загальнодоступні розподілені чарти Helm. Це проєкт пісочниці Cloud Native Computing Foundation. Ви можете переглянути хаб за адресою https://artifacthub.io/

Аргумент [KEYWORD] приймає або рядок ключового слова, або рядок у лапках з розширеними параметрами запиту. Документацію щодо розширених параметрів запиту див. за адресою https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

Попередні версії Helm використовували екземпляр Monocular як стандартну «точку доступу», тому для забезпечення зворотної сумісності Artifact Hub сумісний з API пошуку Monocular. Аналогічно, при встановленні прапорця `endpoint` вказана точка доступу також повинна реалізовувати точку доступу API пошуку, сумісну з Monocular. Зверніть увагу, що при вказанні екземпляра Monocular як `endpoint` розширені запити не підтримуються. Детальні відомості про API див. на https://github.com/helm/monocular

```shell
helm search hub [KEYWORD] [flags]
```

### Параметри {#options}

```none
      --endpoint string      Екземпляр хаба для запитів чартів (стандартно "https://hub.helm.sh")
      --fail-on-no-result    пошук завершується невдачею, якщо немає результатів
  -h, --help                 довідка hub
      --list-repo-url        вивести URL репозиторію чартів
      --max-col-width uint   максимальна ширина стовпця для таблиці виводу (стандартно 50)
  -o, --output format        виводить результати у вказаному форматі. Дозволені значення: table, json, yaml (стандартно table)
```

### Параметри, успадковані від батьківських команд {#options-inherited-from-parent-commands}

```none
      --burst-limit int                 стандартні обмеження на стороні клієнта (стандартно 100)
      --color string                    використовувати кольоровий вивід (never, auto, always) (стандартно "auto")
      --colour string                   використовувати кольоровий вивід (never, auto, always) (стандартно "auto")
      --content-cache string            шлях до теки, що містить кешований вміст (наприклад, чарти) (стандартно "~/.cache/helm/content")
      --debug                           вмикає розширений вивід
      --kube-apiserver string           адреса і порт сервера API Kubernetes
      --kube-as-group stringArray       група для імперсонації під час операції, цей прапорець може бути повторений для вказання кількох груп
      --kube-as-user string             імʼя користувача для імперсонації під час операції
      --kube-ca-file string             файл центру сертифікаці (СА) для підключення до сервера API Kubernetes
      --kube-context string             імʼя контексту kubeconfig для використання
      --kube-insecure-skip-tls-verify   якщо встановлено true, сертифікат сервера API Kubernetes не буде перевірятися на дійсність. Це робить ваші HTTPS-зʼєднання незахищеними
      --kube-tls-server-name string     імʼя сервера для перевірки сертифіката сервера API Kubernetes. Якщо не вказано, використовується імʼя хоста, що використовується для підключення до сервера
      --kube-token string               токен на предʼявника, який використовується для автентифікації
      --kubeconfig string               шлях до файлу kubeconfig
  -n, --namespace string                простір імен для цього запиту
      --qps float32                     кількість запитів в секунду під час взаємодії з API Kubernetes, не включаючи сплески
      --registry-config string          шлях до файлу конфігурації реєстру (стандартно "~/.config/helm/registry/config.json")
      --repository-cache string         шлях до теки, що містить кешовані індекси репозиторіїв (стандартно "~/.cache/helm/repository")
      --repository-config string        шлях до теки, що містить кешлях до файлу, що містить імена та URL репозиторіїв (стандартно "~/.config/helm/repositories.yaml")
```

### ДИВИТИСЯ ТАКОЖ {#see-also}

* [helm search](/helm/helm_search.md) — пошук за ключовим словом в чартах

###### Автоматично згенеровано spf13/cobra 14 січня 2026 року
