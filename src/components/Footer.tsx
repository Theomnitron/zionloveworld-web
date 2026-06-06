/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Check, Copy } from 'lucide-react';
import { CHURCH_INFO } from '../data/churchData';
import { ChurchView } from '../types/church';

interface FooterProps {
  onNavigate?: (view: ChurchView, anchor?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [addressCopied, setAddressCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CHURCH_INFO.address);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const handleLinkClick = (e: React.MouseEvent, view: ChurchView, anchor?: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view, anchor);
    }
  };

  return (
    <footer id="contact-us" className="bg-[#0A0A0A] text-white pt-20 pb-8 border-t border-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          
          {/* LEFT COLUMN: BRANDING & CONTACTS */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <img 
                  src="https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/others/Zion%20Logo.png" 
                  alt="Zion Logo" 
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-white">
                  Zion Loveworld
                </span>
                <span className="text-[9px] font-sans font-semibold tracking-tight uppercase text-[#E61A22]">
                  Gospel Ministry Intl
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-light">
              Preaching the true Word of God, activating supernatural liberations, and cultivating a community of Goldy covenant integrity worldwide.
            </p>
            
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E61A22] shrink-0 mt-0.5" style={{ color: "#ffffff" }} />
                <span>Dutse Makaranta, Abuja, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E61A22] shrink-0" style={{ color: "#ffffff" }} />
                <span>{CHURCH_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E61A22] shrink-0" style={{ color: "#ffffff", borderColor: "#ffffff" }} />
                <span>{CHURCH_INFO.email}</span>
              </div>
            </div>

            <button
              onClick={handleCopyAddress}
              className="mt-2 text-[9px] text-[#E61A22] font-semibold uppercase tracking-wider hover:underline flex items-center gap-1.5 focus:outline-none cursor-pointer w-fit"
              style={{ color: "#ffffff" }}
            >
              {addressCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {addressCopied ? 'Address Copied!' : 'Copy Address'}
            </button>
          </div>

          {/* MIDDLE COLUMN: QUICK HOT LINKS */}
          <div className="flex flex-col gap-6 md:pl-6">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-white border-b border-white/5 pb-2">
              Quick Directory Links
            </h4>
            <div className="flex flex-col gap-3.5 text-xs text-slate-400 font-medium select-none">
              <button 
                onClick={(e) => handleLinkClick(e, 'home', 'hero-carousel')} 
                className="text-left hover:text-white hover:underline transition-colors uppercase tracking-wider cursor-pointer active:scale-105 transition-transform duration-100 ease-out font-sans text-xs"
              >
                Top of Page
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, 'home', 'theme-of-the-year')} 
                className="text-left hover:text-white hover:underline transition-colors uppercase tracking-wider cursor-pointer active:scale-105 transition-transform duration-100 ease-out font-sans text-xs"
              >
                Prophetic Theme
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, 'home', 'weekly-services')} 
                className="text-left hover:text-white hover:underline transition-colors uppercase tracking-wider cursor-pointer active:scale-105 transition-transform duration-100 ease-out font-sans text-xs"
              >
                Weekly Services
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, 'home', 'who-we-are')} 
                className="text-left hover:text-white hover:underline transition-colors uppercase tracking-wider cursor-pointer active:scale-105 transition-transform duration-100 ease-out font-sans text-xs"
              >
                Who We Are
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, 'sermons')} 
                className="text-left hover:text-white hover:underline transition-colors uppercase tracking-wider cursor-pointer active:scale-105 transition-transform duration-100 ease-out font-sans text-xs"
              >
                Sermon Media
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, 'home', 'giving')} 
                className="text-left hover:text-[#E61A22] hover:underline transition-colors uppercase tracking-wider font-extrabold text-[#E61A22] cursor-pointer active:scale-105 transition-transform duration-100 ease-out font-sans text-xs"
              >
                Sow Seed Altar
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: LOCAL SEO MAP CONTAINER */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-white border-b border-white/5 pb-2">
              Zion Loveworld Location Coordinates
            </h4>
            <div className="w-full h-64 bg-[#1A1A1A] border border-slate-800 rounded-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-slate-950 opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                <div className="bg-[#0A0A0A]/90 backdrop-blur-md p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 mb-1 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E61A22]" />
                    <span className="text-[8px] font-sans font-bold tracking-widest uppercase text-slate-300">
                      Church Auditorium
                    </span>
                  </div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-tight font-sans">
                    Zion Loveworld Ministry Intl
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight italic font-light">
                    Dutse Makaranta, Abuja, Nigeria
                  </p>
                </div>

                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Zion+Loveworld+Ministry+international+New+Jerusalem+dutse+Federal+Capital+Territory+Abuja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#E61A22] hover:bg-[#b51017] text-white font-sans font-bold text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 self-start transition-transform hover:scale-105"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Open Google Maps
                </a>
              </div>

              {/* Stylized vector pattern coordinates representing radar streets */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-48 h-48 border border-slate-800 rounded-full flex items-center justify-center">
                  <div className="w-36 h-36 border border-dashed border-slate-700 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 border border-slate-800 rounded-full" />
                  </div>
                </div>
                <div className="absolute w-full h-px bg-slate-800 top-1/2" />
                <div className="absolute h-full w-px bg-slate-800 left-1/2" />
              </div>

              {/* Pin layout visual */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#E61A22]/20 flex items-center justify-center animate-ping absolute" />
                  <div className="w-6 h-6 rounded-full bg-[#E61A22] flex items-center justify-center relative z-10 shadow-lg border-2 border-white">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BASELINE: Copyright lines */}
        <div className="pt-8 border-t border-white/5 text-center text-slate-550 font-sans text-[10px] uppercase font-bold tracking-widest leading-loose">
          &copy; {new Date().getFullYear()} Zion Loveworld Gospel Ministry International. All Covenant Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
