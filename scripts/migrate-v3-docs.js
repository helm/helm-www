#!/usr/bin/env node

const { processHelmFiles } = require('./v3/process-helm-files.js');
const { removeAliasesFromFiles } = require('./v3/remove-aliases.js');
const { migrateSdkSection } = require("./v3/migrate-sdk-section.js");
const { addNetlifyRedirects } = require("./v3/add-netlify-redirects.js");
const {
  startFresh,
  restoreSourceContent,
  skaffoldMajorVersion,
  moveDocs,
  deleteDeprecatedFiles,
  renameIndexFilesToMdx,
  replaceWeightWithSidebarPosition,
  addMainIndexMetadata,
  addDocsIndexLists,
  renameCommandsToHelm,
} = require("./util/util-migration.js");
const { applyAllTextReplacements } = require("./util/util-text-replacements.js");
const { convertRelativeLinksToAbsolute } = require("./util/util-docusaurus-links.js");
const { processHrefDifferences } = require("./util/href-diffs-process.js");

/**
 * Master orchestrator for v3 docs migration
 * Replaces migrate-docs.sh with idiomatic Node.js
 */
async function migrateV3Docs(majorVersion = 3) {
  console.log("🚀 Starting v3 docs migration...");

  try {
    // Step 1: Start with clean slate (reset directories and restore from git main)
    console.log("\n📋 Step 1: Starting fresh...");
    startFresh(majorVersion);
    restoreSourceContent(majorVersion);

    // Step 2: Setup Docusaurus version structure (idempotent)
    console.log("\n📋 Step 2: Setting up Docusaurus version structure...");
    skaffoldMajorVersion(majorVersion);

    // Step 3: Move docs from Hugo to Docusaurus structure
    console.log("\n📋 Step 3: Moving docs...");
    moveDocs(majorVersion);

    // Step 4: Delete files with deprecated section
    console.log("\n📋 Step 4: Deleting deprecated files...");
    deleteDeprecatedFiles(majorVersion);

    // Step 5: Rename index.md → index.mdx files
    console.log("\n📋 Step 5: Renaming index files...");
    renameIndexFilesToMdx(majorVersion);

    // Step 6: Replace Hugo weight with Docusaurus sidebar_position
    console.log("\n📋 Step 6: Converting frontmatter...");
    replaceWeightWithSidebarPosition(majorVersion);

    // Step 7: Add metadata to main index file
    console.log("\n📋 Step 7: Adding main index metadata...");
    addMainIndexMetadata(majorVersion);

    // Step 8: Migrate SDK section (import Go files and apply transformations)
    console.log("\n📋 Step 8: Migrating SDK section...");
    migrateSdkSection(majorVersion);

    // Step 9: Rename commands directories to helm in i18n
    console.log("\n📋 Step 9: Renaming commands to helm in i18n directories...");
    renameCommandsToHelm(majorVersion);

    // Step 10: Apply text replacements (Hugo shortcodes and per-file rules)
    console.log("\n📋 Step 10: Applying text replacements...");
    applyAllTextReplacements(majorVersion);

    // Step 11: Process Helm files (H2 → titles, add slug/id metadata)
    console.log("\n📋 Step 11: Processing Helm files...");
    processHelmFiles();

    // Step 12: Remove all aliases from v3 files
    console.log("\n📋 Step 12: Removing aliases...");
    removeAliasesFromFiles();

    // Step 13: Add DocCardList components to index pages
    console.log("\n📋 Step 13: Adding DocCardList components...");
    addDocsIndexLists(majorVersion);

    // Step 14: Add netlify redirects for removed aliases
    console.log("\n📋 Step 14: Adding netlify redirects...");
    addNetlifyRedirects();

    // Step 15: Process href differences (fix broken links)
    console.log("\n📋 Step 15: Processing href differences...");
    processHrefDifferences(majorVersion, `./scripts/v${majorVersion}/href-diffs.json`);

    // Step 16: Convert all relative links to absolute Docusaurus paths
    console.log("\n📋 Step 16: Converting relative links to absolute paths...");
    convertRelativeLinksToAbsolute(majorVersion);

    console.log("\n🎉 v3 docs migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  migrateV3Docs();
}

module.exports = { migrateV3Docs };
