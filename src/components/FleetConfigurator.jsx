import React, { useState } from 'react';
import { Shield, Zap, Gauge, Volume2, ArrowRight, Check, Award, Compass, Sparkles, Sliders } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function FleetConfigurator({ onOpenTestDriveModal }) {
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(0);
  const [selectedInterior, setSelectedInterior] = useState(0);
  const [selectedAero, setSelectedAero] = useState(0);
  const [isRevving, setIsRevving] = useState(false);

  const fleet = [
    {
      id: 'apex-gt',
      name: 'APEX NERO GT',
      tagline: 'Twin-Turbo Hybrid Super GT',
      price: '$2,450,000',
      hp: '1,120 HP',
      accel: '2.4s (0-100 km/h)',
      topSpeed: '375 KM/H',
      engine: '4.0L Twin-Turbo V8 + Hybrid Motors',
      weight: '1,380 KG',
      downforce: '620 KG @ 280 km/h',
      description: 'Built for high-speed cruising and sharp track cornering. Features all-wheel drive and an 8-speed automatic gearbox.',
      badge: 'LIMITED TO 30 UNITS',
      imageRef: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
    },
    {
      id: 'valkyrie-stradale',
      name: 'VALKYRIE STRADALE',
      tagline: 'Naturally Aspirated V12 Hypercar',
      price: '$3,200,000',
      hp: '1,280 HP',
      accel: '2.2s (0-100 km/h)',
      topSpeed: '395 KM/H',
      engine: '6.5L V12 Engine (11,100 RPM)',
      weight: '1,290 KG',
      downforce: '890 KG @ 300 km/h',
      description: 'Pure racecar performance. An iconic V12 engine revving to 11,100 RPM with race-derived suspension.',
      badge: 'LIMITED TO 20 UNITS',
      imageRef: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85',
    },
    {
      id: 'phantom-corsa',
      name: 'PHANTOM CORSA',
      tagline: 'All-Electric Track Special',
      price: '$2,800,000',
      hp: '1,450 HP',
      accel: '1.9s (0-100 km/h)',
      topSpeed: '410 KM/H',
      engine: 'Four High-Performance Electric Motors',
      weight: '1,420 KG',
      downforce: '1,050 KG @ 320 km/h',
      description: 'Instant electric acceleration. Goes from 0 to 100 km/h in under 2 seconds with four independent electric motors.',
      badge: 'LIMITED TO 15 UNITS',
      imageRef: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85',
    },
  ];

  const finishes = [
    { name: 'Ruby Red Metallic', hex: '#FA353F', border: 'border-[#FA353F]' },
    { name: 'Obsidian Green Satin', hex: '#020F06', border: 'border-[#061F10]' },
    { name: 'Carbon Fiber Weave', hex: '#1C2320', border: 'border-[#36423C]' },
    { name: 'Liquid Titanium Silver', hex: '#A8B8B0', border: 'border-[#A8B8B0]' },
  ];

  const interiors = [
    { name: 'Black Alcantara & Red Stitching', desc: 'Lightweight sport racing style' },
    { name: 'Tan Italian Leather', desc: 'Soft premium leather luxury' },
    { name: 'Exposed Carbon Fiber', desc: 'Direct carbon racing seats' },
  ];

  const aeros = [
    { name: 'High Downforce Track Pack', desc: 'Extra grip and larger rear wing' },
    { name: 'Low Drag High Speed Spec', desc: 'Optimized for highest top speed' },
  ];

  const currentCar = fleet[selectedCarIndex];

  return (
    <section id="fleet" className="py-28 bg-[#FA353F] relative overflow-hidden border-t-2 border-b-2 border-[#020F06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with High Contrast */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b-2 border-[#020F06]/20 gap-6">
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#020F06] tracking-wider uppercase">
              CUSTOM <span className="text-white drop-shadow-md">HYPERCAR MODELS</span>
            </h2>
          </div>
        </div>

        {/* Asymmetric Model Switcher Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {fleet.map((car, idx) => {
            const isActive = selectedCarIndex === idx;
            return (
              <button
                key={car.id}
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedCarIndex(idx);
                }}
                className={`p-6 rounded-lg text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#020F06] text-white shadow-2xl ring-2 ring-[#020F06] transform -translate-y-1'
                    : 'bg-[#020F06]/85 text-[#98AEA3] hover:bg-[#020F06] hover:text-white border border-[#020F06]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#98AEA3]">
                      MODEL 0{idx + 1}
                    </span>
                    <span className={`font-mono text-[10px] px-3 py-1 rounded-md font-bold border ${
                      isActive
                        ? 'bg-[#FA353F] text-white border-[#FA353F]'
                        : 'bg-[#061F10] text-[#FA353F] border-[#FA353F]/30'
                    }`}>
                      {car.hp}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#F5FAF7] mb-1 tracking-wide uppercase">
                    {car.name}
                  </h3>
                  <p className="font-sans text-xs text-[#98AEA3] line-clamp-1 mb-4">
                    {car.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#98AEA3]/15">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#F5FAF7]">
                    {car.price}
                  </span>
                  <span className="font-mono text-[10px] text-[#FA353F] uppercase tracking-wider flex items-center space-x-1 font-bold">
                    <span>{isActive ? 'SELECTED' : 'SELECT'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Vehicle Showcase & Customizer Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Showcase Card */}
          <div className="lg:col-span-7 bg-[#020F06] border-2 border-[#020F06] shadow-2xl rounded-lg overflow-hidden p-6 sm:p-9 flex flex-col justify-between relative group">
            {/* Top Badge & Finish Preview */}
            <div className="flex items-center justify-between mb-6 z-10 relative">
              <span className="px-4 py-1.5 rounded-md bg-[#061F10] border border-[#FA353F]/50 font-mono text-[11px] text-[#FA353F] uppercase tracking-widest font-bold">
                {currentCar.badge}
              </span>
              <div className="flex items-center space-x-2 font-mono text-xs text-[#98AEA3]">
                <span>COLOR:</span>
                <span className="text-[#F5FAF7] font-bold">{finishes[selectedFinish].name}</span>
              </div>
            </div>

            {/* Vehicle Imagery */}
            <div className="relative h-72 sm:h-96 w-full my-4 rounded-md overflow-hidden border border-[#98AEA3]/20">
              <img
                src={currentCar.imageRef}
                alt={currentCar.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                style={{
                  filter:
                    selectedFinish === 0
                      ? 'contrast(1.1) saturate(1.2)'
                      : selectedFinish === 1
                      ? 'contrast(1.15) hue-rotate(85deg) brightness(0.85)'
                      : selectedFinish === 2
                      ? 'grayscale(0.9) contrast(1.2)'
                      : 'brightness(1.1) contrast(1.05)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020F06] via-transparent to-transparent opacity-80" />
            </div>

            {/* Core Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#98AEA3]/15">
              <div className="p-3 bg-[#061F10]/70 rounded-md border border-[#98AEA3]/10">
                <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest">
                  ACCELERATION
                </span>
                <span className="font-mono text-base font-bold text-[#F5FAF7]">
                  {currentCar.accel}
                </span>
              </div>
              <div className="p-3 bg-[#061F10]/70 rounded-md border border-[#98AEA3]/10">
                <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest">
                  TOP SPEED
                </span>
                <span className="font-mono text-base font-bold text-[#F5FAF7]">
                  {currentCar.topSpeed}
                </span>
              </div>
              <div className="p-3 bg-[#061F10]/70 rounded-md border border-[#98AEA3]/10">
                <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest">
                  POWER OUTPUT
                </span>
                <span className="font-mono text-base font-bold text-[#FA353F]">
                  {currentCar.hp}
                </span>
              </div>
              <div className="p-3 bg-[#061F10]/70 rounded-md border border-[#98AEA3]/10">
                <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest">
                  DOWNFORCE
                </span>
                <span className="font-mono text-base font-bold text-[#F5FAF7]">
                  {currentCar.downforce.split(' ')[0]} {currentCar.downforce.split(' ')[1]}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Customization Matrix */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#020F06] border-2 border-[#020F06] shadow-2xl p-6 sm:p-9 rounded-lg space-y-6 text-[#F5FAF7]">
              <div className="flex items-center space-x-3 pb-4 border-b border-[#98AEA3]/15">
                <Sliders className="w-5 h-5 text-[#FA353F]" />
                <h4 className="font-display font-bold text-base sm:text-lg text-[#F5FAF7] tracking-wider uppercase">
                  CUSTOMIZE YOUR CAR
                </h4>
              </div>

              {/* 1. Exterior Finish Palette */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-3 font-semibold">
                  PAINT COLOR
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {finishes.map((f, idx) => (
                    <button
                      key={f.name}
                      onClick={() => {
                        audioEngine.playClick();
                        setSelectedFinish(idx);
                      }}
                      className={`flex items-center space-x-3 p-3 rounded-md text-left transition-all ${
                        selectedFinish === idx
                          ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                          : 'bg-[#020F06] border border-[#98AEA3]/20 text-[#98AEA3] hover:border-[#FA353F]/50 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: f.hex }}
                      />
                      <span className="font-mono text-xs truncate">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Interior Craftsmanship */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-3 font-semibold">
                  INTERIOR STYLE
                </label>
                <div className="space-y-2">
                  {interiors.map((item, idx) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        audioEngine.playClick();
                        setSelectedInterior(idx);
                      }}
                      className={`w-full p-3.5 rounded-md text-left flex items-center justify-between transition-all ${
                        selectedInterior === idx
                          ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                          : 'bg-[#020F06] border border-[#98AEA3]/20 text-[#98AEA3] hover:border-[#FA353F]/50 hover:text-white'
                      }`}
                    >
                      <div>
                        <p className="font-mono text-xs font-bold text-[#F5FAF7]">{item.name}</p>
                        <p className="font-sans text-xs text-[#7E9389]">{item.desc}</p>
                      </div>
                      {selectedInterior === idx && <Check className="w-4 h-4 text-[#FA353F]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Aerodynamics Package */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-3 font-semibold">
                  AERODYNAMICS &amp; WING
                </label>
                <div className="space-y-2">
                  {aeros.map((item, idx) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        audioEngine.playClick();
                        setSelectedAero(idx);
                      }}
                      className={`w-full p-3.5 rounded-md text-left flex items-center justify-between transition-all ${
                        selectedAero === idx
                          ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                          : 'bg-[#020F06] border border-[#98AEA3]/20 text-[#98AEA3] hover:border-[#FA353F]/50 hover:text-white'
                      }`}
                    >
                      <div>
                        <p className="font-mono text-xs font-bold text-[#F5FAF7]">{item.name}</p>
                        <p className="font-sans text-xs text-[#7E9389]">{item.desc}</p>
                      </div>
                      {selectedAero === idx && <Check className="w-4 h-4 text-[#FA353F]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Booking Button for Configured Car */}
              <button
                onClick={() => {
                  audioEngine.playTelemetryBeep();
                  onOpenTestDriveModal({
                    car: currentCar.name,
                    finish: finishes[selectedFinish].name,
                    interior: interiors[selectedInterior].name,
                  });
                }}
                className="w-full py-4 rounded-md bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow flex items-center justify-center space-x-3 transition-all duration-200 active:scale-98"
              >
                <Gauge className="w-4 h-4" />
                <span>BOOK TEST DRIVE ON OUR TRACK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}