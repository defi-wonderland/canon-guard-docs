import React from 'react';
import styles from './styles.module.css';

export default function AnimatedStars(): JSX.Element {
  // Create multiple star layers with different animations
  const starLayers = Array.from({ length: 6 }, (_, index) => (
    <div
      key={index}
      className={`${styles.starLayer} ${styles[`starLayer${index + 1}`]}`}
    >
      <img 
        src="/img/hero/stars.svg" 
        alt="" 
        className={styles.stars}
      />
    </div>
  ));

  return (
    <div className={styles.starsContainer}>
      {starLayers}
    </div>
  );
}
