---
title: helm registry login
---

Вхід до реєстру

### Опис {#synopsis}

Автентифікація у віддаленому реєстрі.

Наприклад, для реєстру контейнерів Github:

```shell
echo "$GITHUB_TOKEN" | helm registry login ghcr.io -u $GITHUB_USER --password-stdin
```

```shell
helm registry login [host] [flags]
```

### Параметри {#options}

```none
      --ca-file string     перевірити сертифікати серверів з підтримкою HTTPS за допомогою цього пакета CA
      --cert-file string   ідентифікувати клієнта реєстру за допомогою цього файлу сертифіката SSL
  -h, --help               довідка login
      --insecure           дозволити зʼєднання з TLS-реєстром без сертифікатів
      --key-file string    ідентифікувати клієнта реєстру за допомогою цього файлу ключа SSL
  -p, --password string    пароль для реєстру або токен ідентифікації
      --password-stdin     пароль для реєстру або токен ідентифікації
      --plain-http         використовувати незахищені HTTP-зʼєднання для завантаження чартів
  -u, --username string    імʼя користувача реєстру
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

* [helm registry](/helm/helm_registry.md) — увійти або вийти з реєстру

###### Автоматично згенеровано spf13/cobra 14 січня 2026 року
