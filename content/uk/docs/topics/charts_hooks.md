---
title: "Хуки чартів"
description: "Опис, як працювати з хуками чартів."
weight: 2
---

Helm надає механізм _хуків_, що дозволяє розробникам чартів втручатися на певних етапах життєвого циклу релізу. Наприклад, ви можете використовувати хуки для:

- Завантаження ConfigMap або Secret під час встановлення до завантаження будь-яких інших чартів.
- Виконання Job для резервного копіювання бази даних перед встановленням нового чарту, а потім виконання другого Job після оновлення для відновлення даних.
- Запуску Job перед видаленням релізу для мʼякого виведення сервісу з обігу перед його видаленням.

Хуки працюють як звичайні шаблони, але мають спеціальні анотації, які змушують Helm використовувати їх по-іншому. У цьому розділі ми розглянемо базовий шаблон використання хуків.

## Доступні хуки {#available-hooks}

Ось які хуки визначені:

| Значення анотації | Опис                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `pre-install`     | Виконується після рендерингу шаблонів, але до створення будь-яких ресурсів у Kubernetes                    |
| `post-install`    | Виконується після завантаження всіх ресурсів у Kubernetes                                                  |
| `pre-delete`      | Виконується під час запиту на видалення перед видаленням будь-яких ресурсів з Kubernetes                   |
| `post-delete`     | Виконується під час запиту на видалення після видалення всіх ресурсів релізу                               |
| `pre-upgrade`     | Виконується під час запиту на оновлення після рендерингу шаблонів, але до оновлення будь-яких ресурсів     |
| `post-upgrade`    | Виконується під час запиту на оновлення після оновлення всіх ресурсів                                      |
| `pre-rollback`    | Виконується під час запиту на відкат після рендерингу шаблонів, але до відкату будь-яких ресурсів           |
| `post-rollback`   | Виконується під час запиту на відкат після модифікації всіх ресурсів                                        |
| `test`            | Виконується, коли викликано підкоманду Helm test ([переглянути документацію тестів](/docs/chart_tests/))  |

_Зверніть увагу, що хук `crd-install` був видалений на користь теки `crds/` у Helm 3._

## Хуки та життєвий цикл релізу {#hooks-and-the-release-lifecycle}

Хуки дозволяють вам, як розробнику чартів, виконувати операції на стратегічних етапах життєвого циклу релізу. Наприклад, розглянемо життєвий цикл для `helm install`. Стандартно життєвий цикл виглядає так:

1. Користувач виконує `helm install foo`.
2. Викликається API бібліотеки Helm для встановлення.
3. Після деякої перевірки бібліотека рендерить шаблони `foo`.
4. Бібліотека завантажує результуючі ресурси у Kubernetes.
5. Бібліотека повертає обʼєкт релізу (та інші дані) клієнту.
6. Клієнт виходить.

Helm визначає два хуки для життєвого циклу `install`: `pre-install` і `post-install`. Якщо розробник чарту `foo` реалізує обидва хуки, життєвий цикл змінюється таким чином:

1. Користувач виконує `helm install foo`.
2. Викликається API бібліотеки Helm для встановлення.
3. CRD у теці `crds/` встановлюються.
4. Після деякої перевірки бібліотека рендерить шаблони `foo`.
5. Бібліотека готується виконати хуки `pre-install` (завантаження ресурсів хука у Kubernetes).
6. Бібліотека сортує хуки за вагою (стандартно вага дорівнює 0), за типом ресурсу та нарешті за імʼям за зростанням.
7. Бібліотека завантажує хук з найменшою вагою спочатку (від негативної до позитивної)
8. Бібліотека чекає, поки хук стане "Ready" (крім CRD)
9. Бібліотека завантажує результуючі ресурси у Kubernetes. Зверніть увагу, що якщо встановлено прапорець `--wait`, бібліотека чекатиме, поки всі ресурси не стануть готовими, і не запустить хук `post-install`, поки вони не будуть готові.
10. Бібліотека виконує хук `post-install` (завантаження ресурсів хука).
11. Бібліотека чекає, поки хук стане "Ready".
12. Бібліотека повертає обʼєкт релізу (та інші дані) клієнту.
13. Клієнт виходить.

