---
title: Pod και PodTemplate
description: Συζητά τη μορφοποίηση των τμημάτων Pod και PodTemplate στα manifests των chart.
sidebar_position: 6
---

Αυτό το μέρος του Οδηγού Βέλτιστων Πρακτικών καλύπτει τη μορφοποίηση των τμημάτων Pod και PodTemplate στα manifests των chart.

Η παρακάτω (μη εξαντλητική) λίστα πόρων χρησιμοποιεί PodTemplates:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Images {#images}

Ένα container image θα πρέπει να χρησιμοποιεί ένα σταθερό tag ή το SHA του image. Δεν θα πρέπει να χρησιμοποιεί τα tags `latest`, `head`, `canary`, ή άλλα tags που είναι σχεδιασμένα να είναι "floating" (μεταβαλλόμενα).

Τα images _μπορούν_ να οριστούν στο αρχείο `values.yaml` για να διευκολύνεται η αλλαγή τους.

```yaml
image: {{ .Values.redisImage | quote }}
```

Ένα image και ένα tag _μπορούν_ να οριστούν στο `values.yaml` ως δύο ξεχωριστά πεδία:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy {#imagepullpolicy}

Η εντολή `helm create` ορίζει το `imagePullPolicy` σε `IfNotPresent` από προεπιλογή με τις ακόλουθες ρυθμίσεις στο `deployment.yaml`:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

Και στο `values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

Ομοίως, το Kubernetes ορίζει το `imagePullPolicy` σε `IfNotPresent` από προεπιλογή, αν δεν έχει οριστεί καθόλου. Αν θέλετε μια διαφορετική τιμή από το `IfNotPresent`, απλά ενημερώστε την τιμή στο `values.yaml` με την επιθυμητή τιμή.

## Τα PodTemplates Θα Πρέπει να Δηλώνουν Selectors {#podtemplates-should-declare-selectors}

Όλα τα τμήματα PodTemplate θα πρέπει να καθορίζουν έναν selector. Για παράδειγμα:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

Αυτή είναι μια καλή πρακτική επειδή καθιστά σαφή τη σχέση μεταξύ του set και του Pod.

Αυτό είναι ακόμα πιο σημαντικό για πόρους όπως το Deployment. Χωρίς selector, χρησιμοποιείται _ολόκληρο_ το σύνολο των labels για την επιλογή των αντίστοιχων Pods, πράγμα που θα προκαλέσει προβλήματα αν χρησιμοποιείτε labels που αλλάζουν, όπως η έκδοση ή η ημερομηνία release.
