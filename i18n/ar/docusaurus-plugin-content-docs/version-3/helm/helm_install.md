---
title: helm install
---
تثبيت Chart

### الملخص

يقوم هذا الأمر بتثبيت أرشيف Chart.

يجب أن يكون وسيط التثبيت إما مرجعًا للـ Chart، أو مسارًا إلى Chart مضغوط، أو مسارًا إلى Chart مفكوك، أو URL.

لتجاوز القيم داخل Chart، استخدم إما الوسيط `--values` مع تمرير ملف، أو استخدم `--set` مع تمرير القيم من سطر الأوامر. لتحديد قيمة كسلسلة نصية، استخدم `--set-string`. يمكن أيضًا استخدام `--set-file` لتحديد القيم من ملف عندما تكون القيم طويلة جدًا أو مُنشأة ديناميكيًا، أو `--set-json` لتحديد القيم بصيغة JSON (scalars/objects/arrays) من سطر الأوامر.

مثال:

    $ helm install -f myvalues.yaml myredis ./redis

أو

    $ helm install --set name=prod myredis ./redis

أو

    $ helm install --set-string long_int=1234567890 myredis ./redis

أو

    $ helm install --set-file my_script=dothings.sh myredis ./redis

أو

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis

يمكنك استخدام `--values` (أو اختصاره `-f`) عدة مرات، وسيتم إعطاء الأولوية لآخر ملف محدد (أقصى اليمين). على سبيل المثال، إذا احتوى `myvalues.yaml` و `override.yaml` على مفتاح باسم 'Test'، فإن القيمة الموجودة في `override.yaml` لها الأولوية:

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

يمكنك أيضًا استخدام `--set` عدة مرات، وسيتم إعطاء الأولوية لآخر قيمة محددة:

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

وبالمثل مع JSON:

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

أو

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

للتحقق من المانيفستات الناتجة دون تثبيت Chart، يمكن الجمع بين `--debug` و `--dry-run`.

إذا تم استخدام `--verify`، يجب أن يحتوي الـ Chart على ملف توقيع، ويجب أن يمر بالتحقق.

هناك ست طرق مختلفة لتحديد الـ Chart الذي تريد تثبيته:

1. عبر مرجع Chart: `helm install mymaria example/mariadb`
2. عبر مسار إلى Chart مضغوط: `helm install mynginx ./nginx-1.2.3.tgz`
3. عبر مسار إلى Chart مفكوك: `helm install mynginx ./nginx`
4. عبر URL كامل: `helm install mynginx https://example.com/charts/nginx-1.2.3.tgz`
5. عبر مرجع Chart و URL للمستودع: `helm install --repo https://example.com/charts/ mynginx nginx`
6. عبر سجل OCI: `helm install mynginx --version 1.2.3 oci://example.com/charts/nginx`

#### مراجع Charts

مرجع Chart هو وسيلة سهلة للإشارة إلى Chart في مستودع Charts.

عند استخدام مرجع Chart مع بادئة المستودع ('example/mariadb')، سيبحث Helm في التكوين المحلي عن مستودع باسم 'example' ثم عن Chart باسم 'mariadb' في ذلك المستودع. سيتم تثبيت آخر نسخة مستقرة إلا إذا استخدمت `--devel` لتضمين النسخ التطويرية، أو حددت نسخة معينة باستخدام `--version`.

لقائمة المستودعات، استخدم: `helm repo list`. للبحث عن Chart في مستودع، استخدم: `helm search`.

helm install [NAME] [CHART] [flags]



### الخيارات


  --rollback-on-failure                        إذا تم التحديد، سيتم التراجع عن التثبيت في حالة الفشل. سيتم تعيين --wait تلقائيًا
  --ca-file string                             التحقق من شهادات الخادم باستخدام هذا الملف
  --cert-file string                           تعريف العميل باستخدام ملف الشهادة SSL
  --create-namespace                           إنشاء الـ namespace إذا لم يكن موجودًا
  --dependency-update                          تحديث التبعيات المفقودة قبل تثبيت Chart
  --description string                         إضافة وصف مخصص
  --devel                                      تضمين النسخ التطويرية أيضًا
  --disable-openapi-validation                 تعطيل التحقق من صحة النماذج ضد مخطط OpenAPI
  --dry-run string[="client"]                  محاكاة التثبيت دون تنفيذ فعلي
  --enable-dns                                 تمكين البحث DNS أثناء إنشاء النماذج
  --force                                      فرض تحديث الموارد باستخدام استراتيجية الاستبدال
-g, --generate-name إنشاء اسم تلقائي (يتجاهل NAME)
-h, --help مساعدة أمر install
--insecure-skip-tls-verify تجاهل التحقق من TLS
--key-file string تعريف العميل باستخدام مفتاح SSL
--keyring string مسار مفاتيح التحقق (افتراضي "~/.gnupg/pubring.gpg")
-l, --labels stringToString إضافة تسميات للنسخة المنشورة (افتراضي [])
--name-template string قالب لتسمية النسخة
--no-hooks تعطيل Hooks أثناء التثبيت
-o, --output format عرض المخرجات بصيغة محددة (table, json, yaml)
--pass-credentials تمرير بيانات الاعتماد لجميع المستودعات
--password string كلمة مرور المستودع
--plain-http استخدام HTTP غير آمن للتنزيل
--post-renderer postRendererString مسار برنامج للتعديل بعد التثبيت
--post-renderer-args postRendererArgsSlice وسيطات للبرنامج بعد التثبيت
--render-subchart-notes إنشاء ملاحظات Subchart مع الـ Chart الرئيسي
--replace إعادة استخدام الاسم إذا كان مرتبطًا بإصدار محذوف
--repo string URL مستودع Chart
--set stringArray تعيين قيم من سطر الأوامر
--set-file stringArray تعيين قيم من ملفات
--set-json stringArray تعيين قيم بصيغة JSON
--set-literal stringArray تعيين قيمة نصية مباشرة
--set-string stringArray تعيين قيم كسلسلة نصية
--skip-crds عدم تثبيت CRDs
--timeout duration وقت الانتظار للعمليات (افتراضي 5m0s)
--username string اسم المستخدم للمستودع
-f, --values strings تحديد ملفات YAML للقيم
--verify التحقق من حزمة Chart قبل الاستخدام
--version string تحديد نسخة Chart أو نطاق النسخ
--wait الانتظار حتى تكون الموارد جاهزة قبل الإشارة إلى النجاح
--wait-for-jobs الانتظار حتى انتهاء جميع الـ Jobs عند استخدام --wait



### الخيارات الموروثة من الأوامر الرئيسية


  --burst-limit int                 حد النطاق الترددي على جانب العميل (افتراضي 100)
  --debug                           تفعيل الإخراج التفصيلي
  --kube-apiserver string           عنوان ومنفذ API لخادم Kubernetes
  --kube-as-group stringArray       المجموعة المستخدمة للعملية
  --kube-as-user string             اسم المستخدم للعملية
  --kube-ca-file string             ملف سلطة الشهادة
  --kube-context string             سياق kubeconfig
  --kube-insecure-skip-tls-verify   تجاهل التحقق من شهادة API Kubernetes
  --kube-tls-server-name string     اسم الخادم للتحقق من الشهادة
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار kubeconfig
-n, --namespace string مساحة الاسم
--qps float32 عدد الطلبات في الثانية
--registry-config string مسار ملف تكوين السجل
--repository-cache string مسار التخزين المؤقت للمستودعات
--repository-config string مسار ملف أسماء وعناوين المستودعات



### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes






