import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HeroSection from '../components/HeroSection';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="Canon Guard"
      description="Your final line of defense - A safer execution model for multisig wallets"
      wrapperClassName="homepage-container"
      noFooter={false}
    >
      <HeroSection />
    </Layout>
  );
}
