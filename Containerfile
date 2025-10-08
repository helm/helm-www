FROM node:20-alpine

WORKDIR /src

# Tools needed by Make targets
RUN apk update && apk add --no-cache make

# Use existing Yarn; install deps with lockfile for reproducibility
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy project files
COPY . .

# Docusaurus dev server port
EXPOSE 3000

# Make targets run inside the container (serve, build, etc.)
ENTRYPOINT ["make"]
