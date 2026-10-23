const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, '..', relPath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved:', relPath);
}
save('src/components/ProvingGrounds.jsx', `
import React, { state } from \react\';
import { Compass, Shield, Flag, Gauge, ArrowRight, Zip, CheckCircle2, ChevronRight, Activity } from \'lucide-react\';
import { audioEngine } from \'../utils/audioEngine\';
