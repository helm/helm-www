ARG HUGO_VERSION=
FROM hugomods/hugo:node-${HUGO_VERSION}

WORKDIR /src

RUN apk update && apk add --no-cache make curl bash

COPY . .

RUN npm install

EXPOSE 1313

ENTRYPOINT ["make"]
