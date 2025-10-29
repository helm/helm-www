#!/usr/bin/env node

const { startFresh, restoreSourceContent, skaffoldMajorVersion } = require("./util/util-migration.js");
const { copyV2DocsToDocusaurus } = require("./v2/copy-files.js");
const path = require('path');

/**
 * Master orchestrator for v2 docs migration
 * Simple migration that fetches v2 menu structure and copies files
 */
async function migrateV2Docs(majorVersion = 2) {
  console.log("🚀 Starting v2 docs migration...");

  try {
    // Step 1: Start with clean slate and restore source content
    console.log("\n📋 Step 1: Starting fresh...");
    startFresh(majorVersion);
    restoreSourceContent(majorVersion);

    // Step 2: Setup Docusaurus version structure (creates versioned_docs/version-2)
    console.log("\n📋 Step 2: Setting up Docusaurus version structure...");
    skaffoldMajorVersion(majorVersion);

    // Step 3: Generate v2 menu structure
    console.log("\n📋 Step 3: Generating v2 menu structure...");
    const { fetchV2Navigation } = require("./v2/menu-generate.js");
    await fetchV2Navigation();

    // Step 4: Copy v2 files using the structured menu
    console.log("\n📋 Step 4: Processing v2 files with Docusaurus structure...");
    copyV2DocsToDocusaurus();

    // Step 5: Fix v2 href differences (link paths)
    console.log("\n📋 Step 5: Fixing v2 href differences...");
    const path = require('path');
    const { processHrefDifferences } = require("./util/href-diffs-process.js");
    const differencesFile = path.join(__dirname, 'v2/href-diffs.json');
    processHrefDifferences(majorVersion, differencesFile);

    console.log("\n🎉 v2 docs migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const majorVersion = process.argv[2] ? parseInt(process.argv[2]) : 2;
  migrateV2Docs(majorVersion);
}

module.exports = { migrateV2Docs };
