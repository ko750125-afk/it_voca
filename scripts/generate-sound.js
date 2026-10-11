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

// 1. 카드 플립/회전 소리: 짧고 경쾌한 찰칵/플릭 사운드 (바람 소리 전혀 없음, 75ms)
function generateCrispCardSnap() {
  const durationSec = 0.075; // 75ms: 아주 짧고 경쾌함
  const totalSamples = Math.floor(sampleRate * durationSec);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    
    // Very fast attack (2ms) then rapid pleasant exponential decay
    const attack = Math.min(1, t / 0.002);
    const decay = Math.exp(-t * 65);
    const env = attack * decay;

    // Dual-tone tactile snap:
    // Bright snap (1250Hz -> 820Hz)
    const freqHigh = 1250 - (t / durationSec) * 430;
    const toneHigh = Math.sin(2 * Math.PI * freqHigh * t);

    // Warm body resonance (420Hz -> 280Hz)
    const freqLow = 420 - (t / durationSec) * 140;
    const toneLow = Math.sin(2 * Math.PI * freqLow * t);

    // Subtle wooden/card flick harmonic (2100Hz quick tap in first 8ms)
    const flick = (t < 0.008) ? Math.sin(2 * Math.PI * 2100 * t) * (1 - t / 0.008) * 0.4 : 0;

    const sample = (toneHigh * 0.55 + toneLow * 0.35 + flick) * env * 0.85;
    samples[i] = sample;
  }
  return samples;
}

// 2. 일반 버튼 클릭 소리: 깔끔하고 부드러운 탭 사운드 (35ms)
function generateButtonClick() {
  const durationSec = 0.038; // 38ms
  const totalSamples = Math.floor(sampleRate * durationSec);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 130);

    // Gentle pop: 780Hz -> 420Hz
    const freq = 780 - (t / durationSec) * 360;
    const tone = Math.sin(2 * Math.PI * freq * t);

    samples[i] = tone * env * 0.65;
  }
  return samples;
}

const dir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const snapBuffer = createWavBuffer(generateCrispCardSnap());
const clickBuffer = createWavBuffer(generateButtonClick());

fs.writeFileSync(path.join(dir, 'card-whoosh.wav'), snapBuffer);
fs.writeFileSync(path.join(dir, 'card-flip.wav'), snapBuffer);
fs.writeFileSync(path.join(dir, 'button-click.wav'), clickBuffer);

console.log('Successfully regenerated crisp card snap sound!');
