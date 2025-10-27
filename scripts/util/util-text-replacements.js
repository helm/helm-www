#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { findFiles } = require('./util-file-operations.js');

/**
 * Category A: Replace Hugo shortcodes with their content
 * Reliably converts: {{< ref "path" >}} → path
 * Also converts: {{< highlightexamplego file="path" >}} → path
 * Handles multi-line shortcodes and escape characters
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function replaceHugoShortcodes(majorVersion = 3) {
  console.log('🔗 Converting Hugo shortcodes...');

  // Process main version docs
  const versionDir = `versioned_docs/version-${majorVersion}`;
  let updatedCount = 0;
  let totalReplacements = 0;

  if (fs.existsSync(versionDir)) {
    console.log(`  📁 Processing main docs: ${versionDir}`);
    const result = processHugoShortcodesInDirectory(versionDir);
    updatedCount += result.updatedCount;
    totalReplacements += result.totalReplacements;
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
          const result = processHugoShortcodesInDirectory(translationVersionDir);
          updatedCount += result.updatedCount;
          totalReplacements += result.totalReplacements;
        }
      });
    }
  }

  console.log(`✅ Converted ${totalReplacements} Hugo shortcodes in ${updatedCount} files`);
}

/**
 * Process Hugo shortcodes in a specific directory
 * @param {string} dirPath - Directory to process
 * @returns {Object} - Results with updatedCount and totalReplacements
 */
function processHugoShortcodesInDirectory(dirPath) {
  const files = findFiles(dirPath, ['.md', '.mdx']);
  let updatedCount = 0;
  let totalReplacements = 0;

  files.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;
      const originalContent = content;

      // Find multiline Hugo shortcodes: {{< ref\n"path" >}} and regular ones
      let searchIndex = 0;
      while (true) {
        const startIndex = content.indexOf('{{<', searchIndex);
        if (startIndex === -1) break;

        // Find the matching closing >}}
        const endIndex = content.indexOf('>}}', startIndex);
        if (endIndex === -1) {
          console.warn(`  ⚠️  Unclosed Hugo shortcode at position ${startIndex}`);
          searchIndex = startIndex + 3;
          continue;
        }

        // Extract the full shortcode
        const shortcode = content.substring(startIndex, endIndex + 3);
        let replacement = null;

        // Handle ref shortcodes: {{< ref "path" >}} or {{< relref path="path" lang="en">}} → path
        if (shortcode.includes('ref')) {
          // Handle both ref and relref shortcodes
          let pathMatch;

          // Try relref pattern first: {{< relref path="/docs/path.md" lang="en">}}
          if (shortcode.includes('relref') && shortcode.includes('path=')) {
            pathMatch = shortcode.match(/path="([^"]+)"/);
          } else {
            // Standard ref pattern: {{< ref "path" >}}
            pathMatch = shortcode.match(/"([^"]+)"/);
          }

          if (pathMatch) {
            replacement = pathMatch[1].replace(/[\\()]/g, ''); // Strip escape characters
          }
        }
        // Handle highlightexamplego shortcodes: {{< highlightexamplego file="path" >}} → path
        else if (shortcode.includes('highlightexamplego')) {
          const fileMatch = shortcode.match(/file="([^"]+)"/);
          if (fileMatch) {
            replacement = fileMatch[1].replace(/[\\()]/g, ''); // Strip escape characters
          }
        }

        if (replacement !== null) {
          // Replace the entire shortcode with the extracted path
          content = content.substring(0, startIndex) + replacement + content.substring(endIndex + 3);
          hasChanges = true;
          totalReplacements++;

          console.log(`    🔗 ${shortcode.replace(/\n/g, '\\n').substring(0, 50)}... → ${replacement}`);

          // Adjust search index since content length changed
          searchIndex = startIndex + replacement.length;
        } else {
          // No replacement made, continue searching
          searchIndex = endIndex + 3;
        }
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, content);
        console.log(`    🔗 Updated: ${path.relative(dirPath, filePath)}`);
        updatedCount++;
      }

    } catch (error) {
      console.warn(`    ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });

  return { updatedCount, totalReplacements };
}


/**
 * Category C: Fix markdown link hrefs based on href differences
 * Uses the shared href processor to apply link fixes
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function fixMarkdownLinkHrefs(majorVersion = 3) {
  const path = require('path');
  const { processHrefDifferences } = require('./href-diffs-process.js');
  const differencesFile = path.join(__dirname, `../v${majorVersion}/href-diffs.json`);
  processHrefDifferences(majorVersion, differencesFile);
}

/**
 * Master function to handle all text replacements
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function applyAllTextReplacements(majorVersion = 3) {
  console.log('📖 Applying all text replacements...');

  // Step 1: Fix markdown link hrefs BEFORE Hugo shortcode conversion
  // This allows href-diffs to catch /docs/ paths inside shortcodes
  fixMarkdownLinkHrefs(majorVersion);

  // Step 2: Convert Hugo shortcodes to standard content
  replaceHugoShortcodes(majorVersion);

  console.log('✅ All text replacements completed');
}

module.exports = {
  replaceHugoShortcodes,
  fixMarkdownLinkHrefs,
  applyAllTextReplacements
};
