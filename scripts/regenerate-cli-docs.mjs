#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);

/**
 * Extract major version from a version string (e.g., v3.19.0 -> 3, v4.0.0-alpha.1 -> 4)
 */
function getMajorVersion(version) {
  const match = version.match(/^v(\d+)/);
  return match ? match[1] : null;
}

/**
 * Get latest Helm version from get.helm.sh script
 */
async function getHelmLatest() {
  try {
    const response = await fetch('https://get.helm.sh');
    const text = await response.text();
    const match = text.match(/v\d+\.\d+\.\d+/);
    if (match) {
      return match[0];
    }
    throw new Error('No version found in get.helm.sh script');
  } catch (error) {
    console.error('Error fetching latest Helm version:', error.message);
    process.exit(1);
  }
}

/**
 * Regenerate Helm CLI documentation
 */
function regenerateDocs(helmVersion, versionDir) {
  console.log('📦 Regenerating Helm CLI documentation...');

  const tempDir = fs.mkdtempSync(path.join(tmpdir(), 'helm-'));

  try {
    // Download and install Helm
    console.log(`  📥 Downloading Helm ${helmVersion}...`);
    process.env.DESIRED_VERSION = helmVersion;
    process.env.HELM_INSTALL_DIR = tempDir;

    // Download helm binary directly
    const arch = process.arch === 'x64' ? 'amd64' : process.arch === 'arm64' ? 'arm64' : 'amd64';
    const platform = process.platform === 'darwin' ? 'darwin' : 'linux';
    const helmUrl = `https://get.helm.sh/helm-${helmVersion}-${platform}-${arch}.tar.gz`;

    execSync(`
      cd "${tempDir}" && \
      curl -fsSL -o helm.tar.gz "${helmUrl}" && \
      tar -xzf helm.tar.gz && \
      mv ${platform}-${arch}/helm ./helm && \
      chmod +x ./helm
    `, { stdio: 'inherit' });

    // Set environment variables to match Linux defaults
    process.env.HOME = '~';
    process.env.HELM_CACHE_HOME = '~/.cache/helm';
    process.env.HELM_CONFIG_HOME = '~/.config/helm';
    process.env.HELM_DATA_HOME = '~/.local/share/helm';

    // Create helm directory and generate docs
    const helmDocsDir = path.join(PROJECT_ROOT, versionDir, 'helm');
    fs.mkdirSync(helmDocsDir, { recursive: true });

    console.log(`  📝 Generating documentation in ${versionDir}/helm/...`);
    execSync(`"${tempDir}/helm" docs --type markdown --generate-headers`, {
      cwd: helmDocsDir,
      stdio: 'inherit'
    });

    console.log('  ✅ Documentation generated successfully');
  } finally {
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Delete deprecated files with 'section: deprecated' frontmatter
 */
function deleteDeprecatedFiles(helmDir) {
  console.log('🗑️  Removing deprecated files...');

  const files = fs.readdirSync(helmDir).filter(file =>
    file.endsWith('.md') && file !== 'index.md' && file !== 'index.mdx'
  );

  let deletedCount = 0;

  files.forEach(fileName => {
    const filePath = path.join(helmDir, fileName);
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for deprecated section in frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        if (frontmatter.includes('section: deprecated')) {
          fs.unlinkSync(filePath);
          console.log(`    🗑️  Deleted: ${fileName}`);
          deletedCount++;
        }
      }
    } catch (error) {
      console.warn(`    ⚠️  Error checking ${fileName}: ${error.message}`);
    }
  });

  if (deletedCount > 0) {
    console.log(`  ✅ Removed ${deletedCount} deprecated files`);
  }
}

/**
 * Rename index files to .mdx format
 */
function renameIndexFilesToMdx(helmDir) {
  console.log('🔄 Renaming index files to .mdx...');

  let renamedCount = 0;

  // Check for _index.md or index.md
  ['_index.md', 'index.md'].forEach(fileName => {
    const oldPath = path.join(helmDir, fileName);
    if (fs.existsSync(oldPath)) {
      const newPath = path.join(helmDir, 'index.mdx');
      fs.renameSync(oldPath, newPath);
      console.log(`    🔄 Renamed: ${fileName} → index.mdx`);
      renamedCount++;
    }
  });

  if (renamedCount > 0) {
    console.log(`  ✅ Renamed ${renamedCount} index files`);
  }
}

