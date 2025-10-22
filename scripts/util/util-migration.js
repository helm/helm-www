#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { findFiles, moveDirectoryContents, removeDirectory, createDirectory } = require('./util-file-operations.js');
const { frontMatterFromYaml, frontMatterToYaml } = require('./util-frontmatter.js');

/**
 * Reset directories and restore clean content from git main
 * Ensures migration starts from latest main branch content
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function startFresh(majorVersion = 3) {
  console.log('🔄 Starting fresh migration...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const contentDir = 'content/en/docs';

  // Remove version directory and recreate
  removeDirectory(versionDir);
  createDirectory(versionDir);

  // Reset content directory from git main
  removeDirectory(contentDir);
  execSync('git restore --source main -- content/en/docs', { stdio: 'inherit' });

  console.log('✅ Fresh migration setup completed');
}

/**
 * Setup Docusaurus versioned structure (idempotent)
 * Creates version in versions.json, versioned_docs, and versioned_sidebars
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function skaffoldMajorVersion(majorVersion = 3) {
  console.log('📁 Setting up Docusaurus version structure...');

  const versionDir = `versioned_docs/version-${majorVersion}`;

  if (!fs.existsSync(versionDir)) {
    // Create Docusaurus version structure
    execSync(`yarn docusaurus docs:version ${majorVersion}`, { stdio: 'inherit' });

    // Empty the directory but keep the structure
    const files = fs.readdirSync(versionDir);
    files.forEach(file => {
      const filePath = path.join(versionDir, file);
      fs.rmSync(filePath, { recursive: true, force: true });
    });

    console.log('✅ Docusaurus version structure created');
  } else {
    console.log('⏭️  Docusaurus version structure already exists');
  }
}

/**
 * Move content from Hugo structure to Docusaurus structure
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function moveDocs(majorVersion = 3) {
  console.log('📦 Moving docs from Hugo to Docusaurus structure...');

  const sourceDir = 'content/en/docs';
  const versionDir = `versioned_docs/version-${majorVersion}`;

  if (fs.existsSync(sourceDir)) {
    moveDirectoryContents(sourceDir, versionDir);
    console.log('✅ Docs moved successfully');
  } else {
    console.warn('⚠️  Source docs directory not found');
  }
}

/**
 * Delete files with 'section: deprecated' frontmatter
 * Hugo hid these files, Docusaurus doesn't have this feature
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function deleteDeprecatedFiles(majorVersion = 3) {
  console.log('🗑️  Removing deprecated files...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const files = findFiles(versionDir, ['.md', '.mdx']);

  let deletedCount = 0;

  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, hasFrontmatter } = frontMatterFromYaml(content);

      if (hasFrontmatter && frontmatter.section === 'deprecated') {
        fs.unlinkSync(filePath);
        console.log(`  🗑️  Deleted: ${path.relative(versionDir, filePath)}`);
        deletedCount++;
      }
    } catch (error) {
      console.warn(`  ⚠️  Error checking ${filePath}: ${error.message}`);
    }
  });

  console.log(`✅ Removed ${deletedCount} deprecated files`);
}

/**
 * Replace Hugo 'weight:' frontmatter with Docusaurus 'sidebar_position:'
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function replaceWeightWithSidebarPosition(majorVersion = 3) {
  console.log('🔄 Converting weight → sidebar_position in frontmatter...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const files = findFiles(versionDir, ['.md', '.mdx']);

  let updatedCount = 0;

  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, restContent, hasFrontmatter } = frontMatterFromYaml(content);

      if (hasFrontmatter && frontmatter.hasOwnProperty('weight')) {
        // Replace weight with sidebar_position
        frontmatter.sidebar_position = frontmatter.weight;
        delete frontmatter.weight;

        const updatedContent = frontMatterToYaml(frontmatter, restContent);
        fs.writeFileSync(filePath, updatedContent);

        console.log(`  🔄 Updated: ${path.relative(versionDir, filePath)}`);
        updatedCount++;
      }
    } catch (error) {
      console.warn(`  ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });

  console.log(`✅ Updated ${updatedCount} files with sidebar_position`);
}

/**
 * Add metadata to main index file (_index.md → index.mdx)
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function addMainIndexMetadata(majorVersion = 3) {
  console.log('📝 Adding metadata to main index file...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const indexPath = path.join(versionDir, '_index.md');
  const newIndexPath = path.join(versionDir, 'index.mdx');

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const { frontmatter, restContent, hasFrontmatter } = frontMatterFromYaml(content);

    if (hasFrontmatter) {
      // Add required metadata (adjust as needed)
      frontmatter.slug = '/';
      if (!frontmatter.title) {
        frontmatter.title = 'Documentation';
      }

      // Append DocCardList component
      const updatedRestContent = restContent + '\n\nimport DocCardList from \'@theme/DocCardList\';\n\n<DocCardList />\n';

      const updatedContent = frontMatterToYaml(frontmatter, updatedRestContent);
      fs.writeFileSync(newIndexPath, updatedContent);

      // Remove old file
      fs.unlinkSync(indexPath);

      console.log('✅ Main index file updated and renamed to index.mdx');
    } else {
      console.warn('⚠️  Main index file has no frontmatter');
    }
  } else {
    console.warn('⚠️  Main index file (_index.md) not found');
  }
}

/**
 * Add <DocCardList /> components to category index pages
 * Reproduces Hugo's automatic page listing functionality
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function addDocsIndexLists(majorVersion = 3) {
  console.log('📋 Adding DocCardList components to index pages...');

  const versionDir = `versioned_docs/version-${majorVersion}`;

  // Find all index.mdx files (category pages)
  const indexFiles = [];
  function findIndexFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
      if (entry.isDirectory()) {
        const indexPath = path.join(dir, entry.name, 'index.mdx');
        if (fs.existsSync(indexPath)) {
          indexFiles.push(indexPath);
        }
        findIndexFiles(path.join(dir, entry.name));
      }
    });
  }

  findIndexFiles(versionDir);

  // Also add the root index.mdx file if it exists
  const rootIndexPath = path.join(versionDir, 'index.mdx');
  if (fs.existsSync(rootIndexPath)) {
    indexFiles.push(rootIndexPath);
  }

  let updatedCount = 0;

  indexFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check if DocCardList is already present
      if (!content.includes('<DocCardList')) {
        // Add import and component
        const docCardListImport = "import DocCardList from '@theme/DocCardList';";
        const docCardListComponent = '\n\n<DocCardList />\n';

        let updatedContent = content;

        // Add import after frontmatter if not already present
        if (!content.includes(docCardListImport)) {
          const { frontmatter, restContent, hasFrontmatter } = frontMatterFromYaml(content);
          if (hasFrontmatter) {
            const newRestContent = `\n${docCardListImport}\n${restContent}${docCardListComponent}`;
            updatedContent = frontMatterToYaml(frontmatter, newRestContent);
          } else {
            updatedContent = `${docCardListImport}\n\n${content}${docCardListComponent}`;
          }
        } else {
          updatedContent = content + docCardListComponent;
        }

        fs.writeFileSync(filePath, updatedContent);
        console.log(`  📋 Added DocCardList: ${path.relative(versionDir, filePath)}`);
        updatedCount++;
      }
    } catch (error) {
      console.warn(`  ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });

  console.log(`✅ Added DocCardList to ${updatedCount} index pages`);
}

/**
 * Import SDK examples from .go files to .mdx files with code blocks
 * Also renames examples.md to examples.mdx and adds imports
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function importSDK(majorVersion = 3) {
  console.log('💻 Importing SDK examples...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const sdkDir = path.join(versionDir, 'sdk');
  const examplesFile = path.join(sdkDir, 'examples.md');
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
    .filter(file => file.endsWith('.go'))
    .filter(file => file !== 'main.go'); // Skip main.go

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

  // Rename examples.md to examples.mdx and add imports
  if (fs.existsSync(examplesFile)) {
    try {
      const content = fs.readFileSync(examplesFile, 'utf8');
      const { frontmatter, restContent, hasFrontmatter } = frontMatterFromYaml(content);

      if (hasFrontmatter) {
        // Add imports after frontmatter
        const importsSection = importLines.join('\n') + '\n\n';

        // Remove any existing import lines from restContent
        const cleanedContent = restContent.replace(/^import .* from '\.\/_.*.mdx';?\n?/gm, '');

        const newRestContent = importsSection + cleanedContent.trim();
        const updatedContent = frontMatterToYaml(frontmatter, newRestContent);

        fs.writeFileSync(examplesFileNew, updatedContent);
        fs.unlinkSync(examplesFile); // Remove old file

        console.log('  📝 Updated examples.mdx with imports');
      }
    } catch (error) {
      console.warn(`  ⚠️  Error updating examples file: ${error.message}`);
    }
  }

  console.log(`✅ Imported ${processedCount} SDK examples`);
}

/**
 * Rename Hugo _index.md files to Docusaurus index.mdx in preparation for DocCardList
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function renameIndexFilesToMdx(majorVersion = 3) {
  console.log('🔄 Renaming Hugo _index.md → Docusaurus index.mdx files...');

  const versionDir = `versioned_docs/version-${majorVersion}`;

  // Find all _index.md files (Hugo category pages)
  const indexFiles = [];
  function findHugoIndexFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
      if (entry.isDirectory()) {
        findHugoIndexFiles(path.join(dir, entry.name));
      } else if (entry.name === '_index.md') {
        indexFiles.push(path.join(dir, entry.name));
      }
    });
  }

  findHugoIndexFiles(versionDir);

  let renamedCount = 0;
  indexFiles.forEach(filePath => {
    const newPath = filePath.replace('_index.md', 'index.mdx');
    fs.renameSync(filePath, newPath);
    console.log(`  🔄 Renamed: ${path.relative(versionDir, filePath)} → index.mdx`);
    renamedCount++;
  });

  console.log(`✅ Renamed ${renamedCount} Hugo index files to Docusaurus .mdx`);
}

module.exports = {
  startFresh,
  skaffoldMajorVersion,
  moveDocs,
  deleteDeprecatedFiles,
  replaceWeightWithSidebarPosition,
  addMainIndexMetadata,
  addDocsIndexLists,
  renameIndexFilesToMdx
};