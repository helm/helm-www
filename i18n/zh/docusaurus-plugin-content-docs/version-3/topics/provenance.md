---
title: Helm 来源和完整性
description: 描述如何验证 chart 的完整性和来源。
sidebar_position: 5
---

Helm 提供了来源验证工具，帮助 chart 用户验证包的完整性和来源。使用基于 PKI、GnuPG 及流行包管理器的行业标准工具，Helm 可以生成和验证签名文件。

## 概述

完整性是通过比较 chart 的来源记录来建立的。来源记录存储在 _来源文件_ 中，和打包好的 chart 放在一起。例如，如果有个名为 `myapp-1.2.3.tgz` 的 chart，则它的来源文件是 `myapp-1.2.3.tgz.prov`。

来源文件会在打包时生成（`helm package --sign ...`），并可以通过多个命令进行检查，尤其是 `helm install --verify`。

## 工作流

本节描述如何有效使用来源数据的工作流。

前置条件：

- 有效的二进制格式（非 ASCII-armored）的 PGP 密钥对
- `helm` 命令行工具
- GnuPG 命令行工具（可选）
- Keybase 命令行工具（可选）

**注意：** 如果你的 PGP 私钥有密码，系统会提示你为所有支持 `--sign` 选项的命令输入密码。

创建新的 chart 与之前一样：

```console
$ helm create mychart
Creating mychart
```

准备好打包后，在 `helm package` 命令中添加 `--sign` 参数，并指定签名密钥的名称和包含相应私钥的密钥环：

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**注意：** `--key` 参数的值必须是对应密钥 `uid`（在 `gpg --list-keys` 输出中）的子字符串，例如名字或邮箱。**指纹码 _不能_ 使用。**

**提示：** 对于 GnuPG 用户，你的私钥密钥环位于 `~/.gnupg/secring.gpg`。可以使用 `gpg --list-secret-keys` 列出你拥有的密钥。

**警告：** GnuPG v2 在默认位置 `~/.gnupg/pubring.kbx` 使用新格式 `kbx` 存储密钥环。请使用以下命令将密钥环转换为传统的 gpg 格式：

```console
$ gpg --export >~/.gnupg/pubring.gpg
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

此时，你应该同时看到 `mychart-0.1.0.tgz` 和 `mychart-0.1.0.tgz.prov` 两个文件。这两个文件最终都会被上传到对应的 chart 仓库。

可以使用 `helm verify` 验证 chart：

```console
$ helm verify mychart-0.1.0.tgz
```

验证失败的输出如下：

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

在安装时同时验证，使用 `--verify` 参数：

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

如果包含签名 chart 对应公钥的密钥环不在默认位置，需要使用 `--keyring PATH` 指定密钥环路径，与 `helm package` 示例类似。

如果验证失败，chart 的安装会在渲染前中止。

### 使用 Keybase.io 凭据

[Keybase.io](https://keybase.io) 服务使得建立加密身份的信任链变得很容易。Keybase 凭据可以用于签名 chart。

前置条件：

- 已配置的 Keybase.io 账户
- 本地已安装 GnuPG
- 本地已安装 `keybase` CLI

#### 对包签名

第一步是将 Keybase 密钥导入本地的 GnuPG 密钥环：

```console
$ keybase pgp export -s | gpg --import
```

这会将你的 Keybase 密钥转换成 OpenPGP 格式，然后导入到本地的 `~/.gnupg/secring.gpg` 文件。

可以运行 `gpg --list-secret-keys` 进行确认：

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

注意你的密钥会有一个标识字符串：

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

这是密钥的完整名称。

然后，可以使用 `helm package` 打包和签名 chart。确保在 `--key` 参数中使用名称的一部分：

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

`package` 命令会同时生成 `.tgz` 文件和 `.tgz.prov` 文件。

#### 验证包

你也可以使用类似的方法验证由其他 Keybase 密钥签名的 chart。例如，你要验证由 `keybase.io/technosophos` 签名的包，可以使用 `keybase` 工具：

```console
$ keybase follow technosophos
$ keybase pgp pull
```

第一个命令会关注用户 `technosophos`。然后 `keybase pgp pull` 会下载你关注的所有账户的 OpenPGP 密钥，并将它们放入 GnuPG 密钥环（`~/.gnupg/pubring.gpg`）。

此时，就可以使用 `helm verify` 或其他带 `--verify` 参数的命令：

```console
$ helm verify somechart-1.2.3.tgz
```

### chart 无法验证的原因

验证失败通常有以下原因：

- `.prov` 文件缺失或损坏。这说明配置有误，或者原始维护者没有创建来源文件。
- 签名文件所用的密钥不在你的密钥环中。这说明签名 chart 的实体不是你已标记为信任的人。
- `.prov` 文件验证失败。这说明 chart 或来源数据本身有问题。
- 来源文件中的文件哈希与归档文件的哈希不匹配。这表明 chart 包已被篡改。

如果验证失败，就有理由不信任该包。

## 来源文件

来源文件包含 chart 的 YAML 文件以及一些验证信息。来源文件会自动生成。

会添加以下来源数据：

* chart 文件（`Chart.yaml`）包含在内，让人和工具都可以方便地查看 chart 的内容。
* chart 包（`.tgz` 文件）的签名（SHA256，类似 Docker）包含在内，可用于验证 chart 包的完整性。
* 整个文件体使用 OpenPGP 算法签名（参见 [Keybase.io](https://keybase.io)，一种使加密签名和验证更简单的新方式）。

这些内容的组合为用户提供以下保证：

* 包本身没有被篡改（通过 `.tgz` 包的校验和）。
* 发布该包的实体是可知的（通过 GnuPG/PGP 签名）。

文件格式类似这样：

```
Hash: SHA512

