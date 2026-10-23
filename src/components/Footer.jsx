import React from 'react';
import { Compass, Shield, ArrowUpRight, Globe, Lock, Mail, Phone } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function Footer({ onOpenTestDriveModal, onNavigate }) {
  const { cmsData } = useCMS();
  const brandName = cmsData?.siteMeta?.brandName || 'VELOCE';
  const copyright = cmsData?.siteMeta?.copyright || '© 2026 VELOCE ATELIER S.P.A. ALL RIGHTS RESERVED.';

  const ateliers = [
    { city: 'MONACO', address: 'Quai Antoine 1er, Port Hercule', time: '14:32 CEST' },
    { city: 'EIFEL / NURBURG', address: `${brandName} Proving Grounds Circuit`, time: '14:32 CEST' },
    { city: 'SILVERSTONE', address: 'Atelier Tech Complex, Unit 09', time: '13:32 BST' },
    { city: 'DUBAI', address: 'DIFC Gate Precinct, Building 04', time: '16:32 GST' },
    { city: 'ASPEN', address: 'Private Collector Reserve, CO', time: '06:32 MDT' },
  ];

  const handleLinkClick = (e, view, carIndex = 0) => {
    e.preventDefault();
    audioEngine.playClick();
    if (onNavigate) {
      onNavigate(view, carIndex);
    }
  };

  return (
    <footer className="bg-[#020F06] text-[#F5FAF7] border-t-2 border-[#FA353F]/40 pt-20 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-16 border-b border-[#98AEA3]/15">
          {/* Brand Identity & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#020F06] border border-[#FA353F] flex items-center justify-center shadow-ruby-glow">
                <div className="w-3.5 h-3.5 rotate-45 bg-[#FA353F]" />
              </div>
              <span className="font-display font-bold text-xl tracking-[0.2em] text-[#F5FAF7]">
                {brandName}
              </span>
            </div>
            <p className="font-sans text-xs text-[#98AEA3] max-w-sm leading-relaxed">
              {cmsData?.siteMeta?.brandTagline || 'Handcrafted hypercars built for ultimate performance and tested on our private track before delivery.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  audioEngine.playTelemetryBeep();
                  onOpenTestDriveModal();
                }}
                className="px-6 py-3 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow transition-all"
              >
                BOOK A TEST DRIVE
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FA353F] block mb-4 font-bold">
              PORTALS &amp; FLEET
            </span>
            <ul className="space-y-2.5 font-mono text-xs text-[#98AEA3]">
              <li>
                <a
                  href="#/cars"
                  onClick={(e) => handleLinkClick(e, 'cars', 0)}
                  className="hover:text-[#FA353F] transition-colors"
                >
                  Apex Nero GT (Hybrid)
                </a>
              </li>
              <li>
                <a
                  href="#/cars"
                  onClick={(e) => handleLinkClick(e, 'cars', 1)}
                  className="hover:text-[#FA353F] transition-colors"
                >
                  Valkyrie Stradale (V12)
                </a>
              </li>
              <li>
                <a
                  href="#/cars"
                  onClick={(e) => handleLinkClick(e, 'cars', 2)}
                  className="hover:text-[#FA353F] transition-colors"
                >
                  Phantom Corsa (Electric)
                </a>
              </li>
              <li>
                <a
                  href="#/engineering"
                  onClick={(e) => handleLinkClick(e, 'engineering')}
                  className="hover:text-[#FA353F] transition-colors"
                >
                  Engineering Masterclass
                </a>
              </li>
              <li>
                <a
                  href="#/reviews"
                  onClick={(e) => handleLinkClick(e, 'reviews')}
                  className="hover:text-[#FA353F] transition-colors"
                >
                  Client Reviews &amp; Lap Times
                </a>
              </li>
            </ul>
          </div>

          {/* Global Atelier Locations with Local Times */}
          <div className="lg:col-span-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FA353F] block mb-4 font-bold">
              GLOBAL LOCATIONS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ateliers.map((item) => (
                <div key={item.city} className="p-3.5 bg-[#061F10] rounded-lg border border-[#98AEA3]/15">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-[#F5FAF7]">{item.city}</span>
                    <span className="font-mono text-[9px] text-[#FA353F] font-bold">{item.time}</span>
                  </div>
                  <p className="font-sans text-xs text-[#7E9389] truncate">{item.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Homologation Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#7E9389] gap-4 text-center sm:text-left">
          <p>{copyright}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center sm:justify-end">
            <a href="#/cars" onClick={(e) => handleLinkClick(e, 'cars')} className="hover:text-[#FA353F] transition-colors">FLEET SPECIFICATIONS</a>
            <a href="#" className="hover:text-[#FA353F] transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-[#FA353F] transition-colors">TRACK SAFETY RULES</a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                audioEngine.playTelemetryBeep();
                onOpenTestDriveModal();
              }}
              className="hover:text-[#FA353F] transition-colors font-bold text-[#FA353F]"
            >
              CONTACT ATELIER
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
