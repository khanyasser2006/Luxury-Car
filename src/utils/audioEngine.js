// Web Audio API Sound Synthesizer for Hypercar Acoustics & Tactile UI
class HypercarAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.035);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {}
  }

  playTelemetryBeep() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1470, this.ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playEngineRev(duration = 2.8) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, now);
      masterGain.gain.linearRampToValueAtTime(0.24, now + 0.3);
      masterGain.gain.linearRampToValueAtTime(0.3, now + 1.2);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(45, now);
      subOsc.frequency.exponentialRampToValueAtTime(180, now + 0.8);
      subOsc.frequency.exponentialRampToValueAtTime(260, now + 1.4);
      subOsc.frequency.exponentialRampToValueAtTime(70, now + duration);

      const midOsc = this.ctx.createOscillator();
      midOsc.type = 'sawtooth';
      midOsc.frequency.setValueAtTime(90, now);
      midOsc.frequency.exponentialRampToValueAtTime(360, now + 0.8);
      midOsc.frequency.exponentialRampToValueAtTime(520, now + 1.4);
      midOsc.frequency.exponentialRampToValueAtTime(120, now + duration);

      const distortion = this.ctx.createWaveShaper();
      const n_samples = 256;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      const k = 25;
      for (let i = 0; i < n_samples; ++i) {
        let x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      distortion.curve = curve;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.9);
      filter.frequency.exponentialRampToValueAtTime(3500, now + 1.4);
      filter.frequency.exponentialRampToValueAtTime(350, now + duration);

      subOsc.connect(distortion);
      midOsc.connect(distortion);
      distortion.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      subOsc.start(now);
      midOsc.start(now);
      subOsc.stop(now + duration);
      midOsc.stop(now + duration);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const audioEngine = new HypercarAudioEngine();