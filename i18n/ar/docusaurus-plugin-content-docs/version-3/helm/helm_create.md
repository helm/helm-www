
---
title: helm create
---

إنشاء مخطط جديد بالاسم المحدد

### الملخص

تقوم هذه الأوامر بإنشاء مجلد chart بالإضافة إلى الملفات والمجلدات الشائعة المستخدمة في المخطط.

على سبيل المثال، `helm create foo` سيقوم بإنشاء بنية مجلد تشبه ما يلي:

foo/
├── .helmignore # يحتوي على القوالب التي يجب تجاهلها عند حزم المخططات Helm
├── Chart.yaml # معلومات حول المخطط الخاص بك
├── values.yaml # القيم الافتراضية للقوالب الخاصة بك
├── charts/ # المخططات التي يعتمد عليها مخططك
└── templates/ # ملفات القوالب
└── tests/ # ملفات الاختبار


`helm create` يأخذ مسارًا كوسيط. إذا لم يكن مجلد المسار موجودًا، سيحاول Helm إنشاؤه تلقائيًا.  
إذا كان مسار الوجهة موجودًا وبه ملفات، فسيتم استبدال الملفات المتضاربة، بينما ستبقى الملفات الأخرى كما هي.

helm create NAME [flags]



### الخيارات

-h, --help المساعدة الخاصة بالأمر create
-p, --starter string اسم أو المسار المطلق لمجلد بدء Helm

shell
Copy code

### الخيارات الموروثة من الأوامر الأم


  --burst-limit int                 حد عرض النطاق الترددي من جانب العميل (افتراضي 100)
  --debug                           تفعيل الإخراج التفصيلي
  --kube-apiserver string           عنوان ومنفذ واجهة برمجة التطبيقات لخادم Kubernetes
  --kube-as-group stringArray       المجموعة المستخدمة للعملية، يمكن تكرار هذا الوسيط لتحديد عدة مجموعات
  --kube-as-user string             اسم المستخدم المستخدم للعملية
  --kube-ca-file string             ملف سلطة الشهادة للاتصال بواجهة برمجة تطبيقات Kubernetes
  --kube-context string             اسم سياق kubeconfig المستخدم
  --kube-insecure-skip-tls-verify   إذا كانت القيمة true، فلن يتم التحقق من شهادة خادم Kubernetes. هذا يجعل الاتصال عبر HTTPS غير آمن
  --kube-tls-server-name string     اسم الخادم للتحقق من شهادة خادم Kubernetes. إذا لم يُقدم، سيتم استخدام اسم الجهاز العميل للاتصال بالخادم
  --kube-token string               الرمز المستخدم للمصادقة
  --kubeconfig string               مسار ملف تكوين kubeconfig
-n, --namespace string مساحة الاسم المستخدمة للطلب
--qps float32 عدد الطلبات في الثانية المستخدمة عند الاتصال بواجهة برمجة تطبيقات Kubernetes، دون احتساب الارتفاع المؤقت
--registry-config string مسار ملف تكوين السجل (افتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار الملف الذي يحتوي على مؤشرات الدليل المؤقتة (افتراضي "~/.cache/helm/repository")
--repository-config string مسار الملف الذي يحتوي على أسماء وروابط الأدلة (افتراضي "~/.config/helm/repositories.yaml")


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
