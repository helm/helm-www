FROM node:22-alpine

WORKDIR /src

# Tools needed by Make targets
RUN apk update && apk add --no-cache make

# Install dependencies with the lockfile for reproducibility
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files
COPY . .

# Docusaurus dev server port
EXPOSE 3000

# Make targets run inside the container (serve, build, etc.)
ENTRYPOINT ["make"]
