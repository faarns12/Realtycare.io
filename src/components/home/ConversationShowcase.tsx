import { CrmSlideshow } from "./CrmSlideshow";
import styles from "./ConversationShowcase.module.css";

const messages = [
  { who: "AI assistant", text: "Hi Jessica, I’m the AI assistant for Sarah Lane Realty. Are you hoping to move soon?" },
  { who: "Jessica", text: "In the next 3 months. I’m pre-approved." },
  { who: "AI assistant", text: "Great. Sarah can show it Tuesday at 10 AM. Shall I book it?" },
];

export function ConversationShowcase() {
  return (
    <div className={styles.showcase}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.desktop}>
        <div className={styles.browser} aria-hidden="true"><span /><span /><span /><p>RealtyCare workspace</p></div>
        <CrmSlideshow />
        <div className={styles.chin} aria-hidden="true"><span /></div>
        <div className={styles.stand} aria-hidden="true" />
      </div>
      <div className={styles.phone} aria-label="Example AI call conversation on mobile">
        <div className={styles.notch} aria-hidden="true" />
        <div className={styles.contact}><span className={styles.avatar}>JL</span><div><p>Jessica Lane</p><span>Facebook lead · 412 Maple Ave</span></div></div>
        <div className={styles.callStatus}><span />AI conversation <span className={styles.timer}>00:42</span></div>
        <div className={styles.wave} aria-hidden="true">{[8, 16, 11, 24, 18, 30, 15, 22, 10, 26, 18, 12, 22, 15, 8, 19, 12, 24, 14, 9].map((height, i) => <span key={i} style={{ height, animationDelay: `${i * 65}ms` }} />)}</div>
        <div className={styles.messages}>{messages.map((message, i) => <div key={message.text} className={styles.message} data-lead={i === 1}><p>{message.who}</p><span>{message.text}</span></div>)}</div>
        <div className={styles.tags}><span>3 months</span><span>Pre-approved</span><span>Hot lead</span></div>
        <div className={styles.homeBar} aria-hidden="true" />
      </div>
    </div>
  );
}
