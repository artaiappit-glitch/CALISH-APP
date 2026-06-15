// Generates assets/beep.wav — a 0.3s, 880 Hz sine-wave beep at 44100 Hz, 16-bit mono.
// Run once: node scripts/gen-beep.js
const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const freq = 880;        // Hz — bright, cuts through ambient noise
const duration = 0.35;   // seconds
const numSamples = Math.floor(sampleRate * duration);

// Fade in/out over 10% of the duration to avoid clicks
const fadeSamples = Math.floor(numSamples * 0.1);

const dataSize = numSamples * 2; // 16-bit = 2 bytes per sample
const buf = Buffer.alloc(44 + dataSize);

// RIFF header
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write('WAVE', 8);
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);       // PCM chunk size
buf.writeUInt16LE(1, 20);        // PCM format
buf.writeUInt16LE(1, 22);        // mono
buf.writeUInt32LE(sampleRate, 24);
buf.writeUInt32LE(sampleRate * 2, 28); // byte rate
buf.writeUInt16LE(2, 32);        // block align
buf.writeUInt16LE(16, 34);       // bits per sample
buf.write('data', 36);
buf.writeUInt32LE(dataSize, 40);

for (let i = 0; i < numSamples; i++) {
  let amp = 0.7;
  if (i < fadeSamples) amp *= i / fadeSamples;
  else if (i > numSamples - fadeSamples) amp *= (numSamples - i) / fadeSamples;

  const sample = Math.round(amp * 32767 * Math.sin((2 * Math.PI * freq * i) / sampleRate));
  buf.writeInt16LE(sample, 44 + i * 2);
}

const out = path.join(__dirname, '..', 'assets', 'beep.wav');
fs.writeFileSync(out, buf);
console.log('Written:', out);
