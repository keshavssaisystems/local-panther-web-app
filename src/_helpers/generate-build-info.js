const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '..', '..', 'package.json');
let version = 'unknown';
try {
  const pkg = require(pkgPath);
  version = pkg.version || 'unknown';
} catch (e) {}

const buildInfo = {
  buildTime: new Date().toISOString(),
  version
};

const outPath = path.resolve(__dirname, '..', '..', 'public', 'build-info.json');

fs.writeFileSync(outPath, JSON.stringify(buildInfo, null, 2));
console.log('Wrote build-info.json to', outPath);
