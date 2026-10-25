// Web Audio API Procedural Synthesizer for Focus Mode
// Completely client-side, zero external audio asset dependencies

class FocusAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentSound: string = 'none';
  private nodes: { [key: string]: AudioNode | number } = {};
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSoundscape(type: 'none' | 'binaural' | 'cosmos' | 'whitenoise') {
    this.stopSoundscape();
    this.currentSound = type;
    if (type === 'none' || this.isMuted) return;

    this.initCtx();
    if (!this.ctx) return;

    if (type === 'binaural') {
      this.startBinauralBeats();
    } else if (type === 'cosmos') {
      this.startCosmosDrone();
    } else if (type === 'whitenoise') {
      this.startPinkNoise();
    }
  }

  public stopSoundscape() {
    // Stop and disconnect existing nodes
    Object.keys(this.nodes).forEach((key) => {
      const node = this.nodes[key];
      if (node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
        try {
          (node as AudioScheduledSourceNode).stop();
        } catch {
          // ignore already stopped
        }
      }
      if (node && typeof (node as AudioNode).disconnect === 'function') {
        try {
          (node as AudioNode).disconnect();
        } catch {
          // ignore
        }
      }
    });
    this.nodes = {};
    this.currentSound = 'none';
  }

  // 10Hz Alpha wave binaural generator (200Hz left, 210Hz right)
  private startBinauralBeats() {
    if (!this.ctx) return;
    const merger = this.ctx.createChannelMerger(2);
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(200, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(210, this.ctx.currentTime); // 10Hz alpha differential

    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);
    merger.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    oscLeft.start();
    oscRight.start();

    this.nodes.oscLeft = oscLeft;
    this.nodes.oscRight = oscRight;
    this.nodes.merger = merger;
    this.nodes.masterGain = masterGain;
  }

  // Deep space cosmos drone with lowpass filter sweep
  private startCosmosDrone() {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A1

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    // LFO to create slow breathing cosmic movement
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10s cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    lfo.start();

    this.nodes.osc1 = osc1;
    this.nodes.osc2 = osc2;
    this.nodes.lfo = lfo;
    this.nodes.filter = filter;
    this.nodes.masterGain = masterGain;
  }

  // Soft filtered noise generator
  private startPinkNoise() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    noise.start();

    this.nodes.noise = noise;
    this.nodes.filter = filter;
    this.nodes.masterGain = masterGain;
  }

  // Play pleasant crystal chime when a step or timer finishes
  public playChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.85);
    });
  }

  public getCurrentSound(): string {
    return this.currentSound;
  }
}

export const focusAudio = new FocusAudioSynthesizer();
