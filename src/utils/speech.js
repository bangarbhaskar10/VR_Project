/**
 * speech.js — Web Speech API wrapper
 *
 * Provides TTS (text-to-speech) for the learning app.
 * Handles voice selection, language switching, and utterance queuing.
 *
 * Voice preference: Indian English (en-IN) for a warm, familiar accent for Veera.
 * Falls back gracefully through other English voices.
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

  stop();

  const {
    lang = 'en-IN',
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
 *
 * @param {string} lang - BCP-47 tag
 * @returns {SpeechSynthesisVoice|null}
 */
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const langCode = lang.toLowerCase().split('-')[0];

  if (langCode === 'en') {
    const indianByName = voices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('rishi')   ||
        n.includes('lekha')   ||
        n.includes('veena')   ||
        n.includes('moira')   ||
        n.includes('google हिन्दी') ||
        (n.includes('indian') && n.includes('english')) ||
        n.includes('en-in')
      );
    });
    if (indianByName) return indianByName;

    const enIN = voices.find((v) => v.lang.toLowerCase() === 'en-in');
    if (enIN) return enIN;

    const enGB = voices.find((v) => v.lang.toLowerCase().startsWith('en-gb'));
    if (enGB) return enGB;

    const enAll = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    const female = enAll.find((v) => {
      const n = v.name.toLowerCase();
      return n.includes('female') || n.includes('zira') ||
             n.includes('susan')  || n.includes('google uk english female');
    });
    if (female) return female;

    return enAll[0] || voices[0];
  }

  const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(langCode));
  return matching[0] || voices[0];
}

/**
 * Ensure voices are loaded (async on some browsers).
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
 */
export function speakItem(item, language = 'en') {
  if (language === 'mr' && item.marathiWord) {
    const voices = window.speechSynthesis.getVoices();
    const hasMarathi = voices.some((v) => v.lang.startsWith('mr'));
    const lang = hasMarathi ? 'mr-IN' : 'hi-IN';
    speak(`${item.marathiWord}`, { lang, rate: 0.75, pitch: 1.1 });
  } else {
    speak(item.word, { lang: 'en-IN', rate: 0.8, pitch: 1.15 });
  }
}

/**
 * Play a short, varied reward phrase — no repetitive "Superstar / Great job".
 */
export function speakReward(type) {
  const messages = {
    correct: ['Well done!', 'Correct!', 'That is right!', 'Yes!', 'Good one!'],
    cheer:   ['Hooray!', 'Amazing!', 'Fantastic!', 'You did it!'],
    complete:['You finished! Well done, Veera!', 'All done! Great work!'],
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
