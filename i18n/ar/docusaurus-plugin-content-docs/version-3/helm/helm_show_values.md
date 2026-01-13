---
title: helm show values
---
عرض القيم (values) الخاصة بالـ chart

### الملخص

يقوم هذا الأمر بفحص الـ chart (مجلد، ملف أو URL) ويعرض محتوى ملف values.yaml الخاص به.

helm show values [CHART] [flags]


### الخيارات

  --ca-file string             التحقق من شهادات الخوادم المتوافقة مع HTTPS باستخدام هذا bundle من CA
  --cert-file string           تحديد العميل HTTPS باستخدام هذا ملف الشهادة SSL
  --devel                      تضمين إصدارات التطوير (alpha, beta, RC). مكافئ لـ version '>0.0.0-0'. إذا تم تحديد --version، سيتم تجاهل هذا الخيار
-h, --help مساعدة لأمر values
--insecure-skip-tls-verify تجاوز التحقق من شهادة TLS لنقل الـ chart
--jsonpath string تقديم تعبير JSONPath لتصفية المخرجات
--key-file string تحديد العميل HTTPS باستخدام هذا ملف المفتاح SSL
--keyring string مكان المفاتيح العامة للتحقق (افتراضي "~/.gnupg/pubring.gpg")
--pass-credentials تمرير بيانات الاعتماد لجميع المجالات
--password string كلمة المرور لمستودع الـ chart المطلوب
--plain-http استخدام اتصال HTTP غير آمن لنقل الـ chart
--repo string عنوان URL لمستودع الـ chart المطلوب
--username string اسم المستخدم لمستودع الـ chart المطلوب
--verify التحقق من الحزمة قبل الاستخدام
--version string تحديد قيد النسخة للـ chart المطلوب. يمكن أن يكون نسخة محددة (مثل 1.1.1) أو نطاق (مثل ^2.0.0). إذا لم يتم التحديد، ستُستخدم آخر نسخة


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
* [helm show](/helm/helm_show.md) - عرض معلومات عن الـ chart
