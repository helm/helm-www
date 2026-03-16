---
title: helm dependency
---

إدارة تبعيات المخطط

### الملخص

تدير التبعيات الخاصة بمخطط معين.

تخزن مخططات Helm تبعياتها في المجلد `charts/`. بالنسبة لمطوري المخططات، غالبًا ما يكون من الأسهل إدارة التبعيات في ملف `Chart.yaml` الذي يعلن عن جميع التبعيات.

تعمل أوامر التبعيات على هذا الملف، مما يسهل المزامنة بين التبعيات المطلوبة والتبعيات الفعلية المخزنة في مجلد `charts/`.

على سبيل المثال، يعلن ملف Chart.yaml التالي عن تبعيتين:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "https://example.com/charts"
    - name: memcached
      version: "3.2.1"
      repository: "https://another.example.com/charts"

يجب أن يكون الحقل 'name' هو اسم المخطط، حيث يجب أن يتطابق هذا الاسم مع الاسم في ملف `Chart.yaml` لذلك المخطط.

يجب أن يحتوي الحقل 'version' على إصدار وفق المعايير الدلالية أو نطاق إصدار.

يجب أن يشير عنوان URL للحقل 'repository' إلى مستودع المخطط. تتوقع Helm أنه عند إضافة `/index.yaml` إلى عنوان URL، يمكنها استرجاع فهرس المستودع. ملاحظة: يمكن أن يكون 'repository' أيضًا اسم مستعار. يجب أن يبدأ الاسم المستعار بـ `alias:` أو `@`.

ابتداءً من الإصدار 2.2.0، يمكن تحديد المستودع كمسار إلى دليل المخططات التابعة المخزنة محليًا. يجب أن يبدأ المسار بالبداية `file://`. على سبيل المثال:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "file://../dependency_chart/nginx"

إذا تم استرجاع المخطط التابع محليًا، فلا حاجة لإضافة المستودع إلى Helm باستخدام الأمر `helm add repo`. كما يتم دعم مطابقة الإصدارات في هذه الحالة.

### الخيارات

-h, --help المساعدة الخاصة بأمر dependency


### الخيارات الموروثة من الأوامر الأم

  --burst-limit int                 حد عرض النطاق الترددي من جانب العميل (افتراضي 100)
  --debug                           تفعيل الإخراج التفصيلي
  --kube-apiserver string           عنوان ومنفذ واجهة برمجة التطبيقات لخادم Kubernetes
  --kube-as-group stringArray       المجموعة المستخدمة للعملية، يمكن تكرار هذا الوسيط لتحديد عدة مجموعات
  --kube-as-user string             اسم المستخدم المستخدم للعملية
  --kube-ca-file string             ملف سلطة الشهادة للاتصال بواجهة برمجة تطبيقات Kubernetes
  --kube-context string             اسم سياق kubeconfig المستخدم
  --kube-insecure-skip-tls-verify   إذا كانت القيمة true، فلن يتم التحقق من شهادة خادم Kubernetes. هذا يجعل الاتصال عبر HTTPS غير آمن
  --kube-tls-server-name string     اسم الخادم للتحقق من شهادة خادم Kubernetes. إذا لم يُقدم، سيتم استخدام اسم الجهاز العميل للاتصال بالخادم
  --kube-token string               الرمز المستخدم للمصادقة
  --kubeconfig string               مسار ملف تكوين kubeconfig
-n, --namespace string مساحة الاسم المستخدمة للطلب
--qps float32 عدد الطلبات في الثانية المستخدمة عند الاتصال بواجهة برمجة تطبيقات Kubernetes، دون احتساب الارتفاع المؤقت
--registry-config string مسار ملف تكوين السجل (افتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار الملف الذي يحتوي على مؤشرات الدليل المؤقتة (افتراضي "~/.cache/helm/repository")
--repository-config string مسار الملف الذي يحتوي على أسماء وروابط الأدلة (افتراضي "~/.config/helm/repositories.yaml")


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
* [helm dependency build](/helm/helm_dependency_build.md) - إعادة بناء مجلد charts/ بناءً على ملف Chart.lock
* [helm dependency list](/helm/helm_dependency_list.md) - عرض قائمة التبعيات لمخطط محدد
* [helm dependency update](/helm/helm_dependency_update.md) - تحديث مجلد charts/ بناءً على محتوى ملف Chart.yaml
