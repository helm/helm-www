---
title: "プロジェクトの歴史"
description: "プロジェクトの歴史の概要を提供します。"
aliases: ["/docs/history/"]
weight: 4
---

Helm 3 は、
[インキュベーションの最終段階](https://github.com/cncf/toc/blob/master/process/graduation_criteria.adoc) の
[CNCF プロジェクト](https://www.cncf.io/projects/) です。

Helm は、現在 [Helm Classic](https://github.com/helm/helm-classic) として知られているものとして始まりました。
これは、2015年に開始され、
最初の KubeCon で導入された Deis プロジェクトです。

2016 年 1 月、プロジェクトは Kubernetes Deployment Manager と呼ばれる GCS ツールと統合され、
プロジェクトは [Kubernetes](https://kubernetes.io) の下に移動されました。
コードベースの統合の結果、
Helm 2.0 がその年の後半にリリースされました。
Helm 2 で生き残った Deployment Manager の主要な機能はサーバー側のコンポーネントで、
最終的な Helm 2.0 リリースでは DM から Tiller に名前が変更されました。

Helm は、2018 年 6 月に Kubernetes サブプロジェクトから本格的な CNCF プロジェクトに昇格しました。
Helm はトップレベルの管理組織を形成し、
Monocular、Helm Chart Repo、Chart Museum、そして後に Helm Hub など、
いくつかのプロジェクトが Helm プロジェクトに組み込まれました。

Helm 3 の開発サイクルが始まると、Tiller が削除され、
Helm はクライアントツールであるという当初のビジョンに近づきました。
ただし、Helm 3 は引き続き Kubernetes クラスター内のリリースを追跡しているため、
チームが共同で Helm リリースのセットで作業することができます。

Helm 3 は 2019 年 11 月にリリースされました。
