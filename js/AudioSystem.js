/* AudioSystem.js — Procedural SFX via Web Audio API */
/* eslint-disable no-unused-vars */

class AudioSystem {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.musicGain = null;
    this.sfxGain = null;
    this.masterGain = null;
    this.currentMusic = null;
    this.musicVolume = 0.35;
    this.sfxVolume = 0.5;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ── SFX helpers ──────────────────────────────────────────────────────
  _playTone(freq, duration, type = 'sine', gainVal = 0.3, attack = 0.01, decay = 0.1) {
    if (!this.ctx || !this.initialized) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + attack + decay + duration);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + attack + decay + duration + 0.05);
    } catch (e) { /* ignore */ }
  }

  _playNoise(duration, gainVal = 0.1) {
    if (!this.ctx || !this.initialized) return;
    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      source.connect(gain);
      gain.connect(this.sfxGain);
      source.start(this.ctx.currentTime);
    } catch (e) { /* ignore */ }
  }

  // ── Named SFX ────────────────────────────────────────────────────────
  uiClick() {
    this._playTone(440, 0.05, 'square', 0.2, 0.01, 0.08);
    this._playTone(880, 0.05, 'sine', 0.1, 0.01, 0.06);
  }

  menuSelect() {
    this._playTone(523, 0.08, 'sine', 0.25);
    setTimeout(() => this._playTone(659, 0.08, 'sine', 0.2), 80);
  }

  attack() {
    this._playNoise(0.08, 0.2);
    this._playTone(220, 0.1, 'sawtooth', 0.2, 0.01, 0.1);
  }

  critHit() {
    this._playNoise(0.1, 0.3);
    this._playTone(880, 0.05, 'sine', 0.3);
    setTimeout(() => this._playTone(1100, 0.1, 'sine', 0.25), 50);
  }

  enemyHit() {
    this._playTone(180, 0.12, 'sawtooth', 0.2, 0.01, 0.12);
    this._playNoise(0.06, 0.1);
  }

  defend() {
    this._playTone(392, 0.15, 'triangle', 0.2, 0.01, 0.15);
  }

  ability() {
    this._playTone(659, 0.1, 'sine', 0.3);
    setTimeout(() => this._playTone(784, 0.1, 'sine', 0.25), 100);
    setTimeout(() => this._playTone(1047, 0.15, 'sine', 0.2), 200);
  }

  heal() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this._playTone(523 + i * 80, 0.08, 'sine', 0.15), i * 60);
    }
  }

  levelUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => setTimeout(() => this._playTone(n, 0.12, 'sine', 0.3), i * 100));
  }

  textBlip() {
    this._playTone(800 + Math.random() * 200, 0.03, 'square', 0.1, 0.01, 0.02);
  }

  doorOpen() {
    this._playTone(330, 0.08, 'square', 0.2);
    setTimeout(() => this._playTone(440, 0.12, 'square', 0.15), 80);
  }

  insightRead() {
    this._playTone(659, 0.1, 'sine', 0.25);
    setTimeout(() => this._playTone(784, 0.1, 'sine', 0.2), 100);
    setTimeout(() => this._playTone(1047, 0.2, 'sine', 0.25), 200);
  }

  fragmentCollect() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => this._playTone(n, 0.15, 'sine', 0.3), i * 80));
  }

  encounter() {
    this._playTone(180, 0.05, 'sawtooth', 0.3, 0.01, 0.05);
    setTimeout(() => this._playTone(220, 0.05, 'sawtooth', 0.3, 0.01, 0.05), 100);
    setTimeout(() => this._playTone(440, 0.2, 'square', 0.4, 0.01, 0.2), 200);
  }

  victory() {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => this._playTone(n, 0.12, 'sine', 0.3), i * 100));
  }

  defeat() {
    this._playTone(440, 0.3, 'sawtooth', 0.3, 0.01, 0.3);
    setTimeout(() => this._playTone(330, 0.3, 'sawtooth', 0.25, 0.01, 0.3), 300);
    setTimeout(() => this._playTone(220, 0.5, 'sawtooth', 0.2, 0.01, 0.5), 600);
  }

  buy() {
    this._playTone(523, 0.08, 'sine', 0.25);
    setTimeout(() => this._playTone(784, 0.1, 'sine', 0.3), 80);
  }

  footstep() {
    this._playTone(150 + Math.random() * 40, 0.04, 'square', 0.06, 0.01, 0.04);
  }

  mapTravel() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => this._playTone(440 + i * 50, 0.06, 'sine', 0.2), i * 50);
    }
  }
}

const Audio = new AudioSystem();
