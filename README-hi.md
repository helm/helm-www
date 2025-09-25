![github-banner-helm-helmwww](https://user-images.githubusercontent.com/686194/68531441-f4ad4e00-02c6-11ea-982b-74d7c3ff0071.png)

यहाँ पर आपको [Helm](https://github.com/helm/helm) प्रोजेक्ट की आधिकारिक वेबसाइट Helm.sh से संबंधित सभी संसाधन मिलेंगे। यदि आप दस्तावेज़ (Docs) संपादित करना, वेबसाइट में किसी बग की रिपोर्ट करना, या एक नया ब्लॉग पोस्ट लिखना चाहते हैं, तो आप सही जगह पर आए हैं!  

---

## **डेवलपमेंट (विकास)**  

Helm.sh एक साधारण [Hugo](https://gohugo.io/) स्टेटिक साइट है, जो एक कस्टम थीम के साथ बनी हुई है। इस वेबसाइट को लोकल (स्थानीय रूप से) चलाने के लिए, आपको पहले Hugo एक्सटेंडेड एडिशन और आवश्यक निर्भरताओं को [इंस्टॉल](https://gohugo.io/getting-started) करना होगा।  

```sh
brew install hugo
yarn install
```

इसके बाद आप वेबसाइट को लोकल रूप से कंपाइल और रन कर सकते हैं:  

```sh
hugo serve
```

---

## **डिप्लॉयमेंट (परिनियोजन)** ![Netlify Status](https://api.netlify.com/api/v1/badges/8ffabb30-f2f4-45cc-b0fa-1b4adda00b5e/deploy-status)  

कोई भी परिवर्तन जब `main` ब्रांच में मर्ज किया जाता है, तो यह अपने आप [Netlify](https://app.netlify.com/sites/helm-merge/deploys) पर डिप्लॉय हो जाता है।  

बिल्ड लॉग्स यहाँ देखे जा सकते हैं: [Netlify Deploys](https://app.netlify.com/sites/helm-merge/deploys)  

---

## **योगदान (Contributing)**  

कोई भी व्यक्ति Helm.sh को संपादित करने के लिए PR (Pull Request) सबमिट कर सकता है। लेकिन हम चाहते हैं कि सभी कमिट्स साइन किए जाएं। कृपया [योगदान गाइड](https://github.com/helm/helm/blob/main/CONTRIBUTING.md#sign-your-work) देखें।  

Pull requests को मर्ज करने से पहले [मेंटेनर्स](https://github.com/helm/helm-www/blob/main/OWNERS) की स्वीकृति आवश्यक है।  

---

### **Helm डॉक्स (Docs) कैसे संपादित करें**  

Helm 3 के रिलीज़ के बाद से, सभी प्रोजेक्ट दस्तावेज़ `/content/en/docs/` फोल्डर में संग्रहीत हैं।  

पुराने संस्करणों के लिए, मुख्य Helm रिपॉज़िटरी की `dev-v2` ब्रांच देखें: [Helm Dev-v2](https://github.com/helm/helm/tree/dev-v2/docs)  

---

### **Helm CLI रेफरेंस डॉक्स अपडेट करना**  

Helm CLI कमांड्स की सूची [मुख्य Helm रिपॉज़िटरी](https://github.com/helm/helm/blob/a6b2c9e2126753f6f94df231e89b2153c2862764/cmd/helm/root.go#L169) से एक्सपोर्ट की जाती है और [वेबसाइट पर](https://helm.sh/docs/helm) दिखाई जाती है।  

इन्हें अपडेट करने के लिए:  

1. सभी इंस्टॉल किए गए प्लगइन्स हटा दें:  
   ```sh
   helm plugin uninstall
   ```
2. `content/en/docs/helm/` फोल्डर में जाएँ।  
3. निम्नलिखित कमांड चलाएँ:  
   ```sh
   HOME='~' helm docs --type markdown --generate-headers
   ```
4. बदलावों को कमिट करें और PR बनाकर वेबसाइट अपडेट करें।  

---

### **ब्लॉग पोस्ट कैसे लिखें**  

ब्लॉग पोस्ट्स PR के ज़रिए जोड़े जाते हैं।  

1) `content/en/blog/` डायरेक्ट्री में एक नया Markdown फ़ाइल बनाएँ, जिसका नाम प्रकाशित करने की तारीख और शीर्षक हो। उदाहरण देखें।  
2) इस फॉर्मेट में हेडर मेटा-डेटा जोड़ें:  

```yaml
---
title: "एक शानदार शीर्षक"
slug: "shandar-title"
authorname: "कैप्टन अमेज़िंग"
authorlink: "https://example.com"
date: "yyyy-mm-dd"
---
```

3) `---` के नीचे Markdown में सामग्री जोड़ें।  
4) सभी इमेजेज़ `/content/en/blog/images/` फोल्डर में रखें।  
5) `_Read More_` लिंक जोड़ने के लिए `<!--more-->` ब्रेक का उपयोग करें।  

ब्लॉग PR को मर्ज करने से पहले कोर Helm [मेंटेनर्स](https://github.com/helm/helm/blob/main/OWNERS) की मंजूरी आवश्यक है।  

---

### **अंतर्राष्ट्रीयकरण और अनुवाद (Internationalization & Translation)**  

हमारी वेबसाइट और दस्तावेज़ों के अनुवादों का स्वागत है, जिससे दुनिया भर के लोगों को Helm तक पहुंचने में मदद मिलेगी।  

Helm.sh कई भाषाओं का समर्थन करता है। अधिक जानकारी के लिए [Helm डॉक्स अनुवाद गाइड](https://helm.sh/docs/community/localization/) देखें।  

---

### **नैतिक आचार संहिता (Code of Conduct)**  

Helm समुदाय में भागीदारी करना Helm की [नैतिक आचार संहिता](https://github.com/helm/helm/blob/main/code-of-conduct.md) द्वारा शासित है।  

---

### **धन्यवाद!**  

हमारी वेबसाइट और दस्तावेज़ों में आपके योगदान के लिए धन्यवाद! 👏