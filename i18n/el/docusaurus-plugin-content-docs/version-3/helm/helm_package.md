---
title: helm package
---

πακετάρισμα καταλόγου chart σε αρχείο chart

### Σύνοψη {#synopsis}


Αυτή η εντολή πακετάρει ένα chart σε αρχείο chart με έκδοση. Αν δοθεί μια
διαδρομή, θα αναζητηθεί σε αυτή τη διαδρομή ένα chart (το οποίο πρέπει να περιέχει
αρχείο Chart.yaml) και στη συνέχεια θα πακεταριστεί αυτός ο κατάλογος.

Τα αρχεία chart με έκδοση χρησιμοποιούνται από τα αποθετήρια πακέτων Helm.

Για να υπογράψετε ένα chart, χρησιμοποιήστε την επιλογή '--sign'. Στις περισσότερες
περιπτώσεις, θα πρέπει επίσης να δώσετε '--keyring path/to/secret/keys' και '--key keyname'.

  $ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg

Αν δεν καθοριστεί η επιλογή '--keyring', το Helm συνήθως χρησιμοποιεί το δημόσιο
keyring εκτός αν το περιβάλλον σας έχει ρυθμιστεί διαφορετικά.


```
helm package [CHART_PATH] [...] [flags]
```

### Επιλογές {#options}

```
      --app-version string         set the appVersion on the chart to this version
      --ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
  -u, --dependency-update          update dependencies from "Chart.yaml" to dir "charts/" before packaging
  -d, --destination string         location to write the chart. (default ".")
  -h, --help                       help for package
      --insecure-skip-tls-verify   skip tls certificate checks for the chart download
      --key string                 name of the key to use when signing. Used if --sign is true
      --key-file string            identify HTTPS client using this SSL key file
      --keyring string             location of a public keyring (default "~/.gnupg/pubring.gpg")
      --passphrase-file string     location of a file which contains the passphrase for the signing key. Use "-" in order to read from stdin.
      --password string            chart repository password where to locate the requested chart
      --plain-http                 use insecure HTTP connections for the chart download
      --sign                       use a PGP private key to sign this package
      --username string            chart repository username where to locate the requested chart
      --version string             set the version on the chart to this semver version
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

* [helm](/helm/helm.md)	 - Ο διαχειριστής πακέτων Helm για Kubernetes.

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026 {#auto-generated-by-spf13cobra-on-14-jan-2026}
