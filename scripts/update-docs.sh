#!/bin/bash
#
# Helm Documentation Update Script
#
# This script automatically updates the Helm website (helm.sh) with the latest
# release information for versions of Helm. It performs the following tasks:
#
# 1. Fetches the latest stable releases from GitHub API
# 2. Compares with current versions in docusaurus.config.js
# 3. Updates version references if a new significant release is found
# 4. For v3 updates: also updates go.mod dependencies and CLI documentation
# 5. For v2 updates: only updates version references (legacy support)
#
# Usage: ./update-docs.sh <v2|v3>
#
# The script only updates for significant releases (minor version bumps or
# newer patch versions). It creates backups and validates all changes before
# committing them.
#
# Dependencies: curl, jq, node (for CLI docs), go (for v3 go.mod updates)
#
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validate command line arguments
if [ $# -ne 1 ] || { [ "$1" != "v2" ] && [ "$1" != "v3" ]; }; then
    echo -e "${RED}Usage: $0 <v2|v3>${NC}"
    echo -e "${YELLOW}Specify either 'v2' or 'v3' to update only that major version${NC}"
    exit 1
fi

# Global configuration
VERSION="$1"                # Version to update (v2 or v3)
PRIMARY_VERSION="v3"        # Primary version for go.mod and CLI docs

echo -e "${GREEN}🔄 Starting Helm documentation update process for $VERSION only...${NC}"

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Logging functions with timestamps and color coding
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Compare semantic versions - returns 0 if $1 > $2
version_gt() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

# Extract major.minor version from full version string (e.g., v3.15.2 -> 3.15)
get_major_minor() {
    echo "$1" | sed -E 's/^v([0-9]+\.[0-9]+)\..*$/\1/'
}

# =============================================================================
# DATA RETRIEVAL FUNCTIONS
# =============================================================================

# Fetch all stable releases from GitHub API (excludes pre-releases)
get_latest_releases() {
    log "Fetching latest releases from GitHub API..."

    # Get releases and filter out pre-releases
    local api_response
    curl -s "https://api.github.com/repos/helm/helm/releases?per_page=100" | jq -r '.[] | select(.prerelease == false) | .tag_name'
}

# Get current version for the specified major version from docusaurus.config.js
get_current_version() {
    # Extract the major version number (2 or 3 from v2 or v3)
    local major_version="${VERSION:1}"

    # For v2, look for something like: 2: { label: "2.17.0"
    # For v3, look for: 3 something like: { label: "3.19.0"
    # Note: Using [[:space:]] instead of \s for better compatibility
    grep -E "^[[:space:]]*${major_version}:[[:space:]]*\{[[:space:]]*label:[[:space:]]*\"" docusaurus.config.js | \
        sed -E 's/.*label:[[:space:]]*"([0-9]+\.[0-9]+\.[0-9]+)".*/\1/'
}

# Check if we're updating the primary version (which requires additional updates)
is_primary_version() {
    test "$VERSION" == "${PRIMARY_VERSION}"
}

# Get current Helm version from go.mod (only relevant for primary version)
get_current_gomod_version() {
    grep "helm.sh/helm/${PRIMARY_VERSION}" sdkexamples/go.mod | awk '{print $2}' | head -1
}

# =============================================================================
# UPDATE FUNCTIONS
# =============================================================================

# Update version reference in docusaurus.config.js with backup and validation
update_config_version() {
    local old_version="$1"
    local new_version="$2"
    local major_version="${VERSION:1}"

    # Strip 'v' prefix from versions if present (GitHub API returns v3.19.0, but config has 3.19.0)
    old_version="${old_version#v}"
    new_version="${new_version#v}"

    log "Updating docusaurus.config.js $VERSION version from $old_version to $new_version"

    # Create a backup
    cp docusaurus.config.js docusaurus.config.js.bak

    # Update the version in docusaurus.config.js
    # This replaces patterns like: 3: { label: "3.19.0" }
    # Note: Using [[:space:]] instead of \s for better compatibility across sed implementations
    cat docusaurus.config.js.bak | sed -E "s/^([[:space:]]*${major_version}:[[:space:]]*\{[[:space:]]*label:[[:space:]]*\")${old_version}(\".*)$/\1${new_version}\2/" > docusaurus.config.js

    # Verify the change
    if grep -q "label: \"$new_version\"" docusaurus.config.js; then
        log "✅ Successfully updated docusaurus.config.js"
        rm -f docusaurus.config.js.bak
        return 0
    else
        error "Failed to update docusaurus.config.js"
        mv docusaurus.config.js.bak docusaurus.config.js
        return 1
    fi
}

# Update Go module dependencies to use the new Helm version (v3 only)
update_gomod() {
    local new_version="$1"

    log "Updating sdkexamples/go.mod to Helm $new_version"

    cd sdkexamples

    # Update the go.mod file to require the new version
    go mod edit -require="helm.sh/helm/${PRIMARY_VERSION}@$new_version"
    go mod tidy  # Clean up dependencies

    cd ..

    log "✅ Successfully updated go.mod"
}

# Generate fresh CLI documentation using regenerate-cli-docs.mjs (v3 only)
update_helm_docs() {
    local new_version="$1"

    log "Updating Helm CLI documentation..."

    # Check if node is available
    if ! command -v node &> /dev/null; then
        warn "Node.js not available, skipping documentation update"
        return 0
    fi

    # Determine the target directory based on version
    local target_dir="versioned_docs/version-${VERSION:1}"

    # Run the regenerate-cli-docs.mjs script
    if node scripts/regenerate-cli-docs.mjs "$new_version" "$target_dir"; then
        log "✅ Successfully updated Helm documentation"
    else
        warn "Failed to update Helm documentation, but continuing with other updates"
    fi
}

# =============================================================================
# MAIN EXECUTION LOGIC
# =============================================================================

# Main function that orchestrates the update process
main() {
    local changes_made=false

    local current_version=$(get_current_version)
    local current_gomod=$(get_current_gomod_version)

    # Display current state
    log "Current versions:"
    log "  $VERSION in docusaurus.config.js: $current_version"
    if is_primary_version; then
        log "  $VERSION in go.mod: $current_gomod"
    fi

    # Find the latest stable release for this major version
    local latest_version=$(get_latest_releases | grep "^${VERSION}\." | head -1)

    log "Latest releases found:"
    log "  ${VERSION}: $latest_version"

    # Determine if an update is needed and perform it
    if [ -n "$latest_version" ] && [ "$latest_version" != "$current_version" ]; then
        # Check if this is a new minor release (not just patch)
        local current_minor=$(get_major_minor "$current_version")
        local latest_minor=$(get_major_minor "$latest_version")

        # Only update for significant releases (minor bumps or newer patches)
        if [ "$current_minor" != "$latest_minor" ] || version_gt "$latest_version" "$current_version"; then
            log "🔄 New ${VERSION} release detected: $latest_version (current: $current_version)"

            # Update the version in docusaurus.config.js
            if update_config_version "$current_version" "$latest_version"; then
                changes_made=true

                # For primary version (v3), also update go.mod and documentation
                if is_primary_version; then
                    # Update go.mod dependencies if version differs
                    if [ "$latest_version" != "$current_gomod" ]; then
                        update_gomod "$latest_version"
                    fi

                    # Regenerate CLI documentation
                    update_helm_docs "$latest_version"
                fi
            fi
        else
            log "${VERSION} version $latest_version is not a significant update from $current_version"
        fi
    else
        log "No new ${VERSION} releases found or version is already current"
    fi

    # Report final status
    if [ "$changes_made" = true ]; then
        log "✅ Documentation update completed with changes for $VERSION"
        exit 0
    else
        log "ℹ️  No updates needed - $VERSION version is current"
        exit 0
    fi
}

# Run main function
main "$@"
