import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import homeSections from "@site/src/css/home-sections.module.css";
import homeCards from "@site/src/css/home-cards.module.css";
import Translate from "@docusaurus/Translate";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  MdVideoCall,
  MdForum,
  MdSchedule,
  MdCalendarToday,
  MdRocketLaunch,
  MdGroup,
  MdVideoLibrary,
  MdLogin,
  MdCalendarMonth,
} from "react-icons/md";

function CustomDate({dateString, formatType, endDateString}) {
  const {i18n} = useDocusaurusContext();
  const date = new Date(dateString);

  const formats = {
    day: { day: 'numeric', month: 'short', year: 'numeric' },
    month: { month: 'long', year: 'numeric' },
  };

  if (formatType === 'dayRange') {
    const startDate = new Date(dateString);
    const endDate = endDateString ? new Date(endDateString) : new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 days later if no endDate
    const formatter = new Intl.DateTimeFormat(i18n.currentLocale, {
      day: 'numeric',
      month: 'short',
    });
    const yearFormatter = new Intl.DateTimeFormat(i18n.currentLocale, {
      year: 'numeric'
    });

    const startFormatted = formatter.format(startDate);
    const endFormatted = formatter.format(endDate);
    const year = yearFormatter.format(startDate);

    return (
      <span>
        {startFormatted} - {endFormatted}, {year}
      </span>
    );
  } else {
    const options = formats[formatType] || formats['day'];
    const formatter = new Intl.DateTimeFormat(i18n.currentLocale, options);
    return <span>{formatter.format(date)}</span>;
  }
}

