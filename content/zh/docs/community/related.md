---
title: "相关项目及文档"
description: "社区提供的第三方工具，插件以及文档！"
weight: 3
---

Helm社区已经创建了很多针对Helm的额外工具，插件和文档。我们乐于听到这些项目声音。

如果你有什么需要补充到这里的话，请创建一个 [issue](https://github.com/helm/helm-www/issues) 或者
[pull request](https://github.com/helm/helm-www/pulls)。

## Helm 插件

- [Helm Diff](https://github.com/databus23/helm-diff) - `helm upgrade`的彩色diff预览
- [helm-gcs](https://github.com/nouney/helm-gcs) - 管理Google Cloud Storage中仓库的插件
- [helm-monitor](https://github.com/ContainerSolutions/helm-monitor) - 基于
  Prometheus/ElasticSearch的用于监控版本发布和回滚的插件
- [helm-k8comp](https://github.com/cststack/k8comp) - 从hiera中使用k8comp创建Helm Chart的插件
- [helm-unittest](https://github.com/lrills/helm-unittest) - 使用YAML对本地chart做单元测试的插件
- [hc-unit](https://github.com/xchapter7x/hcunit) - 使用OPA (Open Policy Agent) &
  Rego对本地chart做单元测试的插件
- [helm-s3](https://github.com/hypnoglow/helm-s3) - 允许使用AWS S3作为[私有]chart仓库的插件
- [helm-schema-gen](https://github.com/karuppiah7890/helm-schema-gen) - 为Helm
  3生成values的yaml框架的插件
- [helm-secrets](https://github.com/jkroepke/helm-secrets) - 安全存储密钥的插件
  （基于[sops](https://github.com/mozilla/sops)）
- [helm-git](https://github.com/aslafy-z/helm-git) - 安装chart并从Git仓库中检索values文件
- [helm-tanka](https://github.com/Duologic/helm-tanka) - 在Helm chart中渲染
  Tanka/Jsonnet的插件

我们同样鼓励使用GitHub的各位使用[helm-plugin](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)
给插件仓库打tag。

## 额外工具

Helm的顶层工具。

- [Konveyor Move2Kube](https://konveyor.io/move2kube/) - 为已经存在的项目生成Helm chart。
- [Chartify](https://github.com/appscode/chartify) - 从已经存在的Kubernetes资源中生成Helm chart。
- [VIM-Kubernetes](https://github.com/andrewstuart/vim-kubernetes) - 针对Kubernetes和Helm的VIM插件
- [Landscaper](https://github.com/Eneco/landscaper/) - "Landscaper获取一组具有values（理想状态）
  的Helm Chart引用，并在Kubernetes集群中实现。"
- [Helmfile](https://github.com/roboll/helmfile) - Helmfile是用于部署helm chart的声明性规范
- [Helmsman](https://github.com/Praqma/helmsman) - Helmsman是helm-charts-as-code工具，
  可以从版本控制所需的状态文件（以简单的TOML格式描述）安装、升级、保护、移动及删除发布版本。
- [Terraform Helm
  Provider](https://github.com/hashicorp/terraform-provider-helm) - 为HashiCorp Terraform提供Helm，
  以声明性的结构作为代码的语法实现Helm Chart的生命周期管理。Helm提供者通常与其他Terraform提供者配对，
  类似于Kubernetes提供者，创建一个横跨所有基础服务的通用工作流。
- [Monocular](https://github.com/helm/monocular) - Helm Chart的Web UI仓库
- [Armada](https://airshipit.readthedocs.io/projects/armada/en/latest/) - 管理各种Kubernetes
  命名空间的前缀版本，以及删除已经完成的部署复杂的作业
- [ChartMuseum](https://github.com/helm/chartmuseum) - 支持 Amazon S3 和 Google Cloud
  Storage的Helm Chart仓库
- [Codefresh](https://codefresh.io) - 使用UI界面的Kubernetes本地CI/CD及管理平台，管理Helm chart
  和版本发布
- [Captain](https://github.com/alauda/captain) - 使用HelmRequest和版本CRD的Helm3控制器
- [chart-registry](https://github.com/hangyan/chart-registry) - 托管在OCI注册表的Helm Chart
- [avionix](https://github.com/zbrookle/avionix) - 生成Helm chart和Kubernetes
  yaml的Python接口，允许继承代码且重复较少
- [Tanka](https://tanka.dev/helm) - Grafana Tanka通过可以使用Helm Chart的Jsonnet配置
  Kubernetes资源

## Helm 已含的

Helm支持的平台，发行版本和服务。

- [Kubernetic](https://kubernetic.com/) - Kubernetes桌面客户端
- [Jenkins X](https://jenkins-x.io/) - 使用Helm的Kubernetes开源自动化CI/CD
  [promoting](https://jenkins-x.io/docs/getting-started/promotion/) 通过GitOps实现的环境应用程序

## Misc

为Chart作者和Helm用户准备的一些有用的东西。

- [Await](https://github.com/saltside/await) - Docker镜像“等待”不同的条件——对初始化容器尤其有用。
  [更多信息](https://blog.slashdeploy.com/2017/02/16/introducing-await/)。
