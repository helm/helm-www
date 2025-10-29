---
title: "Helm Chart Repository Deprecation Update"
slug: "charts-repo-deprecation"
authors: ["viciglesias"]
date: "2020-10-30"
---

Back in 2019, when the Helm v2 support timeline and end of life plan was announced, [the deprecation](https://github.com/helm/charts#deprecation-timeline) of the [helm/charts GitHub repository](https://github.com/helm/charts) was announced, as well. The primary reason for the deprecation is the significant increase in upkeep for the [repo maintainers](https://github.com/helm/charts/blob/master/OWNERS). Over the last couple of years the number of charts under maintenance increased from ~100 to 300+ causing a commensurate increase in pull requests and updates to the repo. Unfortunately, despite many efforts to automate review and maintenance tasks, the amount of time available from maintainers has not increased.<!-- truncate -->

When we announced the deprecation we also began to share the tools and guidance that we had used to maintain the helm/charts repo. For folks that want to host and maintain their own repositories you now have these tools available to streamline the process:

- [Chart Testing](https://github.com/helm/chart-testing) provides linting and testing for PRs against your charts
- [Chart Releaser](https://github.com/helm/chart-releaser) provides tooling to help you host your own chart repo with GitHub Releases and Pages used to host your artifacts
- [Testing and Releasing Github Actions](https://github.com/helm?q=chart+action) to automate the tooling described above using GitHub Actions

With these tools available we've enabled many charts to [migrate to their own repositories](https://github.com/helm/charts/issues/21103) for active maintenance.

## Key Dates and Recommended Actions

There has been refinement to the plans and confusion/questions about what happens next, so we wanted to provide a timeline of key events and **recommended actions** moving forward:

* Nov 2, 2020 - READMEs for all non-deprecated charts will get a note added, stating that they will no longer be updated
    * **RECOMMENDED ACTION** - If you depend on a chart in the Charts repository look for the new official location. If one does not exist, consider adopting the chart.
* Nov 6, 2020 the stable and incubator charts repos will be removed from the [Artifact Hub](https://artifacthub.io/)
    * **RECOMMENDED ACTION** - None
* Nov 13, 2020 - CI on the [helm/charts repository](https://github.com/helm/chart) will be disabled and no more Pull Requests will be accepted.
    * **RECOMMENDED ACTION** - For more info on the ongoing initiative to relocate charts to new repos please see [this issue](https://github.com/helm/charts/issues/21103).
* *After* Nov 13, 2020 - Downloads of Charts at their old locations will be re-directed to the read-only archive available in GitHub Pages. The old locations may no longer be available after this date.
    * **RECOMMENDED ACTION** - See info on [switching to the archived stable and incubator charts](https://helm.sh/docs/faq/#i-am-getting-a-warning-about-unable-to-get-an-update-from-the-stable-chart-repository). Keep in mind that these charts will no longer be updated with bug fixes or security patches.


## References

* [Charts Repo Deprecation Timeline](https://github.com/helm/charts/issues/23944)
* [Relocation of package history](https://github.com/helm/charts/issues/23850)
* [Request to transition Helm Chart hosting to CNCF](https://github.com/helm/community/issues/114)
