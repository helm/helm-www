---
title: helm show
---
عرض المعلومات عن الـ chart

### الملخص

يتكون هذا الأمر من عدة أوامر فرعية لعرض معلومات عن charts.

### الخيارات

-h, --help مساعدة لأمر show



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

* [helm](/helm/helm.md) - مدير الحزم Helm لنظام Kubernetes
* [helm show all](/helm/helm_show_all.md) - عرض جميع المعلومات عن الـ chart
* [helm show chart](/helm/helm_show_chart.md) - عرض تعريف الـ chart
* [helm show crds](/helm/helm_show_crds.md) - عرض CRDs الخاصة بالـ chart
* [helm show readme](/helm/helm_show_readme.md) - عرض README الخاص بالـ chart
* [helm show values](/helm/helm_show_values.md) - عرض Values الخاصة بالـ chart
