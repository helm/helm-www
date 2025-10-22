# Markdown Links Guide for helm-www

This guide explains how to write markdown links that work correctly across all locales in the helm-www Docusaurus site.

## Documentation Links

### Within the Same Directory

Always use absolute paths from content root, even for same-directory links.

```markdown
✅ GOOD: [Charts](/topics/charts.md)
❌ AVOID: [Charts](charts.md)
❌ AVOID: [Charts](charts)
```

Absolute paths are more verbose but needed for maintainability in a multi-locale site with ongoing English content additions.

The workflow for translating docs for this site involves copying English docs to different locales. If a given file exists in English but there is no translated version of the file in a given locale (which is common for this site), then using absolute paths ensures that Docusaurus will redirect to the English version of the file.

For example:

```markdown
// In versioned_docs/version-3/topics/file1.md (English)
[Charts](/topics/charts.md)

// Copy to i18n/uk/.../topics/file1.md (Ukrainian)
[Charts](/topics/charts.md)  // Still works

// Later: file3.md added to English but not to uk yet
// Link still works through the fallback mechanism by pointing to the English version
```

### Between Different Directories

For linking across different sections (e.g., from FAQ to Topics):

```markdown
✅ GOOD: [Advanced Topics](/topics/advanced.md)
✅ GOOD: [Commands](/commands/helm_install.md)
❌ BAD:  [Advanced Topics](../topics/advanced.md)
❌ BAD:  [Advanced Topics](/docs/topics/advanced.md)
```

Absolute paths from the content root (e.g., `/topics/`) work reliably across all locales. The `/docs/` prefix is added automatically by Docusaurus.

### Linking to Index Pages

When linking to a directory's index page, use the directory path with trailing slash. For example, `[Commands](/commands/)`.

Docusaurus automatically resolves to the index file, regardless of whether it's `.md` or `.mdx`. Sometimes, the index file might have a different extension across locales. So not explicitly using the extension avoids breakage.

**Exception for Versioned Docs:** In some cases within versioned documentation (e.g., `versioned_docs/version-3/`), you may need to explicitly specify the index file with its extension:

```markdown
✅ WORKS: [Helm Commands](/helm/index.mdx)
⚠️ MAY FAIL: [Helm Commands](/helm/)
```

If you encounter broken link errors with directory links in versioned docs, try specifying the full `index.md` or `index.mdx` path explicitly.

## Blog Post Links

### Blog Posts With Slugs

If the blog post defines a `slug` in its frontmatter:

```yaml
---
title: "My Post"
slug: "my-custom-slug"
---
```

Use the slug-based URL:

```markdown
✅ GOOD: [Read more](/blog/my-custom-slug)
❌ BAD:  [Read more](./2024-01-01-my-post/)
```

When a slug is defined, that becomes the URL. File paths won't work. If both English and translated versions use the same slug, this works reliably across all locales.

### Blog Posts Without Slugs

If no slug is defined, use relative file paths:

```markdown
✅ GOOD: [Read more](./2024-01-01-my-post/)
✅ GOOD: [Read more](../2024-01-01-my-post/)
❌ BAD:  [Read more](/blog/2024-01-01-my-post/)
```

Relative paths work better for blog-to-blog links and handle locale fallback correctly.

### Linking From Docs To a Blog

When linking from documentation to a blog post:

```markdown
✅ GOOD: [See blog post](/blog/my-slug) (if slug exists)
✅ GOOD: [See blog post](/blog/2024-01-01-title) (if no slug)
```

## Anchor Links

Anchor links are challenging in multi-locale sites because (unless the anchor ID is explicitly set using the `Heading {#my-anchor-link}` format) anchor IDs are automatically generated from the heading text.

This means that any links that point to English language anchor IDs will break in other locales if the given heading is translated to a different language. 

For example:
```markdown
English: ## Storage backends  → #storage-backends
Chinese: ## 后端存储         → #后端存储 (different anchor ID!)
```

### Use Explicit Anchor IDs

Add explicit IDs to headings in English in all translations. For example:

```markdown
## Storage backends {#storage-backends}
## 后端存储 {#storage-backends}
```

In this case, anchor links to the given ID will work across all locales since the anchor ID itself remains the same in all translations.

This approach requires some level of effort to find the corresponding heading(s) in translated file and add the explicit anchor ID definition to the translated heading. This could be non-trivial if the update needs to be made across several locales.

### Alternatives: Avoid Anchors and/or Accept Locale-Specific Breakage

Alternatively, you can also choose to link to the given page without anchors. While the user will need to manually find the referenced heading or content, excluding anchors all together will avoid broken anchor links.

If you choose to use anchors and do not want to go through the effort of explicitly defining the anchor in each translated file, understand that the anchor will probably break in locales with translated headings.

## Common Pitfalls

### Mixing URL Paths with File Extensions

```markdown
❌ BAD: [link](/docs/topics/charts.md)
✅ GOOD: [link](/topics/charts.md)
```

Don't include the `/docs/` prefix that appears in URLs - it's added automatically.

### Cross-Section Links

```markdown
❌ BAD: [link](../../topics/charts.md)
✅ GOOD: [link](/topics/charts.md)
```

Use absolute paths from content root instead of complex relative paths.

### Trailing Slashes on File Links

```markdown
❌ BAD: [link](/topics/charts/)  (when charts is a file, not directory)
✅ GOOD: [link](/topics/charts.md)
```

Only use trailing slash for directory indexes.

### Explicit `index.md` in Links

```markdown
❌ BAD: [link](/commands/index.mdx)
✅ GOOD: [link](/commands/)
```

Link to the directory; Docusaurus resolves to the index automatically.

## Troubleshooting

When you get a broken link error like:

```
Broken link on source page path = /docs/faq/changes_since_helm2
   -> linking to /topics/charts.md
```

Do the following to fix the link:

1. Identify the locale where the link is broken (en, zh, uk, etc.). This should be included in the broken link error message. Example:

   ```bash
   Exhaustive list of all broken links found:
   - Broken link on source page path = /zh/docs/commands/helm_get_metadata:
     -> linking to helm_get.md (resolved as: /zh/docs/commands/helm_get.md)
   ```

2. Search for the link target in that locale:
   ```bash
   grep -r "helm_get.md" i18n/zh/docusaurus-plugin-content-docs/
   ```

3. Do one of the following:
    * If the source file exists in the given locale, find the broken link in the translated file
    * If the source file does NOT exist in the given locale, then the English file is being used as fallback. Check the main English version of the file for the broken link

4. To fix the link, first make sure its using absolute paths to avoid resolution issues. For example, `/topics/advanced.md` instead of `../topics/advanced.md`. If that doesn't work, check the following:
    * Does the file extension match used in the link in the source file match the file extension of the target file? (.md versus .mdx)
    * If there a mismatch in the name subdirectory where the target file lives across locales? (eg, the subdirectory is called `/commands` in the main en locale but called `/helm` in ko)
    * If it's a blog link, does the blog have a slug defined in its metadata? If so, link to that slug instead
    * Does the link use a trailing slash even though the target is a file and not a directory? (eg `/topics/charts/` instead of `/topics/charts.md`)

## See Also

- [Docusaurus Markdown Links Documentation](https://docusaurus.io/docs/markdown-features/links)
- [Contributing Guide](CONTRIBUTING.md)

