---
title: 
description: Comment installer et débuter sur Helm, comprends les instructions pour les distros, FAQs, et plugins.
sidebar_position: 1
---

يشرح هذا الدليل كيفية البدء بسرعة في استخدام Helm.

المتطلبات الأساسية

The following prerequisites are required for the proper and secure use of Helm:
المتطلبات الأساسية التالية مطلوبة لاستخدام Helm بشكل صحيح وآمن:

Possess a Kubernetes cluster.
امتلاك تجمع Kubernetes.

Decide on the security configurations to apply to your installation, if any.
تحديد تكوينات الأمان التي ستطبقها على تثبيتك، إن وجدت.

Install and configure Helm.
تثبيت وتكوين Helm.


تثبيت Kubernetes أو الوصول إلى تجمع

يجب أن يكون لديك Kubernetes مثبتًا. بالنسبة لأحدث إصدار من Helm، نوصي بأحدث إصدار مستقر من Kubernetes، الذي عادةً ما يكون ثاني أحدث إصدار فرعي.

يجب أن يكون لديك أيضًا نسخة محلية مهيأة من kubectl.

اقرأ سياسة دعم الإصدارات لـ Helm
 لمعرفة الحد الأقصى للاختلاف بين إصدارات Helm و Kubernetes المدعومة.

تثبيت Helm

قم بتنزيل الملف الثنائي لأحدث إصدار من Helm. يمكنك أيضًا استخدام مدير حزم مثل homebrew، أو زيارة صفحة الإصدارات الرسمية
.

لمزيد من التفاصيل أو خيارات التثبيت الأخرى، اطلع على دليل التثبيت
.

تهيئة مستودع Charts لـ Helm

بمجرد أن يصبح Helm جاهزًا، يمكنك إضافة مستودع Charts. تحقق من Artifact Hub
 لمعرفة المستودعات العامة المتاحة لـ Helm.

$ helm repo add stable https://charts.helm.sh/stable


بمجرد تكوين المستودع، يمكنك سرد الـ charts التي يمكنك تثبيتها:

$ helm search repo stable
NAME                                    chart VERSION   APP VERSION                     DESCRIPTION
stable/acs-engine-autoscaler            2.2.2           2.1.1                           DEPRECATED Scales worker nodes within agent pools
stable/aerospike                        0.2.8           v4.5.0.5                        A Helm chart for Aerospike in Kubernetes
stable/airflow                          4.1.0           1.10.4                          Airflow is a platform to programmatically autho...
stable/ambassador                       4.1.0           0.81.0                          A Helm chart for Datawire Ambassador
# ... وغيرها العديد

تثبيت Chart مثال

لتثبيت الـ chart، يمكنك تنفيذ أمر helm install. يمتلك Helm العديد من الطرق للعثور على وتثبيت الـ chart، ولكن أسهل طريقة هي استخدام مستودع الـ charts الرسمي "stable".

$ helm repo update              # تأكد من الحصول على أحدث قائمة بالـ charts
$ helm install stable/mysql --generate-name
Released smiling-penguin


في المثال أعلاه، تم نشر الـ chart stable/mysql، وكان اسم الإصدار الجديد هو "smiling-penguin".

يمكنك الحصول على المعلومات البسيطة حول ميزات هذا الـ chart MySQL عن طريق تنفيذ helm show chart stable/mysql. أو يمكنك تنفيذ helm show all stable/mysql للحصول على جميع المعلومات المتاحة.

كل مرة تقوم فيها بتثبيت الـ chart، يتم إنشاء إصدار جديد. يمكن تثبيت الـ chart عدة مرات على نفس الـ cluster. وكل إصدار يمكن إدارته وتحديثه بشكل مستقل.

أمر helm install هو أمر قوي جدًا ويحتوي على العديد من الميزات. لمعرفة المزيد حول هذا الأمر، اقرأ دليل استخدام Helm
.

تعلم المزيد عن نظام الإصدارات

من السهل رؤية ما تم نشره باستخدام Helm:

$ helm list
NAME             VERSION   UPDATED                   STATUS    chart
smiling-penguin  1         Wed Sep 28 12:59:46 2016  DEPLOYED  mysql-0.1.0


سيعرض لك أمر helm list (أو helm ls) قائمة بجميع الإصدارات المنشورة.

إلغاء تثبيت إصدار

لإلغاء تثبيت إصدار، استخدم الأمر helm uninstall:

$ helm uninstall smiling-penguin
Removed smiling-penguin


سيؤدي ذلك إلى إلغاء تثبيت الإصدار smiling-penguin من Kubernetes، وسيتم حذف جميع الموارد المرتبطة بهذا الإصدار بما في ذلك التاريخ المرتبط.

إذا تم توفير الخيار --keep-history، فسيتم الاحتفاظ بتاريخ الإصدارات. يمكنك حتى طلب معلومات حول هذا الإصدار:

$ helm status smiling-penguin
Status: UNINSTALLED
...


بما أن Helm يتتبع الإصدارات حتى بعد إلغاء تثبيتها، يمكنك تدقيق تاريخ الـ cluster وحتى التراجع عن حذف إصدار (باستخدام helm rollback).

قراءة المساعدة

لمعرفة المزيد حول الأوامر المتاحة في Helm، استخدم helm help أو اكتب الأمر متبوعًا بالـ -h:
$ helm get -h


$ helm get -h
