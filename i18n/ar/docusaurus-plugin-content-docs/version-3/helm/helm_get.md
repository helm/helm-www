
---
title: helm get
---

تحميل المعلومات التفصيلية لإصدار محدد

### الملخص

يتكون هذا الأمر من عدة أوامر فرعية يمكن استخدامها للحصول على معلومات تفصيلية حول الإصدار، بما في ذلك:

- القيم المستخدمة لإنشاء الإصدار
- ملف الـ manifest الناتج
- الملاحظات (notes) المقدمة من chart لإصدار معين
- الـ hooks المرتبطة بالإصدار
- البيانات الوصفية (metadata) للإصدار

### الخيارات

-h, --help مساعدة لأمر get


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

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
* [helm get all](/helm/helm_get_all.md) - تحميل جميع المعلومات لإصدار محدد
* [helm get hooks](/helm/helm_get_hooks.md) - تحميل جميع الـ hooks لإصدار محدد
* [helm get manifest](/helm/helm_get_manifest.md) - تحميل الـ manifest لإصدار محدد
* [helm get metadata](/helm/helm_get_metadata.md) - جلب البيانات الوصفية لإصدار محدد
* [helm get notes](/helm/helm_get_notes.md) - تحميل الملاحظات لإصدار محدد
* [helm get values](/helm/helm_get_values.md) - تحميل ملف القيم لإصدار محدد
