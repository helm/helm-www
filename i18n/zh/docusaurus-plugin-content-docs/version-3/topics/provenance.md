---
title: Helm来源和完整性
description: 描述如何验证Chart的完整性和来源。
sidebar_position: 5
---

Helm有一个来源工具帮助chart用户检测包的完整性和来源。使用基于PKI，GnuPG及流行包管理器的行业标准工具，Helm可以生成和检测签名文件。

## 概述

完整性是通过比较chart的出处记录来建立的。出处记录存储在 _出处文件_，和打包好的chart放在一起。比如，
如果有个名为`myapp-1.2.3.tgz`的chart，则它的出处文件是`myapp-1.2.3.tgz.prov`。

出处文件会在打包时生成(`helm package --sign ...`)，并可以通过多重命名检查，尤其是`helm install --verify`。

## 工作流

这部分描述有效使用源数据的潜在工作流。

前置条件：

- 合法的二进制格式（非ASCII包裹）的PGP密钥对
- `helm`命令行工具
- GnuPG命令行工具（可选）
- Keybase命令行工具（可选）

**注意：** 如果你的PGP私钥有密码，系统将提示你为所有支持`--sign`选项的命令输入密码。

创建新的chart与之前一样：

```console
$ helm create mychart
Creating mychart
```

一旦准备好打包了，使用`helm package`命令时添加`--sign`参数，并且指定已知的字符串key和包含相应私钥的秘钥环：

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**注意：** `--key`参数的值必须是对应key的`uid`(在`gpg --list-keys`输出列表中)的子字符串，比如名字或者email。
**指纹码 _不能_ 使用。**

**提示：** 针对GnuPG用户，你的私钥的keyring在`~/.gnupg/secring.gpg`。你可以使用`gpg --list-secret-keys`列出你需要的key。

**警告：** GnuPG v2版在默认位置`~/.gnupg/pubring.kbx`使用了新格式`kbx`存储私钥的keyring。使用以下命令将你的keyring转换到传统的gpg格式：

```console
$ gpg --export >~/.gnupg/pubring.gpg
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

此时，您应该同时看到了`mychart-0.1.0.tgz`和`mychart-0.1.0.tgz.prov`。 这两个文件最终都会被上传到对应的chart仓库。

您可以使用`helm verify`验证chart：

```console
$ helm verify mychart-0.1.0.tgz
```

失败的验证如下：

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

在安装时同时验证，使用`--verify`参数。

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

如果keyring包含的与签名chart关联的公钥不在默认位置，需要在打包`helm package`时使用`--keyring PATH`指定keyring的path。

如果验证失败，chart的安装会在渲染前中止。

### 使用Keybase.io证书

[Keybase.io](https://keybase.io) 服务使得建立加密身份的信任链变得很容易。

前置条件：

- 配置 Keybase.io 账户
- 本地已安装GnuPG
- 本地已安装`keybase` CLI

#### 对包签名

第一步是将keybase秘钥导入本地的GnuPG的秘钥环keyring：

```console
$ keybase pgp export -s | gpg --import
```

这会将你的Keybase秘钥转成OpenPGP格式，然后将其导入本地的`~/.gnupg/secring.gpg`文件。

可以运行`gpg --list-secret-keys`进行双重检测。

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

注意你的秘钥会有一个标识字符串：

```console
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

这个是秘钥的全名。

然后，可以使用`helm package`打包和签名。确保在`--key`参数中使用名称的一部分。

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

`package`命令会生成一个`.tgz`文件和一个`.tgz.prov`文件。

#### 验证包

您可以使用类似的方法验证被其他Keybase秘钥签名的chart。比如你要验证使用`keybase.io/technosophos`签名的包，可使用`keybase`工具：

```console
$ keybase follow technosophos
$ keybase pgp pull
```

上面第一个命令追踪了用户`technosophos`。然后使用`keybase pgp pull`下载你追踪的所有的账户的OpenPGP秘钥，并把它们放置在GnuPG秘钥环中(`~/.gnupg/pubring.gpg`)。

此时，就可以使用`helm verify`或者其他带`--verify`的命令：

```console
$ helm verify somechart-1.2.3.tgz
```

### chart无法验证的原因

一般失败的原因有这些：

- The `.prov` file is missing or corrupt. 说明有配置错误或者原有维护者没有创建源文件。
- The key used to sign the file is not in your keyring. 说明这个签名chart的秘钥不是你已经注明为信任的秘钥。
- The verification of the `.prov` file failed. 这说明chart或者源数据有错误。
- The file hashes in the provenance file do not match the hash of the archive
  file. 表明chart包已经被篡改。

如果验证失败，就有理由不信任该包。

## 来源文件

来源文件包含chart的YAML文件加上一些验证信息。来源文件会自动生成。

会添加下列源数据：

- chart文件(`Chart.yaml`) 让人和工具都可以看到chart中的内容。
- chart包（`.tgz`文件）签名(SHA256，就像Docker)，可以用来验证chart包的完整性。
- 使用了OpenPGP算法签名所有内容（查看[Keybase.io](https://keybase.io)，一种使签名和验证更简单的新式方法）。

这些内容的结合给予了用户以下保证：

- 包本身不会被篡改(`.tgz`包的校验和).
- 发布包的人是可知的(通过GnuPG/PGP签名).

文件格式类似这样：

```console
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

注意YAML部分包含了两个文档，（用`...\n`分隔）。第一个文档是`Chart.yaml`内容。第二个是文件内容打包时文件名的SHA-256校验和。

签名是标准的PGP签名，用于[防篡改](https://www.rossde.com/PGP/pgp_signatures.html)。

## Chart仓库

Chart仓库是一个Helm chart的集合。

Chart仓库必须要保证通过指定的http请求提供源文件，同时要确保使用同样URI路径的chart是可用的。

比如，如果包的基础URL是`https://example.com/charts/mychart-1.2.3.tgz`，则若是存在的源文件地址`https://example.com/charts/mychart-1.2.3.tgz.prov`必须能访问。

从终端用户的角度来看，`helm install --verify myrepo/mychart-1.2.3`应该同时下载chart和源文件，且不需要额外的用户配置或操作。

## 建立权威和真实性

当处理信任链系统时，建立签名者的权威变得非常重要。或者简单来说，上面的系统实际上取决于你信任的签名chart的人。也就意味着你需要信任签名者的公钥。

Helm的一个设计决策是Helm项目不会将自己作为必须的一方插入到信任链中。我们不想针对所有的chart签名者成为“证书颁发机构”，
而是更喜欢分布式模型，这是我们选择OpenPGP作为我们的基础技术的原因之一。所以在建立权威的问题上，在chart 2中或多或少没有定义这一步（会在接下来的Helm
3中决定）。

当然，对于使用源系统感兴趣的人，我们有一些提示和建议：

- [Keybase](https://keybase.io)平台为可靠信息提供了一个公共的中心化的仓库。
  - 你可以使用Keybase存储你的key或者获取其他人的公钥。
  - Keybase还有非常好的文档
  - 我们还没有测试的时候，Keybase的“安全站点”特性可以提供Helm chart。
  - 基础想法是一个官方的“chart审核人”使用他（她）的私钥签名，然后上传源文件到chart仓库。
  - 该想法的一些做法是在仓库的`index.yaml`文件中列出一些合法的秘钥。

