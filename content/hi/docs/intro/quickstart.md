---
title: "त्वरित प्रारंभ मार्गदर्शिका"
description: "Helm को इंस्टॉल करने और शुरू करने के निर्देश, जिसमें विभिन्न डिस्ट्रीब्यूशन्स, सामान्य प्रश्न (FAQs), और प्लगइन्स के लिए जानकारी शामिल है।"
weight: 1
aliases: ["/docs/quickstart/"]
---

यह मार्गदर्शिका बताती है कि आप Helm का उपयोग कैसे जल्दी शुरू कर सकते हैं।

## आवश्यक पूर्व-शर्तें (Prerequisites)

Helm का सफलतापूर्वक और सुरक्षित रूप से उपयोग करने के लिए निम्नलिखित पूर्व-शर्तें आवश्यक हैं:

1. एक Kubernetes क्लस्टर  
2. यह निर्णय लेना कि आप इंस्टॉलेशन के लिए कौन-कौन से सुरक्षा कॉन्फ़िगरेशन लागू करना चाहते हैं (यदि कोई हों)  
3. Helm को इंस्टॉल और कॉन्फ़िगर करना  

### Kubernetes इंस्टॉल करें या किसी क्लस्टर तक पहुंच हो

- आपके सिस्टम पर Kubernetes इंस्टॉल होना आवश्यक है। Helm के नवीनतम संस्करण के लिए, हम Kubernetes के नवीनतम स्थिर (stable) संस्करण का उपयोग करने की सलाह देते हैं, जो अधिकांश मामलों में दूसरा नवीनतम माइनर रिलीज़ होता है।  
- आपके पास `kubectl` का एक स्थानीय रूप से कॉन्फ़िगर किया गया संस्करण भी होना चाहिए।

Helm और Kubernetes के बीच अधिकतम संस्करण अंतर (version skew) के लिए, [Helm संस्करण समर्थन नीति](https://helm.sh/docs/topics/version_skew/) देखें।

## Helm इंस्टॉल करें

Helm क्लाइंट का एक बाइनरी रिलीज़ डाउनलोड करें। आप `homebrew` जैसे टूल का उपयोग कर सकते हैं,  
या [आधिकारिक रिलीज़ पेज](https://github.com/helm/helm/releases) देख सकते हैं।

अन्य विकल्पों और विस्तृत जानकारी के लिए, [इंस्टॉलेशन गाइड]({{< ref "install.md" >}}) देखें।


## Helm चार्ट रिपॉजिटरी प्रारंभ करें

जब आपका Helm तैयार हो जाए, तो आप एक चार्ट रिपॉजिटरी जोड़ सकते हैं।  
उपलब्ध Helm चार्ट रिपॉजिटरीज़ देखने के लिए [Artifact Hub](https://artifacthub.io/packages/search?kind=0) पर जाएँ।

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

इंस्टॉल हो जाने के बाद, आप इंस्टॉल किए जा सकने वाले चार्ट्स की सूची देख सकते हैं:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... और भी बहुत से
```

## एक उदाहरण चार्ट इंस्टॉल करें

कोई चार्ट इंस्टॉल करने के लिए आप `helm install` कमांड का उपयोग कर सकते हैं।  
Helm चार्ट खोजने और इंस्टॉल करने के कई तरीके देता है, पर सबसे आसान तरीका है `bitnami` चार्ट्स का उपयोग करना।

```console
$ helm repo update              # चार्ट्स की नवीनतम सूची प्राप्त करें
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

ऊपर के उदाहरण में, `bitnami/mysql` चार्ट इंस्टॉल किया गया है, और नए रिलीज़ का नाम है `mysql-1612624192`।

इस MySQL चार्ट की विशेषताओं की जानकारी के लिए आप चला सकते हैं:

```bash
$ helm show chart bitnami/mysql
```

या फिर:

```bash
$ helm show all bitnami/mysql
```

हर बार जब आप कोई चार्ट इंस्टॉल करते हैं, एक नया रिलीज़ बनता है। इसका मतलब है कि एक ही चार्ट को आप  
एक ही क्लस्टर में कई बार इंस्टॉल कर सकते हैं, और हर रिलीज़ को स्वतंत्र रूप से मैनेज और अपग्रेड किया जा सकता है।

`helm install` एक बहुत ही शक्तिशाली कमांड है, जिसके पास कई क्षमताएँ होती हैं।  
इसकी पूरी जानकारी के लिए देखें: [Helm उपयोग गाइड]({{< ref "using_helm.md" >}})

## रिलीज़ के बारे में जानें

Helm से रिलीज़ की जानकारी प्राप्त करना बेहद आसान है:

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

`helm list` (या `helm ls`) कमांड आपके सभी डिप्लॉय किए गए रिलीज़ की सूची दिखाती है।

## किसी रिलीज़ को अनइंस्टॉल करें

किसी रिलीज़ को हटाने के लिए `helm uninstall` कमांड का उपयोग करें:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

यह कमांड Kubernetes से `mysql-1612624192` रिलीज़ को हटा देगा और उससे जुड़ी सारी resources  
और उसकी रिलीज़ हिस्ट्री को मिटा देगा।

यदि आप `--keep-history` फ्लैग का उपयोग करते हैं, तो रिलीज़ की हिस्ट्री बनी रहेगी।  
आप उस रिलीज़ की जानकारी बाद में भी प्राप्त कर सकेंगे:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Helm आपके रिलीज़ का हिसाब रखता है, भले ही आपने उन्हें हटा दिया हो।  
इससे आप क्लस्टर की हिस्ट्री का ऑडिट कर सकते हैं, और ज़रूरत पड़ने पर `helm rollback` से रिलीज़ वापस भी ला सकते हैं।


## सहायता जानकारी पढ़ना

Helm की उपलब्ध कमांड्स के बारे में जानने के लिए `helm help` कमांड चलाएँ  
या किसी भी कमांड के साथ `-h` फ्लैग जोड़ें:

```console
$ helm get -h
```