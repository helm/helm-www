---
title: "Тести чартів"
description: "Опис того, як запускати та тестувати ваші чарти."
weight: 3
---

Чарт містить ряд ресурсів та компонентів Kubernetes, які працюють разом. Як автор чарту, ви можете захотіти написати деякі тести, щоб перевірити, чи ваш чарт працює відповідно до очікувань після його встановлення. Ці тести також допомагають споживачеві чарту зрозуміти, що саме повинен робити ваш чарт.

**Тест** у Helm чарті розміщується в теці `templates/` і є визначенням Job, яке вказує контейнер з певною командою для виконання. Контейнер повинен успішно завершити роботу (exit 0), щоб тест вважався успішним. Визначення Job повинно містити анотацію хука Helm: `helm.sh/hook: test`.

Зверніть увагу, що до Helm v3, визначення Job повинно було містити одну з цих анотацій хука Helm: `helm.sh/hook: test-success` або `helm.sh/hook: test-failure`. `helm.sh/hook: test-success` все ще приймається як зворотно сумісна альтернатива `helm.sh/hook: test`.

Приклади тестів:

- Перевірте, що ваша конфігурація з файлу values.yaml була правильно вбудована.
  - Переконайтеся, що ваше імʼя користувача та пароль працюють правильно.
  - Переконайтеся, що неправильне імʼя користувача та пароль не працюють.
- Перевірте, що ваші сервіси працюють та правильно здійснюють балансування навантаження.
- тощо.

Ви можете запустити заздалегідь визначені тести у Helm для релізу за допомогою команди `helm test <RELEASE_NAME>`. Для споживача чарту це чудовий спосіб перевірити, чи їх реліз чарту (або програми) працює відповідно до очікувань.

## Приклад тесту {#example-test}

Команда [helm create](/docs/helm/helm_create) автоматично створює кілька тек і файлів. Щоб спробувати функціональність тестів Helm, спочатку створіть демонстраційний Helm чарт.

```console
$ helm create demo
```

Тепер ви побачите таку структуру у вашому демонстраційному Helm чарті.

```none
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

У `demo/templates/tests/test-connection.yaml` ви побачите тест, який ви можете спробувати. Ось визначення Pod для тесту:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never
```

## Кроки для запуску тестового набору на релізі

По-перше, встановіть чарт у ваш кластер, щоб створити реліз. Можливо, вам доведеться почекати, поки всі podʼи стануть активними; якщо ви запустите тест одразу після цього встановлення, це може показати транзитивну помилку, і вам доведеться повторити тестування.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## Примітки {#notes}

- Ви можете визначити стільки тестів, скільки бажаєте, в одному yaml файлі або розподілити їх по кількох yaml файлах у теці `templates/`.
- Ви можете організувати ваші тести у теці `tests/`, наприклад, `<chart-name>/templates/tests/` для більшої ізоляції.
- Тест є [Helm хуком](/docs/charts_hooks/), тому анотації, такі як `helm.sh/hook-weight` і `helm.sh/hook-delete-policy`, можуть використовуватися з ресурсами тестів.
