---
title: Перевірка випуску
description: Чеклист для супровідників при випуску нової версії Helm.
sidebar_position: 2
---

# Посібник для супровідників щодо випуску Helm

Час для нового випуску Helm! Як супровідник Helm, який випускає нову версію, ви є найкращою людиною, щоб оновити цей чеклист випуску у разі, якщо ваш досвід відрізняється від задокументованого тут.

Усі випуски будуть мати формат vX.Y.Z, де X — це основний номер версії, Y — це номер мінорної версії, а Z — це номер патч-релізу. Цей проєкт суворо дотримується [семантичного версіювання](https://semver.org/), тому дотримання цього етапу є критично важливим.

Helm заздалегідь оголошує дату свого наступного мінорного випуску. Кожне зусилля має бути спрямоване на дотримання оголошеної дати. Крім того, під час запуску процесу випуску дату наступного випуску має бути обрано, оскільки вона буде використана в процесі випуску.

Ці інструкції охоплюють початкову конфігурацію, а потім процес випуску для трьох різних типів випусків:

* Основні випуски — випускаються рідше, мають критичні зміни
* Мінорні випуски — випускаються кожні 3-4 місяці, не мають критичних змін
* Патч-релізи — випускаються щомісяця, не потребують виконання всіх кроків цього посібника

[Початкова конфігурація](#initial-configuration)

1. [Створення гілки випуску](#1-create-the-release-branch)
2. [Основні/Мінорні випуски: змініть номер версії в Git](#2-majorminor-releases-change-the-version-number-in-git)
3. [Основні/Мінорні випуски: зафіксуйте і надішліть гілку випуску](#3-majorminor-releases-commit-and-push-the-release-branch)
4. [Основні/Мінорні випуски: створіть кандидат у випуск](#4-majorminor-releases-create-a-release-candidate)
5. [Основні/Мінорні випуски: повторіть на наступних кандидатах у випуск](#5-majorminor-releases-iterate-on-successive-release-candidates)
6. [Завершення випуску](#6-finalize-the-release)
7. [Написання приміток до випуску](#7-write-the-release-notes)
8. [PGP-підписання завантажень](#8-pgp-sign-the-downloads)
9. [Публікація випуску](#9-publish-release)
10. [Оновлення документації](#10-update-docs)
11. [Оповіщення спільноти](#11-tell-the-community)

## Початкова конфігурація {#initial-configuration}

### Налаштування віддаленого репозиторію Git {#set-up-git-remote}

Важливо зазначити, що цей документ передбачає, що віддалений репозиторій у вашій копії, який відповідає <https://github.com/helm/helm>, називається "upstream". Якщо це не так (наприклад, якщо ви вирішили назвати його "origin" або щось подібне), обовʼязково змініть наведену інформацію відповідно до вашого локального середовища. Якщо ви не впевнені, як називається ваш upstream, використовуйте команду `git remote -v`, щоб дізнатися.

Якщо у вас немає [upstream remote](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork), ви можете додати його, використовуючи таку команду:

```shell
git remote add upstream git@github.com:helm/helm.git
```

### Налаштування змінних середовища {#set-up-environment-variables}

У цьому документі також буде використано кілька змінних середовища, які ви можете налаштувати для зручності. Для основних/мінорних випусків використовуйте наступне:

```shell
export RELEASE_NAME=vX.Y.0
export RELEASE_BRANCH_NAME="release-X.Y"
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.1"
```

Якщо ви створюєте патч-реліз, використовуйте наступне:

```shell
export PREVIOUS_PATCH_RELEASE=vX.Y.Z
export RELEASE_NAME=vX.Y.Z+1
export RELEASE_BRANCH_NAME="release-X.Y"
```

### Налаштування ключа підпису {#set-up-signing-key}

Ми також додамо безпеку та перевірку процесу випуску шляхом хешування бінарних файлів і надання файлів підпису. Ми виконуємо це, використовуючи [GitHub та GPG](https://help.github.com/en/articles/about-commit-signature-verification). Якщо у вас ще не налаштовано GPG, ви можете виконати такі кроки:

1. [Встановіть GPG](https://gnupg.org/index.html)
2. [Згенеруйте GPG ключ](https://help.github.com/en/articles/generating-a-new-gpg-key)
3. [Додайте ключ до облікового запису GitHub](https://help.github.com/en/articles/adding-a-new-gpg-key-to-your-github-account)
4. [Налаштуйте ключ підпису в Git](https://help.github.com/en/articles/telling-git-about-your-signing-key)

Після того, як у вас буде ключ підпису, вам потрібно додати його до файлу KEYS у кореневій теці репозиторію. Інструкції щодо додавання його до файлу KEYS містяться у файлі. Якщо ви ще не зробили цього, вам потрібно додати ваш публічний ключ до мережі keyserver. Якщо ви використовуєте GnuPG, ви можете дотримуватися [інструкцій, наданих Debian](https://debian-administration.org/article/451/Submitting_your_GPG_key_to_a_keyserver).

## 1. Створення гілки випуску {#1-create-the-release-branch}

### Основні/Мінорні випуски {#majorminor-releases}

Основні випуски включають нові функції та зміни в поведінці, *які порушують зворотну сумісність*. Мінорні випуски містять нові функції, які не порушують зворотну сумісність. Для створення основного або мінорного випуску почніть зі створення гілки `release-X.Y` від основної гілки (main).

```shell
git fetch upstream
git checkout upstream/main
git checkout -b $RELEASE_BRANCH_NAME
```

Ця нова гілка буде основою для випуску, в якій ми будемо надалі працювати.

Переконайтеся, що на GitHub існує [віха в helm/helm](https://github.com/helm/helm/milestones) для цього випуску (створіть її, за потреби). Переконайтеся, що PR та issues для цього випуску входять до цього етапу.

Для основних і мінорних випусків переходьте до кроку 2: [Основні/Мінорні випуски: зміна номеру версії в Git](#2-majorminor-releases-change-the-version-number-in-git).

### Патч-релізи {#patch-releases}

Патч-релізи включають кілька критичних виправлень для поточних випусків. Почніть зі створення гілки `release-X.Y`:

```shell
git fetch upstream
git checkout -b $RELEASE_BRANCH_NAME upstream/$RELEASE_BRANCH_NAME
```

Звідси ми можемо вибрати коміти, які хочемо включити до патч-релізу:

```shell
# отримуємо ідентифікатори комітів, які хочемо вибрати
git log --oneline
# вибираємо коміти, починаючи з найстарішого, без включення комітів злиття
git cherry-pick -x <commit-id>
```

Після вибору комітів гілку випуску потрібно надіслати у віддалений репозиторій.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

Надсилання гілки викличе запуск тестів. Переконайтеся, що вони проходять перед створенням теґу. Цей новий теґ стане основою для патч-релізу.

Створення [віхи в helm/helm](https://github.com/helm/helm/milestones) є необов’язковим для патч-релізів.

Обов’язково перевірте [GitHub Actions](https://github.com/helm/helm/actions), щоб переконатися, що випуск пройшов CI, перш ніж продовжити. Патч-релізи можуть пропустити кроки 2-5 і перейти до кроку 6 для [Завершення випуску](#6-finalize-the-release).

## 2. Основні/Мінорні випуски: Зміна номера версії в Git {#2-majorminor-releases-change-the-version-number-in-git}

При виконанні основного або мінорного випуску переконайтеся, що оновили файл `internal/version/version.go` з новою версією випуску.

```shell
$ git diff internal/version/version.go
diff --git a/internal/version/version.go b/internal/version/version.go
index 712aae64..c1ed191e 100644
--- a/internal/version/version.go
+++ b/internal/version/version.go
@@ -30,7 +30,7 @@ var (
        // Збільшіть основний номер для додавання нових функцій та змін в поведінці.
        // Збільшіть мінорний номер для виправлення помилок та підвищення продуктивності.
        // Збільшіть номер патча для критичних виправлень в поточних версіях.
-       version = "v3.3"
+       version = "v3.4"

        // metadata — це додаткові дані часу побудови
        metadata = ""
```

Окрім оновлення версії у файлі `version.go`, вам також потрібно оновити відповідні тести, що використовують цей номер версії.

* `cmd/helm/testdata/output/version.txt`
* `cmd/helm/testdata/output/version-client.txt`
* `cmd/helm/testdata/output/version-client-shorthand.txt`
* `cmd/helm/testdata/output/version-short.txt`
* `cmd/helm/testdata/output/version-template.txt`
* `pkg/chartutil/capabilities_test.go`

```shell
git add .
git commit -m "bump version to $RELEASE_NAME"
```

Це оновить версію лише для гілки $RELEASE_BRANCH_NAME. Вам також потрібно буде інтегрувати ці зміни в основну гілку, щоб підготувати її до наступного випуску, як у [цьому прикладі з 3.2 до 3.3](https://github.com/helm/helm/pull/8411/files), та додати його до віхи наступного випуску.

```shell
# отримуємо ідентифікатор останнього коміта, тобто коміт для підвищення версії
git log --format="%H" -n 1

# створюємо нову гілку від основної гілки
git checkout main
git checkout -b bump-version-<release_version>

# вибираємо коміт за допомогою ідентифікатора з першої команди
git cherry-pick -x <commit-id>

# комітимо зміни
git push origin bump-version-<release-version>
```

## 3. Основні/Мінорні випуски: Коміт та збереження гілки релізу {#3-majorminor-releases-commit-and-push-the-release-branch}

Щоб інші могли почати тестування, тепер можна надіслати гілку релізу в upstream і розпочати процес тестування.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

Переконайтеся, що перевірили [GitHub Actions](https://github.com/helm/helm/actions), щоб побачити, що реліз пройшов CI перед тим, як продовжити.

Якщо є можливість, дайте іншим перевірити гілку, перш ніж продовжувати, щоб переконатися, що всі необхідні зміни внесені та всі коміти для релізу присутні.

## 4. Основні/Мінорні випуски: Створення реліз-кандидата {#4-majorminor-releases-create-a-release-candidate}

Тепер, коли гілку релізу створено та підготовлено, настав час почати створення та ітерацію реліз-кандидатів.

```shell
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

GitHub Actions автоматично створить образ з теґом релізу та клієнтський бінарний файл для тестування.

Для тестувальників процес початку тестування після завершення побудови артефактів GitHub Actions включає наступні кроки для отримання клієнта:

Linux/amd64, використовуючи /bin/bash:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-linux-amd64.tar.gz
```

Darwin/amd64, використовуючи Terminal.app:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-darwin-amd64.tar.gz
```

Windows/amd64, використовуючи PowerShell:

```shell
PS C:\> Invoke-WebRequest -Uri "https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-windows-amd64.tar.gz" -OutFile "helm-$ReleaseCandidateName-windows-amd64.tar.gz"
```

Потім розпакуйте та перемістіть бінарний файл в теку, що знаходиться в $PATH, або перемістіть його в інше місце та додайте його до $PATH (наприклад, /usr/local/bin/helm для Linux/macOS, C:\Program Files\helm\helm.exe для Windows).

## 5. Основні/Мінорні випуски: Ітерація на наступних реліз-кандидатах {#5-majorminor-releases-iterate-on-successive-release-candidates}

Протягом кількох днів активно інвестуйте час та ресурси, щоб спробувати виявити будь-які проблеми з Helm, документуючи всі важливі висновки для релізу. Цей час слід витратити на тестування та пошук способів, у яких реліз міг би викликати проблеми з різними функціями або середовищами оновлення, а не на написання коду. У цей період реліз перебуває в стані заморожування коду, і будь-які додаткові зміни коду будуть перенесені на наступний реліз.

Протягом цієї фази гілка $RELEASE_BRANCH_NAME буде продовжувати розвиватися, оскільки ви будете створювати нові реліз-кандидати. Частота появи нових кандидатів залежить від менеджера релізу: використовуйте здоровий глузд, враховуючи серйозність виявлених проблем, доступність тестувальників та дату завершення релізу. Загалом, краще перенести реліз на пізніший термін, ніж випустити зламаний реліз.

Кожен раз, коли ви хочете створити нового реліз-кандидата, починайте з додавання комітів до гілки, використовуючи cherry-pick з main:

```shell
git cherry-pick -x <commit_id>
```

Також не забудьте надіслати гілку на GitHub та переконатися, що вона пройшла CI.

Після цього додайте теґ та повідомте користувачів про нового реліз-кандидата:

```shell
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.2"
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

Після того як теґ надіслано на GitHub, перевірте, чи успішно збирається гілка з цим тегом в CI.

Далі просто повторюйте цей процес, постійно тестуючи, поки не будете задоволені реліз-кандидатом. Для реліз-кандидата повноцінні нотатки до релізу ще не пишуться, але можна підготувати [чернетку реліз-нотаток](#7-write-the-release-notes).

## 6. Завершення релізу {#6-finalize-the-release}

Коли ви нарешті задоволені якістю реліз-кандидата, можна переходити до створення остаточного релізу. Перевірте ще раз, чи все в порядку, а потім надішліть теґ релізу.

```shell
git checkout $RELEASE_BRANCH_NAME
git tag --sign --annotate "${RELEASE_NAME}" --message "Helm release ${RELEASE_NAME}"
git push upstream $RELEASE_NAME
```

Переконайтеся, що реліз успішно пройшов на [GitHub Actions](https://github.com/helm/helm/actions). Якщо ні, вам доведеться виправити помилки та знову надіслати реліз.

Оскільки CI-завдання займе деякий час для виконання, ви можете перейти до написання реліз-нотаток, поки процес триває.

## 7. Написання реліз-нотаток {#7-write-the-release-notes}

Ми автоматично створимо лог змін на основі комітів, які відбулися протягом циклу випуску, але для кінцевого користувача зазвичай корисніше, якщо реліз-нотатки будуть написані вручну людиною або командою маркетингу.

Якщо ви випускаєте мажорний або мінорний реліз, достатньо перерахувати помітні зміни, що впливають на користувачів. Для патч-релізів зробіть те саме, але також зазначте симптоми та на кого вони впливають.

Реліз-нотатки повинні містити версію та заплановану дату наступного релізу.

Приклад реліз-нотаток для мінорного релізу (переклад дано для наочності):

```markdown
## vX.Y.Z

Helm vX.Y.Z — це реліз з новими функціями. Цього разу ми зосередилися на <вставте ключову тезу>. Користувачам рекомендується оновитися щоб мати найкращий досвід.

Спільнота продовжує зростати, і ми були б раді бачити вас серед нас!

- Приєднуйтеся до обговорення в [Kubernetes Slack](https://kubernetes.slack.com):
  - `#helm-users` для запитань і просто для спілкування
  - `#helm-dev` для обговорення PR, коду та багів
- Відвідайте публічну зустріч розробників: щочетверга, 9:30 за тихоокеанським часом в [Zoom](https://zoom.us/j/696660622)
- Тестуйте, налагоджуйте та робіть свій внесок у чарти: [Artifact Hub helm charts](https://artifacthub.io/packages/search?kind=0)

## Важливі зміни

- Додано підтримку Kubernetes 1.16, включаючи нові apiVersions для маніфестів.
- Оновлено Sprig до версії 2.22.

## Встановлення та оновлення

Завантажте Helm X.Y.Z. Бінарні файли для загальних платформ тут:

- [MacOS amd64](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux amd64](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux arm](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz.sha256) / CHECKSUM_VAL)
- [Linux arm64](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux i386](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz.sha256) / CHECKSUM_VAL)
- [Linux ppc64le](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux s390x](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Windows amd64](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip) ([checksum](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip.sha256sum) / CHECKSUM_VAL)

[Короткий посібник з налаштування](/intro/quickstart.md) допоможе вам розпочати роботу. Для інструкцій з оновлення або детальних нотаток з встановлення перегляньте [посібник з встановлення](/intro/install.md). Ви також можете використовувати [скрипт для встановлення](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3) на будь-якій системі з `bash`.

## Що далі

- vX.Y.Z+1 міститиме лише виправлення багів і планується на <вставте ДАТУ>.
- vX.Y+1.0 — це наступний реліз з новими функціями, який планується на <вставте ДАТУ>. Цей реліз буде зосереджений на ...

## Лог змін

- chore(*): bump version to v2.7.0 08c1144f5eb3e3b636d9775617287cc26e53dba4 (Adam Reese)
- fix circle not building tags f4f932fabd197f7e6d608c8672b33a483b4b76fa (Matthew Fisher)
```

Частково заповнений набір реліз-нотаток, включаючи лог змін, можна створити за допомогою наступної команди:

```shell
export VERSION="$RELEASE_NAME"
export PREVIOUS_RELEASE=vX.Y.Z
make clean
make fetch-dist
make release-notes
```

Це створить гарну базову версію реліз-нотаток, до яких вам потрібно буде лише додати розділи **Важливі зміни** та **Що далі**.

Не соромтеся додавати свій стиль до реліз-нотаток; людям приємно думати, що ми не всі тут роботи.

Ви також повинні переконатися, що URL-адреси та контрольні суми правильні в автоматично згенерованих реліз-нотатках.

Після завершення перейдіть до [helm/helm releases](https://github.com/helm/helm/releases) на GitHub і відредагуйте реліз-нотатки для теґу релізу за допомогою написаних тут нотаток. Для цільової гілки встановіть $RELEASE_BRANCH_NAME.

На цьому етапі варто залучити інших людей для перегляду реліз-нотаток перед публікацією релізу. Надішліть запит у [#helm-dev](https://kubernetes.slack.com/messages/C51E88VDG) для перегляду. Це завжди корисно, оскільки легко щось пропустити.

## 8. PGP Підпис файлів для завантаження {#8-pgp-sign-the-downloads}

Хоча хеші забезпечують підпис, що вміст завантажуваних файлів відповідає тому, що було згенеровано, підписані пакунки забезпечують простежуваність походження пакунка.

Щоб це зробити, виконайте наступні команди `make`:

```shell
export VERSION="$RELEASE_NAME"
make clean		# якщо ще не виконано
make fetch-dist	# якщо ще не виконано
make sign
```

Це створить файли підписів у форматі ascii armored для кожного з файлів, завантажених CI.

Усі файли підписів (`*.asc`) необхідно завантажити до релізу на GitHub (додати до бінарних файлів).

## 9. Оприлюднення релізу {#9-publish-release}

Час зробити реліз офіційним!

Після того, як реліз-нотатки збережено на GitHub, завершено збірку CI та додано файли підписів до релізу, можна натиснути "Publish" на сторінці релізу. Це опублікує реліз, позначивши його як "latest" (останній) та покаже його на головній сторінці репозиторію [helm/helm](https://github.com/helm/helm).

## 10. Оновлення документації {#10-update-docs}

Розділ документації на сайті [Helm](/docs) містить версії Helm. Необхідно оновити на сайті версії для major, minor і patch. Також потрібно оновити дату наступного minor релізу.

Щоб це зробити, створіть pull request в репозиторії [helm-www](https://github.com/helm/helm-www). У файлі `config.toml` знайдіть відповідний розділ `params.versions` та оновіть версію Helm, як у цьому прикладі [оновлення поточної версії](https://github.com/helm/helm-www/pull/676/files). У тому ж файлі `config.toml` оновіть розділ `params.nextversion`.

Закрийте [milestone](https://github.com/helm/helm/milestones) для релізу, якщо це прийнятно.

Оновіть [version skew](https://github.com/helm/helm-www/blob/main/content/en/docs/topics/version_skew.md) для major і minor релізів.

Оновіть календар релізів [тут](https://helm.sh/calendar/release):
* створіть запис для наступного minor релізу з нагадуванням на цей день о 17:00 GMT
* створіть запис для RC1 наступного minor релізу в понеділок тижня перед запланованим релізом, з нагадуванням на цей день о 17:00 GMT

## 11. Сповістіть спільноту {#11-tell-the-community}

Вітаємо! Ви закінчили. Візьміть собі $DRINK_OF_CHOICE. Ви цього заслуговуєте.

Після того, як насолодитеся своїм $DRINK_OF_CHOICE, повідомте про новий реліз у Slack та Twitter з посиланням на [реліз на GitHub](https://github.com/helm/helm/releases).

Опційно, напишіть блог пост про новий реліз і покажіть деякі з нових функцій там!
