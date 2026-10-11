const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const durationSec = 0.16; // 160ms for a crisp card flip
const totalSamples = Math.floor(sampleRate * durationSec);
const dataSize = totalSamples * 2; // 16-bit mono

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

// Generate sound samples: soft card flick + swoosh
let prevNoise = 0;
for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  
  // Envelope: rapid attack (10ms) and exponential decay
  const attack = Math.min(1, t / 0.012);
  const decay = Math.exp(-t * 26);
  const env = attack * decay;

  // Filtered noise for paper/card whoosh texture
  const white = (Math.random() * 2 - 1);
  prevNoise = 0.7 * prevNoise + 0.3 * white; // simple one-pole low pass filter

  // Soft thump / click (descending frequency: 450Hz -> 180Hz)
  const freq = 450 - (t / durationSec) * 270;
  const thump = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 40);

  // Blend noise texture and thump
  const sampleFloat = (0.55 * prevNoise + 0.45 * thump) * env * 0.75;
  const sampleClamped = Math.max(-1, Math.min(1, sampleFloat));
  const sample16 = Math.floor(sampleClamped * 32767);

  buffer.writeInt16LE(sample16, 44 + i * 2);
}

const dir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'card-flip.wav'), buffer);
console.log('Successfully created assets/sounds/card-flip.wav');
