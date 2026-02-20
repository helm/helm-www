---
title: helm list
---

λίστα release

### Σύνοψη


Αυτή η εντολή εμφανίζει όλα τα release για ένα συγκεκριμένο namespace (χρησιμοποιεί
το τρέχον namespace context αν δεν καθοριστεί namespace).

Από προεπιλογή, εμφανίζει μόνο release με κατάσταση deployed ή failed. Σημαίες όπως
'--uninstalled' και '--all' θα αλλάξουν αυτή τη συμπεριφορά. Αυτές οι σημαίες μπορούν
να συνδυαστούν: '--uninstalled --failed'.

Από προεπιλογή, τα στοιχεία ταξινομούνται αλφαβητικά. Χρησιμοποιήστε τη σημαία '-d'
για ταξινόμηση κατά ημερομηνία release.

Αν δοθεί η σημαία --filter, θα χρησιμοποιηθεί ως φίλτρο. Τα φίλτρα είναι
κανονικές εκφράσεις (συμβατές με Perl) που εφαρμόζονται στη λίστα των release.
Μόνο τα στοιχεία που ταιριάζουν με το φίλτρο θα επιστραφούν.

    $ helm list --filter 'ara[a-z]+'
    NAME                UPDATED                                  CHART
    maudlin-arachnid    2020-06-18 14:17:46.125134977 +0000 UTC  alpine-0.1.0

Αν δεν βρεθούν αποτελέσματα, το 'helm list' θα επιστρέψει κωδικό 0, αλλά χωρίς
έξοδο (ή στην περίπτωση χωρίς σημαία '-q', μόνο επικεφαλίδες).

Από προεπιλογή, μπορούν να επιστραφούν έως 256 στοιχεία. Για να περιορίσετε αυτό,
χρησιμοποιήστε τη σημαία '--max'. Η ρύθμιση '--max' σε 0 δεν θα επιστρέψει όλα τα
αποτελέσματα. Αντίθετα, θα επιστρέψει την προεπιλεγμένη τιμή του server, η οποία
μπορεί να είναι πολύ μεγαλύτερη από 256. Ο συνδυασμός της σημαίας '--max' με τη
σημαία '--offset' σας επιτρέπει να περιηγηθείτε στα αποτελέσματα ανά σελίδα.


```
helm list [flags]
```

### Επιλογές

```
  -a, --all                  show all releases without any filter applied
  -A, --all-namespaces       list releases across all namespaces
  -d, --date                 sort by release date
      --deployed             show deployed releases. If no other is specified, this will be automatically enabled
      --failed               show failed releases
  -f, --filter string        a regular expression (Perl compatible). Any releases that match the expression will be included in the results
  -h, --help                 help for list
  -m, --max int              maximum number of releases to fetch (default 256)
      --no-headers           don't print headers when using the default output format
      --offset int           next release index in the list, used to offset from start value
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pending              show pending releases
  -r, --reverse              reverse the sort order
  -l, --selector string      Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2). Works only for secret(default) and configmap storage backends.
  -q, --short                output short (quiet) listing format
      --superseded           show superseded releases
      --time-format string   format time using golang time formatter. Example: --time-format "2006-01-02 15:04:05Z0700"
      --uninstalled          show uninstalled releases (if 'helm uninstall --keep-history' was used)
      --uninstalling         show releases that are currently being uninstalled
```

### Επιλογές που κληρονομούνται από γονικές εντολές

```
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
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

* [helm](/helm/helm.md)	 - Ο διαχειριστής πακέτων Helm για Kubernetes.

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026
