--
title: helm history
---
جلب تاريخ الإصدارات

### الملخص

يعرض هذا الأمر تاريخ المراجعات لإصدار محدد.

الحد الأقصى الافتراضي هو 256 مراجعة. يحدد الوسيط `--max` الطول الأقصى لقائمة المراجعات المعروضة.

يتم عرض تاريخ الإصدار على شكل جدول، مثال:

    $ helm history angry-bird
    REVISION    UPDATED                     STATUS          CHART             APP VERSION     DESCRIPTION
    1           Mon Oct 3 10:15:13 2016     superseded      alpine-0.1.0      1.0             التثبيت الأولي
    2           Mon Oct 3 10:15:13 2016     superseded      alpine-0.1.0      1.0             تم الترقية بنجاح
    3           Mon Oct 3 10:15:13 2016     superseded      alpine-0.1.0      1.0             العودة إلى الإصدار 2
    4           Mon Oct 3 10:15:13 2016     deployed        alpine-0.1.0      1.0             تم الترقية بنجاح


helm history RELEASE_NAME [flags]



### الخيارات

-h, --help مساعدة لأمر history
--max int الحد الأقصى لعدد المراجعات لعرضها في التاريخ (افتراضي 256)
-o, --output format عرض المخرجات بصيغة محددة. القيم الممكنة: table، json، yaml (افتراضي table)

shell
Copy code

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

* [helm](/helm/helm.md) - مدير
