/**
 * Worksheet data for Pre-Nursery and Nursery exam preparation.
 * Each sheet has a set of questions with type-specific rendering.
 *
 * Question types:
 *  - mcq        : multiple choice (text options)
 *  - image_mcq  : multiple choice (emoji options)
 *  - fill       : fill in the blank (typed answer)
 *  - match      : match the column (drag / tap)
 *  - count      : count emojis and pick number
 *  - sequence   : put items in the correct order
 *  - truefalse  : true or false
 */

// ─── PRE-NURSERY ──────────────────────────────────────────────────────────────

const preNurseryEnglish = [
  {
    id: 'pne_01',
    title: 'Big Letters A to E',
    emoji: '🔤',
    color: '#7C3AED',
    questions: [
      {
        id: 'q1', type: 'image_mcq',
        question: 'Which picture starts with the letter A?',
        letter: 'A',
        options: [
          { id: 'apple',   label: 'Apple',      emoji: '🍎', correct: true  },
          { id: 'banana',  label: 'Banana',     emoji: '🍌', correct: false },
          { id: 'cat',     label: 'Cat',        emoji: '🐱', correct: false },
          { id: 'dog',     label: 'Dog',        emoji: '🐶', correct: false },
        ],
      },
      {
        id: 'q2', type: 'image_mcq',
        question: 'Which picture starts with the letter B?',
        letter: 'B',
        options: [
          { id: 'ball',    label: 'Ball',       emoji: '⚽', correct: true  },
          { id: 'mango',   label: 'Mango',      emoji: '🥭', correct: false },
          { id: 'sun',     label: 'Sun',        emoji: '☀️', correct: false },
          { id: 'fish',    label: 'Fish',       emoji: '🐟', correct: false },
        ],
      },
      {
        id: 'q3', type: 'mcq',
        question: 'What comes after the letter A?',
        options: [
          { id: 'B', label: 'B', correct: true  },
          { id: 'C', label: 'C', correct: false },
          { id: 'D', label: 'D', correct: false },
          { id: 'Z', label: 'Z', correct: false },
        ],
      },
      {
        id: 'q4', type: 'image_mcq',
        question: 'Which picture starts with the letter C?',
        letter: 'C',
        options: [
          { id: 'cat',     label: 'Cat',        emoji: '🐱', correct: true  },
          { id: 'elephant',label: 'Elephant',   emoji: '🐘', correct: false },
          { id: 'rabbit',  label: 'Rabbit',     emoji: '🐰', correct: false },
          { id: 'lemon',   label: 'Lemon',      emoji: '🍋', correct: false },
        ],
      },
      {
        id: 'q5', type: 'image_mcq',
        question: 'Which picture starts with the letter D?',
        letter: 'D',
        options: [
          { id: 'dog',     label: 'Dog',        emoji: '🐶', correct: true  },
          { id: 'apple',   label: 'Apple',      emoji: '🍎', correct: false },
          { id: 'cow',     label: 'Cow',        emoji: '🐮', correct: false },
          { id: 'star',    label: 'Star',       emoji: '⭐', correct: false },
        ],
      },
      {
        id: 'q6', type: 'image_mcq',
        question: 'Which picture starts with the letter E?',
        letter: 'E',
        options: [
          { id: 'elephant',label: 'Elephant',   emoji: '🐘', correct: true  },
          { id: 'frog',    label: 'Frog',       emoji: '🐸', correct: false },
          { id: 'grape',   label: 'Grape',      emoji: '🍇', correct: false },
          { id: 'hat',     label: 'Hat',        emoji: '🎩', correct: false },
        ],
      },
      {
        id: 'q7', type: 'truefalse',
        question: 'The letter B comes before the letter A.',
        answer: false,
        hint: 'A comes first in the alphabet!',
      },
      {
        id: 'q8', type: 'mcq',
        question: 'How many letters are in the word CAT?',
        options: [
          { id: '3', label: '3', correct: true  },
          { id: '2', label: '2', correct: false },
          { id: '4', label: '4', correct: false },
          { id: '5', label: '5', correct: false },
        ],
      },
    ],
  },
  {
    id: 'pne_02',
    title: 'My Body Words',
    emoji: '🙋',
    color: '#EC4899',
    questions: [
      {
        id: 'q1', type: 'image_mcq',
        question: 'Which one is the eye?',
        options: [
          { id: 'eye',  label: 'Eye',  emoji: '👁️', correct: true  },
          { id: 'ear',  label: 'Ear',  emoji: '👂', correct: false },
          { id: 'hand', label: 'Hand', emoji: '✋', correct: false },
          { id: 'foot', label: 'Foot', emoji: '🦶', correct: false },
        ],
      },
      {
        id: 'q2', type: 'image_mcq',
        question: 'Which one is the nose?',
        options: [
          { id: 'nose', label: 'Nose', emoji: '👃', correct: true  },
          { id: 'mouth',label: 'Mouth',emoji: '👄', correct: false },
          { id: 'eye',  label: 'Eye',  emoji: '👁️', correct: false },
          { id: 'leg',  label: 'Leg',  emoji: '🦵', correct: false },
        ],
      },
      {
        id: 'q3', type: 'mcq',
        question: 'How many eyes do we have?',
        options: [
          { id: '2', label: '2', correct: true  },
          { id: '1', label: '1', correct: false },
          { id: '3', label: '3', correct: false },
          { id: '4', label: '4', correct: false },
        ],
      },
      {
        id: 'q4', type: 'truefalse',
        question: 'We have two hands.',
        answer: true,
        hint: 'Count your hands!',
      },
      {
        id: 'q5', type: 'image_mcq',
        question: 'Which one is the mouth?',
        options: [
          { id: 'mouth', label: 'Mouth', emoji: '👄', correct: true  },
          { id: 'ear',   label: 'Ear',   emoji: '👂', correct: false },
          { id: 'nose',  label: 'Nose',  emoji: '👃', correct: false },
          { id: 'eye',   label: 'Eye',   emoji: '👁️', correct: false },
        ],
      },
      {
        id: 'q6', type: 'mcq',
        question: 'We use our eyes to ___',
        options: [
          { id: 'see',   label: '👁️ See',   correct: true  },
          { id: 'hear',  label: '👂 Hear',  correct: false },
          { id: 'smell', label: '👃 Smell', correct: false },
          { id: 'taste', label: '👅 Taste', correct: false },
        ],
      },
      {
        id: 'q7', type: 'mcq',
        question: 'We use our ears to ___',
        options: [
          { id: 'hear',  label: '👂 Hear',  correct: true  },
          { id: 'see',   label: '👁️ See',   correct: false },
          { id: 'walk',  label: '🚶 Walk',  correct: false },
          { id: 'eat',   label: '🍴 Eat',   correct: false },
        ],
      },
      {
        id: 'q8', type: 'mcq',
        question: 'How many fingers do we have on one hand?',
        options: [
          { id: '5', label: '5', correct: true  },
          { id: '4', label: '4', correct: false },
          { id: '6', label: '6', correct: false },
          { id: '3', label: '3', correct: false },
        ],
      },
    ],
  },
  {
    id: 'pne_03',
    title: 'Animals Around Us',
    emoji: '🐾',
    color: '#F97316',
    questions: [
      {
        id: 'q1', type: 'image_mcq',
        question: 'Which animal says MOO?',
        options: [
          { id: 'cow',  label: 'Cow',  emoji: '🐮', correct: true  },
          { id: 'dog',  label: 'Dog',  emoji: '🐶', correct: false },
          { id: 'cat',  label: 'Cat',  emoji: '🐱', correct: false },
          { id: 'duck', label: 'Duck', emoji: '🦆', correct: false },
        ],
      },
      {
        id: 'q2', type: 'image_mcq',
        question: 'Which animal says WOOF?',
        options: [
          { id: 'dog',  label: 'Dog',  emoji: '🐶', correct: true  },
          { id: 'cat',  label: 'Cat',  emoji: '🐱', correct: false },
          { id: 'cow',  label: 'Cow',  emoji: '🐮', correct: false },
          { id: 'frog', label: 'Frog', emoji: '🐸', correct: false },
        ],
      },
      {
        id: 'q3', type: 'image_mcq',
        question: 'Which animal lives in water?',
        options: [
          { id: 'fish', label: 'Fish', emoji: '🐟', correct: true  },
          { id: 'lion', label: 'Lion', emoji: '🦁', correct: false },
          { id: 'cat',  label: 'Cat',  emoji: '🐱', correct: false },
          { id: 'bird', label: 'Bird', emoji: '🐦', correct: false },
        ],
      },
      {
        id: 'q4', type: 'truefalse',
        question: 'A cat says MEOW.',
        answer: true,
        hint: 'What sound does a cat make?',
      },
      {
        id: 'q5', type: 'image_mcq',
        question: 'Which animal can fly?',
        options: [
          { id: 'bird',  label: 'Bird',  emoji: '🐦', correct: true  },
          { id: 'dog',   label: 'Dog',   emoji: '🐶', correct: false },
          { id: 'horse', label: 'Horse', emoji: '🐴', correct: false },
          { id: 'frog',  label: 'Frog',  emoji: '🐸', correct: false },
        ],
      },
      {
        id: 'q6', type: 'image_mcq',
        question: 'Which is the biggest animal?',
        options: [
          { id: 'elephant', label: 'Elephant', emoji: '🐘', correct: true  },
          { id: 'rabbit',   label: 'Rabbit',   emoji: '🐰', correct: false },
          { id: 'ant',      label: 'Ant',      emoji: '🐜', correct: false },
          { id: 'mouse',    label: 'Mouse',    emoji: '🐭', correct: false },
        ],
      },
      {
        id: 'q7', type: 'truefalse',
        question: 'A duck can swim.',
        answer: true,
        hint: 'Ducks love water!',
      },
      {
        id: 'q8', type: 'mcq',
        question: 'Which animal gives us milk?',
        options: [
          { id: 'cow',  label: '🐮 Cow',  correct: true  },
          { id: 'dog',  label: '🐶 Dog',  correct: false },
          { id: 'fish', label: '🐟 Fish', correct: false },
          { id: 'bird', label: '🐦 Bird', correct: false },
        ],
      },
    ],
  },
];

