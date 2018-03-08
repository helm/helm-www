const { events, Job, Group } = require("brigadier");

const timeout = 600000 * 20;

events.on("exec", (e, p) => {
  const docsOut = "/mnt/brigade/share/docs.helm.sh"
  const helmOut = "/mnt/brigade/share/helm.sh"
  const bucket  = "https://docshelmshtest.blob.core.windows.net/docshelmtest"

  // This job renders docs.helm.sh
  const buildDocs = new Job("docs-helm-sh", "node:9");
  buildDocs.timeout = timeout
  buildDocs.storage.enabled = true
  buildDocs.env = {
    HUGO_VERSION: "0.36"
  }
  buildDocs.tasks = [
    "apt-get update -y && apt-get install -yq ruby ruby-dev",
    "gem install sass",
    "curl -L https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz | tar -xz -C /usr/local/bin hugo",
    "cd /src/docs.helm.sh",
    "yarn install",
    "$(yarn bin)/gulp clonedocs",
    "$(yarn bin)/gulp build",
    `mkdir -p ${docsOut}`,
    `hugo -d ${docsOut}`,
  ];

  // This job renders helm.sh
  const buildHelmSh = new Job("helm-sh", "node:9");
  buildHelmSh.timeout = timeout
  buildHelmSh.storage.enabled = true
  buildHelmSh.tasks = [
    "apt-get update -y && apt-get install -yq ruby ruby-dev",
    "npm install -g gulp",
    "gem install bundler",
    "gem install nokogiri -v '1.8.1'", // This is a temporary fix for an install problem
    "cd /src/helm.sh/",
    "bundle install",
    "npm install",
    "gulp",
    `mkdir -p ${helmOut}`,
    `bundle exec jekyll build -d ${helmOut}`
  ];

  // This job uploads all of the rendered resources into Azure Blob Storage
  const az = new Job("az", "azuresdk/azure-cli-python:latest")
  az.storage.enabled = true
  az.env = {
    AZURE_STORAGE_CONNECTION_STRING: p.secrets.bucketConnectionString
  }
  az.tasks = [
    `cd ${helmOut}`,
    `az storage blob upload-batch --destination helm-sh --source ${helmOut}`,
    `cd ${docsOut}`,
    `az storage blob upload-batch --destination docs-helm-sh --source ${docsOut}`
  ];

  // Run buildDocs and buildHelmSh in parallel because they can safely share the
  // same storage space, then run az once and upload all the things.
  Group.runAll([buildDocs, buildHelmSh]).then(() => az.run());
});
