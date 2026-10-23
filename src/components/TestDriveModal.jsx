import React, { useState } from 'react';
import { X, Check, Gauge, Calendar, Shield, User, Mail, Phone, ArrowRight, Award, Compass, ChevronLeft } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useCMS } from '../context/CMSContext';

export default function TestDriveModal({ isOpen, onClose, preselectedData }) {
  const { cmsData } = useCMS();
  const fleet = cmsData?.fleet || [];
  const brandName = cmsData?.siteMeta?.brandName || 'VELOCE';
  const atelierEmail = cmsData?.siteMeta?.atelierEmail || 'concierge@veloce-motors.com';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    car: preselectedData?.car || (fleet[0]?.name ? `${fleet[0].name} (${fleet[0].engine})` : 'VALKYRIE STRADALE (Cosworth V12)'),
    tier: 'Private 2-Hour Track Session',
    date: '2026-10-15',
    name: '',
    email: '',
    phone: '',
    conciergeRequest: 'Airport transfer from nearest airport',
  });
  const [passGenerated, setPassGenerated] = useState(false);

  if (!isOpen) return null;

  const cars = fleet.length > 0
    ? fleet.map((c) => `${c.name} (${c.engine})`)
    : [
        'APEX NERO GT (Twin-Turbo Hybrid)',
        'VALKYRIE STRADALE (Cosworth V12)',
        'PHANTOM CORSA (All-Electric)',
      ];

  const tiers = [
    { title: 'Private 2-Hour Track Session', price: 'Complimentary for approved guests' },
    { title: 'Full Day Track Session with Driving Coach', price: 'Includes 1-on-1 coaching' },
    { title: 'Weekend VIP Track Experience', price: 'Includes luxury hospitality & data review' },
  ];

  const handleNext = (e) => {
    e.preventDefault();
    audioEngine.playTelemetryBeep();

    setFormData((prev) => ({
      ...prev,
      name: prev.name.replace(/[<>'"]/g, '').trim(),
      email: prev.email.replace(/[<>'"]/g, '').trim(),
      phone: prev.phone.replace(/[<>'"]/g, '').trim(),
      conciergeRequest: prev.conciergeRequest.replace(/[<>'"]/g, '').trim(),
    }));

    if (step < 3) {
      setStep(step + 1);
    } else {
      setPassGenerated(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020F06]/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="animate-modalScale relative w-full max-w-2xl bg-[#020F06] border-2 border-[#FA353F]/50 rounded-lg p-6 sm:p-10 shadow-ruby-glow-lg my-8">
        <button
          onClick={() => {
            audioEngine.playClick();
            onClose();
          }}
          className="luxury-btn-hover absolute top-6 right-6 p-2.5 rounded-md bg-[#061F10] text-[#98AEA3] hover:text-[#FA353F] border border-[#98AEA3]/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!passGenerated ? (
          <div>
            <div className="mb-8">
              <div className="flex items-center space-x-2 font-mono text-[11px] text-[#FA353F] uppercase tracking-[0.25em] mb-2 font-bold">
                <Gauge className="w-4 h-4" />
                <span>STEP 0{step} OF 03 • TRACK TEST DRIVE RESERVATION</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F5FAF7] uppercase tracking-wider">
                BOOK A TRACK TEST DRIVE
              </h3>
              <p className="font-sans text-xs text-[#98AEA3] mt-1">
                Experience your chosen hypercar on our private 5.4 km track.
              </p>
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-2 font-semibold">
                      SELECT HYPERCAR MODEL
                    </label>
                    <div className="space-y-2">
                      {cars.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            audioEngine.playClick();
                            setFormData({ ...formData, car: c });
                          }}
                          className={`w-full p-4 rounded-md text-left font-mono text-xs flex items-center justify-between transition-all ${
                            formData.car === c
                              ? 'bg-[#FA353F]/15 border-2 border-[#FA353F] text-white font-bold shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                              : 'bg-[#061F10] border border-[#98AEA3]/15 text-[#98AEA3] hover:border-[#FA353F]/40 hover:text-white'
                          }`}
                        >
                          <span>{c}</span>
                          {formData.car === c && <Check className="w-4 h-4 text-[#FA353F]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-2 font-semibold">
                      SELECT EXPERIENCE TYPE
                    </label>
                    <div className="space-y-2">
                      {tiers.map((t) => (
                        <button
                          key={t.title}
                          type="button"
                          onClick={() => {
                            audioEngine.playClick();
                            setFormData({ ...formData, tier: t.title });
                          }}
                          className={`w-full p-4 rounded-md text-left transition-all ${
                            formData.tier === t.title
                              ? 'bg-[#FA353F]/15 border-2 border-[#FA353F] shadow-ruby-glow ring-1 ring-[#FA353F]/40'
                              : 'bg-[#061F10] border border-[#98AEA3]/15 hover:border-[#FA353F]/40'
                          }`}
                        >
                          <p className="font-mono text-xs font-bold text-[#F5FAF7]">{t.title}</p>
                          <p className="font-sans text-xs text-[#7E9389] mt-0.5">{t.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-2 font-semibold">
                      CHOOSE YOUR PREFERRED DATE
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-4 bg-[#061F10] border border-[#98AEA3]/20 rounded-md font-mono text-sm text-[#F5FAF7] focus:border-[#FA353F] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-2 font-semibold">
                      SPECIAL REQUESTS &amp; PREFERENCES
                    </label>
                    <textarea
                      rows="3"
                      value={formData.conciergeRequest}
                      onChange={(e) => setFormData({ ...formData, conciergeRequest: e.target.value })}
                      placeholder="E.g., Airport transfer, guest passes, dietary requirements..."
                      className="w-full p-4 bg-[#061F10] border border-[#98AEA3]/20 rounded-md font-sans text-xs text-[#F5FAF7] focus:border-[#FA353F] outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-2 font-semibold">
                      YOUR FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 bg-[#061F10] border border-[#98AEA3]/20 rounded-md font-mono text-sm text-[#F5FAF7] focus:border-[#FA353F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-2 font-semibold">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 bg-[#061F10] border border-[#98AEA3]/20 rounded-md font-mono text-sm text-[#F5FAF7] focus:border-[#FA353F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-[#98AEA3] mb-2 font-semibold">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 bg-[#061F10] border border-[#98AEA3]/20 rounded-md font-mono text-sm text-[#F5FAF7] focus:border-[#FA353F] outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-[#98AEA3]/15">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playClick();
                      setStep(step - 1);
                    }}
                    className="luxury-btn-hover px-5 py-2.5 rounded-full font-mono text-xs text-[#98AEA3] hover:text-white flex items-center space-x-2 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>BACK</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="luxury-btn-hover px-8 py-3.5 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow flex items-center space-x-2 transition-all"
                >
                  <span>{step === 3 ? 'CONFIRM BOOKING' : 'CONTINUE'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#FA353F]/15 border-2 border-[#FA353F] mx-auto flex items-center justify-center mb-6 shadow-ruby-glow animate-pulse">
              <Check className="w-8 h-8 text-[#FA353F]" />
            </div>

            <span className="inline-block font-mono text-[10px] text-[#FA353F] uppercase tracking-[0.3em] bg-[#FA353F]/10 px-3.5 py-1 rounded-full border border-[#FA353F]/30 mb-2 font-bold">
              BOOKING CONFIRMED
            </span>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F5FAF7] mb-2 uppercase tracking-wider">
              YOUR TRACK PASS IS READY
            </h3>
            <p className="font-sans text-xs text-[#98AEA3] max-w-md mx-auto mb-8">
              Thank you! We have reserved your private track test drive for the <strong className="text-[#F5FAF7]">{formData.car}</strong> on <strong className="text-[#FA353F]">{formData.date}</strong>.
            </p>

            <div className="max-w-md mx-auto p-6 bg-[#061F10] border-2 border-[#FA353F]/40 rounded-lg text-left space-y-3 font-mono text-xs mb-8 shadow-ruby-glow">
              <div className="flex justify-between border-b border-[#98AEA3]/10 pb-2">
                <span className="text-[#7E9389]">PASS CODE:</span>
                <span className="text-[#FA353F] font-bold">{brandName.slice(0, 3).toUpperCase()}-2026-TEST-994</span>
              </div>
              <div className="flex justify-between border-b border-[#98AEA3]/10 pb-2">
                <span className="text-[#7E9389]">TRACK:</span>
                <span className="text-[#F5FAF7]">Eifel High-Speed Track (5.4 km)</span>
              </div>
              <div className="flex justify-between border-b border-[#98AEA3]/10 pb-2">
                <span className="text-[#7E9389]">DRIVING INSTRUCTOR:</span>
                <span className="text-[#F5FAF7]">J. Von Berg (Pro Coach)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E9389]">CONTACT EMAIL:</span>
                <span className="text-[#FA353F]">{atelierEmail}</span>
              </div>
            </div>

            <button
              onClick={() => {
                audioEngine.playClick();
                onClose();
              }}
              className="luxury-btn-hover px-8 py-3.5 rounded-full bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-ruby-glow transition-all"
            >
              RETURN TO HOME
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
