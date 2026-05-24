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
let baseRef = null;
let skipCliDocs = false;
let skipChangelog = false;
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--version") targetVersion = args[++i];
  else if (args[i] === "--base") baseRef = args[++i];
  else if (args[i] === "--skip-cli-docs") skipCliDocs = true;
  else if (args[i] === "--skip-changelog") skipChangelog = true;
  else if (args[i] === "--dry-run") dryRun = true;
  else if (args[i] === "--help" || args[i] === "-h") {
    console.log(`Usage: node scripts/v4/bump-version.mjs [options]

Bump the Helm 4 documentation site to the latest (or specified) release.

Options:
  --version vX.Y.Z      Target Helm version (default: auto-detect from get.helm.sh)
  --base vX.Y.Z         Base ref for the full changelog (default: parsed from docs/changelog.md)
  --skip-cli-docs       Skip regenerating docs/helm/ via regenerate-cli-docs.mjs
  --skip-changelog      Skip regenerating docs/changelog.md via changelog.mjs
  --dry-run             Print what would change without writing any files

Examples:
  node scripts/v4/bump-version.mjs
  node scripts/v4/bump-version.mjs --version v4.2.0
  node scripts/v4/bump-version.mjs --skip-cli-docs --skip-changelog --dry-run`);
    process.exit(0);
  } else {
    console.error(`Unknown argument: ${args[i]}`);
    process.exit(1);
  }
}

async function getHelmLatest() {
  const response = await fetch(
    "https://api.github.com/repos/helm/helm/releases?per_page=20",
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  const releases = await response.json();
  const release = releases.find(
    (r) => !r.prerelease && !r.draft && r.tag_name.startsWith("v4.")
  );
  if (!release) throw new Error("No stable v4 release found in the last 20 releases");
  return release.tag_name;
}

function parseChangelogBase() {
  const changelogPath = path.join(PROJECT_ROOT, "docs", "changelog.md");
  if (!fs.existsSync(changelogPath)) return null;
  const content = fs.readFileSync(changelogPath, "utf8");
  const match = content.match(/compared to `(v[\d.]+)`/);
  return match ? match[1] : null;
}

function updateDocusaurusConfig(bareVersion) {
  const configPath = path.join(PROJECT_ROOT, "docusaurus.config.js");
  const before = fs.readFileSync(configPath, "utf8");
  const after = before.replace(
    /current:\s*\{\s*label:\s*"[\d.]+"\s*\}/,
    `current: { label: "${bareVersion}" }`
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
      "current.json"
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
    process.stdout.write("Fetching latest Helm version from GitHub... ");
    try {
      targetVersion = await getHelmLatest();
      console.log(targetVersion);
    } catch (err) {
      console.error(`\nError: ${err.message}`);
      process.exit(1);
    }
  }

  if (!targetVersion.startsWith("v")) targetVersion = "v" + targetVersion;

  const majorMatch = targetVersion.match(/^v(\d+)\./);
  if (!majorMatch || majorMatch[1] !== "4") {
    console.error(
      `Error: ${targetVersion} is not a Helm 4 version. This script only handles v4.x.y.`
    );
    process.exit(1);
  }

  const bareVersion = targetVersion.slice(1);

  if (!baseRef) {
    baseRef = parseChangelogBase();
    if (!baseRef) {
      console.error(
        "Error: Could not parse base ref from docs/changelog.md. Use --base vX.Y.Z."
      );
      process.exit(1);
    }
    console.log(`Changelog base resolved from docs/changelog.md: ${baseRef}`);
  }

  console.log("");
  console.log("=================================================");
  console.log("  Helm 4 doc version bump");
  console.log(`  Target version : ${targetVersion}  (label: "${bareVersion}")`);
  console.log(`  Changelog base : ${baseRef}`);
  console.log(`  CLI docs       : ${skipCliDocs ? "skipped" : "will regenerate"}`);
  console.log(`  Changelog      : ${skipChangelog ? "skipped" : "will regenerate"}`);
  if (dryRun) console.log("  DRY RUN        : no files will be written");
  console.log("=================================================");
  console.log("");

  if (dryRun) {
    console.log("Files that would change:");
    console.log(`  docusaurus.config.js  (current.label → "${bareVersion}")`);
    console.log("  i18n/*/docusaurus-plugin-content-docs/current.json  (11 locales)");
    if (!skipCliDocs) console.log("  docs/helm/*.md  (via regenerate-cli-docs.mjs)");
    if (!skipChangelog) console.log("  docs/changelog.md  (via changelog.mjs)");
    return;
  }

  console.log("Updating docusaurus.config.js...");
  if (updateDocusaurusConfig(bareVersion)) {
    console.log(`  ✅ current.label → "${bareVersion}"`);
  } else {
    console.log("  ⚠️  Pattern not matched — already up to date or format changed.");
  }

  console.log("Updating i18n locale labels...");
  const updated = updateI18nLabels(bareVersion);
  console.log(`  ✅ ${updated.length} locales updated: ${updated.join(", ")}`);

  if (!skipCliDocs) {
    console.log(`\nRegenerating CLI docs for ${targetVersion}...`);
    execSync(`yarn node scripts/regenerate-cli-docs.mjs ${targetVersion} docs`, {
      cwd: PROJECT_ROOT,
      stdio: "inherit",
    });
  }

  if (!skipChangelog) {
    console.log(`\nRegenerating changelog (${baseRef}..${targetVersion})...`);
    execSync(`yarn node scripts/v4/changelog.mjs ${baseRef} ${targetVersion}`, {
      cwd: PROJECT_ROOT,
      stdio: "inherit",
    });
  }

  console.log("");
  console.log("✅ Done. Next steps:");
  console.log(
    "   1. Update docs/topics/version_skew.mdx for major/minor releases."
  );
  console.log(`   2. git add <files> && git commit -s -m "Bump docs to ${bareVersion}"`);
  console.log("   3. Open a draft PR against main.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
