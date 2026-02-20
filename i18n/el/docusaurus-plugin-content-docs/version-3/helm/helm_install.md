---
title: helm install
---

εγκαθιστά ένα chart

### Σύνοψη

Αυτή η εντολή εγκαθιστά ένα αρχείο chart.

Το όρισμα εγκατάστασης πρέπει να είναι μια αναφορά chart, μια διαδρομή προς
ένα πακεταρισμένο chart, μια διαδρομή προς έναν αποσυμπιεσμένο κατάλογο chart
ή ένα URL.

Για να παρακάμψετε τιμές σε ένα chart, χρησιμοποιήστε είτε το flag '--values' και
περάστε ένα αρχείο, είτε το flag '--set' και περάστε ρυθμίσεις από τη γραμμή
εντολών. Για να ορίσετε μια τιμή ως string χρησιμοποιήστε '--set-string'.
Μπορείτε να χρησιμοποιήσετε '--set-file' για να ορίσετε μεμονωμένες τιμές από
αρχείο όταν η τιμή είναι πολύ μεγάλη για τη γραμμή εντολών ή δημιουργείται
δυναμικά. Μπορείτε επίσης να χρησιμοποιήσετε '--set-json' για να ορίσετε τιμές
JSON (scalars/objects/arrays) από τη γραμμή εντολών.

    $ helm install -f myvalues.yaml myredis ./redis

ή

    $ helm install --set name=prod myredis ./redis

ή

    $ helm install --set-string long_int=1234567890 myredis ./redis

ή

    $ helm install --set-file my_script=dothings.sh myredis ./redis

ή

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


Μπορείτε να καθορίσετε το flag '--values'/'-f' πολλές φορές. Προτεραιότητα θα
δοθεί στο τελευταίο (δεξιότερο) αρχείο που καθορίζεται. Για παράδειγμα, αν και
τα δύο αρχεία myvalues.yaml και override.yaml περιέχουν ένα κλειδί με όνομα
'Test', η τιμή που ορίζεται στο override.yaml θα υπερισχύσει:

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

Μπορείτε να καθορίσετε το flag '--set' πολλές φορές. Προτεραιότητα θα δοθεί στην
τελευταία (δεξιότερη) τιμή. Για παράδειγμα, αν και οι δύο τιμές 'bar' και 'newbar'
οριστούν για ένα κλειδί με όνομα 'foo', η τιμή 'newbar' θα υπερισχύσει:

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

Παρόμοια, στο παρακάτω παράδειγμα το 'foo' ορίζεται ως '["four"]':

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

Και στο παρακάτω παράδειγμα, το 'foo' ορίζεται ως '{"key1":"value1","key2":"bar"}':

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

Για να ελέγξετε τα δημιουργημένα manifests ενός release χωρίς να εγκαταστήσετε το
chart, μπορείτε να συνδυάσετε τα flags --debug και --dry-run.

Το flag --dry-run θα εξάγει όλα τα δημιουργημένα manifests του chart, συμπεριλαμβανομένων
των Secrets που μπορεί να περιέχουν ευαίσθητες τιμές. Για να αποκρύψετε τα
Kubernetes Secrets χρησιμοποιήστε το flag --hide-secret. Παρακαλούμε σκεφτείτε
προσεκτικά πώς και πότε χρησιμοποιούνται αυτά τα flags.

Αν οριστεί το --verify, το chart ΠΡΕΠΕΙ να έχει αρχείο provenance, και το αρχείο
provenance ΠΡΕΠΕΙ να περάσει όλα τα βήματα επαλήθευσης.

Υπάρχουν έξι διαφορετικοί τρόποι να καθορίσετε το chart που θέλετε να εγκαταστήσετε:

1. Μέσω αναφοράς chart: helm install mymaria example/mariadb
2. Μέσω διαδρομής προς πακεταρισμένο chart: helm install mynginx ./nginx-1.2.3.tgz
3. Μέσω διαδρομής προς αποσυμπιεσμένο κατάλογο chart: helm install mynginx ./nginx
4. Μέσω απόλυτου URL: helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. Μέσω αναφοράς chart και URL αποθετηρίου: helm install --repo https://example.com/charts/ mynginx nginx
6. Μέσω OCI registries: helm install mynginx --version 1.2.3 oci://example.com/charts/nginx

