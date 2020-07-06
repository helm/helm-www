---
title: "Developer Guide"
description: "Instructions for setting up your environment for developing Helm."
weight: 1
aliases: ["/docs/developers/"]
---

This guide explains how to set up your environment for developing on Helm.

## Prerequisites

- The latest version of Go
- A Kubernetes cluster w/ kubectl (optional)
- Git

## Building Helm

We use Make to build our programs. The simplest way to get started is:

```console
$ make
```

NOTE: This will fail if not running from the path `$GOPATH/src/helm.sh/helm`.
The directory `helm.sh` should not be a symlink or `build` will not find the
relevant packages.

If required, this will first install dependencies, rebuild the `vendor/` tree,
and validate configuration. It will then compile `helm` and place it in
`bin/helm`.

To run all the tests (without running the tests for `vendor/`), run `make test`.

To run Helm locally, you can run `bin/helm`.

- Helm is known to run on macOS and most Linux distributions, including Alpine.

## Contribution Guidelines

We welcome contributions. This project has set up some guidelines in order to
ensure that (a) code quality remains high, (b) the project remains consistent,
and (c) contributions follow the open source legal requirements. Our intent is
not to burden contributors, but to build elegant and high-quality open source
code so that our users will benefit.

Make sure you have read and understood the main CONTRIBUTING guide:

https://github.com/helm/helm/blob/master/CONTRIBUTING.md

### Structure of the Code

The code for the Helm project is organized as follows:

- The individual programs are located in `cmd/`. Code inside of `cmd/` is not
  designed for library re-use.
- Shared libraries are stored in `pkg/`.
- The `scripts/` directory contains a number of utility scripts. Most of these
  are used by the CI/CD pipeline.

Go dependency management is in flux, and it is likely to change during the
course of Helm's lifecycle. We encourage developers to _not_ try to manually
manage dependencies. Instead, we suggest relying upon the project's `Makefile`
to do that for you. With Helm 3, it is recommended that you are on Go version
1.13 or later.

### Writing Documentation

Since Helm 3, documentation has been moved to its own repository. When writing
new features, please write accompanying documentation and submit it to the
[helm-www](https://github.com/helm/helm-www) repository.

### Git Conventions

We use Git for our version control system. The `master` branch is the home of
the current development candidate. Releases are tagged. If you are working on
patches for Helm v2, the branch `dev-v2` is the base branch from which Helm 2
releases are cut.

We accept changes to the code via GitHub Pull Requests (PRs). One workflow for
doing this is as follows:

1. Go to your `$GOPATH/src` directory, then `mkdir helm.sh; cd helm.sh` and `git
   clone` the `github.com/helm/helm` repository.
2. Fork that repository into your GitHub account
3. Add your repository as a remote for `$GOPATH/src/helm.sh/helm`
4. Create a new working branch (`git checkout -b feat/my-feature`) and do your
   work on that branch.
5. When you are ready for us to review, push your branch to GitHub, and then
   open a new pull request with us.

For Git commit messages, we follow the [Semantic Commit
Messages](https://karma-runner.github.io/0.13/dev/git-commit-msg.html):

```
fix(helm): add --foo flag to 'helm install'

When 'helm install --foo bar' is run, this will print "foo" in the
output regardless of the outcome of the installation.

Closes #1234
```

Common commit types:

- fix: Fix a bug or error
- feat: Add a new feature
- docs: Change documentation
- test: Improve testing
- ref: refactor existing code

Common scopes:

- helm: The Helm CLI
- pkg/lint: The lint package. Follow a similar convention for any package
- `*`: two or more scopes

Read more:
- The [Deis
  Guidelines](https://github.com/deis/workflow/blob/master/src/contributing/submitting-a-pull-request.md)
  were the inspiration for this section.
- Karma Runner
  [defines](https://karma-runner.github.io/0.13/dev/git-commit-msg.html) the
  semantic commit message idea.

### Go Conventions

We follow the Go coding style standards very closely. Typically, running `go
fmt` will make your code beautiful for you.

We also typically follow the conventions recommended by `go lint` and
`gometalinter`. Run `make test-style` to test the style conformance.

Read more:

- Effective Go [introduces
  formatting](https://golang.org/doc/effective_go.html#formatting).
- The Go Wiki has a great article on
  [formatting](https://github.com/golang/go/wiki/CodeReviewComments).

If you run the `make test` target, not only will unit tests be run, but so will
style tests. If the `make test` target fails, even for stylistic reasons, your
PR will not be considered ready for merging.
