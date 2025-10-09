import React from 'react';
import Head from '@docusaurus/Head';
import {useBlogListPageStructuredData} from '@docusaurus/plugin-content-blog/client';
export default function BlogListPageStructuredData(props) {
  const structuredData = useBlogListPageStructuredData(props);
  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}
