/**
 * speech.js — Web Speech API wrapper
 *
 * Provides TTS (text-to-speech) for the learning app.
 * Handles voice selection, language switching, and utterance queuing.
 *
 * Voice preference: Indian English (en-IN) for a warm, familiar accent for Veera.
 * Falls back to any English voice if en-IN is unavailable.
 */

/** Currently active utterance — cancel before speaking new text */
let currentUtterance = null;

/**
 * Speak text aloud using the Web Speech API.
 *
 * @param {string} text        - Text to speak
 * @param {object} [options]   - Options
 * @param {string} [options.lang='en-IN']  - BCP-47 language tag
 * @param {number} [options.rate=0.85]     - Speed (0.1–10), slower for toddlers
 * @param {number} [options.pitch=1.2]     - Pitch (0–2), slightly higher for warmth
 * @param {number} [options.volume=1]      - Volume (0–1)
 * @param {Function} [options.onEnd]       - Callback when speech ends
 */
export function speak(text, options = {}) {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  stop();

  const {
    lang = 'en-IN',   // Indian English accent by default
    rate = 0.85,
    pitch = 1.2,
    volume = 1,
    onEnd,
  } = options;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  if (onEnd) utterance.onend = onEnd;

  // Try to pick a child-friendly / female voice
  utterance.voice = pickVoice(lang);

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any speech currently playing.
 */
export function stop() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * Check if speech is currently playing.
 */
export function isSpeaking() {
  return window.speechSynthesis?.speaking ?? false;
}

/**
 * Pick the best available voice for the given language.
 * Strongly prefers Indian English (en-IN) voices for a familiar accent.
 * Falls back gracefully through other English voices.
 *
 * Voice priority order:
 *   1. Google हिन्दी / Rishi / Lekha / Veena  (Indian English on Chrome/Android)
 *   2. Any en-IN voice
 *   3. Any en-GB voice (closer accent to Indian English than en-US)
 *   4. Any English female voice
 *   5. Any English voice
 *
 * @param {string} lang - BCP-47 tag
 * @returns {SpeechSynthesisVoice|null}
 */
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const langCode = lang.toLowerCase().split('-')[0]; // 'en', 'mr', 'hi'

  // ── For English: apply Indian accent priority ──────────────────────────
  if (langCode === 'en') {
    // 1. Named Indian English voices (Chrome, Android, iOS)
    const indianByName = voices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('rishi')   ||   // iOS/macOS Indian English male
        n.includes('lekha')   ||   // Chrome Indian English female
        n.includes('veena')   ||   // macOS Indian English female
        n.includes('moira')   ||   // macOS Irish (closer than US)
        n.includes('google हिन्दी') ||
        (n.includes('indian') && n.includes('english')) ||
        (n.includes('en-in'))
      );
    });
    if (indianByName) return indianByName;

    // 2. Any voice with en-IN locale
    const enIN = voices.find((v) => v.lang.toLowerCase() === 'en-in');
    if (enIN) return enIN;

    // 3. en-GB as closer-accent fallback
    const enGB = voices.find((v) => v.lang.toLowerCase().startsWith('en-gb'));
    if (enGB) return enGB;

    // 4. Any English female voice
    const enAll = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    const female = enAll.find((v) => {
      const n = v.name.toLowerCase();
      return n.includes('female') || n.includes('zira') ||
             n.includes('susan')  || n.includes('google uk english female');
    });
    if (female) return female;

    return enAll[0] || voices[0];
  }

  // ── Non-English (Marathi / Hindi) ─────────────────────────────────────
  const matching = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(langCode)
  );
  return matching[0] || voices[0];
}

/**
 * Ensure voices are loaded (async on some browsers).
 * Call this once at startup.
 */
export function initVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

/**
 * Speak with language awareness for the app.
 *
 * @param {object} item      - Data item with 'word' and 'marathiWord' fields
 * @param {string} language  - 'en' or 'mr'
 */
export function speakItem(item, language = 'en') {
  if (language === 'mr' && item.marathiWord) {
    // Try Hindi voice as fallback for Marathi (mr-IN often unavailable)
    const voices = window.speechSynthesis.getVoices();
    const hasMarathi = voices.some((v) => v.lang.startsWith('mr'));
    const lang = hasMarathi ? 'mr-IN' : 'hi-IN';
    speak(`${item.marathiWord}`, { lang, rate: 0.75, pitch: 1.1 });
  } else {
    speak(item.word, { lang: 'en-IN', rate: 0.8, pitch: 1.15 });
  }
}

/**
 * Play a reward sound using TTS (no audio files needed).
 * @param {'correct'|'cheer'|'complete'} type
 */
export function speakReward(type) {
  const messages = {
    correct: ['Yay! That is correct!', 'Wonderful!', 'Great job!', 'You are so smart!', 'Superstar!'],
    cheer: ['Hooray!', 'Amazing!', 'Fantastic!', 'You did it!'],
    complete: ['You finished! You are amazing, Veera!', 'All done! Well done superstar!'],
  };
  const list = messages[type] || messages.correct;
  const msg = list[Math.floor(Math.random() * list.length)];
  speak(msg, { rate: 0.9, pitch: 1.3, volume: 1 });
}

/**
 * Speak a welcome greeting.
 */
export function speakWelcome() {
  speak('Hello Veera! Let\'s learn and have fun today!', {
    lang: 'en-IN',
    rate: 0.8,
    pitch: 1.2,
  });
}
