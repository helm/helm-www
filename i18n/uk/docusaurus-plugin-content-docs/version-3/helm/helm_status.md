---
title: helm status
---
показати статус вказаного релізу

### Опис {#synopsis}

Ця команда показує статус вказаного релізу. Статус складається з:

- часу останнього розгортання
- простору імен k8s, в якому знаходиться реліз
- стану релізу (може бути: unknown, deployed, uninstalled, superseded, failed, uninstalling, pending-install, pending-upgrade або pending-rollback)
- ревізії релізу
- опису релізу (може бути повідомленням про завершення або помилкою, потрібно увімкнути --show-desc)
- списку ресурсів, які входять до складу цього релізу (потрібно увімкнути --show-resources)
- деталей останнього запуску тестового набору, якщо застосовується
- додаткових приміток, наданих чартом

```shell
helm status RELEASE_NAME [flags]
```

### Параметри {#options}

```none
  -h, --help             довідка status
  -o, --output format    виводить результат у вказаному форматі. Дозволені значення: table, json, yaml (стандартно table)
      --revision int     якщо вказано, показати статус вказаного релізу з ревізією
      --show-desc        якщо вказано, показати описове повідомлення вказаного релізу
      --show-resources   якщо вказано, показати ресурси вказаного релізу
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

- [helm](/helm/helm.md) — менеджер пакетів Helm для Kubernetes.

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
