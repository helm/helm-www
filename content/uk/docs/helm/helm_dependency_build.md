---
title: "Helm Dependency Build"
---

## helm dependency build

перебудувати теку charts/ на основі файлу Chart.lock

### Опис {#synopsis}

Ця команда будує теку `charts/` на основі файлу `Chart.lock`.

Команда `build` використовується для відновлення залежностей чарту до стану, зазначеного у файлі блокування. Вона не переузгоджуватиме залежності, як це робить `helm dependency update`.

Якщо файл блокування не знайдено, `helm dependency build` дзеркально повторюватиме поведінку команди `helm dependency update`.

```none
helm dependency build CHART [flags]
```

### Параметри {#options}

```none
  -h, --help             довідка для build
      --keyring string   вʼязка ключів, що містить публічні ключі (стандартно "~/.gnupg/pubring.gpg")
      --skip-refresh     не оновлювати кеш локального репозиторію
      --verify           перевіряти пакети за підписами
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

* [helm dependency](helm_dependency.md) — керувати залежностями чарту

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
