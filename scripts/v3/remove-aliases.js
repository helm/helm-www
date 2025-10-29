#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { frontMatterFromYaml, frontMatterToYaml } = require('../util/util-frontmatter.js');

/**
 * Find and remove all aliases from v3 .md and .mdx files
 */
function removeAliasesFromFiles() {
  console.log('🔍 Finding and removing aliases from version-3 files...');

  const v3DocsDir = path.join(__dirname, '..', '..', 'versioned_docs', 'version-3');
  const i18nDir = path.join(__dirname, '..', '..', 'i18n');

  if (!fs.existsSync(v3DocsDir)) {
    console.error('❌ Version-3 docs directory not found:', v3DocsDir);
    process.exit(1);
  }

  const aliasesFound = [];
  let filesWithAliases = 0;
  let aliasesRemoved = 0;

  /**
   * Recursively process directory for .md and .mdx files
   * @param {string} dirPath - Directory to process
   * @param {string} relativePath - Relative path for display
   */
  function processDirectory(dirPath, relativePath = '') {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry.name);
      const relativeFilePath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(fullPath, relativeFilePath);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        // Process markdown files
        processMarkdownFile(fullPath, relativeFilePath);
      }
    });
  }

  /**
   * Process a single markdown file
   * @param {string} filePath - Full path to the file
   * @param {string} relativeFilePath - Relative path for display
   */
  function processMarkdownFile(filePath, relativeFilePath) {

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, restContent, hasFrontmatter } = frontMatterFromYaml(content);

      if (!hasFrontmatter) {
        return; // Skip files without frontmatter
      }

      // Check if aliases exist
      if (frontmatter.hasOwnProperty('aliases') && Array.isArray(frontmatter.aliases)) {
        const aliases = [...frontmatter.aliases]; // Copy the array

        // Only record aliases from main docs, not i18n docs
        const isI18nFile = relativeFilePath.startsWith('i18n/');
        if (!isI18nFile) {
          aliasesFound.push({
            file: relativeFilePath,
            aliases: aliases
          });
        }

        filesWithAliases++;
        aliasesRemoved += aliases.length;

        // Remove aliases from frontmatter
        delete frontmatter.aliases;

        // Write back the updated content
        const updatedContent = frontMatterToYaml(frontmatter, restContent);
        fs.writeFileSync(filePath, updatedContent);

        console.log(`  ✅ Processed: ${relativeFilePath} (removed ${aliases.length} aliases)`);
      }

    } catch (error) {
      console.error(`  ❌ Error processing ${relativeFilePath}:`, error.message);
    }
  }

  // Start processing from v3 docs directory
  processDirectory(v3DocsDir);

  // Process i18n translation directories for v3
  const languages = ['de', 'es', 'fr', 'ja', 'ko', 'zh'];
  languages.forEach(lang => {
    const i18nVersionDir = path.join(i18nDir, lang, 'docusaurus-plugin-content-docs', 'version-3');
    if (fs.existsSync(i18nVersionDir)) {
      console.log(`\n🌍 Processing translation directory: ${lang}`);
      processDirectory(i18nVersionDir, `i18n/${lang}/version-3`);
    }
  });

  // Display results
  console.log('\n📊 Summary:');
  console.log(`  Files with aliases: ${filesWithAliases}`);
  console.log(`  Total aliases removed: ${aliasesRemoved}`);

  if (aliasesFound.length > 0) {
    console.log('\n📋 Aliases found and removed:');
    console.log('=====================================');

    aliasesFound.forEach(({ file, aliases }) => {
      console.log(`\n📄 ${file}:`);
      aliases.forEach((alias, index) => {
        console.log(`  ${index + 1}. ${alias}`);
      });
    });

    // Also write to a file for reference
    const aliasesReport = {
      summary: {
        filesWithAliases,
        aliasesRemoved
      },
      aliases: aliasesFound
    };

    const reportPath = path.join(__dirname, 'removed-aliases.json');
    fs.writeFileSync(reportPath, JSON.stringify(aliasesReport, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);

  } else {
    console.log('\n✨ No aliases found in any files.');
  }

  console.log('\n🎉 Aliases removal completed!');
}

// Main execution
if (require.main === module) {
  removeAliasesFromFiles();
}

module.exports = { removeAliasesFromFiles };
