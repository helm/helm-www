---
title: helm get manifest
---
завантажити маніфест для вказаного релізу

### Опис {#synopsis}

Ця команда завантажує згенерований маніфест для вказаного релізу.

Маніфест є YAML-кодованим представленням ресурсів Kubernetes, які були згенеровані з чарту(ів) цього релізу. Якщо чарт залежить від інших чартів, ці ресурси також будуть включені в маніфест.

```shell
helm get manifest RELEASE_NAME [flags]
```

### Параметри {#options}

```none
  -h, --help           довідка для manifest
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
      --registry-config string          шлях до файлу конфігурації реєстру (стандартно "~/.config/helm/registry/config.json")
      --repository-cache string         шлях до теки, що містить кешовані індекси репозиторіїв (стандартно "~/.cache/helm/repository")
      --repository-config string        шлях до файлу, що містить імена та URL репозиторіїв (стандартно "~/.config/helm/repositories.yaml")
```

### Дивіться також {#see-also}

* [helm get](/helm/helm_get.md) — завантажити розширену інформацію про вказаний реліз

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
