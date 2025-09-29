import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

const generateStars = (stars: number) => {
  const width = 4000;
  const height = 2000;

  let shadows = `${getRandomInt(width)}px ${getRandomInt(height)}px #FFFFFF`;
  for (let index = 0; index < stars; index++) {
    shadows = `${shadows}, ${getRandomInt(width)}px ${getRandomInt(height)}px #FFFFFF`;
  }
  return shadows;
};

export default function AnimatedStars(): JSX.Element {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 50);
    return () => window.clearTimeout(id);
  }, []);

  if (!visible) return <div className={styles.starsContainer} />;

  return (
    <div className={styles.starsContainer}>
      <div
        className={styles.stars}
        style={{
          boxShadow: generateStars(700),
          animationDuration: `${getRandomInt(1500) + 1200}ms`,
        }}
      />
      <div
        className={styles.stars1}
        style={{
          boxShadow: generateStars(700),
          animationDuration: `${getRandomInt(1500) + 1300}ms`,
        }}
      />
      <div
        className={styles.stars2}
        style={{
          boxShadow: generateStars(700),
          animationDuration: `${getRandomInt(1500) + 1400}ms`,
        }}
      />
      <div
        className={styles.stars3}
        style={{
          boxShadow: generateStars(700),
          animationDuration: `${getRandomInt(1500) + 1500}ms`,
        }}
      />
      <div
        className={styles.stars4}
        style={{
          boxShadow: generateStars(700),
          animationDuration: `${getRandomInt(1500) + 1600}ms`,
        }}
      />
      <div
        className={styles.stars5}
        style={{ boxShadow: generateStars(700) }}
      />
      <div
        className={styles.stars6}
        style={{ boxShadow: generateStars(50) }}
      />
    </div>
  );
}
