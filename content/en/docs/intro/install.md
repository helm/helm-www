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

1. Download your [desired version](https://github.com/helm/helm/releases)
2. Unpack it (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Find the `helm` binary in the unpacked directory, and move it to its desired
   destination (`mv linux-amd64/helm /usr/local/bin/helm`)

From there, you should be able to run the client and [add the stable
chart repository](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository):
`helm help`.

**Note:** Helm automated tests are performed for Linux AMD64 only during
GitHub Actions builds and releases. Testing of other OSes are the responsibility of
the community requesting Helm for the OS in question.

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

### From Winget (Windows)

Members of the Helm community have contributed a [Helm
package](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) build to [Winget](https://learn.microsoft.com/en-us/windows/package-manager/). This package is generally up to date.

```console
winget install Helm.Helm
```

### From Apt (Debian/Ubuntu)

Members of the Helm community have contributed a [Helm
package](https://helm.baltorepo.com/stable/debian/) for Apt. This package is
generally up to date.

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### From dnf/yum (fedora)
Since Fedora 35, helm is available on the official repository.
You can install helm with invoking:

```console
sudo dnf install helm
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
chart repository](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository).
