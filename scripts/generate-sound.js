const fs = require('fs');
const path = require('path');

const sampleRate = 44100;

function createWavBuffer(samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(val * 32767), 44 + i * 2);
  }
  return buffer;
}

// 1. 카드 돌리는 소리: 경쾌하고 바람을 가르는 "휘익~" (Crisp Whoosh / Swoosh)
function generateWhoosh() {
  const durationSec = 0.22; // 220ms
  const totalSamples = Math.floor(sampleRate * durationSec);
  const samples = new Float32Array(totalSamples);

  let b0 = 0, b1 = 0;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const progress = t / durationSec;

    // Envelope: smooth bell-shaped curve for a natural gust of wind
    // peaks at 35% of duration
    const env = Math.pow(Math.sin(Math.PI * Math.pow(progress, 0.7)), 2);

    // Resonant frequency sweeps upwards then slightly down: 700Hz -> 1800Hz -> 1100Hz
    const centerFreq = 700 + 1100 * Math.sin(Math.PI * progress);
    
    // Filtered noise
    const whiteNoise = (Math.random() * 2 - 1);
    
    // Simple state-variable or 2-pole resonant filter approximation
    const q = 0.28; // resonance
    const f = 2 * Math.sin(Math.PI * centerFreq / sampleRate);
    b0 = b0 + f * (whiteNoise - b0 - q * b1);
    b1 = b1 + f * b0;

    // Whistling airy undertone
    const airy = Math.sin(2 * Math.PI * centerFreq * t) * 0.25;

    samples[i] = (b1 * 0.75 + airy) * env * 0.85;
  }
  return samples;
}

// 2. 버튼 클릭 소리: 깔끔하고 경쾌한 탭/팝 사운드 (Crisp Tap / Pop)
function generateButtonClick() {
  const durationSec = 0.045; // 45ms (short and punchy)
  const totalSamples = Math.floor(sampleRate * durationSec);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 110); // fast decay

    // Gentle bubble/pop pitch drop: 950Hz -> 480Hz
    const freq = 950 - (t / durationSec) * 470;
    const click = Math.sin(2 * Math.PI * freq * t);

    // Tiny initial transient tick
    const tick = (i < 40) ? (Math.random() * 2 - 1) * 0.3 : 0;

    samples[i] = (click * 0.7 + tick) * env * 0.65;
  }
  return samples;
}

const dir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'card-whoosh.wav'), createWavBuffer(generateWhoosh()));
fs.writeFileSync(path.join(dir, 'card-flip.wav'), createWavBuffer(generateWhoosh())); // fallback for existing import
fs.writeFileSync(path.join(dir, 'button-click.wav'), createWavBuffer(generateButtonClick()));

console.log('Successfully generated card-whoosh.wav and button-click.wav!');
