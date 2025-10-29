import React from 'react';
import Head from '@docusaurus/Head';
import {useBreadcrumbsStructuredData} from '@docusaurus/plugin-content-docs/client';
export default function DocBreadcrumbsStructuredData(props) {
  const structuredData = useBreadcrumbsStructuredData({
    breadcrumbs: props.breadcrumbs,
  });
  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}
