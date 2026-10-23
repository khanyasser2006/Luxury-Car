import React, { useState } from 'react';
import { Compass, Shield, Flag, Gauge, ArrowRight, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function ProvingGrounds({ onOpenTestDriveModal }) {
  const { cmsData } = useCMS();
  const provingData = cmsData?.provingGrounds || {};
  const sectors = provingData.sectors || [];
  const protocolSteps = provingData.protocolSteps || [];

  const [activeSector, setActiveSector] = useState(0);
  const currentSector = sectors[activeSector] || sectors[0] || {};

  return (
    <section id="grounds" className="py-28 bg-[#020F06] relative overflow-hidden border-t-2 border-b-2 border-[#FA353F]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Asymmetric Meta */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-6 border-b border-[#98AEA3]/15 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FA353F] font-bold">
                {provingData.tag || 'PRIVATE RACETRACK'}
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F5FAF7] tracking-wider uppercase">
              {provingData.titleMain || 'OUR PRIVATE'}{' '}
              <span className="text-[#FA353F] ruby-text-glow">{provingData.titleHighlight || 'TESTING TRACK'}</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="font-sans text-xs sm:text-sm text-[#98AEA3] max-w-sm leading-relaxed">
              {provingData.desc || 'Experience the car at full speed on our private 5.4 km racetrack before you buy.'}
            </p>
          </div>
        </div>

        {/* Blueprint & Telemetry Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          {/* Interactive Circuit SVG Canvas */}
          <div className="lg:col-span-7 luxury-glass rounded-lg p-6 sm:p-9 relative overflow-hidden flex flex-col justify-between border border-[#98AEA3]/20">
            <div className="relative w-full h-80 sm:h-96 flex items-center justify-center bg-[#020F06]/95 rounded-md border border-[#98AEA3]/15 p-4 overflow-hidden">
              <svg viewBox="0 0 800 500" className="w-full h-full stroke-current" fill="none">
                <defs>
                  <pattern id="trackGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(152, 174, 163, 0.05)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#trackGrid)" />

                {/* Circuit Track Outer Layer */}
                <path
                  d="M 120 380 L 520 380 Q 720 380 720 250 Q 720 120 540 120 L 320 120 Q 240 120 220 180 Q 200 240 140 260 Q 80 280 80 340 Q 80 380 120 380 Z"
                  stroke="rgba(250, 53, 63, 0.18)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Circuit Asphalt Lane */}
                <path
                  d="M 120 380 L 520 380 Q 720 380 720 250 Q 720 120 540 120 L 320 120 Q 240 120 220 180 Q 200 240 140 260 Q 80 280 80 340 Q 80 380 120 380 Z"
                  stroke="#0A2E19"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dynamic Active Sector Highlight */}
                {activeSector === 0 && (
                  <path d="M 120 380 L 520 380" stroke="#FA353F" strokeWidth="8" strokeLinecap="round" className="animate-pulse" />
                )}
                {activeSector === 1 && (
                  <path d="M 520 380 Q 720 380 720 250 Q 720 120 540 120" stroke="#FA353F" strokeWidth="8" strokeLinecap="round" className="animate-pulse" />
                )}
                {activeSector === 2 && (
                  <path d="M 540 120 L 320 120 Q 240 120 220 180 Q 200 240 140 260" stroke="#FA353F" strokeWidth="8" strokeLinecap="round" className="animate-pulse" />
                )}
                {activeSector === 3 && (
                  <path d="M 140 260 Q 80 280 80 340 Q 80 380 120 380" stroke="#FA353F" strokeWidth="8" strokeLinecap="round" className="animate-pulse" />
                )}

                {/* Clickable Sector Checkpoint Pins with expanded mobile hit targets */}
                <g onClick={() => { audioEngine.playClick(); setActiveSector(0); }} className="cursor-pointer group">
                  <circle cx="320" cy="380" r="28" fill="transparent" />
                  {activeSector === 0 && (
                    <circle cx="320" cy="380" r="14" fill="none" stroke="#FA353F" strokeWidth="2" className="radar-wave" />
                  )}
                  <circle cx="320" cy="380" r="14" fill={activeSector === 0 ? '#FA353F' : '#061F10'} stroke="#FA353F" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110" />
                  <text x="320" y="384" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">S1</text>
                </g>

                <g onClick={() => { audioEngine.playClick(); setActiveSector(1); }} className="cursor-pointer group">
                  <circle cx="680" cy="250" r="28" fill="transparent" />
                  {activeSector === 1 && (
                    <circle cx="680" cy="250" r="14" fill="none" stroke="#FA353F" strokeWidth="2" className="radar-wave" />
                  )}
                  <circle cx="680" cy="250" r="14" fill={activeSector === 1 ? '#FA353F' : '#061F10'} stroke="#FA353F" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110" />
                  <text x="680" y="254" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">S2</text>
                </g>

                <g onClick={() => { audioEngine.playClick(); setActiveSector(2); }} className="cursor-pointer group">
                  <circle cx="280" cy="150" r="28" fill="transparent" />
                  {activeSector === 2 && (
                    <circle cx="280" cy="150" r="14" fill="none" stroke="#FA353F" strokeWidth="2" className="radar-wave" />
                  )}
                  <circle cx="280" cy="150" r="14" fill={activeSector === 2 ? '#FA353F' : '#061F10'} stroke="#FA353F" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110" />
                  <text x="280" y="154" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">S3</text>
                </g>

                <g onClick={() => { audioEngine.playClick(); setActiveSector(3); }} className="cursor-pointer group">
                  <circle cx="95" cy="310" r="28" fill="transparent" />
                  {activeSector === 3 && (
                    <circle cx="95" cy="310" r="14" fill="none" stroke="#FA353F" strokeWidth="2" className="radar-wave" />
                  )}
                  <circle cx="95" cy="310" r="14" fill={activeSector === 3 ? '#FA353F' : '#061F10'} stroke="#FA353F" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110" />
                  <text x="95" y="314" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">S4</text>
                </g>
              </svg>

              <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#98AEA3] bg-[#020F06]/95 p-2.5 rounded-md border border-[#98AEA3]/10 gap-1 text-center sm:text-left">
                <span>CLICK ANY SECTOR (S1 - S4) TO EXPLORE</span>
                <span className="text-[#FA353F] font-bold">5.4 KM PRIVATE CIRCUIT</span>
              </div>
            </div>
          </div>

          {/* Sector Telemetry Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="luxury-glass p-6 sm:p-9 rounded-lg space-y-6 border-l-4 border-l-[#FA353F] border border-[#98AEA3]/20">
              <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                <span className="font-mono text-xs font-bold text-[#FA353F] tracking-widest">
                  {currentSector.sector}
                </span>
                <span className="font-mono text-xs text-[#98AEA3]">
                  {currentSector.target}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl text-[#F5FAF7] uppercase tracking-wider">
                {currentSector.name}
              </h3>

              <p className="font-sans text-sm text-[#98AEA3] leading-relaxed">
                {currentSector.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-[#061F10] rounded-md border border-[#98AEA3]/15">
                  <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest mb-1">
                    MAX VELOCITY
                  </span>
                  <span className="font-mono text-base sm:text-lg font-bold text-[#FA353F]">
                    {currentSector.speed}
                  </span>
                </div>
                <div className="p-4 bg-[#061F10] rounded-md border border-[#98AEA3]/15">
                  <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest mb-1">
                    CORNERING FORCE
                  </span>
                  <span className="font-mono text-base sm:text-lg font-bold text-[#F5FAF7]">
                    {currentSector.gForce}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#061F10] rounded-md border border-[#FA353F]/40 flex items-start space-x-3">
                <Activity className="w-5 h-5 text-[#FA353F] shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-[#F5FAF7] leading-normal">
                  <strong className="text-[#FA353F] font-mono">TRACK NOTE:</strong> {currentSector.highlight}
                </p>
              </div>

              {/* Sector Quick Buttons (2 cols on small mobile, 4 cols on sm+) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {sectors.map((sec, idx) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      audioEngine.playClick();
                      setActiveSector(idx);
                    }}
                    className={`min-h-[44px] py-2.5 rounded-md font-mono text-xs transition-all ${
                      activeSector === idx
                        ? 'bg-[#FA353F] text-white font-bold shadow-ruby-glow'
                        : 'bg-[#020F06] text-[#98AEA3] border border-[#98AEA3]/15 hover:text-white'
                    }`}
                  >
                    SEC 0{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Test Drive & Confirmation Protocol */}
        <div className="mt-16">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FA353F] font-bold block mb-2">
              HOW IT WORKS
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] mb-3 tracking-wider uppercase">
              HOW TO TEST DRIVE &amp; ORDER
            </h3>
            <p className="font-sans text-sm text-[#98AEA3]">
              Four simple steps to experience, customize, and receive your hypercar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {protocolSteps.map((step, idx) => {
              const offsets = ['lg:mt-0', 'lg:mt-8', 'lg:mt-3', 'lg:mt-11'];
              return (
                <div
                  key={step.step}
                  className={`luxury-card-hover luxury-glass p-7 rounded-lg relative group flex flex-col justify-between border border-[#98AEA3]/15 shadow-xl ${offsets[idx]}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-3xl font-black text-[#FA353F]/40 group-hover:text-[#FA353F] transition-colors">
                        {step.step}
                      </span>
                      <span className="font-mono text-[9px] text-[#7E9389] uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-[#061F10] border border-[#98AEA3]/10">
                        STEP 0{idx + 1}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-[#F5FAF7] mb-2.5 tracking-wide uppercase">
                      {step.title}
                    </h4>
                    <p className="font-sans text-xs text-[#98AEA3] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="w-full h-1 bg-gradient-to-r from-[#FA353F]/40 to-transparent mt-6 rounded-full group-hover:from-[#FA353F] transition-all" />
                </div>
              );
            })}
          </div>

          {/* Bottom Track Invitation CTA Banner */}
          <div className="mt-12 p-6 sm:p-10 rounded-lg luxury-glass flex flex-col sm:flex-row items-center justify-between gap-6 border-l-4 border-l-[#FA353F] border border-[#98AEA3]/20">
            <div>
              <h4 className="font-display font-bold text-lg sm:text-xl text-[#F5FAF7] mb-1 tracking-wider uppercase">
                READY TO DRIVE ON OUR TRACK?
              </h4>
              <p className="font-sans text-sm text-[#98AEA3]">
                Private track test sessions are limited to ensure complete privacy for each driver.
              </p>
            </div>
            <button
              onClick={() => {
                audioEngine.playTelemetryBeep();
                onOpenTestDriveModal();
              }}
              className="luxury-btn-hover w-full sm:w-auto px-8 py-4 rounded-md bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow shrink-0 transition-all text-center"
            >
              BOOK YOUR TRACK SESSION
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
