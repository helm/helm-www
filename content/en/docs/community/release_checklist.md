---
title: "Release Checklist"
description: "Checklist for maintainers when releasing the next version of Helm."
weight: 2
---

# A Maintainer's Guide to Releasing Helm

Time for a new Helm release! As a Helm maintainer cutting a release, you are
the best person to [update this
release checklist](https://github.com/helm/helm-www/blob/main/content/en/docs/community/release_checklist.md)
should your experiences vary from what's documented here.

All releases will be of the form vX.Y.Z where X is the major version number, Y
is the minor version number and Z is the patch release number. This project
strictly follows [semantic versioning](https://semver.org/) so following this
step is critical.

Helm announces in advance the date of its next minor release. Every effort
should be made to respect the announced date.  Furthermore, when starting
the release process, the date for the next release should have been selected
as it will be used in the release process.

These directions will cover initial configuration followed by the release
process for three different kinds of releases:

* Major Releases - released less frequently - have breaking changes
* Minor Releases - released every 3 to 4 months - no breaking changes
* Patch Releases - released monthly - do not require all steps in this guide

[Initial Configuration](#initial-configuration)

1. [Create the Release Branch](#1-create-the-release-branch)
2. [Major/Minor releases: Change the Version Number in Git](#2-majorminor-releases-change-the-version-number-in-git)
3. [Major/Minor releases: Commit and Push the Release Branch](#3-majorminor-releases-commit-and-push-the-release-branch)
4. [Major/Minor releases: Create a Release Candidate](#4-majorminor-releases-create-a-release-candidate)
5. [Major/Minor releases: Iterate on Successive Release Candidates](#5-majorminor-releases-iterate-on-successive-release-candidates)
6. [Finalize the Release](#6-finalize-the-release)
7. [Write the Release Notes](#7-write-the-release-notes)
8. [PGP Sign the downloads](#8-pgp-sign-the-downloads)
9. [Publish Release](#9-publish-release)
10. [Update Docs](#10-update-docs)
11. [Tell the Community](#11-tell-the-community)

## Initial Configuration

### Set Up Git Remote

It is important to note that this document assumes that the git remote in your
repository that corresponds to <https://github.com/helm/helm> is named
"upstream". If yours is not (for example, if you've chosen to name it "origin"
or something similar instead), be sure to adjust the listed snippets for your
local environment accordingly. If you are not sure what your upstream remote is
named, use a command like `git remote -v` to find out.

If you don't have an [upstream
remote](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork)
, you can add one using something like:

```shell
git remote add upstream git@github.com:helm/helm.git
```

### Set Up Environment Variables

In this doc, we are going to reference a few environment variables as well,
which you may want to set for convenience. For major/minor releases, use the
following:

```shell
export RELEASE_NAME=vX.Y.0
export RELEASE_BRANCH_NAME="release-X.Y"
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.1"
```

If you are creating a patch release, use the following instead:

```shell
export PREVIOUS_PATCH_RELEASE=vX.Y.Z
export RELEASE_NAME=vX.Y.Z+1
export RELEASE_BRANCH_NAME="release-X.Y"
```

### Set Up Signing Key

We are also going to be adding security and verification of the release process
by hashing the binaries and providing signature files. We perform this using
[GitHub and
GPG](https://help.github.com/en/articles/about-commit-signature-verification).
If you do not have GPG already setup you can follow these steps:

1. [Install GPG](https://gnupg.org/index.html)
2. [Generate GPG
   key](https://help.github.com/en/articles/generating-a-new-gpg-key)
3. [Add key to GitHub
   account](https://help.github.com/en/articles/adding-a-new-gpg-key-to-your-github-account)
4. [Set signing key in
   Git](https://help.github.com/en/articles/telling-git-about-your-signing-key)

Once you have a signing key you need to add it to the KEYS file at the root of
the repository. The instructions for adding it to the KEYS file are in the file.
If you have not done so already, you need to add your public key to the
keyserver network. If you use GnuPG you can follow the [instructions provided by
Debian](https://debian-administration.org/article/451/Submitting_your_GPG_key_to_a_keyserver).

## 1. Create the Release Branch

### Major/Minor Releases

Major releases are for new feature additions and behavioral changes *that break
backwards compatibility*. Minor releases are for new feature additions that do
not break backwards compatibility. To create a major or minor release, start by
creating a `release-X.Y` branch from main.

```shell
git fetch upstream
git checkout upstream/main
git checkout -b $RELEASE_BRANCH_NAME
```

This new branch is going to be the base for the release, which we are going to
iterate upon later.

Verify that a [helm/helm milestone](https://github.com/helm/helm/milestones)
for the release exists on GitHub (creating it if necessary). Make sure PRs and
issues for this release are in this milestone.

For major & minor releases, move on to step 2: [Major/Minor releases: Change
the Version Number in Git](#2-majorminor-releases-change-the-version-number-in-git).

### Patch releases

Patch releases are a few critical cherry-picked fixes to existing releases.
Start by creating a `release-X.Y` branch:

```shell
git fetch upstream
git checkout -b $RELEASE_BRANCH_NAME upstream/$RELEASE_BRANCH_NAME
```

From here, we can cherry-pick the commits we want to bring into the patch
release:

```shell
# get the commits ids we want to cherry-pick
git log --oneline
# cherry-pick the commits starting from the oldest one, without including merge commits
git cherry-pick -x <commit-id>
```

After the commits have been cherry picked the release branch needs to be pushed.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

Pushing the branch will cause the tests to run. Make sure they pass prior to
creating the tag. This new tag is going to be the base for the patch release.

Creating a [helm/helm
milestone](https://github.com/helm/helm/milestones) is optional for patch
releases.

Make sure to check [helm on CircleCI](https://circleci.com/gh/helm/helm) to see
that the release passed CI before proceeding. Patch releases can skip steps 2-5
and proceed to step 6 to [Finalize the Release](#6-finalize-the-release).

## 2. Major/Minor releases: Change the Version Number in Git

When doing a major or minor release, make sure to update
`internal/version/version.go` with the new release version.

```shell
$ git diff internal/version/version.go
diff --git a/internal/version/version.go b/internal/version/version.go
index 712aae64..c1ed191e 100644
--- a/internal/version/version.go
+++ b/internal/version/version.go
@@ -30,7 +30,7 @@ var (
        // Increment major number for new feature additions and behavioral changes.
        // Increment minor number for bug fixes and performance enhancements.
        // Increment patch number for critical fixes to existing releases.
-       version = "v3.3"
+       version = "v3.4"

        // metadata is extra build time data
        metadata = ""
```

In addition to updating the version within the `version.go` file, you will also
need to update corresponding tests that are using that version number.

* `cmd/helm/testdata/output/version.txt`
* `cmd/helm/testdata/output/version-client.txt`
* `cmd/helm/testdata/output/version-client-shorthand.txt`
* `cmd/helm/testdata/output/version-short.txt`
* `cmd/helm/testdata/output/version-template.txt`
* `pkg/chartutil/capabilities_test.go`

```shell
git add .
git commit -m "bump version to $RELEASE_NAME"
```

This will update it for the $RELEASE_BRANCH_NAME only. You will also need to
pull this change into the main branch for when the next release is being
created, as in [this example of 3.2 to
3.3](https://github.com/helm/helm/pull/8411/files), and add it to the milestone
for the next release.

```shell
# get the last commit id i.e. commit to bump the version
git log --format="%H" -n 1

# create new branch off main
git checkout main
git checkout -b bump-version-<release_version>

# cherry pick the commit using id from first command
git cherry-pick -x <commit-id>

# commit the change
git push origin bump-version-<release-version>
```

## 3. Major/Minor releases: Commit and Push the Release Branch

In order for others to start testing, we can now push the release branch
upstream and start the test process.

```shell
git push upstream $RELEASE_BRANCH_NAME
```

Make sure to check [helm on CircleCI](https://circleci.com/gh/helm/helm) to see
that the release passed CI before proceeding.

If anyone is available, let others peer-review the branch before continuing to
ensure that all the proper changes have been made and all of the commits for the
release are there.

## 4. Major/Minor releases: Create a Release Candidate

Now that the release branch is out and ready, it is time to start creating and
iterating on release candidates.

```shell
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

CircleCI will automatically create a tagged release image and client binary to
test with.

For testers, the process to start testing after CircleCI finishes building the
artifacts involves the following steps to grab the client:

linux/amd64, using /bin/bash:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-linux-amd64.tar.gz
```

darwin/amd64, using Terminal.app:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-darwin-amd64.tar.gz
```

windows/amd64, using PowerShell:

```shell
PS C:\> Invoke-WebRequest -Uri "https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-windows-amd64.tar.gz" -OutFile "helm-$ReleaseCandidateName-windows-amd64.tar.gz"
```

Then, unpack and move the binary to somewhere on your $PATH, or move it
somewhere and add it to your $PATH (e.g. /usr/local/bin/helm for linux/macOS,
C:\Program Files\helm\helm.exe for Windows).

## 5. Major/Minor releases: Iterate on Successive Release Candidates

Spend several days explicitly investing time and resources to try and break helm
in every possible way, documenting any findings pertinent to the release. This
time should be spent testing and finding ways in which the release might have
caused various features or upgrade environments to have issues, not coding.
During this time, the release is in code freeze, and any additional code changes
will be pushed out to the next release.

During this phase, the $RELEASE_BRANCH_NAME branch will keep evolving as you
will produce new release candidates. The frequency of new candidates is up to
the release manager: use your best judgement taking into account the severity of
reported issues, testers' availability, and the release deadline date. Generally
speaking, it is better to let a release roll over the deadline than to ship a
broken release.

Each time you'll want to produce a new release candidate, you will start by
adding commits to the branch by cherry-picking from main:

```shell
git cherry-pick -x <commit_id>
```

You will also want to push the branch to GitHub and ensure it passes CI.

After that, tag it and notify users of the new release candidate:

```shell
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.2"
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

Once pushed to GitHub, check to ensure the branch with this tag builds in CI.

From here on just repeat this process, continuously testing until you're happy
with the release candidate. For a release candidate, we don't write the full notes,
but you can scaffold out some [release notes](#7-write-the-release-notes).

## 6. Finalize the Release

When you're finally happy with the quality of a release candidate, you can move
on and create the real thing. Double-check one last time to make sure everything
is in order, then finally push the release tag.

```shell
git checkout $RELEASE_BRANCH_NAME
git tag --sign --annotate "${RELEASE_NAME}" --message "Helm release ${RELEASE_NAME}"
git push upstream $RELEASE_NAME
```

Verify that the release succeeded in
[CircleCI](https://circleci.com/gh/helm/helm). If not, you will need to fix the
release and push the release again.

As the CI job will take some time to run, you can move on to writing release
notes while you wait for it to complete.

## 7. Write the Release Notes

We will auto-generate a changelog based on the commits that occurred during a
release cycle, but it is usually more beneficial to the end-user if the release
notes are hand-written by a human being/marketing team/dog.

If you're releasing a major/minor release, listing notable user-facing features
is usually sufficient. For patch releases, do the same, but make note of the
symptoms and who is affected.

The release notes should include the version and planned date of the next release.

An example release note for a minor release would look like this:

```markdown
## vX.Y.Z

Helm vX.Y.Z is a feature release. This release, we focused on <insert focal point>. Users are encouraged to upgrade for the best experience.

The community keeps growing, and we'd love to see you there!

- Join the discussion in [Kubernetes Slack](https://kubernetes.slack.com):
  - `#helm-users` for questions and just to hang out
  - `#helm-dev` for discussing PRs, code, and bugs
- Hang out at the Public Developer Call: Thursday, 9:30 Pacific via [Zoom](https://zoom.us/j/696660622)
- Test, debug, and contribute charts: [Artifact Hub helm charts](https://artifacthub.io/packages/search?kind=0)

## Notable Changes

- Kubernetes 1.16 is now supported including new manifest apiVersions
- Sprig was upgraded to 2.22

## Installation and Upgrading

Download Helm X.Y. The common platform binaries are here:

- [MacOS amd64](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-darwin-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux amd64](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-amd64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux arm](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-arm.tar.gz.sha256) / CHECKSUM_VAL)
- [Linux arm64](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-arm64.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux i386](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-386.tar.gz.sha256) / CHECKSUM_VAL)
- [Linux ppc64le](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-ppc64le.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Linux s390x](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz) ([checksum](https://get.helm.sh/helm-vX.Y.Z-linux-s390x.tar.gz.sha256sum) / CHECKSUM_VAL)
- [Windows amd64](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip) ([checksum](https://get.helm.sh/helm-vX.Y.Z-windows-amd64.zip.sha256sum) / CHECKSUM_VAL)

The [Quickstart Guide](https://docs.helm.sh/using_helm/#quickstart-guide) will get you going from there. For **upgrade instructions** or detailed installation notes, check the [install guide](https://docs.helm.sh/using_helm/#installing-helm). You can also use a [script to install](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3) on any system with `bash`.

## What's Next

- vX.Y.Z+1 will contain only bug fixes and is planned for <insert DATE>.
- vX.Y+1.0 is the next feature release and is planned for <insert DATE>. This release will focus on ...

## Changelog

- chore(*): bump version to v2.7.0 08c1144f5eb3e3b636d9775617287cc26e53dba4 (Adam Reese)
- fix circle not building tags f4f932fabd197f7e6d608c8672b33a483b4b76fa (Matthew Fisher)
```

A partially completed set of release notes including the changelog can be
created by running the following command:

```shell
export VERSION="$RELEASE_NAME"
export PREVIOUS_RELEASE=vX.Y.Z
make clean
make fetch-dist
make release-notes
```

This will create a good baseline set of release notes to which you should just
need to fill out the **Notable Changes** and **What's next** sections.

Feel free to add your voice to the release notes; it's nice for people to think
we're not all robots.

You should also double check the URLs and checksums are correct in the
auto-generated release notes.

Once finished, go into GitHub to [helm/helm
releases](https://github.com/helm/helm/releases) and edit the release notes for
the tagged release with the notes written here.
For target branch, set to $RELEASE_BRANCH_NAME.

It is now worth getting other people to take a look at the release notes before
the release is published. Send a request out to
[#helm-dev](https://kubernetes.slack.com/messages/C51E88VDG) for review. It is
always beneficial as it can be easy to miss something.

## 8. PGP Sign the downloads

While hashes provide a signature that the content of the downloads is what it
was generated, signed packages provide traceability of where the package came
from.

To do this, run the following `make` commands:

```shell
export VERSION="$RELEASE_NAME"
make clean		# if not already run
make fetch-dist	# if not already run
make sign
```

This will generate ascii armored signature files for each of the files pushed by
CI.

All of the signature files (`*.asc`) need to be uploaded to the release on
GitHub (attach binaries).

## 9. Publish Release

Time to make the release official!

After the release notes are saved on GitHub, the CI build is completed, and
you've added the signature files to the release, you can hit "Publish" on
the release. This publishes the release, listing it as "latest", and shows this
release on the front page of the [helm/helm](https://github.com/helm/helm) repo.

## 10. Update Docs

The [Helm website docs section](https://helm.sh/docs) lists the Helm versions
for the docs. Major, minor, and patch versions need to be updated on the site.
The date for the next minor release is also published on the site and must be
updated.
To do that create a pull request against the [helm-www
repository](https://github.com/helm/helm-www). In the `config.toml` file find
the proper `params.versions` section and update the Helm version, like in this
example of [updating the current
version](https://github.com/helm/helm-www/pull/676/files).  In the same
`config.toml` file, update the `params.nextversion` section.

Close the [helm/helm milestone](https://github.com/helm/helm/milestones) for
the release, if applicable.

Update the [version
skew](https://github.com/helm/helm-www/blob/main/content/en/docs/topics/version_skew.md)
for major and minor releases.

Update the release calendar [here](https://helm.sh/calendar/release):
* create an entry for the next minor release with a reminder for that day at 5pm GMT
* create an entry for the RC1 of the next minor release on the Monday of the week before the planned release, with a reminder for that day at 5pm GMT

## 11. Tell the Community

Congratulations! You're done. Go grab yourself a $DRINK_OF_CHOICE. You've earned
it.

After enjoying a nice $DRINK_OF_CHOICE, go forth and announce the new release
in Slack and on Twitter with a link to the [release on
GitHub](https://github.com/helm/helm/releases).

Optionally, write a blog post about the new release and showcase some of the new
features on there!
