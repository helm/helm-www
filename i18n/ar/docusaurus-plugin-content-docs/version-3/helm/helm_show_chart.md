---
title: helm show chart
---
عرض تعريف الـ chart

### الملخص

يقوم هذا الأمر بفحص chart (مجلد، ملف أو رابط URL) ويعرض محتوى ملف Chart.yaml.

helm show chart [CHART] [flags]



### الخيارات

  --ca-file string             التحقق من شهادات الخوادم المتوافقة مع HTTPS باستخدام هذا bundle CA
  --cert-file string           تحديد هوية العميل HTTPS باستخدام هذا الملف الخاص بشهادة SSL
  --devel                      تضمين إصدارات التطوير (alpha، beta، وإصدارات المرشح). مكافئ لـ version '>0.0.0-0'. إذا تم تحديد --version، سيتم تجاهله
-h, --help مساعدة لأمر show chart
--insecure-skip-tls-verify تخطي التحقق من شهادة TLS عند نقل الـ chart
--key-file string تحديد هوية العميل HTTPS باستخدام هذا الملف الخاص بالمفتاح SSL
--keyring string موقع المفاتيح العامة المستخدم للتحقق (افتراضي "~/.gnupg/pubring.gpg")
--pass-credentials تمرير بيانات الاعتماد لجميع المجالات
--password string كلمة المرور لمستودع الـ chart المطلوب
--plain-http استخدام اتصال HTTP غير آمن لنقل الـ chart
--repo string رابط URL لمستودع الـ chart المطلوب
--username string اسم المستخدم لمستودع الـ chart المطلوب
--verify التحقق من الـ package قبل استخدامه
--version string تحديد قيد الإصدار لإصدار الـ chart المراد استخدامه. يمكن أن يكون tag محدد (مثال: 1.1.1) أو نطاق إصدار صالح (مثال: ^2.0.0). إذا لم يتم تحديده، سيتم استخدام أحدث إصدار


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

* [helm show](/helm/helm_show.md) - عرض المعلومات عن chart
