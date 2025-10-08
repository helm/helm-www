---
title: "Release schedule policy"
description: "Describes Helm's release schedule policy."
---

For the benefit of its users, Helm defines and announces release dates in
advance.  This document describes the policy governing Helm's release schedule.

## Release calendar

A public calendar showing the upcoming Helm releases can be found [here](https://helm.sh/calendar/release).
## Semantic versioning

Helm versions are expressed as `x.y.z`, where `x` is the major version, `y` is
the minor version, and `z` is the patch version, following [Semantic
Versioning](https://semver.org/spec/v2.0.0.html) terminology.

## Patch releases

Patch releases provide users with bug fixes and security fixes.  They do not
contain new features.

A new patch release relating to the latest minor/major release will normally be
done once a month on the second Wednesday of each month.

A patch release to fix a high priority regression or security issue can be done
whenever needed.

A patch release will be cancelled for any of the following reasons:
- if there is no new content since the previous release
- if the patch release date falls within one week before the first release candidate (RC1) of an upcoming minor release
- if the patch release date falls within four weeks following a minor release

## Minor releases

Minor releases contain security and bug fixes as well as new features.  They
are backwards compatible with respect to the API and the CLI usage.

To align with Kubernetes releases, a minor helm release will be done every
4 months (3 releases a year).

Extra minor releases can be done if needed but will not affect the timeline of
an announced future release, unless the announced release is less than 7 days
away.

At the same time as a release is published, the date of the next minor release
will be announced and posted to Helm's main web page.

## Major releases

Major releases contain breaking changes.  Such releases are rare but are
sometimes necessary to allow helm to continue to evolve in important new
directions.

Major releases can be difficult to plan.  With that in mind, a final release
date will only be chosen and announced once the first beta version of such a
release is available.