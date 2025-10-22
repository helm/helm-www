#!/usr/bin/env node

const yaml = require('js-yaml');

/**
 * Parse frontmatter from content, returning both the YAML data and the rest of the content
 * @param {string} content - File content
 * @returns {Object} - { frontmatter: Object, restContent: string, hasFrontmatter: boolean }
 */
function frontMatterFromYaml(content) {
  const lines = content.split('\n');

  // Find frontmatter boundaries
  let frontmatterStart = -1;
  let frontmatterEnd = -1;
  let dashCount = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      dashCount++;
      if (dashCount === 1) {
        frontmatterStart = i;
      } else if (dashCount === 2) {
        frontmatterEnd = i;
        break;
      }
    }
  }

  if (frontmatterStart === -1 || frontmatterEnd === -1) {
    // No frontmatter found
    return {
      frontmatter: {},
      restContent: content,
      hasFrontmatter: false
    };
  }

  const frontmatterText = lines.slice(frontmatterStart + 1, frontmatterEnd).join('\n');
  const restContent = lines.slice(frontmatterEnd + 1).join('\n');

  try {
    const frontmatter = yaml.load(frontmatterText) || {};
    return {
      frontmatter,
      restContent,
      hasFrontmatter: true
    };
  } catch (error) {
    console.error('    ❌ Error parsing YAML frontmatter:', error.message);
    return {
      frontmatter: {},
      restContent: content,
      hasFrontmatter: false
    };
  }
}

/**
 * Convert YAML data back to frontmatter content
 * @param {Object} frontmatter - YAML data object
 * @param {string} restContent - The rest of the content after frontmatter
 * @returns {string} - Complete content with frontmatter
 */
function frontMatterToYaml(frontmatter, restContent) {
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    // No frontmatter to add, return just the content
    return restContent;
  }

  const frontmatterYaml = yaml.dump(frontmatter, {
    indent: 2,
    lineWidth: 120,
    quotingType: '"',
    forceQuotes: false
  }).trim();

  return `---\n${frontmatterYaml}\n---\n${restContent}`;
}

module.exports = {
  frontMatterFromYaml,
  frontMatterToYaml
};
