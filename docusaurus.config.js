// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const siteURL = process.env.SITE_URL || "http://localhost:3000";
const rawBaseUrl = process.env.BASE_URL;
const normalizedBaseUrl =
  rawBaseUrl === undefined
    ? "/"
    : rawBaseUrl.endsWith("/")
    ? rawBaseUrl
    : rawBaseUrl + "/";

// Community documentation configuration
const communityConfig = require("./remote-content_community");
const {
  processConfig,
  createEditUrlFunction,
} = require("./src/utils/communityDocsHelpers");
const {
  transformImportedContent,
} = require("./src/utils/communityDocsTransforms");

// Process the community docs configuration
const {
  documents: remoteDocPaths,
  metaByPath,
  slugByPath,
  linkExceptions,
} = processConfig(communityConfig);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Helm",
  tagline: "The package manager for Kubernetes",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Opt-in to less strict, standard CommonMark support with options
  // Automatically detects .md and .mdx extensions
  // See https://docusaurus.io/docs/markdown-features/react#markdown-and-jsx-interoperability
  // See https://github.com/prettier/prettier/issues/17089
  markdown: {
    format: "detect",
  },

  // Set the production url of your site here
  url: siteURL,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: normalizedBaseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "helm", // Usually your GitHub org/user name.
  projectName: "helm-www", // Usually your repo name.

  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "el", "es", "fr", "ja", "ko", "pt", "ru", "uk", "zh"],
    localeConfigs: {
      en: {
        htmlLang: "en-us",
        label: "English",
      },
      de: {
        label: "Deutsch (German)",
      },
      es: {
        label: "Español (Spanish)",
      },
      fr: {
        label: "Français (French)",
      },
      el: {
        label: "Ελληνικά (Greek)",
      },
      ja: {
        label: "日本語 (Japanese)",
      },
      ko: {
        label: "한국어 (Korean)",
      },
      pt: {
        label: "Português (Portuguese)",
      },
      ru: {
        label: "Русский (Russian)",
      },
      uk: {
        label: "Українська (Ukrainian)",
      },
      zh: {
        label: "中文 (Chinese)",
      },
    },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/helm/helm-www/blob/main/",
          // Links "edit this page" on translated pages to i18n/[LOCALE]/... instead of English source file
          editLocalizedFiles: true,
          // "lastVersion" means the latest release
          lastVersion: "current",
          versions: {
            // v4 is "current"
            // v3 is in /versioned_docs/version-3
            // v2 is in /versioned_docs/version-2
            // TODO when we start work on Helm v5, we will copy /docs to /versioned_docs/version-4
            // and v5 will then live in /docs
            // Be sure to update each locale's docusaurus-plugin-content-docs/current.json to match the current label
            // To-do: add this snippet to automation for bumping the version for each new release:
            // `for f in i18n/*/docusaurus-plugin-content-docs/current.json; do jq '."version.label".message = "4.0.0"' "$f" > "$f.tmp" && mv "$f.tmp" "$f"; done`
            current: { label: "4.0.0" },
            3: { label: "3.19.0", path: "v3" },
            2: { label: "2.17.0", path: "v2" },
          },
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/helm/helm-www/blob/main/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "throw",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  // Note @docusaurus/preset-classic already includes a docs plugin instance for us under "presets"
  // See https://docusaurus.io/docs/docs-multi-instance#versioned-and-unversioned-doc
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "community",
        path: "community",
        routeBasePath: "community",
        sidebarPath: "./sidebars_community.js",
        editLocalizedFiles: true,
        editUrl: createEditUrlFunction(communityConfig.sourceRepo),
        numberPrefixParser: false,
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "community",
        sourceBaseUrl: communityConfig.sourceBaseUrl,
        outDir: "community",
        documents: remoteDocPaths,
        // Set to true since we commit files to Git and performCleanup: false prevents deletion
        noRuntimeDownloads: true,
        // Must be false to prevent files being deleted between i18n locale builds
        // See: https://github.com/rdilweb/docusaurus-plugin-remote-content/issues/98
        performCleanup: false,
        /**
         * @param {string} filename - The filename being processed
         * @param {string} content - The file content
         * @returns {{content: string, filename?: string}} Transformed content
         */
        modifyContent(filename, content) {
          const transformed = transformImportedContent(
            filename,
            content,
            metaByPath,
            slugByPath,
            linkExceptions
          );

          // transformImportedContent now returns an object with content and optionally filename
          return transformed;
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "community-images",
        sourceBaseUrl: communityConfig.sourceBaseUrl,
        outDir: "community",
        documents: [
          "art/images/Backgrounds-Pattern-Dark.png",
          "art/images/Backgrounds-Pattern.png",
          "art/images/Example-Icon-Illustrations.png",
          "art/images/Helm-3-Color-Palettes-Dark.png",
          "art/images/Helm-3-Color-Palettes-Light.png",
          "art/images/Helm-Summit.png",
          "art/images/Logo-Tweak-Dark.png",
          "art/images/Logo-Tweak-Light.png",
          "art/images/Typography.png",
          "art/images/Website-Exmple.png",
          "art/images/Website-Sample.png",
          "art/images/helm-3.png",
          "art/images/type-notes.png",
        ],
        requestConfig: { responseType: "arraybuffer" },
        noRuntimeDownloads: true,
        performCleanup: false,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: "AYED2EXU9K",
        apiKey: "ab452074863b15ae08d14d22d393f1e0",
        indexName: "production",
      },
      announcementBar: {
        backgroundColor: "#0f1689",
        textColor: "#ffffff",
        // Note that closed state is stored in browser
        // Change id to show again for users who have already closed it
        id: "helm4_ga",
        content:
          '🎉 Helm v4.0.0 is out! See the <a href="/docs/overview">Helm 4 Overview</a> for details!',
        isCloseable: true,
      },
      // Replace with your project's social card
      image: "img/helm-social-card.png",
      colorMode: {
        defaultMode: "light",
        disableSwitch: true,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: "Helm",
        logo: {
          alt: "Helm Logo",
          src: "img/helm.svg",
        },
        items: [
          { to: "docs", label: "Docs", position: "left" },
          { to: "community", label: "Community", position: "left" },
          { to: "blog", label: "Blog", position: "left" },
          {
            href: "https://artifacthub.io/",
            label: "Charts",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            position: "right",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Helm Project",
            items: [
              {
                label: "Source code",
                href: "https://github.com/helm/helm",
              },
              {
                label: "Blog",
                to: "blog",
              },
              {
                label: "Events",
                href: "https://www.cncf.io/community/kubecon-cloudnativecon-events/",
              },
              {
                label: "Code of Conduct",
                href: "https://github.com/cncf/foundation/blob/master/code-of-conduct.md",
              },
            ],
          },
          {
            title: "Charts",
            items: [
              {
                label: "Introduction",
                to: "docs/intro",
              },
              {
                label: "Chart tips & tricks",
                to: "docs/howto/charts_tips_and_tricks",
              },
              {
                label: "Developing Charts",
                to: "docs/topics/charts",
              },
              {
                label: "Search 800+ Charts",
                href: "https://artifacthub.io/",
              },
            ],
          },
          {
            title: "Development",
            items: [
              {
                label: "Slack (#helm-dev)",
                href: "https://kubernetes.slack.com/messages/C51E88VDG",
              },
              {
                label: "Contribution Guide",
                href: "https://github.com/helm/helm/blob/main/CONTRIBUTING.md",
              },
              {
                label: "Maintainers",
                href: "https://github.com/helm/helm/blob/main/OWNERS",
              },
              {
                label: "Weekly Meetings",
                href: "https://github.com/helm/community/blob/main/communication.md#meetings",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub Community",
                href: "https://github.com/helm/community",
              },
              {
                label: "Slack (#helm-users)",
                href: "https://kubernetes.slack.com/",
              },
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/kubernetes-helm",
              },
              {
                label: "X",
                href: "https://x.com/helmpack",
              },
            ],
          },
        ],
        logo: {
          alt: "CNCF Logo",
          src: "/img/cncf-white.png",
        },
        copyright: `<p>We are a <a href="https://www.cncf.io/">Cloud Native Computing Foundation</a> graduated project.</p><p>© Helm Authors ${new Date().getFullYear()}. Documentation distributed under <a href="https://creativecommons.org/licenses/by/4.0">CC-BY-4.0.</a></p><p>© ${new Date().getFullYear()} The Linux Foundation. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our <a href="https://www.linuxfoundation.org/trademark-usage/">Trademark Usage page</a>.</p>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["bash"],
      },
    }),

  clientModules: [
    require.resolve("./src/client-modules/heroHeightCalculator.js"),
  ],
};

export default config;
