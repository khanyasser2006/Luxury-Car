import React from 'react';
import { ArrowRight, Gauge, Sparkles, ChevronRight, Cpu, Star, Trophy, Shield } from 'lucide-react';
import HeroSequence from '../components/HeroSequence';
import ProvingGrounds from '../components/ProvingGrounds';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function HomePage({
  onOpenTestDriveModal,
  onNavigateToCars,
  onNavigateToEngineering,
  onNavigateToReviews,
}) {
  const { cmsData } = useCMS();
  const portals = cmsData?.homePortals || {};
  const cards = portals.cards || [];
  const card1 = cards[0] || {};
  const card2 = cards[1] || {};
  const card3 = cards[2] || {};

  return (
    <div className="relative">
      {/* 600-Frame Scroll Scrub Hero Experience */}
      <HeroSequence />

      {/* Navigation Hub & Page Portals */}
      <section id="home-content" className="py-24 bg-[#FA353F] border-t-2 border-b-2 border-[#020F06] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#020F06]/20 pb-6 gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#020F06] font-bold block mb-2">
                {portals.tag || 'VELOCE PORTALS'}
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#020F06] tracking-wider uppercase">
                {portals.titleMain || 'EXPLORE THE'} <span className="text-white drop-shadow-md">{portals.titleHighlight || 'VELOCE WORLD'}</span>
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#020F06]/95 font-medium max-w-md leading-relaxed">
              {portals.desc || 'Explore our custom hypercars, motorsport engineering craftsmanship, and private circuit driver community across our dedicated pages.'}
            </p>
          </div>

          {/* 3 Main Portal Cards Leading to Dedicated Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Cars Portal Card */}
            <div className="luxury-card-hover group bg-[#020F06] rounded-lg p-8 border-2 border-[#020F06] shadow-2xl flex flex-col justify-between space-y-6 text-[#F5FAF7]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-md bg-[#061F10] border border-[#FA353F]/40 text-[#FA353F] group-hover:scale-110 group-hover:border-[#FA353F] transition-all duration-300">
                    <Gauge className="w-5 h-5" />
                  </span>
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold uppercase tracking-widest bg-[#061F10] px-3 py-1 rounded border border-[#FA353F]/20 group-hover:border-[#FA353F]/50 transition-colors">
                    {card1.badge || '3 FLAGSHIPS'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wide group-hover:text-white transition-colors">
                  {card1.title || 'HYPERCAR STUDIO'}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#98AEA3] leading-relaxed">
                  {card1.desc || 'Interactive showroom featuring the Apex Nero GT, Valkyrie Stradale, and Phantom Corsa with custom paint, interior, and aero packages.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#98AEA3]/15 space-y-3">
                <button
                  onClick={() => {
                    audioEngine.playTelemetryBeep();
                    onNavigateToCars();
                  }}
                  className="luxury-btn-hover group/btn w-full py-3.5 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow flex items-center justify-center space-x-2 transition-all"
                >
                  <span>{card1.btnText || 'OPEN CARS STUDIO'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            {/* 2. Engineering Portal Card */}
            <div className="luxury-card-hover group bg-[#020F06] rounded-lg p-8 border-2 border-[#020F06] shadow-2xl flex flex-col justify-between space-y-6 text-[#F5FAF7]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-md bg-[#061F10] border border-[#FA353F]/40 text-[#FA353F] group-hover:scale-110 group-hover:border-[#FA353F] transition-all duration-300">
                    <Cpu className="w-5 h-5" />
                  </span>
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold uppercase tracking-widest bg-[#061F10] px-3 py-1 rounded border border-[#FA353F]/20 group-hover:border-[#FA353F]/50 transition-colors">
                    {card2.badge || 'MOTORSPORT TECH'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wide group-hover:text-white transition-colors">
                  {card2.title || 'ENGINEERING'}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#98AEA3] leading-relaxed">
                  {card2.desc || 'Deep-dive technical masterclass: 42,500 Nm/deg carbon monocoque chassis, 11,100 RPM V12 powertrain, and active aerodynamics.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#98AEA3]/15 space-y-3">
                <button
                  onClick={() => {
                    audioEngine.playTelemetryBeep();
                    onNavigateToEngineering();
                  }}
                  className="luxury-btn-hover group/btn w-full py-3.5 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow flex items-center justify-center space-x-2 transition-all"
                >
                  <span>{card2.btnText || 'VIEW ENGINEERING'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            {/* 3. Reviews Portal Card */}
            <div className="luxury-card-hover group bg-[#020F06] rounded-lg p-8 border-2 border-[#020F06] shadow-2xl flex flex-col justify-between space-y-6 text-[#F5FAF7]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-md bg-[#061F10] border border-[#FA353F]/40 text-[#FA353F] group-hover:scale-110 group-hover:border-[#FA353F] transition-all duration-300">
                    <Trophy className="w-5 h-5" />
                  </span>
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold uppercase tracking-widest bg-[#061F10] px-3 py-1 rounded border border-[#FA353F]/20 group-hover:border-[#FA353F]/50 transition-colors">
                    {card3.badge || 'VERIFIED DRIVERS'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wide group-hover:text-white transition-colors">
                  {card3.title || 'CLIENT REVIEWS'}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#98AEA3] leading-relaxed">
                  {card3.desc || 'Verified hypercar owner feedback, track lap records across international circuits, and global automotive press critical acclaim.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#98AEA3]/15 space-y-3">
                <button
                  onClick={() => {
                    audioEngine.playTelemetryBeep();
                    onNavigateToReviews();
                  }}
                  className="luxury-btn-hover group/btn w-full py-3.5 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow flex items-center justify-center space-x-2 transition-all"
                >
                  <span>{card3.btnText || 'READ CLIENT REVIEWS'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Proving Grounds Race Track */}
      <ProvingGrounds onOpenTestDriveModal={onOpenTestDriveModal} />
    </div>
  );
}
