---
title: "Helm Get Hooks"
---

## helm get hooks

завантажити всі хуки для вказаного релізу

### Опис {#synopsis}

Ця команда завантажує хуки для вказаного релізу.

Хуки форматуються у YAML і розділені роздільником YAML '---\n'.

```shell
helm get hooks RELEASE_NAME [flags]
```

### Параметри

```none
  -h, --help           довідка для hooks
      --revision int   отримати вказаний реліз з версією
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
      --registry-config string          шлях до файлу конфігурації реєстру (станлартно "~/.config/helm/registry/config.json")
      --repository-cache string         шлях до файлу, що містить кешовані індекси репозиторіїв (станлартно "~/.cache/helm/repository")
      --repository-config string        шлях до файлу, що містить імена та URL репозиторіїв (станлартно "~/.config/helm/repositories.yaml")
```

### Дивіться також {#see-also}

* [helm get](helm_get.md) — завантажити розширену інформацію про вказаний реліз

###### Автоматично згенеровано spf13/cobra 24 січня 2024
