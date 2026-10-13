---
title: "Security Notice: Former Helm APT Mirror Domain `baltocdn.com` Statement"
slug: "security-notice-baltocdn"
authors: ["georgejenkins", "andrewblock"]
date: "2026-05-29"
---

The Helm Security Team has received third-party reports that the ownership on the former community-maintained Debian/Ubuntu APT mirror domain, `baltocdn.com`, has changed after `baltocdn.com`'s original registration lapsed.
And as a result, the new owners may be using the domain to serve malicious content.

<!-- truncate -->

We are publishing this notice to raise awareness for Helm users who may still have the configuration of their APT package manager referencing `baltocdn.com`.
`baltocdn.com` was previously used as the APT mirror for Helm distribution for many years, but it is no longer a Helm APT mirror, and must not be used to manage Helm.

## Summary

The former Helm APT mirror domain `baltocdn.com` was decommissioned in September 2025.
Since decommissioning, attempts to access or download Helm packages from `baltocdn.com` should have failed due to the underlying serving infrastructure having been shut down.

The domain registration for `baltocdn.com` later expired and the domain was re-registered by a [third party](https://www.dynadot.com/domain/whois?domain=baltocdn.com) on May 19, 2026. As a result, users, systems, or automation still attempting to download Helm packages from `baltocdn.com` could be directed to content controlled by the new domain registrant.

At this time, the Helm Security Team has received third-party reports that the domain may have been repurposed to serve malicious content. We have not independently confirmed those reports. However, as the domain is no longer controlled by the previous APT repository operator and is no longer a Helm distribution endpoint, any continued use of `baltocdn.com` represents a potential supply chain risk.

## Affected users

You may be affected if any Debian or Ubuntu based systems, APT repositories, CI jobs, container images, installation scripts, bootstrap scripts, configuration management templates, or internal documentation still reference:

`baltocdn.com`

Any user who executed binaries sourced from `baltocdn.com` after May 19, 2026 should consider the affected system compromised and follow their normal incident response procedures.

Users who have legacy references to `baltocdn.com` but have not attempted to install or update Helm from that domain after May 19, 2026 should still remove those references immediately using the steps below.

## **Remediation**

Please ensure that all Debian/Ubuntu APT-based Helm installations use the current APT repository:

[https://packages.buildkite.com/helm-linux/helm-debian](https://packages.buildkite.com/helm-linux/helm-debian)

Review your systems and repositories for any remaining references to `baltocdn.com` and replace them with the current installation instructions.

The current Helm APT installation instructions are available at the link below:

[https://helm.sh/docs/intro/install/\#from-apt-debianubuntu](https://helm.sh/docs/intro/install/#from-apt-debianubuntu)

Recommended actions:

1. Remove any APT source entries that reference `baltocdn.com`.
2. Update Debian/Ubuntu APT-based Helm installation configuration to use `packages.buildkite.com`.
3. Review CI/CD pipelines, Dockerfiles, bootstrap scripts, configuration management, and internal documentation for legacy references.
4. Treat any system that executed binaries sourced from `baltocdn.com` after May 19, 2026 as potentially compromised.
5. Follow your organization’s incident response process if you believe a system may have downloaded or executed content from the repurposed domain.
6. Disable access (corporate proxy/firewall, etc) to `baltocdn.com`. Since the site was previously  decommissioned and no longer serving content related to the Helm project, limiting access will not break existing workflows.

## About the Helm APT repository

The Helm Debian/Ubuntu APT [repository](https://packages.buildkite.com/helm-linux/helm-debian/) (and its `baltocdn.com` predecessor) is gratefully community maintained. It is not directly supported by the Helm maintainers.

The Helm project provides official methods for installing Helm from binary releases and from the Helm install script. Community-provided package manager installation methods, including APT, are documented for user convenience but are not directly supported by the Helm project.

## Engage with the Helm Community

The Helm project provides multiple ways to interact with the community which include Slack channels and the weekly developers meeting. Members of the Helm security team and maintainers are present within these forums and, along with the rest of the community, can address questions or concerns related to Helm related topics.

## Reporting security concerns

For more information about reporting security concerns associated with the Helm project, please see the Helm Security Process and Policy documentation:

[https://helm.sh/community/security/](https://helm.sh/community/security/)

## Conclusion

`baltocdn.com` is no longer a Helm APT mirror and should not be used to install and manage Helm.
Users should migrate any remaining Debian/Ubuntu APT-based Helm installation configuration to `packages.buildkite.com` and review their environments for legacy references to the former domain to mitigate potential security concerns.
