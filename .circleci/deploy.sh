#!/usr/bin/env bash

# Bash 'Strict Mode'
# http://redsymbol.net/articles/unofficial-bash-strict-mode
set -euo pipefail

VERSION=
if [[ -n "${CIRCLE_TAG:-}" ]]; then
  VERSION="${CIRCLE_TAG}"
elif [[ "${CIRCLE_BRANCH:-}" == "master" ]]; then
  VERSION="canary"
else
  echo "Skipping deploy step; this is neither master or a tag"
  exit
fi

deploy_helm_sh() {
  make -C helm.sh docker-push VERSION="${VERSION}"
}

deploy_docs_helm_sh() {
  make -C docs.helm.sh docker-push VERSION="${VERSION}"
}

case "${CIRCLE_NODE_INDEX}" in
  0) deploy_helm_sh   ;;
  1) deploy_docs_helm_sh ;;
esac
