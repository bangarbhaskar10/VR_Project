/**
 * Exam prep data for Nursery 1st Unit Test 2026-27
 * Little Master's Pre School, Badlapur (West)
 *
 * Timetable:
 *   10 Aug – English (oral)    11 Aug – Maths (oral)
 *   12 Aug – Marathi (oral)    13 Aug – English GK (oral)
 *   14 Aug – Myself (oral)     17 Aug – Marathi Rhymes (oral)
 *   18 Aug – English Rhymes (oral)
 *   19 Aug – English (written) 20 Aug – Maths (written)
 *   21 Aug – Drawing (written)
 *
 * English Written Paper Pattern:
 *   1) Trace the following patterns
 *   2) Circle the correct picture
 *   3) Identify letter and circle the letter
 *   4) Match same letters
 *   5) Colour the correct picture
 *   6) Trace the following letters
 *
 * Maths Written Paper Pattern:
 *   1) Trace the following numbers
 *   2) Match same shapes
 *   3) Tick the big object
 *   4) Match same numbers
 *   5) Count pictures and circle the correct number
 *   6) Count pictures and match with correct number
 */

export const EXAM_TIMETABLE = [
  { date: '10th August 2026', subject: 'English',        type: 'oral',    emoji: '📖', color: '#7C3AED' },
  { date: '11th August 2026', subject: 'Maths',          type: 'oral',    emoji: '🔢', color: '#EF4444' },
  { date: '12th August 2026', subject: 'Marathi',        type: 'oral',    emoji: '📜', color: '#F97316' },
  { date: '13th August 2026', subject: 'English GK',     type: 'oral',    emoji: '🌍', color: '#10B981' },
  { date: '14th August 2026', subject: 'Myself',         type: 'oral',    emoji: '🙋', color: '#EC4899' },
  { date: '17th August 2026', subject: 'Marathi Rhymes', type: 'oral',    emoji: '🎵', color: '#8B5CF6' },
  { date: '18th August 2026', subject: 'English Rhymes', type: 'oral',    emoji: '🎶', color: '#06B6D4' },
  { date: '19th August 2026', subject: 'English',        type: 'written', emoji: '✍️', color: '#7C3AED' },
  { date: '20th August 2026', subject: 'Maths',          type: 'written', emoji: '📐', color: '#EF4444' },
  { date: '21st August 2026', subject: 'Drawing',        type: 'written', emoji: '🎨', color: '#84CC16' },
];

// ─── ORAL PRACTICE ────────────────────────────────────────────────────────────

