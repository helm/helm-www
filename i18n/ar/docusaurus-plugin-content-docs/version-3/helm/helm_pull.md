--
title: helm pull
---
تحميل Chart من مستودع وتفكيكه (اختياريًا) في مجلد محلي

### الوصف

يقوم هذا الأمر بجلب حزمة Chart من مستودع وتحميلها محليًا.  
يُستخدم هذا عادةً لاستعراض الحزم، تعديلها، أو إعادة تغليفها. كما يمكن استخدامه للتحقق من صحة Chart عبر التحقق التشفيري قبل التثبيت.

هناك خيار لتفكيك Chart بعد تحميله، مما سيؤدي إلى إنشاء مجلد باسم Chart وفك الضغط بداخله.

إذا تم تحديد الخيار `--verify`، يجب أن يحتوي Chart على ملف إثبات المصدر ويجب أن يجتاز عملية التحقق، وإلا سيفشل التحميل ولن يُحفظ محليًا.

helm pull [chart URL | repo/chartname] [...] [flags]



### الخيارات


  --ca-file string             التحقق من شهادات HTTPS باستخدام هذا ملف CA
  --cert-file string           شهادة SSL للعميل
-d, --destination string مكان حفظ Chart (افتراضي ".")
--devel استخدام النسخ التجريبية أيضًا. مكافئ لـ '>0.0.0-0'. إذا تم تحديد --version، سيتم تجاهله
-h, --help مساعدة لأمر pull
--insecure-skip-tls-verify تجاهل التحقق من شهادة TLS عند تحميل Chart
--key-file string مفتاح SSL للعميل
--keyring string مسار مفتاح التحقق العام (افتراضي "~/.gnupg/pubring.gpg")
--pass-credentials تمرير بيانات الاعتماد لكل المجالات
--password string كلمة مرور المستودع
--plain-http استخدام HTTP غير مشفر
--prov تحميل ملف إثبات المصدر بدون التحقق
--repo string عنوان URL لمستودع Chart
--untar إذا تم تفعيله، يتم فك ضغط Chart بعد التحميل
--untardir string إذا تم تفعيل untar، يحدد المجلد الذي سيُفك فيه Chart (افتراضي ".")
--username string اسم المستخدم للمستودع
--verify التحقق من الحزمة قبل استخدامها
--version string تحديد إصدار Chart أو نطاق الإصدارات (مثال: 1.1.1 أو ^2.0.0). إذا لم يُحدد، سيستخدم أحدث إصدار



### الخيارات الموروثة من الأوامر الرئيسية


  --burst-limit int                 حد burst على جانب العميل (افتراضي 100)
  --debug                           تفعيل الإخراج التفصيلي
  --kube-apiserver string           عنوان ومنفذ API لخادم Kubernetes
  --kube-as-group stringArray       المجموعات المستخدمة للعملية (يمكن تكرار الخيار)
  --kube-as-user string             اسم المستخدم للعملية
  --kube-ca-file string             ملف سلطة الشهادة للاتصال بـ API Kubernetes
  --kube-context string             اسم سياق kubeconfig للاستخدام
  --kube-insecure-skip-tls-verify   تجاهل التحقق من شهادة API Kubernetes (غير آمن)
  --kube-tls-server-name string     اسم الخادم للتحقق من شهادة API Kubernetes
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار ملف kubeconfig
-n, --namespace string مساحة الاسم للاستخدام
--qps float32 عدد الطلبات في الثانية عند التواصل مع API Kubernetes، بدون احتساب bursting
--registry-config string مسار ملف إعدادات السجل (افتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار كاش المستودع (افتراضي "~/.cache/helm/repository")
--repository-config string مسار إعدادات المستودع (افتراضي "~/.config/helm/repositories.yaml")


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
