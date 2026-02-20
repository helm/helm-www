---
title: Παραδείγματα
description: Παραδείγματα διαφόρων λειτουργιών του Helm SDK
sidebar_position: 2
---
import CodeBlock from '@theme/CodeBlock';

import MainExampleGo from '!!raw-loader!/sdkexamples/main.go';
import InstallExampleGo from '!!raw-loader!/sdkexamples/install.go';
import ListExampleGo from '!!raw-loader!/sdkexamples/list.go';
import PullExampleGo from '!!raw-loader!/sdkexamples/pull.go';
import UninstallExampleGo from '!!raw-loader!/sdkexamples/uninstall.go';
import UpgradeExampleGo from '!!raw-loader!/sdkexamples/upgrade.go';

Αυτό το έγγραφο παρουσιάζει μια σειρά παραδειγμάτων χρήσης του Helm SDK.
Σκοπός του είναι να τεκμηριώσει διάφορες λειτουργίες του SDK.

Το τελικό παράδειγμα δείχνει τον `main.go` driver ([σύνδεσμος](#driver)). Αυτός εκτελεί τις παρακάτω ενέργειες και περιλαμβάνει τις απαραίτητες βοηθητικές συναρτήσεις.

Ο κώδικας για τα παραδείγματα βρίσκεται στον κατάλογο [helm/helm-www/sdkexamples/](https://github.com/helm/helm-www/tree/main/sdkexamples).
Και είναι σχεδιασμένος να είναι πλήρως λειτουργικός.

## Ενέργειες {#actions}

### Ενέργεια Install {#install-action}

Αυτό το παράδειγμα εγκαθιστά το δοσμένο chart/release, για τη δοσμένη έκδοση και values:

<CodeBlock language="go" title="sdkexamples/install.go" showLineNumbers>{InstallExampleGo}</CodeBlock>

### Ενέργεια Upgrade {#upgrade-action}

Αυτό το παράδειγμα αναβαθμίζει το δοσμένο release, με το δοσμένο chart, έκδοση και values:

<CodeBlock language="go" title="sdkexamples/upgrade.go" showLineNumbers>{UpgradeExampleGo}</CodeBlock>

### Ενέργεια Uninstall {#uninstall-action}

Αυτό το παράδειγμα απεγκαθιστά το δοσμένο release:

<CodeBlock language="go" title="sdkexamples/uninstall.go" showLineNumbers>{UninstallExampleGo}</CodeBlock>

### Ενέργεια List {#list-action}

Αυτό το παράδειγμα παραθέτει όλα τα εγκατεστημένα charts (στο τρέχον διαμορφωμένο namespace):

<CodeBlock language="go" title="sdkexamples/list.go" showLineNumbers>{ListExampleGo}</CodeBlock>

### Ενέργεια Pull {#pull-action}

Αυτό το παράδειγμα κατεβάζει ένα chart από ένα OCI repository:

<CodeBlock language="go" title="sdkexamples/pull.go" showLineNumbers>{PullExampleGo}</CodeBlock>

## Driver {#driver}

Ο driver εδώ δείχνει τις απαραίτητες βοηθητικές συναρτήσεις που χρειάζονται για να λειτουργήσουν οι ενέργειες του Helm SDK. Και δείχνει τα παραπάνω παραδείγματα σε δράση, για να κατεβάσει, εγκαταστήσει, αναβαθμίσει και απεγκαταστήσει το 'podinfo' chart από ένα OCI repository:

<CodeBlock language="go" title="sdkexamples/main.go" showLineNumbers>{MainExampleGo}</CodeBlock>
