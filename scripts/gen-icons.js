// Generates app icons from assets/logo-source.png.
// Logo is fit (contained) onto a solid dark square canvas matching the app theme.
const path = require('path');
const Jimp = require('jimp-compact');

const ASSETS = path.join(__dirname, '..', 'assets');
const SRC = path.join(ASSETS, 'logo-source.png');
const BG = 0x0f0f0fff; // app dark background

async function makeIcon(size, out) {
  const src = await Jimp.read(SRC);
  const canvas = new Jimp(size, size, BG);
  canvas.composite(src.clone().contain(size, size), 0, 0);
  await canvas.writeAsync(path.join(ASSETS, out));
  console.log('wrote ' + out + ' ' + size + 'x' + size);
}

(async () => {
  await makeIcon(1024, 'icon.png');
  await makeIcon(1024, 'adaptive-icon.png');
  await makeIcon(1024, 'splash-icon.png');
  await makeIcon(48, 'favicon.png');
  console.log('Icons generated.');
})();
