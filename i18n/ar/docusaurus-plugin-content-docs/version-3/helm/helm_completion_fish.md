
---
title: helm completion fish
---

توليد سكربتات الإكمال التلقائي لـ Fish

### الملخص

توليد سكربتات الإكمال التلقائي لـ Helm من أجل shell Fish.

لتحميل الإكمال التلقائي في جلسة shell الحالية:

    helm completion fish | source

لتحميل الإكمال التلقائي لكل الجلسات الجديدة، نفذ مرة واحدة:

    helm completion fish > ~/.config/fish/completions/helm.fish

يجب إعادة تشغيل shell جديد ليتم تطبيق هذا الإعداد.

### الخيارات

-h, --help المساعدة الخاصة بـ Fish
--no-descriptions تعطيل وصف الإكمال التلقائي

shell
Copy code

### الخيارات الموروثة من الأوامر الأم

csharp
Copy code
  --burst-limit int                 حد عرض النطاق الترددي من جانب العميل (افتراضي 100)
  --debug                           تفعيل الإخراج التفصيلي
  --kube-apiserver string           عنوان ومنفذ واجهة برمجة التطبيقات لخادم Kubernetes
  --kube-as-group stringArray       المجموعة التي ستستخدم للعملية، يمكن تكرار هذا الوسيط لتحديد عدة مجموعات
  --kube-as-user string             اسم المستخدم الذي سيُستخدم للعملية
  --kube-ca-file string             ملف سلطة الشهادة للاتصال بواجهة برمجة تطبيقات Kubernetes
  --kube-context string             اسم سياق kubeconfig المستخدم
  --kube-insecure-skip-tls-verify   إذا كانت القيمة true، فلن يتم التحقق من صحة شهادة خادم Kubernetes. سيجعل هذا الاتصال عبر HTTPS غير آمن
  --kube-tls-server-name string     اسم الخادم المستخدم للتحقق من شهادة خادم Kubernetes. إذا لم يُقدم، سيتم استخدام اسم الجهاز العميل للاتصال بالخادم
  --kube-token string               الرمز المستخدم للمصادقة
  --kubeconfig string               مسار ملف تكوين kubeconfig
-n, --namespace string مساحة الاسم المستخدمة للطلب
--qps float32 عدد الطلبات في الثانية المستخدمة عند الاتصال بواجهة برمجة تطبيقات Kubernetes، دون احتساب الارتفاع المؤقت
--registry-config string مسار ملف تكوين السجل (افتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار الملف الذي يحتوي على مؤشرات الدليل المؤقتة (افتراضي "~/.cache/helm/repository")
--repository-config string مسار الملف الذي يحتوي على أسماء وروابط الأدلة (افتراضي "~/.config/helm/repositories.yaml")



### انظر أيضًا

* [helm completion](/helm/helm_completion.md) - توليد سكربتات الإكمال التلقائي للـ shell المحدد
