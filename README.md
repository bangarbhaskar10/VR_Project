# 🌟 Veera's Learning World

A fun, interactive, voice-enabled learning platform built for Veera (age 2.5).

## 🚀 Quick Start

### Step 1: Install Node.js (Required)
Download and install Node.js from: **https://nodejs.org**
- Choose the **LTS version** (recommended)
- Run the installer — it installs both `node` and `npm`
- After installing, restart your terminal / command prompt

### Step 2: Install Dependencies
Open a terminal in `D:\VR_Project` and run:
```bash
npm install
```

### Step 3: Start the App
```bash
npm start
```

The app will open automatically at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
D:\VR_Project\
├── public/                   # Static assets (manifest, favicon)
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.jsx        # Top navigation bar
│   │   ├── StarBurst.jsx     # Celebration animation
│   │   ├── ProgressBar.jsx   # Module progress dots/bar
│   │   ├── ShapeDisplay.jsx  # SVG shape renderer
│   │   ├── FloatingEmojis.jsx# Background decorations
│   │   ├── MusicToggle.jsx   # Background music button
│   │   └── SpeakButton.jsx   # Text-to-speech button
│   ├── pages/                # Full page views
│   │   ├── WelcomePage.jsx   # 🏠 Home screen
│   │   ├── LearningHub.jsx   # 📚 Module selector
│   │   ├── ModulePage.jsx    # 📖 Generic learning module
│   │   ├── TestPage.jsx      # 🧠 Quiz / game page
│   │   └── ParentDashboard.jsx # 👨‍👩‍👧 Progress overview
│   ├── data/                 # Learning content
│   │   ├── modules.js        # Module registry
│   │   ├── numbers.js        # 1–20
│   │   ├── alphabets.js      # A–Z
│   │   ├── animals.js        # 18 animals
│   │   ├── birds.js          # 12 birds
│   │   ├── colors.js         # 10 colors
│   │   ├── shapes.js         # 8 shapes
│   │   ├── days.js           # Days of the week
│   │   └── months.js         # Months of the year
│   ├── context/
│   │   └── AppContext.jsx    # Global state (language, stars, progress)
│   ├── utils/
│   │   ├── speech.js         # Web Speech API wrapper
│   │   ├── storage.js        # localStorage helpers
│   │   └── helpers.js        # Utility functions
│   ├── App.jsx               # Routes
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles + Tailwind
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🎯 Features

### 🏠 Welcome Page
- Animated welcome screen with floating emojis
- Auto-plays voice greeting: *"Hello Veera, let's learn and have fun!"*
- Daily streak tracking 🔥
- Background music toggle (Web Audio API — no files needed!)

### 📚 Learning Modules (8 total)
| Module | Items | Features |
|--------|-------|---------|
| 🔢 Numbers | 1–20 | Count objects, emoji display |
| 🔤 Alphabets | A–Z | Letter + keyword + image |
| 🐘 Animals | 18 | Animal sounds |
| 🦜 Birds | 12 | Bird sounds |
| 🎨 Colors | 10 | Color swatches + examples |
| 🔷 Shapes | 8 | SVG shape drawings |
| 📅 Days | 7 | Day activities |
| 📆 Months | 12 | Seasons + notes |

### 🗣️ Voice Features
- **Auto-speak** on every new item
- **Click/tap to repeat** pronunciation
- **TTS phrases** like "This is Three!", "A for Apple!"
- **Marathi support** — toggle 🇮🇳 for Marathi words (uses hi-IN voice as fallback)

### 🧠 Interactive Tests
- Choose from any module
- 4 choice quiz — tap the correct answer
- **Star burst celebration** ⭐ on correct answers
- **Gentle retry** on wrong answers — no negative feedback
- Score tracking with stars

### 👨‍👩‍👧 Parent Dashboard
- Total stars earned
- Daily learning streak
- Per-module progress bars
- Language toggle
- Data reset option

---

## 🌍 Marathi Support
Tap the **मर** button (top right on any page) to toggle Marathi mode.
- Numbers: एक, दोन, तीन...
- Animals: मांजर, कुत्रा, हत्ती...
- Voice uses `hi-IN` (Hindi) as fallback when `mr-IN` voice isn't available

---

## 📱 PWA / Mobile Support
This app is PWA-ready:
- Works on mobile browsers (Chrome, Safari)
- Add to home screen for app-like experience
- Responsive layout for phones, tablets, and desktops

---

## 🚀 Deploy to Netlify / Vercel

### Build for production:
```bash
npm run build
```
This creates a `dist/` folder.

### Deploy to Netlify:
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `dist/` folder

### Deploy to Vercel:
```bash
npx vercel --prod
```

---

## 🛠️ Tech Stack
- **React 18** — UI framework
- **Vite** — Fast build tool
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Web Speech API** — Text-to-speech (built into browser)
- **Web Audio API** — Background music (no files needed)
- **React Router v6** — Navigation
- **localStorage** — Progress persistence

---

## 🔮 Future Enhancements
- [ ] Voice recognition (child repeats the word)
- [ ] More languages (Hindi, Telugu...)
- [ ] Animated sticker rewards
- [ ] Printable progress report for parents
- [ ] Convert to React Native app
- [ ] Cloud sync with user accounts

---

Made with ❤️ for Veera
