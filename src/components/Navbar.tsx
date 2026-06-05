/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Church } from 'lucide-react';
import { ChurchView, NavItem } from '../types/church';
import { NAV_ITEMS, CHURCH_INFO } from '../data/churchData';

interface NavbarProps {
  currentView: ChurchView;
  onNavigate: (view: ChurchView, anchor?: string) => void;
  onPlanVisit: () => void;
}

export default function Navbar({ currentView, onNavigate, onPlanVisit }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string>('');

  // SPRINT 2 ACTIVE LANDING SECTION DETECTION VIA SCROLL LISTENER
  useEffect(() => {
    if (currentView !== 'home') {
      setActiveAnchor('');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 240; // offset margin for header and padding
      const sections = ['who-we-are', 'giving', 'contact-us'];
      let currentSection = '';

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = sectionId;
            break;
          }
        }
      }

      // When resting on the primary hero fold, no section is active
      if (window.scrollY < 180) {
        currentSection = '';
      }

      setActiveAnchor(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger initial detection immediately on view mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavItemClick = (item: NavItem) => {
    onNavigate(item.view, item.anchor);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 2. Frosted-Glass Blur Desktop Navbar Shell */}
      <nav 
        id="app-navbar" 
        className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Branding Logo: Active scaling feedback on hover (scales up 1.05x gracefully) */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-3 cursor-pointer select-none hover:scale-105 transition-transform duration-200"
              id="navbar-branding-logo"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <img 
                  src="https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/others/Zion%20Logo.png" 
                  alt="Zion Logo" 
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#2D3748]">
                  Zion Loveworld
                </span>
                <span className="text-[9px] font-sans font-bold tracking-tight uppercase text-[#94060b]"> {/* Mature Red HERE! */}
                  Gospel Ministry Intl
                </span>
              </div>
            </div>

            {/* Desktop Navigation Link Cluster - Spatial Breeding Room: Gap 6 horizontal layout */}
            <div className="hidden md:flex items-center gap-7" id="desktop-nav-menu">
              {NAV_ITEMS.map((item) => {
                // Tracking exact active states per Sprint 2 instructions
                const isActive = item.anchor
                  ? (currentView === 'home' && activeAnchor === item.anchor)
                  : (currentView === item.view);

                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavItemClick(item)}
                    className={`font-sans font-extrabold text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer select-none hover:scale-110 ${
                      isActive 
                        ? 'text-[#94060b] border-b-2 border-[#94060b] pb-1' 
                        : 'text-[#2D3748] hover:text-[#94060b]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop Right Side CTA - Solid Polished Brass Gold background button: scales up 1.1x on hover */}
            <div className="hidden md:flex items-center" id="desktop-cta-cluster">
              <button
                id="btn-plan-visit"
                onClick={onPlanVisit}
                className="bg-[#94060b] hover:bg-[#730408] text-white font-sans font-extrabold text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-full hover:scale-110 transition-transform duration-200 shadow-md shadow-[#94060b]/15 cursor-pointer"
              >
                Plan A Visit
              </button>
            </div>

            {/* Mobile Hamburger button */}
            <div className="flex md:hidden" id="mobile-hamburger-btn-container">
              <button
                id="hamburger-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#2D3748] hover:text-[#94060b] p-2 focus:outline-none transition-all duration-150 active:scale-95 transition-transform cursor-pointer flex items-center justify-center w-10 h-10 select-none"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between relative">
                  <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''
                  }`} />
                  <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`} />
                  <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''
                  }`} />
                </div>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer with Dark Overlay Background Mask */}
      <div 
        id="mobile-nav-root" 
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        
        {/* Subtle Dark dimming mask behind the active sliding drawer */}
        <div 
          id="mobile-drawer-overlay-mask"
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Opaque 100% Solid White Hamburger Drawer sliding in from right */}
        <div 
          id="mobile-drawer-canvas" 
          className={`absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between p-7 z-10 transition-all duration-300 ease-out transform ${
            mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <div>
            {/* Header section of drawer */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  <img 
                    src="https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/others/Zion%20Logo.png" 
                    alt="Zion Logo" 
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#2D3748]">
                  Zion Loveworld
                </span>
              </div>
              <button
                id="mobile-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-[#94060b] p-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Generously padded custom link stack */}
            <div className="mt-8 flex flex-col gap-6" id="mobile-drawer-links">
              {NAV_ITEMS.map((item) => {
                const isActive = item.anchor
                  ? (currentView === 'home' && activeAnchor === item.anchor)
                  : (currentView === item.view);

                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleNavItemClick(item)}
                    className={`flex text-left font-sans font-extrabold text-xs uppercase tracking-wider transition-all duration-200 select-none cursor-pointer hover:scale-105 active:scale-95 ${
                      isActive ? 'text-[#94060b] pl-2 border-l-2 border-[#94060b]' : 'text-[#2D3748]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Drawer Callouts */}
          <div className="pt-6 border-t border-gray-100 flex flex-col gap-5">
            <button
              id="btn-plan-visit-mobile-drawer"
              onClick={() => {
                onPlanVisit();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#94060b] hover:bg-[#730408] text-white text-center font-sans font-extrabold text-xs uppercase tracking-widest py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-[#94060b]/15 cursor-pointer"
            >
              Plan A Visit
            </button>
            <div className="text-center text-[10px] text-gray-400 font-sans tracking-tight">
              Help & Hotline: {CHURCH_INFO.phone}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
