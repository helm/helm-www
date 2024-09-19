---
title: "相关项目及文档"
description: "社区提供的第三方工具，插件以及文档！"
weight: 3
---

Helm社区已经创建了很多针对Helm的额外工具，插件和文档。我们乐于听到这些项目声音。

如果你有什么需要补充到这里的话，请创建一个 [issue](https://github.com/helm/helm-www/issues) 或者
[pull request](https://github.com/helm/helm-www/pulls)。

## Helm 插件

- [helm-adopt](https://github.com/HamzaZo/helm-adopt) - 将现有k8s资源转换成新生成的helm
chart的helm v3插件。
- [Helm Diff](https://github.com/databus23/helm-diff) - `helm upgrade`的彩色diff预览
- [Helm Dashboard](https://github.com/komodorio/helm-dashboard) - Helm的GUI界面，可视化release、repository及manifest的差异
- [helm-gcs](https://github.com/hayorov/helm-gcs) - 管理Google Cloud Storage中仓库的插件
- [helm-git](https://github.com/aslafy-z/helm-git) - 从Git仓库中安装chart并检索values文件。
- [helm-k8comp](https://github.com/cststack/k8comp) - 使用k8comp从hiera创建Helm Charts的插件
- [helm-mapkubeapis](https://github.com/helm/helm-mapkubeapis) - 更新helm发布版本元数据用于替换过期或已移除的k8s API
- [helm-monitor](https://github.com/ContainerSolutions/helm-monitor) - 基于
  Prometheus/ElasticSearch的用于监控版本发布和回滚的插件
- [helm-release-plugin](https://github.com/JovianX/helm-release-plugin) - 该插件用于管理已部署的release，更新release值，拉取（重建）helm chart，以及设置helm release TTL。
- [helm-s3](https://github.com/hypnoglow/helm-s3) - 允许使用AWS S3作为[私有]chart仓库的插件
- [helm-schema-gen](https://github.com/karuppiah7890/helm-schema-gen) - 为Helm
  3生成values的yaml框架的插件
- [helm-secrets](https://github.com/jkroepke/helm-secrets) - 安全存储密钥的插件
  （基于[sops](https://github.com/mozilla/sops)）
- [helm-sigstore](https://github.com/sigstore/helm-sigstore) - Helm集成[sigstore](https://sigstore.dev/)生态的插件。
用于搜索、上传及验证已签名的Helm chart。
- [helm-tanka](https://github.com/Duologic/helm-tanka) - 在Helm chart中渲染Tanka/Jsonnet的插件
- [hc-unit](https://github.com/xchapter7x/hcunit) - 使用OPA (Open Policy Agent) 和 Rego本地进行chart单元测试的插件
- [helm-unittest](https://github.com/quintush/helm-unittest) - 使用YAML本地进行chart单元测试的插件
- [helm-val](https://github.com/HamzaZo/helm-val) - 从之前的版本中获取值的插件
- [helm-external-val](https://github.com/kuuji/helm-external-val) - 从外部资源（configMaps，
Secrets等）获取Helm values的插件

我们同样鼓励使用GitHub的各位使用[helm-plugin](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)
给插件仓库打tag。

## 额外工具

Helm的顶层工具。

- [Armada](https://airshipit.readthedocs.io/projects/armada/en/latest/) - 管理各种Kubernetes命名空间中的前缀版本，并删除复杂部署的已完成作业
- [avionix](https://github.com/zbrookle/avionix) - 生成Helm chart和Kubernetes yaml的Python接口，允许继承及更少的代码重复
- [Botkube](https://botkube.io) - 直接从Slack,Discord, Microsoft Teams, 和Mattermost运行Helm命令。
- [Captain](https://github.com/alauda/captain) - 使用HelmRequest和Release CRD的Helm 3控制器
- [Chartify](https://github.com/appscode/chartify) - 从已经存在的Kubernetes资源中生成Helm chart。
- [ChartMuseum](https://github.com/helm/chartmuseum) - 支持 Amazon S3 和Google云存储的Helm
Chart仓库
- [chart-registry](https://github.com/hangyan/chart-registry) - 在OCI注册表上的Helm chart主机
- [Codefresh](https://codefresh.io) - 带有UI界面的管理Helm chart和版本的Kubernetes原生CI/CD及管理平台
- [Flux](https://fluxcd.io/docs/components/helm/) -  从Git到Kubernetes的连续和渐进交付
- [Helmfile](https://github.com/helmfile/helmfile) - Helmfile是用于部署helm chart的声明性规范
- [Helmsman](https://github.com/Praqma/helmsman) - Helmsman是helm-charts-as-code工具，
  可以从版本控制所需的状态文件（以简单的TOML格式描述）安装、升级、保护、移动及删除发布版本。
- [Terraform Helm
  Provider](https://github.com/hashicorp/terraform-provider-helm) - 为HashiCorp Terraform提供Helm，
  以声明性的结构作为代码的语法实现Helm Chart的生命周期管理。Helm提供者通常与其他Terraform提供者配对，
  类似于Kubernetes提供者，创建一个横跨所有基础服务的通用工作流。
- [Konveyor Move2Kube](https://konveyor.io/move2kube/) -为现有项目生成Helm chart。
- [Landscaper](https://github.com/Eneco/landscaper/) - "Landscaper获取一组具有值（所需状态）的Helm
hart引用，并在Kubernetes集群中实现。"
- [Monocular](https://github.com/helm/monocular) - Helm仓库的WEB UI界面。
- [Monokle](https://monokle.io) - 桌面工具，用于创建、调试和部署Kubernetes资源和Helm Chart。
- [Orkestra](https://azure.github.io/orkestra/) - 针对一组相关的Helm版本及子chart的云原生编排和生命周期管理平台（LCM）。
- [Tanka](https://tanka.dev/helm) - Grafana Tanka通过具有使用Helm Chart能力的Jsonnet配置Kubernetes资源
- [Terraform Helm  Provider](https://github.com/hashicorp/terraform-provider-helm)
- HashiCorp Terraform的Helm provider，支持使用声明性代码语法对Helm Chart进行生命周期管理。
该Helm provider通常与其他Terraform provider配对，比如Kubernetes provider，用于创建跨越所有基础服务的通用工作流。
- [VIM-Kubernetes](https://github.com/andrewstuart/vim-kubernetes) - Kubernetes和Helm的VIM插件

## Helm 已含的

Helm支持的平台，发行版本和服务。

- [Kubernetic](https://kubernetic.com/) - Kubernetes桌面客户端
- [Jenkins X](https://jenkins-x.io/) - 使用Helm的Kubernetes开源自动化CI/CD
  [promoting](https://jenkins-x.io/docs/getting-started/promotion/) 通过GitOps实现的环境应用程序

## Misc

为Chart作者和Helm用户准备的一些有用的东西。

- [Await](https://github.com/saltside/await) - Docker镜像“等待”不同的条件——对初始化容器尤其有用。
  [更多信息](https://blog.slashdeploy.com/2017/02/16/introducing-await/)。
