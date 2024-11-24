---
title: "Початок роботи"
weight: 2
description: "Короткий посібник з шаблонів чартів."
---

У цьому розділі посібника ми створимо чарт і додамо перший шаблон. Чарт, який ми створимо тут, буде використовуватися протягом усього цього посібника.

Щоб розпочати, давайте коротко ознайомимося з чартом Helm.

## Чарти {#charts}

Як описано в [Посібнику з чартів](../../topics/charts), чарти Helm мають таку структуру:

```none
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

Тека `templates/` призначена для файлів шаблонів. Коли Helm обробляє чарт, він передає всі файли з теки`templates/` до механізму рендерингу шаблонів. Потім збирає результати цих шаблонів і передає їх до Kubernetes.

Файл `values.yaml` також важливий для шаблонів. Цей файл містить _стандартні значення_ для чарту. Користувачі можуть перевизначити ці значення під час `helm install` або `helm upgrade`.

Файл `Chart.yaml` містить опис чарту. Ви можете отримати до нього доступ із шаблону.

Тека `charts/` _може_ містити інші чарти (які ми називаємо _субчартами_). Пізніше в цьому посібнику ми побачимо, як вони працюють під час рендерингу шаблонів.

## Стартовий чарт {#starter-chart}

У цьому посібнику ми створимо простий чарт з назвою `mychart`, а потім створимо кілька шаблонів всередині чарту.

```console
$ helm create mychart
Creating mychart
```

### Швидкий огляд `mychart/templates/` {#quick-glimpse-of-mychart-templates}

Якщо ви поглянете на теку `mychart/templates/`, то помітите кілька файлів, які вже там є.

- `NOTES.txt`: Вміст тексту довідки для вашого чарту. Його буде показана користувачам під час виконання `helm install`.
- `deployment.yaml`: Основний маніфест для створення [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) у Kubernetes.
- `service.yaml`: Основний маніфест для створення [точки доступу сервісу](https://kubernetes.io/docs/concepts/services-networking/service/) для вашого deployment.
- `_helpers.tpl`: Місце для розміщення допоміжних шаблонів, які ви можете використовувати повторно по всьому чарту.

І що ми збираємося зробити, це… _видалити їх усі!_ Таким чином, ми зможемо працювати з нашим посібником з нуля. Ми фактично створимо власні `NOTES.txt` та `_helpers.tpl` під час роботи.

```console
$ rm -rf mychart/templates/*
```

Коли ви пишете чарти для операційної діяльності, мати базові версії цих чартів може бути дійсно корисно. Тож у повсякденному створенні чартів ви, ймовірно, не захочете їх видаляти.

## Перший шаблон {#a-first-template}

Перший шаблон, який ми збираємося створити, буде `ConfigMap`. У Kubernetes `ConfigMap` — це обʼєкт для зберігання конфігураційних даних. Інші речі, такі як podʼи, можуть отримувати доступ до даних у `ConfigMap`.

Оскільки `ConfigMap` є базовим ресурсом, він стане чудовою відправною точкою для нас.

Почнемо зі створення файлу з назвою `mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**ПОРАДА:** Імена шаблонів не слідують жорсткому шаблону іменування. Проте ми рекомендуємо використовувати розширення `.yaml` для YAML-файлів та `.tpl` для допоміжних шаблонів.

Наведений вище YAML-файл є мінімальною версією `ConfigMap`, що містить лише необхідні поля. Завдяки тому, що цей файл знаходиться в теці `mychart/templates/`, він буде переданий через механізм рендерингу шаблонів.

Можна просто помістити звичайний YAML-файл, як цей, у теку `mychart/templates/`. Коли Helm читає цей шаблон, він просто передає його в Kubernetes у такому вигляді.

За допомогою цього простого шаблону ми отримали чарт, який можна інсталювати. І ми можемо встановити його ось так:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

За допомогою Helm ми можемо отримати реліз і побачити фактичний шаблон, який був завантажений.

```console
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

Команда `helm get manifest` приймає імʼя релізу (`full-coral`) і виводить усі ресурси Kubernetes, які були завантажені на сервер. Кожен файл починається з `---`, що вказує на початок YAML-документа, а потім слідує автоматично згенерований коментар, який повідомляє нам, який файл шаблону згенерував цей YAML-документ.

З цього моменту ми можемо побачити, що YAML-дані саме такі, як ми їх розмістили у файлі `configmap.yaml`.

Тепер ми можемо видалити наш реліз: `helm uninstall full-coral`.

### Додавання виклику простого шаблону {#adding-a-simple-template-call}

Жорстке кодування поля `name:` у ресурсі зазвичай вважається поганою практикою. Імена повинні бути унікальними для кожного релізу. Тому ми можемо захотіти згенерувати поле імені, вставивши назву релізу.

**ПОРАДА:** Поле `name:` обмежене 63 символами через обмеження системи DNS. З цієї причини імена релізів обмежені 53 символами. У Kubernetes версії 1.3 та раніше було обмежено лише 24 символами (тобто імена довжиною до 14 символів).

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

Директива шаблону `{{ .Release.Name }}` вставляє назву релізу в шаблон. Значення, які передаються в шаблон, можна вважати _обʼєктами з просторами імен_, де точка (`.`) розділяє кожен елемент простору імен.

Точка перед `Release` вказує, що ми починаємо з найвищого простору імен для цієї області застосування (про область ми поговоримо трохи пізніше). Таким чином, ми могли б прочитати `Release.Name` як: "почати з верхнього простору імен, знайти обʼєкт `Release`, а потім шукати всередині нього обʼєкт з назвою `Name`".

Обʼєкт `Release` є одним із вбудованих обʼєктів для Helm, і ми розглянемо його більш детально пізніше. Але поки достатньо сказати, що це покаже назву релізу, яку бібліотека присвоює нашому релізу.

Тепер, коли ми встановлюємо наш ресурс, ми одразу побачимо результат використання цієї директиви шаблону:

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Ви можете запустити `helm get manifest clunky-serval`, щоб побачити весь згенерований YAML.

Зверніть увагу, що імʼя ConfigMap всередині Kubernetes тепер є `clunky-serval-configmap`, замість попереднього `mychart-configmap`.

На цьому етапі ми бачили шаблони в їх найпростішому вигляді: YAML-файли з вбудованими директивами шаблонів між `{{` та `}}`. У наступній частині ми глибше розглянемо шаблони. Але перед тим, як перейти далі, є один простий трюк, який може зробити створення шаблонів швидшим: коли ви хочете протестувати рендеринг шаблону, але насправді нічого не встановлювати, ви можете використати `helm install --debug --dry-run goodly-guppy ./mychart`. Це опрацює шаблони, але замість того, щоб встановити чарт, він поверне вам опрацьований шаблон, щоб ви могли побачити результат:

```console
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

У [Посібнику з шаблонів чарту](_index.md) ми розглянемо базовий чарт, який ми визначили тут, і детально дослідимо мову шаблонів Helm. І ми почнемо з вбудованих обʼєктів.
