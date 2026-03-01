---
title: helm list
---
قائمة الإصدارات

### الملخص

يعرض هذا الأمر جميع الإصدارات في مساحة أسماء معينة (يستخدم مساحة الاسم في السياق إذا لم يتم تحديد أي مساحة).  

افتراضيًا، سيتم عرض الإصدارات المنشورة أو الفاشلة فقط. خيارات مثل '--uninstalled' و '--all' ستغير هذا السلوك. يمكن الجمع بين هذه الخيارات، على سبيل المثال '--uninstalled --failed'.

بشكل افتراضي، يتم فرز العناصر حسب الترتيب الأبجدي. يمكن استخدام الخيار '-d' للفرز حسب تاريخ النشر.

إذا تم تحديد الخيار '--filter'، سيتم التعامل معه كفلتر. الفلاتر هي تعبيرات عادية (RegEx) متوافقة مع Perl وتطبق على قائمة الإصدارات. سيتم عرض العناصر المطابقة فقط.  

$ helm list --filter 'ara[a-z]+'
NAME UPDATED CHART
maudlin-arachnid 2020-06-18 14:17:46.125134977 +0000 UTC alpine-0.1.0


إذا لم يتم العثور على نتائج، سيُنهِي 'helm list' مع رمز الخروج 0، ولكن بدون عرض (أو في حالة عدم استخدام الخيار '-q'، سيتم عرض رؤوس الأعمدة فقط).

افتراضيًا، يمكن عرض حتى 256 عنصرًا. لتحديد الحد الأقصى، استخدم الخيار '--max'.  
تعيين '--max' إلى 0 لا يعرض جميع النتائج، بل يعرض القيمة الافتراضية للخادم والتي قد تكون أعلى من 256.  
استخدام '--max' مع '--offset' يسمح بالتصفح صفحة صفحة.

helm list [flags]



### الخيارات

-a, --all عرض جميع الإصدارات بدون أي فلتر
-A, --all-namespaces عرض الإصدارات في جميع مساحات الأسماء
-d, --date فرز حسب تاريخ النشر
--deployed عرض الإصدارات المنشورة. إذا لم يُحدد غيره، سيتم تفعيل هذا الخيار تلقائيًا
--failed عرض الإصدارات الفاشلة
-f, --filter string تعبير عادي (RegEx) متوافق مع Perl لتصفية الإصدارات
-h, --help مساعدة أمر list
-m, --max int الحد الأقصى لعدد الإصدارات المسترجعة (افتراضي 256)
--no-headers عدم عرض رؤوس الأعمدة عند استخدام الإخراج الافتراضي
--offset int فهرس الإصدار التالي في القائمة لاستخدامه كإزاحة
-o, --output format عرض الإخراج بصيغة محددة: table, json, yaml (افتراضي table)
--pending عرض الإصدارات المعلقة
-r, --reverse عكس ترتيب الفرز
-l, --selector string محدد (طلب تسمية) لاستخدامه كفلتر، يدعم '=', '==', و '!=' (مثال: -l key1=value1,key2=value2). يعمل فقط مع التخزين بواسطة secret أو configmap
-q, --short عرض مختصر للقائمة (صامت)
--superseded عرض الإصدارات المستبدلة
--time-format string صيغة الوقت باستخدام صيغ GoLang (مثال: --time-format "2006-01-02 15:04:05Z0700")
--uninstalled عرض الإصدارات غير المثبتة (إذا تم استخدام 'helm uninstall --keep-history')
--uninstalling عرض الإصدارات الجاري إلغاء تثبيتها



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
