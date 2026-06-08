/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle,
  Copy,
  Check,
  BookOpen,
  Globe,
  Calendar,
  X,
  FileText
} from 'lucide-react';
import { CHURCH_INFO } from '../data/churchData';
import { 
  currentThemeData, 
  upcomingEventsData, 
  serviceSchedules 
} from '../data/homeData';
import { supabase } from '../lib/supabase';
import { SERMONS } from '../data/sermons';
import { GALLERY_ITEMS } from '../data/gallery';
import ScrollReveal from '../components/ScrollReveal';
import ContactUs from '../components/ContactUs';
import Footer from '../components/Footer';

interface HomeProps {
  onNavigateToView: (view: 'sermons' | 'gallery', anchor?: string) => void;
  onPlanVisit: () => void;
}

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  elementId?: string; // Add this specific prop for tracking
  key?: React.Key;
}

export default function Home({ onNavigateToView, onPlanVisit }: HomeProps) {
  // 1. Hero Automated & Interactive Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  interface SlideData {
    bgImage: string;
    headline: string;
    subtext: string;
  }

  const defaultSlides: SlideData[] = [
    {
      bgImage: "https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/banners/banner%202.png",
      headline: "Deliverance by Knowledge Of God",
      subtext: "And ye shall know the truth, and the truth shall make you free"
    },
    {
      bgImage: "https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/banners/Ground-lvl.jpg",
      headline: "Don't just be ever learning; Arrive at the knowledge of the Truth!",
      subtext: "Experience deep restoration and spiritual empowerment by The Word of God."
    },
    {
      bgImage: "https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/gallery/Children-group.jpg",
      headline: "Worship with Us!",
      subtext: "Globally or Locally; Fill your Spirit, Soul, and Body with Light"
    }
  ];

  // Helper to safely convert YYYY-MM-DD style date to "Month Day, Year"
  const formatSermonDate = (rawDateStr: string | null | undefined): string => {
    if (!rawDateStr) return '';
    try {
      const parts = rawDateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const dateObj = new Date(year, monthIndex, day);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
        }
      }
      const dateObj = new Date(rawDateStr);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (e) {
      console.warn("Date formatting error for:", rawDateStr, e);
    }
    return rawDateStr;
  };

  // 1. Local component state hooks to maintain incoming database rows (Sprint C1)
  const [sermons, setSermons] = useState<any[]>([]);
  const [banners, setBanners] = useState<SlideData[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  // Individual fallback markers ensuring high visual resilience (Sprints C1 and D1)
  const [useBannersFallback, setUseBannersFallback] = useState<boolean>(false);
  const [useSermonsFallback, setUseSermonsFallback] = useState<boolean>(false);
  const [useEventsFallback, setUseEventsFallback] = useState<boolean>(false);
  const [useGalleryFallback, setUseGalleryFallback] = useState<boolean>(false);

  // Synchronized slides pointer preserving existing pagination markup intact
  const slides = useBannersFallback 
    ? defaultSlides 
    : (banners.length > 0 ? banners : defaultSlides);

  // 2. React useEffect lifecycle block parsing dynamic datasets from Supabase with safe catches
  useEffect(() => {
    let active = true;

    async function loadSupabaseMediaCMS() {
      // Fetch Banners
      try {
        const { data: bannersData, error: bannersError } = await supabase
          .from('banners')
          .select('title, description, image_url, active')
          .eq('active', true)
          .order('id', { ascending: true })

        if (bannersError) throw bannersError;

        if (active) {
          if (bannersData && bannersData.length > 0) {
            const mapped = bannersData.map((b: any) => ({
              bgImage: b.image_url || "https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/banners/Ground-lvl.jpg",
              headline: b.title || "GROW IN UNDERSTANDING!",
              subtext: b.description || "Step into an atmosphere of dynamic Word teaching and covenant community."
            }));
            setBanners(mapped);
            setUseBannersFallback(false);
          } else {
            // Empty banners returned -> fall back to default slides
            setBanners(defaultSlides);
            setUseBannersFallback(false);
          }
        }
      } catch (err) {
        console.warn("banners query failed, invoking fallback structure:", err);
        if (active) {
          setBanners(defaultSlides);
          setUseBannersFallback(true);
        }
      }

      // Fetch Sermons
      try {
        const { data: sermonsData, error: sermonsError } = await supabase
          .from('sermons')
          .select('category, title, speaker, description, scriptures, duration, date, audio_url')
          .order('date', { ascending: false });

        if (sermonsError) throw sermonsError;

        if (active) {
          if (sermonsData) {
            const processedSermons = sermonsData.map((sermon: any) => {
              let splitScriptures: string[] = [];
              if (sermon.scriptures && typeof sermon.scriptures === 'string') {
                splitScriptures = sermon.scriptures.split('|').map((s: string) => s.trim()).filter(Boolean);
              } else if (Array.isArray(sermon.scriptures)) {
                splitScriptures = sermon.scriptures;
              }
              return {
                ...sermon,
                scriptures: splitScriptures,
                date: formatSermonDate(sermon.date)
              };
            });
            setSermons(processedSermons);
            setUseSermonsFallback(false);
          }
        }
      } catch (err) {
        console.warn("Supabase sermons query failed, invoking fallback structure:", err);
        if (active) {
          setSermons(SERMONS);
          setUseSermonsFallback(true);
        }
      }

      // Fetch Events
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('theme, description, date, time, location, image_url, active')
          .eq('active', true);

        if (eventsError) throw eventsError;

        if (active) {
          if (eventsData) {
            const mappedEvents = eventsData.map((e: any, idx: number) => ({
              id: `db-event-${idx}`,
              bannerUrl: e.image_url || "https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/others/Prophetic%20Declaration%20for%202026.png",
              theme: e.theme,
              date: formatSermonDate(e.date),
              description: e.description,
              time: e.time,
              location: e.location
            }));
            setEvents(mappedEvents);
            setUseEventsFallback(false);
          }
        }
      } catch (err) {
        console.warn("Supabase events query failed, invoking fallback structure:", err);
        if (active) {
          setEvents(upcomingEventsData);
          setUseEventsFallback(true);
        }
      }

      // Fetch Gallery
      try {
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery')
          .select('category, title, description, image_url');

        if (galleryError) throw galleryError;

        if (active) {
          if (galleryData) {
            const mappedGallery = galleryData.map((g: any, idx: number) => ({
              id: `db-gallery-${idx}`,
              imageUrl: g.image_url, // || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800",
              title: g.title,
              category: g.category,
              description: g.description
            }));
            setGallery(mappedGallery);
            setUseGalleryFallback(false);
          }
        }
      } catch (err) {
        console.warn("Supabase gallery query failed, invoking fallback structure:", err);
        if (active) {
          setGallery(GALLERY_ITEMS);
          setUseGalleryFallback(true);
        }
      }
    }

    loadSupabaseMediaCMS();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const handleNextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 8. Local Active State Visitation Modal States
  const [localVisitModalOpen, setLocalVisitModalOpen] = useState(false);
  const [visitName, setVisitName] = useState('');
  const [visitEmail, setVisitEmail] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitService, setVisitService] = useState('Sunday Celebration Service - 8:00 AM');
  const [visitComplete, setVisitComplete] = useState(false);
  const [submittedJson, setSubmittedJson] = useState<string | null>(null);
  
  // Asynchronous status controls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleLocalVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitName.trim() || !visitEmail.trim() || !visitDate) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Hardcoded credentials for instant client-side preview execution
    const sheetsVisitWebhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_VISIT_WEBHOOK_URL as string;
    const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
    const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
    const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

    // Format clean payloads
    const serialNumber = new Date().getTime().toString();
    
    // ✅ IMPROVED: Multi-insurance dictionary mapping for flawless Sheet.best header recognition
    const sheetsPayload = {
      "S/N": serialNumber,
      "sn": serialNumber,
      "Full Name": visitName,
      "fullName": visitName,
      "Email": visitEmail,
      "email": visitEmail,
      "Phone": visitPhone || "None Provided",
      "phone": visitPhone || "None Provided",
      "Chosen Service": visitService,
      "chosenService": visitService,
      "service": visitService,
      "Proposed Date": visitDate,
      "proposedDate": visitDate,
      "date": visitDate,
      "Timestamp": new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' }),
      "timestamp": new Date().toISOString()
    };

    const emailjsPayload = {
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsPublicKey,
      template_params: {
        // Broad variables coverage for admin alert templates
        user_name: visitName,
        name: visitName,
        
        // Multi-fallback address declarations to satisfy EmailJS dynamic "To Email" fields
        user_email: visitEmail,
        email: visitEmail,
        to_email: visitEmail,
        recipient: visitEmail,
        
        user_phone: visitPhone || "None Provided",
        phone: visitPhone || "None Provided",
        
        chosen_service: visitService,
        service: visitService,
        proposed_date: visitDate,
        date: visitDate,
        sn: serialNumber
      }
    };

    try {
      // 🧪 GOOGLE AI STUDIO PREVIEW SAFE DISPATCH:
      // We use parallel asynchronous dispatches with native fetch() POST requests.
      // Note: If testing directly inside the AI Studio web-app preview tab, 
      // strict browser sandboxing might still hide backend changes.
      const [sheetsResponse, emailjsResponse] = await Promise.all([
        fetch(sheetsVisitWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(sheetsPayload)
        }),
        fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(emailjsPayload)
        })
      ]);

      // 1. Check if Google Sheets API rejected the row submission
      if (!sheetsResponse.ok) {
        const sheetsErrText = await sheetsResponse.text().catch(() => "");
        throw new Error(`Sorry: Please input a valid Email Address`); // Real Error below
        // throw new Error(`Google Sheets Error (${sheetsResponse.status}): ${sheetsErrText || "Check Sheet.best credentials"}`);
      }

      // 2. Check if EmailJS API rejected the message structure
      if (!emailjsResponse.ok) {
        const emailErrText = await emailjsResponse.text().catch(() => "");
        throw new Error(`Sorry: Please input a valid Email Address`); // Real Error below
        // throw new Error(`EmailJS Mail Error (${emailjsResponse.status}): ${emailErrText || "Check template configurations"}`);
      }

      // 3. Record visual artifact for the JSON payload view block
      setSubmittedJson(JSON.stringify(sheetsPayload, null, 2));

      // 4. Set completion flag true to transition the modal inner layout to the Success screen
      setVisitComplete(true);

      // 5. Broadcast global success toast notification banner at the top of the screen
      setShowSuccessToast(true);

      // 6. Automatically auto-dismiss toast banner after 6 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 6000);

    } catch (err: any) {
      console.error("Critical automation pass failure:", err);
      // Extracts and presents the exact network/API response message directly to the user UI banner
      setSubmitError(err.message || "An unhandled cross-origin connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeLocalVisitModal = () => {
    setLocalVisitModalOpen(false);
    setVisitComplete(false);
    setVisitName('');
    setVisitEmail('');
    setVisitPhone('');
    setVisitDate('');
    setSubmittedJson(null);
    setSubmitError(null);
  };

  // Copy Address Assist Helper
  const [addressCopied, setAddressCopied] = useState(false);
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CHURCH_INFO.address);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  // Smooth Scroll Anchor Trigger
  const handleAnchorScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col flex-1" id="home-view-wrapper">
      
      {/* SUCCESS TOAST NOTIFICATION BANNER */}
      {/* {showSuccessToast && (
        <div id="visit-success-alert-banner" className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] w-full max-w-md px-4 animate-fade-in-down">
          <div className="bg-emerald-600 text-white p-4.5 rounded-2xl shadow-2xl flex items-start gap-3 border border-emerald-500 backdrop-blur-md">
            <CheckCircle className="w-5 h-5 text-emerald-100 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-white">
                Reservation Confirmed!
              </h4>
              <p className="font-sans text-[11px] text-emerald-50 mt-1 leading-relaxed">
                Welcome Experience booked successfully. We can't wait to host you!
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessToast(false)} 
              className="text-emerald-100 hover:text-white transition-colors cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )} */}
      
      {/* 1. HERO AUTOMATED CAROUSEL SECTION */}
      <section id="hero-carousel" className="relative w-full h-[650px] bg-slate-900 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.bgImage}
                alt={`Sanctuary background scene ${index + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />
            </div>

            {/* Layout content inside the slide for synchronized fading */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
                <span className="font-sans font-bold text-[0.4rem] lg:text-xs uppercase tracking-[0.2em] text-[#E61A22] bg-white px-2 py-1 rounded-full mb-4 block scale-105 select-none shadow-md">
                  Welcome to Zion Loveworld Gospel Ministry International
                </span>
                <h1 className="font-sans font-extrabold text-[1.8rem] sm:text-4xl md:text-6xl lg:text-7xl tracking-tight uppercase leading-tight max-w-4xl mb-3 text-white drop-shadow-md">
                  {slide.headline}
                </h1>
                <p className="font-sans text-slate-100 text-[0.6rem] md:text-sm max-w-2xl mb-12 leading-relaxed font-semibold drop-shadow-sm">
                  {slide.subtext}
                </p>
                
                {/* 1. Side-by-Side Horizontal Buttons Force Row */}
                <div className="flex flex-row gap-4 items-center justify-center">
                  <button
                    onClick={onPlanVisit}
                    className="bg-[#E61A22] hover:bg-[#730408] text-white font-sans font-bold text-[10px] md:text-xs uppercase tracking-widest px-4 md:px-8 py-3.5 md:py-4 rounded-xl hover:scale-105 active:scale-105 transition-transform duration-100 ease-out shadow-lg shadow-[#E61A22]/30 cursor-pointer"
                  >
                    Plan A Visit Today
                  </button>
                  <button
                    onClick={() => onNavigateToView('sermons')}
                    className="bg-white hover:bg-slate-50 text-slate-950 font-sans font-bold text-[10px] md:text-xs uppercase tracking-widest px-4 md:px-8 py-3.5 md:py-4 rounded-xl hover:scale-105 active:scale-105 transition-transform duration-100 ease-out shadow-lg cursor-pointer"
                  >
                    Follow Services
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Manual Slides Navigation Arrow controls */}
        {slides.length > 1 && (
          <>
            {/* <button
              onClick={handlePrevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-white/20 bg-black/10 hover:bg-black/30 text-white hover:scale-110 active:scale-105 transition-all duration-100 ease-out focus:outline-none cursor-pointer shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-white/20 bg-black/10 hover:bg-black/30 text-white hover:scale-110 active:scale-105 transition-all duration-100 ease-out focus:outline-none cursor-pointer shadow-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button> */}
          </>
        )}

        {/* Play / Pause Toggle + Slide Indicators Bar */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-[#E61A22] hover:scale-110 active:scale-105 transition-transform duration-100 ease-out p-1 cursor-pointer"
              title={isPlaying ? "Pause automatic cycle" : "Play automatic cycle"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-100 ease-out active:scale-105 ${
                    index === currentSlide ? 'w-8 bg-[#E61A22]' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>


      {/* 2. THEME OF THE YEAR COMPONENT (NEW INJECTION POINT) */}
      <section id="theme-of-the-year" className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Split visual banner frame */}
            <ScrollReveal className="relative group overflow-hidden rounded-2xl border-2 border-[#E61A22] shadow-2xl">
              <img 
                src={currentThemeData.imageUrl} 
                alt={currentThemeData.themeTitle} 
                className="w-full h-[350px] object-cover transition-transform duration-550 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-4 left-4 font-sans font-bold text-[10px] uppercase tracking-widest bg-[#E61A22] text-white px-3 py-1 rounded">
                Annual Spiritual Banner Flyer
              </span>
            </ScrollReveal>
            
            {/* Typography Content Column */}
            <ScrollReveal delay={150} className="flex flex-col justify-center">
              <span className="text-[#E61A22] font-sans font-extrabold text-[0.62rem] lg:text-[0.9rem] uppercase tracking-[0.2em] mb-3 inline-block">
                Prophetic Declaration for the Year 2026
              </span>
              <h2 className="font-sans font-extrabold text-[1.5rem] md:text-4xl lg:text-[2.7rem] tracking-tight uppercase leading-tight mb-5">
                {currentThemeData.themeTitle}
              </h2>
              <div className="h-1.5 w-20 bg-[#E61A22] mb-6 rounded-full" />
              <p className="font-sans text-[0.65rem] md:text-base text-slate-400 italic font-semibold leading-relaxed border-l-4 border-[#E61A22] pl-4">
                "{currentThemeData.scriptureReference}"
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* 3. RE-STYLED SERVICE ENCOUNTER CARDS */}
      <section id="weekly-services" className="bg-slate-50 py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#E61A22] bg-[#E61A22]/10 font-sans font-extrabold text-xs uppercase tracking-[0.2em] mb-2 block px-3.5 py-1.5 rounded-md">
              Fellowship Schedule
            </span>
            <h2 className="font-sans font-extrabold text-2xl md:text-4xl text-[#0A0A0A] uppercase tracking-tight">
              Our Dynamic Weekly Encounters
            </h2>
          </ScrollReveal>
          
          {/* Weekly Services Card*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceSchedules.map((schedule, index) => (
              <ScrollReveal key={schedule.id} elementId={schedule.id} delay={index * 150}>
                <div 
                  className="bg-white shadow-md border border-slate-200 rounded-xl p-6.5 hover:scale-110 active:scale-105 transition-transform duration-100 ease-out flex flex-col justify-between min-h-[220px] h-full group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-sans font-extrabold text-[#E61A22] uppercase tracking-[0.15em] bg-[#E61A22]/5 px-2.5 py-1 rounded">
                        {schedule.badge}
                      </span>
                      {schedule.day === 'Sunday' && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans font-extrabold text-base uppercase text-[#0A0A0A] tracking-tight group-hover:text-[#E61A22] transition-colors mb-2.5">
                      {schedule.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {schedule.description}
                    </p>
                  </div>
                  <div className="text-xs text-slate-900 font-mono font-bold tracking-wide bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                    {schedule.time}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      {/* 4. "WHO WE ARE" MANIFESTO GRID FIX */}
      <section id="who-we-are" className="py-24 bg-white border-b border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Strict 2-column or Mobile Reordered Stack. HTML order places Text first so it naturally displays above */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* FIRST COLUMN (LEFT ON DESKTOP - MOUNTED FIRST IN DOM FOR MOBILE TOP PLACEMENT) */}
            <ScrollReveal className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block bg-[#E61A22]/10 text-[#E61A22] font-sans font-extrabold text-[0.6rem] md:text-xs uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-md">
                  FOUNDATIONAL MANDATE
                </span>
              </div>

              <h2 className="font-sans font-extrabold text-2xl md:text-4xl text-[#0A0A0A] tracking-tight uppercase mb-6 leading-tight">
                KNOWLEDGE FOR ADEQUATE CHRISTIAN life
              </h2>
              
              <div className="space-y-5 text-[#2D3748] font-sans text-sm md:text-base leading-relaxed">
                <p>
                  The Devil's strategy is to keep you ignorant. The Bible testifies that the children of Issachar had understanding to KNOW what Israel supposed to do. That means ignorance is a diasdvantage againt the powers of darkness.
                  And so you see the children of God today perishing (Hosea 4:6), because of somethings they don't know. Sin can be dealt with! Your situation can be turnaround! But do you KNOW?
                  It is those who KNOW their God that will be strong and do exploits. You don't have to be a puppet in the hands of Satan; neither does your life. The solution is a knowledge in God that you must KNOW and act upon.
                  And you will KNOW the true; and the truth will make you free!
                </p>
                <p>
                  Established in August 2011, Zion Loveworld Gospel Ministry International has stood as a beacon of uncompromised truth.
                  Our history is a testament to the transformative power of God’s Word, leading many into deeper understanding of God, spiritual growth, physical liberation.
                  Under the directive of our leadership, we remain dedicated to bringing believers into the understanding of God's Word for their eternal security, spiritual destinies, and human endeavours.
                </p>
              </div>

              {/* Pillars list layout */}
              <div id="manifesto-pillars-row" className="mt-8 pt-8 border-t border-slate-150 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#E61A22]/10 flex items-center justify-center text-[#E61A22] shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider mb-0.5">Holy Scriptures</h5>
                    <p className="text-xs text-slate-500">Uncompromised scripture exposition and daily truth</p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-slate-205 self-center" />

                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#E61A22]/10 flex items-center justify-center text-[#E61A22] shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider mb-0.5">Global Fellowship</h5>
                    <p className="text-xs text-slate-500">Igniting covenant networks across nations</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* SECOND COLUMN (RIGHT ON DESKTOP - MOUNTED SECOND) */}
            <ScrollReveal delay={200} className="relative group max-w-md mx-auto lg:mx-0 w-full">
              <div className="absolute inset-0 border border-[#E61A22] rounded-lg translate-x-3 translate-y-3 z-0 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
              <div className="relative z-10 bg-white p-2.5 border border-[#E61A22] rounded-lg shadow-xl">
                <img
                  src="https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/others/IMG-20260111-WA0040.jpg"
                  alt="Bishop Olaitan O. Emmanuel - General Overseer"
                  referrerPolicy="no-referrer"
                  className="w-full h-[450px] object-cover rounded-md"
                />
                
                <div className="bg-[#0A0A0A] text-white p-5 mt-2.5 rounded-md">
                  <span className="font-sans font-bold text-[0.65rem] uppercase tracking-[0.2em] text-[#E61A22] mb-1.5 block">
                    General Overseer
                  </span>
                  <h4 className="font-sans font-bold text-[0.9rem] md:text-sm tracking-tight uppercase text-white mb-1">
                    {CHURCH_INFO.pastorName}
                  </h4>
                  <p className="font-sans text-[11px] text-slate-300 leading-relaxed italic">
                    "Hello there! Yes, you reading this. You are welcome to this physical and digital atmosphere of deep uncompromised teachings of God's Word and a Godly covenant community. <br/>God bless you!"
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>


      {/* 5. UPCOMING EVENTS SECTION (NEW SECTION) */}
      <section id="upcoming-events" className="py-24 bg-slate-900 border-b border-slate-200"> {/* New Read HERE! */}
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-sans font-extrabold text-[0.6rem] md:text-xs uppercase tracking-[0.2em] text-[#E61A22] bg-white/70 px-3.5 py-1.5 rounded-md mb-4 inline-block">
              Divine Appointed Times
            </span>
            <h2 className="font-sans font-extrabold text-[1.5rem] md:text-5xl text-white uppercase tracking-tight">
              Upcoming Programmes
            </h2>
            <p className="font-sans text-slate-650 text-[0.7rem] md:text-sm mt-3 leading-relaxed" style={{ color: "#ffffffbb" }}>
              Our special programmes schedule will be listed here in advance. Mark your calendar and prepare your spirit for these high-voltage spiritual encounters designed to align your destiny with divine realities.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {(useEventsFallback ? upcomingEventsData : events).map((event, index) => (
              <ScrollReveal key={event.id} elementId={event.id} delay={index * 200}>
                <div 
                  className="bg-white shadow-md shadow-xl border border-slate-400 rounded-2xl overflow-hidden hover:scale-110 active:scale-105 hover:shadow-xl transition-transform duration-100 ease-out transition-shadow duration-300 flex flex-col md:flex-row items-stretch h-full"
                >
                  {/* Banner wrapper graphic */}
                  <div className="md:w-2/5 overflow-hidden relative">
                    <img 
                      src={event.bannerUrl} 
                      alt={event.theme} 
                      className="w-full h-full min-h-[220px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-neutral-950/20" />
                  </div>

                  {/* Event text blocks */}
                  <div className="p-6 md:w-3/5 flex flex-col justify-between">
                    <div>
                      <span className="text-[#E61A22] font-mono text-[0.6rem] lg:text-[0.7rem] font-extrabold uppercase tracking-widest block mb-1">
                        {event.date}
                      </span>
                      <h3 className="font-sans font-extrabold text-base md:text-lg text-[#0A0A0A] uppercase tracking-tight mb-2.5">
                        {event.theme}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light mb-4">
                        {event.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#E61A22]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#E61A22] shrink-0 mt-0.5" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


      {/* 6. Contact Us SECTION: Testimony, Prayer Request, Suggestions, etc */}
      <ContactUs />


      {/* 6. GIVING SECTION: Streamlined Manual Transfer Suite */}
      <section 
        id="giving" 
        className="relative py-24 bg-cover bg-center overflow-hidden border-b border-slate-900"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490557142725-ed8591afb8e1?q=80&w=1280')" }}
      >
        <div className="absolute inset-0 bg-white border-b border-gray-900 z-0" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-sans font-extrabold text-[0.6rem] md:text-xs uppercase tracking-[0.2em] text-[#E61A22] bg-[#E61A22]/10 px-3.5 py-1.5 rounded-md mb-4 inline-block">
              Kingdom Partnership
            </span>
            <h2 className="font-sans font-extrabold text-[1.5rem] md:text-5xl text-[#0A0A0A] tracking-tight uppercase leading-tight">
              Sowing into the Vision
            </h2>
            <p className="font-sans text-slate-350 text-xs md:text-sm mt-3 leading-relaxed" style={{ color: "#0a0a0abd" }}>
              Your tithes, offeings, and kingdom investments directly support global media evangelism, neighborhood outreaches, auditorium structures, and active discipleship resources.
            </p>
          </ScrollReveal>

          <div className="flex justify-center">
            {/* MANUAL BANK TRANSFER - UNIQUE EXQUISITE CARD SHIELD */}
            <ScrollReveal delay={150} className="w-full max-w-xl">
              <div className="bg-white border-2 border-[#E61A22] rounded-2xl p-6 md:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden w-full">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#94060b]/5 rounded-full pointer-events-none" />
                
                <div>
                  <span className="text-[#E61A22] font-sans font-extrabold text-[10px] uppercase tracking-[0.2em] mb-2 block">
                    Official Account Details
                  </span>
                  <h3 className="font-sans font-extrabold text-xl text-[#0A0A0A] uppercase tracking-tight mb-5">
                    Direct Givings
                  </h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed font-light mb-6">
                    For manual bank deposits, online wire transfers, or direct local accounts, please take advantage our official corporate account details below:
                  </p>

                  {/* Account Details Panel */}
                  <div className="space-y-4">
                    {/* Bank Name */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">Bank Partner</span>
                        <span className="text-sm font-extrabold text-[#0a0a0a] tracking-tight">Zenith Bank Plc</span>
                      </div>
                      <span className="text-[0.5rem] font-sans font-bold text-slate-400 bg-slate-200/50 px-2.5 py-1 rounded-md uppercase">Core Commercial</span>
                    </div>

                    {/* Account Name */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl relative">
                      <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">Account Name</span>
                      <span className="text-xs font-bold text-[#0a0a0a] tracking-tight uppercase block leading-snug">
                        Zion Loveworld Gospel Ministry International
                      </span>
                      {/* <button
                        onClick={() => {
                          navigator.clipboard.writeText("Zion Loveworld Gospel Ministry International");
                          alert("Account name copied to clipboard!");
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase font-bold text-[#E61A22] hover:underline cursor-pointer active:scale-105 transition-transform duration-100 ease-out"
                      >
                        Copy Name
                      </button> */}
                    </div>

                    {/* Account Number */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl relative flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest block">Account Number</span>
                        <span className="text-lg font-mono font-extrabold text-[#E61A22] tracking-widest">
                          1013405642
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("1013405642");
                          alert("Account number 1013405642 copied to clipboard!");
                        }}
                        className="text-[0.5rem] uppercase font-bold text-[#E61A22] hover:underline cursor-pointer bg-[#94060b]/5 px-1 py-1.5 rounded-lg border border-[#94060b]/10 hover:bg-[#94060b]/10 active:scale-105 transition-all duration-100 ease-out"
                      >
                        Copy Number
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <span className="text-[9px] font-sans font-semibold text-slate-500 block mb-2 uppercase tracking-wide">Scriptural Principle:</span>
                  <p className="font-sans text-[11px] text-slate-500 italic leading-normal">
                    "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Cor 9:7
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* 7. THE CONSOLIDATED MATTE BLACK MASTER FOOTER */}
      <Footer onNavigate={onNavigateToView} />


      {/* 8. ACTIVE STATE MODAL PLATFORM FOR "PLAN A VISIT" BOOKING UTILITY */}
      {localVisitModalOpen && (
        <div id="local-visit-modal-backdrop" className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div id="local-visit-modal-card" className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative p-8 border border-slate-205 overflow-hidden">
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E61A22]/5 rounded-full blur-xl" />

            {/* Close Button */}
            <button
              onClick={closeLocalVisitModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-2 hover:scale-110 transition-transform cursor-pointer"
              aria-label="Close visitation modal"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {!visitComplete ? (
              <form onSubmit={handleLocalVisitSubmit} className="flex flex-col gap-5 relative z-10" id="local-visit-booking-form">
                
                {/* Header title */}
                <div className="text-center pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-[#E61A22]/10 flex items-center justify-center text-[#E61A22] mx-auto mb-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-extrabold text-lg uppercase tracking-tight text-slate-900">
                    Plan Your Visitation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                    Welcome! We're pleased to receive you. <br />Please define your contact details below.
                  </p>
                </div>

                {/* ERROR PANEL */}
                {submitError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3.5 rounded-xl font-sans flex items-start gap-2.5 shadow-sm">
                    <span className="text-rose-500 font-extrabold text-sm shrink-0">⚠️</span>
                    <p className="font-semibold leading-normal">{submitError}</p>
                  </div>
                )}

                {/* Form fields */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-bold text-[0.6rem] uppercase tracking-wider text-slate-500">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Dr. Gabriel Michael"
                    value={visitName}
                    onChange={(e) => setVisitName(e.target.value)}
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#E61A22] text-slate-900"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans font-bold text-[0.6rem] uppercase tracking-wider text-slate-500">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="gabrielmichael@gmail.com"
                      value={visitEmail}
                      onChange={(e) => setVisitEmail(e.target.value)}
                      className="w-full border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#E61A22]"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans font-bold text-[0.6rem] uppercase tracking-wider text-slate-500">Phone No (for SMS)</label>
                    <input
                      type="tel"
                      placeholder="+234 (0) 803 123 4567"
                      value={visitPhone}
                      onChange={(e) => setVisitPhone(e.target.value)}
                      className="w-full border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#E61A22]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-bold text-[0.6rem] uppercase tracking-wider text-slate-500">Preferred Encounter Service</label>
                  <select
                    value={visitService}
                    onChange={(e) => setVisitService(e.target.value)}
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#E61A22] text-slate-800"
                    disabled={isSubmitting}
                  >
                    <option value="Sunday Celebration Service - 8:00 AM">Sunday Celebration Service - 8:00 AM</option>
                    <option value="Monday Prayer Meeting - 6:00 PM">Monday Prayer Meeting - 6:00 PM</option>
                    <option value="Tuesday Bible Study - 6:00 PM">Tuesday Bible Study - 6:00 PM</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-bold text-[0.6rem] uppercase tracking-wider text-slate-500">Proposed Visitation Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-[#E61A22] text-slate-800"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit button following active scale feedback contract */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-2 font-sans font-bold text-[0.65rem] uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md shadow-[#E61A22]/10 cursor-pointer text-center relative flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-slate-400 text-white cursor-not-allowed opacity-80 scale-[0.98]' 
                      : 'bg-[#E61A22] hover:bg-[#730408] text-white hover:scale-105 active:scale-105 transition-transform duration-100 ease-out'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Processing Booking...</span>
                    </>
                  ) : (
                    <span>Book My Welcome Experience</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm animate-bounce">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-base uppercase tracking-wider text-slate-900 mb-1">
                  Reservation Booked!
                </h3>
                <p className="text-[10px] text-[#E61A22] font-bold uppercase tracking-[0.15em] mb-4">
                  We're pleased to have you're coming!
                </p>
                
                <p className="font-sans text-xs text-slate-500 leading-relaxed max-w-sm mb-6 font-light">
                  Thank you, <strong>{visitName}</strong>. Our HOSPITALITY TEAM have registered your visitation for <strong>{visitDate}</strong> to join the <strong>{visitService}</strong>. <br />A guide has been transmitted to <strong>{visitEmail}</strong>.
                </p>

                <button
                  onClick={closeLocalVisitModal}
                  className="w-full bg-[#E61A22] hover:bg-[#730408] text-white font-sans font-bold text-[0.5rem] uppercase tracking-widest py-3 rounded-xl hover:scale-105 active:scale-105 transition-all duration-100 ease-out cursor-pointer"
                >
                  Conclude Reservation
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

// Abandon code
                // {/* 8. Displaying aggregated JSON content payload explicitly */}
                // {submittedJson && (
                //   <div className="bg-slate-950 p-4 rounded-xl w-full text-left font-mono text-[10px] text-slate-300 border border-slate-800 overflow-x-auto mb-6 max-h-48 scrollbar-thin">
                //     <div className="flex items-center gap-1.5 text-[#E61A22] font-bold mb-2 uppercase tracking-tight">
                //       <FileText className="w-3.5 h-3.5" />
                //       <span>Spreadsheet JSON Payload Payload</span>
                //     </div>
                //     <pre className="whitespace-pre-wrap">{submittedJson}</pre>
                //   </div>
                // )}
