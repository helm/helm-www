FROM node:9 AS build

RUN apt-get update -y && apt-get install -yq ruby ruby-dev
RUN gem install sass
RUN yarn global add gulp
ENV HUGO_VERSION=0.36
RUN curl -L https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz | tar -xz -C /usr/local/bin hugo
WORKDIR /app
COPY rootfs /
COPY . /app
RUN yarn install
RUN gulp clonedocs
RUN gulp build
RUN hugo -d /public

FROM alpine:3.5
ARG plugins=http.cors,http.ipfilter,http.minify
ARG BUILD_DATE
RUN apk upgrade --no-cache --available \
  && apk add --no-cache \
    bash \
    ca-certificates \
    curl \
    libressl \
    openssh-client \
    tar \
  && adduser -D -u 1000 caddy
RUN curl --silent --show-error --fail --location \
      --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
      "https://caddyserver.com/download/linux/amd64?plugins=${plugins}" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy
RUN chmod 0755 /usr/bin/caddy
COPY rootfs /
COPY --from=build /public /public
EXPOSE 2015
USER caddy
CMD ["/usr/bin/caddy", "--conf", "/etc/caddy/Caddyfile", "--log", "stdout"]
