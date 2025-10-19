import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import homeSections from "@site/src/css/home-sections.module.css";
import homeCards from "@site/src/css/home-cards.module.css";
import Translate from '@docusaurus/Translate';

const FeatureList = [
  {
    title: <Translate id="home.features.manageComplexity" description="Manage Complexity section title">Manage Complexity</Translate>,
    description: (
      <>
        <Translate id="home.features.manageComplexity.description" description="Manage Complexity section description">Charts describe even the most complex apps, provide repeatable
        application installation, and serve as a single point of authority.</Translate>
      </>
    ),
  },
  {
    title: <Translate id="home.features.easyUpdates" description="Easy Updates section title">Easy Updates</Translate>,
    description: (
      <>
        <Translate id="home.features.easyUpdates.description" description="Easy Updates section description">Take the pain out of updates with in-place upgrades and custom hooks.</Translate>
      </>
    ),
  },
  {
    title: <Translate id="home.features.simpleSharing" description="Simple Sharing section title">Simple Sharing</Translate>,
    description: (
      <>
        <Translate id="home.features.simpleSharing.description" description="Simple Sharing section description">Charts are easy to version, share, and host on public or private servers.</Translate>
      </>
    ),
  },
  {
    title: <Translate id="home.features.rollbacks" description="Rollbacks section title">Rollbacks</Translate>,
    description: (
      <>
        <Translate
          id="home.features.rollbacks.description"
          description="Rollbacks section description"
          values={{
            helmRollback: (
              <code>helm rollback</code>
            ),
          }}>
          {'Use {helmRollback} to roll back to an older version of a release with ease.'}
        </Translate>
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
        <Heading as="h2"><Translate id="home.features.title" description="Features section title">Features</Translate></Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
