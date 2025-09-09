---
title: "Path To Releasing Helm v4"
slug: "path-to-helm-v4"
authorname: "Matt Farina"
author: "@mattfarina"
authorlink: "https://mattfarina.com/"
date: "2025-09-09"
---

The [first Alpha for Helm v4](https://github.com/helm/helm/releases/tag/v4.0.0-alpha.1) has been released. Now that Helm v4 development is in the home stretch, we wanted to share the details on what's happening and how the broader community can get involved.<!--more-->

## Alpha Period

With the start of September, there is a freeze on new major features for Helm v4. This begins the Alpha phase, where API breaking changes will still happen, but the focus turns to stability and making sure the existing changes work as expected.

If you're a Helm user, during this period you can test out the current capabilities and provide feedback where things aren't working as expected. Just remember, this is alpha quality software and changes are still occurring.

For Helm SDK users, now is a good time to look at the API to see if there are any concerns with the design changes along with any impacts to your efforts.

The Alpha period runs through the month of September.

## Beta Period

The beta period starts in October. At this point the focus is on stability in preparation for release. API breaking changes should be complete and the focus transitions to fixing any bugs to ensure there is a stable release.

Testers should file bugs as they encounter any issues.

Per [release schedule policy](https://helm.sh/docs/topics/release_policy/#major-releases), once the first beta version is available, the final 4.0.0 release date will be chosen and announced.

## Release Candidates

At the end of October, the first release candidate will be created. This represents what we think will be released as Helm v4. If there are any major issues, they will be fixed and a new release candidate will be made.

## 🎉 Release 🎉

The release is planned for KubeCon + CloudNativeCon North America 2025. in mid November, which is 6 years after the release of Helm v3 and 10 years after the creation of Helm. More details on the release will come.
