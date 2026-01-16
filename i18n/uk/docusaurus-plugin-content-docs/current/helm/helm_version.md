---
title: helm version
---

Вивід інформації про версію Helm

### Опис {#synopsis}

Показує версію Helm.

Команда виведе на екран інформацію про версію Helm. Результат буде виглядати приблизно так:

```console
version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a", GitTreeState:"clean", GoVersion:"go1.13.10"}
```

- Version — семантична версія релізу.
- GitCommit — SHA коміту, з якого була збудована ця версія.
- GitTreeState — "clean", якщо при створенні цього бінарного файлу не було локальних змін у коді, і "dirty", якщо бінарний файл був збудований з локально зміненого коду.
- GoVersion — версія Go, яка була використана для компіляції Helm.

При використанні прапорця `--template` доступні такі властивості для використання в шаблоні:

- `.Version` — містить семантичну версію Helm
- `.GitCommit` — git коміт
- `.GitTreeState` — стан git дерева, коли був збудований Helm
- `.GoVersion` — містить версію Go, з якою був зібраний Helm

Наприклад, `--template='Version: {{.Version}}'` надрукує `'Version: v3.2.1'`.

```shell
helm version [flags]
```

### Параметри {#options}

```none
  -h, --help              довідка version
      --short             вивести номер версії
      --template string   шаблон для формату рядка версії
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

* [helm](/helm/helm.md) — Helm, менеджер пакетів для Kubernetes.

###### Автоматично згенеровано spf13/cobra 14 січня 2026 року
