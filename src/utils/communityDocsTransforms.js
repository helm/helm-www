const path = require("path");
const yaml = require("js-yaml");

// Parse existing frontmatter and content
function parseFrontMatterAndContent(rawContent) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = rawContent.match(frontMatterRegex);

  if (match) {
    const frontMatterStr = match[1];
    const content = match[2];

    try {
      // Use js-yaml to parse frontmatter properly
      const frontMatter = yaml.load(frontMatterStr) || {};
      return { frontMatter, content };
    } catch (e) {
      console.warn(`Failed to parse frontmatter YAML: ${e.message}`);
      return { frontMatter: {}, content: rawContent };
    }
  }

  return { frontMatter: {}, content: rawContent };
}

// Extract H1 title from content
function extractH1Title(content) {
  const h1Match = content.match(/^\s*#\s+([^\n]+)\n/);
  return h1Match ? h1Match[1].trim() : null;
}

// Remove H1 from content (including the newline)
function stripH1(content) {
  // This removes the H1 and its trailing newline, but preserves any blank lines after it
  return content.replace(/^\s*#\s+[^\n]+\n/, "");
}

// Build front matter from merged meta
function buildFrontMatter(meta) {
  if (!meta || Object.keys(meta).length === 0) return "";

  // Filter out null/empty values
  const cleanMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    if (value != null && value !== "") {
      cleanMeta[key] = value;
    }
  }

  if (Object.keys(cleanMeta).length === 0) return "";

  // Use js-yaml to properly dump the frontmatter
  // This handles special characters, arrays, etc. correctly
  const yamlStr = yaml.dump(cleanMeta, {
    lineWidth: -1, // Don't wrap long lines
    quotingType: '"', // Use double quotes when needed
    forceQuotes: false, // Only quote when necessary
  });

  return `---\n${yamlStr}---\n\n`;
}

// Resolve relative link target against current file
function resolveCanonicalTargetPath(currentFilePath, hrefPath) {
  const currentDir = path.posix.dirname(currentFilePath);
  return path.posix.normalize(path.posix.join(currentDir, hrefPath));
}

// Helper to process a link href (used by both inline and reference links)
function processLinkHref(filename, href, linkExceptions, slugByPath) {
  // Don't process anchors or mailto
  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }

  const m = href.match(/^([^?#]+)(\?[^#]*)?(#.*)?$/);
  if (!m) return href;
  const [, pathPart, queryPart = "", hashPart = ""] = m;

  // Check file-specific exceptions (works for both absolute and relative URLs)
  const fileExceptions = linkExceptions[filename];
  if (
    fileExceptions &&
    Object.prototype.hasOwnProperty.call(fileExceptions, pathPart)
  ) {
    const forced = fileExceptions[pathPart];
    return `${forced}${queryPart}${hashPart}`;
  }

  // Otherwise, return the link as-is (don't strip .md or transform paths)
  // Since we're keeping the same file structure, internal links should just work
  return href;
}

// Rewrite relative markdown links using exceptions/slug when available, otherwise strip .md/.mdx
function rewriteMarkdownLinks(filename, content, linkExceptions, slugByPath) {
  // First, handle inline links: [text](url)
  const inlineLinkRe = /!?\[([^\]]+)\]\(([^)\s]+(?:\s+"[^"]*")?)\)/g;

  content = content.replace(inlineLinkRe, (full, text, hrefRaw) => {
    if (full.startsWith("!")) return full; // image

    const mTitle = hrefRaw.match(/^([^\s]+)(?:\s+"[^"]*")?$/);
    const href = mTitle ? mTitle[1] : hrefRaw;

    const processedHref = processLinkHref(filename, href, linkExceptions, slugByPath);

    // Reconstruct with title if present
    if (mTitle && mTitle[0] !== mTitle[1]) {
      const title = mTitle[0].substring(mTitle[1].length);
      return `[${text}](${processedHref}${title})`;
    }
    return `[${text}](${processedHref})`;
  });

  // Handle angle-bracket links: <http://example.com>
  const angleBracketLinkRe = /<(https?:\/\/[^>]+)>/g;

  content = content.replace(angleBracketLinkRe, (full, url) => {
    const processedUrl = processLinkHref(filename, url, linkExceptions, slugByPath);
    // If the URL was transformed, convert to markdown link format
    if (processedUrl !== url && !processedUrl.startsWith('http')) {
      return `[${processedUrl}](${processedUrl})`;
    }
    return `<${processedUrl}>`;
  });

  // Then, handle reference link definitions: [ref]: url
  const refLinkDefRe = /^\[([^\]]+)\]:\s*(.+)$/gm;

  content = content.replace(refLinkDefRe, (full, ref, url) => {
    // Process the URL part (handle angle brackets in reference definitions too)
    let cleanUrl = url.trim();
    let isAngleBracket = false;

    if (cleanUrl.startsWith('<') && cleanUrl.endsWith('>')) {
      cleanUrl = cleanUrl.slice(1, -1);
      isAngleBracket = true;
    }

    const processedUrl = processLinkHref(filename, cleanUrl, linkExceptions, slugByPath);

    // Preserve angle brackets if they were there and URL wasn't transformed to internal link
    if (isAngleBracket && processedUrl.startsWith('http')) {
      return `[${ref}]: <${processedUrl}>`;
    }
    return `[${ref}]: ${processedUrl}`;
  });

  return content;
}

// Add import notice header
function addImportNotice(filename) {
  const sourceUrl = `https://github.com/helm/community/blob/main/${filename}`;

  return `<!--
THIS FILE IS AUTOMATICALLY IMPORTED FROM THE HELM/COMMUNITY REPOSITORY
DO NOT EDIT THIS FILE DIRECTLY - IT WILL BE OVERWRITTEN

TO MAKE CHANGES:
- Edit the source file at: ${sourceUrl}
-->
`;
}

// Format HIP sidebar_label with number prefix
function formatHipSidebarLabel(meta, originalFrontmatter, filename) {
  // Check if this is a HIP file (has hip field in original frontmatter)
  const isHip = filename.startsWith('hips/') && originalFrontmatter && originalFrontmatter.hip;

  if (isHip && originalFrontmatter.hip && meta.title) {
    // Format hip number with leading zeros (4 digits)
    const hipNum = String(originalFrontmatter.hip).padStart(4, '0');
    // Add sidebar_label with HIP number prefix
    meta.sidebar_label = `${hipNum}: ${meta.title}`;
  }

  return meta;
}

// Create markdown table from HIP frontmatter
function createHipFrontmatterTable(originalFrontmatter, filename) {
  // Only create table for HIP files
  if (!filename.startsWith('hips/') || !originalFrontmatter.hip) {
    return '';
  }

  // Define which fields to show and their display names
  // Order matches HIP-0001 specification
  const hipFields = [
    { key: 'hip', label: 'HIP' },
    { key: 'title', label: 'Title' },
    { key: 'authors', label: 'Author(s)' },
    { key: 'created', label: 'Created' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'helm-version', label: 'Helm Version' },  // optional
    { key: 'requires', label: 'Requires' },  // optional
    { key: 'replaces', label: 'Replaces' },  // optional
    { key: 'superseded-by', label: 'Superseded by' },  // optional
  ];

  // Collect fields that have values
  const fieldsWithValues = [];
  const values = [];

  for (const field of hipFields) {
    const value = originalFrontmatter[field.key];
    if (value !== undefined && value !== null && value !== '') {
      fieldsWithValues.push(field);

      let displayValue;
      // Handle arrays (like authors)
      if (Array.isArray(value)) {
        displayValue = value.join(', ');
      } else {
        displayValue = String(value);
      }

      // Escape pipe characters in values
      displayValue = displayValue.replace(/\|/g, '\\|');
      values.push(displayValue);
    }
  }

  if (fieldsWithValues.length === 0) {
    return '';
  }

  // Build header row with field names
  const headerRow = '| ' + fieldsWithValues.map(f => `**${f.label}**`).join(' | ') + ' |';

  // Build separator row with correct number of columns
  const separatorRow = '|' + fieldsWithValues.map(() => '---').join('|') + '|';

  // Build data row with values
  const dataRow = '| ' + values.join(' | ') + ' |';

  return '\n' + headerRow + '\n' + separatorRow + '\n' + dataRow + '\n\n';
}

// Extract title from .txt file (handles both Markdown and underline-style headers)
function extractTxtTitle(content) {
  // First try markdown-style H1
  const h1Match = content.match(/^\s*#\s+([^\n]+)\n/);
  if (h1Match) return { title: h1Match[1].trim(), contentWithoutTitle: content.replace(/^\s*#\s+[^\n]+\n/, "") };

  // Then try underline-style header (text followed by ===)
  const underlineMatch = content.match(/^\s*([^\n]+)\n=+\n/);
  if (underlineMatch) {
    return {
      title: underlineMatch[1].trim(),
      contentWithoutTitle: content.replace(/^\s*[^\n]+\n=+\n/, "")
    };
  }

  return { title: null, contentWithoutTitle: content };
}

// Compose transforms per file
function transformImportedContent(filename, rawContent, metaByPath, slugByPath, linkExceptions) {
  // Store original filename for link processing
  const originalFilename = filename;

  // Initialize variables
  let newFilename = filename;
  let extractedMeta = {};
  let existingFrontMatter = {};
  let bodyContent = rawContent;
  let originalFrontmatter = {};

  // Handle different file types
  const isTxtFile = filename.endsWith('.txt');
  const isYamlFile = filename.endsWith(".yaml");

  if (isTxtFile) {
    // Extract title from txt content
    const { title, contentWithoutTitle } = extractTxtTitle(rawContent);
    if (title) {
      extractedMeta.title = title;
    }
    // Wrap in code block for final output
    bodyContent = `\n\`\`\`txt\n${contentWithoutTitle.trim()}\n\`\`\`\n`;
    newFilename = filename.replace(/\.txt$/, ".md");
  } else if (isYamlFile) {
    // Wrap in code block for final output
    bodyContent = `\n\`\`\`yaml\n${rawContent.trim()}\n\`\`\`\n`;
    newFilename = filename.replace(/\.yaml$/, ".md");
  } else {
    // Process markdown files
    const parsed = parseFrontMatterAndContent(rawContent);
    existingFrontMatter = parsed.frontMatter;
    bodyContent = parsed.content;
    originalFrontmatter = { ...existingFrontMatter };

    // Extract and remove H1 title
    const h1Title = extractH1Title(bodyContent);
    bodyContent = stripH1(bodyContent);

    // Add H1 as title if no meta title exists
    if (h1Title && !existingFrontMatter.title) {
      extractedMeta.title = h1Title;
    }

    // Rewrite links for markdown files
    bodyContent = rewriteMarkdownLinks(originalFilename, bodyContent, linkExceptions, slugByPath);
  }

  // Build merged metadata
  let mergedMeta;
  let hipTable = '';

  // Check if this is a HIP (has hip field in frontmatter)
  const isHip = existingFrontMatter.hip;

  if (isHip) {
    // Define HIP-specific fields to filter out
    const hipSpecificFields = [
      "hip",
      "authors",
      "created",
      "type",
      "status",
      "helm-version",
      "requires",
      "replaces",
      "superseded-by",
    ];

    // For HIPs, filter out HIP-specific fields from frontmatter
    const filteredExisting = {};
    for (const [key, value] of Object.entries(existingFrontMatter)) {
      if (!hipSpecificFields.includes(key)) {
        filteredExisting[key] = value;
      }
    }
    mergedMeta = {
      ...filteredExisting,
      ...extractedMeta,
      ...(metaByPath[filename] || {}),
    };

    // Apply HIP-specific sidebar_label formatting
    formatHipSidebarLabel(mergedMeta, originalFrontmatter, filename);

    // Create HIP frontmatter table
    hipTable = createHipFrontmatterTable(originalFrontmatter, filename);
  } else {
    // For non-HIPs, merge everything
    mergedMeta = {
      ...existingFrontMatter,
      ...extractedMeta,
      ...(metaByPath[filename] || {}),
    };
  }

  // Build frontmatter
  const fm = buildFrontMatter(mergedMeta);

  // Add import notice
  const importNotice = addImportNotice(filename);

  // Compose final content
  const content = `${fm}${importNotice}${hipTable}${bodyContent}`;

  // Return transformed content
  return { content, filename: newFilename };
}

module.exports = {
  parseFrontMatterAndContent,
  extractH1Title,
  stripH1,
  buildFrontMatter,
  resolveCanonicalTargetPath,
  rewriteMarkdownLinks,
  transformImportedContent,
};
