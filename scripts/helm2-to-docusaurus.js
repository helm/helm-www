#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sourceDir = 'helm2/docs';
const targetDir = 'versioned_docs/version-2';

// Clean up and create fresh directory (makes it idempotent)
if (fs.existsSync(targetDir)) {
  console.log('🗑️  Cleaning existing directory...');
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

console.log('🚀 Converting Helm v2 docs to Docusaurus with complete frontmatter...\n');

// Sidebar structure based on v2.helm.sh navigation
// Original v2.helm.sh URLs mapped to new Docusaurus paths
const sidebarStructure = {
  // Using Helm section (position 2) - was https://v2.helm.sh/docs/using_helm/
  'using-helm': {
    position: 2,
    label: 'Using Helm',
    oldPath: 'https://v2.helm.sh/docs/using_helm/',
    newPath: '/docs/2/using-helm/',
    files: {
      'using_helm.md': { position: 1, label: 'Using Helm', slug: 'using-helm' },
      'quickstart.md': { position: 2, label: 'Quickstart', slug: 'quickstart-guide' },
      'install.md': { position: 3, label: 'Installing Helm', slug: 'installing-helm' },
      'kubernetes_apis.md': { position: 4, label: 'Deprecated Kubernetes APIs', slug: 'deprecated-kubernetes-apis' },
      'kubernetes_distros.md': { position: 5, label: 'Kubernetes Distro Notes', slug: 'kubernetes-distribution-guide' },
      'install_faq.md': { position: 6, label: 'Install FAQ', slug: 'installation-frequently-asked-questions' },
      'plugins.md': { position: 7, label: 'Plugins', slug: 'the-helm-plugins-guide' },
      'rbac.md': { position: 8, label: 'Role-Based Access Control', slug: 'role-based-access-control' },
      'tiller_ssl.md': { position: 9, label: 'TLS/SSL for Helm and Tiller', slug: 'using-ssl-between-helm-and-tiller' },
      'securing_installation.md': { position: 10, label: 'Securing Helm', slug: 'securing-your-helm-installation' }
    }
  },

  // Helm Commands section (position 3) - was https://v2.helm.sh/docs/helm/
  'helm': {
    position: 3,
    label: 'Helm Commands',
    oldPath: 'https://v2.helm.sh/docs/helm/',
    newPath: '/docs/2/helm/',
    files: {
      'helm.md': { position: 1, label: 'Helm Commands', slug: 'helm' },
      'helm_completion.md': { position: 2, label: 'Helm Completion', slug: 'helm-completion' },
      'helm_create.md': { position: 3, label: 'Helm Create', slug: 'helm-create' },
      'helm_delete.md': { position: 4, label: 'Helm Delete', slug: 'helm-delete' },
      'helm_dependency.md': { position: 5, label: 'Helm Dependency', slug: 'helm-dependency' },
      'helm_dependency_build.md': { position: 6, label: 'Helm Dependency Build', slug: 'helm-dependency-build' },
      'helm_dependency_list.md': { position: 7, label: 'Helm Dependency List', slug: 'helm-dependency-list' },
      'helm_dependency_update.md': { position: 8, label: 'Helm Dependency Update', slug: 'helm-dependency-update' },
      'helm_fetch.md': { position: 9, label: 'Helm Fetch', slug: 'helm-fetch' },
      'helm_get.md': { position: 10, label: 'Helm Get', slug: 'helm-get' },
      'helm_get_hooks.md': { position: 11, label: 'Helm Get Hooks', slug: 'helm-get-hooks' },
      'helm_get_manifest.md': { position: 12, label: 'Helm Get Manifest', slug: 'helm-get-manifest' },
      'helm_get_notes.md': { position: 13, label: 'Helm Get Notes', slug: 'helm-get-notes' },
      'helm_get_values.md': { position: 14, label: 'Helm Get Values', slug: 'helm-get-values' },
      'helm_history.md': { position: 15, label: 'Helm History', slug: 'helm-history' },
      'helm_home.md': { position: 16, label: 'Helm Home', slug: 'helm-home' },
      'helm_init.md': { position: 17, label: 'Helm Init', slug: 'helm-init' },
      'helm_inspect.md': { position: 18, label: 'Helm Inspect', slug: 'helm-inspect' },
      'helm_inspect_chart.md': { position: 19, label: 'Helm Inspect Chart', slug: 'helm-inspect-chart' },
      'helm_inspect_readme.md': { position: 20, label: 'Helm Inspect Readme', slug: 'helm-inspect-readme' },
      'helm_inspect_values.md': { position: 21, label: 'Helm Inspect Values', slug: 'helm-inspect-values' },
      'helm_install.md': { position: 22, label: 'Helm Install', slug: 'helm-install' },
      'helm_lint.md': { position: 23, label: 'Helm Lint', slug: 'helm-lint' },
      'helm_list.md': { position: 24, label: 'Helm List', slug: 'helm-list' },
      'helm_package.md': { position: 25, label: 'Helm Package', slug: 'helm-package' },
      'helm_plugin.md': { position: 26, label: 'Helm Plugin', slug: 'helm-plugin' },
      'helm_plugin_install.md': { position: 27, label: 'Helm Plugin Install', slug: 'helm-plugin-install' },
      'helm_plugin_list.md': { position: 28, label: 'Helm Plugin List', slug: 'helm-plugin-list' },
      'helm_plugin_remove.md': { position: 29, label: 'Helm Plugin Remove', slug: 'helm-plugin-remove' },
      'helm_plugin_update.md': { position: 30, label: 'Helm Plugin Update', slug: 'helm-plugin-update' },
      'helm_repo.md': { position: 31, label: 'Helm Repo', slug: 'helm-repo' },
      'helm_repo_add.md': { position: 32, label: 'Helm Repo Add', slug: 'helm-repo-add' },
      'helm_repo_index.md': { position: 33, label: 'Helm Repo Index', slug: 'helm-repo-index' },
      'helm_repo_list.md': { position: 34, label: 'Helm Repo List', slug: 'helm-repo-list' },
      'helm_repo_remove.md': { position: 35, label: 'Helm Repo Remove', slug: 'helm-repo-remove' },
      'helm_repo_update.md': { position: 36, label: 'Helm Repo Update', slug: 'helm-repo-update' },
      'helm_reset.md': { position: 37, label: 'Helm Reset', slug: 'helm-reset' },
      'helm_rollback.md': { position: 38, label: 'Helm Rollback', slug: 'helm-rollback' },
      'helm_search.md': { position: 39, label: 'Helm Search', slug: 'helm-search' },
      'helm_serve.md': { position: 40, label: 'Helm Serve', slug: 'helm-serve' },
      'helm_status.md': { position: 41, label: 'Helm Status', slug: 'helm-status' },
      'helm_template.md': { position: 42, label: 'Helm Template', slug: 'helm-template' },
      'helm_test.md': { position: 43, label: 'Helm Test', slug: 'helm-test' },
      'helm_upgrade.md': { position: 44, label: 'Helm Upgrade', slug: 'helm-upgrade' },
      'helm_verify.md': { position: 45, label: 'Helm Verify', slug: 'helm-verify' },
      'helm_version.md': { position: 46, label: 'Helm Version', slug: 'helm-version' }
    }
  },

  // Charts section (position 4) - was https://v2.helm.sh/docs/developing_charts/
  'developing-charts': {
    position: 4,
    label: 'Charts',
    oldPath: 'https://v2.helm.sh/docs/developing_charts/',
    newPath: '/docs/2/developing-charts/',
    files: {
      'charts.md': { position: 1, label: 'Charts', slug: 'charts' },
      'charts_hooks.md': { position: 2, label: 'Chart Lifecycle Hooks', slug: 'hooks' },
      'charts_tips_and_tricks.md': { position: 3, label: 'Charts Tips and Tricks', slug: 'chart-development-tips-and-tricks' },
      'chart_repository.md': { position: 4, label: 'Charts Repository Guide', slug: 'the-chart-repository-guide' },
      'chart_repository_sync_example.md': { position: 5, label: 'Syncing Your Chart Repo', slug: 'syncing-your-chart-repository' },
      'provenance.md': { position: 6, label: 'Signing Charts', slug: 'helm-provenance-and-integrity' },
      'chart_tests.md': { position: 7, label: 'Chart Tests', slug: 'chart-tests' },
      'chart_repository_faq.md': { position: 8, label: 'Chart Repository FAQ', slug: 'chart-repositories-frequently-asked-questions' }
    }
  },

  // Developing Templates section (position 5) - was https://v2.helm.sh/docs/chart_template_guide/
  'chart-template-guide': {
    position: 5,
    label: 'Developing Templates',
    oldPath: 'https://v2.helm.sh/docs/chart_template_guide/',
    newPath: '/docs/2/chart-template-guide/',
    files: {
      'index.md': { position: 1, label: 'Developing Templates', slug: 'the-chart-template-developer-s-guide' },
      'getting_started.md': { position: 2, label: 'Getting Started', slug: 'getting-started-with-a-chart-template' },
      'builtin_objects.md': { position: 3, label: 'Built-In Objects', slug: 'built-in-objects' },
      'values_files.md': { position: 4, label: 'Values Files', slug: 'values-files' },
      'functions_and_pipelines.md': { position: 5, label: 'Template Functions and Pipelines', slug: 'template-functions-and-pipelines' },
      'control_structures.md': { position: 6, label: 'Flow Control', slug: 'flow-control' },
      'variables.md': { position: 7, label: 'Variables', slug: 'variables' },
      'named_templates.md': { position: 8, label: 'Named Templates', slug: 'named-templates' },
      'accessing_files.md': { position: 9, label: 'Accessing Files Inside Templates', slug: 'accessing-files-inside-templates' },
      'notes_files.md': { position: 10, label: 'Creating a NOTES.txt File', slug: 'creating-a-notes-txt-file' },
      'subcharts_and_globals.md': { position: 11, label: 'Subcharts and Global Values', slug: 'subcharts-and-global-values' },
      'helm_ignore_file.md': { position: 12, label: 'The .helmignore File', slug: 'the-helmignore-file' },
      'debugging.md': { position: 13, label: 'Debugging Templates', slug: 'debugging-templates' },
      'wrapping_up.md': { position: 14, label: 'Next Steps', slug: 'wrapping-up' },
      'yaml_techniques.md': { position: 15, label: 'Appendix: YAML Techniques', slug: 'yaml-techniques' },
      'data_types.md': { position: 16, label: 'Appendix: Go Data Types and Templates', slug: 'appendix-go-data-types-and-templates' }
    }
  },

  // Best Practices section (position 6) - was https://v2.helm.sh/docs/chart_best_practices/
  'chart-best-practices': {
    position: 6,
    label: 'Best Practices',
    oldPath: 'https://v2.helm.sh/docs/chart_best_practices/',
    newPath: '/docs/2/chart-best-practices/',
    files: {
      'README.md': { position: 1, label: 'Best Practices' },
      'conventions.md': { position: 2, label: 'General Conventions', slug: 'general-conventions' },
      'values.md': { position: 3, label: 'Values', slug: 'values' },
      'templates.md': { position: 4, label: 'Templates', slug: 'templates' },
      'requirements.md': { position: 5, label: 'Requirements', slug: 'requirements-files' },
      'labels.md': { position: 6, label: 'Labels & Annotations', slug: 'labels-and-annotations' },
      'pods.md': { position: 7, label: 'Pods & PodTemplates', slug: 'pods-and-podtemplates' },
      'custom_resource_definitions.md': { position: 8, label: 'Custom Resource Definitions', slug: 'custom-resource-definitions' },
      'rbac.md': { position: 9, label: 'RBAC', slug: 'role-based-access-control' }
    }
  }
};

// Top-level files (position 100+)
const topLevelFiles = {
  'related.md': { position: 101, label: 'Related Projects', slug: 'related-projects' },
  'architecture.md': { position: 102, label: 'Architecture', slug: 'architecture' },
  'developers.md': { position: 103, label: 'Developer Guide', slug: 'developer-guide' },
  'history.md': { position: 104, label: 'History', slug: 'history' },
  'glossary.md': { position: 105, label: 'Glossary', slug: 'glossary' }
};

function processMarkdownContent(content) {
  // Remove UTF-8 BOM if present
  if (content.charCodeAt(0) === 0xFEFF || content.startsWith('\uFEFF')) {
    content = content.slice(1);
  }
  // Also handle BOM in buffer form
  if (content.startsWith('\xEF\xBB\xBF')) {
    content = content.slice(3);
  }

  // Fix cross-directory references (../filename.md) to new structure
  // These are root-level files that are now in different directories
  // Use actual file paths for IDE compatibility
  content = content.replace(/\]\(\.\.\/charts\.md\)/g, '](../developing-charts/index.md)');
  content = content.replace(/\]\(\.\.\/charts_hooks\.md\)/g, '](../developing-charts/charts_hooks.md)');
  content = content.replace(/\]\(\.\.\/charts_tips_and_tricks\.md\)/g, '](../developing-charts/charts_tips_and_tricks.md)');
  content = content.replace(/\]\(\.\.\/chart_repository\.md\)/g, '](../developing-charts/chart_repository.md)');
  content = content.replace(/\]\(\.\.\/provenance\.md\)/g, '](../developing-charts/provenance.md)');
  content = content.replace(/\]\(\.\.\/chart_tests\.md\)/g, '](../developing-charts/chart_tests.md)');
  content = content.replace(/\]\(\.\.\/chart_repository_sync_example\.md\)/g, '](../developing-charts/chart_repository_sync_example.md)');
  content = content.replace(/\]\(\.\.\/chart_repository_faq\.md\)/g, '](../developing-charts/chart_repository_faq.md)');

  // Fix links to other root-level files that moved to different directories
  content = content.replace(/\]\(\.\.\/using_helm\.md\)/g, '](../using-helm/index.md)');
  content = content.replace(/\]\(\.\.\/quickstart\.md\)/g, '](../using-helm/quickstart.md)');
  content = content.replace(/\]\(\.\.\/install\.md\)/g, '](../using-helm/install.md)');

  // Fix same-directory broken links based on the specific issues found
  content = content.replace(/\]\(\.\/quickstart\.md\)/g, '](../using-helm/quickstart.md)'); // from developing-charts
  content = content.replace(/\]\(\.\/charts\.md\)/g, '](../developing-charts/index.md)'); // from using-helm or developing-charts
  content = content.replace(/\]\(\.\/using_helm\.md\)/g, '](./index.md)'); // from using-helm (within same directory)
  content = content.replace(/\]\(\.\/provenance\.md\)/g, '](../developing-charts/provenance.md)'); // from using-helm
  content = content.replace(/\]\(\.\/related\.md#([^)]+)\)/g, '](../related.md#$1)'); // from using-helm to top-level
  content = content.replace(/\]\(developers#([^)]+)\)/g, '](../developers.md#$1)'); // from using-helm to top-level

  // Fix specific broken anchor links identified during conversion
  content = content.replace(/\]\(#kubernetes-distribution-guide\)/g, '](./kubernetes_distros.md)'); // should link to separate file
  content = content.replace(/\]\(#Install-Helm\)/g, '](#install-helm)'); // fix case and format for anchor link

  // Additional specific fixes for remaining broken links
  content = content.replace(/\]\(charts\.md\)/g, '](../developing-charts/index.md)'); // any charts.md without ./
  content = content.replace(/\]\(using_helm\.md\)/g, '](./index.md)'); // any using_helm.md without ./
  content = content.replace(/\]\(provenance\.md\)/g, '](../developing-charts/provenance.md)'); // any provenance.md without ./
  content = content.replace(/\]\(quickstart\.md\)/g, '](../using-helm/quickstart.md)'); // any quickstart.md without ./
  content = content.replace(/\]\(related\.md#([^)]+)\)/g, '](../related.md#$1)'); // any related.md without ./

  // Fix internal links for Docusaurus - keep .md extension for IDE compatibility
  content = content.replace(/\]\(([^/)]+)\.md\)/g, '](./$1.md)');
  content = content.replace(/\]\(([^/)]+)\.md#([^)]+)\)/g, '](./$1.md#$2)');

  // Fix image paths to point to Docusaurus static directory
  content = content.replace(/\]\(images\//g, '](/img/helm2/');

  return content;
}

