---
title: Library Charts
description: Εξηγεί τα library charts και παραδείγματα χρήσης τους
sidebar_position: 4
---

Τα library charts είναι ένας τύπος [Helm chart](/topics/charts.md)
που ορίζει βασικά στοιχεία ή ορισμούς chart, τα οποία μπορούν να χρησιμοποιηθούν από Helm
templates σε άλλα charts. Αυτό επιτρέπει τον διαμοιρασμό αποσπασμάτων κώδικα
που επαναχρησιμοποιούνται σε διαφορετικά charts, αποφεύγοντας την επανάληψη και διατηρώντας τα charts
[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Το library chart εισήχθη στο Helm 3 για να αναγνωρίσει επίσημα τα κοινά ή
βοηθητικά charts που χρησιμοποιούνταν από συντηρητές charts από το Helm 2. 
Ως τύπος chart, παρέχει:
- Σαφή διάκριση μεταξύ κοινών και application charts
- Λογική που αποτρέπει την εγκατάσταση ενός κοινού chart
- Καμία απόδοση templates σε ένα κοινό chart που μπορεί να περιέχει release
  artifacts
- Δυνατότητα στα εξαρτώμενα charts να χρησιμοποιούν το context του chart που τα εισάγει

Ένας συντηρητής chart μπορεί να ορίσει ένα κοινό chart ως library chart και να είναι
βέβαιος ότι το Helm θα το χειριστεί με τυπικό και συνεπή τρόπο. Επιπλέον,
οι ορισμοί σε ένα application chart μπορούν να διαμοιραστούν αλλάζοντας
τον τύπο του chart.

## Δημιουργία Απλού Library Chart {#create-a-simple-library-chart}

Όπως αναφέρθηκε προηγουμένως, ένα library chart είναι ένας τύπος [Helm chart](/topics/charts.md). Μπορείτε λοιπόν να ξεκινήσετε δημιουργώντας ένα
αρχικό chart:

```console
$ helm create mylibchart
Creating mylibchart
```

Αφαιρέστε πρώτα όλα τα αρχεία στον κατάλογο `templates`, καθώς θα δημιουργήσουμε
τους δικούς μας ορισμούς templates σε αυτό το παράδειγμα.

```console
$ rm -rf mylibchart/templates/*
```

Το αρχείο values δεν θα χρειαστεί επίσης.

```console
$ rm -f mylibchart/values.yaml
```

Πριν δημιουργήσουμε κοινό κώδικα, ας κάνουμε μια γρήγορη ανασκόπηση ορισμένων
σχετικών εννοιών του Helm. Ένα [named template](/chart_template_guide/named_templates.md) (μερικές φορές ονομάζεται partial
ή subtemplate) είναι απλά ένα template που ορίζεται μέσα σε ένα αρχείο με συγκεκριμένο
όνομα. Στον κατάλογο `templates/`, οποιοδήποτε αρχείο ξεκινά με κάτω παύλα (_)
δεν αναμένεται να παράγει αρχείο manifest του Kubernetes. Κατά σύμβαση λοιπόν, τα βοηθητικά
templates και τα partials τοποθετούνται σε αρχεία `_*.tpl` ή `_*.yaml`.

Σε αυτό το παράδειγμα, θα δημιουργήσουμε ένα κοινό ConfigMap με κενό
πόρο ConfigMap. Ο ορισμός του κοινού ConfigMap γίνεται στο αρχείο
`mylibchart/templates/_configmap.yaml` ως εξής:

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

Η δομή του ConfigMap ορίζεται στο named template `mylibchart.configmap.tpl`.
Πρόκειται για ένα απλό ConfigMap με κενό πόρο `data`. Στο ίδιο αρχείο υπάρχει
ένα άλλο named template με όνομα `mylibchart.configmap`. Αυτό το named template
περιλαμβάνει το `mylibchart.util.merge` που δέχεται 2 named
templates ως ορίσματα: το template που καλεί το `mylibchart.configmap` και
το `mylibchart.configmap.tpl`.

Η βοηθητική συνάρτηση `mylibchart.util.merge` είναι ένα named template στο
`mylibchart/templates/_util.yaml`. Πρόκειται για ένα χρήσιμο εργαλείο από το [The Common Helm
Helper Chart](#the-common-helm-helper-chart), καθώς συγχωνεύει τα 2 templates
και παρακάμπτει τα κοινά μέρη τους:

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

Αυτό είναι σημαντικό όταν ένα chart χρειάζεται να χρησιμοποιήσει κοινό κώδικα και να τον
προσαρμόσει στη δική του διαμόρφωση.

Τέλος, αλλάξτε τον τύπο του chart σε `library`. Αυτό απαιτεί επεξεργασία
του `mylibchart/Chart.yaml` ως εξής:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart. {#a-chart-can-be-either-an-application-or-a-library-chart}
# # Application charts are a collection of templates that can be packaged into versioned archives {#application-charts-are-a-collection-of-templates-that-can-be-packaged-into-versioned-archives}
# to be deployed. {#to-be-deployed}
# # Library charts provide useful utilities or functions for the chart developer. They're included as {#library-charts-provide-useful-utilities-or-functions-for-the-chart-developer-theyre-included-as}
# a dependency of application charts to inject those utilities and functions into the rendering {#a-dependency-of-application-charts-to-inject-those-utilities-and-functions-into-the-rendering}
# pipeline. Library charts do not define any templates and therefore cannot be deployed. {#pipeline-library-charts-do-not-define-any-templates-and-therefore-cannot-be-deployed}
# type: application {#type-application}
type: library

# This is the chart version. This version number should be incremented each time you make changes {#this-is-the-chart-version-this-version-number-should-be-incremented-each-time-you-make-changes}
# to the chart and its templates, including the app version. {#to-the-chart-and-its-templates-including-the-app-version}
version: 0.1.0

# This is the version number of the application being deployed. This version number should be {#this-is-the-version-number-of-the-application-being-deployed-this-version-number-should-be}
# incremented each time you make changes to the application and it is recommended to use it with quotes. {#incremented-each-time-you-make-changes-to-the-application-and-it-is-recommended-to-use-it-with-quotes}
appVersion: "1.16.0"
```

Το library chart είναι τώρα έτοιμο για διαμοιρασμό και ο ορισμός του ConfigMap μπορεί να
επαναχρησιμοποιηθεί.

Πριν προχωρήσετε, ελέγξτε αν το Helm αναγνωρίζει το chart ως library
chart:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Χρήση του Απλού Library Chart {#use-the-simple-library-chart}

Τώρα μπορούμε να χρησιμοποιήσουμε το library chart. Δημιουργήστε ξανά ένα αρχικό chart:

```console
$ helm create mychart
Creating mychart
```

Καθαρίστε τα αρχεία template ξανά, καθώς θέλουμε να δημιουργήσουμε μόνο ένα ConfigMap:

```console
$ rm -rf mychart/templates/*
```

Αν θέλαμε να δημιουργήσουμε ένα απλό ConfigMap σε ένα Helm template, θα μπορούσε να μοιάζει
με το ακόλουθο:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

Ωστόσο, θα επαναχρησιμοποιήσουμε τον κοινό κώδικα που έχει ήδη δημιουργηθεί στο `mylibchart`.
Το ConfigMap μπορεί να δημιουργηθεί στο αρχείο `mychart/templates/configmap.yaml` ως
εξής:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Με αυτόν τον τρόπο απλοποιείται η δουλειά, κληρονομώντας τον κοινό
ορισμό ConfigMap που προσθέτει τυπικές ιδιότητες για το ConfigMap. Στο
template προσθέτουμε τη διαμόρφωση, σε αυτή την περίπτωση το κλειδί δεδομένων `myvalue` και την
τιμή του. Η διαμόρφωση παρακάμπτει τον κενό πόρο του κοινού ConfigMap.
Αυτό είναι εφικτό χάρη στη βοηθητική συνάρτηση `mylibchart.util.merge` που
αναφέραμε στην προηγούμενη ενότητα.

Για να χρησιμοποιήσουμε τον κοινό κώδικα, πρέπει να προσθέσουμε το `mylibchart` ως εξάρτηση.
Προσθέστε τα ακόλουθα στο τέλος του αρχείου `mychart/Chart.yaml`:

```yaml
# My common code in my library chart {#my-common-code-in-my-library-chart}
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Με αυτόν τον τρόπο το library chart συμπεριλαμβάνεται ως δυναμική εξάρτηση από το σύστημα αρχείων,
στην ίδια γονική διαδρομή με το application chart. Επειδή συμπεριλαμβάνουμε
το library chart ως δυναμική εξάρτηση, πρέπει να εκτελέσουμε `helm dependency
update`. Αυτό θα αντιγράψει το library chart στον κατάλογο `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Είμαστε τώρα έτοιμοι να κάνουμε deploy το chart. Πριν την εγκατάσταση, ελέγξτε
πρώτα το rendered template.

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml}
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

Αυτό μοιάζει με το ConfigMap που θέλουμε, με παράκαμψη δεδομένων `myvalue: Hello
World`. Εγκαταστήστε το:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Μπορούμε να ανακτήσουμε το release και να δούμε ότι το πραγματικό template φορτώθηκε.

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## Πλεονεκτήματα Library Chart {#library-chart-benefits}

Επειδή τα library charts δεν μπορούν να λειτουργήσουν ως αυτόνομα charts, μπορούν να αξιοποιήσουν την ακόλουθη λειτουργικότητα:
- Το αντικείμενο `.Files` αναφέρεται στις διαδρομές αρχείων του γονικού chart, αντί της τοπικής διαδρομής του library chart
- Το αντικείμενο `.Values` είναι το ίδιο με αυτό του γονικού chart, σε αντίθεση με τα application [subcharts](/chart_template_guide/subcharts_and_globals.md) που λαμβάνουν την ενότητα values που έχει διαμορφωθεί κάτω από την επικεφαλίδα τους στο γονικό


## The Common Helm Helper Chart {#the-common-helm-helper-chart}

```markdown
Note: The Common Helm Helper Chart repo on Github is no longer actively maintained, and the repo has been deprecated and archived.
```

Αυτό το [chart](https://github.com/helm/charts/tree/master/incubator/common) ήταν
το αρχικό μοτίβο για τα common charts. Παρέχει εργαλεία που αντικατοπτρίζουν τις βέλτιστες
πρακτικές ανάπτυξης Kubernetes chart. Το καλύτερο απ' όλα είναι ότι μπορείτε να το χρησιμοποιήσετε αμέσως
κατά την ανάπτυξη των δικών σας charts, αποκτώντας έτοιμο κοινόχρηστο κώδικα.

Ακολουθεί ένας γρήγορος τρόπος χρήσης. Για περισσότερες λεπτομέρειες, δείτε το
[README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Δημιουργήστε ένα αρχικό chart ξανά:

```console
$ helm create demo
Creating demo
```

Ας χρησιμοποιήσουμε τον κοινό κώδικα από το helper chart. Πρώτα, επεξεργαστείτε το deployment
`demo/templates/deployment.yaml` ως εξής:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g. {#define-overrides-for-your-deployment-resource-here-eg}
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}
```

Στη συνέχεια το αρχείο service, `demo/templates/service.yaml` ως εξής:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g. {#define-overrides-for-your-service-resource-here-eg}
# metadata: {#metadata}
# labels: {#labels}
# custom: label {#custom-label}
# spec: {#spec}
# ports: {#ports}
# - port: 8080 {#port-8080}
{{- end -}}
```

Αυτά τα templates δείχνουν πώς η κληρονομικότητα του κοινού κώδικα από το helper chart
απλοποιεί τον κώδικα στη διαμόρφωση ή την προσαρμογή των
πόρων.

Για να χρησιμοποιήσουμε τον κοινό κώδικα, πρέπει να προσθέσουμε το `common` ως εξάρτηση. Προσθέστε
τα ακόλουθα στο τέλος του αρχείου `demo/Chart.yaml`:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Σημείωση: Θα πρέπει να προσθέσετε το `incubator` repo στη λίστα αποθετηρίων Helm
(`helm repo add`).

Επειδή συμπεριλαμβάνουμε το chart ως δυναμική εξάρτηση, πρέπει να εκτελέσουμε `helm
dependency update`. Αυτό θα αντιγράψει το helper chart στον κατάλογο `charts/`.

Επειδή το helper chart χρησιμοποιεί ορισμένες δομές του Helm 2, θα πρέπει να προσθέσετε τα
ακόλουθα στο `demo/values.yaml` για να ενεργοποιηθεί η φόρτωση του `nginx` image, καθώς αυτό
ενημερώθηκε στο αρχικό chart του Helm 3:

```yaml
image:
  tag: 1.16.0
```

Μπορείτε να ελέγξετε ότι τα chart templates είναι σωστά πριν το deploy χρησιμοποιώντας τις εντολές `helm lint` και `helm template`.

Αν όλα είναι εντάξει, προχωρήστε στο deploy με `helm install`!
