![github-banner-helm-helmwww](https://user-images.githubusercontent.com/686194/68531441-f4ad4e00-02c6-11ea-982b-74d7c3ff0071.png)

This is where you'll find all of the assets that make up [helm.sh](https://helm.sh/), the website for the [Helm](https://github.com/helm/helm) project. If you're looking to edit docs, report a website bug, or write a new blog post, you've come to the right place!

## Development

Helm.sh is a simple [Docusaurus](https://docusaurus.io/) static site. To run the website locally, you'll need to first install the dependencies:

```
yarn
```

You can then compile and run the site locally:

```
yarn start
```

## Deployment [![Netlify Status](https://api.netlify.com/api/v1/badges/8ffabb30-f2f4-45cc-b0fa-1b4adda00b5e/deploy-status)](https://app.netlify.com/sites/helm-merge/deploys)

Changes are automatically deployed to [Netlify](https://app.netlify.com/sites/helm-merge/deploys) when merged to `main`. Build logs can be found [here](https://app.netlify.com/sites/helm-merge/deploys).

---

## Contributing

Anyone can submit a PR to edit Helm.sh. We require commits be signed - please refer to the [contributing guide](https://github.com/helm/helm/blob/main/CONTRIBUTING.md#sign-your-work).

Pull requests require [maintainer](https://github.com/helm/helm-www/blob/main/OWNERS) approval before merge.

### How to Edit The Helm Docs

Helm v4 documentation is located in this repo under `/docs/`. The sidebar for the Helm v4 docs is located at `sidebars.js`.

Helm v3 documentation is located under `versioned-docs/version-3`. The sidebar for the Helm v3 docs is located at `versioned-sidebars/sidebars-version-2.js`

For earlier versions, see the dev-v2 branch of the main Helm repo [here](https://github.com/helm/helm/tree/dev-v2/docs).

### Updating the Helm CLI Reference Docs

The documentation for the list of Helm CLI Commands are [exported](https://github.com/helm/helm/blob/a6b2c9e2126753f6f94df231e89b2153c2862764/cmd/helm/root.go#L169) from the main helm project repo and rendered [here on the website](https://helm.sh/docs/helm) as a reference.

#### Using the automated script

The automated script regenerates and properly formats the CLI documentation:

```bash
node scripts/regenerate-cli-docs.mjs <helm-version> <target-directory>

# Examples:
node scripts/regenerate-cli-docs.mjs v3.19.0 versioned_docs/version-3  # → versioned_docs/version-3/helm/
node scripts/regenerate-cli-docs.mjs v4.0.0-rc.1 docs                  # → docs/helm/
node scripts/regenerate-cli-docs.mjs v4.0.0 versioned_docs/version-4   # → versioned_docs/version-4/helm/
```

The script will:
- Download the specified Helm version
- Generate documentation in `<target-directory>/helm/`
- Apply all necessary post-processing (frontmatter cleanup, link conversion, etc.)

### How to Write a Blog Post

Blog posts are created via pull requests. The following steps are used to add them:

1. Add a new file to the `/blog/` directory whose name is the published date and the title. The files must be markdown formatted. See the existing titles for examples of the format
2. Add the header meta-data to the file using this format.

   ```yaml
   ---
   title: "Blog Title"
   slug: "blog-slug"
   # from /blog/authors.yml
   authors: ["firstlast"]
   date: "YYYY-MM-DD"
   ---
   ```

3. If this is the first blog post by this author, update `/blog/authors.yml` to add a new author record.
   ```yaml
   # authors.yml
   johndoe:
     name: John Doe
     image_url: https://github.com/johndoe.png
     page: true
     socials:
       github: johndoe
       linkedin: johndoe
       website: http://johndoe.com/
   ```
4. Add the content below the `---` as Markdown. The title does not need to be included in this section
5. Any images should be placed in the `/blog/images/` directory. Images should be losslessly compressed to reduce their size. Tools, such as [ImageOptim](https://imageoptim.com/), can be used.
6. To summarize the content on the blog index page, insert a `<!--truncate-->` break in your markdown. This will truncate the content with a _Read More_ link.

Blog PRs require approval from the core Helm [maintainers](https://github.com/helm/helm/blob/main/OWNERS) before merge.

### Versioning

The following files in this repo are used to control versioning:

- Versioned documentation is located in `versioned_docs`.
- The corresponding sidebar for each version is located in `versioned_sidebars`.
- Versioning behavior is managed in the `docusaurus.config.js` file:

  ```js
  export default {
    presets: [
      '@docusaurus/preset-classic',
      docs: {
      // lastVersion = the latest released version (either a specific version from /versioned_docs or 'current')
      // For any versions not listed as the latest, a banner is automatically displayed to warn users that they are viewing either old or pre-release docs
        lastVersion: '3',
        versions: {
          // current = docs from the top-level /docs directory. These can be pre-release or the latest released version
          // label = the version label displayed in the navbar dropdown
          current: { label: '4.0.0-alpha.1 🚧' },
          // numbered versions correspond to directories in /versioned_docs
          '3': { label: '3.19.0' },
          '2': { label: '2.17.0' },
        },
      },
    ],
  };
  ```

- The list of available versions is maintained in `versions.json`.

The table below explains the version labels and URL paths that map to versioned docs in this repo:

| Repo Path                              | Version                 | URL Path            |
| -------------------------------------- | ----------------------- | ------------------- |
| `versioned_docs/version-2/filename.md` | 2.17.0                  | /docs/2/filename    |
| `versioned_docs/version-3/filename.md` | 3.19.0 (latest)         | /docs/filename      |
| `docs/filename.md`                     | 4.0.0-alpha.1 (current) | /docs/next/filename |

#### How to move pre-release docs to GA

Docusaurus has support for publishing _pre-release_ (alpha, beta) documentation. By default, pre-release documentation is published at helm.sh/docs/next and is served from the top-level `/docs` directory in this repo. Additionally, Docusaurus automatically applies a banner to all pre-release documentation to notify users that they are viewing unreleased docs.

When a pre-release version of Helm is promoted to GA, do the following to move pre-release docs from helm.sh/docs/next to helm.sh/docs:

1. Update `docusaurus.config.js` to set `lastVersion` to `'current'`. This publishes the content of the main `/docs` folder to helm.sh`/docs`.

   ```js
   // docusaurus.config.js
   lastVersion: 'current',
   ```

1. Update the navbar `label` for the `current` version. For example:

   ```js
   // docusaurus.config.js
   current: { label: '4.0.0' },
   ```

1. Start a local preview to test your changes. You should see that the "unreleased" banner is removed from the current version, and that the current version is now available at helm.sh/docs, rather than at helm.sh/docs/next.

#### How to cut a new pre-release version

Cutting a new version refers to copying the full `/docs` directory contents to a versioned folder in `versioned_docs`. You cut a version when you are ready to publish a new _major_ pre-release version of the docs. This is usually when a new alpha version of Helm is being developed and is ready to be documented.

**Note:** Cutting a new version is _not_ recommend until a pre-release version of Helm is being developed and is ready to be documented. Otherwise, the docs will need to be maintained in two places (both `/docs` and the latest `/versioned_docs` folder), creating extra work for maintainers to make sure they stay in-sync. Instead, see _How to move pre-release docs to GA_ below.

To cut a new version:

1. Run `yarn docusaurus docs:version <version>`, where `<version>` is an integer that corresponds to a major Helm version. For example, when we publish Helm 4.0.0 we will run `yarn docusaurus docs:version 4`.

   This command does the following:

   - Copies the full `docs/` folder contents into a new `versioned_docs/version-<version>/` folder.
   - Creates a versioned sidebars file in `versioned_sidebars/version-<version>-sidebars.json`.
   - Appends the new version number to `versions.json`.

1. Update the `docusaurus.config.js` file:

   1. Set `lastVersion` to to the latest GA version. This ensures that the docs at helm.sh/docs are served from the latest versioned_docs folders. And, the docs at helm.sh/docs/next are served from the main `/docs` folder.

      For example, if you just cut the Helm v4 docs to a `versioned_docs/version-4/` directory, and want to publish pre-release docs for version Helm v5.0.0-alpha.1, then set `lastVersion` to `'4'`.

   1. Update the navbar `label` for the `current` version. For example, to label the current (pre-release) version `5.0.0-alpha.1`, update the label as follows:

      ```js
      current: { label: '5.0.0-alpha.1 🚧' },
      ```

1. Start a local preview to test your changes. You should see the new version in the dropdown, be able to access the pre-release docs at helm.sh/docs/next, and see an "unreleased" banner at the top of all the pre-released docs.

For more information about cutting new docs versions, see [Versioning](https://docusaurus.io/docs/versioning) in the Docusaurus documentation.

### Internationalization & Translation

**We welcome content translations** to our site and our docs, to help expand access to Helm around the world.

Helm.sh supports multiple languages. Please refer to the [Localizing Helm Documentation](https://helm.sh/docs/community/localization/) for a guide on translating and configuring content for international users.

---

### Code of Conduct

Participation in the Helm community is governed by the Helm [Code of Conduct](https://github.com/helm/helm/blob/main/code-of-conduct.md).

### Thank You!

We appreciate your contributions to our website and our documentation! :clap:
