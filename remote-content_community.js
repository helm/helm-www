/**
 * Configuration for the "community" instance of docusaurus-plugin-remote-content
 * Imports documentation from the helm/community GitHub repository
 */

module.exports = {
  // Source repository information
  sourceRepo: "https://github.com/helm/community",
  sourceBaseUrl: "https://raw.githubusercontent.com/helm/community/refs/heads/main/",

  // Files to import with their transformations
  files: {
    // Simple files with no modifications
    "blog-topics.md": {},
    "code-of-conduct.md": {},
    "communication.md": {},
    "incubator.md": {},
    "stable-repo-charts-new-locations.md": {},
    "user-profiles.md": {},

    // Files with modifications
    "README.md": {
      meta: {
        sidebar_position: 1,
      },
      links: {
        "https://github.com/helm/community/tree/main/art": "/community/art",
      },
    },

    "MAINTAINERS.md": {},

    "SECURITY.md": {
      meta: {
        sidebar_label: "Helm Security",
      },
      links: {
        "README.md": "/community",
      },
    },

    "governance/README.md": {
      meta: {
        sidebar_label: "Governance",
        title: "Governance Introduction",
        id: "helm-governance",
        sidebar_position: 9,
      },
      links: {
        "governance.md": "/community/governance/governance",
        "../MAINTAINERS.md": "/community/MAINTAINERS",
      },
    },

    "governance/governance.md": {
      meta: {
        sidebar_label: "Rules",
        title: "Governance Rules",
        slug: "governance",
      },
    },

    // Art files
    "art/readme.md": {
      meta: {
        title: "Styleguide",
      },
    },

    // Meeting notes - automatically converted from .txt to .md
    "meeting-notes/2017.txt": {},
    "meeting-notes/2018.txt": {},
    "meeting-notes/2019.txt": {},
    "meeting-notes/2020.txt": {},
    "meeting-notes/2021.txt": {},

    // HIPs
    "hips/README.md": {},
    "hips/hip-0001.md": {},
    "hips/hip-0002.md": {},
    "hips/hip-0003.md": {},
    "hips/hip-0004.md": {},
    "hips/hip-0005.md": {
      links: {
        "https://github.com/helm/community/blob/master/governance/governance.md": "/community/governance/governance",
      },
    },
    "hips/hip-0006.md": {},
    "hips/hip-0007.md": {
      links: {
        "https://github.com/helm/community/blob/master/governance/governance.md": "/community/governance/governance",
        "../maintainer-groups.yaml": "https://github.com/helm/community/blob/main/maintainer-groups.yaml",
      },
    },
    "hips/hip-0008.md": {},
    "hips/hip-0009.md": {
      links: {
        "../security.md": "../SECURITY.md",
      },
    },
    "hips/hip-0010.md": {},
    "hips/hip-0011.md": {},
    "hips/hip-0012.md": {
      links: {
        "https://github.com/helm/community/blob/main/user-profiles.md": "/community/user-profiles",
      },
    },
    "hips/hip-0014.md": {
      links: {
        "https://github.com/helm/community/tree/main/governance": "/community/governance/governance",
        "https://github.com/helm/community/blob/main/Teams.md": "https://github.com/helm/community/blob/main/maintainer-groups.yaml",
      },
    },
    "hips/hip-0015.md": {},
    "hips/hip-0016.md": {},
    "hips/hip-0017.md": {},
    "hips/hip-0018.md": {},
    "hips/hip-0019.md": {},
    "hips/hip-0020.md": {},
    "hips/hip-0021.md": {},
    "hips/hip-0022.md": {},
    "hips/hip-0023.md": {},
    "hips/hip-0024.md": {},
    "hips/hip-0025.md": {
      links: {
        "https://github.com/helm/community/blob/main/user-profiles.md": "/community/user-profiles",
      },
    },
    "hips/hip-0026.md": {
      links: {
        "https://github.com/helm/community/blob/main/hips/hip-0012.md": "/community/hips/hip-0012",
        "https://github.com/helm/community/blob/main/hips/archives/helm/distributed-search.md": "/community/hips/archives/helm/distributed-search",
      },
    },

    // HIP Archives
    "hips/archives/README.md": {},
    "hips/archives/monocular/1.0-improvements.md": {
      links: {
        "https://github.com/helm/community/blob/master/proposals/distributed-search.md": "/community/hips/archives/helm/distributed-search",
      },
    },
    "hips/archives/helm/distributed-search.md": {},
    "hips/archives/helm/helm-v3/000-helm-v3.md": {
      links: {
        "../../../user-profiles.md": "../../../../user-profiles.md",
      },
    },
    "hips/archives/helm/helm-v3/001-charts.md": {},
    "hips/archives/helm/helm-v3/002-events.md": {},
    "hips/archives/helm/helm-v3/003-state.md": {},
    "hips/archives/helm/helm-v3/004-hooks.md": {},
    "hips/archives/helm/helm-v3/005-plugins.md": {},
    "hips/archives/helm/helm-v3/006-repositories.md": {},
    "hips/archives/helm/helm-v3/007-security.md": {},
    "hips/archives/helm/helm-v3/008-controller.md": {},
    "hips/archives/helm/helm-v3/009-package_manager.md": {},
    "hips/archives/helm/helm-v3/010-removed.md": {},
    "hips/archives/helm/helm-v3/011-user_stories.md": {
      links: {
        "../user-profiles.md": "../../../../user-profiles.md",
      },
    },
    "hips/archives/helm/helm-v3/012-chart-dev-stories.md": {},
    "hips/archives/helm/helm-v3/research/package-manager-ux.md": {},
  },
};
