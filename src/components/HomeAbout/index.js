import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';
import homeSections from '@site/src/css/home-sections.module.css';

const Pyramid = require("@site/static/img/helm-pyramid-solid.svg").default;

function About() {
  return (
    <div>
      <p>
        Helm helps you manage Kubernetes applications — Helm Charts help you
        define, install, and upgrade even the most complex Kubernetes
        application.
      </p>
      <p>
        Charts are easy to create, version, share, and publish — so start using
        Helm and stop the copy-and-paste.
      </p>
      <p>
        Helm is a graduated project in the{" "}
        <a href="https://www.cncf.io">CNCF</a> and is maintained by the{" "}
        <a href="https://github.com/helm/community/blob/main/governance/governance.md">
          Helm community
        </a>
        .
      </p>
      <h3>Learn more:</h3>
      <ul>
        <li>
          <a href="./docs/topics/architecture">Helm Architecture</a>
        </li>
        <li>
          <a href="./docs/intro/quickstart">Quick Start Guide</a>
        </li>
        <li>
          <a href="https://www.youtube.com/watch?v=Zzwq9FmZdsU&t=2s">
            Video: An Introduction to Helm
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
        <Heading as="h2">What is Helm?</Heading>
        <About />
      </div>
    </section>
  );
}