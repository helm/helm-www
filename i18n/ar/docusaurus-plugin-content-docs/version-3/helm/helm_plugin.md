

---
title: helm plugin
---
تثبيت، عرض أو إزالة إضافات Helm

### الملخص

يدير إضافات Helm على جانب العميل.

### الخيارات

-h, --help مساعدة للأمر plugin


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

* [helm](/helm/helm.md) - مدير حزم Helm لـ Kubernetes
* [helm plugin install](/helm/helm_plugin_install.md) - تثبيت إضافة أو عدة إضافات Helm
* [helm plugin list](/helm/helm_plugin_list.md) - عرض الإضافات المثبتة في Helm
* [helm plugin uninstall](/helm/helm_plugin_uninstall.md) - إزالة إضافة أو عدة إضافات Helm
* [helm plugin update](/helm/helm_plugin_update.md) - تحديث إضافة أو عدة إضافات Helm
