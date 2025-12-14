---
title: helm search repo
---
البحث عن كلمة مفتاحية في مستودعات الـ charts

### الملخص

يقوم البحث بتصفح جميع المستودعات المكوّنة على النظام والبحث عن التطابقات.  
يعتمد البحث في هذه المستودعات على البيانات الوصفية المخزنة على النظام.

سيعرض البحث أحدث الإصدارات المستقرة للـ charts التي تم العثور عليها.  
إذا قمت بتحديد الخيار `--devel`، فسيشمل ذلك الإصدارات التجريبية.  
لاستخدام قيد إصدار محدد، استخدم الخيار `--version`.

أمثلة:

    # البحث عن الإصدارات المستقرة التي تطابق الكلمة المفتاحية "nginx"
    $ helm search repo nginx

    # البحث عن الإصدارات التي تطابق الكلمة المفتاحية "nginx"، بما في ذلك الإصدارات التجريبية
    $ helm search repo nginx --devel

    # البحث عن أحدث الإصدارات المستقرة لـ nginx-ingress بإصدار رئيسي 1
    $ helm search repo nginx-ingress --version ^1.0.0

تُدار المستودعات باستخدام الأمر `helm repo`.

helm search repo [keyword] [flags]



### الخيارات

             تضمين إصدارات التطوير (alpha، beta، وإصدارات المرشح). مكافئ لـ version '>0.0.0-0'. إذا تم تحديد --version، سيتم تجاهله
  --fail-on-no-result    تفشل العملية إذا لم يتم العثور على أي نتيجة
-h, --help مساعدة لأمر repo
--max-col-width uint الحد الأقصى لعرض الأعمدة في جدول الإخراج (افتراضي 50)
-o, --output format عرض الإخراج بالتنسيق المحدد. القيم المسموح بها: table، json، yaml (افتراضي table)
-r, --regexp استخدام التعبيرات النمطية للبحث في المستودعات التي أضفتها
--version string استخدام قيد إصدار معنوي على المستودعات التي أضفتها
-l, --versions عرض قائمة طويلة، مع كل إصدار لكل chart في سطر منفصل، للمستودعات التي أضفتها



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

* [helm search](/helm/helm_search.md) - البحث عن كلمة مفتاحية في الـ charts
