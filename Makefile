SITE_URL := http://localhost:3000
BASE_URL := /

clean:
	rm -rf node_modules/ build/ .docusaurus .cache-loader

install:
	yarn install --frozen-lockfile

build: clean install
	SITE_URL=$(SITE_URL) BASE_URL=$(BASE_URL) yarn run build

# Cache-friendly install - only runs if dependencies missing or yarn.lock is newer
install-if-needed:
	@if [ ! -f "node_modules/.bin/docusaurus" ] || [ "yarn.lock" -nt "node_modules" ]; then \
		echo "Installing dependencies..."; \
		yarn install --frozen-lockfile; \
	else \
		echo "Dependencies up to date, skipping install"; \
	fi

# Cache-friendly build for Netlify - preserves cached directories
netlify-build: install-if-needed
	SITE_URL=$(SITE_URL) BASE_URL=$(BASE_URL) yarn run build

.PHONY: sdkexamples
sdkexamples:
	make -C sdkexamples

serve:
	SITE_URL=$(SITE_URL) BASE_URL=$(BASE_URL) yarn run start --host 0.0.0.0

IMAGE_NAME ?= helm-www

image:
	podman build -t $(IMAGE_NAME) -f Containerfile .

# Default target executed inside the container if none specified
CONTAINER_TARGET = $(if $(filter-out image-run,$(MAKECMDGOALS)),$(filter-out image-run,$(MAKECMDGOALS)),serve)

# Podman run: pass env for both build and serve targets
image-run: image
	podman run --rm --init -it \
		-p 3000:3000 \
		-v $(PWD):/src:Z \
		-e BASE_URL="$(BASE_URL)" \
		-e SITE_URL="$(SITE_URL)" \
		--name $(IMAGE_NAME)-run \
		$(IMAGE_NAME) $(CONTAINER_TARGET)