const BlockList = [
  {
    title: (
      <Translate
        id="home.community.nextFeatureRelease"
        description="Next Feature Release section title"
      >
        Next Feature Release
      </Translate>
    ),
    description: (
      <>
        <dl>
          <dt>
            <MdRocketLaunch className={styles.icon} />
            <Translate
              id="home.community.nextFeatureRelease.version"
              description="Next Feature Release version"
            >
              v4.0.0
            </Translate>
          </dt>
          <dd>
            <em><CustomDate dateString="2025-11-01" formatType="month" /></em>
          </dd>

          <dt>
            <MdCalendarMonth className={styles.icon} />
            <a href="calendar/release">
              <Translate
                id="home.community.nextFeatureRelease.calendar"
                description="Release Calendar link"
              >
                Release Calendar
              </Translate>
            </a>
          </dt>
        </dl>
      </>
    ),
  },
  {
    title: (
      <Translate id="home.community.events" description="Events section title">
        Events
      </Translate>
    ),
    description: (
      <>
        <dl>
          <dt>
            <MdSchedule className={styles.icon} />
            <Translate
              id="home.community.upcomingEventsSubtitle"
              description="Upcoming Events subtitle"
            >
              Upcoming Events
            </Translate>
          </dt>
          <dd>
            <em><CustomDate dateString="2025-11-10" endDateString="2025-11-13" formatType="dayRange" /></em> -{" "}
            <a href="https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/">
              KubeCon North America
            </a>
          </dd>
          <dt>
            <MdCalendarToday className={styles.icon} />
            <Translate
              id="home.community.pastEventsSubtitle"
              description="Past Events subtitle"
            >
              Past Events
            </Translate>
          </dt>
          <dd>
            <em><CustomDate dateString="2025-04-01" endDateString="2025-04-04" formatType="dayRange" /></em> -{" "}
            <a href="https://events.linuxfoundation.org/archive/2025/kubecon-cloudnativecon-europe/">
              KubeCon Europe 2025
            </a>
          </dd>
          <dd>
            <em><CustomDate dateString="2024-11-12" endDateString="2024-11-15" formatType="dayRange" /></em> -{" "}
            <a href="https://events.linuxfoundation.org/archive/2024/kubecon-cloudnativecon-north-america/">
              KubeCon North America 2024
            </a>
          </dd>
          <dd>
            <em><CustomDate dateString="2024-05-19" endDateString="2024-05-22" formatType="dayRange" /></em> -{" "}
            <a href="https://events.linuxfoundation.org/archive/2024/kubecon-cloudnativecon-europe/">
              KubeCon Europe 2024
            </a>
          </dd>
        </dl>
      </>
    ),
  },
  {
    title: (
      <Translate
        id="home.community.sigApps"
        description="SIG Apps section title"
      >
        SIG Apps
      </Translate>
    ),
    description: (
      <>
        <p>
          <MdVideoLibrary className={styles.icon} />
          <Translate
            id="home.community.sigApps.description"
            description="SIG Apps meeting description"
            values={{
              meetLink: (
                <a href="https://github.com/kubernetes/community/blob/master/sig-apps/README.md">
                  <Translate
                    id="home.community.sigApps.meetLink"
                    description="Link to SIG Apps meetings"
                  >
                    meet each week
                  </Translate>
                </a>
              ),
              youtubeLink: (
                <a href="https://www.youtube.com/results?search_query=kubernetes+sig+apps">
                  <Translate
                    id="home.community.sigApps.youtubeLink"
                    description="Link to YouTube recordings"
                  >
                    shared to YouTube
                  </Translate>
                </a>
              ),
            }}
          >
            {
              "They {meetLink} to demo and discuss tools and projects. Community meetings are recorded and {youtubeLink}."
            }
          </Translate>
        </p>
      </>
    ),
  },
  {
    title: (
      <Translate id="home.community.developerStandups">
        Developer Standups
      </Translate>
    ),
    description: (
      <>
        <p>
          <MdVideoCall className={styles.icon} />
          <a href="https://zoom.us/j/696660622">
            <Translate
              id="home.community.developerStandups.time"
              description="Developer Standups day and time"
            >
              Thursdays 9:30-10am (PT)
            </Translate>
          </a>
        </p>
        <p>
          <MdGroup className={styles.icon} />
          <Translate
            id="home.community.developerStandups.description"
            description="Developer Standups description with community repo link"
            values={{
              communityRepoLink: (
                <a href="https://github.com/helm/community/blob/main/communication.md#meetings">
                  <Translate
                    id="home.community.developerStandups.communityRepoLink"
                    description="Community repo link"
                  >
                    community repo
                  </Translate>
                </a>
              ),
            }}
          >
            {
              "These meetings are open to all. Check the {communityRepoLink} for notes and details."
            }
          </Translate>
        </p>
      </>
    ),
  },
  {
    title: "Slack",
    description: (
      <>
        <p>
          <Translate
            id="home.community.slack.join"
            description="How to join the Kubernetes Slack team with slack link"
            values={{
              slackLink: (
                <a href="https://slack.k8s.io/">
                  <Translate
                    id="home.community.slack.join.slackLink"
                    description="Request access to slack link"
                  >
                    Request access here
                  </Translate>
                </a>
              ),
            }}
          >
            {"{slackLink} to join the Kubernetes Slack team."}
          </Translate>
        </p>
        <dl>
          <dt>
            <MdForum className={styles.icon} />
            <a href="https://kubernetes.slack.com/messages/helm-users">
              Helm Users
            </a>
          </dt>
          <dd>
            <Translate
              id="home.community.slack.helmUsers.description"
              description="helm-users slack channel description"
            >
              Discussion around using Helm, working with charts and solving
              common errors.
            </Translate>
          </dd>

          <dt>
            <MdForum className={styles.icon} />
            <a href="https://kubernetes.slack.com/messages/helm-dev">
              Helm Development
            </a>
          </dt>
          <dd>
            <Translate
              id="home.community.slack.helmDevelopment.description"
              description="helm-dev slack channel description"
            >
              Topics regarding Helm development, ongoing PRs, releases, etc.
            </Translate>
          </dd>

          <dt>
            <MdForum className={styles.icon} />
            <a href="https://kubernetes.slack.com/messages/charts">Charts</a>
          </dt>
          <dd>
            <Translate
              id="home.community.slack.charts.description"
              description="charts slack channel description"
            >
              Discussion for users and contributors to Helm Charts.
            </Translate>
          </dd>
        </dl>
      </>
    ),
  },
  {
    title: (
      <Translate
        id="home.community.contributing"
        description="Contributing section title"
      >
        Contributing
      </Translate>
    ),
    description: (
      <>
        <p>
          <Translate
            id="home.community.contributing.description"
            description="Contributing section description"
          >
            Helm always welcomes new contributions to the project!
          </Translate>
        </p>
        <h3>
          <Translate
            id="home.community.contributing.whereToBegin"
            description="Where to begin? section title"
          >
            Where to begin?
          </Translate>
        </h3>
        <p>
          <Translate
            id="home.community.contributing.whereToBegin.description"
            description="Where to begin? section description"
          >
            Helm is a big project with a lot of users and contributors. It can
            be a lot to take in!
          </Translate>
        </p>
        <p>
          <Translate
            id="home.community.contributing.whereToBegin.goodFirstIssues"
            description="Good first issues sentence with link"
            values={{
              goodFirstIssuesLink: (
                <a href="https://github.com/helm/helm/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3A%22good+first+issue%22">
                  <Translate
                    id="home.community.contributing.whereToBegin.goodFirstIssuesLink"
                    description="Good first issues link"
                  >
                    good first issues
                  </Translate>
                </a>
              ),
            }}
          >
            {
              "We have a list of {goodFirstIssuesLink} if you want to help but don't know where to start."
            }
          </Translate>
        </p>

        <h3>
          <Translate
            id="home.community.contributing.whatDoIDo"
            description="What do I do? section title"
          >
            What do I do?
          </Translate>
        </h3>
        <p>
          <Translate
            id="home.community.contributing.whatDoIDo.contributionGuide"
            description="What do I do? contribution guide description"
            values={{
              contributionGuideLink: (
                <a href="https://github.com/helm/helm/blob/main/CONTRIBUTING.md">
                  <Translate
                    id="home.community.contributing.whatDoIDo.contributionGuideLink"
                    description="Contribution Guide link"
                  >
                    Contribution Guide
                  </Translate>
                </a>
              ),
            }}
          >
            {
              "Before you contribute some code, please read our {contributionGuideLink}. It goes over the processes around creating and reviewing pull requests."
            }
          </Translate>
        </p>
        <p>
          <Translate
            id="home.community.contributing.whatDoIDo.signYourCommits"
            description="What do I do? sign your commits description"
            values={{
              signYourCommitsLink: (
                <a href="blog/helm-dco">
                  <Translate
                    id="home.community.contributing.whatDoIDo.signYourCommitsLink"
                    description="Sign your commits link"
                  >
                    sign your commits
                  </Translate>
                </a>
              ),
              dcoLink: <a href="https://developercertificate.org/">DCO</a>,
              cncfLink: <a href="https://www.cncf.io/">CNCF</a>,
            }}
          >
            {
              "After you write some code, please {signYourCommitsLink} to ensure Helm adheres to the {dcoLink} agreement used by the {cncfLink}."
            }
          </Translate>
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
        <Heading as="h2"><Translate id="home.community.title" description="Join the Community title">Join the Community</Translate></Heading>
        <p><Translate id="home.community.subtitle" description="Join the Community subtitle">More information about the Helm project, and how to contribute.</Translate></p>
        <div className="row">
          {BlockList.map((props, idx) => (
            <Block key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
