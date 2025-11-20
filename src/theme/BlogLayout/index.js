import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import {ThemeClassNames, useWindowSize} from '@docusaurus/theme-common';
import BackToTopButton from '@theme/BackToTopButton';
import TOC from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import styles from './styles.module.css';

// Create mobile and desktop TOC like docs do
function useBlogTOC(toc, frontMatter = {}) {
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc && toc.length > 0;

  const mobile = canRender ? (
    <TOCCollapsible
      toc={toc}
      minHeadingLevel={frontMatter.toc_min_heading_level}
      maxHeadingLevel={frontMatter.toc_max_heading_level}
      className={clsx(ThemeClassNames.docs.docTocMobile, styles.tocMobile)}
    />
  ) : undefined;

  const desktop = canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
    <TOC
      toc={toc}
      minHeadingLevel={frontMatter.toc_min_heading_level}
      maxHeadingLevel={frontMatter.toc_max_heading_level}
    />
  ) : undefined;

  return { hidden, mobile, desktop };
}

export default function BlogLayout(props) {
  const {sidebar, toc, children, frontMatter, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  const blogTOC = useBlogTOC(toc, frontMatter);

  return (
    <Layout {...layoutProps}>
      <div className={styles.docsWrapper}>
        <BackToTopButton />
        <div className={styles.docRoot}>
          {hasSidebar && (
            <aside
              className={clsx(
                ThemeClassNames.docs.docSidebarContainer,
                styles.docSidebarContainer,
              )}>
              <div className={styles.sidebarViewport}>
                <BlogSidebar sidebar={sidebar} />
              </div>
            </aside>
          )}
          <main
            className={clsx(
              styles.docMainContainer,
              !hasSidebar && styles.docMainContainerEnhanced,
            )}>
            <div
              className={clsx(
                'container padding-top--md padding-bottom--lg',
                styles.docItemWrapper,
                !hasSidebar && styles.docItemWrapperEnhanced,
              )}>
              <div className={clsx('row', styles.docItemRow)}>
                <div className={clsx('col', styles.docItemCol)}>
                  {blogTOC.mobile}
                  {children}
                </div>
                {blogTOC.desktop && (
                  <div className={clsx('col col--3', styles.tocWrapper)}>
                    {blogTOC.desktop}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
