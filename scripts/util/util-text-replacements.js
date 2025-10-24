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

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const files = findFiles(versionDir, ['.md', '.mdx']);

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

        // Handle ref shortcodes: {{< ref "path" >}} or {{< ref\n"path" >}} → path
        if (shortcode.includes('ref')) {
          const pathMatch = shortcode.match(/"([^"]+)"/);
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
        console.log(`  🔗 Updated: ${path.relative(versionDir, filePath)}`);
        updatedCount++;
      }

    } catch (error) {
      console.warn(`  ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });

  console.log(`✅ Converted ${totalReplacements} Hugo shortcodes in ${updatedCount} files`);
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

  // Step 1: Convert Hugo shortcodes to standard content
  replaceHugoShortcodes(majorVersion);

  // Step 2: Fix markdown link hrefs (add .md extensions, fix paths)
  fixMarkdownLinkHrefs(majorVersion);

  console.log('✅ All text replacements completed');
}

module.exports = {
  replaceHugoShortcodes,
  fixMarkdownLinkHrefs,
  applyAllTextReplacements
};
