#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Known categories in Helm docs (directories that should link to index.mdx)
const HELM_CATEGORIES = [
  'intro',
  'chart_best_practices',
  'chart_template_guide',
  'sdk',
  'faq',
  'howto',
  'community',
  'helm',
  'topics',
  'glossary'
];

/**
 * Check if a path refers to a category (should link to index.mdx)
 * @param {string} pathSegment - Path segment to check
 * @returns {boolean} - True if this is a category
 */
function isCategory(pathSegment) {
  // Remove trailing slash and leading ./
  let cleanPath = pathSegment.replace(/\/$/, '').replace(/^\.\//, '');

  // Check if it's a known category
  return HELM_CATEGORIES.includes(cleanPath);
}

/**
 * Convert category path to index.mdx path
 * @param {string} categoryPath - Category path
 * @param {number} currentDepth - Current file's depth
 * @param {string} relativePath - Current file's relative path
 * @returns {string} - Absolute path to category index
 */
function convertCategoryPath(categoryPath, currentDepth, relativePath) {
  // Handle anchors: category#anchor -> /category/index.mdx#anchor
  let cleanPath = categoryPath;
  let anchor = '';

  if (cleanPath.includes('#')) {
    const parts = cleanPath.split('#');
    cleanPath = parts[0];
    anchor = '#' + parts.slice(1).join('#');
  }

  // Remove trailing slash and leading ./
  cleanPath = cleanPath.replace(/\/$/, '').replace(/^\.\//, '');

  // Convert to absolute category index path
  const absolutePath = convertToAbsolutePath(cleanPath, currentDepth, relativePath);
  return `${absolutePath}/index.mdx${anchor}`;
}

/**
 * Convert relative links to absolute Docusaurus paths
 * This addresses the Docusaurus bug: https://github.com/facebook/docusaurus/issues/10907
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function convertRelativeLinksToAbsolute(majorVersion) {
  console.log('🔗 Converting relative links to absolute Docusaurus paths...');

  // Process main version docs
  const versionDir = `versioned_docs/version-${majorVersion}`;
  let totalFilesProcessed = 0;
  let totalLinksConverted = 0;

  if (fs.existsSync(versionDir)) {
    console.log(`  📁 Processing main docs: ${versionDir}`);
    const result = processDirectoryLinks(versionDir);
    totalFilesProcessed += result.filesProcessed;
    totalLinksConverted += result.linksConverted;
  }

  // Process translation docs (only for v3 and above)
  if (majorVersion >= 3) {
    const i18nDir = 'i18n';
    if (fs.existsSync(i18nDir)) {
      const languages = fs.readdirSync(i18nDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      languages.forEach(lang => {
        const translationVersionDir = `${i18nDir}/${lang}/docusaurus-plugin-content-docs/version-${majorVersion}`;
        if (fs.existsSync(translationVersionDir)) {
          console.log(`  🌐 Processing ${lang} translations: ${translationVersionDir}`);
          const result = processDirectoryLinks(translationVersionDir);
          totalFilesProcessed += result.filesProcessed;
          totalLinksConverted += result.linksConverted;
        }
      });
    }
  }

  console.log(`\n📊 Link conversion summary:`);
  console.log(`  Files processed: ${totalFilesProcessed}`);
  console.log(`  Links converted: ${totalLinksConverted}`);
  console.log('✅ Relative links converted to absolute paths');
}

/**
 * Process links in a specific directory
 * @param {string} dirPath - Directory path to process
 * @returns {Object} - Results with filesProcessed and linksConverted
 */
function processDirectoryLinks(dirPath) {
  let filesProcessed = 0;
  let linksConverted = 0;

  /**
   * Recursively process directory for .md and .mdx files
   * @param {string} currentDir - Current directory to process
   */
  function processDirectory(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        // Process markdown files
        const result = processMarkdownFile(fullPath, dirPath);
        if (result.modified) {
          filesProcessed++;
          linksConverted += result.linksConverted;
        }
      }
    });
  }

  processDirectory(dirPath);

  return { filesProcessed, linksConverted };
}

/**
 * Process a single markdown file for link conversion
 * @param {string} filePath - Full path to the file
 * @param {string} basePath - Base directory path for calculating relative positions
 * @returns {Object} - Results with modified flag and linksConverted count
 */
