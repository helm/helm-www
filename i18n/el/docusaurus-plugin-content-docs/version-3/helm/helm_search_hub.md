---
title: helm search hub
---

αναζητά charts στο Artifact Hub ή στη δική σας hub instance

### Σύνοψη {#synopsis}

Αναζητά Helm charts στο Artifact Hub ή στη δική σας hub instance.

Το Artifact Hub είναι μια διαδικτυακή εφαρμογή που επιτρέπει την εύρεση, εγκατάσταση
και δημοσίευση πακέτων και ρυθμίσεων για έργα του CNCF, συμπεριλαμβανομένων
δημόσια διαθέσιμων Helm charts. Είναι ένα sandbox project του Cloud Native Computing
Foundation. Μπορείτε να περιηγηθείτε στο hub στη διεύθυνση https://artifacthub.io/

Το όρισμα [KEYWORD] δέχεται είτε μια λέξη-κλειδί, είτε ένα string σε εισαγωγικά με
επιλογές προηγμένης αναζήτησης. Για τεκμηρίωση των επιλογών προηγμένης αναζήτησης,
δείτε
https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

Προηγούμενες εκδόσεις του Helm χρησιμοποιούσαν μια instance του Monocular ως
προεπιλεγμένο 'endpoint', οπότε για συμβατότητα προς τα πίσω το Artifact Hub είναι
συμβατό με το Monocular search API. Ομοίως, όταν ορίζετε τη σημαία 'endpoint',
το καθορισμένο endpoint πρέπει επίσης να υλοποιεί ένα συμβατό Monocular search
API endpoint. Όταν καθορίζετε μια Monocular instance ως 'endpoint', η προηγμένη
αναζήτηση δεν υποστηρίζεται. Για λεπτομέρειες του API, δείτε https://github.com/helm/monocular


```
helm search hub [KEYWORD] [flags]
```

### Επιλογές {#options}

```
      --endpoint string      Hub instance to query for charts (default "https://hub.helm.sh")
      --fail-on-no-result    search fails if no results are found
  -h, --help                 help for hub
      --list-repo-url        print charts repository URL
      --max-col-width uint   maximum column width for output table (default 50)
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
```

### Επιλογές που κληρονομούνται από γονικές εντολές {#options-inherited-from-parent-commands}

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

### ΔΕΙΤΕ ΕΠΙΣΗΣ {#see-also}

* [helm search](/helm/helm_search.md)	 - αναζητά μια λέξη-κλειδί σε charts

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026 {#auto-generated-by-spf13cobra-on-14-jan-2026}
