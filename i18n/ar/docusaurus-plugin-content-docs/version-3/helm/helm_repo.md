---
title: helm repo
---
إضافة، حذف، عرض، تحديث وفهرسة مستودعات Charts

### الملخص

يتكون هذا الأمر من عدة أوامر فرعية للتعامل مع مستودعات Charts.

يمكن استخدامه لإضافة، حذف، عرض وفهرسة مستودعات Charts.

### الخيارات

-h, --help مساعدة لأمر repo



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
* [helm repo add](/helm/helm_repo_add.md) - إضافة مستودع Charts
* [helm repo index](/helm/helm_repo_index.md) - إنشاء ملف index من مستودع يحتوي على Charts مجمعة
* [helm repo list](/helm/helm_repo_list.md) - عرض المستودعات
* [helm repo remove](/helm/helm_repo_remove.md) - حذف مستودع أو أكثر
* [helm repo update](/helm/helm_repo_update.md) - تحديث معلومات Charts المتاحة محليًا من المستودعات