function createFrontmatter(frontmatterData, isIndex = false) {
  if (isIndex) {
    return `---
sidebar_position: ${frontmatterData.position}
sidebar_label: "${frontmatterData.label}"
---

`;
  } else {
    return `---
sidebar_position: ${frontmatterData.position}
sidebar_label: "${frontmatterData.label}"
slug: ${frontmatterData.slug}
---

`;
  }
}

function copyFileWithFrontmatter(sourcePath, targetPath, frontmatterData, renameNote = '', sectionPosition = null) {
  if (!fs.existsSync(sourcePath)) {
    console.log(`  ⚠️  Source file not found: ${sourcePath}`);
    return false;
  }

  let content = fs.readFileSync(sourcePath, 'utf8');
  content = processMarkdownContent(content);

  // Check if this is an index file (landing page) or main section file
  const isIndex = path.basename(targetPath) === 'index.md';
  const isMainFile = path.basename(targetPath) === 'helm.md'; // Special case for helm.md

  // Use section position for index files and main files, otherwise use file position
  let finalFrontmatterData = frontmatterData;
  if ((isIndex || isMainFile) && sectionPosition !== null) {
    finalFrontmatterData = { ...frontmatterData, position: sectionPosition };
  }

  const frontmatter = createFrontmatter(finalFrontmatterData, isIndex);
  const fullContent = frontmatter + content;

  fs.writeFileSync(targetPath, fullContent);
  console.log(`  ✅ ${path.basename(targetPath)} (pos: ${finalFrontmatterData.position})${renameNote}${isIndex ? ' [INDEX]' : ''}${isMainFile ? ' [MAIN]' : ''}`);
  return true;
}

