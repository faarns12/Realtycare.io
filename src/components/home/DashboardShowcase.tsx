import { CrmSlideshow } from "./CrmSlideshow";
import styles from "./DashboardShowcase.module.css";

/** Hero product shot: the real CRM in a laptop frame, with a floating call notification. */
export function DashboardShowcase() {
  return (
    <div className={styles.showcase}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.laptop}>
        <div className={styles.screen}>
          <div className={styles.camera} aria-hidden="true" />
          <div className={styles.display}>
            <div className={styles.browser} aria-hidden="true">
              <span /><span /><span />
              <p>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                app.realtycare.io/dashboard
              </p>
            </div>
            <CrmSlideshow bare />
          </div>
        </div>
        <div className={styles.base} aria-hidden="true"><span /></div>
      </div>

      <div className={`${styles.card} ${styles.call}`} aria-hidden="true">
        <span className={styles.callIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></svg>
        </span>
        <div>
          <p className={styles.callTitle}>New lead called <b>· 0:42</b></p>
          <p className={styles.callSub}><span className={styles.live} />Appointment set for Tue, 10 AM</p>
        </div>
      </div>
    </div>
  );
}
