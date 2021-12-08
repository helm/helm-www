---
title: "版本 Checklist"
description: "维护人员在发布下一个Helm版本时的checklist。"
weight: 2
---

# 维护人员发布Helm指南

是时候发布新的Helm了！作为Helm维护者发布版本，如果你的经验与这里的文档不同，那你就是
[更新版本checklist](https://github.com/helm/helm-www/blob/main/content/en/docs/community/release_checklist.md)
的最佳人选。

所有版本都将采用vX.Y.Z的形式，X是主版本号，Y是次版本号，Z是补丁发布号。该项目严格遵守 [语义化版本](https://semver.org/)，
因此遵循这一点非常重要。

Helm会提前宣布下个次版本发布的日期。应尽一切努力遵守宣布的日期。此外，在开始发布过程时，应该选择下一个发布的日期在发布过程中使用。

这些说明将涵盖三种不同版本的遵守发布过程的初始配置：

- 主版本 - 发布频率较低 - 有重大更新时
- 次版本 - 每3到4个月发布 - 无重大更新
- 补丁版本 - 每月发布 - 不需要指南中的所有步骤

[初始化配置](#initial-configuration)

1. [创建发布分支](#1-create-the-release-branch)
2. [主/次版本：在Git中更改版本号](#2-majorminor-releases-change-the-version-number-in-git)
3. [主/次版本：提交并推送发布分支](#3-majorminor-releases-commit-and-push-the-release-branch)
4. [主/次版本：创建一个候选发布](#4-majorminor-releases-create-a-release-candidate)
5. [主/次版本：迭代连续的候选版本](#5-majorminor-releases-iterate-on-successive-release-candidates)
6. [完成发布](#6-finalize-the-release)
7. [编写发布日志](#7-write-the-release-notes)
8. [PGP签名下载](#8-pgp-sign-the-downloads)
9. [发布版本](#9-publish-release)
10. [更新文档](#10-update-docs)
11. [告知社区](#11-tell-the-community)

## Initial Configuration

### 设置远程Git

需要注意的是该文档假设你的远程upstream仓库关联到了<https://github.com/helm/helm>。
如果不是（比如，如果你选择了“origin”或其他类似的替代），请确保根据本地环境调整列出的代码段。
如果你不确定使用了什么远程的upstream，使用`git remote -v`命令查看。

如果你没有[上游远程](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork)，
可以类似这样添加：

```shell
git remote add upstream git@github.com:helm/helm.git
```

### 设置环境变量

在该文档中，我们还会引用一些环境变量，更便于设置。针对主、次版本，使用以下选项：

```shell
export RELEASE_NAME=vX.Y.0
export RELEASE_BRANCH_NAME="release-X.Y"
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.1"
```

如果你在创建一个补丁版本，改用以下命令：

```shell
export PREVIOUS_PATCH_RELEASE=vX.Y.Z
export RELEASE_NAME=vX.Y.Z+1
export RELEASE_BRANCH_NAME="release-X.Y"
```

### 设置签名Key

我们还会通过对二进制文件和提供的签名文件进行哈希计算增加发布过程的安全性和认证。
使用[GitHub 和 GPG](https://help.github.com/en/articles/about-commit-signature-verification)来执行。
如果还没设置GPG可以按照以下步骤操作：

1. [安装 GPG](https://gnupg.org/index.html)
2. [生成 GPG key](https://help.github.com/en/articles/generating-a-new-gpg-key)
3. [将key添加到GitHub账户中](https://help.github.com/en/articles/adding-a-new-gpg-key-to-your-github-account)
4. [在Git中设置签名密钥](https://help.github.com/en/articles/telling-git-about-your-signing-key)

一旦你有了签名密钥，需要将其添加到仓库根目录中的KEYS文件中。文件中有添加密钥到KEY文件的说明。如果还没有，需要将公钥添加到keyserver。
如果使用了GnuPG，可以参照[Debian提供的说明](https://debian-administration.org/article/451/Submitting_your_GPG_key_to_a_keyserver)。

## 1. Create the Release Branch

### 主、次版本

主版本是为新特性及操作且*不具有向后兼容性*。次版本是为了不破坏向后兼容性的新特性。创建一个主版本或次版本，从主干分支创建`release-X.Y`分支。

```shell
git fetch upstream
git checkout upstream/main
git checkout -b $RELEASE_BRANCH_NAME
```

这个新分支是发布版本的基础分支，会在后面不断迭代。

为GitHub上已存在的版本验证[helm/helm里程碑](https://github.com/helm/helm/milestones)。
确保针对这个版本的PR和issue都在这个里程碑中。

针对主版本和次版本，跳转到 2: [主/次版本：在Git中更改版本号](#2-majorminor-releases-change-the-version-number-in-git)。

### 补丁版本

补丁版本是一些已有版本中严格的cherry-picked修复。以创建`release-X.Y`分支开始：

```shell
git fetch upstream
git checkout -b $RELEASE_BRANCH_NAME upstream/$RELEASE_BRANCH_NAME
```

在这里可以cherry-pick出需要带到补丁版本中的提交：

```shell
# get the commits ids we want to cherry-pick
git log --oneline
# cherry-pick the commits starting from the oldest one, without including merge commits
git cherry-pick -x <commit-id>
```

挑出提交之后这个版本分支需要被推送。

```shell
git push upstream $RELEASE_BRANCH_NAME
```

推送分支会触发测试。创建tag之前确保测试是通过的。
这个新tag将成为补丁版本的基础。

针对补丁版本，创建[helm/helm里程碑](https://github.com/helm/helm/milestones)是可选的。

继续之前确保[helm 在 CircleCI](https://circleci.com/gh/helm/helm)通过CI。补丁版本可以跳过2-5步，
直接执行6 [完成发布](#6-finalize-the-release)。

## 2. Major/Minor releases: Change the Version Number in Git

当有主版本或次版本发布时，确保用新版本更新`internal/version/version.go`。

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

除了在`version.go`文件中更行版本，还需要更新使用了新版本的相关测试。

- `cmd/helm/testdata/output/version.txt`
- `cmd/helm/testdata/output/version-client.txt`
- `cmd/helm/testdata/output/version-client-shorthand.txt`
- `cmd/helm/testdata/output/version-short.txt`
- `cmd/helm/testdata/output/version-template.txt`
- `pkg/chartutil/capabilities_test.go`

```shell
git add .
git commit -m "bump version to $RELEASE_NAME"
```

这只会对$RELEASE_BRANCH_NAME更新。也许要在下个版本更新时推送到主干分支，就像 [3.2 更新到
3.3](https://github.com/helm/helm/pull/8411/files)，并将其添加到下一个版本的里程碑中。

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

为了让他人开始测试，我们可以推送发布分支到upstream并开始测试过程。

```shell
git push upstream $RELEASE_BRANCH_NAME
```

继续之前确保 [helm 在CircleCI](https://circleci.com/gh/helm/helm)版本通过CI。

如果有人可用，让其他人在确保所有更改都已正确处理且所有该版本的提交都已存在，并提前对分支进行同行评审。

## 4. Major/Minor releases: Create a Release Candidate

现在，发布分支已经准备好了，可以开始创建和迭代候选版本了。

```shell
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

CircleCI 会自动创建一个打tag的发布镜像，同时测试客户端库。

对测试人员来说，在CircleCI完成测试构建过程之后开始测试，包括以下步骤来获取客户端：

linux/amd64, 使用 /bin/bash:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-linux-amd64.tar.gz
```

darwin/amd64, 使用 Terminal.app:

```shell
wget https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-darwin-amd64.tar.gz
```

windows/amd64, 使用 PowerShell:

```shell
PS C:\> Invoke-WebRequest -Uri "https://get.helm.sh/helm-$RELEASE_CANDIDATE_NAME-windows-amd64.tar.gz" -OutFile "helm-$ReleaseCandidateName-windows-amd64.tar.gz"
```

然后，将二进制包解压并移动到$PATH目录中，或者移动到某个位置并添加$PATH（比如linux/macOS的/usr/local/bin/helm，windows的
C:\Program Files\helm\helm.exe for Windows）。

## 5. Major/Minor releases: Iterate on Successive Release Candidates

花了几天时间和资源去尝试用各种方式破坏helm，将所有的相关发现都记录到发布中。这段时间应该花在测试和寻找发行版可能导致各种特性或升级环境出现问题的方法上，
不要编码。这段时间发布版本应该冻结代码，且任何要添加的代码更新都推到下个发布版本中。

这个阶段，$RELEASE_BRANCH_NAME 会随着你新产生的候选发布不断发展。新候选的频率取决于发布管理员：依据报告问题的严重性、
测试人员效率和发布期限做出最佳判断。一般来说，即使跨过最后期限也不能发布坏版本。

在每次创建新的候选发布时，需要以添加从主干分支检出的commit开始：

```shell
git cherry-pick -x <commit_id>
```

你也需要推送这个分支到GitHub并保证通过CI。

然后打tag并通知用户有新的候选版本了：

```shell
export RELEASE_CANDIDATE_NAME="$RELEASE_NAME-rc.2"
git tag --sign --annotate "${RELEASE_CANDIDATE_NAME}" --message "Helm release ${RELEASE_CANDIDATE_NAME}"
git push upstream $RELEASE_CANDIDATE_NAME
```

一旦推送到了GitHub，检查分支确保tag在CI中构建。

从这里重复这个过程，持续测试直到你对候选发布满意为止。对于发布候选，我们不写完整的记录，但可以写一下
[发布日志](#7-write-the-release-notes)。

## 6. Finalize the Release

当你最终对自己的候选发布的质量感到满意时，可以继续并创建一个真正的发布。 最后再检查一次确保一切正常，最后推送这个发布的tag。

```shell
git checkout $RELEASE_BRANCH_NAME
git tag --sign --annotate "${RELEASE_NAME}" --message "Helm release ${RELEASE_NAME}"
git push upstream $RELEASE_NAME
```

在[CircleCI](https://circleci.com/gh/helm/helm)中验证发布是否成功。如果不行，需要修复这个版本并重新推送。

由于CI作业需要运行一段时间，你可以在等待其完成时去写发布日志。

## 7. Write the Release Notes

我们会根据发布周期提交的记录自动生成一个更新日志，但是，如果发布说明是由人或市场团队手写的，通常对最终用户会更有利。

如果你在发布一个主或次版本，一般列出值得注意的面向用户的特性就足够了。对于补丁版本同样，但要标记出问题和会受影响的人。

发布日志应该包含版本号和下一个版本的计划发布日期。

针对次要版本的发布日志示例如下：

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

通过运行以下命令可以创建一组包括更新日志的部分完成的发行说明：

```shell
export VERSION="$RELEASE_NAME"
export PREVIOUS_RELEASE=vX.Y.Z
make clean
make fetch-dist
make release-notes
```

这回生成一个发行日志的良好基线，你仅仅需要填写 **Notable Changes** 和 **What's next** 部分。

可以在发布日志中随意添加你想说的，对用户来说会很好而不至于感觉我们是机器人。

你也需要再次检查自动生成的日志中的URL和校验和。

完成之后，去GitHub的 [helm/helm releases](https://github.com/helm/helm/releases)
中为已打tag的版本编辑发布说明。对于目标分支，设置$RELEASE_BRANCH_NAME。

现在需要让其他人在发行版本发布之前看看发行说明。发一个request到
[#helm-dev](https://kubernetes.slack.com/messages/C51E88VDG)用于评审。发行日志很容易漏掉一些东西，因此评审总是有用的。

## 8. PGP Sign the downloads

哈希生成一个表明下载内容就是其生成内容的签名，签名包提供了包来自何处的可追溯性。

为此，要执行以下 `make` 命令：

```shell
export VERSION="$RELEASE_NAME"
make clean		# if not already run
make fetch-dist	# if not already run
make sign
```

这会生成通过CI推送的每个文件的ascii封装的签名文件。

所有的签名文件(`*.asc`)需要上传到GitHub中的发布版本（附件二级制文件）中。

## 9. Publish Release

是时候正式发布了！

发布说明保存在GitHub之后，CI构建已经完成，并且已经添加了发布版本的签名文件，你可以在发布版本上点击 "Publish" 了。
发布的版本，标记为"latest"，并在[helm/helm](https://github.com/helm/helm)仓库的首页显示这个发布版本。

## 10. Update Docs

[Helm站点文档部分](https://helm.sh/docs)列出了Helm版本的文档。主、次及补丁版本需要更行到这个站点。
下一个次要版本的发布日期也要发布出来且必须更新。这要创建一个pull request 到
[helm-www仓库](https://github.com/helm/helm-www)。在 `config.toml` 文件中找到合适的
`params.versions`部分并更新Helm版本，例如 [更新当前版本](https://github.com/helm/helm-www/pull/676/files)。
在同一个`config.toml`文件中，更新`params.nextversion`部分。

如果需要，关闭这个版本的[helm/helm 里程碑](https://github.com/helm/helm/milestones)。

为主版本和次版本更新[version skew](https://github.com/helm/helm-www/blob/main/content/en/docs/topics/version_skew.md)。

在[这里](https://helm.sh/calendar/release)更新版本日历：

- 为下一个次要版本创建一个条目并在GMT下午5点设置提醒
- 在计划发布的前一周的周一为下一个次要版本的RC1创建一个条目，设置GMT下午5点的提醒

## 11. Tell the Community

恭喜，你已经完成了。去喝一杯吧。这是你应得的。

然后继续前进并在Slack和Twitter上宣布这个新分支，并链接到[GitHub发布版本](https://github.com/helm/helm/releases)。

或者，写一篇新版本的blog并在上面展示一些新特性！
