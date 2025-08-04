import React from 'react';
import background from '../assets/images/ui/page_bg.png';
import './PageLayout.css';

/**
 * Wrapper component providing a consistent page background and padding.
 */
export default function PageLayout({ children }) {
  return (
    <div className="page-layout" style={{ backgroundImage: `url(${background})` }}>
      {children}
    </div>
  );
}
