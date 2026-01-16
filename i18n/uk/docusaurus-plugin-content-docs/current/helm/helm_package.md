---
title: helm package
---

Упакувати теку чарту в архів чартів

### Опис {#synopsis}

Ця команда упаковує чарт в архів чартів з версією. Якщо вказано шлях, команда перевіряє цей шлях на наявність чарту (який повинен містити файл `Chart.yaml`) і потім упаковує цю теку.

Архіви чартів з версією використовуються репозиторіями пакетів Helm.

Щоб підписати чарт, використовуйте прапорець `--sign`. У більшості випадків вам також слід вказати `--keyring path/to/secret/keys` та `--key keyname`.

```shell
$ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg
```

Якщо `--keyring` не вказано, Helm зазвичай використовує публічний ключ, якщо тільки ваше середовище не налаштоване інакше.


```shell
helm package [CHART_PATH] [...] [flags]
```

### Параметри {#options}

```none
      --app-version string         встановити appVersion в чарті на цю версію
      --ca-file string             перевірити сертифікати серверів з підтримкою HTTPS за допомогою цього пакета CA
      --cert-file string           ідентифікувати клієнта HTTPS за допомогою цього файлу сертифіката SSL
  -u, --dependency-update          оновити залежності з "Chart.yaml" в теці "charts/" перед упаковкою
  -d, --destination string         місце для збереження чарту. (стандартно ".")
  -h, --help                       довідка package
      --insecure-skip-tls-verify   пропустити перевірку сертифіката TLS для завантаження чарта
      --key string                 імʼя ключа для використання під час підписання. Використовується, якщо `--sign` є true
      --key-file string            ідентифікувати клієнта HTTPS за допомогою цього файлу ключа SSL
      --keyring string             місце для публічного ключа (стандартно "~/.gnupg/pubring.gpg")
      --passphrase-file string     місце розташування файлу, що містить пароль для ключа підпису. Використовуйте "-" для читання з stdin.
      --password string            пароль сховища чартів, де знаходиться запитуваний чарт
      --plain-http                 використовувати незахищені HTTP-зʼєднання для завантаження чартів
      --sign                       використовувати приватний ключ PGP для підписання цього пакета
      --username string            імʼя користувача сховища чартів, де знаходиться запитуваний чарт
      --version string             встановити версію чарту на цю версію semver
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

* [helm](/helm/helm.md) — Helm, менеджер пакетів для Kubernetes.

###### Автоматично згенеровано spf13/cobra 14 січня 2026 року
