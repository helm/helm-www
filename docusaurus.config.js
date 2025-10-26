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

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
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

          // "lastVersion" means the latest release
          // when we cut over to helm 4.0.0, we change lastVersion from "3" to "current"
          // where "current" means the /docs folder
          lastVersion: "3",
          versions: {
            // v4 is "current" (does not necessarily mean latest, see above)
            // v3 is in /versioned_docs/version-3
            // v2 is in /versioned_docs/version-2
            // TODO when we start work on Helm v5, we will copy /docs to /versioned_docs/version-4
            // and v5 will then live in /docs
            current: { label: "4.0.0-alpha.1 🚧" },
            3: { label: "3.19.0" },
            // TODO uncomment when we import v2 docs
            // '2': { label: '2.17.0' },
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
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://artifacthub.io/",
            label: "Charts",
            position: "left",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/helm/community/",
            label: "Community",
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
                to: "#",
              },
              {
                label: "Chart tips & tricks",
                to: "#",
              },
              {
                label: "Developing Charts",
                to: "#",
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
        copyright: `<a href="https://www.cncf.io/">We are a Cloud Native Computing Foundation graduated project.</a><br/>© Helm Authors ${new Date().getFullYear()}. Documentation distributed under <a href="https://creativecommons.org/licenses/by/4.0">CC-BY-4.0.</a><br/>© ${new Date().getFullYear()} The Linux Foundation. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our <a href="https://www.linuxfoundation.org/trademark-usage/">Trademark Usage page</a>.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  clientModules: [
    require.resolve("./src/client-modules/heroHeightCalculator.js"),
  ],
};

export default config;