const preNurseryMaths = [
  {
    id: 'pnm_01',
    title: 'Numbers 1 to 5',
    emoji: '🔢',
    color: '#EF4444',
    questions: [
      {
        id: 'q1', type: 'count',
        question: 'How many apples are there?',
        emoji: '🍎',
        count: 3,
        options: ['1', '2', '3', '4'],
        answer: '3',
      },
      {
        id: 'q2', type: 'count',
        question: 'How many stars are there?',
        emoji: '⭐',
        count: 2,
        options: ['1', '2', '3', '5'],
        answer: '2',
      },
      {
        id: 'q3', type: 'mcq',
        question: 'What number comes after 3?',
        options: [
          { id: '4', label: '4', correct: true  },
          { id: '2', label: '2', correct: false },
          { id: '5', label: '5', correct: false },
          { id: '1', label: '1', correct: false },
        ],
      },
      {
        id: 'q4', type: 'count',
        question: 'How many balloons are there?',
        emoji: '🎈',
        count: 5,
        options: ['3', '4', '5', '6'],
        answer: '5',
      },
      {
        id: 'q5', type: 'mcq',
        question: 'Which number is the biggest?',
        options: [
          { id: '5', label: '5', correct: true  },
          { id: '1', label: '1', correct: false },
          { id: '3', label: '3', correct: false },
          { id: '2', label: '2', correct: false },
        ],
      },
      {
        id: 'q6', type: 'count',
        question: 'How many flowers are there?',
        emoji: '🌸',
        count: 4,
        options: ['2', '3', '4', '5'],
        answer: '4',
      },
      {
        id: 'q7', type: 'truefalse',
        question: '2 is greater than 4.',
        answer: false,
        hint: '4 is the bigger number!',
      },
      {
        id: 'q8', type: 'mcq',
        question: 'What number comes before 3?',
        options: [
          { id: '2', label: '2', correct: true  },
          { id: '4', label: '4', correct: false },
          { id: '5', label: '5', correct: false },
          { id: '1', label: '1', correct: false },
        ],
      },
    ],
  },
  {
    id: 'pnm_02',
    title: 'Shapes Fun',
    emoji: '🔷',
    color: '#10B981',
    questions: [
      {
        id: 'q1', type: 'image_mcq',
        question: 'Which one is a circle?',
        options: [
          { id: 'circle',   label: 'Circle',   emoji: '⭕', correct: true  },
          { id: 'square',   label: 'Square',   emoji: '⬛', correct: false },
          { id: 'triangle', label: 'Triangle', emoji: '🔺', correct: false },
          { id: 'star',     label: 'Star',     emoji: '⭐', correct: false },
        ],
      },
      {
        id: 'q2', type: 'image_mcq',
        question: 'Which one is a triangle?',
        options: [
          { id: 'triangle', label: 'Triangle', emoji: '🔺', correct: true  },
          { id: 'circle',   label: 'Circle',   emoji: '⭕', correct: false },
          { id: 'diamond',  label: 'Diamond',  emoji: '💎', correct: false },
          { id: 'heart',    label: 'Heart',    emoji: '❤️', correct: false },
        ],
      },
      {
        id: 'q3', type: 'mcq',
        question: 'A circle has ___ corners.',
        options: [
          { id: '0', label: '0', correct: true  },
          { id: '3', label: '3', correct: false },
          { id: '4', label: '4', correct: false },
          { id: '2', label: '2', correct: false },
        ],
      },
      {
        id: 'q4', type: 'truefalse',
        question: 'A square has 4 sides.',
        answer: true,
        hint: 'Count the sides of a square!',
      },
      {
        id: 'q5', type: 'mcq',
        question: 'A triangle has ___ sides.',
        options: [
          { id: '3', label: '3', correct: true  },
          { id: '4', label: '4', correct: false },
          { id: '2', label: '2', correct: false },
          { id: '5', label: '5', correct: false },
        ],
      },
      {
        id: 'q6', type: 'image_mcq',
        question: 'The sun is shaped like a ___',
        options: [
          { id: 'circle',   label: 'Circle',   emoji: '⭕', correct: true  },
          { id: 'triangle', label: 'Triangle', emoji: '🔺', correct: false },
          { id: 'square',   label: 'Square',   emoji: '⬛', correct: false },
          { id: 'rectangle',label: 'Rectangle',emoji: '▬',  correct: false },
        ],
      },
      {
        id: 'q7', type: 'truefalse',
        question: 'A triangle has 4 corners.',
        answer: false,
        hint: 'A triangle has only 3 corners!',
      },
      {
        id: 'q8', type: 'image_mcq',
        question: 'A book is shaped like a ___',
        options: [
          { id: 'rectangle', label: 'Rectangle', emoji: '▬',  correct: true  },
          { id: 'circle',    label: 'Circle',    emoji: '⭕', correct: false },
          { id: 'triangle',  label: 'Triangle',  emoji: '🔺', correct: false },
          { id: 'star',      label: 'Star',      emoji: '⭐', correct: false },
        ],
      },
    ],
  },
  {
    id: 'pnm_03',
    title: 'Big & Small',
    emoji: '📏',
    color: '#0EA5E9',
    questions: [
      {
        id: 'q1', type: 'image_mcq',
        question: 'Which animal is bigger?',
        options: [
          { id: 'elephant', label: 'Elephant', emoji: '🐘', correct: true  },
          { id: 'ant',      label: 'Ant',      emoji: '🐜', correct: false },
          { id: 'mouse',    label: 'Mouse',    emoji: '🐭', correct: false },
          { id: 'bee',      label: 'Bee',      emoji: '🐝', correct: false },
        ],
      },
      {
        id: 'q2', type: 'image_mcq',
        question: 'Which fruit is smaller?',
        options: [
          { id: 'grape',     label: 'Grape',     emoji: '🍇', correct: true  },
          { id: 'watermelon',label: 'Watermelon',emoji: '🍉', correct: false },
          { id: 'pineapple', label: 'Pineapple', emoji: '🍍', correct: false },
          { id: 'mango',     label: 'Mango',     emoji: '🥭', correct: false },
        ],
      },
      {
        id: 'q3', type: 'truefalse',
        question: 'A whale is bigger than a fish.',
        answer: true,
        hint: 'Whales are very big!',
      },
      {
        id: 'q4', type: 'count',
        question: 'How many butterflies?',
        emoji: '🦋',
        count: 1,
        options: ['1', '2', '3', '4'],
        answer: '1',
      },
      {
        id: 'q5', type: 'mcq',
        question: 'Which number is smaller?',
        options: [
          { id: '1', label: '1', correct: true  },
          { id: '5', label: '5', correct: false },
          { id: '4', label: '4', correct: false },
          { id: '3', label: '3', correct: false },
        ],
      },
      {
        id: 'q6', type: 'truefalse',
        question: '5 is smaller than 2.',
        answer: false,
        hint: '5 is actually bigger than 2!',
      },
      {
        id: 'q7', type: 'image_mcq',
        question: 'Which one is taller?',
        options: [
          { id: 'giraffe', label: 'Giraffe', emoji: '🦒', correct: true  },
          { id: 'rabbit',  label: 'Rabbit',  emoji: '🐰', correct: false },
          { id: 'cat',     label: 'Cat',     emoji: '🐱', correct: false },
          { id: 'dog',     label: 'Dog',     emoji: '🐶', correct: false },
        ],
      },
      {
        id: 'q8', type: 'mcq',
        question: 'Which number is bigger — 3 or 5?',
        options: [
          { id: '5', label: '5', correct: true  },
          { id: '3', label: '3', correct: false },
          { id: '2', label: '2', correct: false },
          { id: '1', label: '1', correct: false },
        ],
      },
    ],
  },
];

