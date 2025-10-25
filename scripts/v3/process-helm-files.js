#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { frontMatterFromYaml, frontMatterToYaml } = require('../util/util-frontmatter.js');


/**
 * Process Helm command files in version-3/helm/ and i18n directories
 * - Extract first H2 heading text and set as frontmatter title
 * - Remove the original H2 heading line
 * - Add special configurations for helm category
 */
function processHelmFiles() {
  console.log('🔧 Processing Helm v3 command files...');

  // Process main docs
  const mainHelmDir = path.join(__dirname, '..', '..', 'versioned_docs', 'version-3', 'helm');
  if (fs.existsSync(mainHelmDir)) {
    console.log('  📁 Processing main docs: versioned_docs/version-3/helm');
    processHelmDirectory(mainHelmDir);
  }

  // Process i18n directories
  const i18nDir = path.join(__dirname, '..', '..');
  if (fs.existsSync(i18nDir)) {
    const i18nPath = path.join(i18nDir, 'i18n');
    if (fs.existsSync(i18nPath)) {
      const languages = fs.readdirSync(i18nPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      languages.forEach(lang => {
        const langHelmDir = path.join(i18nPath, lang, 'docusaurus-plugin-content-docs', 'version-3', 'helm');
        if (fs.existsSync(langHelmDir)) {
          console.log(`  🌐 Processing ${lang} translations: i18n/${lang}/docusaurus-plugin-content-docs/version-3/helm`);
          processHelmDirectory(langHelmDir);
        }
      });
    }
  }

  console.log('🎉 Helm files processing completed');
}

/**
 * Process Helm files in a specific directory
 * @param {string} helmDir - Path to helm directory
 */
function processHelmDirectory(helmDir) {

  const files = fs.readdirSync(helmDir).filter(file =>
    file.endsWith('.md') && file !== 'index.md' && file !== 'index.mdx'
  );

  console.log(`    📄 Found ${files.length} Helm command files to process`);

  let processedCount = 0;

  // Process regular command files
  files.forEach(fileName => {
    const filePath = path.join(helmDir, fileName);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let processedContent = processHelmFile(content, fileName);

      // Special handling for helm.md - add slug metadata
      if (fileName === 'helm.md') {
        const { frontmatter, restContent } = frontMatterFromYaml(processedContent);

        // Add slug if it doesn't exist
        if (!frontmatter.hasOwnProperty('slug')) {
          frontmatter.slug = 'helm';
          processedContent = frontMatterToYaml(frontmatter, restContent);
          console.log(`    🔧 Added slug metadata to helm.md`);
        }
      }

      if (processedContent !== content) {
        fs.writeFileSync(filePath, processedContent);
        console.log(`    ✅ Processed: ${fileName}`);
        processedCount++;
      } else {
        console.log(`    ⏭️  Skipped: ${fileName} (no H2 found or already processed)`);
      }
    } catch (error) {
      console.error(`    ❌ Error processing ${fileName}:`, error.message);
    }
  });

  // Update index.mdx with id
  updateIndexMdx(helmDir);

  // Create _category_.json
  createCategoryJson(helmDir);

  console.log(`    🎉 Successfully processed ${processedCount} files`);
}

/**
 * Process a single Helm command file
 * @param {string} content - File content
 * @param {string} fileName - File name for logging
 * @returns {string} - Processed content
 */
function processHelmFile(content, fileName) {
  const lines = content.split('\n');

  // Find the frontmatter boundaries
  let frontmatterStart = -1;
  let frontmatterEnd = -1;
  let dashCount = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      dashCount++;
      if (dashCount === 1) {
        frontmatterStart = i;
      } else if (dashCount === 2) {
        frontmatterEnd = i;
        break;
      }
    }
  }

  if (frontmatterStart === -1 || frontmatterEnd === -1) {
    console.warn(`    ⚠️  No frontmatter found in ${fileName}`);
    return content;
  }

  // Find the first H2 heading after frontmatter
  let h2LineIndex = -1;
  let h2Text = null;

  for (let i = frontmatterEnd + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) {
      h2Text = line.substring(3).trim(); // Remove "## "
      h2LineIndex = i;
      break;
    }
  }

  if (!h2Text || h2LineIndex === -1) {
    // No H2 found, skip processing
    return content;
  }

  // Remove the H2 line and any empty lines after it
  const beforeFrontmatter = lines.slice(0, frontmatterStart);
  const frontmatterLines = lines.slice(frontmatterStart, frontmatterEnd + 1);
  const afterH2 = lines.slice(h2LineIndex + 1);

  // Remove any empty lines immediately after the removed H2
  while (afterH2.length > 0 && afterH2[0].trim() === '') {
    afterH2.shift();
  }

  // Rebuild content without the H2 line
  const contentWithoutH2 = [
    ...beforeFrontmatter,
    ...frontmatterLines,
    ...afterH2
  ].join('\n');

  // Add the title using general utilities
  const { frontmatter, restContent } = frontMatterFromYaml(contentWithoutH2);
  frontmatter.title = h2Text;
  return frontMatterToYaml(frontmatter, restContent);
}


/**
 * Update index.mdx to add id: helm-category
 * @param {string} helmDir - Helm directory path
 */
function updateIndexMdx(helmDir) {
  const indexPath = path.join(helmDir, 'index.mdx');

  if (!fs.existsSync(indexPath)) {
    console.warn(`    ⚠️  index.mdx not found`);
    return;
  }

  try {
    const content = fs.readFileSync(indexPath, 'utf8');
    const { frontmatter, restContent, hasFrontmatter } = frontMatterFromYaml(content);

    if (!hasFrontmatter) {
      console.warn(`    ⚠️  No frontmatter found in index.mdx`);
      return;
    }

    let needsUpdate = false;

    // Add id field if missing
    if (!frontmatter.hasOwnProperty('id')) {
      frontmatter.id = 'helm-category';
      needsUpdate = true;
    }

    // Remove slug field if present (Docusaurus handles helm/ directory slug automatically)
    if (frontmatter.hasOwnProperty('slug')) {
      delete frontmatter.slug;
      needsUpdate = true;
    }

    if (needsUpdate) {
      const updatedContent = frontMatterToYaml(frontmatter, restContent);
      fs.writeFileSync(indexPath, updatedContent);
      console.log(`    🔧 Updated index.mdx metadata`);
    } else {
      console.log(`    ⏭️  index.mdx already up to date`);
    }

  } catch (error) {
    console.error(`    ❌ Error updating index.mdx:`, error.message);
  }
}

/**
 * Create _category_.json file
 * @param {string} helmDir - Helm directory path
 */
function createCategoryJson(helmDir) {
  const categoryPath = path.join(helmDir, '_category_.json');

  const categoryContent = `{
  "link": { "type": "doc", "id": "helm-category" }
}
`;

  try {
    fs.writeFileSync(categoryPath, categoryContent);
    console.log(`    📁 Created _category_.json`);
  } catch (error) {
    console.error(`    ❌ Error creating _category_.json:`, error.message);
  }
}

// Main execution
if (require.main === module) {
  processHelmFiles();
}

module.exports = {
  processHelmFiles
};
