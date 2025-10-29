#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const { JSDOM } = require('jsdom');

const V2_DOCS_URL = 'https://v2.helm.sh/docs/';

// DOM extraction function from user
const linksTree = (rootSel = 'nav.sidebar-nav ul.current.sidebar-main', document) => {
  const ul = typeof rootSel === 'string' ? document.querySelector(rootSel) : rootSel;
  if (!ul || ul.tagName !== 'UL') throw new Error('Target UL .current.sidebar-main not found under nav.sidebar-nav');

  const parse = u => Array.from(u.children).flatMap(li => li.tagName === 'LI' ? [{
    link: li.querySelector(':scope > a')?.href ?? null,
    label: li.querySelector(':scope > a')?.textContent.trim() ?? null,
    children: (() => { const cu = li.querySelector(':scope > ul'); return cu ? parse(cu) : []; })()
  }] : []);

  return parse(ul);
};

// Convert v2.helm.sh navigation structure to simplified format for copy script
const convertToSimplifiedFormat = async (navTree) => {
  const results = [];

  for (const item of navTree) {
    // Skip external links (not on v2.helm.sh/docs domain)
    if (item.link && !item.link.startsWith('/docs')) {
      console.log(`🚫 Skipping external link: ${item.label} (${item.link})`);
      continue;
    }

    const result = {
      label: item.label,
      link: item.link // Store full URL path for categories
    };

    // Extract header text for the main page (except for "Docs Home")
    if (item.link && item.label !== "Docs Home") {
      try {
        const headerText = await extractHeaderText(`https://v2.helm.sh${item.link}`);
        if (headerText) {
          result.header = headerText;
        }
      } catch (error) {
        console.warn(`Failed to extract header for ${item.link}: ${error.message}`);
      }
    } else if (item.label === "Docs Home") {
      console.log(`📄 Skipping header extraction for Docs Home (handled by copy script)`);
    }

    // Only add children key if there are actual children
    if (item.children.length > 0) {
      result.children = [];

      for (const child of item.children) {
        const childResult = {
          label: child.label,
          anchor: extractAnchor(child.link) // Store just the anchor fragment
        };

        // Extract header text for child anchor
        if (child.link && item.link) {
          try {
            const fullChildUrl = `https://v2.helm.sh${item.link}${child.link.startsWith('#') ? child.link : '#' + extractAnchor(child.link)}`;
            const childHeaderText = await extractHeaderTextFromAnchor(`https://v2.helm.sh${item.link}`, extractAnchor(child.link));
            if (childHeaderText) {
              childResult.header = childHeaderText;
            }
          } catch (error) {
            console.warn(`Failed to extract header for ${child.link}: ${error.message}`);
          }
        }

        result.children.push(childResult);
      }
    }

    results.push(result);
  }

  return results;
};

// Extract anchor fragment from relative URL
const extractAnchor = (link) => {
  if (!link) return null;
  const anchorIndex = link.indexOf('#');
  return anchorIndex !== -1 ? link.substring(anchorIndex + 1) : null;
};

