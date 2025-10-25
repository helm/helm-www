---
title: 开发者指南
description: 开发Helm的环境设置说明。
sidebar_position: 1
---

该指南说明如何为开发Helm配置环境。

## 先决条件

- Go最新版本
- Kubernetes集群及kubectl（可选）
- Git

## 构建 Helm

我们使用Make构建程序。最简单的开始方式是：

```console
$ make
```

有必要的话要先安装依赖，并验证配置。然后会编译 `helm` 并将其放到 `bin/helm`。

在本地执行Helm，可以执行 `bin/helm`。

- Helm运行在 macOS 和大多数发行版上，包括 Alpine。

## 执行测试

要运行所有测试，执行 `make test`。作为先决条件，需要安装
[golangci-lint](https://golangci-lint.run)。

## 贡献指南

我们欢迎你的贡献。 该项目已经设置了一些指南，为了保证 (a) 代码的高质量，(b) 保持项目一致，
(c) 贡献遵循开源法律要求。我们的目的不是为贡献者增加负担，但是要构建优雅和高质量的开源代码，
这样我们的用户才能从中受益。

确保你已经阅读并理解主要贡献指南：

<https://github.com/helm/helm/blob/main/CONTRIBUTING.md>

### 代码结构

Helm项目的代码组织如下：

- 独立的程序位于 `cmd/`。`cmd/` 中的代码不是为库复用设计的。
- 共享的库放在 `pkg/`。
- `scripts/` 目录包含很多实用程序脚本。大多数用于CI/CD流水线。

Go依赖管理在不断变化，而且在Helm生命周期中很可能发生变化。我们建议开发者 _不要_ 手动管理依赖。
而是建议依靠项目的 `Makefile` 来处理。使用Helm 3时，建议使用Go 1.13及更新版本。

### 编写文档

从Helm 3开始，文档已经移动到了它自己的仓库中。当编制新特性时，请编写随附文档并提交到
[helm-www](https://github.com/helm/helm-www) 仓库。

有个例外：[Helm CLI 输出 (英文)](/helm/index.mdx) 是 `helm` 程序自己生成的。
查看 [更新Helm CLI参考文档](https://github.com/helm/helm-www#updating-the-helm-cli-reference-docs)
来了解如何生成该输出。翻译后，不会生成CLI输出，但可以在 `/content/<lang>/docs/helm` 中找到。

### Git 约定

我们使用Git作为版本控制系统。 `main` 分支是当前开发候选分支。发布版本会打tag。

我们通过GitHub的Pull Requests(PRs)接受更改。操作工作流如下：

1. Fork `github.com/helm/helm` 仓库到自己的GitHub账户
2. `git clone` 这个仓库到你想要的目录。
3. 创建一个新分支(`git checkout -b feat/my-feature`) 并在新分支上开发。
4. 当你准备好待审查代码时，将分支推送到GitHub，并开一个新的pull request 给我们。

对于Git提交信息，我们遵循
[语义化提交信息](https://karma-runner.github.io/0.13/dev/git-commit-msg.html)：

```shell
fix(helm): add --foo flag to 'helm install'

When 'helm install --foo bar' is run, this will print "foo" in the
output regardless of the outcome of the installation.

Closes #1234
```

常见提交类型：

- fix: 修复bug或错误
- feat: 添加新特性
- docs: 更新文档
- test: 完善测试
- ref: 重构现有代码

通用范围：

- helm: Helm CLI
- pkg/lint: lint包。对任意包都遵循类似的约定
- `*`: 两个或更多范围

了解更多：

- 灵感来源于 [Deis指南](https://github.com/deis/workflow/blob/master/src/contributing/submitting-a-pull-request.md)。
- Karma Runner
  [定义](https://karma-runner.github.io/0.13/dev/git-commit-msg.html) 了语义提交信息的观点。

### Go 约定

我们非常严格地遵守Go编码风格标准。典型方式是，执行 `go fmt` 可以让代码更加整洁。

我们通常也通过`go lint` 和`gometalinter`遵循推荐的约定。执行 `make test-style` 来测试风格一致性。

了解更多：

- 有效的Go[引入格式](https://golang.org/doc/effective_go.html#formatting)。
- Go Wiki有关于[formatting](https://github.com/golang/go/wiki/CodeReviewComments)很棒的文章。

如果运行`make test`，不仅单元测试会执行，格式测试也会自执行。如果 `make test`失败，即使是因为格式方面的原因，
你的PR也不会被合并。
