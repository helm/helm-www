import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';
import homeSections from '@site/src/css/home-sections.module.css';
import Translate from '@docusaurus/Translate';

const Pyramid = require("@site/static/img/helm-pyramid-solid.svg").default;

function About() {
  return (
    <div>
      <p>
        <Translate
          id="home.about.whatIsHelm"
          description="What is Helm? first paragraph">
          Helm helps you manage Kubernetes applications — Helm Charts help you
          define, install, and upgrade even the most complex Kubernetes
          application.
        </Translate>
      </p>
      <p>
        <Translate
          id="home.about.chartsDescription"
          description="What is Helm? charts paragraph">
          Charts are easy to create, version, share, and publish — so start using
          Helm and stop the copy-and-paste.
        </Translate>
      </p>
      <p>
        <Translate
          id="home.about.cncf"
          description="What is Helm? CNCF Graduated Project paragraph"
          values={{
            cncfLink: (
              <a href="https://www.cncf.io">CNCF</a>
            ),
            helmCommunityLink: (
              <a href="https://github.com/helm/community/blob/main/governance/governance.md"><Translate
                id="home.about.cncf.helmCommunityLink" description="Helm community link">
                Helm community
              </Translate>
              </a>
            ),
          }}>
          {'Helm is a graduated project in the {cncfLink} and is maintained by the {helmCommunityLink}.'}
        </Translate>
      </p>
      <h3><Translate id="home.about.learnMore" description="Learn more label">Learn more:</Translate></h3>
      <ul>
        <li>
          <a href="./docs/topics/architecture">
            <Translate id="home.about.learnMore.helmArchitectureLink" description="Helm Architecture link">Helm Architecture</Translate>
          </a>
        </li>
        <li>
          <a href="./docs/intro/quickstart">
            <Translate id="home.about.learnMore.quickStartGuideLink" description="Quick Start Guide link">Quick Start Guide</Translate>
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/watch?v=Zzwq9FmZdsU&t=2s">
            <Translate id="home.about.learnMore.videoLink" description="Video: An Introduction to Helm link">Video: An Introduction to Helm</Translate>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default function HomeAbout() {
  return (
    <section className={clsx(homeSections.section, homeSections.sectionDark, styles.about)}>
      <div className="container">
        <Pyramid className={styles.pyramid} role="img" />
        <Heading as="h2"><Translate id="home.about.title" description="What is Helm? title">What is Helm?</Translate></Heading>
        <About />
      </div>
    </section>
  );
}