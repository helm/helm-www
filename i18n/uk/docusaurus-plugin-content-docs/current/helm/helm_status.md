---
title: helm status
---

Показати статус вказаного релізу

### Опис {#synopsis}

Ця команда показує статус вказаного релізу. Статус складається з:

- часу останнього розгортання
- простору імен k8s, в якому знаходиться реліз
- стану релізу (може бути: unknown, deployed, uninstalled, superseded, failed, uninstalling, pending-install, pending-upgrade або pending-rollback)
- ревізії релізу
- опис релізу (може бути повідомленням про завершення або повідомленням про помилку)
- списку ресурсів, які входять до складу цього релізу
- детальної інформації про останнє виконання набору тестів, якщо це доречно
- додаткових приміток, надані в чарті

```shell
helm status RELEASE_NAME [flags]
```

### Параметри {#options}

```none
  -h, --help            довідка status
  -o, --output format   виводить результати у вказаному форматі. Дозволені значення: table, json, yaml (стандартно table)
      --revision int    якщо вказано, показати статус вказаного релізу з ревізією
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
