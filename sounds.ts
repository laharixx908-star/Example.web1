/**
 * Simple Audio Utility for synthesized gaming sounds
 */

class SoundManager {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playBeep(freq = 440, duration = 0.1, type: OscillatorType = 'sine') {
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playClick() {
    this.playBeep(800, 0.05, 'square');
  }

  playSuccess() {
    this.playBeep(523.25, 0.1); // C5
    setTimeout(() => this.playBeep(659.25, 0.1), 100); // E5
    setTimeout(() => this.playBeep(783.99, 0.2), 200); // G5
  }

  playGameOver() {
    this.playBeep(392.00, 0.2, 'sawtooth'); // G4
    setTimeout(() => this.playBeep(349.23, 0.2, 'sawtooth'), 200); // F4
    setTimeout(() => this.playBeep(311.13, 0.4, 'sawtooth'), 400); // Eb4
  }

  playMove() {
    this.playBeep(440, 0.05, 'triangle');
  }

  playIgnition() {
    this.init();
    if (!this.audioCtx) return;

    const noiseNode = this.audioCtx.createBufferSource();
    const bufferSize = this.audioCtx.sampleRate * 1;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    noiseNode.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.8);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.8);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    noiseNode.start();
  }
}

export const sounds = new SoundManager();
