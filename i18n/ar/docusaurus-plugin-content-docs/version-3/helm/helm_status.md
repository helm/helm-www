---
title: helm status
---
عرض حالة الإصدار (release) المسمى

### الملخص

يعرض هذا الأمر حالة إصدار (release) معين.  
يتكون الحالة من:
- توقيت آخر نشر (last deployment)
- مساحة الاسم (namespace) في Kubernetes التي تتواجد فيها الـ release
- حالة الـ release (قد تكون: unknown, deployed, uninstalled, superseded, failed, uninstalling, pending-install, pending-upgrade, أو pending-rollback)
- رقم الإصدار (revision) للـ release
- وصف الـ release (قد يكون رسالة إضافية أو رسالة خطأ، يتطلب تفعيل `--show-desc`)
- قائمة الموارد (resources) التي تتكون منها هذه الـ release (يتطلب تفعيل `--show-resources`)
- تفاصيل آخر تنفيذ لمجموعة الاختبارات، إذا كانت متاحة
- ملاحظات إضافية مقدمة من الـ chart

helm status RELEASE_NAME [flags]

### الخيارات

-h, --help مساعدة لأمر status
-o, --output format عرض الإخراج بالشكل المحدد. القيم المسموح بها: table, json, yaml (افتراضي table)
--revision int إذا تم تحديده، يعرض حالة الـ release المسمى للنسخة المحددة
--show-desc إذا تم تحديده، يعرض وصف الـ release المسمى
--show-resources إذا تم تحديده، يعرض الموارد الخاصة بالـ release المسمى

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
