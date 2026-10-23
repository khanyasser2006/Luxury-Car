const fs = require('fs');
const path = require('path');
function write(p, c){ const f = path.resolve(p); fs.mkdirSync(path.dirname(f), {recursive: true}); fs.writeFileSync(f, c, 'utf8'); console.log('[Built]', p); }
module.exports = { write };