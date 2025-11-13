const fs = require('fs');
const path = require('path');

/**
 * Simple HTML parser to extract meta tag content
 * @param {string} html - HTML content
 * @param {string} name - Name or value of the attribute
 * @param {string} attr - Attribute name (default: 'name')
 * @returns {string|null} - Content attribute value or null
 */
function getMetaContent(html, name, attr = 'name') {
  // Match meta tags with or without quotes
  const regex = new RegExp(`<meta\\s+[^>]*${attr}\\s*=\\s*["']?${name}["']?[^>]*>`, 'i');
  const match = html.match(regex);
  if (!match) return null;
  
  // Extract content value - handle both quoted and unquoted attributes
  // Try quoted first
  let contentMatch = match[0].match(/content\s*=\s*"([^"]*)"/i);
  if (contentMatch) return contentMatch[1];
  
  contentMatch = match[0].match(/content\s*=\s*'([^']*)'/i);
  if (contentMatch) return contentMatch[1];
  
  // Handle unquoted attributes - match until space or >
  contentMatch = match[0].match(/content\s*=\s*([^\s>]+)/i);
  return contentMatch ? contentMatch[1] : null;
}

/**
 * Check if HTML contains a specific pattern
 * @param {string} html - HTML content
 * @param {string} pattern - Pattern to search for
 * @returns {boolean}
 */
function htmlContains(html, pattern) {
  return html.includes(pattern);
}

describe('Redirect HTML files', () => {
  const testCases = [
    {
      file: 'static/helm/index.html',
      expectedGoImport: 'helm.sh/helm git https://github.com/helm/helm',
      expectedGoSource: 'helm.sh/helm git https://github.com/helm/helm https://github.com/helm/helm/tree/main{/dir} https://github.com/helm/helm/blob/main{/dir}/{file}#L{line}',
      expectedRedirectUrl: 'https://github.com/helm/helm'
    },
    {
      file: 'static/helm/v2/index.html',
      expectedGoImport: 'helm.sh/helm/v2 git https://github.com/helm/helm',
      expectedGoSource: 'helm.sh/helm/v2 git https://github.com/helm/helm https://github.com/helm/helm/tree/dev-v2{/dir} https://github.com/helm/helm/blob/dev-v2{/dir}/{file}#L{line}',
      expectedRedirectUrl: 'https://github.com/helm/helm'
    },
    {
      file: 'static/helm/v3/index.html',
      expectedGoImport: 'helm.sh/helm/v3 git https://github.com/helm/helm',
      expectedGoSource: 'helm.sh/helm/v3 git https://github.com/helm/helm https://github.com/helm/helm/tree/dev-v3{/dir} https://github.com/helm/helm/blob/dev-v3{/dir}/{file}#L{line}',
      expectedRedirectUrl: 'https://github.com/helm/helm'
    },
    {
      file: 'static/helm/v4/index.html',
      expectedGoImport: 'helm.sh/helm/v4 git https://github.com/helm/helm',
      expectedGoSource: 'helm.sh/helm/v4 git https://github.com/helm/helm https://github.com/helm/helm/tree/main{/dir} https://github.com/helm/helm/blob/main{/dir}/{file}#L{line}',
      expectedRedirectUrl: 'https://github.com/helm/helm'
    }
  ];

  testCases.forEach(({ file, expectedGoImport, expectedGoSource, expectedRedirectUrl }) => {
    describe(file, () => {
      let html;

      beforeAll(() => {
        const filePath = path.join(__dirname, file);
        html = fs.readFileSync(filePath, 'utf-8');
      });

      test('file exists', () => {
        const filePath = path.join(__dirname, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });

      test('has correct go-import meta tag', () => {
        const content = getMetaContent(html, 'go-import');
        expect(content).not.toBeNull();
        expect(content).toBe(expectedGoImport);
      });

      test('has correct go-source meta tag', () => {
        const content = getMetaContent(html, 'go-source');
        expect(content).not.toBeNull();
        expect(content).toBe(expectedGoSource);
      });

      test('has meta refresh redirect', () => {
        const content = getMetaContent(html, 'refresh', 'http-equiv');
        expect(content).not.toBeNull();
        expect(content).toContain('0; url=');
        expect(content).toContain(expectedRedirectUrl);
      });

      test('has correct link in body', () => {
        expect(htmlContains(html, `<a href=${expectedRedirectUrl}`)).toBe(true);
      });

      test('has proper HTML structure', () => {
        expect(htmlContains(html, '<html')).toBe(true);
        expect(htmlContains(html, '<head>')).toBe(true);
        expect(htmlContains(html, '<body>')).toBe(true);
        expect(htmlContains(html, 'charset=utf-8')).toBe(true);
      });
    });
  });
});
