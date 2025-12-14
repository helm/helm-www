---
title: helm search
---
البحث عن كلمة مفتاحية في الـ charts

### الملخص

أمر search يتيح إمكانية البحث عن charts Helm في أماكن مختلفة حيث يمكن تخزينها، بما في ذلك Artifact Hub والمستودعات التي قمت بإضافتها.  
استخدم الأوامر الفرعية الخاصة بـ search للبحث عن charts في أماكن مختلفة.

### الخيارات

-h, --help مساعدة لأمر search


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
* [helm search hub](/helm/helm_search_hub.md) - البحث عن charts في Artifact Hub أو في نسختك الخاصة من الـ Hub
* [helm search repo](/helm/helm_search_repo.md) - البحث عن كلمة مفتاحية في الـ charts ضمن المستودعات
