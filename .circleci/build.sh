#!/usr/bin/env bash

# Bash 'Strict Mode'
# http://redsymbol.net/articles/unofficial-bash-strict-mode
set -euo pipefail

VERSION=
if [[ -n "${CIRCLE_PR_NUMBER:-}" ]]; then
  VERSION="pr-${CIRCLE_PR_NUMBER}"
elif [[ -n "${CIRCLE_TAG:-}" ]]; then
  VERSION="${CIRCLE_TAG}"
elif [[ "${CIRCLE_BRANCH:-}" == "master" ]]; then
  VERSION="canary"
else
  VERSION="${CIRCLE_BRANCH}"

build_helm_sh() {
  make -C helm.sh docker-build VERSION="${VERSION}"
}

build_docs_helm_sh() {
  make -C docs.helm.sh docker-build VERSION="${VERSION}"
}

case "${CIRCLE_NODE_INDEX}" in
  0) build_helm_sh   ;;
  1) build_docs_helm_sh ;;
esac
