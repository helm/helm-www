---
title: "Helm Security Audit Results"
authors: ["mattfarina"]
date: "2019-11-04"
---

Today, the Helm Maintainers are proud to announce that we have successfully completed a 3rd party security audit for Helm 3. Helm has been recommended for public deployment.

A security audit is part of the graduation criteria for CNCF projects. Specifically, the [graduation criteria](https://github.com/cncf/toc/blob/main/process/graduation_criteria.adoc#graduation-stage) says:

> Have completed an independent and third party security audit with results published of similar scope and quality as the following example (including critical vulnerabilities addressed): https://github.com/envoyproxy/envoy#security-audit and all critical vulnerabilities need to be addressed before graduation.<!-- truncate -->

During October, the CNCF funded [Cure53](https://cure53.de/) to perform a security audit of Helm version 3. Cure53 has performed audits of other CNCF projects including Prometheus, Envoy, Jaeger, Notary, and others.

A [report from the security audit is available in the Helm community repo](https://github.com/helm/community/blob/main/security-audit/HLM-01-report.pdf). We recommend that you take a look at it for the details. The report covers their process, what they reviewed, and what they found. Their review included, but was not limited to:

* The programming language used along with patterns and the use of external libraries
* Access control which is different in Helm v3 than in Helm v2 due to the removal of Tiller
* How logging and monitoring are handled
* Unit and regression testing
* Documentation, including the security contacts and process
* The process for fixing security issues
* The software used for signing and verification of Helm charts
* Manipulation of chart files
* TLS handling for communications

From the Cure53 analysis there was only one noteworthy finding and it did not lead not an exploit. While the audit and issue were found to be in Helm v3 we also found the issue was present in Helm v2. Since Helm v2 has stable releases we announced a [security vulnerability](https://helm.sh/blog/2019-10-30-helm-symlink-security-notice/) and created a CVE.

The [entire report](https://github.com/helm/community/blob/main/security-audit/HLM-01-report.pdf) is worth reading as no summary can do it justice. Cure53 provided a conclusion as part of their summary which reads:

> To conclude, in light of the findings stemming from this CNCF-funded project, Cure53 can only state that the Helm project projects the impression of being highly mature. This verdict is driven by a number of different factors described above and essentially means that Helm can be recommended for public deployment, particularly when properly configured and secured in accordance to recommendations specified by the development team.

Security audits are one of the benefits of CNCF projects and we are grateful for them and the analysis performed by Cure53. This analysis has provided some concrete areas we can work to improve and given us confidence in what we have.
