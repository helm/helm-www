#!/usr/bin/env node

const { processHelmFiles } = require('./v3/process-helm-files.js');
const { removeAliasesFromV3Files } = require('./v3/remove-aliases.js');
const { migrateSdkSection } = require("./v3/migrate-sdk-section.js");
const { addNetlifyRedirects } = require("./v3/add-netlify-redirects.js");
const {
  startFresh,
  skaffoldMajorVersion,
  moveDocs,
  deleteDeprecatedFiles,
  renameIndexFilesToMdx,
  replaceWeightWithSidebarPosition,
  addMainIndexMetadata,
  addDocsIndexLists,
} = require("./util/util-migration.js");
const { applyAllTextReplacements } = require("./util/util-text-replacements.js");

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

    // Step 9: Apply text replacements (Hugo shortcodes and per-file rules)
    console.log("\n📋 Step 9: Applying text replacements...");
    applyAllTextReplacements(majorVersion);

    // Step 10: Process Helm files (H2 → titles, add slug/id metadata)
    console.log("\n📋 Step 10: Processing Helm files...");
    processHelmFiles();

    // Step 11: Remove all aliases from v3 files
    console.log("\n📋 Step 11: Removing aliases...");
    removeAliasesFromV3Files();

    // Step 12: Add DocCardList components to index pages
    console.log("\n📋 Step 12: Adding DocCardList components...");
    addDocsIndexLists(majorVersion);

    // Step 13: Add netlify redirects for removed aliases
    console.log("\n📋 Step 13: Adding netlify redirects...");
    addNetlifyRedirects();

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