function processMarkdownFile(filePath, basePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let linksConverted = 0;

    // Get the current file's directory relative to the base path
    const relativePath = path.relative(basePath, path.dirname(filePath));
    const currentDepth = relativePath === '' ? 0 : relativePath.split(path.sep).length;

    // Regex patterns for different link types
    const patterns = [
      // Standard markdown/mdx links: [text](file.md) or [text](../category/file.mdx)
      // But skip URLs with schemes (http://, https://, etc.)
      {
        regex: /\[([^\]]*)\]\(([^)]+\.mdx?(?:#[^)]*)?)\)/g,
        handler: (match, text, linkPath) => {
          // Skip URLs with schemes
          if (/^https?:\/\//.test(linkPath) || /^\w+:\/\//.test(linkPath)) {
            return match; // Return unchanged
          }
          return convertMarkdownLink(text, linkPath, currentDepth, relativePath);
        }
      },
      // Hugo shortcode refs that weren't converted: {{< ref "file.md" >}}
      {
        regex: /\{\{<\s*ref\s+"([^"]+)"\s*>\}\}/g,
        handler: (match, linkPath) => {
          // Skip URLs with schemes
          if (/^https?:\/\//.test(linkPath) || /^\w+:\/\//.test(linkPath)) {
            return match; // Return unchanged
          }
          return `[${path.basename(linkPath, '.md')}](${convertToAbsolutePath(linkPath, currentDepth, relativePath)})`;
        }
      },
      // Doc links without .md extension: [text](/docs/path) -> should become [text](/path.md) or [text](/path/index.mdx]
      // Handle anchors, trailing slashes, and categories properly
      {
        regex: /\[([^\]]*)\]\(\/docs\/([^)]+)\)/g,
        handler: (match, text, docPath) => {
          // Skip URLs with schemes
          if (/^https?:\/\//.test(docPath) || /^\w+:\/\//.test(docPath)) {
            return match; // Return unchanged
          }

          // Handle anchors: path#anchor -> path.md#anchor
          let cleanPath = docPath;
          let anchor = '';

          if (cleanPath.includes('#')) {
            const parts = cleanPath.split('#');
            cleanPath = parts[0];
            anchor = '#' + parts.slice(1).join('#');
          }

          // Remove trailing slash
          cleanPath = cleanPath.replace(/\/$/, '');

          // Check if this is a category
          if (isCategory(cleanPath)) {
            return `[${text}](/${cleanPath}/index.mdx${anchor})`;
          }

          // Don't add .md if it already ends with .md or .mdx
          if (cleanPath.endsWith('.md') || cleanPath.endsWith('.mdx')) {
            return `[${text}](/${cleanPath}${anchor})`;
          }

          return `[${text}](/${cleanPath}.md${anchor})`;
        }
      },
      // Blog links: [text](../blog/post) -> [text](/blog/post)
      {
        regex: /\[([^\]]*)\]\((\.\.\/)*blog\/([^)]+)\)/g,
        handler: (match, text, dots, blogPath) => `[${text}](/blog/${blogPath})`
      },
      // Links that don't end in .md but should: [text](../category/file) -> [text](/category/file.md)
      // [text](file) -> [text](/current-category/file.md)
      // But skip URLs with schemes and anchors only
      {
        regex: /\[([^\]]*)\]\(([^)]+)\)/g,
        handler: (match, text, linkPath) => {
          // Skip URLs with schemes
          if (/^https?:\/\//.test(linkPath) || /^\w+:\/\//.test(linkPath)) {
            return match; // Return unchanged
          }

          // Skip links that are just anchors (#something)
          if (linkPath.startsWith('#')) {
            return match; // Return unchanged
          }

          // Skip if already ends with .md or .mdx (already handled by first pattern)
          if (linkPath.endsWith('.md') || linkPath.includes('.md#') ||
              linkPath.endsWith('.mdx') || linkPath.includes('.mdx#')) {
            return match; // Return unchanged
          }

          // Skip blog links (handled by previous pattern)
          if (linkPath.includes('/blog/') || linkPath.match(/(\.\.\/)*blog\//)) {
            return match; // Return unchanged
          }

          // Skip if starts with /docs/ (handled by previous pattern)
          if (linkPath.startsWith('/docs/')) {
            return match; // Return unchanged
          }

          // Handle anchors: path#anchor -> path.md#anchor or category#anchor -> /category/index.mdx#anchor
          let cleanPath = linkPath;
          let anchor = '';

          if (cleanPath.includes('#')) {
            const parts = cleanPath.split('#');
            cleanPath = parts[0];
            anchor = '#' + parts.slice(1).join('#');
          }

          // Remove trailing slash and ./
          cleanPath = cleanPath.replace(/\/$/, '').replace(/^\.\//, '');

          // Check if this is a category (simple path without slashes)
          if (!cleanPath.includes('/') && isCategory(cleanPath)) {
            return `[${text}](${convertCategoryPath(linkPath, currentDepth, relativePath)})`;
          }

          // For relative category paths like ../category or ./category
          const pathParts = cleanPath.split('/');
          const lastSegment = pathParts[pathParts.length - 1];
          if (isCategory(lastSegment)) {
            return `[${text}](${convertCategoryPath(linkPath, currentDepth, relativePath)})`;
          }

          // Add .md extension for non-category files
          cleanPath = cleanPath + '.md';

          const absolutePath = convertToAbsolutePath(cleanPath, currentDepth, relativePath);
          return `[${text}](${absolutePath}${anchor})`;
        }
      }
    ];

    // Apply each pattern
    patterns.forEach(({ regex, handler }) => {
      modifiedContent = modifiedContent.replace(regex, (...args) => {
        const originalMatch = args[0];
        const convertedLink = handler(...args);

        if (convertedLink !== originalMatch) {
          linksConverted++;
        }

        return convertedLink;
      });
    });

    // Write file if modified
    if (modifiedContent !== content) {
      fs.writeFileSync(filePath, modifiedContent);
      const relativePath = path.relative(basePath, filePath);
      console.log(`    🔗 Updated links: ${relativePath} (${linksConverted} links)`);
      return { modified: true, linksConverted };
    }

    return { modified: false, linksConverted: 0 };

  } catch (error) {
    console.warn(`  ⚠️  Error processing ${filePath}: ${error.message}`);
    return { modified: false, linksConverted: 0 };
  }
}

