#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Parse frontmatter from content, returning both the YAML data and the rest of the content
 * @param {string} content - File content
 * @returns {Object} - { frontmatter: Object, restContent: string, hasFrontmatter: boolean }
 */
function frontMatterFromYaml(content) {
  const lines = content.split('\n');

  // Find frontmatter boundaries
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
    // No frontmatter found
    return {
      frontmatter: {},
      restContent: content,
      hasFrontmatter: false
    };
  }

  const frontmatterText = lines.slice(frontmatterStart + 1, frontmatterEnd).join('\n');
  const restContent = lines.slice(frontmatterEnd + 1).join('\n');

  try {
    const frontmatter = yaml.load(frontmatterText) || {};
    return {
      frontmatter,
      restContent,
      hasFrontmatter: true
    };
  } catch (error) {
    console.error('    ❌ Error parsing YAML frontmatter:', error.message);
    return {
      frontmatter: {},
      restContent: content,
      hasFrontmatter: false
    };
  }
}

/**
 * Convert YAML data back to frontmatter content
 * @param {Object} frontmatter - YAML data object
 * @param {string} restContent - The rest of the content after frontmatter
 * @returns {string} - Complete content with frontmatter
 */
function frontMatterToYaml(frontmatter, restContent) {
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    // No frontmatter to add, return just the content
    return restContent;
  }

  const frontmatterYaml = yaml.dump(frontmatter, {
    indent: 2,
    lineWidth: 120,
    quotingType: '"',
    forceQuotes: false
  }).trim();

  return `---\n${frontmatterYaml}\n---\n${restContent}`;
}

/**
 * Process Helm command files in version-3/helm/
 * - Extract first H2 heading text and set as frontmatter title
 * - Remove the original H2 heading line
 * - Add special configurations for helm category
 */
function processHelmFiles() {
  console.log('🔧 Processing Helm v3 command files...');

  const helmDir = path.join(__dirname, '..', 'versioned_docs', 'version-3', 'helm');

  if (!fs.existsSync(helmDir)) {
    console.error('❌ Helm directory not found:', helmDir);
    process.exit(1);
  }

  const files = fs.readdirSync(helmDir).filter(file =>
    file.endsWith('.md') && file !== 'index.md' && file !== 'index.mdx'
  );

  console.log(`📄 Found ${files.length} Helm command files to process`);

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
          console.log(`  🔧 Added slug metadata to helm.md`);
        }
      }

      if (processedContent !== content) {
        fs.writeFileSync(filePath, processedContent);
        console.log(`  ✅ Processed: ${fileName}`);
        processedCount++;
      } else {
        console.log(`  ⏭️  Skipped: ${fileName} (no H2 found or already processed)`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${fileName}:`, error.message);
    }
  });

  // Update index.mdx with id
  updateIndexMdx(helmDir);

  // Create _category_.json
  createCategoryJson(helmDir);

  console.log(`🎉 Successfully processed ${processedCount} files`);
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
    console.warn(`  ⚠️  index.mdx not found`);
    return;
  }

  try {
    const content = fs.readFileSync(indexPath, 'utf8');
    const { frontmatter, restContent, hasFrontmatter } = frontMatterFromYaml(content);

    if (!hasFrontmatter) {
      console.warn(`  ⚠️  No frontmatter found in index.mdx`);
      return;
    }

    // Check if id already exists
    if (frontmatter.hasOwnProperty('id')) {
      console.log(`  ⏭️  index.mdx already has id field`);
      return;
    }

    // Add the id field
    frontmatter.id = 'helm-category';
    const updatedContent = frontMatterToYaml(frontmatter, restContent);

    fs.writeFileSync(indexPath, updatedContent);
    console.log(`  🔧 Added id to index.mdx`);

  } catch (error) {
    console.error(`  ❌ Error updating index.mdx:`, error.message);
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
    console.log(`  📁 Created _category_.json`);
  } catch (error) {
    console.error(`  ❌ Error creating _category_.json:`, error.message);
  }
}

// Main execution
if (require.main === module) {
  processHelmFiles();
}

module.exports = {
  processHelmFiles,
  frontMatterFromYaml,
  frontMatterToYaml
};