#!/bin/bash

# Abort if anything messes up, namely to avoid `git reset --hard` in our working repo
# or `rsync --delete`ing valid doc templates
set -e

# Init submodules
git submodule update --init --recursive

pushd scripts/update-docs/

# Ensure we've created our temp doc directory, but don't fail if we have already
mkdir .tmp.docs || :

# Make sure the submodule is pointing at master; note this may introduce pending changes 
pushd helm
git fetch
git reset --hard origin/master
helm docs --type=markdown --dir ../.tmp.docs
popd
rsync --recursive --delete ./.tmp.docs/ ../../content/en/docs/helm/
popd 

echo Docs updated.