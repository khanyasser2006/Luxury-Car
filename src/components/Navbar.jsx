import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Compass, Shield, Menu, X, ArrowUpRight, Gauge, User, Sliders } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function Navbar({
  currentView = 'home',
  currentUser = null,
  onNavigate,
  onOpenTestDriveModal,
  audioMuted,
  setAudioMuted,
}) {
  const { cmsData } = useCMS();
  const brandName = cmsData?.siteMeta?.brandName || 'VELOCE';
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentView !== 'home') {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const contentEl = document.getElementById('home-content');
      if (contentEl) {
        const rect = contentEl.getBoundingClientRect();
        // Visible ONLY once the pinned 450% hero scroll sequence is finished and home-content enters viewport
        setIsVisible(rect.top <= 100);
      } else {
        setIsVisible(window.scrollY >= window.innerHeight * 4.4);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentView]);

  const navLinks = [
    { label: 'HOME', view: 'home' },
    { label: 'CARS', view: 'cars' },
    { label: 'ENGINEERING', view: 'engineering' },
    { label: 'REVIEWS', view: 'reviews' },
  ];

  const handleNavClick = (e, item) => {
    e.preventDefault();
    audioEngine.playClick();
    if (onNavigate) {
      onNavigate(item.view);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out transform ${
          isVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto luxury-glass py-3.5 border-b border-[#FA353F]/30 shadow-2xl'
            : 'opacity-0 -translate-y-full pointer-events-none py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              audioEngine.playClick();
              if (onNavigate) {
                onNavigate('home');
              }
            }}
            className="group flex items-center space-x-3 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-[#020F06] border border-[#FA353F]/50 flex items-center justify-center relative overflow-hidden group-hover:border-[#FA353F] group-hover:shadow-ruby-glow transition-all duration-300">
              <div className="w-3.5 h-3.5 rotate-45 border-2 border-[#FA353F] group-hover:rotate-[135deg] group-hover:scale-110 transition-transform duration-500 ease-out" />
            </div>
            <span className="font-display font-bold text-xl tracking-[0.2em] text-[#F5FAF7] group-hover:text-white transition-colors duration-200">
              {brandName}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((item) => {
              const isActive = item.view === currentView;
              return (
                <a
                  key={item.label}
                  href={`#/${item.view === 'home' ? '' : item.view}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors relative py-1 group font-medium ${
                    isActive ? 'text-[#FA353F] font-bold' : 'text-[#98AEA3] hover:text-[#FA353F]'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#FA353F] transition-all duration-300 ease-out ${
                      isActive ? 'w-full shadow-ruby-glow' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Primary Action Buttons (Side by Side: Login/Register & Book Test Drive) */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {/* Login / Register Button */}
            <button
              onClick={() => {
                audioEngine.playClick();
                if (onNavigate) {
                  onNavigate('auth');
                }
              }}
              className={`luxury-btn-hover inline-flex items-center space-x-2 px-4 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-[0.15em] transition-all border ${
                currentView === 'auth'
                  ? 'bg-[#FA353F] text-white border-[#FA353F] shadow-ruby-glow'
                  : 'bg-[#061F10] hover:bg-[#0A2E19] text-[#F5FAF7] border-[#98AEA3]/25 hover:border-[#FA353F]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#FA353F]" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'LOGIN / REGISTER'}</span>
            </button>

            {/* Book Test Drive Button */}
            <button
              onClick={() => {
                audioEngine.playTelemetryBeep();
                onOpenTestDriveModal();
              }}
              className="luxury-btn-hover group relative inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow transition-all"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>BOOK TEST DRIVE</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#061F10] border border-[#98AEA3]/20 text-[#F5FAF7] hover:text-[#FA353F] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden luxury-glass border-b border-[#FA353F]/30 px-5 sm:px-6 py-6 space-y-4 animate-fadeIn rounded-b-3xl shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="space-y-1">
              {navLinks.map((item) => {
                const isActive = item.view === currentView;
                return (
                  <a
                    key={item.label}
                    href={`#/${item.view === 'home' ? '' : item.view}`}
                    onClick={(e) => {
                      handleNavClick(e, item);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between font-mono text-xs uppercase tracking-widest py-3 px-3 rounded-lg transition-colors min-h-[44px] ${
                      isActive
                        ? 'text-[#FA353F] font-bold bg-[#061F10] border-l-2 border-[#FA353F]'
                        : 'text-[#98AEA3] hover:text-[#FA353F] hover:bg-[#061F10]/50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#FA353F]" />}
                  </a>
                );
              })}
            </div>
            <div className="pt-3 border-t border-[#98AEA3]/15 space-y-2.5">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setMobileMenuOpen(false);
                  if (onNavigate) {
                    onNavigate('auth');
                  }
                }}
                className="w-full min-h-[44px] py-3 rounded-xl bg-[#061F10] border border-[#FA353F]/40 hover:border-[#FA353F] text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <User className="w-4 h-4 text-[#FA353F]" />
                <span>{currentUser ? `LOGGED IN: ${currentUser.name}` : 'LOGIN / REGISTER'}</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playTelemetryBeep();
                  setMobileMenuOpen(false);
                  onOpenTestDriveModal();
                }}
                className="w-full min-h-[48px] py-3.5 rounded-xl bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Gauge className="w-4 h-4" />
                <span>BOOK TEST DRIVE</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}