import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
import AnimatedStars from '../AnimatedStars';
import AnimatedButton from '../AnimatedButton';

export default function HeroSection(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <section className={styles.heroSection}>
      <AnimatedStars />
      
      <img 
        src="/img/hero/canon-guard-hero.svg" 
        alt="Canon Guard" 
        className={styles.heroLogo}
      />
      
      <p className={styles.tagline}>Your final line of defense</p>
      
      <AnimatedButton to="/docs">
        Get Started
      </AnimatedButton>
    </section>
  );
}
