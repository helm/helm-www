#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const SDK_DIR = path.join(PROJECT_ROOT, "sdkexamples");
const SDK_MODULE_PATH = "helm.sh/helm/v4";

const args = process.argv.slice(2);
let targetVersion = null;
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--version") targetVersion = args[++i];
  else if (args[i] === "--dry-run") dryRun = true;
  else if (args[i] === "--help" || args[i] === "-h") {
    console.log(`Usage: node scripts/v4/bump-sdk.mjs [options]

Bump sdkexamples/ to the latest (or specified) Helm v4 SDK release. Runs
\`go get\` + \`go mod tidy\` + \`go build ./...\` in sdkexamples/. If the
build fails (typically because of an API rename between SDK releases),
the script exits non-zero with a clear message so the caller can fix the
example code by hand before retrying.

Options:
  --version vX.Y.Z   Target Helm SDK version (default: auto-detect from helm/helm releases)
  --dry-run          Print what would change without running go commands
  -h, --help         Show this help and exit

Examples:
  node scripts/v4/bump-sdk.mjs
  node scripts/v4/bump-sdk.mjs --version v4.2.0
  node scripts/v4/bump-sdk.mjs --dry-run`);
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

function currentSdkVersion() {
  const goModPath = path.join(SDK_DIR, "go.mod");
  if (!fs.existsSync(goModPath)) return null;
  const content = fs.readFileSync(goModPath, "utf8");
  // Match `helm.sh/helm/v4 v4.X.Y` with optional indent/tabs.
  const re = new RegExp(`\\b${SDK_MODULE_PATH.replace(/[.\/]/g, "\\$&")}\\s+(v\\S+)`);
  const match = content.match(re);
  return match ? match[1] : null;
}

function runGo(args, label) {
  console.log(`  $ go ${args.join(" ")}`);
  try {
    execSync(`go ${args.join(" ")}`, { cwd: SDK_DIR, stdio: "inherit" });
  } catch (err) {
    console.error(`\nError: ${label} failed (exit ${err.status ?? "?"}).`);
    if (label === "go build ./...") {
      console.error(
        "The SDK examples no longer compile against the new Helm release. This usually means the release renamed or removed an exported symbol the examples use (e.g. v4.1.x renamed `InsecureSkipTLSverify` -> `InsecureSkipTLSVerify`). Update sdkexamples/*.go by hand to match the new API, then re-run this script."
      );
    }
    process.exit(1);
  }
}

async function main() {
  if (!fs.existsSync(SDK_DIR) || !fs.existsSync(path.join(SDK_DIR, "go.mod"))) {
    console.error(`Error: ${SDK_DIR}/go.mod not found.`);
    process.exit(1);
  }

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

  const currentVersion = currentSdkVersion();

  console.log("");
  console.log("=================================================");
  console.log("  Helm SDK examples version bump");
  console.log(`  Current  : ${currentVersion ?? "(unparsed)"}`);
  console.log(`  Target   : ${targetVersion}`);
  console.log(`  Dir      : ${path.relative(PROJECT_ROOT, SDK_DIR)}/`);
  if (dryRun) console.log("  DRY RUN  : no files will be written");
  console.log("=================================================");
  console.log("");

  if (currentVersion === targetVersion && !dryRun) {
    console.log(`sdkexamples/go.mod already pins ${targetVersion}. Nothing to do.`);
    return;
  }

  if (dryRun) {
    console.log("Commands that would run:");
    console.log(`  (cd ${path.relative(PROJECT_ROOT, SDK_DIR)} && go get ${SDK_MODULE_PATH}@${targetVersion})`);
    console.log(`  (cd ${path.relative(PROJECT_ROOT, SDK_DIR)} && go mod tidy)`);
    console.log(`  (cd ${path.relative(PROJECT_ROOT, SDK_DIR)} && go build ./...)`);
    return;
  }

  runGo(["get", `${SDK_MODULE_PATH}@${targetVersion}`], `go get ${SDK_MODULE_PATH}@${targetVersion}`);
  runGo(["mod", "tidy"], "go mod tidy");
  runGo(["build", "./..."], "go build ./...");

  console.log("");
  console.log(`OK sdkexamples/ now builds against ${targetVersion}. Next steps:`);
  console.log("   1. Review sdkexamples/go.mod and sdkexamples/go.sum.");
  console.log(`   2. git add sdkexamples/go.mod sdkexamples/go.sum && git commit -s -m "fix(sdkexamples): bump ${SDK_MODULE_PATH} to ${targetVersion}"`);
  console.log("   3. Open a PR against main.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
