---
title: helm verify
---
التحقق من أن الـ chart في الموقع المحدد موقّع وصالح

### الملخص

يتحقق هذا الأمر من أن الـ chart المحدد يحتوي على ملف provenance (إثبات الأصل) صالح.

توفّر ملفات الـ provenance تحققًا تشفيريًا يؤكد أن الـ chart لم يتم العبث به وأنه قد تم تجهيزه بواسطة جهة موثوقة.

يمكن استخدام هذا الأمر للتحقق من chart محلي. توفر العديد من الأوامر الأخرى الخيار `--verify` الذي يقوم بنفس عملية التحقق.  
لإنشاء حزمة موقّعة، استخدم الأمر :

helm package --sign




helm verify PATH [flags]

### الخيارات

-h, --help المساعدة لأمر verify
--keyring string موقع مفاتيح التحقق العامة (الافتراضي "~/.gnupg/pubring.gpg")


### الخيارات الموروثة من الأوامر الرئيسية

  --burst-limit int                 حد النطاق الترددي من جهة العميل (الافتراضي 100)
  --debug                           تفعيل مخرجات التصحيح
  --kube-apiserver string           عنوان خادم Kubernetes API
  --kube-as-group stringArray       مجموعة التنفيذ (يمكن تكرار الخيار لعدة مجموعات)
  --kube-as-user string             اسم المستخدم لتنفيذ العملية
  --kube-ca-file string             ملف CA للاتصال بخادم Kubernetes API
  --kube-context string             سياق kubeconfig المستخدم
  --kube-insecure-skip-tls-verify   عند التفعيل، لن يتم التحقق من شهادة TLS لخادم Kubernetes (غير آمن)
  --kube-tls-server-name string     اسم الخادم للتحقق من شهادة Kubernetes API
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار ملف kubeconfig
-n, --namespace string الـ namespace المستخدم للطلب
--qps float32 عدد الطلبات في الثانية عند الاتصال بالـ API (باستثناء الـ bursting)
--registry-config string مسار ملف إعدادات registry (الافتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار كاش المستودعات (الافتراضي "~/.cache/helm/repository")
--repository-config string مسار ملف إعدادات المستودعات (الافتراضي "~/.config/helm/repositories.yaml")


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
