#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { findFiles, moveDirectoryContents, removeDirectory, createDirectory } = require('./util-file-operations.js');
const { frontMatterFromYaml, frontMatterToYaml } = require('./util-frontmatter.js');

/**
 * Clean up version directory for fresh migration
 * @param {number} majorVersion - Version number (e.g., 2, 3)
 */
function startFresh(majorVersion) {
  console.log('🔄 Starting fresh migration...');
  const versionDir = `versioned_docs/version-${majorVersion}`;

  // Remove version directory and recreate
  removeDirectory(versionDir);
  createDirectory(versionDir);

  console.log('✅ Fresh migration setup completed');
}

/**
 * Restore source content for specified version to orig/ directory
 * @param {number} majorVersion - Version number (2 or 3)
 */
function restoreSourceContent(majorVersion) {
  console.log(`📥 Restoring v${majorVersion} source content...`);

  // Clean and create orig directory structure
  removeDirectory('orig');
  execSync('mkdir -p orig', { stdio: 'inherit' });

  if (majorVersion === 2) {
    // Clone helm2 repository
    console.log('📥 Cloning Helm v2 repository...');
    try {
      execSync('git clone --single-branch --branch release-2.17 https://github.com/helm/helm.git helm2', { stdio: 'inherit' });
      execSync('mv helm2/docs orig/docs-v2', { stdio: 'inherit' });
      removeDirectory('helm2');
      console.log('✅ v2 source content restored to orig/docs-v2');
    } catch (error) {
      console.error('❌ Failed to clone Helm v2 repository:', error.message);
      process.exit(1);
    }
  } else if (majorVersion === 3) {
    // Restore content from git main
    console.log('📥 Restoring v3 content from git main...');
    execSync('git restore --source main -- content/en/docs', { stdio: 'inherit' });
    execSync('mv content/en/docs orig/docs-v3', { stdio: 'inherit' });
    removeDirectory('content/en');
    console.log('✅ v3 source content restored to orig/docs-v3');
  } else {
    console.error(`❌ Unsupported major version: ${majorVersion}`);
    process.exit(1);
  }
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

  const sourceDir = `orig/docs-v${majorVersion}`;
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

  // Process main version docs
  const versionDir = `versioned_docs/version-${majorVersion}`;
  let deletedCount = 0;

  if (fs.existsSync(versionDir)) {
    console.log(`  📁 Processing main docs: ${versionDir}`);
    const result = deleteDeprecatedFilesInDirectory(versionDir);
    deletedCount += result.deletedCount;
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
          const result = deleteDeprecatedFilesInDirectory(translationVersionDir);
          deletedCount += result.deletedCount;
        }
      });
    }
  }

  console.log(`✅ Removed ${deletedCount} deprecated files`);
}

/**
 * Delete deprecated files in a specific directory
 * @param {string} dirPath - Directory path to process
 * @returns {Object} - Results with deletedCount
 */
function deleteDeprecatedFilesInDirectory(dirPath) {
  const files = findFiles(dirPath, ['.md', '.mdx']);
  let deletedCount = 0;

  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, hasFrontmatter } = frontMatterFromYaml(content);

      if (hasFrontmatter && frontmatter.section === 'deprecated') {
        fs.unlinkSync(filePath);
        console.log(`    🗑️  Deleted: ${path.relative(dirPath, filePath)}`);
        deletedCount++;
      }
    } catch (error) {
      console.warn(`    ⚠️  Error checking ${filePath}: ${error.message}`);
    }
  });

  return { deletedCount };
}

