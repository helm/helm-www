---
title: Міграція втулків v3 на Helm 4
sidebar_label: Міграція з v3
sidebar_position: 4
default_lang_commit: 46512d3900a76cc02c9b9748be96d442f87ff15a
---

# Міграція втулків v3 на Helm 4

У Helm 4 перероблено систему втулків: додано підтримку версій API, явні типи втулків і необовʼязкове середовище виконання Wasm. Ваші наявні втулки Helm 3 і далі працюють у Helm 4, зокрема ті, що використовують середовище виконання `subprocess`. Застарілою є схема `plugin.yaml` Helm 3 без версій API. У цьому посібнику пояснюється, як оновити втулок Helm 3 до схеми `apiVersion: v1` із версією.

## Перш ніж почати {#before-you-begin}

Вам знадобляться:

- Встановлений Helm 4 (`helm version` має показувати версію v4.x)
- Наявний втулок Helm 3, який потрібно перенести
- Знання структури файла `plugin.yaml` вашого втулка

Визначте, до якої категорії належить ваш втулок:

| Якщо ваш втулок... | Його тип у Helm 4 |
|---|---|
| Додає підкоманду CLI `helm` | `cli/v1` |
| Завантажує чарти за власним протоколом (s3, git тощо) | `getter/v1` |
| Змінює відрендерені маніфести перед встановленням | `postrenderer/v1` |

