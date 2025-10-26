---
title: "Helm Repo"
---

## helm repo

додати, вивести перелік, видалити, оновити та індексувати репозиторії чартів

### Опис {#synopsis}

Ця команда містить кілька субкоманд для взаємодії з репозиторіями чартів.

Вона може використовуватися для додавання, видалення, виводу переліку та індексування репозиторіїв чартів.

### Параметри {#options}

```none
  -h, --help   довідка repo
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
      --repository-cache string         шлях до файлу, що містить кешовані індекси репозиторіїв (стандартно "~/.cache/helm/repository")
      --repository-config string        шлях до файлу, що містить імена та URL репозиторіїв (стандартно "~/.config/helm/repositories.yaml")
```

### ДИВІТЬСЯ ТАКОЖ {#see-also}

* [helm](helm.md) — менеджер пакетів Helm для Kubernetes.
* [helm repo add](helm_repo_add.md) — додати репозиторій чартів
* [helm repo index](helm_repo_index.md) — згенерувати файл індексу для теки, що містить упаковані чарти
* [helm repo list](helm_repo_list.md) — вивести перелік репозиторіїв чартів
* [helm repo remove](helm_repo_remove.md) — видалити один або кілька репозиторіїв чартів
* [helm repo update](helm_repo_update.md) — оновити інформацію про доступні чарти локально з репозиторіїв чартів

###### Автоматично згенеровано spf13/cobra 24 січня 2024
