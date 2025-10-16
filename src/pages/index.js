import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomeHeader from "@site/src/components/HomeHeader";
import HomeAbout from "@site/src/components/HomeAbout";
import HomeFeatures from "@site/src/components/HomeFeatures";
import HomeGettingStarted from "@site/src/components/HomeGettingStarted";
import HomeCommunity from "@site/src/components/HomeCommunity";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomeHeader />
      <main className="home">
        <HomeAbout />
        <HomeFeatures />
        <HomeGettingStarted />
        <HomeCommunity />
      </main>
    </Layout>
  );
}
