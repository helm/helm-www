---
title: تثبيت Helm
description: تعلم كيفية تثبيت وتشغيل Helm.
sidebar_position: 2
---
هذا الدليل يشرح كيفية تثبيت واجهة سطر الأوامر (CLI) لـ Helm. يمكن تثبيت Helm إما من المصدر أو من الإصدارات الثنائية الجاهزة.
#!/usr/bin/env mdx

# Install Helm

To install Helm, run:

```sh
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Verify installation:

```sh
helm version
```

---
<!-- mdx: off -->


---

## من مشروع Helm

نقدم لك طريقتين للحصول على وتثبيت Helm. إليك الطرق الرسمية للحصول على الإصدارات الخاصة بالتطبيق. بالإضافة إلى ذلك، توفر مجتمع Helm طرقًا لتثبيت Helm من خلال مديري الحزم المختلفين.

---

# من الإصدارات الثنائية

كل إصدار من Helm يوفر ملفات ثنائية لعدة أنظمة تشغيل.

### 1. قم بتنزيل الإصدار المناسب  
### 2. فك ضغط الأرشيف:

```sh
tar -zxvf helm-v3.0.0-linux-amd64.tar.gz
```

### 3. انقل الملف التنفيذي:

```sh
mv linux-amd64/helm /usr/local/bin/helm
```

بعد ذلك يمكنك تشغيل:

```sh
helm help
```

ملاحظة: يتم إجراء الاختبارات الرسمية فقط على Linux AMD64.

---

# من خلال السكربت

```sh
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

أو:

```sh
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

---

# عبر مديري الحزم<!-- mdx: on -->


## Homebrew (macOS)

```sh
brew install helm
```

## Chocolatey (Windows)

```sh
choco install kubernetes-helm
```

## Winget (Windows)

```sh
winget install Helm.Helm
```

## Apt (Debian/Ubuntu)

```sh
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

## Snap

```sh
sudo snap install helm --classic
```

## FreeBSD pkg

```sh
pkg install helm
```

---

# إصدارات التطوير (Canary)

ملفات Canary متاحة على: get.helm.sh

---

# من المصدر (Linux, macOS)

```sh
git clone https://github.com/helm/helm.git
cd helm
make
```

بعد البناء، يتم حفظ الملف التنفيذي في: `bin/helm`.

---

# الخاتمة

في أغلب الحالات، يكون التثبيت بسيطًا باستخدام إصدار ثنائي جاهز.
بمجرد تثبيت Helm، يمكنك البدء باستخدامه لإدارة الـ Charts وإضافة المستودعات.

