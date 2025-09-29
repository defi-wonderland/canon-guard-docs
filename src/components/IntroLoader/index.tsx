import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

interface IntroLoaderProps {
  onDone?: () => void;
  durationMs?: number; // total time before expanding and finishing
}

export default function IntroLoader({ onDone, durationMs = 1400 }: IntroLoaderProps) {
  const [expand, setExpand] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // allow CSS to transition overlay/loader from transparent to visible
    const raf = requestAnimationFrame(() => setVisible(true));
    // Start expand near end, then finish
    const expandAt = Math.max(300, durationMs - 500);
    timeoutRef.current = window.setTimeout(() => setExpand(true), expandAt);
    const endRef = window.setTimeout(() => onDone && onDone(), durationMs);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      window.clearTimeout(endRef);
      cancelAnimationFrame(raf);
    };
  }, [durationMs, onDone]);

  return (
    <div className={`${styles.overlay} ${visible ? styles.visible : ''} ${expand ? styles.expand : ''}`}>
      <div className={`${styles.loader} ${visible ? styles.loaderVisible : ''}`}>
        <div className={styles.loaderInner} />
        <div className={styles.loaderOrbit}>
          <div className={styles.loaderDot} />
          <div className={styles.loaderDot} />
          <div className={styles.loaderDot} />
          <div className={styles.loaderDot} />
        </div>
      </div>
    </div>
  );
}


