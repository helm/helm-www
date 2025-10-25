---
title: helm completion zsh
---
Генерація скрипта автодоповнення для zsh

### Опис {#synopsis}

Генерація скрипта автодоповнення Helm для оболонки zsh.

Для завантаження автодоповнень у вашій поточній shell-сесії:

```shell
source <(helm completion zsh)
```

Для завантаження автодоповнень для кожної нової сесії, виконайте один раз:

```shell
helm completion zsh > "${fpath[1]}/_helm"
```

```shell
helm completion zsh [прапорці]
```

### Параметри {#options}

```none
  -h, --help              довідка для zsh
      --no-descriptions   вимкнути описи автодоповнення
```

### Параметри, успадковані від батьківських команд

```none
      --burst-limit int                 стандартні обмеження на стороні клієнта (стандартно 100)
      --debug                           включити розширений вивід
      --kube-apiserver string           адреса і порт сервера API Kubernetes
      --kube-as-group stringArray       група для імперсонації під час операції, цей прапор може бути повторений для вказання кількох груп
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

### ДИВИТИСЯ ТАКОЖ {#see-also}

* [helm completion](/helm/helm_completion.md) — генерувати скрипти автодоповнення для вказаного shell

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
