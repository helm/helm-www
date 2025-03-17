---
title: "Helm स्थापित करना"
description: "Helm को स्थापित करने और इसे चलाने का तरीका जानें।"
weight: 2
aliases: ["/docs/install/"]
---

यह गाइड दिखाती है कि Helm CLI को कैसे इंस्टॉल किया जाए। Helm को या तो स्रोत से इंस्टॉल किया जा सकता है या पहले से निर्मित बाइनरी रिलीज़ से।

## Helm प्रोजेक्ट से  

Helm प्रोजेक्ट Helm को प्राप्त करने और इंस्टॉल करने के दो तरीके प्रदान करता है। ये Helm रिलीज़ प्राप्त करने के आधिकारिक तरीके हैं। इसके अलावा, Helm समुदाय विभिन्न पैकेज मैनेजरों के माध्यम से Helm को इंस्टॉल करने के तरीके भी प्रदान करता है। उन तरीकों की जानकारी आधिकारिक विधियों के नीचे दी गई है।

### बाइनरी रिलीज़ से  

Helm के हर [रिलीज़](https://github.com/helm/helm/releases) में विभिन्न ऑपरेटिंग सिस्टम के लिए बाइनरी रिलीज़ उपलब्ध होते हैं। इन बाइनरी संस्करणों को मैन्युअली डाउनलोड और इंस्टॉल किया जा सकता है।

1. अपनी [पसंदीदा संस्करण](https://github.com/helm/helm/releases) डाउनलोड करें।  
2. इसे अनपैक करें (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)।  
3. अनपैक की गई डायरेक्टरी में `helm` बाइनरी को ढूंढें और इसे अपनी इच्छित लोकेशन पर मूव करें (`mv linux-amd64/helm /usr/local/bin/helm`)।  

इसके बाद, आप क्लाइंट चला सकते हैं और [स्थिर चार्ट रिपॉजिटरी जोड़ सकते हैं](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository):  
`helm help`  

**नोट:** Helm के स्वचालित परीक्षण केवल Linux AMD64 के लिए GitHub Actions बिल्ड और रिलीज़ के दौरान किए जाते हैं। अन्य ऑपरेटिंग सिस्टम के परीक्षण की ज़िम्मेदारी उस समुदाय की है जो उस विशेष OS के लिए Helm का अनुरोध कर रहा है।

### स्क्रिप्ट से इंस्टॉलेशन  

Helm के पास अब एक इंस्टॉलर स्क्रिप्ट है जो स्वचालित रूप से Helm का नवीनतम संस्करण डाउनलोड करेगी और [स्थानीय रूप से इंस्टॉल](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3) करेगी।  

आप इस स्क्रिप्ट को डाउनलोड कर सकते हैं और फिर इसे स्थानीय रूप से चला सकते हैं। यह अच्छी तरह से प्रलेखित (documented) है ताकि आप इसे चलाने से पहले पढ़कर समझ सकें कि यह क्या कर रही है।

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

### स्रोत से (Linux, macOS)

स्रोत से Helm बनाना थोड़ा अधिक काम हो सकता है, लेकिन यदि आप Helm के नवीनतम (प्री-रिलीज़) संस्करण का परीक्षण करना चाहते हैं, तो यह सबसे अच्छा तरीका है।  

इसके लिए आपके पास एक कार्यशील Go वातावरण (Go environment) होना आवश्यक है।

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

यदि आवश्यक हो, तो यह निर्भरताओं (dependencies) को डाउनलोड और कैश करेगा, और कॉन्फ़िगरेशन को मान्य करेगा। इसके बाद, यह `helm` को कम्पाइल करेगा और इसे `bin/helm` में रखेगा।

## निष्कर्ष  

अधिकतर मामलों में, इंस्टॉलेशन केवल `helm` बाइनरी को डाउनलोड और उपयोग करने जितना सरल होता है। यह दस्तावेज़ उन उपयोगकर्ताओं के लिए अतिरिक्त जानकारी प्रदान करता है जो Helm के साथ अधिक उन्नत कार्य करना चाहते हैं।  

एक बार जब आप Helm क्लाइंट को सफलतापूर्वक इंस्टॉल कर लेते हैं, तो आप चार्ट्स को प्रबंधित करने और [स्थिर चार्ट रिपॉजिटरी जोड़ने](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository) के लिए आगे बढ़ सकते हैं।