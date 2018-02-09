VERSION ?= latest
IMAGE := quay.io/deis/helmsh-docs:${VERSION}

docker-build:
	docker build \
	  --build-arg BUILD_DATE=`date -u +'%Y-%m-%dT%H:%M:%SZ'` \
	  -t ${IMAGE} .

docker-push:
	docker push ${IMAGE}

test:
	docker run ${IMAGE} /usr/local/bin/test
