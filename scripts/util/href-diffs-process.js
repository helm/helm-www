#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { findFiles } = require('./util-file-operations.js');

/**
 * Process href differences and apply link fixes to documentation files
 * Uses the specified href-diffs.json file to determine what href transformations to apply
 * @param {number} majorVersion - Version number (e.g., 2, 3)
 * @param {string} differencesFile - Path to the href-diffs.json file
 */
function processHrefDifferences(majorVersion, differencesFile) {
  console.log(`🔗 Processing v${majorVersion} href differences and applying link fixes...`);

  const versionDir = `versioned_docs/version-${majorVersion}`;

  if (!fs.existsSync(differencesFile)) {
    console.warn('⚠️  Href differences file not found:', differencesFile);
    console.log('Create the differences file first or check the path');
    return;
  }

  // Load href differences
  const hrefDifferences = JSON.parse(fs.readFileSync(differencesFile, 'utf8'));
  console.log(`📋 Loaded ${hrefDifferences.length} v${majorVersion} href differences`);

  const files = findFiles(versionDir, ['.md', '.mdx']);

  // Group transformations by target file
  const fileTransforms = {};

  hrefDifferences.forEach(diff => {
    // Only process actual path hrefs (skip components and regex patterns)
    if (!diff.after.includes('<') && !diff.after.includes('{{') &&
        !diff.after.includes('\\(') && diff.after !== diff.before) {

      // Group by fileName
      if (!fileTransforms[diff.fileName]) {
        fileTransforms[diff.fileName] = {};
      }
      fileTransforms[diff.fileName][diff.before] = diff.after;
      console.log(`  ${diff.fileName}: ${diff.before} → ${diff.after}`);
    }
  });

  const totalTransforms = Object.values(fileTransforms).reduce((sum, transforms) => sum + Object.keys(transforms).length, 0);
  console.log(`📋 Found ${totalTransforms} path transformations for ${Object.keys(fileTransforms).length} files`);

  let updatedCount = 0;
  let totalFixes = 0;

  files.forEach(filePath => {
    try {
      const relativePath = path.relative(versionDir, filePath);

      // Only apply transformations specific to this file
      if (!fileTransforms[relativePath]) {
        return; // No transformations for this file
      }

      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;

      // Apply transformations specific to this file
      Object.entries(fileTransforms[relativePath]).forEach(([fromPath, toPath]) => {
        // For v2: simple string replacement (no markdown link pattern matching needed)
        // For v3: look for markdown links containing the old path
        if (majorVersion === 2) {
          // V2 uses simple path replacements
          const beforeRegex = new RegExp(fromPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          if (content.includes(fromPath)) {
            content = content.replace(beforeRegex, toPath);
            hasChanges = true;
            totalFixes++;
          }
        } else {
          // V3 uses markdown link pattern matching
          const escapedFrom = fromPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const linkPattern = new RegExp(`(\\[[^\\]]+\\])\\(${escapedFrom}\\)`, 'g');

          if (content.includes(`](${fromPath})`)) {
            content = content.replace(linkPattern, `$1(${toPath})`);
            hasChanges = true;
            totalFixes++;
          }
        }
      });

      if (hasChanges) {
        fs.writeFileSync(filePath, content);
        console.log(`  🔗 Fixed hrefs: ${relativePath}`);
        updatedCount++;
      }

    } catch (error) {
      console.warn(`  ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });

  console.log(`✅ Applied ${totalFixes} href fixes across ${updatedCount} files`);
}

module.exports = {
  processHrefDifferences
};