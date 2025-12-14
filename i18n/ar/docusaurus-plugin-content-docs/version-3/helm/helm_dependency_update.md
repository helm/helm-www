----
title: helm dependency update
---
يقوم بتحديث مجلد charts/ استنادًا إلى محتوى ملف Chart.yaml

### الملخص

يقوم بتحديث التبعيات على القرص لتتوافق مع ملف `Chart.yaml`.

يتحقق هذا الأمر من أن الرسوم البيانية المطلوبة، كما هو محدد في ملف `Chart.yaml`، موجودة في مجلد `charts/` وبالإصدار المقبول. سيقوم بجلب أحدث الرسوم البيانية التي تلبي التبعيات وتنظيف التبعيات القديمة. 

في حالة التحديث الناجح، سيتم إنشاء ملف lock يمكن استخدامه لإعادة بناء التبعيات لإصدار محدد.

ليس من الضروري أن تكون التبعيات موجودة في ملف `Chart.yaml`. لهذا السبب، لن يقوم أمر التحديث بحذف الرسوم البيانية إلا إذا كانت (أ) موجودة في ملف `Chart.yaml` و(ب) بإصدار غير صحيح.

helm dependency update CHART [flags]


### الخيارات

-h, --help مساعدة لأمر build
--keyring string حلقة المفاتيح التي تحتوي على المفاتيح العامة (افتراضي "~/.gnupg/pubring.gpg")
--skip-refresh عدم تحديث ذاكرة التخزين المؤقت للمستودع المحلي
--verify التحقق من الحزم مقابل التوقيعات



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

* [helm dependency](/helm/helm_dependency.md) - إدارة تبعيات الرسم البياني
