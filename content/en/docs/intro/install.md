---
title: "Installing Helm"
description: "Learn how to install and get running with Helm."
weight: 2
aliases: ["/docs/install/"]
---

This guide shows how to install the Helm CLI. Helm can be installed either from
source, or from pre-built binary releases.

## From The Helm Project

The Helm project provides two ways to fetch and install Helm. These are the
official methods to get Helm releases. In addition to that, the Helm community
provides methods to install Helm through different package managers.
Installation through those methods can be found below the official methods.

### From the Binary Releases

Every [release](https://github.com/helm/helm/releases) of Helm provides binary
releases for a variety of OSes. These binary versions can be manually downloaded
and installed.

1. Search for and select your desired Helm release from the GitHub [releases](https://github.com/helm/helm/releases)
2. Download the binary for your platform from the **Installation and Upgrading** section — note that the **Assets** attached to a release contain [archives of the source code](#from-source-linux-macos) and [`*.asc` signature files](#validating-binaries), not the platform binaries
3. Optionally [validate the integrity and attestation of the binary](#validating-binaries)
4. Unpack the binary (e.g. `tar -zxvf helm-v3.8.1-darwin-amd64.tar.gz`)
5. Find the `helm` binary in the unpacked directory, and move it to its desired destination (e.g. `mv darwin-amd64/helm /usr/local/bin/helm`)

From there, you should be able to run the client (`helm help`) and [add the stable
repo](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository).

**Note:** Helm automated tests are performed for Linux AMD64 only during
CircleCi builds and releases. Testing of other OSes are the responsibility of
the community requesting Helm for the OS in question.

#### Validating Binaries

Helm releases include:

- A sha256 checksum (`*.tar.gz.sha256sum`) to validate that the content of the download is what was generated for the release
- ASCII-armored public keys (`*.asc`) to provide traceability of where the download came from

For more information, please see the [**Release Checklist**](https://helm.sh/docs/community/release_checklist/#8-pgp-sign-the-downloads) documentation.

To validate the integrity and attestation of a downloaded binary:

1. Download the `*.tar.gz.sha256sum` file listed next to the binary you downloaded from the **Installation and Upgrading** section, saving it to the same directory where the binary is located
2. Download the `*.tar.gz.asc` and `*.tar.gz.sha256sum.asc` signature files that match the platform of your downloaded binary, saving them to the same directory where the binary is located — these `asc` files can be found in the **Assets** attached to a given [release](https://github.com/helm/helm/releases)
3. Validate the integrity of the downloaded binary by verifying the sha256 checksum, e.g.

```
> $ sha256sum -c helm-v3.8.1-darwin-amd64.tar.gz
```
```
helm-v3.8.1-darwin-amd64.tar.gz: OK
```

4. Validate the attestation of the downloaded binary by cloning the source code repository, importing Helm's `KEYS` file into your keyring, and verifying the signatures, e.g.

```
> $ curl --show-error --silent https://raw.githubusercontent.com/helm/helm/main/KEYS | gpg --import -
> $ gpg --verify helm-v3.8.1-darwin-amd64.tar.gz.asc helm-v3.8.1-darwin-amd64.tar.gz
> $ gpg --verify helm-v3.8.1-darwin-amd64.tar.gz.sha256sum.asc helm-v3.8.1-darwin-amd64.tar.gz.sha256sum
```

**Note:** The example commands above demonstrate the validation process on macOS. The process is similar for other platforms, but the exact tools and commands may vary slightly.

### From Script

Helm now has an installer script that will automatically grab the latest version
of Helm and [install it
locally](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

You can fetch that script, and then execute it locally. It's well documented so
that you can read through it and understand what it is doing before you run it.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Yes, you can `curl
https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` if
you want to live on the edge.

## Through Package Managers

The Helm community provides the ability to install Helm through operating system
package managers. These are not supported by the Helm project and are not
considered trusted 3rd parties.

### From Homebrew (macOS)

Members of the Helm community have contributed a Helm formula build to Homebrew.
This formula is generally up to date.

```console
brew install helm
```

(Note: There is also a formula for emacs-helm, which is a different project.)

### From Chocolatey (Windows)

Members of the Helm community have contributed a [Helm
package](https://chocolatey.org/packages/kubernetes-helm) build to
[Chocolatey](https://chocolatey.org/). This package is generally up to date.

```console
choco install kubernetes-helm
```

### From Scoop (Windows)

Members of the Helm community have contributed a [Helm
package](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json) build to [Scoop](https://scoop.sh). This package is generally up to date.

```console
scoop install helm
```

### From Apt (Debian/Ubuntu)

Members of the Helm community have contributed a [Helm
package](https://helm.baltorepo.com/stable/debian/) for Apt. This package is
generally up to date.

```console
curl https://baltocdn.com/helm/signing.asc | sudo apt-key add -
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### From Snap

The [Snapcrafters](https://github.com/snapcrafters) community maintains the Snap
version of the [Helm package](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

### From pkg (FreeBSD)

Members of the FreeBSD community have contributed a [Helm
package](https://www.freshports.org/sysutils/helm) build to the
[FreeBSD Ports Collection](https://man.freebsd.org/ports).
This package is generally up to date.

```console
pkg install helm
```

### Development Builds

In addition to releases you can download or install development snapshots of
Helm.

### From Canary Builds

"Canary" builds are versions of the Helm software that are built from the latest
`main` branch. They are not official releases, and may not be stable. However,
they offer the opportunity to test the cutting edge features.

Canary Helm binaries are stored at [get.helm.sh](https://get.helm.sh). Here are
links to the common builds:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### From Source (Linux, macOS)

Building Helm from source is slightly more work, but is the best way to go if
you want to test the latest (pre-release) Helm version.

You must have a working Go environment.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

If required, it will fetch the dependencies and cache them, and validate
configuration. It will then compile `helm` and place it in `bin/helm`.

## Conclusion

In most cases, installation is as simple as getting a pre-built `helm` binary.
This document covers additional cases for those who want to do more
sophisticated things with Helm.

Once you have the Helm Client successfully installed, you can move on to using
Helm to manage charts and [add the stable
repo](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository).
