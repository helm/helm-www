---
title: "Helm’s First Patch Wednesday"
slug: "helm-release-process"
authors: ["mattfarina"]
date: "2020-11-11"
---

Helm recently adopted [a release schedule for minor and patch releases](https://github.com/helm/community/blob/main/hips/hip-0002.md). Today, the second Wednesday in November 2020, marks the first release under the new schedule. This release schedule provides predictability to those who use Helm, contribute to Helm, and maintain Helm.<!-- truncate -->

The release schedule generally follows these rules:

* Patch releases happen on the 2nd Wednesday of the month when there isn't a major or minor release. This will happen if there are changes that could be released.
* Minor releases will roughly align with Kubernetes releases and have three to four month development windows, as Kubernetes does. These releases will lag behind Kubernetes so that Helm can be updated and tested for any changes to Kubernetes.
* When a minor version is released the next minor version will be scheduled. The date will be published to https://helm.sh/. For example, v3.5.0 is scheduled for Wednesday January 13th. Instead of a patch release that day there will be a minor release.
* Security releases do not need to follow any of these rules. They will be released as needed.

A calendar of upcoming dates for releases can be found on the calendar at https://helm.sh/calendar/release. This is a redirect to the calendar.

More details can be found in [Helm Improvement Proposal 2](https://github.com/helm/community/blob/main/hips/hip-0002.md).
