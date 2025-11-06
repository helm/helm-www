#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Octokit } from "@octokit/rest";
import simpleGit from "simple-git";
import pLimit from "p-limit";
import ora from "ora";

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PARALLEL_LIMIT = 10; // Process 10 commits at a time
const RATE_LIMIT_THRESHOLD = 500;
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const HELM_REPO_DIR = path.join(PROJECT_ROOT, "orig/helm");

// Breaking changes and backported PRs (manually identified)
const BREAKING_CHANGES = new Set([
  13617, 30586, 30589, 31081, 31165, 31216, 31225, 30812, 31030, 31142, 31194,
  31145, 31146, 31172, 31174, 31176, 31196, 31217, 31218, 31219, 31220, 13629,
  30982, 30749, 13573, 13611, 30567, 30580, 13494, 31023, 13458, 30686,
]);

// Parse command line arguments
const args = process.argv.slice(2);

// Validate required arguments
if (args.length < 2) {
  console.error("Error: Missing required arguments");
  console.error("");
  console.error(
    "Usage: node scripts/v4/changelog.mjs <base-ref> <head-ref> [output-file]"
  );
  console.error("");
  console.error("Examples:");
  console.error("  node scripts/v4/changelog.mjs v3.19.0 v4.0.0-rc.1");
  console.error("  node scripts/v4/changelog.mjs v4.0.0-beta.1 v4.0.0-beta.2");
  console.error(
    "  node scripts/v4/changelog.mjs v3.19.0 main docs/changelog.md"
  );
  console.error("");
  console.error("Arguments:");
  console.error(
    "  base-ref    The starting ref (tag, branch, or commit) to compare from"
  );
  console.error(
    "  head-ref    The ending ref (tag, branch, or commit) to compare to"
  );
  console.error(
    "  output-file Optional output file path (default: docs/changelog.md)"
  );
  process.exit(1);
}

const BASE_REF = args[0];
const HEAD_REF = args[1];
const OUTPUT_FILE = args[2] || "docs/changelog.md";

// Get GitHub token
let githubToken = process.env.GITHUB_TOKEN;
if (!githubToken) {
  try {
    githubToken = execSync("gh auth token", { encoding: "utf8" }).trim();
  } catch (e) {
    console.error("Error: GitHub authentication required");
    console.error("");
    console.error("Please authenticate using one of these methods:");
    console.error("  1. Run: gh auth login");
    console.error(
      "  2. Set environment variable: export GITHUB_TOKEN=<your-token>"
    );
    console.error("");
    console.error(
      "You can create a token at: https://github.com/settings/tokens"
    );
    process.exit(1);
  }
}

// Initialize Octokit with auth token
const octokit = new Octokit({
  auth: githubToken,
  throttle: {
    onRateLimit: (retryAfter, options) => {
      console.log(`Rate limit hit, waiting ${retryAfter} seconds...`);
      return true;
    },
    onSecondaryRateLimit: (retryAfter, options) => {
      console.log(`Secondary rate limit hit, waiting ${retryAfter} seconds...`);
      return true;
    },
  },
});

async function setupHelmRepo() {
  const spinner = ora("Setting up helm repository...").start();

  // Create orig directory if it doesn't exist
  if (!fs.existsSync(path.join(PROJECT_ROOT, "orig"))) {
    fs.mkdirSync(path.join(PROJECT_ROOT, "orig"), { recursive: true });
  }

  const git = simpleGit();

  if (!fs.existsSync(HELM_REPO_DIR)) {
    spinner.text = "Cloning helm/helm repository...";
    await git.clone("https://github.com/helm/helm.git", HELM_REPO_DIR);
  } else {
    spinner.text = "Helm repository already exists, updating...";
  }

  // Fetch latest tags
  const helmGit = simpleGit(HELM_REPO_DIR);
  spinner.text = "Fetching latest tags...";
  await helmGit.fetch(["--all", "--tags"]);

  // Verify tags exist
  const tags = await helmGit.tags();
  if (!tags.all.includes(BASE_REF)) {
    spinner.fail(`Error: Tag ${BASE_REF} not found in helm repository`);
    process.exit(1);
  }
  if (!tags.all.includes(HEAD_REF)) {
    spinner.fail(`Error: Tag ${HEAD_REF} not found in helm repository`);
    process.exit(1);
  }

  spinner.succeed("Helm repository ready");
  return helmGit;
}

