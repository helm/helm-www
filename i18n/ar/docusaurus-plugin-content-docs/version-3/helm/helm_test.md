-
title: helm test
---
تشغيل اختبارات على Release

### الملخص

يقوم الأمر **test** بتشغيل الاختبارات على Release معيّنة.

تأخذ هذه الأداة اسم Release مُثبتة مسبقًا.  
يتم تعريف الاختبارات التي سيتم تنفيذها داخل الـ chart نفسه.

helm test [RELEASE] [flags]


### الخيارات

  --filter strings     تحديد الاختبارات حسب خاصية معيّنة (حاليًا "name") باستخدام الصيغة:
                       attribut=valeur أو '!attribut=valeur' لاستبعاد اختبار.
                       يمكن تحديد عدة قيم أو فصلها بفواصل: name=test1,name=test2
-h, --help المساعدة لأمر test
--logs جلب سجلات (logs) الـ pod الخاص بالاختبار
(تنفّذ بعد انتهاء جميع الاختبارات ولكن قبل التنظيف)
--timeout duration المهلة لكل عملية Kubernetes (مثل Jobs الخاصة بالـ hooks)
(الافتراضي 5m0s)


### الخيارات الموروثة من الأوامر الرئيسية

  --burst-limit int                 حد الانفجار للعميل (افتراضي 100)
  --debug                           تفعيل مخرجات التصحيح
  --kube-apiserver string           عنوان خادم Kubernetes API
  --kube-as-group stringArray       مجموعة/مجموعات للطلب
  --kube-as-user string             المستخدم لتنفيذ الطلب
  --kube-ca-file string             ملف CA للاتصال بـ Kubernetes
  --kube-context string             سياق kubeconfig المستخدم
  --kube-insecure-skip-tls-verify   تخطي التحقق من شهادة خادم Kubernetes (غير آمن)
  --kube-tls-server-name string     اسم الخادم للتحقق من شهادة API server
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار ملف kubeconfig
-n, --namespace string الـ namespace المستخدم للطلب
--qps float32 عدد الطلبات في الثانية لـ Kubernetes API
--registry-config string ملف إعدادات registry (افتراضي)
--repository-cache string كاش المستودع (افتراضي)
--repository-config string ملف روابط وأسماء المستودعات (افتراضي)


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
