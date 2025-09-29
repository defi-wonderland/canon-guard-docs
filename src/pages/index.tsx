import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HeroSection from '../components/HeroSection';
import IntroLoader from '../components/IntroLoader';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const [showLoader, setShowLoader] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem('cg_intro_seen');
      if (!hasSeen) {
        setShowLoader(true);
        sessionStorage.setItem('cg_intro_seen', '1');
      } else {
        // No loader: reveal content on next frame for smooth transition
        requestAnimationFrame(() => setReveal(true));
      }
    } catch (e) {
      // If storage is blocked, still show once
      setShowLoader(true);
    }
  }, []);

  return (
    <Layout
      title="Canon Guard"
      description="Your final line of defense - A safer execution model for multisig wallets"
      wrapperClassName="homepage-container"
      noFooter={false}
    >
      {showLoader && (
        <IntroLoader durationMs={2400} onDone={() => {
          setShowLoader(false);
          // allow CSS transitions to apply on next tick
          requestAnimationFrame(() => setReveal(true));
        }} />
      )}
      <div className={`cg-content-reveal ${reveal ? 'cg-content-reveal--visible' : ''}`}>
        <HeroSection />
      </div>
    </Layout>
  );
}
