---
title: Το αρχείο .helmignore
description: Το αρχείο `.helmignore` χρησιμοποιείται για τον καθορισμό αρχείων που δεν θέλετε να συμπεριλάβετε στο helm chart σας.
sidebar_position: 12
---

Με το αρχείο `.helmignore` καθορίζετε τα αρχεία που δεν θέλετε να
συμπεριλάβετε στο helm chart σας.

Εάν υπάρχει αυτό το αρχείο, η εντολή `helm package` θα αγνοήσει όλα τα αρχεία
που ταιριάζουν με τα μοτίβα που καθορίζονται στο `.helmignore` κατά τη
δημιουργία του πακέτου της εφαρμογής σας.

Αυτό βοηθά στην αποφυγή προσθήκης περιττών ή ευαίσθητων αρχείων και καταλόγων
στο helm chart σας.

Το αρχείο `.helmignore` υποστηρίζει αντιστοίχιση μοτίβων Unix shell glob,
αντιστοίχιση σχετικών διαδρομών και άρνηση (με πρόθεμα !). Λαμβάνεται υπόψη
μόνο ένα μοτίβο ανά γραμμή.

Ακολουθεί ένα παράδειγμα αρχείου `.helmignore`:

```
# comment {#comment}

# Match any file or path named .helmignore {#match-any-file-or-path-named-helmignore}
.helmignore

# Match any file or path named .git {#match-any-file-or-path-named-git}
.git

# Match any text file {#match-any-text-file}
*.txt

# Match only directories named mydir {#match-only-directories-named-mydir}
mydir/

# Match only text files in the top-level directory {#match-only-text-files-in-the-top-level-directory}
/*.txt

# Match only the file foo.txt in the top-level directory {#match-only-the-file-footxt-in-the-top-level-directory}
/foo.txt

# Match any file named ab.txt, ac.txt, or ad.txt {#match-any-file-named-abtxt-actxt-or-adtxt}
a[b-d].txt

# Match any file under subdir matching temp* {#match-any-file-under-subdir-matching-temp}
*/temp*

*/*/temp*
temp?
```

Ορισμένες αξιοσημείωτες διαφορές από το .gitignore:
- Η σύνταξη '**' δεν υποστηρίζεται.
- Η βιβλιοθήκη globbing είναι η `filepath.Match` της Go, όχι η fnmatch(3)
- Τα τελικά κενά αγνοούνται πάντα (δεν υπάρχει υποστηριζόμενη ακολουθία διαφυγής)
- Δεν υπάρχει υποστήριξη για το '\!' ως ειδική αρχική ακολουθία.
- Το αρχείο δεν εξαιρεί τον εαυτό του από προεπιλογή· πρέπει να προσθέσετε ρητά μια καταχώρηση για το `.helmignore`


**Θα εκτιμούσαμε τη βοήθειά σας** για τη βελτίωση αυτού του εγγράφου. Για να
προσθέσετε, διορθώσετε ή αφαιρέσετε πληροφορίες,
[υποβάλετε ένα issue](https://github.com/helm/helm-www/issues) ή στείλτε μας ένα
pull request.
