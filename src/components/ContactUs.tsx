/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { CHURCH_INFO } from '../data/churchData';
import ScrollReveal from './ScrollReveal';

export default function ContactUs() {
  // --- FORM STATES ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageType, setMessageType] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  // --- INTERACTION & SUBMISSION STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sheetsContactWebhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_CONTACT_WEBHOOK_URL as string;

  // --- SUBMISSION HANDLER WITH DUAL-TRANSMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side field validations
    if (!name.trim()) {
      setErrorMsg('Kindly enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Kindly enter a valid email address.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('Kindly enter your phone number.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Kindly write your message or testimony details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Format clean payloads
      const serialNumber = new Date().getTime().toString();

      // 2. Prepare comprehensive payload maps for Sheet.best spreadsheet injection
      const timestamp = new Date().toISOString();
      const sheetPayload = {
        sn: serialNumber,
        name: name.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        message_type: messageType,
        message: message.trim(),
        timestamp: timestamp,
        // Fallbacks for header mapping variations (for safe Google Sheet column alignment)
        "S/N": serialNumber,
        "Name": name.trim(),
        "Email": email.trim(),
        "Phone Number": phoneNumber.trim(),
        "Message Type": messageType,
        "Message": message.trim(),
        "Timestamp": timestamp
      };

      // 3. FIRST DUAL-TRANSMISSION: Inject record into Sheet.best
      const sheetsResponse = await fetch(sheetsContactWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetPayload),
      });

      if (!sheetsResponse.ok) {
        throw new Error(`Please check your Internect Connecttion and try again`);
        // throw new Error(`Database submission rejected (Status: ${sheetsResponse.status})`);
      }

      // 4. SECOND DUAL-TRANSMISSION: Dispatch automated email notification via @emailjs/browser
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID; // App-specific Service ID
      const emailjsTemplateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID; // Custom requested placeholder template ID
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY; // App-specific Public Key

      const emailParams = {
        sn: serialNumber,
        name: name.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        message_type: messageType,
        message: message.trim(),
      };

      await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        emailParams,
        emailjsPublicKey
      );

      // 5. SUCCESS TRANSITION
      setIsSuccess(true);
      
      // Empty input fields completely upon successful workflows
      setName('');
      setEmail('');
      setPhoneNumber('');
      setMessageType('General Inquiry');
      setMessage('');

    } catch (err: any) {
      console.error('Dual-submission pipeline error:', err);
      setErrorMsg(err.message || 'Transmission failed. Please verify your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* 1. LAYOUT ARCHITECTURE & VISUAL BREAK (Transitions smoothly between sections) */
    <section 
      id="contact-us" 
      className="bg-slate-50 py-20 px-6 border-b border-gray-300 relative overflow-hidden"
    >
      {/* Dynamic background accent vector detail */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-100 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
        
        {/* 2. LEFT COLUMN: HIGH-FIDELITY TEXT CONTENT & SUPPORT INFO */}
        <ScrollReveal delay={400}>
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start bg-[#E61A22]/10 px-3.5 py-1.5 rounded-md">
              <span className="text-[0.6rem] md:text-xs font-sans font-extrabold tracking-widest text-red-600 uppercase">
                CONNECT WITH US
              </span>
            </div>

            <h2 className="font-sans font-black text-2xl md:text-3xl lg:text-4xl text-slate-900 leading-tight tracking-tight uppercase">
              SEND A MESSAGE <br />
              <span className="text-[#E61A22]">OR A TESTIMONY</span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed max-w-lg font-light">
              Do you have a question, a suggestion, a prayer request, a spiritual counseling request, or a glorious victory testimony of how God is transforming your life through Zion Loveworld Gospel Ministry International? 
              <br /><br />
              Our hospitality and pastoral teams are waiting to read, pray, and respond to your messages. Kindly fill in your details in the form.
            </p>

            {/* Quick contact context badging to elevate design completeness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:scale-105 active:scale-105 transition-transform duration-100 ease-out">
                <Mail className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OFFICIAL EMAIL</span>
                  <span className="text-xs font-semibold text-slate-800 break-all">{CHURCH_INFO.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:scale-105 active:scale-105 transition-transform duration-100 ease-out">
                <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COVENANT PHONE HELPLINE</span>
                  <span className="text-xs font-semibold text-slate-800">{CHURCH_INFO.phone}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm sm:col-span-2 hover:scale-105 active:scale-105 transition-transform duration-100 ease-out">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MAIN SANCTUARY ADDRESS</span>
                  <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {CHURCH_INFO.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3. RIGHT COLUMN: THE FORM HOOKS & SUBMISSION CONTAINER */}
        <ScrollReveal delay={400}>
          <div className="bg-white border border-gray-150 p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-100 relative">
            {isSuccess ? (
              /* Transition success card rendering upon successful executions of both endpoints */
              <div className="flex flex-col items-center justify-center text-center py-10 px-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-150 flex items-center justify-center mb-6 text-emerald-600 shadow-inner animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-sans font-black text-xl text-slate-900 uppercase tracking-tight mb-3">
                  Message Sent Successfully
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                  Shalom! Your message has been successfully sent to our hospitality team, and a confirmation email has been sent to your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="bg-[#E61A22] hover:bg-[#730408] text-white font-bold py-3 px-8 rounded-xl transition-all uppercase tracking-wider text-xs focus:outline-none focus:ring-2 focus:ring-slate-950 active:scale-95 duration-150"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* Active Form Rendering */
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Form Overhead Title for clarity */}
                <div className="border-b border-gray-100 pb-3 mb-2">
                  <h3 className="font-sans font-bold text-sm text-slate-700 uppercase tracking-wider">
                    Kindly Fill in your details:
                  </h3>
                </div>

                {/* Error Alert Display Block */}
                {errorMsg && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-150 rounded-xl text-xs text-red-700 leading-relaxed animate-pulse">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Name input */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-name" className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Obi Olalekan"
                    disabled={isSubmitting}
                    className="bg-white border border-gray-200 focus:border-red-600 rounded-xl p-3 text-sm outline-none transition-all w-full focus:ring-2 focus:ring-red-50/50"
                  />
                </div>

                {/* Email + Phone Number grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="form-email" className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. obiolalekan@gmail.com"
                      disabled={isSubmitting}
                      className="bg-white border border-gray-200 focus:border-red-600 rounded-xl p-3 text-sm outline-none transition-all w-full focus:ring-2 focus:ring-red-50/50"
                    />
                  </div>

                  {/* Phone Number input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="form-phone" className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="form-phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +234 803 123 4567"
                      disabled={isSubmitting}
                      className="bg-white border border-gray-200 focus:border-red-600 rounded-xl p-3 text-sm outline-none transition-all w-full focus:ring-2 focus:ring-red-50/50"
                    />
                  </div>
                </div>

                {/* Message Type input (select dropdown) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-type" className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500">
                    Message Type / Inquiry Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="form-type"
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value)}
                      disabled={isSubmitting}
                      className="bg-white border border-gray-200 focus:border-red-600 rounded-xl p-3 text-sm outline-none transition-all w-full appearance-none cursor-pointer focus:ring-2 focus:ring-red-50/50"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Testimony">Testimony</option>
                      <option value="Prayer Request">Prayer Request</option>
                      <option value="Counseling">Counseling</option>
                      <option value="Suggestions">Suggestions</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Message multi-line textarea box */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-message" className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500">
                    Your Message<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a detailed overview of your request, or type in your glorious testimony to God's glory..."
                    disabled={isSubmitting}
                    rows={4}
                    className="bg-white border border-gray-200 focus:border-red-600 rounded-xl p-3 text-sm outline-none transition-all w-full resize-y focus:ring-2 focus:ring-red-50/50"
                  />
                </div>

                {/* Button Submission Row */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-[#E61A22] hover:bg-[#730408] text-white font-bold py-3.5 px-6 rounded-xl transition-all uppercase tracking-wider text-xs w-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    isSubmitting 
                        ? 'bg-slate-400 text-white cursor-not-allowed opacity-80 scale-[0.98]' 
                        : 'bg-[#E61A22] hover:bg-[#730408] text-white hover:scale-105 active:scale-105 transition-transform duration-100 ease-out'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
