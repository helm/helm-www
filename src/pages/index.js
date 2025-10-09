import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import { useState, useEffect } from 'react';

import Heading from '@theme/Heading';

function BoatComponent() {
  const [isBadgeMode, setIsBadgeMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Switch to badge mode when scrolled down more than the viewport height
      const scrollPosition = window.scrollY;
      const triggerPoint = window.innerHeight * 0.7; // Trigger at 70% of viewport height
      
      setIsBadgeMode(scrollPosition > triggerPoint);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`boat ${isBadgeMode ? 'boat-badge' : 'boat-full'}`}>
      <img src="/img/boat.svg" alt="boat" className="boat-ship" />
      <div className="wave-wrapper">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(27,83,194,0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(27,83,194,0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(27,83,194,0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(27,83,194,1)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className="content-block home-intro">
      <div className="block-content text-centered">
        <h1>
          <strong>The package manager for Kubernetes</strong>
        </h1>
        <h2>Helm is the best way to find, share, and use software built for <a href="https://kubernetes.io">Kubernetes</a>.</h2>
      </div>

      <BoatComponent />
    </div>
  );
}

function InstallationSection() {
  const [activeTab, setActiveTab] = useState('Homebrew');

  const installCommands = {
    'Homebrew': 'brew install helm',
    'Chocolatey': 'choco install kubernetes-helm',
    'Scoop': 'scoop install helm',
    'Snap': 'sudo snap install helm --classic'
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="tile tile-actions is-parent is-horizontal">
      <div className="tile is-child">
        <h2>Get Helm</h2>
        <p>Install Helm with a package manager, or <a href="https://github.com/helm/helm/releases/latest">download a binary</a>.</p>

        <ul className="tabs" data-tabgroup="tab-group">
          {Object.keys(installCommands).map(tab => (
            <li key={tab} id="tablinks">
              <a 
                href={`#${tab}`} 
                className={activeTab === tab ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab);
                }}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>
        <div className="tabgroup">
          {Object.entries(installCommands).map(([tab, command]) => (
            <div 
              key={tab}
              className={`tabcontent ${activeTab === tab ? 'active' : ''}`} 
              id={tab}
            >
              <input 
                id={`copy${tab.toLowerCase()}`} 
                value={command} 
                readOnly
              />
              <button 
                onClick={() => copyToClipboard(command)}
                className="button"
              >
                Copy
              </button>
            </div>
          ))}
        </div>

        <p>Once installed, unpack the helm binary and add it to your PATH and you are good to go! Check the <a href="./docs/intro/install/">docs</a> for further <a href="./docs/intro/install/">installation</a> and <a href="./docs/intro/using_helm/">usage instructions</a>.</p>
      </div>

      <div className="tile is-child is-centered has-text-centered">
        <h2>Get Charts</h2>

        <p>Visit <a href="https://artifacthub.io">Artifact Hub</a> to explore <a href="https://artifacthub.io/packages/search?kind=0">Helm charts</a> from numerous public repositories.</p>

        <div className="has-text-center is-centered">
          <p><a href="https://artifacthub.io/"><img src="/img/artifact-hub.jpg" alt="Artifact Hub" className="is-centered" /></a></p>
        </div>
      </div>
    </div>
  );
}

function CommunitySection() {
  return (
    <div className="block-content">
      <h2 className="has-text-centered">Join the Community</h2>
      <p className="has-text-centered">
        More information about the Helm project, and how to contribute.
      </p>

      <div className="columns is-desktop community-boxes">
        <div className="column is-one-third-desktop">
          <section className="box">
            <h2 className="title">Next Feature Release</h2>
            <dl>
              <dt>
                <strong>Version:</strong> v3.16.3
                <br />
                <strong>Date:</strong> 2024-11-12
                <br />
                <br />
                <a href="calendar/release">Release Calendar</a>
              </dt>
            </dl>
          </section>

          <section className="box">
            <h2 className="title">Events</h2>
            <dl>
              <dt>Upcoming Events</dt>
              <dd><small className="placeholder"><em>Nov 10-13th 2025</em> - <a href="https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/">KubeCon North America</a></small></dd>
              <dt>Past Events</dt>
              <dd><em>Apr 1-4th 2025</em> - <a href="https://events.linuxfoundation.org/archive/2025/kubecon-cloudnativecon-europe/">KubeCon Europe 2025</a></dd>
              <dd><em>Nov 12-15th 2024</em> - <a href="https://events.linuxfoundation.org/archive/2024/kubecon-cloudnativecon-north-america/">KubeCon North America 2024</a></dd>
              <dd><em>May 19-22nd 2024</em> - <a href="https://events.linuxfoundation.org/archive/2024/kubecon-cloudnativecon-europe/">KubeCon Europe 2024</a></dd>
            </dl>
          </section>

          <section className="box">
            <h2 className="title">SIG Apps</h2>
            <h3 className="subtitle">
              A Special Interest Group for deploying and operating apps in Kubernetes.
            </h3>
            <p>
              <a href="https://github.com/kubernetes/community/blob/master/sig-apps/README.md">SIG-Apps</a> is a Special Interest Group for deploying and operating apps in Kubernetes.
            </p>
            <p>
              They <a href="https://github.com/kubernetes/community/blob/master/sig-apps/README.md">meet each week</a> to demo and discuss tools and projects. Community meetings are recorded and <a href="https://www.youtube.com/results?search_query=kubernetes+sig+apps">shared to YouTube</a>.
            </p>
          </section>
        </div>

        <div className="column is-one-third-desktop">
          <section className="box">
            <h2 className="title">Developer Standups</h2>
            <h3 className="subtitle">
              <a href="https://zoom.us/j/696660622"><span className="icon"><i className="mdi mdi-message-video"></i></span> Thursdays 9:30-10am (PT)</a>
            </h3>
            <p>These meetings are open to all. Check the <a href="https://github.com/helm/community/blob/main/communication.md#meetings">community repo</a> for notes and details.</p>
          </section>
          
          <section className="box">
            <h2 className="title">Slack</h2>
            <dl>
              <dt><span className="icon"><i className="mdi mdi-chat"></i></span> <a href="https://kubernetes.slack.com/messages/helm-users">Helm Users</a></dt>
              <dd>Discussion around using Helm, working with charts and solving common errors.</dd>

              <dt><span className="icon"><i className="mdi mdi-chat"></i></span> <a href="https://kubernetes.slack.com/messages/helm-dev">Helm Development</a></dt>
              <dd>Topics regarding Helm development, ongoing PRs, releases, etc.</dd>

              <dt><span className="icon"><i className="mdi mdi-chat"></i></span> <a href="https://kubernetes.slack.com/messages/charts">Charts</a></dt>
              <dd>Discussion for users and contributors to Helm Charts.</dd>
            </dl>

            <h3 className="subtitle">
              <a href="https://slack.k8s.io/">Request access here</a> to join the Kubernetes Slack team.
            </h3>
          </section>
        </div>

        <div className="column is-one-third-desktop">
          <section className="box">
            <h2 className="title">Contributing</h2>
            <h3 className="subtitle">
              Helm always welcomes new contributions to the project!
            </h3>
            <h3>Where to begin?</h3>
            <p>Helm is a big project with a lot of users and contributors. It can be a lot to take in!</p>
            <p>We have a list of <a href="https://github.com/helm/helm/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3A%22good+first+issue%22">good first issues</a> if you want to help but don't know where to start.</p>
            
            <h3>What do I do?</h3>
            <p>Before you contribute some code, please read our <a href="https://github.com/helm/helm/blob/main/CONTRIBUTING.md">Contribution Guide</a>. It goes over the processes around creating and reviewing pull requests.</p>
            <p>Once you write some code, please <a href="blog/helm-dco">sign your commits</a> to ensure Helm adheres to the <a href="https://developercertificate.org/">DCO</a> agreement used by the <a href="https://www.cncf.io/">CNCF</a>.</p>
          </section>
        </div>
      </div>
      
      {/* Community Logos Section */}
      <div className="helm-contrib-logos">
        <img 
          src="/img/helm.svg" 
          alt="Helm is supported by and built with a community of over 400 contributors"
          className="helm-logo"
        />

        <p className="contributors">Helm is supported by and built with a community of over 400 developers.</p>

        <div className="contrib-logos columns">
          <div className="column">
            <a target="_blank" href="https://bitnami.com/">
              <img src="/img/bitnami.png" alt="Bitnami" />
            </a>

            <a target="_blank" href="https://www.codecentric.de">
              <img src="/img/codecentric.png" alt="codecentric AG" />
            </a>

            <a target="_blank" href="https://codefresh.io/">
              <img src="/img/codefresh.png" alt="Codefresh" />
            </a>

            <a target="_blank" href="https://google.com/">
              <img src="/img/google.png" alt="Google" />
            </a>

            <a target="_blank" href="https://ibm.com">
              <img src="/img/ibm.png" alt="IBM" />
            </a>

            <a target="_blank" href="https://www.jetbrains.com/community/opensource/#support">
              <img src="/img/jetbrains.png" alt="Jetbrains" />
            </a>

            <a target="_blank" href="https://microsoft.com/">
              <img src="/img/microsoft.png" alt="Microsoft" />
            </a>

            <a target="_blank" href="https://montreal.ca">
              <img src="/img/montreal.png" alt="Montreal" />
            </a>

            <a target="_blank" href="https://www.redhat.com/">
              <img src="/img/redhat.png" alt="Redhat" />
            </a>

            <a target="_blank" href="https://www.replicated.com">
              <img src="/img/replicated.png" alt="Replicated" />
            </a>

            <a target="_blank" href="https://www.samsungsds.com">
              <img src="/img/samsungsds.png" alt="Samsung SDS" />
            </a>

            <a target="_blank" href="https://suse.com/">
              <img src="/img/suse.png" alt="SUSE" />
            </a>

            <a target="_blank" href="https://www.ticketmaster.com/">
              <img src="/img/tm.png" alt="Ticketmaster" />
            </a>
          </div>
        </div>

        <p className="contributors">...and many other wonderful <a href="https://github.com/helm/helm/blob/main/OWNERS">helm</a> core maintainers.</p>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Helm"
      description="The package manager for Kubernetes"
      wrapperClassName="page-wrapper page-home">
      <div className="content-container">
        {/* First content block - pattern background with hero content and boat */}
        <HomepageHeader />

        {/* Second content block - blue background */}
        <div className="content-block">
          <div className="block-content">
            <h2 className="has-text-centered">What is Helm?</h2>

            {/* Two Column Layout */}
            <div className="two-column layout-spacing">
              <div>
                <p>Helm helps you manage Kubernetes applications — Helm Charts help you define, install, and upgrade even the most complex Kubernetes application.</p>
                <p>Charts are easy to create, version, share, and publish — so start using Helm and stop the copy-and-paste.</p>
                <p>Helm is a graduated project in the <a href="https://www.cncf.io">CNCF</a> and is maintained by the <a href="https://github.com/helm/community/blob/main/governance/governance.md">Helm community</a>.</p>
                <h3>Learn more:</h3>
                <ul>
                  <li><a href="./docs/topics/architecture">Helm Architecture</a></li>
                  <li><a href="./docs/intro/quickstart">Quick Start Guide</a></li>
                  <li><a href="https://www.youtube.com/watch?v=Zzwq9FmZdsU&t=2s">Video: An Introduction to Helm</a></li>
                </ul>
              </div>
              <div>
                <div className="tile-features">
                  <div className="tile is-child">
                    <p className="title">Manage Complexity</p>
                    <p>Charts describe even the most complex apps, provide repeatable application installation, and serve as a single point of authority.</p>
                  </div>
                  <div className="tile is-child">
                    <p className="title">Easy Updates</p>
                    <p>Take the pain out of updates with in-place upgrades and custom hooks.</p>
                  </div>
                  <div className="tile is-child">
                    <p className="title">Simple Sharing</p>
                    <p>Charts are easy to version, share, and host on public or private servers.</p>
                  </div>
                  <div className="tile is-child">
                    <p className="title">Rollbacks</p>
                    <p>Use <code>helm rollback</code> to roll back to an older version of a release with ease.</p>
                  </div>
                </div>
              </div>
            </div>

            <InstallationSection />
          </div>
        </div>

        {/* Third content block - pattern background with community */}
        <div className="content-block">
          <CommunitySection />
        </div>
      </div>
    </Layout>
  );
}