// ─── NURSERY ──────────────────────────────────────────────────────────────────

const nurseryEnglish = [
  {
    id: 'nye_01',
    title: 'Alphabet A to Z',
    emoji: '🔡',
    color: '#7C3AED',
    questions: [
      {
        id: 'q1', type: 'image_mcq',
        question: 'Which picture starts with F?',
        options: [
          { id: 'fish',   label: 'Fish',   emoji: '🐟', correct: true  },
          { id: 'goat',   label: 'Goat',   emoji: '🐐', correct: false },
          { id: 'hat',    label: 'Hat',    emoji: '🎩', correct: false },
          { id: 'ice',    label: 'Ice',    emoji: '🧊', correct: false },
        ],
      },
      {
        id: 'q2', type: 'image_mcq',
        question: 'Which picture starts with G?',
        options: [
          { id: 'grapes', label: 'Grapes', emoji: '🍇', correct: true  },
          { id: 'frog',   label: 'Frog',   emoji: '🐸', correct: false },
          { id: 'horse',  label: 'Horse',  emoji: '🐴', correct: false },
          { id: 'igloo',  label: 'Igloo',  emoji: '🏠', correct: false },
        ],
      },
      {
        id: 'q3', type: 'mcq',
        question: 'What comes after the letter J in the alphabet?',
        options: [
          { id: 'K', label: 'K', correct: true  },
          { id: 'L', label: 'L', correct: false },
          { id: 'I', label: 'I', correct: false },
          { id: 'M', label: 'M', correct: false },
        ],
      },
      {
        id: 'q4', type: 'image_mcq',
        question: 'Which picture starts with M?',
        options: [
          { id: 'monkey', label: 'Monkey', emoji: '🐒', correct: true  },
          { id: 'nest',   label: 'Nest',   emoji: '🪹', correct: false },
          { id: 'owl',    label: 'Owl',    emoji: '🦉', correct: false },
          { id: 'lion',   label: 'Lion',   emoji: '🦁', correct: false },
        ],
      },
      {
        id: 'q5', type: 'truefalse',
        question: 'The letter Z is the last letter of the alphabet.',
        answer: true,
        hint: 'A, B, C … all the way to Z!',
      },
      {
        id: 'q6', type: 'mcq',
        question: 'How many letters are in the alphabet?',
        options: [
          { id: '26', label: '26', correct: true  },
          { id: '24', label: '24', correct: false },
          { id: '28', label: '28', correct: false },
          { id: '20', label: '20', correct: false },
        ],
      },
      {
        id: 'q7', type: 'image_mcq',
        question: 'Which picture starts with S?',
        options: [
          { id: 'sun',    label: 'Sun',    emoji: '☀️', correct: true  },
          { id: 'tiger',  label: 'Tiger',  emoji: '🐯', correct: false },
          { id: 'umbrella',label:'Umbrella',emoji:'☂️', correct: false },
          { id: 'rain',   label: 'Rain',   emoji: '🌧️', correct: false },
        ],
      },
      {
        id: 'q8', type: 'mcq',
        question: 'The word "CAT" has vowel ___',
        options: [
          { id: 'A', label: 'A', correct: true  },
          { id: 'B', label: 'B', correct: false },
          { id: 'C', label: 'C', correct: false },
          { id: 'T', label: 'T', correct: false },
        ],
      },
      {
        id: 'q9', type: 'mcq',
        question: 'Which letter is a vowel?',
        options: [
          { id: 'E', label: 'E', correct: true  },
          { id: 'B', label: 'B', correct: false },
          { id: 'D', label: 'D', correct: false },
          { id: 'F', label: 'F', correct: false },
        ],
      },
      {
        id: 'q10', type: 'truefalse',
        question: 'The letter A is a vowel.',
        answer: true,
        hint: 'Vowels are A, E, I, O, U!',
      },
    ],
  },
  {
    id: 'nye_02',
    title: 'Simple Words',
    emoji: '📝',
    color: '#F59E0B',
    questions: [
      {
        id: 'q1', type: 'image_mcq',
        question: 'What is this? 🐶',
        options: [
          { id: 'dog', label: 'DOG', emoji: '🐶', correct: true  },
          { id: 'cat', label: 'CAT', emoji: '🐱', correct: false },
          { id: 'cow', label: 'COW', emoji: '🐮', correct: false },
          { id: 'hen', label: 'HEN', emoji: '🐔', correct: false },
        ],
      },
      {
        id: 'q2', type: 'image_mcq',
        question: 'What is this? ☀️',
        options: [
          { id: 'sun',  label: 'SUN',  emoji: '☀️', correct: true  },
          { id: 'moon', label: 'MOON', emoji: '🌙', correct: false },
          { id: 'star', label: 'STAR', emoji: '⭐', correct: false },
          { id: 'rain', label: 'RAIN', emoji: '🌧️', correct: false },
        ],
      },
      {
        id: 'q3', type: 'mcq',
        question: 'Fill in the blank: ___ is red.',
        options: [
          { id: 'apple',  label: '🍎 Apple',  correct: true  },
          { id: 'banana', label: '🍌 Banana', correct: false },
          { id: 'grapes', label: '🍇 Grapes', correct: false },
          { id: 'mango',  label: '🥭 Mango',  correct: false },
        ],
      },
      {
        id: 'q4', type: 'image_mcq',
        question: 'What is this? 🚗',
        options: [
          { id: 'car',  label: 'CAR',  emoji: '🚗', correct: true  },
          { id: 'bus',  label: 'BUS',  emoji: '🚌', correct: false },
          { id: 'bike', label: 'BIKE', emoji: '🚲', correct: false },
          { id: 'boat', label: 'BOAT', emoji: '⛵', correct: false },
        ],
      },
      {
        id: 'q5', type: 'truefalse',
        question: 'A mango is a fruit.',
        answer: true,
        hint: 'Mangoes grow on trees!',
      },
      {
        id: 'q6', type: 'mcq',
        question: 'The sky is ___',
        options: [
          { id: 'blue',   label: '🔵 Blue',   correct: true  },
          { id: 'red',    label: '🔴 Red',    correct: false },
          { id: 'green',  label: '🟢 Green',  correct: false },
          { id: 'yellow', label: '🟡 Yellow', correct: false },
        ],
      },
      {
        id: 'q7', type: 'image_mcq',
        question: 'What do we sit on?',
        options: [
          { id: 'chair', label: 'Chair', emoji: '🪑', correct: true  },
          { id: 'book',  label: 'Book',  emoji: '📚', correct: false },
          { id: 'pen',   label: 'Pen',   emoji: '✏️', correct: false },
          { id: 'ball',  label: 'Ball',  emoji: '⚽', correct: false },
        ],
      },
      {
        id: 'q8', type: 'mcq',
        question: 'Grass is ___',
        options: [
          { id: 'green',  label: '🟢 Green',  correct: true  },
          { id: 'blue',   label: '🔵 Blue',   correct: false },
          { id: 'red',    label: '🔴 Red',    correct: false },
          { id: 'orange', label: '🟠 Orange', correct: false },
        ],
      },
      {
        id: 'q9', type: 'truefalse',
        question: 'We drink milk from a cow.',
        answer: true,
        hint: 'Cows give us milk!',
      },
      {
        id: 'q10', type: 'image_mcq',
        question: 'What do we write with?',
        options: [
          { id: 'pencil', label: 'Pencil', emoji: '✏️', correct: true  },
          { id: 'spoon',  label: 'Spoon',  emoji: '🥄', correct: false },
          { id: 'ball',   label: 'Ball',   emoji: '⚽', correct: false },
          { id: 'cup',    label: 'Cup',    emoji: '☕', correct: false },
        ],
      },
    ],
  },
  {
    id: 'nye_03',
    title: 'Opposite Words',
    emoji: '↔️',
    color: '#8B5CF6',
    questions: [
      {
        id: 'q1', type: 'mcq',
        question: 'What is the opposite of BIG?',
        options: [
          { id: 'small',  label: '🤏 Small',  correct: true  },
          { id: 'tall',   label: '↕️ Tall',   correct: false },
          { id: 'heavy',  label: '⚖️ Heavy',  correct: false },
          { id: 'long',   label: '📏 Long',   correct: false },
        ],
      },
      {
        id: 'q2', type: 'mcq',
        question: 'What is the opposite of HOT?',
        options: [
          { id: 'cold',  label: '🥶 Cold',  correct: true  },
          { id: 'warm',  label: '🌡️ Warm',  correct: false },
          { id: 'dry',   label: '🏜️ Dry',   correct: false },
          { id: 'sunny', label: '☀️ Sunny', correct: false },
        ],
      },
      {
        id: 'q3', type: 'mcq',
        question: 'What is the opposite of DAY?',
        options: [
          { id: 'night',   label: '🌙 Night',   correct: true  },
          { id: 'morning', label: '🌅 Morning', correct: false },
          { id: 'evening', label: '🌆 Evening', correct: false },
          { id: 'noon',    label: '☀️ Noon',    correct: false },
        ],
      },
      {
        id: 'q4', type: 'truefalse',
        question: 'The opposite of UP is DOWN.',
        answer: true,
        hint: 'Up and Down are opposites!',
      },
      {
        id: 'q5', type: 'mcq',
        question: 'What is the opposite of HAPPY?',
        options: [
          { id: 'sad',   label: '😢 Sad',   correct: true  },
          { id: 'tired', label: '😴 Tired', correct: false },
          { id: 'angry', label: '😠 Angry', correct: false },
          { id: 'funny', label: '😄 Funny', correct: false },
        ],
      },
      {
        id: 'q6', type: 'mcq',
        question: 'What is the opposite of OPEN?',
        options: [
          { id: 'closed', label: '🚪 Closed', correct: true  },
          { id: 'broken', label: '💔 Broken', correct: false },
          { id: 'empty',  label: '🫙 Empty',  correct: false },
          { id: 'wide',   label: '↔️ Wide',   correct: false },
        ],
      },
      {
        id: 'q7', type: 'truefalse',
        question: 'The opposite of BLACK is WHITE.',
        answer: true,
        hint: 'Black and White are opposites!',
      },
      {
        id: 'q8', type: 'mcq',
        question: 'What is the opposite of FAST?',
        options: [
          { id: 'slow',  label: '🐢 Slow',  correct: true  },
          { id: 'quick', label: '🐇 Quick', correct: false },
          { id: 'loud',  label: '📢 Loud',  correct: false },
          { id: 'tall',  label: '↕️ Tall',  correct: false },
        ],
      },
      {
        id: 'q9', type: 'mcq',
        question: 'What is the opposite of IN?',
        options: [
          { id: 'out',   label: '🚪 Out',   correct: true  },
          { id: 'under', label: '⬇️ Under', correct: false },
          { id: 'over',  label: '⬆️ Over',  correct: false },
          { id: 'near',  label: '📍 Near',  correct: false },
        ],
      },
      {
        id: 'q10', type: 'truefalse',
        question: 'The opposite of TALL is SHORT.',
        answer: true,
        hint: 'Tall and Short are opposites!',
      },
    ],
  },
];

