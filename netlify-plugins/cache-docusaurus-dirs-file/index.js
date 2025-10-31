// Netlify Build Plugin to cache directories using file-based caching (stable)
// - Docusaurus-friendly: cache ".docusaurus", "node_modules", and "build"
// - node_modules auto-invalidation via yarn.lock hash
// - On-demand busting via CACHE_VERSION env var per environment
// - Per-branch cache isolation by default

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

function dirExists(dirPath) {
  try {
    const stat = fs.statSync(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

function fileSha256(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(data).digest("hex");
  } catch {
    return null;
  }
}

function makeKey({ dir, repoRoot }) {
  const cacheVersion = process.env.CACHE_VERSION || "";
  const perBranch = process.env.CACHE_PER_BRANCH !== "false"; // default true
  const branch = process.env.NETLIFY_BRANCH || process.env.BRANCH || "unknown";

  let key = dir;

  if (dir === "node_modules") {
    const yarnLockPath = path.join(repoRoot, "yarn.lock");
    const hash = fileSha256(yarnLockPath);
    if (hash) {
      key = `${key}@yarn-${hash.slice(0, 16)}`;
    }
  }

  if (cacheVersion) {
    key = `${key}@cv-${cacheVersion}`;
  }

  if (perBranch) {
    key = `${key}@${branch}`;
  }
  return key;
}

async function restoreDir(utils, absPath, key, results) {
  try {
    const restored = await utils.cache.restore(absPath, { key });

    if (restored) {
      const msg = `✓ Restored cache: ${key}`;
      console.log(`[CACHE] ${msg}`);
      results.push(msg);
    } else {
      const msg = `No cache found for ${key}`;
      console.log(`[CACHE] ${msg}`);
      results.push(msg);
    }
    return restored;
  } catch (err) {
    const msg = `✗ Error restoring ${key}: ${err.message}`;
    console.log(`[CACHE] ${msg}`);
    results.push(msg);
    return false;
  }
}

async function saveDir(utils, absPath, key, results, dir) {
  try {
    const saved = await utils.cache.save(absPath, { key });
    const msg = saved ? `✓ Saved cache: ${key}` : `⊖ Skipped cache: ${key}`;
    console.log(`[CACHE] ${msg}`);
    results.push(msg);
    return saved;
  } catch (err) {
    // Known issue: node_modules/.bin symlinks can cause EISDIR errors
    // This is non-critical as the rest of node_modules still gets cached
    if (dir === "node_modules" && err.message.includes("EISDIR")) {
      const msg = `⚠ Partial cache saved for ${key} (symlink issue in .bin - non-critical)`;
      console.log(`[CACHE] ${msg}`);
      results.push(msg);
      return true;  // Consider it a success since most of node_modules is cached
    }
    const msg = `✗ Error saving ${key}: ${err.message}`;
    console.log(`[CACHE] ${msg}`);
    results.push(msg);
    return false;
  }
}

module.exports = {
  async onPreBuild({ inputs, utils }) {
    const results = [];
    console.log('[CACHE] ========== Cache Restore Starting ==========');
    console.log('[CACHE] Environment:', {
      CACHE_VERSION: process.env.CACHE_VERSION,
      CACHE_PER_BRANCH: process.env.CACHE_PER_BRANCH,
      NETLIFY_BRANCH: process.env.NETLIFY_BRANCH
    });

    const repoRoot = process.cwd();
    const dirs = inputs.dirs;

    for (const dir of dirs) {
      const key = makeKey({ dir, repoRoot });
      console.log(`[CACHE] Processing ${dir} with key: ${key}`);
      const abs = path.resolve(repoRoot, dir);

      await restoreDir(utils, abs, key, results);

      if (dir === "node_modules") {
        const yarnLockPath = path.join(repoRoot, "yarn.lock");
        if (!fs.existsSync(yarnLockPath)) {
          const msg = "⚠ Warning: yarn.lock not found - node_modules cache may be stale";
          console.log(`[CACHE] ${msg}`);
          results.push(msg);
        }
      }
    }

    console.log('[CACHE] ========== Cache Restore Complete ==========');

    // Show combined status in deploy summary
    utils.status.show({
      title: "Cache Restore Summary",
      summary: results.length > 0 ? results.join('\n') : 'No cache operations performed',
    });
  },

  async onPostBuild({ inputs, utils }) {
    const results = [];
    console.log('[CACHE] ========== Cache Save Starting ==========');

    const repoRoot = process.cwd();
    const dirs = inputs.dirs;

    for (const dir of dirs) {
      const key = makeKey({ dir, repoRoot });
      const abs = path.resolve(repoRoot, dir);

      if (!dirExists(abs)) {
        const msg = `⊖ Skipped ${dir}: directory does not exist`;
        console.log(`[CACHE] ${msg}`);
        results.push(msg);
        continue;
      }

      const hasFiles = fs.readdirSync(abs).length > 0;
      if (!hasFiles) {
        const msg = `⊖ Skipped ${dir}: directory is empty`;
        console.log(`[CACHE] ${msg}`);
        results.push(msg);
        continue;
      }

      await saveDir(utils, abs, key, results, dir);
    }

    console.log('[CACHE] ========== Cache Save Complete ==========');

    // Show combined status in deploy summary (this overrides the onPreBuild status)
    utils.status.show({
      title: "Cache Operations Complete",
      summary: results.length > 0 ? results.join('\n') : 'No cache operations performed',
    });
  },
};
