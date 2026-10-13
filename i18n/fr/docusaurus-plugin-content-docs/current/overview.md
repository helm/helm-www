---
sidebar_position: 1
sidebar_label: Présentation de Helm 4
default_lang_commit: 4ade36c87e9f892bb2fa45ee3511ae133db7c478
---

# Présentation de Helm 4

Helm v4 marque une évolution importante par rapport à la v3 : il introduit des changements incompatibles, de nouveaux modèles d'architecture et des fonctionnalités enrichies, tout en restant rétrocompatible pour les charts.

Pour en savoir plus sur les étapes prévues de la sortie de Helm 4, consultez [Path to Helm v4](https://helm.sh/blog/path-to-helm-v4/).

## Nouveautés {#whats-new}

Cette section présente les nouveautés de Helm 4 : changements incompatibles, nouvelles fonctionnalités majeures et autres améliorations. Pour tous les détails techniques, consultez le [changelog complet](/changelog.md).

### Résumé {#summary}

- **Nouvelles fonctionnalités** : plugins basés sur Wasm, watcher kstatus, prise en charge des digests OCI, valeurs multi-documents, arguments JSON
- **Changements d'architecture** : système de plugins entièrement repensé, réorganisation des packages, options de la CLI renommées, passage à des packages versionnés, prise en charge des charts v3, cache fondé sur le contenu
- **Modernisation** : migration vers slog, passage à Go 1.24, nettoyage des dépendances
- **Sécurité** : prise en charge améliorée d'OCI et des registres, améliorations TLS

### Changements incompatibles {#breaking-changes}

#### Post-renderers implémentés comme plugins {#post-renderers-implemented-as-plugins}
Les post-renderers sont implémentés comme plugins. Avec ce changement, il n'est plus possible de passer directement un exécutable à l'option `--post-renderer` de `helm install`, `helm upgrade` ou `helm template` : il faut passer un nom de plugin. Les workflows de post-rendu existants peuvent donc nécessiter des adaptations.

#### La connexion au registre n'accepte plus d'URL complète {#registry-login-does-not-accept-full-urls}
En v4, la commande `helm registry login` s'utilise uniquement avec le nom de domaine.
L'objectif est de pouvoir, à terme, restreindre la portée de la connexion à différents niveaux d'un registre.

### Nouvelles fonctionnalités {#new-features}

#### Refonte du système de plugins {#plugin-system-overhaul}
Helm 4 introduit un runtime optionnel basé sur WebAssembly, pour plus de sécurité et davantage de possibilités. Les plugins existants continuent de fonctionner, mais le nouveau runtime ouvre une plus grande partie du cœur de Helm à la personnalisation par plugins. Helm 4 est livré avec trois types de plugins : plugins CLI, plugins getter et plugins post-renderer, ainsi qu'un système qui permet de créer de nouveaux types de plugins pour personnaliser d'autres fonctionnalités du cœur. Consultez [système de plugins (HIP-0026)](https://github.com/helm/community/blob/main/hips/hip-0026.md) et les [exemples de plugins Helm 4](https://github.com/scottrigby/h4-example-plugins).

:::tip
Les plugins existants fonctionnent comme avant. Le nouveau runtime WebAssembly est optionnel, mais recommandé pour une sécurité renforcée.
:::

#### Meilleur suivi des ressources {#better-resource-monitoring}
La nouvelle intégration de kstatus affiche l'état détaillé de vos déploiements. Testez-la avec des applications complexes pour voir si elle détecte mieux les problèmes.

#### Prise en charge OCI améliorée {#enhanced-oci-support}
Installez des charts par digest pour mieux sécuriser votre chaîne d'approvisionnement. Par exemple : `helm install myapp oci://registry.example.com/charts/app@sha256:abc123...`. Les charts dont le digest ne correspond pas ne sont pas installés.

#### Valeurs multi-documents {#multi-document-values}
Répartissez des valeurs complexes sur plusieurs fichiers YAML. Idéal pour tester différentes configurations d'environnement.

#### Server-side apply {#server-side-apply}
Meilleure résolution des conflits quand plusieurs outils gèrent les mêmes ressources. À tester dans des environnements avec des opérateurs ou d'autres contrôleurs.

Par défaut, Helm 4 utilise le server-side apply lors de l'installation d'une nouvelle release.

Lors d'une mise à niveau (ou d'une restauration), Helm reprend par défaut la méthode d'application précédente de la release.
Ce maintien de la méthode d'origine garantit la continuité de fonctionnement des releases existantes qui utilisaient le client-side apply.
Vous pouvez passer outre en définissant explicitement l'option `--server-side`.

Ainsi, toutes les releases créées par Helm 3 continuent d'utiliser par défaut le client-side apply après le passage à Helm 4.

#### Fonctions de template personnalisées {#custom-template-functions}
Étendez les templates de Helm avec vos propres fonctions grâce aux plugins. Idéal pour les besoins de templating propres à votre organisation.

#### Post-renderers en tant que plugins {#post-renderers-as-plugins}
Les post-renderers sont implémentés comme plugins, ce qui offre une meilleure intégration et davantage de possibilités.

#### API du SDK stable {#stable-sdk-api}
Les changements incompatibles de l'API sont désormais achevés. Testez-la, essayez de la casser, faites-nous part de vos retours ! L'API permet aussi de nouvelles versions de charts, ce qui ouvre la voie à de nouvelles fonctionnalités dans les charts v3 à venir.

#### Charts v3 {#charts-v3}

Les charts v3 sont en début de développement et disponibles à titre expérimental.
Les charts v2 continuent de fonctionner sans changement.

Pour utiliser les charts v3 :

1. Définissez la variable d'environnement `HELM_EXPERIMENTAL_CHART_V3` :

   ```shell
   export HELM_EXPERIMENTAL_CHART_V3=1
   ```

1. Créez un nouveau chart avec la version d'API v3 :

   ```shell
   helm create --chart-api-version=v3 mychart
   ```

:::warning
Les charts v3 sont expérimentaux.
Des fonctionnalités peuvent changer ou disparaître avant la version finale.
À utiliser uniquement pour des tests et des retours.
:::

### Améliorations {#improvements}

#### Performances {#performance}
Résolution des dépendances plus rapide et nouveau cache de charts fondé sur le contenu.

#### Messages d'erreur {#error-messages}
Des messages d'erreur plus clairs et plus utiles.

#### Authentification aux registres {#registry-authentication}
Meilleure prise en charge d'OAuth et des jetons pour les registres privés.

#### Options de la CLI renommées {#cli-flags-renamed}

Certaines options courantes de la CLI sont renommées pour mieux refléter leur rôle.
Les anciennes options restent disponibles, mais affichent un avertissement d'obsolescence :

- `--atomic` → `--rollback-on-failure`
- `--force` → `--force-replace`

Mettez à jour toute automatisation qui utilise ces options renommées.

#### Options de la CLI obsolètes {#cli-flags-deprecated}

Les options suivantes de `helm template` sont obsolètes et seront supprimées dans Helm 5 :

- `--hide-notes`
- `--render-subchart-notes`

Ces options n'ont aucun effet, car la sortie de `helm template` n'inclut jamais les notes. Elles restent dans Helm 4 pour la rétrocompatibilité, mais n'apparaissent plus dans l'aide.

## Passer à Helm 4 {#upgrading-to-helm-4}

Nous faisons tout pour que Helm 4 soit fiable pour tous, mais il est tout nouveau. C'est pourquoi nous avons rassemblé ci-dessous quelques conseils sur les points à surveiller quand vous testez Helm 4 avec vos workflows existants, avant de migrer. Comme toujours, tous les retours sont les bienvenus : ce qui fonctionne, ce qui casse et ce qui pourrait être amélioré.

### Priorité haute {#high-priority}
* Testez vos charts et releases existants pour vérifier qu'ils fonctionnent toujours avec la v4.
* Testez les trois types de plugins (CLI, getter, post-renderer).
* Essayez de créer des plugins WebAssembly avec le nouveau runtime (voir les [exemples de plugins](https://github.com/scottrigby/h4-example-plugins)).
* Utilisateurs du SDK : testez l'API désormais stable. Essayez de la casser et partagez vos retours.
* Testez vos pipelines CI/CD et corrigez les erreurs de scripts dues aux options renommées de la CLI.
* Testez vos intégrations de post-renderers.
* Testez l'authentification aux registres et l'installation de charts dans vos workflows OCI.

### Autres {#other}
* Testez les autres nouvelles fonctionnalités, notamment les valeurs multi-documents, l'installation par digest et les fonctions de template personnalisées.
* Testez les performances de Helm 4 avec des charts volumineux et complexes pour voir s'il est nettement plus rapide pour vos charges de travail.
* Essayez volontairement de tout casser pour voir si les nouveaux messages d'erreur vous aident.

### Retours {#feedback}
* Quels autres types de plugins aimeriez-vous voir ajouter pour personnaliser le cœur de Helm ?
* Maintenant que l'API prend en charge d'autres versions de charts, quelles nouvelles fonctionnalités voudriez-vous dans les charts v3 ?

## Comment faire un retour {#how-to-give-feedback}

Vous avez trouvé un problème ? Vous avez des suggestions ? Nous sommes à votre écoute :

### Issues GitHub {#github-issues}

Consultez la [liste des issues et demandes de fonctionnalités ouvertes](https://github.com/helm/helm/issues) du dépôt Helm. Commentez les éléments existants ou [ouvrez de nouvelles issues et demandes](https://github.com/helm/helm/issues/new/choose).

### Slack de la communauté {#community-slack}

Rejoignez ces canaux du [Slack Kubernetes](https://slack.kubernetes.io/) :
- `#helm-dev` pour les discussions sur le développement
- `#helm-users` pour l'aide aux utilisateurs et les retours de tests

### Réunions hebdomadaires des développeurs {#weekly-dev-meetings}

Rejoignez la discussion en direct avec les mainteneurs chaque jeudi à 9 h 30 (heure du Pacifique) sur [Zoom](https://zoom-lfx.platform.linuxfoundation.org/meeting/91295593969?password=17825db5-c698-44cc-9f00-ef1f61f5d3fb).

Pour d'autres moyens de nous contacter, consultez les [informations de communication](https://github.com/helm/community/blob/main/communication.md) de la communauté Helm.
