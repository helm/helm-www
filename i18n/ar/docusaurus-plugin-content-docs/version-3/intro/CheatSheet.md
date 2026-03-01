تحتوي ورقة الغش (Cheat Sheet) الخاصة بـ Helm على جميع الأوامر اللازمة لإدارة التطبيقات باستخدام Helm.

الأساسيات  
                                                                                                       Chart:

هو اسم الـ chart في حالة تم تحميله أو فك ضغطه.

هو اسم الـ <repo_name>/<chart_name> في حالة تم إضافة الدليل ولكن لم يتم تحميل الـ chart.

هو عنوان URL/المسار الكامل إلى الـ chart.

                                                                                                        Name:

هو الاسم الذي ترغب في إعطائه لتثبيت الـ Chart في Helm.

												     Release:

هو الاسم الذي تعطيه لنسخة من التثبيت.

												    Revision:

هو رقم التاريخ للإصدار السابق.

												  			Reponame:

هو اسم المستودع.

													DIR:

اسم/مسار الدليل.

إدارة الـ Charts

helm create <name>                      # chartأنشئ دليلًا جديدًا يحتوي على ملفات ودلائل تستخدم في الـ
helm package <chart-path>               # chartفي أرشيف مضغوط ومُدرج الإصدار.تعبئة الـ
helm lint <chart>                       # إجراء اختبارات لفحص الـ chart واكتشاف الأخطاء.
helm show all <chart>                   # استعرض واطبع محتويات الـ chart.
helm show values <chart>                # عرض محتويات ملف `values.yaml`.
helm pull <chart>                       # تحميل الـ chart.
helm pull <chart> --untar=true          # إذا تم تحديده كـ `true`, يتم فك ضغط الـ chart بعد تحميله.
helm pull <chart> --verify              # تحقق من الحزمة قبل استخدامها.
helm pull <chart> --version <number>    # افتراضيًا، يتم استخدام أحدث إصدار، ولكن يمكنك تحديد إصدار لاستخدامه.
helm dependency list <chart>            # عرض قائمة الاعتمادات الخاصة بالـ chart.

تثبيت وإلغاء تثبيت التطبيقات
helm install <name> <chart>                           # تثبيت ال مع اسمهـ chart
helm install <name> <chart> --namespace <namespace>   # تثبيت الـ chart في مساحة أسماء محددة.
helm install <name> <chart> --set key1=val1,key2=val2 # تحديد القيم من خلال سطر الأوامر (يمكنك تحديد عدة قيم أو فصلها بالفواصل).
helm install <name> <chart> --values <yaml-file/url>  # تثبيت الـ chart مع القيم المخصصة.
helm install <name> <chart> --dry-run --debug         # إجراء اختبار للتثبيت للتحقق من صحة الـ chart.
helm install <name> <chart> --verify                  # تحقق من الحزمة قبل استخدامها.
helm install <name> <chart> --dependency-update       # تحديث الاعتمادات إذا كانت مفقودة قبل تثبيت الـ chart.
helm uninstall <name>                                 # إلغاء تثبيت الـ chart.

تحديث واستعادة التطبيق
helm upgrade <release> <chart>                            # ترقية إصدار معين.
helm upgrade <release> <chart> --rollback-on-failure      # إذا تم تحديده، سيقوم بتطبيق الاستعادة في حال حدوث خطأ.
helm upgrade <release> <chart> --dependency-update        # تحديث الاعتمادات إذا كانت مفقودة قبل تثبيت الـ chart.
helm upgrade <release> <chart> --version <version_number> # تحديد إصدار للتثبيت.
helm upgrade <release> <chart> --values                   # تحديد القيم من خلال ملف `YAML` أو `URL` (يمكنك تحديد عدة قيم).
helm upgrade <release> <chart> --set key1=val1,key2=val2  # تحديد القيم من خلال سطر الأوامر (يمكنك تحديد عدة قيم أو فصلها بالفواصل).
helm upgrade <release> <chart> --force                    # فرض التحديث باستخدام استراتيجية الاستبدال.
helm rollback <release> <revision>                        # استعادة إصدار معين للـ `release`.
helm rollback <release> <revision>  --cleanup-on-fail     # السماح بحذف الموارد الجديدة التي تم إنشاؤها إذا فشل الاستعادة.