ΑΝΑΦΟΡΕΣ CHART

Μια αναφορά chart είναι ένας βολικός τρόπος να αναφερθείτε σε ένα chart μέσα σε
ένα αποθετήριο chart.

Όταν χρησιμοποιείτε μια αναφορά chart με πρόθεμα αποθετηρίου ('example/mariadb'),
το Helm θα αναζητήσει στην τοπική ρύθμιση για ένα αποθετήριο chart με όνομα
'example', και στη συνέχεια θα αναζητήσει ένα chart σε αυτό το αποθετήριο με
όνομα 'mariadb'. Θα εγκαταστήσει την τελευταία σταθερή έκδοση αυτού του chart
εκτός αν καθορίσετε το flag '--devel' για να συμπεριλάβετε και εκδόσεις ανάπτυξης
(alpha, beta και release candidate), ή προσδιορίσετε έναν αριθμό έκδοσης με το
flag '--version'.

Για να δείτε τη λίστα των αποθετηρίων chart, χρησιμοποιήστε 'helm repo list'. Για
να αναζητήσετε charts σε ένα αποθετήριο, χρησιμοποιήστε 'helm search'.


```
helm install [NAME] [CHART] [flags]
```

### Επιλογές

```
      --atomic                                     if set, the installation process deletes the installation on failure. The --wait flag will be set automatically if --atomic is used
      --ca-file string                             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string                           identify HTTPS client using this SSL certificate file
      --create-namespace                           create the release namespace if not present
      --dependency-update                          update dependencies if they are missing before installing the chart
      --description string                         add a custom description
      --devel                                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
      --disable-openapi-validation                 if set, the installation process will not validate rendered templates against the Kubernetes OpenAPI Schema
      --dry-run string[="client"]                  simulate an install. If --dry-run is set with no option being specified or as '--dry-run=client', it will not attempt cluster connections. Setting '--dry-run=server' allows attempting cluster connections.
      --enable-dns                                 enable DNS lookups when rendering templates
      --force                                      force resource updates through a replacement strategy
  -g, --generate-name                              generate the name (and omit the NAME parameter)
  -h, --help                                       help for install
      --hide-notes                                 if set, do not show notes in install output. Does not affect presence in chart metadata
      --hide-secret                                hide Kubernetes Secrets when also using the --dry-run flag
      --insecure-skip-tls-verify                   skip tls certificate checks for the chart download
      --key-file string                            identify HTTPS client using this SSL key file
      --keyring string                             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Labels that would be added to release metadata. Should be divided by comma. (default [])
      --name-template string                       specify template used to name the release
      --no-hooks                                   prevent hooks from running during install
  -o, --output format                              prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pass-credentials                           pass credentials to all domains
      --password string                            chart repository password where to locate the requested chart
      --plain-http                                 use insecure HTTP connections for the chart download
      --post-renderer postRendererString           the path to an executable to be used for post rendering. If it exists in $PATH, the binary will be used, otherwise it will try to look for the executable at the given path
      --post-renderer-args postRendererArgsSlice   an argument to the post-renderer (can specify multiple) (default [])
      --render-subchart-notes                      if set, render subchart notes along with the parent
      --replace                                    re-use the given name, only if that name is a deleted release which remains in the history. This is unsafe in production
      --repo string                                chart repository url where to locate the requested chart
      --set stringArray                            set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray                       set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-json stringArray                       set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    set a literal STRING value on the command line
      --set-string stringArray                     set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-crds                                  if set, no CRDs will be installed. By default, CRDs are installed if not already present
      --skip-schema-validation                     if set, disables JSON schema validation
      --take-ownership                             if set, install will ignore the check for helm annotations and take ownership of the existing resources
      --timeout duration                           time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --username string                            chart repository username where to locate the requested chart
  -f, --values strings                             specify values in a YAML file or a URL (can specify multiple)
      --verify                                     verify the package before using it
      --version string                             specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used
      --wait                                       if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
      --wait-for-jobs                              if set and --wait enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as --timeout
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

* [helm](./helm.md)	 - Ο διαχειριστής πακέτων Helm για Kubernetes.

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026
