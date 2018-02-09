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
    | tar --no-same-owner -C /usr/bin/ -xz caddy \
 && chmod 0755 /usr/bin/caddy \
 && /usr/bin/caddy -version

COPY . /

EXPOSE 2015

USER caddy
ENTRYPOINT ["/usr/bin/caddy"]
CMD ["--conf", "/etc/caddy/Caddyfile", "--log", "stdout"]
