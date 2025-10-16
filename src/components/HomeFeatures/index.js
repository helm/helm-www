import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import homeSections from "@site/src/css/home-sections.module.css";
import homeCards from "@site/src/css/home-cards.module.css";

const FeatureList = [
  {
    title: "Manage Complexity",
    description: (
      <>
        Charts describe even the most complex apps, provide repeatable
        application installation, and serve as a single point of authority.
      </>
    ),
  },
  {
    title: "Easy Updates",
    description: (
      <>Take the pain out of updates with in-place upgrades and custom hooks.</>
    ),
  },
  {
    title: "Simple Sharing",
    description: (
      <>
        Charts are easy to version, share, and host on public or private
        servers.
      </>
    ),
  },
  {
    title: "Rollbacks",
    description: (
      <>
        Use <code>helm rollback</code> to roll back to an older version of a
        release with ease.
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx("col col--3", homeCards.col)}>
      <div className={clsx("card", homeCards.card)}>
        <div className={clsx("card__header", homeCards.card__header)}>
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomeFeatures() {
  return (
    <section
      className={clsx(
        homeSections.section,
        homeSections.sectionLight,
        styles.features
      )}
    >
      <div className="container">
        <Heading as="h2">Features</Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
