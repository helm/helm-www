---
title: helm repo update
---
تحديث معلومات الـ Charts المتوفرة محليًا من مستودعات الـ Charts

### الملخص

يقوم التحديث بالحصول على أحدث المعلومات عن الـ Charts من المستودعات المعنية. تُخزن المعلومات مؤقتًا محليًا، حيث تُستخدم من قبل أوامر مثل `helm search`.

يمكنك تحديد قائمة بالمستودعات التي تريد تحديثها:
`$ helm repo update <repo_name> ...`  
لتحديث جميع المستودعات، استخدم `helm repo update`.

helm repo update [REPO1 [REPO2 ...]] [flags]


### الخيارات

  --fail-on-repo-update-fail   يفشل التحديث إذا فشل تحديث أي من المستودعات
-h, --help مساعدة لأمر update



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

* [helm repo](/helm/helm_repo.md) - إضافة، عرض، حذف، تحديث وفهرسة مستودعات Charts
