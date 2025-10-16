// import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Heading from "@theme/Heading";
import clsx from "clsx";
import styles from "./styles.module.css";
import Boat from "@site/src/components/Boat";
import Translate from '@docusaurus/Translate';

export default function HomeHeader() {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.hero)}>
      <div className={clsx("container", styles.container)}>
        <Heading as="h1">
          <Translate
            id="home.header.tagline"
            description="Helm tagline">
            The package manager for Kubernetes
          </Translate>
        </Heading>
        <h2>
          <Translate
            id="home.header.subtitle"
            description="Home page header subtitle">
            Helm is the best way to find, share, and use software built for
          </Translate>
          {" "}
          <a href="https://kubernetes.io/">Kubernetes</a>.
        </h2>
      </div>
      <Boat />
    </header>
  );
}
