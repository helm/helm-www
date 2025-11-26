#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Adds missing redirects to netlify.toml for Hugo frontmatter aliases that were removed
 */
function addNetlifyRedirects() {
  const netlifyTomlPath = path.join(__dirname, '..', '..', 'netlify.toml');
  const removedAliasesPath = path.join(__dirname, 'removed-aliases.json');

  console.log('📝 Adding missing redirects to netlify.toml...');

  // Load removed aliases
  if (!fs.existsSync(removedAliasesPath)) {
    console.error('❌ removed-aliases.json not found. Run remove-aliases.js first.');
    process.exit(1);
  }

  const removedAliases = JSON.parse(fs.readFileSync(removedAliasesPath, 'utf-8'));

  // Read netlify.toml
  if (!fs.existsSync(netlifyTomlPath)) {
    console.error('❌ netlify.toml not found');
    process.exit(1);
  }

  let netlifyContent = fs.readFileSync(netlifyTomlPath, 'utf-8');

  // Define the redirects we need to add
  const redirectsToAdd = [
    {
      from: "/docs/developers/",
      to: "/community/developers/",
      status: 302,
      comment: 'Additional redirects for Hugo frontmatter aliases removed during v3 migration'
    },
    {
      from: "/docs/history/",
      to: "/community/history/",
      status: 302,
    },
    {
      from: "/docs/related/",
      to: "/community/related/",
      status: 302,
    },
    {
      from: '/docs/faq/',
      to: '/docs/faq/',
      status: 302
    },
    {
      from: '/docs/using_helm/',
      to: '/docs/intro/',
      status: 302
    },
    {
      from: '/docs/architecture/',
      to: '/docs/topics/architecture/',
      status: 302
    },
    {
      from: '/docs/developing_charts/',
      to: '/docs/topics/charts/',
      status: 302
    },
    {
      from: '/developing_charts/',
      to: '/docs/topics/charts/',
      status: 302
    }
  ];

  // Check if our section already exists
  const startMarker =
    "# START - Hugo frontmatter aliases redirects, removed during docusaurus migration";
  const endMarker = "# END - Hugo frontmatter aliases redirects";

  const startIndex = netlifyContent.indexOf(startMarker);
  const endIndex = netlifyContent.indexOf(endMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    console.log('  ⏭️  Redirects section already exists, replacing...');
    // Remove existing section
    netlifyContent = netlifyContent.substring(0, startIndex) + netlifyContent.substring(endIndex + endMarker.length);
  } else if (startIndex !== -1) {
    console.log('  ⚠️  Found start marker but no end marker. Cleaning up...');
    netlifyContent = netlifyContent.substring(0, startIndex);
  }

  // Build new redirects section
  let redirectsSection = `\n${startMarker}\n`;

  redirectsToAdd.forEach(redirect => {
    redirectsSection += `[[redirects]]\n`;
    redirectsSection += `  from = "${redirect.from}"\n`;
    redirectsSection += `  to = "${redirect.to}"\n`;
    redirectsSection += `  status = ${redirect.status}\n`;
    redirectsSection += `\n`;
  });

  redirectsSection += `${endMarker}\n`;

  // Append the new section
  netlifyContent = netlifyContent.trim() + redirectsSection;

  // Write back to file
  fs.writeFileSync(netlifyTomlPath, netlifyContent);

  console.log(`✅ Added ${redirectsToAdd.length} redirects to netlify.toml`);
  console.log('  📋 Redirects added:');
  redirectsToAdd.forEach(redirect => {
    console.log(`    ${redirect.from} → ${redirect.to}`);
  });
}

// Run if called directly
if (require.main === module) {
  addNetlifyRedirects();
}

module.exports = { addNetlifyRedirects };
