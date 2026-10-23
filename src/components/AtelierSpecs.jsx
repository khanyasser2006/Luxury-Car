import React, { useState } from 'react';
import { Shield, Cpu, Flame, Layers, Award, Sparkles, Check, ChevronRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function AtelierSpecs() {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      id: 'chassis',
      title: 'CARBON FIBER CHASSIS',
      subtitle: 'Ultra-Light & Super Strong',
      spec: '42,500 Nm/deg Rigidity',
      desc: 'Built from aerospace-grade carbon fiber. The entire cabin frame weighs under 100 kg while providing racecar-level crash safety.',
      details: [
        'High-strength carbon fiber structure',
        'Reinforced side impact protection',
        'Built-in titanium safety fuel cell',
      ],
    },
    {
      id: 'powertrain',
      title: 'HAND-BUILT V12 ENGINE',
      subtitle: 'Naturally Aspirated Power',
      spec: '11,100 RPM Redline',
      desc: 'Built with lightweight titanium parts and a custom exhaust system that creates an unforgettable high-pitched racing sound.',
      details: [
        'Precision-balanced titanium connecting rods',
        'High-pressure fuel injection system',
        'Hybrid electric boost for instant response',
      ],
    },
    {
      id: 'interior',
      title: 'LUXURY HANDMADE INTERIOR',
      subtitle: 'Custom Leather & Aluminum',
      spec: '100% Custom Trim',
      desc: 'Hand-cut Italian leather stitched by master craftsmen, combined with solid aluminum knobs and buttons.',
      details: [
        'Cooling airflow patterns in leather seats',
        'Solid metal drive mode selector dial',
        'Engraved nameplate with your chassis number',
      ],
    },
    {
      id: 'aero',
      title: 'ACTIVE AERODYNAMICS',
      subtitle: 'Smart Airflow Control',
      spec: 'Up to 1,050 kg Downforce',
      desc: 'Computer-controlled front diffusers and rear spoiler move automatically to keep the car glued to the road at all speeds.',
      details: [
        'Top Speed Mode lowers the rear wing',
        'Airbrake raises instantly for quick stopping',
        'Real-time ride height adjustment',
      ],
    },
  ];

  const currentPillar = pillars[activeTab];

  return (
    <section id="craft" className="py-28 bg-[#FA353F] relative overflow-hidden border-t-2 border-b-2 border-[#020F06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with High Contrast */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-6 border-b-2 border-[#020F06]/20 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#020F06]" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#020F06] font-bold">
                ENGINEERING
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#020F06] tracking-wider uppercase">
              BUILT FOR <span className="text-white drop-shadow-md">PRECISION</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="font-sans text-xs sm:text-sm text-[#020F06]/95 font-medium max-w-sm leading-relaxed tracking-wide">
              Every car is handcrafted with aerospace-grade materials for maximum strength and performance.
            </p>
          </div>
        </div>

        {/* Tab Selection & Spec Detail Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pillar Selector Tabs */}
          <div className="lg:col-span-4 space-y-3.5">
            {pillars.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  audioEngine.playClick();
                  setActiveTab(idx);
                }}
                className={`w-full p-6 rounded-lg text-left transition-all duration-300 flex items-center justify-between ${
                  activeTab === idx
                    ? 'bg-[#020F06] border-2 border-[#020F06] text-white shadow-2xl scale-[1.02] ring-2 ring-[#020F06]/30'
                    : 'bg-[#020F06]/90 border border-[#020F06]/40 text-[#98AEA3] hover:bg-[#020F06] hover:text-white'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] text-[#FA353F] uppercase tracking-widest block mb-1.5 font-bold">
                    FEATURE 0{idx + 1}
                  </span>
                  <h4 className="font-display font-bold text-sm sm:text-base text-[#F5FAF7] uppercase tracking-wide">
                    {item.title}
                  </h4>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform shrink-0 ${
                    activeTab === idx ? 'text-[#FA353F] translate-x-1' : 'text-[#7E9389]'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Active Pillar Technical Card */}
          <div className="lg:col-span-8 bg-[#020F06] text-[#F5FAF7] p-8 sm:p-12 rounded-lg border-2 border-[#020F06] shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-xs text-[#FA353F] uppercase tracking-widest block mb-1 font-bold">
                    {currentPillar.subtitle}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] uppercase tracking-wider">
                    {currentPillar.title}
                  </h3>
                </div>
                <div className="px-5 py-3.5 rounded-md bg-[#061F10] border border-[#FA353F]/40 text-right shadow-ruby-glow">
                  <span className="font-mono text-[9px] text-[#7E9389] uppercase tracking-widest block">
                    KEY BENCHMARK
                  </span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-[#FA353F]">
                    {currentPillar.spec}
                  </span>
                </div>
              </div>

              <p className="font-sans text-base text-[#98AEA3] leading-relaxed mb-8">
                {currentPillar.desc}
              </p>

              <div className="space-y-3 mb-8">
                <span className="font-mono text-xs uppercase tracking-widest text-[#F5FAF7] block mb-2 font-bold">
                  KEY HIGHLIGHTS:
                </span>
                {currentPillar.details.map((detail, i) => (
                  <div key={i} className="flex items-center space-x-3.5 p-4 rounded-md bg-[#061F10] border border-[#98AEA3]/15">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FA353F] shrink-0" />
                    <span className="font-sans text-sm text-[#F5FAF7] font-medium">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#98AEA3]/15 flex items-center justify-between text-xs font-mono text-[#7E9389]">
              <span>HANDCRAFTED IN EUROPE</span>
              <span className="text-[#FA353F] font-bold">100% AEROSPACE CARBON FIBER</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
