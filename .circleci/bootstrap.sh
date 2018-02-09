#!/usr/bin/env bash

# Bash 'Strict Mode'
# http://redsymbol.net/articles/unofficial-bash-strict-mode
set -euo pipefail

apt-get update && apt-get install -yq curl make

echo "Install docker client"
VER="17.03.0-ce"
curl -L https://get.docker.com/builds/Linux/x86_64/docker-$VER.tgz | tar -xz -C /tmp
mv /tmp/docker/* /usr/bin
