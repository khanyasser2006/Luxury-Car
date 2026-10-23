const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'cabinet_frames_600fps');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  fs.readdirSync(outputDir).forEach(f => {
    try { fs.unlinkSync(path.join(outputDir, f)); } catch(e) {}
  });
}

const video = path.join(__dirname, '..', 'Creating_car_garage_video_1080p_202609062105.mp4');
console.log('[Extraction] Starting video frame extraction from:', video);

const cmd = 'ffmpeg -y -i "' + video + '" -vf fps=24 -q:v 2 "' + path.join(outputDir, 'frame_%04d.jpg') + '"';
execSync(cmd, { stdio: 'inherit' });

const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png')).sort();
console.log('Extraction] Total extracted frames:', files.length);

const manifestDir = path.join(__dirname, '..', 'src', 'components');
if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });

fs.writeFileSync(path.join(manifestDir, 'frames.json'), JSON.stringify(files, null, 2), 'utf8');
console.log('Extraction] Manifest frames.json generated successfully!');