// Extract header text from a page following the pattern: div.content-wrap + empty h3 + next H1/H2
const extractHeaderText = (url) => {
  return new Promise((resolve, reject) => {
    console.log(`  🔍 Extracting header from: ${url}`);

    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const dom = new JSDOM(data);
          const document = dom.window.document;

          // Find div.content-wrap
          const contentWrap = document.querySelector('div.content-wrap');
          if (!contentWrap) {
            console.log(`    ❌ No div.content-wrap found`);
            resolve(null);
            return;
          }

          // Look for empty h3 inside content-wrap
          const emptyH3 = contentWrap.querySelector('h3');
          if (!emptyH3 || emptyH3.textContent.trim() !== '') {
            console.log(`    ❌ No empty h3 found inside content-wrap`);
            resolve(null);
            return;
          }

          // Find the next H1 or H2 after the empty h3
          let nextElement = emptyH3.nextElementSibling;
          while (nextElement && !['H1', 'H2'].includes(nextElement.tagName)) {
            nextElement = nextElement.nextElementSibling;
          }

          if (nextElement) {
            const headerText = nextElement.textContent.trim();
            console.log(`    ✅ Found header: "${headerText}"`);
            resolve(headerText);
          } else {
            console.log(`    ❌ No H1/H2 found after empty h3`);
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
};

// Extract header text from anchor on a page
const extractHeaderTextFromAnchor = (baseUrl, anchor) => {
  return new Promise((resolve, reject) => {
    if (!anchor) {
      resolve(null);
      return;
    }

    console.log(`  🔍 Extracting anchor header from: ${baseUrl}#${anchor}`);

    https.get(baseUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const dom = new JSDOM(data);
          const document = dom.window.document;

          // Find element with matching id
          const targetElement = document.querySelector(`#${anchor}`);
          if (targetElement) {
            const headerText = targetElement.textContent.trim();
            console.log(`    ✅ Found anchor header: "${headerText}"`);
            resolve(headerText);
          } else {
            // Try to find by matching text in headings
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            for (const heading of headings) {
              const headingId = heading.id || '';
              if (headingId === anchor || heading.textContent.toLowerCase().includes(anchor.replace(/-/g, ' '))) {
                const headerText = heading.textContent.trim();
                console.log(`    ✅ Found matching header: "${headerText}"`);
                resolve(headerText);
                return;
              }
            }
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
};

// Fetch and parse the v2.helm.sh docs page
const fetchV2Navigation = () => {
  return new Promise((resolve, reject) => {
    console.log(`Fetching navigation from ${V2_DOCS_URL}...`);

    https.get(V2_DOCS_URL, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          console.log('Parsing HTML and extracting navigation...');
          const dom = new JSDOM(data);
          const document = dom.window.document;

          // Extract navigation using the provided function
          const navTree = linksTree('nav.sidebar-nav ul.current.sidebar-main', document);

          console.log(`Extracted ${navTree.length} top-level navigation items`);

          resolve(navTree);
        } catch (error) {
          reject(new Error(`Failed to parse navigation: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch ${V2_DOCS_URL}: ${error.message}`));
    });
  });
};

// Count total items recursively
const countTotalItems = (items) => {
  return items.reduce((count, item) => {
    return count + 1 + countTotalItems(item.children || []);
  }, 0);
};

// Add missing files that exist in orig/docs-v2 but aren't in the menu
const addMissingFilesToMenu = (navigationStructure) => {
  console.log('🔍 Adding missing files to navigation menu...');

  // Find the "Helm Commands" category
  const helmCommandsCategory = navigationStructure.find(item =>
    item.label === "Helm Commands" || (item.children && item.children.some(child =>
      child.label && child.label.startsWith("Helm ")
    ))
  );

  if (helmCommandsCategory && helmCommandsCategory.children) {
    // Add "helm get notes" before "helm get values"
    const getValuesIndex = helmCommandsCategory.children.findIndex(child =>
      child.label === "Helm Get Values"
    );

    if (getValuesIndex > 0) {
      helmCommandsCategory.children.splice(getValuesIndex, 0, {
        label: "Helm Get Notes",
        header: "helm get notes",
        link: "/docs/helm/helm_get_notes/"
      });
      console.log('  ✅ Added "Helm Get Notes" before "Helm Get Values"');
    }

    // Add "helm inspect readme" before "helm inspect values"
    const inspectValuesIndex = helmCommandsCategory.children.findIndex(child =>
      child.label === "Helm Inspect Values"
    );

    if (inspectValuesIndex > 0) {
      helmCommandsCategory.children.splice(inspectValuesIndex, 0, {
        label: "Helm Inspect Readme",
        header: "helm inspect readme",
        link: "/docs/helm/helm_inspect_readme/"
      });
      console.log('  ✅ Added "Helm Inspect Readme" before "Helm Inspect Values"');
    }
  }
};

// Main execution
const main = async () => {
  try {
    const rawNavTree = await fetchV2Navigation();

    console.log('\n🔍 Extracting header texts from live site...');
    const navigationStructure = await convertToSimplifiedFormat(rawNavTree);

    // Add missing files that exist in orig/docs-v2 but aren't in the menu
    addMissingFilesToMenu(navigationStructure);

    // Write the simplified menu structure
    const outputPath = './scripts/v2/menu.json';
    const output = {
      navigationStructure,
      metadata: {
        sourceUrl: V2_DOCS_URL,
        method: 'DOM extraction with header text extraction from live site',
        totalItems: countTotalItems(navigationStructure)
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Successfully generated ${outputPath}`);
    console.log(`📊 Extracted ${output.metadata.totalItems} total navigation items with header texts`);
    console.log(`🔗 Source: ${V2_DOCS_URL}`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { fetchV2Navigation, convertToSimplifiedFormat, linksTree };