const nurseryMaths = [
  {
    id: 'nym_01',
    title: 'Numbers 1 to 10',
    emoji: '🔢',
    color: '#EF4444',
    questions: [
      {
        id: 'q1', type: 'count',
        question: 'How many cats are there?',
        emoji: '🐱',
        count: 7,
        options: ['5', '6', '7', '8'],
        answer: '7',
      },
      {
        id: 'q2', type: 'mcq',
        question: 'What comes after 6?',
        options: [
          { id: '7', label: '7', correct: true  },
          { id: '5', label: '5', correct: false },
          { id: '8', label: '8', correct: false },
          { id: '9', label: '9', correct: false },
        ],
      },
      {
        id: 'q3', type: 'count',
        question: 'How many suns are there?',
        emoji: '☀️',
        count: 4,
        options: ['3', '4', '5', '6'],
        answer: '4',
      },
      {
        id: 'q4', type: 'truefalse',
        question: '9 is greater than 6.',
        answer: true,
        hint: '9 comes after 6!',
      },
      {
        id: 'q5', type: 'mcq',
        question: 'What comes before 5?',
        options: [
          { id: '4', label: '4', correct: true  },
          { id: '6', label: '6', correct: false },
          { id: '3', label: '3', correct: false },
          { id: '7', label: '7', correct: false },
        ],
      },
      {
        id: 'q6', type: 'count',
        question: 'How many hearts are there?',
        emoji: '❤️',
        count: 9,
        options: ['7', '8', '9', '10'],
        answer: '9',
      },
      {
        id: 'q7', type: 'mcq',
        question: 'Which is the smallest number?',
        options: [
          { id: '1', label: '1', correct: true  },
          { id: '5', label: '5', correct: false },
          { id: '8', label: '8', correct: false },
          { id: '3', label: '3', correct: false },
        ],
      },
      {
        id: 'q8', type: 'count',
        question: 'How many trees are there?',
        emoji: '🌳',
        count: 10,
        options: ['8', '9', '10', '11'],
        answer: '10',
      },
      {
        id: 'q9', type: 'truefalse',
        question: '3 + 2 = 5.',
        answer: true,
        hint: 'Count 3 fingers and 2 more!',
      },
      {
        id: 'q10', type: 'mcq',
        question: '4 + 1 = ___',
        options: [
          { id: '5', label: '5', correct: true  },
          { id: '4', label: '4', correct: false },
          { id: '6', label: '6', correct: false },
          { id: '3', label: '3', correct: false },
        ],
      },
    ],
  },
  {
    id: 'nym_02',
    title: 'Addition Sums',
    emoji: '➕',
    color: '#06B6D4',
    questions: [
      {
        id: 'q1', type: 'mcq',
        question: '1 + 1 = ___',
        options: [
          { id: '2', label: '2', correct: true  },
          { id: '1', label: '1', correct: false },
          { id: '3', label: '3', correct: false },
          { id: '4', label: '4', correct: false },
        ],
      },
      {
        id: 'q2', type: 'mcq',
        question: '2 + 2 = ___',
        options: [
          { id: '4', label: '4', correct: true  },
          { id: '3', label: '3', correct: false },
          { id: '5', label: '5', correct: false },
          { id: '2', label: '2', correct: false },
        ],
      },
      {
        id: 'q3', type: 'count',
        question: '3 apples + 1 apple = how many? 🍎🍎🍎 + 🍎',
        emoji: '🍎',
        count: 4,
        options: ['3', '4', '5', '6'],
        answer: '4',
      },
      {
        id: 'q4', type: 'mcq',
        question: '3 + 3 = ___',
        options: [
          { id: '6', label: '6', correct: true  },
          { id: '5', label: '5', correct: false },
          { id: '7', label: '7', correct: false },
          { id: '4', label: '4', correct: false },
        ],
      },
      {
        id: 'q5', type: 'truefalse',
        question: '2 + 3 = 5.',
        answer: true,
        hint: 'Count 2 then 3 more!',
      },
      {
        id: 'q6', type: 'mcq',
        question: '4 + 2 = ___',
        options: [
          { id: '6', label: '6', correct: true  },
          { id: '5', label: '5', correct: false },
          { id: '7', label: '7', correct: false },
          { id: '8', label: '8', correct: false },
        ],
      },
      {
        id: 'q7', type: 'mcq',
        question: '5 + 1 = ___',
        options: [
          { id: '6', label: '6', correct: true  },
          { id: '5', label: '5', correct: false },
          { id: '7', label: '7', correct: false },
          { id: '4', label: '4', correct: false },
        ],
      },
      {
        id: 'q8', type: 'count',
        question: '2 stars + 3 stars = how many? ⭐⭐ + ⭐⭐⭐',
        emoji: '⭐',
        count: 5,
        options: ['4', '5', '6', '7'],
        answer: '5',
      },
      {
        id: 'q9', type: 'truefalse',
        question: '3 + 4 = 7.',
        answer: true,
        hint: 'Count 3 then add 4 more!',
      },
      {
        id: 'q10', type: 'mcq',
        question: '5 + 5 = ___',
        options: [
          { id: '10', label: '10', correct: true  },
          { id: '9',  label: '9',  correct: false },
          { id: '8',  label: '8',  correct: false },
          { id: '11', label: '11', correct: false },
        ],
      },
    ],
  },
  {
    id: 'nym_03',
    title: 'More or Less',
    emoji: '⚖️',
    color: '#84CC16',
    questions: [
      {
        id: 'q1', type: 'mcq',
        question: 'Which is more — 3 or 7?',
        options: [
          { id: '7', label: '7', correct: true  },
          { id: '3', label: '3', correct: false },
          { id: '5', label: '5', correct: false },
          { id: '1', label: '1', correct: false },
        ],
      },
      {
        id: 'q2', type: 'count',
        question: 'How many fish do you see?',
        emoji: '🐟',
        count: 6,
        options: ['4', '5', '6', '7'],
        answer: '6',
      },
      {
        id: 'q3', type: 'truefalse',
        question: '8 is more than 5.',
        answer: true,
        hint: '8 comes after 5!',
      },
      {
        id: 'q4', type: 'mcq',
        question: 'Which is less — 4 or 9?',
        options: [
          { id: '4', label: '4', correct: true  },
          { id: '9', label: '9', correct: false },
          { id: '6', label: '6', correct: false },
          { id: '8', label: '8', correct: false },
        ],
      },
      {
        id: 'q5', type: 'truefalse',
        question: '2 is less than 10.',
        answer: true,
        hint: '2 is a small number!',
      },
      {
        id: 'q6', type: 'mcq',
        question: 'Which number comes between 4 and 6?',
        options: [
          { id: '5', label: '5', correct: true  },
          { id: '3', label: '3', correct: false },
          { id: '7', label: '7', correct: false },
          { id: '2', label: '2', correct: false },
        ],
      },
      {
        id: 'q7', type: 'count',
        question: 'How many moons?',
        emoji: '🌙',
        count: 8,
        options: ['6', '7', '8', '9'],
        answer: '8',
      },
      {
        id: 'q8', type: 'mcq',
        question: 'Which is more — 10 or 2?',
        options: [
          { id: '10', label: '10', correct: true  },
          { id: '2',  label: '2',  correct: false },
          { id: '5',  label: '5',  correct: false },
          { id: '7',  label: '7',  correct: false },
        ],
      },
      {
        id: 'q9', type: 'truefalse',
        question: '6 is between 5 and 7.',
        answer: true,
        hint: '5, 6, 7 — count them!',
      },
      {
        id: 'q10', type: 'mcq',
        question: 'What comes after 9?',
        options: [
          { id: '10', label: '10', correct: true  },
          { id: '8',  label: '8',  correct: false },
          { id: '11', label: '11', correct: false },
          { id: '7',  label: '7',  correct: false },
        ],
      },
    ],
  },
];

