---
title: helm search hub
---
البحث عن charts في Artifact Hub أو في النسخة الخاصة بك من الـ Hub

### الملخص
البحث عن charts Helm في Artifact Hub أو في نسختك الخاصة من الـ Hub.

Artifact Hub هو تطبيق ويب يتيح العثور على الحزم، تثبيتها، ونشرها لمشاريع CNCF، بما في ذلك الـ charts Helm العامة. يمكنك تصفح الـ Hub عبر الموقع https://artifacthub.io/

الحجة `[KEYWORD]` تقبل إما سلسلة كلمة مفتاحية أو سلسلة بين علامات اقتباس مع خيارات استعلام متقدمة. لمزيد من التفاصيل حول خيارات الاستعلام المتقدمة، راجع: https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

الإصدارات السابقة من Helm كانت تستخدم نسخة من Monocular كنقطة نهاية افتراضية. لذلك، من أجل التوافق الرجعي، Artifact Hub متوافق مع API البحث الخاص بـ Monocular. 
وبالمثل، عند تحديد الحجة `endpoint`، يجب أن تنفذ نقطة النهاية المحددة أيضًا واجهة API بحث متوافقة مع Monocular. لاحظ أنه عند استخدام نسخة Monocular كنقطة نهاية، لا يتم دعم الاستعلامات المتقدمة. لمزيد من التفاصيل حول API، راجع: https://github.com/helm/monocular

helm search hub [KEYWORD] [flags]


### الخيارات

  --endpoint string      نسخة الـ Hub للبحث عن الـ charts (افتراضي "https://hub.helm.sh")
  --fail-on-no-result    تفشل العملية إذا لم يتم العثور على نتائج
-h, --help مساعدة لأمر hub
--list-repo-url عرض روابط URL لمستودعات الـ charts
--max-col-width uint الحد الأقصى لعرض الأعمدة في جدول الإخراج (افتراضي 50)
-o, --output format عرض الإخراج بالتنسيق المحدد. القيم المسموح بها: table, json, yaml (افتراضي table)


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

* [helm search](/helm/helm_search.md) - البحث بالكلمة المفتاحية في الـ charts
