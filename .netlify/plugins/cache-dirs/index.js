// Netlify Core Build Plugin to cache directories using utils.cache.
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

function makeKey({ rel, baseKey, perBranch, branch, repoRoot }) {
  const cacheVersion = process.env.CACHE_VERSION || "";
  let key = baseKey || rel;

  // Auto-invalidate node_modules with yarn.lock changes
  if (rel === "node_modules") {
    const yarnLockPath = path.join(repoRoot, "yarn.lock");
    const hash = fileSha256(yarnLockPath);
    if (hash) {
      key = `${key}@yarn-${hash.slice(0, 16)}`;
    }
  }

  // On-demand busting
  if (cacheVersion) {
    key = `${key}@cv-${cacheVersion}`;
  }

  // Per-branch isolation
  if (perBranch) {
    key = `${key}@${branch}`;
  }
  return key;
}

async function restoreDir(utils, absPath, key) {
  try {
    const restored = await utils.cache.restore(absPath, { key });
    utils.status.show({
      title: restored ? `Cache restored: ${key}` : `No cache: ${key}`,
      summary: `${restored ? "Restored" : "No prior cache"} into ${absPath}`,
    });
    return restored;
  } catch (err) {
    utils.status.show({
      title: `Cache restore failed: ${key}`,
      summary: err.message,
    });
    return false;
  }
}

async function saveDir(utils, absPath, key) {
  try {
    const saved = await utils.cache.save(absPath, { key });
    utils.status.show({
      title: saved ? `Cache saved: ${key}` : `Cache skipped: ${key}`,
      summary: `${saved ? "Saved" : "Skipped"} from ${absPath}`,
    });
    return saved;
  } catch (err) {
    utils.status.show({
      title: `Cache save failed: ${key}`,
      summary: err.message,
    });
    return false;
  }
}

module.exports = {
  name: "cache-dirs",
  inputs: [
    {
      name: "dir",
      description: "Directory to cache (relative to repo root).",
      required: true,
    },
    {
      name: "key",
      description:
        "Optional stable cache key. Defaults to dir. node_modules appends yarn.lock hash automatically.",
      required: false,
    },
    {
      name: "perBranch",
      description:
        "Append NETLIFY_BRANCH/BRANCH to the cache key to isolate per branch (default true).",
      required: false,
      default: true,
    },
  ],

  async onPreBuild({ inputs, utils }) {
    const repoRoot = process.cwd();
    const rel = inputs.dir;
    const perBranch = inputs.perBranch !== false; // default true
    const branch =
      process.env.NETLIFY_BRANCH || process.env.BRANCH || "unknown";
    const baseKey = inputs.key || rel;
    const key = makeKey({ rel, baseKey, perBranch, branch, repoRoot });
    const abs = path.resolve(repoRoot, rel);

    await restoreDir(utils, abs, key);

    // Guidance for node_modules: ensure yarn.lock exists to keep cache fresh
    if (rel === "node_modules") {
      const yarnLockPath = path.join(repoRoot, "yarn.lock");
      if (!fs.existsSync(yarnLockPath)) {
        utils.status.show({
          title: "node_modules cache warning",
          summary:
            "yarn.lock not found. Caching node_modules without yarn.lock can lead to stale dependencies. Ensure yarn.lock is committed.",
        });
      }
    }
  },

  async onPostBuild({ inputs, utils }) {
    const repoRoot = process.cwd();
    const rel = inputs.dir;
    const perBranch = inputs.perBranch !== false;
    const branch =
      process.env.NETLIFY_BRANCH || process.env.BRANCH || "unknown";
    const baseKey = inputs.key || rel;
    const key = makeKey({ rel, baseKey, perBranch, branch, repoRoot });
    const abs = path.resolve(repoRoot, rel);

    if (!dirExists(abs)) {
      utils.status.show({
        title: `Cache not saved (missing directory)`,
        summary: `${abs} does not exist.`,
      });
      return;
    }

    const hasFiles = fs.readdirSync(abs).length > 0;
    if (!hasFiles) {
      utils.status.show({
        title: `Cache not saved (empty directory)`,
        summary: `${abs} is empty.`,
      });
      return;
    }

    await saveDir(utils, abs, key);
  },
};
