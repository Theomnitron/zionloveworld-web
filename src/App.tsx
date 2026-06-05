/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChurchView } from './types/church';
import Navbar from './components/Navbar';
import AppRouter from './components/AppRouter';
import { CHURCH_INFO, NAV_ITEMS } from './data/churchData';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  X, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  Church,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ChurchView>('home');
  const [anchorSection, setAnchorSection] = useState<string | undefined>(undefined);
  
  // Custom address copy helper
  const [addressCopied, setAddressCopied] = useState(false);
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CHURCH_INFO.address);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };
  
  // Plan A Visit Modal states
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitName, setVisitName] = useState('');
  const [visitEmail, setVisitEmail] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitService, setVisitService] = useState('Sunday Morning 09:00 AM');
  const [visitComplete, setVisitComplete] = useState(false);

  // Asynchronous status controls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleNavigate = (view: ChurchView, anchor?: string) => {
    setCurrentView(view);
    setAnchorSection(anchor);
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitName.trim() || !visitEmail.trim() || !visitDate) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Hardcoded credentials for instant client-side preview execution
    const sheetsWebhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL as string;
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
      "Timestamp": new Date().toLocaleString(),
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
      const [sheetsResponse, emailjsResponse] = await Promise.all([
        fetch(sheetsWebhookUrl, {
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
        throw new Error(`Google Sheets Error (${sheetsResponse.status}): ${sheetsErrText || "Check Sheet.best credentials"}`);
      }

      // 2. Check if EmailJS API rejected the message structure
      if (!emailjsResponse.ok) {
        const emailErrText = await emailjsResponse.text().catch(() => "");
        throw new Error(`EmailJS Mail Error (${emailjsResponse.status}): ${emailErrText || "Check template configurations"}`);
      }

      // 3. Set completion flag true to transition the modal inner layout to the Success screen
      setVisitComplete(true);

      // 4. Broadcast global success toast notification banner at the top of the screen
      setShowSuccessToast(true);

      // 5. Automatically auto-dismiss toast banner after 6 seconds
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

  const closeVisitModal = () => {
    setVisitModalOpen(false);
    setVisitComplete(false);
    setVisitName('');
    setVisitEmail('');
    setVisitPhone('');
    setVisitDate('');
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" id="main-application-frame">
      
      {/* SUCCESS TOAST NOTIFICATION BANNER */}
      {showSuccessToast && (
        <div id="visit-success-alert-banner" className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] w-full max-w-md px-4 animate-fade-in-down">
          <div className="bg-emerald-600 text-white p-4.5 rounded-2xl shadow-2xl flex items-start gap-3 border border-emerald-500 backdrop-blur-md">
            <CheckCircle className="w-5 h-5 text-emerald-100 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-white">
                Reservation Confirmed!
              </h4>
              <p className="font-sans text-[11px] text-emerald-50 mt-1 leading-relaxed">
                Welcome Experience booked successfully. We cannot wait to host you in the Loveworld Sanctuary!
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
      )}

      {/* 1. Header Navigation shell */}
      <Navbar 
        currentView={currentView}
        onNavigate={handleNavigate}
        onPlanVisit={() => setVisitModalOpen(true)}
      />

      {/* 2. Main content view router switch component */}
      <main className="flex-grow flex flex-col">
        <AppRouter 
          currentView={currentView}
          anchorSection={anchorSection}
          onNavigate={handleNavigate}
          onPlanVisit={() => setVisitModalOpen(true)}
        />
      </main>

      {/* 4. MODAL DRAWER: "PLAN A VISIT" VISITATION BOOKING PLATFORM */}
      {visitModalOpen && (
        <div id="visit-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div id="visit-modal-card" className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative p-8 border border-gray-100 overflow-hidden">
            
            {/* Background design glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#94060b]/10 rounded-full blur-xl" />

            {/* Modal Closer */}
            <button
              onClick={closeVisitModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#94060b] p-2 hover:scale-115 transition-transform"
              aria-label="Close visitation wizard"
            >
              <X className="w-4 h-4" />
            </button>

            {!visitComplete ? (
              <form onSubmit={handleVisitSubmit} className="flex flex-col gap-6 relative z-10" id="visit-booking-form">
                
                {/* Header title */}
                <div className="text-center pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#94060b]/10 flex items-center justify-center text-[#94060b] mx-auto mb-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-extrabold text-lg uppercase tracking-tight text-[#2D3748]">
                    Plan Your Visitation
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Receive host escorting, a welcome package, and reserved sanctuary slots.
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
                  <label className="font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Gabriel Michael"
                    value={visitName}
                    onChange={(e) => setVisitName(e.target.value)}
                    className="w-full border border-gray-200 bg-white px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-[#94060b]"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="gabriel@example.com"
                      value={visitEmail}
                      onChange={(e) => setVisitEmail(e.target.value)}
                      className="w-full border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#94060b]"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500">Phone (for SMS alert)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 777-1111"
                      value={visitPhone}
                      onChange={(e) => setVisitPhone(e.target.value)}
                      className="w-full border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#94060b]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500">Preferred Encounter Service</label>
                  <select
                    value={visitService}
                    onChange={(e) => setVisitService(e.target.value)}
                    className="w-full border border-gray-200 bg-white px-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-[#94060b]"
                    disabled={isSubmitting}
                  >
                    <option value="Sunday Morning Word Service (09:00 AM)">Sunday Morning Word Service (09:00 AM)</option>
                    <option value="Sunday Prophetic Worship Service (11:00 AM)">Sunday Prophetic Worship Service (11:00 AM)</option>
                    <option value="Wednesday Spiritual Elevate Bible Study (06:30 PM)">Wednesday Bible Study Academy (06:30 PM)</option>
                    <option value="Friday Breakthrough Midnight Vigil (11:00 PM)">Friday Breakthrough Vigil (11:00 PM)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500">Proposed Visitation Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full border border-gray-200 bg-white px-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-[#94060b] text-gray-700"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit button following active scale feedback contract */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-2 font-sans font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-md shadow-[#94060b]/10 cursor-pointer text-center relative flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-slate-400 text-white cursor-not-allowed opacity-80 scale-[0.98]' 
                      : 'bg-[#94060b] hover:bg-[#730408] text-white hover:scale-105 active:scale-105 transition-transform duration-100 ease-out'
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
              <div className="text-center py-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-xs">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-sans font-bold text-lg uppercase tracking-wider text-[#2D3748] mb-1">
                  Visitation Booked!
                </h3>
                <p className="text-xs text-[#94060b] font-bold uppercase tracking-wider mb-3">
                  Welcome to the Loveworld Sanctuary!
                </p>
                <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-sm mb-6">
                  Thank you, <strong>{visitName}</strong>. Our guest integration captains have registered your visitation for <strong>{visitDate}</strong> to join the <strong>{visitService}</strong>. A guide is transmitted to <strong>{visitEmail}</strong>.
                </p>

                <div className="bg-gray-50 p-4 rounded-2xl w-full text-left border border-gray-100 text-xs text-gray-600 flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#94060b]" />
                    <span>Host Assigned: Loveworld Guest Angels Room</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#94060b]" />
                    <span>Reserved sanctuary seating slots included.</span>
                  </div>
                </div>

                <button
                  onClick={closeVisitModal}
                  className="w-full bg-[#94060b] hover:bg-[#730408] text-white font-sans font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl cursor-pointer"
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
