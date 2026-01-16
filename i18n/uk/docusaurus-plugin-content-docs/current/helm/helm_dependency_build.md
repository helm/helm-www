---
title: helm dependency build
---

Відновлення теки charts/ на основі файлу Chart.lock

### Опис {#synopsis}

Ця команда будує теку `charts/` на основі файлу `Chart.lock`.

Команда `build` використовується для відновлення залежностей чарту до стану, зазначеного у файлі блокування. Вона не переузгоджуватиме залежності, як це робить `helm dependency update`.

Якщо файл блокування не знайдено, `helm dependency build` дзеркально повторюватиме поведінку команди `helm dependency update`.

```sh
helm dependency build CHART [flags]
```

### Параметри {#options}

```none
      --ca-file string             перевірити сертифікати серверів з підтримкою HTTPS за допомогою цього пакета CA
      --cert-file string           ідентифікувати клієнта HTTPS за допомогою цього файлу сертифіката SSL
  -h, --help                       довідка build
      --insecure-skip-tls-verify   пропустити перевірку сертифіката TLS для завантаження чарта
      --key-file string            ідентифікувати клієнта HTTPS за допомогою цього файлу ключа SSL
      --keyring string             вʼязка ключів, що містить відкриті ключі ( стандартно "~/.gnupg/pubring.gpg")
      --password string            пароль сховища чартів, де знаходиться запитуваний чарт
      --plain-http                 використовувати незахищені HTTP-зʼєднання для завантаження чартів
      --skip-refresh               не оновлювати кеш локального репозиторію
      --username string            імʼя користувача сховища чартів, де знаходиться запитуваний чарт
      --verify                     перевірити пакети на відповідність підписам
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

* [helm dependency](/helm/helm_dependency.md) — керування залежностями чарта

###### Автоматично згенеровано spf13/cobra 14 січня 2026 року