/**
 * Create or update main index file
 */
function createOrUpdateIndexFile(helmDir) {
  console.log('📝 Creating/updating index.mdx file...');

  const indexPath = path.join(helmDir, 'index.mdx');

  // Create the index.mdx content
  const indexContent = `---
title: Helm Commands
description: Documentation for the full list of helm CLI commands.
sidebar_position: 6
id: helm-category
---

# Helm Commands

Here you'll find the list of CLI commands for Helm, with help info on their usage.


import DocCardList from '@theme/DocCardList';

<DocCardList />
`;

  fs.writeFileSync(indexPath, indexContent);
  console.log('  ✅ Index file created/updated');
}

/**
 * Process Helm command files - extract H2 title and set as frontmatter title
 */
function processHelmFiles(helmDir) {
  console.log('🔧 Processing Helm command files...');

  const files = fs.readdirSync(helmDir).filter(file =>
    file.endsWith('.md') && file !== 'index.md' && file !== 'index.mdx'
  );

  let processedCount = 0;

  files.forEach(fileName => {
    const filePath = path.join(helmDir, fileName);

    try {
      let content = fs.readFileSync(filePath, 'utf8');

      // Find first H2 heading
      const h2Match = content.match(/^## (.+)$/m);
      if (h2Match) {
        const title = h2Match[1];

        // Remove the H2 line and any following blank line
        content = content.replace(/^## .+\n(\n)?/m, '');

        // Parse existing frontmatter if it exists
        let frontmatter = {};
        let restContent = content;

        if (content.startsWith('---')) {
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          if (frontmatterMatch) {
            // Parse existing frontmatter
            const frontmatterText = frontmatterMatch[1];
            frontmatterText.split('\n').forEach(line => {
              const match = line.match(/^(\w+):\s*(.*)$/);
              if (match && match[1] !== 'title') {
                // Keep all existing frontmatter except title
                frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '');
              }
            });
            restContent = frontmatterMatch[2];
          }
        }

        // Set the title (lowercase, no quotes)
        frontmatter.title = title;

        // Special handling for helm.md - add slug
        if (fileName === 'helm.md') {
          frontmatter.slug = 'helm';
        }

        // Build new content with updated frontmatter
        const frontmatterLines = Object.entries(frontmatter)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

        content = `---
${frontmatterLines}
---
${restContent}`;

        fs.writeFileSync(filePath, content);
        console.log(`    ✅ Processed: ${fileName}`);
        processedCount++;
      }
    } catch (error) {
      console.error(`    ❌ Error processing ${fileName}: ${error.message}`);
    }
  });

  console.log(`  ✅ Processed ${processedCount} files`);

  // Create _category_.json with link to category doc
  const categoryPath = path.join(helmDir, '_category_.json');
  const categoryContent = {
    link: { type: "doc", id: "helm-category" }
  };

  fs.writeFileSync(categoryPath, JSON.stringify(categoryContent, null, 2) + '\n');
  console.log('  ✅ Created _category_.json');
}

/**
 * Process href differences for helm files only
 */
function processHelmHrefDifferences(helmDir) {
  console.log('🔗 Fixing glossary references in helm files...');

  const rules = [
    {
      fileName: 'helm_install.md',
      before: 'docs/glossary/_index.md#chart-archive',
      after: '../glossary/index.mdx#chart-archive'
    },
    {
      fileName: 'helm_install.md',
      before: 'docs/glossary/_index.md#linhagem-arquivo-de-linhagem',
      after: '../glossary/index.mdx#linhagem-arquivo-de-linhagem'
    }
  ];

  let fixedCount = 0;

  rules.forEach(rule => {
    const filePath = path.join(helmDir, rule.fileName);

    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Look for the exact text to replace
        if (content.includes(rule.before)) {
          content = content.replace(new RegExp(rule.before.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), rule.after);
          fs.writeFileSync(filePath, content);
          console.log(`    🔗 Fixed: ${rule.fileName}`);
          fixedCount++;
        }
      } catch (error) {
        console.warn(`    ⚠️  Error processing ${rule.fileName}: ${error.message}`);
      }
    }
  });

  if (fixedCount > 0) {
    console.log(`  ✅ Fixed ${fixedCount} glossary references`);
  }
}

