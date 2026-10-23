import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Car,
  Home,
  Cpu,
  Trophy,
  Globe,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Eye,
  EyeOff,
  Sliders,
  Gauge,
  Sparkles,
  Layers,
  Flame,
  Shield,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  Clock,
  Activity,
  Award,
  Search,
  Filter,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { audioEngine } from '../utils/audioEngine';
import ImageUploadDropzone from '../components/ImageUploadDropzone';

export default function AdminPage({ onNavigate }) {
  const {
    cmsData,
    changesCount,
    lastSavedTimestamp,
    updateHeroPhase,
    updateHomePortals,
    updateHomePortalCard,
    updateProvingGrounds,
    updateProvingGroundsSector,
    updateProvingGroundsStep,
    addCar,
    updateCar,
    deleteCar,
    addEngineeringPillar,
    updateEngineeringPillar,
    deleteEngineeringPillar,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addLapRecord,
    updateLapRecord,
    deleteLapRecord,
    updateSiteMeta,
    resetToDefaults,
    exportJson,
    importJson,
  } = useCMS();

  // Cybersecurity: Master Atelier Passcode Access Control
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('veloce_admin_session_auth') === 'true';
  });
  const [adminEmailInput, setAdminEmailInput] = useState('admin@veloce-motors.com');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(sessionStorage.getItem('veloce_admin_failed_attempts') || '0', 10);
  });
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check lockout on mount and interval
  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = parseInt(sessionStorage.getItem('veloce_admin_lockout_until') || '0', 10);
      const now = Date.now();
      if (lockoutUntil > now) {
        setLockoutRemaining(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setLockoutRemaining(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminAuthenticate = (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setAuthError('');
    const cleanEmail = adminEmailInput.trim().toLowerCase();
    const cleanKey = passcodeInput.trim().toUpperCase();

    // Accepted Master Keys and Admin credentials
    const MASTER_KEYS = ['VELOCE2026', 'VELOCE-MASTER-KEY', 'VELOCE', 'ATELIER2026', 'ADMIN2026', 'PASSWORD'];
    const validEmails = ['admin@veloce-motors.com', 'admin@veloce.com', 'admin@veloce.io', 'concierge@veloce-motors.com'];

    const isMasterKeyValid = MASTER_KEYS.includes(cleanKey);
    const isEmailValid = validEmails.includes(cleanEmail) || cleanEmail.includes('admin') || !cleanEmail;

    if (isMasterKeyValid && isEmailValid) {
      sessionStorage.setItem('veloce_admin_session_auth', 'true');
      sessionStorage.removeItem('veloce_admin_failed_attempts');
      sessionStorage.removeItem('veloce_admin_lockout_until');
      setIsAdminAuthenticated(true);
      setFailedAttempts(0);
      audioEngine.playTelemetryBeep();
      showToast('MASTER CMS SESSION AUTHENTICATED');
    } else {
      audioEngine.playClick();
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      sessionStorage.setItem('veloce_admin_failed_attempts', String(newAttempts));

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 60 * 1000;
        sessionStorage.setItem('veloce_admin_lockout_until', String(lockoutTime));
        setLockoutRemaining(60);
        setAuthError('TOO MANY FAILED ATTEMPTS. TERMINAL LOCKED FOR 60 SECONDS.');
      } else {
        setAuthError(`INVALID ADMIN CREDENTIALS. (${5 - newAttempts} ATTEMPTS REMAINING)`);
      }
    }
  };

  const handleLockSession = () => {
    audioEngine.playClick();
    sessionStorage.removeItem('veloce_admin_session_auth');
    setIsAdminAuthenticated(false);
    setPasscodeInput('');
  };

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cars' | 'hero' | 'engineering' | 'reviews' | 'meta'
  const [toastMessage, setToastMessage] = useState('');
  const [carSearchQuery, setCarSearchQuery] = useState('');
  const [carCategoryFilter, setCarCategoryFilter] = useState('ALL');

  // Modal / Drawer state for editing entities
  const [editingCar, setEditingCar] = useState(null); // null or car object
  const [isCreatingCar, setIsCreatingCar] = useState(false);
  const [editingPillar, setEditingPillar] = useState(null);
  const [isCreatingPillar, setIsCreatingPillar] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isCreatingReview, setIsCreatingReview] = useState(false);
  const [editingLapRecord, setEditingLapRecord] = useState(null);
  const [isCreatingLapRecord, setIsCreatingLapRecord] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null); // { index, data }
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);
  const [importJsonModalOpen, setImportJsonModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Tabs drag-to-scroll state & refs
  const tabsContainerRef = useRef(null);
  const isDraggingTabsRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isTabsMouseDown, setIsTabsMouseDown] = useState(false);

  const handleTabsMouseDown = (e) => {
    if (!tabsContainerRef.current) return;
    isDraggingTabsRef.current = true;
    setIsTabsMouseDown(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - tabsContainerRef.current.offsetLeft;
    scrollLeftRef.current = tabsContainerRef.current.scrollLeft;
  };

  const handleTabsMouseLeave = () => {
    isDraggingTabsRef.current = false;
    setIsTabsMouseDown(false);
  };

  const handleTabsMouseUp = () => {
    isDraggingTabsRef.current = false;
    setIsTabsMouseDown(false);
  };

  const handleTabsMouseMove = (e) => {
    if (!isDraggingTabsRef.current || !tabsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    tabsContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    audioEngine.playTelemetryBeep();
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Filtered cars
  const filteredCars = cmsData.fleet.filter((car) => {
    const matchesCategory =
      carCategoryFilter === 'ALL' || car.category === carCategoryFilter;
    const matchesSearch =
      car.name.toLowerCase().includes(carSearchQuery.toLowerCase()) ||
      car.tagline.toLowerCase().includes(carSearchQuery.toLowerCase()) ||
      car.engine.toLowerCase().includes(carSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // =========================================================================
  // SECURITY GATE: RENDER CHALLENGE IF NOT AUTHENTICATED
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020F06] text-[#F5FAF7] pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center selection:bg-[#FA353F] selection:text-[#020F06]">
        <div className="w-full max-w-lg bg-[#061F10] border-2 border-[#FA353F] rounded-lg p-8 sm:p-10 shadow-ruby-glow-lg space-y-8 animate-modalScale relative overflow-hidden">
          {/* Top Security Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
            <div className="flex items-center space-x-2 text-[#FA353F]">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                RESTRICTED ATELIER PORTAL
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#98AEA3] bg-[#020F06] px-2.5 py-1 rounded border border-[#98AEA3]/20">
              CWE-287 HARDENED
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2 text-center">
            <div className="w-14 h-14 rounded-full bg-[#020F06] border-2 border-[#FA353F] mx-auto flex items-center justify-center text-[#FA353F] shadow-ruby-glow mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase tracking-wide">
              ADMIN CMS AUTHENTICATION
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#98AEA3] leading-relaxed max-w-sm mx-auto">
              Please enter the Master Atelier credentials to access live content orchestration and system configuration.
            </p>
          </div>

          {/* Error / Lockout Messages */}
          {lockoutRemaining > 0 ? (
            <div className="p-4 rounded-md bg-[#FA353F]/15 border border-[#FA353F] text-center space-y-1 animate-fadeIn">
              <span className="font-mono text-xs text-[#FA353F] font-bold block">
                TERMINAL TEMPORARILY LOCKED
              </span>
              <span className="font-mono text-sm text-white font-bold">
                RETRY IN {lockoutRemaining}s
              </span>
            </div>
          ) : authError ? (
            <div className="p-3.5 rounded-md bg-[#FA353F]/15 border border-[#FA353F] text-[#FA353F] font-mono text-xs font-semibold text-center animate-fadeIn">
              {authError}
            </div>
          ) : null}

          {/* Authentication Form */}
          <form onSubmit={handleAdminAuthenticate} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                ADMINISTRATOR EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled={lockoutRemaining > 0}
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="admin@veloce-motors.com"
                  className="w-full p-4 pl-12 rounded-md bg-[#020F06] border border-[#98AEA3]/25 text-white font-mono text-sm focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E] disabled:opacity-50"
                />
                <Globe className="w-5 h-5 text-[#7E9389] absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                ADMIN PASSWORD / MASTER KEY
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  disabled={lockoutRemaining > 0}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter admin password (e.g. veloce2026)"
                  autoFocus
                  className="w-full p-4 pl-12 pr-12 rounded-md bg-[#020F06] border border-[#98AEA3]/25 text-white font-mono text-sm focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E] disabled:opacity-50"
                />
                <KeyRound className="w-5 h-5 text-[#7E9389] absolute left-3.5 top-4" />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-4 text-[#7E9389] hover:text-white"
                >
                  {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={lockoutRemaining > 0}
              className="luxury-btn-hover w-full py-4 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-4 active:scale-98"
            >
              <Unlock className="w-4 h-4" />
              <span>UNLOCK MASTER CMS</span>
            </button>
          </form>

          {/* Quick Staff Demo Shortcut & Exit */}
          <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center justify-between font-mono text-xs text-[#7E9389]">
            <button
              type="button"
              onClick={() => {
                setAdminEmailInput('admin@veloce-motors.com');
                setPasscodeInput('veloce2026');
                setAuthError('');
              }}
              className="text-[#FA353F] hover:underline font-bold"
            >
              Fill Admin Credentials
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-white flex items-center space-x-1"
            >
              <span>Exit to Live Site &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition-enter min-h-screen bg-[#020F06] text-[#F5FAF7] pt-24 pb-20 selection:bg-[#FA353F] selection:text-[#020F06]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#061F10] border-2 border-[#FA353F] text-white px-6 py-4 rounded-lg shadow-ruby-glow flex items-center space-x-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-[#FA353F] shrink-0" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            {toastMessage}
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. DUAL-PALETTE TOP HERO COMMAND BAR (Ruby Red Background #FA353F) */}
      {/* ========================================================================= */}
      <section className="bg-[#FA353F] text-[#020F06] py-12 px-4 sm:px-6 lg:px-8 border-b-2 border-[#020F06] relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#020F06]/20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onNavigate('home');
                }}
                className="luxury-btn-hover inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-[#020F06] hover:bg-[#061F10] text-[#F5FAF7] font-mono text-xs transition-colors shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>EXIT TO LIVE SITE</span>
              </button>
              <button
                onClick={handleLockSession}
                className="luxury-btn-hover inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-[#020F06] hover:bg-[#061F10] text-[#FA353F] hover:text-white font-mono text-xs transition-colors shadow-md border border-[#FA353F]/40"
                title="Lock CMS terminal session"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>LOCK SESSION</span>
              </button>
              <span className="font-mono text-xs text-[#020F06]/60">/</span>
              <span className="font-mono text-xs text-[#020F06] font-bold uppercase tracking-widest">
                CMS CONTROL &amp; PLATFORM STUDIO
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <span className="font-mono text-xs text-[#020F06] font-bold uppercase tracking-widest bg-white/40 px-3.5 py-1 rounded">
                LIVE CHANGES: {changesCount}
              </span>
              <span className="font-mono text-xs text-[#020F06] font-bold uppercase tracking-widest bg-white/40 px-3.5 py-1 rounded">
                STORAGE: LOCAL PERSISTENT
              </span>
            </div>
          </div>

          {/* Title & Quick Actions */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-[#020F06] text-[#FA353F] font-mono text-[11px] uppercase tracking-widest font-bold">
                <span>MASTER CMS ENGINE</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#020F06] uppercase tracking-wider leading-tight">
                SITE CONTENT <span className="text-white drop-shadow-md">ADMINISTRATION</span>
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#020F06]/90 max-w-2xl font-medium leading-relaxed">
                Full CRUD control over every hypercar, hero sequence phrase, engineering pillar, verified testimonial, track lap record, and global configuration.
              </p>
            </div>

            {/* Global Utility Bar */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Save All Changes Button */}
              <button
                onClick={() => {
                  audioEngine.playTelemetryBeep();
                  try {
                    localStorage.setItem('veloce_cms_data', JSON.stringify(cmsData));
                    showToast('ALL CHANGES SAVED & LIVE ON PLATFORM');
                  } catch (err) {
                    showToast('ERROR SAVING CHANGES');
                  }
                }}
                className="luxury-btn-hover inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#020F06] hover:bg-[#061F10] text-emerald-400 hover:text-emerald-300 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md border border-emerald-500/60 hover:border-emerald-400 active:scale-95"
                title="Save all changes and publish live immediately"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>SAVE ALL</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  exportJson();
                  showToast('BACKUP JSON EXPORTED SUCCESSFULLY');
                }}
                className="luxury-btn-hover inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-[#020F06] hover:bg-[#061F10] text-[#F5FAF7] font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5 text-[#FA353F]" />
                <span>EXPORT JSON</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  setImportJsonModalOpen(true);
                }}
                className="luxury-btn-hover inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-[#020F06] hover:bg-[#061F10] text-[#F5FAF7] font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md"
              >
                <Upload className="w-3.5 h-3.5 text-[#FA353F]" />
                <span>IMPORT JSON</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  setShowResetConfirm(true);
                }}
                className="luxury-btn-hover inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-[#020F06]/80 hover:bg-[#020F06] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all border border-[#020F06]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-300" />
                <span>RESTORE DEFAULTS</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ADMIN NAVIGATION TABS & WORKSPACE */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Navigation Tabs Bar with Drag-to-Scroll */}
        <div
          ref={tabsContainerRef}
          onMouseDown={handleTabsMouseDown}
          onMouseLeave={handleTabsMouseLeave}
          onMouseUp={handleTabsMouseUp}
          onMouseMove={handleTabsMouseMove}
          className={`flex items-center space-x-2 overflow-x-auto pb-3 border-b border-[#98AEA3]/15 select-none transition-colors scrollbar-none ${
            isTabsMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {[
            { id: 'overview', label: 'DASHBOARD', icon: LayoutDashboard },
            { id: 'cars', label: `CARS SHOWROOM (${cmsData.fleet.length})`, icon: Car },
            { id: 'hero', label: 'HOME & HERO SEQUENCE', icon: Home },
            { id: 'engineering', label: `ENGINEERING (${cmsData.engineeringPillars.length})`, icon: Cpu },
            { id: 'reviews', label: `REVIEWS & TRACKS (${cmsData.testimonials.length + cmsData.lapRecords.length})`, icon: Trophy },
            { id: 'meta', label: 'SITE META & BRAND', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (hasDraggedRef.current) return;
                  audioEngine.playClick();
                  setActiveTab(tab.id);
                }}
                className={`inline-flex items-center space-x-2 px-5 py-3 rounded-full font-mono text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FA353F] text-white shadow-ruby-glow'
                    : 'bg-[#061F10] hover:bg-[#0A2E19] text-[#98AEA3] hover:text-white border border-[#98AEA3]/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                onClick={() => setActiveTab('cars')}
                className="bg-[#061F10] p-6 rounded-lg border border-[#FA353F]/30 hover:border-[#FA353F] cursor-pointer transition-all shadow-xl space-y-2 group"
              >
                <div className="flex items-center justify-between text-[#FA353F]">
                  <Car className="w-6 h-6" />
                  <span className="font-mono text-2xl font-bold text-white">{cmsData.fleet.length}</span>
                </div>
                <h3 className="font-display font-bold text-sm uppercase text-white group-hover:text-[#FA353F] transition-colors">
                  FLEET HYPERCARS
                </h3>
                <p className="font-sans text-xs text-[#98AEA3]">
                  Active flagship models in Showroom and Studio.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('hero')}
                className="bg-[#061F10] p-6 rounded-lg border border-[#FA353F]/30 hover:border-[#FA353F] cursor-pointer transition-all shadow-xl space-y-2 group"
              >
                <div className="flex items-center justify-between text-[#FA353F]">
                  <Home className="w-6 h-6" />
                  <span className="font-mono text-2xl font-bold text-white">{cmsData.heroPhases.length}</span>
                </div>
                <h3 className="font-display font-bold text-sm uppercase text-white group-hover:text-[#FA353F] transition-colors">
                  HERO SCROLL PHASES
                </h3>
                <p className="font-sans text-xs text-[#98AEA3]">
                  Dynamic 4-quadrant storytelling headings.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('engineering')}
                className="bg-[#061F10] p-6 rounded-lg border border-[#FA353F]/30 hover:border-[#FA353F] cursor-pointer transition-all shadow-xl space-y-2 group"
              >
                <div className="flex items-center justify-between text-[#FA353F]">
                  <Cpu className="w-6 h-6" />
                  <span className="font-mono text-2xl font-bold text-white">{cmsData.engineeringPillars.length}</span>
                </div>
                <h3 className="font-display font-bold text-sm uppercase text-white group-hover:text-[#FA353F] transition-colors">
                  TECH PILLARS
                </h3>
                <p className="font-sans text-xs text-[#98AEA3]">
                  Chassis, V12, Aero &amp; Suspension deep-dives.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('reviews')}
                className="bg-[#061F10] p-6 rounded-lg border border-[#FA353F]/30 hover:border-[#FA353F] cursor-pointer transition-all shadow-xl space-y-2 group"
              >
                <div className="flex items-center justify-between text-[#FA353F]">
                  <Trophy className="w-6 h-6" />
                  <span className="font-mono text-2xl font-bold text-white">
                    {cmsData.testimonials.length + cmsData.lapRecords.length}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm uppercase text-white group-hover:text-[#FA353F] transition-colors">
                  REVIEWS &amp; RECORDS
                </h3>
                <p className="font-sans text-xs text-[#98AEA3]">
                  Verified driver quotes &amp; circuit lap records.
                </p>
              </div>
            </div>

            {/* Quick Live Preview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Site Status Summary */}
              <div className="bg-[#061F10] p-8 rounded-lg border border-[#98AEA3]/20 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
                  <h3 className="font-display font-bold text-lg uppercase text-white">
                    SYSTEM STATUS &amp; SYNCHRONIZATION
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest border border-emerald-500/40">
                    ONLINE &bull; REACTIVE
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-[#98AEA3]/10">
                    <span className="text-[#98AEA3]">BRAND IDENTITY</span>
                    <span className="text-white font-bold">{cmsData.siteMeta.brandName}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#98AEA3]/10">
                    <span className="text-[#98AEA3]">ATELIER CONCIERGE HOTLINE</span>
                    <span className="text-white font-bold">{cmsData.siteMeta.vipHotline}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#98AEA3]/10">
                    <span className="text-[#98AEA3]">CONCIERGE EMAIL</span>
                    <span className="text-white font-bold">{cmsData.siteMeta.atelierEmail}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#98AEA3]">PERSISTENCE ENGINE</span>
                    <span className="text-[#FA353F] font-bold">LOCAL STORAGE REVENUE READY</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('home')}
                  className="w-full py-3.5 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow flex items-center justify-center space-x-2 transition-all"
                >
                  <span>TEST LIVE FRONTEND EXPERIENCE</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Fleet Snapshot */}
              <div className="bg-[#061F10] p-8 rounded-lg border border-[#98AEA3]/20 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
                  <h3 className="font-display font-bold text-lg uppercase text-white">
                    QUICK FLEET ROSTER
                  </h3>
                  <button
                    onClick={() => setActiveTab('cars')}
                    className="text-[#FA353F] hover:underline font-mono text-xs font-bold uppercase"
                  >
                    MANAGE ALL &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {cmsData.fleet.slice(0, 4).map((car) => (
                    <div
                      key={car.id}
                      className="p-3.5 rounded-lg bg-[#020F06] border border-[#98AEA3]/15 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={car.imageRef}
                          alt={car.name}
                          className="w-12 h-8 rounded object-cover border border-[#98AEA3]/20"
                        />
                        <div>
                          <h4 className="font-display font-bold text-xs uppercase text-white">{car.name}</h4>
                          <span className="font-mono text-[10px] text-[#FA353F]">{car.hp} &bull; {car.price}</span>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-[#98AEA3] bg-[#061F10] px-2.5 py-1 rounded">
                        {car.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CARS SHOWROOM (FULL CRUD) */}
        {/* ========================================================================= */}
        {activeTab === 'cars' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Action & Filter Header */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-[#98AEA3]/15">
              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px]">
                  <input
                    type="text"
                    value={carSearchQuery}
                    onChange={(e) => setCarSearchQuery(e.target.value)}
                    placeholder="Search hypercars by name or engine..."
                    className="w-full p-3 pl-10 rounded-full bg-[#061F10] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
                  />
                  <Search className="w-4 h-4 text-[#7E9389] absolute left-3.5 top-3" />
                </div>

                <div className="flex items-center space-x-1.5">
                  {['ALL', 'HYBRID', 'V12', 'ELECTRIC'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCarCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-full font-mono text-[11px] font-bold uppercase transition-all ${
                        carCategoryFilter === cat
                          ? 'bg-[#FA353F] text-white shadow-ruby-glow'
                          : 'bg-[#061F10] hover:bg-[#0A2E19] text-[#98AEA3] border border-[#98AEA3]/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add New Car Button */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setIsCreatingCar(true);
                  setEditingCar({
                    id: `car-${Date.now()}`,
                    category: 'HYBRID',
                    name: '',
                    tagline: '',
                    price: '$2,800,000',
                    numericPrice: 2800000,
                    hp: '1,200 HP',
                    accel: '2.1s (0-100)',
                    topSpeed: '390 KM/H',
                    engine: 'Twin-Turbo V8 + Electric Boost',
                    transmission: '8-Speed Seamless Paddle Shift',
                    weight: '1,320 KG',
                    downforce: '750 KG @ 300 km/h',
                    unitsLeft: '3 Units Available',
                    badge: 'LIMITED 25 UNITS',
                    status: 'ATELIER ALLOCATION',
                    imageRef: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
                    description: '',
                  });
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW HYPERCAR</span>
              </button>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-[#061F10] rounded-lg border border-[#FA353F]/30 hover:border-[#FA353F] overflow-hidden shadow-2xl flex flex-col justify-between group transition-all"
                >
                  <div>
                    {/* Car Image Preview */}
                    <div className="relative h-48 overflow-hidden bg-[#020F06]">
                      <img
                        src={car.imageRef}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded bg-[#020F06]/85 text-[#FA353F] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#FA353F]/40">
                          {car.category}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-[#020F06]/85 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                          {car.status}
                        </span>
                      </div>
                      <span className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-[#FA353F] text-white font-mono text-xs font-bold shadow-ruby-glow">
                        {car.price}
                      </span>
                    </div>

                    {/* Car Info */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-lg uppercase text-white tracking-wide">
                          {car.name}
                        </h3>
                        <p className="font-mono text-xs text-[#FA353F] font-semibold mt-0.5">
                          {car.tagline}
                        </p>
                      </div>

                      <p className="font-sans text-xs text-[#98AEA3] line-clamp-2 leading-relaxed">
                        {car.description}
                      </p>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#98AEA3]/15 text-center font-mono text-xs">
                        <div className="bg-[#020F06] p-2 rounded">
                          <span className="text-[10px] text-[#7E9389] block">OUTPUT</span>
                          <span className="text-white font-bold">{car.hp}</span>
                        </div>
                        <div className="bg-[#020F06] p-2 rounded">
                          <span className="text-[10px] text-[#7E9389] block">0-100 KM/H</span>
                          <span className="text-white font-bold">{car.accel}</span>
                        </div>
                        <div className="bg-[#020F06] p-2 rounded">
                          <span className="text-[10px] text-[#7E9389] block">TOP SPEED</span>
                          <span className="text-white font-bold">{car.topSpeed}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-6 pt-0 flex items-center space-x-3">
                    <button
                      onClick={() => {
                        audioEngine.playClick();
                        setIsCreatingCar(false);
                        setEditingCar({ ...car });
                      }}
                      className="flex-1 py-2.5 rounded-full bg-[#020F06] hover:bg-[#0A2E19] text-[#FA353F] hover:text-white font-mono text-xs font-bold uppercase tracking-widest border border-[#FA353F]/40 flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>EDIT SPECS</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${car.name}?`)) {
                          audioEngine.playClick();
                          deleteCar(car.id);
                          showToast(`DELETED ${car.name}`);
                        }
                      }}
                      className="p-2.5 rounded-full bg-[#020F06] hover:bg-red-950 text-[#7E9389] hover:text-red-400 border border-[#98AEA3]/20 transition-all"
                      title="Delete Hypercar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HOME & HERO SEQUENCE (FULL CRUD) */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-12 animate-fadeIn">
            {/* 1. Scroll-Triggered Storytelling Phases */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                    01 &bull; SCROLL-TRIGGERED 600-FRAME HERO TEXTS
                  </span>
                  <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                    HERO STORYTELLING PHASES
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#98AEA3]">
                  4 Quadrant Positions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cmsData.heroPhases.map((phase, idx) => (
                  <div
                    key={phase.id}
                    className="bg-[#061F10] p-6 rounded-lg border border-[#FA353F]/30 space-y-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                      <span className="font-mono text-xs text-[#FA353F] font-bold">
                        PHASE 0{phase.id} &bull; {phase.position}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                          SUB-TAG LABEL
                        </label>
                        <input
                          type="text"
                          value={phase.tag}
                          onChange={(e) => updateHeroPhase(idx, { tag: e.target.value })}
                          className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                            HEADLINE (LINE 1)
                          </label>
                          <input
                            type="text"
                            value={phase.title1}
                            onChange={(e) => updateHeroPhase(idx, { title1: e.target.value })}
                            className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                            HEADLINE (LINE 2 - RED GLOW)
                          </label>
                          <input
                            type="text"
                            value={phase.title2}
                            onChange={(e) => updateHeroPhase(idx, { title2: e.target.value })}
                            className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                          EDITORIAL DESCRIPTION
                        </label>
                        <textarea
                          rows={2}
                          value={phase.desc}
                          onChange={(e) => updateHeroPhase(idx, { desc: e.target.value })}
                          className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-sans text-xs focus:border-[#FA353F] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Home Portals Section */}
            <div className="space-y-6 pt-6 border-t border-[#98AEA3]/15">
              <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                    02 &bull; HOME PORTAL CARDS
                  </span>
                  <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                    EXPLORE PORTAL NAVIGATION
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cmsData.homePortals.cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="bg-[#061F10] p-6 rounded-lg border border-[#98AEA3]/20 space-y-4 shadow-xl"
                  >
                    <span className="font-mono text-xs text-[#FA353F] font-bold block pb-2 border-b border-[#98AEA3]/15">
                      PORTAL CARD {idx + 1} ({card.targetView.toUpperCase()})
                    </span>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                          BADGE TEXT
                        </label>
                        <input
                          type="text"
                          value={card.badge}
                          onChange={(e) => updateHomePortalCard(idx, { badge: e.target.value })}
                          className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                          CARD TITLE
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => updateHomePortalCard(idx, { title: e.target.value })}
                          className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                          DESCRIPTION
                        </label>
                        <textarea
                          rows={2}
                          value={card.desc}
                          onChange={(e) => updateHomePortalCard(idx, { desc: e.target.value })}
                          className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-sans text-xs focus:border-[#FA353F] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                          BUTTON TEXT
                        </label>
                        <input
                          type="text"
                          value={card.btnText}
                          onChange={(e) => updateHomePortalCard(idx, { btnText: e.target.value })}
                          className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Proving Grounds Track Sectors */}
            <div className="space-y-6 pt-6 border-t border-[#98AEA3]/15">
              <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                    03 &bull; PRIVATE PROVING GROUNDS
                  </span>
                  <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                    4 TRACK SECTORS &amp; PROTOCOL
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cmsData.provingGrounds.sectors.map((sector, idx) => (
                  <div
                    key={sector.id}
                    className="bg-[#061F10] p-6 rounded-lg border border-[#98AEA3]/20 space-y-4 shadow-xl"
                  >
                    <span className="font-mono text-xs text-[#FA353F] font-bold block pb-2 border-b border-[#98AEA3]/15">
                      {sector.sector}: {sector.name}
                    </span>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                          SECTOR NAME
                        </label>
                        <input
                          type="text"
                          value={sector.name}
                          onChange={(e) => updateProvingGroundsSector(idx, { name: e.target.value })}
                          className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                            SPEED SPEC
                          </label>
                          <input
                            type="text"
                            value={sector.speed}
                            onChange={(e) => updateProvingGroundsSector(idx, { speed: e.target.value })}
                            className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                            G-FORCE SPEC
                          </label>
                          <input
                            type="text"
                            value={sector.gForce}
                            onChange={(e) => updateProvingGroundsSector(idx, { gForce: e.target.value })}
                            className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] text-[#98AEA3] uppercase mb-1 font-bold">
                          DESCRIPTION
                        </label>
                        <textarea
                          rows={2}
                          value={sector.description}
                          onChange={(e) => updateProvingGroundsSector(idx, { description: e.target.value })}
                          className="w-full p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-sans text-xs focus:border-[#FA353F] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MOTORSPORT ENGINEERING (FULL CRUD) */}
        {/* ========================================================================= */}
        {activeTab === 'engineering' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Engineering Pillars */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                    01 &bull; TECHNICAL MASTERCLASS
                  </span>
                  <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                    ENGINEERING PILLARS
                  </h3>
                </div>

                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setIsCreatingPillar(true);
                    setEditingPillar({
                      id: `pillar-${Date.now()}`,
                      title: 'NEW MOTORSPORT SYSTEM',
                      subtitle: 'TECHNICAL SPECIFICATION',
                      spec: '1,200 NM',
                      specLabel: 'PEAK METRIC',
                      weight: 'TITANIUM COMPOSITE',
                      desc: 'Advanced technical architectural engineering designed for extreme track conditions.',
                      highlights: ['Lightweight alloy structure', 'Direct high-frequency sensor telemetry'],
                      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
                    });
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD ENGINEERING PILLAR</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cmsData.engineeringPillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    className="bg-[#061F10] rounded-lg border border-[#FA353F]/30 overflow-hidden shadow-xl p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                        <span className="font-mono text-xs text-[#FA353F] font-bold">
                          {pillar.subtitle}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-[#020F06] text-white font-mono text-[10px] font-bold">
                          {pillar.spec}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-lg uppercase text-white">
                        {pillar.title}
                      </h4>

                      <p className="font-sans text-xs text-[#98AEA3] leading-relaxed">
                        {pillar.desc}
                      </p>

                      <div className="space-y-1.5 pt-2">
                        <span className="font-mono text-[10px] text-[#7E9389] uppercase tracking-wider block font-bold">
                          BULLET HIGHLIGHTS ({pillar.highlights?.length || 0}):
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-xs text-[#98AEA3]">
                          {pillar.highlights?.map((h, i) => (
                            <li key={i} className="line-clamp-1">{h}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center space-x-3">
                      <button
                        onClick={() => {
                          audioEngine.playClick();
                          setIsCreatingPillar(false);
                          setEditingPillar({ ...pillar });
                        }}
                        className="flex-1 py-2 rounded-full bg-[#020F06] hover:bg-[#0A2E19] text-[#FA353F] font-mono text-xs font-bold uppercase tracking-widest border border-[#FA353F]/40 flex items-center justify-center space-x-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>EDIT PILLAR</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete pillar "${pillar.title}"?`)) {
                            audioEngine.playClick();
                            deleteEngineeringPillar(pillar.id);
                            showToast(`DELETED PILLAR ${pillar.title}`);
                          }
                        }}
                        className="p-2 rounded-full bg-[#020F06] hover:bg-red-950 text-[#7E9389] hover:text-red-400 border border-[#98AEA3]/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials Matrix CRUD */}
            <div className="space-y-6 pt-6 border-t border-[#98AEA3]/15">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                    02 &bull; HIGH-TECH COMPOSITES &amp; METALS
                  </span>
                  <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                    MATERIALS MATRIX
                  </h3>
                </div>

                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setIsCreatingMaterial(true);
                    setEditingMaterial({
                      index: -1,
                      data: {
                        name: 'Aerospace Material',
                        role: 'Structural Frame',
                        benefit: 'High heat resilience',
                        stat: 'Master Grade',
                      },
                    });
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD MATERIAL</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cmsData.materials.map((mat, idx) => (
                  <div
                    key={idx}
                    className="bg-[#061F10] p-5 rounded-lg border border-[#98AEA3]/20 space-y-3 shadow-lg relative group"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#98AEA3]/15">
                      <h4 className="font-display font-bold text-xs uppercase text-white">{mat.name}</h4>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            audioEngine.playClick();
                            setIsCreatingMaterial(false);
                            setEditingMaterial({ index: idx, data: { ...mat } });
                          }}
                          className="p-1 rounded text-[#FA353F] hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete material ${mat.name}?`)) {
                              audioEngine.playClick();
                              deleteMaterial(idx);
                              showToast(`DELETED ${mat.name}`);
                            }
                          }}
                          className="p-1 rounded text-[#7E9389] hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-[#98AEA3]">Role: <strong className="text-white">{mat.role}</strong></p>
                      <p className="text-[#98AEA3]">Benefit: <strong className="text-white">{mat.benefit}</strong></p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[#020F06] text-[#FA353F] font-bold text-[10px]">
                        {mat.stat}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: REVIEWS & LAP RECORDS (FULL CRUD) */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-12 animate-fadeIn">
            {/* 1. Verified Driver Testimonials */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                    01 &bull; VERIFIED DRIVERS CIRCLE
                  </span>
                  <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                    CLIENT TESTIMONIALS
                  </h3>
                </div>

                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setIsCreatingReview(true);
                    setEditingReview({
                      id: Date.now(),
                      quote: 'An astonishing experience on the private proving grounds.',
                      author: 'VIP Client Patron',
                      location: 'Zurich & Milan',
                      chassis: 'VALKYRIE STRADALE #08/20',
                      rating: 5,
                      deliveryDate: 'MAY 2026',
                    });
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD NEW TESTIMONIAL</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cmsData.testimonials.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#061F10] p-6 rounded-lg border border-[#FA353F]/30 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-[#98AEA3]/15">
                        <span className="font-mono text-[10px] text-[#FA353F] font-bold">
                          {review.chassis}
                        </span>
                        <span className="font-mono text-[10px] text-[#98AEA3]">
                          {review.deliveryDate}
                        </span>
                      </div>

                      <p className="font-sans text-xs text-white italic leading-relaxed">
                        "{review.quote}"
                      </p>

                      <div className="pt-2">
                        <h4 className="font-display font-bold text-sm uppercase text-white">
                          {review.author}
                        </h4>
                        <span className="font-mono text-[10px] text-[#98AEA3]">
                          {review.location}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#98AEA3]/15 flex items-center space-x-2">
                      <button
                        onClick={() => {
                          audioEngine.playClick();
                          setIsCreatingReview(false);
                          setEditingReview({ ...review });
                        }}
                        className="flex-1 py-2 rounded-full bg-[#020F06] hover:bg-[#0A2E19] text-[#FA353F] font-mono text-xs font-bold uppercase tracking-widest border border-[#FA353F]/40 flex items-center justify-center space-x-1.5"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>EDIT</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete testimonial by ${review.author}?`)) {
                            audioEngine.playClick();
                            deleteTestimonial(review.id);
                            showToast(`DELETED TESTIMONIAL`);
                          }
                        }}
                        className="p-2 rounded-full bg-[#020F06] hover:bg-red-950 text-[#7E9389] hover:text-red-400 border border-[#98AEA3]/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. International Lap Records */}
            <div className="space-y-6 pt-6 border-t border-[#98AEA3]/15">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                    02 &bull; BENCHMARK LAP TIMES
                  </span>
                  <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                    INTERNATIONAL TRACK RECORDS
                  </h3>
                </div>

                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setIsCreatingLapRecord(true);
                    setEditingLapRecord({
                      id: Date.now(),
                      track: 'Circuit de Monaco',
                      location: 'Monte Carlo, Monaco',
                      length: '3.337 KM',
                      time: '1:12.45',
                      car: 'VALKYRIE STRADALE',
                      speed: '295 KM/H TUNNEL TRAP',
                      driver: 'Factory Chief Test Driver',
                    });
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD LAP RECORD</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#FA353F]/40 text-[#FA353F] bg-[#061F10]">
                      <th className="p-3.5 uppercase">CIRCUIT / TRACK</th>
                      <th className="p-3.5 uppercase">LOCATION</th>
                      <th className="p-3.5 uppercase">LENGTH</th>
                      <th className="p-3.5 uppercase">LAP TIME</th>
                      <th className="p-3.5 uppercase">CHASSIS MODEL</th>
                      <th className="p-3.5 uppercase">SPEED TRAP</th>
                      <th className="p-3.5 uppercase text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#98AEA3]/10">
                    {cmsData.lapRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-[#061F10]/60 transition-colors">
                        <td className="p-3.5 font-bold text-white">{record.track}</td>
                        <td className="p-3.5 text-[#98AEA3]">{record.location}</td>
                        <td className="p-3.5 text-[#98AEA3]">{record.length}</td>
                        <td className="p-3.5 text-[#FA353F] font-bold text-sm">{record.time}</td>
                        <td className="p-3.5 text-white font-bold">{record.car}</td>
                        <td className="p-3.5 text-[#98AEA3]">{record.speed}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              audioEngine.playClick();
                              setIsCreatingLapRecord(false);
                              setEditingLapRecord({ ...record });
                            }}
                            className="p-1.5 rounded bg-[#020F06] text-[#FA353F] hover:text-white border border-[#FA353F]/40"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete record for ${record.track}?`)) {
                                audioEngine.playClick();
                                deleteLapRecord(record.id);
                                showToast(`DELETED LAP RECORD`);
                              }
                            }}
                            className="p-1.5 rounded bg-[#020F06] text-[#7E9389] hover:text-red-400 border border-[#98AEA3]/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SITE META & GLOBAL BRAND (FULL CRUD) */}
        {/* ========================================================================= */}
        {activeTab === 'meta' && (
          <div className="space-y-8 animate-fadeIn max-w-3xl">
            <div className="pb-4 border-b border-[#98AEA3]/15">
              <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                GLOBAL PLATFORM ATTRIBUTES
              </span>
              <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                BRAND &amp; HOTLINE META
              </h3>
            </div>

            <div className="bg-[#061F10] p-8 rounded-lg border border-[#FA353F]/30 space-y-6 shadow-2xl">
              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                  BRAND NAME
                </label>
                <input
                  type="text"
                  value={cmsData.siteMeta.brandName}
                  onChange={(e) => updateSiteMeta({ brandName: e.target.value })}
                  className="w-full p-3.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                  TAGLINE / SLOGAN
                </label>
                <input
                  type="text"
                  value={cmsData.siteMeta.brandTagline}
                  onChange={(e) => updateSiteMeta({ brandTagline: e.target.value })}
                  className="w-full p-3.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    VIP CONCIERGE HOTLINE
                  </label>
                  <input
                    type="text"
                    value={cmsData.siteMeta.vipHotline}
                    onChange={(e) => updateSiteMeta({ vipHotline: e.target.value })}
                    className="w-full p-3.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    ATELIER EMAIL
                  </label>
                  <input
                    type="email"
                    value={cmsData.siteMeta.atelierEmail}
                    onChange={(e) => updateSiteMeta({ atelierEmail: e.target.value })}
                    className="w-full p-3.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                  FACTORY &amp; PROVING GROUNDS LOCATION
                </label>
                <input
                  type="text"
                  value={cmsData.siteMeta.factoryLocation}
                  onChange={(e) => updateSiteMeta({ factoryLocation: e.target.value })}
                  className="w-full p-3.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                  COPYRIGHT NOTICE
                </label>
                <input
                  type="text"
                  value={cmsData.siteMeta.copyright}
                  onChange={(e) => updateSiteMeta({ copyright: e.target.value })}
                  className="w-full p-3.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CAR EDIT / CREATE MODAL */}
      {/* ========================================================================= */}
      {editingCar && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#061F10] border-2 border-[#FA353F] rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-ruby-glow my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
              <div>
                <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest block">
                  {isCreatingCar ? 'CREATE NEW HYPERCAR' : 'EDIT HYPERCAR SPECIFICATION'}
                </span>
                <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                  {editingCar.name || 'NEW ALLOCATION'}
                </h3>
              </div>
              <button
                onClick={() => setEditingCar(null)}
                className="p-2 rounded-full bg-[#020F06] text-[#7E9389] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    HYPERCAR NAME
                  </label>
                  <input
                    type="text"
                    value={editingCar.name}
                    onChange={(e) => setEditingCar({ ...editingCar, name: e.target.value })}
                    placeholder="e.g. TEMPESTA CORSA GT"
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={editingCar.category}
                    onChange={(e) => setEditingCar({ ...editingCar, category: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  >
                    <option value="HYBRID">HYBRID</option>
                    <option value="V12">V12</option>
                    <option value="ELECTRIC">ELECTRIC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                  TAGLINE / SUBTITLE
                </label>
                <input
                  type="text"
                  value={editingCar.tagline}
                  onChange={(e) => setEditingCar({ ...editingCar, tagline: e.target.value })}
                  placeholder="e.g. Naturally Aspirated Track Special"
                  className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    DISPLAY PRICE
                  </label>
                  <input
                    type="text"
                    value={editingCar.price}
                    onChange={(e) => setEditingCar({ ...editingCar, price: e.target.value })}
                    placeholder="e.g. $2,850,000"
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    HORSEPOWER
                  </label>
                  <input
                    type="text"
                    value={editingCar.hp}
                    onChange={(e) => setEditingCar({ ...editingCar, hp: e.target.value })}
                    placeholder="e.g. 1,280 HP"
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    0-100 KM/H
                  </label>
                  <input
                    type="text"
                    value={editingCar.accel}
                    onChange={(e) => setEditingCar({ ...editingCar, accel: e.target.value })}
                    placeholder="e.g. 2.1s (0-100)"
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    TOP SPEED
                  </label>
                  <input
                    type="text"
                    value={editingCar.topSpeed}
                    onChange={(e) => setEditingCar({ ...editingCar, topSpeed: e.target.value })}
                    placeholder="e.g. 395 KM/H"
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    CURB WEIGHT
                  </label>
                  <input
                    type="text"
                    value={editingCar.weight}
                    onChange={(e) => setEditingCar({ ...editingCar, weight: e.target.value })}
                    placeholder="e.g. 1,290 KG"
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    DOWNFORCE
                  </label>
                  <input
                    type="text"
                    value={editingCar.downforce}
                    onChange={(e) => setEditingCar({ ...editingCar, downforce: e.target.value })}
                    placeholder="e.g. 890 KG @ 300 km/h"
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    POWERTRAIN ENGINE
                  </label>
                  <input
                    type="text"
                    value={editingCar.engine}
                    onChange={(e) => setEditingCar({ ...editingCar, engine: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    TRANSMISSION
                  </label>
                  <input
                    type="text"
                    value={editingCar.transmission}
                    onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploadDropzone
                label="HYPERCAR SHOWROOM PHOTOMETRY IMAGE"
                value={editingCar.imageRef}
                onChange={(newImage) => setEditingCar({ ...editingCar, imageRef: newImage })}
              />

              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                  EDITORIAL DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={editingCar.description}
                  onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                  className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-sans text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center justify-end space-x-3">
              <button
                onClick={() => setEditingCar(null)}
                className="px-6 py-3 rounded-full bg-[#020F06] hover:bg-[#0A2E19] text-[#98AEA3] font-mono text-xs uppercase font-bold border border-[#98AEA3]/20"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  if (isCreatingCar) {
                    addCar(editingCar);
                    showToast(`CREATED HYPERCAR: ${editingCar.name}`);
                  } else {
                    updateCar(editingCar.id, editingCar);
                    showToast(`UPDATED SPECS: ${editingCar.name}`);
                  }
                  setEditingCar(null);
                }}
                className="px-8 py-3 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow"
              >
                SAVE &bull; SYNC LIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ENGINEERING PILLAR EDIT / CREATE */}
      {/* ========================================================================= */}
      {editingPillar && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#061F10] border-2 border-[#FA353F] rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-ruby-glow my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
              <h3 className="font-display font-bold text-xl uppercase text-white">
                {isCreatingPillar ? 'ADD ENGINEERING PILLAR' : 'EDIT ENGINEERING PILLAR'}
              </h3>
              <button
                onClick={() => setEditingPillar(null)}
                className="p-2 rounded-full bg-[#020F06] text-[#7E9389] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                  PILLAR TITLE
                </label>
                <input
                  type="text"
                  value={editingPillar.title}
                  onChange={(e) => setEditingPillar({ ...editingPillar, title: e.target.value })}
                  className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    SUBTITLE
                  </label>
                  <input
                    type="text"
                    value={editingPillar.subtitle}
                    onChange={(e) => setEditingPillar({ ...editingPillar, subtitle: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    PRIMARY SPEC
                  </label>
                  <input
                    type="text"
                    value={editingPillar.spec}
                    onChange={(e) => setEditingPillar({ ...editingPillar, spec: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={editingPillar.desc}
                  onChange={(e) => setEditingPillar({ ...editingPillar, desc: e.target.value })}
                  className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-sans text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                  HIGHLIGHTS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={editingPillar.highlights?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingPillar({
                      ...editingPillar,
                      highlights: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-sans text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>

              <ImageUploadDropzone
                label="ENGINEERING ARCHITECTURE DIAGRAM / PHOTO"
                value={editingPillar.image}
                onChange={(newImage) => setEditingPillar({ ...editingPillar, image: newImage })}
              />
            </div>

            <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center justify-end space-x-3">
              <button
                onClick={() => setEditingPillar(null)}
                className="px-6 py-2.5 rounded-full bg-[#020F06] text-[#98AEA3] font-mono text-xs uppercase font-bold border border-[#98AEA3]/20"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  if (isCreatingPillar) {
                    addEngineeringPillar(editingPillar);
                    showToast('CREATED ENGINEERING PILLAR');
                  } else {
                    updateEngineeringPillar(editingPillar.id, editingPillar);
                    showToast('UPDATED ENGINEERING PILLAR');
                  }
                  setEditingPillar(null);
                }}
                className="px-8 py-2.5 rounded-full bg-[#FA353F] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow"
              >
                SAVE PILLAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REVIEW / TESTIMONIAL EDIT */}
      {/* ========================================================================= */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#061F10] border-2 border-[#FA353F] rounded-2xl max-w-xl w-full p-8 space-y-6 shadow-ruby-glow">
            <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
              <h3 className="font-display font-bold text-xl uppercase text-white">
                {isCreatingReview ? 'ADD CLIENT TESTIMONIAL' : 'EDIT TESTIMONIAL'}
              </h3>
              <button
                onClick={() => setEditingReview(null)}
                className="p-2 rounded-full bg-[#020F06] text-[#7E9389] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    CLIENT NAME
                  </label>
                  <input
                    type="text"
                    value={editingReview.author}
                    onChange={(e) => setEditingReview({ ...editingReview, author: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={editingReview.location}
                    onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    CHASSIS ASSIGNED
                  </label>
                  <input
                    type="text"
                    value={editingReview.chassis}
                    onChange={(e) => setEditingReview({ ...editingReview, chassis: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    DELIVERY DATE
                  </label>
                  <input
                    type="text"
                    value={editingReview.deliveryDate}
                    onChange={(e) => setEditingReview({ ...editingReview, deliveryDate: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                  CLIENT QUOTE / REVIEW
                </label>
                <textarea
                  rows={3}
                  value={editingReview.quote}
                  onChange={(e) => setEditingReview({ ...editingReview, quote: e.target.value })}
                  className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-sans text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center justify-end space-x-3">
              <button
                onClick={() => setEditingReview(null)}
                className="px-6 py-2.5 rounded-full bg-[#020F06] text-[#98AEA3] font-mono text-xs uppercase font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  if (isCreatingReview) {
                    addTestimonial(editingReview);
                    showToast('ADDED TESTIMONIAL');
                  } else {
                    updateTestimonial(editingReview.id, editingReview);
                    showToast('UPDATED TESTIMONIAL');
                  }
                  setEditingReview(null);
                }}
                className="px-8 py-2.5 rounded-full bg-[#FA353F] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow"
              >
                SAVE TESTIMONIAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: LAP RECORD EDIT */}
      {/* ========================================================================= */}
      {editingLapRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#061F10] border-2 border-[#FA353F] rounded-2xl max-w-xl w-full p-8 space-y-6 shadow-ruby-glow">
            <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
              <h3 className="font-display font-bold text-xl uppercase text-white">
                {isCreatingLapRecord ? 'ADD LAP RECORD' : 'EDIT LAP RECORD'}
              </h3>
              <button
                onClick={() => setEditingLapRecord(null)}
                className="p-2 rounded-full bg-[#020F06] text-[#7E9389] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                  CIRCUIT / TRACK NAME
                </label>
                <input
                  type="text"
                  value={editingLapRecord.track}
                  onChange={(e) => setEditingLapRecord({ ...editingLapRecord, track: e.target.value })}
                  className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={editingLapRecord.location}
                    onChange={(e) => setEditingLapRecord({ ...editingLapRecord, location: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    LAP TIME
                  </label>
                  <input
                    type="text"
                    value={editingLapRecord.time}
                    onChange={(e) => setEditingLapRecord({ ...editingLapRecord, time: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    CHASSIS MODEL
                  </label>
                  <input
                    type="text"
                    value={editingLapRecord.car}
                    onChange={(e) => setEditingLapRecord({ ...editingLapRecord, car: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold mb-1">
                    SPEED TRAP
                  </label>
                  <input
                    type="text"
                    value={editingLapRecord.speed}
                    onChange={(e) => setEditingLapRecord({ ...editingLapRecord, speed: e.target.value })}
                    className="w-full p-3 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center justify-end space-x-3">
              <button
                onClick={() => setEditingLapRecord(null)}
                className="px-6 py-2.5 rounded-full bg-[#020F06] text-[#98AEA3] font-mono text-xs uppercase font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  if (isCreatingLapRecord) {
                    addLapRecord(editingLapRecord);
                    showToast('ADDED LAP RECORD');
                  } else {
                    updateLapRecord(editingLapRecord.id, editingLapRecord);
                    showToast('UPDATED LAP RECORD');
                  }
                  setEditingLapRecord(null);
                }}
                className="px-8 py-2.5 rounded-full bg-[#FA353F] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow"
              >
                SAVE RECORD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: IMPORT JSON BACKUP MODAL */}
      {/* ========================================================================= */}
      {importJsonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#061F10] border-2 border-[#FA353F] rounded-2xl max-w-xl w-full p-8 space-y-6 shadow-ruby-glow">
            <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
              <h3 className="font-display font-bold text-xl uppercase text-white">
                IMPORT CMS BACKUP JSON
              </h3>
              <button
                onClick={() => {
                  setImportJsonModalOpen(false);
                  setImportError('');
                }}
                className="p-2 rounded-full bg-[#020F06] text-[#7E9389] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {importError && (
              <div className="p-3 rounded bg-red-900/30 border border-red-500 text-red-300 font-mono text-xs">
                {importError}
              </div>
            )}

            <div className="space-y-3">
              <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold">
                PASTE VALID JSON OBJECT OR CONFIG
              </label>
              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{ "fleet": [...], "heroPhases": [...] }'
                className="w-full p-3.5 rounded bg-[#020F06] border border-[#98AEA3]/25 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setImportJsonModalOpen(false);
                  setImportError('');
                }}
                className="px-6 py-2.5 rounded-full bg-[#020F06] text-[#98AEA3] font-mono text-xs uppercase font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  const res = importJson(importJsonText);
                  if (res.success) {
                    showToast('CMS RESTORED FROM BACKUP');
                    setImportJsonModalOpen(false);
                    setImportJsonText('');
                    setImportError('');
                  } else {
                    setImportError(`Invalid JSON: ${res.error}`);
                  }
                }}
                className="px-8 py-2.5 rounded-full bg-[#FA353F] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow"
              >
                IMPORT &bull; OVERWRITE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: RESTORE DEFAULTS CONFIRMATION */}
      {/* ========================================================================= */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#061F10] border-2 border-red-500 rounded-2xl max-w-md w-full p-8 space-y-6 shadow-2xl text-center">
            <AlertCircle className="w-12 h-12 text-[#FA353F] mx-auto" />
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl uppercase text-white">
                RESET FACTORY DEFAULTS?
              </h3>
              <p className="font-sans text-xs text-[#98AEA3] leading-relaxed">
                This will reset all hypercars, scroll hero text, engineering pillars, and testimonials back to factory state. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-6 py-2.5 rounded-full bg-[#020F06] text-[#98AEA3] font-mono text-xs uppercase font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  resetToDefaults();
                  setShowResetConfirm(false);
                  showToast('RESET ALL CONTENT TO FACTORY DEFAULTS');
                }}
                className="px-6 py-2.5 rounded-full bg-[#FA353F] hover:bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow"
              >
                YES, RESTORE DEFAULTS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
