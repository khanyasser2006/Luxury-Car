const { writeFileSync, mkdirSync, existsSync } = require('fs');
const path = require('path');
function write(target, b64) {
  const f = path.resolve(target);
  const d = path.dirname(f);
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
  writeFileSync(f, Buffer.from(b64, 'base64').toString('utf8'));
  console.log('[Written]', target);
}
module.exports = { write };
