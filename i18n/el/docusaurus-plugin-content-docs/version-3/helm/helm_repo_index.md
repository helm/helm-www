---
title: helm repo index
---

δημιουργεί ένα αρχείο ευρετηρίου για έναν κατάλογο που περιέχει πακεταρισμένα charts

### Σύνοψη

Διαβάζει τον τρέχοντα κατάλογο, δημιουργεί ένα αρχείο ευρετηρίου βασισμένο στα charts
που βρέθηκαν και γράφει το αποτέλεσμα στο 'index.yaml' στον τρέχοντα κατάλογο.

Αυτό το εργαλείο χρησιμοποιείται για τη δημιουργία ενός αρχείου 'index.yaml' για
ένα αποθετήριο chart. Για να ορίσετε απόλυτο URL για τα charts, χρησιμοποιήστε
τη σημαία '--url'.

Για να συγχωνεύσετε το παραγόμενο ευρετήριο με ένα υπάρχον αρχείο ευρετηρίου,
χρησιμοποιήστε τη σημαία '--merge'. Σε αυτή την περίπτωση, τα charts που βρέθηκαν
στον τρέχοντα κατάλογο θα συγχωνευθούν με το ευρετήριο που δόθηκε μέσω της --merge,
δίνοντας προτεραιότητα στα τοπικά charts.


```
helm repo index [DIR] [flags]
```

### Επιλογές

```
  -h, --help           help for index
      --json           output in JSON format
      --merge string   merge the generated index into the given index
      --url string     url of chart repository
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

* [helm repo](/helm/helm_repo.md)	 - προσθέτει, εμφανίζει, αφαιρεί, ενημερώνει και δημιουργεί ευρετήριο για αποθετήρια chart

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026
