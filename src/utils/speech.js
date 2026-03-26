/**
 * speech.js — Web Speech API wrapper
 *
 * Provides TTS (text-to-speech) for the learning app.
 * Handles voice selection, language switching, and utterance queuing.
 */

/** Currently active utterance — cancel before speaking new text */
let currentUtterance = null;

/**
 * Speak text aloud using the Web Speech API.
 *
 * @param {string} text        - Text to speak
 * @param {object} [options]   - Options
 * @param {string} [options.lang='en-US']  - BCP-47 language tag
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
    lang = 'en-US',
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
 * Prefers female / child-friendly voices.
 *
 * @param {string} lang - BCP-47 tag
 * @returns {SpeechSynthesisVoice|null}
 */
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const langCode = lang.toLowerCase().split('-')[0]; // e.g., 'en', 'mr', 'hi'

  // Priority: exact lang match → female → any match
  const matching = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(langCode)
  );

  // Prefer female voices for warmth
  const female = matching.find(
    (v) =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('fiona') ||
      v.name.toLowerCase().includes('moira') ||
      v.name.toLowerCase().includes('tessa') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('susan') ||
      v.name.toLowerCase().includes('google us english')
  );

  return female || matching[0] || voices[0];
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
    speak(item.word, { lang: 'en-US', rate: 0.8, pitch: 1.15 });
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
    lang: 'en-US',
    rate: 0.8,
    pitch: 1.2,
  });
}
