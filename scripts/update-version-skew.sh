#!/bin/bash
# 
# Kubernetes Version Skew Update Script
#
# This script automatically updates the Kubernetes version compatibility table
# in the Helm documentation based on the client-go version used in the latest
# Helm release.
#
# The script performs the following tasks:
# 1. Fetches the latest stable Helm release from GitHub API
# 2. Downloads and parses the go.mod file from that release
# 3. Extracts the k8s.io/client-go version dependency
# 4. Calculates supported Kubernetes versions using Helm's n-3 support policy
# 5. Updates the version skew table in all version_skew.md files (English and translations)
#
# Usage: ./update-version-skew.sh <v2|v3>
#
# The script follows Helm's support policy where each version supports the
# Kubernetes version it was built against plus the 3 prior minor versions.
# For example, if built against 1.34.x, it supports 1.34.x, 1.33.x, 1.32.x, 1.31.x
#
# Dependencies: curl, jq, sed, git
#
set -euo pipefail

# Validate command line arguments
if [ $# -ne 1 ] || { [ "$1" != "v2" ] && [ "$1" != "v3" ]; }; then
    echo "Usage: $0 <v2|v3>" >&2
    echo "Specify either 'v2' or 'v3' to update version skew for that major version" >&2
    exit 1
fi

HELM_MAJOR_VERSION="$1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Logging functions with timestamps and color coding
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" >&2
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

# =============================================================================
# DATA RETRIEVAL FUNCTIONS
# =============================================================================

# Get the client-go version from the latest Helm release and calculate supported K8s versions
get_helm_clientgo_version() {
    log "Fetching latest Helm release..."
    
    # Get latest stable Helm release (excludes pre-releases)
    local latest_helm=$(curl -s "https://api.github.com/repos/helm/helm/releases" | \
        jq -r '.[] | select(.prerelease == false and (.tag_name | startswith("'${HELM_MAJOR_VERSION}'."))) | .tag_name' | head -1)
    
    if [ -z "$latest_helm" ]; then
        error "Could not find latest Helm $HELM_MAJOR_VERSION release"
        return 1
    fi
    
    log "Latest Helm release: $latest_helm"
    
    # Download go.mod from the release tag
    local go_mod_url="https://raw.githubusercontent.com/helm/helm/$latest_helm/go.mod"
    local go_mod_content=$(curl -s "$go_mod_url")
    
    if [ $? -ne 0 ]; then
        error "Could not fetch go.mod from $go_mod_url"
        return 1
    fi
    
    # Extract client-go version from go.mod
    local clientgo_version=$(echo "$go_mod_content" | grep -E "k8s\.io/client-go" | awk '{print $2}' | head -1)
    
    if [ -z "$clientgo_version" ]; then
        error "Could not extract client-go version from go.mod"
        return 1
    fi
    
    log "Found client-go version: $clientgo_version"
    
    # Parse Kubernetes version from client-go version (e.g., v0.34.11 -> 1.34)
    local k8s_version=$(echo "$clientgo_version" | sed -E 's/^v?0\.([0-9]+)\..*$/1.\1/')
    
    if [ -z "$k8s_version" ]; then
        error "Could not parse Kubernetes version from $clientgo_version"
        return 1
    fi
    
    log "Kubernetes version: $k8s_version"
    
    # Calculate supported versions using n-3 policy (current + 3 prior minor versions)
    local major=$(echo "$k8s_version" | cut -d. -f1)
    local minor=$(echo "$k8s_version" | cut -d. -f2)
    
    declare -a versions=()
    for i in {0..3}; do
        local current_minor=$((minor - i))
        if [ $current_minor -ge 0 ]; then
            versions+=("$major.$current_minor.x")
        fi
    done
    
    # Format as version range (e.g., "1.34.x - 1.31.x")
    last_index=$(( ${#versions[@]} - 1 ))
    local version_range="${versions[0]} - ${versions[$last_index]}"
    
    log "Supported Kubernetes versions: $version_range"
    
    # Extract Helm minor version for table entry (e.g., v3.17.0 -> 3.17)
    local helm_minor=$(echo "$latest_helm" | sed -E 's/^v([0-9]+\.[0-9]+)\..*$/\1/')
    
    # Return both values separated by pipe for parsing
    echo "$helm_minor.x|$version_range"
}

# =============================================================================
# UPDATE FUNCTIONS
# =============================================================================

# Get all version_skew.md files (English and translations)
get_version_skew_files() {
    local files=(
        "./docs/topics/version_skew.mdx"
        "./versioned_docs/version-3/topics/version_skew.md"
        "./i18n/ko/docusaurus-plugin-content-docs/version-3/topics/version_skew.md"
        "./i18n/uk/docusaurus-plugin-content-docs/version-3/topics/version_skew.md"
        "./i18n/zh/docusaurus-plugin-content-docs/version-3/topics/version_skew.md"
    )

    # Only return files that exist
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo "$file"
        fi
    done
}

# Update a single version skew file
update_single_version_skew_file() {
    local helm_version="$1"
    local k8s_versions="$2"
    local file="$3"

    log "Updating $file"

    # Verify the target file exists
    if [ ! -f "$file" ]; then
        warn "Version skew file not found: $file (skipping)"
        return 0
    fi

    # Check if this Helm version already exists in the table
    if grep -q "| $helm_version " "$file"; then
        log "  Helm version $helm_version already exists in table, updating..."
        # Update existing entry - replace the entire row
        # Use portable sed syntax that works with both GNU and BSD sed
        if [ $(uname -s) = "Darwin" ]; then
            sed -i '' "s/| $helm_version .*|/| $helm_version       | $k8s_versions               |/" "$file"
        else
            sed -i "s/| $helm_version .*|/| $helm_version       | $k8s_versions               |/" "$file"
        fi
    else
        log "  Adding new Helm version $helm_version to table..."
        # Add new entry at the top of the table (after the header and separator)
        # Find the table separator line (works for all languages since headers are translated)
        # Pattern matches: |--------------|-------------------------------|
        local separator_line=$(grep -n "^|[-]*|[-]*|$" "$file" | head -1 | cut -d: -f1)
        if [ -z "$separator_line" ]; then
            error "Could not find table separator in $file"
            return 1
        fi

        # Insert after the separator line
        local insert_line=$((separator_line + 1))
        # Use portable sed syntax for insert operation
        if [ $(uname -s) = "Darwin" ]; then
            sed -i '' "${insert_line}i\\
| $helm_version       | $k8s_versions               |
" "$file"
        else
            sed -i "${insert_line}i\\
| $helm_version       | $k8s_versions               |
" "$file"
        fi
    fi

    log "  ✅ Successfully updated $file"
}

# Update the version skew compatibility table with new Helm/Kubernetes version info
update_version_skew_table() {
    local helm_version="$1"
    local k8s_versions="$2"

    log "Updating version skew tables for Helm $helm_version -> Kubernetes $k8s_versions"

    # Get all version skew files
    local files=$(get_version_skew_files)

    if [ -z "$files" ]; then
        error "No version skew files found"
        return 1
    fi

    local file_count=$(echo "$files" | wc -l)
    log "Found $file_count version_skew.md file(s) to update"

    # Update each file
    while IFS= read -r file; do
        if ! update_single_version_skew_file "$helm_version" "$k8s_versions" "$file"; then
            error "Failed to update $file"
            return 1
        fi
    done <<< "$files"

    log "✅ Successfully updated all version skew tables"
}

# =============================================================================
# MAIN EXECUTION LOGIC
# =============================================================================

# Main function that orchestrates the version skew update process
main() {
    log "🔄 Starting Kubernetes version skew update process..."
    
    # Get Helm version and corresponding Kubernetes version range
    local result=$(get_helm_clientgo_version)
    
    if [ $? -ne 0 ]; then
        error "Failed to get Helm client-go version information"
        exit 1
    fi
    
    # Parse the results
    local helm_version=$(echo "$result" | cut -d'|' -f1)
    local k8s_versions=$(echo "$result" | cut -d'|' -f2)
    
    log "Processing: Helm $helm_version supports Kubernetes $k8s_versions"
    
    # Update the documentation table
    if update_version_skew_table "$helm_version" "$k8s_versions"; then
        # Check if there were any actual changes made
        local files=$(get_version_skew_files)
        local has_changes=false

        while IFS= read -r file; do
            if ! git diff --quiet "$file" 2>/dev/null; then
                has_changes=true
                break
            fi
        done <<< "$files"

        if [ "$has_changes" = false ]; then
            log "ℹ️  No changes needed to version skew documentation"
        else
            log "✅ Version skew documentation updated successfully"
        fi
        exit 0
    else
        error "Failed to update version skew documentation"
        exit 1
    fi
}

# Run main function
main "$@"