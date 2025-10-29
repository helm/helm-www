#!/usr/bin/env bash
set -e

# Extract major version from a version string (e.g., v3.19.0 -> 3, v4.0.0-alpha.1 -> 4)
get_major_version() {
    local version="$1"
    echo "$version" | sed 's/^v\([0-9]\+\).*/\1/'
}

# get_helm_latest: prints vMAJOR.MINOR.PATCH or fails
get_helm_latest() {
  local v
  v="$(curl -fsSL "https://get.helm.sh" | grep -Eo 'v[0-9]+\.[0-9]+\.[0-9]+' | head -n1)"
  [ -n "$v" ] && echo "$v" || { echo "error: no version found" >&2; return 1; }
}

# Determine version to use: argument or latest
HELM_VERSION="${1:-$(get_helm_latest)}"
MAJOR_VERSION="$(get_major_version "$HELM_VERSION")"

# Determine documentation directory based on versioning strategy
# Pre-release v4 docs live in docs/, released versions live in versioned_docs/
# Assumes we will create versioned_docs/version-4 after releasing v4.0.0
if [[ "$MAJOR_VERSION" == "4" && ! -d "versioned_docs/version-4" ]]; then
    VERSION_DIR="docs"
else
    VERSION_DIR="versioned_docs/version-${MAJOR_VERSION}"
fi

echo "Using Helm version: $HELM_VERSION"
echo "Major version: $MAJOR_VERSION"
echo "Documentation directory: $VERSION_DIR"

# run before renaming categories
# arg 1 (optional): helm binary version (eg, v3.19.0, v4.0.0-alpha.1, etc). defaults to latest
function regenerate_docs() {
    export DESIRED_VERSION="$HELM_VERSION"
    local tmpdir=$(mktemp -d)
    pushd $tmpdir
    export HELM_INSTALL_DIR=$(pwd)
    curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
    chmod +x get_helm.sh
    ./get_helm.sh
    # set env vars to match linux environments (the helm-www docs default)
    export HOME='~'
    export HELM_CACHE_HOME='~/.cache/helm'
    export HELM_CONFIG_HOME='~/.config/helm'
    export HELM_DATA_HOME='~/.local/share/helm'
    popd
    mkdir -p "$VERSION_DIR/helm"
    pushd "$VERSION_DIR/helm"
    "$tmpdir/helm" docs --type markdown --generate-headers
    popd
}

regenerate_docs
