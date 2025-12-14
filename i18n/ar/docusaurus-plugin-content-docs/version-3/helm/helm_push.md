--
title: helm push
---
رفع Chart إلى مستودع بعيد

### الوصف

ينقل Chart إلى سجل (Registry) عن بُعد.  
إذا كان Chart مرتبطًا بملف إثبات المصدر (Provenance)، فسيتم نقله معه أيضًا.

helm push [chart] [remote] [flags]


### الخيارات

  --ca-file string              التحقق من شهادات HTTPS باستخدام هذا ملف CA
  --cert-file string           شهادة SSL للعميل
-h, --help مساعدة لأمر push
--insecure-skip-tls-verify تجاهل التحقق من شهادة TLS عند رفع Chart
--key-file string مفتاح SSL للعميل
--plain-http استخدام HTTP غير مشفر عند نقل Chart


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
