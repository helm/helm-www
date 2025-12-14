---
title: helm uninstall
---
إلغاء تثبيت Release

### الملخص

يأخذ هذا الأمر اسم Release ويقوم بإلغاء تثبيتها.

سيؤدي ذلك إلى حذف جميع الموارد المرتبطة بآخر إصدار من الـ chart بالإضافة إلى سجل الإصدارات، مما يحرر الاسم لاستخدام مستقبلي.

استخدم الخيار `--dry-run` لمعرفة ما سيتم إلغاء تثبيته دون تنفيذ العملية فعليًا.

helm uninstall RELEASE_NAME [...] [flags]


### الخيارات


  --cascade string       يجب أن يكون "background" أو "orphan" أو "foreground".
                         يحدد إستراتيجية حذف التبعيات (الافتراضي "background")
  --description string   إضافة وصف مخصص
  --dry-run              محاكاة عملية الإلغاء دون تنفيذها
-h, --help المساعدة لأمر uninstall
--ignore-not-found اعتبار خطأ "release not found" كنجاح في الإلغاء
--keep-history حذف جميع الموارد المرتبطة ووضع علامة على الـ release كمحذوف،
ولكن الاحتفاظ بسجل الإصدارات
--no-hooks منع hooks من العمل أثناء عملية الإلغاء
--timeout duration المهلة لكل عملية Kubernetes (مثل الـ Jobs الخاصة بالـ hooks)
(الافتراضي 5m0s)
--wait عند التفعيل، ينتظر حتى يتم حذف جميع الموارد قبل الانتهاء.
سينتظر المدة المحددة في --timeout


### الخيارات الموروثة من الأوامر الرئيسية

  --burst-limit int                 حد الانفجار للعميل (افتراضي 100)
  --debug                           تفعيل المخرجات التفصيلية
  --kube-apiserver string           عنوان خادم Kubernetes API
  --kube-as-group stringArray       مجموعة/مجموعات التنفيذ (يمكن تكرارها)
  --kube-as-user string             المستخدم المنفّذ للعملية
  --kube-ca-file string             ملف CA للاتصال بـ Kubernetes
  --kube-context string             سياق kubeconfig المستخدم
  --kube-insecure-skip-tls-verify   تجاوز التحقق من شهادة خادم Kubernetes (غير آمن)
  --kube-tls-server-name string     اسم الخادم المستخدم للتحقق من شهادة API server
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار ملف kubeconfig
-n, --namespace string الـ namespace المستخدم للطلب
--qps float32 عدد الطلبات في الثانية لـ Kubernetes API
--registry-config string مسار ملف إعدادات registry (افتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار ملفات كاش المستودعات (افتراضي "~/.cache/helm/repository")
--repository-config string مسار ملف أسماء وروابط المستودعات (افتراضي "~/.config/helm/repositories.yaml")

### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
