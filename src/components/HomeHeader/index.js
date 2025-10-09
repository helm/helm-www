import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Heading from "@theme/Heading";
import clsx from "clsx";
import styles from "./styles.module.css";
import Boat from "@site/src/components/Boat";

export default function HomeHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.hero)}>
      <div className={clsx("container", styles.container)}>
        <Heading as="h1">{siteConfig.tagline}</Heading>
        <h2>
          Helm is the best way to find, share, and use software built for{" "}
          <a href="https://kubernetes.io/">Kubernetes</a>.
        </h2>
      </div>
      <Boat />
    </header>
  );
}
