---
title: استخدام Helm
description: يشرح الأساسيات لاستخدام Helm.
sidebar_position: 3
---
#!/usr/bin/env mdx


هذا الدليل يشرح أساسيات استخدام Helm لإدارة الحزم في مجموعة Kubernetes الخاصة بك. نفترض أنك قد قمت بالفعل بـ تثبيت
 عميل Helm.

إذا كنت ترغب في تنفيذ بعض الأوامر السريعة، يمكنك البدء بـ دليل البدء السريع يغطي هذا الفصل الأوامر المختلفة لـ Helm ويشرح كيفية استخدامها.

##ثلاثة مفاهيم أساسية

Chart هو حزمة Helm. يحتوي على جميع التعريفات للموارد اللازمة لتشغيل تطبيق أو أداة أو خدمة داخل مجموعة Kubernetes. يمكن اعتبار ذلك كمعادل Kubernetes لصيغة Homebrew، أو dpkg لـ Apt، أو ملف RPM لـ Yum.

Repository هو المكان الذي يمكن جمع ومشاركة الـ charts فيه. يشبه ذلك أرشيفات CPAN الخاصة بـ Perl
 أو قاعدة بيانات حزم Fedora
، ولكن لـ Kubernetes.

Release هو مثيل لـ chart يعمل في مجموعة Kubernetes. يمكن تثبيت الـ chart عدة مرات في نفس المجموعة. وكلما تم تثبيته مرة أخرى، يتم إنشاء release جديدة. على سبيل المثال، إذا كان لديك chart MySQL وترغب في تشغيل قاعدتين بيانات في مجموعتك، يمكنك تثبيت هذا chart مرتين. وكل واحدة ستحتوي على release خاص بها، والتي سيكون لها اسم release name خاص بها.

الآن بعد أن أصبحت على دراية بهذه المفاهيم، يمكننا متابعة استخدام Helm كما يلي:

Helm يقوم بتثبيت charts في Kubernetes، ويخلق release جديدة مع كل تثبيت. ولإيجاد charts جديدة، يمكنك البحث في repositories (المستودعات) الخاصة بـ Helm.

##helm search: البحث عن الـ charts

تأتي Helm مع أمر بحث قوي. يمكن استخدامه للبحث عن نوعين مختلفين من الموارد:

- 'helm search hub' يبحث في [Artifact Hub]
، الذي يعرض charts من عشرات المستودعات.

- 'helm search repo' يبحث في المستودعات التي قمت بإضافتها إلى إعداداتك (من خلال 'helm repo add'). يتم البحث على الشبكة الخاصة ولا يتطلب اتصالاً بالإنترنت.

يمكنك العثور على chart من المستودعات العامة باستخدام الأمر 'helm search hub':
```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...


الأمر أعلاه يبحث عن جميع الـ 'charts 'wordpress في Artifact Hub.

باستخدام helm search repo، يمكنك العثور على أسماء الـ charts في المستودعات التي أضفتها يدويًا:

$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes


يستخدم أمر البحث في Helm خوارزمية لمطابقة السلاسل النصية، لذلك يمكنك إدخال كلمات أو جزء من جملة:

$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes


البحث هو وسيلة جيدة للعثور على الحزم المتاحة. بمجرد أن تجد التطبيق الذي ترغب في تثبيته، يمكنك استخدام helm install لتثبيته.

##helm install: تثبيت حزمة

لتثبيت حزمة جديدة، استخدم الأمر helm install. في أبسط صوره، يتطلب هذا الأمر معملين: اسم الإصدار المطلوب واسم الـ chart الذي ترغب في تثبيته.

$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)


الـ chart wordpress تم تثبيته الآن. لاحظ أن تثبيت الـ chart يخلق كائن release جديد. النسخة أعلاه سميت «happy-panda». (إذا أردت أن يقوم Helm بإنشاء اسم لك، يمكنك إغفال اسم الإصدار واستخدام --generate-name).

أثناء التثبيت، سيعرض عميل helm معلومات مفيدة عن الموارد التي تم إنشاؤها، حالة الإصدار، وإذا كان هناك أي خطوات تكوين إضافية يجب اتباعها.

لا ينتظر Helm حتى تكون جميع الموارد قيد التشغيل قبل إنهاء العملية. العديد من الـ charts تتطلب صور Docker يزيد حجمها عن 600 ميجابايت وقد تستغرق وقتًا طويلاً لتثبيتها في المجموعة.

لمتابعة حالة الـ release أو لمراجعة معلومات التكوين، يمكنك استخدام helm status:

$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)


الأمر أعلاه يعرض الحالة الحالية لـ release الخاص بك.

##تخصيص chart قبل تثبيته

التثبيت كما فعلنا هنا سيستخدم فقط خيارات التكوين الافتراضية. قد يحدث أنك ترغب في تخصيص chart لاستخدام تكوين مخصص.

لرؤية الخيارات التي يمكن تخصيصها في chart، استخدم helm show values:

$ helm show values bitnami/wordpress
## Global Docker image parameters
## Please, note that this will override the image parameters, including dependencies, configured to use the global value
## Current available global Docker image parameters: imageRegistry and imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass


