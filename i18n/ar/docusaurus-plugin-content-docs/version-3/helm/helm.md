
---
title: helm
slug: helm
---
Helm، مدير الحزم لـ Kubernetes

### الملخص

مدير الحزم لـ Kubernetes

الإجراءات الشائعة في Helm:

- `helm search` :    البحث عن charts المثبتة في Kubernetes
- `helm pull` :      تحميل أرشيف chart إلى المجلد الحالي
- `helm install` :   تثبيت chart في مساحة الاسم الخاصة بالـ cluster
- `helm list` :      عرض إصدارات charts المثبتة في مساحة الاسم الخاصة بالـ cluster

متغيرات البيئة:

| الاسم                                | الوصف                                                                                           |
|-------------------------------------|-------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                     | يحدد مجلدًا بديلًا لتخزين ملفات الكاش                                                              |
| $HELM_CONFIG_HOME                    | يحدد مجلدًا بديلًا لتخزين ملفات الإعدادات                                                        |
| $HELM_DATA_HOME                      | يحدد مجلدًا بديلًا لتخزين ملفات البيانات                                                         |
| $HELM_DEBUG                          | يحدد ما إذا كان Helm يعمل في وضع Debug                                                           |
| $HELM_DRIVER                         | يحدد نوع تخزين backend. يمكن أن يكون: configmap, secret, memory, sql                             |
| $HELM_DRIVER_SQL_connexion_STRING    | يحدد سلسلة الاتصال التي يجب على driver SQL استخدامها                                            |
| $HELM_MAX_HISTORY                     | يحدد الحد الأقصى لعدد الإصدارات المحفوظة                                                        |
| $HELM_NAMESPACE                       | يحدد مساحة الاسم للعمليات Helm                                                                  |
| $HELM_NO_PLUGINS                      | تعطيل الإضافات. ضع HELM_NO_PLUGINS=1 لتعطيلها                                                   |
| $HELM_PLUGINS                         | يحدد مسار مجلد الإضافات                                                                         |
| $HELM_REGISTRY_CONFIG                 | يحدد مسار ملف إعدادات السجل                                                                      |
| $HELM_REPOSITORY_CACHE                | يحدد مسار مجلد الكاش للمستودعات                                                                 |
| $HELM_REPOSITORY_CONFIG               | يحدد مسار إعدادات المستودع                                                                      |
| $KUBECONFIG                           | يحدد مسار بديل لإعداد Kubernetes (افتراضي "~/.kube/config")                                     |
| $HELM_KUBEAPISERVER                   | يحدد نقطة دخول API لخادم Kubernetes للمصادقة                                                    |
| $HELM_KUBECAFILE                      | يحدد ملف سلطة الشهادة الخاصة بـ Kubernetes                                                      |
| $HELM_KUBEASGROUPS                    | يحدد المجموعات لاستخدامها عند التمويه على شكل CSV                                               |
| $HELM_KUBEASUSER                      | يحدد اسم المستخدم لاستخدامه عند التمويه                                                        |
| $HELM_KUBECONTEXT                     | يحدد اسم سياق kubeconfig                                                                       |
| $HELM_KUBETOKEN                       | يحدد KubeToken المستخدم للمصادقة                                                               |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY    | يحدد ما إذا كان يجب تجاهل التحقق من شهادة API (غير آمن)                                         |
| $HELM_KUBETLS_SERVER_NAME             | يحدد اسم الخادم المستخدم للتحقق من شهادة API Kubernetes                                         |
| $HELM_BURST_LIMIT                     | يحدد حد burst في حالة وجود عدة CRDs على الخادم (افتراضي 100، -1 لتعطيل)                          |

يخزن Helm الكاش والإعدادات والبيانات وفقًا للتهيئة التالية:

- إذا تم تعيين متغيرات البيئة `HELM_*_HOME`، سيتم استخدامها
- وإلا، في الأنظمة التي تدعم XDG base directory، سيتم استخدام متغيرات XDG
- إذا لم يتم تحديد أي مسار آخر، سيتم استخدام المسار الافتراضي حسب نظام التشغيل OS

المسارات الافتراضية حسب نظام التشغيل:

| OS               | مسار الكاش               | مسار الإعدادات               | مسار البيانات          |
|------------------|--------------------------|-------------------------------|------------------------|
| Linux            | $HOME/.cache/helm        | $HOME/.config/helm           | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm| $HOME/Library/Preferences/helm| $HOME/Library/helm      |
| Windows          | %TEMP%\helm              | %APPDATA%\helm               | %APPDATA%\helm          |

### الخيارات

  --burst-limit int                 حد burst على جانب العميل (افتراضي 100)
  --debug                           تفعيل الإخراج التفصيلي
-h, --help مساعدة Helm
--kube-apiserver string عنوان ومنفذ API لخادم Kubernetes
--kube-as-group stringArray المجموعات المستخدمة للعملية (يمكن تكرار الخيار)
--kube-as-user string اسم المستخدم للعملية
--kube-ca-file string ملف سلطة الشهادة للاتصال بـ API Kubernetes
--kube-context string اسم سياق kubeconfig للاستخدام
--kube-insecure-skip-tls-verify تجاهل التحقق من شهادة API Kubernetes (غير آمن)
--kube-tls-server-name string اسم الخادم للتحقق من شهادة API Kubernetes
--kube-token string رمز المصادقة
--kubeconfig string مسار ملف kubeconfig
-n, --namespace string مساحة الاسم للاستخدام
--registry-config string مسار إعدادات السجل (افتراضي "~/.config/helm/registry/config.json")
--repository-cache string مسار كاش المستودع (افتراضي "~/.cache/helm/repository")
--repository-config string مسار إعدادات المستودع (افتراضي "~/.config/helm/repositories.yaml")



