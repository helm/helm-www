import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import homeSections from "@site/src/css/home-sections.module.css";
import homeCards from "@site/src/css/home-cards.module.css";

const BlockList = [
  {
    title: "Next Feature Release",
    description: (
      <>
        <dl>
          <dt>
            <p>
              <strong>Version:</strong> v3.16.3
              <br />
              <strong>Date:</strong> 2024-11-12
            </p>
            <a href="calendar/release">Release Calendar</a>
          </dt>
        </dl>
      </>
    ),
  },
  {
    title: "Upcoming Events",
    description: (
      <>
        <dl>
          <dt>Upcoming Events</dt>
          <dd>
            <em>Nov 10-13th 2025</em> -{" "}
            <a href="https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/">
              KubeCon North America
            </a>
          </dd>
          <dt>Past Events</dt>
          <dd>
            <em>Apr 1-4th 2025</em> -{" "}
            <a href="https://events.linuxfoundation.org/archive/2025/kubecon-cloudnativecon-europe/">
              KubeCon Europe 2025
            </a>
          </dd>
          <dd>
            <em>Nov 12-15th 2024</em> -{" "}
            <a href="https://events.linuxfoundation.org/archive/2024/kubecon-cloudnativecon-north-america/">
              KubeCon North America 2024
            </a>
          </dd>
          <dd>
            <em>May 19-22nd 2024</em> -{" "}
            <a href="https://events.linuxfoundation.org/archive/2024/kubecon-cloudnativecon-europe/">
              KubeCon Europe 2024
            </a>
          </dd>
        </dl>
      </>
    ),
  },
  {
    title: "SIG Apps",
    description: (
      <>
        <p>
          <a href="https://github.com/kubernetes/community/blob/master/sig-apps/README.md">
            SIG-Apps
          </a>{" "}
          is a Special Interest Group for deploying and operating apps in
          Kubernetes.
        </p>
        <p>
          They{" "}
          <a href="https://github.com/kubernetes/community/blob/master/sig-apps/README.md">
            meet each week
          </a>{" "}
          to demo and discuss tools and projects. Community meetings are
          recorded and{" "}
          <a href="https://www.youtube.com/results?search_query=kubernetes+sig+apps">
            shared to YouTube
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Developer Standups",
    description: (
      <>
        <p>
          <a href="https://zoom.us/j/696660622">
            <span className="mdi mdi-message-video"></span> Thursdays 9:30-10am
            (PT)
          </a>
        </p>
        <p>
          These meetings are open to all. Check the{" "}
          <a href="https://github.com/helm/community/blob/main/communication.md#meetings">
            community repo
          </a>{" "}
          for notes and details.
        </p>
      </>
    ),
  },
  {
    title: "Slack",
    description: (
      <>
        <dl>
          <dt>
            <span className="mdi mdi-chat"></span>{" "}
            <a href="https://kubernetes.slack.com/messages/helm-users">
              Helm Users
            </a>
          </dt>
          <dd>
            Discussion around using Helm, working with charts and solving common
            errors.
          </dd>

          <dt>
            <span className="mdi mdi-chat"></span>{" "}
            <a href="https://kubernetes.slack.com/messages/helm-dev">
              Helm Development
            </a>
          </dt>
          <dd>
            Topics regarding Helm development, ongoing PRs, releases, etc.
          </dd>

          <dt>
            <span className="mdi mdi-chat"></span>{" "}
            <a href="https://kubernetes.slack.com/messages/charts">Charts</a>
          </dt>
          <dd>Discussion for users and contributors to Helm Charts.</dd>
        </dl>

        <p>
          <a href="https://slack.k8s.io/">Request access here</a> to join the
          Kubernetes Slack team.
        </p>
      </>
    ),
  },
  {
    title: "Contributing",
    description: (
      <>
        <p>Helm always welcomes new contributions to the project!</p>
        <h3>Where to begin?</h3>
        <p>
          Helm is a big project with a lot of users and contributors. It can be
          a lot to take in!
        </p>
        <p>
          We have a list of{" "}
          <a href="https://github.com/helm/helm/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3A%22good+first+issue%22">
            good first issues
          </a>{" "}
          if you want to help but don't know where to start.
        </p>

        <h3>What do I do?</h3>
        <p>
          Before you contribute some code, please read our{" "}
          <a href="https://github.com/helm/helm/blob/main/CONTRIBUTING.md">
            Contribution Guide
          </a>
          . It goes over the processes around creating and reviewing pull
          requests.
        </p>
        <p>
          Once you write some code, please{" "}
          <a href="blog/helm-dco">sign your commits</a> to ensure Helm adheres
          to the <a href="https://developercertificate.org/">DCO</a> agreement
          used by the <a href="https://www.cncf.io/">CNCF</a>.
        </p>
      </>
    ),
  },
];

function Block({ title, description }) {
  return (
    <div className={clsx("col col--4", homeCards.col)}>
      <div className={clsx("card", homeCards.card)}>
        <div className={clsx("card__header", homeCards.card__header)}>
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">{description}</div>
      </div>
    </div>
  );
}

export default function HomeCommunity() {
  return (
    <section
      className={clsx(
        homeSections.section,
        homeSections.sectionLight,
        styles.community
      )}
    >
      <div className="container">
        <Heading as="h2">Join the Community</Heading>
        <p>More information about the Helm project, and how to contribute.</p>
        <div className="row">
          {BlockList.map((props, idx) => (
            <Block key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
