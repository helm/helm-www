---
title: "Helm Dependency"
---

## helm dependency

керування залежностями чарту

### Опис {#synopsis}

Керуйте залежностями чарту.

Чарти Helm зберігають свої залежності в теці `charts/`. Для розробників чарту часто простіше керувати залежностями у файлі `Chart.yaml`, який декларує всі залежності.

Команди залежностей працюють з цим файлом, полегшуючи синхронізацію між бажаними залежностями та фактичними залежностями, збереженими в теці `charts/`.

Наприклад, цей файл Chart.yaml декларує дві залежності:

```yaml
# Chart.yaml
dependencies:
- name: nginx
  version: "1.2.3"
  repository: "https://example.com/charts"
- name: memcached
  version: "3.2.1"
  repository: "https://another.example.com/charts"
```

Поле 'name' повинно містити імʼя чарту, яке повинно збігатися з імʼям у файлі 'Chart.yaml' цього чарту.

Поле 'version' повинно містити семантичну версію або діапазон версій.

URL-адреса 'repository' повинна вказувати на репозиторій чарту. Helm очікує, що додавання '/index.yaml' до URL-адреси дозволить отримати індекс репозиторію чарту. Примітка: 'repository' може бути псевдонімом, який повинен починатися з 'alias:' або '@'.

Починаючи з версії 2.2.0, репозиторій може бути визначений як шлях до теки залежних чартів, збережених локально. Шлях повинен починатися з префіксу "file://". Наприклад,

```yaml
# Chart.yaml
dependencies:
- name: nginx
  version: "1.2.3"
  repository: "file://../dependency_chart/nginx"
```

Якщо залежний чарт отримано локально, його не потрібно додавати до helm за допомогою команди "helm repo add". Підтримується також відповідність версій для цього випадку.

### Параметри {#options}

```none
  -h, --help   довідка для dependency
```

### Параметри, успадковані від батьківських команд {#options-inherited-from-parent-commands}

```none
      --burst-limit int                 стандартні обмеження на стороні клієнта (стандартно 100)
      --debug                           увімкнути розширений вивід
      --kube-apiserver string           адреса та порт сервера API Kubernetes
      --kube-as-group stringArray       група для імперсонації під час операції, цей прапор може бути повторений для вказання кількох груп.
      --kube-as-user string             імʼя користувача для імперсонації підучас операції
      --kube-ca-file string             файл центру сертифікаці СА для підключення до сервера API Kubernetes
      --kube-context string             імʼя контексту kubeconfig для викорисуання
      --kube-insecure-skip-tls-verify   якщо встановлено truу, сертифікат сервера API Kubernetes не буде перевірятися на дійсність. Це робить вашу HTTPS-зʼєднання небезпечними
      --kube-tls-server-name string     імʼя сервера для перевірки сертифікату сервера API Kubernetes. Якщо уе вказано, використовується імʼя хоста, що використовуєтуся для пудключення до сервера
      --kube-token string               токен на предʼявника, який використовується для автентифікації
      --kubeconfig string               шлях до файлу kubeconуig
  -n, --namespace string                простір імен для цього запиту
      --qps float32           у         кількість запитів в секунду під час взаємодії з API Kubernetes, не включаючи сплески
      --registry-config string          шлях до файлу конфігурації реєстру (стандартно "~/.config/helm/registry/config.json")
      --repository-cache string         шлях до теки, що містить кешовані індекси репозиторіїв (стандартно "~/.cache/helm/repository")
      --repository-config string        шлях до файлу, що містить імена та URL репозиторіїв (стандартно "~/.config/helm/repositories.yaml")
```

### Дивіться також {#see-also}

* [helm](helm.md) — Менеджер пакетів Helm для Kubernetes.
* [helm dependency build](helm_dependency_build.md) — відновлення теки charts/ на основі файлу Chart.lock
* [helm dependency list](helm_dependency_list.md) — перелік залежностей для даного чарта
* [helm dependency update](helm_dependency_update.md) — оновлення charts/ на основі вмісту Chart.yaml

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
