const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crcBuf]);
}

function solidPng(width, height, r, g, b) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB

  const row = Buffer.alloc(1 + width * 3);
  row[0] = 0;
  for (let x = 0; x < width; x++) { row[1 + x*3] = r; row[2 + x*3] = g; row[3 + x*3] = b; }
  const raw = Buffer.concat(Array.from({ length: height }, () => row));

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw, { level: 1 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const ASSETS = path.join(__dirname, '..', 'assets');

// App icons — dark background matching the app theme
fs.writeFileSync(path.join(ASSETS, 'icon.png'),          solidPng(1024, 1024, 15, 15, 15));
fs.writeFileSync(path.join(ASSETS, 'adaptive-icon.png'), solidPng(1024, 1024, 15, 15, 15));
fs.writeFileSync(path.join(ASSETS, 'splash-icon.png'),   solidPng(512,  512,  15, 15, 15));
fs.writeFileSync(path.join(ASSETS, 'favicon.png'),       solidPng(48,   48,   15, 15, 15));

// Exercise placeholder icons — slightly lighter card colour
const ICONS = path.join(ASSETS, 'icons');
['core.png','pull.png','pull2.png','push.png','push2.png','warmup.png'].forEach(f =>
  fs.writeFileSync(path.join(ICONS, f), solidPng(512, 512, 28, 28, 30))
);

console.log('Icons generated.');