// ─── NEW TYPES: circle_letter & match ────────────────────────────────────────
//
//  circle_letter : show a big emoji, child picks the correct starting letter
//                  { type:'circle_letter', emoji, word, options:[{id,label,correct}] }
//
//  match         : two columns — tap left item then tap its right pair
//                  { type:'match', pairs:[{left,right}] }
//                  left  : { id, label, emoji? }
//                  right : { id, label, emoji? }

const preNurseryCircleLetters = {
  id: 'pne_04',
  title: 'Circle the Letter',
  emoji: '🔵',
  color: '#0EA5E9',
  questions: [
    {
      id: 'q1', type: 'circle_letter',
      question: 'What letter does 🍎 Apple start with?',
      emoji: '🍎', word: 'Apple',
      options: [
        { id: 'A', label: 'A', correct: true  },
        { id: 'B', label: 'B', correct: false },
        { id: 'C', label: 'C', correct: false },
        { id: 'D', label: 'D', correct: false },
      ],
    },
    {
      id: 'q2', type: 'circle_letter',
      question: 'What letter does 🐶 Dog start with?',
      emoji: '🐶', word: 'Dog',
      options: [
        { id: 'D', label: 'D', correct: true  },
        { id: 'A', label: 'A', correct: false },
        { id: 'C', label: 'C', correct: false },
        { id: 'E', label: 'E', correct: false },
      ],
    },
    {
      id: 'q3', type: 'circle_letter',
      question: 'What letter does 🐱 Cat start with?',
      emoji: '🐱', word: 'Cat',
      options: [
        { id: 'C', label: 'C', correct: true  },
        { id: 'A', label: 'A', correct: false },
        { id: 'B', label: 'B', correct: false },
        { id: 'D', label: 'D', correct: false },
      ],
    },
    {
      id: 'q4', type: 'circle_letter',
      question: 'What letter does 🐘 Elephant start with?',
      emoji: '🐘', word: 'Elephant',
      options: [
        { id: 'E', label: 'E', correct: true  },
        { id: 'A', label: 'A', correct: false },
        { id: 'F', label: 'F', correct: false },
        { id: 'D', label: 'D', correct: false },
      ],
    },
    {
      id: 'q5', type: 'circle_letter',
      question: 'What letter does ⚽ Ball start with?',
      emoji: '⚽', word: 'Ball',
      options: [
        { id: 'B', label: 'B', correct: true  },
        { id: 'A', label: 'A', correct: false },
        { id: 'C', label: 'C', correct: false },
        { id: 'D', label: 'D', correct: false },
      ],
    },
    {
      id: 'q6', type: 'circle_letter',
      question: 'What letter does ☀️ Sun start with?',
      emoji: '☀️', word: 'Sun',
      options: [
        { id: 'S', label: 'S', correct: true  },
        { id: 'T', label: 'T', correct: false },
        { id: 'R', label: 'R', correct: false },
        { id: 'M', label: 'M', correct: false },
      ],
    },
    {
      id: 'q7', type: 'circle_letter',
      question: 'What letter does 🌸 Flower start with?',
      emoji: '🌸', word: 'Flower',
      options: [
        { id: 'F', label: 'F', correct: true  },
        { id: 'B', label: 'B', correct: false },
        { id: 'G', label: 'G', correct: false },
        { id: 'H', label: 'H', correct: false },
      ],
    },
    {
      id: 'q8', type: 'circle_letter',
      question: 'What letter does 🐟 Fish start with?',
      emoji: '🐟', word: 'Fish',
      options: [
        { id: 'F', label: 'F', correct: true  },
        { id: 'D', label: 'D', correct: false },
        { id: 'G', label: 'G', correct: false },
        { id: 'E', label: 'E', correct: false },
      ],
    },
  ],
};