export const ORAL_SECTIONS = [

  // ── English Oral ──────────────────────────────────────────────────────────
  {
    id: 'oral_english',
    subject: 'English',
    emoji: '📖',
    color: '#7C3AED',
    description: 'A to Z Recitation · A to E Identification',
    questions: [
      { id: 'oe1', type: 'recite', prompt: 'Say the Alphabet A to Z', lines: ['A B C D E F G', 'H I J K L M N O P', 'Q R S T U V W', 'X Y Z'], emoji: '🔤' },
      { id: 'oe2', type: 'circle_letter', question: 'Which letter does 🍎 Apple start with?', emoji: '🍎', word: 'Apple', options: [{ id:'A', label:'A', correct:true },{ id:'B', label:'B', correct:false },{ id:'C', label:'C', correct:false },{ id:'D', label:'D', correct:false }] },
      { id: 'oe3', type: 'circle_letter', question: 'Which letter does 🐶 Dog start with?',  emoji: '🐶', word: 'Dog',   options: [{ id:'D', label:'D', correct:true },{ id:'A', label:'A', correct:false },{ id:'B', label:'B', correct:false },{ id:'C', label:'C', correct:false }] },
      { id: 'oe4', type: 'circle_letter', question: 'Which letter does 🐘 Elephant start with?', emoji: '🐘', word: 'Elephant', options: [{ id:'E', label:'E', correct:true },{ id:'A', label:'A', correct:false },{ id:'D', label:'D', correct:false },{ id:'B', label:'B', correct:false }] },
      { id: 'oe5', type: 'circle_letter', question: 'Which letter does 🐱 Cat start with?',  emoji: '🐱', word: 'Cat',   options: [{ id:'C', label:'C', correct:true },{ id:'B', label:'B', correct:false },{ id:'D', label:'D', correct:false },{ id:'A', label:'A', correct:false }] },
      { id: 'oe6', type: 'circle_letter', question: 'Which letter does ⚽ Ball start with?', emoji: '⚽', word: 'Ball',  options: [{ id:'B', label:'B', correct:true },{ id:'A', label:'A', correct:false },{ id:'C', label:'C', correct:false },{ id:'D', label:'D', correct:false }] },
      { id: 'oe7', type: 'mcq', question: 'What letter comes after C?', options: [{ id:'D', label:'D', correct:true },{ id:'B', label:'B', correct:false },{ id:'E', label:'E', correct:false },{ id:'A', label:'A', correct:false }] },
      { id: 'oe8', type: 'mcq', question: 'What letter comes after A?', options: [{ id:'B', label:'B', correct:true },{ id:'C', label:'C', correct:false },{ id:'D', label:'D', correct:false },{ id:'E', label:'E', correct:false }] },
    ],
  },

  // ── Maths Oral ────────────────────────────────────────────────────────────
  {
    id: 'oral_maths',
    subject: 'Maths',
    emoji: '🔢',
    color: '#EF4444',
    description: 'Numbers 1–10 Recitation · 1–5 Identification · Counting',
    questions: [
      { id: 'om1', type: 'recite', prompt: 'Count from 1 to 10!', lines: ['1  2  3  4  5', '6  7  8  9  10'], emoji: '🔢' },
      { id: 'om2', type: 'count', question: 'How many apples?',    emoji: '🍎', count: 3,  options: ['1','2','3','4'],    answer: '3' },
      { id: 'om3', type: 'count', question: 'How many stars?',     emoji: '⭐', count: 5,  options: ['3','4','5','6'],    answer: '5' },
      { id: 'om4', type: 'count', question: 'How many balloons?',  emoji: '🎈', count: 2,  options: ['1','2','3','4'],    answer: '2' },
      { id: 'om5', type: 'count', question: 'How many cats?',      emoji: '🐱', count: 4,  options: ['2','3','4','5'],    answer: '4' },
      { id: 'om6', type: 'mcq',   question: 'Which number comes after 4?', options: [{ id:'5', label:'5', correct:true },{ id:'3', label:'3', correct:false },{ id:'6', label:'6', correct:false },{ id:'2', label:'2', correct:false }] },
      { id: 'om7', type: 'mcq',   question: 'Which number comes before 3?', options: [{ id:'2', label:'2', correct:true },{ id:'4', label:'4', correct:false },{ id:'1', label:'1', correct:false },{ id:'5', label:'5', correct:false }] },
      { id: 'om8', type: 'mcq',   question: 'Which is the biggest number?', options: [{ id:'5', label:'5', correct:true },{ id:'1', label:'1', correct:false },{ id:'3', label:'3', correct:false },{ id:'2', label:'2', correct:false }] },
    ],
  },

  // ── English GK ────────────────────────────────────────────────────────────
  {
    id: 'oral_gk',
    subject: 'English GK',
    emoji: '🌍',
    color: '#10B981',
    description: 'Fruits · Parts of the Body',
    questions: [
      { id: 'gk1', type: 'image_mcq', question: 'Which one is a fruit?', options: [{ id:'apple', label:'Apple', emoji:'🍎', correct:true },{ id:'chair', label:'Chair', emoji:'🪑', correct:false },{ id:'book', label:'Book', emoji:'📚', correct:false },{ id:'ball', label:'Ball', emoji:'⚽', correct:false }] },
      { id: 'gk2', type: 'image_mcq', question: 'Which one is a fruit?', options: [{ id:'mango', label:'Mango', emoji:'🥭', correct:true },{ id:'pen', label:'Pen', emoji:'✏️', correct:false },{ id:'table', label:'Table', emoji:'🪞', correct:false },{ id:'dog', label:'Dog', emoji:'🐶', correct:false }] },
      { id: 'gk3', type: 'image_mcq', question: 'Which one is the eye?',  options: [{ id:'eye', label:'Eye', emoji:'👁️', correct:true },{ id:'ear', label:'Ear', emoji:'👂', correct:false },{ id:'hand', label:'Hand', emoji:'✋', correct:false },{ id:'foot', label:'Foot', emoji:'🦶', correct:false }] },
      { id: 'gk4', type: 'image_mcq', question: 'Which one is the nose?', options: [{ id:'nose', label:'Nose', emoji:'👃', correct:true },{ id:'mouth', label:'Mouth', emoji:'👄', correct:false },{ id:'eye', label:'Eye', emoji:'👁️', correct:false },{ id:'ear', label:'Ear', emoji:'👂', correct:false }] },
      { id: 'gk5', type: 'mcq', question: 'How many eyes do we have?', options: [{ id:'2', label:'2', correct:true },{ id:'1', label:'1', correct:false },{ id:'3', label:'3', correct:false },{ id:'4', label:'4', correct:false }] },
      { id: 'gk6', type: 'mcq', question: 'We use our eyes to ___', options: [{ id:'see', label:'👁️ See', correct:true },{ id:'hear', label:'👂 Hear', correct:false },{ id:'smell', label:'👃 Smell', correct:false },{ id:'eat', label:'🍴 Eat', correct:false }] },
      { id: 'gk7', type: 'mcq', question: 'We use our ears to ___', options: [{ id:'hear', label:'👂 Hear', correct:true },{ id:'see', label:'👁️ See', correct:false },{ id:'walk', label:'🚶 Walk', correct:false },{ id:'smell', label:'👃 Smell', correct:false }] },
      { id: 'gk8', type: 'image_mcq', question: 'Which one is a banana?', options: [{ id:'banana', label:'Banana', emoji:'🍌', correct:true },{ id:'apple', label:'Apple', emoji:'🍎', correct:false },{ id:'grapes', label:'Grapes', emoji:'🍇', correct:false },{ id:'orange', label:'Orange', emoji:'🍊', correct:false }] },
    ],
  },

  // ── Myself ────────────────────────────────────────────────────────────────
  {
    id: 'oral_myself',
    subject: 'Myself',
    emoji: '🙋',
    color: '#EC4899',
    description: 'What is your name? · Where do you live?',
    questions: [
      { id: 'my1', type: 'recite', prompt: 'Say your name clearly!', lines: ['My name is Veera.', 'I am a good girl! 😊'], emoji: '🙋' },
      { id: 'my2', type: 'recite', prompt: 'Say where you live!', lines: ['I live in Badlapur.', 'My school is Little Master\'s Pre School.'], emoji: '🏠' },
      { id: 'my3', type: 'mcq', question: 'What school do you go to?', options: [{ id:'lm', label:"Little Master's", correct:true },{ id:'other1', label:'Sunshine School', correct:false },{ id:'other2', label:'Rainbow School', correct:false },{ id:'other3', label:'Star School', correct:false }] },
      { id: 'my4', type: 'mcq', question: 'Which class are you in?', options: [{ id:'nursery', label:'Nursery', correct:true },{ id:'kg1', label:'KG 1', correct:false },{ id:'kg2', label:'KG 2', correct:false },{ id:'class1', label:'Class 1', correct:false }] },
      { id: 'my5', type: 'image_mcq', question: 'Which is a girl?', options: [{ id:'girl', label:'Girl', emoji:'👧', correct:true },{ id:'boy', label:'Boy', emoji:'👦', correct:false },{ id:'man', label:'Man', emoji:'👨', correct:false },{ id:'woman', label:'Woman', emoji:'👩', correct:false }] },
      { id: 'my6', type: 'mcq', question: 'How many hands do you have?', options: [{ id:'2', label:'2', correct:true },{ id:'1', label:'1', correct:false },{ id:'3', label:'3', correct:false },{ id:'4', label:'4', correct:false }] },
    ],
  },

  // ── English Rhymes ────────────────────────────────────────────────────────
  {
    id: 'oral_english_rhymes',
    subject: 'English Rhymes',
    emoji: '🎶',
    color: '#06B6D4',
    description: 'Thank you God · Chubby Cheeks',
    questions: [
      {
        id: 'er1', type: 'recite',
        prompt: 'Thank You God 🙏',
        lines: [
          'Thank you God for the world so sweet,',
          'Thank you God for the food we eat,',
          'Thank you God for the birds that sing,',
          'Thank you God for everything!',
        ],
        emoji: '🙏',
      },
      {
        id: 'er2', type: 'recite',
        prompt: 'Chubby Cheeks 😊',
        lines: [
          'Chubby cheeks, dimple chin,',
          'Rosy lips, teeth within,',
          'Curly hair, very fair,',
          'Eyes are blue, lovely too!',
          'Teacher\'s pet, is that you? Yes! Yes! Yes!',
        ],
        emoji: '😊',
      },
      { id: 'er3', type: 'mcq', question: 'In "Thank you God", what do we thank God for?', options: [{ id:'everything', label:'Everything', correct:true },{ id:'nothing', label:'Nothing', correct:false },{ id:'toys', label:'Toys', correct:false },{ id:'sweets', label:'Sweets', correct:false }] },
      { id: 'er4', type: 'mcq', question: 'In "Chubby Cheeks", what colour are the eyes?', options: [{ id:'blue', label:'Blue', correct:true },{ id:'green', label:'Green', correct:false },{ id:'brown', label:'Brown', correct:false },{ id:'black', label:'Black', correct:false }] },
    ],
  },

  // ── Marathi Rhymes ────────────────────────────────────────────────────────
  {
    id: 'oral_marathi_rhymes',
    subject: 'Marathi Rhymes',
    emoji: '🎵',
    color: '#8B5CF6',
    description: 'आंघोळ · ये ग ये ग सरी',
    questions: [
      {
        id: 'mr1', type: 'recite',
        prompt: 'आंघोळ 🛁',
        lines: [
          'आंघोळ करा आंघोळ करा,',
          'स्वच्छ व्हा, सुंदर दिसा,',
          'साबण लावा, पाणी घ्या,',
          'आनंदाने आंघोळ करा!',
        ],
        emoji: '🛁',
      },
      {
        id: 'mr2', type: 'recite',
        prompt: 'ये ग ये ग सरी 🌧️',
        lines: [
          'ये ग ये ग सरी,',
          'माझ्या अंगणात भरी,',
          'ये ग ये ग पाऊसा,',
          'भिजवून टाक आम्हाला!',
        ],
        emoji: '🌧️',
      },
    ],
  },

  // ── Marathi Oral ──────────────────────────────────────────────────────────
  {
    id: 'oral_marathi',
    subject: 'Marathi',
    emoji: '📜',
    color: '#F97316',
    description: 'मुळाक्षरे अ ते अः · विकास बहुरंगी',
    questions: [
      { id: 'ma1', type: 'recite', prompt: 'मराठी स्वर सांगा!', lines: ['अ  आ  इ  ई  उ  ऊ', 'ए  ऐ  ओ  औ  अं  अः'], emoji: '📜' },
      { id: 'ma2', type: 'image_mcq', question: 'कोणते अक्षर आहे?', options: [{ id:'a', label:'अ', emoji:'अ', correct:true },{ id:'aa', label:'आ', emoji:'आ', correct:false },{ id:'e', label:'इ', emoji:'इ', correct:false },{ id:'u', label:'उ', emoji:'उ', correct:false }] },
      { id: 'ma3', type: 'image_mcq', question: '"आ" हे कोणते अक्षर?', options: [{ id:'aa', label:'आ', emoji:'आ', correct:true },{ id:'a', label:'अ', emoji:'अ', correct:false },{ id:'i', label:'इ', emoji:'इ', correct:false },{ id:'u', label:'उ', emoji:'उ', correct:false }] },
      { id: 'ma4', type: 'mcq', question: 'मराठी वर्णमालेत पहिले अक्षर कोणते?', options: [{ id:'a', label:'अ', correct:true },{ id:'aa', label:'आ', correct:false },{ id:'k', label:'क', correct:false },{ id:'ga', label:'ग', correct:false }] },
    ],
  },
];

