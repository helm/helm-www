FROM hugomods/hugo:node

WORKDIR /src

RUN apk update && apk add --no-cache make curl bash

RUN npm install yarn

COPY . .

RUN npx yarn install

EXPOSE 1313

ENTRYPOINT ["make"]
