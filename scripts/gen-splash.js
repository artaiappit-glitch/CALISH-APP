// Builds assets/splash-icon.png: the white "calisthenics" wordmark, cropped to
// its content and centered large on a full-black portrait canvas. Combined with
// splash.backgroundColor "#000000", the splash reads as solid black edge-to-edge
// with the logo. Run: node scripts/gen-splash.js
const path = require('path');
const Jimp = require('jimp-compact');

const SRC = path.join(__dirname, '..', 'assets', 'logo-source.png');
const OUT = path.join(__dirname, '..', 'assets', 'splash-icon.png');

const W = 1242;          // portrait canvas (scaled to fit the device, bars are black)
const H = 2688;
const LOGO_WIDTH_PCT = 0.82; // how wide the wordmark sits relative to canvas width

(async () => {
  const src = await Jimp.read(SRC);

  // Recolour to white and derive alpha from brightness, so the dark background
  // drops out and only the wordmark remains (anti-aliased edges preserved).
  let minX = src.bitmap.width, minY = src.bitmap.height, maxX = 0, maxY = 0;
  src.scan(0, 0, src.bitmap.width, src.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx], g = this.bitmap.data[idx + 1], b = this.bitmap.data[idx + 2];
    const lum = Math.max(r, g, b);
    this.bitmap.data[idx] = 255;
    this.bitmap.data[idx + 1] = 255;
    this.bitmap.data[idx + 2] = 255;
    this.bitmap.data[idx + 3] = lum;
    if (lum > 24) { // track the wordmark's bounding box
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  });

  // Crop to the wordmark, then scale to the target width.
  src.crop(minX, minY, maxX - minX + 1, maxY - minY + 1);
  const targetW = Math.round(W * LOGO_WIDTH_PCT);
  src.resize(targetW, Jimp.AUTO);

  const canvas = new Jimp(W, H, 0x000000ff);
  canvas.composite(src, Math.round((W - src.bitmap.width) / 2), Math.round((H - src.bitmap.height) / 2));
  await canvas.writeAsync(OUT);
  console.log('Wrote', OUT, W + 'x' + H, '| logo', src.bitmap.width + 'x' + src.bitmap.height);
})();