// ─── WRITTEN PRACTICE ─────────────────────────────────────────────────────────

export const WRITTEN_SECTIONS = [

  // ── English Written ───────────────────────────────────────────────────────
  {
    id: 'written_english',
    subject: 'English — Written',
    emoji: '✍️',
    color: '#7C3AED',
    paperPattern: [
      '1) Trace the following patterns',
      '2) Circle the correct picture',
      '3) Identify letter and circle the letter',
      '4) Match same letters',
      '5) Colour the correct picture',
      '6) Trace the following letters',
    ],
    questions: [
      // Q2 – Circle the correct picture
      { id: 'we1', type: 'image_mcq', question: 'Circle the correct picture for letter A', options: [{ id:'apple', label:'Apple', emoji:'🍎', correct:true },{ id:'ball', label:'Ball', emoji:'⚽', correct:false },{ id:'cat', label:'Cat', emoji:'🐱', correct:false },{ id:'dog', label:'Dog', emoji:'🐶', correct:false }] },
      { id: 'we2', type: 'image_mcq', question: 'Circle the correct picture for letter B', options: [{ id:'ball', label:'Ball', emoji:'⚽', correct:true },{ id:'apple', label:'Apple', emoji:'🍎', correct:false },{ id:'elephant', label:'Elephant', emoji:'🐘', correct:false },{ id:'duck', label:'Duck', emoji:'🦆', correct:false }] },
      { id: 'we3', type: 'image_mcq', question: 'Circle the correct picture for letter C', options: [{ id:'cat', label:'Cat', emoji:'🐱', correct:true },{ id:'dog', label:'Dog', emoji:'🐶', correct:false },{ id:'apple', label:'Apple', emoji:'🍎', correct:false },{ id:'fish', label:'Fish', emoji:'🐟', correct:false }] },
      // Q3 – Identify letter and circle
      { id: 'we4', type: 'circle_letter', question: 'What letter does 🐘 Elephant start with?', emoji:'🐘', word:'Elephant', options:[{ id:'E', label:'E', correct:true },{ id:'A', label:'A', correct:false },{ id:'B', label:'B', correct:false },{ id:'D', label:'D', correct:false }] },
      { id: 'we5', type: 'circle_letter', question: 'What letter does 🐟 Fish start with?',    emoji:'🐟', word:'Fish',     options:[{ id:'F', label:'F', correct:true },{ id:'G', label:'G', correct:false },{ id:'E', label:'E', correct:false },{ id:'H', label:'H', correct:false }] },
      { id: 'we6', type: 'circle_letter', question: 'What letter does ☀️ Sun start with?',     emoji:'☀️', word:'Sun',      options:[{ id:'S', label:'S', correct:true },{ id:'T', label:'T', correct:false },{ id:'R', label:'R', correct:false },{ id:'M', label:'M', correct:false }] },
      // Q4 – Match same letters
      {
        id: 'we7', type: 'match',
        question: 'Match the uppercase letters to their lowercase!',
        pairs: [
          { left:{ id:'A_u', label:'A', emoji:'A' }, right:{ id:'a_l', label:'a', emoji:'a' } },
          { left:{ id:'B_u', label:'B', emoji:'B' }, right:{ id:'b_l', label:'b', emoji:'b' } },
          { left:{ id:'C_u', label:'C', emoji:'C' }, right:{ id:'c_l', label:'c', emoji:'c' } },
          { left:{ id:'D_u', label:'D', emoji:'D' }, right:{ id:'d_l', label:'d', emoji:'d' } },
        ],
      },
      {
        id: 'we8', type: 'match',
        question: 'Match the same letters!',
        pairs: [
          { left:{ id:'E_u', label:'E', emoji:'E' }, right:{ id:'e_l', label:'e', emoji:'e' } },
          { left:{ id:'F_u', label:'F', emoji:'F' }, right:{ id:'f_l', label:'f', emoji:'f' } },
          { left:{ id:'G_u', label:'G', emoji:'G' }, right:{ id:'g_l', label:'g', emoji:'g' } },
          { left:{ id:'H_u', label:'H', emoji:'H' }, right:{ id:'h_l', label:'h', emoji:'h' } },
        ],
      },
    ],
  },

  // ── Maths Written ─────────────────────────────────────────────────────────
  {
    id: 'written_maths',
    subject: 'Maths — Written',
    emoji: '📐',
    color: '#EF4444',
    paperPattern: [
      '1) Trace the following numbers',
      '2) Match same shapes',
      '3) Tick the big object',
      '4) Match same numbers',
      '5) Count pictures and circle the correct number',
      '6) Count pictures and match with correct number',
    ],
    questions: [
      // Q2 – Match same shapes
      {
        id: 'wm1', type: 'match',
        question: 'Match the same shapes!',
        pairs: [
          { left:{ id:'c1', label:'⭕', emoji:'⭕' }, right:{ id:'c2', label:'⭕', emoji:'⭕' } },
          { left:{ id:'t1', label:'🔺', emoji:'🔺' }, right:{ id:'t2', label:'🔺', emoji:'🔺' } },
          { left:{ id:'s1', label:'⬛', emoji:'⬛' }, right:{ id:'s2', label:'⬛', emoji:'⬛' } },
          { left:{ id:'st1',label:'⭐', emoji:'⭐' }, right:{ id:'st2',label:'⭐', emoji:'⭐' } },
        ],
      },
      // Q3 – Tick the big object
      { id: 'wm2', type: 'image_mcq', question: 'Which is the BIGGER animal?', options: [{ id:'elephant', label:'Elephant', emoji:'🐘', correct:true },{ id:'ant', label:'Ant', emoji:'🐜', correct:false },{ id:'mouse', label:'Mouse', emoji:'🐭', correct:false },{ id:'bee', label:'Bee', emoji:'🐝', correct:false }] },
      { id: 'wm3', type: 'image_mcq', question: 'Which is the BIGGER fruit?',  options: [{ id:'watermelon', label:'Watermelon', emoji:'🍉', correct:true },{ id:'grape', label:'Grape', emoji:'🍇', correct:false },{ id:'cherry', label:'Cherry', emoji:'🍒', correct:false },{ id:'blueberry', label:'Blueberry', emoji:'🫐', correct:false }] },
      // Q4 – Match same numbers
      {
        id: 'wm4', type: 'match',
        question: 'Match the same numbers!',
        pairs: [
          { left:{ id:'n1a', label:'1', emoji:'1' }, right:{ id:'n1b', label:'1', emoji:'1' } },
          { left:{ id:'n2a', label:'2', emoji:'2' }, right:{ id:'n2b', label:'2', emoji:'2' } },
          { left:{ id:'n3a', label:'3', emoji:'3' }, right:{ id:'n3b', label:'3', emoji:'3' } },
          { left:{ id:'n4a', label:'4', emoji:'4' }, right:{ id:'n4b', label:'4', emoji:'4' } },
        ],
      },
      // Q5 – Count and circle
      { id: 'wm5', type: 'count', question: 'Count and circle the correct number!', emoji:'🍎', count:3, options:['1','2','3','4'], answer:'3' },
      { id: 'wm6', type: 'count', question: 'Count and circle the correct number!', emoji:'⭐', count:5, options:['3','4','5','6'], answer:'5' },
      { id: 'wm7', type: 'count', question: 'Count and circle the correct number!', emoji:'🎈', count:2, options:['1','2','3','4'], answer:'2' },
      // Q6 – Count and match
      {
        id: 'wm8', type: 'match',
        question: 'Match the count to the correct number!',
        pairs: [
          { left:{ id:'s1c', label:'🌟', emoji:'🌟' },         right:{ id:'s1n', label:'1', emoji:'1' } },
          { left:{ id:'s2c', label:'🌟🌟', emoji:'🌟🌟' },       right:{ id:'s2n', label:'2', emoji:'2' } },
          { left:{ id:'s3c', label:'🌟🌟🌟', emoji:'🌟🌟🌟' },     right:{ id:'s3n', label:'3', emoji:'3' } },
          { left:{ id:'s4c', label:'🌟🌟🌟🌟', emoji:'🌟🌟🌟🌟' },   right:{ id:'s4n', label:'4', emoji:'4' } },
        ],
      },
    ],
  },
];
