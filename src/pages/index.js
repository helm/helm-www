import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomeHeader from "@site/src/components/HomeHeader";
import HomeAbout from "@site/src/components/HomeAbout";
import HomeFeatures from "@site/src/components/HomeFeatures";
import HomeGettingStarted from "@site/src/components/HomeGettingStarted";
import HomeCommunity from "@site/src/components/HomeCommunity";
import HomeSupport from "@site/src/components/HomeSupport";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description={`${siteConfig.tagline}`}>
      <HomeHeader />
      <main className="home">
        <HomeAbout />
        <HomeFeatures />
        <HomeGettingStarted />
        <HomeCommunity />
        <HomeSupport />
      </main>
    </Layout>
  );
}