const preNurseryMatchAnimals = {
  id: 'pne_05',
  title: 'Match the Animal',
  emoji: '🔗',
  color: '#F59E0B',
  questions: [
    {
      id: 'q1', type: 'match',
      question: 'Match the animal to its sound!',
      pairs: [
        { left: { id: 'cow',  label: 'Cow',  emoji: '🐮' }, right: { id: 'moo',  label: 'Moo',  emoji: '🔊' } },
        { left: { id: 'dog',  label: 'Dog',  emoji: '🐶' }, right: { id: 'woof', label: 'Woof', emoji: '🔊' } },
        { left: { id: 'cat',  label: 'Cat',  emoji: '🐱' }, right: { id: 'meow', label: 'Meow', emoji: '🔊' } },
        { left: { id: 'duck', label: 'Duck', emoji: '🦆' }, right: { id: 'quack',label: 'Quack',emoji: '🔊' } },
      ],
    },
    {
      id: 'q2', type: 'match',
      question: 'Match the animal to where it lives!',
      pairs: [
        { left: { id: 'fish',  label: 'Fish',  emoji: '🐟' }, right: { id: 'water', label: 'Water', emoji: '💧' } },
        { left: { id: 'bird',  label: 'Bird',  emoji: '🐦' }, right: { id: 'sky',   label: 'Sky',   emoji: '☁️' } },
        { left: { id: 'lion',  label: 'Lion',  emoji: '🦁' }, right: { id: 'jungle',label: 'Jungle',emoji: '🌳' } },
        { left: { id: 'horse', label: 'Horse', emoji: '🐴' }, right: { id: 'farm',  label: 'Farm',  emoji: '🏡' } },
      ],
    },
    {
      id: 'q3', type: 'match',
      question: 'Match the fruit to its colour!',
      pairs: [
        { left: { id: 'apple',    label: 'Apple',    emoji: '🍎' }, right: { id: 'red',    label: 'Red',    emoji: '🔴' } },
        { left: { id: 'banana',   label: 'Banana',   emoji: '🍌' }, right: { id: 'yellow', label: 'Yellow', emoji: '🟡' } },
        { left: { id: 'grapes',   label: 'Grapes',   emoji: '🍇' }, right: { id: 'purple', label: 'Purple', emoji: '🟣' } },
        { left: { id: 'orange',   label: 'Orange',   emoji: '🍊' }, right: { id: 'orange_c',label:'Orange', emoji: '🟠' } },
      ],
    },
    {
      id: 'q4', type: 'match',
      question: 'Match the shape to its name!',
      pairs: [
        { left: { id: 'circle_s',   label: '⭕', emoji: '⭕' }, right: { id: 'circle_l',   label: 'Circle',    emoji: '' } },
        { left: { id: 'triangle_s', label: '🔺', emoji: '🔺' }, right: { id: 'triangle_l', label: 'Triangle',  emoji: '' } },
        { left: { id: 'square_s',   label: '⬛', emoji: '⬛' }, right: { id: 'square_l',   label: 'Square',    emoji: '' } },
        { left: { id: 'star_s',     label: '⭐', emoji: '⭐' }, right: { id: 'star_l',     label: 'Star',      emoji: '' } },
      ],
    },
    {
      id: 'q5', type: 'match',
      question: 'Match the number to the objects!',
      pairs: [
        { left: { id: 'one',   label: '1️⃣', emoji: '1️⃣' }, right: { id: 'one_e',   label: '🌟',          emoji: '🌟' } },
        { left: { id: 'two',   label: '2️⃣', emoji: '2️⃣' }, right: { id: 'two_e',   label: '🌟🌟',        emoji: '🌟🌟' } },
        { left: { id: 'three', label: '3️⃣', emoji: '3️⃣' }, right: { id: 'three_e', label: '🌟🌟🌟',      emoji: '🌟🌟🌟' } },
        { left: { id: 'four',  label: '4️⃣', emoji: '4️⃣' }, right: { id: 'four_e',  label: '🌟🌟🌟🌟',    emoji: '🌟🌟🌟🌟' } },
      ],
    },
  ],
};