// File renaming rules for section landing pages
const sectionLandingPages = {
  'using-helm': { from: 'using_helm.md', to: 'index.md' },
  'developing-charts': { from: 'charts.md', to: 'index.md' },
  'chart-best-practices': { from: 'README.md', to: 'index.md' }
  // helm section: no rename needed (helm.md stays as helm.md)
  // chart-template-guide: no rename needed (index.md already exists)
};

function copyDirectoryWithFrontmatter(sourceDirPath, targetDirPath, filesConfig) {
  if (!fs.existsSync(sourceDirPath)) {
    console.log(`  ⚠️  Source directory not found: ${sourceDirPath}`);
    return 0;
  }

  fs.mkdirSync(targetDirPath, { recursive: true });

  let fileCount = 0;
  const sourceFiles = fs.readdirSync(sourceDirPath);

  // Process files that have specific configuration
  Object.entries(filesConfig).forEach(([filename, config]) => {
    if (sourceFiles.includes(filename)) {
      const sourcePath = path.join(sourceDirPath, filename);
      const targetPath = path.join(targetDirPath, filename);

      if (copyFileWithFrontmatter(sourcePath, targetPath, config, '', null)) {
        fileCount++;
      }
    }
  });

  // Process any remaining files without specific config (auto-position)
  let autoPosition = Math.max(...Object.values(filesConfig).map(f => f.position)) + 1;
  sourceFiles.forEach(filename => {
    if (filename.endsWith('.md') && !filesConfig[filename]) {
      const sourcePath = path.join(sourceDirPath, filename);
      const targetPath = path.join(targetDirPath, filename);

      const autoConfig = {
        position: autoPosition++,
        label: filename.replace('.md', '').replace(/_/g, ' '),
        slug: filename.replace('.md', '').replace(/_/g, '-')
      };

      if (copyFileWithFrontmatter(sourcePath, targetPath, autoConfig, '', null)) {
        console.log(`    📄 Auto-positioned: ${filename}`);
        fileCount++;
      }
    }
  });

  return fileCount;
}

