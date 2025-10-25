import React from 'react';
import Link from '@docusaurus/Link';

export default function Navbar(): JSX.Element {
  return (
    <nav className="navbar cg-Navbar" aria-label="Site navigation">
      <div className="cg-Navbar__inner">
        <div className="cg-Brand" aria-label="Canon Guard">
          <div className="cg-Wordmark">
            <span className="cg-Canon">CANON</span>
            <span className="cg-Guard">GUARD</span>
          </div>
          <Link className="cg-DocsPill" to="/docs">DOCS</Link>
        </div>
        <div className="cg-Navbar__spacer" />
        {/**
         * Launch App button temporarily disabled per rebrand request.
         * Restore by uncommenting this block.
         */}
        {false && (
          <button
            type="button"
            className="cg-Launch"
            data-tooltip="Coming soon"
            aria-disabled
            tabIndex={-1}
          >
            Launch App
          </button>
        )}
      </div>
    </nav>
  );
}


