import React, { useState } from 'react';
import {
  Cpu,
  Flame,
  Layers,
  Shield,
  Zap,
  Gauge,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Activity,
  CheckCircle,
  Sliders,
  Settings,
  Wind,
  Award
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function EngineeringPage({ onOpenTestDriveModal, onNavigateToHome, onNavigateToCars }) {
  const { cmsData } = useCMS();
  const engineeringPillars = cmsData?.engineeringPillars || [];
  const materials = cmsData?.materials || [];

  const [activeTab, setActiveTab] = useState(0);

  const buildStages = [
    {
      step: '01',
      title: 'DIGITAL CFD & AERODYNAMICS',
      desc: 'Over 2,500 hours of supercomputer airflow simulations to optimize drag and downforce before tooling begins.',
    },
    {
      step: '02',
      title: 'AUTOCLAVE CARBON CURING',
      desc: 'Hand-laid carbon sheets cured in pressurized autoclaves to ensure 100% structural density without voids.',
    },
    {
      step: '03',
      title: 'ENGINE BLUEPRINTING & ASSEMBLY',
      desc: 'Each powertrain is hand-assembled by a dedicated technician, dyno-tested, and verified for peak power output.',
    },
    {
      step: '04',
      title: 'BESPOKE CABIN UPHOLSTERY',
      desc: 'Hand-cut Italian leather and lightweight Alcantara precisely stitched with custom client monogramming.',
    },
    {
      step: '05',
      title: 'PRIVATE CIRCUIT SHAKEDOWN',
      desc: 'Every completed hypercar undergoes 200 km of rigorous high-speed track testing and suspension calibration before handover.',
    }
  ];

  const currentPillar = engineeringPillars[activeTab];

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
                ATELIER ENGINEERING
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
                BOOK ATELIER VISIT
              </button>
            </div>
          </div>

          {/* Page Title & Mission */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-md bg-[#020F06] text-[#FA353F] font-mono text-[11px] uppercase tracking-widest font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>MOTORSPORT ARCHITECTURE</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#020F06] uppercase tracking-wider leading-tight">
                ENGINEERED FOR <span className="text-white drop-shadow-md">PRECISION</span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#020F06]/90 max-w-2xl font-medium leading-relaxed">
                Every component is created from scratch with aerospace materials to achieve maximum rigidity, aerodynamic stability, and unmatched powertrain performance.
              </p>
            </div>

            {/* Quick Benchmark Stats */}
            <div className="grid grid-cols-2 gap-3 bg-[#020F06] p-4 rounded-lg text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl shrink-0">
              <div className="p-3 bg-[#061F10] rounded">
                <span className="block font-mono text-[9px] text-[#FA353F] uppercase">CHASSIS RIGIDITY</span>
                <span className="font-mono text-base font-bold text-white">42,500 NM/DEG</span>
              </div>
              <div className="p-3 bg-[#061F10] rounded">
                <span className="block font-mono text-[9px] text-[#FA353F] uppercase">V12 REDLINE</span>
                <span className="font-mono text-base font-bold text-[#FA353F]">11,100 RPM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL-PALETTE BLUEPRINT EXPLORER (Obsidian Black Green Background) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="bg-[#061F10] rounded-lg border border-[#FA353F]/30 p-6 sm:p-10 shadow-2xl space-y-8">
          <div>
            <span className="font-mono text-xs text-[#FA353F] uppercase tracking-widest font-bold block mb-1">
              TECHNICAL BLUEPRINT EXPLORER
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] uppercase">
              CORE ENGINEERING PILLARS
            </h2>
          </div>

          {/* Tab Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {engineeringPillars.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  audioEngine.playClick();
                  setActiveTab(idx);
                }}
                className={`p-4 rounded-md text-left transition-all flex flex-col justify-between ${
                  activeTab === idx
                    ? 'bg-[#020F06] border-2 border-[#FA353F] text-white shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                    : 'bg-[#020F06]/60 border border-[#98AEA3]/20 text-[#98AEA3] hover:border-[#FA353F]/50 hover:text-white'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold block mb-1">
                    PILLAR 0{idx + 1}
                  </span>
                  <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wide">
                    {item.title}
                  </h3>
                </div>
                <div className="pt-3 mt-3 border-t border-[#98AEA3]/15 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#7E9389]">{item.spec}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeTab === idx ? 'text-[#FA353F]' : 'text-[#7E9389]'}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Active Blueprint Detail Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4 border-t border-[#98AEA3]/15">
            {/* Spec breakdown */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest">
                    {currentPillar.subtitle}
                  </span>
                  <span className="px-3 py-1 rounded bg-[#020F06] border border-[#FA353F]/40 font-mono text-[11px] text-[#FA353F] font-bold">
                    {currentPillar.weight}
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] uppercase tracking-wide mb-4">
                  {currentPillar.title}
                </h3>

                <p className="font-sans text-sm sm:text-base text-[#98AEA3] leading-relaxed mb-6">
                  {currentPillar.desc}
                </p>

                <div className="space-y-3">
                  <span className="font-mono text-xs text-[#F5FAF7] uppercase tracking-widest font-bold block">
                    ENGINEERING HIGHLIGHTS:
                  </span>
                  {currentPillar.highlights.map((h, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3.5 rounded-md bg-[#020F06] border border-[#98AEA3]/15">
                      <div className="w-2 h-2 rounded-full bg-[#FA353F] mt-1.5 shrink-0" />
                      <span className="font-sans text-xs sm:text-sm text-[#F5FAF7]">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#020F06] rounded-md border border-[#FA353F]/30 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#7E9389] uppercase tracking-widest block">
                    {currentPillar.specLabel}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#FA353F]">{currentPillar.spec}</span>
                </div>
                <button
                  onClick={() => {
                    audioEngine.playTelemetryBeep();
                    onOpenTestDriveModal();
                  }}
                  className="px-4 py-2 rounded bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-ruby-glow transition-all"
                >
                  REQUEST SPEC SHEET
                </button>
              </div>
            </div>

            {/* Visual technical rendering */}
            <div className="lg:col-span-5 relative rounded-md overflow-hidden border border-[#98AEA3]/20 bg-[#020F06] min-h-[320px] flex flex-col justify-end p-6 group">
              <img
                src={currentPillar.image}
                alt={`${cmsData?.siteMeta?.brandName || 'VELOCE'} Engineering Architecture - ${currentPillar.title} (${currentPillar.subtitle})`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020F06] via-[#020F06]/50 to-transparent" />
              <div className="relative z-10 space-y-2">
                <span className="inline-block font-mono text-[10px] text-[#FA353F] bg-[#020F06]/90 px-3 py-1 rounded border border-[#FA353F]/40 font-bold uppercase">
                  ATELIER TEST BENCH #0{activeTab + 1}
                </span>
                <h4 className="font-display font-bold text-lg text-[#F5FAF7] uppercase">
                  {currentPillar.title}
                </h4>
                <p className="font-sans text-xs text-[#98AEA3]">
                  Individually calibrated and tested on our high-speed private proving circuit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL-PALETTE MATERIAL SCIENCE SECTION (Ruby Red Background) */}
      <section className="bg-[#FA353F] py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-b-2 border-[#020F06] text-[#020F06]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#020F06]/20 pb-4 gap-4">
            <div>
              <span className="font-mono text-xs text-[#020F06] font-bold uppercase tracking-widest block mb-1">
                METALLURGY &amp; COMPOSITES
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#020F06] uppercase">
                AEROSPACE MATERIAL SCIENCE
              </h2>
            </div>
            <span className="font-mono text-xs text-[#020F06]/80 font-bold">
              100% AEROSPACE GRADE MATERIALS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((mat, idx) => (
              <div
                key={mat.name}
                className="luxury-card-hover p-6 rounded-lg bg-[#020F06] text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold block mb-2">
                    MATERIAL 0{idx + 1}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#F5FAF7] uppercase mb-1">
                    {mat.name}
                  </h3>
                  <p className="font-mono text-xs text-[#FA353F] font-semibold mb-2">{mat.role}</p>
                  <p className="font-sans text-xs text-[#98AEA3] leading-relaxed">{mat.benefit}</p>
                </div>
                <div className="pt-3 border-t border-[#98AEA3]/15">
                  <span className="font-mono text-[10px] text-[#F5FAF7] font-bold bg-[#061F10] px-2.5 py-1 rounded border border-[#98AEA3]/15 block text-center">
                    {mat.stat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DUAL-PALETTE 5-STAGE BUILD TIMELINE (Obsidian Black Green Background) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="bg-[#061F10] rounded-lg border border-[#FA353F]/30 p-6 sm:p-10 shadow-2xl space-y-8">
          <div>
            <span className="font-mono text-xs text-[#FA353F] uppercase tracking-widest font-bold block mb-1">
              HANDCRAFTED IN EUROPE
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] uppercase">
              THE 5-STAGE BUILD PROCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {buildStages.map((stage) => (
              <div
                key={stage.step}
                className="luxury-card-hover p-5 rounded-md bg-[#020F06] border border-[#98AEA3]/15 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-2xl font-bold text-[#FA353F] block mb-1">
                    {stage.step}
                  </span>
                  <h4 className="font-display font-bold text-xs text-[#F5FAF7] uppercase tracking-wide mb-2">
                    {stage.title}
                  </h4>
                  <p className="font-sans text-xs text-[#98AEA3] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-[#FA353F] rounded-lg p-6 sm:p-12 border-2 border-[#020F06] shadow-2xl text-[#020F06] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl sm:text-3xl uppercase tracking-wide text-[#020F06]">
              EXPERIENCE THE ENGINEERING FIRSTHAND
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#020F06]/90 max-w-xl font-medium">
              Schedule an exclusive consultation with our master engineers and experience our cars on the private proving grounds.
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
              SCHEDULE TEST DRIVE
            </button>
            <button
              onClick={() => {
                audioEngine.playClick();
                onNavigateToCars();
              }}
              className="luxury-btn-hover w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#F5FAF7] text-[#020F06] font-mono text-xs font-bold uppercase tracking-widest shadow-md transition-all text-center"
            >
              VIEW CARS SHOP
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
