---
title: helm repo add
---

Додати репозиторій чартів

```shell
helm repo add [NAME] [URL] [flags]
```

### Параметри {#options}

```none
      --allow-deprecated-repos     стандартно ця команда не дозволяє додавати офіційні репозиторії, які були назавжди видалені. Ця опція вимикає таку поведінку
      --ca-file string             перевірити сертифікати серверів з підтримкою HTTPS за допомогою цього пакета CA
      --cert-file string           ідентифікувати клієнта HTTPS за допомогою цього файлу сертифіката SSL
      --force-update               замінити (перезаписати) репозиторій, якщо він уже існує
  -h, --help                       довідка add
      --insecure-skip-tls-verify   пропустити перевірку tls-сертифікатів для репозиторію
      --key-file string            ідентифікувати клієнта HTTPS за допомогою цього файлу ключа SSL
      --pass-credentials           передати облікові дані всім доменам
      --password string            пароль до репозиторію чартів
      --password-stdin             зчитати пароль до репозиторію чартів з stdin
      --timeout duration           час очікування завершення завантаження індексного файлу (стандартно 2m0s)
      --username string            імʼя користувача репозиторію чартів
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

* [helm repo](/helm/helm_repo.md) — додати, переглянути, видалити, оновити та індексувати репозиторії чартів

###### Автоматично згенеровано spf13/cobra 14 січня 2026 року
