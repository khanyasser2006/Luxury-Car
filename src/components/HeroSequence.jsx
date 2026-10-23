import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import frameList from './frames.json';
import { useCMS } from '../context/CMSContext';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSequence() {
  const { cmsData } = useCMS();
  const phases = cmsData?.heroPhases || [];
  const phase1 = phases[0] || {};
  const phase2 = phases[1] || {};
  const phase3 = phases[2] || {};
  const phase4 = phases[3] || {};

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);
  const imagesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const phase4Ref = useRef(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const totalFrames = frameList.length;
    let loadedCount = 0;
    const batchSize = 16;

    const loadBatch = async (startIndex) => {
      if (isCancelled || startIndex >= totalFrames) return;
      const endIndex = Math.min(startIndex + batchSize, totalFrames);
      const promises = [];

      for (let i = startIndex; i < endIndex; i++) {
        const frameName = frameList[i];
        const src = `/cabinet_frames_600fps/${frameName}`;

        const p = fetch(src)
          .then((res) => {
            if (!res.ok) throw new Error(`Frame fetch failed: ${src}`);
            return res.blob();
          })
          .then((blob) => createImageBitmap(blob))
          .then((bitmap) => {
            if (!isCancelled) {
              imagesRef.current[i] = bitmap;
              loadedCount++;
              setLoadingProgress(Math.floor((loadedCount / totalFrames) * 100));
            }
          })
          .catch(() => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                if (!isCancelled) {
                  imagesRef.current[i] = img;
                  loadedCount++;
                  setLoadingProgress(Math.floor((loadedCount / totalFrames) * 100));
                }
                resolve();
              };
              img.onerror = () => resolve();
            });
          });

        promises.push(p);
      }

      await Promise.all(promises);
      if (!isCancelled && endIndex < totalFrames) {
        loadBatch(endIndex);
      } else if (!isCancelled && loadedCount >= totalFrames * 0.9) {
        setIsLoaded(true);
      }
    };

    loadBatch(0);

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let lastDrawnIndex = -1;

    const render = () => {
      const targetIndex = Math.min(
        Math.max(0, frameIndexRef.current | 0),
        frameList.length - 1
      );

      const img = imagesRef.current[targetIndex] || imagesRef.current[0];

      if (img && targetIndex !== lastDrawnIndex) {
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width || 1920;
        const ih = img.height || 1080;

        const hRatio = cw / iw;
        const vRatio = ch / ih;
        const ratio = Math.max(hRatio, vRatio);

        const sw = (iw * ratio) | 0;
        const sh = (ih * ratio) | 0;
        const sx = ((cw - sw) / 2) | 0;
        const sy = ((ch - sh) / 2) | 0;

        ctx.fillStyle = '#020F06';
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, sx, sy, sw, sh);

        lastDrawnIndex = targetIndex;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (window.innerWidth * dpr) | 0;
      canvas.height = (window.innerHeight * dpr) | 0;
      lastDrawnIndex = -1;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const total = frameList.length - 1;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=450%',
        pin: true,
        scrub: 1,
      },
    });

    // Frame animation
    tl.to(
      frameIndexRef,
      {
        current: total,
        ease: 'none',
        duration: 1,
      },
      0
    );

    // Phase 1 (Bottom-Left): 0% -> 22%
    if (phase1Ref.current) {
      tl.fromTo(
        phase1Ref.current,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -25, ease: 'power1.out', duration: 0.08 },
        0.18
      );
    }

    // Phase 2 (Bottom-Right): 25% -> 48%
    if (phase2Ref.current) {
      tl.fromTo(
        phase2Ref.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, ease: 'power1.out', duration: 0.07 },
        0.24
      );
      tl.to(
        phase2Ref.current,
        { opacity: 0, y: -25, ease: 'power1.in', duration: 0.07 },
        0.44
      );
    }

    // Phase 3 (Top-Right): 50% -> 73%
    if (phase3Ref.current) {
      tl.fromTo(
        phase3Ref.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, ease: 'power1.out', duration: 0.07 },
        0.50
      );
      tl.to(
        phase3Ref.current,
        { opacity: 0, y: -25, ease: 'power1.in', duration: 0.07 },
        0.70
      );
    }

    // Phase 4 (Top-Left): 75% -> 100%
    if (phase4Ref.current) {
      tl.fromTo(
        phase4Ref.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, ease: 'power1.out', duration: 0.07 },
        0.76
      );
    }

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [isLoaded]);

  return (
    <div id="experience" ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#020F06]">
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020F06] text-[#F5FAF7]">
          <div className="w-20 h-20 mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#FA353F]/20 animate-ping" />
            <div className="w-16 h-16 rounded-full border-2 border-[#FA353F] border-t-transparent animate-spin" />
            <div className="w-4 h-4 bg-[#FA353F] rotate-45" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FA353F] mb-2 font-bold">
            {cmsData?.siteMeta?.brandName || 'VELOCE'} MOTORS
          </span>
          <p className="font-display font-bold text-2xl tracking-wider text-[#F5FAF7] mb-4">
            LOADING 240 HIGH-SPEED FRAMES
          </p>
          <div className="w-64 h-1.5 bg-[#061F10] rounded-full overflow-hidden border border-[#98AEA3]/20">
            <div
              className="h-full bg-gradient-to-r from-[#FA353F] to-[#FF4A54] transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="font-mono text-xs text-[#98AEA3] mt-3">
            {loadingProgress}% READY
          </span>
        </div>
      )}

      {/* Background Video Frame Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
      />

      {/* Cinematic Vignette & Ambient Radial Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020F06] via-transparent to-[#020F06]/85 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,15,6,0.75)_100%)] pointer-events-none" />

      {/* Dynamic Multi-Position Storytelling Headings */}
      {isLoaded && (
        <>
          {/* Phase 1: Bottom-Left (0% - 25%) */}
          <div
            ref={phase1Ref}
            className="absolute bottom-6 sm:bottom-12 lg:bottom-16 left-4 sm:left-12 lg:left-16 max-w-[calc(100vw-32px)] sm:max-w-xl text-left pointer-events-none z-20 space-y-3 sm:space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 sm:w-8 h-0.5 bg-[#FA353F]" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#FA353F] font-bold">
                {phase1.tag || 'PURE SPEED'}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-[#F5FAF7] tracking-wider uppercase leading-tight break-words">
              {phase1.title1 || 'SCULPTED FOR'} <br />
              <span className="text-[#FA353F] ruby-text-glow">{phase1.title2 || 'RAW SPEED'}</span>
            </h1>

            <p className="font-sans text-xs sm:text-base text-[#98AEA3] font-light leading-relaxed tracking-wide border-l-2 border-[#FA353F]/40 pl-3 sm:pl-4 line-clamp-3 sm:line-clamp-none">
              {phase1.desc || 'Handcrafted hypercars built for ultimate performance and tested on our private track before delivery.'}
            </p>
          </div>

          {/* Phase 2: Bottom-Right (25% - 50%) */}
          <div
            ref={phase2Ref}
            style={{ opacity: 0 }}
            className="absolute bottom-6 sm:bottom-12 lg:bottom-16 right-4 sm:right-12 lg:right-16 max-w-[calc(100vw-32px)] sm:max-w-xl text-right pointer-events-none z-20 space-y-3 sm:space-y-4 flex flex-col items-end"
          >
            <div className="flex items-center space-x-3 justify-end">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#FA353F] font-bold">
                {phase2.tag || 'CARBON CHASSIS'}
              </span>
              <div className="w-6 sm:w-8 h-0.5 bg-[#FA353F]" />
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-[#F5FAF7] tracking-wider uppercase leading-tight break-words">
              {phase2.title1 || 'FULL CARBON FIBER'} <br />
              <span className="text-[#FA353F] ruby-text-glow">{phase2.title2 || 'BODY & FRAME'}</span>
            </h2>

            <p className="font-sans text-xs sm:text-base text-[#98AEA3] font-light leading-relaxed tracking-wide border-r-2 border-[#FA353F]/40 pr-3 sm:pr-4 line-clamp-3 sm:line-clamp-none">
              {phase2.desc || 'Ultra-strong carbon fiber chassis engineered for pinpoint handling and exceptional cornering grip.'}
            </p>
          </div>

          {/* Phase 3: Top-Right (50% - 75%) */}
          <div
            ref={phase3Ref}
            style={{ opacity: 0 }}
            className="absolute top-14 sm:top-20 lg:top-24 right-4 sm:right-12 lg:right-16 max-w-[calc(100vw-32px)] sm:max-w-xl text-right pointer-events-none z-20 space-y-3 sm:space-y-4 flex flex-col items-end"
          >
            <div className="flex items-center space-x-3 justify-end">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#FA353F] font-bold">
                {phase3.tag || 'ENGINE POWER'}
              </span>
              <div className="w-6 sm:w-8 h-0.5 bg-[#FA353F]" />
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-[#F5FAF7] tracking-wider uppercase leading-tight break-words">
              {phase3.title1 || '1,280 HP'} <br />
              <span className="text-[#FA353F] ruby-text-glow">{phase3.title2 || 'V12 ENGINE'}</span>
            </h2>

            <p className="font-sans text-xs sm:text-base text-[#98AEA3] font-light leading-relaxed tracking-wide border-r-2 border-[#FA353F]/40 pr-3 sm:pr-4 line-clamp-3 sm:line-clamp-none">
              {phase3.desc || 'Naturally aspirated V12 engine revving up to 11,100 RPM with pure, thrilling racing sound.'}
            </p>
          </div>

          {/* Phase 4: Top-Left (75% - 100%) */}
          <div
            ref={phase4Ref}
            style={{ opacity: 0 }}
            className="absolute top-14 sm:top-20 lg:top-24 left-4 sm:left-12 lg:left-16 max-w-[calc(100vw-32px)] sm:max-w-xl text-left pointer-events-none z-20 space-y-3 sm:space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 sm:w-8 h-0.5 bg-[#FA353F]" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#FA353F] font-bold">
                {phase4.tag || 'ACTIVE AERO'}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-[#F5FAF7] tracking-wider uppercase leading-tight break-words">
              {phase4.title1 || 'SMART ACTIVE'} <br />
              <span className="text-[#FA353F] ruby-text-glow">{phase4.title2 || 'WINGS & SPOILERS'}</span>
            </h2>

            <p className="font-sans text-xs sm:text-base text-[#98AEA3] font-light leading-relaxed tracking-wide border-l-2 border-[#FA353F]/40 pl-3 sm:pl-4 line-clamp-3 sm:line-clamp-none">
              {phase4.desc || 'Computer-controlled wings adjust in milliseconds to give you maximum grip and instant stopping power.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}