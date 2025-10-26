---
title: helm search
---
шукати ключове слово у чартах

### Опис {#synopsis}

Команда search надає можливість шукати Helm чарти в різних місцях,
де вони можуть зберігатися, включаючи Artifact Hub і репозиторії, які ви додали. Використовуйте субкоманди search для пошуку в різних місцях для чартів.

### Параметри {#options}

```none
  -h, --help   довідка search
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

* [helm](/helm/helm.md) — менеджер пакетів Helm для Kubernetes.
* [helm search hub](/helm/helm_search_hub.md) — шукати чарти в Artifact Hub або у власному екземплярі хабу
* [helm search repo](/helm/helm_search_repo.md) — шукати репозиторії за ключовим словом у чартах

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
