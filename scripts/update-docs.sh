#!/bin/bash
#
# Helm Documentation Update Script
#
# This script automatically updates the Helm website (helm.sh) with the latest
# release information for versions of Helm. It performs the following tasks:
#
# 1. Fetches the latest stable releases from GitHub API
# 2. Compares with current versions in config.toml
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
# Dependencies: curl, jq, docker (for CLI docs), go (for v3 go.mod updates)
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

# Get current version for the specified major version from config.toml
get_current_version() {
    REGEX="version = \"${VERSION}\."
    grep -A 1 "${REGEX}" config.toml | head -1 | sed -E 's/.*version = "([^"]+)".*/\1/'
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

# Update version reference in Hugo config.toml with backup and validation
update_config_version() {
    local old_version="$1"
    local new_version="$2"
    
    log "Updating config.toml $VERSION version from $old_version to $new_version"
    
    # Create a backup
    cp config.toml config.toml.bak

    # Update the version in config.toml
    cat config.toml.bak | sed "s/version = \"$old_version\"/version = \"$new_version\"/" >config.toml
    
    # Verify the change
    if grep -q "version = \"$new_version\"" config.toml; then
        log "✅ Successfully updated config.toml"
        rm -f config.toml.bak
        return 0
    else
        error "Failed to update config.toml"
        mv config.toml.bak config.toml
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

# Generate fresh CLI documentation using Docker (v3 only)
# This uses the get-helm-3 script to install the latest Helm and generate docs
update_helm_docs() {
    log "Updating Helm CLI documentation..."
    
    # Check if docker is available
    if ! command -v docker &> /dev/null; then
        warn "Docker not available, skipping documentation update"
        return 0
    fi
    
    # Run the docker command to update docs with better error handling
    if docker run --rm -v "$(pwd):/output" --entrypoint /bin/bash ubuntu:latest -c "
        set -e
        apt-get update -qq && apt-get install -y -qq curl ca-certificates
        curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
        export HOME='~'
        /usr/local/bin/helm docs --type markdown --generate-headers --dir /output/content/en/docs/helm/ || true
    "; then
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
    log "  $VERSION in config.toml: $current_version"
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
            
            # Update the version in config.toml
            if update_config_version "$current_version" "$latest_version"; then
                changes_made=true
                
                # For primary version (v3), also update go.mod and documentation
                if is_primary_version; then
                    # Update go.mod dependencies if version differs
                    if [ "$latest_version" != "$current_gomod" ]; then
                        update_gomod "$latest_version"
                    fi
                
                    # Regenerate CLI documentation
                    update_helm_docs
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
