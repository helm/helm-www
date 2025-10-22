#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Copy script that uses menu.json with header extraction to find and copy files
 * Matches headers to local markdown files and creates proper Docusaurus structure
 */

function copyV2DocsToDocusaurus() {
  console.log('📋 Starting v2 docs copy to Docusaurus...');

  // Read the menu.json structure
  const structureFile = path.join(__dirname, 'menu.json');
  if (!fs.existsSync(structureFile)) {
    console.error('❌ menu.json not found. Run menu-generate.js first.');
    process.exit(1);
  }

  const menuData = JSON.parse(fs.readFileSync(structureFile, 'utf8'));
  const navigationStructure = menuData.navigationStructure;
  const helm2DocsPath = path.join(__dirname, '..', '..', 'orig', 'docs-v2');
  const outputPath = path.join(__dirname, '..', '..', 'versioned_docs', 'version-2');

  if (!fs.existsSync(helm2DocsPath)) {
    console.error('❌ orig/docs-v2 directory not found');
    process.exit(1);
  }

  // Clean and create output directory
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { recursive: true, force: true });
    console.log('🗑️ Cleaned existing version-2 directory');
  }
  fs.mkdirSync(outputPath, { recursive: true });

  // Create index.mdx file
  createIndexFile(outputPath);
  console.log('📄 Created index.mdx file');

  // Build file header mapping from orig/docs-v2
  console.log('🔍 Building header-to-file mapping from local markdown files...');
  const headerToFileMap = buildHeaderFileMap(helm2DocsPath);
  console.log(`📊 Found ${Object.keys(headerToFileMap).size} headers in ${headerToFileMap._totalFiles} files`);

  let topLevelPosition = 2; // Start at 2 since index.mdx takes position 1
  let copiedFiles = 0;

  navigationStructure.forEach(item => {
    if (item.children && item.children.length > 0) {
      // This is a category with children
      const categoryName = extractCategoryFromUrlPath(item.link);
      if (categoryName) {
        copiedFiles += processCategoryWithChildren(item, categoryName, outputPath, helm2DocsPath, headerToFileMap, topLevelPosition);
        topLevelPosition++;
      }
    } else {
      // This is a top-level file without children
      copiedFiles += processTopLevelFile(item, outputPath, helm2DocsPath, headerToFileMap, topLevelPosition);
      topLevelPosition++;
    }
  });

  console.log(`✅ Successfully copied ${copiedFiles} files to ${outputPath}`);
  console.log('🚀 Ready for Docusaurus!');
}

/**
 * Build a mapping of headers to file paths by scanning all markdown files
 */
function buildHeaderFileMap(docsPath) {
  const headerMap = {};
  let totalFiles = 0;

  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(relativePath, item));
      } else if (item.endsWith('.md')) {
        totalFiles++;
        const relativeFilePath = path.join(relativePath, item);

        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const header = extractHeaderFromContent(content);

          if (!header) {
            console.error(`❌ No H1 or H2 header found in ${relativeFilePath} - script halted`);
            process.exit(1);
          }

          if (headerMap[header]) {
            console.warn(`⚠️ Duplicate header found: "${header}" in both ${headerMap[header]} and ${relativeFilePath}`);
          } else {
            headerMap[header] = relativeFilePath;
          }
        } catch (error) {
          console.warn(`⚠️ Error reading ${relativeFilePath}: ${error.message}`);
        }
      }
    });
  }

  scanDirectory(docsPath);
  headerMap._totalFiles = totalFiles;
  return headerMap;
}

/**
 * Extract the primary header from markdown content: first H1, or first H2 if no H1 exists
 */
function extractHeaderFromContent(content) {
  const lines = content.split('\n');

  // First pass: look for H1
  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      return h1Match[1].trim();
    }
  }

  // Second pass: look for H2 if no H1 found
  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      return h2Match[1].trim();
    }
  }

  // No H1 or H2 found
  return null;
}

/**
 * Extract category name from URL path like /docs/using_helm/ → using_helm
 */
