# OculusTwin — Eye Operation Digital Twin System

A virtual simulation digital twin system for ocular surgery.  
Simulates **Phacoemulsification (Cataract)**, **LASIK**, and **Pars Plana Vitrectomy** with real-time vital sign monitoring, anomaly detection, and live eye SVG animation.

---

## 📁 Project Structure

```
oculus-twin/
├── index.html     ← Main HTML shell (layout + SVG eye anatomy)
├── style.css      ← All styles (design system, animations, layout)
├── script.js      ← All logic (surgery data, simulation engine, vitals, waveform)
├── vercel.json    ← Vercel deployment config
└── README.md      ← This file
```

---

## 🚀 Deploy to Vercel

### Option 1 — Vercel CLI (recommended)

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Navigate into the project folder
cd oculus-twin

# 3. Deploy
vercel

# Follow the prompts:
#   Set up and deploy? → Y
#   Which scope?       → your account
#   Link to existing?  → N
#   Project name?      → oculus-twin (or any name)
#   Which directory?   → ./ (current)

# 4. For production deploy
vercel --prod
```

Your app will be live at: `https://oculus-twin.vercel.app` (or your custom name)

---

### Option 2 — GitHub + Vercel Dashboard

1. Create a new GitHub repository (public or private)
2. Push all 4 files into the repo root:
   ```bash
   git init
   git add .
   git commit -m "Initial OculusTwin deploy"
   git remote add origin https://github.com/YOUR_USERNAME/oculus-twin.git
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new)
4. Import your GitHub repository
5. Framework Preset: **Other** (it's a static site)
6. Root Directory: `./` (leave as default)
7. Click **Deploy**

---

### Option 3 — Drag & Drop (quickest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Scroll to **"Or drag & drop"** at the bottom
3. Select all 4 files and drag them in
4. Done — live in ~10 seconds

---

## ⚙️ No Build Step Required

This is a pure static site. No `npm install`, no bundler, no framework needed.  
Vercel serves it directly as static assets.

---

## 🔧 Local Development

Just open `index.html` in any browser:

```bash
# Option A: open directly
open index.html

# Option B: use a local server (avoids any font/CORS issues)
npx serve .
# or
python3 -m http.server 3000
```

---

## 🖥️ Features

| Feature | Description |
|---|---|
| 3 Surgery Types | Phacoemulsification, LASIK, Vitrectomy |
| Anatomical SVG Eye | Cornea, iris, pupil, lens, vitreous, retina, blood vessels, optic nerve |
| Eye State Engine | SVG updates per surgical phase |
| Live Vitals | IOP, CCT, Pupil Ø, Retinal Perfusion, Aqueous Flow, Ocular Temp |
| IOP Waveform | Canvas-drawn real-time waveform with threshold bands |
| Anomaly Detection | WARN / CRITICAL / NOMINAL alert system |
| Event Log | 30+ clinically accurate surgical events per procedure |
| Simulation Controls | Start, Next Phase, Pause/Resume, Reset, Speed ×0.5/1/2/4 |
| Twin Sync | Simulated latency + fidelity indicators |

---

## 📐 Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

Best viewed at 1280×800 or wider. Not optimised for mobile.

---

## 📝 License

MIT — free to use, modify, and deploy.
