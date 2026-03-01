---
title: helm lint
---
فحص Chart للكشف عن المشاكل المحتملة

### الملخص

يقوم هذا الأمر بأخذ مسار إلى Chart وتشغيل سلسلة من الاختبارات للتأكد من أن Chart مُعد بشكل صحيح.

إذا واجه الـ linter عناصر قد تؤدي إلى فشل تثبيت Chart، سيظهر رسائل [ERROR].  
إذا واجه مشاكل تتعارض مع المعايير أو التوصيات، سيظهر رسائل [WARNING].

helm lint PATH [flags]


### الخيارات

-h, --help مساعدة أمر lint
--quiet عرض التحذيرات والأخطاء فقط
--set stringArray تحديد قيم من سطر الأوامر (يمكن التحديد عدة مرات أو مفصولة بفواصل: key1=val1,key2=val2)
--set-file stringArray تحديد قيم من ملفات محددة من سطر الأوامر (يمكن التحديد عدة مرات أو مفصولة بفواصل: key1=path1,key2=path2)
--set-json stringArray تحديد قيم بصيغة JSON من سطر الأوامر (يمكن التحديد عدة مرات أو مفصولة بفواصل: key1=jsonval1,key2=jsonval2)
--set-literal stringArray تحديد قيمة نصية مباشرة من سطر الأوامر
--set-string stringArray تحديد قيم كسلسلة نصية من سطر الأوامر (يمكن التحديد عدة مرات أو مفصولة بفواصل: key1=val1,key2=val2)
--strict الفشل في حالة وجود تحذيرات
-f, --values strings تحديد القيم من ملف YAML أو URL (يمكن التحديد عدة مرات)
--with-subcharts فحص Subcharts التابعة


### الخيارات الموروثة من الأوامر الرئيسية

  --burst-limit int                 حد النطاق الترددي على جانب العميل (افتراضي 100)
  --debug                           تفعيل الإخراج التفصيلي
  --kube-apiserver string           عنوان ومنفذ API لخادم Kubernetes
  --kube-as-group stringArray       المجموعة المستخدمة للعملية
  --kube-as-user string             اسم المستخدم للعملية
  --kube-ca-file string             ملف سلطة الشهادة
  --kube-context string             سياق kubeconfig
  --kube-insecure-skip-tls-verify   تجاهل التحقق من شهادة API Kubernetes
  --kube-tls-server-name string     اسم الخادم للتحقق من الشهادة
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار kubeconfig
-n, --namespace string مساحة الاسم
--qps float32 عدد الطلبات في الثانية
--registry-config string مسار ملف تكوين السجل (افتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار التخزين المؤقت للمستودعات (افتراضي "~/.cache/helm/repository")
--repository-config string مسار ملف أسماء وعناوين المستودعات (افتراضي "~/.config/helm/repositories.yaml")


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
