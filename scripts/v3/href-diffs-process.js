#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { findFiles } = require('../util/util-file-operations.js');

/**
 * Process href differences and apply link fixes to documentation files
 * Uses the href-diffs.json file to determine what href transformations to apply
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function processHrefDifferences(majorVersion = 3) {
  console.log('🔗 Processing href differences and applying link fixes...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const differencesFile = 'scripts/v3/href-diffs.json';

  if (!fs.existsSync(differencesFile)) {
    console.warn('⚠️  Href differences file not found:', differencesFile);
    console.log('Run href-diffs-generate.js first to create the differences file');
    return;
  }

  // Load href differences
  const hrefDifferences = JSON.parse(fs.readFileSync(differencesFile, 'utf8'));
  console.log(`📋 Loaded ${hrefDifferences.length} href differences`);

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
        // Look for markdown links containing the old path
        const escapedFrom = fromPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const linkPattern = new RegExp(`(\\[[^\\]]+\\])\\(${escapedFrom}\\)`, 'g');

        if (content.includes(`](${fromPath})`)) {
          content = content.replace(linkPattern, `$1(${toPath})`);
          hasChanges = true;
          totalFixes++;
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

// Run if called directly
if (require.main === module) {
  const majorVersion = process.argv[2] ? parseInt(process.argv[2]) : 3;
  processHrefDifferences(majorVersion);
}

module.exports = {
  processHrefDifferences
};