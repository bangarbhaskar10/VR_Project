/**
 * speech.js — Web Speech API wrapper
 *
 * Provides TTS (text-to-speech) for the learning app.
 * Handles voice selection, language switching, and utterance queuing.
 *
 * Voice preference: natural / neural voices for a warm, human-sounding instructor,
 * with Indian English (en-IN) accent preferred for a familiar sound for Veera.
 * Falls back gracefully through other high-quality English voices.
 *
 * The biggest quality win comes from picking a browser "Natural"/"Neural"/"Enhanced"
 * voice (e.g. Microsoft Neerja/Aria/Ana, Google, Apple Enhanced) and keeping the
 * pitch close to natural (≈1.0) instead of an artificial high pitch.
 */

/** Currently active utterance — cancel before speaking new text */
let currentUtterance = null;

/** Cache the chosen voice per language so it stays consistent + avoids re-scan cost */
const voiceCache = {};

/**
 * Speak text aloud using the Web Speech API.
 *
 * @param {string} text        - Text to speak
 * @param {object} [options]   - Options
 * @param {string} [options.lang='en-IN']  - BCP-47 language tag
 * @param {number} [options.rate=0.9]      - Speed (0.1–10), gentle for toddlers
 * @param {number} [options.pitch=1.05]    - Pitch (0–2), near-natural for a human sound
 * @param {number} [options.volume=1]      - Volume (0–1)
 * @param {Function} [options.onEnd]       - Callback when speech ends
 */
export function speak(text, options = {}) {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  stop();

  const {
    lang = 'en-IN',   // Indian English accent by default
    rate = 0.9,       // natural, unhurried pace
    pitch = 1.05,     // near-natural pitch — warm but not squeaky
    volume = 1,
    onEnd,
  } = options;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  // Clamp prosody to a human-sounding range no matter what a call site passes.
  // High pitch (≈1.2–1.3) is what makes TTS sound robotic/squeaky; capping at
  // 1.15 keeps reward voices a touch brighter than instruction, never cartoonish.
  utterance.rate = Math.min(Math.max(rate, 0.7), 1.1);
  utterance.pitch = Math.min(Math.max(pitch, 0.9), 1.15);
  utterance.volume = volume;

  if (onEnd) utterance.onend = onEnd;

  // Pick the most natural / human-sounding voice available
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
 * Signals in a voice name that indicate a modern, human-sounding voice.
 * Browsers label their high-quality neural voices with these words.
 */
const NATURAL_HINTS = ['natural', 'neural', 'online', 'enhanced', 'premium', 'siri'];

/** Named voices known to sound especially warm & human, best first. */
const PREFERRED_NAMES = [
  'neerja',   // Microsoft Indian English female (Natural) — ideal for Veera
  'aria',     // Microsoft US English female (Natural)
  'jenny',    // Microsoft US English female (Natural)
  'ana',      // Microsoft US English child voice (Natural)
  'sonia',    // Microsoft UK English female (Natural)
  'libby',    // Microsoft UK English female (Natural)
  'ava',      // Apple US English female (Enhanced/Premium)
  'samantha', // Apple US English female
  'veena',    // macOS Indian English female
  'lekha',    // Chrome Indian English female
  'rishi',    // iOS/macOS Indian English
];

/**
 * Score a voice for how human & appropriate it sounds for our app.
 * Higher is better. Used to rank all candidate voices for a language.
 *
 * @param {SpeechSynthesisVoice} v
 * @param {string} langCode - 'en', 'mr', 'hi'
 */
function scoreVoice(v, langCode) {
  const name = v.name.toLowerCase();
  const vlang = v.lang.toLowerCase();
  let score = 0;

  // Must roughly match the target language family
  if (!vlang.startsWith(langCode)) return -1;

  // Big boost for known warm/human named voices (earlier = better)
  const nameIdx = PREFERRED_NAMES.findIndex((n) => name.includes(n));
  if (nameIdx !== -1) score += 100 - nameIdx * 2;

  // Boost for "natural / neural / enhanced" quality markers
  if (NATURAL_HINTS.some((h) => name.includes(h))) score += 60;

  // Online (cloud/neural) voices are typically far more natural than local ones
  if (v.localService === false) score += 25;

  // For English, prefer Indian accent, then UK, over US
  if (langCode === 'en') {
    if (vlang === 'en-in' || name.includes('india')) score += 40;
    else if (vlang.startsWith('en-gb')) score += 15;
  }

  // Gentle nudge toward female voices (warmer for a toddler instructor)
  if (name.includes('female') || name.includes('woman')) score += 5;

  return score;
}

/**
 * Pick the best available voice for the given language.
 * Prefers modern natural/neural voices for a human sound, with Indian English
 * accent preferred for English. Falls back gracefully to any matching voice.
 *
 * @param {string} lang - BCP-47 tag
 * @returns {SpeechSynthesisVoice|null}
 */
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const langCode = lang.toLowerCase().split('-')[0]; // 'en', 'mr', 'hi'

  // Return cached choice if we already resolved one for this language
  if (voiceCache[langCode]) return voiceCache[langCode];

  // Rank all voices that match the language by human-ness score
  const ranked = voices
    .map((v) => ({ v, s: scoreVoice(v, langCode) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s);

  let chosen = ranked.length ? ranked[0].v : null;

  // Marathi often has no dedicated voice — fall back to Hindi, then anything
  if (!chosen && langCode === 'mr') {
    chosen = voices.find((v) => v.lang.toLowerCase().startsWith('hi')) || null;
  }
  if (!chosen) chosen = voices[0];

  voiceCache[langCode] = chosen;
  return chosen;
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
      // Voices arrived after first paint — clear any early cached choice so the
      // best natural voice gets re-selected now that the full list is available.
      Object.keys(voiceCache).forEach((k) => delete voiceCache[k]);
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
    speak(`${item.marathiWord}`, { lang, rate: 0.82, pitch: 1.0 });
  } else {
    speak(item.word, { lang: 'en-IN', rate: 0.88, pitch: 1.05 });
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
  // A little brighter & livelier for rewards, but still human — not squeaky.
  speak(msg, { rate: 0.95, pitch: 1.12, volume: 1 });
}

/**
 * Speak a welcome greeting.
 */
export function speakWelcome() {
  speak('Hello Veera! Let\'s learn and have fun today!', {
    lang: 'en-IN',
    rate: 0.9,
    pitch: 1.05,
  });
}
