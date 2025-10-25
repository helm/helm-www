---
title: helm
slug: helm
---
Менеджер пакетів Helm для Kubernetes.

### Опис {#synopsis}

Менеджер пакетів для Kubernetes

Загальні дії для Helm:

- helm search:    пошук чартів
- helm pull:      завантаження чарту у вашу локальну теку для перегляду
- helm install:   завантаження чарту в Kubernetes
- helm list:      перегляд списку релізів чартів

Змінні середовища:

| Імʼя                               | Опис                                                                                                       |
|------------------------------------|------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | вказує альтернативне місце для зберігання кешованих файлів.                                                 |
| $HELM_CONFIG_HOME                  | вказує альтернативне місце для зберігання конфігурації Helm.                                                |
| $HELM_DATA_HOME                    | вказує альтернативне місце для зберігання даних Helm.                                                       |
| $HELM_DEBUG                        | вказує, чи працює Helm в режимі налагодження                                                               |
| $HELM_DRIVER                       | вказує драйвер бекенду для зберігання. Значення: configmap, secret, memory, sql.                            |
| $HELM_DRIVER_SQL_CONNECTION_STRING | вказує рядок підключення, який повинен використовувати SQL-драйвер для зберігання.                          |
| $HELM_MAX_HISTORY                  | вказує максимальну кількість історії релізів Helm.                                                          |
| $HELM_NAMESPACE                    | вказує простір імен, що використовується для операцій Helm.                                                 |
| $HELM_NO_PLUGINS                   | відключає втулки. Встановіть HELM_NO_PLUGINS=1, щоб відключити втулки.                                    |
| $HELM_PLUGINS                      | вказує шлях до теки плагінів                                                                          |
| $HELM_REGISTRY_CONFIG              | вказує шлях до файлу конфігурації реєстру.                                                                  |
| $HELM_REPOSITORY_CACHE             | вказує шлях до теки кешу репозиторіїв                                                                 |
| $HELM_REPOSITORY_CONFIG            | вказує шлях до файлу репозиторіїв                                                                           |
| $KUBECONFIG                        | вказує альтернативний файл конфігурації Kubernetes (стандартно "~/.kube/config")                       |
| $HELM_KUBEAPISERVER                | вказує точку доступу сервера API Kubernetes для автентифікації                                              |
| $HELM_KUBECAFILE                   | вказує файл центру сертифікації для Kubernetes.                                                          |
| $HELM_KUBEASGROUPS                 | вказує групи для використання імперсонації, використовуючи список, розділений комами.                       |
| $HELM_KUBEASUSER                   | вказує імʼя користувача для імперсонації під час операції.                                                  |
| $HELM_KUBECONTEXT                  | вказує імʼя контексту kubeconfig.                                                                           |
| $HELM_KUBETOKEN                    | вказує токен Bearer KubeToken для автентифікації.                                                          |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | вказує, чи слід пропустити перевірку сертифіката сервера API Kubernetes (небезпечний режим)                 |
| $HELM_KUBETLS_SERVER_NAME          | вказує імʼя сервера для перевірки сертифіката сервера API Kubernetes                                         |
| $HELM_BURST_LIMIT                  | вказує стандартне обмеження на кількість викликів у випадку великої кількості CRD (стандартно — 100, -1 для відключення) |
| $HELM_QPS                          | вказує кількість запитів в секунду у випадках, коли велика кількість викликів перевищує параметр для більш високих значень |

Helm зберігає кеш, конфігурацію та дані на основі наступного порядку конфігурації:

- Якщо встановлена змінна середовища HELM_*_HOME, вона буде використана
- В іншому випадку на системах, що підтримують специфікацію базової теки XDG, будуть використані змінні XDG
- Якщо не встановлено інше місце, буде використане стандартне місце залежно від операційної системи

Типово, стандартні теки залежать від операційної системи. Нижче наведені їх значення:

| Операційна система | Шлях до кешу               | Шлях до конфігурації          | Шлях до даних            |
|--------------------|---------------------------|------------------------------|--------------------------|
| Linux              | $HOME/.cache/helm         | $HOME/.config/helm           | $HOME/.local/share/helm  |
| macOS              | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows            | %TEMP%\helm               | %APPDATA%\helm               | %APPDATA%\helm           |

### Параметри {#options}

```none
      --burst-limit int                 стандартні обмеження на стороні клієнта (стандартно 100)
      --debug                           вмикає розширений вивід
  -h, --help                            довідка helm
      --kube-apiserver string           адреса і порт сервера API Kubernetes
      --kube-as-group stringArray       група для імперсонації під час операції, цей прапорець може бути повторений для вказання кількох груп
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

### ДИВИТИСЯ ТАКОЖ {#see-also}

- [helm completion](/helm/helm_completion.md) — генерувати скрипти автодоповнення для вказаного shell
- [helm create](/helm/helm_create.md) — створити новий чарт з вказаною назвою
- [helm dependency](/helm/helm_dependency.md) — керування залежностями чарту
- [helm env](/helm/helm_env.md) — інформація про середовище клієнта helm
- [helm get](/helm/helm_get.md) — завантажити розширену інформацію про зазначений реліз
- [helm history](/helm/helm_history.md) — отримати історію релізу
- [helm install](/helm/helm_install.md) — встановити чарт
- [helm lint](/helm/helm_lint.md) — перевірити чарт на можливі проблеми
- [helm list](/helm/helm_list.md) — переглянути список релізів
- [helm package](/helm/helm_package.md) — упакувати теку чарту в архів чарту
- [helm plugin](/helm/helm_plugin.md) — встановити, переглянути або видалити втулки Helm
- [helm pull](/helm/helm_pull.md) — завантажити чарт з репозиторію та (за бажанням) розпакувати його в локальній теці
- [helm push](/helm/helm_push.md) — завантажити чарт до віддаленого сервера
- [helm registry](/helm/helm_registry.md) — увійти або вийти з реєстру
- [helm repo](/helm/helm_repo.md) — додати, переглянути, видалити, оновити та індексувати репозиторії чартів
- [helm rollback](/helm/helm_rollback.md) — відкотити реліз до попередньої версії
- [helm search](/helm/helm_search.md) — шукати ключове слово в чартах
- [helm show](/helm/helm_show.md) — показати інформацію про чарт
- [helm status](/helm/helm_status.md) — відобразити статус зазначеного релізу
- [helm template](/helm/helm_template.md) — локально рендерити шаблони
- [helm test](/helm/helm_test.md) — запустити тести для релізу
- [helm uninstall](/helm/helm_uninstall.md) — видалити реліз
- [helm upgrade](/helm/helm_upgrade.md) — оновити реліз
- [helm verify](/helm/helm_verify.md) — перевірити, чи підписаний та, чи є дійсним чарт за вказаним шляхом
- [helm version](/helm/helm_version.md) — відобразити інформацію про версію клієнта

###### Автоматично згенеровано spf13/cobra 11 вересня 2024
