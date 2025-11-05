---
title: "Helm @ KubeCon + CloudNativeCon NA '25"
slug: "helm-at-kubecon-na-25"
authors: ["karenchu"]
date: "2025-11-04"
---

The Helm team is headed to KubeCon + CloudNativeCon NA '25 in Atlanta, Georgia next week and it's truly a special one for us! This time around, as we celebrate our 10th birthday (fun fact, Helm was launched at the first KubeCon in 2015), we will also be releasing the highly anticipated Helm 4! Join us for a series of exciting activities throughout the week -- read on for more details! 

<!-- truncate -->

## Helm Booth in Project Pavilion

Don't miss out on meeting our project maintainers at the Helm booth - we'll be hanging out the second half of each day. Drop by to ask questions, learn about what's in Helm 4, and pick up special Hazel swag celebrating Helm's 10th birthday!

* TUES Nov 11 @ 03:30 PM - 07:45 PM ET 

* WED Nov 12 @ 02:00 PM - 05:00 PM ET

* THUR Nov 13 @ 12:30 PM - 02:00 PM ET

LOCATION: 8B, back side of Flux and across from Argo

## Tuesday November 11, 2025

### [Simplifying Advanced AI Model Serving on Kubernetes Using Helm Charts](https://sched.co/27FVb)

TIME: 12:00 PM - 12:30 PM ET

LOCATION: Building B | Level 4 | B401-402

SPEAKERS: [Ajay Vohra](https://kccncna2025.sched.com/speaker/ajayvohr) & [Caron Zhang](https://kccncna2025.sched.com/speaker/caronzh03)

The AI model serving landscape on Kubernetes presents practitioners with an overwhelming array of technology choices: From inference servers like Ray Serve and Triton Inference Server, inference engines like vLLM, and orchestration platforms like Ray Cluster and KServe. While this diversity drives innovation, it also creates complexity. Teams often prematurely standardize on limited technology stacks to manage this complexity.

This talk introduces an innovative Helm-based approach that abstracts the complexity of AI model serving while preserving the flexibility to leverage the best tools for each use case. Our solution is accelerator agnostic, and provides a consistent YAML interface for deploying and experimenting with various serving technologies.

We'll demonstrate this approach through two concrete examples of multi-node, multi-accelerator model serving with auto scaling: 1/ Ray Serve + vLLM + Ray Cluster, and 2/ LeaderWorkerSet + Triton Inference Server + vLLM + Ray Cluster + HPA.

## Wednesday November 12, 2025

### [Maintainer Track: Introducing Helm 4](https://sched.co/27Nme)

TIME: 11:00 AM - 11:30 AM ET

LOCATION: Building C | Level 3 | Georgia Ballroom 1

SPEAKERS: [Matt Farina](https://kccncna2025.sched.com/speaker/matt812) & [Robert Sirchia](https://kccncna2025.sched.com/speaker/robert_sirchia.28kd1wis) (Helm Maintainers)

The wait is over! After six years with Helm v3, Helm v4 is finally here. In this session you'll learn about Helm v4, why there was 6 years between major versions (from backwards compatible feature development to maintainer ups and downs), what's new in Helm v4, how long Helm v3 will still be supported, and what comes next. Could that include a Helm v5?

### [Contribfest: Hands-On With Helm 4: Wasm Plugins, OCI, and Resource Sequencing. Oh My!](https://sched.co/27Nl0)

TIME: 02:15pm - 03:30 PM ET

LOCATION: Building B | Level 2 | B207

SPEAKERS: [Andrew Block](https://kccncna2025.sched.com/speaker/ablock2), [Scott Rigby](https://kccncna2025.sched.com/speaker/r6by), & [George Jenkins](https://kccncna2025.sched.com/speaker/gvjenkins) (Helm Maintainers)

Join Helm maintainers for an interactive session contributing to core Helm and building integrations with some of Helm 4's emerging features. We'll guide contributors through creating Helm 4's newest enhancements including WebAssembly plugins, enhancements to how OCI content is manged, and implementing resource sequencing for controlled deployment order. Attendees will explore how to build Download/Postrender/CLI plugins in WebAssembly, develop capabilities related to changes to Helm's management of OCI content including repository prefixes and aliases, and use approaches for sequencing chart deployments beyond Helm's traditional mechanisms.

This session is geared toward anyone interested in Helm development including leveraging and building upon some of the latest features associated with Helm 4!

## [Helm 4 Release Party](https://replicated.typeform.com/helmparty)

TIME: 06:00 PM - 09:00 PM EST

LOCATION: [Max Lager's Wood-Fired Grill & Brewery](https://www.google.com/maps/place/Max+Lager's+Wood-Fired+Grill+%26+Brewery/@33.7633384,-84.3869351,16z/data=!3m1!4b1!4m6!3m5!1s0x88f50479f0b45fe9:0x8c53b75958299abd!8m2!3d33.7633384!4d-84.3869351!16s%2Fm%2F01_23gr)

[Replicated](https://www.replicated.com/) and the [CNCF](https://www.cncf.io/) are throwing a Helm 4 Release Party to celebrate the release of Helm 4! Drop by for a low country boil and hang out with the Helm project maintainers for the night! Don't forget to save your spot – RSVP [here](https://replicated.typeform.com/helmparty). 

## Thursday November 13, 2025

### [Mission Abort: Intercepting Dangerous Deletes Before Helm Hits Apply](https://sched.co/27FeJ)

TIME: 01:45 PM - 02:15 PM ET

LOCATION: Building B | Level 5 | Thomas Murphy Ballroom 4

SPEAKERS: [Payal Godhani](https://kccncna2025.sched.com/speaker/godhanipayal)

What if your next Helm deployment silently deletes a LoadBalancer, a Gateway, or an entire namespace? We’ve lived that nightmare—multiple times. In this talk, we’ll share how we turned painful Sev1 outages into a resilient, guardrail-first deployment strategy. By integrating Helm Diff and Argo CD Diff, we built a system that scans every deployment for destructive changes—like the removal of LoadBalancers, KGateways, Services, PVCs, or Namespaces—and blocks them unless explicitly approved. This second-layer approval acts as a safety circuit for your release pipelines. No guesswork. No blind deploys. Just real-time visibility into what’s about to break—before it actually does. Whether you’re managing a single cluster or an entire fleet, this talk will show you how to stop fearing Helm and start trusting it again. Because resilience isn’t about avoiding failure—it’s about learning, adapting, and building guardrails that protect everyone.

