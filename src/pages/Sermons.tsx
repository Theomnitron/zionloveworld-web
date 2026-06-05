/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Pause,
  Calendar, 
  BookOpen, 
  Volume2, 
  VolumeX,
  Download, 
  ChevronDown, 
  ChevronUp, 
  Share2,
  Clock,
  ChevronRight,
  Disc,
  ArrowRight,
  Flame
} from 'lucide-react';
import { SERMONS, Sermon } from '../data/sermons';
import { supabase } from '../lib/supabase';
import { ChurchView } from '../types/church';
import Footer from '../components/Footer';

interface SermonsProps {
  onSowSeedClick: () => void;
  onNavigate?: (view: ChurchView, anchor?: string) => void;
}

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

export default function Sermons({ onSowSeedClick, onNavigate }: SermonsProps) {
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isSermonMenuOpen, setIsSermonMenuOpen] = useState<boolean>(false);
  
  // Accordion expanded card states
  const [expandedSermonId, setExpandedSermonId] = useState<string | null>(null);

  // Clipboard copied notification state
  const [copiedSermonId, setCopiedSermonId] = useState<string | null>(null);

  // HTML5 audio state coordination
  const [playingSermon, setPlayingSermon] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // State hook called dbSermons to hold incoming database rows
  const [dbSermons, setDbSermons] = useState<any[]>([]);

  // React useEffect layout mount block querying sermons table of Supabase
  useEffect(() => {
    let active = true;

    async function loadSermons() {
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('id, category, title, speaker, description, scriptures, duration, date, audio_url')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (active) {
          if (data && data.length > 0) {
            const processed = data.map((item) => {
              let splitScriptures: string[] = [];
              if (item.scriptures && typeof item.scriptures === 'string') {
                splitScriptures = item.scriptures.split('|').map((s: string) => s.trim()).filter(Boolean);
              } else if (Array.isArray(item.scriptures)) {
                splitScriptures = item.scriptures;
              }
              return {
                id: item.id,
                category: item.category,
                title: item.title,
                speaker: item.speaker,
                description: item.description,
                scriptures: splitScriptures,
                duration: item.duration,
                date: formatSermonDate(item.date),
                audioUrl: item.audio_url
              };
            });
            setDbSermons(processed);
          } else {
            setDbSermons([]);
          }
        }
      } catch (err) {
        console.warn("Supabase public sermons database query failed, proceeding with safety fallbacks:", err);
        if (active) {
          setDbSermons(SERMONS);
        }
      }
    }

    loadSermons();

    return () => {
      active = false;
    };
  }, []);

  // 7. DYNAMIC CATEGORY BUTTONS: extracts distinct 'category' classifications present in dbSermons hook
  const categories = useMemo(() => {
    const rawCategories = dbSermons.reduce<string[]>((acc, sermon) => {
      if (sermon.category && !acc.includes(sermon.category)) {
        acc.push(sermon.category);
      }
      return acc;
    }, []);
    return ['All', ...rawCategories];
  }, [dbSermons]);

  // Audio interaction events
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playingSermon]);

  // Handle Play trigger click
  const handlePlaySermon = (sermon: any) => {
    if (playingSermon?.id === sermon.id) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play().catch(err => console.log("Audio play error:", err));
      }
    } else {
      setPlayingSermon(sermon);
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Load and trigger play
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(err => console.log("Audio loading trigger error:", err));
        }
      }, 50);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Secure Native Share with Desktop Clipboard Fallback
  const handleSermonShare = async (sermon: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const shareUrl = `${window.location.origin}/sermons?id=${sermon.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: `Listen to this life-transforming sermon from Zion Loveworld: "${sermon.title}"`,
          url: shareUrl,
        });
      } catch (error) {
        console.warn('Native share failed or dismissed:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedSermonId(sermon.id);
        setTimeout(() => {
          setCopiedSermonId((current) => current === sermon.id ? null : current);
        }, 3000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  // Wave Scrubbing handler
  const handleWaveScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audioRef.current.currentTime = percentage * duration;
  };

  // Filter Logic
  const filteredSermons = useMemo(() => {
    return dbSermons.filter((sermon) => {
      const matchesSearch = 
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.scriptures && sermon.scriptures.some((scr: string) => scr.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory = categoryFilter === 'All' || sermon.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [dbSermons, searchTerm, categoryFilter]);

  // Format digital timers
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Active progress percentage
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white flex-1" id="sermons-view-container">
      
      {/* Dynamic bouncing equalizer keyframes styled directly */}
      <style>
        {`
          @keyframes eq-bounce-1 { 0%, 100% { height: 4px; } 50% { height: 28px; } }
          @keyframes eq-bounce-2 { 0%, 100% { height: 8px; } 50% { height: 38px; } }
          @keyframes eq-bounce-3 { 0%, 100% { height: 3px; } 50% { height: 22px; } }
          @keyframes eq-bounce-4 { 0%, 100% { height: 10px; } 50% { height: 42px; } }
          @keyframes eq-bounce-5 { 0%, 100% { height: 6px; } 50% { height: 32px; } }
          @keyframes eq-bounce-6 { 0%, 100% { height: 12px; } 50% { height: 46px; } }
          @keyframes eq-bounce-7 { 0%, 100% { height: 5px; } 50% { height: 26px; } }
          
          .custom-eq-bar-1 { animation: eq-bounce-1 1s ease-in-out infinite; }
          .custom-eq-bar-2 { animation: eq-bounce-2 0.8s ease-in-out infinite; }
          .custom-eq-bar-3 { animation: eq-bounce-3 1.2s ease-in-out infinite; }
          .custom-eq-bar-4 { animation: eq-bounce-4 0.7s ease-in-out infinite; }
          .custom-eq-bar-5 { animation: eq-bounce-5 0.9s ease-in-out infinite; }
          .custom-eq-bar-6 { animation: eq-bounce-6 1.1s ease-in-out infinite; }
          .custom-eq-bar-7 { animation: eq-bounce-7 0.75s ease-in-out infinite; }
        `}
      </style>

      {/* Hidden background HTML5 audio stream anchor */}
      {playingSermon && (
        <audio 
          ref={audioRef}
          src={playingSermon.audioUrl}
          preload="auto"
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Core Header section matching Corporate layout */}
        <ScrollReveal>
          <div id="sermons-header-section" className="border-b border-gray-100 pb-10 mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-[#94060b]/10 text-[#E61A22] font-sans font-bold text-xs uppercase tracking-[0.2em] px-3.5 py-1 rounded-md">
                Apostolic Audio Archive
              </span>
            </div>
            <h1 className="font-sans font-extrabold text-3xl md:text-5xl uppercase tracking-tight text-[#0A0A0A] leading-tight">
              Sermons & Sacred Teachings
            </h1>
            <p className="font-sans text-sm md:text-base text-slate-600 mt-4 max-w-2xl leading-relaxed">
              Unpack life-transforming revelations, divine breakthrough declarations, and systematic spiritual development. Listen to complete sessions direct from the Zion Loveworld pulpit.
            </p>
          </div>
        </ScrollReveal>

        {/* Search & Category filter bars control dashboard */}
        <ScrollReveal delay={100} className="relative z-30">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-12" id="sermons-controls-bar">
            
            {/* DESKTOP VIEW SYSTEM (RETAIN HORIZONTAL SLATE) */}
            <div className="hidden md:flex flex-wrap gap-2.5" id="sermon-tabs-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-5 py-2.5 rounded-lg font-sans font-bold text-[10px] uppercase tracking-wider transition-transform hover:scale-105 active:scale-105 duration-100 ease-out cursor-pointer ${
                    categoryFilter === cat 
                      ? 'bg-[#94060b] text-white shadow-lg shadow-[#94060b]/20 font-extrabold' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* MOBILE VIEW SYSTEM (PATH A DROPDOWN ENCAPSULATION) */}
            <div className="block md:hidden relative w-full" id="sermon-category-mobile-container">
              <button
                type="button"
                onClick={() => setIsSermonMenuOpen(!isSermonMenuOpen)}
                className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm mb-4 active:scale-[0.98] transition-transform duration-100 cursor-pointer focus:outline-none"
              >
                <span className="font-sans font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <span>🎙️ Filter Sermons:</span>
                  <span className="text-[#E61A22] font-extrabold">{categoryFilter}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#E61A22] transition-transform duration-200 ${isSermonMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>

              {isSermonMenuOpen && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in-down">
                  <div className="py-1 flex flex-col">
                    {categories.map((cat) => {
                      const isActive = categoryFilter === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(cat);
                            setIsSermonMenuOpen(false);
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

          {/* Search box element input */}
          <div className="relative w-full lg:max-w-sm" id="sermon-search-outer">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by title, passage, speaker or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3.5 rounded-xl text-xs outline-none focus:bg-white focus:border-[#94060b] transition-all font-semibold text-slate-900 shadow-3xs"
            />
          </div>

        </div>
      </ScrollReveal>

        {/* List Grid displaying 3 Columns of Sermons with 1.1x Hover styling */}
        {filteredSermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12" id="sermons-grid">
            {filteredSermons.map((sermon, index) => {
              const isExpanded = expandedSermonId === sermon.id;
              const isCurrentPlaying = playingSermon?.id === sermon.id;

              return (
                <ScrollReveal key={sermon.id} delay={index * 100} className="h-full">
                  <div 
                    id={`sermon-card-${sermon.id}`}
                    className="bg-white rounded-2xl border border-slate-200 shadow-lg p-7 flex flex-col justify-between hover:scale-110 active:scale-105 hover:border-[#94060b]/30 hover:shadow-xl transition-all duration-100 ease-out hover:z-10 group h-full cursor-pointer"
                  >
                    
                    {/* RESTING STATE DISPLAY LAYOUT (Title, speaker, date, fileSize) */}
                    <div className="flex-1">
                      
                      {/* Upper decorative and audio status */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-sans font-bold text-[#E61A22] uppercase tracking-[0.15em] bg-[#94060b]/5 px-2.5 py-1 rounded-md">
                          {sermon.category}
                        </span>
                        {isCurrentPlaying && isPlaying && (
                          <span className="flex items-center gap-1.5 text-xs text-[#E61A22] font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E61A22] animate-ping" />
                            Streaming
                          </span>
                        )}
                      </div>

                      {/* Message title (Heavy sans-serif, uppercase) */}
                      <h3 className="font-sans font-extrabold text-base md:text-lg uppercase tracking-tight text-[#0A0A0A] mb-3 leading-snug group-hover:text-[#94060b] transition-colors">
                        {sermon.title}
                      </h3>
                      
                      {/* Speaker name */}
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-700">
                        <span className="text-slate-400">Speaker:</span>
                        <span>{sermon.speaker}</span>
                      </div>

                      {/* Meta stats row: Date & File size */}
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sermon.date}</span>
                        </div>
                        {sermon.fileSize && (
                          <div className="flex items-center gap-1">
                            <Disc className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-800 font-bold">{sermon.fileSize}</span>
                          </div>
                        )}
                        {sermon.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-800 font-bold">{sermon.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* ACCORDION EXPANSION PANEL SECTION */}
                      {isExpanded && (
                        <div 
                          id={`accordion-expanded-${sermon.id}`}
                          className="mt-5 pt-5 border-t border-slate-100 animate-fadeIn"
                        >
                          {/* Sermon Description Paragraphs */}
                          <p className="font-sans text-[#2D3748] text-xs leading-relaxed mb-5 font-light">
                            {sermon.description}
                          </p>

                          {/* scriptures badges panel */}
                          <div className="mb-4">
                            <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-2 block">
                              Key Scriptures
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {sermon.scriptures.map((scripture, index) => (
                                <span 
                                  key={index}
                                  className="text-[#E61A22] bg-gray-100 px-3 py-1.5 text-xs font-bold rounded-md uppercase tracking-wide border border-slate-200/50"
                                >
                                  {scripture}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Actions Bar of Card */}
                    <div className="border-t border-gray-100/70 pt-4 mt-4 flex flex-row items-center justify-between w-full">
                      
                      {/* 1. Play Sermon icon trigger button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySermon(sermon);
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider hover:scale-105 active:scale-105 transition-all duration-100 ease-out cursor-pointer ${
                          isCurrentPlaying && isPlaying
                            ? 'bg-slate-950 text-white hover:bg-slate-900 shadow-md shadow-slate-950/25'
                            : 'bg-[#E61A22] text-white hover:bg-[#b51017] shadow-lg shadow-[#E61A22]/20'
                        }`}
                      >
                        {isCurrentPlaying && isPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Play Sermon
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {/* 2. Accordion dynamic expander button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedSermonId(isExpanded ? null : sermon.id);
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer hover:scale-105 active:scale-105 transition-all duration-100 ease-out"
                          title={isExpanded ? "Hide Info" : "View Details"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {/* 3. Card-level Download Button */}
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={sermon.audioUrl}
                          download={`Zion_Sermon_${sermon.id}.mp3`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer hover:scale-105 active:scale-105 transition-all duration-100 ease-out"
                          title="Download sermon"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>

                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl" id="no-sermons-box">
            <span className="inline-block bg-[#94060b]/10 text-[#E61A22] p-4 rounded-full mb-3">
              <BookOpen className="w-6 h-6" />
            </span>
            <p className="text-slate-500 font-sans text-sm font-semibold">No sermons match your filter configurations.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
              }}
              className="mt-4 text-[#94060b] font-sans font-bold text-xs uppercase tracking-widest hover:underline cursor-pointer hover:scale-105 active:scale-105 transition-transform duration-100 ease-out"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      <br /> <br />

      <Footer onNavigate={onNavigate} />

      {/* 4. FLOATING INTERACTIVE GLASS AUDIO DEDICATED MEDIA PLAYER UTILITY BAR */}
      {playingSermon && (
        <div 
          id="premium-system-sermon-player"
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-slate-800 text-white p-5 md:p-6 shadow-2xl animate-slideInUp"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
            
            {/* Left Col: Info panel + Equalizer kinetic bouncing effect */}
            <div className="flex items-center gap-5 w-full md:w-1/3">
              
              {/* Kinetic Equalizer System Panel that activates ONLY when audio is playing */}
              <div 
                id="equalizer-waveform-box"
                className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center gap-1 shrink-0 px-2 overflow-hidden border border-slate-800"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className={`w-1 rounded-full bg-[#E61A22] ${
                      isPlaying ? `custom-eq-bar-${num}` : 'h-1.5'
                    }`}
                  />
                ))}
              </div>

              {/* Title & Preacher info */}
              <div className="truncate flex-1">
                <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.2em] text-[#E61A22] block mb-0.5">
                  {playingSermon.category}
                </span>
                <h4 className="font-sans font-bold text-sm uppercase tracking-tight text-white truncate">
                  {playingSermon.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate font-normal">
                  Recorded from Zion Loveworld Pulpit by {playingSermon.speaker}
                </p>
              </div>

            </div>

            {/* Middle Col: Control triggers & Wave scrubbing progression rail */}
            <div className="flex flex-col gap-3 w-full md:w-1/2 flex-1">
              
              <div className="flex items-center justify-center gap-4">
                
                {/* Simulated Time labels */}
                <span className="text-[10px] text-slate-400 font-mono w-10 text-right select-none">
                  {formatTime(currentTime)}
                </span>

                {/* Simulated wave-style progress scrubbing bar */}
                <div 
                  id="waveform-scrubbar-rail"
                  onClick={handleWaveScrub}
                  className="relative flex-grow h-6 flex items-center cursor-pointer select-none group"
                >
                  <div className="absolute inset-0 flex justify-between items-center gap-0.5 pointer-events-none">
                    {[...Array(30)].map((_, i) => {
                      const limit = (i / 30) * 100;
                      const isActive = progressPercent >= limit;
                      return (
                        <div
                          key={i}
                          className={`w-[3px] rounded-full transition-all duration-150 ${
                            isActive 
                              ? 'bg-[#E61A22] h-4.5 group-hover:bg-[#ff3b45]' 
                              : 'bg-slate-700 h-2.5'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Duration Label */}
                <span className="text-[10px] text-slate-400 font-mono w-10 text-left select-none">
                  {formatTime(duration)}
                </span>

              </div>

              {/* Core Media interaction player buttons */}
              <div className="flex items-center justify-center gap-6">
                
                {/* Play/Pause control */}
                <button
                  onClick={() => handlePlaySermon(playingSermon)}
                  className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 active:scale-105 transition-transform duration-100 ease-out outline-none cursor-pointer border border-transparent"
                  aria-label={isPlaying ? "Pause music stream" : "Play music stream"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-slate-950 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 text-slate-950 fill-current ml-0.5" />
                  )}
                </button>

                {/* Mute toggle option */}
                <button
                  onClick={handleToggleMute}
                  className="text-slate-400 hover:text-[#E61A22] hover:scale-110 active:scale-105 transition-transform duration-100 ease-out p-1.5 cursor-pointer"
                  title={isMuted ? "Unmute sound" : "Mute sound"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-[#E61A22]" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Sow seed in anchor integration */}
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    audioRef.current?.pause();
                    onSowSeedClick();
                  }}
                  className="hidden sm:inline-block border border-slate-700 hover:border-[#E61A22] text-slate-300 hover:text-[#E61A22] font-sans font-bold text-[9px] uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#94060b]/5 transition-transform hover:scale-105 active:scale-105 duration-100 ease-out cursor-pointer"
                >
                  Sow Seed for this Word
                </button>

              </div>

            </div>

            {/* Right Col: Highly visible Crimson Red Download button and Share */}
            <div className="flex items-center justify-end gap-3 w-full md:w-1/4">
              
              {/* Share Trigger */}
              <div className="relative">
                <button 
                  onClick={(e) => handleSermonShare(playingSermon, e)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] font-sans font-semibold uppercase tracking-wider bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-xl hover:scale-105 active:scale-105 transition-transform duration-100 ease-out cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E61A22]" />
                  Share
                </button>

                {/* Clipboard Copy Confirmation Toast */}
                {copiedSermonId === playingSermon.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950 text-white text-[10px] font-sans font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn z-20 animate-fade-in-down">
                    <span className="flex items-center gap-1">
                      <span>✨</span> Link copied! Share away.
                    </span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                  </div>
                )}
              </div>

              {/* Crimson Red Download Button */}
              <a
                href={playingSermon.audioUrl}
                download={`Zion_Loveworld_Sermon_${playingSermon.id}.mp3`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E61A22] hover:bg-[#b51017] text-white font-sans font-bold text-[10px] uppercase tracking-widest px-5 py-3 rounded-xl hover:scale-105 active:scale-105 transition-transform duration-100 ease-out flex items-center gap-2 cursor-pointer shadow-md shadow-[#E61A22]/20"
              >
                <Download className="w-3.5 h-3.5" />
                Download Sermon
              </a>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
