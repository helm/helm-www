clean:
	rm -rf app resources

build:
	hugo --minify

set-up-link-checker:
	curl https://raw.githubusercontent.com/wjdp/htmltest/master/godownloader.sh | bash

run-link-checker:
	bin/htmltest

check-links: clean build set-up-link-checker run-link-checker
