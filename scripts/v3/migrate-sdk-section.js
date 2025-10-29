#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { findFiles } = require('../util/util-file-operations.js');
const { frontMatterFromYaml, frontMatterToYaml } = require('../util/util-frontmatter.js');

/**
 * Import SDK examples from .go files to .mdx files with code blocks
 * Also renames examples.md to examples.mdx and adds imports
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function importSdkExamplesFromGoFiles(majorVersion = 3) {
  console.log('💻 Importing SDK examples from Go files...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const sdkDir = path.join(versionDir, 'sdk');
  const examplesFile = path.join(sdkDir, 'examples.md');
  const examplesFileMdx = path.join(sdkDir, 'examples.mdx');
  const examplesFileNew = path.join(sdkDir, 'examples.mdx');
  const sdkExamplesDir = 'sdkexamples';

  if (!fs.existsSync(sdkExamplesDir)) {
    console.warn('⚠️  SDK examples source directory not found');
    return;
  }

  if (!fs.existsSync(sdkDir)) {
    console.warn('⚠️  SDK docs directory not found');
    return;
  }

  // Find all .go files in sdkexamples/
  const goFiles = fs.readdirSync(sdkExamplesDir)
    .filter(file => file.endsWith('.go'));

  let importLines = [];
  let processedCount = 0;

  // Process each .go file
  goFiles.forEach(goFile => {
    try {
      const name = path.basename(goFile, '.go');
      const sourcePath = path.join(sdkExamplesDir, goFile);
      const destPath = path.join(sdkDir, `_${name}.mdx`);

      // Read the .go file content
      const goContent = fs.readFileSync(sourcePath, 'utf8');

      // Wrap in code block
      const mdxContent = '```go\n' + goContent + '\n```\n';

      // Write to destination
      fs.writeFileSync(destPath, mdxContent);

      // Create import line with capitalized name
      const capName = name.charAt(0).toUpperCase() + name.slice(1);
      importLines.push(`import ${capName} from './_${name}.mdx'`);

      console.log(`  💻 Processed: ${goFile} → _${name}.mdx`);
      processedCount++;

    } catch (error) {
      console.warn(`  ⚠️  Error processing ${goFile}: ${error.message}`);
    }
  });

  // Process examples file (either .md or .mdx) and add imports
  const examplesSourceFile = fs.existsSync(examplesFile) ? examplesFile :
                            fs.existsSync(examplesFileMdx) ? examplesFileMdx : null;

  if (examplesSourceFile) {
    try {
      const content = fs.readFileSync(examplesSourceFile, 'utf8');
      const { frontmatter, restContent, hasFrontmatter } = frontMatterFromYaml(content);

      if (hasFrontmatter) {
        // Add imports after frontmatter
        const importsSection = importLines.join('\n') + '\n\n';

        // Remove any existing import lines from restContent
        const cleanedContent = restContent.replace(/^import .* from '\.\/_.*.mdx';?\n?/gm, '');

        const newRestContent = importsSection + cleanedContent.trim();
        const updatedContent = frontMatterToYaml(frontmatter, newRestContent);

        fs.writeFileSync(examplesFileNew, updatedContent);
        if (examplesSourceFile !== examplesFileNew) {
          fs.unlinkSync(examplesSourceFile); // Remove old file if different
        }

        console.log('  📝 Updated examples.mdx with imports');
      }
    } catch (error) {
      console.warn(`  ⚠️  Error updating examples file: ${error.message}`);
    }
  }

  console.log(`✅ Imported ${processedCount} SDK examples`);
}

/**
 * Apply SDK href transformations from JSON differences file
 * Uses the sdk-href-diffs.json file to apply SDK-specific text changes
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function applySdkHrefTransformations(majorVersion = 3) {
  console.log('🔗 Applying SDK href transformations...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const sdkDiffsFile = 'scripts/v3/sdk-href-diffs.json';

  if (!fs.existsSync(sdkDiffsFile)) {
    console.warn('⚠️  SDK differences file not found:', sdkDiffsFile);
    console.log('Run href-diffs-generate.js first to create the differences file');
    return;
  }

  // Load SDK transformations
  const sdkTransformations = JSON.parse(fs.readFileSync(sdkDiffsFile, 'utf8'));
  console.log(`📋 Loaded ${sdkTransformations.length} SDK transformations`);

  const files = findFiles(versionDir, ['.md', '.mdx']);

  let updatedCount = 0;
  let totalFixes = 0;

  files.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;

      // Apply each SDK transformation
      sdkTransformations.forEach(transform => {
        const { fileName, before, after } = transform;

        // Only apply transformations to the specific file
        const relativePath = path.relative(versionDir, filePath);
        if (relativePath === fileName) {
          // Apply the transformation
          if (content.includes(before)) {
            content = content.replace(new RegExp(before.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), after);
            hasChanges = true;
            totalFixes++;
            console.log(`  🔗 Applied SDK transformation: ${before} → ${after}`);
          }
        }
      });

      if (hasChanges) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✅ Updated SDK file: ${path.relative(versionDir, filePath)}`);
        updatedCount++;
      }

    } catch (error) {
      console.warn(`  ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });

  console.log(`✅ Applied ${totalFixes} SDK transformations across ${updatedCount} files`);
}

/**
 * Complete SDK section migration
 * Orchestrates both importing Go files and applying href transformations
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function migrateSdkSection(majorVersion = 3) {
  console.log('💻 Migrating SDK section...');

  // Step 1: Import SDK examples from Go files to .mdx files
  importSdkExamplesFromGoFiles(majorVersion);

  // Step 2: Apply SDK href transformations
  applySdkHrefTransformations(majorVersion);

  console.log('✅ SDK section migration completed');
}

// Run if called directly
if (require.main === module) {
  const majorVersion = process.argv[2] ? parseInt(process.argv[2]) : 3;
  migrateSdkSection(majorVersion);
}

module.exports = {
  importSdkExamplesFromGoFiles,
  applySdkHrefTransformations,
  migrateSdkSection
};
