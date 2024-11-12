clean:
	rm -rf app resources

build: clean
	hugo --minify

	make check-links-ci

build-preview: clean
	hugo \
	--baseURL $(DEPLOY_PRIME_URL) \
	--buildDrafts \
	--buildFuture \
	--minify

	make check-links-ci

set-up-link-checker:
	curl https://raw.githubusercontent.com/wjdp/htmltest/master/godownloader.sh | bash

run-link-checker:
	bin/htmltest

check-links-ci: set-up-link-checker run-link-checker

serve:
	hugo server --buildDrafts --buildFuture --bind 0.0.0.0

image:
	docker build -t helm-docs .

# Extract the target after 'image-run' or default to 'serve'
DOCKER_TARGET = $(if $(filter-out image-run,$(MAKECMDGOALS)),$(filter-out image-run,$(MAKECMDGOALS)),serve)

image-run:
	docker run --rm --init -it -p 1313:1313 -v $(PWD):/src helm-docs $(DOCKER_TARGET)
