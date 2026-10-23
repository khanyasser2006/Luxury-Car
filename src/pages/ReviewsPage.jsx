import React, { useState } from 'react';
import {
  Award,
  Shield,
  CheckCircle,
  Globe,
  Lock,
  Clock,
  ChevronLeft,
  ArrowRight,
  Gauge,
  Sparkles,
  Star,
  Activity,
  Trophy,
  Quote
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function ReviewsPage({ onOpenTestDriveModal, onNavigateToHome, onNavigateToCars }) {
  const { cmsData } = useCMS();
  const testimonials = cmsData?.testimonials || [];
  const lapRecords = cmsData?.lapRecords || [];

  const pressAccolades = [
    {
      outlet: 'APEX MOTORSPORT MAGAZINE',
      verdict: 'The purest high-revving combustion experience remaining on earth. A transcendent triumph of lightweight engineering.',
      award: 'HYPERCAR OF THE YEAR 2026',
    },
    {
      outlet: 'SPEED & VELOCITY JOURNAL',
      verdict: 'Cornering speeds that rival LMP1 racecars. The active downforce makes the car feel glued to the tarmac at any speed.',
      award: 'BEST TRACK PERFORMANCE',
    },
    {
      outlet: 'LUXURY CONNOISSEUR',
      verdict: 'Beyond speed, the craftsmanship of the titanium switches and aniline leather sets a new pinnacle for bespoke automotive luxury.',
      award: 'BEST BESPOKE ATELIER',
    },
  ];

  return (
    <div className="page-transition-enter min-h-screen bg-[#020F06] text-[#F5FAF7] pt-24 pb-20 selection:bg-[#FA353F] selection:text-[#020F06]">
      {/* 1. DUAL-PALETTE HERO SECTION (Ruby Red Background) */}
      <section className="bg-[#FA353F] text-[#020F06] py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-[#020F06] relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Breadcrumb & Home Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#020F06]/20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onNavigateToHome();
                }}
                className="luxury-btn-hover inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-[#020F06] hover:bg-[#061F10] text-[#F5FAF7] font-mono text-xs transition-colors shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>BACK TO HOME</span>
              </button>
              <span className="font-mono text-xs text-[#020F06]/60">/</span>
              <span className="font-mono text-xs text-[#020F06] font-bold uppercase tracking-widest">
                CLIENT REVIEWS &amp; CIRCLE
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  audioEngine.playTelemetryBeep();
                  onOpenTestDriveModal();
                }}
                className="luxury-btn-hover px-5 py-2 rounded-full bg-[#020F06] hover:bg-[#061F10] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-2xl transition-all"
              >
                JOIN DRIVERS CLUB
              </button>
            </div>
          </div>

          {/* Hero Title & Description */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-md bg-[#020F06] text-[#FA353F] font-mono text-[11px] uppercase tracking-widest font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>GLOBAL DRIVER COMMUNITY</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#020F06] uppercase tracking-wider leading-tight">
                WHAT OUR <span className="text-white drop-shadow-md">DRIVERS SAY</span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#020F06]/90 max-w-2xl font-medium leading-relaxed">
                Unfiltered feedback from verified hypercar owners, private circuit lap times, and global automotive press critical acclaim.
              </p>
            </div>

            {/* Quick Community Stats */}
            <div className="grid grid-cols-2 gap-3 bg-[#020F06] p-4 rounded-lg text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl shrink-0">
              <div className="p-3 bg-[#061F10] rounded">
                <span className="block font-mono text-[9px] text-[#FA353F] uppercase">VERIFIED OWNERS</span>
                <span className="font-mono text-base font-bold text-white">65 MEMBERS</span>
              </div>
              <div className="p-3 bg-[#061F10] rounded">
                <span className="block font-mono text-[9px] text-[#FA353F] uppercase">SATISFACTION</span>
                <span className="font-mono text-base font-bold text-[#FA353F]">5.0 &bull; 100%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL-PALETTE OWNER REVIEWS GRID (Obsidian Black Green Background) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#98AEA3]/15 pb-4 gap-4">
          <div>
            <span className="font-mono text-xs text-[#FA353F] uppercase tracking-widest font-bold block mb-1">
              VERIFIED OWNER TESTIMONIALS
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] uppercase">
              THE PATRON EXPERIENCES
            </h2>
          </div>
          <span className="font-mono text-xs text-[#7E9389]">
            100% VERIFIED CHASSIS OWNERS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="luxury-card-hover p-7 sm:p-8 rounded-lg bg-[#061F10] border-t-2 border-t-[#FA353F] border border-[#98AEA3]/15 shadow-xl flex flex-col justify-between space-y-6 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FA353F] text-[#FA353F]" />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-[#7E9389] uppercase">
                    {t.deliveryDate}
                  </span>
                </div>

                <p className="font-sans text-sm text-[#F5FAF7] leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#F5FAF7] uppercase">
                    {t.author}
                  </h4>
                  <p className="font-mono text-[10px] text-[#7E9389]">{t.location}</p>
                </div>
                <span className="font-mono text-[9px] text-[#FA353F] bg-[#020F06] px-2.5 py-1 rounded border border-[#FA353F]/30 font-bold">
                  {t.chassis}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DUAL-PALETTE PROVING GROUNDS TELEMETRY (Ruby Red Background) */}
      <section className="bg-[#FA353F] py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-b-2 border-[#020F06] text-[#020F06]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#020F06]/20 pb-4 gap-4">
            <div>
              <span className="font-mono text-xs text-[#020F06] uppercase tracking-widest font-bold block mb-1">
                PROVING GROUNDS TELEMETRY
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#020F06] uppercase">
                OFFICIAL CIRCUIT LAP RECORDS
              </h2>
            </div>
            <span className="font-mono text-xs text-[#020F06]/80 font-bold">
              GPS &amp; TRANSPONDER VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lapRecords.map((item, idx) => (
              <div
                key={item.track}
                className="luxury-card-hover p-6 rounded-lg bg-[#020F06] text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                  <div>
                    <span className="font-mono text-[10px] text-[#FA353F] font-bold block">
                      CIRCUIT RECORD 0{idx + 1}
                    </span>
                    <h3 className="font-display font-bold text-base text-[#F5FAF7] uppercase">
                      {item.track}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#FA353F]">
                      {item.time}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-[#061F10] rounded border border-[#98AEA3]/10">
                    <span className="text-[#7E9389] block text-[9px]">HYPERCAR:</span>
                    <span className="text-white font-bold">{item.car}</span>
                  </div>
                  <div className="p-2.5 bg-[#061F10] rounded border border-[#98AEA3]/10">
                    <span className="text-[#7E9389] block text-[9px]">SPEED TRAP:</span>
                    <span className="text-[#FA353F] font-bold">{item.speed}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#7E9389] pt-1">
                  <span>{item.location} ({item.length})</span>
                  <span>{item.driver}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DUAL-PALETTE PRESS & VIP PRIVILEGES (Obsidian Black Green Background) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Press Accolades */}
        <div className="space-y-8">
          <div>
            <span className="font-mono text-xs text-[#FA353F] uppercase tracking-widest font-bold block mb-1">
              MOTORSPORT MEDIA REVIEWS
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] uppercase">
              CRITICAL ACCLAIM
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pressAccolades.map((press) => (
              <div
                key={press.outlet}
                className="luxury-card-hover p-7 rounded-lg bg-[#061F10] border border-[#FA353F]/30 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded bg-[#020F06] border border-[#FA353F]/40 font-mono text-[10px] text-[#FA353F] font-bold uppercase tracking-widest mb-4">
                    {press.award}
                  </span>
                  <p className="font-sans text-sm text-[#F5FAF7] leading-relaxed italic mb-4">
                    &ldquo;{press.verdict}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-[#98AEA3]/15">
                  <span className="font-mono text-xs font-bold text-[#F5FAF7] uppercase tracking-wider block">
                    {press.outlet}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIP Ownership Privileges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-lg bg-[#061F10] border border-[#FA353F]/30 shadow-2xl">
          <div className="flex items-center space-x-3.5">
            <Globe className="w-6 h-6 text-[#FA353F] shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-[#F5FAF7] block">WORLDWIDE DELIVERY</span>
              <span className="font-sans text-xs text-[#7E9389]">Enclosed secure air freight</span>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <Lock className="w-6 h-6 text-[#FA353F] shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-[#F5FAF7] block">PRIVATE TRACK ACCESS</span>
              <span className="font-sans text-xs text-[#7E9389]">365-day circuit availability</span>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <Shield className="w-6 h-6 text-[#FA353F] shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-[#F5FAF7] block">PRO DRIVING COACHES</span>
              <span className="font-sans text-xs text-[#7E9389]">1-on-1 telemetry &amp; coaching</span>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <Clock className="w-6 h-6 text-[#FA353F] shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-[#F5FAF7] block">ATELIER CONCIERGE</span>
              <span className="font-sans text-xs text-[#7E9389]">Direct personal support</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-[#FA353F] rounded-lg p-6 sm:p-12 border-2 border-[#020F06] shadow-2xl text-[#020F06] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl sm:text-3xl uppercase tracking-wide text-[#020F06]">
              BECOME PART OF THE {cmsData?.siteMeta?.brandName?.toUpperCase() || 'VELOCE'} DRIVERS CIRCLE
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#020F06]/90 max-w-xl font-medium">
              Join exclusive track days, private collector rallies, and receive dedicated factory support for your custom build.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                audioEngine.playTelemetryBeep();
                onOpenTestDriveModal();
              }}
              className="luxury-btn-hover w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#020F06] hover:bg-[#061F10] text-[#F5FAF7] font-mono text-xs font-bold uppercase tracking-widest shadow-2xl transition-all text-center"
            >
              REQUEST MEMBERSHIP
            </button>
            <button
              onClick={() => {
                audioEngine.playClick();
                onNavigateToCars();
              }}
              className="luxury-btn-hover w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#F5FAF7] text-[#020F06] font-mono text-xs font-bold uppercase tracking-widest shadow-md transition-all text-center"
            >
              EXPLORE CARS SHOP
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