async function getCommits(git) {
  const spinner = ora("Getting commits from git...").start();

  // Get all commits between refs
  const revListOutput = await git.raw(["rev-list", `${BASE_REF}..${HEAD_REF}`]);
  const allCommits = revListOutput.trim().split("\n").filter(Boolean);

  spinner.text = `Found ${allCommits.length} commits, filtering merge commits...`;

  // Filter out merge commits
  const nonMergeCommits = [];
  const limit = pLimit(20); // Check 20 commits in parallel

  await Promise.all(
    allCommits.map((sha) =>
      limit(async () => {
        const parentCount = (
          await git.raw(["show", "--no-patch", "--format=%P", sha])
        )
          .trim()
          .split(" ").length;
        if (parentCount < 2) {
          nonMergeCommits.push(sha);
        }
      })
    )
  );

  spinner.succeed(
    `Found ${nonMergeCommits.length} non-merge commits (filtered ${
      allCommits.length - nonMergeCommits.length
    } merge commits)`
  );
  return nonMergeCommits;
}

async function checkRateLimit() {
  try {
    const { data } = await octokit.rateLimit.get();
    return data.rate.remaining;
  } catch {
    return 5000; // Default if can't check
  }
}

async function fetchPRForCommit(sha, git) {
  try {
    // Get PRs associated with this commit
    const { data: prs } = await octokit.request(
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
      {
        owner: "helm",
        repo: "helm",
        commit_sha: sha,
      }
    );

    if (prs.length === 0) {
      // Get commit info for commits without PRs
      const commitInfo = await git.show(["-s", "--format=%h %ai %an: %s", sha]);
      return { sha, commitInfo: commitInfo.trim(), prs: [] };
    }

    // Filter out dependabot and return PR details
    const validPRs = prs.filter(
      (pr) =>
        pr.user.login !== "dependabot" && pr.user.login !== "dependabot[bot]"
    );

    return { sha, prs: validPRs };
  } catch (error) {
    console.error(`Error fetching PR for commit ${sha}:`, error.message);
    return { sha, prs: [], error: true };
  }
}

async function fetchAllPRs(commits, git) {
  const spinner = ora("Fetching PR associations...").start();
  const prCache = new Map();
  const commitsWithoutPRs = [];
  let processed = 0;
  let dependabotSkipped = 0;

  // Create a limited concurrent processor
  const limit = pLimit(PARALLEL_LIMIT);

  // Check initial rate limit
  const remaining = await checkRateLimit();
  if (remaining < RATE_LIMIT_THRESHOLD) {
    console.warn(`⚠️  Low API rate limit: ${remaining} remaining`);
  }

  // Process all commits with concurrency limit
  const results = await Promise.all(
    commits.map((sha) =>
      limit(async () => {
        const result = await fetchPRForCommit(sha, git);
        processed++;

        // Update progress
        const percentage = Math.round((processed / commits.length) * 100);
        spinner.text = `Fetching PR associations... ${processed}/${commits.length} (${percentage}%) - Found ${prCache.size} unique PRs`;

        // Process results
        if (result.commitInfo) {
          commitsWithoutPRs.push(result);
        } else {
          for (const pr of result.prs) {
            if (!prCache.has(pr.number)) {
              // Check for dependabot
              if (
                pr.user.login === "dependabot" ||
                pr.user.login === "dependabot[bot]"
              ) {
                dependabotSkipped++;
              } else {
                prCache.set(pr.number, {
                  number: pr.number,
                  title: pr.title,
                  mergedAt: pr.merged_at,
                  author: { login: pr.user.login },
                  labels: { nodes: pr.labels.map((l) => ({ name: l.name })) },
                });
              }
            }
          }
        }

        return result;
      })
    )
  );

  spinner.succeed(
    `Fetched ${prCache.size} unique PRs (${dependabotSkipped} dependabot PRs skipped)`
  );

  // Report commits without PRs
  if (commitsWithoutPRs.length > 0) {
    console.log(
      `\nFound ${commitsWithoutPRs.length} commits without associated PRs:`
    );
    commitsWithoutPRs.forEach((commit, i) => {
      console.log(`  ${i + 1}. ${commit.commitInfo}`);
      console.log(`     SHA: ${commit.sha}`);
    });
  }

  return Array.from(prCache.values());
}

function categorizePRs(prs) {
  const categories = {
    features: [],
    bugs: [],
    refactor: [],
    other: [],
    backported_features: [],
    backported_bugs: [],
    backported_refactor: [],
    backported_other: [],
  };

  for (const pr of prs) {
    const labels = pr.labels.nodes.map((n) => n.name);
    // Check if backported either by manual list or by "v3 port complete" label
    const isBackported = labels.includes("v3 port complete");
    const category = isBackported ? "backported_" : "";

    // Add breaking change flag
    if (BREAKING_CHANGES.has(pr.number)) {
      pr.isBreaking = true;
    }

    if (labels.includes("feature")) {
      categories[`${category}features`].push(pr);
    } else if (labels.includes("bug")) {
      categories[`${category}bugs`].push(pr);
    } else if (labels.includes("refactor")) {
      categories[`${category}refactor`].push(pr);
    } else {
      categories[`${category}other`].push(pr);
    }
  }

  return categories;
}

