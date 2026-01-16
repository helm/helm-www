---
title: helm plugin
---

Встановлення, перегляд списку або видалення втулків Helm

### Опис {#synopsis}

Керування втулками Helm на стороні клієнта.

### Параметри {#options}

```none
  -h, --help   довідка plugin
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
* [helm plugin install](/helm/helm_plugin_install.md) — встановлення втулків Helm
* [helm plugin list](/helm/helm_plugin_list.md) — перегляд встановлених втулків Helm
* [helm plugin package](/helm/helm_plugin_package.md) — створення пакунку з теки втулка
* [helm plugin uninstall](/helm/helm_plugin_uninstall.md) — видалення одного чи кількох втулків Helm
* [helm plugin update](/helm/helm_plugin_update.md) — оновлення одного чи кількох втулків Helm
* [helm plugin verify](/helm/helm_plugin_verify.md) — перевірка, що втулок за вказаним шляхом має підпис і є дійсним

###### Автоматично згенеровано spf13/cobra 14 січня 2026 року
