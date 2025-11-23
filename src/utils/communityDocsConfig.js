// Derive helpers from the community remote docs configuration
function deriveHelpers(communityRemoteDocs) {
  const remoteDocPaths = communityRemoteDocs.map((d) => d.origFilename);
  const metaByPath = communityRemoteDocs.reduce((acc, d) => {
    if (d.meta) acc[d.origFilename] = d.meta;
    return acc;
  }, Object.create(null));
  const slugByPath = communityRemoteDocs.reduce((acc, d) => {
    if (d.meta?.slug) acc[d.origFilename] = d.meta.slug;
    return acc;
  }, Object.create(null));

  return { remoteDocPaths, metaByPath, slugByPath };
}

// Edit URL function for community docs plugin
function createCommunityEditUrl(remoteDocPaths) {
  return ({ versionDocsDirPath, docPath, locale }) => {
    const parts = docPath.split("/");
    const maybeLocale = parts[0];
    const localeStrippedPath =
      locale && maybeLocale === locale
        ? parts.slice(1).join("/")
        : docPath;

    const isRemote = remoteDocPaths.includes(localeStrippedPath);
    if (isRemote) {
      return `https://github.com/helm/community/edit/main/${localeStrippedPath}`;
    }
    return `https://github.com/helm/helm-www/edit/main/${versionDocsDirPath}/${docPath}`;
  };
}

module.exports = {
  deriveHelpers,
  createCommunityEditUrl,
};
