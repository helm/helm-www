FROM betterweb/hugo

WORKDIR /app

RUN npm install yarn

COPY . .

RUN yarn install

CMD ["-p", "8080", "--bind", "0.0.0.0"]

ENTRYPOINT ["hugo", "serve"]
