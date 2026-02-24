---
title: Επόμενα Βήματα
description: Ολοκλήρωση - κάποιες χρήσιμες αναφορές σε άλλη τεκμηρίωση που θα σας βοηθήσουν.
sidebar_position: 14
---

Αυτός ο οδηγός σκοπεύει να σας δώσει, ως προγραμματιστή chart, μια ισχυρή κατανόηση
του πώς να χρησιμοποιείτε τη γλώσσα template του Helm. Ο οδηγός επικεντρώνεται στις
τεχνικές πτυχές της ανάπτυξης templates.

Ωστόσο, υπάρχουν πολλά πράγματα που αυτός ο οδηγός δεν κάλυψε όσον αφορά την
πρακτική καθημερινή ανάπτυξη charts. Ακολουθούν κάποιες χρήσιμες αναφορές σε
άλλη τεκμηρίωση που θα σας βοηθήσουν καθώς δημιουργείτε νέα charts:

- Το [Artifact Hub](https://artifacthub.io/packages/search?kind=0) του CNCF είναι
  μια ανεκτίμητη πηγή charts.
- Η [τεκμηρίωση](https://kubernetes.io/docs/home/) του Kubernetes παρέχει
  λεπτομερή παραδείγματα για τα διάφορα είδη πόρων που μπορείτε να χρησιμοποιήσετε,
  από ConfigMaps και Secrets έως DaemonSets και Deployments.
- Ο [Οδηγός Charts](/topics/charts.md) του Helm εξηγεί τη ροή εργασίας της
  χρήσης charts.
- Ο [Οδηγός Chart Hooks](/topics/charts_hooks.md) του Helm εξηγεί πώς να
  δημιουργείτε lifecycle hooks.
- Το άρθρο [Συμβουλές και Κόλπα για Charts](/howto/charts_tips_and_tricks.md)
  του Helm παρέχει χρήσιμες συμβουλές για τη συγγραφή charts.
- Η [τεκμηρίωση του Sprig](https://github.com/Masterminds/sprig) περιγράφει
  περισσότερες από εξήντα συναρτήσεις template.
- Η [τεκμηρίωση των Go templates](https://godoc.org/text/template) εξηγεί
  λεπτομερώς τη σύνταξη template.
- Το [εργαλείο Schelm](https://github.com/databus23/schelm) είναι ένα εύχρηστο
  βοηθητικό εργαλείο για τον εντοπισμό σφαλμάτων σε charts.

Μερικές φορές είναι πιο εύκολο να κάνετε μερικές ερωτήσεις και να λάβετε απαντήσεις
από έμπειρους προγραμματιστές. Το καλύτερο μέρος για αυτό είναι τα κανάλια Helm
στο [Kubernetes Slack](https://kubernetes.slack.com):

- [#helm-users](https://kubernetes.slack.com/messages/helm-users)
- [#helm-dev](https://kubernetes.slack.com/messages/helm-dev)
- [#charts](https://kubernetes.slack.com/messages/charts)

Τέλος, αν βρείτε λάθη ή παραλείψεις σε αυτό το έγγραφο, θέλετε να προτείνετε
νέο περιεχόμενο ή θα θέλατε να συνεισφέρετε, επισκεφτείτε το [Helm
Project](https://github.com/helm/helm-www).
