#!/usr/bin/env node

const { startFresh, skaffoldMajorVersion } = require("./util/util-migration.js");
const { copyV2DocsToDocusaurus } = require("./v2/copy-files.js");
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Clone Helm v2 repository for migration
 */
function cloneV2() {
  const helm2Dir = 'helm2';

  // Remove helm2 directory and re-clone
  if (fs.existsSync(helm2Dir)) {
    fs.rmSync(helm2Dir, { recursive: true, force: true });
    console.log(`🗑️  Removed directory: ${helm2Dir}`);
  }

  // Clone helm2 repository
  console.log('📥 Cloning Helm v2 repository...');
  try {
    execSync('git clone --single-branch --branch release-2.17 https://github.com/helm/helm.git helm2', { stdio: 'inherit' });
    console.log('✅ Helm v2 repository cloned successfully');
  } catch (error) {
    console.error('❌ Failed to clone Helm v2 repository:', error.message);
    process.exit(1);
  }
}

/**
 * Master orchestrator for v2 docs migration
 * Simple migration that fetches v2 menu structure and copies files
 */
async function migrateV2Docs(majorVersion = 2) {
  console.log("🚀 Starting v2 docs migration...");

  try {
    // Step 1: Start with clean slate (reset directories and restore from git main)
    console.log("\n📋 Step 1: Starting fresh...");
    startFresh(majorVersion);

    // Clone helm2 repository for v2 migration
    cloneV2();

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