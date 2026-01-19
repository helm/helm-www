---
title: helm upgrade
---
ترقية Release

### الملخص

يقوم هذا الأمر بترقية Release إلى إصدار جديد من الـ chart.

يأخذ هذا الأمر Release و chart. يمكن أن يكون معامل `CHART` إما مرجع chart مثل (`example/mariadb`)، أو مسارًا لمجلد chart، أو chart مُعبّأ، أو عنوان URL كامل. بالنسبة لمراجع charts، سيتم اختيار أحدث إصدار ما لم يتم تحديد الخيار `--version`.

لاستبدال القيم داخل chart، استخدم الخيار `--values` لتحديد ملف YAML، أو استخدم `--set` لتحديد القيم من خلال سطر الأوامر. ولإجبار معالجة القيم كسلاسل نصية، استخدم `--set-string`. يمكنك كذلك استخدام `--set-file` لتحديد القيم المخزنة في ملفات—مفيد عندما تكون القيم كبيرة أو يتم توليدها ديناميكيًا. كما يمكنك استخدام `--set-json` لتحديد قيم JSON (كائنات/مصفوفات/قيَم بسيطة) عبر سطر الأوامر.

يمكنك استخدام `--values` / `-f` عدة مرات، مع إعطاء الأولوية لآخر ملف (أقصى اليمين).  
مثال: إذا احتوى `myvalues.yaml` و `override.yaml` على المفتاح نفسه 'Test'، فستكون القيمة من `override.yaml` هي المعتمدة:

$ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis


يمكنك استخدام `--set` عدة مرات، والأولوية دائمًا لآخر قيمة.  
مثال: إذا عيّنت القيم 'bar' ثم 'newbar' للمفتاح نفسه، ستكون القيمة النهائية 'newbar':

$ helm upgrade --set foo=bar --set foo=newbar redis ./redis



يمكنك أيضًا استبدال قيم Release موجودة باستخدام الخيار `--reuse-values`.  
يجب تحديد معاملي `RELEASE` و `CHART`، وستتم مزامجة القيم الحالية مع القيم المحددة عبر `--values` / `-f` أو `--set`، مع إعطاء الأولوية للقيم الجديدة.

$ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis




helm upgrade [RELEASE] [CHART] [flags]



### الخيارات

  --rollback-on-failure                        عند التفعيل، سيقوم معالج التثبيت بحذف التثبيت إذا فشل. يتم تفعيل --wait تلقائيًا
  --ca-file string                             التحقق من شهادات خوادم HTTPS باستخدام ملف CA
  --cert-file string                           تحديد شهادة SSL للعميل
  --cleanup-on-fail                            السماح بحذف الموارد الجديدة التي تم إنشاؤها عند فشل الترقية
  --create-namespace                           عند استخدام --install، إنشاء الـ namespace إذا لم يكن موجودًا
  --dependency-update                          تحديث التبعيات في حال كانت مفقودة قبل التثبيت
  --description string                         إضافة وصف مخصص
  --devel                                      تضمين إصدارات التطوير. مكافئ لـ '>0.0.0-0'
  --disable-openapi-validation                 تعطيل التحقق من مخططات Kubernetes أثناء الترقية
  --dry-run string[="client"]                  محاكاة عملية التثبيت.  
                                               client: لا اتصال بالـ cluster  
                                               server: السماح بالاتصال بالـ cluster
  --enable-dns                                 تفعيل عمليات DNS أثناء التصيير
  --force                                      فرض تحديث الموارد باستخدام استراتيجية الاستبدال
-h, --help المساعدة لأمر upgrade
--history-max int الحد الأقصى لعدد النسخ المحفوظة من الإصدار (الافتراضي 10)
--insecure-skip-tls-verify تجاوز فحص TLS عند جلب الـ chart
-i, --install تثبيت release جديد إذا لم يكن موجودًا
--key-file string تحديد مفتاح SSL الخاص بالعميل
--keyring string موقع مفاتيح التحقق (افتراضي "~/.gnupg/pubring.gpg")
-l, --labels stringToString إضافة ملصقات إلى بيانات الـ release
--no-hooks تعطيل hooks أثناء عملية التثبيت/الترقية
-o, --output format تحديد تنسيق الإخراج: table, json, yaml
--pass-credentials تمرير بيانات الاعتماد لجميع النطاقات
--password string كلمة مرور مستودع الـ chart
--plain-http استخدام HTTP بدلاً من HTTPS
--post-renderer postRendererString مسار برنامج post-render
--post-renderer-args postRendererArgsSlice وسائط إضافية لبرنامج post-render
--render-subchart-notes تضمين ملاحظات الـ subcharts
--repo string رابط مستودع الـ chart
--reset-then-reuse-values إعادة تعيين القيم ثم إعادة دمج قيم الإصدار السابق والقيم الجديدة
--reset-values إعادة تعيين القيم إلى القيم الافتراضية في الـ chart
--reuse-values إعادة استخدام قيم الإصدار السابق ثم دمج القيم الجديدة
--set stringArray تعيين قيم عبر سطر الأوامر
--set-file stringArray تعيين قيم من ملفات
--set-json stringArray تعيين قيم JSON عبر سطر الأوامر
--set-literal stringArray تعيين قيم نصية حرفية
--set-string stringArray تعيين قيم نصية عبر سطر الأوامر
--skip-crds عدم تثبيت CRDs
--timeout duration مدة الانتظار لكل عملية Kubernetes (افتراضي 5m0s)
--username string اسم المستخدم لمستودع chart
-f, --values strings تحديد ملفات YAML أو روابط URL للقيم
--verify التحقق من حزمة chart قبل استخدامها
--version string تحديد إصدار chart أو نطاق إصدار
--wait انتظار جاهزية جميع الموارد قبل اعتبار الترقية ناجحة
--wait-for-jobs انتظار اكتمال جميع الـ Jobs عند تفعيل --wait


### الخيارات الموروثة من الأوامر الرئيسية

  --burst-limit int                 حد الانفجار للعميل (افتراضي 100)
  --debug                           تفعيل مخرجات التصحيح
  --kube-apiserver string           عنوان خادم Kubernetes API
  --kube-as-group stringArray       تحديد مجموعات التنفيذ
  --kube-as-user string             المستخدم المنفّذ
  --kube-ca-file string             ملف CA للاتصال بـ Kubernetes
  --kube-context string             سياق kubeconfig
  --kube-insecure-skip-tls-verify   تجاوز التحقق من شهادة Kubernetes API (غير آمن)
  --kube-tls-server-name string     اسم الخادم للتحقق من شهادة API
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار ملف kubeconfig
-n, --namespace string الـ namespace المستخدم
--qps float32 عدد الطلبات في الثانية للـ API
--registry-config string إعدادات registry
--repository-cache string كاش المستودعات
--repository-config string ملف إعدادات المستودعات


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
