import { useVersions } from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";

/**
 * Component to find and return the label for a specific major version as a raw string.
 * @param {object} props
 * @param {string} props.majorVersion The major version number to find (e.g., "4")
 * @param {boolean} props.label Whether or not to return the configured Docusaurus label for this major version or just the SemVer string
 * @param {boolean} props.link Whether or not to wrap the version-or-label in the link to the GitHub release for this version
 */
export default function GetVersion({ majorVersion, label, link }) {
  const versions = useVersions();

  // Official SemVer 2.0.0 ECMA-compatible RegEx
  // ref: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
  // Example: a label like "4.0.0-rc.1 🚧" has a SemVer match array like:
  // 0: "4.0.0-rc.1"
  // 1: "4"
  // 2: "0"
  // 3: "0"
  // 4: "rc.1"
  const semverRegex =
    /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/;

  let SemVerMatch = null;
  let ReturnValue = null;
  const targetVersion = versions.find((version) => {
    const match = version.label.match(semverRegex);

    if (match) {
      const extractedMajor = match[1];
      if (extractedMajor === majorVersion) {
        SemVerMatch = match[0];
        return true;
      }
    }
    return false;
  });

  if (!targetVersion) {
    return `${majorVersion}.x (not found)`;
  }

  if (label) {
    // Return the string value of the label
    ReturnValue = targetVersion.label;
  } else {
    // Return only the SemVer
    ReturnValue = `v${SemVerMatch}`;
  }

  if (link) {
    return (
      <Link href={`https://github.com/helm/helm/releases/tag/v${SemVerMatch}`}>
        {ReturnValue}
      </Link>
    );
  } else {
    return ReturnValue;
  }
}
