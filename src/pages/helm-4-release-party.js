import Layout from "@theme/Layout";
import clsx from "clsx";
import ReplicatedLogo from "../../static/img/helm-4-release-party/replicated_logo_red.svg";
import CNCFLogo from "../../static/img/helm-4-release-party/cncf-color.svg";
import styles from "./party.module.css";
import Link from "@docusaurus/Link";
import { MdLink } from "react-icons/md";

export default function Party() {
  return (
    <Layout
      title="Helm 4 Release Party"
      description="The Official Helm 4 Release Party! Presented by Replicated and CNCF at KubeCon Atlanta, 2025"
    >
      <main className={styles.party}>
        <div className="row">
          <div className={clsx("col col--6", styles.col, styles.logocol)}>
            <ReplicatedLogo width="100%" height="auto" />
          </div>
          <div className={clsx("col col--6", styles.col, styles.logocol)}>
            <CNCFLogo width="100%" height="auto" />
          </div>
        </div>
        <div className="row">
          <div className={clsx("col", styles.col)}>
            <h2>Present:</h2>
          </div>
        </div>
        <div class="row">
          <div className={clsx("col col--6", styles.hazelcol)}>
            <img
              className={styles.hazel}
              alt="Hazel 1"
              src="/img/helm-4-release-party/hazel_1.svg"
            />
            <img
              className={styles.hazel}
              alt="Hazel 2"
              src="/img/helm-4-release-party/hazel_2.svg"
            />
          </div>
          <div className={clsx("col col--6", styles.hazelcol)}>
            <img
              className={styles.hazel}
              alt="Hazel 3"
              src="/img/helm-4-release-party/hazel_3.svg"
            />
            <img
              className={styles.hazel}
              alt="Hazel 4"
              src="/img/helm-4-release-party/hazel_4.svg"
            />
          </div>
        </div>
        <div class="row">
          <div className={clsx("col", styles.col)}>
            <h1>The Official Helm 4 Release Party!</h1>
            <h2>Wed, Nov 12 from 6-9 PM</h2>
            <h3>Max Lager’s Wood-fired Grill & Brewery</h3>
            <h3>320 Peachtree Rd NE, Atlanta, GA 30308</h3>
            <h3>(~1 mile from the conference)</h3>
          </div>
        </div>
        <div className={clsx("row", styles.bottomrow)}>
          <div className={clsx("col col--6", styles.col, styles.menucol)}>
            <h2>Menu</h2>
            <p>
              Low-country Boil w/ Lobster, Shrimp, Beef Sausage, Corn on Cob,
              Potatoes
            </p>
            <p>Pasta D’Avellino (vegetarian)</p>
            <p>Premium Open Bar</p>
          </div>
          <div className={clsx("col col--6", styles.col)}>
            <h2>
              <Link href="https://replicated.typeform.com/helmparty">
                <MdLink className={styles.icon} />
                RSVP Required
              </Link>
            </h2>
            <Link href="https://replicated.typeform.com/helmparty">
              <img
                alt="Hazel 3"
                src="/img/helm-4-release-party/helm_qr_code.svg"
                width="100%"
                height="auto"
              />
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
