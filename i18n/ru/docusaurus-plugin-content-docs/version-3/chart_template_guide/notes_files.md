---
title: Создание файла NOTES.txt
description: Как предоставить инструкции пользователям вашего чарта.
sidebar_position: 10
---

В этом разделе мы рассмотрим инструмент Helm для предоставления инструкций пользователям вашего чарта. По завершении команды `helm install` или `helm upgrade` Helm может вывести блок полезной информации для пользователей. Эта информация легко настраивается с помощью шаблонов.

Чтобы добавить инструкции по установке в ваш чарт, просто создайте файл `templates/NOTES.txt`. Это обычный текстовый файл, но он обрабатывается как шаблон и имеет доступ ко всем стандартным функциям и объектам шаблонов.

Давайте создадим простой файл `NOTES.txt`:

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

Теперь, если мы выполним `helm install rude-cardinal ./mychart`, в конце вывода мы увидим следующее сообщение:

```
RESOURCES:
==> v1/Secret
NAME                   TYPE      DATA      AGE
rude-cardinal-secret   Opaque    1         0s

==> v1/ConfigMap
NAME                      DATA      AGE
rude-cardinal-configmap   3         0s


NOTES:
Thank you for installing mychart.

Your release is named rude-cardinal.

To learn more about the release, try:

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

Использование `NOTES.txt` таким образом — отличный способ предоставить пользователям подробную информацию о том, как работать с только что установленным чартом. Создание файла `NOTES.txt` настоятельно рекомендуется, хотя и не является обязательным.
