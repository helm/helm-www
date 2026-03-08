---
title: helm get hooks
---
-
تحميل الـ hooks لإصدار محدد

### الملخص

يقوم هذا الأمر بتحميل الـ hooks لإصدار محدد.

يتم تنسيق الـ hooks بصيغة YAML ويفصل بينها فاصل YAML `---\n`.

helm get hooks RELEASE_NAME [flags]



### الخيارات

-h, --help مساعدة لأمر get hooks
--revision int جلب الإصدار المحدد مع مراجعته


### الخيارات الموروثة من الأوامر الرئيسية


  --burst-limit int                 حد النطاق الترددي على جانب العميل (افتراضي 100)
  --debug                           تفعيل الإخراج التفصيلي
  --kube-apiserver string           عنوان ومنفذ API لخادم Kubernetes
  --kube-as-group stringArray       المجموعة المستخدمة للعملية، يمكن تكرار هذا الوسيط لتحديد عدة مجموعات
  --kube-as-user string             اسم المستخدم المستخدم للعملية
  --kube-ca-file string             ملف سلطة الشهادة للاتصال بـ API Kubernetes
  --kube-context string             اسم سياق kubeconfig المستخدم
  --kube-insecure-skip-tls-verify   إذا true، فلن يتم التحقق من شهادة خادم API Kubernetes. سيجعل الاتصالات HTTPS غير آمنة
  --kube-tls-server-name string     اسم الخادم المستخدم للتحقق من شهادة خادم API Kubernetes. إذا لم يتم توفيره، سيتم استخدام اسم جهاز العميل للاتصال بالخادم
  --kube-token string               الرمز المميز المستخدم للمصادقة
  --kubeconfig string               مسار ملف تكوين kubeconfig
-n, --namespace string مساحة الاسم المستخدمة للاستعلام
--qps float32 عدد الطلبات في الثانية المستخدمة عند الاتصال بـ API Kubernetes، بدون احتساب التفجيرات
--registry-config string مسار ملف تكوين السجل (افتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار ملف يحتوي على مؤشرات المستودع المخزنة مؤقتًا (افتراضي "~/.cache/helm/repository")
--repository-config string مسار ملف يحتوي على أسماء وعناوين URL للمستودعات (افتراضي "~/.config/helm/repositories.yaml")


### انظر أيضًا

* [helm get](/helm/helm_get.md) - تحميل المعلومات التفصيلية لإصدار محدد

