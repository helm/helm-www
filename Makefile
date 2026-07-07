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
