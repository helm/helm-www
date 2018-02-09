VERSION ?= latest
IMAGE := quay.io/deis/helmsh:${VERSION}

docker-build:
	docker build \
	  --build-arg BUILD_DATE=`date -u +'%Y-%m-%dT%H:%M:%SZ'` \
	  -t ${IMAGE} rootfs

docker-push:
	docker push ${IMAGE}

test:
	echo "no tests"
