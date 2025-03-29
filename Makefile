ifeq ($(UNAME),Darwin)
     SHELL := /opt/local/bin/bash
     OS_X  := true
 else ifneq (,$(wildcard /etc/redhat-release))
     OS_RHEL := true
 else
     OS_DEB  := true
     SHELL := /bin/bash
 endif 
.DEFAULT_GOAL := help
MAKEFLAGS := --jobs=1
## Available commands:
help:           ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

clean:          ## Remove generated files and directories.
	rm -rf app resources

build: ## Build the site with Hugo and run link check.
	clean
	hugo --minify
	make check-links-ci

build-preview: ## Build the site for preview.
	clean
	hugo \
	--baseURL $(DEPLOY_PRIME_URL) \
	--buildDrafts \
	--buildFuture \
	--minify

	make check-links-ci

set-up-link-checker: ## Set up link checker.
	curl https://raw.githubusercontent.com/wjdp/htmltest/master/godownloader.sh | bash

run-link-checker: ## Run link checker.
	bin/htmltest

check-links-ci: ## Run link checker CI.
	set-up-link-checker 
	run-link-checker

.PHONY: sdkexamples
sdkexamples: ## Build SDK examples.
	make -C sdkexamples

serve: ## Serve the site for local development.
	hugo server --buildDrafts --buildFuture --bind 0.0.0.0

HUGO_VERSION ?= $(shell grep HUGO_VERSION ./netlify.toml | head -1 | cut -d '"' -f 2)

IMAGE_NAME ?= helm-docs

image: ## Build the Docker image.
	docker build --build-arg HUGO_VERSION=$(HUGO_VERSION) -t $(IMAGE_NAME) .

# Extract the target after 'image-run' or default to 'serve'
DOCKER_TARGET = $(if $(filter-out image-run,$(MAKECMDGOALS)),$(filter-out image-run,$(MAKECMDGOALS)),serve)

image-run: ## Run the Docker image.
	docker run --rm --init -it -p 1313:1313 -v $(PWD):/src $(IMAGE_NAME) $(DOCKER_TARGET)
