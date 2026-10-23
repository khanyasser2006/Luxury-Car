import React from 'react';
import { Award, Shield, CheckCircle, Globe, Lock, Clock } from 'lucide-react';

export default function ClientExperience() {
  const testimonials = [
    {
      quote: 'Driving the car on the private track before taking delivery was incredible. The engineers adjusted the suspension perfectly to match my driving style.',
      author: 'Lord H. Kensington',
      location: 'London & St. Moritz',
      chassis: 'APEX NERO GT #04/30',
    },
    {
      quote: 'The 3.2 km straight lets you really experience the full 1,280 horsepower without speed limits. No regular dealership in the world matches this.',
      author: 'Kenji Takahashi',
      location: 'Tokyo & Monaco',
      chassis: 'VALKYRIE STRADALE #02/20',
    },
    {
      quote: 'From the helicopter transfer to reviewing my lap data with race instructors, Veloce makes buying a hypercar truly unforgettable.',
      author: 'Marco V. Castiglione',
      location: 'Zurich & Milan',
      chassis: 'PHANTOM CORSA #01/15',
    },
  ];

  return (
    <section id="circle" className="py-28 bg-[#020F06] relative overflow-hidden border-t-2 border-b-2 border-[#FA353F]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#98AEA3]/15">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FA353F] font-bold block mb-3">
              OWNER REVIEWS
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F5FAF7] tracking-wider uppercase">
              WHAT OUR <span className="text-[#FA353F] ruby-text-glow">DRIVERS SAY</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#98AEA3] max-w-md mt-4 md:mt-0 leading-relaxed">
            Real feedback from owners who tested and customized their hypercars on our private track.
          </p>
        </div>

        {/* Testimonials Asymmetric Editorial Magazine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 items-stretch">
          {/* Featured Primary Patron Quote (7 Columns) */}
          <div className="lg:col-span-7 luxury-glass p-8 sm:p-12 rounded-lg flex flex-col justify-between border-t-2 border-t-[#FA353F] shadow-2xl border border-[#98AEA3]/15 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FA353F] font-bold">
                  FEATURED REVIEW
                </span>
                <span className="font-mono text-[10px] text-[#98AEA3] bg-[#061F10] px-3 py-1 rounded-md border border-[#98AEA3]/15">
                  VERIFIED OWNER
                </span>
              </div>
              <span className="font-display font-bold text-5xl sm:text-6xl text-[#FA353F]/30 block mb-4 leading-none">
                “
              </span>
              <p className="font-sans text-base sm:text-lg text-[#F5FAF7] leading-relaxed italic mb-8 font-light">
                {testimonials[0].quote}
              </p>
            </div>

            <div className="pt-6 border-t border-[#98AEA3]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-base text-[#F5FAF7] uppercase tracking-wide">
                  {testimonials[0].author}
                </p>
                <p className="font-mono text-xs text-[#7E9389]">{testimonials[0].location}</p>
              </div>
              <span className="inline-block font-mono text-[10px] text-[#FA353F] bg-[#FA353F]/10 px-3.5 py-1.5 rounded-md border border-[#FA353F]/30 font-bold self-start sm:self-auto">
                {testimonials[0].chassis}
              </span>
            </div>
          </div>

          {/* Secondary Stacked Patron Quotes (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {testimonials.slice(1).map((t, idx) => (
              <div
                key={idx}
                className="luxury-glass p-7 sm:p-8 rounded-lg flex flex-col justify-between border-t-2 border-t-[#FA353F]/60 group hover:border-[#FA353F] transition-all duration-300 shadow-xl border border-[#98AEA3]/15 flex-1"
              >
                <div>
                  <span className="font-display font-bold text-3xl text-[#FA353F]/40 block mb-2 leading-none">
                    “
                  </span>
                  <p className="font-sans text-xs sm:text-sm text-[#F5FAF7] leading-relaxed italic mb-5">
                    {t.quote}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#98AEA3]/15 flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-xs sm:text-sm text-[#F5FAF7] uppercase tracking-wide">
                      {t.author}
                    </p>
                    <p className="font-mono text-[11px] text-[#7E9389]">{t.location}</p>
                  </div>
                  <span className="inline-block font-mono text-[9px] text-[#FA353F] bg-[#FA353F]/10 px-2.5 py-1 rounded-md border border-[#FA353F]/30 font-bold">
                    {t.chassis}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIP Ownership Standards Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-lg luxury-glass border border-[#98AEA3]/15">
          <div className="flex items-center space-x-3.5">
            <Globe className="w-6 h-6 text-[#FA353F] shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-[#F5FAF7] block">WORLDWIDE DELIVERY</span>
              <span className="font-sans text-xs text-[#7E9389]">Enclosed secure air freight</span>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <Lock className="w-6 h-6 text-[#FA353F] shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-[#F5FAF7] block">PRIVATE TRACK ACCESS</span>
              <span className="font-sans text-xs text-[#7E9389]">Year-round circuit availability</span>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <Shield className="w-6 h-6 text-[#FA353F] shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-[#F5FAF7] block">PRO DRIVING COACHES</span>
              <span className="font-sans text-xs text-[#7E9389]">1-on-1 coaching &amp; lap review</span>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <Clock className="w-6 h-6 text-[#FA353F] shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-[#F5FAF7] block">DEDICATED SUPPORT</span>
              <span className="font-sans text-xs text-[#7E9389]">Direct personal concierge</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
