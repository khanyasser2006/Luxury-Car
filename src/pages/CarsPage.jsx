import React, { useState } from 'react';
import {
  Gauge,
  Sliders,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
  ChevronLeft,
  ShoppingBag,
  Filter,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  X,
  Layers,
  Flame,
  Award,
  Clock,
  Globe,
  Mail
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function CarsPage({ initialCarIndex = 0, onOpenTestDriveModal, onNavigateToHome }) {
  const { cmsData } = useCMS();
  const fleet = cmsData?.fleet || [];
  const brandName = cmsData?.siteMeta?.brandName || 'VELOCE';

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeModalCar, setActiveModalCar] = useState(null); // for 3D Studio customizer modal
  const [activeOrderCar, setActiveOrderCar] = useState(null); // for Buy/Order modal
  const [selectedFinish, setSelectedFinish] = useState(0);
  const [selectedWheel, setSelectedWheel] = useState(0);
  const [selectedInterior, setSelectedInterior] = useState(0);
  const [selectedAero, setSelectedAero] = useState(0);
  const [isRevving, setIsRevving] = useState(false);
  const [orderDepositOption, setOrderDepositOption] = useState('10%');
  const [orderDeliveryCity, setOrderDeliveryCity] = useState('MONACO');
  const [orderPlaqueText, setOrderPlaqueText] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const finishes = [
    { name: 'Performance Ruby Red', hex: '#FA353F', desc: 'Deep metallic with crimson crystal pearl' },
    { name: 'Obsidian Black Green', hex: '#020F06', desc: 'Bespoke stealth gloss green undertone' },
    { name: 'Carbon Fiber Weave', hex: '#1C2320', desc: 'Visible raw 3K matte weave coating' },
    { name: 'Liquid Titanium Silver', hex: '#A8B8B0', desc: 'Ultra-reflective aerospace aluminum sheen' },
    { name: 'Solar Gold Pearl', hex: '#E5A93C', desc: 'Warm metallic finish engineered for track sun' },
  ];

  const wheels = [
    { name: '20"/21" Forged Magnesium', desc: 'Ultra-lightweight motorsport alloy', weight: '-14 KG' },
    { name: 'Aerodisc Carbon Blade', desc: 'Aero-ducted carbon brake cooling', weight: '-11 KG' },
    { name: 'Center-Lock Track Light', desc: 'Quick-release single titanium nut', weight: '-16 KG' },
  ];

  const interiors = [
    { name: 'Black Alcantara & Crimson Stitch', desc: 'Lightweight race cockpit with red contrast', weight: 'Standard' },
    { name: 'Tan Italian Hand-Stitched Leather', desc: 'Bespoke aniline luxury comfort touring', weight: '+6 KG' },
    { name: 'Raw Carbon Fiber Monocoque Shell', desc: 'Direct-chassis race seating experience', weight: '-18 KG' },
  ];

  const aeros = [
    { name: 'High Downforce Track Pack', desc: 'Active dual-plane carbon rear wing & front splitter' },
    { name: 'Low Drag High-Speed Spec', desc: 'Streamlined aero diffuser calibrated for 400+ KM/H' },
  ];

  const categories = [
    { id: 'ALL', label: 'ALL FLEET' },
    { id: 'V12', label: 'V12 COMBUSTION' },
    { id: 'HYBRID', label: 'HYBRID HYPER-GT' },
    { id: 'ELECTRIC', label: 'ALL-ELECTRIC' },
    { id: 'TRACK', label: 'TRACK PROTOTYPE' },
  ];

  const filteredFleet = selectedCategory === 'ALL'
    ? fleet
    : fleet.filter((c) => c.category === selectedCategory);

  const handleRevEngine = () => {
    if (isRevving) return;
    setIsRevving(true);
    audioEngine.playEngineRev();
    setTimeout(() => {
      setIsRevving(false);
    }, 2800);
  };

  const handleOpenStudio = (car) => {
    audioEngine.playClick();
    setActiveModalCar(car);
    setSelectedFinish(0);
    setSelectedWheel(0);
    setSelectedInterior(0);
    setSelectedAero(0);
  };

  const handleOpenOrder = (car) => {
    audioEngine.playTelemetryBeep();
    setActiveOrderCar(car);
    setOrderConfirmed(false);
    setOrderPlaqueText('');
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    audioEngine.playTelemetryBeep();
    setOrderPlaqueText((prev) => prev.replace(/[<>'"]/g, '').trim());
    setOrderConfirmed(true);
  };

  return (
    <div className="page-transition-enter min-h-screen bg-[#020F06] text-[#F5FAF7] pt-24 pb-20 selection:bg-[#FA353F] selection:text-[#020F06]">
      {/* 1. DUAL-PALETTE TOP HERO HEADER (Ruby Red Background) */}
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
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-[#020F06] hover:bg-[#061F10] text-[#F5FAF7] font-mono text-xs transition-colors shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>BACK TO HOME</span>
              </button>
              <span className="font-mono text-xs text-[#020F06]/60">/</span>
              <span className="font-mono text-xs text-[#020F06] font-bold uppercase tracking-widest">
                HYPERCAR SHOP &amp; SHOWROOM
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[#020F06]">
              <ShoppingBag className="w-4 h-4 text-[#020F06]" />
              <span>{fleet.length} HYPERCARS CURRENTLY AVAILABLE</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-[#020F06] text-[#FA353F] font-mono text-[11px] uppercase tracking-widest font-bold">
                <span>OFFICIAL FACTORY INVENTORY</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#020F06] uppercase tracking-wider leading-tight">
                HYPERCAR <span className="text-white drop-shadow-md">SHOP &amp; FLEET</span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#020F06]/90 max-w-2xl font-medium leading-relaxed">
                Browse our complete collection of bespoke sports cars. View in-depth 3D studio specifications, customize liveries, or place your direct allocation order with worldwide enclosed delivery.
              </p>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#020F06] p-4 rounded-lg text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl shrink-0">
              <div className="p-3 bg-[#061F10] rounded">
                <span className="block font-mono text-[9px] text-[#FA353F] uppercase">TOP VELOCITY</span>
                <span className="font-mono text-base font-bold text-white">430 KM/H</span>
              </div>
              <div className="p-3 bg-[#061F10] rounded">
                <span className="block font-mono text-[9px] text-[#FA353F] uppercase">MAX POWER</span>
                <span className="font-mono text-base font-bold text-white">1,500 HP</span>
              </div>
              <div className="p-3 bg-[#061F10] rounded col-span-2 sm:col-span-1">
                <span className="block font-mono text-[9px] text-[#FA353F] uppercase">DELIVERY</span>
                <span className="font-mono text-base font-bold text-[#FA353F]">GLOBAL AIR</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="font-mono text-xs font-bold text-[#020F06] mr-2 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>FILTER:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`luxury-btn-hover px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#020F06] text-white shadow-xl scale-105'
                    : 'bg-white/80 hover:bg-white text-[#020F06] border border-[#020F06]/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. DUAL-PALETTE SHOP CATALOG GRID (Obsidian Black Green Background) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#98AEA3]/15 pb-4 gap-4">
          <div>
            <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block mb-1">
              AVAILABLE ATELIER INVENTORY
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] uppercase">
              SHOWROOM MODELS ({filteredFleet.length})
            </h2>
          </div>
          <span className="font-mono text-xs text-[#7E9389]">
            CLICK "VIEW CAR" FOR 3D STUDIO OR "BUY NOW" FOR ALLOCATION
          </span>
        </div>

        {/* Cars Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFleet.map((car) => (
            <div
              key={car.id}
              className="luxury-card-hover rounded-lg bg-[#061F10] border border-[#FA353F]/30 shadow-2xl flex flex-col justify-between overflow-hidden group"
            >
              {/* Car Image with Badge & Stock Ribbon */}
              <div className="relative h-60 w-full overflow-hidden bg-[#020F06]">
                <img
                  src={car.imageRef}
                  alt={`${brandName} ${car.name} - ${car.hp} ${car.engine} Limited Edition Hypercar`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061F10] via-transparent to-[#020F06]/60" />

                {/* Top Status Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1 rounded bg-[#020F06]/90 backdrop-blur-md border border-[#FA353F]/40 font-mono text-[10px] text-[#FA353F] font-bold uppercase tracking-widest">
                    {car.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#FA353F] font-mono text-[10px] text-white font-bold uppercase tracking-wider shadow-ruby-glow">
                    {car.hp}
                  </span>
                </div>

                {/* Bottom Stock Indicator */}
                <div className="absolute bottom-3 left-3">
                  <span className="font-mono text-[11px] text-[#F5FAF7] font-semibold bg-[#020F06]/90 backdrop-blur-md px-3 py-1 rounded border border-[#98AEA3]/20">
                    {car.unitsLeft}
                  </span>
                </div>
              </div>

              {/* Car Information & Specs */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#F5FAF7] uppercase group-hover:text-[#FA353F] transition-colors duration-200">
                      {car.name}
                    </h3>
                  </div>
                  <p className="font-sans text-xs text-[#98AEA3] mb-4 line-clamp-1">{car.tagline}</p>

                  {/* 3-Column Performance Matrix */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-md bg-[#020F06] border border-[#98AEA3]/15 text-center mb-4 group-hover:border-[#FA353F]/30 transition-colors">
                    <div className="p-1 rounded group-hover:bg-[#061F10]/60 transition-colors">
                      <span className="block font-mono text-[9px] text-[#7E9389] uppercase">0-100 KM/H</span>
                      <span className="font-mono text-xs font-bold text-white">{car.accel.split(' ')[0]}</span>
                    </div>
                    <div className="border-x border-[#98AEA3]/15 p-1 rounded group-hover:bg-[#061F10]/60 transition-colors">
                      <span className="block font-mono text-[9px] text-[#7E9389] uppercase">TOP SPEED</span>
                      <span className="font-mono text-xs font-bold text-white">{car.topSpeed}</span>
                    </div>
                    <div className="p-1 rounded group-hover:bg-[#061F10]/60 transition-colors">
                      <span className="block font-mono text-[9px] text-[#7E9389] uppercase">DOWNFORCE</span>
                      <span className="font-mono text-xs font-bold text-[#FA353F]">{car.downforce.split(' ')[0]}</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-[#98AEA3] line-clamp-2 leading-relaxed">
                    {car.description}
                  </p>
                </div>

                {/* Price & Dual Action Buttons (View Car vs Buy Now) */}
                <div className="pt-4 border-t border-[#98AEA3]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#7E9389] uppercase">PRICE:</span>
                    <span className="font-mono text-lg font-bold text-white">{car.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* View Car / 3D Studio */}
                    <button
                      onClick={() => handleOpenStudio(car)}
                      className="luxury-btn-hover py-2.5 px-3 rounded-md bg-[#020F06] hover:bg-[#0A2E19] text-[#F5FAF7] border border-[#FA353F]/40 hover:border-[#FA353F] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#FA353F]" />
                      <span>VIEW CAR</span>
                    </button>

                    {/* Contact Us / Inquire */}
                    <button
                      onClick={() => {
                        audioEngine.playTelemetryBeep();
                        onOpenTestDriveModal({
                          car: car.name,
                          price: car.price,
                          tagline: car.tagline,
                        });
                      }}
                      className="luxury-btn-hover py-2.5 px-3 rounded-md bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-ruby-glow transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>CONTACT US</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DUAL-PALETTE ACQUISITION PERKS (Ruby Red Background - Asymmetric Editorial Layout) */}
      <section className="bg-[#FA353F] py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-b-2 border-[#020F06] text-[#020F06]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Editorial Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-[#020F06] text-[#FA353F] font-mono text-[11px] uppercase tracking-widest font-bold">
                <span>ATELIER ACQUISITION SUITE</span>
              </div>

              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#020F06] uppercase tracking-wider leading-[1.05]">
                EVERY ORDER <br />
                <span className="text-white drop-shadow-md">INCLUDES</span>
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#020F06]/95 font-medium leading-relaxed">
                When commissioning a bespoke hypercar directly through {brandName}, your acquisition is accompanied by our complete European factory handover suite.
              </p>

              {/* Handover Guarantee Seal Card */}
              <div className="p-6 rounded-lg bg-[#020F06] text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold uppercase tracking-widest">
                    AUTHENTICITY GUARANTEE
                  </span>
                  <span className="font-mono text-[9px] text-[#98AEA3] uppercase">
                    FIA HOMOLOGATED
                  </span>
                </div>
                <p className="font-sans text-xs text-[#98AEA3] leading-relaxed">
                  Each allocation includes a dedicated factory concierge, GPS live transponder tracking, and on-demand flying engineer support.
                </p>
                <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-[#FA353F]">
                  <span>FACTORY DIRECT ESCROW</span>
                  <span className="text-[#F5FAF7] font-bold">CERTIFICATE 2026</span>
                </div>
              </div>
            </div>

            {/* Right Staggered Editorial Cards Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Card 1: Featured Enclosed Air Freight */}
              <div className="p-6 sm:p-7 rounded-lg bg-[#020F06] text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl space-y-3 group hover:border-[#FA353F] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-[#061F10] border border-[#FA353F]/40 text-[#FA353F]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                      ENCLOSED WORLDWIDE AIR FREIGHT
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold uppercase bg-[#061F10] px-2.5 py-1 rounded">
                    GLOBAL AIR
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#98AEA3] leading-relaxed pl-11">
                  Direct insured worldwide air cargo transport delivered straight to your private hangar or residential garage in climate-controlled security containers.
                </p>
              </div>

              {/* Middle Row: Two Tiered Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 2: Track Shakedown */}
                <div className="p-6 rounded-lg bg-[#020F06] text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl space-y-3 group hover:border-[#FA353F] transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded bg-[#061F10] border border-[#FA353F]/40 text-[#FA353F]">
                        <Gauge className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                        CIRCUIT SHAKEDOWN
                      </h3>
                    </div>
                    <p className="font-sans text-xs text-[#98AEA3] leading-relaxed">
                      Exclusive private track day with factory technicians to calibrate suspension geometry and aero balance.
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-[#FA353F] font-bold block pt-2 border-t border-[#98AEA3]/15">
                    1-ON-1 PRO COACHING
                  </span>
                </div>

                {/* Card 3: Custom Titanium Plaque */}
                <div className="p-6 rounded-lg bg-[#020F06] text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl space-y-3 group hover:border-[#FA353F] transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded bg-[#061F10] border border-[#FA353F]/40 text-[#FA353F]">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                        TITANIUM PLAQUE
                      </h3>
                    </div>
                    <p className="font-sans text-xs text-[#98AEA3] leading-relaxed">
                      Solid titanium cockpit plaque laser-engraved with your custom monogram and limited edition build serial.
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-[#FA353F] font-bold block pt-2 border-t border-[#98AEA3]/15">
                    CHASSIS SERIALIZED
                  </span>
                </div>
              </div>

              {/* Card 4: Factory Warranty & Flying Tech */}
              <div className="p-6 sm:p-7 rounded-lg bg-[#020F06] text-[#F5FAF7] border-2 border-[#020F06] shadow-2xl space-y-3 group hover:border-[#FA353F] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-[#061F10] border border-[#FA353F]/40 text-[#FA353F]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                      5-YEAR FACTORY WARRANTY &amp; FLYING TECH
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-white font-bold uppercase bg-[#061F10] px-2.5 py-1 rounded">
                    24/7 DISPATCH
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#98AEA3] leading-relaxed pl-11">
                  Full bumper-to-bumper powertrain warranty including direct flying technician support dispatched anywhere globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BESPOKE FULL-SCREEN ATELIER STUDIO ("VIEW CAR") */}
      {/* ========================================================================= */}
      {activeModalCar && (
        <div className="fixed inset-0 z-50 bg-[#020F06] text-[#F5FAF7] overflow-y-auto animate-fadeIn">
          {/* Top Luxury Navigation Bar */}
          <div className="sticky top-0 z-30 luxury-glass border-b border-[#FA353F]/30 px-4 sm:px-8 py-4 flex items-center justify-between shadow-2xl">
            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveModalCar(null);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#061F10] hover:bg-[#0A2E19] text-[#98AEA3] hover:text-[#FA353F] font-mono text-xs font-semibold uppercase tracking-wider transition-all border border-[#98AEA3]/20"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>RETURN TO SHOWROOM</span>
            </button>

            <div className="text-center hidden sm:block">
              <span className="font-mono text-[10px] text-[#FA353F] uppercase tracking-[0.3em] font-bold block mb-0.5">
                {activeModalCar.badge} &bull; {activeModalCar.unitsLeft}
              </span>
              <h2 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-[0.25em]">
                {activeModalCar.name}
              </h2>
            </div>

            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveModalCar(null);
              }}
              className="p-2.5 rounded-full bg-[#061F10] hover:bg-[#FA353F] text-[#98AEA3] hover:text-white transition-all border border-[#98AEA3]/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
            {/* Cinematic Hero Showcase Canvas */}
            <div className="space-y-6">
              <div className="relative w-full h-[260px] sm:h-[450px] lg:h-[580px] rounded-lg overflow-hidden border-2 border-[#FA353F]/30 bg-[#020F06] shadow-2xl group">
                <img
                  src={activeModalCar.imageRef}
                  alt={`${brandName} ${activeModalCar.name} Bespoke Studio Customizer - ${finishes[selectedFinish].name}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{
                    filter:
                      selectedFinish === 0
                        ? 'contrast(1.15) saturate(1.25)'
                        : selectedFinish === 1
                        ? 'contrast(1.15) hue-rotate(85deg) brightness(0.85)'
                        : selectedFinish === 2
                        ? 'grayscale(0.95) contrast(1.25) brightness(0.95)'
                        : selectedFinish === 3
                        ? 'brightness(1.15) contrast(1.1)'
                        : 'contrast(1.15) hue-rotate(30deg) saturate(1.4) brightness(1.05)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020F06] via-transparent to-[#020F06]/70 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,15,6,0.65)_100%)] pointer-events-none" />

                {/* Top-Left Telemetry HUD (Responsive) */}
                <div className="hidden sm:block absolute top-6 left-6 luxury-glass p-3 sm:p-4 rounded-lg border border-[#FA353F]/30 space-y-1 max-w-xs pointer-events-none shadow-xl">
                  <span className="font-mono text-[9px] sm:text-[10px] text-[#FA353F] font-bold uppercase tracking-widest block">
                    PERFORMANCE TELEMETRY
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-mono text-base sm:text-xl font-bold text-white">{activeModalCar.accel}</span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-[#98AEA3]">SPRINT</span>
                  </div>
                  <span className="font-mono text-[10px] sm:text-xs text-[#98AEA3] block">MAX VELOCITY: <strong className="text-white">{activeModalCar.topSpeed}</strong></span>
                </div>

                {/* Top-Right Power HUD (Responsive) */}
                <div className="hidden sm:block absolute top-6 right-6 luxury-glass p-3 sm:p-4 rounded-lg border border-[#FA353F]/30 space-y-1 text-right max-w-xs pointer-events-none shadow-xl">
                  <span className="font-mono text-[9px] sm:text-[10px] text-[#FA353F] font-bold uppercase tracking-widest block">
                    POWERTRAIN OUTPUT
                  </span>
                  <span className="font-mono text-base sm:text-xl font-bold text-[#FA353F] block">{activeModalCar.hp}</span>
                  <span className="font-mono text-[10px] sm:text-xs text-[#98AEA3] block">{activeModalCar.downforce.split('@')[0]} DOWNFORCE</span>
                </div>

                {/* Bottom Livery Indicator */}
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-auto luxury-glass px-3.5 sm:px-5 py-2 sm:py-3 rounded-lg border border-[#98AEA3]/20 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full border border-white/40" style={{ backgroundColor: finishes[selectedFinish].hex }} />
                    <span className="text-white font-bold">{finishes[selectedFinish].name}</span>
                  </div>
                  <span className="text-[#98AEA3] hidden sm:inline">&bull;</span>
                  <span className="text-[#98AEA3]">WHEELS: <strong className="text-white">{wheels[selectedWheel].name.split(' ')[0]}</strong></span>
                  <span className="text-[#98AEA3] hidden sm:inline">&bull;</span>
                  <span className="text-[#98AEA3]">TRIM: <strong className="text-white">{interiors[selectedInterior].name.split('&')[0]}</strong></span>
                </div>
              </div>

              {/* Mobile-Only Quick Telemetry Strip */}
              <div className="grid grid-cols-2 gap-2 sm:hidden font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#061F10] border border-[#FA353F]/30 text-center">
                  <span className="text-[9px] text-[#FA353F] block uppercase font-bold">SPRINT 0-100</span>
                  <span className="text-sm font-bold text-white">{activeModalCar.accel}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#061F10] border border-[#FA353F]/30 text-center">
                  <span className="text-[9px] text-[#FA353F] block uppercase font-bold">OUTPUT</span>
                  <span className="text-sm font-bold text-[#FA353F]">{activeModalCar.hp}</span>
                </div>
              </div>
            </div>

            {/* Model Philosophy & Typography Intro (Hero Language) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-[#98AEA3]/15 pb-12">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-0.5 bg-[#FA353F]" />
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FA353F] font-bold">
                    BESPOKE SPECIFICATION
                  </span>
                </div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F5FAF7] tracking-wider uppercase leading-tight">
                  {activeModalCar.name} &bull; <span className="text-[#FA353F] ruby-text-glow">STUDIO</span>
                </h1>
                <p className="font-sans text-sm sm:text-base text-[#98AEA3] leading-relaxed border-l-2 border-[#FA353F]/40 pl-4 max-w-2xl font-light">
                  {activeModalCar.description}
                </p>
              </div>

              {/* Atelier Valuation & Contact CTA Box */}
              <div className="lg:col-span-5 luxury-glass p-6 sm:p-8 rounded-lg border-2 border-[#FA353F]/40 shadow-2xl space-y-5">
                <div className="flex items-baseline justify-between pb-3 border-b border-[#98AEA3]/15">
                  <span className="font-mono text-xs text-[#98AEA3] uppercase tracking-wider">OFFICIAL VALUATION</span>
                  <span className="font-mono text-2xl font-bold text-white">{activeModalCar.price}</span>
                </div>
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      audioEngine.playTelemetryBeep();
                      const carData = {
                        car: activeModalCar.name,
                        price: activeModalCar.price,
                        finish: finishes[selectedFinish].name,
                        wheels: wheels[selectedWheel].name,
                        interior: interiors[selectedInterior].name,
                        aero: aeros[selectedAero].name,
                      };
                      setActiveModalCar(null);
                      onOpenTestDriveModal(carData);
                    }}
                    className="w-full py-4 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow flex items-center justify-center space-x-2 transition-all active:scale-98"
                  >
                    <Mail className="w-4 h-4" />
                    <span>CONTACT US FOR THIS ALLOCATION</span>
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      const carData = {
                        car: activeModalCar.name,
                        finish: finishes[selectedFinish].name,
                      };
                      setActiveModalCar(null);
                      onOpenTestDriveModal(carData);
                    }}
                    className="w-full py-3.5 rounded-full bg-[#061F10] hover:bg-[#0A2E19] text-[#F5FAF7] border border-[#98AEA3]/20 hover:border-[#FA353F] font-mono text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>REQUEST PRIVATE TRACK TEST</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Customization Atelier Matrix (4 Bespoke Suites) */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FA353F]" />
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase tracking-wider">
                  CUSTOMIZE ATELIER OPTIONS
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Paint Finishes Suite */}
                <div className="p-6 sm:p-8 rounded-lg luxury-glass border border-[#98AEA3]/15 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                    <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest">
                      01 &bull; EXTERIOR LIVERY FINISH
                    </span>
                    <span className="font-mono text-xs text-white font-bold">
                      {finishes[selectedFinish].name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {finishes.map((f, idx) => (
                      <button
                        key={f.name}
                        onClick={() => {
                          audioEngine.playClick();
                          setSelectedFinish(idx);
                        }}
                        className={`p-3.5 rounded-lg text-left transition-all flex items-center space-x-3 ${
                          selectedFinish === idx
                            ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                            : 'bg-[#020F06] border border-[#98AEA3]/15 text-[#98AEA3] hover:border-[#FA353F]/50 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/40 shrink-0 shadow-md"
                          style={{ backgroundColor: f.hex }}
                        />
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-bold truncate">{f.name}</p>
                          <p className="font-sans text-[11px] text-[#7E9389] truncate">{f.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Forged Wheels Suite */}
                <div className="p-6 sm:p-8 rounded-lg luxury-glass border border-[#98AEA3]/15 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                    <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest">
                      02 &bull; FORGED WHEELS SYSTEM
                    </span>
                    <span className="font-mono text-xs text-white font-bold">
                      {wheels[selectedWheel].name.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {wheels.map((w, idx) => (
                      <button
                        key={w.name}
                        onClick={() => {
                          audioEngine.playClick();
                          setSelectedWheel(idx);
                        }}
                        className={`w-full p-3.5 rounded-lg text-left transition-all flex items-center justify-between ${
                          selectedWheel === idx
                            ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                            : 'bg-[#020F06] border border-[#98AEA3]/15 text-[#98AEA3] hover:border-[#FA353F]/50 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="font-mono text-xs font-bold text-white">{w.name}</p>
                          <p className="font-sans text-xs text-[#7E9389]">{w.desc}</p>
                        </div>
                        <span className="font-mono text-[10px] text-[#FA353F] font-bold bg-[#020F06] px-2.5 py-1 rounded border border-[#FA353F]/30">
                          {w.weight}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Cockpit Interior Trim */}
                <div className="p-6 sm:p-8 rounded-lg luxury-glass border border-[#98AEA3]/15 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                    <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest">
                      03 &bull; COCKPIT INTERIOR CRAFT
                    </span>
                    <span className="font-mono text-xs text-white font-bold truncate max-w-[160px]">
                      {interiors[selectedInterior].name.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {interiors.map((item, idx) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          audioEngine.playClick();
                          setSelectedInterior(idx);
                        }}
                        className={`w-full p-3.5 rounded-lg text-left transition-all flex items-center justify-between ${
                          selectedInterior === idx
                            ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                            : 'bg-[#020F06] border border-[#98AEA3]/15 text-[#98AEA3] hover:border-[#FA353F]/50 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="font-mono text-xs font-bold text-white">{item.name}</p>
                          <p className="font-sans text-xs text-[#7E9389]">{item.desc}</p>
                        </div>
                        {selectedInterior === idx && <Check className="w-4 h-4 text-[#FA353F]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Aerodynamics Downforce Package */}
                <div className="p-6 sm:p-8 rounded-lg luxury-glass border border-[#98AEA3]/15 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                    <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest">
                      04 &bull; ACTIVE AERODYNAMICS PACKAGE
                    </span>
                    <span className="font-mono text-xs text-white font-bold">
                      {aeros[selectedAero].name.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {aeros.map((item, idx) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          audioEngine.playClick();
                          setSelectedAero(idx);
                        }}
                        className={`w-full p-3.5 rounded-lg text-left transition-all flex items-center justify-between ${
                          selectedAero === idx
                            ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                            : 'bg-[#020F06] border border-[#98AEA3]/15 text-[#98AEA3] hover:border-[#FA353F]/50 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="font-mono text-xs font-bold text-white">{item.name}</p>
                          <p className="font-sans text-xs text-[#7E9389]">{item.desc}</p>
                        </div>
                        {selectedAero === idx && <Check className="w-4 h-4 text-[#FA353F]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Powertrain Architecture Bar */}
            <div className="p-8 rounded-lg luxury-glass border border-[#FA353F]/30 space-y-6">
              <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                HOMOLOGATED TECHNICAL ARCHITECTURE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-md bg-[#020F06] border border-[#98AEA3]/15">
                  <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest">ENGINE / MOTOR</span>
                  <span className="font-mono text-xs font-bold text-white mt-1 block">{activeModalCar.engine}</span>
                </div>
                <div className="p-4 rounded-md bg-[#020F06] border border-[#98AEA3]/15">
                  <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest">TRANSMISSION</span>
                  <span className="font-mono text-xs font-bold text-white mt-1 block">{activeModalCar.transmission}</span>
                </div>
                <div className="p-4 rounded-md bg-[#020F06] border border-[#98AEA3]/15">
                  <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest">CURB MASS</span>
                  <span className="font-mono text-xs font-bold text-white mt-1 block">{activeModalCar.weight}</span>
                </div>
                <div className="p-4 rounded-md bg-[#020F06] border border-[#98AEA3]/15">
                  <span className="block font-mono text-[9px] text-[#7E9389] uppercase tracking-widest">DOWNFORCE PEAK</span>
                  <span className="font-mono text-xs font-bold text-[#FA353F] mt-1 block">{activeModalCar.downforce}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INSTANT PURCHASE & BUILD ALLOCATION ORDER MODAL */}
      {/* ========================================================================= */}
      {activeOrderCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#020F06] text-[#F5FAF7] rounded-lg border-2 border-[#FA353F] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveOrderCar(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-md bg-[#061F10] border border-[#98AEA3]/20 hover:text-[#FA353F] text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!orderConfirmed ? (
              <form onSubmit={handleConfirmOrder} className="space-y-6">
                <div className="pb-4 border-b border-[#98AEA3]/15 pr-8">
                  <div className="flex items-center space-x-2 text-[#FA353F] font-mono text-xs font-bold uppercase mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>OFFICIAL FACTORY ALLOCATION CONTRACT</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase">
                    ORDER {activeOrderCar.name}
                  </h2>
                  <p className="font-sans text-xs text-[#98AEA3] mt-1">
                    Secure your custom build allocation directly with the {brandName} European Atelier.
                  </p>
                </div>

                {/* Car Summary Card */}
                <div className="p-4 rounded-md bg-[#061F10] border border-[#FA353F]/30 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={activeOrderCar.imageRef}
                      alt={activeOrderCar.name}
                      className="w-16 h-12 object-cover rounded border border-[#98AEA3]/20"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-white uppercase">{activeOrderCar.name}</h4>
                      <p className="font-mono text-[11px] text-[#FA353F]">{activeOrderCar.hp} &bull; {activeOrderCar.topSpeed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-[#7E9389] block">VALUATION</span>
                    <span className="font-mono text-base font-bold text-white">{activeOrderCar.price}</span>
                  </div>
                </div>

                {/* 1. Deposit Structure */}
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    SELECT INITIAL RESERVATION DEPOSIT
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        audioEngine.playClick();
                        setOrderDepositOption('10%');
                      }}
                      className={`p-3 rounded-md text-left transition-all ${
                        orderDepositOption === '10%'
                          ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow'
                          : 'bg-[#061F10]/50 border border-[#98AEA3]/20 text-[#98AEA3]'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold block text-white">10% BUILD DEPOSIT</span>
                      <span className="font-mono text-xs text-[#FA353F] font-semibold">
                        ${(activeOrderCar.numericPrice * 0.1).toLocaleString()} USD
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        audioEngine.playClick();
                        setOrderDepositOption('FULL');
                      }}
                      className={`p-3 rounded-md text-left transition-all ${
                        orderDepositOption === 'FULL'
                          ? 'bg-[#061F10] border-2 border-[#FA353F] text-white shadow-ruby-glow'
                          : 'bg-[#061F10]/50 border border-[#98AEA3]/20 text-[#98AEA3]'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold block text-white">FULL ESCROW WIRE</span>
                      <span className="font-mono text-xs text-emerald-400 font-semibold">
                        {activeOrderCar.price} USD
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Destination Atelier */}
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    DESTINATION ATELIER / DELIVERY CITY
                  </label>
                  <select
                    value={orderDeliveryCity}
                    onChange={(e) => setOrderDeliveryCity(e.target.value)}
                    className="w-full p-3 rounded-md bg-[#061F10] border border-[#98AEA3]/25 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  >
                    <option value="MONACO">MONACO (Port Hercule Atelier)</option>
                    <option value="NURBURG">NÜRBURGRING (Proving Grounds Circuit, Germany)</option>
                    <option value="LONDON">LONDON / SILVERSTONE (Tech Complex, UK)</option>
                    <option value="DUBAI">DUBAI (DIFC Gate Precinct)</option>
                    <option value="TOKYO">TOKYO (Roppongi Hills Reserve)</option>
                    <option value="ASPEN">ASPEN / LOS ANGELES (Private Collector Hub)</option>
                  </select>
                </div>

                {/* 3. Custom Chassis Engraving Plaque */}
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    CUSTOM CHASSIS PLAQUE ENGRAVING (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={orderPlaqueText}
                    onChange={(e) => setOrderPlaqueText(e.target.value)}
                    placeholder="e.g. COMMISSIONED FOR JOHN DOE #01"
                    maxLength={40}
                    className="w-full p-3 rounded-md bg-[#061F10] border border-[#98AEA3]/25 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
                  />
                </div>

                {/* Submit Order Button */}
                <div className="pt-4 border-t border-[#98AEA3]/15">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow flex items-center justify-center space-x-2 transition-all active:scale-98"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>CONFIRM &amp; SECURE ALLOCATION</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Order Success Screen */
              <div className="text-center py-8 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#061F10] border-2 border-[#FA353F] flex items-center justify-center mx-auto text-[#FA353F] shadow-ruby-glow">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest">
                    ALLOCATION RESERVED SUCCESSFULLY
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white uppercase">
                    CONGRATULATIONS ON YOUR {activeOrderCar.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#98AEA3] max-w-md mx-auto leading-relaxed">
                    Your build reservation has been recorded. Our factory client concierge will contact you within 24 hours with your official certificate of manufacture.
                  </p>
                </div>

                <div className="p-4 bg-[#061F10] rounded-md border border-[#FA353F]/30 max-w-md mx-auto text-left font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#7E9389]">INVOICE / CONTRACT ID:</span>
                    <span className="text-white font-bold">VEL-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7E9389]">DELIVERY HUB:</span>
                    <span className="text-white font-bold">{orderDeliveryCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7E9389]">DEPOSIT PLAN:</span>
                    <span className="text-[#FA353F] font-bold">{orderDepositOption} DEPOSIT</span>
                  </div>
                  {orderPlaqueText && (
                    <div className="flex justify-between">
                      <span className="text-[#7E9389]">CHASSIS ENGRAVING:</span>
                      <span className="text-white font-bold">{orderPlaqueText}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setActiveOrderCar(null);
                  }}
                  className="px-8 py-3 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow"
                >
                  RETURN TO SHOWROOM
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
