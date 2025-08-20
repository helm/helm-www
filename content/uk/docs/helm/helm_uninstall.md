---
title: "Helm Uninstall"
---

## helm uninstall

видалити реліз

### Опис {#synopsis}

Ця команда приймає імʼя релізу і видаляє його.

Вона видаляє всі ресурси, асоційовані з останнім релізом чарту, а також історію релізу, звільняючи його для подальшого використання.

Використовуйте прапор '--dry-run', щоб побачити, які релізи будуть видалені без фактичного видалення.

```shell
helm uninstall RELEASE_NAME [...] [flags]
```

### Параметри {#options}

```none
      --cascade string       Має бути "background", "orphan" або "foreground". Вибирає стратегію каскадного видалення для залежних ресурсів. Стандартно background. (стандартно "background")
      --description string   додати власний опис
      --dry-run              симулювати видалення
  -h, --help                 довідка uninstall
      --ignore-not-found     Вважати "release not found" як успішне видалення
      --keep-history         видалити всі асоційовані ресурси і помітити реліз як видалений, але зберегти історію релізу
      --no-hooks             запобігти виконанню хуків під час видалення
      --timeout duration     час очікування для будь-якої окремої операції Kubernetes (наприклад, Jobs для хуків) (стандартно 5м0с)
      --wait                 якщо вказано, буде чекати, поки всі ресурси не будуть видалені перед поверненням. Буде чекати стільки, скільки вказано у --timeout
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

- [helm](helm.md) — менеджер пакетів Helm для Kubernetes.

###### Автоматично згенеровано spf13/cobra 15 січня 2025
