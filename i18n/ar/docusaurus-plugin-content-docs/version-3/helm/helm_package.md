---
title: helm package
---
ضغط مجلد chart في أرشيف chart

### الملخص

تقوم هذه الأوامر بضغط chart في ملف أرشيف مُرقّم بالإصدار.  
إذا تم تحديد مسار، سيتحقق Helm مما إذا كان هذا المسار يشير إلى chart (يجب أن يحتوي على ملف Chart.yaml) ثم يقوم بضغط هذا المجلد.

تُستخدم أرشيفات chart المُرقمة بالإصدار في مستودعات حزم Helm.

لتوقيع chart، استخدم الخيار `--sign`. في معظم الحالات، يجب أيضًا تقديم `--keyring path/to/secret/keys` و`--key keyname`.  

$ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg

إذا لم يتم تحديد الخيار `--keyring`، عادةً ما يستخدم Helm بشكل افتراضي حقيبة المفاتيح العامة، ما لم يكن البيئة الخاصة بك مُهيئة بطريقة أخرى.

helm package [CHART_PATH] [...] [flags]


### الخيارات

  --app-version string       تحديد appVersion للchart لهذه النسخة
-u, --dependency-update تحديث التبعيات من ملف "Chart.yaml" إلى مجلد "charts/" قبل الضغط
-d, --destination string المكان الذي سيكتب فيه chart (افتراضي ".")
-h, --help مساعدة للأمر package
--key string اسم المفتاح لاستخدامه عند التوقيع. يُستخدم إذا كان '--sign' مفعّل
--keyring string مسار حقيبة المفاتيح العامة (افتراضي "~/.gnupg/pubring.gpg")
--passphrase-file string مسار الملف الذي يحتوي على كلمة المرور المستخدمة عند التوقيع. استخدم "-" للقراءة من stdin
--sign استخدام مفتاح PGP خاص لتوقيع هذا الحزم
--version string تحديد إصدار هذا chart (إصدار semver)



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

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes

