/**
 * Helper functions for processing community documentation configuration
 */

/**
 * @typedef {Object} ProcessedConfig
 * @property {string} sourceBaseUrl - Base URL for fetching remote content
 * @property {string[]} documents - Array of document paths to fetch
 * @property {Object.<string, Object>} metaByPath - Metadata indexed by file path
 * @property {Object.<string, string>} slugByPath - Slug mappings indexed by file path
 * @property {Object.<string, Object.<string, string>>} linkExceptions - Link transformations indexed by file path
 */

/**
 * Converts the simplified community config to the format needed by docusaurus-plugin-remote-content
 * @param {Object} config - The community docs configuration
 * @param {string} config.sourceBaseUrl - Base URL for remote content
 * @param {string} config.sourceRepo - GitHub repository URL
 * @param {Object.<string, {meta?: Object, links?: Object}>} config.files - File configurations
 * @returns {ProcessedConfig} Configuration for docusaurus-plugin-remote-content
 */
function processConfig(config) {
  const { sourceBaseUrl, files } = config;

  // Extract file paths
  const remoteDocPaths = Object.keys(files);

  // Build metadata and link mappings
  const metaByPath = {};
  const linkExceptions = {};

  for (const [filename, fileConfig] of Object.entries(files)) {
    if (fileConfig.meta) {
      metaByPath[filename] = fileConfig.meta;
    }
    if (fileConfig.links) {
      linkExceptions[filename] = fileConfig.links;
    }
  }

  // Build slug mapping (for files with slug in meta)
  const slugByPath = {};
  for (const [path, meta] of Object.entries(metaByPath)) {
    if (meta.slug) {
      slugByPath[path] = meta.slug;
    }
  }

  return {
    sourceBaseUrl,
    documents: remoteDocPaths,
    metaByPath,
    slugByPath,
    linkExceptions,
  };
}

/**
 * Creates the edit URL function for community docs
 * @param {string} sourceRepo - The GitHub repository URL
 * @returns {Function} Edit URL function for Docusaurus
 */
function createEditUrlFunction(sourceRepo) {
  return function editUrl({ docPath }) {
    // Convert .md back to .txt for meeting notes
    const origPath = docPath.replace(/^meeting-notes\/(\d+)\.md$/, 'meeting-notes/$1.txt');
    return `${sourceRepo}/edit/main/${origPath}`;
  };
}

module.exports = {
  processConfig,
  createEditUrlFunction,
};
