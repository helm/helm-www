#!/usr/bin/env node

import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TRACKING_KEY = 'default_lang_commit';

function usage() {
  console.log(`Usage: yarn check:i18n-drift [options]

Checks localized Markdown files for drift from their default English sources.

Options:
  --locale <code>      Check one locale. Can be repeated or comma-separated.
  --list-untracked     List localized files missing ${TRACKING_KEY}.
  --fail-on-drift      Exit non-zero when tracked files are drifted or invalid.
  --json               Print machine-readable JSON.
  -h, --help           Show this help.
`);
}

function parseArgs(argv) {
  const options = {
    locales: [],
    listUntracked: false,
    failOnDrift: false,
    json: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '--list-untracked') {
      options.listUntracked = true;
    } else if (arg === '--fail-on-drift') {
      options.failOnDrift = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--locale') {
      const value = argv[i + 1];
      if (!value) throw new Error('--locale requires a value');
      options.locales.push(...value.split(',').filter(Boolean));
      i += 1;
    } else if (arg.startsWith('--locale=')) {
      options.locales.push(...arg.slice('--locale='.length).split(',').filter(Boolean));
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.locales = [...new Set(options.locales)];
  return options;
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: options.cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', options.quiet ? 'ignore' : 'pipe'],
  }).trim();
}

function gitStatus(args, cwd) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  return {
    status: result.status ?? 1,
    stderr: result.stderr.trim(),
  };
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function readFrontMatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return {};

  const frontMatter = {};
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') break;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) {
      frontMatter[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  return frontMatter;
}

function localizedSourcePath(relativePath) {
  let match = relativePath.match(
    /^i18n\/([^/]+)\/docusaurus-plugin-content-docs\/(current|version-[^/]+)\/(.+)$/
  );
  if (match) {
    const [, locale, version, docsPath] = match;
    const sourcePath =
      version === 'current'
        ? `docs/${docsPath}`
        : `versioned_docs/${version}/${docsPath}`;
    return { locale, sourcePath };
  }

  match = relativePath.match(
    /^i18n\/([^/]+)\/docusaurus-plugin-content-docs-community\/current\/(.+)$/
  );
  if (match) {
    const [, locale, docsPath] = match;
    return { locale, sourcePath: `community/${docsPath}` };
  }

  match = relativePath.match(/^i18n\/([^/]+)\/docusaurus-plugin-content-blog\/(.+)$/);
  if (match) {
    const [, locale, blogPath] = match;
    return { locale, sourcePath: `blog/${blogPath}` };
  }

  return null;
}

function latestSourceCommit(repoRoot, sourcePath) {
  try {
    return git(['log', '-n', '1', '--format=%H', '--', sourcePath], {
      cwd: repoRoot,
      quiet: true,
    });
  } catch {
    return '';
  }
}

function isCommitKnown(repoRoot, commit) {
  if (!/^[0-9a-fA-F]{7,40}$/.test(commit)) return false;
  const result = gitStatus(['cat-file', '-e', `${commit}^{commit}`], repoRoot);
  return result.status === 0;
}

function didSourceDrift(repoRoot, commit, sourcePath) {
  const result = gitStatus(['diff', '--quiet', `${commit}..HEAD`, '--', sourcePath], repoRoot);
  if (result.status === 0) return false;
  if (result.status === 1) return true;
  throw new Error(result.stderr || `git diff failed for ${sourcePath}`);
}

function classifyFile(repoRoot, absolutePath, options) {
  const relativePath = toPosix(path.relative(repoRoot, absolutePath));
  const source = localizedSourcePath(relativePath);
  if (!source) return null;

  const { locale, sourcePath } = source;
  const sourceAbsolutePath = path.join(repoRoot, ...sourcePath.split('/'));
  const frontMatter = readFrontMatter(absolutePath);
  const trackedCommit = frontMatter[TRACKING_KEY];
  const result = {
    locale,
    file: relativePath,
    source: sourcePath,
    trackedCommit: trackedCommit || '',
    suggestedCommit: '',
    status: 'unknown',
  };

  if (!fs.existsSync(sourceAbsolutePath)) {
    result.status = 'source-missing';
    return result;
  }

  if (!trackedCommit) {
    result.status = 'untracked';
    if (options.listUntracked) {
      result.suggestedCommit = latestSourceCommit(repoRoot, sourcePath);
    }
    return result;
  }

  if (!isCommitKnown(repoRoot, trackedCommit)) {
    result.status = 'invalid-commit';
    result.suggestedCommit = latestSourceCommit(repoRoot, sourcePath);
    return result;
  }

  result.status = didSourceDrift(repoRoot, trackedCommit, sourcePath)
    ? 'drifted'
    : 'in-sync';
  if (result.status === 'drifted') {
    result.suggestedCommit = latestSourceCommit(repoRoot, sourcePath);
  }
  return result;
}

function printText(results, options) {
  const counts = results.reduce((memo, result) => {
    memo[result.status] = (memo[result.status] || 0) + 1;
    return memo;
  }, {});
  const locales = [...new Set(results.map((result) => result.locale))].sort();

  console.log(`Locales checked: ${locales.join(', ') || '(none)'}`);
  console.log(`Localized Markdown files checked: ${results.length}`);
  console.log(`In sync: ${counts['in-sync'] || 0}`);
  console.log(`Drifted: ${counts.drifted || 0}`);
  console.log(`Untracked: ${counts.untracked || 0}`);
  console.log(`Source missing: ${counts['source-missing'] || 0}`);
  console.log(`Invalid commit: ${counts['invalid-commit'] || 0}`);

  const alwaysList = results.filter((result) =>
    ['drifted', 'source-missing', 'invalid-commit'].includes(result.status)
  );
  const listed = options.listUntracked
    ? [...alwaysList, ...results.filter((result) => result.status === 'untracked')]
    : alwaysList;

  if (listed.length === 0) return;

  console.log('');
  for (const result of listed) {
    const suffix = result.suggestedCommit
      ? ` (latest source commit: ${result.suggestedCommit})`
      : '';
    console.log(`${result.status}: ${result.file}`);
    console.log(`  source: ${result.source}${suffix}`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    usage();
    return;
  }

  const repoRoot = git(['rev-parse', '--show-toplevel'], { cwd: process.cwd() });
  const i18nRoot = path.join(repoRoot, 'i18n');
  const locales =
    options.locales.length > 0
      ? options.locales
      : fs
          .readdirSync(i18nRoot, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name);

  const files = locales.flatMap((locale) => walk(path.join(i18nRoot, locale)));
  const results = files
    .map((file) => classifyFile(repoRoot, file, options))
    .filter(Boolean)
    .sort((a, b) => a.file.localeCompare(b.file));

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printText(results, options);
  }

  if (
    options.failOnDrift &&
    results.some((result) =>
      ['drifted', 'source-missing', 'invalid-commit'].includes(result.status)
    )
  ) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
