# 🏎️ Veloce

A cinematic showcase for a bespoke hypercar atelier and its private proving grounds — a 240-frame scroll-scrubbed hero, a fleet gallery with a configurator, engineering and lap-record pages, an engine-rev sound synthesized live in the browser, and a CMS-driven admin dashboard.

![React](https://img.shields.io/badge/-React%2018-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/-GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white)

---

## 🧰 Technologies

- React 18
- Vite 6
- JavaScript
- Tailwind CSS v3
- GSAP (ScrollTrigger)
- Web Audio API (synthesized engine and interface sounds)
- Browser `localStorage` (CMS content, client accounts)

---

## ✨ Features

- **240-Frame Scroll Hero**: A WebP image sequence scrubbed against scroll through a pinned GSAP ScrollTrigger section, fetched in batches of 16, decoded with `createImageBitmap`, and painted by a `requestAnimationFrame` loop with the device pixel ratio capped at 2.
- **Synthesized Engine Rev**: Two sawtooth oscillators with exponential pitch sweeps, a waveshaper distortion curve, and a sweeping low-pass filter build the sound live — there is no audio file anywhere in the project.
- **Interface Sound Design**: Click and telemetry-beep cues generated the same way, with a mute toggle.
- **Fleet Gallery & Configurator**: Pick a car, then a finish, interior, and aero package, from a fleet that's fully editable in the CMS.
- **Test-Drive Booking Flow**: A three-step modal — car and session tier, date and contact details, concierge requests — that ends in a generated pass.
- **Proving Grounds Explorer**: An interactive, sector-by-sector breakdown of the private track, alongside a lap-records table.
- **Engineering & Materials Pages**: Tabbed engineering pillars and a materials library, both driven by CMS data.
- **CMS Admin Dashboard**: Edits hero phases, home portals, proving grounds, fleet, engineering pillars, materials, testimonials, lap records, and site metadata, with JSON export/import and reset-to-defaults.
- **Drag-and-Drop Image Upload**: A dedicated dropzone component for adding images from the admin dashboard.
- **Per-View SEO**: A dedicated `SEO` component sets metadata per view, alongside a sitemap, `robots.txt`, and web manifest.
- **Written Design Spec**: An obsidian black-green and ruby-red dual palette, with Syncopate, Exo 2, and JetBrains Mono, documented in `DESIGN.md`.

---

## 🪜 The Process

I built the hero first, using the same frame-sequence technique as the other cinematic sites in this series: a 240-frame WebP sequence fetched in small batches, decoded off the main thread with `createImageBitmap`, and drawn to a canvas by its own animation loop while GSAP ScrollTrigger pins the section and scrubs through the frames.

Rather than shipping a recorded engine note, I synthesized one. Two detuned sawtooth oscillators glide up and back down in pitch, a distortion curve adds grit, and a low-pass filter opens and closes over the same 2.8 seconds, so the rev has a rise and fall instead of a flat loop.

The site's content lives in a single CMS context — hero phases, home portals, proving grounds, fleet, engineering pillars, materials, testimonials, lap records, and site metadata — persisted to `localStorage`, with JSON export and import so content can be moved between browsers by hand.

I'll be candid about the account system: it's a demo scaffold, not real authentication. The admin check is a loose string match on the email or a short list of hardcoded master keys, and the result is just a flag in `sessionStorage`; the client login falls back to a demo VIP account for any password of four or more characters; and the test-drive wizard ends by showing a pass on screen without sending anything anywhere. That was enough to build and demo the experience, but it's the first thing to replace before this is public.

---

## 📚 What I Learned

- **Synthesizing a Sound Instead of Shipping One**: Shaped an engine note from oscillators, an exponential pitch envelope, a waveshaper curve, and a filter sweep using only the Web Audio API.
- **Streaming a Frame Sequence Without Blocking**: Fetched frames in batches and decoded them with `createImageBitmap` so a few hundred images don't stall scrolling or the main thread.
- **One Data Object, Whole Site**: Modeled every editable section as part of one CMS object, which made export, import, and reset-to-defaults straightforward to add.
- **Designing to a Written Spec**: Wrote the color tokens, type scale, spacing grid, and radius system down in `DESIGN.md` first, so components could follow it instead of re-deciding the look page by page.
- **Treating Sound as Part of the Interaction**: Gave clicks, telemetry beeps, and the engine rev their own cues, plus a mute control, rather than adding audio as an afterthought.
- **A Lockout Is Not Authentication**: Added a five-attempt lockout to the admin gate, then realized the counter lives in `sessionStorage` right next to the flag it protects — rate limiting only means something when a server enforces it.

---

## 🔧 How Can It Be Improved?

- Replace the admin check with real, server-verified authentication. Today it's a loose email match or a hardcoded key list, and the outcome is a `sessionStorage` flag that anyone can set from the browser console, so none of it protects the admin dashboard.
- Tighten the client login: any email with a password of four or more characters currently falls through to a demo VIP account, and registered passwords use a single unsalted SHA-256 pass, with a legacy plaintext comparison still accepted alongside it.
- Send the test-drive booking somewhere real — the three-step wizard currently finishes by showing a generated pass on screen, but nothing is emailed, stored, or submitted.
- Move CMS content to a backend. Beyond edits being visible only in the browser that made them, uploaded images are stored as base64 inside the CMS object saved to `localStorage`; there's no size limit (a code comment mentions one), and a failed save only logs to the console, so a handful of photos can quietly stop edits from persisting.
- Replace the hero footage before any commercial use — the frames show recognizable cars from real manufacturers with visible badges, plus what looks like a generator watermark in the lower-right corner, which doesn't match a fictional marque.
- Rename `public/cabinet_frames_600fps`, a leftover name from an earlier project; it now holds 240 frames of garage footage.
- Self-host the default fleet and social-preview imagery instead of hotlinking it from Unsplash.
- Remove the unused `clsx` and `tailwind-merge` dependencies, and add a `.gitignore` — the project has none, so `node_modules` and `dist` would be committed.

---

## 🚀 Running the Project

### Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/veloce-atelier.git
cd veloce-atelier
```

---

### Step 2 — Install Dependencies

**Prerequisites:** Node.js 18+

```bash
npm install
```

---

### Step 3 — Run the Development Server

```bash
npm run dev
```

---

### Step 4 — Open the Application

```
http://localhost:3000
```

*(This project pins Vite to port 3000 in `vite.config.js`, rather than the usual 5173 default.)*

---

## 🎥 Demo

*Add a screen recording of the hero scroll here, and unmute the page so the engine rev on the Cars page comes through.*

---
