--
title: helm repo index
---
إنشاء ملف فهرس من مستودع يحتوي على Charts مضغوطة

### الملخص

يقوم بتحليل المجلد الحالي وإنشاء ملف فهرس (`index.yaml`) بناءً على الـ Charts الموجودة.

يُستخدم هذا الأمر لإنشاء ملف `index.yaml` لمستودع Charts. لتحديد رابط URL مطلق للـ Charts، استخدم الخيار `--url`.

لدمج الفهرس الناتج مع فهرس موجود مسبقًا، استخدم الخيار `--merge`. في هذه الحالة، سيتم دمج الـ Charts الموجودة في المجلد الحالي مع الفهرس الحالي، مع أولوية للـ Charts المحلية على الموجود مسبقًا.

helm repo index [DIR] [flags]


### الخيارات

-h, --help مساعدة لأمر index
--json إخراج بصيغة JSON
--merge string دمج الفهرس الناتج مع الفهرس المحدد
--url string رابط URL لمستودع Charts

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