/**
 * Convert markdown link to absolute path
 * @param {string} text - Link text
 * @param {string} linkPath - Original link path
 * @param {number} currentDepth - Current file's depth in directory structure
 * @param {string} relativePath - Current file's relative path
 * @returns {string} - Converted markdown link
 */
function convertMarkdownLink(text, linkPath, currentDepth, relativePath) {
  // Handle anchors: file.md#anchor -> /path/file.md#anchor
  let cleanPath = linkPath;
  let anchor = '';

  if (cleanPath.includes('#')) {
    const parts = cleanPath.split('#');
    cleanPath = parts[0];
    anchor = '#' + parts.slice(1).join('#');
  }

  const absolutePath = convertToAbsolutePath(cleanPath, currentDepth, relativePath);
  return `[${text}](${absolutePath}${anchor})`;
}

/**
 * Convert relative path to absolute Docusaurus path
 * @param {string} linkPath - Original link path (relative)
 * @param {number} currentDepth - Current file's depth in directory structure
 * @param {string} relativePath - Current file's relative path
 * @returns {string} - Absolute path for Docusaurus
 */
function convertToAbsolutePath(linkPath, currentDepth, relativePath) {
  // Handle different link patterns
  if (linkPath.startsWith('/')) {
    // Already absolute
    return linkPath;
  }

  if (linkPath.startsWith('../')) {
    // Parent directory references: ../category/file.md or ../file.md
    const pathParts = linkPath.split('/');
    const upLevels = pathParts.filter(part => part === '..').length;
    const remainingPath = pathParts.slice(upLevels).join('/');

    if (upLevels >= currentDepth) {
      // Goes to root or beyond
      return `/${remainingPath}`;
    } else {
      // Stays within subdirectories
      const currentParts = relativePath.split(path.sep);
      const targetParts = currentParts.slice(0, currentParts.length - upLevels);
      return `/${targetParts.join('/')}${targetParts.length > 0 ? '/' : ''}${remainingPath}`;
    }
  } else {
    // Same directory or subdirectory: file.md, ./file.md, or subdir/file.md
    let cleanPath = linkPath;

    // Normalize ./filename.md to filename.md
    if (cleanPath.startsWith('./')) {
      cleanPath = cleanPath.substring(2);
    }

    if (relativePath === '') {
      // Root level
      return `/${cleanPath}`;
    } else {
      // In subdirectory
      return `/${relativePath}/${cleanPath}`;
    }
  }
}

module.exports = {
  convertRelativeLinksToAbsolute
};