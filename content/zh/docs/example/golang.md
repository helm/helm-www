# 基于GO语言的集成开发示例

## 环境

- go version 1.20.x
- helm v3
- kubernetes 1.24.x



## 示例

### 增加仓库

- ``` go
  package kubestore
  
  import (
      "fmt"
      "helm.sh/helm/v3/pkg/cli"
      "helm.sh/helm/v3/pkg/getter"
      "helm.sh/helm/v3/pkg/repo"
      "kube-store-operator/commons/logger"
  )
  
  // 添加一个仓库地址
  // Helm 的添加仓库地就是将【仓库名+仓库地址】写到一个本地的repositories.yaml文件中
  func add(entry *repo.Entry) error {
      settings := cli.New()
  
      repoFile := settings.RepositoryConfig
  
      // 加载仓库配置文件
      repositories, err := repo.LoadFile(repoFile)
      // 如果文件不存在
      if err != nil {
          // 创建一个新的仓库配置对象
          repositories = repo.NewFile()
      }
  
      // 检查要添加的仓库是否已存在
      if repositories.Has(entry.Name) {
          return fmt.Errorf("仓库 %s 已存在", entry.Name)
      }
  
      // 添加仓库信息到仓库配置
      repositories.Add(entry)
  
      // 保存更新后的仓库配置到文件
      if err = repositories.WriteFile(repoFile, 0644); err != nil {
          return fmt.Errorf("无法保存仓库配置文件：%s", err)
      }
  
      logger.Debugf("成功添加仓库地址：%s。", entry.Name)
      return nil
  }
  ```

- > 此功能相当于: helm repo add 仓库名 https://xxx.com

### 检索仓库

- ``` go
  package kubestore
  
  import (
      "fmt"
      "helm.sh/helm/v3/pkg/cli"
      "helm.sh/helm/v3/pkg/getter"
      "helm.sh/helm/v3/pkg/repo"
      "kube-store-operator/commons/logger"
  )
  
  // 查看仓库信息
  func list() ([]*repo.Entry, error) {
      settings := cli.New()
  
      // 加载仓库配置文件
      repositories, err := repo.LoadFile(settings.RepositoryConfig)
      if err != nil {
          return nil, fmt.Errorf("无法保存仓库配置文件：%s", err)
      }
      return repositories.Repositories, nil
  }
  ```

- > 此功能相当于: helm repo list

### 删除仓库

- ``` go
  package kubestore
  
  import (
      "fmt"
      "helm.sh/helm/v3/pkg/cli"
      "helm.sh/helm/v3/pkg/getter"
      "helm.sh/helm/v3/pkg/repo"
      "kube-store-operator/commons/logger"
  )
  
  // 删除一个仓库地址
  // repoName 仓库名
  func remove(repoName string) error {
      settings := cli.New()
  
      repoFile := settings.RepositoryConfig
  
      // 加载仓库配置文件
      repositories, err := repo.LoadFile(repoFile)
      if err != nil {
          return fmt.Errorf("无法加载仓库配置文件：%s", err)
      }
  
      // 检查要删除的仓库是否存在
      if !repositories.Has(repoName) {
          return fmt.Errorf("仓库 %s 不存在", repoName)
      }
  
      // 从仓库配置中删除仓库
      result := repositories.Remove(repoName)
  
      // 保存更新后的仓库配置到文件
      if err = repositories.WriteFile(repoFile, 0644); err != nil || !result {
          return fmt.Errorf("无法保存仓库配置文件：%s", err)
      }
  
      logger.Debugf("成功删除仓库地址: %s。", repoName)
      return nil
  }
  ```

- > 此功能相当于: helm repo remove 仓库名

### 更新仓库

- ``` go
  package kubestore
  
  import (
      "fmt"
      "helm.sh/helm/v3/pkg/cli"
      "helm.sh/helm/v3/pkg/getter"
      "helm.sh/helm/v3/pkg/repo"
      "kube-store-operator/commons/logger"
  )
  
  // 更新仓库的Helm Chart仓库
  func update() (string, error) {
      settings := cli.New()
      // 加载仓库配置文件
      repositories, err := repo.LoadFile(settings.RepositoryConfig)
      if err != nil {
          return "", fmt.Errorf("无法加载仓库配置文件：%s", err)
      }
  
      // 遍历每个仓库
      for _, repoEntry := range repositories.Repositories {
          // 添加要检索的仓库
          chartRepository, err := repo.NewChartRepository(repoEntry, getter.All(settings))
          if err != nil {
              return "", fmt.Errorf("无法添加仓库：%s\n", err)
          }
  
          // 更新仓库索引信息
          if _, err := chartRepository.DownloadIndexFile(); err != nil {
              return "", fmt.Errorf("无法下载仓库索引：%s\n", err)
          }
  
          logger.Debugf("...Successfully got an update from the %s chart repository", repoEntry.Name)
      }
  
      return "Update Complete. ⎈Happy Helming!⎈", nil
  }
  ```

- > 此功能相当于: helm repo update



### 检索指定仓库中的Chart信息

- ``` go
  package kubestore
  
  import (
      "fmt"
      "helm.sh/helm/v3/pkg/cli"
      "helm.sh/helm/v3/pkg/repo"
      "kube-store-operator/commons/logger"
  )
  
  // 查看指定仓库中最新的Chart信息
  // search(仓库名)
  func search(repoName string) ([]*ChartListResponse, error) {
      settings := cli.New()
  
      path := fmt.Sprintf("%s/%s-index.yaml", settings.RepositoryCache, repoName)
      // 加载 xxx-index.yaml 文件
      indexFile, err := repo.LoadIndexFile(path)
      if err != nil {
          return nil, fmt.Errorf("仓库 %s 不存在", repoName)
      }
  
      var chartList []*ChartListResponse
  
      // 遍历指定仓库的 Chart 信息
      for _, entry := range indexFile.Entries {
          // 将每个 Chart 的最新信息提取出来
          chart := &ChartListResponse{
              ChartName:    entry[0].Name,
              ChartVersion: entry[0].Version,
              AppVersion:   entry[0].AppVersion,
              Description:  entry[0].Description,
          }
          chartList = append(chartList, chart)
      }
  
      // 指定仓库的Chart信息
      logger.Debugf("%s", chartList)
      return chartList, nil
  }
  ```

