import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {translate} from '@docusaurus/Translate';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {ThemeClassNames} from '@docusaurus/theme-common';
import IconHome from '@theme/Icon/Home';
import styles from './styles.module.css';

export default function BlogBreadcrumbs() {
  const {metadata} = useBlogPost();
  const {title, permalink} = metadata;
  const homeHref = useBaseUrl('/');

  return (
    <nav className={clsx(ThemeClassNames.docs.docBreadcrumbs, styles.breadcrumbsContainer)} aria-label="breadcrumbs">
      <ul className="breadcrumbs" itemScope itemType="https://schema.org/BreadcrumbList">
        <li className="breadcrumbs__item">
          <Link
            aria-label={translate({
              id: 'theme.docs.breadcrumbs.home',
              message: 'Home page',
              description: 'The ARIA label for the home page in the breadcrumbs',
            })}
            className="breadcrumbs__link"
            href={homeHref}
            itemProp="item"
          >
            <IconHome className={styles.breadcrumbHomeIcon} />
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        <li className="breadcrumbs__item">
          <Link
            className="breadcrumbs__link"
            to="/blog"
            itemProp="item"
          >
            <span itemProp="name">Blog</span>
          </Link>
          <meta itemProp="position" content="2" />
        </li>
        <li className="breadcrumbs__item breadcrumbs__item--active">
          <span className="breadcrumbs__link" itemProp="name">
            {title}
          </span>
          <meta itemProp="position" content="3" />
        </li>
      </ul>
    </nav>
  );
}