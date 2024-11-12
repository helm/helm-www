---
title: "Helm Push"
---

## helm push

завантажити чарт на віддалений сервер

### Опис {#synopsis}

Завантаження чарту до реєстру.

Якщо чарт має повʼязаний файл підтвердження автентичності, він також буде завантажений.

```shell
helm push [chart] [remote] [flags]
```

### Параметри {#options}

```none
      --ca-file string             перевірити сертифікати HTTPS-серверів за допомогою цього CA пакету
      --cert-file string           ідентифікувати клієнта HTTPS, використовуючи цей файл SSL сертифікату
  -h, --help                       довідка push
      --insecure-skip-tls-verify   пропустити перевірку tls-сертифікатів під час завантаження чарту
      --key-file string            ідентифікувати клієнта реєстру за допомогою цього файлу ключа SSL
      --plain-http                 використовувати небезпечні HTTP-зʼєднання для завантаження чарту
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

* [helm](helm.md) — Менеджер пакетів Helm для Kubernetes.

###### Автоматично згенеровано spf13/cobra 11 вересня 2024