// Process categorized sections
Object.entries(sidebarStructure).forEach(([dirName, dirConfig]) => {
  console.log(`📁 Processing ${dirConfig.label}...`);

  const targetCategoryDir = path.join(targetDir, dirName);

  if (dirName === 'helm') {
    // Special handling for helm commands directory (renamed from helm-commands to helm)
    const sourceCategoryDir = path.join(sourceDir, 'helm');
    fs.mkdirSync(targetCategoryDir, { recursive: true });
    let fileCount = 0;
    const sourceFiles = fs.readdirSync(sourceCategoryDir);

    // Process files with section position for main helm.md file
    Object.entries(dirConfig.files).forEach(([filename, config]) => {
      if (sourceFiles.includes(filename)) {
        const sourcePath = path.join(sourceCategoryDir, filename);
        const targetPath = path.join(targetCategoryDir, filename);
        const sectionPos = filename === 'helm.md' ? dirConfig.position : null;

        if (copyFileWithFrontmatter(sourcePath, targetPath, config, '', sectionPos)) {
          fileCount++;
        }
      }
    });

    console.log(`  ✅ Processed ${fileCount} helm command files`);
  } else if (dirName === 'chart-template-guide') {
    // Special handling for chart template guide directory
    const sourceCategoryDir = path.join(sourceDir, 'chart_template_guide');
    fs.mkdirSync(targetCategoryDir, { recursive: true });
    let fileCount = 0;
    const sourceFiles = fs.readdirSync(sourceCategoryDir);

    // Process files with section position for index.md file
    Object.entries(dirConfig.files).forEach(([filename, config]) => {
      if (sourceFiles.includes(filename)) {
        const sourcePath = path.join(sourceCategoryDir, filename);
        const targetPath = path.join(targetCategoryDir, filename);
        const sectionPos = filename === 'index.md' ? dirConfig.position : null;

        if (copyFileWithFrontmatter(sourcePath, targetPath, config, '', sectionPos)) {
          fileCount++;
        }
      }
    });

    console.log(`  ✅ Processed ${fileCount} template guide files`);
  } else if (dirName === 'chart-best-practices') {
    // Special handling for chart best practices directory
    const sourceCategoryDir = path.join(sourceDir, 'chart_best_practices');
    fs.mkdirSync(targetCategoryDir, { recursive: true });
    let fileCount = 0;
    const sourceFiles = fs.readdirSync(sourceCategoryDir);

    // Process files with section position for README.md (becomes index.md)
    Object.entries(dirConfig.files).forEach(([filename, config]) => {
      if (sourceFiles.includes(filename)) {
        const sourcePath = path.join(sourceCategoryDir, filename);
        let targetFilename = filename;
        let renameNote = '';

        // Handle README.md -> index.md rename
        if (filename === 'README.md') {
          targetFilename = 'index.md';
          renameNote = ' → renamed to index.md';
        }

        const targetPath = path.join(targetCategoryDir, targetFilename);
        const sectionPos = filename === 'README.md' ? dirConfig.position : null;

        if (copyFileWithFrontmatter(sourcePath, targetPath, config, renameNote, sectionPos)) {
          fileCount++;
        }
      }
    });

    console.log(`  ✅ Processed ${fileCount} best practices files`);
  } else {
    // Handle files from root directory
    fs.mkdirSync(targetCategoryDir, { recursive: true });
    let fileCount = 0;

    Object.entries(dirConfig.files).forEach(([filename, fileConfig]) => {
      const sourcePath = path.join(sourceDir, filename);

      // Check if this file should be renamed for landing page
      let targetFilename = filename;
      let renameNote = '';
      if (sectionLandingPages[dirName] && sectionLandingPages[dirName].from === filename) {
        targetFilename = sectionLandingPages[dirName].to;
        renameNote = ` → renamed to ${targetFilename}`;
      }

      const targetPath = path.join(targetCategoryDir, targetFilename);

      // Use section position if this becomes an index file
      const sectionPos = (targetFilename === 'index.md') ? dirConfig.position : null;

      if (copyFileWithFrontmatter(sourcePath, targetPath, fileConfig, renameNote, sectionPos)) {
        fileCount++;
      }
    });

    console.log(`  ✅ Organized ${fileCount} files`);
  }

  console.log('');
});

