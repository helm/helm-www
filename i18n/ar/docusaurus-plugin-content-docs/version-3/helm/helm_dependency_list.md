---
title: helm dependency list
---

قائمة التبعيات لمخطط محدد

### الملخص

يعرض جميع التبعيات المعلنة في مخطط معين.

يأخذ هذا الأمر كمدخل أرشيفات المخطط ومجلد المخططات. لن يقوم بتعديل محتوى المخطط.

سيؤدي إلى حدوث خطأ إذا تعذر تحميل المخطط.

helm dependency list CHART [flags]


### الخيارات

-h, --help المساعدة الخاصة بالأمر list
--max-col-width uint الحد الأقصى لعرض العمود في جدول الإخراج (افتراضي 80)


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
