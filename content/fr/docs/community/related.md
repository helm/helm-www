---
title: "Projets et documentation associés"
description: "Outils tiers, plugins et documentation fournis par la communauté !"
weight: 3
---

La communauté Helm a produit de nombreux outils supplémentaires, plugins et de la documentation sur Helm. Nous aimons entendre parler de ces projets.

Si vous avez quelque chose à ajouter à cette liste, n'hésitez pas à ouvrir une [issue](https://github.com/helm/helm-www/issues) ou une [pull request](https://github.com/helm/helm-www/pulls).

## Plugins Helm

- [helm-adopt](https://github.com/HamzaZo/helm-adopt) - Un plugin Helm v3 pour adopter des ressources k8s existantes dans un nouveau Chart Helm généré.
- [helm-chartsnap](https://github.com/jlandowner/helm-chartsnap) - Plugin de tests instantanés pour les Charts Helm.
- [Helm Diff](https://github.com/databus23/helm-diff) - Aperçu de `helm upgrade` sous forme de diff coloré
- [Helm Dt](https://github.com/vmware-labs/distribution-tooling-for-helm) - Plugin qui aide à distribuer les Charts Helm à travers les registres OCI et dans les environnements déconnecté
- [Helm Dashboard](https://github.com/komodorio/helm-dashboard) - Interface graphique pour Helm, permettant de visualiser les releases et les dépôts, ainsi que les différences de manifests.
- [helm-gcs](https://github.com/hayorov/helm-gcs) - Plugin pour gérer les dépôts sur Google Cloud Storage
- [helm-git](https://github.com/aslafy-z/helm-git) - Installer des charts et récupérer des fichiers de valeurs depuis vos dépôts Git
- [helm-k8comp](https://github.com/cststack/k8comp) - Plugin pour créer des Helm Charts à partir de hiera en utilisant k8comp
- [helm-mapkubeapis](https://github.com/helm/helm-mapkubeapis) - Mettre à jour les métadonnées des releases Helm pour remplacer les API Kubernetes obsolètes ou supprimées
- [helm-migrate-values](https://github.com/OctopusDeployLabs/helm-migrate-values) - Plugin pour migrer les valeurs spécifiées par l'utilisateur entre différentes versions d'un chart Helm afin de gérer les changements de schéma incompatibles dans le fichier `values.yaml`
- [helm-monitor](https://github.com/ContainerSolutions/helm-monitor) - Plugin pour surveiller une release et effectuer un rollback basé sur une requête Prometheus/ElasticSearch
- [helm-release-plugin](https://github.com/JovianX/helm-release-plugin) - Plugin pour la gestion des releases : mettre à jour les valeurs des releases, extraire (et recréer) les Helm Charts à partir des releases déployées, et définir le TTL des releases Helm.
- [helm-s3](https://github.com/hypnoglow/helm-s3) -Plugin Helm permettant d'utiliser AWS S3 comme [dépôt] privé de charts
- [helm-schema-gen](https://github.com/karuppiah7890/helm-schema-gen) - Plugin Helm qui génère un schéma YAML des valeurs pour vos Charts Helm 3
- [helm-secrets](https://github.com/jkroepke/helm-secrets) - Plugin pour gérer et stocker les secrets en toute sécurité (basé sur [sops](https://github.com/mozilla/sops))
- [helm-sigstore](https://github.com/sigstore/helm-sigstore) -
  Plugin pour Helm intégrant l'écosystème [sigstore](https://sigstore.dev/). Recherchez, téléchargez et vérifiez les Helm charts signés.
- [helm-tanka](https://github.com/Duologic/helm-tanka) - Plugin Helm pour rendre du Tanka/Jsonnet à l'intérieur des Charts Helm.
- [hc-unit](https://github.com/xchapter7x/hcunit) - Plugin pour tester les charts localement à l'aide d'OPA (Open Policy Agent) et Rego
- [helm-unittest](https://github.com/quintush/helm-unittest) - Plugin pour tester les charts localement avec YAML
- [helm-val](https://github.com/HamzaZo/helm-val) - Plugin pour récupérer les valeurs d'une release précédente.
- [helm-external-val](https://github.com/kuuji/helm-external-val) - Plugin qui récupère les valeurs Helm depuis des sources externes (ConfigMaps, Secrets, etc.).
- [helm-images](https://github.com/nikhilsbhat/helm-images) - Plugin Helm pour récupérer toutes les images possibles depuis le chart avant le déploiement ou depuis une release déployée.
- [helm-drift](https://github.com/nikhilsbhat/helm-drift) - Plugin Helm qui identifie la configuration ayant divergé du Helm chart.
- [helm-tui](https://github.com/pidanou/helm-tui) - Une interface légère pour gérer vos ressources Helm sans quitter le terminal

Nous encourageons également les auteurs sur GitHub à utiliser le tag [helm-plugin](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories) sur leurs dépôts de plugins.

## Outils additionnels

Outils superposés à Helm.

Voici la traduction des outils et plugins mentionnés :

- [Aptakube](https://aptakube.com/) - Interface bureau pour les versions Kubernetes et Helm
- [Armada](https://airshipit.readthedocs.io/projects/armada/en/latest/) - Gère les releases préfixées à travers divers namespaces Kubernetes et supprime les jobs terminés pour des déploiements complexes.
- [avionix](https://github.com/zbrookle/avionix) - Interface Python pour générer des Helm charts et des fichiers Kubernetes YAML, permettant l'héritage et moins de duplication de code.
- [Botkube](https://botkube.io) - Exécute des commandes Helm directement depuis Slack, Discord, Microsoft Teams et Mattermost.
- [Captain](https://github.com/alauda/captain) - Un contrôleur Helm3 utilisant HelmRequest et Release CRD.
- [Chartify](https://github.com/appscode/chartify) - Génère des Helm charts à partir de ressources Kubernetes existantes.
- [ChartMuseum](https://github.com/helm/chartmuseum) - Dépôt de Helm Charts avec support pour Amazon S3 et Google Cloud Storage.
- [chart-registry](https://github.com/hangyan/chart-registry) - Héberge des Helm Charts sur OCI Registry.
- [Codefresh](https://codefresh.io) - Plateforme CI/CD et de gestion native Kubernetes avec des tableaux de bord UI pour gérer les Helm charts et les releases.
- [Cyclops]https://cyclops-ui.com/) - Rendu dynamique d'une interface utilisateur Kubernetes basé sur des charts Helm
- [Flux](https://fluxcd.io/docs/components/helm/) - Livraison continue et progressive de Git à Kubernetes.
- [Helmfile](https://github.com/helmfile/helmfile) - Helmfile est un spécification déclarative pour déployer des Helm charts.
- [Helmper](https://github.com/ChristofferNissen/helmper) - Helmper vous aide à importer des Helm Charts - y compris tous les artefacts OCI (images), dans vos propres OCI registries. Helmper facilite également le scan de sécurité et le patch des images OCI. Helmper utilise Helm, Oras, Trivy, Copacetic et Buildkitd.
- [Helmsman](https://github.com/Praqma/helmsman) - Helmsman est un outil de type helm-charts-as-code qui permet d’installer, mettre à jour, protéger, déplacer et supprimer des releases à partir de fichiers d'état désiré versionnés (décrits dans un format TOML simple).
- [HULL](https://github.com/vidispine/hull) - Cette bibliothèque chart fournit une interface prête à l'emploi pour spécifier tous les objets Kubernetes directement dans le `values.yaml`. Elle élimine la nécessité d'écrire des templates pour vos charts et propose de nombreuses fonctionnalités supplémentaires pour simplifier la création et l'utilisation des Helm charts.
- [K8Studio](https://k8studio.io/) - Interface utilisateur de bureau pour la gestion des clusters Kubernetes avec un gestionnaire Helm intégré.
- [Konveyor Move2Kube](https://konveyor.io/move2kube/) - Génère des Helm charts pour vos projets existants.
- [Landscaper](https://github.com/Eneco/landscaper/) - "Landscaper prend un ensemble de références de Helm Chart avec des valeurs (un état désiré) et le réalise dans un cluster Kubernetes."
- [Monocular](https://github.com/helm/monocular) - Interface Web pour les dépôts de Helm Charts.
- [Monokle](https://monokle.io) - Outil de bureau pour créer, déboguer et déployer des ressources Kubernetes et des Helm Charts.
- [Orkestra](https://azure.github.io/orkestra/) - Une plateforme cloud-native d'orchestration des releases et de gestion du cycle de vie (LCM) pour un groupe de releases Helm et leurs sous-charts associés.
- [Tanka](https://tanka.dev/helm) - Grafana Tanka configure les ressources Kubernetes via Jsonnet avec la capacité de consommer des Helm Charts.
- [Terraform Helm Provider](https://github.com/hashicorp/terraform-provider-helm) - Le provider Helm pour HashiCorp Terraform permet la gestion du cycle de vie des Helm Charts avec une syntaxe déclarative d'infrastructure-as-code. Le provider Helm est souvent associé à d'autres providers Terraform, comme le provider Kubernetes, pour créer un flux de travail commun à travers tous les services d'infrastructure.
- [VIM-Kubernetes](https://github.com/andrewstuart/vim-kubernetes) - Plugin VIM pour Kubernetes et Helm.

## Helm Included

Plateformes, distributions et services qui incluent le support de Helm.

- [Kubernetic](https://kubernetic.com/) - Client bureau pour Kubernetes
- [Jenkins X](https://jenkins-x.io/) - CI/CD automatisé open source pour Kubernetes qui utilise Helm pour [promouvoir](https://jenkins-x.io/docs/getting-started/promotion/) des applications à travers les environnements via GitOps

## Divers 

Collection d'éléments utiles pour les auteurs de Charts et les utilisateurs de Helm.

- [Await](https://github.com/saltside/await) - Image Docker pour "attendre" différentes conditions, particulièrement utile pour les conteneurs d'initialisation. [Plus d'infos](https://blog.slashdeploy.com/2017/02/16/introducing-await/)
