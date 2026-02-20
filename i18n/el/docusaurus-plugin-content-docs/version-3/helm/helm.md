---
title: helm
slug: helm
---

Ο διαχειριστής πακέτων Helm για το Kubernetes.

### Σύνοψη

Ο διαχειριστής πακέτων του Kubernetes

Συνήθεις ενέργειες για το Helm:

- helm search:    αναζήτηση για charts
- helm pull:      λήψη ενός chart στον τοπικό σας κατάλογο για προβολή
- helm install:   μεταφόρτωση του chart στο Kubernetes
- helm list:      λίστα με τα releases των charts

Μεταβλητές περιβάλλοντος:

| Όνομα                              | Περιγραφή                                                                                                         |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | ορίζει μια εναλλακτική τοποθεσία για την αποθήκευση cached αρχείων.                                                |
| $HELM_CONFIG_HOME                  | ορίζει μια εναλλακτική τοποθεσία για την αποθήκευση της διαμόρφωσης του Helm.                                      |
| $HELM_DATA_HOME                    | ορίζει μια εναλλακτική τοποθεσία για την αποθήκευση δεδομένων του Helm.                                            |
| $HELM_DEBUG                        | υποδεικνύει αν το Helm εκτελείται σε λειτουργία Debug                                                              |
| $HELM_DRIVER                       | ορίζει το backend storage driver. Τιμές: configmap, secret, memory, sql.                                          |
| $HELM_DRIVER_SQL_CONNECTION_STRING | ορίζει το connection string που θα χρησιμοποιήσει το SQL storage driver.                                          |
| $HELM_MAX_HISTORY                  | ορίζει τον μέγιστο αριθμό του ιστορικού εκδόσεων του helm.                                                         |
| $HELM_NAMESPACE                    | ορίζει το namespace που χρησιμοποιείται για τις λειτουργίες του helm.                                              |
| $HELM_NO_PLUGINS                   | απενεργοποιεί τα plugins. Ορίστε HELM_NO_PLUGINS=1 για απενεργοποίηση.                                             |
| $HELM_PLUGINS                      | ορίζει τη διαδρομή προς τον κατάλογο των plugins                                                                   |
| $HELM_REGISTRY_CONFIG              | ορίζει τη διαδρομή προς το αρχείο διαμόρφωσης του registry.                                                        |
| $HELM_REPOSITORY_CACHE             | ορίζει τη διαδρομή προς τον κατάλογο cache του repository                                                          |
| $HELM_REPOSITORY_CONFIG            | ορίζει τη διαδρομή προς το αρχείο repositories.                                                                    |
| $KUBECONFIG                        | ορίζει ένα εναλλακτικό αρχείο διαμόρφωσης Kubernetes (προεπιλογή "~/.kube/config")                                 |
| $HELM_KUBEAPISERVER                | ορίζει το Kubernetes API Server Endpoint για πιστοποίηση                                                           |
| $HELM_KUBECAFILE                   | ορίζει το αρχείο certificate authority του Kubernetes.                                                             |
| $HELM_KUBEASGROUPS                 | ορίζει τα Groups για προσωποποίηση χρησιμοποιώντας μια λίστα διαχωρισμένη με κόμμα.                                 |
| $HELM_KUBEASUSER                   | ορίζει το Username για προσωποποίηση για τη λειτουργία.                                                            |
| $HELM_KUBECONTEXT                  | ορίζει το όνομα του kubeconfig context.                                                                            |
| $HELM_KUBETOKEN                    | ορίζει το Bearer KubeToken που χρησιμοποιείται για πιστοποίηση.                                                    |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | υποδεικνύει αν η επαλήθευση του πιστοποιητικού του Kubernetes API server θα πρέπει να παραλειφθεί (μη ασφαλές)     |
| $HELM_KUBETLS_SERVER_NAME          | ορίζει το όνομα διακομιστή που χρησιμοποιείται για την επαλήθευση του πιστοποιητικού του Kubernetes API server     |
| $HELM_BURST_LIMIT                  | ορίζει το προεπιλεγμένο όριο burst σε περίπτωση που ο server περιέχει πολλά CRDs (προεπιλογή 100, -1 για απενεργοποίηση) |
| $HELM_QPS                          | ορίζει τα Queries Per Second σε περιπτώσεις όπου ένας υψηλός αριθμός κλήσεων υπερβαίνει την επιλογή για υψηλότερες τιμές burst |

