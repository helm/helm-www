#!/usr/bin/env bash
set -e

: "${MAJOR_VERSION:=3}"
VERSION_DIR="versioned_docs/version-${MAJOR_VERSION}"

# Check if rules file exists, return 0 if found, 1 if not found
function is_rules_file() {
    local rules_file="$1"
    local calling_function="$2"
    if [[ ! -f "$rules_file" ]]; then
        echo "Warning: Rules file $rules_file not found, skipping $calling_function"
        return 1
    fi
    return 0
}

# adds the correct dir inside versioned_docs/ and versioned_sidebars/ and
# updates versions.json
function skaffold_major_version() {
    if [[ ! -d $VERSION_DIR ]]; then
        npm run docusaurus docs:version $MAJOR_VERSION

        # we use a different versioning strategy than docusaurus default so clear
        # out the files copied from the pre-release dir (/docs) before migrating
        # our files into it
        rm -r $VERSION_DIR/*
    fi
}

function move_docs() {
    local old_docs='content/en/docs'
    if [[ -d $old_docs  ]]; then
        git mv $old_docs/* $VERSION_DIR
    fi
}

function delete_deprecated_files() {
    grep -rl 'section: deprecated' "$VERSION_DIR" --include="*.md" --include="*.mdx" | while read -r file; do
        rm "$file"
    done
}

function rename_categories() {
    local rules_file="${1:-scripts/rules/docs_rename_categories.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local old="${entry%%|*}"
        local new="${entry#*|}"
        if [[ -d "$VERSION_DIR/$old" ]]; then
            mv "$VERSION_DIR/$old" "$VERSION_DIR/$new"
        fi
    done < "$rules_file"
}

function rename_files() {
    local rules_file="${1:-scripts/rules/docs_rename_files.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local old="${entry%%|*}"
        local new="${entry#*|}"
        # Find and rename in all subdirectories
        find "$VERSION_DIR" -type f -name "$old" -execdir mv "$old" "$new" \;
    done < "$rules_file"
}

function rename_files_per_category() {
    local rules_file="${1:-scripts/rules/docs_rename_files_per_category.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local category="${entry%%|*}"
        local rest="${entry#*|}"
        local old="${rest%%|*}"
        local new="${rest#*|}"
        local dir="$VERSION_DIR/$category"
        if [ -f "$dir/$old" ]; then
            mv "$dir/$old" "$dir/$new"
        fi
    done < "$rules_file"
}

function remove_lines() {
    local basedir="${1:-$VERSION_DIR}"
    local rules_file="${2:-scripts/rules/docs_remove_lines.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r pattern || [[ -n "$pattern" ]]; do
        [[ -z "$pattern" || "$pattern" == \#* ]] && continue
        find "$basedir" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i '' "/$pattern/d" {} +
    done < "$rules_file"
}

function replace_text() {
    local basedir="${1:-$VERSION_DIR}"
    local rules_file="${2:-scripts/rules/docs_replace_text.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local old="${entry%%|*}"
        local new="${entry#*|}"

        # Convert \n to actual newlines for old and new
        old=$(printf '%b' "${old//\\n/$'\n'}")
        new=$(printf '%b' "${new//\\n/$'\n'}")

        # Use a delimiter unlikely to appear in your patterns (here, %)
        find "$basedir" -type f \( -name "*.md" -o -name "*.mdx" \) -exec perl -0777 -pi -e "s%$old%$new%g" {} +
    done < "$rules_file"
}

function replace_text_per_file() {
    local basedir="${1:-$VERSION_DIR}"
    local rules_file="${2:-scripts/rules/docs_replace_text_per_file.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local file="${entry%%|*}"
        local rest="${entry#*|}"
        local old="${rest%%|*}"
        local new="${rest#*|}"

        # Convert \n to actual newlines for old and new
        old=$(printf '%b' "${old//\\n/$'\n'}")
        new=$(printf '%b' "${new//\\n/$'\n'}")

        # Use a delimiter unlikely to appear in your patterns (here, %)
        perl -0777 -pi -e "s%$old%$new%g" "$basedir/$file"
    done < "$rules_file"
}

function add_metadata_lines() {
    local rules_file="${1:-scripts/rules/docs_add_metadata_lines.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local file="$VERSION_DIR/${entry%%|*}"
        local meta="${entry#*|}"

        # Skip if the metadata line already exists anywhere in the file
        if grep -Fxq "$meta" "$file"; then
            continue
        fi

        # Find the line number of the second ---
        local second_dash_line
        second_dash_line=$(grep -n '^---$' "$file" | sed -n '2p' | cut -d: -f1)

        if [[ -n "$second_dash_line" ]]; then
            # Write up to before second ---
            head -n $((second_dash_line - 1)) "$file" > "$file.tmp"
            echo "$meta" >> "$file.tmp"
            sed -n "${second_dash_line}p" "$file" >> "$file.tmp"
            tail -n +"$((second_dash_line + 1))" "$file" >> "$file.tmp"
        else
            # No metadata block, create one at the top
            {
                echo "---"
                echo "$meta"
                echo "---"
                cat "$file"
            } > "$file.tmp"
        fi

        mv "$file.tmp" "$file"
    done < "$rules_file"
}

# copy sdk example go files to partials
# this function was mildly tricky with bash to make idempotent, so adding loads of comments
import_sdk() {
    local import_lines=()
    local file="$VERSION_DIR/sdk/examples.mdx"
    for old in sdkexamples/*.go; do
        local name=$(basename "${old%.*}")
        local new="$VERSION_DIR/sdk/_$name.mdx"
        cp "$old" "$new"
        { echo '```go'; cat "$new"; } > "$new.tmp" && mv "$new.tmp" "$new"
        echo '```' >> "$new"
        local capname=$(echo "$name" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')
        import_lines+=("import $capname from './_${name}.mdx'")
    done

    local second_dash_line
    second_dash_line=$(grep -n '^---$' "$file" | sed -n '2p' | cut -d: -f1)

    # write header (up to and including the second ---)
    head -n "$second_dash_line" "$file" > "$file.tmp"

    # write import lines
    printf '%s\n' "${import_lines[@]}" >> "$file.tmp"

    # add exactly one blank line
    echo "" >> "$file.tmp"

    # now, skip any blank lines and import lines after the header in the original file
    local rest_start=$((second_dash_line + 1))
    local found_content=0
    while IFS= read -r line; do
        # skip blank lines and import lines
        if [[ -z "$line" ]] || [[ "$line" == import* ]]; then
            rest_start=$((rest_start + 1))
            continue
        fi
        break
    done < <(tail -n +"$((second_dash_line + 1))" "$file")

    # append the rest of the file, starting from the first non-import, non-blank line
    tail -n +"$rest_start" "$file" >> "$file.tmp"
    mv "$file.tmp" "$file"
}

function add_docs_index_list() {
    ./scripts/append-cards.sh "$VERSION_DIR"
}

skaffold_major_version
move_docs
delete_deprecated_files
rename_categories
rename_files
rename_files_per_category
remove_lines "$VERSION_DIR" "scripts/rules/docs_remove_lines.txt"
replace_text "$VERSION_DIR" "scripts/rules/docs_replace_text.txt"
replace_text_per_file "$VERSION_DIR" "scripts/rules/docs_replace_text_per_file.txt"
add_metadata_lines
import_sdk
add_docs_index_list
