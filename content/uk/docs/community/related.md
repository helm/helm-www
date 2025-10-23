---
title: "Повʼязані проєкти та документація"
description: "сторонні інструменти, втулки та документація, надані спільнотою!"
weight: 3
---

Спільнота Helm розробила безліч додаткових інструментів, втулків та документації про Helm. Нам завжди цікаво дізнатися про ці проєкти.

Якщо у вас є щось, що ви хочете додати до цього списку, будь ласка, відкрийте [issue](https://github.com/helm/helm-www/issues) або [pull request](https://github.com/helm/helm-www/pulls).

## Втулки Helm {#helm-plugins}

- [helm-adopt](https://github.com/HamzaZo/helm-adopt) — Втулок Helm v3 для включення поточних ресурсів k8s у нові згенеровані Helm чарти.
- [helm-chartsnap](https://github.com/jlandowner/helm-chartsnap) — Втулок для тестування знімків для Helm чартів.
- [Helm Diff](https://github.com/databus23/helm-diff) — Попередній перегляд `helm upgrade` у вигляді кольорового diff.
- [Helm Dt](https://github.com/vmware-labs/distribution-tooling-for-helm) — Втулок, який допомагає розподілити Helm чарти між OCI реєстрами та в умовах Air gap.
- [Helm Dashboard](https://github.com/komodorio/helm-dashboard) — GUI для Helm, візуалізація релізів та репозиторіїв, відмінності у маніфестах.
- [helm-gcs](https://github.com/hayorov/helm-gcs) — Втулок для керування репозиторіями на Google Cloud Storage.
- [helm-git](https://github.com/aslafy-z/helm-git) — Встановлює чарти та отримує файли значень з ваших Git репозиторіїв.
- [helm-k8comp](https://github.com/cststack/k8comp) — Втулок для створення Helm чартів з hiera за допомогою k8comp.
- [helm-mapkubeapis](https://github.com/helm/helm-mapkubeapis) — Оновлює метадані релізу Helm для заміни застарілих або видалених API Kubernetes.
- [helm-migrate-values](https://github.com/OctopusDeployLabs/helm-migrate-values) — Втулок для перенесення вказаних користувачем значень між версіями чартів Helm, щоб впоратися зі змінами схеми у файлі `values.yaml`.
- [helm-monitor](https://github.com/ContainerSolutions/helm-monitor) — Втулок для моніторингу релізу та відкату на основі запиту Prometheus/ElasticSearch.
- [helm-release-plugin](https://github.com/JovianX/helm-release-plugin) — Втулок для управління релізами, оновлення значень релізу, витягує (перестворює) Helm чарти з розгорнутих релізів, встановлює TTL релізу Helm.
- [helm-s3](https://github.com/hypnoglow/helm-s3) — Втулок Helm, який дозволяє використовувати AWS S3 як [приватний] репозиторій чартів.
- [helm-secrets](https://github.com/jkroepke/helm-secrets) — Втулок для безпечного керування та зберігання секретів (на основі [sops](https://github.com/mozilla/sops)).
- [helm-sigstore](https://github.com/sigstore/helm-sigstore) — Втулок для Helm для інтеграції з екосистемою [sigstore](https://sigstore.dev/). Пошук, завантаження та перевірка підписаних Helm чартів.
- [helm-tanka](https://github.com/Duologic/helm-tanka) — Втулок Helm для рендерингу Tanka/Jsonnet всередині Helm чартів.
- [hc-unit](https://github.com/xchapter7x/hcunit) — Втулок для юніт-тестування чартів локально за допомогою OPA (Open Policy Agent) & Rego.
- [helm-unittest](https://github.com/helm-unittest/helm-unittest) — Втулок для юніт-тестування чартів локально з YAML.
- [helm-val](https://github.com/HamzaZo/helm-val) — Втулок для отримання значень з попереднього релізу.
- [helm-external-val](https://github.com/kuuji/helm-external-val) — Втулок, який отримує значення helm з зовнішніх джерел (configMaps, Secrets тощо).
- [helm-images](https://github.com/nikhilsbhat/helm-images) — Втулок Helm для отримання всіх можливих зображень з чарту перед розгортанням або з розгорнутого релізу.
- [helm-drift](https://github.com/nikhilsbhat/helm-drift) — Втулок Helm, який виявляє конфігурацію, яка відрізняється від Helm чарту.

Ми також заохочуємо авторів на GitHub використовувати теґ [helm-plugin](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories) у своїх репозиторіях втулків.

## Додаткові інструменти {#additional-tools}

Інструменти, які використовуються поверх Helm.

- [Aptakube](https://aptakube.com) — Графічний інтерфейс для керування релізами Helm та Kubernetes.
- [Armada](https://airshipit.readthedocs.io/projects/armada/en/latest/) — Керування префіксованими релізами через різні Kubernetes простори імен, а також видалення завершених завдань для складних розгортань.
- [avionix](https://github.com/zbrookle/avionix) — Інтерфейс Python для генерації Helm чартів та Kubernetes yaml, що дозволяє успадкування та зменшення дублювання коду.
- [Botkube](https://botkube.io) — Виконання Helm команд безпосередньо з Slack, Discord, Microsoft Teams та Mattermost.
- [Captain](https://github.com/alauda/captain) — Контролер Helm3, що використовує HelmRequest та Release CRD.
- [Chartify](https://github.com/appscode/chartify) — Генерація Helm чартів з наявних ресурсів Kubernetes.
- [ChartMuseum](https://github.com/helm/chartmuseum) — Репозиторій Helm Chart з підтримкою Amazon S3 та Google Cloud Storage.
- [chart-registry](https://github.com/hangyan/chart-registry) — Хостинг Helm чартів на OCI Registry.
- [Codefresh](https://codefresh.io) — Кластерна CI/CD платформа з UI панелями для управління Helm чартами та релізами.
- ⁠[Cyclops](https://cyclops-ui.com) — Динамічний UI для Kubernetes на основі Helm чартів.
- [Flux](https://fluxcd.io/docs/components/helm/) — Безперервна та прогресивна доставка з Git до Kubernetes.
- [Helmfile](https://github.com/helmfile/helmfile) — Helmfile - це декларативна специфікація для розгортання Helm чартів.
- [Helmper](https://github.com/ChristofferNissen/helmper) — Helmper допомагає імплементувати Helm чарти, включаючи всі OCI артефакти (образи) у ваші OCI реєстри. Helmper також полегшує сканування безпеки та застосування патчів до OCI образів. Helmper використовує Helm, Oras, Trivy, Copacetic та Buildkitd.
- [Helmsman](https://github.com/Praqma/helmsman) — Helmsman, це інструмент helm-charts-as-code, який дозволяє встановлювати/оновлювати/захищати/переміщувати/видаляти релізи з версійно контрольованих файлів стану (описаних у простому форматі TOML).
- [HULL](https://github.com/vidispine/hull) — Ця бібліотека чартів надає готовий інтерфейс для специфікації всіх обʼєктів Kubernetes безпосередньо у `values.yaml`. Вона усуває необхідність писати будь-які шаблони для ваших чартів і має багато додаткових функцій для спрощення створення та використання Helm чартів.
- [Konveyor Move2Kube](https://konveyor.io/move2kube/) — Генерація Helm чартів для ваших поточних проєктів.
- [Landscaper](https://github.com/Eneco/landscaper/) — "Landscaper бере набір посилань на Helm Chart зі значеннями (бажаний стан) і реалізує їх в кластері Kubernetes."
- [Monocular](https://github.com/helm/monocular) — Веб UI для репозиторіїв Helm Chart.
- [Monokle](https://monokle.io) — Десктопний інструмент для створення, налагодження та розгортання ресурсів Kubernetes та Helm чартів.
- [Orkestra](https://azure.github.io/orkestra/) — Хмарна платформа оркестрування релізів та управління життєвим циклом (LCM) для повʼязаних груп Helm релізів та їх субчартів.
- [Tanka](https://tanka.dev/helm) — Grafana Tanka налаштовує ресурси Kubernetes через Jsonnet з можливістю споживання Helm чартів.
- [Terraform Helm Provider](https://github.com/hashicorp/terraform-provider-helm) — Провайдер Helm для HashiCorp Terraform дозволяє управління життєвим циклом Helm чартів з декларативним синтаксисом інфраструктури як коду. Провайдер Helm часто поєднується з іншими провайдерами Terraform, такими як провайдер Kubernetes, для створення спільного робочого процесу серед усіх інфраструктурних послуг.
- [VIM-Kubernetes](https://github.com/andrewstuart/vim-kubernetes) — Втулок VIM для Kubernetes та Helm.

## Мають Helm {#helm-included}

Платформи, дистрибутиви та сервіси, що включають підтримку Helm.

- [Kubernetic](https://kubernetic.com/) — Десктопний клієнт Kubernetes.
- [Jenkins X](https://jenkins-x.io/) — Відкритий автоматизований CI/CD для Kubernetes, який використовує Helm для [просування](https://jenkins-x.io/docs/getting-started/promotion/) застосунків через середовища за допомогою GitOps.

## Різне {#misc}

Корисні речі для авторів чартів та користувачів Helm.

- [Await](https://github.com/saltside/await) — Docker образ для "очікування" різних умов, особливо корисний для init контейнерів. [Детальніше](https://blog.slashdeploy.com/2017/02/16/introducing-await/).
