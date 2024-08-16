---
title: "The .helmlintignore file"
description: "The `.helmlintignore` file is used to specify files or patterns to exclude from linting in your helm chart."
weight: 15
---

The `.helmlintignore` file allows you to specify files or patterns that you want to exclude from linting in your helm chart.

This file can be placed in the same directory as the `Chart.yaml` or in a separate directory. It can be specified by using the `--lint-ignore-file` flag when running the `helm lint` command. This allows for flexibility in managing lint exclusions, especially useful in projects with multiple subcharts or complex directory structures.

The `.helmlintignore` file helps manage lint results more effectively, particularly in larger charts where certain files may deviate from standard linting rules but are accepted by the maintainers.

The `.helmlintignore` file supports Unix shell glob matching, relative path matching, and specific error-triggering lines exclusion. Only one pattern per line is considered.

Here is an example `.helmlintignore` file:

```
# comment

# Exclude a specific script file
template/test/test.sh

# Exclude a yaml file
template/test/test.yaml

# Exclude a specific line from findings in a specific file
template/test/test.yaml {{template "yourtemplate" .}}

# Exclude specific Helm chart configurations
yourchart/yourfolder/yourfile.yaml <.Values.global.rbac>

# For errors that don't have a path in the description (e.g., metadata or directory errors), use error_lint_ignore=
error_lint_ignore=chart metadata is missing these dependencies*
```

When working with subcharts (e.g., adding the `--with-subcharts` option), the `.helmlintignore` file can be centralized by using the `--lint-ignore-file` flag. This setup allows all the subcharts to be linted with the same rules. Alternatively, each subchart can have its own `.helmlintignore` file, but if that is the case, the `--lint-ignore-file` flag needs to be removed from the `helm lint` command.

**Note:**
- The `.helmlintignore` file does not support the '**' syntax to match patterns across all directories; patterns apply only to the directory level specified.
- Trailing spaces are always ignored as there is no supported escape sequence in the `.helmlintignore` file.
- The `.helmlintignore` file does not exclude itself by default.

**We'd love your help** making this document better. To add, correct, or remove information, [file an issue](https://github.com/helm/helm-www/issues) or send us a pull request.