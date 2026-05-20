#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

const args = process.argv.slice(2);
let targetVersion = null;
let skipCliDocs = false;
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--version") targetVersion = args[++i];
  else if (args[i] === "--skip-cli-docs") skipCliDocs = true;
  else if (args[i] === "--dry-run") dryRun = true;
  else if (args[i] === "--help" || args[i] === "-h") {
    console.log(`Usage: node scripts/v3/bump-version.mjs [options]

Bump the Helm 3 documentation site to the latest (or specified) release.

Options:
  --version vX.Y.Z      Target Helm version (default: auto-detect from GitHub)
  --skip-cli-docs       Skip regenerating versioned_docs/version-3/helm/ via regenerate-cli-docs.mjs
  --dry-run             Print what would change without writing any files

Examples:
  node scripts/v3/bump-version.mjs
  node scripts/v3/bump-version.mjs --version v3.21.0
  node scripts/v3/bump-version.mjs --skip-cli-docs --dry-run`);
    process.exit(0);
  } else {
    console.error(`Unknown argument: ${args[i]}`);
    process.exit(1);
  }
}

async function getHelmV3Latest() {
  const response = await fetch(
    "https://api.github.com/repos/helm/helm/releases?per_page=20",
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  const releases = await response.json();
  const release = releases.find(
    (r) => !r.prerelease && !r.draft && r.tag_name.startsWith("v3.")
  );
  if (!release) throw new Error("No stable v3 release found in the last 20 releases");
  return release.tag_name;
}

function updateDocusaurusConfig(bareVersion) {
  const configPath = path.join(PROJECT_ROOT, "docusaurus.config.js");
  const before = fs.readFileSync(configPath, "utf8");
  const after = before.replace(
    /3:\s*\{\s*label:\s*"[\d.]+"\s*,\s*path:\s*"v3"\s*\}/,
    `3: { label: "${bareVersion}", path: "v3" }`
  );
  if (after === before) return false;
  if (!dryRun) fs.writeFileSync(configPath, after);
  return true;
}

function updateI18nLabels(bareVersion) {
  const i18nDir = path.join(PROJECT_ROOT, "i18n");
  const locales = fs.readdirSync(i18nDir).filter((entry) =>
    fs.statSync(path.join(i18nDir, entry)).isDirectory()
  );
  const updated = [];
  for (const locale of locales) {
    const jsonPath = path.join(
      i18nDir,
      locale,
      "docusaurus-plugin-content-docs",
      "version-3.json"
    );
    if (!fs.existsSync(jsonPath)) continue;
    const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (!json["version.label"]) continue;
    json["version.label"].message = bareVersion;
    if (!dryRun) fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + "\n");
    updated.push(locale);
  }
  return updated;
}

async function main() {
  if (!targetVersion) {
    process.stdout.write("Fetching latest Helm v3 version from GitHub... ");
    try {
      targetVersion = await getHelmV3Latest();
      console.log(targetVersion);
    } catch (err) {
      console.error(`\nError: ${err.message}`);
      process.exit(1);
    }
  }

  if (!targetVersion.startsWith("v")) targetVersion = "v" + targetVersion;

  const majorMatch = targetVersion.match(/^v(\d+)\./);
  if (!majorMatch || majorMatch[1] !== "3") {
    console.error(
      `Error: ${targetVersion} is not a Helm 3 version. This script only handles v3.x.y.`
    );
    process.exit(1);
  }

  const bareVersion = targetVersion.slice(1);

  console.log("");
  console.log("=================================================");
  console.log("  Helm 3 doc version bump");
  console.log(`  Target version : ${targetVersion}  (label: "${bareVersion}")`);
  console.log(`  CLI docs       : ${skipCliDocs ? "skipped" : "will regenerate"}`);
  if (dryRun) console.log("  DRY RUN        : no files will be written");
  console.log("=================================================");
  console.log("");

  if (dryRun) {
    console.log("Files that would change:");
    console.log(`  docusaurus.config.js  (3.label → "${bareVersion}")`);
    console.log("  i18n/*/docusaurus-plugin-content-docs/version-3.json");
    if (!skipCliDocs) console.log("  versioned_docs/version-3/helm/*.md  (via regenerate-cli-docs.mjs)");
    return;
  }

  console.log("Updating docusaurus.config.js...");
  if (updateDocusaurusConfig(bareVersion)) {
    console.log(`  ✅ 3.label → "${bareVersion}"`);
  } else {
    console.log("  ⚠️  Pattern not matched — already up to date or format changed.");
  }

  console.log("Updating i18n locale labels...");
  const updated = updateI18nLabels(bareVersion);
  console.log(`  ✅ ${updated.length} locales updated: ${updated.join(", ")}`);

  if (!skipCliDocs) {
    console.log(`\nRegenerating CLI docs for ${targetVersion}...`);
    execSync(
      `yarn node scripts/regenerate-cli-docs.mjs ${targetVersion} versioned_docs/version-3`,
      { cwd: PROJECT_ROOT, stdio: "inherit" }
    );
  }

  console.log("");
  console.log("✅ Done. Next steps:");
  console.log(`   1. git add <files> && git commit -s -m "Bump v3 docs to ${bareVersion}"`);
  console.log("   2. Open a draft PR against main.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
