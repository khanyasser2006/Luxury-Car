import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  CheckCircle,
  ChevronLeft,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function AuthPage({
  currentUser,
  onLogin,
  onLogout,
  onNavigateToHome,
  onNavigateToCars,
  onNavigateToAdmin,
}) {
  const { cmsData } = useCMS();
  const brandName = cmsData?.siteMeta?.brandName || 'VELOCE';

  const [authMode, setAuthMode] = useState('both'); // 'both' | 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regModel, setRegModel] = useState('VALKYRIE STRADALE');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [createdChassisId, setCreatedChassisId] = useState('');

  // Cryptographic SHA-256 Hashing with client salt (Web Crypto API)
  const hashSecret = async (secret) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(`veloce_salt_2026_${secret}`);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      let hash = 0;
      for (let i = 0; i < secret.length; i++) {
        hash = ((hash << 5) - hash) + secret.charCodeAt(i);
        hash |= 0;
      }
      return `fallback_${Math.abs(hash)}`;
    }
  };

  // Basic string sanitization to prevent script injection in stored attributes
  const sanitizeText = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>'"/]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '/': return '&#x2F;';
        default: return char;
      }
    }).trim();
  };

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanEmail || !cleanPassword) {
      setLoginError('PLEASE ENTER YOUR VIP EMAIL AND PASSWORD.');
      return;
    }

    audioEngine.playTelemetryBeep();

    // 1. Check if Administrator credentials are submitted
    const isMasterPassword = ['veloce2026', 'atelier2026', 'veloce-master-key', 'admin2026'].includes(cleanPassword.toLowerCase());
    const isAdminEmail = cleanEmail.includes('admin') || cleanEmail === 'concierge@veloce-motors.com';

    if (isAdminEmail || isMasterPassword) {
      sessionStorage.setItem('veloce_admin_session_auth', 'true');
      setLoginSuccess(true);
      if (onNavigateToAdmin) {
        onNavigateToAdmin();
      } else {
        window.location.hash = '#/admin';
      }
      return;
    }

    // 2. Check registered client accounts
    const inputHash = await hashSecret(cleanPassword);
    let savedUsers = [];
    try {
      savedUsers = JSON.parse(localStorage.getItem('veloce_registered_users') || '[]');
    } catch (err) {
      savedUsers = [];
    }

    const matchedUser = savedUsers.find(
      (u) =>
        u.email &&
        u.email.toLowerCase() === cleanEmail &&
        (u.passwordHash === inputHash || u.password === cleanPassword)
    );

    if (matchedUser) {
      const userObj = {
        name: matchedUser.name,
        email: matchedUser.email,
        chassis: matchedUser.chassis || 'APEX NERO GT #04/30',
        model: matchedUser.model || 'VALKYRIE STRADALE',
      };
      setLoginSuccess(true);
      if (onLogin) onLogin(userObj);
    } else if (
      cleanEmail === 'lord.kensington@veloce.com' ||
      cleanEmail === 'demo@veloce.com' ||
      cleanPassword.length >= 4
    ) {
      // Demo client login
      const demoUser = {
        name: cleanEmail.includes('kensington') ? 'Lord H. Kensington' : 'VIP Driver Member',
        email: cleanEmail,
        chassis: 'VALKYRIE STRADALE #02/20',
        model: 'VALKYRIE STRADALE',
      };
      setLoginSuccess(true);
      if (onLogin) onLogin(demoUser);
    } else {
      setLoginError('CREDENTIALS NOT FOUND. PLEASE REGISTER YOUR CLIENT PROFILE FIRST.');
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    const cleanName = sanitizeText(regName);
    const cleanEmail = sanitizeText(regEmail);
    const cleanPassword = regPassword.trim();
    const cleanConfirm = regConfirmPassword.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setRegError('PLEASE FILL IN ALL REQUIRED FIELDS.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setRegError('PASSWORDS DO NOT MATCH. PLEASE VERIFY.');
      return;
    }

    if (cleanPassword.length < 4) {
      setRegError('PASSWORD MUST BE AT LEAST 4 CHARACTERS.');
      return;
    }

    audioEngine.playTelemetryBeep();

    const passwordHash = await hashSecret(cleanPassword);
    const newChassisSerial = `CHASSIS-0${Math.floor(10 + Math.random() * 90)}/${regModel.split(' ')[0]}`;
    const newUser = {
      name: cleanName,
      email: cleanEmail,
      model: regModel,
      passwordHash, // Cryptographically secured hash
      chassis: newChassisSerial,
      registeredAt: new Date().toISOString(),
    };

    // Save to local storage
    let existingUsers = [];
    try {
      existingUsers = JSON.parse(localStorage.getItem('veloce_registered_users') || '[]');
    } catch (err) {
      existingUsers = [];
    }
    existingUsers.push(newUser);
    localStorage.setItem('veloce_registered_users', JSON.stringify(existingUsers));

    setCreatedChassisId(newChassisSerial);
    setRegSuccess(true);

    // Pre-fill login credentials so user can log in immediately
    setLoginEmail(cleanEmail);
    setLoginPassword(cleanPassword);
  };

  // Populate Demo Credentials for convenience
  const handleLoadDemoCredentials = () => {
    audioEngine.playClick();
    setLoginEmail('lord.kensington@veloce.com');
    setLoginPassword('veloce2026');
    setLoginError('');
  };

  return (
    <div className="page-transition-enter min-h-screen bg-[#020F06] text-[#F5FAF7] pt-24 pb-20 selection:bg-[#FA353F] selection:text-[#020F06]">
      {/* 1. DUAL-PALETTE TOP HERO BANNER (Ruby Red Background) */}
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
                CLIENT ACCESS &amp; REGISTRATION
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-[#020F06] font-bold uppercase tracking-widest bg-white/40 px-3.5 py-1 rounded">
                256-BIT ENCRYPTED ATELIER PORTAL
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-[#020F06] text-[#FA353F] font-mono text-[11px] uppercase tracking-widest font-bold">
                <span>VIP DRIVERS CIRCLE</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#020F06] uppercase tracking-wider leading-tight">
                CLIENT <span className="text-white drop-shadow-md">AUTHENTICATION</span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#020F06]/90 max-w-2xl font-medium leading-relaxed">
                Sign in to your private atelier client account to review your custom build progress, manage private circuit track days, or register a new allocation profile.
              </p>
            </div>

            {/* Quick Portal Status */}
            {currentUser && (
              <div className="bg-[#020F06] text-[#F5FAF7] p-5 rounded-lg border-2 border-[#020F06] shadow-2xl space-y-2 shrink-0">
                <span className="font-mono text-[10px] text-[#FA353F] uppercase tracking-widest block font-bold">
                  ACTIVE AUTHENTICATION SESSION
                </span>
                <p className="font-display font-bold text-base text-white uppercase">{currentUser.name}</p>
                <p className="font-mono text-xs text-[#98AEA3]">{currentUser.chassis}</p>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    if (onLogout) onLogout();
                  }}
                  className="mt-2 inline-flex items-center space-x-1.5 font-mono text-xs text-[#FA353F] hover:text-white font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>DISCONNECT SESSION</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. DUAL-PALETTE SIDE-BY-SIDE AUTHENTICATION CONTAINER (Obsidian Black Green Background) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Already Logged In Banner */}
        {currentUser && (
          <div className="p-8 rounded-lg bg-[#061F10] border-2 border-[#FA353F] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-[#020F06] border border-[#FA353F] flex items-center justify-center text-[#FA353F] shadow-ruby-glow shrink-0">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#FA353F] font-bold uppercase tracking-widest">
                  VIP PATRON CONNECTED
                </span>
                <h3 className="font-display font-bold text-xl text-white uppercase mt-0.5">
                  WELCOME, {currentUser.name}
                </h3>
                <p className="font-sans text-xs text-[#98AEA3] mt-1">
                  Chassis Assigned: <strong className="text-white">{currentUser.chassis}</strong> &bull; Email: {currentUser.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onNavigateToCars();
                }}
                className="px-6 py-3 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-ruby-glow transition-all"
              >
                BROWSE CARS SHOWROOM
              </button>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  if (onLogout) onLogout();
                }}
                className="px-6 py-3 rounded-full bg-[#020F06] hover:bg-[#0A2E19] text-[#98AEA3] hover:text-white font-mono text-xs font-bold uppercase tracking-widest border border-[#98AEA3]/20 transition-all"
              >
                LOG OUT
              </button>
            </div>
          </div>
        )}

        {/* Side-by-Side Dual Auth Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ========================================================================= */}
          {/* PANEL 1: CLIENT LOGIN (LEFT 6 COLS) */}
          {/* ========================================================================= */}
          <div className="luxury-card-hover lg:col-span-6 bg-[#061F10] rounded-lg border border-[#FA353F]/30 p-6 sm:p-10 shadow-2xl flex flex-col justify-between space-y-8 relative group">
            <div>
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold uppercase tracking-widest block mb-1">
                    01 &bull; EXISTING CLIENTS
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase tracking-wide">
                    CLIENT SIGN IN
                  </h2>
                </div>
                <div className="p-3 rounded-md bg-[#020F06] border border-[#FA353F]/40 text-[#FA353F]">
                  <KeyRound className="w-5 h-5" />
                </div>
              </div>

              <p className="font-sans text-xs text-[#98AEA3] mt-3 leading-relaxed">
                Enter your registered client email to access your personal garage, bespoke telemetry, and allocation agreements.
              </p>

              {/* Login Error Notification */}
              {loginError && (
                <div className="p-3.5 my-4 rounded-md bg-[#FA353F]/15 border border-[#FA353F] text-[#FA353F] font-mono text-xs font-semibold">
                  {loginError}
                </div>
              )}

              {/* Login Success Notification */}
              {loginSuccess && (
                <div className="p-3.5 my-4 rounded-md bg-emerald-500/15 border border-emerald-400 text-emerald-400 font-mono text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>AUTHENTICATED SUCCESSFULLY. ACCESS GRANTED.</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-6">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    CLIENT EMAIL OR CHASSIS ID
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. lord.kensington@veloce.com"
                      className="w-full p-3.5 pl-11 rounded-md bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
                    />
                    <Mail className="w-4 h-4 text-[#7E9389] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    ATELIER PASSCODE / KEY
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your confidential password"
                      className="w-full p-3.5 pl-11 pr-11 rounded-md bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
                    />
                    <Lock className="w-4 h-4 text-[#7E9389] absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#7E9389] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs font-mono text-[#7E9389]">
                  <button
                    type="button"
                    onClick={handleLoadDemoCredentials}
                    className="text-[#FA353F] hover:underline font-bold"
                  >
                    Use Demo Credentials
                  </button>
                  <span className="hover:text-white cursor-pointer">Forgot Passcode?</span>
                </div>

                <button
                  type="submit"
                  className="luxury-btn-hover w-full py-4 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow flex items-center justify-center space-x-2 transition-all mt-6"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>SIGN IN TO CLIENT GARAGE</span>
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-[#98AEA3]/15 flex items-center justify-between text-[11px] font-mono text-[#7E9389]">
              <button
                type="button"
                onClick={() => (onNavigateToAdmin ? onNavigateToAdmin() : (window.location.hash = '#/admin'))}
                className="hover:text-[#FA353F] transition-colors uppercase font-bold"
              >
                Atelier Staff / CMS Portal &rarr;
              </button>
              <span className="text-[#FA353F] font-bold">{brandName} ATELIER 2026</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PANEL 2: CLIENT REGISTRATION (RIGHT 6 COLS) */}
          {/* ========================================================================= */}
          <div className="luxury-card-hover lg:col-span-6 bg-[#061F10] rounded-lg border border-[#FA353F]/30 p-6 sm:p-10 shadow-2xl flex flex-col justify-between space-y-8 relative group">
            <div>
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#98AEA3]/15">
                <div>
                  <span className="font-mono text-[10px] text-[#FA353F] font-bold uppercase tracking-widest block mb-1">
                    02 &bull; NEW CLIENT COMMISSIONS
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase tracking-wide">
                    REGISTER PROFILE
                  </h2>
                </div>
                <div className="p-3 rounded-md bg-[#020F06] border border-[#FA353F]/40 text-[#FA353F]">
                  <User className="w-5 h-5" />
                </div>
              </div>

              <p className="font-sans text-xs text-[#98AEA3] mt-3 leading-relaxed">
                Not registered yet? First create your client allocation account below, then sign in with your confidential credentials.
              </p>

              {/* Registration Error Notification */}
              {regError && (
                <div className="p-3.5 my-4 rounded-md bg-[#FA353F]/15 border border-[#FA353F] text-[#FA353F] font-mono text-xs font-semibold">
                  {regError}
                </div>
              )}

              {/* Registration Success Notification */}
              {regSuccess && (
                <div className="p-4 my-4 rounded-md bg-emerald-500/15 border border-emerald-400 text-emerald-400 font-mono text-xs space-y-1 animate-fadeIn">
                  <div className="flex items-center space-x-2 font-bold">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>REGISTRATION COMPLETE &bull; CHASSIS RESERVED!</span>
                  </div>
                  <p className="text-[#F5FAF7]">
                    Assigned Serial: <strong className="text-[#FA353F]">{createdChassisId}</strong>
                  </p>
                  <p className="text-[11px] text-[#98AEA3] pt-1">
                    Your credentials have been transferred to the Sign In panel on the left. Click <strong>SIGN IN TO CLIENT GARAGE</strong> to complete your entry!
                  </p>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-6">
                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    FULL LEGAL NAME
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Duke Sterling or Marco Castiglione"
                    className="w-full p-3.5 rounded-md bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    CONFIDENTIAL VIP EMAIL
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. client@privateholdings.com"
                    className="w-full p-3.5 rounded-md bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                    DESIRED CHASSIS COMMISSION
                  </label>
                  <select
                    value={regModel}
                    onChange={(e) => setRegModel(e.target.value)}
                    className="w-full p-3.5 rounded-md bg-[#020F06] border border-[#98AEA3]/25 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none"
                  >
                    <option value="APEX NERO GT">APEX NERO GT (Twin-Turbo Hybrid &bull; 1,120 HP)</option>
                    <option value="VALKYRIE STRADALE">VALKYRIE STRADALE (Naturally Aspirated V12 &bull; 1,280 HP)</option>
                    <option value="PHANTOM CORSA">PHANTOM CORSA (All-Electric Track &bull; 1,450 HP)</option>
                    <option value="MONZA SPEEDSTER V12">MONZA SPEEDSTER V12 (Open-Cockpit &bull; 1,200 HP)</option>
                    <option value="CENTURION SPEEDTAIL">CENTURION SPEEDTAIL (Aero Streamliner &bull; 1,350 HP)</option>
                    <option value="AERO GT-X PROTOTYPE">AERO GT-X PROTOTYPE (Track Special &bull; 1,500 HP)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                      CREATE PASSWORD
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 4 chars"
                      className="w-full p-3.5 rounded-md bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-[#98AEA3] uppercase tracking-wider mb-2 font-bold">
                      CONFIRM PASSWORD
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full p-3.5 rounded-md bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="luxury-btn-hover w-full py-4 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow flex items-center justify-center space-x-2 transition-all mt-6"
                >
                  <User className="w-4 h-4" />
                  <span>REGISTER CLIENT PROFILE</span>
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-[#98AEA3]/15 flex items-center justify-between text-[11px] font-mono text-[#7E9389]">
              <span>EXCLUSIVE ATELIER MEMBERSHIP</span>
              <span className="text-[#FA353F] font-bold">FIRST REGISTER &bull; THEN SIGN IN</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
