
---
title: helm dependency build
---
إعادة بناء مجلد charts/ من ملف Chart.lock

### الملخص

إعادة بناء مجلد charts/ استنادًا إلى ملف Chart.lock.

يتم استخدام build لإعادة بناء تبعيات المخطط وفقًا للحالة المحددة في ملف lock. لن يتم إعادة التفاوض على التبعيات كما تفعل الأمر `helm dependency update`.

إذا لم يتم العثور على أي ملف lock، ستعمل الأمر `helm dependency build` بنفس سلوك الأمر `helm dependency update`.

helm dependency build CHART [flags]

shell
Copy code

### الخيارات

-h, --help المساعدة الخاصة بالأمر build
--keyring string حلقة المفاتيح التي تحتوي على المفاتيح العامة (افتراضي "~/.gnupg/pubring.gpg")
--skip-refresh عدم تحديث ذاكرة التخزين المؤقت للمستودع المحلي
--verify التحقق من الحزم مقابل التواقيع


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

* [helm dependency](/helm/helm_dependency.md) - إدارة تبعيات المخطط
