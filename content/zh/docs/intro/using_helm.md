---
title: "使用 Helm"
description: "解釋 Helm 的基礎知識。"
weight: 3
---

本指南介紹了使用 Helm 來管理 Kubernetes 叢集上的軟體包的基礎知識。在這之前，假設您已經
[安裝](https://helm.sh/zh/docs/intro/install)了 Helm 客戶端。

如果您僅對運行一些快速命令感興趣，不妨從[快速入門指南](https://helm.sh/zh/docs/intro/quickstart)開始。本章包含了
Helm 命令的詳細說明，並解釋如何使用 Helm。

## 三大概念

*Chart* 代表著 Helm 包。它包含在 Kubernetes 叢集內部運行應用程序，工具或服務所需的所有資源定義。你可以把它看作是
Homebrew formula，Apt dpkg，或 Yum RPM 在 Kubernetes 中的等價物。

*Repository（倉庫）* 是用來存放和共享 charts 的地方。它就像 Perl 的 [CPAN 檔案庫網路](https://www.cpan.org)
或是 Fedora 的[軟體包倉庫](https://src.fedoraproject.org/)，只不過它是供 Kubernetes 包所使用的。

*Release* 是運行在 Kubernetes 叢集中的 chart 的實例。一個 chart 通常可以在同一個叢集中安裝多次。每一次安裝都會創建一個新的
_release_。以 MySQL chart 為例，如果你想在你的叢集中運行兩個資料庫，你可以安裝該 chart 兩次。每一個資料庫都會擁有它自己的
_release_ 和 _release name_。

在了解了上述這些概念以後，我們就可以這樣來解釋 Helm：

Helm 安裝 _charts_ 到 Kubernetes 叢集中，每次安裝都會創建一個新的 _release_。你可以在 Helm 的
chart _repositories_ 中尋找新的 chart。

## 'helm search'：搜尋 Charts

Helm 自帶一個强大的搜尋命令，可以用來從兩種來源中進行搜尋：

- `helm search hub` 從 [Artifact Hub](https://artifacthub.io) 中搜尋並列出 helm charts。
  Artifact Hub 中存放了大量不同的倉庫。
- `helm search repo` 從你添加（使用 `helm repo add`）到本地 helm 客戶端中的倉庫中進行搜尋。該命令基於本地資料進行搜尋，無需連接網路。

你可以通過運行 `helm search hub` 命令找到公開可用的 charts：

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

上述命令從 Artifact Hub 中搜索所有的 `wordpress` charts。

如果不進行過濾，`helm search hub` 命令會展示所有可用的 charts。

使用 `helm search repo` 命令，你可以從你所添加的倉庫中搜尋 chart 的名字。

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Helm 搜索使用模糊字符串匹配算法，所以你可以只輸入名字的一部分：

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

搜索是用來發現可用包的一個好辦法。一旦你找到你想安裝的 helm 包，你便可以通過使用 `helm install` 命令來安裝它。

## 'helm install'：安裝一個 helm 包

使用 `helm install` 命令來安裝一個新的 helm 包。最簡單的使用方法只需要傳入兩個參數：你命名的 release 名字和你想安裝的 chart 的名稱。

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)

```

現在`wordpress` chart 已經安裝。注意安裝 chart 時創建了一個新的 _release_ 對象。上述發佈被命名為 `happy-panda`。
（如果想讓 Helm 生成一個名稱，刪除發佈名稱並使用`--generate-name`。）

在安裝過程中，`helm` 客戶端會顯示一些有用的訊息，其中包括：哪些資源已經被創建，release 當前的狀態，以及你是否還需要執行額外的配置步驟。

Helm 按照以下順序安裝資源：

- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- ClusterRoleBinding
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService

Helm 客戶端不會等到所有資源都運行才退出。許多 charts 需要大小超過 600M 的 Docker 鏡像，可能需要很長時間才能安裝到叢集中。

你可以使用 `helm status` 來追蹤 release 的狀態，或是重新讀取配置訊息：

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

上述訊息展示了 release 的當前狀態。

### 安裝前自定義 chart

上述安裝方式只會使用 chart 的默認配置選項。很多時候，我們需要自定義 chart 來指定我們想要的配置。

使用 `helm show values` 可以查看 chart 中的可配置選項：

```console
$ helm show values bitnami/wordpress
## Global Docker image parameters
## Please, note that this will override the image parameters, including dependencies, configured to use the global value
## Current available global Docker image parameters: imageRegistry and imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass

## Bitnami WordPress image version
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/
##
image:
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

然後，你可以使用 YAML 格式的文件覆蓋上述任意配置項，並在安裝過程中使用該文件。

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

上述命令將為 MariaDB 創建一個名稱為 `user0` 的默認用戶，並且授予該用戶訪問新建的 `user0db` 資料庫的權限。chart 中的其他默認配置保持不變。

安裝過程中有兩種方式傳遞配置資料：

- `--values` (或 `-f`)：使用 YAML 文件覆蓋配置。可以指定多次，優先使用最右邊的文件。
- `--set`：通過命令行的方式對指定項進行覆蓋。

如果同時使用兩種方式，則 `--set` 中的值會被合併到 `--values` 中，但是 `--set` 中的值優先級更高。在`--set`
中覆蓋的内容會被保存在 ConfigMap 中。可以通過 `helm get values <release-name>` 來查看指定 release 中
`--set` 設置的值。也可以通過運行 `helm upgrade` 並指定 `--reset-values` 字段來清除 `--set` 中設置的值。

#### `--set` 的格式和限制

`--set` 選項使用 0 或多個 name/value 對。最簡單的用法類似於：`--set name=value`，等價於如下 YAML 格式：

```yaml
name: value
```

多個值使用逗號分割，因此 `--set a=b,c=d` 的 YAML 表示是：

```yaml
a: b
c: d
```

支持更複雜的表達式。例如，`--set outer.inner=value` 被轉換成了：

```yaml
outer:
  inner: value
```

列表使用大括號（`{}`）來表示。例如，`--set name={a, b, c}` 被轉換成了：

```yaml
name:
  - a
  - b
  - c
```

從 2.5.0 版本開始，可以使用數組下標的語法來訪問列表中的元素。例如 `--set servers[0].port=80` 就變成了：

```yaml
servers:
  - port: 80
```

多個值也可以通過這種方式來設置。`--set servers[0].port=80,servers[0].host=example` 變成了：

```yaml
servers:
  - port: 80
    host: example
```

如果需要在 `--set` 中使用特殊字符，你可以使用反斜線來進行跳脫；`--set name=value1\,value2` 就變成了：

```yaml
name: "value1,value2"
```

類似的，你也可以跳脫點序列（英文句號）。這可能會在 chart 使用 `toYaml` 函數來解析 annotations，labels，和
node selectors 時派上用場。`--set nodeSelector."kubernetes\.io/role"=master` 語法就變成了：

```yaml
nodeSelector:
  kubernetes.io/role: master
```

深層嵌套的數據結構可能會很難用 `--set` 表達。我們希望 Chart 的設計者們在設計 `values.yaml` 文件的格式時，考慮到 `--set`
的使用。（更多内容請查看 [Values 文件](https://helm.sh/docs/chart_template_guide/values_files/)）

### 更多安裝方法

`helm install` 命令可以從多個來源進行安裝：

- chart 的倉庫（如上所述）
- 本地 chart 壓縮包（`helm install foo foo-0.1.1.tgz`）
- 解壓縮後的 chart 目錄（`helm install foo path/to/foo`）
- 完整的 URL（`helm install foo https://example.com/charts/foo-1.2.3.tgz`）

## 'helm upgrade' 和 'helm rollback'：升級 release 和失败時恢复

當你想升級到 chart 的新版本，或是修改 release 的配置，你可以使用 `helm upgrade` 命令。

一次升級操作會使用已有的 release 並根據你提供的訊息對其進行升級。由於 Kubernetes 的 chart
可能會很大而且很複雜，Helm 會嘗試執行最小侵入式升級。即它只會更新自上次發佈以來发生了更改的内容。

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

在上面的例子中，`happy-panda` 这個 release 使用相同的 chart 進行升級，但是使用了一個新的 YAML 文件：

```yaml
mariadb.auth.username: user1
```

我們可以使用 `helm get values` 命令來看看配置值是否真的生效了：

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

`helm get` 是一個查看叢集中 release 的有用工具。正如我們上面所看到的，`panda.yaml` 中的新值已經被部署到叢集中了。

現在，假如在一次發佈過程中，發生了不符合預期的事情，也很容易通過 `helm rollback [RELEASE] [REVISION]` 命令回滾到之前的發佈版本。

```console
$ helm rollback happy-panda 1
```

上面这條命令將我們的 `happy-panda` 回滾到了它最初的版本。release 版本其实是一個增量修訂（revision）。
每當發生了一次安裝、升級或回滾操作，revision 的值就會加 1。第一次 revision 的值永遠是 1。我們可以使用
`helm history [RELEASE]` 命令來查看一個特定 release 的修訂版本號。

## 安裝、升級、回滾時的有用選項

你還可以指定一些其他有用的選項來自定義 Helm 在安裝、升級、回滾期間的行為。請注意這並不是 cli 參數的完整列表。
要查看所有參數的说明，請執行 `helm <command> --help` 命令。

- `--timeout`：一個 [Go duration](https://golang.org/pkg/time/#ParseDuration) 類型的值，
  用來表示等待 Kubernetes 命令完成的超時時間，默認值為 `5m0s`。
- `--wait`：表示必須要等到所有的 Pods 都處於 ready 狀態，PVC 都被綁定，Deployments 都至少擁有最小 ready 狀態
  Pods 個數（`Desired` 減去 `maxUnavailable`），並且 Services 都具有 IP 地址（如果是`LoadBalancer`，
  則為 Ingress），才會標記該 release 為成功。最長等待時間由 `--timeout` 值指定。如果達到超時時間，release 將被標記為
  `FAILED`。注意：当 Deployment 的 `replicas` 被设置为1，但其滚动升級策略中的 `maxUnavailable`
  沒有被設置為 0 時，`--wait` 將返回就緒，因爲已經滿足了最小 ready Pod 數。
- `--no-hooks`：不運行當前命令的鉤子。
- `--recreate-pods`（僅適用於 `upgrade` 和 `rollback`）：這個參數會導致重建所有的
  Pod（deployment中的Pod 除外）。（在 Helm 3 中已被廢棄）

## 'helm uninstall'：刪除 release

使用 `helm uninstall` 命令從叢集中刪除一個 release：

```console
$ helm uninstall happy-panda
```

該命令將從叢集中移除指定 release。你可以通過 `helm list` 命令看到當前部署的所有 release：

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

從上面的輸出中，我們可以看到，`happy-panda` 这個 release 已經被刪除。

在上一個 Helm 版本中，當一個 release 被删除，會保留一條删除紀錄。而在 Helm 3 中，删除也會移除 release 的紀錄。
如果你想保留删除紀錄，使用 `helm uninstall --keep-history`。使用 `helm list --uninstalled`
只會展示使用了 `--keep-history` 删除的 release。

`helm list --all` 會展示 Helm 保留的所有 release 紀錄，包括失敗或删除的條目（指定了 `--keep-history`）：

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

注意，因為現在默認會删除 release，所以你不再能夠回滾一個已經被刪除的資源了。

## 'helm repo'：使用倉庫

Helm 3 不再附帶一個默認的 chart 倉庫。`helm repo` 提供了一组命令用於添加、列出和移除倉庫。

使用 `helm repo list` 來查看配置的倉庫：

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

使用 `helm repo add` 來添加新的倉庫：

```console
$ helm repo add dev https://example.com/dev-charts
```

因爲 chart 倉庫經常在變化，在任何時候你都可以通過執行 `helm repo update` 命令來確保你的 Helm 客戶端是最新的。

使用 `helm repo remove` 命令來移除倉庫。

## 創建你自己的 charts

[chart 開發指南](https://helm.sh/zh/docs/topics/charts) 介紹了如何開發你自己的 chart。 但是你也可以通過使用
`helm create` 命令來快速開始：

```console
$ helm create deis-workflow
Creating deis-workflow
```

現在，`./deis-workflow` 目錄下已經有一個 chart 了。你可以編輯並創建你自己的模板。

在編輯 chart 時，可以通過 `helm lint` 驗證格式是否正確。

當準備將 chart 打包分發時，你可以運行 `helm package` 命令：

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

然後這個 chart 就可以很輕鬆的通過 `helm install` 命令安裝：

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

打包好的 chart 可以上傳到 chart 倉庫中。查看[Helm chart 倉庫](https://helm.sh/zh/docs/topics/chart_repository)獲得更多訊息。

## 總結

這一章介紹了 `helm` 客戶端的基本使用方式，包含搜尋，安裝，升級，和刪除。也涵蓋了一些有用的工具類命令，如 `helm status`，
`helm get`，和 `helm repo`。

有關這些命令的更多訊息，請查看 Helm 的內置幫助命令：`helm help`。

在下一章中，我們來看一下如何開發 charts。