/**
 * Replace Hugo 'weight:' frontmatter with Docusaurus 'sidebar_position:'
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function replaceWeightWithSidebarPosition(majorVersion = 3) {
  console.log('🔄 Converting weight → sidebar_position in frontmatter...');

  // Process main version docs
  const versionDir = `versioned_docs/version-${majorVersion}`;
  let updatedCount = 0;

  if (fs.existsSync(versionDir)) {
    console.log(`  📁 Processing main docs: ${versionDir}`);
    const result = replaceWeightInDirectory(versionDir);
    updatedCount += result.updatedCount;
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
          const result = replaceWeightInDirectory(translationVersionDir);
          updatedCount += result.updatedCount;
        }
      });
    }
  }

  console.log(`✅ Updated ${updatedCount} files with sidebar_position`);
}

/**
 * Replace weight with sidebar_position in a specific directory
 * @param {string} dirPath - Directory path to process
 * @returns {Object} - Results with updatedCount
 */
function replaceWeightInDirectory(dirPath) {
  const files = findFiles(dirPath, ['.md', '.mdx']);
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

        console.log(`    🔄 Updated: ${path.relative(dirPath, filePath)}`);
        updatedCount++;
      }
    } catch (error) {
      console.warn(`    ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });

  return { updatedCount };
}

/**
 * Add metadata to main index file (_index.md → index.mdx)
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function addMainIndexMetadata(majorVersion = 3) {
  console.log('📝 Adding metadata to main index file...');

  const versionDir = `versioned_docs/version-${majorVersion}`;
  const indexPath = path.join(versionDir, 'index.mdx');

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const { frontmatter, restContent } = frontMatterFromYaml(content);

    // Add required metadata (frontmatter only)
    frontmatter.sidebar_position = 1;
    if (!frontmatter.title) {
      frontmatter.title = 'Documentation';
    }

    const updatedContent = frontMatterToYaml(frontmatter, restContent);
    fs.writeFileSync(indexPath, updatedContent);

    console.log('✅ Main index file metadata updated');
  } else {
    console.warn('⚠️  Main index file (index.mdx) not found');
  }
}

/**
 * Add <DocCardList /> components to category index pages
 * Reproduces Hugo's automatic page listing functionality
 * @param {number} majorVersion - Version number (e.g., 3)
 */
function addDocsIndexLists(majorVersion = 3) {
  console.log('📋 Adding DocCardList components to index pages...');

  // Process main version docs
  const versionDir = `versioned_docs/version-${majorVersion}`;
  let updatedCount = 0;

  if (fs.existsSync(versionDir)) {
    console.log(`  📁 Processing main docs: ${versionDir}`);
    const result = addDocCardListInDirectory(versionDir);
    updatedCount += result.updatedCount;
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
          const result = addDocCardListInDirectory(translationVersionDir);
          updatedCount += result.updatedCount;
        }
      });
    }
  }

  console.log(`✅ Added DocCardList to ${updatedCount} index pages`);
}

/**
 * Add DocCardList components in a specific directory
 * @param {string} dirPath - Directory path to process
 * @returns {Object} - Results with updatedCount
 */
function addDocCardListInDirectory(dirPath) {
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

  findIndexFiles(dirPath);

  // Also add the root index.mdx file if it exists
  const rootIndexPath = path.join(dirPath, 'index.mdx');
  if (fs.existsSync(rootIndexPath)) {
    indexFiles.push(rootIndexPath);
  }

  let updatedCount = 0;

  indexFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check if DocCardList is already present
      if (!content.includes('DocCardList')) {
        // Simply append import and component to the end
        const updatedContent = content +
          '\n\nimport DocCardList from \'@theme/DocCardList\';\n\n<DocCardList />\n';

        fs.writeFileSync(filePath, updatedContent);
        console.log(`    📋 Added DocCardList: ${path.relative(dirPath, filePath)}`);
        updatedCount++;
      }
    } catch (error) {
      console.warn(`    ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });

  return { updatedCount };
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

  // Process main version docs
  const versionDir = `versioned_docs/version-${majorVersion}`;
  let renamedCount = 0;

  if (fs.existsSync(versionDir)) {
    console.log(`  📁 Processing main docs: ${versionDir}`);
    const result = renameIndexFilesInDirectory(versionDir);
    renamedCount += result.renamedCount;
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
          const result = renameIndexFilesInDirectory(translationVersionDir);
          renamedCount += result.renamedCount;
        }
      });
    }
  }

  console.log(`✅ Renamed ${renamedCount} Hugo index files to Docusaurus .mdx`);
}

