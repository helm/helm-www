---
title: "Helm Moves To DCO"
slug: "helm-dco"
date: "2018-08-27"
---

When Helm was part of the Kubernetes project it, like the rest of Kubernetes, used the [CNCF Contributor License Agreement (CLA)](https://github.com/cncf/cla). This served Helm well for years. But, most of the CNCF projects use a [Developers Certificate of Origin (DCO)](https://developercertificate.org/) instead of a CLA. The exceptions are Kubernetes and gRPC. Upon Helm becoming a CNCF project itself we were asked if we wanted to move Helm to a DCO. After some careful consideration and a little research, the Helm maintainers voted to move to a DCO.  <!-- truncate -->
## What Does This Solve? Why Switch?

Making a change like this should have a good reason and we have one. It is often easier to get started contributing under a DCO than a CLA.

When one is developing software for a company they need to have the company sign the Corporate CLA prior to submitting contributions. That means there is a step after the business decides to contribute where legal documents need to be signed and exchanged. Once this is done there are steps to associate people with those legal documents. All of this takes time. In some companies this process can take weeks or longer.

We wanted to make it simpler to contribute.

## What Is A DCO?

A DCO is lightweight way for a developer to certify that they wrote or otherwise have the right to submit code or documentation to a project. The way a developer does this is by adding a `Signed-off-by` line to a commit. When they do this they are agreeing to the DCO.

The full text of the DCO can be found at https://developercertificate.org. It reads:

> Developer Certificate of Origin
> Version 1.1
>
> Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
> 1 Letterman Drive
> Suite D4700
> San Francisco, CA, 94129
> 
> Everyone is permitted to copy and distribute verbatim copies of this
> license document, but changing it is not allowed.
> 
> 
> Developer's Certificate of Origin 1.1
> 
> By making a contribution to this project, I certify that:
> 
> (a) The contribution was created in whole or in part by me and I
>     have the right to submit it under the open source license
>     indicated in the file; or
> 
> (b) The contribution is based upon previous work that, to the best
>     of my knowledge, is covered under an appropriate open source
>     license and I have the right under that license to submit that
>     work with modifications, whether created in whole or in part
>     by me, under the same open source license (unless I am
>     permitted to submit under a different license), as indicated
>     in the file; or
> 
> (c) The contribution was provided directly to me by some other
>     person who certified (a), (b) or (c) and I have not modified
>     it.
> 
> (d) I understand and agree that this project and the contribution
>     are public and that a record of the contribution (including all
>     personal information I submit with it, including my sign-off) is
>     maintained indefinitely and may be redistributed consistent with
>     this project or the open source license(s) involved.

An example signed commit message might look like:

> An example commit message
> 
> Signed-off-by: Some Developer <somedev@example.com>

Git has a flag that can sign a commit for you. An example using it is:

```
$ git commit -s -m 'An example commit message'
```

In the past, once someone wanted to contribute they needed to go through the CLA process first. Now they just need to signoff on the commit.

## FAQs

### What About Existing Pull Requests Under The CLA

If a pull request was previously submitted under the CLA we will still honor those. All new contributions will need to be under the DCO and any pull requests that are updated will need to conform to the DCO prior to merging.

### What About The Other Elements Of A CLA

The CNCF CLA has provisions for some areas other than right to contribute the code. For example, there is an explicit patent grant and that the contribution is "on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND". The CNCF views elements like these as already being covered elsewhere. For example, through the code contributions being under the Apache 2 license which has patent grant and warranty clauses.

### What About Commits With Multiple Contributors

If more than one person works on something it's possible for more than one person to sign off on it. For example,

> An example commit message
> 
> Signed-off-by: Some Developer <somedev@example.com>
> Signed-off-by: Another Developer <anotherdev@example.com>

### If I Contribute As An Employee Does My Employer Need To Sign Anything

Nope. The DCO assumes you are authorized to submit the code. This is what makes the contributor experience simpler for many people.

### What If I Forget To Sign-off On A Commit

There is a DCO check, similar to the previous CLA check, that will cause the status of the pull requests to be listed as failed. This will remind everyone that the commit was not signed off.

To update the last commit message with a sign off you can use the command:

```
$ git commit --amend -s
```

The `-s` flag is short for `--signoff`.

If you need to amend older commit message the process is a little more detailed. [GitHub has a writeup detailing on changing commit messages](https://help.github.com/articles/changing-a-commit-message/) that deals with numerous different cases.