function extractCategoryFromUrlPath(urlPath) {
  if (!urlPath) return null;
  const match = urlPath.match(/\/docs\/([^\/]+)\//);
  return match ? match[1] : null;
}

/**
 * Process a category (parent with children)
 */
function processCategoryWithChildren(categoryItem, categoryName, outputPath, helm2DocsPath, headerToFileMap, categoryPosition) {
  console.log(`📁 Processing category: ${categoryItem.label} (${categoryName})`);

  const categoryDir = path.join(outputPath, categoryName);
  fs.mkdirSync(categoryDir, { recursive: true });

  let copiedCount = 0;
  let childPosition = 1;

  // First child becomes the index file for the category
  const indexChild = categoryItem.children[0];

  categoryItem.children.forEach((child, index) => {
    const isIndex = index === 0;
    const headerToMatch = child.header || child.label;

    // Find the source file using header matching
    const sourceFile = findSourceFileByHeader(headerToMatch, headerToFileMap);
    if (!sourceFile) {
      console.log(`  ⚠️ No source file found for header: "${headerToMatch}"`);
      return;
    }

    const sourcePath = path.join(helm2DocsPath, sourceFile);
    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⚠️ Source file not found: ${sourceFile}`);
      return;
    }

    let targetFileName;
    let sidebarPosition;

    if (isIndex) {
      // This is the index file - rename it to category/category.md
      targetFileName = `${categoryName}.md`;
      sidebarPosition = categoryPosition; // Use parent's position
      console.log(`  📄 Index: ${child.label} → ${categoryName}/${targetFileName} (${sourceFile})`);
    } else {
      // Regular child file
      const baseFileName = path.basename(sourceFile, '.md');
      targetFileName = `${baseFileName}.md`;
      sidebarPosition = childPosition++;
      console.log(`  📄 Child: ${child.label} → ${categoryName}/${targetFileName} (${sourceFile})`);
    }

    const targetPath = path.join(categoryDir, targetFileName);

    if (copyFileWithFrontmatter(sourcePath, targetPath, {
      position: sidebarPosition,
      label: isIndex ? categoryItem.label : child.label, // Use parent label for index
      slug: isIndex ? undefined : undefined // Index files should have no slug
    }, isIndex)) {
      copiedCount++;
    }
  });

  return copiedCount;
}

/**
 * Process a top-level file (no children)
 */
function processTopLevelFile(item, outputPath, helm2DocsPath, headerToFileMap, position) {
  console.log(`📄 Processing top-level: ${item.label}`);

  // Special handling for "Docs Home" - already created
  if (item.label === "Docs Home") {
    console.log(`  ✅ Docs Home already created as index.mdx`);
    return 0;
  }

  const headerToMatch = item.header || item.label;
  const sourceFile = findSourceFileByHeader(headerToMatch, headerToFileMap);

  if (!sourceFile) {
    console.log(`  ⚠️ No source file found for header: "${headerToMatch}"`);
    return 0;
  }

  const sourcePath = path.join(helm2DocsPath, sourceFile);
  if (!fs.existsSync(sourcePath)) {
    console.log(`  ⚠️ Source file not found: ${sourceFile}`);
    return 0;
  }

  const targetFileName = path.basename(sourceFile);
  const targetPath = path.join(outputPath, targetFileName);

  console.log(`  📄 ${item.label} → ${targetFileName} (${sourceFile})`);

  if (copyFileWithFrontmatter(sourcePath, targetPath, {
    position: position,
    label: item.label
  }, false)) {
    return 1;
  }

  return 0;
}

/**
 * Normalize smart quotes to regular quotes
 */
function normalizeQuotes(text) {
  return text
    .replace(/[""]/g, '"')  // Smart double quotes (U+201C, U+201D) → regular double quotes
    .replace(/['']/g, "'") // Smart single quotes (U+2018, U+2019) → regular single quotes
    .replace(/\u2019/g, "'") // Right single quotation mark (U+2019) → regular single quote
    .replace(/\u2018/g, "'") // Left single quotation mark (U+2018) → regular single quote
    .replace(/\u201C/g, '"') // Left double quotation mark (U+201C) → regular double quote
    .replace(/\u201D/g, '"'); // Right double quotation mark (U+201D) → regular double quote
}

/**
 * Find source file by matching header text
 */
function findSourceFileByHeader(headerText, headerToFileMap) {
  // Normalize smart quotes in the search text
  const normalizedHeaderText = normalizeQuotes(headerText);

  // Direct match first (try both original and normalized)
  if (headerToFileMap[headerText]) {
    return headerToFileMap[headerText];
  }
  if (headerToFileMap[normalizedHeaderText]) {
    return headerToFileMap[normalizedHeaderText];
  }

  // Try case-insensitive match (with both original and normalized)
  const lowerHeaderText = headerText.toLowerCase();
  const lowerNormalizedHeaderText = normalizedHeaderText.toLowerCase();

  for (const [header, file] of Object.entries(headerToFileMap)) {
    if (header !== '_totalFiles') {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader === lowerHeaderText || lowerHeader === lowerNormalizedHeaderText) {
        return file;
      }
    }
  }

  // Try partial match for helm commands (remove "helm" prefix)
  if (headerText.startsWith('helm ')) {
    const commandOnly = headerText.substring(5); // Remove "helm "
    for (const [header, file] of Object.entries(headerToFileMap)) {
      if (header !== '_totalFiles' && header.toLowerCase().includes(commandOnly.toLowerCase())) {
        return file;
      }
    }
  }

  return null;
}

/**
 * Copy file with proper Docusaurus frontmatter
 */
function copyFileWithFrontmatter(sourcePath, targetPath, frontmatterData, isIndex = false) {
  try {
    let content = fs.readFileSync(sourcePath, 'utf8');

    // Remove UTF-8 BOM if present
    if (content.charCodeAt(0) === 0xFEFF || content.startsWith('\\uFEFF')) {
      content = content.slice(1);
    }
    if (content.startsWith('\\xEF\\xBB\\xBF')) {
      content = content.slice(3);
    }

    // Replace image paths from (images/ to (/img/helm2/
    content = content.replace(/\(images\//g, '(/img/helm2/');

    // Special processing for helm/*.md files - extract H2 title and remove heading
    let h2Title = null;
    if (sourcePath.includes('/helm/helm') && sourcePath.endsWith('.md')) {
      h2Title = extractFirstH2Heading(content);
      content = removeFirstH2Heading(content);
    }

    // Create frontmatter (include H2 title for helm commands)
    const frontmatter = createFrontmatter({
      ...frontmatterData,
      title: h2Title // Add H2 title if extracted
    }, isIndex);
    const fullContent = frontmatter + content;

    fs.writeFileSync(targetPath, fullContent);

    const indexNote = isIndex ? ' [INDEX]' : '';
    console.log(`    ✅ Copied (pos: ${frontmatterData.position})${indexNote}`);
    return true;

  } catch (error) {
    console.log(`    ❌ Error copying: ${error.message}`);
    return false;
  }
}

/**
 * Create the index.mdx file for the version-2 docs
 */
function createIndexFile(outputPath) {
  const indexContent = `---
title: "Docs Home"
sidebar_position: 1
---

Complete documentation for Helm v2, the Kubernetes package manager. Learn how to install, configure, and use Helm to deploy applications to your Kubernetes cluster.

import DocCardList from "@theme/DocCardList";

<DocCardList />

`;

  const indexPath = path.join(outputPath, 'index.mdx');
  fs.writeFileSync(indexPath, indexContent);
}

/**
 * Extract the first H2 heading text from content
 */
function extractFirstH2Heading(content) {
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## helm')) {
      // Extract just the text after "## "
      return lines[i].substring(3).trim();
    }
  }

  return null;
}

/**
 * Remove the first H2 heading from helm command files
 */
function removeFirstH2Heading(content) {
  // Look for the first H2 heading (## helm...) and remove it along with any following empty lines
  const lines = content.split('\n');
  let firstH2Index = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## helm')) {
      firstH2Index = i;
      break;
    }
  }

  if (firstH2Index !== -1) {
    // Remove the H2 line
    lines.splice(firstH2Index, 1);

    // Remove any immediately following empty lines
    while (firstH2Index < lines.length && lines[firstH2Index].trim() === '') {
      lines.splice(firstH2Index, 1);
    }
  }

  return lines.join('\n');
}

/**
 * Create Docusaurus frontmatter
 */
function createFrontmatter(data, isIndex = false) {
  const frontmatterLines = ['---'];

  // Add title if specified (for helm commands)
  if (data.title) {
    frontmatterLines.push(`title: "${data.title}"`);
  }

  // Add position
  frontmatterLines.push(`sidebar_position: ${data.position}`);

  // Add label
  frontmatterLines.push(`sidebar_label: "${data.label}"`);

  // Add slug if specified
  if (data.slug) {
    frontmatterLines.push(`slug: ${data.slug}`);
  }

  // Add index-specific metadata
  if (isIndex) {
    frontmatterLines.push('# This is the index/landing page for this section');
  }

  frontmatterLines.push('---');
  frontmatterLines.push('');

  return frontmatterLines.join('\n');
}

// Main execution
if (require.main === module) {
  copyV2DocsToDocusaurus();
}

module.exports = { copyV2DocsToDocusaurus };