// Process top-level files
console.log('📄 Processing top-level files...');
let topLevelCount = 0;
Object.entries(topLevelFiles).forEach(([filename, fileConfig]) => {
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename);

  if (copyFileWithFrontmatter(sourcePath, targetPath, fileConfig, '', null)) {
    topLevelCount++;
  }
});
console.log(`  ✅ Processed ${topLevelCount} top-level files\n`);

// Copy images to Docusaurus static directory
console.log('🖼️  Processing images...');
const sourceImagesDir = path.join(sourceDir, 'images');
const targetStaticDir = 'static/img/helm2';

if (fs.existsSync(sourceImagesDir)) {
  // Create static/img directory structure
  if (!fs.existsSync('static')) {
    fs.mkdirSync('static', { recursive: true });
  }
  if (!fs.existsSync('static/img')) {
    fs.mkdirSync('static/img', { recursive: true });
  }

  // Copy images
  fs.cpSync(sourceImagesDir, targetStaticDir, { recursive: true });

  const imageFiles = fs.readdirSync(sourceImagesDir).filter(f => f.match(/\.(png|jpg|jpeg|gif|svg)$/i));
  console.log(`  ✅ Copied ${imageFiles.length} images to static/img/helm2/`);
  imageFiles.forEach(img => {
    console.log(`    🖼️  ${img}`);
  });
} else {
  console.log('  ⚠️  Images directory not found');
}

