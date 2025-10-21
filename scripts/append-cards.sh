#!/usr/bin/env bash
set -euo pipefail

root_dir="${1:-docs}"
snippet=$'import DocCardList from \'@theme/DocCardList\';\n\n<DocCardList />'

# Rename index.md -> index.mdx
find "$root_dir" -type f -name 'index.md' -print0 | while IFS= read -r -d '' f; do
  mv "$f" "$(dirname "$f")/index.mdx"
  echo "renamed: $f -> $(dirname "$f")/index.mdx"
done

# Append snippet to every index.mdx if missing
find "$root_dir" -type f -name 'index.mdx' -print0 | while IFS= read -r -d '' f; do
  if grep -Fq "DocCardList" "$f"; then
    echo "Skip (already present): $f"
  else
    printf '\n%s\n' "$snippet" >> "$f"
    echo "Appended: $f"
  fi
done