- > 此功能相当于: helm search repo 仓库名

### 检索指定仓库中Chart的所有版本信息

- ``` go
  package kubestore
  
  import (
      "fmt"
      "helm.sh/helm/v3/pkg/cli"
      "helm.sh/helm/v3/pkg/repo"
      "kube-store-operator/commons/logger"
  )
  
  // 查看指定仓库的Chart所有版本信息
  // searchAll(仓库名, Chart名)
  func searchAll(repoName, chartName string) ([]*ChartListResponse, error) {
      settings := cli.New()
  
      path := fmt.Sprintf("%s/%s-index.yaml", settings.RepositoryCache, repoName)
      // 加载 xxx-index.yaml 文件
      indexFile, err := repo.LoadIndexFile(path)
      if err != nil {
          return nil, fmt.Errorf("仓库 %s 不存在", repoName)
      }
  
      var chartList []*ChartListResponse
  
      // 遍历指定仓库的 Chart 信息
      for _, entry := range indexFile.Entries[chartName] {
          // 将每个 Chart 的主要信息提取出来
          chart := &ChartListResponse{
              ChartName:    entry.Name,
              ChartVersion: entry.Version,
              AppVersion:   entry.AppVersion,
              Description:  entry.Description,
          }
          chartList = append(chartList, chart)
      }
  
      // 指定仓库的Chart信息
      logger.Debugf("%s", chartList)
      return chartList, nil
  }
  ```
  
- > 此功能相当于: helm search repo 仓库名 -l



### 将Chart安装部署到kubernetes

- ``` go
  package kubestore
  
  import (
      "fmt"
      "helm.sh/helm/v3/pkg/action"
      "helm.sh/helm/v3/pkg/chart/loader"
      "helm.sh/helm/v3/pkg/cli"
      "kube-store-operator/commons/logger"
      "os"
  )
  
  // 安装Helm Chart
  func installChart(deployRequest *DeployRequest) error {
  
      settings := cli.New()
  
      actionConfig := new(action.Configuration)
      if err := actionConfig.Init(settings.RESTClientGetter(), deployRequest.Namespace, os.Getenv("HELM_DRIVER"), logger.Debugf); err != nil {
          return fmt.Errorf("初始化 action 失败\n%s", err)
      }
  
      install := action.NewInstall(actionConfig)
      install.RepoURL = deployRequest.RepoURL
      install.Version = deployRequest.ChartVersion
      install.Timeout = 30e9
      install.CreateNamespace = true
      install.Wait = true
      // kubernetes 中的配置
      install.Namespace = deployRequest.Namespace
      install.ReleaseName = deployRequest.ReleaseName
  
      chartRequested, err := install.ChartPathOptions.LocateChart(deployRequest.ChartName, settings)
      if err != nil {
          return fmt.Errorf("下载失败\n%s", err)
      }
  
      chart, err := loader.Load(chartRequested)
      if err != nil {
          return fmt.Errorf("加载失败\n%s", err)
      }
  
      _, err = install.Run(chart, nil)
      if err != nil {
          return fmt.Errorf("执行失败\n%s", err)
      }
  
      return nil
  }
  ```

- > 此功能相当于: helm install

### 将Chart从kubernetes中卸载

- ``` go
  package kubestore
  
  import (
      "fmt"
      "helm.sh/helm/v3/pkg/action"
      "helm.sh/helm/v3/pkg/chart/loader"
      "helm.sh/helm/v3/pkg/cli"
      "kube-store-operator/commons/logger"
      "os"
  )
  
  // 卸载Helm Chart
  func uninstallChart(namespace, releaseName string) error {
  
      settings := cli.New()
  
      actionConfig := new(action.Configuration)
      if err := actionConfig.Init(settings.RESTClientGetter(), namespace, os.Getenv("HELM_DRIVER"), logger.Debugf); err != nil {
          return fmt.Errorf("初始化 action 失败\n%s", err)
      }
  
      uninstall := action.NewUninstall(actionConfig)
      uninstall.Timeout = 30e9 // 设置超时时间300秒
      uninstall.KeepHistory = false
  
      resp, err := uninstall.Run(releaseName)
      if err != nil {
          return fmt.Errorf("卸载失败\n%s", err)
      }
  
      logger.Infof("%s 成功卸载\n", resp.Release.Name)
      return nil
  }
  ```

- > 此功能相当于: helm uninstall



### 代码中用到的实体对象

- ``` go
  package kubestore
  
  // DeployRequest
  /**
   * 部署时用到的结构体
   */
  type DeployRequest struct {
      RepoURL      string                 // 仓库地址
      ChartName    string                 // Chart名称
      ChartVersion string                 // Chart版本
      Namespace    string                 // 命名空间
      ReleaseName  string                 // 在kubernetes中的程序名
      Values       map[string]interface{} // values.yaml 配置文件
  }
  
  // ---------------------------------------------------------------
  
  // ChartListResponse
  /**
   * 返回指定仓库中的所有Chart信息
   */
  type ChartListResponse struct {
      ChartName    string // Chart名称
      ChartVersion string // Chart版本
      AppVersion   string // 应用版本
      Description  string // 描述
  }
  ```