Το Helm αποθηκεύει cache, διαμόρφωση και δεδομένα με βάση την ακόλουθη σειρά διαμόρφωσης:

- Αν έχει οριστεί μια μεταβλητή περιβάλλοντος HELM_*_HOME, θα χρησιμοποιηθεί αυτή
- Διαφορετικά, σε συστήματα που υποστηρίζουν την προδιαγραφή XDG base directory, θα χρησιμοποιηθούν οι μεταβλητές XDG
- Όταν δεν έχει οριστεί άλλη τοποθεσία, θα χρησιμοποιηθεί μια προεπιλεγμένη τοποθεσία με βάση το λειτουργικό σύστημα

Από προεπιλογή, οι προεπιλεγμένοι κατάλογοι εξαρτώνται από το λειτουργικό σύστημα. Οι προεπιλογές παρατίθενται παρακάτω:

| Λειτουργικό Σύστημα | Διαδρομή Cache            | Διαδρομή Διαμόρφωσης           | Διαδρομή Δεδομένων        |
|---------------------|---------------------------|--------------------------------|---------------------------|
| Linux               | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm   |
| macOS               | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm        |
| Windows             | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm            |


### Επιλογές

```
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
  -h, --help                            help for helm
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### ΔΕΙΤΕ ΕΠΙΣΗΣ

* [helm completion](./helm_completion.md)	 - δημιουργία scripts αυτόματης συμπλήρωσης για το καθορισμένο shell
* [helm create](./helm_create.md)	 - δημιουργία νέου chart με το δοσμένο όνομα
* [helm dependency](./helm_dependency.md)	 - διαχείριση των εξαρτήσεων ενός chart
* [helm env](./helm_env.md)	 - πληροφορίες περιβάλλοντος του Helm client
* [helm get](./helm_get.md)	 - λήψη εκτεταμένων πληροφοριών για ένα συγκεκριμένο release
* [helm history](./helm_history.md)	 - ανάκτηση ιστορικού release
* [helm install](./helm_install.md)	 - εγκατάσταση ενός chart
* [helm lint](./helm_lint.md)	 - εξέταση ενός chart για πιθανά προβλήματα
* [helm list](./helm_list.md)	 - λίστα releases
* [helm package](./helm_package.md)	 - πακετάρισμα ενός καταλόγου chart σε αρχείο chart
* [helm plugin](./helm_plugin.md)	 - εγκατάσταση, λίστα ή απεγκατάσταση Helm plugins
* [helm pull](./helm_pull.md)	 - λήψη ενός chart από ένα repository και (προαιρετικά) αποσυμπίεσή του σε τοπικό κατάλογο
* [helm push](./helm_push.md)	 - αποστολή ενός chart σε απομακρυσμένο server
* [helm registry](./helm_registry.md)	 - σύνδεση ή αποσύνδεση από ένα registry
* [helm repo](./helm_repo.md)	 - προσθήκη, λίστα, αφαίρεση, ενημέρωση και ευρετηρίαση chart repositories
* [helm rollback](./helm_rollback.md)	 - επαναφορά ενός release σε προηγούμενη αναθεώρηση
* [helm search](./helm_search.md)	 - αναζήτηση λέξης-κλειδιού σε charts
* [helm show](./helm_show.md)	 - εμφάνιση πληροφοριών ενός chart
* [helm status](./helm_status.md)	 - εμφάνιση της κατάστασης του συγκεκριμένου release
* [helm template](./helm_template.md)	 - τοπική απόδοση templates
* [helm test](./helm_test.md)	 - εκτέλεση δοκιμών για ένα release
* [helm uninstall](./helm_uninstall.md)	 - απεγκατάσταση ενός release
* [helm upgrade](./helm_upgrade.md)	 - αναβάθμιση ενός release
* [helm verify](./helm_verify.md)	 - επαλήθευση ότι ένα chart στη δοσμένη διαδρομή έχει υπογραφεί και είναι έγκυρο
* [helm version](./helm_version.md)	 - εκτύπωση πληροφοριών έκδοσης του client

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026
