---
title: Контрольний список випуску для супровідників
description: Контрольний список для супровідників під час випуску нової версії Helm.
sidebar_position: 3
default_lang_commit: 29b17b3d54de6fa21c6f38ace0935bcd45284037
---

# Посібник для супровідників щодо випуску Helm

Час випускати нову версію Helm! Як супровідник Helm, що готує випуск, ви найкраще можете оновити цей контрольний список, якщо ваш досвід відрізняється від описаного тут.

Усі випуски мають формат vX.Y.Z, де X — це основний номер версії, Y — це номер мінорної версії, а Z — це номер патч-релізу. Проєкт суворо дотримується [семантичного версіювання](https://semver.org/lang/uk/), тому дотримання цього етапу є критично важливим.

Helm заздалегідь оголошує дату наступного мінорного випуску. Слід докласти всіх зусиль, щоб дотриматися оголошеної дати. Крім того, на початку процесу випуску дату наступного випуску вже має бути визначено, оскільки вона знадобиться під час його підготовки.

Цей посібник описує два незалежні процеси:

* [**Контрольний список мінорного/основного випуску**](#minormajor-release-checklist) — для випусків із новими функціями (кожні 3–4 місяці) або несумісними змінами
* [**Контрольний список патч-релізу**](#patch-release-checklist) — для вибраних виправлень помилок (випускаються щомісяця)

Обидва процеси використовують розділи [Початкова конфігурація](#initial-configuration) та [Дії після випуску](#post-release).

## Початкова конфігурація {#initial-configuration}

### Налаштування віддаленого репозиторію Git {#set-up-git-remote}

Зверніть увагу: у цьому документі передбачається, що віддалений репозиторій Git, який відповідає <https://github.com/helm/helm>, має назву «upstream». Якщо це не так (наприклад, якщо ви назвали його «origin» або інакше), відповідно змініть наведені команди для свого середовища. Якщо не знаєте назву віддаленого репозиторію, виконайте команду `git remote -v`.

Якщо у вас немає [віддаленого репозиторію upstream](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork), додайте його, наприклад, так:

```shell
git remote add upstream git@github.com:helm/helm.git
```

### Налаштування ключа підпису {#set-up-signing-key}

Для підвищення безпеки й перевірки процесу випуску ми хешуємо бінарні файли та додаємо файли підписів. Для цього використовуємо [GitHub і GPG](https://help.github.com/en/articles/about-commit-signature-verification). Якщо GPG ще не налаштовано, виконайте такі кроки:

1. [Встановіть GPG](https://gnupg.org/index.html)
2. [Згенеруйте ключ GPG](https://help.github.com/en/articles/generating-a-new-gpg-key)
3. [Додайте ключ до облікового запису GitHub](https://help.github.com/en/articles/adding-a-new-gpg-key-to-your-github-account)
4. [Налаштуйте ключ підпису в Git](https://help.github.com/en/articles/telling-git-about-your-signing-key)

Після створення ключа підпису додайте його до файлу KEYS у кореневій теці репозиторію. Інструкції щодо цього містяться в самому файлі. Якщо ви ще цього не зробили, додайте відкритий ключ до мережі серверів ключів. Якщо використовуєте GnuPG, скористайтеся [інструкціями Debian](https://debian-administration.org/article/451/Submitting_your_GPG_key_to_a_keyserver).

---

## Контрольний список мінорного/основного випуску {#minormajor-release-checklist}

Основні випуски містять нові функції та зміни поведінки, *що порушують зворотну сумісність*. Мінорні випуски містять нові функції, що не порушують зворотну сумісність.

**Примітка:** основний випуск потребує багато додаткової роботи, наприклад створення гілки розробки попередньої основної версії (наприклад, `dev-v4`), оновлення GitHub Actions і створення нової документації. Цей контрольний список охоплює лише сам процес випуску й передбачає, що таку роботу вже виконано.

1. [Налаштування змінних середовища](#set-up-environment-variables)
2. [Створення гілки випуску](#1-create-the-release-branch)
3. [Зміна номера версії в Git](#2-change-the-version-number-in-git)
4. [Фіксація змін та надсилання гілки випуску](#3-commit-and-push-the-release-branch)
5. [Створення кандидата у випуск](#4-create-a-release-candidate)
6. [Повторення процесу із наступними кандидатами у випуск](#5-iterate-on-successive-release-candidates)
7. [Завершення випуску](#6-finalize-the-release)
8. [Написання приміток до випуску](#7-write-the-release-notes)
9. [Підписування завантажуваних файлів ключем PGP](#8-pgp-sign-the-downloads)
10. [Публікація випуску](#9-publish-release)

Після цього перейдіть до розділу [Дії після випуску](#post-release).

### Налаштування змінних середовища {#set-up-environment-variables}

```shell
export RELEASE_NAME=vX.Y.0
export RELEASE_BRANCH_NAME="release-X.Y"
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.1"
```

### 1. Створення гілки випуску {#1-create-the-release-branch}

Створіть гілку `release-X.Y` від гілки main.

```shell
git fetch upstream
git checkout upstream/main
git checkout -b $RELEASE_BRANCH_NAME
```

Ця нова гілка стане основою випуску, у якій ми надалі працюватимемо.

Переконайтеся, що на GitHub існує [віха helm/helm](https://github.com/helm/helm/milestones) для цього випуску (за потреби створіть її). Переконайтеся, що PR та issues цього випуску додано до цієї віхи.

### 2. Зміна номера версії в Git {#2-change-the-version-number-in-git}

Для основного або мінорного випуску оновіть `internal/version/version.go`, указавши наступну версію, у гілці main.

```shell
git checkout main
git checkout -b bump-version-<next_release_version>
```

```shell
$ git diff internal/version/version.go
diff --git a/internal/version/version.go b/internal/version/version.go
index 712aae64..c1ed191e 100644
--- a/internal/version/version.go
+++ b/internal/version/version.go
@@ -30,7 +30,7 @@ var (
        // Збільшіть основний номер для нових функцій і змін поведінки.
        // Збільшіть мінорний номер для виправлень помилок і підвищення продуктивності.
        // Збільшіть номер патча для критичних виправлень наявних випусків.
-       version = "v4.0"
+       version = "v4.1"

        // metadata — це додаткові дані часу збирання
        metadata = ""
```

Окрім оновлення версії у файлі `version.go`, оновіть відповідні тести, у яких використовується цей номер версії:

* `pkg/cmd/helm/testdata/output/version.txt`
* `pkg/cmd/helm/testdata/output/version-short.txt`
* `pkg/cmd/helm/testdata/output/version-template.txt`
* `pkg/chart/common/capabilities_test.go`

```shell
git add .
git commit -m "bump version to <next_release_version>"
git push origin bump-version-<next_release-version>
```

Ці зміни потрібно злити до створення наступної гілки випуску.

Перш ніж продовжити, поверніться до гілки випуску:

```shell
git checkout $RELEASE_BRANCH_NAME
```

### 3. Фіксація змін і надсилання гілки випуску {#3-commit-and-push-the-release-branch}

Тепер можна надіслати гілку випуску до upstream, щоб інші могли почати тестування.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

Перевірте [GitHub Actions](https://github.com/helm/helm/actions) і переконайтеся, що випуск успішно пройшов CI, перш ніж продовжити.

Якщо є охочі, попросіть інших переглянути гілку перед продовженням, щоб переконатися, що внесено всі необхідні зміни та до неї потрапили всі коміти випуску.

### 4. Створення кандидата випуску {#4-create-a-release-candidate}

Коли гілку випуску створено й підготовлено, час створювати кандидатів випуску і послідовно їх перевіряти.

```shell
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

GitHub Actions автоматично створить позначений теґом образ випуску та клієнтський бінарний файл для тестування.

Після того як GitHub Actions збере артефакти, тестувальники можуть завантажити клієнт такими командами:

Linux/amd64, за допомогою /bin/bash:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-linux-amd64.tar.gz
```

Darwin/amd64, за допомогою Terminal.app:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-darwin-amd64.tar.gz
```

Windows/amd64, за допомогою PowerShell:

```shell
PS C:\> Invoke-WebRequest -Uri "https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-windows-amd64.tar.gz" -OutFile "helm-$ReleaseCandidateName-windows-amd64.tar.gz"
```

Розпакуйте архів і перемістіть бінарний файл до теки, що входить у `$PATH`. Або перемістіть його в інше місце й додайте це місце до `$PATH` (наприклад, `/usr/local/bin/helm` у Linux/macOS або `C:\Program Files\helm\helm.exe` у Windows).

### 5. Повторення процесу з наступними кандидатами випуску {#5-iterate-on-successive-release-candidates}

Протягом кількох днів присвятіть час і ресурси спробам виявити будь-які проблеми в Helm та задокументуйте всі важливі для випуску знахідки. У цей період слід тестувати й шукати проблеми, які випуск міг спричинити в різних функціях або середовищах оновлення, а не писати код. На цей час діє заморожування коду: усі додаткові зміни коду буде перенесено до наступного випуску.

На цьому етапі гілка `$RELEASE_BRANCH_NAME` продовжуватиме змінюватися, оскільки ви створюватимете нових кандидатів випуску. Частоту їх створення визначає менеджер випуску: керуйтеся власним розсудом з огляду на серйозність повідомлених проблем, доступність тестувальників і заплановану дату випуску. Зазвичай краще перенести випуск на пізніший термін, ніж випустити несправну версію.

Щоразу, коли потрібно створити нового кандидата випуску, спершу додайте до гілки коміти з main за допомогою cherry-pick:

```shell
git cherry-pick -x <commit_id>
```

Також надішліть гілку до GitHub і переконайтеся, що вона пройшла CI.

Потім створіть теґ і повідомте користувачів про нового кандидата випуску:

```shell
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.2"
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

Після надсилання теґу до GitHub перевірте, чи успішно збирається в CI гілка з цим теґом.

Продовжуйте повторювати цей процес і тестувати, доки не будете задоволені кандидатом випуску. Для кандидата не потрібно писати повні примітки до випуску, але можна підготувати їхню [чернетку](#7-write-the-release-notes).

### 6. Прийняти остаточне рішення щодо випуску {#6-finalize-the-release}

Коли якість кандидата випуску вас влаштовує, можна створити остаточний випуск. Ще раз перевірте, чи все готово, а потім надішліть теґ випуску.

```shell
git checkout $RELEASE_BRANCH_NAME
git tag --sign --annotate "${RELEASE_NAME}" --message "Helm release ${RELEASE_NAME}"
git push upstream $RELEASE_NAME
```

Переконайтеся в [GitHub Actions](https://github.com/helm/helm/actions), що випуск створено успішно. Якщо ні, виправте проблему й надішліть випуск повторно.

Збирання CI потребуватиме часу, тож поки воно триває, можна перейти до написання приміток до випуску.

### 7. Написання приміток до випуску {#7-write-the-release-notes}

Ми автоматично згенеруємо журнал змін на основі комітів, що ввійшли до циклу випуску, але для кінцевих користувачів зазвичай корисніше, коли примітки до випуску написані людиною —членом команди або маркетологом.

Для основного чи мінорного випуску зазвичай достатньо перерахувати помітні зміни, важливі для користувачів.

У примітках до випуску мають бути зазначені версія та запланована дата наступного випуску.

Приклад приміток до мінорного випуску:

```markdown
## vX.Y.Z

Helm vX.Y.Z — це випуск із новими функціями. Цього разу ми зосередилися на <зазначте головний напрям роботи>. Радимо користувачам оновитися, щоб отримати найкращий досвід.

Наша спільнота зростає, і ми будемо раді бачити вас серед її учасників!

- Долучайтеся до обговорення в [Kubernetes Slack](https://kubernetes.slack.com):
  - `#helm-users` — запитання та спілкування
  - `#helm-dev` — обговорення PR, коду й помилок
- Долучайтеся до відкритої зустрічі розробників щочетверга о 9:30 за тихоокеанським часом у [Zoom](https://zoom-lfx.platform.linuxfoundation.org/meeting/99213281727?password=17825db5-c698-44cc-9f00-ef1f61f5d3fb)
- Тестуйте, налагоджуйте та долучайтеся до розробки чартів: [чарти Helm на Artifact Hub](https://artifacthub.io/packages/search?kind=0)

## Важливі зміни

- Додано підтримку Kubernetes 1.16, зокрема нових apiVersions для маніфестів.
- Sprig оновлено до версії 2.22.

## Встановлення та оновлення

Завантажте Helm X.Y.Z. Бінарні файли для найпоширеніших платформ доступні тут:

- [MacOS amd64](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz) ([контрольна сума](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux amd64](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz) ([контрольна сума](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux arm](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz) ([контрольна сума](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz.sha256) / CHECKSUM_VAL)
- [Linux arm64](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz) ([контрольна сума](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux i386](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz) ([контрольна сума](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz.sha256) / CHECKSUM_VAL)
- [Linux ppc64le](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz) ([контрольна сума](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux s390x](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz) ([контрольна сума](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Windows amd64](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip) ([контрольна сума](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip.sha256sum) / CHECKSUM_VAL)

[Посібник зі швидкого початку роботи](/intro/quickstart.md) допоможе  вам розпочати. Інструкції з **оновлення** та докладні відомості про встановлення наведено в [посібнику зі встановлення](/intro/install.mdx). Також можна скористатися [скриптом встановлення](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4) у будь-якій системі з `bash`.

## Що далі

- У vX.Y.Z+1 будуть лише виправлення помилок; випуск заплановано на <вкажіть дату>.
- Наступний випуск із новими функціями — vX.Y+1.0, його заплановано на <вкажіть дату>. Основну увагу в ньому буде приділено ...

## Журнал змін

- chore(*): bump version to v2.7.0 08c1144f5eb3e3b636d9775617287cc26e53dba4 (Adam Reese)
- fix circle not building tags f4f932fabd197f7e6d608c8672b33a483b4b76fa (Matthew Fisher)
```

Частково заповнений набір приміток до випуску разом із журналом змін можна створити такою командою:

```shell
export VERSION="$RELEASE_NAME"
export PREVIOUS_RELEASE=vX.Y.Z
make clean
make fetch-dist
make release-notes
```

Так ви отримаєте добру основу приміток, до якої потрібно буде додати лише розділи **Помітні зміни** та **Що далі**.

Можете додати до приміток власний стиль — читачам приємно знати, що ми тут не самі роботи.

Також перевірте правильність URL-адрес і контрольних сум в автоматично згенерованих примітках.

Після завершення перейдіть до [випусків helm/helm](https://github.com/helm/helm/releases) на GitHub і відредагуйте примітки до випуску для створеного теґу. У полі цільової гілки вкажіть `$RELEASE_BRANCH_NAME`.

Перед публікацією варто попросити інших переглянути примітки до випуску. Надішліть запит на перевірку в [#helm-dev](https://kubernetes.slack.com/messages/C51E88VDG) — так легше помітити те, що можна було пропустити.

### 8. Підписування завантажуваних файлів ключем PGP {#8-pgp-sign-the-downloads}

Хеші дають змогу перевірити, що вміст завантажених файлів відповідає створеному вмісту, а підписані пакунки дають змогу відстежити їхнє походження.

Для цього виконайте такі команди `make`:

```shell
export VERSION="$RELEASE_NAME"
make clean		# якщо ще не виконано
make fetch-dist	# якщо ще не виконано
make sign
```

Для кожного файла, надісланого CI, буде створено файл підпису в ASCII-armored форматі.

Усі файли підписів (`*.asc`) потрібно долучити до випуску на GitHub (до бінарних файлів).

### 9. Публікація випуску {#9-publish-release}

Час офіційно опублікувати випуск!

Коли примітки до випуску збережено на GitHub, збирання CI завершено, а файли підписів додано до випуску, натисніть «Publish». Випуск буде опубліковано, позначено як «latest» і показано на головній сторінці репозиторію [helm/helm](https://github.com/helm/helm).

---

## Контрольний список патч-релізу {#patch-release-checklist}

Патч-релізи містять кілька важливих виправлень, вибраних для наявних випусків за допомогою cherry-pick. Їх випускають щомісяця; для них не потрібен цикл кандидатів у випуск, який застосовується до мінорних і основних випусків.

1. [Налаштуйте змінні середовища](#set-up-environment-variables-1)
2. [Створіть гілку випуску](#1-create-the-release-branch-1)
3. [Остаточне рішення щодо випуску](#2-finalize-the-release)
4. [Напишіть примітки до випуску](#3-write-the-release-notes)
5. [Підпишіть завантажувані файли ключем PGP](#4-pgp-sign-the-downloads)
6. [Опублікуйте випуск](#5-publish-release)

Після цього перейдіть до розділу [Дії після випуску](#post-release).

### Налаштування змінних середовища {#set-up-environment-variables-1}

```shell
export PREVIOUS_PATCH_RELEASE=vX.Y.Z
export RELEASE_NAME=vX.Y.Z+1
export RELEASE_BRANCH_NAME="release-X.Y"
```

### 1. Створення гілки випуску {#1-create-the-release-branch-1}

Спершу перейдіть до наявної гілки `release-X.Y`:

```shell
git fetch upstream
git checkout -b $RELEASE_BRANCH_NAME upstream/$RELEASE_BRANCH_NAME
```

Далі виберіть коміти, які потрібно включити до патч-релізу:

```shell
# отримайте ідентифікатори комітів для cherry-pick
git log --oneline
# застосовуйте коміти cherry-pick від найстарішого до найновішого, не включаючи коміти злиття
git cherry-pick -x <commit-id>
```

Після застосування комітів надішліть гілку випуску:

```shell
git push upstream $RELEASE_BRANCH_NAME
```

Після надсилання гілки запустяться тести. Переконайтеся, що вони пройшли, перш ніж створювати теґ. Цей новий теґ стане основою патч-релізу.

Для патч-релізів створення [віхи helm/helm](https://github.com/helm/helm/milestones) необовʼязкове.

Перш ніж продовжити, перевірте в [GitHub Actions](https://github.com/helm/helm/actions), чи випуск успішно пройшов CI.

### 2. Остаточне рішення щодо випуску {#2-finalize-the-release}

Ще раз перевірте, чи все готово, а потім надішліть теґ випуску.

```shell
git checkout $RELEASE_BRANCH_NAME
git tag --sign --annotate "${RELEASE_NAME}" --message "Helm release ${RELEASE_NAME}"
git push upstream $RELEASE_NAME
```

Переконайтеся в [GitHub Actions](https://github.com/helm/helm/actions), що випуск створено успішно. Якщо ні, виправте проблему й надішліть випуск повторно.

Збирання CI потребуватиме часу, тож поки воно триває, можна перейти до написання приміток до випуску.

### 3. Написання приміток до випуску {#3-write-the-release-notes}

Ми автоматично згенеруємо журнал змін на основі комітів, що ввійшли до циклу випуску, але для кінцевих користувачів зазвичай корисніше, коли примітки до випуску написані людиною — членом команди або маркетологом.

Для патч-релізів перелічіть виправлення та зазначте їхні прояви й те, кого вони стосуються.

У примітках до випуску мають бути зазначені версія та запланована дата наступного випуску.

Частково заповнений набір приміток до випуску разом із журналом змін можна створити такою командою:

```shell
export VERSION="$RELEASE_NAME"
export PREVIOUS_RELEASE=$PREVIOUS_PATCH_RELEASE
make clean
make fetch-dist
make release-notes
```

Так ви отримаєте добру основу приміток, до якої потрібно буде додати лише розділи **Помітні зміни** та **Що далі**.

Можете додати до приміток власний стиль — читачам приємно знати, що ми тут не самі роботи.

Також перевірте правильність URL-адрес і контрольних сум в автоматично згенерованих примітках.

Після завершення перейдіть до [випусків helm/helm](https://github.com/helm/helm/releases) на GitHub і відредагуйте примітки до випуску для створеного теґу. У полі цільової гілки вкажіть `$RELEASE_BRANCH_NAME`.

Перед публікацією варто попросити інших переглянути примітки до випуску. Надішліть запит на перевірку в [#helm-dev](https://kubernetes.slack.com/messages/C51E88VDG) — так легше помітити те, що можна було пропустити.

### 4. Підписування завантажуваних файлів ключем PGP {#4-pgp-sign-the-downloads}

Хеші дають змогу перевірити, що вміст завантажених файлів відповідає створеному вмісту, а підписані пакунки дають змогу відстежити їхнє походження.

Для цього виконайте такі команди `make`:

```shell
export VERSION="$RELEASE_NAME"
make clean		# якщо ще не виконано
make fetch-dist	# якщо ще не виконано
make sign
```

Для кожного файла, надісланого CI, буде створено файл підпису в ASCII-armored форматі.

Усі файли підписів (`*.asc`) потрібно долучити до випуску на GitHub (до бінарних файлів).

### 5. Публікація випуску {#5-publish-release}

Час офіційно опублікувати випуск!

Коли примітки до випуску збережено на GitHub, збирання CI завершено, а файли підписів додано до випуску, натисніть «Publish». Випуск буде опубліковано, позначено як «latest» і показано на головній сторінці репозиторію [helm/helm](https://github.com/helm/helm).

---

## Дії після випуску {#post-release}

Ці кроки стосуються всіх типів випусків: основних, мінорних і патч-релізів.

### Оновлення документації {#update-docs}

У спадному списку версій розділу документації на сайті [Helm](https://helm.sh/docs) указано поточну версію Helm. Її потрібно оновлювати після кожного випуску. У робочій копії репозиторію [helm-www](https://github.com/helm/helm-www) виконайте скрипт для версії, яку випускаєте:

```shell
# Для випуску Helm 4
node scripts/v4/bump-version.mjs

# Для випуску Helm 3
node scripts/v3/bump-version.mjs
```

Обидва скрипти оновлюють позначку версії у `docusaurus.config.js` та файлах перекладів для всіх мов, а також генерують документацію CLI. Скрипт для Helm 4 також повторно генерує `docs/changelog.md`. Перегляньте зміни, а потім створіть pull request.

Якщо для випуску створено [віху helm/helm](https://github.com/helm/helm/milestones), закрийте її.

Для основних і мінорних випусків також виконайте такі дії:

* Оновіть [сумісність версій](https://github.com/helm/helm-www/blob/main/docs/topics/version_skew.mdx) для цього випуску.
* Оновіть [календар випусків](https://helm.sh/calendar/release):
  * створіть запис для наступного мінорного випуску з нагадуванням на цей день о 17:00 GMT;
  * створіть запис для RC1 наступного мінорного випуску на понеділок за тиждень до запланованого випуску, з нагадуванням на цей день о 17:00 GMT.

### Повідомлення спільноти {#tell-the-community}

Вітаємо! Ви завершили роботу. Візьміть собі $DRINK_OF_CHOICE — ви на це заслужили.

Відпочивши за улюбленим напоєм, оголосіть про новий випуск у Slack і Twitter та додайте посилання на [випуск на GitHub](https://github.com/helm/helm/releases).

За бажанням напишіть допис у блозі про новий випуск і розкажіть у ньому про деякі нові функції!