إضافة، حذف، وتحديث المستودعات
helm repo add <repo-name> <url>   # إضافة مستودع من الإنترنت.
helm repo list                    # عرض قائمة المستودعات التي تم إضافتها.
helm repo update                  # تحديث المعلومات الخاصة بالـ `charts` المتاحة محليًا من المستودعات.
helm repo remove <repo_name>      # حذف مستودع أو أكثر.
helm repo index <DIR>             # قراءة الدليل الحالي وإنشاء ملف فهرس للـ `charts`.
helm repo index <DIR> --merge     # دمج الفهرس الذي تم إنشاؤه مع فهرس موجود.
helm search repo <keyword>        # البحث عن مستودعات تحتوي على كلمة مفتاحية في الـ `charts`.
helm search hub <keyword>         # البحث عن الـ `charts` في Artifact Hub أو في الـ `hub` الخاص بك.

مراقبة الإصدارات في Helm
helm list                       # عرض جميع الإصدارات في مساحة أسماء محددة، استخدم مساحة الأسماء في السياق الحالي إذا لم يتم تحديدها.
helm list --all                 # عرض جميع الإصدارات بدون أي فلتر، يمكن استخدام '-a'.
helm list --all-namespaces      # عرض جميع الإصدارات في جميع مساحات الأسماء، يمكن استخدام '-A'.
helm list -l key1=value1,key2=value2 # فلترة باستخدام المحددات (التصفية باستخدام العلامات) مع دعم '=' و '==' و '!='.
helm list --date                # ترتيب حسب تاريخ الإطلاق.
helm list --deployed            # عرض الإصدارات المنشورة. إذا لم يتم تحديد شيء، سيتم تفعيله تلقائيًا.
helm list --pending             # عرض الإصدارات المعلقة.
helm list --failed              # عرض الإصدارات التي فشلت.
helm list --uninstalled         # عرض الإصدارات التي تم إلغاء تثبيتها (إذا تم استخدام `helm uninstall --keep-history`).
helm list --superseded          # عرض الإصدارات التي تم استبدالها.
helm list -o yaml               # عرض المخرجات بتنسيق محدد. القيم المقبولة: `table`, `json`, `yaml` (افتراضيًا `table`).
helm status <release>           # يعرض حالة الإصدار المسمى.
helm status <release> --revision <number>   # إذا تم تحديده، يعرض حالة الإصدار المسمى مع رقم الإصدار.
helm history <release>          # عرض سجل الإصدارات للإصدار المحدد.
helm env                        # عرض جميع المعلومات حول البيئة المستخدمة من قبل Helm.

تنزيل معلومات الإصدارات
helm get all <release>      # مجموعة من المعلومات القابلة للقراءة من ملاحظات، الخطافات (hooks)، القيم المقدمة وملف البيان (manifest) الذي تم إنشاؤه للإصدار المحدد.
helm get hooks <release>    # تنزيل الخطافات (hooks) الخاصة بالإصدار. يتم تنسيق الخطافات بتنسيق `YAML` مفصولة بفاصل `---\n`.
helm get manifest <release> # البيان هو تمثيل مشفر بتنسيق `YAML` للموارد التي تم إنشاؤها بواسطة الإصدار من الـ `chart(s)`. إذا كان الـ `chart` يعتمد على `charts` أخرى، ستكون هذه الموارد مضمنة أيضًا في البيان.
helm get notes <release>    # عرض الملاحظات المقدمة من قبل الـ `chart` للإصدار المحدد.
helm get values <release>   # تنزيل ملف القيم لإصدار معين. استخدم المعامل '-o' لتنسيق المخرجات.

إدارة الإضافات (Plugins)
helm plugin install <path/url>      # تثبيت الإضافات.
helm plugin list                    # عرض قائمة الإضافات المثبتة.
helm plugin update <plugin>         # تحديث الإضافات.
helm plugin uninstall <plugin>      # إلغاء تثبيت الإضافة.


