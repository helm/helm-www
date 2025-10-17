---
title: "Helm Completion"
---

## helm completion

Генерація скриптів автодоповнення для вказаної оболонки

### Опис {#synopsis}

Генерація скриптів автодоповнення Helm для вказаної оболонки.

### Параметри {#options}

```none
  -h, --help   довідка для completion
```

### Параметри, успадковані від батьківських команд {#options-inherited-from-parent-commands}

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

* [helm](helm.md) — Менеджер пакетів Helm для Kubernetes.
* [helm completion bash](helm_completion_bash.md) — генерувати скрипт автодоповнення для bash
* [helm completion fish](helm_completion_fish.md) — генерувати скрипт автодоповнення для fish
* [helm completion powershell](helm_completion_powershell.md) — генерувати скрипт автодоповнення для powershell
* [helm completion zsh](helm_completion_zsh.md) — генерувати скрипт автодоповнення для zsh

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
