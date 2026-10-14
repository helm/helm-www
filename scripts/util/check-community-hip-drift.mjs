#!/usr/bin/env node
/**
 * Guards the "Update Community Documentation" workflow against its most common
 * failure mode: the auto-imported `hips/README.md` links to a HIP that upstream
 * has added, but that HIP is not in the hand-maintained download allowlist in
 * `remote-content_community.js`. The file is therefore never downloaded, and the
 * production build fails under `onBrokenLinks: "throw"` on a dangling link.
 *
 * Exit codes:
 *   0 - config is in sync with upstream
 *   1 - drift detected (HIPs referenced upstream but missing from config)
 *   2 - could not reach upstream / unexpected error
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = resolve(__dirname, "../../remote-content_community.js");
const UPSTREAM_README =
  "https://raw.githubusercontent.com/helm/community/refs/heads/main/hips/README.md";

async function referencedUpstream() {
  const res = await fetch(UPSTREAM_README);
  if (!res.ok) {
    throw new Error(`Upstream README fetch failed: HTTP ${res.status}`);
  }
  const body = await res.text();
  // The README links each HIP as a relative markdown link: [..](hip-XXXX.md)
  const refs = [...body.matchAll(/\(hip-(\d{4})\.md\)/g)].map(
    (m) => `hip-${m[1]}`
  );
  return new Set(refs);
}

function configuredHips() {
  const src = readFileSync(CONFIG_PATH, "utf8");
  // Match the keys like "hips/hip-XXXX.md"
  const keys = [...src.matchAll(/["']hips\/hip-(\d{4})\.md["']/g)].map(
    (m) => `hip-${m[1]}`
  );
  return new Set(keys);
}

async function main() {
  const upstream = await referencedUpstream();
  const configured = configuredHips();

  const missing = [...upstream].filter((h) => !configured.has(h)).sort();
  const stale = [...configured].filter((h) => !upstream.has(h)).sort();

  if (stale.length) {
    // Not fatal: a HIP file can exist upstream while no longer being linked from
    // the README. It still downloads fine and won't break the build.
    console.warn(
      `::warning::Community HIPs in config but no longer linked upstream (safe to prune): ${stale.join(
        ", "
      )}`
    );
  }

  if (missing.length === 0) {
    console.log(
      `community HIP allowlist is in sync with upstream (${upstream.size} HIPs).`
    );
    return;
  }

  const snippet = missing.map((h) => `    "hips/${h}.md": {},`).join("\n");
  console.error(
    [
      "::error::Community HIP allowlist is out of date with helm/community.",
      "",
      `The imported hips/README.md links to ${missing.length} HIP(s) that are not in`,
      "remote-content_community.js, so they will not be downloaded and the build",
      'will fail under onBrokenLinks: "throw".',
      "",
      `Missing: ${missing.join(", ")}`,
      "",
      "Add the following entries to the `files` map in remote-content_community.js:",
      "",
      snippet,
      "",
    ].join("\n")
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(`::error::HIP drift check could not complete: ${err.message}`);
  process.exit(2);
});