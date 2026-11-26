const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const plugin = require("./index.js");
const cache = require("@netlify/cache-utils");

function makeUtils() {
  return {
    cache,
    status: { show() {} },
  };
}

async function withTempRepo(fn) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "cache-plugin-test-"));
  const prevCwd = process.cwd();
  const savedEnv = {
    CACHE_VERSION: process.env.CACHE_VERSION,
    CACHE_PER_BRANCH: process.env.CACHE_PER_BRANCH,
    NETLIFY_BRANCH: process.env.NETLIFY_BRANCH,
  };
  process.chdir(repoRoot);
  try {
    await fn(repoRoot);
  } finally {
    process.chdir(prevCwd);
    fs.rmSync(repoRoot, { recursive: true, force: true });
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("restores a previously saved directory on the next build", async () => {
  await withTempRepo(async (repoRoot) => {
    // leave CACHE_PER_BRANCH at its real default (true) so this exercises
    // the same per-branch key path production builds actually use
    delete process.env.CACHE_PER_BRANCH;
    delete process.env.CACHE_VERSION;
    process.env.NETLIFY_BRANCH = "main";

    const dir = ".docusaurus";
    fs.mkdirSync(path.join(repoRoot, dir));
    fs.writeFileSync(path.join(repoRoot, dir, "marker.txt"), "first-build");

    const utils = makeUtils();

    // nothing cached yet
    await plugin.onPreBuild({ inputs: { dirs: [dir] }, utils });
    await plugin.onPostBuild({ inputs: { dirs: [dir] }, utils });

    // simulate the next build starting from a clean checkout
    fs.rmSync(path.join(repoRoot, dir), { recursive: true, force: true });
    assert.equal(fs.existsSync(path.join(repoRoot, dir)), false);

    await plugin.onPreBuild({ inputs: { dirs: [dir] }, utils });

    assert.equal(
      fs.readFileSync(path.join(repoRoot, dir, "marker.txt"), "utf8"),
      "first-build",
    );
  });
});

test("keeps per-branch caches isolated", async () => {
  await withTempRepo(async (repoRoot) => {
    process.env.CACHE_PER_BRANCH = "true";
    delete process.env.CACHE_VERSION;

    const dir = "build";
    fs.mkdirSync(path.join(repoRoot, dir));
    fs.writeFileSync(path.join(repoRoot, dir, "marker.txt"), "branch-a");

    const utils = makeUtils();
    process.env.NETLIFY_BRANCH = "branch-a";
    await plugin.onPostBuild({ inputs: { dirs: [dir] }, utils });
    fs.rmSync(path.join(repoRoot, dir), { recursive: true, force: true });

    process.env.NETLIFY_BRANCH = "branch-b";
    await plugin.onPreBuild({ inputs: { dirs: [dir] }, utils });
    assert.equal(
      fs.existsSync(path.join(repoRoot, dir)),
      false,
      "branch-b must not see branch-a's cache",
    );

    process.env.NETLIFY_BRANCH = "branch-a";
    await plugin.onPreBuild({ inputs: { dirs: [dir] }, utils });
    assert.equal(
      fs.readFileSync(path.join(repoRoot, dir, "marker.txt"), "utf8"),
      "branch-a",
    );
  });
});

test("CACHE_VERSION busts the cache even on the same branch", async () => {
  await withTempRepo(async (repoRoot) => {
    process.env.CACHE_PER_BRANCH = "false";

    const dir = "build";
    fs.mkdirSync(path.join(repoRoot, dir));
    fs.writeFileSync(path.join(repoRoot, dir, "marker.txt"), "pre-bust");

    const utils = makeUtils();
    process.env.CACHE_VERSION = "v1";
    await plugin.onPostBuild({ inputs: { dirs: [dir] }, utils });
    fs.rmSync(path.join(repoRoot, dir), { recursive: true, force: true });

    // same version must still restore - proves v1's cache really was saved,
    // so the later v2 miss below is isolation, not just a no-op cache
    await plugin.onPreBuild({ inputs: { dirs: [dir] }, utils });
    assert.equal(
      fs.readFileSync(path.join(repoRoot, dir, "marker.txt"), "utf8"),
      "pre-bust",
      "restoring under the same CACHE_VERSION must return the saved content",
    );
    fs.rmSync(path.join(repoRoot, dir), { recursive: true, force: true });

    process.env.CACHE_VERSION = "v2";
    await plugin.onPreBuild({ inputs: { dirs: [dir] }, utils });
    assert.equal(
      fs.existsSync(path.join(repoRoot, dir)),
      false,
      "a new CACHE_VERSION must not restore the previous version's cache",
    );
  });
});

test("node_modules cache reflects the latest save after package-lock.json changes", async () => {
  await withTempRepo(async (repoRoot) => {
    process.env.CACHE_PER_BRANCH = "false";
    delete process.env.CACHE_VERSION;

    const dir = "node_modules";
    fs.mkdirSync(path.join(repoRoot, dir));
    fs.writeFileSync(path.join(repoRoot, dir, "marker.txt"), "deps-v1");
    fs.writeFileSync(path.join(repoRoot, "package-lock.json"), "lockfile-v1");

    const utils = makeUtils();
    await plugin.onPostBuild({ inputs: { dirs: [dir] }, utils });

    // dependencies changed: lockfile and installed contents both move on
    fs.writeFileSync(path.join(repoRoot, "package-lock.json"), "lockfile-v2");
    fs.writeFileSync(path.join(repoRoot, dir, "marker.txt"), "deps-v2");
    await plugin.onPostBuild({ inputs: { dirs: [dir] }, utils });

    fs.rmSync(path.join(repoRoot, dir), { recursive: true, force: true });
    await plugin.onPreBuild({ inputs: { dirs: [dir] }, utils });

    assert.equal(
      fs.readFileSync(path.join(repoRoot, dir, "marker.txt"), "utf8"),
      "deps-v2",
      "restored cache must reflect the latest save, not a stale one",
    );
  });
});