// Create docs landing page with auto-generated cards
console.log('\n📝 Creating docs landing page...');
const docsLandingPage = `---
title: "Docs Home"
sidebar_position: 1
---

Complete documentation for Helm v2, the Kubernetes package manager. Learn how to install, configure, and use Helm to deploy applications to your Kubernetes cluster.

import DocCardList from "@theme/DocCardList";

<DocCardList />
`;

const landingPagePath = path.join(targetDir, 'index.mdx');
fs.writeFileSync(landingPagePath, docsLandingPage);
console.log('  ✅ Created index.mdx landing page with auto-generated cards');

// Summary

// Function to generate Netlify redirects from the sidebarStructure
function generateNetlifyRedirects() {
  console.log('\n📝 Generating Netlify redirects...');

  // Read existing netlify.toml
  const netlifyPath = 'netlify.toml';
  let netlifyContent = '';

  if (fs.existsSync(netlifyPath)) {
    netlifyContent = fs.readFileSync(netlifyPath, 'utf8');

    // Check if v2 docs redirects already exist using markers
    if (netlifyContent.includes('# START: Helm v2 docs redirects')) {
      console.log('  ℹ️  v2 docs redirects already exist, skipping generation');
      return 0;
    }

    // Remove any old v2 redirects that don't have proper markers (cleanup from previous runs)
    const startMarker = '# START: Helm v2 docs redirects';
    const endMarker = '# END: Helm v2 docs redirects';

    const startIndex = netlifyContent.indexOf(startMarker);
    if (startIndex !== -1) {
      const endIndex = netlifyContent.indexOf(endMarker, startIndex);
      if (endIndex !== -1) {
        // Remove everything from start marker to end marker (inclusive)
        const beforeSection = netlifyContent.substring(0, startIndex);
        const afterSection = netlifyContent.substring(endIndex + endMarker.length);
        netlifyContent = beforeSection + afterSection;

        // Clean up extra whitespace
        netlifyContent = netlifyContent.replace(/\n\s*\n\s*\n/g, '\n\n');
      }
    }
  } else {
    netlifyContent = '';
  }

  // Generate new redirects section
  let redirects = [
    '',
    '# START: Helm v2 docs redirects - managed by scripts/helm2-to-docusaurus.js',
    '# Redirect v2 docs to new combined site',
    '# Category-level redirects only (fragments not supported by Netlify)',
    '# Maps old underscore URLs to new dash URLs',
    '# TODO: Change status codes from 302 to 301 after cutover verification',
    ''
  ];

  // Add main section redirects (category-level only)
  const categoryMappings = {
    'using-helm': 'https://v2.helm.sh/docs/using_helm/',
    'helm': 'https://v2.helm.sh/docs/helm/',
    'developing-charts': 'https://v2.helm.sh/docs/developing_charts/',
    'chart-template-guide': 'https://v2.helm.sh/docs/chart_template_guide/',
    'chart-best-practices': 'https://v2.helm.sh/docs/chart_best_practices/'
  };

  Object.entries(categoryMappings).forEach(([newCategory, oldUrl]) => {
    redirects.push('[[redirects]]');
    redirects.push(`  from = "${oldUrl}"`);
    redirects.push(`  to = "/docs/2/${newCategory}/"`);
    redirects.push('  status = 302');
    redirects.push('');
  });

  // Add end marker
  redirects.push('# END: Helm v2 docs redirects');
  redirects.push('');

  // Add new redirects section to netlify.toml
  netlifyContent += redirects.join('\n');

  // Write updated netlify.toml
  fs.writeFileSync(netlifyPath, netlifyContent);

  const redirectCount = redirects.filter(line => line.includes('302')).length;
  console.log(`  ✅ Generated ${redirectCount} redirects in netlify.toml`);

  return redirectCount;
}

// Generate the redirects
const redirectCount = generateNetlifyRedirects();

console.log('\n🎉 Complete conversion finished!');
console.log('📂 Created structure with proper sidebar navigation:');
console.log('  📝 index.mdx (docs landing page with auto-generated cards)');
console.log('  📁 using-helm/ → index.md (landing page, was using_helm.md)');
console.log('  📁 developing-charts/ → index.md (landing page, was charts.md)');
console.log('  📁 helm/ → helm.md (CLI reference, renamed from helm-commands)');
console.log('  📁 chart-template-guide/ → index.md (already correct)');
console.log('  📁 chart-best-practices/ → index.md (landing page, was README.md)');
console.log(`  📄 ${topLevelCount} top-level docs (positions 101-105)`);
console.log('  🖼️  Images in static/img/helm2/');
console.log(`  🔀 ${redirectCount} category-level Netlify redirects from v2.helm.sh`);
console.log('\n✨ All files include:');
console.log('  • sidebar_position (proper ordering)');
console.log('  • sidebar_label (clean display names)');
console.log('  • slug (URL-friendly paths)');
console.log('  • IDE-compatible markdown links (.md extensions)');
console.log('\n🚀 Ready for Docusaurus! Run: yarn start');