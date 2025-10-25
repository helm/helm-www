---
title: helm repo add
---
додати репозиторій чартів

```shell
helm repo add [NAME] [URL] [flags]
```

### Параметри {#options}

```none
      --allow-deprecated-repos     стандартно ця команда не дозволяє додавати офіційні репозиторії, які були назавжди видалені. Ця опція вимикає таку поведінку
      --ca-file string             перевірити сертифікати HTTPS-серверів за допомогою цього CA пакету
      --cert-file string           ідентифікувати клієнта HTTPS, використовуючи цей файл SSL сертифікату
      --force-update               замінити (перезаписати) репозиторій, якщо він уже існує
  -h, --help                       довідка add
      --insecure-skip-tls-verify   пропустити перевірку tls-сертифікатів для репозиторію
      --key-file string            ідентифікувати HTTPS-клієнта за допомогою цього файлу ключа SSL
      --no-update                  Ігнорується. Раніше ця опція відключала примусові оновлення. Застаріла через force-update.
      --pass-credentials           передавати облікові дані всім доменам
      --password string            пароль до репозиторію чартів
      --password-stdin             зчитати пароль до репозиторію чартів з stdin
      --username string            імʼя користувача репозиторію чартів
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

* [helm repo](/helm/helm_repo.md) — додавання, створення списку, видалення, оновлення та індексація репозиторіїв чартів

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
