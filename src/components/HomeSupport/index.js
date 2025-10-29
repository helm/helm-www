import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import homeSections from "@site/src/css/home-sections.module.css";
import Translate from "@docusaurus/Translate";

const CompanyList = [
  {
    name: "Bitnami",
    src: "/img/logowall/bitnami.png",
    url: "https://bitnami.com/",
  },
  {
    name: "codecentric AG",
    src: "/img/logowall/codecentric.png",
    url: "https://www.codecentric.de/",
  },
  {
    name: "Codefresh",
    src: "/img/logowall/codefresh.png",
    url: "https://codefresh.io/",
  },
  {
    name: "Google",
    src: "/img/logowall/google.png",
    url: "https://cloud.google.com/",
  },
  {
    name: "IBM",
    src: "/img/logowall/ibm.png",
    url: "https://www.ibm.com/",
  },
  {
    name: "JetBrains",
    src: "/img/logowall/jetbrains.png",
    url: "https://www.jetbrains.com/",
  },
  {
    name: "Microsoft",
    src: "/img/logowall/microsoft.png",
    url: "https://www.microsoft.com/",
  },
  {
    name: "Montreal",
    src: "/img/logowall/montreal.png",
    url: "#",
  },
  {
    name: "Red Hat",
    src: "/img/logowall/redhat.png",
    url: "https://www.redhat.com/",
  },
  {
    name: "Replicated",
    src: "/img/logowall/replicated.png",
    url: "https://www.replicated.com/",
  },
  {
    name: "Samsung SDS",
    src: "/img/logowall/samsungsds.png",
    url: "https://www.samsungsds.com/",
  },
  {
    name: "SUSE",
    src: "/img/logowall/suse.png",
    url: "https://www.suse.com/",
  },
  {
    name: "Ticketmaster",
    src: "/img/logowall/tm.png",
    url: "https://www.ticketmaster.com/",
  },
];

function CompanyLogo({ name, src, url }) {
  const logoElement = (
    <div className={styles.logoItem}>
      <img src={src} alt={`${name} logo`} className={styles.logoImage} />
    </div>
  );

  if (url === "#") {
    return logoElement;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {logoElement}
    </a>
  );
}

export default function HomeSupport() {
  return (
    <section className={clsx(homeSections.section, homeSections.sectionLight)}>
      <div className="container">
        <div className="text--center">
          <Heading as="h2">
            <Translate
              id="home.support.title"
              description="Community support section title"
            >
              Supporters
            </Translate>
          </Heading>
          <p>
            <Translate
              id="home.support.subtitle"
              description="Community support section subtitle"
            >
              Helm is supported by and built with a community of over 400
              developers.
            </Translate>
          </p>
        </div>
        <div className={styles.logoGrid}>
          {CompanyList.map((props, idx) => (
            <CompanyLogo key={idx} {...props} />
          ))}
        </div>
        <div className="text--center">
          <p className={styles.maintainersText}>
            <Translate
              id="home.support.maintainers"
              description="Link to core maintainers"
              values={{
                maintainersLink: (
                  <a href="https://github.com/helm/helm/blob/main/OWNERS">
                    <Translate
                      id="home.support.maintainersLink"
                      description="Core maintainers link text"
                    >
                      many other wonderful helm core maintainers
                    </Translate>
                  </a>
                ),
              }}
            >
              {"...and {maintainersLink}."}
            </Translate>
          </p>
        </div>
      </div>
    </section>
  );
}
