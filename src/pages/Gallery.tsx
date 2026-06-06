/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Camera,
  Image as ImageIcon,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { GALLERY_ITEMS, GalleryItem } from '../data/gallery';
import { supabase } from '../lib/supabase';
import { ChurchView } from '../types/church';
import Footer from '../components/Footer';

// Reusable scroll reveal component with native Intersection Observer
function ScrollReveal({ 
  children, 
  delay = 0, 
  className = ""
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
  key?: React.Key;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface GalleryProps {
  onNavigate?: (view: ChurchView, anchor?: string) => void;
}

export default function Gallery({ onNavigate }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All Photos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  // Initialize a state hook called dbGallery to replace hardcoded assets
  const [dbGallery, setDbGallery] = useState<any[]>([]);

  // Asynchronous useEffect block targeting the "gallery" table
  useEffect(() => {
    let active = true;

    async function loadGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('id, category, title, description, image_url')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (active) {
          if (data && data.length > 0) {
            const processed = data.map((item) => ({
              id: item.id,
              category: item.category,
              title: item.title,
              description: item.description,
              imageUrl: item.image_url || (item as any).imageUrl
            }));
            setDbGallery(processed);
          } else {
            setDbGallery([]);
          }
        }
      } catch (err) {
        console.warn("Supabase gallery query failed, invoking fallback structure:", err);
        if (active) {
          setDbGallery(GALLERY_ITEMS);
        }
      }
    }

    loadGallery();

    return () => {
      active = false;
    };
  }, []);

  // 1. DYNAMIC FRONTEND CATEGORY FILTER SCANNER
  // Build a dynamic categorization engine for the media filter buttons using active state dbGallery
  const dynamicCategories = useMemo(() => {
    const rawCategories = dbGallery.reduce<string[]>((acc, item) => {
      if (item.category && !acc.includes(item.category)) {
        acc.push(item.category);
      }
      return acc;
    }, []);
    return ['All Photos', ...rawCategories];
  }, [dbGallery]);

  // Filter items based on selected category string
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All Photos') {
      return dbGallery;
    }
    return dbGallery.filter((item) => item.category === activeCategory);
  }, [dbGallery, activeCategory]);

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleNextItem = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  };

  const handlePrevItem = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className=" bg-white flex-1" id="gallery-view-container">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Gallery Screen Header - Corporate Light Theme style */} <br />
        <ScrollReveal>
          <div id="gallery-header-section" className="border-b border-gray-100 pb-10 mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-[#94060b]/10 text-[#E61A22] font-sans font-bold text-xs uppercase tracking-[0.2em] px-3.5 py-1 rounded-md">
                Photo Archives
              </span>
            </div>
            <h1 className="font-sans font-extrabold text-3xl md:text-5xl uppercase tracking-tight text-[#0A0A0A] leading-tight">
              Services, Ministries, & More
            </h1>
            <p className="font-sans text-sm md:text-base text-slate-600 mt-4 max-w-2xl leading-relaxed">
              Witness the heavenly outpourings, worship atmospheres, and breakthrough testimonies captured live. Every photo displays real community spiritual empowerment in active fellowship.
            </p>
          </div>
        </ScrollReveal>

        {/* Dynamic Category Filter navigation bar */}
        <ScrollReveal delay={100} className="mb-10 relative z-30">
          
          {/* DESKTOP VIEW SYSTEM (PRESERVE ROW) */}
          <div className="hidden md:flex flex-wrap gap-3 items-center" id="gallery-category-tabs-container">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-xl text-[10px] text-slate-700 font-bold uppercase tracking-wider select-none shrink-0 border border-slate-200/50">
              <Layers className="w-3.5 h-3.5 text-[#E61A22]" />
              <span>Filters:</span>
            </div>

            {dynamicCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setLightboxIndex(null); // Reset lightbox to avoid invalid indices
                  }}
                  className={`px-5 py-2.5 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider hover:scale-105 active:scale-105 transition-transform duration-100 ease-out cursor-pointer ${
                    isActive 
                      ? 'bg-[#94060b] text-white shadow-lg shadow-[#E61A22]/20 font-extrabold' 
                      : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* MOBILE VIEW SYSTEM (PATH A DROPDOWN ENCAPSULATION) */}
          <div className="block md:hidden relative" id="gallery-category-mobile-container">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform duration-100 cursor-pointer focus:outline-none"
            >
              <span className="font-sans font-bold text-xs text-slate-800 flex items-center gap-2">
                <span>🔍 Filter Photos:</span> 
                <span className="text-[#E61A22] font-extrabold">{activeCategory}</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-[#E61A22] transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {isFilterMenuOpen && (
              <div className="absolute z-30 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in-down">
                <div className="py-1 flex flex-col">
                  {dynamicCategories.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setLightboxIndex(null);
                          setIsFilterMenuOpen(false);
                        }}
                        className={`w-full px-5 py-3 text-left font-sans text-xs transition-colors duration-100 cursor-pointer ${
                          isActive 
                            ? 'bg-[#E61A22]/10 text-[#E61A22] font-extrabold border-l-4 border-[#E61A22]' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </ScrollReveal>

        {/* 2. TRUE PINTEREST MASONRY GRID LAYOUT */}
        {filteredItems.length > 0 ? (
          <div 
            id="pinterest-masonry-wrapper" 
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5"
          >
            {filteredItems.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 50} className="break-inside-avoid inline-block w-full mb-5">
                <div
                  id={`gallery-tile-${item.id}`}
                  onClick={() => setLightboxIndex(index)}
                  className="w-full bg-slate-50 border border-slate-200/40 rounded-2xl overflow-hidden shadow-sm hover:scale-110 active:scale-105 hover:border-[#E61A22]/30 hover:shadow-xl hover:z-10 transition-transform duration-300 ease-out cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover block"
                    />
                    
                    {/* Pinterest-style overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />
                    
                    {/* Overlay text elements */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10">
                      <span className="text-[9px] font-sans font-extrabold text-[#E61A22] uppercase tracking-widest bg-white/95 px-2.5 py-1 rounded-md mb-2.5 inline-block">
                        {item.category}
                      </span>
                      <h3 className="font-sans font-bold text-xs uppercase tracking-tight text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                    {/* Top-right subtle camera overlay badge */}
                    <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md text-slate-700 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-md">
                      <Camera className="w-3.5 h-3.5 text-[#E61A22]" />
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl" id="no-gallery-items">
            <span className="inline-block bg-[#94060b]/10 text-[#E61A22] p-4 rounded-full mb-3">
              <Camera className="w-6 h-6" />
            </span>
            <p className="text-slate-500 font-sans text-sm font-semibold">No photographs cataloged in this fellowship category yet.</p>
            <button
              onClick={() => setActiveCategory('All Photos')}
              className="mt-4 text-[#E61A22] font-sans font-bold text-xs uppercase tracking-widest hover:underline cursor-pointer bg-slate-100 px-6 py-3 rounded-xl hover:bg-slate-200 hover:scale-105 active:scale-105 transition-transform duration-100 ease-out text-center"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      <br />

      <Footer onNavigate={onNavigate} />

      {/* 3. EDITORIAL LIGHTBOX MODAL CAROUSEL */}
      {activeLightboxItem && (
        <div 
          id="gallery-pinterest-lightbox" 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 animate-fadeIn"
        >
          {/* Top Panel Controls */}
          <div className="flex justify-between items-center text-white relative z-10 w-full max-w-7xl mx-auto pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E61A22]/25 flex items-center justify-center border border-[#E61A22]/50 text-[#E61A22]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#E61A22]">
                  Kingdom Visual Archives
                </span>
                <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-tight">
                  Image {lightboxIndex! + 1} of {filteredItems.length} in {activeCategory}
                </span>
              </div>
            </div>

            {/* High-contrast close button panel */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="text-white hover:text-[#E61A22] p-2.5 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer hover:scale-110 active:scale-105 transition-transform duration-100 ease-out flex items-center justify-center"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core high-contrast viewport slider layout */}
          <div className="flex-1 flex items-center justify-between gap-6 max-h-[72vh] relative w-full max-w-7xl mx-auto my-auto">
            
            {/* Left Absolute positioned arrow clicker */}
            <button
              onClick={handlePrevItem}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-[#E61A22] border border-white/10 text-white hover:scale-110 active:scale-105 transition-transform duration-100 ease-out cursor-pointer z-20 flex items-center justify-center shrink-0"
              aria-label="Previous photo visual"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Centered Large-scale high contrast container */}
            <div className="max-w-4xl max-h-full mx-auto relative flex items-center justify-center p-2 flex-grow overflow-hidden">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[66vh] object-contain rounded-2xl shadow-2xl border border-white/10 animate-scaleIn"
              />
            </div>

            {/* Right Absolute positioned arrow clicker */}
            <button
              onClick={handleNextItem}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-[#E61A22] border border-white/10 text-white hover:scale-110 active:scale-105 transition-transform duration-100 ease-out cursor-pointer z-20 flex items-center justify-center shrink-0"
              aria-label="Next photo visual"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Bottom Overlay panel displaying metadata carefully */}
          <div className="max-w-3xl mx-auto w-full text-center text-white pb-6 relative z-10 flex flex-col gap-2">
            <div className="flex justify-center gap-2 items-center mb-1">
              <span className="text-[10px] font-sans font-bold text-white bg-[#E61A22] px-3 py-1 rounded-md uppercase tracking-[0.15em]">
                {activeLightboxItem.category}
              </span>
            </div>

            <h3 className="font-sans font-extrabold text-xl md:text-2xl uppercase tracking-tight text-white leading-tight">
              {activeLightboxItem.title}
            </h3>

            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mt-1">
              {activeLightboxItem.description}
            </p>

            {/* Touch Arrow Fallback for smaller phone layout screens */}
            <div className="flex justify-center gap-4 mt-5 sm:hidden">
              <button
                onClick={handlePrevItem}
                className="px-4 py-2.5 bg-white/10 hover:bg-[#E61A22] text-white font-sans font-bold text-[9px] uppercase tracking-wider rounded-xl cursor-pointer hover:scale-105 active:scale-105 transition-transform duration-100 ease-out"
              >
                Prev Image
              </button>
              <button
                onClick={handleNextItem}
                className="px-4 py-2.5 bg-white/10 hover:bg-[#E61A22] text-white font-sans font-bold text-[9px] uppercase tracking-wider rounded-xl cursor-pointer hover:scale-105 active:scale-105 transition-transform duration-100 ease-out"
              >
                Next Image
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
