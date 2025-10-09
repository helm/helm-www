import Heading from "@theme/Heading";
import clsx from "clsx";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import styles from "./styles.module.css";
import homeSections from "@site/src/css/home-sections.module.css";
import homeCards from "@site/src/css/home-cards.module.css";

export default function HomeGettingStarted() {
  return (
    <section
      className={clsx(
        homeSections.section,
        homeSections.sectionDark,
        styles.gettingStarted
      )}
    >
      <div className="container">
        <Heading as="h2">Getting Started</Heading>
        <div className="row">
          <div className={clsx("col col--6", homeCards.col)}>
            <div className={clsx("card", homeCards.card)}>
              <div className={clsx("card__header", homeCards.card__header)}>
                <Heading as="h3">Get Helm</Heading>
              </div>
              <div className="card__body">
                <p>
                  Install Helm with a package manager, or{" "}
                  <a href="https://github.com/helm/helm/releases/latest">
                    download a binary
                  </a>
                  .
                </p>

                <Tabs>
                  <TabItem value="homebrew" label="Homebrew" default>
                    <CodeBlock language="bash">brew install helm</CodeBlock>
                  </TabItem>
                  <TabItem value="chocolatey" label="Chocolatey">
                    <CodeBlock language="bash">
                      choco install kubernetes-helm
                    </CodeBlock>
                  </TabItem>
                  <TabItem value="scoop" label="Scoop">
                    <CodeBlock language="bash">scoop install helm</CodeBlock>
                  </TabItem>
                  <TabItem value="snap" label="Snap">
                    <CodeBlock language="bash">
                      sudo snap install helm --classic
                    </CodeBlock>
                  </TabItem>
                </Tabs>

                <p>
                  Once installed, unpack the helm binary and add it to your PATH
                  and you are good to go! Check the{" "}
                  <a href="./docs/intro/install/">docs</a> for further{" "}
                  <a href="./docs/intro/install/">installation</a> and{" "}
                  <a href="./docs/intro/using_helm/">usage instructions</a>.
                </p>
              </div>
            </div>
          </div>

          <div className={clsx("col col--6", homeCards.col)}>
            <div className={clsx("card", homeCards.card)}>
              <div className={clsx("card__header", homeCards.card__header)}>
                <Heading as="h3">Get Charts</Heading>
              </div>
              <div className="card__body">
                <p>
                  Visit <a href="https://artifacthub.io">Artifact Hub</a> to
                  explore{" "}
                  <a href="https://artifacthub.io/packages/search?kind=0">
                    Helm charts
                  </a>{" "}
                  from numerous public repositories.
                </p>

                <a href="https://artifacthub.io/">
                  <img
                    src="/img/artifact-hub.jpg"
                    alt="Artifact Hub"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
