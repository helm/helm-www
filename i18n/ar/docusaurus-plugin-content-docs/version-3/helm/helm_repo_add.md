--
title: helm repo add
---
إضافة مستودع Charts

helm repo add [NAME] [URL] [flags]


### الخيارات

  --allow-deprecated-repos     بشكل افتراضي، هذا الأمر لا يسمح بإضافة المستودعات الرسمية التي تم حذفها نهائياً. هذا الخيار يعطل هذا السلوك
  --ca-file string             التحقق من شهادات HTTPS باستخدام هذا ملف CA
  --cert-file string           تحديد العميل HTTPS باستخدام هذا ملف الشهادة SSL
  --force-update               إعادة كتابة المستودع إذا كان موجودًا بالفعل
-h, --help مساعدة لأمر add
--insecure-skip-tls-verify تجاهل التحقق من شهادة TLS عند نقل الـ chart
--key-file string تحديد العميل HTTPS باستخدام هذا ملف المفتاح SSL
--no-update تم تجاهله. سابقًا كان يمنع التحديثات القسرية، وهو الآن قديم ويتم استبداله بـ --force-update
--pass-credentials تمرير بيانات الاعتماد لجميع المجالات
--password string كلمة مرور المستودع
--password-stdin قراءة كلمة المرور من الـ stdin
--username string اسم مستخدم المستودع


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
