---
title: Доступ до файлів всередині шаблонів
description: Як отримати доступ до файлів зсередини шаблону.
sidebar_position: 10
---

У попередньому розділі ми розглянули кілька способів створення та доступу до іменованих шаблонів. Це полегшує імпорт одного шаблону в інший шаблон. Але іноді корисно імплементувати _файл, який не є шаблоном_ і вбудувати його вміст без використання рендерера шаблонів.

Helm надає доступ до файлів через обʼєкт `.Files`. Перш ніж переходити до прикладів шаблонів, є кілька моментів, які слід врахувати:

- Можна додавати додаткові файли до вашого Helm чарту. Ці файли будуть упаковані. Але будьте обережні. Чарти мають бути меншими за 1М через обмеження зберігання обʼєктів Kubernetes.
- Деякі файли не можна отримати через обʼєкт `.Files`, зазвичай з міркувань безпеки.
  - Файли в `templates/` не можна отримати.
  - Файли, виключені за допомогою `.helmignore`, не можна отримати.
  - Файли поза Helm-застосукном [subchart](/chart_template_guide/subcharts_and_globals.md), включаючи файли батьківського чарту, не можна отримати.
- Чарти не зберігають інформацію про режим UNIX, тому дозволи на рівні файлу не вплинуть на доступність файлу в обʼєкті `.Files`.

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [Базовий приклад](#basic-example)
- [Помічники оброки шляхів](#path-helpers)
- [Шаблони Glob](#glob-patterns)
- [Утиліти для ConfigMap і Secrets](#configmap-and-secrets-utility-functions)
- [Кодування](#encoding)
- [Рядки](#lines)

<!-- tocstop -->

## Базовий приклад {#basic-example}

З урахуванням цих застережень, напишемо шаблон, який читає три файли в наш ConfigMap. Для початку додамо три файли до чарту, розміщуючи всі три безпосередньо в теці `mychart/`.

`config1.toml`:

```toml
message = "Hello from config 1"
```

`config2.toml`:

```toml
message = "This is config 2"
```

`config3.toml`:

```toml
message = "Goodbye from config 3"
```

Кожен з цих файлів є простим TOML-файлом (згадайте про старі INI-файли Windows). Ми знаємо імена цих файлів, тому можемо використовувати функцію `range`, щоб перебрати їх і вставити їх вміст у наш ConfigMap.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

Цей ConfigMap використовує кілька технік, обговорених у попередніх розділах. Наприклад, ми створюємо змінну `$files`, щоб зберегти посилання на обʼєкт `.Files`. Ми також використовуємо функцію `tuple`, щоб створити список файлів, які ми перебираємо. Потім ми виводимо кожне імʼя файлу (`{{ . }}: |-`) після чого йде вміст файлу `{{ $files.Get . }}`.

Запуск цього шаблону створить один ConfigMap з вмістом усіх трьох файлів:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## Помічники оброки шляхів {#path-helpers}

При роботі з файлами може бути дуже корисно виконувати деякі стандартні операції з самими шляхами файлів. Для цього Helm імплементує багато функцій з пакета Go [path](https://golang.org/pkg/path/). Вони всі доступні з такими ж іменами, як у пакеті Go, але з маленькою першою літерою. Наприклад, `Base` стає `base` і т.д.

Імпортовані функції:

- Base
- Dir
- Ext
- IsAbs
- Clean

## Шаблони glob {#glob-patterns}

Коли ваш чарт зростає, ви можете знайти необхідність організувати ваші файли більше, і тому ми надаємо метод `Files.Glob(pattern string)` для допомоги у витягуванні певних файлів з усією гнучкістю [шаблонів glob](https://godoc.org/github.com/gobwas/glob).

`.Glob` повертає тип `Files`, тому ви можете викликати будь-які методи `Files` на повернутому обʼєкті.

Наприклад, уявіть структуру директорій:

```none
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

У вас є кілька варіантів з Globs:

```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

Або

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## Утиліти для ConfigMap і Secrets {#configmap-and-secrets-utility-functions}

(Доступні з Helm 2.0.2 і пізніше)

Дуже часто потрібно помістити вміст файлів як у ConfigMaps, так і в Secrets, для монтування в ваші podʼи під час виконання. Для цього ми надаємо кілька методів утиліт для типу `Files`.

Для подальшої організації особливо корисно використовувати ці методи разом з методом `Glob`.

Задана структура теки з прикладу [Glob](#glob-patterns):

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

## Кодування {#encoding}

Ви можете імплементувати файл і змусити шаблон закодувати його в base-64, щоб забезпечити успішну передачу:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

Вищенаведене візьме той самий файл `config1.toml`, який ми використовували раніше, і закодує його:

```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```

## Рядки {#lines}

Іноді потрібно отримати доступ до кожного рядка файлу у вашому шаблоні. Ми надаємо зручний метод `Lines` для цього.

Ви можете перебрати `Lines`, використовуючи функцію `range`:

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

Немає можливості передавати файли, що знаходяться поза чартом, під час `helm install`. Тому, якщо ви просите користувачів надати дані, їх потрібно завантажити за допомогою `helm install -f` або `helm install --set`.

Це обговорення завершує наше занурення в інструменти та техніки написання шаблонів Helm. У наступному розділі ми побачимо, як можна використовувати один спеціальний файл, `templates/NOTES.txt`, для надсилання інструкцій після установки користувачам вашого чарту.
