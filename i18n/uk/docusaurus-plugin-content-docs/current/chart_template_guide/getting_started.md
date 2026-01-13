---
title: Початок роботи
description: Короткий посібник з шаблонів чартів
sidebar_position: 2
---

У цьому розділі посібника ми створимо чарт і додамо перший шаблон. Чарт, який ми створимо тут, буде використовуватися протягом усього цього посібника.

Щоб розпочати, давайте швидко ознайомимося з чартом Helm.

## Чарти {#charts}

Як описано в [Посібнику з чартів](/topics/charts.mdx), чарти Helm мають таку структуру:

```none
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

Тека `templates/` призначена для файлів шаблонів. Коли Helm обробляє чарт, він передає всі файли з теки `templates/` до механізму рендерингу шаблонів. Потім збирає результати цих шаблонів і передає їх до Kubernetes.

Файл `values.yaml` також важливий для шаблонів. Цей файл містить _стандартні значення_ для чарту. Користувачі можуть перевизначити ці значення виконуючи `helm install` або `helm upgrade`.

Файл `Chart.yaml` містить опис чарту. Ви можете отримати до нього доступ із шаблону.

Тека `charts/` _може_ містити інші чарти (які ми називаємо _субчартами_). Пізніше в цьому посібнику ми побачимо, як вони працюють під час рендерингу шаблонів.

## Простий чарт {#a-starter-chart}

У цьому посібнику ми створимо простий чарт з назвою `mychart`, а потім створимо кілька шаблонів всередині чарту.

```sh
$ helm create mychart
Creating mychart
```

### Швидкий огляд `mychart/templates/` {#a-quick-glimpse-of-mycharttemplates}

Якщо ви поглянете на теку `mychart/templates/`, то помітите кілька файлів, які вже там є.

- `NOTES.txt`: Вміст тексту довідки для вашого чарту. Його буде показана користувачам під час виконання `helm install`.
- `deployment.yaml`: Основний маніфест для створення [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) у Kubernetes.
- `service.yaml`: Основний маніфест для створення [точки доступу сервісу](https://kubernetes.io/docs/concepts/services-networking/service/) для вашого deployment.
- `_helpers.tpl`: Місце для розміщення допоміжних шаблонів, які ви можете використовувати повторно по всьому чарту.

І що ми збираємося зробити, це… _видалити їх усі!_ Таким чином, ми зможемо працювати з нашим посібником з нуля. Ми фактично створимо власні `NOTES.txt` та `_helpers.tpl` під час роботи.

```sh
$ rm -rf mychart/templates/*
```

Коли ви створюєте чарти промислового рівня, наявність базових версій цих чартів може бути дуже корисною. Тому під час щоденного створення чартів ви, ймовірно, не захочете їх видаляти.

## Перший шаблон {#a-first-template}

Перший шаблон, який ми створимо, буде `ConfigMap`. У Kubernetes ConfigMap — це просто об'єкт для зберігання даних конфігурації. Інші об'єкти, наприклад, pods, можуть отримувати доступ до даних у ConfigMap.

Оскільки ConfigMaps є базовими ресурсами, вони є для нас чудовою відправною точкою.

Почнемо зі створення файлу з назвою `mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

:::tip
Імена шаблонів не підпорядковуються жорстким правилам іменування. Однак ми рекомендуємо використовувати розширення `.yaml` для файлів YAML і `.tpl` для допоміжних файлів.
:::

Вищезазначений файл YAML є базовим ConfigMap, що містить мінімально необхідні поля. Оскільки цей файл знаходиться в теці `mychart/templates/`, він буде переданий до рушія шаблонів.

Цей простий файл YAML можна розмістити в теці `mychart/templates/`. Коли Helm прочитає цей шаблон, він просто надішле його до Kubernetes у незмінному вигляді.

Завдяки цьому простому шаблону ми тепер маємо чарт, який можна встановити. І ми можемо встановити
його наступним чином:

```sh
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

За допомогою Helm ми можемо отримати реліз і побачити фактичний шаблон, який був завантажений.

```sh
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

Команда `helm get manifest` використовує імʼя релізу (`full-coral`) і виводить всі ресурси Kubernetes, які були завантажені на сервер. Кожен файл починається з `---`, що позначає початок документа YAML, а потім йде автоматично згенерований рядок коментаря, який повідомляє, який файл шаблону згенерував цей документ YAML.

З цього моменту ми можемо побачити, що YAML-дані саме такі, як ми їх розмістили у файлі `configmap.yaml`.

Тепер ми можемо видалити наш реліз: `helm uninstall full-coral`.

### Додавання простого виклику шаблону {#adding-a-simple-template-call}

Жорстке кодування поля `name:` у ресурсі зазвичай вважається поганою практикою. Імена повинні бути унікальними для кожного релізу. Тому ми можемо захотіти згенерувати поле імені, вставивши назву релізу.

:::info
Поле `name:` обмежене 63 символами через обмеження системи DNS. З цієї причини імена релізів обмежені 53 символами. У Kubernetes версії 1.3 та раніше було обмежено лише 24 символами (тобто імена довжиною до 14 символів).
:::

Змінимо файл `configmap.yaml` відповідно.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

Основна зміна полягає в значенні поля `name:`, яке тепер має вигляд `{{ .Release.Name }}-configmap`.

> Директива шаблону міститься у дужках `{{` та `}}`.

Директива шаблону `{{ .Release.Name }}` вставляє назву релізу в шаблон. Значення, які передаються в шаблон, можна вважати _обʼєктами в просторах імен_, де точка (`.`) розділяє кожен елемент простору імен.

Точка перед `Release` вказує, що ми починаємо з найвищого простору імен для цієї області застосування (про область ми поговоримо трохи пізніше). Таким чином, ми могли б прочитати `Release.Name` як: "почати з верхнього простору імен, знайти обʼєкт `Release`, а потім шукати всередині нього обʼєкт з назвою `Name`".

Обʼєкт `Release` є одним із вбудованих обʼєктів для Helm, і ми розглянемо його більш детально пізніше. Але поки достатньо сказати, що це покаже назву релізу, яку бібліотека присвоює нашому релізу.

Тепер, коли ми встановлюємо наш ресурс, ми одразу побачимо результат використання цієї директиви шаблону:

```sh
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Ви можете запустити `helm get manifest clunky-serval`, щоб побачити весь згенерований YAML.

Зверніть увагу, що ConfigMap всередині Kubernetes має назву `clunky-serval-configmap`, а не `mychart-configmap`, як раніше.

На цьому етапі ми розглянули найпростіші шаблони: файли YAML, що містять директиви шаблону, вкладені в `{{` та `}}`. У наступній частині ми детальніше розглянемо шаблони. Але перш ніж рухатися далі, є один швидкий трюк, який може пришвидшити створення шаблонів: якщо ви хочете протестувати рендеринг шаблону, але не встановлювати нічого, ви можете використати `helm install --debug --dry-run goodly-guppy ./mychart`. Ця команда рендерить шаблони. Але замість встановлення чарту, вона поверне вам опрацьований шаблон, щоб ви могли побачити результат:

```sh
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

Використання `--dry-run` полегшить тестування вашого коду, але це не гарантує, що сам Kubernetes прийме згенеровані вами шаблони. Краще не припускати, що ваш чарт буде встановлений тільки тому, що `--dry-run` працює.

У [Посібнику з шаблонів чарту](/chart_template_guide/index.mdx) ми розглянемо базовий чарт, який ми визначили тут, і детально дослідимо мову шаблонів Helm. І ми почнемо з вбудованих обʼєктів.