/**
 * Rename index files in a specific directory
 * @param {string} dirPath - Directory path to process
 * @returns {Object} - Results with renamedCount
 */
function renameIndexFilesInDirectory(dirPath) {
  // Find all _index.md and index.md files that should become index.mdx
  const indexFiles = [];
  function findIndexFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
      if (entry.isDirectory()) {
        findIndexFiles(path.join(dir, entry.name));
      } else if (entry.name === '_index.md' || entry.name === 'index.md') {
        indexFiles.push(path.join(dir, entry.name));
      }
    });
  }

  findIndexFiles(dirPath);

  let renamedCount = 0;
  indexFiles.forEach(filePath => {
    const newPath = filePath.replace(/(_index\.md|index\.md)$/, 'index.mdx');
    fs.renameSync(filePath, newPath);
    const originalName = path.basename(filePath);
    console.log(`    🔄 Renamed: ${path.relative(dirPath, filePath)} → index.mdx`);
    renamedCount++;
  });

  return { renamedCount };
}

/**
 * Rename commands directories to helm in i18n translations
 * This fixes structural inconsistencies in i18n directories where some languages
 * have a top-level "commands" directory instead of "helm"
 * @param {number} majorVersion - Major version number (e.g., 3)
 */
function renameCommandsToHelm(majorVersion) {
  console.log('🔧 Renaming commands directories to helm in i18n directories...');

  const i18nDir = 'i18n';
  if (!fs.existsSync(i18nDir)) {
    console.log('  ⏭️  No i18n directory found, skipping');
    return;
  }

  const languages = fs.readdirSync(i18nDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let renamedCount = 0;

  languages.forEach(lang => {
    const commandsDir = `${i18nDir}/${lang}/docusaurus-plugin-content-docs/version-${majorVersion}/commands`;
    const helmDir = `${i18nDir}/${lang}/docusaurus-plugin-content-docs/version-${majorVersion}/helm`;

    if (fs.existsSync(commandsDir)) {
      console.log(`  🔄 Renaming ${lang}: commands → helm`);

      if (fs.existsSync(helmDir)) {
        console.log(`  ⚠️  Warning: ${lang} has both commands and helm directories, merging...`);

        // Move all files from commands to helm
        const files = fs.readdirSync(commandsDir);
        files.forEach(file => {
          const oldPath = path.join(commandsDir, file);
          const newPath = path.join(helmDir, file);
          if (!fs.existsSync(newPath)) {
            fs.renameSync(oldPath, newPath);
          } else {
            console.log(`    ⚠️  Skipping ${file} (already exists in helm directory)`);
          }
        });
      } else {
        // Simply rename commands to helm
        fs.renameSync(commandsDir, helmDir);
      }

      // Remove empty commands directory if it still exists
      if (fs.existsSync(commandsDir)) {
        try {
          fs.rmdirSync(commandsDir);
        } catch (error) {
          // Directory might not be empty, that's okay
        }
      }

      renamedCount++;
    }
  });

  if (renamedCount > 0) {
    console.log(`✅ Renamed commands to helm in ${renamedCount} language(s)`);
  } else {
    console.log('  ✅ No commands directories found to rename');
  }
}

module.exports = {
  startFresh,
  restoreSourceContent,
  skaffoldMajorVersion,
  moveDocs,
  deleteDeprecatedFiles,
  replaceWeightWithSidebarPosition,
  addMainIndexMetadata,
  addDocsIndexLists,
  renameIndexFilesToMdx,
  renameCommandsToHelm
};
