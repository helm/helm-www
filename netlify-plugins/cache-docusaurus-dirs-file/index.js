// Netlify Build Plugin to cache directories using file-based caching (stable)
// - Docusaurus-friendly: cache ".docusaurus", "node_modules", and "build"
// - node_modules auto-invalidation via package-lock.json hash
// - On-demand busting via CACHE_VERSION env var per environment
// - Per-branch cache isolation by default

const path = require("path");
const fs = require("fs");

function dirExists(dirPath) {
  try {
    const stat = fs.statSync(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

// @netlify/cache-utils has no concept of an arbitrary cache "key": a cached
// entry's identity is just the path being cached, resolved under `cacheDir`
// (which defaults to, and must stay inside, `.netlify/cache/` - that's the
// directory Netlify's build image actually persists between builds). So
// cache-version busting and per-branch isolation have to be expressed as a
// nested `cacheDir`, not as a suffix on a lookup key.
function getCacheOpts({ repoRoot }) {
  const cacheVersion = process.env.CACHE_VERSION || "default";
  const perBranch = process.env.CACHE_PER_BRANCH !== "false"; // default true
  const branch = perBranch
    ? process.env.NETLIFY_BRANCH || process.env.BRANCH || "unknown"
    : "shared";

  return {
    cwd: repoRoot,
    cacheDir: path.join(".netlify", "cache", branch, cacheVersion),
  };
}

async function restoreDir(utils, absPath, dir, cacheOpts) {
  try {
    const cacheExists = await utils.cache.has(absPath, cacheOpts);
    if (!cacheExists) {
      utils.status.show({
        title: `No cache: ${dir}`,
        summary: `No prior cache for ${absPath}`,
      });
      return false;
    }

    const restored = await utils.cache.restore(absPath, cacheOpts);
    utils.status.show({
      title: restored ? `Cache restored: ${dir}` : `Cache restore failed: ${dir}`,
      summary: `${restored ? "Restored" : "Failed to restore"} ${absPath}`,
    });
    return restored;
  } catch (err) {
    utils.status.show({
      title: `Cache restore failed: ${dir}`,
      summary: err.message,
    });
    return false;
  }
}

async function saveDir(utils, absPath, dir, cacheOpts) {
  try {
    const saved = await utils.cache.save(absPath, cacheOpts);
    utils.status.show({
      title: saved ? `Cache saved: ${dir}` : `Cache skipped: ${dir}`,
      summary: `${saved ? "Saved" : "Skipped"} from ${absPath}`,
    });
    return saved;
  } catch (err) {
    utils.status.show({
      title: `Cache save failed: ${dir}`,
      summary: err.message,
    });
    return false;
  }
}

module.exports = {
  async onPreBuild({ inputs, utils }) {
    const repoRoot = process.cwd();
    const dirs = inputs.dirs;
    const cacheOpts = getCacheOpts({ repoRoot });

    for (const dir of dirs) {
      const abs = path.resolve(repoRoot, dir);

      await restoreDir(utils, abs, dir, cacheOpts);

      // Guidance for node_modules: ensure package-lock.json exists to keep cache fresh
      if (dir === "node_modules") {
        const packageLockPath = path.join(repoRoot, "package-lock.json");
        if (!fs.existsSync(packageLockPath)) {
          utils.status.show({
            title: "node_modules cache warning",
            summary:
              "package-lock.json not found. Caching node_modules without package-lock.json can lead to stale dependencies. Ensure package-lock.json is committed.",
          });
        }
      }
    }
  },

  async onPostBuild({ inputs, utils }) {
    const repoRoot = process.cwd();
    const dirs = inputs.dirs;
    const cacheOpts = getCacheOpts({ repoRoot });

    for (const dir of dirs) {
      const abs = path.resolve(repoRoot, dir);

      if (!dirExists(abs)) {
        utils.status.show({
          title: `Cache not saved (missing directory)`,
          summary: `${abs} does not exist.`,
        });
        continue;
      }

      const hasFiles = fs.readdirSync(abs).length > 0;
      if (!hasFiles) {
        utils.status.show({
          title: `Cache not saved (empty directory)`,
          summary: `${abs} is empty.`,
        });
        continue;
      }

      // package-lock.json is a digest file for node_modules: cache-utils
      // uses it to skip re-saving when dependencies haven't changed.
      const saveOpts =
        dir === "node_modules"
          ? { ...cacheOpts, digests: [path.join(repoRoot, "package-lock.json")] }
          : cacheOpts;

      await saveDir(utils, abs, dir, saveOpts);
    }
  },
};