const nurseryCircleLetters = {
  id: 'nye_04',
  title: 'Circle the Letter',
  emoji: '🔵',
  color: '#0EA5E9',
  questions: [
    {
      id: 'q1', type: 'circle_letter',
      question: 'What letter does 🐒 Monkey start with?',
      emoji: '🐒', word: 'Monkey',
      options: [
        { id: 'M', label: 'M', correct: true  },
        { id: 'N', label: 'N', correct: false },
        { id: 'K', label: 'K', correct: false },
        { id: 'P', label: 'P', correct: false },
      ],
    },
    {
      id: 'q2', type: 'circle_letter',
      question: 'What letter does 🦁 Lion start with?',
      emoji: '🦁', word: 'Lion',
      options: [
        { id: 'L', label: 'L', correct: true  },
        { id: 'M', label: 'M', correct: false },
        { id: 'K', label: 'K', correct: false },
        { id: 'N', label: 'N', correct: false },
      ],
    },
    {
      id: 'q3', type: 'circle_letter',
      question: 'What letter does 🐯 Tiger start with?',
      emoji: '🐯', word: 'Tiger',
      options: [
        { id: 'T', label: 'T', correct: true  },
        { id: 'S', label: 'S', correct: false },
        { id: 'R', label: 'R', correct: false },
        { id: 'U', label: 'U', correct: false },
      ],
    },
    {
      id: 'q4', type: 'circle_letter',
      question: 'What letter does 🐘 Elephant start with?',
      emoji: '🐘', word: 'Elephant',
      options: [
        { id: 'E', label: 'E', correct: true  },
        { id: 'A', label: 'A', correct: false },
        { id: 'I', label: 'I', correct: false },
        { id: 'O', label: 'O', correct: false },
      ],
    },
    {
      id: 'q5', type: 'circle_letter',
      question: 'What letter does 🍇 Grapes start with?',
      emoji: '🍇', word: 'Grapes',
      options: [
        { id: 'G', label: 'G', correct: true  },
        { id: 'F', label: 'F', correct: false },
        { id: 'H', label: 'H', correct: false },
        { id: 'J', label: 'J', correct: false },
      ],
    },
    {
      id: 'q6', type: 'circle_letter',
      question: 'What letter does 🏠 House start with?',
      emoji: '🏠', word: 'House',
      options: [
        { id: 'H', label: 'H', correct: true  },
        { id: 'G', label: 'G', correct: false },
        { id: 'I', label: 'I', correct: false },
        { id: 'J', label: 'J', correct: false },
      ],
    },
    {
      id: 'q7', type: 'circle_letter',
      question: 'What letter does 🐸 Frog start with?',
      emoji: '🐸', word: 'Frog',
      options: [
        { id: 'F', label: 'F', correct: true  },
        { id: 'E', label: 'E', correct: false },
        { id: 'G', label: 'G', correct: false },
        { id: 'R', label: 'R', correct: false },
      ],
    },
    {
      id: 'q8', type: 'circle_letter',
      question: 'What letter does 🌈 Rainbow start with?',
      emoji: '🌈', word: 'Rainbow',
      options: [
        { id: 'R', label: 'R', correct: true  },
        { id: 'P', label: 'P', correct: false },
        { id: 'S', label: 'S', correct: false },
        { id: 'Q', label: 'Q', correct: false },
      ],
    },
    {
      id: 'q9', type: 'circle_letter',
      question: 'What letter does 🦋 Butterfly start with?',
      emoji: '🦋', word: 'Butterfly',
      options: [
        { id: 'B', label: 'B', correct: true  },
        { id: 'D', label: 'D', correct: false },
        { id: 'F', label: 'F', correct: false },
        { id: 'P', label: 'P', correct: false },
      ],
    },
    {
      id: 'q10', type: 'circle_letter',
      question: 'What letter does 🐊 Crocodile start with?',
      emoji: '🐊', word: 'Crocodile',
      options: [
        { id: 'C', label: 'C', correct: true  },
        { id: 'D', label: 'D', correct: false },
        { id: 'K', label: 'K', correct: false },
        { id: 'G', label: 'G', correct: false },
      ],
    },
  ],
};

