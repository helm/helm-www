---
title: "The Road to Helm 4"
slug: "the-road-to-helm-4"
authorname: "Helm Maintainers"
author: "@HelmPack"
authorlink: "https://helm.sh"
date: "2024-07-10"
---

We have been saying it for a while now – Helm is "stable software". That should not come as a surprise to anyone familiar with Kubernetes and the surrounding ecosystem as many within the Kubernetes community consider Helm to be the de-facto package manager. The use of Helm is far reaching: from open source community projects, to startups, to Fortune 500 organizations. Helm has become an essential component of build and deployment workflows that handle mission critical workloads.

One of the primary tenets that the Helm project takes very seriously is its policy related to [backwards compatibility](https://github.com/helm/helm/blob/main/CONTRIBUTING.md#semantic-versioning). This strict adherence towards limiting impacts that could adversely affect end consumers is one of the primary reasons why Helm has become such a stable project that the community can count on. Unfortunately, Helm’s backwards compatibility policy does impose limitations to the types of changes or features that can be introduced. It is important to note that Helm is not just a CLI tool, but it is also an SDK. The Helm SDK supports an entire ecosystem of solutions that have been developed to manage Helm content. Any breaking change could negatively impact one of those integrations.

However, even with strong adherence to the types of changes that the project can make, Helm has been able to introduce new features over time since Helm 3 was released back in 2019. The first such feature, included in Helm 3.1.0, was [post rendering functionality](https://helm.sh/docs/topics/advanced), which allows end users to customize rendered manifests before being installed or upgraded by Helm. Allowing a post rendering step in the Helm release lifecycle was a game changer for both end users and chart maintainers alike. Users no longer have to patch, fork, or manually render chart templates locally to make their custom adjustments. As a result, chart maintainers no longer need to make their charts overly complicated to fit every possible use case under the sun. Since then, minor (new feature) versions of Helm have been released on a quarterly schedule, and continue to bring ever more functionality to end users. Another important new feature introduced during Helm 3 was the support for [OCI registries as a distribution method](https://helm.sh/docs/topics/registries/#using-an-oci-based-registry) for charts. Functionality for this experimental feature shipped with Helm 3.0.0 and became a fully functional feature in 3.8.0. Users of the CLI as well as the SDK could now confidently store charts using the same tried and true method as they store the container images. And, because charts stored in container registries follow OCI standards, Helm users and chart maintainers can use many of the same tools made for container images – which continue to be improved every day – to accomplish those tasks with their Helm charts too. Helm helped bring greater standardization to the wider Cloud Native ecosystem as it was one of the first projects that made use of OCI as a storage mechanism, which has helped popularize the use of OCI artifacts by other projects. A complete list of new Helm features can be found in the release notes of each minor version [here](https://github.com/helm/helm/releases).

The success of Helm is partially related to the architectural changes that were introduced in Helm 3. Gone are the days of the server side component, Tiller (which limited the use of Helm within multi-tenant), and security conscious environments. Countless other enhancements were also introduced that set Helm version 3 apart from its predecessors.

Businessman Marcus Lemonis said it best: “If you don’t evolve, you will die”. This sentiment is very much a fact, especially in the technology industry where new tools, approaches, and architectures are introduced with each passing day. It has been 5 years since the release of Helm version 3 and it has become clear, thanks to input from the community, that more impactful changes need to be made to the project so that Helm can continue to serve as an efficient package manager for Kubernetes. That being said, the Helm community is excited to announce the initial kickoff to pave a path toward Helm version 4.

## Helm 4 ContribFest at KubeCon EU 2024

It’s often asked: “Is Helm Popular?”. Based on responses from attendees at events, like KubeCon, who fill sessions relating to the project to maximum capacity, the answer continues to remain a resounding “YES”. At the 2024 KubeCon EU in Paris, the first steps towards soliciting feedback from the Open Source community regarding the next version of Helm occurred during the ContribFest in a session titled, “Building the Helm 4 Highway”. Clearly, there is an interest in evolving the capabilities that are part of the Helm project. Not only was the session full, but a number of compelling ideas were shared including adding support for additional templating languages other than golang, expanding the use of plugins, and increasing the level of support surrounding the secure software supply chain, such as additional methods of signing charts. The full list of ideas and topics from the ContribFest session can be found [here](https://docs.google.com/document/d/1WJ3K96fJeldKHoKhejWHDvCOTddEvY-RCtQBUaZ57FM/edit#heading=h.2xqu5w422ice).

## Getting Involved

For those interested in playing a role in the next version of Helm (we’d love to have you), there are several different ways to participate!

1. Join the weekly Helm 4 Roadmap meeting Fridays at 19:00 UTC where members of the community share ideas, develop solutions, and collaborate surrounding the next version of Helm. 
    1. [Zoom Meeting](https://zoom.us/j/696660622?pwd=MGsraXZ1UkVlTkJLc1B5U05KN053QT09).
2. Participate in discussions in the [#helm-dev](https://kubernetes.slack.com/archives/C51E88VDG) channel on the Kubernetes Slack, where members of the Helm community collaborate on Helm development efforts, including those focused on Helm version 4.
3. Submit an [issue](https://github.com/helm/helm/issues) within the Helm [GitHub repository](https://github.com/helm/helm).
4. Follow [@HelmPack](https://x.com/HelmPack) on Twitter/X for project updates.

Helm helped define how to package and manage software for Kubernetes. But let’s not stop there - as we update and develop new features and capabilities in Helm 4, Helm will continue to be a tool that the community can continue to leverage confidently to find, share, and run software on Kubernetes.