apiVersion: v2
appVersion: "1.16.0"
description: Sample chart
name: mychart
type: application
version: 0.1.0

...
files:
  mychart-0.1.0.tgz: sha256:d31d2f08b885ec696c37c7f7ef106709aaf5e8575b6d3dc5d52112ed29a9cb92
-----BEGIN PGP SIGNATURE-----

wsBcBAEBCgAQBQJdy0ReCRCEO7+YH8GHYgAAfhUIADx3pHHLLINv0MFkiEYpX/Kd
nvHFBNps7hXqSocsg0a9Fi1LRAc3OpVh3knjPfHNGOy8+xOdhbqpdnB+5ty8YopI
mYMWp6cP/Mwpkt7/gP1ecWFMevicbaFH5AmJCBihBaKJE4R1IX49/wTIaLKiWkv2
cR64bmZruQPSW83UTNULtdD7kuTZXeAdTMjAK0NECsCz9/eK5AFggP4CDf7r2zNi
hZsNrzloIlBZlGGns6mUOTO42J/+JojnOLIhI3Psd0HBD2bTlsm/rSfty4yZUs7D
qtgooNdohoyGSzR5oapd7fEvauRQswJxOA0m0V+u9/eyLR0+JcYB8Udi1prnWf8=
=aHfz
-----END PGP SIGNATURE-----
```

注意 YAML 部分包含两个文档（用 `...\n` 分隔）。第一个文档是 `Chart.yaml` 的内容。第二个是校验和，即打包时文件名到该文件内容 SHA-256 摘要的映射。

签名块是标准的 PGP 签名，提供[防篡改](https://www.rossde.com/PGP/pgp_signatures.html)功能。

## Chart 仓库

Chart 仓库是 Helm chart 的集中存储。

Chart 仓库必须能够通过 HTTP 请求提供来源文件，且来源文件必须与 chart 位于相同的 URI 路径下。

例如，如果包的基础 URL 是 `https://example.com/charts/mychart-1.2.3.tgz`，那么来源文件（如果存在）必须可以通过 `https://example.com/charts/mychart-1.2.3.tgz.prov` 访问。

从终端用户的角度来看，`helm install --verify myrepo/mychart-1.2.3` 应该同时下载 chart 和来源文件，无需额外的用户配置或操作。

### 基于 OCI 的注册中心中的签名

将 chart 发布到[基于 OCI 的注册中心](/zh/topics/registries.md)时，可以使用 [`helm-sigstore` 插件](https://github.com/sigstore/helm-sigstore/)将来源信息发布到 [sigstore](https://sigstore.dev/)。[如文档所述](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md)，创建来源文件和使用 GPG 密钥签名的过程是相同的，但可以使用 `helm sigstore upload` 命令将来源信息发布到不可变的透明日志中。

## 建立权威和真实性

在处理信任链系统时，建立签名者的权威性非常重要。简单来说，上述系统建立在你信任签名 chart 的人这一事实之上。这意味着你需要信任签名者的公钥。

Helm 的一个设计决策是 Helm 项目不会作为信任链中的必要一方。我们不想成为所有 chart 签名者的"证书颁发机构"，而是更倾向于去中心化模型，这也是我们选择 OpenPGP 作为基础技术的原因之一。因此，在建立权威性方面，我们在 Helm 2 中基本没有定义这一步骤（这一决定在 Helm 3 中延续）。

不过，对于有兴趣使用来源系统的人，我们有一些提示和建议：

- [Keybase](https://keybase.io) 平台提供了一个公共的集中式信任信息仓库。
  - 你可以使用 Keybase 存储你的密钥或获取其他人的公钥。
  - Keybase 还有非常出色的文档。
  - 虽然我们还没有测试过，但 Keybase 的"安全站点"功能可以用来托管 Helm chart。
  - 基本思路是：官方"chart 审核人"使用他（她）的密钥签名 chart，然后将来源文件上传到 chart 仓库。
  - 有人提出过一个想法：在仓库的 `index.yaml` 文件中包含有效签名密钥的列表。
