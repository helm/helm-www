import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";

import EditMetaRow from "@theme/EditMetaRow";
export default function DocItemFooter() {
  const { metadata } = useDoc();
  const { editUrl, lastUpdatedAt, lastUpdatedBy } = metadata;

  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
  const canDisplayFooter = canDisplayEditMetaRow;
  if (!canDisplayFooter) {
    return null;
  }
  return (
    <footer
      className={clsx(ThemeClassNames.docs.docFooter, "docusaurus-mt-lg")}
    >
      {canDisplayEditMetaRow && (
        <EditMetaRow
          className={clsx(
            "margin-top--sm",
            ThemeClassNames.docs.docFooterEditMetaRow
          )}
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
        />
      )}
    </footer>
  );
}
