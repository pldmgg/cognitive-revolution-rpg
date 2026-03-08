/* audio.js — Procedural SFX via Web Audio API */
/* eslint-disable no-unused-vars */

const AudioManager = (() => {
  let ctx = null;
  let masterGain = null;
  let muted = false;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(ctx.destination);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function toggleMute() {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.35;
    return muted;
  }

  function playTone(freq, duration, type, volume, delay) {
    if (!ctx) init();
    const t = ctx.currentTime + (delay || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime((volume || 0.3), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t);
    osc.stop(t + duration);
  }

  function playNoise(duration, volume, delay) {
    if (!ctx) init();
    const t = ctx.currentTime + (delay || 0);
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume || 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    source.connect(gain);
    gain.connect(masterGain);
    source.start(t);
  }

  // -- Sound effects --

  function uiClick() {
    playTone(800, 0.06, 'sine', 0.2);
    playTone(1200, 0.04, 'sine', 0.15, 0.03);
  }

  function uiHover() {
    playTone(600, 0.04, 'sine', 0.1);
  }

  function attackHit() {
    playNoise(0.12, 0.25);
    playTone(200, 0.15, 'sawtooth', 0.2);
    playTone(120, 0.1, 'square', 0.15, 0.05);
  }

  function criticalHit() {
    playNoise(0.18, 0.3);
    playTone(300, 0.2, 'sawtooth', 0.25);
    playTone(450, 0.15, 'square', 0.2, 0.05);
    playTone(600, 0.1, 'sine', 0.15, 0.1);
  }

  function abilityUse() {
    playTone(400, 0.1, 'sine', 0.2);
    playTone(600, 0.15, 'sine', 0.25, 0.05);
    playTone(900, 0.2, 'sine', 0.2, 0.1);
    playTone(1200, 0.15, 'triangle', 0.15, 0.2);
  }

  function heal() {
    playTone(523, 0.15, 'sine', 0.2);
    playTone(659, 0.15, 'sine', 0.2, 0.1);
    playTone(784, 0.2, 'sine', 0.25, 0.2);
  }

  function damageTaken() {
    playTone(150, 0.15, 'sawtooth', 0.2);
    playNoise(0.1, 0.2, 0.05);
  }

  function defend() {
    playTone(300, 0.1, 'triangle', 0.15);
    playTone(500, 0.08, 'triangle', 0.1, 0.05);
  }

  function victory() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => {
      playTone(n, 0.3, 'sine', 0.2, i * 0.15);
      playTone(n * 0.5, 0.3, 'triangle', 0.1, i * 0.15);
    });
  }

  function defeat() {
    const notes = [400, 350, 300, 200];
    notes.forEach((n, i) => {
      playTone(n, 0.4, 'sawtooth', 0.15, i * 0.2);
    });
  }

  function levelUp() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => {
      playTone(n, 0.25, 'sine', 0.2, i * 0.1);
      playTone(n * 1.5, 0.2, 'triangle', 0.1, i * 0.1 + 0.05);
    });
  }

  function fragmentCollect() {
    const notes = [440, 554, 659, 880, 1108, 1319];
    notes.forEach((n, i) => {
      playTone(n, 0.35, 'sine', 0.2, i * 0.08);
      playTone(n * 2, 0.25, 'triangle', 0.08, i * 0.08 + 0.04);
    });
  }

  function insightRead() {
    playTone(660, 0.12, 'sine', 0.15);
    playTone(880, 0.15, 'sine', 0.2, 0.08);
  }

  function enemyAppear() {
    playTone(100, 0.3, 'sawtooth', 0.15);
    playTone(80, 0.4, 'square', 0.1, 0.1);
    playNoise(0.2, 0.15, 0.15);
  }

  function bossAppear() {
    playTone(60, 0.5, 'sawtooth', 0.25);
    playTone(80, 0.4, 'sawtooth', 0.2, 0.2);
    playTone(60, 0.6, 'square', 0.15, 0.4);
    playNoise(0.3, 0.2, 0.3);
  }

  function textBlip() {
    playTone(440 + Math.random() * 200, 0.03, 'square', 0.05);
  }

  function mapTravel() {
    playTone(300, 0.1, 'sine', 0.1);
    playTone(400, 0.1, 'sine', 0.1, 0.08);
    playTone(500, 0.15, 'sine', 0.12, 0.16);
  }

  function equipItem() {
    playTone(500, 0.08, 'triangle', 0.15);
    playTone(700, 0.08, 'triangle', 0.15, 0.06);
    playTone(900, 0.12, 'sine', 0.2, 0.12);
  }

  return {
    init, resume, toggleMute,
    uiClick, uiHover, attackHit, criticalHit, abilityUse,
    heal, damageTaken, defend, victory, defeat, levelUp,
    fragmentCollect, insightRead, enemyAppear, bossAppear,
    textBlip, mapTravel, equipItem
  };
})();
