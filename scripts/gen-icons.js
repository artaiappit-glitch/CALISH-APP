// Generates minimal PNG placeholder icons required by app.json.
// Real icons can be dropped in later; these just prevent build errors.
const fs = require('fs');
const path = require('path');

// Minimal 1×1 transparent PNG
const TRANSPARENT_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4' +
  '890000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
  'hex'
);

const assets = path.join(__dirname, '..', 'assets');
['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png'].forEach((f) => {
  const p = path.join(assets, f);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, TRANSPARENT_PNG);
    console.log('Created placeholder:', f);
  } else {
    console.log('Already exists, skipping:', f);
  }
});
