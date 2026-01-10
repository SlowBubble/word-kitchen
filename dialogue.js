
// export class Dialogue {
//   constructor() {
//   }
// }

const wantSpace = 'Please press the space-bar.';

export const introDialogue = {
  speech: 'Hello there!',
  display: 'Hello!',
  stop: true,
}

export const outroDialogue = {
  speech: 'Game time is over. Go take a break.',
  display: 'Game Over :(',
  stop: true,
  expectedKey: 'unreachable',
  speechForUnexpectedKey: 'Game time is over. Go take a break.',
}

export function buildDialogues(word, level=1, addWelcomeMessage=false) {
  let welcomeMessage = '';
  if (addWelcomeMessage) {
    const name = 'Word Kitchen';
    welcomeMessage = `Welcome to ${name}! Let's get started.`;
  }
  let dialogues = [];
  if (level < 3) {
    dialogues = [
    {
      speech: 'What is this?',
      stop: true,
      display: word,
      voiceIdx: 0,
    },
    {
      speech: word,
      stop: false,
      display: word,
      voiceIdx: 1,
      startHighlightIdx: 0,
      endHighlightIdx: word.length,
      delayMs: 1000,
    }];
  }
  if (level <= 1) {
    return dialogues;
  }

  const chars = word.split('');

  if (level === 2) {
    dialogues.push(
      {
        speech:  `How do you spell, ${word}?`,
        stop: true,
        display: word,
        voiceIdx: 0,
      });
    chars.forEach((char, idx) => dialogues.push({
      speech: char === ' ' ? 'space' : char.toLowerCase(),
      stop: false,
      startHighlightIdx: idx,
      endHighlightIdx: idx,
        display: word,
        voiceIdx: 1,
        delayMs: 500,
    }));
    dialogues.push({
      speech: word,
      stop: true,
      display: word,
      voiceIdx: 1,
      startHighlightIdx: 0,
      endHighlightIdx: word.length,
    })
    return dialogues;
  }

  if (level == 3) {
    dialogues.push({
      speech:  `${welcomeMessage} How do you type, ${word}?`,
      stop: false,
        display: word,
        voiceIdx: 0,
    });
    chars.forEach((char, idx) => dialogues.push({
      speech: idx === 0 ? '' : (chars[idx - 1] === ' ' ? 'space' : chars[idx - 1].toLowerCase()),
      stop: true,
      expectedKey: char.toLowerCase(),
      speechForUnexpectedKey: `Try typing, ${char === ' ' ? 'space' : char.toLowerCase()}.`,
      startHighlightIdx: idx,
      endHighlightIdx: idx,
      display: word,
        voiceIdx: 1,
        renderAfterUttering: true,
    }));
    dialogues.push({
      speech: `${chars[chars.length - 1] === ' ' ? 'space' : chars[chars.length - 1].toLowerCase()}.`,
      display: word,
      voiceIdx: 1,
      renderAfterUttering: true,
      delayMs: 500,
    });
  }
  if (level == 4) {
    dialogues.push({
      speech:  `How do you type, ${word}?`,
      stop: false,
        display: word,
        voiceIdx: 0,
    });
    chars.forEach((char, idx) => dialogues.push({
      speech: idx === 0 ? '' : (chars[idx - 1] === ' ' ? 'space' : chars[idx - 1].toLowerCase()),
      stop: true,
      expectedKey: char.toLowerCase(),
      speechForUnexpectedKey: word.toLowerCase(),
      startHighlightIdx: idx,
      endHighlightIdx: idx,
      display: word,
        voiceIdx: 1,
        renderAfterUttering: true,
    }));
    dialogues.push({
      speech: `${chars[chars.length - 1] === ' ' ? 'space' : chars[chars.length - 1].toLowerCase()}.`,
      display: word,
      voiceIdx: 1,
      renderAfterUttering: true,
      delayMs: 500,
    });
  }
  dialogues.push({
    speech: generateExlamation(),
    display: `🎊 ${word} 🎊`,
    voiceIdx: 0,
    speechRate: 0.4,
    delayMs: 400,
  });
  dialogues.push({
    speech: generateRandomPraise(word),
    display: `🎊 ${word} 🎊`,
    voiceIdx: 0,
    delayMs: 500,
  });

  return dialogues;
}

function generateExlamation() {
const exclamations = [
    'Bless my soul! ',
    'Bless my beard! ',
    'Bless my eye brows! ',
    'God bless the next generation! ',
    'God bless the internet! ',
    'God bless the world wide web! ',
    'Amazing effort! ',
    'What an effort! ',
    'I cannot commend you enough for your dedication! ',
    'No words can do justice to your work ethic! ',
    'Hard work really works! ',
    'Persistent practice really pays! ',
    'Practice really makes possible! ',
    'Mamma Mia! ',
    'Ay caramba! ',
    'Jesus! ',
    'Jesus Christ! ',
    'Oh, snap! ',
    'My god! ',
    'Holy Moly! ',
    'Woo Hoo! ',
    'Am I in a dream? ',
    'Is this real? ',
    'This is surreal! ',
    'Are my eyes fooling me? ',
    'How did you do that? ',
    'Did you hear my jaw dropping! ',
    'I am getting jealous! ',
    'I am speechless! ',
    'I do not know what to say! ',
    'That is so cool! ',
    'What have I just witnessed? ',
    'Brilliant achievement! ',
    'Astounding feat! ',
    'Fabulous job! ',
    'Fantastic work! ',
    'Oh my god! ',
    'Oh my lord! ',
    'My goodness! ',
    'Goodness gracious! ',
    'Well done! ',
    'Way to go! ',
    'Awesome work! ',
    'Great job! ',
  ];
  return exclamations[getRandomInt(exclamations.length)];

}
function generateRandomPraise(word) {
  const adjectives = [
    'accomplished',
    'consistent',
    'proficient',
    'clutch',
    'capable',
    'experienced',
    'competent',
    'masterful',
    'effective',
    'efficient',
    'precise',
    'accurate',
    'skilled',
    'skillful',
    'qualified',
    'professional',
    'well-versed',
    'high-caliber',
    'elite',
    'solid',
    'savvy',
    'polished',
    'sharp',
    'formidable',
  ];

  const adverbs = [
    '',
    'really',
    'really, really',
    'really, really, really',
    'really, really, really, really',
    'very',
    'extremely',
    'tremendously',
    'staggeringly',
    'significantly',
    'exceedingly',
    'highly',
    'unbelievably',
    'supremely',
    'superbly',
    'unimaginably',
    'more',
    'more and more',
    'expertly',
    'exceptionally',
    'marvelously',
    'admirably',
    'undeniably',
    'unquestionably',
    'indisputably',
    'incontrovertibly',
    'inarguably',
    'incredibly',
    'amazingly',
    'shockingly',
    'startlingly',
    'stunningly',
    'astoundingly',
    'astonishingly',
    'remarkably',
    'spectacularly',
    'extraordinarily',
    'mind-blowingly',
  ];
  const adjIndex = getRandomInt(adjectives.length);
  const adjective = adjectives[adjIndex];
  const adverb = adverbs[getRandomInt(adverbs.length)];
  return `You are getting ${adverb} ${adjective}, at typing the word, ${word}`;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}