/**
 * Convert SEE ALSO links to absolute paths
 */
function convertSeeAlsoLinksToAbsolute(helmDir) {
  console.log('🔗 Converting SEE ALSO links to absolute paths...');

  const files = fs.readdirSync(helmDir).filter(file =>
    file.endsWith('.md') || file.endsWith('.mdx')
  );

  let totalFilesConverted = 0;

  files.forEach(fileName => {
    const filePath = path.join(helmDir, fileName);

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;

      // Pattern for markdown links to helm commands (relative links without path)
      // Matches: [text](helm.md) or [text](helm_command.md)
      const helmLinkPattern = /\[([^\]]+)\]\((helm[^/)]*\.md)\)/g;

      content = content.replace(helmLinkPattern, (match, text, link) => {
        hasChanges = true;
        // Convert to absolute /helm/ links
        return `[${text}](/helm/${link})`;
      });

      if (hasChanges) {
        fs.writeFileSync(filePath, content);
        console.log(`    🔗 Converted links in ${fileName}`);
        totalFilesConverted++;
      }
    } catch (error) {
      console.warn(`    ⚠️  Error processing ${fileName}: ${error.message}`);
    }
  });

  if (totalFilesConverted > 0) {
    console.log(`  ✅ Converted links in ${totalFilesConverted} files`);
  }
}

/**
 * Main function
 */
async function main() {
  // Check for help flag
  if (process.argv[2] === '--help' || process.argv[2] === '-h') {
    console.log(`Usage: node scripts/regenerate-cli-docs.mjs <helm-version> <target-directory>

Regenerate Helm CLI documentation and apply post-processing.

Arguments:
  helm-version      Required. Helm version to use (e.g., v3.19.0, v4.0.0-rc.1)
  target-directory  Required. Directory to generate docs in (e.g., docs, versioned_docs/version-3)

Examples:
  node scripts/regenerate-cli-docs.mjs v3.16.4 versioned_docs/version-3
  node scripts/regenerate-cli-docs.mjs v4.0.0-rc.1 docs
  node scripts/regenerate-cli-docs.mjs v4.0.0 versioned_docs/version-4

The script will:
1. Download and install the specified Helm version
2. Generate CLI documentation using 'helm docs' in <target-directory>/helm/
3. Delete deprecated files
4. Convert index files to .mdx format
5. Extract H2 titles as frontmatter
6. Fix specific href references
7. Convert relative links to absolute paths`);
    process.exit(0);
  }

  // Validate required arguments
  if (!process.argv[2] || !process.argv[3]) {
    console.error('Error: Both helm version and target directory are required');
    console.error('Usage: node scripts/regenerate-cli-docs.mjs <helm-version> <target-directory>');
    console.error('Run with --help for more information');
    process.exit(1);
  }

  // Get arguments
  const helmVersion = process.argv[2];
  const versionDir = process.argv[3];
  const majorVersion = getMajorVersion(helmVersion);

  console.log('===============================================');
  console.log('Helm CLI Documentation Generator');
  console.log(`Helm version: ${helmVersion}`);
  console.log(`Major version: ${majorVersion}`);
  console.log(`Documentation directory: ${versionDir}`);
  console.log('===============================================\n');

  // Step 1: Regenerate docs
  regenerateDocs(helmVersion, versionDir);

  const helmDir = path.join(PROJECT_ROOT, versionDir, 'helm');

  // Step 2: Delete deprecated files
  deleteDeprecatedFiles(helmDir);

  // Step 3: Rename index files to .mdx
  renameIndexFilesToMdx(helmDir);

  // Step 4: Create/update main index file
  createOrUpdateIndexFile(helmDir);

  // Step 5: Process Helm files (extract H2 titles)
  processHelmFiles(helmDir);

  // Step 6: Process helm-specific href differences
  processHelmHrefDifferences(helmDir);

  // Step 7: Convert SEE ALSO links to absolute paths
  convertSeeAlsoLinksToAbsolute(helmDir);

  console.log('\n✅ Documentation regeneration complete!');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