const nurseryMatchSimilar = {
  id: 'nym_04',
  title: 'Match the Similar',
  emoji: '🔗',
  color: '#8B5CF6',
  questions: [
    {
      id: 'q1', type: 'match',
      question: 'Match uppercase to lowercase letters!',
      pairs: [
        { left: { id: 'A_up', label: 'A', emoji: 'A' }, right: { id: 'a_lo', label: 'a', emoji: 'a' } },
        { left: { id: 'B_up', label: 'B', emoji: 'B' }, right: { id: 'b_lo', label: 'b', emoji: 'b' } },
        { left: { id: 'C_up', label: 'C', emoji: 'C' }, right: { id: 'c_lo', label: 'c', emoji: 'c' } },
        { left: { id: 'D_up', label: 'D', emoji: 'D' }, right: { id: 'd_lo', label: 'd', emoji: 'd' } },
      ],
    },
    {
      id: 'q2', type: 'match',
      question: 'Match uppercase to lowercase letters!',
      pairs: [
        { left: { id: 'E_up', label: 'E', emoji: 'E' }, right: { id: 'e_lo', label: 'e', emoji: 'e' } },
        { left: { id: 'F_up', label: 'F', emoji: 'F' }, right: { id: 'f_lo', label: 'f', emoji: 'f' } },
        { left: { id: 'G_up', label: 'G', emoji: 'G' }, right: { id: 'g_lo', label: 'g', emoji: 'g' } },
        { left: { id: 'H_up', label: 'H', emoji: 'H' }, right: { id: 'h_lo', label: 'h', emoji: 'h' } },
      ],
    },
    {
      id: 'q3', type: 'match',
      question: 'Match the animal to its baby!',
      pairs: [
        { left: { id: 'cow_p',  label: 'Cow',  emoji: '🐮' }, right: { id: 'calf',   label: 'Calf',   emoji: '🐄' } },
        { left: { id: 'dog_p',  label: 'Dog',  emoji: '🐶' }, right: { id: 'puppy',  label: 'Puppy',  emoji: '🐕' } },
        { left: { id: 'cat_p',  label: 'Cat',  emoji: '🐱' }, right: { id: 'kitten', label: 'Kitten', emoji: '🐈' } },
        { left: { id: 'bird_p', label: 'Bird', emoji: '🐦' }, right: { id: 'chick',  label: 'Chick',  emoji: '🐣' } },
      ],
    },
    {
      id: 'q4', type: 'match',
      question: 'Match the number word to its numeral!',
      pairs: [
        { left: { id: 'one_w',   label: 'One',   emoji: 'One'   }, right: { id: '1_n', label: '1', emoji: '1' } },
        { left: { id: 'two_w',   label: 'Two',   emoji: 'Two'   }, right: { id: '2_n', label: '2', emoji: '2' } },
        { left: { id: 'three_w', label: 'Three', emoji: 'Three' }, right: { id: '3_n', label: '3', emoji: '3' } },
        { left: { id: 'four_w',  label: 'Four',  emoji: 'Four'  }, right: { id: '4_n', label: '4', emoji: '4' } },
      ],
    },
    {
      id: 'q5', type: 'match',
      question: 'Match the opposite pairs!',
      pairs: [
        { left: { id: 'big_w',   label: 'Big',   emoji: '🐘' }, right: { id: 'small_w', label: 'Small', emoji: '🐭' } },
        { left: { id: 'hot_w',   label: 'Hot',   emoji: '🔥' }, right: { id: 'cold_w',  label: 'Cold',  emoji: '🧊' } },
        { left: { id: 'day_w',   label: 'Day',   emoji: '☀️' }, right: { id: 'night_w', label: 'Night', emoji: '🌙' } },
        { left: { id: 'happy_w', label: 'Happy', emoji: '😊' }, right: { id: 'sad_w',   label: 'Sad',   emoji: '😢' } },
      ],
    },
  ],
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const WORKSHEET_LEVELS = [
  {
    id: 'pre_nursery',
    label: 'Pre-Nursery',
    marathiLabel: 'पूर्व नर्सरी',
    emoji: '🌱',
    color: '#F97316',
    ageRange: 'Age 2.5 – 3.5',
    subjects: [
      {
        id: 'english',
        label: 'English',
        marathiLabel: 'इंग्रजी',
        emoji: '📖',
        color: '#7C3AED',
        sheets: [...preNurseryEnglish, preNurseryCircleLetters, preNurseryMatchAnimals],
      },
      {
        id: 'maths',
        label: 'Maths',
        marathiLabel: 'गणित',
        emoji: '🔢',
        color: '#EF4444',
        sheets: preNurseryMaths,
      },
    ],
  },
  {
    id: 'nursery',
    label: 'Nursery',
    marathiLabel: 'नर्सरी',
    emoji: '🌿',
    color: '#10B981',
    ageRange: 'Age 3.5 – 4.5',
    subjects: [
      {
        id: 'english',
        label: 'English',
        marathiLabel: 'इंग्रजी',
        emoji: '📖',
        color: '#7C3AED',
        sheets: [...nurseryEnglish, nurseryCircleLetters],
      },
      {
        id: 'maths',
        label: 'Maths',
        marathiLabel: 'गणित',
        emoji: '🔢',
        color: '#EF4444',
        sheets: [...nurseryMaths, nurseryMatchSimilar],
      },
    ],
  },
];
