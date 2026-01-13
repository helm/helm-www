---
title: helm version
---
عرض معلومات إصدار العميل

### الملخص

يعرض هذا الأمر إصدار Helm.

سيظهر تمثيل لإصدار Helm على الشكل التالي:

`version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a", GitTreeState:"clean", GoVersion:"go1.13.10"}`

- **Version** : هي الإصدار الدلالي (Semantic Versioning) للنسخة.
- **GitCommit** : هو قيمة الـ SHA hash للالتزام (commit) الذي بُنيت منه هذه النسخة.
- **GitTreeState** : يكون "clean" إذا لم يكن هناك تغييرات محلية عند بناء هذا الإصدار، و"dirty" إذا تم إنشاؤه من كود معدل محليًا.
- **GoVersion** : هي نسخة Go المستخدمة لتجميع Helm.

عندما تستخدم الخيار `--template`، يمكن استخدام الخصائص التالية داخل النموذج:

- `.Version` تحتوي على الإصدار الدلالي لـ Helm.
- `.GitCommit` هو التزام Git.
- `.GitTreeState` هو حالة شجرة Git عند بناء Helm.
- `.GoVersion` تحتوي على نسخة Go المستخدمة لتجميع Helm.

على سبيل المثال :  
`--template='Version: {{.Version}}'`  
سيُرجع :  
`Version: v3.2.1`.


helm version [flags]


### الخيارات

-h, --help المساعدة لأمر version
--short يعرض رقم الإصدار فقط
--template string نموذج لتنسيق عرض الإصدار

shell
Copy code

### الخيارات الموروثة من الأوامر الرئيسية

scss
Copy code
  --burst-limit int                 حد النطاق الترددي من جهة العميل (الافتراضي 100)
  --debug                           تفعيل المخرجات التفصيلية
  --kube-apiserver string           عنوان خادم Kubernetes API والمنفذ
  --kube-as-group stringArray       المجموعة المستخدمة للتنفيذ (يمكن تكرار الخيار لعدة مجموعات)
  --kube-as-user string             اسم المستخدم المستخدم للعملية
  --kube-ca-file string             ملف شهادة CA للاتصال بخادم Kubernetes API
  --kube-context string             اسم سياق kubeconfig المستخدم
  --kube-insecure-skip-tls-verify   عند التفعيل، لن يتم التحقق من شهادة TLS لخادم Kubernetes (اتصال غير آمن)
  --kube-tls-server-name string     اسم الخادم المستخدم للتحقق من شهادة Kubernetes API
  --kube-token string               رمز المصادقة
  --kubeconfig string               مسار ملف kubeconfig
-n, --namespace string الـ namespace المستخدم للطلب
--qps float32 عدد الطلبات في الثانية عند الاتصال بالـ API (باستثناء الـ bursting)
--registry-config string مسار ملف إعدادات registry (الافتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار كاش المستودعات (الافتراضي "~/.cache/helm/repository")
--repository-config string مسار ملف إعدادات المستودعات (الافتراضي "~/.config/helm/repositories.yaml")


### انظر أيضًا

* [helm](/helm/helm.md) - مدير الحزم Helm لـ Kubernetes
