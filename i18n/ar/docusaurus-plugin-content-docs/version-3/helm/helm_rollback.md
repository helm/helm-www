---
title: helm rollback
---
استعادة إصدار (release) إلى نسخة سابقة

### الملخص

يقوم هذا الأمر باستعادة إصدار (release) إلى نسخة سابقة.

الحجة الأولى لهذا الأمر هي اسم الإصدار، والحجة الثانية هي رقم النسخة (revision). إذا تم تجاهل الحجة الثانية أو تعيينها على 0، فسيتم استعادة النسخة السابقة.

لعرض أرقام النسخ، استخدم الأمر `helm history <RELEASE>`.

helm rollback <RELEASE> [REVISION] [flags]



### الخيارات

  --cleanup-on-fail    حذف الموارد الجديدة التي تم إنشاؤها أثناء الاستعادة إذا فشلت العملية
  --dry-run            محاكاة الاستعادة دون تنفيذها فعليًا
  --force              فرض تحديث الموارد عن طريق حذفها وإعادة إنشائها إذا لزم الأمر
-h, --help مساعدة لأمر rollback
--history-max int الحد الأقصى لعدد النسخ المحفوظة لكل إصدار. استخدم 0 لعدم وجود حد (افتراضي 10)
--no-hooks منع تشغيل الـ hooks أثناء الاستعادة
--recreate-pods إعادة تشغيل الـ pods للموارد عند الضرورة
--timeout duration وقت الانتظار لكل عملية Kubernetes (مثل الـ Jobs في الـ hooks) (افتراضي 5m0s)
--wait إذا تم التعيين، ينتظر حتى تكون جميع الـ pods، PVC، الخدمات، والعدد الأدنى من الـ pods في الـ Deployment، StatefulSet أو ReplicaSet جاهزة قبل اعتبار الإصدار ناجحًا. ينتظر حتى مدة --timeout
--wait-for-jobs إذا تم التعيين و--wait مفعل، ينتظر حتى تنتهي جميع الـ jobs قبل اعتبار الإصدار ناجحًا. ينتظر أيضًا مدة --timeout

### الخيارات الموروثة من الأوامر الرئيسية

scss
Copy code
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

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
