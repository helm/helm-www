import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {translate} from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import IconHome from '@theme/Icon/Home';
import styles from './styles.module.css';

export default function BlogListBreadcrumbs() {
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
        <li className="breadcrumbs__item breadcrumbs__item--active">
          <span className="breadcrumbs__link" itemProp="name">
            Blog
          </span>
          <meta itemProp="position" content="2" />
        </li>
      </ul>
    </nav>
  );
}