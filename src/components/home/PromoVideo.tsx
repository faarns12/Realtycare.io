"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PromoVideo.module.css";

const SRC = "/videos/realtycare-promo.mp4";

/**
 * The promo video inside the hero laptop. Plays muted and looping while it's on screen
 * (paused when scrolled away or when the visitor prefers reduced motion). "Watch with sound"
 * restarts it from the beginning with audio and normal video controls.
 */
export function PromoVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [withSound, setWithSound] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Muted preview: play only while visible, and never for reduced-motion users.
  useEffect(() => {
    const el = video.current;
    if (!el || withSound) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [withSound]);

  const watchWithSound = () => {
    const el = video.current;
    if (!el) return;
    setWithSound(true);
    el.muted = false;
    el.loop = false;
    el.currentTime = 0;
    el.play().catch(() => {});
  };

  return (
    <div className={styles.wrap}>
      <video
        ref={video}
        className={styles.video}
        src={`${SRC}#t=0.1`}
        muted={!withSound}
        loop={!withSound}
        playsInline
        preload="metadata"
        controls={withSound}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        aria-label="RealtyCare.io promo video"
      />

      {!withSound && (
        <button type="button" className={styles.cta} onClick={watchWithSound}>
          <span className={styles.ctaIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
          </span>
          Watch with sound
        </button>
      )}

      {!withSound && playing && (
        <span className={styles.badge} aria-hidden="true"><span className={styles.dot} />Preview</span>
      )}
    </div>
  );
}
