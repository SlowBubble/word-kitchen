
// export class Dialogue {
//   constructor() {
//   }
// }

const wantSpace = 'Please press the space-bar.';

export const introDialogue = {
  speech: 'Hello there!',
  display: 'Hello!',
  stop: true,
  expectedKey: ' ',
  speechForUnexpectedKey: wantSpace,
}

export const outroDialogue = {
  speech: 'Game time is over. Go take a break.',
  display: 'Game Over :(',
  stop: true,
  expectedKey: '',
  speechForUnexpectedKey: 'Game time is over. Go take a break.',
}

export function buildDialogues(word, level=1) {
  const dialogues = [
    {
      speech: 'What is this?',
      stop: true,
      expectedKey: ' ',
      speechForUnexpectedKey: wantSpace,
      display: word,
      voiceIdx: 0,
    },
    {
      speech: word,
      stop: true,
      expectedKey: ' ',
      speechForUnexpectedKey: wantSpace,
      display: word,
      voiceIdx: 1,
      startHighlightIdx: 0,
      endHighlightIdx: word.length,
    }];
  if (level <= 1) {
    return dialogues;
  }

  const chars = word.split('');

  if (level === 2) {
    dialogues.push(
      {
        speech:  `How do you spell, ${word}?`,
        stop: true,
        expectedKey: ' ',
        speechForUnexpectedKey: wantSpace,
        display: word,
        voiceIdx: 0,
      });
    chars.forEach((char, idx) => dialogues.push({
      speech: char.toLowerCase(),
      stop: false,
      expectedKey: ' ',
      speechForUnexpectedKey: wantSpace,
      startHighlightIdx: idx,
      endHighlightIdx: idx,
        display: word,
        voiceIdx: 1,
        delayMs: 500,
    }));
    dialogues.push({
      speech: word,
      stop: true,
      expectedKey: ' ',
      speechForUnexpectedKey: wantSpace,
      display: word,
      voiceIdx: 1,
      startHighlightIdx: 0,
      endHighlightIdx: word.length,
    })
    return dialogues;
  }

  dialogues.push({
    speech:  `How do you type, ${word}?`,
    stop: false,
      display: word,
      voiceIdx: 0,
  });
  chars.forEach((char, idx) => dialogues.push({
    speech: idx === 0 ? '' : chars[idx - 1].toLowerCase(),
    stop: true,
    expectedKey: char.toLowerCase(),
    speechForUnexpectedKey: `Wrong letter. Try typing ${char.toLowerCase()}.`,
    startHighlightIdx: idx,
    endHighlightIdx: idx,
    display: word,
      voiceIdx: 1,
      renderAfterUttering: true,
  }));
  dialogues.push({
    speech: `${chars[chars.length - 1].toLowerCase()}.`,
    expectedKey: ' ',
    speechForUnexpectedKey: wantSpace,
    display: word,
    voiceIdx: 1,
    renderAfterUttering: true,
    delayMs: 1000,
  });
  dialogues.push({
    speech: `Wow, you can type the word, ${word}. Amazing job.`,
    expectedKey: ' ',
    speechForUnexpectedKey: wantSpace,
    display: '🎊',
    voiceIdx: 0,
    delayMs: 500,
  });

  return dialogues;
}