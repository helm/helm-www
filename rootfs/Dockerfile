FROM alpine:3.5

ARG plugins=cors,git,ipfilter,minify,prometheus
ARG BUILD_DATE

RUN apk upgrade --no-cache --available \
  && apk add --no-cache \
    ca-certificates \
    curl \
    libcap \
    libressl \
    openssh-client \
    tar \
  && adduser -D -u 1000 caddy

RUN curl --silent --show-error --fail --location \
      --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
      "https://caddyserver.com/download/build?os=linux&arch=amd64&features=${plugins}" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy \
 && chmod 0755 /usr/bin/caddy \
 && /usr/bin/caddy -version \
 && setcap 'cap_net_bind_service=+ep' /usr/bin/caddy

COPY _build /svc

EXPOSE 80 443 2015

USER caddy
ENTRYPOINT ["/usr/bin/caddy"]
CMD ["--conf", "/etc/caddy/Caddyfile", "--log", "stdout"]