function formatPRRow(pr) {
  const date = pr.mergedAt ? pr.mergedAt.split("T")[0] : "unknown";
  const author = pr.author.login || "unknown";
  let title = pr.title;

  if (pr.isBreaking) {
    title = `<span class="breaking">BREAKING CHANGE:</span> ${title}`;
  }

  return `| #${pr.number} | ${date} | ${author} | ${title} |`;
}

function sortByDate(prs) {
  return prs.sort((a, b) => new Date(b.mergedAt) - new Date(a.mergedAt));
}

function generateMarkdown(categories, totalPRs) {
  const backportedCount =
    categories.backported_features.length +
    categories.backported_bugs.length +
    categories.backported_refactor.length +
    categories.backported_other.length;

  const v4OnlyCount = totalPRs - backportedCount;

  let output = `---
sidebar_position: 2
sidebar_label: Full Changelog
---

# Helm 4 Full Changelog

**Scope**: ${totalPRs} PRs from (\`${HEAD_REF}\`) compared to \`${BASE_REF}\`
**v4-only**: ${v4OnlyCount} PRs (${backportedCount} backported to v3 excluded)

See the [Overview](/overview.md) for an actionable summary of these changes.

`;

  // New Features
  if (categories.features.length > 0) {
    output += `## New Features

New features in Helm 4 that were not backported to v3

| PR | Date | Author | Title |
|---|---|---|---|
${sortByDate(categories.features).map(formatPRRow).join("\n")}

`;
  }

  // Bug Fixes
  if (categories.bugs.length > 0) {
    output += `## Bug Fixes

Fixes in Helm 4 that were not backported to v3

| PR | Date | Author | Title |
|---|---|---|---|
${sortByDate(categories.bugs).map(formatPRRow).join("\n")}

`;
  }

  // Refactor/Cleanup
  if (categories.refactor.length > 0) {
    output += `## Refactor/Cleanup

Code quality improvements and modernization

| PR | Date | Author | Title |
|---|---|---|---|
${sortByDate(categories.refactor).map(formatPRRow).join("\n")}

`;
  }

  // Other
  if (categories.other.length > 0) {
    output += `## Other

Infrastructure and project management improvements

| PR | Date | Author | Title |
|---|---|---|---|
${sortByDate(categories.other).map(formatPRRow).join("\n")}

`;
  }

  // Backported section
  output += `## v4 Changes Also Backported to v3

These PRs were included in v4 but were also backported to v3 releases

`;

  if (categories.backported_features.length > 0) {
    output += `### New Features (Backported)

| PR | Date | Author | Title |
|---|---|---|---|
${sortByDate(categories.backported_features).map(formatPRRow).join("\n")}

`;
  }

  if (categories.backported_bugs.length > 0) {
    output += `### Bug Fixes (Backported)

| PR | Date | Author | Title |
|---|---|---|---|
${sortByDate(categories.backported_bugs).map(formatPRRow).join("\n")}

`;
  }

  if (categories.backported_refactor.length > 0) {
    output += `### Refactor/Cleanup (Backported)

| PR | Date | Author | Title |
|---|---|---|---|
${sortByDate(categories.backported_refactor).map(formatPRRow).join("\n")}

`;
  }

  if (categories.backported_other.length > 0) {
    output += `### Other (Backported)

| PR | Date | Author | Title |
|---|---|---|---|
${sortByDate(categories.backported_other).map(formatPRRow).join("\n")}

`;
  }

  return output;
}

async function main() {
  console.log("===============================================");
  console.log("Generating changelog with Node.js (ESM)");
  console.log(`Base: ${BASE_REF}`);
  console.log(`Head: ${HEAD_REF}`);
  console.log("===============================================\n");

  const startTime = Date.now();

  try {
    // Step 1: Setup helm repository
    const git = await setupHelmRepo();

    // Step 2: Get commits
    const commits = await getCommits(git);

    // Step 3: Fetch all PRs in parallel
    const prs = await fetchAllPRs(commits, git);

    // Step 4: Categorize PRs
    const spinner = ora("Categorizing PRs...").start();
    const categories = categorizePRs(prs);
    spinner.succeed("PRs categorized");

    // Step 5: Generate markdown
    spinner.text = "Generating markdown...";
    const markdown = generateMarkdown(categories, prs.length);

    // Step 6: Write to file
    fs.writeFileSync(OUTPUT_FILE, markdown);
    spinner.succeed(`Changelog written to ${OUTPUT_FILE}`);

    // Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log("\n✅ Complete!");
    console.log(`Total time: ${elapsed} seconds`);
    console.log(`Total PRs: ${prs.length}`);

    const backportedCount =
      categories.backported_features.length +
      categories.backported_bugs.length +
      categories.backported_refactor.length +
      categories.backported_other.length;

    console.log(`v4-only PRs: ${prs.length - backportedCount}`);
    console.log(`Backported PRs: ${backportedCount}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
main();
