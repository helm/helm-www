--
title: helm template
---
عرض القوالب (templates) محليًا

### الملخص

يقوم هذا الأمر بعمل رندر (template rendering) محلي لقوالب الـ chart ويعرض الناتج.

جميع القيم التي يتم عادة استرجاعها أو الحصول عليها من الكلاستر سيتم محاكاتها محليًا.  
كما **لن يتم تنفيذ أي عمليات تحقق من جانب الخادم** (مثل التحقق من دعم API معين).

helm template [NAME] [CHART] [flags]


### الخيارات

-a, --api-versions strings نسخ API Kubernetes المستخدمة لـ Capabilities.APIVersions
--rollback-on-failure عند التفعيل: ستتم إزالة التثبيت في حال الفشل. يتم تفعيل '--wait' تلقائيًا عند استخدام هذا الخيار
--ca-file string التحقق من شهادات خوادم HTTPS باستخدام هذا الملف
--cert-file string تعريف العميل HTTPS باستخدام هذا الملف كـ شهادة SSL
--create-namespace إنشاء الـ namespace إذا لم يكن موجودًا
--dependency-update تحديث الاعتمادات المفقودة قبل تثبيت الـ chart
--description string إضافة وصف مخصص
--devel تضمين نسخ التطوير (alpha, beta, rc). يكافئ '>0.0.0-0'. يتجاهل الخيار إذا تم تحديد --version
--disable-openapi-validation تعطيل التحقق من نماذج Kubernetes عبر مخطط OpenAPI
--dry-run string[="client"] محاكاة تثبيت. باستخدام --dry-run أو --dry-run=client لن يتم الاتصال بالكلاستر.
باستخدام --dry-run=server يسمح بمحاولة الاتصال
--enable-dns تمكين استعلامات DNS أثناء الرندر
--force فرض تحديث الموارد باستخدام استراتيجية الاستبدال
-g, --generate-name توليد اسم release تلقائيًا (وتجاهل NAME)
-h, --help مساعدة لأمر template
--include-crds تضمين CRDs في مخرجات الرندر
--insecure-skip-tls-verify تخطي التحقق من TLS أثناء تحميل الـ chart
--is-upgrade ضبط .Release.IsUpgrade بدلًا من .Release.IsInstall
--key-file string تعريف العميل HTTPS باستخدام هذا المفتاح SSL
--keyring string موقع مفاتيح GPG للتحقق (افتراضي "~/.gnupg/pubring.gpg")
--kube-version string نسخة Kubernetes المستخدمة لـ Capabilities.KubeVersion
-l, --labels stringToString تسميات تُضاف إلى metadata الخاصة بالـ release
--name-template string قالب لاستخدامه كاسم للـ release
--no-hooks تعطيل تشغيل الـ hooks عند التثبيت
--output-dir string حفظ الملفات الناتجة في مجلد بدلًا من stdout
--pass-credentials تمرير بيانات الاعتماد لجميع المجالات
--password string كلمة مرور مستودع الـ chart
--plain-http استخدام HTTP غير آمن في تنزيل الـ chart
--post-renderer postRendererString مسار أداة post-render. إذا كانت في PATH يتم استخدامها مباشرة
--post-renderer-args postRendererArgsSlice وسيطات لأداة post-render (يمكن تكرارها)
--release-name استخدام اسم الـ release في مسار ملفات الإخراج
--render-subchart-notes تضمين ملاحظات الـ subcharts داخل Chart الأب
--replace إعادة استخدام اسم release محذوف سابقًا (غير موصى به للإنتاج)
--repo string رابط مستودع chart المطلوب
--set stringArray تعيين قيم من سطر الأوامر: key=val
--set-file stringArray تعيين قيم من ملفات: key=path
--set-json stringArray تعيين قيم JSON
--set-literal stringArray تعيين قيم نصية حرفية (STRING)
--set-string stringArray تعيين قيم نصية (STRING)
-s, --show-only stringArray عرض الملفات الناتجة فقط للمسارات المحددة
--skip-crds عدم تثبيت CRDs
--skip-tests استبعاد اختبارات الـ chart من الإخراج
--timeout duration المهلة لكل عملية Kubernetes (افتراضي 5m0s)
--username string اسم المستخدم لمستودع الـ chart
--validate التحقق من صحة الملفات الناتجة مقابل الكلاستر الحالي
-f, --values strings تحديد ملفات YAML أو عناوين URL كقيم
--verify التحقق من سلامة الحزمة قبل استخدامها
--version string تحديد نسخة الـ chart أو مدى إصدارات (^2.0.0 مثلاً)
--wait الانتظار حتى تكون جميع الموارد جاهزة قبل النجاح
--wait-for-jobs الانتظار لغاية اكتمال الـ Jobs عند استعمال --wait


### الخيارات الموروثة من الأوامر الرئيسية

  --burst-limit int                 حد burst للعميل (افتراضي 100)
  --debug                           تمكين مخرجات التصحيح
  --kube-apiserver string           عنوان خادم Kubernetes API
  --kube-as-group stringArray       مجموعات مستخدمة للعملية
  --kube-as-user string             المستخدم للعملية
  --kube-ca-file string             ملف CA لـ Kubernetes
  --kube-context string             سياق kubeconfig
  --kube-insecure-skip-tls-verify   تخطي التحقق من شهادة Kubernetes API (غير آمن)
  --kube-tls-server-name string     اسم الخادم للتحقق من الشهادة
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار ملف kubeconfig
-n, --namespace string الـ namespace للاستخدام
--qps float32 عدد الطلبات في الثانية لـ Kubernetes API
--registry-config string ملف إعدادات registry (افتراضي)
--repository-cache string كاش المستودعات (افتراضي)
--repository-config string ملف أسماء وروابط المستودعات (افتراضي)


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