:::warning[Несумісна зміна для пострендерів]
У Helm 3 параметр `helm install --post-renderer` приймав шлях до виконуваного файла. У Helm 4 він вимагає **назву втулка**. Якщо ваш процес пострендерингу передає шлях до виконуваного файла безпосередньо, потрібно запакувати його як втулок `postrenderer/v1` і натомість передавати назву втулка в `--post-renderer`. Докладніше див. в [Огляді Helm 4](/overview.md#plugin-system-overhaul).
:::

## Що змінилося у plugin.yaml {#what-changed-in-pluginyaml}

У таблиці нижче наведено відповідність застарілих полів полям v4.

| Застаріле поле | Відповідник у v4 | Примітки |
|---|---|---|
| *(відсутнє)* | `apiVersion: v1` | Нове обовʼязкове поле |
| *(відсутнє)* | `type: cli/v1` | Нове обовʼязкове поле. Використовуйте `cli/v1`, `getter/v1` або `postrenderer/v1` |
| *(відсутнє)* | `runtime: subprocess` | Нове обовʼязкове поле. Використовуйте `subprocess` або `extism/v1` |
| `name` | `name` | Без змін |
| `version` | `version` | Без змін |
| `usage` | `config.usage` | Для втулків CLI перенесено до `config` |
| `description` | `config.shortHelp` | Перейменовано й перенесено до `config`. За потреби розділіть на `shortHelp` (короткий опис, показується в `helm help`) і `longHelp` (докладний опис, показується в `helm help <plugin>`) |
| *(відсутнє)* | `config.longHelp` | Нове необовʼязкове поле для втулків CLI. Використовуйте для докладного тексту довідки, який показується в `helm help <plugin>` |
| `ignoreFlags` | `config.ignoreFlags` | Для втулків CLI перенесено до `config` |
| `platformCommand` | `runtimeConfig.platformCommand` | Перенесено до `runtimeConfig` |
| `platformHooks` | `runtimeConfig.platformHooks` | Перенесено до `runtimeConfig` |
| `command` | *(застаріле)* | Натомість використовуйте `runtimeConfig.platformCommand` |
| `hooks` | *(застаріле)* | Натомість використовуйте `runtimeConfig.platformHooks` |
| `downloaders` | `config.protocols` + `runtimeConfig.protocolCommands` | Для втулків getter розділено між `config` і `runtimeConfig`. `protocolCommands` застаріло, але наразі це документований спосіб налаштувати subprocess-getter |

## Спосіб 1: міграція на subprocess (найшвидший) {#path-1-subprocess-migration-quickest}

Якщо ви хочете й надалі запускати втулок як subprocess (без компіляції у Wasm), потрібно лише змінити структуру `plugin.yaml`. Сам виконуваний файл не змінюється.

### Приклад: втулок CLI {#example-cli-plugin}

**До (Helm 3):**

```yaml
name: myplugin
version: 0.2.0
usage: "do something useful"
description: "A plugin that does something useful"
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
```

**Після (Helm 4, subprocess):**

```yaml
apiVersion: v1
type: cli/v1
name: myplugin
version: 0.2.0
runtime: subprocess
sourceURL: https://github.com/example/helm-myplugin

config:
  usage: "do something useful"
  shortHelp: "A plugin that does something useful"
  ignoreFlags: false

runtimeConfig:
  platformCommand:
    - command: ${HELM_PLUGIN_DIR}/bin/myplugin
    - os: windows
      command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
  platformHooks:
    install:
      - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      - os: windows
        command: pwsh
        args:
          - -c
          - ${HELM_PLUGIN_DIR}\scripts\install.ps1
```

Основні зміни: додайте `apiVersion`, `type` і `runtime` на верхньому рівні; за бажанням додайте там же `sourceURL` для прозорості; помістіть `usage`, `description` (тепер `shortHelp`) і `ignoreFlags` у `config`; а `platformCommand` і `platformHooks` — у `runtimeConfig`.

### Приклад: втулок getter (раніше — «downloader») {#example-getter-plugin-formerly-downloader}

**До (Helm 3):**

```yaml
name: s3
version: 1.2.0
usage: "fetch charts from S3"
description: "Downloader plugin for S3 chart repos"
downloaders:
  - command: "bin/s3downloader"
    protocols:
      - "s3"
```

**Після (Helm 4, subprocess):**

```yaml
apiVersion: v1
type: getter/v1
name: s3
version: 1.2.0
runtime: subprocess
sourceURL: https://github.com/example/helm-s3

config:
  protocols:
    - "s3"

runtimeConfig:
  protocolCommands:
    - protocols:
        - s3
      platformCommand:
        - command: ${HELM_PLUGIN_DIR}/bin/s3downloader
```

Блок `downloaders` замінено на `config.protocols` (перелік схем URL, які обробляє втулок) і `runtimeConfig.protocolCommands` (відповідність кожного протоколу його команді для платформи).

:::info
Поле `protocolCommands` позначено як застаріле в специфікації огляду та буде вилучене після `apiVersion: v1`. У майбутніх версіях слід безпосередньо використовувати `runtimeConfig.platformCommand`, а логіку визначення протоколу реалізувати у самому втулку, аналізуючи URL завантаження.
Поки що `protocolCommands` — це спосіб, якого навчають офіційні посібники для subprocess-getter.
:::

## Спосіб 2: міграція на Wasm {#path-2-wasm-migration}

Якщо ви хочете скористатися ізольованим середовищем Wasm, скомпілюйте втулок у двійковий файл `.wasm` за допомогою [Extism PDK](https://extism.org/docs/concepts/pdk) для мови програмування вашого втулка. Для втулків Go найпоширеніший вибір — [Extism Go PDK](https://github.com/extism/go-pdk).

Покрокові інструкції зі створення Wasm-втулків з нуля наведено в [посібнику зі створення Wasm-втулка getter](/plugins/developer/tutorial-getter-plugin.mdx) — наразі це найповніший приклад Wasm у документації. Також можна створити каркас нового Wasm-втулка на основі [шаблону втулка Extism](https://github.com/gjenkins8/helm-extism-plugin-template).

:::info
Розділи посібників про Wasm для CLI та пострендерера ще в роботі. Стежте за оновленнями на сторінці [Розробка втулків](/plugins/developer/index.mdx).
:::

Ось як змінюється `plugin.yaml` порівняно з наведеним вище варіантом subprocess:

```yaml
apiVersion: v1
type: cli/v1
name: myplugin
version: 0.2.0
runtime: extism/v1
sourceURL: https://github.com/example/helm-myplugin

config:
  usage: "do something useful"
  shortHelp: "A plugin that does something useful"
  ignoreFlags: false

runtimeConfig:
  memory:
    maxPages: 16
  allowedHosts:
    - "api.example.com"
  timeout: 30000
```

Основні відмінності від варіанта subprocess:

- `runtime` змінюється з `subprocess` на `extism/v1`.
- У `runtimeConfig` використовуються поля, специфічні для Wasm (`memory`, `allowedHosts`, `timeout`), замість `platformCommand`.
- `platformCommand` і `platformHooks` не потрібні — Helm завантажує двійковий файл Wasm із `plugin.wasm` у каталозі втулка.
- У каталозі втулка міститься `plugin.wasm` замість виконуваних файлів для конкретних платформ.

## Підписання перенесеного втулка {#signing-your-migrated-plugin}

У Helm 4 додано вбудоване підписання та перевірку походження втулків.
Поширюючи втулок, підпишіть його:

```bash
helm plugin package --sign --key "your-key-id" ./myplugin
```

Після цього користувачі зможуть перевірити втулок під час встановлення:

```bash
helm plugin install https://example.com/myplugin.tgz --verify
```

Для архівів втулків перевірку ввімкнено типово.
Докладніше див. у розділі [Безпека втулків](/plugins/user/index.md#plugin-security).

## Зворотна сумісність {#backwards-compatibility}

Застарілі втулки (без `apiVersion`) продовжують працювати в Helm 4. Helm автоматично визначає застарілий формат і обробляє такі втулки за допомогою застарілого обробника subprocess. Однак:

- Застарілі втулки в Helm 4 не рекомендовані.
- Підтримку застарілих втулків буде вилучено в Helm 5.
- Нові можливості втулків (середовище виконання Wasm, підписання походження, нові типи втулків) доступні лише з `apiVersion: v1`.

Перенесіть свої втулки вже зараз, щоб підготуватися до Helm 5 і надати користувачам переваги безпеки нової системи.

## Додаткові матеріали {#further-reading}

- [Огляд втулків](/plugins/overview.md) — повна специфікація `plugin.yaml`
- [Розробка втулків](/plugins/developer/index.mdx) — посібники зі створення втулків CLI, getter і postrenderer
- [Приклади втулків Helm 4](https://github.com/scottrigby/h4-example-plugins) — офіційні зразки реалізацій втулків
- [Шаблон втулка Extism](https://github.com/gjenkins8/helm-extism-plugin-template) — каркас нового Wasm-втулка
- [HIP-0026](https://github.com/helm/community/blob/main/hips/hip-0026.md) — пропозиція щодо проєктування системи втулків Wasm
