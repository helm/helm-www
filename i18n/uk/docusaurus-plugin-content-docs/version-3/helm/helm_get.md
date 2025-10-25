---
title: helm get
---
завантажити розширену інформацію про вказаний реліз

### Опис {#synopsis}

Ця команда складається з кількох підкоманд, які можна використовувати для отримання розширеної інформації про реліз, включаючи:

- Значення, що використовувалися для генерації релізу
- Сформований файл маніфесту
- Примітки, надані чартом релізу
- Хуки, асоційовані з релізом
- Метадані релізу

### Параметри {#options}

```none
  -h, --help   довідка для get
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

- [helm](/helm/helm.md) — Менеджер пакетів Helm для Kubernetes.
- [helm get all](/helm/helm_get_all.md) — завантажити всю інформацію про вказаний реліз
- [helm get hooks](/helm/helm_get_hooks.md) — завантажити всі хуки для вказаного релізу
- [helm get manifest](/helm/helm_get_manifest.md) — завантажити маніфест для вказаного релізу
- [helm get metadata](/helm/helm_get_metadata.md) — отримати метадані для вказаного релізу
- [helm get notes](/helm/helm_get_notes.md) — завантажити примітки для вказаного релізу
- [helm get values](/helm/helm_get_values.md) — завантажити файл значень для вказаного релізу

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
