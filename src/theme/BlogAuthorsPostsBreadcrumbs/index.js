import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {translate} from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {translateBlogAuthorsListPageTitle} from '@docusaurus/theme-common/internal';
import {useBlogMetadata} from '@docusaurus/plugin-content-blog/client';
import IconHome from '@theme/Icon/Home';
import styles from './styles.module.css';

export default function BlogAuthorsPostsBreadcrumbs({author}) {
  const homeHref = useBaseUrl('/');
  const {blogBasePath, authorsListPath} = useBlogMetadata();

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
            href={useBaseUrl(blogBasePath)}
            itemProp="item"
          >
            <span itemProp="name">
              {translate({
                id: 'theme.blog.list.pageTitle',
                message: 'Blog',
                description: 'The word "Blog" in breadcrumbs'
              })}
            </span>
          </Link>
          <meta itemProp="position" content="2" />
        </li>
        <li className="breadcrumbs__item">
          <Link
            className="breadcrumbs__link"
            href={useBaseUrl(authorsListPath)}
            itemProp="item"
          >
            <span itemProp="name">
              {translateBlogAuthorsListPageTitle()}
            </span>
          </Link>
          <meta itemProp="position" content="3" />
        </li>
        <li className="breadcrumbs__item breadcrumbs__item--active">
          <span className="breadcrumbs__link" itemProp="name">
            {author.name}
          </span>
          <meta itemProp="position" content="4" />
        </li>
      </ul>
    </nav>
  );
}
