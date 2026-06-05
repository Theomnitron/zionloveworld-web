/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { ChurchView } from '../types/church';
import Home from '../pages/Home';
import Sermons from '../pages/Sermons';
import Gallery from '../pages/Gallery';

interface AppRouterProps {
  currentView: ChurchView;
  anchorSection?: string;
  onNavigate: (view: ChurchView, anchor?: string) => void;
  onPlanVisit: () => void;
}

export default function AppRouter({ currentView, anchorSection, onNavigate, onPlanVisit }: AppRouterProps) {
  
  // Custom hook effect coordinating smooth scrolling for hybrid page state anchors
  useEffect(() => {
    if (currentView === 'home' && anchorSection) {
      // Small timeout to allow Home component structure to mount fully
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(anchorSection);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (currentView === 'home' && !anchorSection) {
      // Scroll to top of the page if navigating directly to Home-top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to top of the page when changing separate view interfaces
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [currentView, anchorSection]);

  // Centralized Switch router render block
  switch (currentView) {
    case 'home':
      return (
        <Home 
          onNavigateToView={(view, anchor) => onNavigate(view, anchor)}
          onPlanVisit={onPlanVisit} 
        />
      );

    case 'sermons':
      return (
        <Sermons 
          onSowSeedClick={() => onNavigate('home', 'giving')} 
          onNavigate={onNavigate}
        />
      );

    case 'gallery':
      return (
        <Gallery
        onNavigate={onNavigate}
        />
      );

    default:
      return (
        <Home 
          onNavigateToView={(view, anchor) => onNavigate(view, anchor)}
          onPlanVisit={onPlanVisit} 
        />
      );
  }
}