Що означає чекати, поки хук стане готовим? Це залежить від ресурсу, оголошеного в хуку. Якщо ресурс є типу `Job` або `Pod`, Helm чекатиме, поки він успішно виконається. І якщо хук не вдається, реліз зазнає невдачі. Це _блокуюча операція_, тому клієнт Helm призупиниться, поки Job виконується.

Для всіх інших типів, як тільки Kubernetes позначає ресурс як завантажений (доданий або оновлений), ресурс вважається "Ready". Коли оголошено багато ресурсів у хуку, ресурси виконуються послідовно. Якщо у них є ваги хуків (див. нижче), вони виконуються в порядку ваг. Починаючи з Helm 3.2.0, ресурси хуків з однаковою вагою встановлюються в тому ж порядку, що і звичайні не-хукові ресурси. В іншому випадку, порядок не гарантується. (У Helm 2.3.0 і пізніше вони сортуються в алфавітному порядку. Це поведінка не є обовʼязковою і може змінитися в майбутньому.) Вважається гарною практикою додати вагу хуку та встановити її на `0`, якщо вага не є важливою.

### Ресурси хуків не управляються відповідними релізами {#hook-resources-are-not-managed-by-releases}

Ресурси, які створює хук, наразі не відстежуються та не управляються як частина релізу. Як тільки Helm перевіряє, що хук досяг свого готового стану, він залишає ресурс хука без змін. Збір сміття ресурсів хуків при видаленні відповідного релізу може бути додано до Helm 3 у майбутньому, тому будь-які ресурси хуків, які ніколи не повинні бути видалені, повинні бути анотовані як `helm.sh/resource-policy: keep`.

Практично це означає, що якщо ви створюєте ресурси в хуку, ви не можете покладатися на `helm uninstall`, щоб видалити ресурси. Щоб знищити такі ресурси, вам потрібно або [додати власну анотацію `helm.sh/hook-delete-policy`](#hook-deletion-policies) до файлу шаблону хука, або [встановити поле часу життя (TTL) ресурсу Job](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Написання хуку {#writing-a-hook}

Хуки — це просто манифести Kubernetes з особливими анотаціями в секції `metadata`. Оскільки це шаблони, ви можете використовувати всі звичайні можливості шаблонів, включаючи читання `.Values`, `.Release` та `.Template`.

Наприклад, цей шаблон, збережений у `templates/post-install-job.yaml`, оголошує Job, який буде виконаний при `post-install`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # Це те, що визначає цей ресурс як хук. Без цього рядка
    # job вважається частиною релізу.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]
```

Що робить цей шаблон хуком, так це анотація:

```yaml
annotations:
  "helm.sh/hook": post-install
```

Один ресурс може реалізовувати кілька хуків:

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

Аналогічно, немає обмежень на кількість різних ресурсів, які можуть реалізувати даний хук. Наприклад, можна оголосити як secret, так і config map як pre-install хук.

Коли субчарти оголошують хуки, вони також оцінюються. Немає способу для основного чарту відключити хуки, оголошені субчартами.

Можливо визначити вагу для хука, що допоможе створити детерміністичний порядок виконання. Ваги визначаються за допомогою наступної анотації:

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

Ваги хуків можуть бути позитивними або негативними числами, але повинні бути представлені як рядки. Коли Helm починає цикл виконання хуків певного типу, він сортує ці хуки у висхідному порядку.

### Політики видалення хуків {#hook-deletion-policies}

Можливо визначити політики, які визначають, коли видаляти відповідні ресурси хуків. Політики видалення хуків визначаються за допомогою наступної анотації:

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

Ви можете вибрати одне або кілька визначених значень анотацій:

| Значення анотації       | Опис                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| `before-hook-creation` | Видалити попередній ресурс перед запуском нового хуку (стандартно) |
| `hook-succeeded`       | Видалити ресурс після успішного виконання хука                    |
| `hook-failed`          | Видалити ресурс, якщо хук зазнав невдачі під час виконання         |

Якщо анотація політики видалення хука не вказана, стандартно застосовується поведінка `before-hook-creation`.