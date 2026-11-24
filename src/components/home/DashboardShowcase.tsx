import { PromoVideo } from "./PromoVideo";
import styles from "./DashboardShowcase.module.css";

/** Hero media: the promo video in a clean rounded frame. */
export function DashboardShowcase() {
  return (
    <div className={styles.showcase}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.frame}>
        <PromoVideo />
      </div>
    </div>
  );
}
